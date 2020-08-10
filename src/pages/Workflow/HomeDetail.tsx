import React, { useState, useEffect, useMemo } from 'react';
import {
  wfFormDetail,
  tsWfFormDetail,
  tsFormChildlist,
  tsControlList,
  saveTaskForm,
} from './services/home';
import { GlobalResParams } from '@/types/ITypes';
import { Card, Descriptions, Button, Form, notification } from 'antd';
import moment from 'moment';
import Temp from './Component';
import './style/home.less';

export default props => {
  const formId = props.match.params.id;

  const [formList, setFormList] = useState<tsFormChildlist[]>([]);
  const [title, setTitle] = useState<string | null>('');
  const [mount, setMount] = useState<Boolean>(false);
  const [idItemList, setIdItemList] = useState<any[]>([]);

  const [form] = Form.useForm();
  useEffect(() => {
    getFrom();
  }, []);
  const getFrom = async () => {
    let idItem: any = [];
    let json: GlobalResParams<tsWfFormDetail> = await wfFormDetail(formId);
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
            let groupItem = groupList[i];
            let list: any = [];
            for (let g = 0; g < controlList.length; g++) {
              if (groupItem.id === controlList[g].resGroupId) {
                data[k].groupColArr.push(formChildlist[k].controlList[g].id);
                list.push(controlList[g]);
                groupItem.list = list;
                data[k].list.push(groupItem);
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
  };

  const handleValue = item => {
    const { baseControlType, defaultValue, defaultShowValue } = item;
    switch (baseControlType) {
      case 'department':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'business':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'business2':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'labor':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'cost':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'company':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'position':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'job':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'positionLevel':
        return defaultValue
          ? defaultValue + '-$-' + defaultShowValue
          : defaultShowValue;
      case 'datetime':
        return defaultShowValue
          ? moment(defaultShowValue, 'YYYY-MM-DD HH:mm:ss')
          : defaultValue
          ? moment(defaultValue, 'YYYY-MM-DD HH:mm:ss')
          : '';
      case 'date':
        return defaultShowValue
          ? moment(defaultShowValue, 'YYYY-MM-DD HH:mm:ss')
          : defaultValue
          ? moment(defaultValue, 'YYYY-MM-DD HH:mm:ss')
          : '';
      case 'multiple':
        return defaultShowValue
          ? defaultShowValue
            ? defaultShowValue.split(',')
            : undefined
          : defaultValue
          ? defaultValue.split(',')
          : undefined;
      case 'files':
        return defaultShowValue
          ? defaultShowValue
            ? defaultShowValue.split(',')
            : undefined
          : defaultValue
          ? defaultValue.split(',')
          : undefined;
      default:
        return defaultShowValue
          ? defaultShowValue
            ? defaultShowValue
            : undefined
          : defaultValue
          ? defaultValue
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
                        className={groupItem.isRequired ? 'label-required' : ''}
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
  }, [formList]);

  const submit = (): void => {
    form.validateFields().then(async fromSubData => {
      let subList: any = [];
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
          if (item.baseControlType === 'datetime') {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: moment(valueArr.join(','))?.format(
                'YYYY-MM-DD HH:mm:ss',
              ),
              value: moment(valueArr.join(','))?.format('YYYY-MM-DD HH:mm:ss'),
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
            subList({
              id: item.id,
              multipleNumber: 1,
              showValue: item.defaultShowValue,
              value: item.defaultValue,
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
      console.log(subList);
      let json: GlobalResParams<string> = await saveTaskForm({
        resFormId: formId,
        wfResFormSaveItemCrudParamList: subList,
        wfTaskFormFilesCrudParamList: [],
      });
      if (json.status === 200) {
        notification['success']({
          message: json.msg,
          description: '',
        });
        window.location.href = '/talent/workflow/mylist';
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  return (
    <Card title={`发起流程  /  ${title}-创建`} className="home-detail">
      <Form form={form}>
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
    </Card>
  );
};
