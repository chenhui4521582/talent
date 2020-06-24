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
  },
  {
    title: '时间',
    dataIndex: 'apprTime',
    key: 'apprTime ',
    align: 'center',
  },
  {
    title: '审批状态',
    dataIndex: 'apprStatus',
    key: 'apprStatus',
    align: 'center',
    render: (_, item: tsLog) => <span>{status[item.apprStatus]}</span>,
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
    align: 'center',
  },
  {
    title: '签字意见',
    dataIndex: 'apprRemark',
    key: 'apprRemark',
    align: 'center',
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
      console.log('idItem');
      console.log(idItem);
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

    console.log('表单');
    console.log(json);
    console.log('按钮');
    console.log(btnJson);
    console.log('历史');
    console.log(LogJson);
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
            style={{ marginBottom: 40, width: '80%', marginLeft: '10%' }}
          >
            {list.map(groupItem => {
              if (groupItem.list && groupItem.list.length) {
                return (
                  <Descriptions.Item
                    key={groupItem.id}
                    label={groupItem.name}
                    span={1}
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
                              style={{ width: '100%' }}
                              rules={[
                                {
                                  required: listItem.isRequired,
                                  message: `${listItem.name}'必填!`,
                                },
                              ]}
                              name={listItem.id}
                              initialValue={
                                listItem.baseControlType === 'datetime' ||
                                listItem.baseControlType === 'date'
                                  ? listItem.showValue
                                    ? moment(
                                        listItem.value,
                                        'YYYY-MM-DD HH:mm:ss',
                                      )
                                    : moment(
                                        listItem.showValue,
                                        'YYYY-MM-DD HH:mm:ss',
                                      )
                                  : listItem.showValue
                                  ? listItem.showValue
                                  : listItem.value
                              }
                            >
                              <Temp
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
                  >
                    <Form.Item
                      style={{ width: '100%' }}
                      name={groupItem.id}
                      initialValue={
                        groupItem.baseControlType === 'datetime' ||
                        groupItem.baseControlType === 'date'
                          ? groupItem.showValue
                            ? moment(groupItem.value, 'YYYY-MM-DD HH:mm:ss')
                            : moment(groupItem.showValue, 'YYYY-MM-DD HH:mm:ss')
                          : groupItem.showValue
                          ? groupItem.showValue
                          : groupItem.value
                      }
                      rules={[
                        {
                          required: groupItem.isRequired,
                          message: `${groupItem.name}'必填!`,
                        },
                      ]}
                    >
                      <Temp
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
        if (fromSubData[item.id].constructor === Array) {
          fromSubData[item.id].map(u => {
            showArr.push(u.toString().split('-$-')[1]);
            valueArr.push(u.toString().split('-$-')[0]);
          });
        } else {
          fromSubData[item.id].toString().indexOf('-$-') > -1
            ? showArr.push(fromSubData[item.id].split('-$-')[1])
            : showArr.push(item.showValue);

          fromSubData[item.id].toString().indexOf('-$-') > -1
            ? valueArr.push(fromSubData[item.id].split('-$-')[0])
            : valueArr.push(fromSubData[item.id]);
        }
        if (item.isLocked) {
          subList.push({
            id: item.id,
            multipleNumber: 1,
            showValue: item.showValue,
            value: item.value,
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
            item.baseControlType === 'remark'
          ) {
            subList.push({
              id: item.id,
              multipleNumber: 1,
              showValue: valueArr.join(','),
              value: valueArr.join(','),
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
      let json: GlobalResParams<string> = await submit({
        remark: fromSubData.remark,
        taskFormId: formId,
        type: type,
        wfResFormSaveItemCrudParamList: subList,
        wfTaskFormFilesCrudParamList: [],
      });

      if (json.status === 200) {
        notification['success']({
          message: json.msg,
          description: '',
        });
        getData();
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
      <Form.Item name="remark">
        <TextArea rows={3} placeholder="签字意见" />
        <div style={{ position: 'absolute', bottom: '10px', right: 20 }}>
          {btnObj?.approver ? (
            <Button
              onClick={() => {
                submitData(1);
              }}
            >
              通过
            </Button>
          ) : null}
          {btnObj?.approver ? (
            <Button
              onClick={() => {
                submitData(2);
              }}
            >
              驳回
            </Button>
          ) : null}
          {btnObj?.applicant ? <Button onClick={cancel}>撤销</Button> : null}
        </div>
      </Form.Item>
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
    </Card>
  );
};
