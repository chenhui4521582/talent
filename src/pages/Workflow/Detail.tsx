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
    let idItem: any = [];
    async function getData() {
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
    getData();
  }, []);

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
                              // changSubData={changSubData}
                              id={listItem.id}
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
                      // changSubData={changSubData}
                      id={groupItem.id}
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

  const btnRender = useMemo(() => {
    return mount ? (
      <Form.Item name="">
        <TextArea rows={3} placeholder="签字意见" />
        <div style={{ position: 'absolute', bottom: '10px', right: 20 }}>
          {btnObj?.approver ? <Button>通过</Button> : null}
          {btnObj?.approver ? <Button>驳回</Button> : null}
          {btnObj?.applicant ? <Button>撤销</Button> : null}
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
      <Form>
        {fromContent}
        {btnRender}
      </Form>
      {renderLog}
    </Card>
  );
};
