import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Form,
  Input,
  Table,
  notification,
} from 'antd';
import Temp from './Component';
import './style/home.less';
import {
  getDetail,
  getButtonStatus,
  gefLogList,
  detailCanceled,
  submit,
  tsDetail,
  tsLog,
} from './services/detail';
import { tsFormChildlist } from './services/home';
import { GlobalResParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';

const { TextArea } = Input;

interface tsBtn {
  applicant: boolean;
  approver: boolean;
  submit: boolean;
}

const status = {
  0: '没处理',
  1: '通过',
  2: '退回',
  3: '已提交',
};

const columns: ColumnProps<tsLog>[] = [
  {
    title: '操作人',
    key: 'apprUserTruename',
    dataIndex: 'apprUserTruename',
    align: 'center',
    width: '16vw',
    render: (_, item: tsLog) => (
      <div>
        <p>{item.apprUserTruename}</p>
        <p>{`${item.businessName ? item.businessName + '/' : ''}${
          item.businessName ? item.businessName + '/' : ''
        }${item.groupName ? item.groupName : ''}`}</p>
      </div>
    ),
  },
  {
    title: '签字意见',
    dataIndex: 'apprRemark',
    key: 'apprRemark',
    align: 'left',
    width: '40vw',
    render: (_, item: tsLog) => (
      <div>
        <p>{item.apprRemark}</p>
        {item.nextStepUserNames ? (
          <p>接收人：{item.nextStepUserNames}</p>
        ) : null}
      </div>
    ),
  },
  {
    title: '时间',
    dataIndex: 'apprTime',
    key: 'apprTime ',
    align: 'center',
    width: '30vw',
    render: (_, item: tsLog) => (
      <div>
        <p>{item.apprTime}</p>
        <p>
          [{item.stepNumber + item.stepName + `/` + status[item.apprStatus]}]
        </p>
      </div>
    ),
  },
];

export default props => {
  const formId = props.match.params.id;
  const [mount, setMount] = useState<Boolean>(false);
  const [formList, setFormList] = useState<tsFormChildlist[]>([]);
  const [title, setTitle] = useState<string | null>('');
  const [idItemList, setIdItemList] = useState<any[]>([]);
  const [logList, setLogList] = useState<tsLog[]>([]);
  const [btnObj, setBtnObj] = useState<tsBtn>();
  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let idItem: any = [];
    let json: GlobalResParams<tsDetail> = await getDetail(formId);
    let btnJson: GlobalResParams<tsBtn> = await getButtonStatus(formId);
    let LogJson: GlobalResParams<tsLog[]> = await gefLogList(formId);
    if (json.status === 200) {
      setMount(true);
      let obj = json.obj || {};
      let formChildlist = obj.formChildlist || [];
      let groupList = obj.groupList || [];
      let data: any = [];
      for (let k = 0; k < formChildlist.length; k++) {
        let fromItem = formChildlist[k];
        let controlList = fromItem.controlList;
        idItem = idItem.concat(controlList);
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
              if (groupItem.resFormGroupId === controlList[g].resGroupId) {
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
    }

    if (LogJson.status === 200) {
      LogJson.obj.map(item => {
        item.key = item.taskApprStepId;
      });
      setLogList(LogJson.obj);
    }

    if (btnJson.status === 200) {
      setBtnObj(btnJson.obj);
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
    const { baseControlType, value, showValue } = item;
    switch (baseControlType) {
      case 'user':
        return value ? value + '-$-' + showValue : showValue;
      case 'department':
        return value ? value + '-$-' + showValue : showValue;
      case 'business':
        return value ? value + '-$-' + showValue : showValue;
      case 'business2':
        return value ? value + '-$-' + showValue : showValue;
      case 'currBusiness2':
        return value ? value + '-$-' + showValue : showValue;
      case 'cost':
        return value ? value + '-$-' + showValue : showValue;
      case 'labor':
        return value ? value + '-$-' + showValue : showValue;
      case 'company':
        return value ? value + '-$-' + showValue : showValue;
      case 'position':
        return value ? value + '-$-' + showValue : showValue;
      case 'job':
        return value ? value + '-$-' + showValue : showValue;
      case 'positionLevel':
        return value ? value + '-$-' + showValue : showValue;
      case 'positionMLevel':
        return value ? value + '-$-' + showValue : showValue;
      case 'datetime':
        return showValue
          ? moment(showValue, 'YYYY-MM-DD HH:mm:ss')
          : value
          ? moment(value, 'YYYY-MM-DD HH:mm:ss')
          : '';
      case 'date':
        return showValue
          ? moment(showValue, 'YYYY-MM-DD HH:mm:ss')
          : value
          ? moment(value, 'YYYY-MM-DD HH:mm:ss')
          : '';
      case 'select':
        return showValue && value ? (showValue ? showValue : value) : '';
      case 'multiple':
        return value
          ? value
            ? value.split(',')
            : undefined
          : showValue
          ? showValue.split(',')
          : undefined;
      case 'files':
        return value ? value.split(',') : undefined;
      case 'depGroup':
        return showValue ? showValue.split(',') : undefined;
      default:
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
                    style={{ maxWidth: '300px' }}
                  >
                    {groupItem.list.map(listItem => {
                      return (
                        <div
                          key={listItem.id}
                          style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'row',
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
                              style={{ width: '100%' }}
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
                                ismultiplechoice={groupItem.isMultiplechoice}
                                s_type={listItem.baseControlType}
                                disabled={listItem.isLocked}
                                list={listItem.itemList || []}
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
                    label={
                      <span
                        className={groupItem.isRequired ? 'label-required' : ''}
                      >
                        {groupItem.name}
                      </span>
                    }
                    span={groupItem.colspan}
                    style={{ maxWidth: '200px' }}
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
                      />
                    </Form.Item>
                  </Descriptions.Item>
                );
              }
            })}
          </Descriptions>
        );
      });
    } else {
      return null;
    }
  }, [formList, mount]);

  const submitData = (type: number): void => {
    form.validateFields().then(async fromSubData => {
      let subList: any = [];
      idItemList.map(item => {
        let showArr: any = [];
        let valueArr: any = [];
        if (
          !!fromSubData[item.id] &&
          fromSubData[item.id].constructor === Array
        ) {
          fromSubData[item.id].map(u => {
            showArr.push(u.toString().split('-$-')[1]);
            valueArr.push(u.toString().split('-$-')[0]);
          });
        } else {
          !!fromSubData[item.id] &&
          fromSubData[item.id].toString().indexOf('-$-') > -1
            ? showArr.push(fromSubData[item.id].split('-$-')[1])
            : showArr.push(item.showValue);

          !!fromSubData[item.id] &&
          fromSubData[item.id].toString().indexOf('-$-') > -1
            ? valueArr.push(fromSubData[item.id].split('-$-')[0])
            : valueArr.push(fromSubData[item.id]);
        }
        if (item.isLocked) {
          subList.push({
            resFormControlId: item.resFormControlId,
            multipleNumber: 1,
            showValue: item.showValue || '',
            value: item.value || '',
          });
        } else {
          if (item.baseControlType === 'datetime') {
            subList.push({
              resFormControlId: item.resFormControlId,
              multipleNumber: 1,
              showValue: moment(valueArr.join(','))?.format(
                'YYYY-MM-DD HH:mm:ss',
              ),
              value: moment(valueArr.join(','))?.format('YYYY-MM-DD HH:mm:ss'),
            });
          } else if (item.baseControlType === 'date') {
            subList.push({
              resFormControlId: item.resFormControlId,
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
            console.log(valueArr);
            subList.push({
              resFormControlId: item.resFormControlId,
              multipleNumber: 1,
              showValue: valueArr.join(',').split('-$-')[0],
              value: valueArr.join(',').split('-$-')[0],
            });
          } else if (item.baseControlType === 'depGroup') {
            if (fromSubData[item.id].indexOf('-$-') > -1) {
              subList.push({
                resFormControlId: item.resFormControlId,
                multipleNumber: 1,
                showValue: fromSubData[item.id].split('-$-')[1],
                value: fromSubData[item.id].split('-$-')[0] || '',
              });
            } else {
              subList.push({
                resFormControlId: item.resFormControlId,
                multipleNumber: 1,
                showValue: item.showValue || '',
                value: item.value || '',
              });
            }
          } else {
            subList.push({
              resFormControlId: item.resFormControlId,
              multipleNumber: 1,
              showValue: showArr.join(','),
              value: valueArr.join(','),
            });
          }
        }
      });
      console.log(subList);
      let json: GlobalResParams<string> = await submit({
        remark: fromSubData.remark,
        taskFormId: formId,
        type: type,
        wfResFormUpdateItemCrudParamList: subList,
        wfTaskFormFilesCrudParamList: [],
      });

      if (json.status === 200) {
        notification['success']({
          message: json.msg,
          description: '',
        });
        getData();
        window.history.go(-1);
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  const cancel = async function() {
    let json: GlobalResParams<string> = await detailCanceled(formId);
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      window.history.go(-1);
      getData();
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };

  const btnRender = useMemo(() => {
    return mount ? (
      <div style={{ position: 'relative' }}>
        <Form.Item name="remark">
          <TextArea rows={3} placeholder="签字意见" />
        </Form.Item>
        <div style={{ position: 'absolute', bottom: '10px', right: 20 }}>
          {btnObj?.approver ? (
            <Button
              type="primary"
              onClick={() => {
                submitData(1);
              }}
            >
              通过
            </Button>
          ) : null}
          {btnObj?.approver ? (
            <Button
              style={{ margin: '0 10px' }}
              onClick={() => {
                submitData(2);
              }}
            >
              驳回
            </Button>
          ) : null}
          {btnObj?.submit ? (
            <Button
              style={{ margin: '0 10px' }}
              type="primary"
              onClick={() => {
                submitData(3);
              }}
            >
              提交
            </Button>
          ) : null}

          {btnObj?.applicant ? <Button onClick={cancel}>撤销</Button> : null}
        </div>
      </div>
    ) : null;
  }, [btnObj, mount]);

  const renderLog = useMemo(() => {
    return mount ? (
      <Table
        title={() => {
          return <h3>流转意见</h3>;
        }}
        style={{ width: '100%', marginTop: 20 }}
        columns={columns}
        dataSource={logList}
      />
    ) : null;
  }, [logList, mount]);

  return (
    <Card title={`流程详情  /  ${title}`} className="home-detail">
      <Form form={form}>
        {fromContent}
        {btnRender}
      </Form>
      {renderLog}
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={() => {
            window.history.go(-1);
          }}
        >
          返回
        </Button>
      </div>
    </Card>
  );
};
