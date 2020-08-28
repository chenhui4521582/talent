import React, { useState, useMemo, useEffect } from 'react';
import {
  Divider,
  Collapse,
  Input,
  Modal,
  Radio,
  Form,
  Select,
  message,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import {
  getFormSimple,
  tsStep,
  ItemTypes,
  getLableList as handleLable,
  getParam,
} from '../services/rule';
import { GlobalResParams } from '@/types/ITypes';
import { getLableList } from '@/pages/Framework/services/role';
import { useDrop } from 'react-dnd';
import MoveInOz from '@/pages/Framework/components/MoveInOz';
import Assembly from './Assembly';
import SystemLabel from './SystemLabel';
import Card from './Card';

import './style/rule.less';

interface tsRolrLable {
  id: number;
  name: string;
  status: number;
  updatedBy: string | null;
}

const { Option } = Select;
const { Panel } = Collapse;

interface tsLabel {
  id: string;
  labelName: string;
}

interface IFile {
  controlShowName: string;
  id: number;
}

interface IListItem {
  id: string;
  isGroup: 0 | 1;
  name: string;
  type: string;
  key: string;
  title: string;
  labelName: string;
  isLocked?: number;
  childName: string;
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

const typeObj = {
  1: '上级',
  2: '标签',
  3: '指定成员',
  4: '申请人',
  5: '系统标签',
  6: '归档',
};

let userkeyList;
let controlId;
let systemObj;

// type 审批类型；   1：上级，2：标签，3：单个成员，4：申请人，5：系统标签 6.归档,
// signType : 0：会签，1：或签 在审批类型为上级和标签时有效 ,
// nodeType : 节点类型 1:开始节点;2:中间节点;3:结束节点
// specifiedLevel

export default props => {
  const { ruleList, controlModels, change, getArchiveControlParams } = props;
  const [list, setList] = useState<tsStep[]>();
  const [, drop] = useDrop({
    accept: ItemTypes.Card,
  });

  const [form] = Form.useForm();
  const [nameForm] = Form.useForm();
  const [labelList, setLabelList] = useState<tsLabel[]>();
  const [edit, setEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<number | undefined>(1);
  const [selectObj, setSelectObj] = useState<tsStep>();
  const [name, setName] = useState<string>();
  const [cardIndex, setCardIndex] = useState<number>();
  const [handleList, setHandleList] = useState<tsRolrLable[]>();
  const [paramForm] = Form.useForm();
  const [param, setParam] = useState<IFile[]>([]);
  const [controlList, setControlList] = useState<IListItem[]>();
  const [isFiles, setIsFiles] = useState<boolean>(false);

  useEffect(() => {
    async function getLable() {
      let json: GlobalResParams<tsLabel[]> = await getLableList();
      if (json.status === 200) {
        setLabelList(json.obj);
      }

      let res: GlobalResParams<IListItem[]> = await getFormSimple(
        props?.match.params.id,
      );
      if (res.status === 200) {
        setControlList(res.obj);
      }
    }

    const getApilableList = async () => {
      let json: GlobalResParams<tsRolrLable[]> = await handleLable();
      if (json.status === 200) {
        setHandleList(json.obj);
      }
    };

    getApilableList();
    getLable();
  }, []);

  useEffect(() => {
    setList(ruleList);
  }, [ruleList]);

  useEffect(() => {
    change && change(list);
    list?.map(item => {
      if (item.type === 6) {
        setIsFiles(true);
      }
    });
  }, [list]);

  const moveCard = (index, index1) => {
    console.log(index, index1);
    let newList = JSON.parse(JSON.stringify(list));
    let dragCard = newList[index];

    newList = update(newList, {
      $splice: [
        [index, 1],
        [index1, 0, dragCard],
      ],
    });

    newList?.map((item, index) => {
      item.stepNumber = index;
    });

    setList(newList);
  };

  const handleHiddleModal = () => {
    userkeyList = '';
    controlId = [];
    systemObj = {};
    form.setFieldsValue({
      type: undefined,
      specifiedLevel: undefined,
      signType: undefined,
      labelId: undefined,
    });
    setType(1);
    setSelectObj(undefined);
    setVisible(false);
  };

  // 新增的确认
  const handleAddOkModal = () => {
    form.validateFields().then(value => {
      let listObj: any = JSON.parse(JSON.stringify(list));
      let obj = value;
      obj.stepName = typeObj[type || 1];
      obj.resFormControlIds = controlId;
      obj.id = listObj.length + 'add';
      if (type === 6) {
        paramForm.validateFields().then(value1 => {
          getArchiveControlParams(value1);
          listObj.push(obj);
          setList(listObj);
          form.setFieldsValue({
            type: undefined,
            specifiedLevel: undefined,
            signType: undefined,
            labelId: undefined,
          });
          setType(1);
          setVisible(false);
        });
      } else {
        if (type === 3) {
          if (userkeyList && userkeyList.length) {
            obj.userCodeList = userkeyList.join(',');
          } else {
            message.warning('请选择指定成员');
            return;
          }
        } else if (type === 5) {
          if (systemObj?.input && systemObj?.audo) {
            obj.relationResFormControlId = systemObj?.input;
            obj.sysLabelId = systemObj?.audo;
          } else {
            message.warning('请选择系统标签以及标签参数');
            return;
          }
        }
        listObj.push(obj);
        setList(listObj);
        form.setFieldsValue({
          type: undefined,
          specifiedLevel: undefined,
          signType: undefined,
          labelId: undefined,
        });
        setType(1);
        setVisible(false);
      }
    });
  };

  const handleObjList = value => {
    let newList: tsStep[] = [];
    list?.map(item => {
      if (item.id + '' === selectObj?.id + '') {
        Object.assign(item, value);
      }
      newList.push(item);
    });
    setList(newList);
    if (type === 6) {
      paramForm.validateFields().then(value => {
        getArchiveControlParams(value);
        handleHiddleModal();
        setType(1);
        setVisible(false);
        form.setFieldsValue({
          type: undefined,
          specifiedLevel: undefined,
          signType: undefined,
          labelId: undefined,
        });
      });
    } else {
      handleHiddleModal();
      setType(1);
      setVisible(false);
      form.setFieldsValue({
        type: undefined,
        specifiedLevel: undefined,
        signType: undefined,
        labelId: undefined,
      });
    }
  };
  // 编辑的确认
  const handleEditOkModal = () => {
    form.validateFields().then(value => {
      value.resFormControlIds = controlId;
      // handleObjList(value);
      switch (type) {
        case 1:
          handleObjList(value);
          return true;
        case 2:
          if (value.labelId) {
            handleObjList(value);
            return true;
          } else {
            message.warning('请选择标签');
            return false;
          }
        case 3:
          if (userkeyList && userkeyList.length) {
            value.userCodeList = userkeyList.join(',');
            handleObjList(value);
            return true;
          } else {
            message.warning('请选择指定成员');
            return false;
          }
        case 4:
          handleObjList(value);
          return true;
        case 5:
          if (
            (systemObj?.input && systemObj?.audo) ||
            (systemObj?.input === 0 && systemObj?.audo === 0)
          ) {
            value.relationResFormControlId = systemObj?.input;
            value.sysLabelId = systemObj?.audo;
            handleObjList(value);
            return true;
          } else {
            message.warning('请选择系统标签以及标签参数');
            return false;
          }
        default:
          handleObjList(value);
          return true;
      }
    });
  };
  // 获取人员
  const handleGetUser = value => {
    userkeyList = value;
    console.log('userkeyList');
    console.log(value);
    // userkeyList
  };
  // 获取组件id列表
  const handleGetControlIds = (value: any): void => {
    controlId = value;
    console.log('controlId');
    console.log(value);
    // controlId
  };
  // 获取系统标签id
  const handleSystem = value => {
    systemObj = value;
    console.log('systemObj');
    console.log(value);
    // systemObj
  };
  // AddshowModal
  const handleAddShowModal = () => {
    form.setFieldsValue({
      type: 1,
      specifiedLevel: undefined,
      signType: undefined,
      labelId: undefined,
    });
    setType(1);
    setEdit(false);
    setVisible(true);
  };
  // 编辑的showmodal
  const handleEditShowmodal = selectItem => {
    systemObj = {
      audo: selectItem.sysLabelId,
      input: selectItem.relationResFormControlId,
    };
    setSelectObj(selectItem);
    setType(selectItem.type);
    form.setFieldsValue(selectItem || {});

    async function getP() {
      let json = await getParam(selectItem.archiveId);
      if (json.status === 200) {
        setParam(json.obj);
      }
    }

    if (selectItem.type === 6) {
      getP();
      controlModels?.map(item => {
        let obj: any = {};
        obj[item.resApprArchiveDemandId] = item.resFormControlId;
        paramForm.setFieldsValue(obj);
      });
    }

    setEdit(true);
    setVisible(true);
  };
  // 删除
  const handleRemove = (item: tsStep) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let newList: tsStep[] = [];
        list?.map(item1 => {
          if (item1.id + '' === item.id + '') {
          } else {
            newList.push(item1);
          }
        });
        setList(newList);
      },
    });
  };

  // 类型
  const rendType1 = () => {
    return (
      <>
        <Form.Item
          name="specifiedLevel"
          initialValue={1}
          style={{ marginTop: 4 }}
          label="指定级别"
          rules={[
            { required: type === 1 ? true : false, message: '请选择指定职级!' },
          ]}
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

  // 展示name的modal
  const handleShowName = selectItem => {
    setSelectObj(selectItem);
    nameForm.setFieldsValue({ name: selectItem.stepName });
    setName(selectItem.stepName);
  };

  // name modal的ok
  const handleName = () => {
    nameForm.validateFields().then(fromSubData => {
      let newListObj: tsStep[] = JSON.parse(JSON.stringify(list));
      newListObj?.map(item => {
        if (selectObj?.id + '' === item.id.toString()) {
          item.stepName = fromSubData.name;
        }
      });
      setList(newListObj);
      setSelectObj(undefined);
      setName(undefined);
    });
  };

  const renderModalBottom = useMemo(() => {
    switch (type) {
      case 1:
        return (
          <>
            {rendType1()}
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="同时有多个上级时"
              initialValue={0}
              rules={[
                {
                  required: type === 1 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={1}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="请选择标签审批方式"
              initialValue={0}
              rules={[
                {
                  required: type === 2 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={1}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="labelId"
              style={{ marginTop: 4 }}
              label="标签"
              rules={[
                { required: type === 2 ? true : false, message: '请选择标签!' },
              ]}
            >
              <Select placeholder="请选择标签">
                {labelList?.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.labelName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </>
        );
      case 3:
        return (
          <Collapse>
            <Panel header="指定人员" key="指定人员">
              <MoveInOz
                renderUser={true}
                onlySelectUser={true}
                renderDefault={true}
                change={handleGetUser}
                selectKeys={
                  selectObj?.userCodeList
                    ? selectObj?.userCodeList.split(',')
                    : []
                }
              />
            </Panel>
          </Collapse>
        );
      case 4:
        return null;
      case 5:
        return (
          <>
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="同时有多个上级时"
              initialValue={0}
              rules={[
                {
                  required: type === 5 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={1}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
            <SystemLabel
              {...props}
              change={handleSystem}
              selectObj={selectObj}
            />
          </>
        );

      case 6:
        return (
          <Form.Item
            name="archiveId"
            style={{ marginTop: 4 }}
            label="自执行"
            rules={[{ required: true, message: '请选择标签!' }]}
          >
            <Select
              placeholder="请选择标签"
              onChange={async e => {
                let json = await getParam(e);
                if (json.status === 200) {
                  setParam(json.obj);
                }
              }}
            >
              {handleList?.map(item => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      default:
        return null;
    }
  }, [type, selectObj]);

  return (
    <div>
      <div ref={drop} style={{ float: 'left' }}>
        {list?.map((item, index) => {
          return (
            <Card
              key={index}
              index={index}
              moveCard={moveCard}
              {...item}
              item={item}
              handleEditShowmodal={handleEditShowmodal}
              handleShowName={handleShowName}
              handleRemove={handleRemove}
              setCardIndex={setCardIndex}
            />
          );
        })}
      </div>
      <div className="add-item" onClick={handleAddShowModal}>
        <PlusOutlined
          style={{
            marginTop: 25,
            fontSize: 40,
          }}
        />
      </div>
      <Modal
        key={visible + ''}
        width="56vw"
        title="设置"
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          handleHiddleModal();
        }}
        onOk={edit ? handleEditOkModal : handleAddOkModal}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="选择类型"
            rules={[{ required: true, message: '请选择类型!' }]}
          >
            <Radio.Group
              onChange={e => {
                const { value } = e.target;
                setType(value);
              }}
            >
              <Radio value={1}>
                上级（自动设置通讯录中的上级领导为审批人）
              </Radio>{' '}
              <br />
              <Radio value={2}>标签</Radio> <br />
              <Radio value={3}>指定成员</Radio> <br />
              <Radio value={4}>申请人</Radio> <br />
              <Radio value={5}>系统标签</Radio> <br />
              {!isFiles || selectObj?.type === 6 ? (
                <Radio value={6}>归档</Radio>
              ) : null}
            </Radio.Group>
          </Form.Item>
          <Divider />
          {renderModalBottom}
          <Divider />
          {type === 6 ? null : (
            <Assembly
              {...props}
              apiList={getFormSimple}
              header="表单控件可编辑权限设置（支持多选）"
              change={handleGetControlIds}
              selectKeys={selectObj?.resFormControlIds || []}
            />
          )}
        </Form>
        {type === 6 ? (
          <Form form={paramForm}>
            {param?.map(item => {
              return (
                <Form.Item
                  key={item.id}
                  style={{
                    width: '40%',
                    marginLeft: '5%',
                    display: 'inline-block',
                  }}
                  label={item.controlShowName}
                  name={item.id}
                  rules={[
                    {
                      required: true,
                      message: '请输入' + item.controlShowName + '!',
                    },
                  ]}
                >
                  <Select>
                    {controlList?.map(control => {
                      return (
                        <Option value={control.id} key={control.id}>
                          {control.childName + '_' + control.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              );
            })}
          </Form>
        ) : null}
      </Modal>
      <Modal
        title="修改名称"
        visible={!!name}
        okText="确认"
        cancelText="返回"
        onCancel={() => {
          setSelectObj(undefined);
          setName(undefined);
        }}
        onOk={handleName}
      >
        <Form form={nameForm}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入节点名称!' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
