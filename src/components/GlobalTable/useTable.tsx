import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row } from 'antd';
import { useFormTable } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';
import './table.less';

interface useTablesParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
  rowKeyName: any;
  paramName?: string;
  paramValue?: string | number;
  cacheKey: string;
  showCheck?: boolean | undefined;
  noClearKey?: boolean | undefined;
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
  noClearKey,
}: useTablesParams) => {
  const [searchForm] = Form.useForm();
  const { tableProps, refresh, search } = useFormTable(
    async ({ current, pageSize }: PaginationTableParams) => {
      const data = searchForm.getFieldsValue();
      if (paramName) data[paramName] = paramValue;
      let response = await queryMethod({ pageNum: current, pageSize, ...data });
      let newList = JSON.parse(JSON.stringify(allList));
      newList = newList.concat(response.obj?.list);
      setAllList([...new Set(newList)]);
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
  tableProps.pagination.showTotal = () => {
    return `总计：${tableProps.pagination.total} 条`;
  };
  const [selectPageObj, setSelectPageObj] = useState<any>({});
  const [allList, setAllList] = useState<any[]>([]);
  const [defaultKeys, setDefaultKeys] = useState<number[]>([]);

  const selectedRowKeys = () => {
    let arr: number[] = [];
    if (defaultKeys) {
      arr = arr.concat(defaultKeys);
    }
    for (let key in selectPageObj) {
      arr = arr.concat(selectPageObj[key]);
    }
    return [...new Set(arr)];
  };

  const rowSelection = {
    selectedType,
    onChange: (selectedRowKeys, selectedRows) => {
      let page = tableProps.pagination.current || 'none';
      let obj: any = JSON.parse(JSON.stringify(selectPageObj));
      obj[page] = selectedRowKeys;
      setSelectPageObj(obj);
      if (defaultKeys) {
        setDefaultKeys([]);
      }
    },

    selectedRowKeys: selectedRowKeys(),

    onSelectAll: (selected, selectedRows, changeRows) => {
      let arr: string[] = [];
      let page = tableProps.pagination.current || 'none';
      let obj: any = JSON.parse(JSON.stringify(selectPageObj));
      if (selected) {
        selectedRows?.map(item => {
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
                <Button
                  type="primary"
                  onClick={() => {
                    if (noClearKey === true) {
                    } else {
                      setSelectPageObj({});
                    }
                    submit();
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    if (noClearKey === true) {
                    } else {
                      setSelectPageObj({});
                    }
                    reset();
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
          pagination={tableProps.pagination}
          bordered
          rowSelection={showCheck ? rowSelection : undefined}
          rowClassName={(record, index) => {
            if (index % 2 === 1) {
              return 'table-row';
            } else {
              return '';
            }
          }}
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
    allList: allList,
    selectedRowKeys: setDefaultKeys,
  };
};
