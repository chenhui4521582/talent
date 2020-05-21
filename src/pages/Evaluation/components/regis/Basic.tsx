import React from 'react';
import { Row, Col, Form, Input, Select, Cascader, DatePicker, Radio } from 'antd';
import { area } from '@/utils/area';

const { Option } = Select
export default () => {
  return (
    <div>
      <Row>
        <Col span={6}>
          <Form.Item
            label="姓名"
            name={["baseInfoModel", "realName"]}
            rules={[{ required: true, message: '请填写姓名' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="英文名"
            name={["baseInfoModel", "englishName"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="性别"
            name={["baseInfoModel", "sex"]}
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value={1} key={1}>男</Option>
              <Option value={2} key={2}>女</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="身份证号"
            name={["baseInfoModel", "idCard"]}
            rules={[{ required: true, message: '请填写身份证号' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="籍贯"
            name={["baseInfoModel", "nativePlace"]}
            rules={[{ required: true, message: '请选择籍贯' }]}
          >
            <Cascader
              options={area}
              placeholder="请选择籍贯"
            />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="出生日期"
            name={["baseInfoModel", "birthDate"]}
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="民族"
            name={["baseInfoModel", "nation"]}
            rules={[{ required: true, message: '请填写民族' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="政治面貌"
            name={["baseInfoModel", "politicStatus"]}
            rules={[{ required: true, message: '请选择政治面貌' }]}
          >
            <Select>
              <Option value={1} key={1}>党员</Option>
              <Option value={2} key={2}>团员</Option>
              <Option value={3} key={3}>其他党派</Option>
              <Option value={4} key={4}>群众</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="护照号码"
            name={["baseInfoModel", "passport"]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="护照姓名拼音"
            name={["baseInfoModel", "passportUserName"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="出生地"
            name={["baseInfoModel", "birthPlace"]}
            rules={[{ required: true, message: '请输入出生地' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="婚姻状况"
            name={["baseInfoModel", "maritalStatus"]}
            rules={[{ required: true, message: '请选择婚姻状况' }]}
          >
            <Select>
              <Option value={2} key={2}>已婚</Option>
              <Option value={1} key={1}>未婚</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="国家地区"
            name={["baseInfoModel", "region"]}
            rules={[{ required: true, message: '请输入国家地区' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="户口性质"
            name={["baseInfoModel", "accountNature"]}
            rules={[{ required: true, message: '请选择户口性质' }]}
          >
            <Select>
              <Option value={1} key={1}>本埠城镇</Option>
              <Option value={2} key={2}>本埠农业</Option>
              <Option value={3} key={3}>外埠城镇</Option>
              <Option value={4} key={4}>外埠农业</Option>
              <Option value={5} key={5}>港澳台从业人员</Option>
              <Option value={6} key={6}>在华就业外籍人员</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="家庭电话"
            name={["baseInfoModel", "homeTelephone"]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="手机号"
            name={["baseInfoModel", "phone"]}
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="电子邮件"
            name={["baseInfoModel", "email"]}
            rules={[{ required: true, message: '电子邮件' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="QQ号"
            name={["baseInfoModel", "qq"]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="微信号"
            name={["baseInfoModel", "wx"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="学历"
            name={["baseInfoModel", "education"]}
            rules={[{ required: true, message: '请选择学历' }]}
          >
            <Select>
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
            label="学位"
            name={["baseInfoModel", "degree"]}
            rules={[{ required: true, message: '请选择学位' }]}
          >
            <Select>
              <Option value={0} key={0}>无学位</Option>
              <Option value={1} key={1}>学士</Option>
              <Option value={2} key={2}>硕士</Option>
              <Option value={3} key={3}>博士</Option>
              <Option value={4} key={4}>博士后</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="英语水平"
            name={["baseInfoModel", "englishLevel"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="毕业日期"
            name={["baseInfoModel", "graduateDate"]}
            rules={[{ required: true, message: '请选择毕业日期' }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="其他外语水平"
            name={["baseInfoModel", "otherLangues"]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="是否留学归国人员"
            name={["baseInfoModel", "returnedPeople"]}
            rules={[{ required: true, message: '请选择是否留学归国人员' }]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="专业"
            name={["baseInfoModel", "major"]}
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="是否有北京工作居住证"
            name={["baseInfoModel", "bjWorkPermit"]}
            rules={[{ required: true, message: '请选择是否有北京工作居住证' }]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="是否在当地缴交过社保"
            name={["baseInfoModel", "localSocialSecurity"]}
            rules={[{ required: true, message: '请选择是否在当地缴交过社保' }]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="最早参加工作日期"
            name={["baseInfoModel", "employmentDate"]}
            rules={[{ required: true, message: '请选择最早参加工作日期' }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="毕业院校"
            name={["baseInfoModel", "college"]}
            rules={[{ required: true, message: '请输入毕业院校' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="档案所在地"
            name={["baseInfoModel", "archivesLocation"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="开户银行"
            name={["baseInfoModel", "bankName"]}
            rules={[{ required: true, message: '请输入开户银行' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="银行卡号"
            name={["baseInfoModel", "bankCardNo"]}
            rules={[{ required: true, message: '请输入银行卡号' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item
            label="开户银行详细名称"
            name={["baseInfoModel", "bankDetailName"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} offset={2}>
          <Form.Item
            label="现住址"
            name={["baseInfoModel", "habitation"]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}