import React, { useMemo, useState, useEffect } from 'react';
import { Input, Select, Form } from 'antd';
import { GlobalResParams } from '@/types/ITypes';
import { getControls, IItem, IControls } from '../../services/form';

const { Option } = Select;

interface Iprops {
  type?: 0 | 1 | 2;
  showSpan?: boolean;
  selectItem?: any;
}

const Edit = (props: Iprops) => {
  const { type, showSpan, selectItem } = props;
  const [controlList, setControlList] = useState<IControls[]>();
  const [inputNameList, setInputNameLis] = useState<string[]>(['value1']);
  const [count, setCount] = useState<number>(1);
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    getC();
  }, []);

  useEffect(() => {
    if (
      selectItem?.baseControlType === 'multiple' ||
      selectItem?.baseControlType === 'select'
    ) {
      if (selectItem.itemList) {
        let data = selectItem.itemList.split('|');
        let list: string[] = [];
        for (let i = 0; i < data.length; i++) {
          let index = i + 1;
          list.push('value' + index);
        }
        setInputNameLis(list);
      }
      setShowInput(true);
    }
  }, [selectItem]);

  async function getC() {
    let json: GlobalResParams<IControls[]> = await getControls();
    if (json.status === 200) {
      setControlList(json.obj);
    }
  }

  const handleAdd = () => {
    let newList = JSON.parse(JSON.stringify(inputNameList));
    let nameIndex = count + 1;
    newList.push('value' + nameIndex);
    setInputNameLis([...newList]);
    setCount(nameIndex);
  };

  const handleRemove = value => {
    let newList = JSON.parse(JSON.stringify(inputNameList));
    newList.splice(newList.indexOf(value), 1);
    setInputNameLis([...newList]);
  };

  const renderControl = useMemo(() => {
    return controlList?.map(item => {
      return (
        <Option key={item.id} value={item.type}>
          {item.name}
        </Option>
      );
    });
  }, [controlList]);

  const renderInput = () => {
    let list: any = [];
    for (let i = 0; i < inputNameList.length; i++) {
      list.push(
        <Form.Item
          name={['itemList', inputNameList[i]]}
          noStyle
          rules={[{ required: true, message: '多选单选时此项必填' }]}
        >
          <Form.Item noStyle name={['itemList', inputNameList[i]]}>
            <Input style={{ width: '90%', marginTop: 7 }} />
          </Form.Item>
          {inputNameList.length > 1 ? (
            <span
              style={{ padding: 5, cursor: 'pointer' }}
              onClick={e => {
                e.preventDefault();
                handleRemove(inputNameList[i]);
              }}
            >
              -
            </span>
          ) : null}
          {i === inputNameList.length - 1 ? (
            <span
              style={{ padding: 5, cursor: 'pointer' }}
              onClick={e => {
                e.preventDefault();
                handleAdd();
              }}
            >
              +
            </span>
          ) : null}
        </Form.Item>,
      );
    }
    return list;
  };

  return (
    <>
      {type === 2 ? (
        <Form.Item
          label="组名称"
          name="groupName"
          rules={[{ required: true, message: '请输入组名称!' }]}
        >
          <Input placeholder="请输入组名称" />
        </Form.Item>
      ) : null}
      <Form.Item
        label="控件名称"
        name="name"
        rules={[{ required: true, message: '请输入控件名称!' }]}
      >
        <Input placeholder="请输入控件名称" />
      </Form.Item>
      <Form.Item
        label="控件"
        rules={[{ required: true, message: '请选择控件类型!' }]}
        name="baseControlType"
        shouldUpdate={(prevValues, curValues) => {
          if (
            curValues.baseControlType === 'select' ||
            curValues.baseControlType === 'multiple'
          ) {
            setShowInput(true);
          } else {
            setShowInput(false);
          }
          return false;
        }}
      >
        <Select placeholder="请选择控件类型">{renderControl}</Select>
      </Form.Item>

      {showInput ? (
        <Form.Item label="控件值" name="itemList">
          <Input.Group compact>{renderInput()}</Input.Group>
        </Form.Item>
      ) : null}

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

      {/* {!showSpan ? (
        type !== 2 ? ( */}
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
      {/* ) : null
      ) : null} */}
    </>
  );
};

export default Edit;
