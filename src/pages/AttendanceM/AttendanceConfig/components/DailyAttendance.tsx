// 添加排班
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Checkbox, Select, Form, TimePicker, Input, Radio } from 'antd';
const { RangePicker } = TimePicker;
import moment from 'moment';
import locale from 'antd/lib/calendar/locale/zh_CN.js';
import '../styles/scheduling.less';

const { Option } = Select;
export default props => {
  const { clockTimeList } = props;
  const [form] = Form.useForm();
  const [editType, setEditType] = useState<'edit' | 'add'>();
  const [list, setList] = useState<any>();
  const [index, setIndex] = useState<number>();
  const [days, setDays] = useState<any[]>([]);
  const [restType, setRestType] = useState<number>(0);

  useEffect(() => {
    list && list.length && props.onChange(list);
    let arr: any = [];
    list?.map((item, indexs) => {
      arr = arr.concat(item.day);
    });
    setDays([...new Set(arr)]);
  }, [list]);

  useEffect(() => {
    let newList = JSON.parse(JSON.stringify(list || []));
    clockTimeList?.map(item => {
      let obj: any = {};
      let day: any = [];
      if (item.monday) {
        day.push('monday');
      }
      if (item.tuesday) {
        day.push('tuesday');
      }
      if (item.wednesday) {
        day.push('wednesday');
      }
      if (item.thursday) {
        day.push('thursday');
      }
      if (item.friday) {
        day.push('friday');
      }
      if (item.saturday) {
        day.push('saturday');
      }
      if (item.sunday) {
        day.push('sunday');
      }
      obj.clockTimeId = item.clockTimeId;
      obj.day = day;
      obj.clockPeriods = [
        item?.clockPeriods?.startTime
          ? moment('2019-02-13 ' + item?.clockPeriods?.startTime + ':00')
          : undefined,
        item?.clockPeriods?.endTime
          ? moment('2019-02-13 ' + item?.clockPeriods?.endTime + ':00')
          : undefined,
      ];
      obj.flex = {
        flexible: item.flexible,
        leaveEarly: item.leaveEarly,
        leaveLater: item.leaveLater,
      };
      obj.rest = {
        breakTimeCalculation: item.breakTimeCalculation,
        'breakTimeStart-breakTimeEnd': [
          item.breakTimeStart
            ? moment('2019-02-13 ' + item.breakTimeStart + ':00')
            : undefined,
          item.breakTimeEnd
            ? moment('2019-02-13 ' + item.breakTimeEnd + ':00')
            : undefined,
        ],
      };
      obj.itemList = {
        endLimit: item.endLimit,
        startLimit: item.startLimit,
      };
      newList.push(obj);
    });
    setList(newList);
  }, [clockTimeList]);

  const handleOk = () => {
    form.validateFields().then(value => {
      let newList = JSON.parse(JSON.stringify(list || []));
      if (editType === 'add') {
        newList.push(value);
      } else {
        if (index || index === 0) {
          newList[index] = value;
        }
      }
      setList(newList);
      setEditType(undefined);
      setIndex(undefined);
      form.resetFields();
    });
  };

  const renderList = useMemo(() => {
    return list?.map((item, indexs) => {
      let str: string[] = [];
      item.day?.map(day => {
        if (day === 'monday') {
          str.push('星期一');
        } else if (day === 'tuesday') {
          str.push('星期二');
        } else if (day === 'wednesday') {
          str.push('星期三');
        } else if (day === 'thursday') {
          str.push('星期四');
        } else if (day === 'friday') {
          str.push('星期五');
        } else if (day === 'saturday') {
          str.push('星期六');
        } else if (day === 'sunday') {
          str.push('星期日');
        }
      });
      return (
        <div className="scheduling-box-one-item" key={index}>
          <span>{str.join('，')}</span>
          <span>
            {moment(item.clockPeriods[0]).format('HH:mm') +
              '——' +
              moment(item.clockPeriods[1]).format('HH:mm')}
          </span>
          <span>
            <a
              onClick={() => {
                setEditType('edit');
                setIndex(indexs);
                setRestType(item?.rest?.breakTimeCalculation);
                form.setFieldsValue(item);
              }}
            >
              编辑
            </a>
            <a
              style={{ marginLeft: 6 }}
              onClick={() => {
                let newList = JSON.parse(JSON.stringify(list));
                newList.splice(index, 1);
                setList(newList);
              }}
            >
              删除
            </a>
          </span>
        </div>
      );
    });
  }, [list]);

  const handleDisable = value => {
    if (editType === 'add') {
      return days.indexOf(value) > -1;
    } else {
      return false;
    }
  };

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        <a
          style={{ padding: '0px 12px', lineHeight: '40px' }}
          onClick={() => {
            setEditType('add');
          }}
        >
          添加
        </a>
      </div>
      {list?.length ? (
        <div className="scheduling-box-one">{renderList}</div>
      ) : null}
      <Modal
        title={editType === 'edit' ? '编辑打卡时间' : '新增打卡时间'}
        okText="确认"
        cancelText="取消"
        visible={!!editType}
        width="40vw"
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          setEditType(undefined);
          form.resetFields();
        }}
      >
        <Form form={form}>
          <Form.Item
            label="clockTimeId"
            name="clockTimeId"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="工作日"
            name="day"
            rules={[{ required: true, message: '请选择工作日!' }]}
            style={{ marginBottom: 40 }}
          >
            <Checkbox.Group>
              <Checkbox value="monday" disabled={handleDisable('monday')}>
                星期一
              </Checkbox>
              <Checkbox value="tuesday" disabled={handleDisable('tuesday')}>
                星期二
              </Checkbox>
              <Checkbox value="wednesday" disabled={handleDisable('wednesday')}>
                星期三
              </Checkbox>
              <Checkbox value="thursday" disabled={handleDisable('wednesday')}>
                星期四
              </Checkbox>
              <Checkbox value="friday" disabled={handleDisable('friday')}>
                星期五
              </Checkbox>
              <Checkbox value="saturday" disabled={handleDisable('saturday')}>
                星期六
              </Checkbox>
              <Checkbox value="sunday" disabled={handleDisable('sunday')}>
                星期天
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="打卡时间"
            name="clockPeriods"
            rules={[{ required: true, message: '请输入打卡时间!' }]}
            style={{ marginBottom: 40 }}
          >
            <RangePicker
              format="HH:mm"
              allowClear={true}
              picker="time"
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            label="休息时间"
            name="rest"
            style={{ marginBottom: 40 }}
            rules={[{ required: true, message: '' }]}
          >
            <Input.Group compact style={{ marginTop: 6 }}>
              <Form.Item
                name={['rest', 'breakTimeCalculation']}
                // noStyle
                style={{ display: 'block', marginTop: '-6px' }}
                initialValue={0}
              >
                <Radio.Group
                  onChange={(e: any) => {
                    setRestType(e.target.value);
                  }}
                >
                  <Radio value={0}>开启</Radio>
                  <Radio value={1}>不开启</Radio>
                </Radio.Group>
              </Form.Item>
              {restType === 0 ? (
                <Form.Item
                  name={['rest', 'breakTimeStart-breakTimeEnd']}
                  rules={[{ required: true, message: '请选择休息时间!' }]}
                >
                  <RangePicker
                    format="HH:mm"
                    allowClear={true}
                    picker="time"
                    locale={locale}
                  />
                </Form.Item>
              ) : null}
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="弹性上下班"
            name="flex"
            style={{ marginBottom: 40 }}
          >
            <Input.Group compact style={{ marginTop: 6 }}>
              <Form.Item name={['flex', 'flexible']} noStyle initialValue={0}>
                <Radio.Group>
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>不开启</Radio>
                </Radio.Group>
              </Form.Item>
              <br />
              <Form.Item
                name={['flex', 'leaveEarly']}
                rules={[{ required: true, message: '请选择时间段!' }]}
                label="最多早到早走"
                initialValue={0}
                style={{ marginTop: 10 }}
              >
                <Select placeholder="请选择" style={{ minWidth: 200 }}>
                  <Option value={0}>0分钟</Option>
                  <Option value={15}>15分钟</Option>
                  <Option value={30}>30分钟</Option>
                  <Option value={45}>45分钟</Option>
                  <Option value={60}>60分钟</Option>
                  <Option value={75}>75分钟</Option>
                  <Option value={90}>90分钟</Option>
                  <Option value={105}>105分钟</Option>
                  <Option value={120}>120分钟</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['flex', 'leaveLater']}
                rules={[{ required: true, message: '请选择时间段!' }]}
                label="最多晚到晚走"
                initialValue={0}
                style={{ paddingLeft: 20, marginTop: 10 }}
              >
                <Select placeholder="请选择" style={{ minWidth: 200 }}>
                  <Option value={0}>0分钟</Option>
                  <Option value={15}>15分钟</Option>
                  <Option value={30}>30分钟</Option>
                  <Option value={45}>45分钟</Option>
                  <Option value={60}>60分钟</Option>
                  <Option value={75}>75分钟</Option>
                  <Option value={90}>90分钟</Option>
                  <Option value={105}>105分钟</Option>
                  <Option value={120}>120分钟</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item label="打卡时间限制">
            <Input.Group compact>
              <Form.Item
                name={['itemList', 'startLimit']}
                rules={[{ required: true, message: '请选择时间段!' }]}
                label="可打上班卡"
                initialValue={1}
              >
                <Select placeholder="请选择" style={{ minWidth: 200 }}>
                  <Option value={1}>三小时内</Option>
                  <Option value={2}>二小时内</Option>
                  <Option value={3}>一小时内</Option>
                  <Option value={4}>三十分钟内</Option>
                  <Option value={5}>十五分钟内</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['itemList', 'endLimit']}
                rules={[{ required: true, message: '请选择时间段!' }]}
                label="可打下班卡"
                initialValue={1}
                style={{ paddingLeft: 20 }}
              >
                <Select placeholder="请选择" style={{ minWidth: 200 }}>
                  <Option value={1}>八小时</Option>
                  <Option value={2}>六小时</Option>
                  <Option value={3}>四小时</Option>
                  <Option value={4}>三小时</Option>
                  <Option value={5}>二小时</Option>
                  <Option value={6}>一小时</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
