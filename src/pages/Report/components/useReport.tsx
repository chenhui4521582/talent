import React from 'react';
import moment from 'moment';
import { Table, Button, Form, Row, Col, Select, DatePicker } from 'antd';
import { useFormTable } from '@umijs/hooks';
import { PaginationTableParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';
import { useBusiness } from '@/models/global'; 

const { RangePicker } = DatePicker;

interface useReportParams {
  queryMethod: (params: any) => Promise<any>;
  columns: ColumnProps<any>[];
};

export const useReport = ({
  queryMethod, columns
}: useReportParams) => {
  const { businessList } = useBusiness();
  const [searchForm] = Form.useForm();
  const { tableProps, refresh, search } = useFormTable(async ({ current, pageSize }: PaginationTableParams) => {
    const data = searchForm.getFieldsValue();
    if (data.rangeDate) {
      data.startDate = moment(data.rangeDate[0]).format('YYYY-MM-DD');
      data.endDate = moment(data.rangeDate[1]).format('YYYY-MM-DD');
    }
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

  const TableContent = () => {
    return(
      <div>
        <div>
          <Form form={searchForm}>
            <Row>
              <Col span={6}>
                <Form.Item
                  label="业务线"
                  name="businessId"
                >
                  <Select placeholder="请选择业务线">
                    {
                      businessList?.map(item => {
                        return <Select.Option value={item.businessId} key={item.businessId}>{item.businessLineName}</Select.Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} offset={2}>
                <Form.Item
                  label="时间范围"
                  name="rangeDate"
                >
                  <RangePicker />
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
        <Table size="small" columns={columns} rowKey={(_, i) => i as any} {...tableProps} />
      </div>
    )
  };

  return {
    TableContent,
    refresh
  };
}