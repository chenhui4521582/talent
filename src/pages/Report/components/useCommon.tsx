import React from 'react';
import { Table } from 'antd';
import { useRequest } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';

interface useCommonParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
};

export const useCommon = ({
  queryMethod, columns
}: useCommonParams) => {
  const { tableProps } = useRequest(async ({ current, pageSize }: PaginationTableParams) => {
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
        <Table size="small" columns={columns} rowKey={(_, i) => i as any} {...tableProps} />
      </div>
    )
  };

  return {
    TableContent
  };
}