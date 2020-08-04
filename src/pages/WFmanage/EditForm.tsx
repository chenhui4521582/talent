import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Input, Form, Select } from 'antd';
import { useDrop, DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  saveCForm,
  updateCForm,
  getCForm,
  deleteCForm,
  getFormDetail,
  IForm,
  ItemTypes,
} from './services/form';
import { GlobalResParams } from '@/types/ITypes';
import DropForm from './components/form/DropForm';
import DropIcon from './components/form/DropIcon';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditForm = props => {
  const [, drop] = useDrop({
    accept: ItemTypes.FormBox,
  });

  const [formDetail, setFormDetail] = useState<IForm[]>([]);
  const [addOrEdit, setAddOrEdit] = useState<'add' | 'edit'>();
  const [name, setName] = useState<string>('');
  const [selectFormIndex, setSelectFormIndex] = useState<number>();
  const [hiddenFormTyoe, setHiddenFormType] = useState<boolean>(true);
  const [form] = Form.useForm();
  useEffect(() => {
    getForm();
  }, []);

  async function getForm() {
    const id = props.match.params.id;
    let json = await getFormDetail(id);
    if (json.status === 200) {
      handleDetail(json.obj);
      setName(json.obj.name);
    }
  }

  const handleDetail = obj => {
    let formChildlist = obj.formChildlist || [];
    let groupList = obj.groupList || [];
    let data: any = [];
    for (let k = 0; k < formChildlist.length; k++) {
      let fromItem = formChildlist[k];
      let controlList = fromItem.controlList;
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
              data[k].formType = 'group';
            }
            // else{
            //   groupItem.list = list;
            //   data[k].list.push(groupItem);
            //   data[k].formType = 'group';
            // }
            if (
              data[k].arr.indexOf(formChildlist[k].controlList[g].id) === -1 &&
              data[k].groupColArr.indexOf(
                formChildlist[k].controlList[g].id,
              ) === -1 &&
              i === groupList.length - 1
            ) {
              data[k].arr.push(formChildlist[k].controlList[g].id);
              data[k].list.push(controlList[g]);
              data[k].formType = 'item';
            }
          }
          data[k].list = [...new Set(data[k].list)];
        }
      } else {
        data[k].formType = 'item';
        data[k].list = controlList;
      }
    }
    console.log(data);
    console.log('json.obj');
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
        let deleteJson = await deleteCForm(
          props.match.params.id,
          newList[index].id,
        );
        if (deleteJson.status === 200) {
          newList.splice(index, 1);
          setFormDetail(newList);
        }
      },
    });
  };

  const handleEditForm = (index: number) => {
    setSelectFormIndex(index);

    form.setFieldsValue({
      name: formDetail[index].name,
      formType: formDetail[index].formType,
    });
    handleShowForm('edit', index);
  };

  const handleAddForm = () => {
    form.validateFields().then(async value => {
      let list = JSON.parse(JSON.stringify(formDetail));
      if (addOrEdit === 'add') {
        let addJson = await saveCForm(
          props.match.params.id,
          value.name,
          value.columnNum,
        );
        if (addJson.status === 200) {
          let getJson = await getCForm(addJson.obj);
          getJson.list = [];
          (getJson.formType = value.formType), (list = getJson.list = []);
        }
      } else {
        if (selectFormIndex || selectFormIndex === 0) {
          let selectFrom = list && list[selectFormIndex];
          selectFrom.name = value.name;
          selectFrom.columnNum = value.formType === 'group' ? 1 : 2;
          selectFrom.formType = value.formType
            ? value.formType
            : selectFrom.formType;
          selectFrom.columnNum = value.columnNum;
          if (selectFormIndex) {
            let updataJson = await updateCForm(
              props.match.params.id,
              selectFrom.id,
              value.name,
              value.columnNum,
            );
            if (updataJson.status === 200) {
              list[selectFormIndex] = selectFrom;
            }
          }
        }
        setFormDetail(list);
        setAddOrEdit(undefined);
        form.setFieldsValue({ name: undefined, formType: undefined });
      }
    });
  };

  const handleShowForm = (value: 'edit' | 'add', index?: number) => {
    if ((index || index === 0) && formDetail) {
      let selectFrom = formDetail[index];
      if (selectFrom?.list.length) {
        form.setFieldsValue({
          name: formDetail[index].name,
          formType: formDetail[index].formType,
          columnNum: formDetail[index].columnNum,
        });

        setHiddenFormType(false);
      } else {
        setHiddenFormType(true);
      }
    } else {
      setHiddenFormType(true);
    }
    setAddOrEdit(value);
  };

  const handleChangeForm = value => {
    console.log('value');
    console.log(value);
    setFormDetail([...value]);
  };

  const fromContent = useMemo(() => {
    if (formDetail?.length) {
      return formDetail?.map((fromItem, index) => {
        return (
          <DropForm
            allData={formDetail}
            fromItem={fromItem}
            index={index}
            moveIndex={handleMoveIndex}
            changeName={handleEditForm}
            changeData={handleChangeForm}
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
              handleShowForm('add');
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
        visible={!!addOrEdit}
        title={addOrEdit === 'add' ? '添加' : '修改'}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          handleAddForm();
        }}
        onCancel={() => {
          setSelectFormIndex(undefined);
          form.setFieldsValue({ name: undefined, formType: undefined });
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
          <Form.Item
            label="列数"
            name="columnNum"
            rules={[{ required: true, message: '请填写表单列数!' }]}
          >
            <Input placeholder="请填写表单列数" />
          </Form.Item>
          {hiddenFormTyoe ? (
            <Form.Item
              label="表单类型"
              name="formType"
              rules={[{ required: true, message: '请选择表单类型!' }]}
            >
              <Select placeholder="请选择表单类型">
                <Option value="item">正常表单</Option>
                <Option value="group">组表单</Option>
              </Select>
            </Form.Item>
          ) : null}
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
