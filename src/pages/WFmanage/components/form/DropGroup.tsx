import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Modal, Button, Descriptions, Form, Input } from 'antd';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { IGroupItem, IItem } from '../../services/form';
import Temp from '@/pages/Workflow/Component';
import update from 'immutability-helper';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

interface Iprops {
  groupItem: IGroupItem;
  type: string;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
}

const DropGroup = (props: Iprops) => {
  const { groupItem, type, moveIndex, index } = props;
  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<IItem[]>();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  useEffect(() => {
    setList(groupItem.list);
  }, [groupItem.list]);

  const [{ isDragging }, drag] = useDrag({
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),

    item: { type: type, index },
  });

  const [, drop] = useDrop({
    accept: type,
    hover(item: { type: string; index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveIndex(dragIndex, hoverIndex);

      if (item.index !== undefined) {
        item.index = hoverIndex;
      }
    },
  });

  const [, gropDrop] = useDrop({
    accept: groupItem.id + 'group',
  });

  const move = (dragIndex: number, hoverIndex: number) => {
    const dragCard = list && list[dragIndex];
    let newData = JSON.parse(JSON.stringify(list));
    setList(
      update(newData, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      }),
    );
  };

  const handleShowModal = (index: number) => {
    setSelectIndex(index);
    list && form.setFieldsValue({ name: list[index].name });
    setVisible(true);
  };

  const handleChangeName = () => {
    form.validateFields().then(async value => {
      let newList = JSON.parse(JSON.stringify(list));
      let selectItem = list && list[selectIndex];
      if (selectItem) {
        selectItem.name = value.name;
        newList[selectIndex] = selectItem;
        setList(list);
        setVisible(false);
      }
    });
  };

  const handleRemove = (index: number) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let newList = JSON.parse(JSON.stringify(list));
        newList.splice(index, 1);
        setList(newList);
      },
    });
  };

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        padding: '8px 14px',
        height: '100%',
        border: '1px dashed #444',
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <div ref={gropDrop}>
        {list?.map((listItem, index) => {
          return (
            <DropGroupItem
              index={index}
              listItem={listItem}
              type={groupItem.id + 'group'}
              moveIndex={move}
              showModal={handleShowModal}
              remove={handleRemove}
            />
          );
        })}
      </div>
      <Modal
        visible={visible}
        title="修改"
        okText="确认"
        cancelText="取消"
        onOk={() => {
          handleChangeName();
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

interface IProps {
  listItem: IItem;
  type: string;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  showModal: (index: number) => void;
  remove: (index: number) => void;
}

const DropGroupItem = (props: IProps) => {
  const { listItem, index, type, moveIndex, showModal, remove } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),

    item: { type: type, index },
  });

  const [, drop] = useDrop({
    accept: type,
    hover(item: { type: string; index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveIndex(dragIndex, hoverIndex);

      if (item.index !== undefined) {
        item.index = hoverIndex;
      }
    },
  });

  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        margin: '10px',
        padding: '8px 14px',
        height: '100%',
        border: '1px dashed #444',
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <div
        className={listItem.isRequired ? 'label-required' : ''}
        style={{ display: 'flex', flex: 1, alignItems: 'center' }}
      >
        <span>{listItem.name}</span>
        <DeleteOutlined
          style={{
            cursor: 'pointer',
            marginLeft: 5,
          }}
          onClick={e => {
            e.preventDefault();
            remove(index);
          }}
        />
        <EditOutlined
          style={{
            cursor: 'pointer',
            marginLeft: 5,
          }}
          onClick={e => {
            e.preventDefault();
            showModal(index);
          }}
        />
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <Form.Item
          style={{
            width: '100%',
            marginBottom: 6,
            marginTop: 6,
          }}
          rules={[
            {
              required: listItem.isRequired,
              message: `${listItem.name}'必填!`,
            },
          ]}
          name={listItem.id}
        >
          <Temp
            ismultiplechoice={listItem.isMultiplechoice}
            s_type={listItem.baseControlType}
            disabled={listItem.isLocked}
            list={listItem.itemList || []}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default DropGroup;
