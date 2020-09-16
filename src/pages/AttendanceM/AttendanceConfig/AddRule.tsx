//新增规则
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Button, Select, Radio, Checkbox } from 'antd';
import AddUserList from './components/AddUserList';
import AddTime from './components/AddTime';
import AddSchedulingList from './components/AddSchedulingList';
import { GlobalResParams } from '@/types/ITypes';
import { getRuleDetail } from './services/rule';
import DailyAttendance from './components/DailyAttendance';
import AreasList from './components/AreasList';
import Wifi from './components/Wifi';

const { Option } = Select;
export default props => {
  const [form] = Form.useForm();
  const { ruleId } = props.location.query;
  const [ruleDetail, setRuleDetail] = useState<any>();
  const [userList, setUserList] = useState<any>([]);
  const [timeList, setTimeList] = useState<any>([]);
  const [userSchedulList, setUserSchedulList] = useState<any>([]);
  const [ruleType, setRuleType] = useState<0 | 1>(0);
  const [phoneClock, setPhoneClock] = useState<0 | 1>(0);

  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await getRuleDetail(ruleId);
      console.log(res);
      if (res.status === 200) {
        setRuleDetail(res.obj);
        form.setFieldsValue({
          ruleName: res.obj.ruleName,
          ruleType: res.obj.ruleType,
        });
      }
    }
    getDetail();
  }, []);

  const handleChangeUserList = list => {
    console.log('value');
    setUserList(list);
  };

  return (
    <Card title="新增规则">
      <Form form={form}>
        <Form.Item
          label="规则名称"
          name="ruleName"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: 400, marginBottom: 40 }}
        >
          <Input placeholder="规则名称" />
        </Form.Item>

        <Form.Item
          label="规则类型"
          name="ruleType"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: 400, marginBottom: 20 }}
          initialValue={0}
        >
          <Radio.Group
            onChange={e => {
              setRuleType(e.target.value);
            }}
          >
            <Radio value={0} style={{ display: 'block', marginBottom: 6 }}>
              固定时间上下班
            </Radio>
            <Radio value={1} style={{ display: 'block', marginBottom: 6 }}>
              按排班上下班
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="打卡人员"
          name="userCodes"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{
            width: '82vw',
            marginBottom: 20,
            minHeight: '40px',
            overflowY: 'auto',
          }}
        >
          <AddUserList
            {...props}
            ruleDetail={ruleDetail}
            handleChangeUserList={handleChangeUserList}
          />
        </Form.Item>

        {ruleType === 1 ? (
          <Form.Item
            label="排班设置"
            name="userCodes"
            rules={[{ required: true, message: '请输入用户名称!' }]}
            style={{ width: '82vw', marginBottom: 20, minHeight: '40px' }}
          >
            <AddSchedulingList
              {...props}
              ruleDetail={ruleDetail}
              userList={() => {
                let newUserList: any = [];
                userList.map(item => {
                  for (let key in item) {
                    newUserList = newUserList.concat(item[key]);
                  }
                });
                return newUserList;
              }}
            />
          </Form.Item>
        ) : null}
        {ruleType === 0 ? (
          <Form.Item
            label="打卡时间"
            name="clockTimes"
            rules={[{ required: true, message: '请输入用户名称!' }]}
            style={{ width: 400, marginBottom: 20 }}
          >
            <DailyAttendance />
          </Form.Item>
        ) : null}
        <Form.Item
          label="手机打卡"
          name="enablePhoneClock"
          style={{ marginBottom: 20 }}
        >
          <Checkbox.Group
            onChange={e => {
              setPhoneClock(e.length === 0 ? 0 : 1);
            }}
          >
            <Checkbox value={1}>
              开启 开启手机端打卡，考勤状态将和门禁系统打卡结合统计
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>

        {phoneClock ? (
          <Form.Item label="打卡地点" name="">
            <div>位置和WIFI满足任意一项即可打卡</div>
          </Form.Item>
        ) : null}
        {phoneClock ? (
          <Form.Item
            label="位置"
            name="areas"
            rules={[{ required: true, message: '请输入用户名称!' }]}
          >
            <AreasList {...props} />
          </Form.Item>
        ) : null}
        {phoneClock ? (
          <Form.Item
            label="wifi"
            name="wifis"
            rules={[{ required: true, message: '请输入用户名称!' }]}
          >
            <Wifi {...props} />
          </Form.Item>
        ) : null}
        {phoneClock ? (
          <Form.Item
            label="手机提醒"
            name="phoneTips"
            rules={[{ required: true, message: '请选择范围外打卡!' }]}
          >
            <Input.Group compact style={{ marginTop: 6 }}>
              <Form.Item
                name={['phoneTips', 'goWorkRemind']}
                label="上班提醒"
                initialValue={0}
                style={{ paddingRight: 30 }}
              >
                <Select placeholder="请选择" style={{ minWidth: 200 }}>
                  <Option value={0}>准点</Option>
                  <Option value={5}>前15分钟</Option>
                  <Option value={10}>前10分钟</Option>
                  <Option value={15}>前15分钟</Option>
                  <Option value={20}>前20分钟</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['phoneTips', 'offWorkRemind']}
                label="下班提醒"
                initialValue={0}
                style={{ paddingRight: 30 }}
              >
                <Select placeholder="请选择" style={{ minWidth: 200 }}>
                  <Option value={0}>准点</Option>
                  <Option value={5}>后15分钟</Option>
                  <Option value={10}>后10分钟</Option>
                  <Option value={15}>后15分钟</Option>
                  <Option value={20}>后20分钟</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        ) : null}
        {phoneClock ? (
          <Form.Item
            label="范围外打卡"
            name="clockOutOfRange"
            rules={[{ required: true, message: '请选择范围外打卡!' }]}
          >
            <Radio.Group>
              <Radio style={{ display: 'block' }} value={0}>
                允许范围外打卡，记录为打卡异常
              </Radio>
              <Radio style={{ display: 'block' }} value={1}>
                不允许范围外打卡
              </Radio>
            </Radio.Group>
          </Form.Item>
        ) : null}
        <Form.Item
          label="规则生效时间"
          name="effectiveTime"
          rules={[{ required: true, message: '请选择范围外打卡!' }]}
        >
          <Radio.Group>
            <Radio style={{ display: 'block' }} value={0}>
              明日生效
            </Radio>
            <Radio style={{ display: 'block' }} value={1}>
              立即生效
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Card>
  );
};
