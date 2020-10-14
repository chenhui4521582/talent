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
} from 'antd';
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
        let res: GlobalResParams<tsStepObj> = await roluFormList(
          parseInt(idRes.obj[0].id),
        );
        if (res.status === 200) {
          handleList(res.obj.stepModelList);
          if (res.obj.stepModelList.length === 0) {
            data2 = [];
            data1 = [];
            setAddOrChange('add');
          } else {
            data1 = res.obj.stepModelList;
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

      if (item.type === 6) {
        item.nodeType = 4;
        if (list1.length >= 2) {
          let obj = list1[list1.length - 2];
          obj.nodeType = 3;
          list1[list1.length - 2] = obj;
        }
      }
    });

    let newControlModels = controlModels
      ? JSON.parse(JSON.stringify(controlModels))
      : null;
    newControlModels?.map(item => {
      delete item.controlShowName;
    });

    data.crudParam = newList;
    data.archiveControlParams = newControlModels;

    let api = updateRolu;
    if (addOrChange === 'add') {
      api = saveRolu;
    }

    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 1000);
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
    }
  };

  const getdata1 = value => {
    data1 = value;
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

  const getdata2 = value => {
    data2 = value;
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
          <Row style={{ height: 'auto' }}>
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
              <Col>异常处理</Col>
              <Col style={{ marginLeft: 20 }}>
                <Form.Item
                  name="illegalProcessType"
                  initialValue={1}
                  label="审批节点内成员离职、为空等情况的处理方式"
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
                  <Form.Item name="illegalUser">{renderUser}</Form.Item>
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
        title="成员或标签支持多选"
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
