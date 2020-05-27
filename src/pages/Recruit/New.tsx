import React, { useEffect } from 'react';
import moment from 'moment';
import { history } from 'umi';
import { Card, Form, Input, InputNumber, Select, Button, notification, DatePicker } from 'antd';
import { newPageFormItemLayout, submitFormLayout, GlobalResParams } from '@/types/ITypes';
import { useBusiness, useJob, useRole } from '@/models/global';
import { useRank } from '@/models/global';
import { createDemand, INewDemandParams, demandDetail } from './services/list';

const { Option } = Select;
const { TextArea } = Input;
export default (props) => {
  const { demandId, name, updateDemand } = props;
  const [form] = Form.useForm();
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const { roleList } = useRole(2);
  const { rankList } = useRank();
  useEffect(() => {
    if (demandId) {
      async function fetchDemand() {
        let res: GlobalResParams<any> = await demandDetail(demandId);
        const values = res.obj;
        values.entryDate = moment(values.entryDate);
        form.setFieldsValue(values);
      }
      fetchDemand();
    }
  }, [])
  const handleSubmit = async (values) => {
    values.entryDate = values.entryDate.format('YYYY-MM-DD');
    let actionMethod;
    if (demandId) {
      values.demandId = demandId;
      actionMethod = updateDemand;
    } else {
      actionMethod = createDemand;
    }
    let res:GlobalResParams<string> = await actionMethod(values as INewDemandParams);
    if (res.status === 200) {
      history.push('/talent/recruit/mylist');
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
  }
  return (
    <Card title={name || "新建需求"}>
      <Form
        {...newPageFormItemLayout}
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item
          label='业务线'
          name="businessId"
          rules={[{ required: true, message: '请选择业务线' }]}
        >
          <Select showSearch placeholder="请选择业务线" optionFilterProp='children'>
            {
              businessList?.map((item) => {
                return <Option key={item.businessId} value={item.businessId}>{item.businessLineName}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='岗位'
          name="positionId"
          rules={[{ required: true, message: '请选择岗位' }]}
        >
          <Select showSearch placeholder="请选择岗位" optionFilterProp='children'>
            {
              jobList?.map((item) => {
                return <Option key={item.jobId} value={item.jobId}>{item.jobName}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='职级'
          name="rank"
          rules={[{ required: true, message: '请选择职级' }]}
        >
          <Select showSearch placeholder="请选择职级">
            {
              rankList?.map(item => {
                return <Option key={item.rankId} value={item.rankId}>{item.rankName}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='数量'
          name="amount"
          rules={[{ required: true, message: '请输入数量' }]}
        >
          <InputNumber placeholder="请输入数量" style={{width: '100%'}} />
        </Form.Item>
        <Form.Item
          label='紧急程度'
          name="emergencyDegree"
          rules={[{ required: true, message: '请选择紧急程度' }]}
        >
          <Select showSearch placeholder="请选择紧急程度">
            <Option key={1} value={1}>一般</Option>
            <Option key={2} value={2}>中等</Option>
            <Option key={3} value={3}>紧急</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='入职时间'
          name="entryDate"
          rules={[{ required: true, message: '请选择入职时间' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder="请选择入职时间"
          />
        </Form.Item>
        <Form.Item
          label='面试官'
          name="interviewCode"
          rules={[{ required: true, message: '请选择面试官' }]}
        >
          <Select showSearch placeholder="请选择面试官" optionFilterProp='children'>
            {
              roleList?.map((item, i) => {
                return <Option key={i} value={item.userCode}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>

        <Form.Item
          label='岗位描述'
          name="description"
        >
          <TextArea rows={4} placeholder="请填写岗位描述">
          </TextArea>
        </Form.Item>

        <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}