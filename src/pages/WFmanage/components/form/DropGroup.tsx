import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Modal, Button, Descriptions, Form, Input } from 'antd';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { IGroupItem, IItem, IForm } from '../../services/form';
import Temp from '@/pages/Workflow/Component';
import update from 'immutability-helper';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Edit from './Edit';

interface Iprops {
  groupItem: IGroupItem;
  type: string;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  changeData: (value: any) => void;
  allData: IForm[];
  formIndex: number;
}

const DropGroup = (props: Iprops) => {
  const {
    groupItem,
    type,
    moveIndex,
    index,
    changeData,
    allData,
    formIndex,
  } = props;
  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);
  const [visibleType, setVisibleType] = useState<'add' | 'edit'>();
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [selectItem, setSelectItem] = useState<IItem>();

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
    const dragCard = groupItem.list && groupItem.list[dragIndex];
    let newData = JSON.parse(JSON.stringify(groupItem.list));
    let jsonAll = JSON.parse(JSON.stringify(allData));
    console.log(groupItem.list);
    console.log(jsonAll[formIndex].list[index].list[dragIndex]);
    jsonAll[formIndex].list[index].list = update(newData, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    });
    changeData(jsonAll);
  };

  const handleShowModal = (index: number, type: 'add' | 'edit') => {
    if (type === 'edit') {
      setSelectIndex(index);
      groupItem.list && setSelectItem(groupItem.list[index]);
      let itemList = {};
      groupItem.list && setSelectItem(groupItem.list[index]);
      if (groupItem.list && groupItem.list[index]?.itemList) {
        let list1 = groupItem.list[index]?.itemList?.split('|');
        list1?.map((item, i) => {
          let key = i + 1;
          itemList['value' + key] = item;
        });
      }
      groupItem.list &&
        form.setFieldsValue({
          ...groupItem.list[index],
          itemList: { ...itemList },
        });
    } else {
      form.setFieldsValue({
        name: undefined,
        colspan: undefined,
        isRequired: undefined,
        baseControlType: undefined,
        itemList: undefined,
        groupName: undefined,
      });
    }
    setVisibleType(type);
  };

  const handleOk = () => {
    form.validateFields().then(async value => {
      console.log(groupItem?.list);
      let newdata = JSON.parse(JSON.stringify(groupItem));
      if (newdata?.list) {
      } else {
        newdata.list = [];
      }
      let newList = JSON.parse(JSON.stringify(newdata?.list));
      let jsonAll = JSON.parse(JSON.stringify(allData));
      let selectItem = newList && newList[selectIndex];
      if (visibleType === 'edit') {
        if (selectItem) {
          if (value.itemList) {
            let itemList: string[] = [];
            for (let key in value.itemList) {
              itemList.push(value.itemList[key]);
            }
            value.itemList = itemList.join('|');
          }
          console.log(value);
          newList[selectIndex] = value;
          console.log('-----------------------');
          console.log(newList);
          setVisibleType(undefined);
        }
      } else {
        if (value.itemList) {
          let itemList: string[] = [];
          for (let key in value.itemList) {
            itemList.push(value.itemList[key]);
          }
          value.itemList = itemList.join('|');
        }
        newList.push(value);
      }
      jsonAll[formIndex].list[index].list = newList;
      console.log(newList);
      console.log(jsonAll);
      changeData(jsonAll);
      setVisibleType(undefined);
    });
  };

  const handleChange = value => {
    changeData(value);
  };

  const handleRemove = (i: number) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let jsonAll = JSON.parse(JSON.stringify(allData));
        groupItem.list.splice(i, 1);
        jsonAll[formIndex].list[index].list = groupItem.list;

        changeData(jsonAll);
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
        border: '1px dashed #888',
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <div ref={gropDrop}>
        {groupItem.list && groupItem.list.length
          ? groupItem.list?.map((listItem, i) => {
              return (
                <DropGroupItem
                  index={i}
                  listItem={listItem}
                  type={groupItem.id + 'group'}
                  moveIndex={move}
                  showModal={handleShowModal}
                  remove={handleRemove}
                  allData={allData}
                  formIndex={formIndex}
                  changeData={handleChange}
                />
              );
            })
          : null}
      </div>
      <PlusOutlined
        style={{
          width: 'calc(100% - 20px)',
          marginLeft: 10,
          padding: '8px 14px',
          fontSize: 30,
          border: '1px dashed #444',
          cursor: 'pointer',
        }}
        onClick={e => {
          handleShowModal(0, 'add');
          e.preventDefault();
        }}
      />
      <Modal
        visible={!!visibleType}
        title="修改"
        okText="确认"
        cancelText="取消"
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          setVisibleType(undefined);
        }}
      >
        <Form form={form}>
          <Edit showSpan={true} selectItem={selectItem} />
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
  showModal: (index: number, type) => void;
  remove: (index: number) => void;
  allData: IForm[];
  formIndex: number;
  changeData: (value: any) => void;
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
            showModal(index, 'edit');
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
