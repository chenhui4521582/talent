import React, { useState, useEffect, useMemo } from 'react';
import { Card, Descriptions, Button, Form, Input, Table } from 'antd';
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

  async function getData() {
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
  }
  const fromContent = useMemo(() => {
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
                              listItem.defaultShowValue
                                ? listItem.defaultValue
                                : listItem.defaultShowValue
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
                      groupItem.defaultShowValue
                        ? groupItem.defaultShowValue
                        : groupItem.defaultValue
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
  }, [formList, mount]);

  const submitData = (type: number): void => {
    form.validateFields().then(async fromSubData => {
      // let fromSubData = form.getFieldsValue();
      let subList: any = [];
      idItemList.map(item => {
        console.log(fromSubData[item.id]);
        subList.push({
          id: item.id,
          multipleNumber: 1,
          showValue:
            fromSubData[item.id].toString().indexOf('-$-') > -1
              ? fromSubData[item.id].split('-$-')[1]
              : item.defaultShowValue,
          value:
            fromSubData[item.id].toString().indexOf('-$-') > -1
              ? fromSubData[item.id].split('-$-')[0]
              : fromSubData[item.id],
        });
      });
      let json: GlobalResParams<string> = await submit({
        remark: fromSubData.remark,
        taskFormId: formId,
        type: type,
        wfResFormSaveItemCrudParamList: subList,
        wfTaskFormFilesCrudParamList: [],
      });

      if (json.status === 200) {
        getData();
      }
    });
  };

  const cancel = async function() {
    let json: GlobalResParams<string> = await detailCanceled(formId);
    if (json.status === 200) {
      getData();
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
