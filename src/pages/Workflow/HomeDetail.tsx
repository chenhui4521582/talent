import React, { useState, useEffect, useMemo } from 'react';
import {
  wfFormDetail,
  tsWfFormDetail,
  tsFormChildlist,
  getUnitType,
  saveTaskForm,
} from './services/home';
import {
  getAvailableTime,
  archiveReplaceCardNumber,
  vacationTime,
  overTime,
  getOutCheckTime,
} from './services/detail';

import { GlobalResParams } from '@/types/ITypes';
import {
  Card,
  Descriptions,
  Button,
  Form,
  notification,
  Table,
  message,
  Spin,
} from 'antd';
import moment from 'moment';
import Temp from './Component';
import update from 'immutability-helper';
import './style/home.less';

interface IUnitList {
  code: number;
  desc: string;
}

export default props => {
  const formId = props.match.params.id;

  const [formList, setFormList] = useState<tsFormChildlist[]>([]);
  const [title, setTitle] = useState<string | null>('');
  const [mount, setMount] = useState<Boolean>(false);
  const [idItemList, setIdItemList] = useState<any[]>([]);
  const [userCode, setUserCode] = useState<string | undefined>(undefined);
  const [unitList, steUnitList] = useState<IUnitList[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  useEffect(() => {
    getFrom();
  }, []);
  const getFrom = async () => {
    let idItem: any = [];
    let applyUser: any = undefined;
    let remainCardNumberId: any = undefined;
    let time: any = undefined;
    let json: GlobalResParams<tsWfFormDetail> = await wfFormDetail(formId);
    let json1: GlobalResParams<IUnitList[]> = await getUnitType();
    if (json1.status === 200) {
      steUnitList(json1?.obj);
    }

    if (json.status === 200) {
      setMount(true);
      let obj = json.obj || {};
      let formChildlist = obj.formChildlist || [];
      let groupList = obj.groupList || [];
      let data: any = [];
      for (let k = 0; k < formChildlist.length; k++) {
        let fromItem = formChildlist[k];
        let controlList = fromItem.controlList;
        if (fromItem.type !== 1) {
          idItem = idItem.concat(controlList);
        }
        data[k] = fromItem;
        data[k].list = [];
        data[k].arr = [];
        data[k].groupColArr = [];
        if (groupList.length) {
          for (let i = 0; i < groupList.length; i++) {
            let sort = 0;
            let groupItem = groupList[i];
            let list: any = [];
            for (let g = 0; g < controlList.length; g++) {
              if (groupItem.id === controlList[g].resGroupId) {
                sort += controlList[g].sort;
                data[k].groupColArr.push(formChildlist[k].controlList[g].id);
                list.push(controlList[g]);
                groupItem.list = list;
                groupItem.sort = sort;
                data[k].list.push(groupItem);
                data[k].list.sort(compare('sort'));
              }
              if (
                data[k].arr.indexOf(formChildlist[k].controlList[g].id) ===
                  -1 &&
                data[k].groupColArr.indexOf(
                  formChildlist[k].controlList[g].id,
                ) === -1 &&
                i === groupList.length - 1
              ) {
                data[k].arr.push(formChildlist[k].controlList[g].id);
                data[k].list.push(controlList[g]);
              }
            }
            data[k].list = [...new Set(data[k].list)];
          }
        } else {
          data[k].list = controlList;
        }
      }
      setIdItemList(idItem);
      setTitle(obj.name);
      setFormList(data);
      let vacationTimeId: any = undefined;
      idItem.map(item => {
        if (item.baseControlType === 'currUser') {
          applyUser = item;
        }
        if (item.baseControlType === 'vacationTime') {
          vacationTimeId = item.id;
        }
        if (item.baseControlType === 'remainCardNumber') {
          remainCardNumberId = item.id;
        }
        if (item.baseControlType === 'currDate') {
          time = item.defaultValue;
        }
      });

      if (vacationTimeId) {
        let json1: GlobalResParams<any> = await getAvailableTime({
          userCode: applyUser?.defaultValue,
        });
        if (json1.status === 200) {
          let obj = {};
          obj[vacationTimeId] = json1.obj?.currentLeft + '天';
          form.setFieldsValue(obj);
        }
      }
      if (remainCardNumberId) {
        let json1: GlobalResParams<any> = await archiveReplaceCardNumber({
          userCode: applyUser?.defaultValue,
        });
        if (json1.status === 200) {
          let obj = {};
          obj[remainCardNumberId] = json1.obj?.surplus + '次';
          form.setFieldsValue(obj);
        }
      }
      setUserCode(applyUser?.defaultValue);
    }
  };

  const compare = (name: string) => {
    return (a, b) => {
      let v1 = a[name];
      let v2 = b[name];
      if (v2 > v1) {
        return -1;
      } else if (v2 < v1) {
        return 1;
      } else {
        return 0;
      }
    };
  };

  const handleValue = item => {
    const {
      baseControlType,
      defaultValue: value,
      defaultShowValue: showValue,
    } = item;
    if (
      baseControlType === 'department' ||
      baseControlType === 'business' ||
      baseControlType === 'business2' ||
      baseControlType === 'currBusiness2' ||
      baseControlType === 'labor' ||
      baseControlType === 'cost' ||
      baseControlType === 'company' ||
      baseControlType === 'position' ||
      baseControlType === 'job' ||
      baseControlType === 'positionLevel' ||
      baseControlType === 'positionMLevel' ||
      baseControlType === 'user' ||
      baseControlType === 'wkTask' ||
      baseControlType === 'vacationType' ||
      baseControlType === 'addSignType'
    ) {
      return value
        ? value + '-$-' + showValue
        : showValue
        ? showValue
        : undefined;
    } else if (
      baseControlType === 'datetime' ||
      baseControlType === 'vacationStartTime' ||
      baseControlType === 'vacationEndTime' ||
      baseControlType === 'overTimeStart' ||
      baseControlType === 'overTimeEnd' ||
      baseControlType === 'outCheckStartTime' ||
      baseControlType === 'outCheckEndTime'
    ) {
      return showValue
        ? moment(showValue, 'YYYY-MM-DD HH:mm')
        : value
        ? moment(value, 'YYYY-MM-DD HH:mm')
        : '';
    } else if (baseControlType === 'date') {
      return showValue
        ? moment(showValue, 'YYYY-MM-DD')
        : value
        ? moment(value, 'YYYY-MM-DD')
        : '';
    } else if (baseControlType === 'select') {
      return showValue && value ? (showValue ? showValue : value) : undefined;
    } else if (baseControlType === 'multiple') {
      return value
        ? value
          ? value.split(',')
          : undefined
        : showValue
        ? showValue.split(',')
        : undefined;
    } else if (baseControlType === 'depGroup') {
      return showValue ? showValue.split(',') : undefined;
    } else {
      return showValue
        ? showValue
          ? showValue
          : undefined
        : value
        ? value
        : undefined;
    }
  };

  const fromContent = useMemo(() => {
    if (formList.length) {
      return formList.map(fromItem => {
        let list: any[] = fromItem.list;
        if (fromItem.type === 1) {
          return <AutoTable list={list} handleValue={handleValue} />;
        } else {
          return (
            <Descriptions
              title={<div style={{ textAlign: 'center' }}>{fromItem.name}</div>}
              key={fromItem.id}
              bordered
              column={fromItem.columnNum}
              style={{ marginBottom: 40, width: '90%', marginLeft: '5%' }}
            >
              {list.map(groupItem => {
                if (groupItem.list && groupItem.list.length) {
                  return (
                    <Descriptions.Item
                      key={groupItem.id}
                      label={groupItem.name}
                      span={groupItem.colspan}
                      style={{ maxWidth: '180px', padding: 10 }}
                    >
                      {groupItem.list.map(listItem => {
                        return (
                          <div
                            key={listItem.id}
                            style={{
                              display: 'flex',
                              flex: 1,
                              flexDirection: 'row',
                              margin: '10px',
                            }}
                          >
                            <div
                              className={
                                listItem.isRequired ? 'label-required' : ''
                              }
                              style={{ display: 'flex', flex: 1 }}
                            >
                              {listItem.name}
                            </div>
                            <div style={{ display: 'flex', flex: 1 }}>
                              <Form.Item
                                style={{
                                  width: '100%',
                                  marginBottom: 6,
                                  marginTop: 6,
                                }}
                                rules={[
                                  {
                                    required: listItem.isRequired,
                                    message: `${listItem.name}'必填!`,
                                  },
                                ]}
                                name={listItem.id}
                                initialValue={handleValue(listItem)}
                              >
                                <Temp
                                  ismultiplechoice={listItem.isMultiplechoice}
                                  s_type={listItem.baseControlType}
                                  disabled={listItem.isLocked}
                                  list={listItem.itemList || []}
                                  fileLists={listItem.fileList || []}
                                  item={listItem}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        );
                      })}
                    </Descriptions.Item>
                  );
                } else {
                  return (
                    <Descriptions.Item
                      key={groupItem.id}
                      style={{ maxWidth: '180px', padding: 10 }}
                      label={
                        <span
                          className={
                            groupItem.isRequired ? 'label-required' : ''
                          }
                        >
                          {groupItem.name}
                        </span>
                      }
                      span={groupItem.colspan}
                    >
                      <Form.Item
                        style={{
                          width: '100%',
                          marginBottom: 0,
                          marginTop: 0,
                        }}
                        name={groupItem.id}
                        initialValue={handleValue(groupItem)}
                        rules={[
                          {
                            required: groupItem.isRequired,
                            message: `${groupItem.name}'必填!`,
                          },
                        ]}
                      >
                        <Temp
                          ismultiplechoice={groupItem.isMultiplechoice}
                          s_type={groupItem.baseControlType}
                          disabled={groupItem.isLocked}
                          list={groupItem.itemList || []}
                          fileLists={groupItem.fileList || []}
                          item={groupItem}
                        />
                      </Form.Item>
                    </Descriptions.Item>
                  );
                }
              })}
            </Descriptions>
          );
        }
      });
    } else {
      return null;
    }
  }, [formList]);

  const submit = (): void => {
    form.validateFields().then(async fromSubData => {
      let subList: any = [];
      let wfTaskFormFilesCrudParamList: any = [];
      idItemList.map(item => {
        let showArr: any = [];
        let valueArr: any = [];
        if (
          !!fromSubData[item.id] &&
          fromSubData[item.id]?.constructor === Array
        ) {
          fromSubData[item.id].map(u => {
            showArr.push(u.toString().split('-$-')[1]);
            valueArr.push(u.toString().split('-$-')[0]);
          });
        } else {
          !!fromSubData[item.id] &&
          fromSubData[item.id].toString().indexOf('-$-') > -1
            ? showArr.push(fromSubData[item.id].split('-$-')[1])
            : showArr.push(item.defaultShowValue);

          !!fromSubData[item.id] &&
          fromSubData[item.id].toString().indexOf('-$-') > -1
            ? valueArr.push(fromSubData[item.id].split('-$-')[0])
            : valueArr.push(fromSubData[item.id]);
        }

        if (item.isLocked) {
          subList.push({
            id: item.id,
            multipleNumber: 1,
            showValue: item.defaultShowValue,
            value: item.defaultValue,
          });
        } else {
          if (
            item.baseControlType === 'datetime' ||
            item.baseControlType === 'vacationStartTime' ||
            item.baseControlType === 'vacationEndTime' ||
            item.baseControlType === 'overTimeStart' ||
            item.baseControlType === 'overTimeEnd' ||
            item.baseControlType === 'outCheckStartTime' ||
            item.baseControlType === 'outCheckEndTime'
          ) {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: moment(valueArr.join(','))?.format('YYYY-MM-DD HH:mm'),
              value: moment(valueArr.join(','))?.format('YYYY-MM-DD HH:mm'),
            });
          } else if (item.baseControlType === 'date') {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: moment(valueArr.join(','))?.format('YYYY-MM-DD'),
              value: moment(valueArr.join(','))?.format('YYYY-MM-DD'),
            });
          } else if (
            item.baseControlType === 'text' ||
            item.baseControlType === 'areatext' ||
            item.baseControlType === 'number' ||
            item.baseControlType === 'money' ||
            item.baseControlType === 'remark' ||
            item.baseControlType === 'currDate' ||
            item.baseControlType === 'currDatetime' ||
            item.baseControlType === 'currCompany' ||
            item.baseControlType === 'currBusiness' ||
            item.baseControlType === 'currDepartment' ||
            item.baseControlType === 'currUser'
          ) {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: valueArr.join(',').split('-$-')[1],
              value: valueArr.join(',').split('-$-')[0],
            });
          } else if (item.baseControlType === 'currUser') {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: item.defaultShowValue,
              value: item.defaultValue,
            });
          } else if (item.baseControlType === 'files') {
            fromSubData[item.id]?.map(file => {
              wfTaskFormFilesCrudParamList.push({
                resFormControlId: item.id,
                fileUrl: file.url,
                fileName: file.name,
                fileSize: file.size,
                fileExtname: file.type,
                multipleNumber: 1,
              });
            });
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: '',
              value: '',
            });
          } else if (
            item.baseControlType === 'totalVacationTime' ||
            item.baseControlType === 'totalReVacationTime' ||
            item.baseControlType === 'overTimeTotal' ||
            item.baseControlType === 'outCheckTime' ||
            item.baseControlType === 'vacationTime'
          ) {
            // 设置单位
            let unitType: any = null;
            let unitValue = fromSubData[item.id] || '';
            let unitShowValue = fromSubData[item.id] || '';
            unitList?.map(unitItem => {
              if (unitShowValue?.indexOf(unitItem.desc) > -1) {
                unitType = unitItem.code;
              }
            });
            unitValue = unitValue?.replace('小时', '')?.replace('天', '');
            subList.push({
              id: item.id,
              value: unitValue,
              showValue: unitShowValue,
              multipleNumber: 1,
              unitType: unitType,
            });
          } else {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: showArr.join(','),
              value: valueArr.join(','),
            });
          }
        }
      });

      for (let key in fromSubData) {
        if (key.split('-')[1] && key.split('-')[0]) {
          if (key.split('-')[0] === 'date') {
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: moment(fromSubData[key])?.format('YYYY-MM-DD') || '',
              multipleNumber: parseInt(key.split('-')[2]),
            });
          } else if (
            key.split('-')[0] === 'datetime' ||
            key.split('-')[0] === 'vacationStartTime' ||
            key.split('-')[0] === 'vacationEndTime' ||
            key.split('-')[0] === 'overTimeStart' ||
            key.split('-')[0] === 'overTimeEnd' ||
            key.split('-')[0] === 'outCheckStartTime' ||
            key.split('-')[0] === 'outCheckEndTime'
          ) {
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: moment(fromSubData[key])?.format('YYYY-MM-DD HH:mm') || '',
              multipleNumber: parseInt(key.split('-')[2]),
            });
          } else if (key.split('-')[0] === 'depGroup') {
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: fromSubData[key] ? fromSubData[key].split('-$-')[0] : '',
              showValue: fromSubData[key]
                ? fromSubData[key].split('-$-')[1]
                : '',
              multipleNumber: parseInt(key.split('-')[2]),
            });
          } else if (
            key.split('-')[0] === 'multiple' ||
            key.split('-')[0] === 'user'
          ) {
            let vArr: any = [];
            let sArr: any = [];
            if (fromSubData[key]) {
              if (
                !!fromSubData[key] &&
                fromSubData[key].constructor === Array
              ) {
                for (let i = 0; i < fromSubData[key].length; i++) {
                  vArr.push(fromSubData[key][i].split('-$-')[0]);
                  sArr.push(fromSubData[key][i].split('-$-')[1]);
                }
                subList.push({
                  id: parseInt(key.split('-')[1]),
                  value: vArr.join(','),
                  showValue: sArr.join(','),
                  multipleNumber: parseInt(key.split('-')[2]),
                });
              } else if (!!fromSubData[key]) {
                subList.push({
                  id: parseInt(key.split('-')[1]),
                  value: fromSubData[key]
                    ? fromSubData[key].split('-$-')[0]
                    : '',
                  showValue: fromSubData[key]
                    ? fromSubData[key].split('-$-')[1]
                    : '',
                  multipleNumber: parseInt(key.split('-')[2]),
                });
              }
            }
          } else if (
            key.split('-')[0] === 'select' ||
            key.split('-')[0] === 'business' ||
            key.split('-')[0] === 'business2' ||
            key.split('-')[0] === 'labor' ||
            key.split('-')[0] === 'cost' ||
            key.split('-')[0] === 'positionLevel' ||
            key.split('-')[0] === 'positionMLevel' ||
            key.split('-')[0] === 'wkTask' ||
            key.split('-')[0] === 'vacationType'
          ) {
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: fromSubData[key] ? fromSubData[key].split('-$-')[0] : '',
              showValue: fromSubData[key]
                ? fromSubData[key].split('-$-')[1]
                : '',
              multipleNumber: parseInt(key.split('-')[2]),
            });
          } else if (
            key.split('-')[0] === 'totalVacationTime' ||
            key.split('-')[0] === 'totalReVacationTime' ||
            key.split('-')[0] === 'overTimeTotal' ||
            key.split('-')[0] === 'outCheckTime'
          ) {
            // 设置单位
            let unitType: any = null;
            let unitValue = fromSubData[key]
              ? fromSubData[key].split('-$-')[0]
              : '';
            let unitShowValue = fromSubData[key]
              ? fromSubData[key].split('-$-')[1]
              : '';
            unitList?.map(unitItem => {
              if (unitShowValue?.indexOf(unitItem.desc) > -1) {
                unitType = unitItem.code;
              }
            });
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: unitValue?.replace(/'小时'/g, '')?.replace(/'天'/g, ''),
              showValue: unitShowValue
                ?.replace(/'小时'/g, '')
                ?.replace(/'天'/g, ''),
              multipleNumber: parseInt(key.split('-')[2]),
              unitType: unitType,
            });
          } else if (key.split('-')[0] === 'vacationTime') {
            let unitValue = fromSubData[key]
              ? fromSubData[key].split('-$-')[0]
              : '';
            let unitShowValue = fromSubData[key]
              ? fromSubData[key].split('-$-')[1]
              : '';
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: unitValue?.replace(/'次'/g, ''),
              showValue: unitShowValue?.replace(/'次'/g, ''),
              multipleNumber: parseInt(key.split('-')[2]),
            });
          } else if (key.split('-')[0] === 'files') {
            fromSubData[key]?.map(file => {
              wfTaskFormFilesCrudParamList.push({
                resFormControlId: key.split('-')[1],
                fileUrl: file.url,
                fileName: file.name,
                fileSize: file.size,
                fileExtname: file.type,
                multipleNumber: parseInt(key.split('-')[2]),
              });
              subList.push({
                id: parseInt(key.split('-')[1]),
                value: '',
                showValue: '',
                multipleNumber: parseInt(key.split('-')[2]),
              });
            });
          } else {
            subList.push({
              id: parseInt(key.split('-')[1]),
              value: fromSubData[key],
              showValue: fromSubData[key],
              multipleNumber: parseInt(key.split('-')[2]),
            });
          }
        }
      }
      if (loading) {
        return;
      }
      setLoading(true);
      let json: GlobalResParams<string> = await saveTaskForm({
        resFormId: formId,
        wfResFormSaveItemCrudParamList: subList,
        wfTaskFormFilesCrudParamList: wfTaskFormFilesCrudParamList,
      });
      if (json.status === 200) {
        setLoading(false);
        notification['success']({
          message: json.msg,
          description: '',
        });
        window.location.href = '/talent/workflow/mylist';
      } else {
        setLoading(false);
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    let apiType: any = undefined; //1 请假销假
    let beginTime: any = undefined;
    let endTime: any = undefined;
    let type: any = undefined; //  请假 销假
    let typeId: any = undefined; //
    let setFormId: any = undefined;
    let api: any = undefined;
    let changid: string[] = [];
    idItemList?.map((item, index) => {
      if (
        item.baseControlType === 'totalVacationTime' ||
        item.baseControlType === 'totalReVacationTime'
      ) {
        setFormId = item.id;
        // 请假销假 验证
        apiType = 1;
        if (item.baseControlType === 'totalVacationTime') {
          type = 1;
        } else {
          type = 2;
        }
      }

      if (item.baseControlType === 'overTimeTotal') {
        // 加班
        setFormId = item.id;
        apiType = 2;
      }

      if (item.baseControlType === 'outCheckTime') {
        // 出差外出
        setFormId = item.id;
        apiType = 3;
      }

      if (
        item.baseControlType === 'vacationStartTime' ||
        item.baseControlType === 'overTimeStart' ||
        item.baseControlType === 'outCheckStartTime'
      ) {
        changid.push(item.id + '');
        beginTime = allValues[item.id]
          ? allValues[item.id]?.format('YYYY-MM-DD HH:mm:ss')
          : undefined;
      }

      if (
        item.baseControlType === 'vacationEndTime' ||
        item.baseControlType === 'overTimeEnd' ||
        item.baseControlType === 'outCheckEndTime'
      ) {
        changid.push(item.id + '');
        endTime = allValues[item.id]
          ? allValues[item.id]?.format('YYYY-MM-DD HH:mm:ss')
          : undefined;
      }

      if (item.baseControlType === 'vacationType') {
        changid.push(item.id + '');
        typeId = allValues[item.id];
      }
    });

    if (
      new Date(beginTime).getTime() &&
      new Date(endTime).getTime() &&
      beginTime >= endTime
    ) {
      message.warning('开始时间需要小于结束时间');
      return;
    }

    if (changid.indexOf(Object.keys(changedValues)[0] + '') === -1) {
      return;
    }
    let objParam: any = undefined;
    if (apiType === 1) {
      api = vacationTime;
      objParam = {
        endTime: endTime,
        startTime: beginTime,
        type: type,
        typeId: parseInt(typeId?.split('-$-')[0]),
        userCode: userCode,
      };

      if (endTime && beginTime && type && typeId && userCode) {
        getFormTotle(1);
      }
    } else if (apiType === 2) {
      api = overTime;
      objParam = {
        overTimeEnd: endTime,
        overTimeStart: beginTime,
      };
      if (endTime && beginTime) {
        getFormTotle(2);
      }
    } else if (apiType === 3) {
      api = getOutCheckTime;
      objParam = {
        outcheckTimeEnd: endTime,
        outcheckTimeStart: beginTime,
      };
      if (endTime && beginTime) {
        getFormTotle(3);
      }
    }

    async function getFormTotle(paramsType) {
      let json: GlobalResParams<any> = await api(objParam);
      if (json.status === 200) {
        if (paramsType === 1) {
          let obj0 = {};
          if (json.obj.isTrue) {
            obj0[setFormId] =
              json.obj.time + (json.obj.unit === 0 ? '小时' : '天');
            form.setFieldsValue(obj0);
          } else {
            message.warning(json.obj.reason || '参数异常');
          }
        }
        if (paramsType === 2 && setFormId) {
          let obj = {};
          obj[setFormId] = json.obj?.hour + '小时';
          form.setFieldsValue(obj);
        }
        if (paramsType === 3 && setFormId) {
          let obj1: any = {};
          obj1[setFormId] = json.obj?.hour + '小时';
          form.setFieldsValue(obj1);
        }
      }
    }
  };

  return (
    <Card title={`发起流程  /  ${title}-创建`} className="home-detail">
      <Form form={form} onValuesChange={onValuesChange}>
        {fromContent}
        {mount ? (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              style={{ marginRight: 20 }}
              onClick={() => {
                submit();
              }}
            >
              提交
            </Button>
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              返回
            </Button>
          </div>
        ) : null}
      </Form>
      {loading ? (
        <Spin
          style={{
            position: 'fixed',
            top: '50vh',
            left: '55vw',
            margin: '-10px',
          }}
        />
      ) : null}
    </Card>
  );
};

