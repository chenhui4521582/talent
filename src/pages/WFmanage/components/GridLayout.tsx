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
import { PlusOutlined } from '@ant-design/icons';
import { roluList, roluFormList } from '../services/rule';
import MoveInOz from '@/pages/Framework/components/MoveInOz';
import GridLayout from 'react-grid-layout';

import '../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../node_modules/react-resizable/css/styles.css';
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
  name1?: string;
  name2?: string;
}

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

interface tsProps {
  ruleList?: tsLayout[];
  change?: () => {};
}

const add = {
  i: '+',
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  isDraggable: false,
  isResizable: false,
  static: true,
};

export default (props: tsProps) => {
  const { ruleList, change } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<tsLayout[]>();
  const [selectItem, setSelectItem] = useState<tsLayout>();
  const [ruleType, setRuleType] = useState<number>(1);

  useEffect(() => {
    let propsList = ruleList;
    if (propsList && propsList?.length) {
      propsList.push(add);
    } else {
      propsList = [add];
    }
    setList(propsList);
  }, [ruleList]);

  const handleShowModal = () => {
    setVisible(true);
  };

  const handleShowAdd = () => {
    setVisible(true);
  };

  const handleOkModal = () => {
    let jsonList: tsLayout[] = JSON.parse(JSON.stringify(list));
    if (jsonList.length > 11) {
      return null;
    }
    jsonList.splice(jsonList.length, 0, {
      i: jsonList.length + '',
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      name1: '1',
      name2: '2',
    });

    jsonList.map((item, index) => {
      if (item.i === '+') {
        jsonList[index].x = jsonList.length - 1;
      } else {
        jsonList[index].x = index - 1;
        jsonList[index].i = index.toString();
      }
    });
    console.log('list');
    console.log(jsonList);
    setList([...jsonList]);
    setVisible(false);
  };

  const renderList = useMemo(() => {
    return list?.map((item, index) => {
      if (item.i === '+') {
        return (
          <div
            className="add-item"
            key={item.i}
            onClick={() => {
              handleShowAdd();
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
      return (
        <div key={item.i}>
          <p>{item.name1}</p>
          <p>{item.name2}</p>
          {item.i}
        </div>
      );
    });
  }, [list]);

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
  }, [list]);

  return (
    <>
      <GridLayout
        className="layout"
        layout={list}
        cols={16}
        rowHeight={60}
        width={1200}
        style={{ marginBottom: 30 }}
        onLayoutChange={(e, k) => {
          // setApprovalLayout(e);
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
        {renderList}
      </GridLayout>
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
            <Radio value={1}>上级（自动设置通讯录中的上级领导为审批人）</Radio>
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
    </>
  );
};
