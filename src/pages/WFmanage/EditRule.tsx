import React, { useState, useMemo } from 'react';
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
import { PlusOutlined } from '@ant-design/icons';
import MoveInOz from '@/pages/Framework/components/MoveInOz';

import GridLayout from 'react-grid-layout';

import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import './style/rule.less';

const { Option } = Select;
interface tsLayout {
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
  const levelList = [
    '直接上级',
    '第二上级',
    '第三上级',
    '第四上级',
    '第五上级',
    '第六上级',
    '第七上级',
    '第八上级',
    '第九上级',
    '第十上级',
  ];
  const [approvalLayout, setApprovalLayout] = useState<tsLayout[]>([
    {
      i: '+',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      isDraggable: false,
      isResizable: false,
      static: true,
    },
  ]);
  const [ccLayout, setCcLayout] = useState<tsLayout[]>([
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
  const [ruleType, setRuleType] = useState<number>(1);

  const [form] = Form.useForm();

  const handleShowModal = () => {
    setVisible(true);
  };

  const handleOkModal = () => {
    let list = JSON.parse(JSON.stringify(approvalLayout));
    list.push({
      i: list.length + '',
      x: list.length - 1,
      y: 0,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
    });
    // list.map((item,index)=>{
    //   if(item.i==='+'){
    //     item.x= list.length-1;
    //   }else{
    //     item.i= index;
    //     item.x= index;
    //   }
    //   item.isDraggable=false;
    //   item.isResizable= false;
    // })
    console.log('list');
    console.log(list);
    setApprovalLayout([...list]);
    setVisible(false);
  };

  const renderCc = useMemo(() => {
    return ccLayout?.map((item, index) => {
      return (
        <div key={item.i} onClick={() => {}}>
          {item.i}
        </div>
      );
    });
  }, [ccLayout]);

  const renderApproval = useMemo(() => {
    console.log('approvalLayout');
    console.log(approvalLayout);
    return approvalLayout?.map((item, index) => {
      if (item.i === '+') {
        return (
          <div
            className="add-item"
            key={item.i}
            onClick={() => {
              handleShowModal();
            }}
          >
            <PlusOutlined
              style={{
                marginTop: 15,
                fontSize: 30,
              }}
            />
          </div>
        );
      }
      return <div key={item.i}>{item.i}</div>;
    });
  }, [approvalLayout]);

  // 会签或签
  const renderJointlySign = (type: string) => {
    // 1：审批，2：抄送
    return (
      <>
        <span style={{ marginTop: 6 }}>{type}</span>
        <Form.Item name="stepType" initialValue={1} style={{ marginTop: 4 }}>
          <Radio.Group>
            <Radio value={1}>会签（ 须所有上级同意 ）</Radio>
            <br />
            <Radio value={2}>或签（ 一名上级同意即可 ）</Radio>
          </Radio.Group>
        </Form.Item>
      </>
    );
  };
  // 类型
  const rendType1 = () => {
    return (
      <>
        <span style={{ marginBottom: 6 }}>指定级别</span>
        <Form.Item
          name="specifiedLevel"
          initialValue={1}
          style={{ marginTop: 4 }}
        >
          <Select placeholder="请选择级别" style={{ maxWidth: '12vw' }}>
            {levelList.map((item, index) => {
              return (
                <Option key={index} value={index + 1}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </>
    );
  };
  // 模态框下面主体
  const renderModalBottom = useMemo(() => {
    switch (ruleType) {
      case 1:
        return (
          <>
            {rendType1()}
            {renderJointlySign('同时有多个上级时')}
          </>
        );
      case 2:
        return 2;
      case 3:
        return (
          <>
            {renderJointlySign('请选择标签审批方式')}
            <MoveInOz
              renderUser={true}
              onlySelectUser={true}
              // ref={formRef}
              renderDefault={true}
            />
          </>
        );
      case 4:
        return null;
      case 5:
        return 5;
      default:
        return rendType1();
    }
  }, [ruleType]);

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
            <GridLayout
              className="layout"
              layout={approvalLayout}
              cols={16}
              rowHeight={60}
              width={1200}
              style={{ marginBottom: 30 }}
              onLayoutChange={(e, k) => {
                setApprovalLayout(e);
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

        {/* <Row>
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
        </Row> */}
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

        <Modal
          width="46vw"
          title="设置"
          visible={visible}
          okText="确认"
          cancelText="取消"
          onCancel={() => {
            setVisible(false);
          }}
          onOk={handleOkModal}
        >
          <Form.Item name="type" initialValue={ruleType}>
            <Radio.Group
              onChange={e => {
                const { value } = e.target;
                setRuleType(value);
              }}
              value={ruleType}
            >
              <Radio value={1}>
                上级（自动设置通讯录中的上级领导为审批人）
              </Radio>
              <br />
              <Radio value={2}>标签</Radio> <br />
              <Radio value={3}>指定成员</Radio> <br />
              <Radio value={4}>申请人</Radio> <br />
              <Radio value={5}>动态标签</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          {renderModalBottom}
        </Modal>
      </Form>
    </Card>
  );
};
