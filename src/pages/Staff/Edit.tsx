import React, { useEffect, useState } from 'react';
import {
  Card,
  Select,
  Form,
  Input,
  DatePicker,
  Button,
  notification,
  Row,
  Col,
} from 'antd';
import { history } from 'umi';
import moment from 'moment';
import {
  useBusiness,
  useJob,
  useDepartment,
  useRank,
  useTitle,
  useCost,
  useLabor,
} from '@/models/global';
import {
  commonDetail,
  saveEmployeeInfo,
  updateEmployeeInfo,
} from './services/staff';
import { GlobalResParams } from '@/types/ITypes';
import OzTreeSlect from '@/pages/Framework/components/OzTreeSlect';
import LevelOr from '@/components/GlobalTable/levelOr';

const { Option } = Select;
const { TextArea } = Input;
export default props => {
  const { employeeId } = props.location.query;
  const [form] = Form.useForm();
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const { departmentList: firstBusiness } = useDepartment(1);
  const { departmentList: secondBusiness } = useDepartment(2);
  const { departmentList } = useDepartment(3);
  const { departmentList: groupList } = useDepartment(4);
  const [twoLevel, setTwoLevel] = useState<string>('');
  const [threeLevel, setThreeLevel] = useState<string>('');
  const [fourLevel, setFourLevel] = useState<string>('');

  const { rankList } = useRank();
  const { titleList } = useTitle();
  const { costList } = useCost();
  const { laborList } = useLabor();
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await commonDetail(employeeId);
      let values = res?.obj;
      if (res?.obj) {
        values.contractStart
          ? (values.contractStart = moment(values.contractStart))
          : '';
        values.contractEnd
          ? (values.contractEnd = moment(values.contractEnd))
          : '';
        values.onboardingDate
          ? (values.onboardingDate = moment(values.onboardingDate))
          : '';
        values.probationEnd
          ? (values.probationEnd = moment(values.probationEnd))
          : '';
        values.workStart ? (values.workStart = moment(values.workStart)) : '';
        values.exWorkStart
          ? (values.exWorkStart = moment(values.exWorkStart))
          : '';
        values.graduationDate
          ? (values.graduationDate = moment(values.graduationDate))
          : '';
        values.birthDate ? (values.birthDate = moment(values.birthDate)) : '';
      }
      setTwoLevel(values.firstBusinessCode);
      setThreeLevel(values.businessCode);
      setFourLevel(values.departmentCode);

      form.setFieldsValue(res?.obj);
    }
    if (employeeId) getDetail();
  }, []);
  const handleSubmit = async values => {
    let actionMethod;
    values.contractStart = moment(values.contractStart).format('YYYY/MM/DD');
    values.contractEnd = moment(values.contractEnd).format('YYYY/MM/DD');
    values.onboardingDate = moment(values.onboardingDate).format('YYYY/MM/DD');
    values.probationEnd = moment(values.probationEnd).format('YYYY/MM/DD');
    values.workStart = moment(values.workStart).format('YYYY/MM/DD');
    values.exWorkStart = moment(values.exWorkStart).format('YYYY/MM/DD');
    values.graduationDate = moment(values.graduationDate).format('YYYY/MM/DD');
    values.birthDate = moment(values.birthDate).format('YYYY/MM/DD');
    if (employeeId) {
      actionMethod = updateEmployeeInfo;
    } else {
      actionMethod = saveEmployeeInfo;
    }
    let res: GlobalResParams<string> = await actionMethod(values);
    if (res.status === 200) {
      history.push('/talent/staff/list');
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
  };
  const handleFormChange = changedValues => {
    if (changedValues.firstBusinessCode) {
      setTwoLevel(changedValues.firstBusinessCode);
      form.setFieldsValue({ businessCode: '' });
      form.setFieldsValue({ departmentCode: '' });
      form.setFieldsValue({ groupCode: '' });
    } else if (changedValues.businessCode) {
      setThreeLevel(changedValues.businessCode);
      form.setFieldsValue({ departmentCode: '' });
      form.setFieldsValue({ groupCode: '' });
    } else if (changedValues.departmentCode) {
      setFourLevel(changedValues.departmentCode);
      form.setFieldsValue({ groupCode: '' });
    }
  };
  return (
    <Card title={employeeId ? '编辑员工' : '新增员工'}>
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
      >
        <h2>基本类型</h2>
        <Row>
          <Col span={5}>
            <Form.Item label="员工编号" name="employeeId">
              <Input placeholder="系统默认生成" disabled />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input disabled={employeeId} />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="英文名"
              name="englishName"
              rules={[{ required: true, message: '请输入英文名' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="入职日期"
              name="onboardingDate"
              rules={[{ required: true, message: '请选择入职日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="性别"
              name="sex"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select>
                <Option value={1} key={1}>
                  男
                </Option>
                <Option value={2} key={2}>
                  女
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="民族"
              name="nationCode"
              rules={[{ required: true, message: '请输入民族' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="联系电话"
              name="mobile"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: '请输入类别' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="HRBP"
              name="hrbp"
              rules={[{ required: true, message: '请输入HRBP' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <h2 style={{ margin: '10px 0 5px 0' }}>职位信息</h2>
        <Row>
          <Col span={5}>
            <Form.Item
              label="一级业务线"
              name="firstBusinessCode"
              rules={[{ required: true, message: '请选择所属业务线' }]}
            >
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="二级业务线"
              name="businessCode"
              rules={[{ required: true, message: '请输入二级业务线' }]}
            >
              <LevelOr code={twoLevel} key={twoLevel} />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="部门"
              name="departmentCode"
              rules={[{ required: true, message: '请选择部门' }]}
            >
              <LevelOr code={threeLevel} key={threeLevel} />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="组别"
              name="groupCode"
              rules={[{ required: true, message: '请选择组别' }]}
              shouldUpdate
            >
              <LevelOr code={fourLevel} key={fourLevel} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="技术岗位"
              name="postId"
              rules={[{ required: true, message: '请选择岗位' }]}
            >
              <Select showSearch optionFilterProp="children">
                {jobList?.map(item => {
                  return (
                    <Option value={item.jobId} key={item.jobId}>
                      {item.jobName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="职位"
              name="titleId"
              rules={[{ required: true, message: '请选择职位' }]}
            >
              <Select showSearch optionFilterProp="children">
                {titleList?.map(item => {
                  return (
                    <Option value={item.titleId} key={item.titleId}>
                      {item.titleName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="管理职级" name="manageRankId">
              <Select showSearch optionFilterProp="children">
                {rankList?.map(item => {
                  if (item.rankName.indexOf('M') > -1) {
                    return (
                      <Option value={item.rankId} key={item.rankId}>
                        {item.rankName}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="技术职级"
              name="rankId"
              rules={[{ required: true, message: '请选择技术职级' }]}
            >
              <Select showSearch optionFilterProp="children">
                {rankList?.map(item => {
                  if (item.rankName.indexOf('P') > -1) {
                    return (
                      <Option value={item.rankId} key={item.rankId}>
                        {item.rankName}
                      </Option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="上级编号"
              name="superiorsNo"
              rules={[{ required: true, message: '请输入上级编号' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="上级姓名"
              name="superiorsName"
              rules={[{ required: true, message: '请输入上级姓名' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="角色"
              name="roles"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="专业">专业</Option>
                <Option value="管理">管理</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <h2 style={{ margin: '10px 0 5px 0' }}>合同信息</h2>
        <Row>
          <Col span={5}>
            <Form.Item
              label="合同起始日期"
              name="contractStart"
              rules={[{ required: true, message: '请选择合同起始日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="合同结束日期"
              name="contractEnd"
              rules={[{ required: true, message: '请选择合同结束日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="试用期到期提醒"
              name="probationRemind"
              rules={[{ required: true, message: '请选择试用期到期提醒' }]}
            >
              <Select>
                <Option value={0} key={0}>
                  未提醒
                </Option>
                <Option value={1} key={1}>
                  已提醒
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="试用期到期日期"
              name="probationEnd"
              rules={[{ required: true, message: '请选择试用期到期日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="合同到期提醒"
              name="contractRemind"
              rules={[{ required: true, message: '请选择合同到期提醒' }]}
            >
              <Select>
                <Option value={0} key={0}>
                  未提醒
                </Option>
                <Option value={1} key={1}>
                  已提醒
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="合同变更记录" name="contractChangeRecord">
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="开始工作时间"
              name="workStart"
              rules={[{ required: true, message: '请选择开始工作时间' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="上份合同开始时间"
              name="exWorkStart"
              rules={[{ required: true, message: '请选择上份合同开始时间' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="实际劳动关系"
              name="laborId"
              rules={[{ required: true, message: '请选择实际劳动关系' }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ maxWidth: '11vw' }}
              >
                {laborList?.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.laborRelationName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="用工类型"
              name="employmentType"
              rules={[{ required: true, message: '请选择用工类型' }]}
            >
              <Select>
                <Option value={1} key={1}>
                  正式
                </Option>
                <Option value={2} key={2}>
                  实习
                </Option>
                <Option value={3} key={3}>
                  外聘
                </Option>
                <Option value={4} key={4}>
                  兼职
                </Option>
                <Option value={5} key={5}>
                  代缴
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="是否在职"
              name="currentPosition"
              rules={[{ required: true, message: '请选择是否在职' }]}
            >
              <Select>
                <Option value={0}>离职</Option>
                <Option value={1}>在职</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="工作地"
              name="workPlace"
              rules={[{ required: true, message: '请输入工作地' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <h2 style={{ margin: '10px 0 5px 0' }}>银行、家庭信息</h2>
        <Row>
          <Col span={5}>
            <Form.Item
              label="银行名称"
              name="bankName"
              rules={[{ required: true, message: '请输入登记银行' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="银行卡号"
              name="bankCardNo"
              rules={[{ required: true, message: '请输入银行卡号' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="身份证号"
              name="idCard"
              rules={[{ required: true, message: '请输入身份证号' }]}
            >
              <Input disabled={employeeId} />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="出生日期"
              name="birthDate"
              rules={[{ required: true, message: '请输入身份证号' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="毕业院校"
              name="graduatedSchool"
              rules={[{ required: true, message: '请输入毕业院校' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="专业"
              name="major"
              rules={[{ required: true, message: '请输入专业' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="毕业日期"
              name="graduationDate"
              rules={[{ required: true, message: '请选择毕业日期' }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="文化程度"
              name="educationalLevel"
              rules={[{ required: true, message: '请选择文化程度' }]}
            >
              <Select>
                <Option value={0} key={0}>
                  高中以下
                </Option>
                <Option value={1} key={1}>
                  高中
                </Option>
                <Option value={2} key={2}>
                  中专
                </Option>
                <Option value={3} key={3}>
                  大专
                </Option>
                <Option value={4} key={4}>
                  大学本科
                </Option>
                <Option value={5} key={5}>
                  研究生
                </Option>
                <Option value={6} key={6}>
                  博士生
                </Option>
                <Option value={7} key={7}>
                  博士后
                </Option>
                <Option value={8} key={8}>
                  院士
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="婚姻状况"
              name="maritalStatus"
              rules={[{ required: true, message: '请选择婚姻状况' }]}
            >
              <Select>
                <Option value={2} key={2}>
                  已婚
                </Option>
                <Option value={1} key={1}>
                  未婚
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="生育状况"
              name="fertilityStatus"
              rules={[{ required: true, message: '请选择生育状况' }]}
            >
              <Select>
                <Option value={0} key={0}>
                  未育
                </Option>
                <Option value={1} key={1}>
                  已育
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="微信号" name="wx">
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="是否用公司电脑"
              name="useComputer"
              rules={[{ required: true, message: '请选择是否用公司电脑' }]}
            >
              <Select>
                <Option value={0} key={0}>
                  否
                </Option>
                <Option value={1} key={1}>
                  是
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item
              label="户籍地址"
              name="residenceAddress"
              rules={[{ required: true, message: '请输入户籍地址' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="现居住地址"
              name="habitation"
              rules={[{ required: true, message: '请输入现居住地址' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="紧急联系人"
              name="relationshipName"
              rules={[{ required: true, message: '请输入紧急联系人' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="紧急联系电话"
              name="emergencyContact"
              rules={[{ required: true, message: '请输入紧急联系电话' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <h2 style={{ margin: '10px 0 5px 0' }}>财务信息</h2>
        <Row>
          <Col span={5}>
            <Form.Item label="部门（财务）" name="financeDepartment">
              <Input placeholder="请输入部门（财务）" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="组别（财务）" name="financeGroup">
              <Input placeholder="请输入组别（财务）" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item
              label="成本中心"
              name="costId"
              rules={[{ required: true, message: '请输入英文名' }]}
            >
              <Select showSearch optionFilterProp="children">
                {costList?.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.costCenterName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="备注" name="remark">
              <TextArea rows={1}></TextArea>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 20, marginTop: 20 }}
          >
            确定
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
