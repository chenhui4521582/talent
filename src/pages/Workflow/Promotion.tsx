import React, { useState } from 'react';
import { Button, Card, Descriptions, Input } from 'antd';

export default () => {
  return (
    <Card title="发起流程/ 晋升-创建">
      <Descriptions title="人员晋升流程" bordered column={2}>
        <Descriptions.Item label="标题">
          <Input type="text" />{' '}
        </Descriptions.Item>
        <Descriptions.Item label="申请单号">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="申请人">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="分公司名称">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="申请人">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="分公司名称">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="申请人in">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="分公司名称">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="Config Info">
          <Input.TextArea />
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="晋升信息"
        bordered
        column={2}
        style={{ marginTop: 20 }}
      >
        <Descriptions.Item label="标题">
          <Input type="text" />{' '}
        </Descriptions.Item>
        <Descriptions.Item label="申请单号">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="申请人">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="分公司名称">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="申请人">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="分公司名称">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="申请人in">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="分公司名称">
          <Input type="text" />
        </Descriptions.Item>
        <Descriptions.Item label="Config Info" span={2}>
          <Input.TextArea />
        </Descriptions.Item>
        <Descriptions.Item label="Config Info">
          <Input.TextArea />
        </Descriptions.Item>
      </Descriptions>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" style={{ marginLeft: '40px', width: '120px' }}>
          提交
        </Button>
        <Button style={{ margin: '40px', width: '120px' }}>取消</Button>
      </div>
    </Card>
  );
};