const AutoTable = props => {
  const { list, handleValue } = props;
  const [columns, setColumns] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [template, setTemplate] = useState<any>();

  useEffect(() => {
    let dataItem: any = {};
    let newColumns: any = [];
    newColumns.push({
      title: '序号',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '6em',
      render: (_, record, index) => <span>{index + 1}</span>,
    });
    list.map(item => {
      newColumns.push({
        title: (
          <span className={item.isRequired ? 'label-required' : ''}>
            {item.name}
          </span>
        ),
        dataIndex: item.baseControlType + '-' + item.id,
        key: item.id,
        align: 'left',
        width: item.colspan * 120,
        ...item,
      });
      dataItem[item.baseControlType + '-' + item.id] = { ...item };
    });
    newColumns.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '6em',
      render: (_, record, index) => (
        <span>
          <a
            onClick={() => {
              let newList = new Set(dataSource);
              newList = update(newList, {
                $remove: [newList[index]],
              });
            }}
          >
            删除
          </a>
        </span>
      ),
    });

    setColumns(newColumns);
    setTemplate(dataItem);
    setDataSource([dataItem]);
  }, [list]);

  useEffect(() => {
    let dataItem: any = {};
    let newColumns: any = [];
    newColumns.push({
      title: '序号',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '6em',
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
    });
    list.map(item => {
      newColumns.push({
        title: (
          <span className={item.isRequired ? 'label-required' : ''}>
            {item.name}
          </span>
        ),
        dataIndex: item.baseControlType + '-' + item.id,
        key: item.id,
        align: 'left',
        width: item.colspan * 120,
        ...item,
      });
      dataItem[item.baseControlType + '-' + item.id] = { ...item };
    });
    newColumns.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '6em',
      render: (_, record, index) => (
        <span>
          <a
            onClick={() => {
              let newList = new Set(dataSource);
              newList = update(newList, {
                $remove: [dataSource[index]],
              });
              setDataSource([...newList]);
            }}
          >
            删除
          </a>
        </span>
      ),
    });
    setColumns(newColumns);
  }, [dataSource]);

  const handleDataSource = dataSource => {
    let newData = JSON.parse(JSON.stringify(dataSource));
    for (let i = 0; i < newData.length; i++) {
      let item = newData[i];
      for (let key in item) {
        let itemKey = item[key];
        item[key] = (
          <Form.Item
            style={{
              width: '100%',
              marginBottom: 6,
              marginTop: 6,
            }}
            rules={[
              {
                required: itemKey.isRequired,
                message: `${itemKey.name}'必填!`,
              },
            ]}
            name={itemKey.baseControlType + '-' + itemKey.id + '-' + (i + 1)}
            initialValue={handleValue(itemKey)}
          >
            <Temp
              ismultiplechoice={itemKey.isMultiplechoice}
              s_type={itemKey.baseControlType}
              disabled={itemKey.isLocked}
              list={itemKey.itemList || []}
              fileLists={itemKey.fileList || []}
              item={itemKey}
            />
          </Form.Item>
        );
      }
      item.id = i;
      item.key = i;
    }
    return newData;
  };

  return (
    <div
      style={{
        marginBottom: 40,
        width: '90%',
        marginLeft: '5%',
        overflowX: 'auto',
      }}
    >
      <Table
        title={() => {
          return (
            <Button
              onClick={() => {
                let newData = JSON.parse(JSON.stringify(dataSource));
                newData.push(template);
                setDataSource(newData);
              }}
            >
              新增
            </Button>
          );
        }}
        columns={columns}
        style={{ width: columns.length < 12 ? '100%' : columns.length * 120 }}
        dataSource={handleDataSource(dataSource)}
      />
    </div>
  );
};
