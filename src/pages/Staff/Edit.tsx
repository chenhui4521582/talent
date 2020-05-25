import React, { useEffect } from 'react';
import {
  Card, Select, Form, Input, DatePicker, Button, notification, Row, Col
} from 'antd';
import moment from 'moment';
import { useBusiness, useJob } from '@/models/global';
import { commonDetail } from './services/staff';
import { GlobalResParams } from '@/types/ITypes';

const { Option } = Select;
const { TextArea } = Input;
export default (props) => {
  const { employeeId } = props.location.query;
  const [form] = Form.useForm();
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await commonDetail(employeeId);
      let values = res?.obj;
      if (res?.obj) {
        values.contractStart = moment(values.contractStart);
        values.contractEnd = moment(values.contractEnd);
        values.onboardingDate = moment(values.onboardingDate);
        values.probationEnd = moment(values.probationEnd);
        values.workStart = moment(values.workStart);
        values.exWorkStart = moment(values.exWorkStart);
        values.graduationDate = moment(values.graduationDate);
      }
      form.setFieldsValue(res?.obj);
    }
    if (employeeId) getDetail();
  }, [])
  const handleSubmit = () => {

  }
  return (
    <Card title={employeeId ? '编辑员工' : '新增员工'}>
      <Form
        form={form}
        onFinish={handleSubmit}
      >
        <Row>
          <Col span={6}>
            <Form.Item
              label="员工编号"
              name="employeeId"
            >
              <Input placeholder="系统默认生成" disabled/>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名"/>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="英文名"
              name="englishName"
              rules={[{ required: true, message: '请输入英文名' }]}
            >
              <Input placeholder="请输入英文名"/>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="性别"
              name="sex"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择性别">
                <Option value={1} key={1}>男</Option>
                <Option value={2} key={2}>女</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="所属业务线"
              name="businessId"
              rules={[{ required: true, message: '请选择所属业务线' }]}
            >
              <Select placeholder="请选择所属业务线">
                {
                  businessList?.map(item => {
                    return <Option value={item.businessId} key={item.businessId}>{item.businessLineName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="成本中心"
              name="businessCostCenterId"
              rules={[{ required: true, message: '请输入英文名' }]}
            >
              <Input placeholder="请输入英文名"/>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="实际劳动关系"
              name="businessLaborRelationsId"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择性别">
                <Option value={1} key={1}>男</Option>
                <Option value={2} key={2}>女</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="用工类型"
              name="employmentType"
              rules={[{ required: true, message: '请选择用工类型' }]}
            >
              <Select placeholder="请选择用工类型">
                <Option value={1} key={1}>正式</Option>
                <Option value={2} key={2}>实习</Option>
                <Option value={3} key={3}>外聘</Option>
                <Option value={4} key={4}>兼职</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="合同起始日期"
              name="contractStart"
              rules={[{ required: true, message: '请选择合同起始日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="合同结束日期"
              name="contractEnd"
              rules={[{ required: true, message: '请选择合同结束日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="合同到期提醒"
              name="contractRemind"
              rules={[{ required: true, message: '请选择合同到期提醒' }]}
            >
              <Select placeholder="请选择合同到期提醒">
                <Option value={0} key={0}>未提醒</Option>
                <Option value={1} key={1}>已提醒</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="试用期到期提醒"
              name="probationRemind"
              rules={[{ required: true, message: '请选择试用期到期提醒' }]}
            >
              <Select placeholder="请选择试用期到期提醒">
                <Option value={0} key={0}>未提醒</Option>
                <Option value={1} key={1}>已提醒</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="入职日期"
              name="onboardingDate"
              rules={[{ required: true, message: '请选择入职日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="试用期截止日期"
              name="probationEnd"
              rules={[{ required: true, message: '请选择试用期截止日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="开始工作时间"
              name="workStart"
              rules={[{ required: true, message: '请选择开始工作时间' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="上份合同开始时间"
              name="exWorkStart"
              rules={[{ required: true, message: '请选择上份合同开始时间' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        {/* next */}
        <Row style={{marginTop: 20}}>
          <Col span={6}>
            <Form.Item
              label="岗位"
              name="post"
              rules={[{ required: true, message: '请选择岗位' }]}
            >
              <Select placeholder="请选择岗位">
                {
                  jobList?.map(item => {
                    return <Option value={item.jobId} key={item.jobId}>{item.jobName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="类别"
              name="category"
              rules={[{ required: true, message: '请选择类别' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="组别"
              name="type"
              rules={[{ required: true, message: '请选择组别' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="其他"
              name="other"
            >
              <Input placeholder="请输入其他" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="婚姻状况"
              name="maritalStatus"
              rules={[{ required: true, message: '请选择婚姻状况' }]}
            >
              <Select placeholder="请选择婚姻状况">
                <Option value={1} key={1}>已婚</Option>
                <Option value={2} key={2}>未婚</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="生育状况"
              name="fertilityStatus"
              rules={[{ required: true, message: '请选择生育状况' }]}
            >
              <Select placeholder="请选择生育状况">
                <Option value={0} key={0}>未育</Option>
                <Option value={1} key={1}>已育</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="民族"
              name="nationCode"
              rules={[{ required: true, message: '请输入民族' }]}
            >
              <Input placeholder="请输入民族" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="联系电话"
              name="mobile"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="身份证号"
              name="idCard"
              rules={[{ required: true, message: '请输入身份证号' }]}
            >
              <Input placeholder="请输入身份证号" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="微信号"
              name="wx"
            >
              <Input placeholder="请输入微信号" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="登记银行"
              name="bankName"
              rules={[{ required: true, message: '请输入登记银行' }]}
            >
              <Input placeholder="请输入登记银行" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="银行卡号"
              name="bankCardNo"
              rules={[{ required: true, message: '请输入银行卡号' }]}
            >
              <Input placeholder="请输入银行卡号" />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{marginTop: 20}}>
          <Col span={6}>
            <Form.Item
              label="文化程度"
              name="educationalLevel"
              rules={[{ required: true, message: '请选择文化程度' }]}
            >
              <Select placeholder="请选择文化程度">
                <Option value={0} key={0}>高中以下</Option>
                <Option value={1} key={1}>高中</Option>
                <Option value={2} key={2}>中专</Option>
                <Option value={3} key={3}>大专</Option>
                <Option value={4} key={4}>大学本科</Option>
                <Option value={5} key={5}>研究生</Option>
                <Option value={6} key={6}>博士生</Option>
                <Option value={7} key={7}>博士后</Option>
                <Option value={8} key={8}>院士</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="毕业院校"
              name="graduatedSchool"
              rules={[{ required: true, message: '请输入毕业院校' }]}
            >
              <Input placeholder="请输入毕业院校" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="专业"
              name="major"
              rules={[{ required: true, message: '请输入专业' }]}
            >
              <Input placeholder="请输入专业" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              label="毕业日期"
              name="graduationDate"
              rules={[{ required: true, message: '请选择毕业日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="紧急联系人"
              name="emergencyContact"
              rules={[{ required: true, message: '请输入紧急联系人' }]}
            >
              <Input placeholder="请输入紧急联系人" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="户籍地址"
              name="residenceAddress"
              rules={[{ required: true, message: '请输入户籍地址' }]}
            >
              <Input placeholder="请输入户籍地址" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <Form.Item
              label="现居住地址"
              name="habitation"
              rules={[{ required: true, message: '请输入现居住地址' }]}
            >
              <Input placeholder="请输入现居住地址" />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{marginTop: 20}}>
          <Col span={16}>
            <Form.Item
              label="备注"
              name="remark"
            >
              <TextArea rows={4}></TextArea>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button type="primary" htmlType="submit" style={{marginRight: 20, marginTop: 20}}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}