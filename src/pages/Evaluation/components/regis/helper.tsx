import React from 'react';
import { ColumnProps } from 'antd/es/table';
import { Form, Input, DatePicker, Select, Radio } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
export const workColumns: ColumnProps<any>[] = [{
  title: '工作单位',
  dataIndex: 'company',
  key: 'company',
  align: 'center'
}, {
  title: '开始日期',
  dataIndex: 'startDate',
  key: 'startDate',
  align: 'center'
}, {
  title: '结束日期',
  dataIndex: 'endDate',
  key: 'endDate',
  align: 'center'
}, {
  title: '部门',
  dataIndex: 'department',
  key: 'department',
  align: 'center'
}, {
  title: '职务',
  dataIndex: 'title',
  key: 'title',
  align: 'center'
}, {
  title: '岗位',
  dataIndex: 'position',
  key: 'position',
  align: 'center'
},{
  title: '主要职责',
  dataIndex: 'responsibility',
  key: 'email',
  align: 'center'
}, {
  title: '证明人',
  dataIndex: 'prover',
  key: 'prover',
  align: 'center'
},{
  title: '联系电话',
  dataIndex: 'proverPhone',
  key: 'proverPhone',
  align: 'center'
},{
  title: '离职原因',
  dataIndex: 'reason',
  key: 'reason',
  align: 'center'
}];

export const workComponent = (
  <div>
    <Form.Item
      label="工作单位"
      name="company"
      rules={[{ required: true, message: '请输入工作单位' }]}
    >
      <Input placeholder="请输入工作单位" />
    </Form.Item>

    <Form.Item
      label="开始日期"
      name="startDate"
      rules={[{ required: true, message: '请选择开始日期' }]}
    >
      <DatePicker placeholder="请选择开始日期" />
    </Form.Item>

    <Form.Item
      label="结束日期"
      name="endDate"
      rules={[{ required: true, message: '请选择结束日期' }]}
    >
      <DatePicker placeholder="请选择结束日期" />
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
      name="title"
      rules={[{ required: true, message: '请输入职务' }]}
    >
      <Input placeholder="请输入职务" />
    </Form.Item>
    <Form.Item
      label="岗位"
      name="position"
      rules={[{ required: true, message: '请输入岗位' }]}
    >
      <Input placeholder="请输入岗位" />
    </Form.Item>
    <Form.Item
      label="主要职责"
      name="responsibility"
    >
      <Input placeholder="请输入主要职责" />
    </Form.Item>

    <Form.Item
      label="证明人"
      name="prover"
    >
      <Input placeholder="请输入证明人" />
    </Form.Item>
    <Form.Item
      label="联系电话"
      name="proverPhone"
    >
      <Input placeholder="请输入联系电话" />
    </Form.Item>
    <Form.Item
      label="离职原因"
      name="reason"
    >
      <TextArea rows={4} placeholder="请输入离职原因" />
    </Form.Item>
  </div>
)

export const eduColumns: ColumnProps<any>[] = [{
  title: '入学日期',
  dataIndex: 'startDate',
  key: 'startDate',
  align: 'center'
}, {
  title: '毕业日期',
  dataIndex: 'endDate',
  key: 'endDate',
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
}, {
  title: '学制',
  dataIndex: 'schoolSystem',
  key: 'schoolSystem',
  align: 'center',
  render: (text) => {
    const data = ['1年', '1.5年', '2年','2.5年','3年','3.5年','4年','4.5年','5年'];
    return <span> {data[text]}</span>
  }
}, {
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
  title: '学位授予日期',
  dataIndex: 'degreeDate',
  key: 'degreeDate',
  align: 'center'
},{
  title: '学历证书编号',
  dataIndex: 'educationCertificateNo',
  key: 'educationCertificateNo',
  align: 'center'
},{
  title: '学位证书编号',
  dataIndex: 'degreeCertificateNo',
  key: 'degreeCertificateNo',
  align: 'center'
}, {
  title: '是否最高学历',
  dataIndex: 'highestEducation',
  key: 'highestEducation',
  align: 'center',
  render: (text) => {
    const data = { '1': '是', '0': '否' };
    return <span> {data[text]}</span>
  }
}];

export const eduComponent = (
  <div>
    <Form.Item
      label="入学时间"
      name="startDate"
      rules={[{ required: true, message: '请选择入学时间' }]}
    >
      <DatePicker placeholder="请选择入学时间" />
    </Form.Item>

    <Form.Item
      label="毕业时间"
      name="graduateDate"
      rules={[{ required: true, message: '请选择毕业时间' }]}
    >
      <DatePicker placeholder="请选择毕业时间" />
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
      label="学制"
      name="schoolSystem"
      rules={[{ required: true, message: '请选择学制' }]}
    >
      <Select placeholder="请选择学制" showSearch optionFilterProp='children'>
        <Option value={1}>1年</Option>
        <Option value={2}>1.5年</Option>
        <Option value={3}>2年</Option>
        <Option value={4}>2.5年</Option>
        <Option value={5}>3年</Option>
        <Option value={6}>3.5年</Option>
        <Option value={7}>4年</Option>
        <Option value={8}>4.5年</Option>
        <Option value={9}>5年</Option>
      </Select>
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
      label="学历证书编号"
      name="educationCertificateNo"
    >
      <Input placeholder="请输入学历证书编号" />
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
      label="学位授予日期"
      name="degreeDate"
    >
      <DatePicker placeholder="请选择学位授予日期" />
    </Form.Item>
    <Form.Item
      label="学位证书编号"
      name="degreeCertificateNo"
    >
      <TextArea rows={4} placeholder="请输入学位证书编号" />
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
  </div>
)

