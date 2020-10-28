import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Table } from 'antd';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import update from 'immutability-helper';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  IForm,
  deleteGroup,
  saveGroup,
  updateGroup,
} from '../../services/form';
import Edit from './Edit';
import Temp from '../Component';

interface Iprops {
  fromItem: IForm;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  changeData: (value: any) => void;
  changeName: (index: number) => void;
  allData: IForm[];
}

export default (props: Iprops) => {
  const { fromItem, index, changeData, allData, changeName } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<'add' | 'edit'>();
  const [selectGroup, setSelectGroup] = useState<number>(0);
  const [selectItem, setSelectItem] = useState<any>();
  const [columns, setColumns] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [, drop] = useDrop({
    accept: fromItem.id + 'form',
  });

  useEffect(() => {
    let dataItem: any = {};
    let newColumns: any = [];
    newColumns.push({
      title: '序号',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      // width: '6em',
      render: (_, record, index) => <span>{index + 1}</span>,
    });
    fromItem?.list.map((item, i) => {
      newColumns.push({
        title: (
          <DorpItemTitle
            colItem={item}
            type={fromItem.id + 'form'}
            index={i}
            moveIndex={handleMoveIndex}
            handleRemove={handleRemove}
            handleShowModal={handleShowModal}
          />
        ),
        dataIndex: item.baseControlType + '-' + item.id,
        key: item.id,
        align: 'left',
        ...item,
      });
      dataItem[item.baseControlType + '-' + item.id] = { ...item };
    });
    setDataSource([dataItem]);
    setColumns(newColumns);
  }, [fromItem, fromItem.list]);

  useEffect(() => {
    let dataItem: any = {};
    let newColumns: any = [];
    newColumns.push({
      title: '序号',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      // width: '6em',
      render: (_, record, index) => <span>{index + 1}</span>,
    });
    fromItem?.list.map((item, i) => {
      newColumns.push({
        title: (
          <DorpItemTitle
            colItem={item}
            type={fromItem.id + 'form'}
            index={i}
            moveIndex={handleMoveIndex}
            handleRemove={handleRemove}
            handleShowModal={handleShowModal}
          />
        ),
        dataIndex: item.baseControlType + '-' + item.id,
        key: item.id,
        align: 'left',
        ...item,
      });
      dataItem[item.baseControlType + '-' + item.id] = { ...item };
    });
    setColumns(newColumns);
  }, [dataSource, fromItem]);

  const handleDataSource = dataSource => {
    let newData = JSON.parse(JSON.stringify(dataSource));
    for (let i = 0; i < newData.length; i++) {
      let item = newData[i];
      for (let key in item) {
        let itemKey = item[key];
        item[key] = (
          <Form.Item
            style={{
              width: '100%',
              marginBottom: 6,
              marginTop: 6,
            }}
            rules={[
              {
                required: itemKey.isRequired,
                message: `${itemKey.name}'必填!`,
              },
            ]}
            name={itemKey.baseControlType + '-' + itemKey.id + '-' + (i + 1)}
            // initialValue={handleValue(itemKey)}
          >
            <Temp
              ismultiplechoice={itemKey.isMultiplechoice}
              s_type={itemKey.baseControlType}
              disabled={itemKey.isLocked}
              list={itemKey.itemList || []}
            />
          </Form.Item>
        );
      }
      item.id = i;
      item.key = i;
    }
    return newData;
  };

  const handleMoveIndex = (dragIndex: number, hoverIndex: number) => {
    const dragCard = fromItem.list && fromItem.list[dragIndex];
    let jsonAll = JSON.parse(JSON.stringify(allData));
    let newData = JSON.parse(JSON.stringify(fromItem.list));
    jsonAll[index].list = update(newData, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    });
    changeData(jsonAll);
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
        let newList = JSON.parse(JSON.stringify(fromItem.list));
        if (fromItem.type === 2) {
          let json = await deleteGroup(fromItem.resFormId, newList[i].id);
          if (json.status === 200) {
            newList.splice(i, 1);
            jsonAll[index].list = newList;
            changeData(jsonAll);
          }
        } else {
          newList.splice(i, 1);
          jsonAll[index].list = newList;
          changeData(jsonAll);
        }
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then(async value => {
      let list = JSON.parse(JSON.stringify(fromItem.list));
      let jsonAll = JSON.parse(JSON.stringify(allData));
      if (visible === 'edit') {
        let selectFrom = list && list[selectGroup];
        if (fromItem.type !== 2) {
          if (value.itemList) {
            let itemList: string[] = [];
            for (let key in value.itemList) {
              itemList.push(value.itemList[key]);
            }
            value.itemList = itemList.join('|');
          }
          selectFrom = value;
          list[selectGroup] = selectFrom;
        } else {
          let json = await updateGroup(
            fromItem.resFormId,
            selectFrom.id,
            value.name,
          );
          if (json.status === 200) {
            selectFrom.name = value.name;
            list[selectGroup] = selectFrom;
          }
        }
      } else {
        if (fromItem.type === 2) {
          let res = await saveGroup(fromItem.resFormId, value.name);
          if (res.status === 200) {
            list.push({
              name: value.name,
              id: res.obj,
              list: [],
            });
          }
        } else {
          if (value.itemList) {
            let itemList: string[] = [];
            for (let key in value.itemList) {
              itemList.push(value.itemList[key]);
            }
            value.itemList = itemList.join('|');
          }
          list.push({
            ...value,
            id: list.length + 'add',
          });
        }
      }

      jsonAll[index].list = list;
      changeData(jsonAll);
      setVisible(undefined);
    });
  };

  const handleShowModal = (value: 'add' | 'edit', index?: number) => {
    if (index || index === 0) {
      let itemList = {};
      fromItem.list && setSelectItem(fromItem.list[index]);
      if (fromItem.list && fromItem.list[index]?.itemList) {
        let list = fromItem.list[index]?.itemList?.split('|');
        list?.map((item, i) => {
          let key = i + 1;
          itemList['value' + key] = item;
        });
      }
      fromItem.list &&
        form.setFieldsValue({
          ...fromItem.list[index],
          itemList: { ...itemList },
        });
      setSelectGroup(index);
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
    setVisible(value);
  };

  return (
    <div ref={drop}>
      <div
        style={{
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: 'bold',
          fontSize: 16,
          marginBottom: 10,
        }}
      >
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
      <Table
        style={{ marginBottom: 40, marginLeft: '5%', width: '80%' }}
        title={() => {
          return (
            <Button
              style={{ marginLeft: 8, float: 'right' }}
              onClick={e => {
                e.preventDefault();
                handleShowModal('add');
              }}
            >
              添列
            </Button>
          );
        }}
        columns={columns}
        dataSource={handleDataSource(dataSource)}
        pagination={false}
      />
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
          }, 300);
        }}
      >
        <Form form={form} layout="vertical">
          <Edit type={fromItem.type} selectItem={selectItem} />
        </Form>
      </Modal>
    </div>
  );
};

interface Ipropss {
  colItem: any;
  type: string;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  handleShowModal: (value: 'add' | 'edit', index?: number) => void;
  handleRemove: (index: number) => void;
  index: number;
}
const DorpItemTitle = (props: Ipropss) => {
  const {
    colItem,
    type,
    moveIndex,
    index,
    handleShowModal,
    handleRemove,
  } = props;
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
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveIndex(dragIndex, hoverIndex);

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */
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
        padding: '5px 16px',
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <span className={colItem.isRequired ? 'label-required' : ''}>
        <span>{colItem.name}</span>
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
    </div>
  );
};
