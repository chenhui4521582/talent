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
import { IForm, IGroupItem, IItem } from '../../services/form';
import DropGroup from './DropGroup';
import DropItem from './DropItem';
import Edit from './Edit';

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
  const [formDetailList, setFormDetailList] = useState<IGroupItem[]>();
  const [visible, setVisible] = useState<'add' | 'edit'>();
  const [selectGroup, setSelectGroup] = useState<number>(0);
  const [isChangeGroupName, setIsChangeGroupName] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<any>();
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

  const handleOk = () => {
    form.validateFields().then(async value => {
      console.log(value);
      let list = JSON.parse(JSON.stringify(formDetailList));
      if (visible === 'edit') {
        let selectFrom = list && list[selectGroup];
        if (value.itemList) {
          let itemList: string[] = [];
          for (let key in value.itemList) {
            itemList.push(value.itemList[key]);
          }
          value.itemList = itemList.join('|');
          // .replace(/,/ig,'|')
        }
        selectFrom = value;
        list[selectGroup] = selectFrom;
      } else {
        if (fromItem.formType === 'group') {
          list.push({
            name: value.groupName,
            id: list.length + 'add',
            list: [value],
          });
        } else {
          list.push({
            ...value,
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
      let itemList = {};
      formDetailList && setSelectItem(formDetailList[index]);
      if (formDetailList && formDetailList[index]?.itemList) {
        let list = formDetailList[index]?.itemList?.split('|');
        list?.map((item, i) => {
          let key = i + 1;
          itemList['value' + key] = item;
        });
      }

      formDetailList &&
        form.setFieldsValue({
          ...formDetailList[index],
          itemList: { ...itemList },
        });
      setSelectGroup(index);
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
                    setIsChangeGroupName(true);
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
          handleOk();
        }}
        onCancel={() => {
          setVisible(undefined);
          setTimeout(() => {
            form.setFieldsValue({});
            setIsChangeGroupName(false);
          }, 300);
        }}
      >
        <Form form={form} layout="vertical">
          {isChangeGroupName ? (
            <Form.Item
              label="组名称"
              name="name"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          ) : (
            <Edit type={fromItem.formType} selectItem={selectItem} />
          )}
        </Form>
      </Modal>
    </div>
  );
};
