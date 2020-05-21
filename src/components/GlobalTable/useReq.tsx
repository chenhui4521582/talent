import React from 'react';
import { Table } from 'antd';
import { useRequest } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';

interface useTablesParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
  rowKeyName: string;
};

export const useReq = ({
  queryMethod, columns, rowKeyName
}: useTablesParams) => {
  const { tableProps, refresh } = useRequest(async ({ current, pageSize }: PaginationTableParams) => {
    let response = await queryMethod({pageNum: current, pageSize});
    return {
      total: response.obj?.total,
      list: response.obj?.list
    };
  }, {
    paginated: true,
    defaultPageSize: 10
  });

  const TableContent = () => {
    return(
      <div>
        <Table size="small" columns={columns} rowKey={rowKeyName} {...tableProps} />
      </div>
    )
  };

  return {
    TableContent,
    refresh
  };
}