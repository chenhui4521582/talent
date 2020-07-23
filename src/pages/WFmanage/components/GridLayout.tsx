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
import { PlusOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { getFormSimple, tsStep } from '../services/rule';
import { GlobalResParams } from '@/types/ITypes';
import { getLableList } from '@/pages/Framework/services/role';
import MoveInOz from '@/pages/Framework/components/MoveInOz';
import GridLayout from 'react-grid-layout';
import Assembly from './Assembly';
import SystemLabel from './SystemLabel';

import '../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../node_modules/react-resizable/css/styles.css';
import './style/rule.less';

const { Option } = Select;
const { Panel } = Collapse;
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

interface tsLabel {
  id: string;
  labelName: string;
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
  ruleList?: tsStep[];
  change?: (value) => {};
}

let add = {
  i: '+',
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  isDraggable: false,
  isResizable: false,
  static: true,
};

const typeObj = {
  1: '上级',
  2: '标签',
  3: '指定成员',
  4: '申请人',
  5: '动态标签',
};

// type 审批类型；   1：上级，2：标签，3：单个成员，4：申请人，5：动态标签 ,
// signType : 0：会签，1：或签 在审批类型为上级和标签时有效 ,
// nodeType : 节点类型 1:开始节点;2:中间节点;3:结束节点
// specifiedLevel

export default (props: tsProps) => {
  const { ruleList, change } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<tsLayout[]>([]);
  const [type, setType] = useState<number | undefined>(1);
  const [listObj, setListObj] = useState<tsStep[]>();
  const [name, setName] = useState<string>();
  const [selectItem, setSelectItem] = useState<tsLayout>();
  const [selectObj, setSelectObj] = useState<tsStep>();
  const [labelList, setLabelList] = useState<tsLabel[]>();
  const [edit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [nameForm] = Form.useForm();

  let userkeyList;
  let controlId;
  let systemObj;

  useEffect(() => {
    async function getLable() {
      let json: GlobalResParams<tsLabel[]> = await getLableList();
      if (json.status === 200) {
        setLabelList(json.obj);
      }
    }
    getLable();
  }, []);

  useEffect(() => {
    change && change(listObj);
  });

  useEffect(() => {
    handlePropsList();
  }, [ruleList]);

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

  const handleSystem = value => {
    systemObj = value;
    console.log('systemObj');
    console.log(value);
    // systemObj
  };

  const handleHiddleModal = () => {
    userkeyList = '';
    controlId = [];
    systemObj = {};
    form.setFieldsValue({ type: 1, specifiedLevel: 1 });
    setType(undefined);
    setVisible(false);
  };

  const handlePropsList = () => {
    let newList: tsLayout[] = [];
    ruleList?.map((item, index) => {
      let obj = {
        i: item.id + '',
        x: index,
        y: 0,
        w: 1,
        h: 1,
        isDraggable: true,
        isResizable: false,
      };
      newList.push(obj);
    });
    add.x = newList.length;
    newList.push(add);
    setList(newList);
    setListObj(ruleList);
  };

  const handleShowModal = (id: string) => {
    let obj: tsStep | undefined;
    listObj?.map(item => {
      if (item.id.toString() === id) {
        obj = item;
        if (levelList.indexOf(obj?.type.toString())) {
          setType(obj?.type || undefined);
        }
      }
    });
    setSelectObj(obj);
    console.log(obj);
    form.setFieldsValue(obj || {});
    setEdit(true);
    setVisible(true);
  };

  const handleShowAdd = () => {
    setEdit(false);
    setVisible(true);
  };

  const handleOkModal = () => {
    let jsonList: tsLayout[] = JSON.parse(JSON.stringify(list));
    let jsonObj: tsLabel[] = JSON.parse(JSON.stringify(listObj));
    if (handleEdit()) {
      if (!edit) {
        if (jsonList.length > 11) {
          return null;
        }
        jsonList.splice(jsonList.length, 0, {
          i: 'add',
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          isDraggable: true,
          isResizable: false,
        });

        jsonList.map((item, index) => {
          if (item.i === '+') {
            jsonList[index].x = jsonList.length - 1;
          } else {
            if (jsonList[index].i === 'add') {
              jsonList[index].x = index - 1;
              jsonList[index].i = index.toString() + 'add';
            }
          }
        });
        let obj: any = form.getFieldsValue();
        obj.stepName = typeObj[type || 1];
        obj.id = (jsonList.length - 1).toString() + 'add';
        jsonObj.push(obj);
        setList([...jsonList]);
        setListObj(jsonObj as any);
      }
      handleHiddleModal();
    }
  };

  const handleObjList = value => {
    let newList: tsStep[] = [];
    listObj?.map(item => {
      if (item.id + '' === selectItem?.i + '') {
        console.log('item');
        console.log(item);
        Object.assign(item, value);
        console.log(item);
        console.log('itemend');
        newList.push(item);
      } else {
        newList.push(item);
      }
    });
    setListObj(newList);
  };

  const handleEdit = (): Boolean => {
    let value = form.getFieldsValue();
    value.resFormControlIds = controlId;
    switch (type) {
      case 1:
        handleObjList(value);
        return true;
      case 2:
        handleObjList(value);
        return true;
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
        if (systemObj?.input && systemObj?.audo) {
          value.relationResFormControlId = systemObj?.input;
          value.sysLabelId = systemObj?.audo;
          handleObjList(value);
          return true;
        } else {
          message.warning('请选择动态标签以及标签参数');
          return false;
        }
      default:
        handleObjList(value);
        return true;
    }
  };

  const handleName = () => {
    nameForm.validateFields().then(fromSubData => {
      let newListObj: tsStep[] = JSON.parse(JSON.stringify(listObj));
      newListObj?.map(item => {
        if (selectItem?.i === item.id.toString()) {
          item.stepName = fromSubData.name;
        }
      });
      setListObj(newListObj);
      setName(undefined);
    });
  };

  const onLayoutChange = (layoutList: tsLayout[]) => {
    let newList = JSON.parse(JSON.stringify(list));
    layoutList.map(item => {
      newList.map((item1, index) => {
        if (item1.i === item.i) {
          item1.x = item.x;
        }
      });
    });
    setList(newList);
  };

  const getName = (id: string) => {
    let nameString = '';
    listObj?.map(item => {
      if (item.id.toString() === id.toString()) {
        nameString = item.stepName;
      }
    });
    return nameString;
  };

  const renderList = useMemo(() => {
    console.log('--------------------');
    console.log(list);
    console.log(listObj);
    console.log('--------------------');
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
        <div key={item.i} className="item">
          <a
            onClick={e => {
              e.preventDefault();
              handleShowModal(item.i);
              setSelectItem(item);
            }}
          >
            编辑
          </a>
          <span className="close">
            <CloseOutlined />
          </span>
          <p className="name">
            {getName(item.i)}
            <EditOutlined
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                marginLeft: 5,
                fontSize: 10,
                cursor: 'pointer',
              }}
              onClick={e => {
                e.preventDefault();
                let na = getName(item.i);
                setName(na);
                setSelectItem(item);
                nameForm.setFieldsValue({ name: na });
              }}
            />
          </p>
        </div>
      );
    });
  }, [list, listObj]);

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
              initialValue={1}
              rules={[
                {
                  required: type === 1 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={2}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 2:
        return (
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
                  <Option key={item.id} value={item.id.toString()}>
                    {item.labelName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      case 3:
        return (
          <>
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="请选择标签审批方式"
              initialValue={1}
              rules={[
                {
                  required: type === 3 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={2}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
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
          </>
        );
      case 4:
        return null;
      case 5:
        return (
          <SystemLabel
            {...props}
            change={handleSystem}
            selectObj={selectObj?.sysLabelId}
          />
        );
      default:
        return rendType1();
    }
  }, [type]);

  console.log('listObj');
  console.log(listObj);

  return (
    <>
      <GridLayout
        className="layout"
        layout={list}
        cols={list?.length}
        rowHeight={60}
        compactType="vertical"
        width={(1200 / 14) * list?.length}
        style={{ marginBottom: 30 }}
        onLayoutChange={onLayoutChange}
      >
        {renderList}
      </GridLayout>
      <Modal
        key={visible + ''}
        width="46vw"
        title="设置"
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          handleHiddleModal();
        }}
        onOk={handleOkModal}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            initialValue={type}
            label="选择类型"
            rules={[{ required: true, message: '请选择类型!' }]}
          >
            <Radio.Group
              onChange={e => {
                const { value } = e.target;
                setType(value);
              }}
              value={type}
            >
              <Radio value={1}>
                上级（自动设置通讯录中的上级领导为审批人）
              </Radio>{' '}
              <br />
              <Radio value={2}>标签</Radio> <br />
              <Radio value={3}>指定成员</Radio> <br />
              <Radio value={4}>申请人</Radio> <br />
              <Radio value={5}>动态标签</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          {renderModalBottom}
          <Divider />
          <Assembly
            {...props}
            apiList={getFormSimple}
            header="表单控件可编辑权限设置（支持多选）"
            change={handleGetControlIds}
            selectKeys={selectObj?.resFormControlIds || []}
          />
        </Form>
      </Modal>
      <Modal
        title="修改名称"
        visible={!!name}
        okText="确认"
        cancelText="返回"
        onCancel={() => {
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
    </>
  );
};
