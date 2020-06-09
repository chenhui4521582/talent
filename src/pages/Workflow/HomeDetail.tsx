import React, { useState, useEffect, useMemo } from 'react';
import {
  wfFormDetail,
  tsWfFormDetail,
  tsFormChildlist,
  saveTaskForm,
} from './services/home';
import { GlobalResParams } from '@/types/ITypes';
import { Card, Descriptions, Button, Form } from 'antd';
import Temp from './Component';

export default () => {
  const [formList, setFormList] = useState<tsFormChildlist[]>([]);
  const [title, setTitle] = useState<string | null>('');
  const [form] = Form.useForm();
  useEffect(() => {
    async function getFrom() {
      let json: GlobalResParams<tsWfFormDetail> = await wfFormDetail(0, 6);
      if (json.status === 200) {
        let obj = json.obj || {};
        let formChildlist = obj.formChildlist || [];
        let groupList = obj.groupList || [];
        let data: any = [];
        for (let k = 0; k < formChildlist.length; k++) {
          let fromItem = formChildlist[k];
          let controlList = fromItem.controlList || [];
          data[k] = fromItem;
          data[k].list = [];
          data[k].arr = [];
          data[k].groupColArr = [];
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
        }
        setTitle(obj.name);
        setFormList(data);
      }
    }
    getFrom();
  }, []);

  const fromContent = useMemo(() => {
    return formList.map(fromItem => {
      let list: any[] = fromItem.list;
      return (
        <Descriptions
          title={fromItem.name}
          key={fromItem.id}
          bordered
          column={1}
          style={{ marginBottom: 40 }}
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
                        <div style={{ display: 'flex', flex: 1 }}>
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
                          >
                            <Temp
                              s_type={listItem.baseControlType}
                              readOnly={listItem.isLocked}
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
                  label={groupItem.name}
                  span={groupItem.colspan}
                >
                  <Form.Item
                    style={{ width: '100%' }}
                    name={groupItem.id}
                    rules={[
                      {
                        required: groupItem.isRequired,
                        message: `${groupItem.name}'必填!`,
                      },
                    ]}
                  >
                    <Temp
                      s_type={groupItem.baseControlType}
                      readOnly={groupItem.isLocked}
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
  }, [formList]);

  return (
    <Card title={`发起流程  /  ${title}-创建`}>
      <Form form={form} onFinish={values => console.log(values)}>
        {fromContent}
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={() => {
              // console.log(form.getFieldsValue())
              form.submit();
            }}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              alert(1);
            }}
          >
            返回
          </Button>
        </div>
      </Form>
    </Card>
  );
};
