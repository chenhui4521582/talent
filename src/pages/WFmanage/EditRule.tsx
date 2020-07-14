import React, { useState, useMemo } from 'react';
import { Card, Button, Divider, Row, Col, Modal, Radio } from 'antd';
import GridLayout from 'react-grid-layout';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';

interface layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean | undefined;
  maxW?: number;
  maxH?: number;
  minW?: number;
  minH?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export default () => {
  const [approvalLayout, setApprovalLayout] = useState<layout[]>([
    {
      i: '+',
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      isDraggable: false,
      isResizable: false,
    },
  ]);
  const [ccLayout, setCcLayout] = useState<layout[]>([
    {
      i: '+',
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      isDraggable: false,
      isResizable: false,
    },
  ]);
  const [visible, setVisible] = useState<boolean>(false);

  const renderApproval = useMemo(() => {
    return approvalLayout?.map((item, index) => {
      return <div key={item.i}>{item.i}</div>;
    });
  }, [approvalLayout]);

  const renderCc = useMemo(() => {
    return ccLayout?.map((item, index) => {
      return (
        <div key={item.i} onClick={() => {}}>
          {item.i}
        </div>
      );
    });
  }, [ccLayout]);

  return (
    <Card
      title="工作流列表/招聘/规则设置"
      extra={<Button type="primary">{`保存`}</Button>}
    >
      <h4 style={{ margin: '15px 0' }}>审批流程</h4>
      <Divider />
      <Row>
        <Col>默认审批人</Col>
        <Col span={18} offset={1}>
          <GridLayout
            className="layout"
            layout={approvalLayout}
            cols={18}
            rowHeight={18}
            width={1200}
            style={{ marginBottom: 30 }}
            onLayoutChange={(e, k) => {
              console.log('onLayoutChange');
              console.log(e);
              console.log(k);
            }}
            onBreakpointChange={(e, k) => {
              console.log('onBreakpointChange');
              console.log(e);
              console.log(k);
            }}
          >
            {renderApproval}
          </GridLayout>
        </Col>
      </Row>

      <Row>
        <Col>默认抄送人</Col>
        <Col span={18} offset={1}>
          <GridLayout
            className="layout"
            layout={ccLayout}
            cols={18}
            rowHeight={18}
            width={1200}
            onLayoutChange={(e, k) => {
              console.log('onLayoutChange');
              console.log(e);
              console.log(k);
            }}
            onBreakpointChange={(e, k) => {
              console.log('onBreakpointChange');
              console.log(e);
              console.log(k);
            }}
          >
            {renderCc}
          </GridLayout>
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
            <Radio value={2}>审批通过后抄送</Radio> <br />
            <Radio value={3}>提交申请时和审批通过后都抄送</Radio>
          </Radio.Group>
        </Col>
      </Row>

      <Modal title="设置" visible={true}>
        <Radio.Group
          onChange={e => {
            console.log(e);
          }}
        >
          <Radio value={1}>上级（自动设置通讯录中的上级领导为审批人）</Radio>
          <br />
          <Radio value={2}>标签</Radio> <br />
          <Radio value={3}>指定成员</Radio> <br />
          <Radio value={4}>申请人</Radio> <br />
          <Radio value={4}>动态标签</Radio>
        </Radio.Group>
      </Modal>
    </Card>
  );
};
