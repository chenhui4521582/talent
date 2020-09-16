// 添加排班
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Checkbox, Select, Form, TimePicker, Input, Radio } from 'antd';
const { RangePicker } = TimePicker;
import moment from 'moment';
import locale from 'antd/lib/calendar/locale/zh_CN.js';
import '../styles/scheduling.less';

const { Option } = Select;
export default props => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState<'edit' | 'add'>();

  const [list, setList] = useState<any>([]);

  const handleOk = () => {
    form.validateFields().then(value => {
      let newList = JSON.parse(JSON.stringify(list));
      console.log(value);
      newList.push(value);
      setList(newList);
      setEditType(undefined);
      form.resetFields();
    });
  };

  const renderList = useMemo(() => {
    console.log(list);
    return list.map((item, index) => {
      return (
        <div className="scheduling-box-one-item" key={index}>
          <span>{item.name}</span>
          <span>
            {moment(item.clockPeriods[0]).format('HH:mm:ss') +
              '——' +
              moment(item.clockPeriods[1]).format('HH:mm:ss')}
          </span>
          <span>
            <a
              onClick={() => {
                console.log(item);
                setEditType('edit');
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
        title={editType === 'edit' ? '编辑排版' : '新增排版'}
        okText="确认"
        cancelText="取消"
        visible={!!editType}
        width="40vw"
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          setEditType(undefined);
        }}
      >
        <Form form={form}>
          <Form.Item
            label="工作日"
            name="ruleName"
            rules={[{ required: true, message: '请输入用户名称!' }]}
            style={{ marginBottom: 40 }}
          >
            <Checkbox.Group>
              <Checkbox value="monday">星期一</Checkbox>
              <Checkbox value="tuesday">星期二</Checkbox>
              <Checkbox value="wednesday">星期三</Checkbox>
              <Checkbox value="thursday">星期四</Checkbox>
              <Checkbox value="friday">星期五</Checkbox>
              <Checkbox value="saturday">星期六</Checkbox>
              <Checkbox value="sunday">星期天</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="打卡时间"
            name="clockPeriods"
            rules={[{ required: true, message: '请输入用户名称!' }]}
            style={{ marginBottom: 40 }}
          >
            <RangePicker allowClear={true} picker="time" locale={locale} />
          </Form.Item>

          <Form.Item label="休息时间" name="rest" style={{ marginBottom: 40 }}>
            <Input.Group compact style={{ marginTop: 6 }}>
              <Form.Item
                name={['rest', 'breakTimeCalculation']}
                noStyle
                initialValue={0}
              >
                <Radio.Group>
                  <Radio value={0}>不开启</Radio>
                  <Radio value={1}>开启</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name={['rest', 'breakTimeStart-breakTimeEnd']}
                rules={[{ required: true, message: '请选择休息时间!' }]}
                noStyle
                initialValue={0}
              >
                <RangePicker allowClear={true} picker="time" locale={locale} />
              </Form.Item>
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
                  <Radio value={0}>不开启</Radio>
                  <Radio value={1}>开启</Radio>
                </Radio.Group>
              </Form.Item>
              <br />
              <Form.Item
                name={['flex', 'leaveEarly']}
                rules={[{ required: true, message: '请选择时间段!' }]}
                label="最多早到早走"
                initialValue={0}
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
                style={{ paddingLeft: 20 }}
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
                  <Option value={4}>4三十分钟内</Option>
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
