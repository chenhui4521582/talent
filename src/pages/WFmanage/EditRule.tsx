import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Button,
  Divider,
  Row,
  Col,
  Modal,
  Radio,
  Form,
  Select,
} from 'antd';
import { roluList, roluFormList } from './services/rule';
import GridLayout from './components/GridLayout';

export default props => {
  useEffect(() => {
    const id = props.match.params.id;
    async function getDetail() {
      let res = await roluFormList(id);
    }
    getDetail();
  }, [props.match.params.id]);

  const [form] = Form.useForm();
  // 模态框下面主体
  return (
    <Card
      title="工作流列表/招聘/规则设置"
      extra={<Button type="primary">{`保存`}</Button>}
    >
      <Form form={form}>
        <h4 style={{ margin: '15px 0' }}>审批流程</h4>
        <Divider />
        <Row>
          <Col>默认审批人</Col>
          <Col span={18} offset={1}>
            <GridLayout {...props} />
          </Col>
        </Row>

        <Row>
          <Col>默认抄送人</Col>
          <Col span={18} offset={1}>
            <GridLayout {...props} />
          </Col>
        </Row>
        <Divider />

        <Row style={{ marginTop: 20 }}>
          <Col>默认审批人</Col>
          <Col style={{ marginLeft: 20 }}>
            <Radio.Group
              onChange={e => {
                console.log(e);
              }}
            >
              <Radio value={1}>提交申请时抄送</Radio>
              <br />
              <Radio style={{ marginTop: 5 }} value={2}>
                审批通过后抄送
              </Radio>{' '}
              <br />
              <Radio style={{ marginTop: 5 }} value={3}>
                提交申请时和审批通过后都抄送
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
