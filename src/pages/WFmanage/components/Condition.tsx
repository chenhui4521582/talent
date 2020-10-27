import React, {
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Input,
  Radio,
  Form,
  Select,
  Col,
  Row,
  InputNumber,
  Checkbox,
} from 'antd';
import { GlobalResParams } from '@/types/ITypes';
import { getFormSimple } from '../services/rule';
import LabelOrUser from './LabelOrUser';

const { Option } = Select;
interface IListItem {
  id: string;
  name: string;
  type: string;
  baseControlType: string;
  itemList: string;
}

export default forwardRef((props: any, formRef) => {
  const { selectRule } = props;
  const [form] = Form.useForm();
  const [formItemList, setFormItemList] = useState<any[]>();
  const [controlList, setControlList] = useState<IListItem[]>();
  const [numberList, setNumberList] = useState<any[]>();
  const [formList, setFormList] = useState<any>();

  useEffect(() => {
    async function getControlList() {
      let res: GlobalResParams<IListItem[]> = await getFormSimple(
        props?.match.params.id,
      );
      if (res.status === 200) {
        let list = res.obj;
        let newList: IListItem[] = [];
        list?.map(item => {
          if (
            item.baseControlType === 'number' ||
            item.baseControlType === 'areatext' ||
            item.baseControlType === 'select' ||
            item.baseControlType === 'multiple' ||
            item.baseControlType === 'text'
          ) {
            newList.push(item);
          }
        });
        newList.push({
          baseControlType: 'applicant',
          name: '申请人',
          id: '',
        } as IListItem);
        setControlList(newList);
      }
    }
    getControlList();
  }, [selectRule]);

  useEffect(() => {
    if (selectRule?.resRuleCurdParams) {
      setNumberList(selectRule.resRuleCurdParams);
    }
  }, [selectRule]);

  useImperativeHandle(formRef, () => {
    return {
      getvalue: () => {
        return form;
      },
    };
  });

  const handleAdd = () => {
    let newList = JSON.parse(JSON.stringify(numberList || []));
    newList?.push(1);
    setNumberList(newList);
  };

  const handleDelete = index => {
    let newList = JSON.parse(JSON.stringify(numberList || []));
    newList?.splice(index, 1);
    setNumberList(newList);
  };

  const renderFormItem = useMemo(() => {
    return numberList?.map((item, index) => {
      return (
        <FormItem
          key={controlList}
          list={controlList}
          Index={index}
          handleDelete={handleDelete}
          form={form}
          selectRule={item}
        />
      );
    });
  }, [numberList, controlList, selectRule]);

  return (
    <>
      <Form form={form}>
        <Row>
          <Col span={8}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入条件名称!' }]}
              initialValue={selectRule ? selectRule.name : undefined}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8} offset={1}>
            <Form.Item
              name="priority"
              rules={[{ required: true, message: '请选择优先级!' }]}
              initialValue={selectRule ? selectRule.priority : undefined}
            >
              <Select placeholder="请选择优先级" allowClear>
                {selectRule?.rule ? (
                  <>
                    {selectRule?.rule?.map((item, index) => {
                      return (
                        <Option key={index} value={index + 1}>
                          优先级{index + 1}
                        </Option>
                      );
                    })}
                    <Option value={selectRule?.rule.length + 1}>
                      优先级{selectRule?.rule.length + 1}
                    </Option>
                  </>
                ) : (
                  <>
                    <Option value={1}>优先级1</Option>
                    <Option value={2}>优先级2</Option>
                  </>
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <h4>同时满足以下条件</h4>
        {renderFormItem}
      </Form>
      <Row style={{ marginTop: 10 }}>
        <a onClick={handleAdd}>+添加条件</a>
      </Row>
    </>
  );
});

const FormItem = props => {
  const { list, Index, handleDelete, form, selectRule } = props;
  const [type, setType] = useState<number>();
  const [itemList, setItemList] = useState<string>();

  useEffect(() => {
    if (type === 2 || type === 5) {
      let obj: any = {};
      obj[Index] = {
        comparetor: undefined,
      };
      form.setFieldsValue(obj);
    }
  }, [type]);

  const handleType1 = str => {
    switch (str) {
      case 1:
        return 'applicant';
      case 2:
        return 'number';
      case 3:
        return 'select';
      case 4:
        return 'multiple';
      case 5:
        return 'areatext';
    }
  };

  useEffect(() => {
    let obj: any = {};
    if (selectRule.refResFormControl || selectRule.type || selectRule.value) {
      obj[Index] = {
        value: selectRule.value,
        type: selectRule.refResFormControl
          ? selectRule.refResFormControl + '&&' + handleType1(selectRule.type)
          : '' + '&&' + handleType1(selectRule.type),
        comparetor: parseInt(selectRule.comparetor),
        id: selectRule.id,
      };
      onChange(
        selectRule.refResFormControl + '&&' + handleType1(selectRule.type),
      );
      setTimeout(() => {
        form.setFieldsValue(obj);
      }, 1000);
    }
  }, [selectRule]);

  const renderForm = () => {
    switch (type) {
      // 申请人
      case 1:
        return (
          <>
            <Col offset={1} style={{ display: 'none' }}>
              <Form.Item
                name={[Index, 'comparetor']}
                rules={[{ required: true, message: '请选择!' }]}
                initialValue={11}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col offset={1}>
              <span style={{ lineHeight: '32px' }}>为</span>
            </Col>
            <Col span={10} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <LabelOrUser {...props} value={selectRule.value} />
              </Form.Item>
            </Col>
            <Col span={10} offset={1} hidden>
              <Form.Item name={[Index, 'id']}>
                <Input />
              </Form.Item>
            </Col>
          </>
        );
      // 数字
      case 2:
        return (
          <>
            <Col offset={1} span={3}>
              <Form.Item
                name={[Index, 'comparetor']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <Select placeholder="请选择优先级" allowClear>
                  <Option value={1}>等于</Option>
                  <Option value={2}>大于</Option>
                  <Option value={3}>大于等于</Option>
                  <Option value={4}>小于</Option>
                  <Option value={5}>小于等于</Option>
                  <Option value={6}>介于</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={10} offset={1} hidden>
              <Form.Item name={[Index, 'id']}>
                <Input />
              </Form.Item>
            </Col>
          </>
        );
      //单选
      case 3:
        return (
          <>
            <Col offset={1} style={{ display: 'none' }}>
              <Form.Item
                name={[Index, 'comparetor']}
                rules={[{ required: true, message: '请选择!' }]}
                initialValue={9}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <Radio.Group>
                  {itemList?.split('|')?.map((item, index) => {
                    return (
                      <Radio value={item} key={index}>
                        {item}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={10} offset={1} hidden>
              <Form.Item name={[Index, 'id']}>
                <Input />
              </Form.Item>
            </Col>
          </>
        );
      // 多选
      case 4:
        return (
          <>
            <Col offset={1} style={{ display: 'none' }}>
              <Form.Item
                name={[Index, 'comparetor']}
                rules={[{ required: true, message: '请选择!' }]}
                initialValue={10}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <Checkbox.Group>
                  {itemList?.split('|')?.map((item, index) => {
                    return (
                      <Checkbox value={item} key={index}>
                        {item}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={10} offset={1} hidden>
              <Form.Item name={[Index, 'id']}>
                <Input />
              </Form.Item>
            </Col>
          </>
        );
      // 文本
      case 5:
        return (
          <>
            <Col offset={1}>
              <Form.Item
                name={[Index, 'comparetor']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <Select placeholder="" allowClear style={{ width: '100px' }}>
                  <Option value={7}>精准字符串匹配</Option>
                  <Option value={8}>模糊匹配</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} offset={1} hidden>
              <Form.Item name={[Index, 'id']}>
                <Input />
              </Form.Item>
            </Col>
          </>
        );
      default:
        return null;
    }
  };

  const onChange = values => {
    let type = values?.split('&&')[1];
    if (type === 'applicant') {
      setType(1);
    } else if (type === 'number') {
      setType(2);
    } else if (type === 'select') {
      setType(3);
      let itemLists: any = '';
      list?.map(item => {
        if (item.id == values?.split('&&')[0]) {
          itemLists = item.itemList;
        }
      });
      setItemList(itemLists);
    } else if (type === 'multiple') {
      setType(4);
      let itemLists: any = '';
      list?.map(item => {
        if (item.id == values?.split('&&')[0]) {
          itemLists = item.itemList;
        }
      });
      setItemList(itemLists);
    } else if (type === 'areatext' || type === 'text') {
      setType(5);
    }
  };

  const handleType = type => {
    if (type === 'applicant') {
      return '申请人';
    } else if (type === 'number') {
      return '数字';
    } else if (type === 'select') {
      return '单选框';
    } else if (type === 'multiple') {
      return '多选框';
    } else if (type === 'areatext') {
      return '文本框';
    }
  };

  return list?.length ? (
    <>
      <Row>
        <Col>
          <a
            style={{ lineHeight: '32px' }}
            onClick={() => {
              handleDelete(Index);
            }}
          >
            删除
          </a>
        </Col>
        <Col span={8} offset={1}>
          <Form.Item
            name={[Index, 'type']}
            rules={[{ required: true, message: '请选择!' }]}
          >
            <Select placeholder="请选择" allowClear onChange={onChange}>
              {list?.map(item => {
                return (
                  <Option
                    key={item.id}
                    value={item.id + '&&' + item.baseControlType}
                  >
                    {item.childName}({item.name}) (
                    {handleType(item.baseControlType)})
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        {renderForm()}
      </Row>
    </>
  ) : null;
};
