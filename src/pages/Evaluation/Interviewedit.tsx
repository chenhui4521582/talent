import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history } from 'umi';
import {
  Card, Descriptions, Select, Form, Input, DatePicker, Radio, Table, Button, Modal, notification, Row, Col
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { listRegisterDetail, updateRegisterDetail } from './services/application';
import { GlobalResParams, formItemLayout } from '@/types/ITypes';

const { Option } = Select;
const { TextArea } = Input;
export default (props) => {
  const { resumeId }= props.location.query;
  const [baseForm] = Form.useForm();
  const [otherForm] = Form.useForm();
  const [workForm] = Form.useForm();
  const [eduForm] = Form.useForm();
  const [curRecord, setCurRecord] = useState<any>();
  const [modalName, setModalName] = useState<string>('');
  const [otherId, setOtherId] = useState<number>();
  const [edus, setEdus] = useState<any[]>();
  const [works, setWorks] =useState<any[]>();
  useEffect(() => {
    async function fetchDetail() {
      let res: GlobalResParams<any> = await listRegisterDetail(resumeId);
      const { base, edus, works, other } = res.obj;
      base.birthDate = moment(base?.birthDate);
      baseForm.setFieldsValue(base);
      otherForm.setFieldsValue(other);
      setEdus(edus);
      setWorks(works);
      setOtherId(other?.id);
    };
    fetchDetail();
  }, [])
  const workcolumns: ColumnProps<any>[] = [{
    title: '工作单位',
    dataIndex: 'company',
    key: 'company',
    align: 'center'
  }, {
    title: '开始日期',
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center'
  }, {
    title: '结束日期',
    dataIndex: 'endTime',
    key: 'endTime',
    align: 'center'
  }, {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    align: 'center'
  }, {
    title: '岗位',
    dataIndex: 'position',
    key: 'position',
    align: 'center'
  },{
    title: '薪资',
    dataIndex: 'salary',
    key: 'salary',
    align: 'center'
  }, {
    title: '证明人',
    dataIndex: 'references',
    key: 'references',
    align: 'center'
  },{
    title: '证明人电话',
    dataIndex: 'referencesMobile',
    key: 'referencesMobile',
    align: 'center'
  },{
    title: '离职原因',
    dataIndex: 'leaveReason',
    key: 'leaveReason',
    align: 'center'
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return(
        <span>
          <a onClick={e => showModal('work', record)}>编辑</a>
        </span>
      )
    }
  }];
  const educolumns: ColumnProps<any>[] = [{
    title: '起始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center'
  }, {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    align: 'center'
  }, {
    title: '学校名称',
    dataIndex: 'college',
    key: 'college',
    align: 'center'
  }, {
    title: '专业',
    dataIndex: 'major',
    key: 'major',
    align: 'center'
  },{
    title: '学历',
    dataIndex: 'education',
    key: 'education',
    align: 'center',
    render: (text) => {
      const data = ['高中以下', '高中', '中专', '大专', '大学本科', '研究生', '博士生', '博士后', '院士'];
      return <span> {data[text]}</span>
    }
  },{
    title: '学位',
    dataIndex: 'degree',
    key: 'degree',
    align: 'center',
    render: (text) => {
      const data = ['无学位', '学士', '硕士', '博士', '博士后'];
      return <span> {data[text]}</span>
    }
  }, {
    title: '是否最高学历',
    dataIndex: 'highestEducation',
    key: 'highestEducation',
    align: 'center',
    render: (text) => {
      const data = { '1': '是', '0': '否' };
      return <span> {data[text]}</span>
    }
  },{
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return(
        <span>
          <a onClick={e => showModal('edu', record)}>编辑</a>
        </span>
      )
    }
  }];

  const handleReset = () => {
    history.goBack();
  };

  const changeShow = (type: number) => {
    if (type === 1) {
      otherForm.setFieldsValue({ illegalDes: '' });
    } else if (type === 2) {
      otherForm.setFieldsValue({ examinnationDes: '' });
    } else {
      otherForm.setFieldsValue({ fireDes: '' });
    }
  }

  const showModal = (type: string, record) => {
    let newRecord = { ...record };
    setCurRecord(record);
    newRecord.startTime = moment(newRecord.startTime);
    newRecord.endTime = moment(newRecord.endTime);
    if (type === 'edu') {
      eduForm.setFieldsValue(newRecord);
    } else {
      workForm.setFieldsValue(newRecord);
    }
    setModalName(type);
  };

  const cancelModal = () => {
    setModalName('');
    setCurRecord(undefined);
    workForm.resetFields();
    eduForm.resetFields();
  };

  const handleEdit = (values) => {
    values.startTime = moment(values.startTime).format('YYYY/MM/DD');
    values.endTime = moment(values.endTime).format('YYYY/MM/DD');
    if (modalName === 'work') {
      let newArray = works && [...works];
      newArray?.map((item, i) => {
        if (item.id === curRecord.id) {
          newArray && (newArray[i] = {...item, ...values});
        }
      });
      setWorks(newArray);
    } else {
      let newArray = edus && [...edus];
      newArray?.map((item, i) => {
        if (item.id === curRecord.id) {
          newArray && (newArray[i] = {...item, ...values});
        }
      });
      setEdus(newArray);
    };
    cancelModal();
  };

  const handleSubmit = async () => {
    const base = baseForm.getFieldsValue();
    base.id = Number(resumeId);
    base.birthDate = moment(base.birthDate).format('YYYY/MM/DD');
    const other = otherForm.getFieldsValue();
    other.baseId = Number(resumeId);
    other.id = otherId;
    let res: GlobalResParams<string> = await updateRegisterDetail({
      req: {base, other, edus, works, resumeId}
    });
    if (res.status === 200) {
      notification['success']({
        message: res.msg,
        description: '',
      });
      history.goBack();
    } else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  }
  return (
    <Card title="应聘登记表 - 编辑">
      <Form.Provider
        onFormFinish={handleSubmit}
      >
        <Form
          form={baseForm}
        >
          <Card title="基本信息" style={{marginTop: 20}}>
            <Descriptions bordered column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
              <Descriptions.Item label="姓名">
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="性别">
                <Form.Item
                  name="sex"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select style={{ width: 200 }}>
                    <Option value={1} key={1}>男</Option>
                    <Option value={2} key={2}>女</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="身份证号">
                <Form.Item
                  name="idCard"
                  rules={[{ required: true, message: '请输入身份证号' }]}
                >
                  <Input placeholder="请输入身份证号" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="出生日期">
                <Form.Item
                  name="birthDate"
                  rules={[{ required: true, message: '请选择出生日期' }]}
                >
                  <DatePicker format="YYYY/MM/DD" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="出生地">
                <Form.Item
                  name="birthPlace"
                  rules={[{ required: true, message: '请输入出生地' }]}
                >
                  <Input placeholder="请输入出生地" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="婚姻状况">
                <Form.Item
                  name="maritalStatus"
                  rules={[{ required: true, message: '请选择婚姻状况' }]}
                >
                  <Select style={{ width: 200 }}>
                    <Option value={2} key={2}>已婚</Option>
                    <Option value={1} key={1}>未婚</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="子女状况">
                <Form.Item
                  name="childrenStatus"
                  rules={[{ required: true, message: '请选择子女状况' }]}
                >
                  <Select style={{ width: 200 }}>
                    <Option value={0} key={0}>无</Option>
                    <Option value={1} key={1}>有</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                <Form.Item
                  name="mobile"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="电子邮件">
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: '请输入电子邮件' }]}
                >
                  <Input placeholder="请输入电子邮件" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="QQ号">
                <Form.Item
                  name="qq"
                >
                  <Input placeholder="请输入QQ" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="现住址">
                <Form.Item
                  name="habitation"
                >
                  <Input placeholder="请输入现住址" />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="教育经历（自高中）" style={{marginTop: 20}}>
            <Table columns={educolumns} dataSource={edus} rowKey={ row => row.id }/>
          </Card>
          <Card title="工作经历（从毕业后第一家公司开始）" style={{marginTop: 20}}>
            <Table columns={workcolumns} dataSource={works} rowKey={ row => row.id } />
          </Card>
        </Form>
        <Form
          form={otherForm}
        >
          <Card title="其他信息" style={{marginTop: 20}}>
            <Descriptions bordered layout="vertical">
              <Descriptions.Item label="你是否已经与上一家公司解除了劳动合同？" span={3}>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name="terminateContract"
                      rules={[{ required: true, message: '请选择近半年内是否接受过全面体检' }]}
                    >
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label="你是否曾与原单位签署竞业禁止协议？" span={3}>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name="nonCompete"
                    >
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label="请注明任何一位本公司你熟悉的人？" span={3}>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label="姓名"
                      name="familiarName"
                    >
                      <Input placeholder="请输入姓名" />
                    </Form.Item>

                  </Col>
                  <Col span={8} offset={1}>
                    <Form.Item
                      label="关系"
                      name="familiarRelationship"
                    >
                      <Input placeholder="请输入姓名" />
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label="你是否有过违法及不良行为记录？" span={3}>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name="illegal"
                    >
                      <Radio.Group onChange={e => changeShow(1)}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item
                      name="illegalDes"
                    >
                      <TextArea rows={4} placeholder='请填写说明' />
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label="近半年内的体检结果是否正常？" span={3}>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name="examination"
                    >
                      <Radio.Group onChange={e => changeShow(2)}>
                        <Radio value={0}>有些问题</Radio>
                        <Radio value={1}>正常</Radio>
                        <Radio value={2}>近半年没有体检</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item
                      name="examinnationDes"
                    >
                      <TextArea rows={4} placeholder='请填写说明' />
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label="你曾经被解雇过吗？" span={3}>
                <Row>
                  <Col span={5}>
                    <Form.Item
                      name="fire"
                    >
                      <Radio.Group onChange={e => changeShow(3)}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item
                      name="fireDes"
                    >
                      <TextArea rows={4} placeholder='请填写说明' />
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
            <Button type="primary" htmlType="submit" style={{marginRight: 20, marginTop: 20}}>
              确定
            </Button>
            <Button onClick={handleReset} >
              返回
            </Button>
          </Form.Item>
        </Form>
      </Form.Provider>
      <Modal
        visible={modalName === 'work'}
        title="编辑履历"
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={e => workForm.submit()}
      >
        <Form
          {...formItemLayout}
          form={workForm}
          onFinish={handleEdit}
        >
          <Form.Item
            label="工作单位"
            name="company"
            rules={[{ required: true, message: '请输入工作单位' }]}
          >
            <Input placeholder="请输入工作单位" />
          </Form.Item>

          <Form.Item
            label="开始日期"
            name="startTime"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{width: 260}} />
          </Form.Item>

          <Form.Item
            label="结束日期"
            name="endTime"
            rules={[{ required: true, message: '请选择结束日期' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{width: 260}} />
          </Form.Item>
          <Form.Item
            label="部门"
            name="department"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item
            label="职务"
            name="position"
            rules={[{ required: true, message: '请输入职务' }]}
          >
            <Input placeholder="请输入职务" />
          </Form.Item>
          <Form.Item
            label="月薪"
            name="salary"
            rules={[{ required: true, message: '请输入月薪' }]}
          >
            <Input placeholder="请输入岗位" />
          </Form.Item>
          <Form.Item
            label="证明人"
            name="references"
          >
            <Input placeholder="请输入证明人" />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="referencesMobile"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            label="离职原因"
            name="leaveReason"
          >
            <TextArea rows={4} placeholder="请输入离职原因" />
          </Form.Item>
        </Form> 
      </Modal>
      <Modal
        visible={modalName === 'edu'}
        title="编辑教育经历"
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={e => eduForm.submit()}
      >
        <Form
          {...formItemLayout}
          form={eduForm}
          onFinish={handleEdit}
        >
          <Form.Item
            label="开始时间"
            name="startTime"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{width: 260}} />
          </Form.Item>

          <Form.Item
            label="结束时间"
            name="endTime"
            rules={[{ required: true, message: '请选择结束日期' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{width: 260}} />
          </Form.Item>
          <Form.Item
            label="学校名称"
            name="college"
            rules={[{ required: true, message: '请输入学校名称' }]}
          >
            <Input placeholder="请输入学校名称" />
          </Form.Item>
          <Form.Item
            label="专业"
            name="major"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input placeholder="请输入专业" />
          </Form.Item>
          <Form.Item
            label="学历"
            name="education"
            rules={[{ required: true, message: '请选择学历' }]}
          >
            <Select placeholder="请选择学历" showSearch optionFilterProp='children'>
              <Option value={0}>高中以下</Option>
              <Option value={1}>高中</Option>
              <Option value={2}>中专</Option>
              <Option value={3}>大专</Option>
              <Option value={4}>大学本科</Option>
              <Option value={5}>研究生</Option>
              <Option value={6}>博士生</Option>
              <Option value={7}>博士后</Option>
              <Option value={8}>院士</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="学位"
            name="degree"
            rules={[{ required: true, message: '请选择学位' }]}
          >
            <Select placeholder="请选择学位" showSearch optionFilterProp='children'>
              <Option value={1}>无学位</Option>
              <Option value={2}>学士</Option>
              <Option value={3}>硕士</Option>
              <Option value={4}>博士</Option>
              <Option value={5}>博士后</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="是否最高学历"
            name="highestEducation"
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}