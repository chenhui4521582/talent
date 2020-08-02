import React, { useMemo, useState, useEffect } from 'react';
import {
  Card,
  Modal,
  InputNumber,
  Descriptions,
  Form,
  Input,
  Select,
} from 'antd';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { getControls, IForm, IGroupItem, IControls } from '../../services/form';
import DropGroup from './DropGroup';
import DropItem from './DropItem';

const { Option } = Select;
interface Iprops {
  fromItem: IForm;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  changeName: (index: number) => void;
}

export default (props: Iprops) => {
  const { fromItem, changeName, index } = props;
  const [form] = Form.useForm();
  const [controlList, setControlList] = useState<IControls[]>();
  const [formDetailList, setFormDetailList] = useState<IGroupItem[]>();
  const [visible, setVisible] = useState<'add' | 'edit'>();
  const [selectGroup, setSelectGroup] = useState<number>(0);

  const [, drop] = useDrop({
    accept: fromItem.id + 'form',
  });

  useEffect(() => {
    setFormDetailList(fromItem.list);
  }, [fromItem]);

  const handleMoveIndex = (dragIndex: number, hoverIndex: number) => {
    const dragCard = formDetailList && formDetailList[dragIndex];
    let newData = JSON.parse(JSON.stringify(formDetailList));
    setFormDetailList(
      update(newData, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      }),
    );
  };

  const handleRemove = (index: number) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let newList = JSON.parse(JSON.stringify(formDetailList));
        newList.splice(index, 1);
        setFormDetailList(newList);
      },
    });
  };

  const handleChangeGroupName = () => {
    form.validateFields().then(async value => {
      console.log(value);
      let list = JSON.parse(JSON.stringify(formDetailList));
      if (visible === 'edit') {
        let selectFrom = list && list[selectGroup];
        selectFrom.name = value.name;
        list[selectGroup] = selectFrom;
      } else {
        if (fromItem.formType === 'group') {
          list.push({
            name: value.name,
            id: list.length + 'add',
            list: [],
          });
        } else {
          list.push({
            name: value.name,
            id: list.length + 'add',
          });
        }
      }

      setFormDetailList(list);
      setVisible(undefined);
    });
  };

  const handleShowModal = (value: 'add' | 'edit', index?: number) => {
    if (index || index === 0) {
      setSelectGroup(index);
      formDetailList &&
        form.setFieldsValue({ name: formDetailList[index].name });
    }
    setVisible(value);
  };

  const renderForm = () => {
    return formDetailList?.map((groupItem, index) => {
      if (groupItem.list) {
        return (
          <Descriptions.Item
            label={
              <span className={groupItem.isRequired ? 'label-required' : ''}>
                <span>{groupItem.name}</span>
                <DeleteOutlined
                  style={{
                    cursor: 'pointer',
                    marginLeft: 5,
                  }}
                  onClick={e => {
                    e.preventDefault();
                    handleRemove(index);
                  }}
                />
                <EditOutlined
                  style={{
                    cursor: 'pointer',
                    marginLeft: 5,
                  }}
                  onClick={e => {
                    e.preventDefault();
                    handleShowModal('edit', index);
                  }}
                />
              </span>
            }
            span={groupItem.colspan}
          >
            <DropGroup
              groupItem={groupItem}
              type={fromItem.id + 'form'}
              index={index}
              moveIndex={handleMoveIndex}
            />
          </Descriptions.Item>
        );
      } else {
        return (
          <Descriptions.Item
            label={
              <span className={groupItem.isRequired ? 'label-required' : ''}>
                <span>{groupItem.name}</span>
                <DeleteOutlined
                  style={{
                    cursor: 'pointer',
                    marginLeft: 5,
                  }}
                  onClick={e => {
                    e.preventDefault();
                    handleRemove(index);
                  }}
                />
                <EditOutlined
                  style={{
                    cursor: 'pointer',
                    marginLeft: 5,
                  }}
                  onClick={e => {
                    e.preventDefault();
                    handleShowModal('edit', index);
                  }}
                />
              </span>
            }
            span={groupItem.colspan}
          >
            <DropItem
              groupItem={groupItem}
              type={fromItem.id + 'form'}
              index={index}
              moveIndex={handleMoveIndex}
            />
          </Descriptions.Item>
        );
      }
    });
  };

  return (
    <div ref={drop}>
      <Descriptions
        title={
          <div style={{ textAlign: 'center' }}>
            <span>{fromItem?.name}</span>
            <EditOutlined
              style={{
                cursor: 'pointer',
                marginLeft: 5,
              }}
              onClick={e => {
                e.preventDefault();
                changeName(index);
              }}
            />
          </div>
        }
        key={fromItem?.id}
        bordered
        column={fromItem?.columnNum}
        style={{ marginBottom: 40, marginLeft: '5%', width: '80%' }}
      >
        {renderForm()}
        <Descriptions.Item label="新增">
          <PlusOutlined
            style={{
              width: '100%',
              padding: 6,
              fontSize: 30,
              border: '1px dashed #444',
              cursor: 'pointer',
            }}
            onClick={e => {
              e.preventDefault();
              handleShowModal('add');
            }}
          />
        </Descriptions.Item>
      </Descriptions>
      <Modal
        visible={!!visible}
        title={visible === 'add' ? '新增' : '修改'}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          handleChangeGroupName();
        }}
        onCancel={() => {
          setVisible(undefined);
        }}
      >
        <Form form={form} layout="vertical">
          {/* <Form.Item
            label="组名称"
            name="name"
            rules={[{ required: true, message: '请输入组名称!' }]}
          >
            <Input placeholder="请输入组名称" />
          </Form.Item> */}
          <Edit />
        </Form>
      </Modal>
    </div>
  );
};

const Edit = () => {
  const [controlList, setControlList] = useState<IControls[]>();

  useEffect(() => {
    getC();
  }, []);

  async function getC() {
    let json: GlobalResParams<IControls[]> = await getControls();
    if (json.status === 200) {
      setControlList(json.obj);
    }
  }

  const renderControl = useMemo(() => {
    return controlList?.map(item => {
      return (
        <Option key={item.id} value={item.type}>
          {item.name}
        </Option>
      );
    });
  }, [controlList]);

  return (
    <>
      <Form.Item
        label="组名称"
        name="groupName"
        rules={[{ required: true, message: '请输入组名称!' }]}
      >
        <Input placeholder="请输入组名称" />
      </Form.Item>
      <Form.Item
        label="控件名称"
        name="name"
        rules={[{ required: true, message: '请输入控件名称!' }]}
      >
        <Input placeholder="请输入控件名称" />
      </Form.Item>
      <Form.Item label="控件">
        <Select placeholder="请选择控件类型">{renderControl}</Select>
      </Form.Item>
      <Form.Item
        label="是否必填"
        name="isRequired"
        rules={[{ required: true, message: '请选择是否必填!' }]}
      >
        <Select placeholder="请选择是否必填">
          <Option value={0}>否</Option>
          <Option value={1}>是</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="列宽"
        name="colspan"
        rules={[{ required: true, message: '请选择列宽!' }]}
      >
        <Select placeholder="请选择列宽">
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
        </Select>
      </Form.Item>
    </>
  );
};
