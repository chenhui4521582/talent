import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Form, Row, Col } from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { list, roleList, updata, tsItem } from './servers/list';
import { GlobalResParams } from '@/types/ITypes';

import LevelOr from '@/components/GlobalTable/levelOr';

const sexHash = { 1: '男', 2: '女' };

export default () => {
  const columns: ColumnProps<tsItem>[] = [
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
      render: (_, record) => {
        return <span>{sexHash[record.sex]}</span>;
      },
    },
    {
      title: '一级业务',
      dataIndex: 'firstBusinessName',
      key: 'firstBusinessName',
      align: 'center',
    },
    {
      title: '二级业务',
      dataIndex: 'businessName',
      key: 'businessName',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '组别',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
    },
    {
      title: '技术岗位',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
  ];

  const { TableContent, searchForm } = useTable({
    queryMethod: list,
    columns,
    rowKeyName: 'employeeId',
    cacheKey: 'talent/role/listUserRole',
  });

  // const getRoleList = async ()=>{
  //   let json = await roleList()
  // }

  return (
    <Card title="用户角色管理">
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="一级业务">
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="二级业务">
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="部门">
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="组别">
              <LevelOr code="" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item label="工号">
              <Input placeholder="输入工号" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="姓名" name="name">
              <Input placeholder="输入姓名" />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
