import React, { useState } from 'react';
import {
  Card, Divider, Modal, Form, Row, Col, Input, Select, DatePicker, notification
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { queryHrList, writeBack } from './services/evaluation';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';

const { Option } = Select;
const { TextArea } = Input;
export default () =>{
  const [curRecord, setCurRecord] = useState<any>();
  const [modalName, setModalName] = useState<string>('');
  const [curStatus, setCurStatus] = useState<number>(-1);
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [{
    title: '编号',
    dataIndex: 'nId',
    key: 'nId',
    align: 'center'
  }, {
    title: '业务线',
    dataIndex: 'businessLineName',
    key: 'businessLineName',
    align: 'center'
  }, {
    title: '岗位',
    dataIndex: 'jobName',
    key: 'jobName',
    align: 'center'
  }, {
    title: '职级',
    dataIndex: 'level',
    key: 'level',
    align: 'center'
  }, {
    title: '应聘人',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  }, {
    title: '面试时间',
    dataIndex: 'interviewTime',
    key: 'interviewTime',
    align: 'center'
  }, {
    title: '是否参加面试',
    dataIndex: 'interviewFlag',
    key: 'interviewFlag',
    align: 'center',
    render: (text) => {
      const data = { 0: '不参加', 1: '参加' };
      return(
        <span>{data[text]}</span>
      )
    }
  }, {
    title: '面试官',
    dataIndex: 'interviewerName',
    key: 'interviewerName',
    align: 'center'
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (text) => {
      const data = { 0: '面试不通过', 1: '待沟通', 2: '待面试', 3: '待录用', 4: '已录用', 5: '拒绝面试', 6: '已入职', 7: '未入职', 11: '确认入职' };
      return(
        <span>{data[text]}</span>
      )
    }
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      if (record.status === 1 || record.status === 2) {
        return(
          <span> 等待反馈</span>
        )
      }else if (record.status === 3) {
        return(
          <span>
            <a onClick={e => showBack(record, 'write')}> 填写反馈</a>
            <Divider type="vertical" />
            <a onClick={e => showBack(record, 'show')}> 查看反馈</a>
          </span>
        )
      } else if (record.status === 4 || record.status === 0) {
        return(
          <span>
            <a onClick={e => showBack(record, 'show')}> 查看反馈</a>
          </span>
        )
      }
    }
  }];
  const { TableContent, refresh } = useTable({
    queryMethod: queryHrList,
    columns,
    rowKeyName: 'nId'
  });

  const showBack = (record, type: string) => {
    setCurRecord(record);
    setModalName(type);
  };

  const cancelModal = () => {
    setCurRecord(undefined);
    setModalName('');
    form.resetFields();
    setCurStatus(-1);
  };

  const handleBack = async (values) => {
    values.nId = curRecord.nId;
    values.entryTime = values.entryTime.format('YYYY-MM-DD');
    let res: GlobalResParams<string> = await writeBack(values);
    if(res.status === 200) {
      refresh();
      cancelModal();
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
    <Card title="我的面试列表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item
              label="应聘人"
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="状态"
              name="status"
            >
              <Select
                allowClear={true}
              >
                <Option value={0}>不通过</Option>
                <Option value={2}>待面试</Option>
                <Option value={3}>待录用</Option>
                <Option value={4}>已录用</Option>
                <Option value={5}>未面试</Option>
                <Option value={11}>确认入职</Option>
                <Option value={6}>已入职</Option>
                <Option value={7}>未入职</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        visible={modalName === 'write'}
        title="填写反馈"
        onOk={e => form.submit()}
        onCancel={cancelModal}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          onFinish={handleBack}
        >
          <Form.Item
            label='是否录用'
            name="status"
            rules={[{ required: true, message: '请选择是否录用' }]}
          >
            <Select placeholder="请选择是否录用" onChange={(value: number) => setCurStatus(value)}>
              <Option key={0} value={0}>不录用</Option>
              <Option key={4} value={4}>录用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='反馈意见'
            name="evaluation"
            rules={[{ required: true, message: '请填写反馈意见' }]}
          >
            <TextArea rows={8} placeholder="请填写反馈意见" />
          </Form.Item>
          {
            curStatus === 4 &&
            <Form.Item
              label='入职时间'
              name="entryTime"
              rules={[{ required: true, message: '请填写入职时间' }]}
            >
              <DatePicker placeholder="请选择入职时间" />
            </Form.Item>
          }
          <Form.Item
            label='汇报对象'
            name="reportTo"
            rules={[{ required: true, message: '请填写汇报对象' }]}
          >
            <Input placeholder="请填写汇报对象" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={modalName === 'show'}
        title="查看反馈"
        onOk={cancelModal}
        onCancel={cancelModal}
        cancelText="取消"
        okText="确定"
      >
        <div> 面试官反馈: {curRecord?.interviewEvaluation}</div>
        <div style={{marginTop: 20}}> HR反馈: {curRecord?.hrEvaluation}</div>
      </Modal>
    </Card>
  )
}