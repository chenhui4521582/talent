//节日配置
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Calendar,
  Radio,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  notification,
  Modal,
} from 'antd';
import locale from 'antd/lib/calendar/locale/zh_CN.js';
import calendar from 'solarday2lunarday';
import {
  listHoliday,
  removeHoliday,
  addHoliday,
  updateHoliday,
} from './services/globalConfig';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import moment from 'moment';
import './styles/holiday.less';

const { TextArea } = Input;
const { Option } = Select;

let now = new Date();
let year = now.getFullYear();
let month =
  now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
let str = year.toString() + '-' + month.toString() + '-' + day;
export default () => {
  const [param, setParam] = useState<string>(
    year.toString() + '-' + month.toString(),
  );

  const [detail, setDetail] = useState<any>();
  const [selectDay, setSelectDay] = useState<string>(str);
  const [type, setType] = useState<1 | 2 | 3>();
  const [selectId, setSelectId] = useState<string>();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  useEffect(() => {
    getDetail(false);
  }, [param]);

  async function getDetail(flag) {
    let res: GlobalResParams<any> = await listHoliday(param);
    if (res.status === 200) {
      setDetail(res.obj);
      let id = undefined;
      res.obj?.map(item => {
        if (item.date === selectDay) {
          id = item.holidayId;
          form1.setFieldsValue(item);
          let newType: any = undefined;
          if (item.welfare === 1 && item.workStatus === 0) {
            newType = 3;
          } else if (item.workStatus === 1) {
            newType = 1;
          } else {
            newType = 2;
          }
          setType(newType);
          return;
        }
      });
      setSelectId(id);
      if (!flag) {
        setSelectDay(str);
      }
    }
  }

  const onSelect = value => {
    setSelectDay(value.format('YYYY-MM-DD'));
    let id = undefined;
    let newType: any = undefined;
    let formItem = undefined;
    detail?.map(item => {
      if (item.date === value.format('YYYY-MM-DD')) {
        id = item.holidayId;
        formItem = item;
        if (item.welfare === 1) {
          newType = 3;
        } else if (item.workStatus === 1) {
          newType = 1;
        } else {
          newType = 2;
        }
      }
    });
    if (formItem) {
      form1.setFieldsValue(formItem);
    } else {
      form1.resetFields();
    }

    setType(newType);
    setSelectId(id);
  };

  const onChange = value => {
    setParam(value.format('YYYY-MM'));
  };

  const radioChange = e => {
    setType(e.target.value);
  };

  const renderDateCell = value => {
    let day: any = calendar.solar2lunar(value.format('YYYY-MM-DD'));
    let selectItem: any = undefined;
    detail?.map((item, index) => {
      if (item.date === value.format('YYYY-MM-DD')) {
        selectItem = item;
      }
    });

    return (
      <div style={{ textAlign: 'center', marginTop: 10, position: 'relative' }}>
        <div>{value.format('YYYY-MM-DD').split('-')[2]}</div>
        {selectItem ? (
          <div>
            {selectItem?.welfare ? (
              <>
                <div style={{ color: '#FF6600' }}>
                  福利 {selectItem.earlyOffHour || 0}小时
                </div>
                <div style={{ color: '#ccc' }}>{day.IDayCn}</div>
              </>
            ) : (
              <>
                {selectItem.workStatus === 1 ? (
                  <div style={{ color: 'rgba(0, 153, 204, 1)' }}>休</div>
                ) : (
                  <div style={{ color: '#FF6600' }}>补班</div>
                )}
                <span style={{ color: '#ccc' }}>{day.IDayCn}</span>
              </>
            )}
          </div>
        ) : (
          <div>
            {day.festivalName.length ? (
              <span style={{ color: '#FF6600' }}>{day.festivalName}</span>
            ) : (
              <span style={{ color: '#ccc' }}>{day.IDayCn}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSub = () => {
    let value1 = form1.getFieldsValue();
    let value2 = form2.getFieldsValue();
    let value = Object.assign(value1, value2);
    let obj: any = {};
    form1.validateFields().then(async data => {
      let api = updateHoliday;
      if (!value.holidayId) {
        api = addHoliday;
        obj.date = new Date(selectDay as any);
      } else {
        obj.holidayId = value.holidayId;
      }
      if (type === 1) {
        obj.workStatus = 1;
        obj.earlyOffHour = -1;
      }

      if (type === 2) {
        obj.workStatus = 0;
        obj.earlyOffHour = -1;
      }

      if (type === 3) {
        obj.workStatus = 0;
        obj.welfare = 1;
        obj.welfareType = value.welfareType;
        obj.earlyOffHour = value.earlyOffHour;
      }
      obj.welfareDescription = value.welfareDescription;
      let json: GlobalResParams<string> = await api(obj);
      if (json.status === 200) {
        notification['success']({
          message: json.msg,
          description: '',
        });
        getDetail(true);
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await removeHoliday(selectId);
        if (res.status === 200) {
          getDetail(true);
          form1.resetFields();
          setType(undefined);
          setSelectId(undefined);
          notification['success']({
            message: res.msg,
            description: '',
          });
        } else {
          notification['error']({
            message: res.msg,
            description: '',
          });
        }
      },
    });
  };

  const renderBottom = useMemo(() => {
    let day: any = calendar.solar2lunar(selectDay);
    return (
      <>
        <div
          style={{
            marginRight: '2vw',
            paddingRight: '2vw',
            borderRight: '1px solid #333333',
            width: '10vw',
            height: 260,
            float: 'left',
          }}
        >
          <h3>
            {selectDay?.split('-')[0]}年{selectDay?.split('-')[1]}月
            {selectDay?.split('-')[2]}日
          </h3>
          <p>农历{day.fullLunarMonthString}</p>
          <p>{day.ncWeek}</p>
        </div>
        <div style={{ float: 'left' }}>
          <p>请选择配置类型</p>
          <Radio.Group value={type} onChange={radioChange}>
            <Radio value={1}>法定节假日</Radio>
            <Radio value={2}>调休后补班</Radio>
            <Radio value={3}>公司福利</Radio>
          </Radio.Group>
        </div>
      </>
    );
  }, [detail, selectDay, type]);

  const renderForm = useMemo(() => {
    return (
      <div style={{ float: 'left', width: '60vw', marginTop: 20 }}>
        <Form
          form={form1}
          style={{ float: 'left', width: '25vw', marginTop: 20 }}
        >
          <Form.Item name="holidayId" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          {type === 3 ? (
            <Form.Item
              label="福利类型"
              name="welfareType"
              rules={[{ required: true, message: '请选择福利类型!' }]}
              style={{ width: '20vw' }}
            >
              <Select>
                <Option value={1}>提前下班</Option>
              </Select>
            </Form.Item>
          ) : null}
          {type === 3 ? (
            <Form.Item
              label="提前下班时长"
              name="earlyOffHour"
              rules={[{ required: true, message: '请选择提前下班时长!' }]}
              style={{ width: '20vw' }}
            >
              <Select>
                <Option value={1}>1小时</Option>
                <Option value={2}>2小时</Option>
                <Option value={3}>3小时</Option>
                <Option value={4}>4小时</Option>
                <Option value={5}>5小时</Option>
                <Option value={6}>6小时</Option>
                <Option value={7}>7小时</Option>
                <Option value={8}>8小时</Option>
              </Select>
            </Form.Item>
          ) : null}

          {type ? (
            <Form.Item
              label="说明"
              name="welfareDescription"
              style={{ width: '20vw' }}
            >
              <TextArea />
            </Form.Item>
          ) : null}
        </Form>
        {/* <Form
          form={form2}
          style={{ marginLeft: '3vw', float: 'left', width: '25vw' }}
        >
          <Form.Item label="性别" name="gender" style={{ width: '20vw' }}>
            <Select>
              <Option value={0}>不限</Option>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </Form.Item>
          <Form.Item label="年龄范围" name="age" style={{ width: '20vw' }}>
            <Input.Group compact>
              <Form.Item name={['age']} noStyle>
                <Form.Item
                  name={['age', 'smallestAge']}
                  style={{ paddingRight: 30 }}
                >
                  <InputNumber />
                </Form.Item>
                <span style={{ paddingTop: 8, marginRight: 30 }}>至</span>
                <Form.Item
                  name={['age', 'biggestAge']}
                  style={{ paddingRight: 30 }}
                >
                  <InputNumber />
                </Form.Item>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name="childAgeLimit"
            style={{ width: '20vw', marginTop: '-24px' }}
          >
            <span style={{ marginRight: 8 }}>有子女，且</span>
            <Form.Item label="性别" name="childAgeLimit" noStyle>
              <InputNumber />
            </Form.Item>
            <span style={{ marginLeft: 8 }}>周岁及以下</span>
          </Form.Item>
        </Form>
   */}
      </div>
    );
  }, [type, selectDay, detail]);

  return (
    <Card title="节日配置">
      <Calendar
        style={{ textAlign: 'center' }}
        dateCellRender={renderDateCell}
        locale={locale}
        onSelect={onSelect}
        onChange={onChange}
        value={moment(selectDay)}
      />
      <div className="holiday">
        {renderBottom}
        {renderForm}
        <div style={{ clear: 'both' }} />
        {!type ? null : (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={handleSub}
            >
              保存
            </Button>
            {selectId ? <Button onClick={handleDelete}>删除</Button> : null}
          </div>
        )}
      </div>
    </Card>
  );
};
