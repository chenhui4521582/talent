import React from 'react';
import { Table } from 'antd';
import { useRequest, useFormTable } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';

interface useTablesParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
  rowKeyName: string;
  cacheKey: string;
}

export const useReq = ({
  queryMethod,
  columns,
  rowKeyName,
  cacheKey,
}: useTablesParams) => {
  const { tableProps, refresh } = useRequest(
    async ({ current, pageSize }: PaginationTableParams) => {
      let response = await queryMethod({ pageNum: current, pageSize });
      return {
        total: response.obj?.total,
        list: response.obj?.list || response.obj,
      };
    },
    {
      paginated: true,
      defaultPageSize: 10,
      cacheKey: cacheKey,
    },
  );

  const TableContent = () => {
    return (
      <div>
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
  };
};
