import React from 'react';
import { Table, Button, Form, Row } from 'antd';
import { useFormTable } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';

interface useTablesParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
  rowKeyName: any;
  paramName?: string;
  paramValue?: string | number;
  cacheKey: string;
}

export const useTable = ({
  queryMethod,
  columns,
  rowKeyName,
  paramName,
  paramValue,
  cacheKey,
}: useTablesParams) => {
  const [searchForm] = Form.useForm();
  const { tableProps, refresh, search } = useFormTable(
    async ({ current, pageSize }: PaginationTableParams) => {
      const data = searchForm.getFieldsValue();
      if (paramName) data[paramName] = paramValue;
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
        <Table
          size="small"
          columns={columns}
          rowKey={rowKeyName}
          {...tableProps}
        />
      </div>
    );
  };

  return {
    TableContent,
    refresh,
    searchForm,
  };
};
