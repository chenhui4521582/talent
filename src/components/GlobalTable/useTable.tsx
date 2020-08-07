import React, { useState, useEffect } from 'react';
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
  showCheck?: boolean | undefined;
}
const selectedType = 'checkbox';
export const useTable = ({
  queryMethod,
  columns,
  rowKeyName,
  paramName,
  paramValue,
  cacheKey,
  showCheck,
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

  const [selectPageObj, setSelectPageObj] = useState<any>({});

  const selectedRowKeys = () => {
    let arr = [];
    for (let key in selectPageObj) {
      arr = arr.concat(selectPageObj[key]);
    }
    return arr;
  };

  const rowSelection = {
    selectedType,
    onChange: (selectedRowKeys, selectedRows) => {
      let page = tableProps.pagination.current || 'none';
      let obj: any = JSON.parse(JSON.stringify(selectPageObj));
      obj[page] = selectedRowKeys;
      setSelectPageObj(obj);
    },

    selectedRowKeys: selectedRowKeys(),

    onSelectAll: (selected, selectedRows, changeRows) => {
      let arr: string[] = [];
      let page = tableProps.pagination.current || 'none';
      let obj: any = JSON.parse(JSON.stringify(selectPageObj));
      if (selected) {
        selectedRows?.map(item => {
          console.log(item);
          if (item) {
            arr.push(item[rowKeyName]);
          }
        });
        obj[page] = arr;
        setSelectPageObj(obj);
      } else {
        setSelectPageObj({});
      }
    },
  };

  const { reset, submit } = search;
  const Refresh = () => {
    reset();
    setSelectPageObj({});
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
                <Button
                  onClick={() => {
                    reset();
                    setSelectPageObj({});
                  }}
                  style={{ marginLeft: 16 }}
                >
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
          rowSelection={showCheck ? rowSelection : undefined}
        />
      </div>
    );
  };

  return {
    TableContent,
    refresh,
    Refresh,
    searchForm,
    selectKeys: selectedRowKeys(),
  };
};
