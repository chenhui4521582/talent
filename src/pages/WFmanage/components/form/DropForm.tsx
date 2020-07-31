import React, { useRef, useState, useEffect } from 'react';
import { Card, Modal, Button, Descriptions, Form, Input } from 'antd';
import { IForm, IGroupItem } from '../../services/form';
import { useDrop } from 'react-dnd';

import DropGroup from './DropGroup';
import DropItem from './DropItem';
import update from 'immutability-helper';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

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
  const [visible, setVisible] = useState<boolean>(false);
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
      let list = JSON.parse(JSON.stringify(formDetailList));
      let selectFrom = list && list[selectGroup];
      selectFrom.name = value.name;
      list[selectGroup] = selectFrom;
      setFormDetailList(list);
      setVisible(false);
    });
  };

  const handleShowModal = (index: number) => {
    setSelectGroup(index);
    formDetailList && form.setFieldsValue({ name: formDetailList[index].name });
    setVisible(true);
  };

  const renderForm = () => {
    return formDetailList?.map((groupItem, index) => {
      if (groupItem.list && groupItem.list.length) {
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
                    handleShowModal(index);
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
                    handleShowModal(index);
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
      </Descriptions>
      <Modal
        visible={visible}
        title="修改"
        okText="确认"
        cancelText="取消"
        onOk={() => {
          handleChangeGroupName();
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form form={form}>
          <Form.Item
            label="组名称"
            name="name"
            rules={[{ required: true, message: '请输入组名称!' }]}
          >
            <Input placeholder="请输入组名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