export const famColumns: ColumnProps<any>[] = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  align: 'center'
}, {
  title: '与本人关系',
  dataIndex: 'relationship',
  key: 'relationship',
  align: 'center'
}, {
  title: '工作单位',
  dataIndex: 'company',
  key: 'company',
  align: 'center'
}, {
  title: '联系电话',
  dataIndex: 'phone',
  key: 'phone',
  align: 'center'
}];

export const famComponent = (
  <div>
    <Form.Item
      label="姓名"
      name="name"
      rules={[{ required: true, message: '请填写姓名' }]}
    >
      <Input placeholder="请填写姓名" />
    </Form.Item>
    <Form.Item
      label="与本人关系"
      name="relationship"
    >
      <Input placeholder="请填写与本人关系" />
    </Form.Item>
    <Form.Item
      label="工作单位"
      name="company"
    >
      <Input placeholder="请填写工作单位" />
    </Form.Item>
    <Form.Item
      label="联系电话"
      name="phone"
    >
      <Input placeholder="请填写联系电话" />
    </Form.Item>
  </div>
)

export const contColumns: ColumnProps<any>[] = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  align: 'center'
}, {
  title: '与本人关系',
  dataIndex: 'relationship',
  key: 'relationship',
  align: 'center'
}, {
  title: '工作单位',
  dataIndex: 'company',
  key: 'company',
  align: 'center'
}, {
  title: '联系电话',
  dataIndex: 'phone',
  key: 'phone',
  align: 'center'
}, {
  title: '联系地址',
  dataIndex: 'address',
  key: 'address',
  align: 'center'
}];

export const contComponent = (
  <div>
    <Form.Item
      label="姓名"
      name="name"
      rules={[{ required: true, message: '请填写姓名' }]}
    >
      <Input placeholder="请填写姓名" />
    </Form.Item>
    <Form.Item
      label="与本人关系"
      name="relationship"
    >
      <Input placeholder="请填写与本人关系" />
    </Form.Item>
    <Form.Item
      label="工作单位"
      name="company"
    >
      <Input placeholder="请填写工作单位" />
    </Form.Item>
    <Form.Item
      label="联系电话"
      name="phone"
    >
      <Input placeholder="请填写联系电话" />
    </Form.Item>
    <Form.Item
      label="联系地址"
      name="address"
    >
      <Input placeholder="请填写联系地址" />
    </Form.Item>
  </div>
)

export const childColumns: ColumnProps<any>[] = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  align: 'center'
}, {
  title: '性别',
  dataIndex: 'sex',
  key: 'sex',
  align: 'center',
  render: (text) => {
    const data = { '1': '男', '2': '女' };
    return <span> {data[text]}</span>
  }
}, {
  title: '出生日期',
  dataIndex: 'birthDate',
  key: 'birthDate',
  align: 'center'
}];

export const childComponent = (
  <div>
    <Form.Item
      label="子女姓名"
      name="name"
      rules={[{ required: true, message: '请填写子女姓名' }]}
    >
      <Input placeholder="请填写子女姓名" />
    </Form.Item>
    <Form.Item
      label="性别"
      name="sex"
      rules={[{ required: true, message: '请选择性别' }]}
    >
      <Radio.Group>
        <Radio value={1}>男</Radio>
        <Radio value={2}>女</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item
      label="出生日期"
      name="birthDate"
    >
      <DatePicker />
    </Form.Item>
  </div>
)

export const titleColumns: ColumnProps<any>[] = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  align: 'center'
}, {
  title: '类型',
  dataIndex: 'type',
  key: 'type',
  align: 'center',
  render: (text) => {
    const data = { 1: '职称信息', 2: '职业资格' };
    return <span>{data[text]}</span>
  }
}, {
  title: '等级',
  dataIndex: 'level',
  key: 'level',
  align: 'center'
}];

export const titleComponent = (
  <div>
    <Form.Item
      label="名称"
      name="name"
      rules={[{ required: true, message: '请填写名称' }]}
    >
      <Input placeholder="请填写名称" />
    </Form.Item>
    <Form.Item
      label="类型"
      name="type"
      rules={[{ required: true, message: '请选择类型' }]}
    >
      <Select>
        <Option value={1}>职称信息</Option>
        <Option value={2}>职业资格</Option>
      </Select>
    </Form.Item>
    <Form.Item
      label="等级"
      name="level"
      rules={[{ required: true, message: '请填写等级' }]}
    >
      <Input placeholder="请输入等级" />
    </Form.Item>
  </div>
)