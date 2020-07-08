import React, { useState } from 'react';
import { Table, Button, Form, Row, Tabs } from 'antd';
import { useFormTable } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';
import { useUpdateEffect } from '@umijs/hooks';

const { TabPane } = Tabs;

interface TabDataParams {
  name: string;
  value: string;
}

interface useTablesParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
  paramName: string;
  defaultValue: string;
  tabData: TabDataParams[];
  rowKeyName: string;
  cacheKey: string;
}

export const useTabTable = ({
  queryMethod,
  columns,
  paramName,
  defaultValue,
  tabData,
  rowKeyName,
  cacheKey,
}: useTablesParams) => {
  const [searchForm] = Form.useForm();
  const [curKey, setCurKey] = useState(defaultValue);
  const { tableProps, refresh, search } = useFormTable(
    async ({ current, pageSize }: PaginationTableParams) => {
      const data = searchForm.getFieldsValue();
      data[paramName] = curKey;
      let response = await queryMethod({ pageNum: current, pageSize, ...data });
      return {
        total: response.obj?.total,
        list: response.obj?.list,
      };
    },
    {
      defaultPageSize: 10,
      form: searchForm,
      cacheKey: cacheKey,
    },
  );

  const { reset, submit } = search;

  useUpdateEffect(() => {
    refresh();
  }, [curKey]);

  const tabChange = (key: string) => {
    searchForm.resetFields();
    setCurKey(key);
  };

  const TableContent = ({ children }) => {
    return (
      <div>
        <div>
          <Form form={searchForm}>
            {children}
            <Row>
              <Form.Item
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
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
          {tabData.map(item => {
            return (
              <TabPane tab={item.name} key={item.value}>
                <Table
                  size="small"
                  columns={columns}
                  rowKey={rowKeyName}
                  {...tableProps}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  };

  return {
    TableContent,
    refresh,
    curKey,
  };
};
