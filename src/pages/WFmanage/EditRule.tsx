import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card,
  Button,
  Divider,
  Row,
  Col,
  Radio,
  notification,
  Form,
  Modal,
  message,
} from 'antd';
import {
  updateRolu,
  saveRolu,
  getStepId,
  roluFormList,
  tsStep,
  tsStepObj,
  listWithCondition,
  saveWithConditon,
  updateWithCondition,
} from './services/rule';
import { GlobalResParams } from '@/types/ITypes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridLayout from './components/GridLayout';
import Organization from '@/pages/Framework/components/Organization';
interface tsGetId {
  id: string;
  isDefault: string;
  name: string;
}
// stepType  类型；类型 1：审批，2：抄送 ,
let data1: any = [];
let data2 = [];
let flag = true;
export default props => {
  const [listOne, setListOne] = useState<tsStep[]>([]);
  const [listTwo, setListTwo] = useState<tsStep[]>([]);
  const [fromName, setFromName] = useState<string>('审批流程');
  const [addOrChange, setAddOrChange] = useState<'add' | 'change'>('change');
  const [controlModels, setControlModels] = useState<any[]>();
  const [formId, setFormId] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [userShow, setUserShow] = useState<boolean>(false);
  const [selectUserKey, setSelectUserKey] = useState<string[]>([]);
  const [form] = Form.useForm();
  const ref = useRef<any>();
  let archiveControlParams: any = [];

  useEffect(() => {
    getDetail();
  }, [props.match.params.id]);

  async function getDetail() {
    const id = props.match.params.id;
    let idRes: GlobalResParams<tsGetId[]> = await getStepId(parseInt(id));
    if (idRes.status === 200) {
      if (idRes.obj.length) {
        setFromName(idRes.obj[0].name);
        setFormId(idRes.obj[0].id);
        // let res: GlobalResParams<tsStepObj> = await roluFormList(
        let res: GlobalResParams<any> = await listWithCondition(
          parseInt(idRes.obj[0].id),
        );
        if (res.status === 200) {
          if (res.obj?.steps?.length === 0) {
            setAddOrChange('add');
            handleList({});
          } else {
            handleList(res.obj);
            setAddOrChange('change');
          }
        }
      }
    }
  }

  const handleList = data => {
    setListOne(data);
  };

  const submitData = async () => {
    form.validateFields().then(async fromSubData => {
      let warnStr: any = undefined;
      data1?.ruleSets?.map(item => {
        if (item.isDefault !== 1) {
          if (
            !item?.resRuleCurdParams ||
            !item.priority ||
            !item?.resRuleCurdParams?.length
          ) {
            warnStr = '请编辑条件' + item.name + '后再提交';
          }
        }
        item?.resRuleCurdParams?.map(items => {
          items.value = JSON.stringify(items.value);
        });
        // item = item;
        item.resApprovalId = formId;
      });
      if (warnStr) {
        message.warning(warnStr);
        return;
      }
      data1.autoType = fromSubData.autoType;
      data1.illegalProcessType = fromSubData.illegalProcessType;
      let illegalProcessorName: any = [];
      let illegalProcessorNumber: any = [];
      if (fromSubData.illegalProcessType === 2) {
        fromSubData.illegalUser?.map(item => {
          illegalProcessorName.push(item.title);
          illegalProcessorNumber.push(item.key);
        });
        data1.illegalProcessorName = illegalProcessorName.join(',');
        data1.illegalProcessorNumber = illegalProcessorNumber.join(',');
      }
      data1.noticeStatus = 1;
      // let api = saveWithConditon;
      console.log(data1);
      let api = updateWithCondition;
      if (addOrChange === 'add') {
        api = saveWithConditon;
      }
      if (flag) {
        flag = false;
        setTimeout(() => {
          flag = true;
        }, 1000);
        let res: GlobalResParams<string> = await api(data1);
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
      }
    });
  };

  const getdata1 = value => {
    console.log(value);
    // data1 = value;
    let ruleSets: any = [];
    let steps: any = [];

    const droopData1 = data => {
      let newData = data;
      function handleData(listItem) {
        listItem?.map((item, index) => {
          if (item.poi != '0-0') {
            steps.push({
              ...item,
              nextNodeId: listItem[index + 1]
                ? listItem[index + 1].poi
                : undefined,
            });
          }

          item.ruleList?.map((ruleItem, ruleItemIndex) => {
            if (item.poi != '0-0') {
              ruleSets.push({
                name: ruleItem.name,
                priority: ruleItem.priority,
                resRuleCurdParams: ruleItem.resRuleCurdParams,
                isDefault: ruleItem.isDefault,
                fromNodeId: item.poi,
                toNodeId: item.poi + '-' + ruleItemIndex + '-' + '0',
              });
            }
            handleData(ruleItem?.list);
          });
        });
      }
      return handleData(newData);
    };
    droopData1(value);
    steps?.map((item, index) => {
      item.stepType = 1;
      item.stepNumber = index;
      if (item.nextNodeId === 'undefined' || !item.nextNodeId) {
        delete item.nextNodeId;
      }
      if (item?.id && item?.id?.toString().indexOf('add') > -1) {
        item.nodeId = item.poi;
        delete item.id;
      }
      if (item.ruleList >= 2) {
        item.condition = 1;
      } else {
        item.condition = 0;
      }
      item.nodeId = item.poi;
      delete item.ruleList;
      delete item.poi;
      item.resApprovalId = formId;
      item.nodeType = 2;
      if (index === 0) {
        item.nodeType = 1;
      }

      if (index === steps?.length - 1) {
        item.nodeType = 3;
      }

      if (item.type === 6) {
        if (index === steps?.length - 1) {
          item = {
            nodeType: 4,
            archiveControlParams: item.archiveControlParams,
            archiveId: item.archiveId,
          };
        } else {
          steps[index - 1] = {
            nodeType: 3,
            archiveControlParams: item.archiveControlParams,
            archiveId: item.archiveId,
          };
        }
      } else {
        delete item.archiveId;
        delete item.archiveControlParams;
      }
      if (steps.length === 1) {
        item.nodeType = 1;
      }
      if (steps.length === 2) {
        steps[0].nodeType = 1;
        steps[1].nodeType = 2;
      }
      if (item.type === 6) {
        item.nodeType = 4;
      }
      item.stepType = 1;
      item.stepNumber = index;
    });

    ruleSets?.map(item => {
      item.resApprovalId = formId;
    });

    console.log(ruleSets);
    console.log(steps);
    data1 = {
      ruleSets,
      steps,
    };
  };

  const getArchiveControlParams = value => {
    archiveControlParams = [];
    for (let key in value) {
      if (value.id) {
        archiveControlParams.push({
          resApprArchiveDemandId: key,
          resFormControlId: value[key],
          id: value.id,
        });
      } else {
        archiveControlParams.push({
          resApprArchiveDemandId: key,
          resFormControlId: value[key],
        });
      }
    }
    setControlModels(archiveControlParams);
  };

  const handleUserOk = () => {
    console.log(ref.current.getvalue());
    form.setFieldsValue({ illegalUser: ref.current.getvalue() });
    setVisible(false);
  };

  const renderUser = useMemo(() => {
    console.log(form.getFieldValue('illegalUser'));
    let user = form.getFieldValue('illegalUser');
    if (!user) {
      return (
        <a
          onClick={() => {
            setVisible(true);
          }}
        >
          添加
        </a>
      );
    } else {
      return (
        <>
          <span
            onClick={() => {
              setVisible(true);
            }}
          >
            {user[0].title}
          </span>
          <a
            style={{ marginLeft: 6 }}
            onClick={() => {
              setVisible(true);
              setSelectUserKey([user[0].key]);
            }}
          >
            修改
          </a>
        </>
      );
    }
  }, [form.getFieldValue('illegalUser'), selectUserKey]);
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Card
          title="规则设置"
          extra={<Button type="primary" onClick={submitData}>{`保存`}</Button>}
        >
          <h4 style={{ margin: '15px 0' }}>{fromName}</h4>
          <Divider />
          <Row style={{ height: 'auto', width: '80vw' }}>
            <Col style={{ marginTop: 14 }}>默认审批人</Col>
            <Col span={18}>
              <GridLayout
                {...props}
                ruleList={listOne}
                change={getdata1}
                controlModels={controlModels}
                getArchiveControlParams={getArchiveControlParams}
              />
            </Col>
          </Row>

          <Form layout="vertical" form={form}>
            <Row style={{ marginTop: 20 }}>
              <Col>自动审批</Col>
              <Col style={{ marginLeft: 20 }}>
                <Form.Item
                  name="autoType"
                  initialValue={1}
                  label="当同一个审批人重复审批同一工作流时"
                  rules={[{ required: true, message: '请选择!' }]}
                >
                  <Radio.Group>
                    <Radio value={1} style={{ display: 'block' }}>
                      每个节点都需要审批
                    </Radio>
                    <Radio style={{ marginTop: 5, display: 'block' }} value={2}>
                      仅连续审批自动同意
                    </Radio>
                    <Radio style={{ marginTop: 5, display: 'block' }} value={3}>
                      仅首个节点需审批，其余自动同意
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col>异常处理</Col>
              <Col style={{ marginLeft: 20 }}>
                <Form.Item
                  name="illegalProcessType"
                  initialValue={1}
                  label="审批节点内成员离职、为空等情况的处理方式"
                  rules={[{ required: true, message: '请选择!' }]}
                >
                  <Radio.Group
                    onChange={e => {
                      console.log(e.target.value);
                      if (e.target.value === 1) {
                        setUserShow(false);
                      } else {
                        setUserShow(true);
                      }
                    }}
                  >
                    <Radio value={1}>自动同意</Radio>
                    <br />
                    <Radio style={{ marginTop: 5 }} value={2}>
                      转交给固定人
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            {userShow ? (
              <Row style={{ marginTop: 20 }}>
                <Col>异常处理人</Col>
                <Col style={{ marginLeft: 20 }}>
                  <Form.Item
                    name="illegalUser"
                    label="请添加人员"
                    rules={[{ required: true, message: '请选择!' }]}
                  >
                    {renderUser}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </Form>
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
      <Modal
        width="45vw"
        title="选择异常处理人（只支持单选）"
        visible={visible}
        okText="确认"
        cancelText="返回"
        onCancel={() => {
          setVisible(false);
        }}
        onOk={handleUserOk}
      >
        <Organization
          ref={ref}
          onlySelectUser={true}
          renderUser={true}
          onlySelect={true}
          selectKeys={selectUserKey}
        />
      </Modal>
    </>
  );
};
