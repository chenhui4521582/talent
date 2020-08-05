import React, { useMemo, useState, useEffect } from 'react';
import {
  Card,
  Modal,
  InputNumber,
  Descriptions,
  Form,
  Input,
  Select,
  notification,
} from 'antd';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  IForm,
  IGroupItem,
  deleteGroup,
  saveGroup,
  updateGroup,
} from '../../services/form';
import DropGroup from './DropGroup';
import DropItem from './DropItem';
import Edit from './Edit';

interface Iprops {
  fromItem: IForm;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  changeName: (index: number) => void;
  changeData: (value: any) => void;
  allData: IForm[];
}

export default (props: Iprops) => {
  const { fromItem, changeName, index, changeData, allData } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<'add' | 'edit'>();
  const [selectGroup, setSelectGroup] = useState<number>(0);
  const [isChangeGroupName, setIsChangeGroupName] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<any>();
  const [, drop] = useDrop({
    accept: fromItem.id + 'form',
  });

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
    console.log(jsonAll[index].list);
    changeData(jsonAll);
  };

  const handleRemove = (index: number) => {
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
          let json = await deleteGroup(fromItem.resFormId, newList[index].id);
          if (json.status === 200) {
            newList.splice(index, 1);
            jsonAll[index].list = newList;
            changeData(jsonAll);
          }
        } else {
          newList.splice(index, 1);
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
        if (fromItem.type === 0) {
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
    }
    setVisible(value);
  };

  const handleChange = value => {
    changeData(value);
  };

  const renderForm = () => {
    return fromItem.list?.map((groupItem, i) => {
      if ((groupItem && groupItem.list) || fromItem.type === 2) {
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
                    handleRemove(i);
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
                    handleShowModal('edit', i);
                  }}
                />
              </span>
            }
            span={groupItem.colspan}
          >
            <DropGroup
              groupItem={groupItem}
              type={fromItem.id + 'form'}
              index={i}
              moveIndex={handleMoveIndex}
              changeData={handleChange}
              allData={allData}
              formIndex={index}
            />
          </Descriptions.Item>
        );
      } else {
        if (groupItem) {
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
                      handleRemove(i);
                    }}
                  />
                  <EditOutlined
                    style={{
                      cursor: 'pointer',
                      marginLeft: 5,
                    }}
                    onClick={e => {
                      e.preventDefault();
                      handleShowModal('edit', i);
                    }}
                  />
                </span>
              }
              span={groupItem.colspan}
            >
              <DropItem
                groupItem={groupItem}
                type={fromItem.id + 'form'}
                index={i}
                moveIndex={handleMoveIndex}
              />
            </Descriptions.Item>
          );
        }
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
              if (fromItem.type === 2) {
                setIsChangeGroupName(true);
              } else {
                setIsChangeGroupName(false);
              }
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
            <Edit type={fromItem.type} selectItem={selectItem} />
          )}
        </Form>
      </Modal>
    </div>
  );
};
