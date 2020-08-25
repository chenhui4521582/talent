import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Input, Form, Select, notification } from 'antd';
import { useDrop, DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  saveCForm,
  updateCForm,
  updateForm,
  getCForm,
  deleteCForm,
  getFormDetail,
  IForm,
  ItemTypes,
} from './services/form';
import { GlobalResParams } from '@/types/ITypes';
import DropForm from './components/form/DropForm';
import DropIcon from './components/form/DropIcon';
import DropTable from './components/form/DropTable';
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
          let sort: any = [];
          for (let g = 0; g < controlList.length; g++) {
            if (groupItem.id === controlList[g].resGroupId) {
              data[k].groupColArr.push(formChildlist[k].controlList[g].id);
              list.push(controlList[g]);
              sort.push(controlList[g].sort);
              sort = sort.sort();
              groupItem.list = list;
              groupItem.sort = sort[0];
              data[k].list.push(groupItem);
              data[k].list.sort(compare('sort'));
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

  const compare = (name: string) => {
    return (a, b) => {
      let v1 = a[name];
      let v2 = b[name];
      if (v2 > v1) {
        return -1;
      } else if (v2 < v1) {
        return 1;
      } else {
        return 0;
      }
    };
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
      type: formDetail[index].type,
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
          value.type,
        );
        if (addJson.status === 200) {
          let getJson = await getCForm(addJson.obj);
          if (getJson.status === 200) {
            let obj = getJson.obj;
            obj.list = [];
            obj.type = value.type;
            list.push(obj);
            console.log(list);
            setFormDetail(list);
            setAddOrEdit(undefined);
            form.setFieldsValue({
              name: undefined,
              type: undefined,
              columnNum: undefined,
            });
          }
        }
      } else {
        if (selectFormIndex || selectFormIndex === 0) {
          let selectFrom = list && list[selectFormIndex];
          selectFrom.name = value.name;
          selectFrom.columnNum = parseInt(value.columnNum);
          value.type ? (selectFrom.type = value.type) : null;
          if (selectFormIndex || selectFormIndex === 0) {
            let updataJson = await updateCForm(
              props.match.params.id,
              selectFrom.id,
              value.name,
              parseInt(value.columnNum),
              value.type || selectFrom.type,
            );
            console.log(selectFrom);
            if (updataJson.status === 200) {
              list[selectFormIndex] = selectFrom;
            }
          }
        }
        setFormDetail(list);
        setAddOrEdit(undefined);
        form.setFieldsValue({
          name: undefined,
          type: undefined,
          columnNum: undefined,
        });
      }
    });
  };

  const handleShowForm = (value: 'edit' | 'add', index?: number) => {
    if ((index || index === 0) && formDetail) {
      let selectFrom = formDetail[index];
      form.setFieldsValue({
        name: formDetail[index].name,
        type: formDetail[index].type,
        columnNum: formDetail[index].columnNum,
      });
      if (selectFrom?.list.length) {
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
    setFormDetail([...value]);
  };

  const handleSave = async () => {
    let cList: any = [];
    let sort = 0;
    formDetail.map((formItem, formIndex) => {
      let groupList = formItem.list;
      groupList?.map((groupItem, groupIndex) => {
        let cItem = groupItem;
        if (cItem && cItem?.list) {
          cItem?.list.map((item, cIndex) => {
            let newItem: any = {};
            sort += 1;
            if (item.id && item.id.toString()?.indexOf('add') > -1) {
            } else {
              item.id ? (newItem.id = item.id) : null;
            }
            item.itemList ? (newItem.itemList = item.itemList) : null;
            newItem.isRequired = item.isRequired;
            newItem.baseControlType = item.baseControlType;
            newItem.name = item.name;
            newItem.resFormChildId = formItem.id;
            newItem.resFormId = formItem.resFormId;
            newItem.isGroup = 1;
            newItem.groupIndex = 1;
            newItem.resGroupId = groupItem.id;
            newItem.colspan = item.colspan;
            newItem.sort = sort;
            item.isMultiplechoice || item.isMultiplechoice === 0
              ? (newItem.isMultiplechoice = item.isMultiplechoice)
              : '';
            cList.push(newItem);
          });
        } else {
          sort += 1;
          let newC: any = cItem;
          let newItem: any = {};
          if (newC.id && newC.id.toString()?.indexOf('add') > -1) {
          } else {
            newC.id ? (newItem.id = newC.id) : null;
          }
          newItem.baseControlType = newC.baseControlType;
          newC.itemList ? (newItem.itemList = newC.itemList) : null;
          newItem.isRequired = newC.isRequired;
          newItem.name = newC.name;
          newItem.resFormChildId = formItem.id;
          newItem.resFormId = formItem.resFormId;
          newItem.colspan = newC.colspan;
          newItem.groupIndex = 1;
          newItem.isGroup = 0;
          newItem.sort = sort;
          newC.isMultiplechoice || newC.isMultiplechoice === 0
            ? (newItem.isMultiplechoice = newC.isMultiplechoice)
            : '';
          cList.push(newItem);
        }
      });
    });
    console.log([...new Set(cList)]);
    let json = await updateForm({
      resFormId: props.match.params.id,
      resFormControlCrudParamList: [...new Set(cList)],
    });
    if (json.status === 200) {
      getForm();
      notification['success']({
        message: json.msg,
        description: '',
      });
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };

  const fromContent = useMemo(() => {
    if (formDetail?.length) {
      return formDetail?.map((fromItem, i) => {
        console.log(fromItem);
        if (fromItem.type === 1) {
          return (
            <DropTable
              allData={formDetail}
              fromItem={fromItem}
              index={i}
              moveIndex={handleMoveIndex}
              changeName={handleEditForm}
              changeData={handleChangeForm}
            />
          );
        } else {
          return (
            <DropForm
              allData={formDetail}
              fromItem={fromItem}
              index={i}
              moveIndex={handleMoveIndex}
              changeName={handleEditForm}
              changeData={handleChangeForm}
            />
          );
        }
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
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => {
              handleSave();
            }}
          >
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
          right: '6vw',
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
          form.setFieldsValue({
            name: undefined,
            type: undefined,
            columnNum: undefined,
          });
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
              name="type"
              rules={[{ required: true, message: '请选择表单类型!' }]}
            >
              <Select placeholder="请选择表单类型">
                <Option value={0}>普通表单</Option>
                <Option value={1}>自新增表单</Option>
                <Option value={2}>组表单</Option>
              </Select>
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={() => {
            window.history.go(-1);
          }}
        >
          {' '}
          返回{' '}
        </Button>
      </div>
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
