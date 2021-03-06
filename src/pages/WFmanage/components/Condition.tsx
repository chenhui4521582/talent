import React, {
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Input, Radio, Form, Select, Col, Row, InputNumber } from 'antd';
import { getUnitType } from '@/pages/Workflow/services/home';
import { GlobalResParams } from '@/types/ITypes';
import { useRankM } from '@/models/global';
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

interface IUnitList {
  id: number;
  desc: string;
}

export default forwardRef((props: any, formRef) => {
  const { selectRule } = props;
  const [form] = Form.useForm();
  const [formItemList, setFormItemList] = useState<any[]>();
  const [controlList, setControlList] = useState<IListItem[] | any>();
  const [numberList, setNumberList] = useState<any[]>([1]);
  const [formList, setFormList] = useState<any>();
  const [unitList, steUnitList] = useState<IUnitList[]>();

  useEffect(() => {
    async function getUnitList() {
      let json1: GlobalResParams<IUnitList[]> = await getUnitType();
      if (json1.status === 200) {
        steUnitList(json1?.obj);
      }
    }
    getUnitList();
  }, []);

  useEffect(() => {
    async function getControlList() {
      let res: GlobalResParams<IListItem[]> = await getFormSimple(
        props?.match.params.id,
      );
      if (res?.status === 200) {
        let list = res.obj;
        let newList: IListItem[] | any = [];
        list?.map(item => {
          if (
            item.baseControlType === 'number' ||
            item.baseControlType === 'areatext' ||
            item.baseControlType === 'text' ||
            item.baseControlType === 'select' ||
            item.baseControlType === 'multiple' ||
            item.baseControlType === 'text' ||
            item.baseControlType === 'positionMLevel' ||
            item.baseControlType === 'money' ||
            item.baseControlType === 'totalVacationTime' ||
            item.baseControlType === 'totalReVacationTime' ||
            item.baseControlType === 'overTimeTotal' ||
            item.baseControlType === 'vacationTime'
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
    newList?.push(newList?.length || 0);
    setNumberList(newList);
  };

  const handleDelete = index => {
    let newList = JSON.parse(JSON.stringify(numberList || []));
    if (newList.length > 1) {
      newList?.splice(index, 1);
      setNumberList(newList);
    }
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
          numberList={numberList}
          unitList={unitList}
        />
      );
    });
  }, [numberList, controlList, selectRule, unitList]);

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
                {selectRule.priority || selectRule.index ? (
                  <Option value={selectRule.priority || selectRule.index}>
                    优先级{selectRule.priority || selectRule.index}
                  </Option>
                ) : (
                  <Option value={1}>优先级1</Option>
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
  const {
    list,
    Index,
    handleDelete,
    form,
    selectRule,
    numberList,
    unitList,
  } = props;
  const [type, setType] = useState<number>();
  const [itemList, setItemList] = useState<string>();
  const { rankList } = useRankM();
  const [showUnit, setShowUnit] = useState<boolean>(false);

  useEffect(() => {
    if (type === 2 || type === 5) {
      let obj: any = {};
      obj[Index] = {
        comparetor: undefined,
      };
      form.setFieldsValue(obj);
    }
  }, [type]);

  useEffect(() => {
    let obj: any = {};
    let refResFormControlType: string = 'applicant';
    let itemLists: string = '';
    let arr: any = [];
    list?.map(item => {
      if (item.id == selectRule.refResFormControl) {
        refResFormControlType = item.baseControlType;
        if (
          refResFormControlType === 'multiple' ||
          refResFormControlType === 'select'
        ) {
          itemLists = item.itemList;
          setItemList(itemLists);
        }
        if (refResFormControlType === 'positionMLevel') {
          rankList?.map(item => {
            arr.push(item.rankName);
          });
          setItemList(arr.join('|'));
        }
      }
    });
    if (selectRule.refResFormControl || selectRule.type || selectRule.value) {
      obj[Index] = {
        value:
          selectRule.type === 4
            ? selectRule?.value
                .toString()
                ?.replace(/\"/g, '')
                .split('|')
            : selectRule?.value.toString()?.replace(/\"/g, ''),
        type: selectRule.refResFormControl
          ? selectRule.refResFormControl + '&&' + refResFormControlType
          : '' + '&&' + 'applicant',
        comparetor: parseInt(selectRule.comparetor),
        id: selectRule.id,
      };
      if (selectRule.unitType) {
        obj[Index].unitType = selectRule.unitType;
      }

      onChange(selectRule.refResFormControl + '&&' + refResFormControlType);
      // setTimeout(() => {
      form?.setFieldsValue && form.setFieldsValue(obj);
      // }, 1000);
    }
  }, [selectRule, rankList]);

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
                <LabelOrUser {...props} selectRule={selectRule} />
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
            <Col offset={1} span={6}>
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
                  {/* <Option value={6}>介于</Option> */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6} offset={1} hidden>
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
            <Col span={6} offset={1}>
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
            <Col span={6} offset={1}>
              <Form.Item
                name={[Index, 'value']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <Select mode="multiple" placeholder="请选择">
                  {itemList?.split('|')?.map((item, index) => {
                    return (
                      <Option value={item} key={index}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
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
            <Col offset={1} span={6}>
              <Form.Item
                name={[Index, 'comparetor']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <Select placeholder="" allowClear>
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
    let obj = {};
    obj[Index] = {
      value: undefined,
    };
    form.setFieldsValue(obj);
    let type = values?.split('&&')[1];
    let id = values?.split('&&')[0];
    if (type === 'applicant') {
      setType(1);
      setShowUnit(false);
    } else if (
      type === 'number' ||
      type === 'money' ||
      type === 'totalVacationTime' ||
      type === 'totalReVacationTime' ||
      type === 'overTimeTotal' ||
      type === 'vacationTime'
    ) {
      setShowUnit(true);
      setType(2);
    } else if (
      type === 'multiple' ||
      type === 'select' ||
      type === 'positionMLevel'
    ) {
      setShowUnit(false);
      setType(4);
      let itemLists: any = '';
      let arr: any = [];

      list?.map(item => {
        if (item.id == values?.split('&&')[0]) {
          itemLists = item.itemList;
        }
      });

      if (type === 'positionMLevel') {
        rankList?.map(item => {
          arr.push(item.rankName);
        });
        setItemList(arr.join('|'));
      } else {
        setItemList(itemLists);
      }
    } else if (type === 'areatext' || type === 'text') {
      setShowUnit(false);
      setType(5);
    }
  };

  return list?.length ? (
    <>
      <Row>
        {numberList?.length > 1 ? (
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
        ) : null}
        <Col span={5} offset={1}>
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
                    {item.childName}({item.name})
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        {renderForm()}
        {showUnit ? (
          <Col span={2} offset={1}>
            <Form.Item
              name={[Index, 'unitType']}
              rules={[{ required: true, message: '请选择!' }]}
              initialValue={0}
            >
              <Select placeholder="请选择单位" allowClear>
                {unitList?.map(item => {
                  return (
                    <Option key={item.code} value={item.code}>
                      {item.desc}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        ) : null}
      </Row>
    </>
  ) : null;
};
