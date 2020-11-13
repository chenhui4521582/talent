// 全局配置
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Form,
  Select,
  Radio,
  Checkbox,
  notification,
  Input,
  Button,
  Divider,
} from 'antd';
import { GlobalResParams } from '@/types/ITypes';
import { upGlobalConfig, getGlobalConfig } from './services/globalConfig';
import Whitelist from './components/Whitelist';

const { Option } = Select;

export default props => {
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<any>();

  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<string> = await getGlobalConfig();
      if (res.status === 200) {
        let obj: any = res.obj || {};
        let value: any = {};
        let arr: any = [];
        value.id = obj.id;
        value.makeObj = {
          makeUpClock: [obj.makeUpClock],
          maxNumberMonthly: obj.maxNumberMonthly,
          timeLimit: obj.timeLimit,
        };
        value.effectiveTime = obj.effectiveTime;
        value.overtimeWay = obj.overtimeWay;
        if (obj.workingdayOvertime) {
          arr.push('workingdayOvertime');
        }
        if (obj.offdayOvertime) {
          arr.push('offdayOvertime');
        }
        value['workingdayOvertime-offdayOvertime'] = arr;
        form.setFieldsValue(value);

        setDetail(obj);
      }
    }
    getDetail();
  }, []);

  const handleSub = async () => {
    form.validateFields().then(async data => {
      let value: any = {};
      data.id ? (value.id = data.id) : null;
      value.makeUpClock = data.makeObj.makeUpClock[0] || 0;
      value.maxNumberMonthly = data.makeObj.maxNumberMonthly;
      value.timeLimit = data.makeObj.timeLimit;
      value.whitelist = data.whitelist;
      value.effectiveTime = data.effectiveTime;
      value.overtimeWay = data.overtimeWay;
      if (
        data['workingdayOvertime-offdayOvertime'].indexOf(
          'workingdayOvertime',
        ) > -1
      ) {
        value.workingdayOvertime = 1;
      } else {
        value.workingdayOvertime = 0;
      }
      if (
        data['workingdayOvertime-offdayOvertime'].indexOf('offdayOvertime') > -1
      ) {
        value.offdayOvertime = 1;
      } else {
        value.offdayOvertime = 0;
      }
      let json: GlobalResParams<string> = await upGlobalConfig(value);
      if (json.status === 200) {
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
    });
  };

  return (
    <Card title="全局配置">
      <Form form={form}>
        <Form.Item label="id" name="id" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
        <Form.Item label="白名单" name="whitelist" style={{ marginBottom: 40 }}>
          <Whitelist {...props} whitelist={detail?.whitelist} />
        </Form.Item>
        <Divider style={{ margin: '30px 0' }} />
        <Form.Item
          label="补卡申请"
          name="makeObj"
          rules={[{ required: true, message: '' }]}
          style={{ marginBottom: 40 }}
        >
          <Input.Group>
            <Form.Item
              name={['makeObj', 'makeUpClock']}
              label=""
              style={{ paddingTop: '1px', marginBottom: 0 }}
            >
              <Checkbox.Group>
                <Checkbox value={1}>
                  开启
                  <span style={{ fontSize: 10, color: '#999' }}>
                    员工异常打卡时间提交申请，审批通过后修正正常
                  </span>
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name={['makeObj', 'maxNumberMonthly']}
              label="每月最多补卡次数"
              style={{
                paddingRight: 30,
                display: 'inline-block',
                width: '150px',
              }}
            >
              <Select style={{ width: 120 }}>
                <Option value={10000000}>无限制</Option>
                <Option value={1}>1次</Option>
                <Option value={2}>2次</Option>
                <Option value={3}>3次</Option>
                <Option value={4}>4次</Option>
                <Option value={5}>5次</Option>
                <Option value={6}>6次</Option>
                <Option value={7}>7次</Option>
                <Option value={8}>8次</Option>
                <Option value={9}>9次</Option>
                <Option value={10}>10次</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['makeObj', 'timeLimit']}
              label="允许补卡时限为"
              style={{
                marginRight: 60,
                display: 'inline-block',
                width: '150px',
              }}
            >
              <Select style={{ width: 120 }}>
                <Option value={10000000}>无限制</Option>
                <Option value={10}>10天</Option>
                <Option value={20}>20天</Option>
                <Option value={30}>30天</Option>
                <Option value={60}>60天</Option>
                <Option value={90}>90天</Option>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Divider style={{ margin: '30px 0' }} />
        <Form.Item name="overtimeWay" label="加班方式">
          <Radio.Group>
            <Radio value={0}>以加班申请核算打卡记录</Radio>
            <Radio value={1}>以打卡时间为准 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="加班规则" name="workingdayOvertime-offdayOvertime">
          <Checkbox.Group>
            <Checkbox value={'workingdayOvertime'}>允许工作日加班</Checkbox>
            <Checkbox value={'offdayOvertime'}>允许非工作日加班</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Divider style={{ margin: '30px 0' }} />
        <Form.Item
          name="effectiveTime"
          label="规则生效时间"
          style={{ paddingRight: 30 }}
        >
          <Radio.Group>
            <Radio value={1}>立即生效</Radio>
            <Radio value={0}>明日生效</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Button onClick={handleSub} type="primary">
          保存
        </Button>
      </div>
    </Card>
  );
};
