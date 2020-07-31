import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Input, Form } from 'antd';

import { useDrop, useDrag, DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  getControls,
  getFormDetail,
  IControls,
  IForm,
  ItemTypes,
} from './services/form';
import { GlobalResParams } from '@/types/ITypes';
import DropForm from './components/form/DropForm';
import DropIcon from './components/form/DropIcon';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const EditForm = props => {
  const [, drop] = useDrop({
    accept: ItemTypes.FormBox,
  });

  const [controlList, setControlList] = useState<IControls[]>();
  const [formDetail, setFormDetail] = useState<IForm[]>([]);
  const [cVisible, setCvisible] = useState<boolean>(false);
  const [addOrEdit, setAddOrEdit] = useState<'add' | 'edit'>();
  const [name, setName] = useState<string>('');
  const [selectFormIndex, setSelectFormIndex] = useState<number>(0);
  const [form] = Form.useForm();
  useEffect(() => {
    getForm();
    getC();
  }, []);

  async function getForm() {
    const id = props.match.params.id;
    let json = await getFormDetail(id);
    if (json.status === 200) {
      handleDetail(json.obj);
      setName(json.obj.name);
    }
  }

  async function getC() {
    let json: GlobalResParams<IControls[]> = await getControls();
    if (json.status === 200) {
      setControlList(json.obj);
    }
  }

  const handleDetail = obj => {
    let formChildlist = obj.formChildlist || [];
    let groupList = obj.groupList || [];
    let data: any = [];
    for (let k = 0; k < formChildlist.length; k++) {
      let fromItem = formChildlist[k];
      let controlList = fromItem.controlList;
      // idItem = idItem.concat(controlList);
      data[k] = fromItem;
      data[k].list = [];
      data[k].arr = [];
      data[k].groupColArr = [];
      if (groupList.length) {
        for (let i = 0; i < groupList.length; i++) {
          let groupItem = groupList[i];
          let list: any = [];
          for (let g = 0; g < controlList.length; g++) {
            if (groupItem.id === controlList[g].resGroupId) {
              data[k].groupColArr.push(formChildlist[k].controlList[g].id);
              list.push(controlList[g]);
              groupItem.list = list;
              data[k].list.push(groupItem);
            }
            if (
              data[k].arr.indexOf(formChildlist[k].controlList[g].id) === -1 &&
              data[k].groupColArr.indexOf(
                formChildlist[k].controlList[g].id,
              ) === -1 &&
              i === groupList.length - 1
            ) {
              data[k].arr.push(formChildlist[k].controlList[g].id);
              data[k].list.push(controlList[g]);
            }
          }
          data[k].list = [...new Set(data[k].list)];
        }
      } else {
        data[k].list = controlList;
      }
    }
    setFormDetail(data);
  };

  const handleMoveIndex = (dragIndex: number, hoverIndex: number) => {
    let fromList = JSON.parse(JSON.stringify(formDetail));
    const dragCard = fromList[dragIndex];
    setFormDetail(
      update(fromList, {
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
        let newList = JSON.parse(JSON.stringify(formDetail));
        newList.splice(index, 1);
        setFormDetail(newList);
      },
    });
  };

  const handleEditForm = (index: number) => {
    setSelectFormIndex(index);
    form.setFieldsValue({ name: formDetail[index].name });
    setAddOrEdit('edit');
  };

  const handleAddForm = () => {
    form.validateFields().then(async value => {
      let list = JSON.parse(JSON.stringify(formDetail));
      if (addOrEdit === 'add') {
        list.push({
          name: value.name,
          list: [],
        });
      } else {
        let selectFrom = list && list[selectFormIndex];
        selectFrom.name = value.name;
        list[selectFormIndex] = selectFrom;
      }
      setFormDetail(list);
      form.setFieldsValue({ name: '' });
      setAddOrEdit(undefined);
    });
  };

  const renderControl = useMemo(() => {
    return controlList?.map(item => {
      return (
        <Button key={item.id} style={{ width: 200, margin: 8 }}>
          {item.name}
        </Button>
      );
    });
  }, [controlList]);

  const fromContent = useMemo(() => {
    if (formDetail?.length) {
      return formDetail?.map((fromItem, index) => {
        return (
          <DropForm
            fromItem={fromItem}
            index={index}
            moveIndex={handleMoveIndex}
            changeName={handleEditForm}
          />
        );
      });
    } else {
      return null;
    }
  }, [formDetail]);

  return (
    <Card
      title={`工作流-${name}-表单设置`}
      extra={
        <>
          <Button
            type="primary"
            onClick={() => {
              setAddOrEdit('add');
            }}
          >
            添加表单
          </Button>
          <Button type="primary" style={{ marginLeft: 8 }}>
            保存
          </Button>
        </>
      }
    >
      {fromContent}
      <div
        ref={drop}
        style={{
          position: 'fixed',
          top: '20vh',
          right: '3vw',
          width: '8em',
        }}
      >
        {formDetail?.map((item, index) => {
          return (
            <DropIcon
              index={index}
              name={item.name}
              moveIndex={handleMoveIndex}
              remove={handleRemove}
            />
          );
        })}
      </div>
      <Modal
        width="40vw"
        visible={cVisible}
        title="添加控件"
        okText="确认"
        cancelText="取消"
        onOk={() => {
          setCvisible(false);
        }}
        onCancel={() => {
          setCvisible(false);
        }}
      >
        {renderControl}
      </Modal>
      <Modal
        visible={!!addOrEdit}
        title={addOrEdit === 'add' ? '添加' : '修改'}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          handleAddForm();
        }}
        onCancel={() => {
          form.setFieldsValue({ name: '' });
          setAddOrEdit(undefined);
        }}
      >
        <Form form={form}>
          <Form.Item
            label="表单名称"
            name="name"
            rules={[{ required: true, message: '请输入表单名称!' }]}
          >
            <Input placeholder="请输入表单名称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default props => {
  return (
    <DndProvider backend={HTML5Backend}>
      <EditForm {...props} />
    </DndProvider>
  );
};
