import React, { useState } from 'react';
import { Table, Button, Form, Row, Tabs, Col, Input } from 'antd';
import { useFormTable } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { useUpdateEffect } from '@umijs/hooks';

const { TabPane } = Tabs;

interface TabDataParams {
  name: string;
  value: string;
  columns: any[];
}

interface useTabParams {
  queryMethod: (params: any) => Promise<any>;
  paramName: string;
  defaultValue: string;
  tabData: TabDataParams[];
  rowKeyName: string;
};

export const useTab = ({
  queryMethod, paramName, defaultValue, tabData, rowKeyName
}: useTabParams) => {
  const [searchForm] = Form.useForm();
  const [curKey, setCurKey] = useState(defaultValue);
  const { tableProps, refresh, search } = useFormTable(async ({ current, pageSize }: PaginationTableParams) => {
    const data = searchForm.getFieldsValue();
    data[paramName] = curKey;
    let response = await queryMethod({pageNum: current, pageSize, ...data});
    return {
      total: response.obj?.total,
      list: response.obj?.list
    };
  }, {
    defaultPageSize: 10,
    form: searchForm
  });

  const { reset, submit } = search;

  useUpdateEffect(() => {
    refresh();
  }, [curKey]);

  const tabChange = (key: string) => {
    searchForm.resetFields();
    setCurKey(key);
  };

  const TableContent = () => {
    return(
      <div>
        <div>
          <Form form={searchForm}>
            <Row>
              <Col span={6}>
                <Form.Item
                  label="编号"
                  name="resumeId"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6} offset={2}>
                <Form.Item
                  label="姓名"
                  name="name"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={submit}>
                  查询
                </Button>
                <Button onClick={reset} style={{ marginLeft: 16 }}>
                  重置
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </div>
        <Tabs activeKey={curKey} onChange={tabChange} animated type="card">
          {
            tabData.map(item => {
              return (
                <TabPane tab={item.name} key={item.value}>
                  <Table size="small" columns={item.columns} rowKey={rowKeyName} {...tableProps} />
                </TabPane>
              )
            })
          }
        </Tabs>
      </div>
    )
  };

  return {
    TableContent,
    refresh,
    curKey
  };
}