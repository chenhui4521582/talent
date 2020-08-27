import React, { useState, useEffect } from 'react';
import { Card, Button, Divider, Row, Col, Radio, notification } from 'antd';
import {
  updateRolu,
  saveRolu,
  getStepId,
  roluFormList,
  tsStep,
  tsStepObj,
} from './services/rule';
import { GlobalResParams } from '@/types/ITypes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridLayout from './components/GridLayout';
interface tsGetId {
  id: string;
  isDefault: string;
  name: string;
}
// stepType  类型；类型 1：审批，2：抄送 ,
let data1 = [];
let data2 = [];
export default props => {
  const [listOne, setListOne] = useState<tsStep[]>([]);
  const [listTwo, setListTwo] = useState<tsStep[]>([]);
  const [fromName, setFromName] = useState<string>('审批流程');
  const [addOrChange, setAddOrChange] = useState<'add' | 'change'>('change');
  const [controlModels, setControlModels] = useState<any[]>();
  const [formId, setFormId] = useState<string>();
  let archiveControlParams: any = [];

  useEffect(() => {
    getDetail();
  }, [props.match.params.id]);

  async function getDetail() {
    data2 = [];
    data1 = [];
    const id = props.match.params.id;
    let idRes: GlobalResParams<tsGetId[]> = await getStepId(parseInt(id));
    if (idRes.status === 200) {
      if (idRes.obj.length) {
        setFromName(idRes.obj[0].name);
        setFormId(idRes.obj[0].id);
        let res: GlobalResParams<tsStepObj> = await roluFormList(
          parseInt(idRes.obj[0].id),
        );
        if (res.status === 200) {
          handleList(res.obj.stepModelList);
          if (res.obj.stepModelList.length === 0) {
            setAddOrChange('add');
          } else {
            setAddOrChange('change');
            setControlModels(res.obj.controlModels);
          }
        }
      }
    }
  }

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
    setListOne(list1.sort(compare('stepNumber')));
    setListTwo(list2.sort(compare('stepNumber')));
  };

  const compare = (name: string) => {
    return (a, b) => {
      let v1 = a[name];
      let v2 = b[name];
      if (v2 > v1) {
        return -1;
      } else if (v2 < v1) {
        return 1;
      } else {
        return 0;
      }
    };
  };

  const submitData = async () => {
    let data: any = {};
    let list1: any = [];
    let list2: any = [];
    data1.map((item: any) => {
      item.stepType = 1;
      if ((item.id + '')?.indexOf('add') > -1) {
        delete item.id;
      }
      item.resApprovalId = formId;
      list1.push(item);
    });
    data2.map((item: any) => {
      item.stepType = 2;
      if ((item.id + '').indexOf('add') > -1) {
        delete item.id;
      }
      item.resApprovalId = formId;
      list2.push(item);
    });
    list1 = list1.concat(list2);
    list1.map((item, index) => {
      if (item.type === 6) {
        delete item.stepNumber;
        delete item.resFormControlIds;
      } else {
        item.stepNumber = index + 1;
      }
    });
    data.noticeStatus = 1;

    let newList = list1.concat(list2);
    newList.map((item, i) => {
      if (i === 0) {
        item.nodeType = 1;
      } else if (i === list1?.length - 1) {
        item.nodeType = 3;
      } else {
        item.nodeType = 2;
      }
    });

    data.crudParam = newList;
    data.archiveControlParams = controlModels;

    let api = updateRolu;
    if (addOrChange === 'add') {
      api = saveRolu;
    }

    let res: GlobalResParams<string> = await api(data);
    if (res.status === 200) {
      getDetail();

      notification['success']({
        message: res.msg,
        description: '',
      });
    } else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };

  const getdata1 = value => {
    data1 = value;
  };

  const getArchiveControlParams = value => {
    console.log(value);
    archiveControlParams = [];
    for (let key in value) {
      archiveControlParams.push({
        resApprArchiveDemandId: key,
        resFormControlId: value[key],
      });
    }
    setControlModels(archiveControlParams);
  };

  const getdata2 = value => {
    data2 = value;
  };

  // 模态框下面主体
  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        title="规则设置"
        extra={<Button type="primary" onClick={submitData}>{`保存`}</Button>}
      >
        <h4 style={{ margin: '15px 0' }}>{fromName}</h4>
        <Divider />
        <Row>
          <Col>默认审批人</Col>
          <Col span={18} offset={1}>
            <GridLayout
              {...props}
              ruleList={listOne}
              change={getdata1}
              controlModels={controlModels}
              getArchiveControlParams={getArchiveControlParams}
            />
          </Col>
        </Row>

        {/* <Row>
          <Col>默认抄送人</Col>
          <Col span={18} offset={1}>
            <GridLayout {...props} ruleList={listTwo} change={getdata2} />
          </Col>
        </Row>
        <Divider /> */}

        {/* <Row style={{ marginTop: 20 }}>
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
        </Row> */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button
            onClick={() => {
              window.history.go(-1);
            }}
          >
            {' '}
            返回{' '}
          </Button>
        </div>
      </Card>
    </DndProvider>
  );
};
