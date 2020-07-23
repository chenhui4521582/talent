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
import {
  updateRolu,
  getStepId,
  roluFormList,
  tsStep,
  tsStepObj,
} from './services/rule';
import { GlobalResParams } from '@/types/ITypes';
import GridLayout from './components/GridLayout';
interface tsGetId {
  id: string;
  isDefault: string;
  name: string;
}
// stepType  类型；类型 1：审批，2：抄送 ,
export default props => {
  const [listOne, setListOne] = useState<tsStep[]>([]);
  const [listTwo, setListTwo] = useState<tsStep[]>([]);
  const [stepType, setStepType] = useState<1 | 2 | 3>(1);
  const [fromName, setFromName] = useState<string>('审批流程');

  let data1 = [];
  let data2 = [];

  useEffect(() => {
    const id = props.match.params.id;
    async function getDetail() {
      let idRes: GlobalResParams<tsGetId[]> = await getStepId(parseInt(id));
      if (idRes.status === 200) {
        if (idRes.obj.length) {
          setFromName(idRes.obj[0].name);
          let res: GlobalResParams<tsStepObj> = await roluFormList(
            parseInt(idRes.obj[0].id),
          );
          if (res.status === 200) {
            setStepType(res.obj.noticeStatus);
            handleList(res.obj.stepModelList);
          }
        }
      }
    }
    getDetail();
  }, [props.match.params.id]);

  const handleList = data => {
    let list1: tsStep[] = [];
    let list2: tsStep[] = [];
    data.map((item: tsStep) => {
      if (item.stepType === 1) {
        list1.push(item);
      } else {
        list2.push(item);
      }
    });
    setListOne(list1);
    setListTwo(list2);
  };
  const submitData = () => {
    console.log(data1);
    console.log(data2);
  };

  const getdata1 = value => {
    data1 = value;
  };

  const getdata2 = value => {
    data2 = value;
  };

  // 模态框下面主体
  return (
    <Card
      title="工作流列表/招聘/规则设置"
      extra={<Button type="primary" onClick={submitData}>{`保存`}</Button>}
    >
      <h4 style={{ margin: '15px 0' }}>{fromName}</h4>
      <Divider />
      <Row>
        <Col>默认审批人</Col>
        <Col span={18} offset={1}>
          <GridLayout {...props} ruleList={listOne} change={getdata1} />
        </Col>
      </Row>

      <Row>
        <Col>默认抄送人</Col>
        <Col span={18} offset={1}>
          <GridLayout {...props} ruleList={listTwo} change={getdata2} />
        </Col>
      </Row>
      <Divider />

      <Row style={{ marginTop: 20 }}>
        <Col>抄送通知</Col>
        <Col style={{ marginLeft: 20 }}>
          <Radio.Group
            onChange={e => {
              const { value } = e.target;
              setStepType(value);
            }}
            value={stepType}
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
    </Card>
  );
};
