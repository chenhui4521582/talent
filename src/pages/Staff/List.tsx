import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { listByConditionsRoster } from './services/staff';
import { Card, Form, Input, Select, Row, Col, Button, Divider, Modal, Checkbox } from 'antd';
import { useBusiness } from '@/models/global';
import { serialize } from '@/utils/serialize';
import { useJob } from '@/models/global';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const [visible, setVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<string[]>([]);
  const exportName = {
    employeeId: '编号',
    name: '姓名',
    businessLaborRelations: '实际劳动关系',
    businessName: '所属业务',
    postName: '岗位',
    employmentType: '用工类型',
    sex: '性别',
    idCard: '身份证号码',
    birthDate: '出生日期',
    contractStart: '合同起始日期',
    contractEnd: '合同结束日期',
    onboardingDate: '入职日期',
    probationEnd: '试用期截止日期',
    residenceAddress: '户籍地址',
    habitation: '现居住地址',
    emergencyPhone: '紧急联系电话',
    relationshipName: '关系/姓名',
    educationalLevel: '文化程度',
    graduatedSchool: '毕业学校',
    major: '专业',
    graduationDate: '毕业日期',
    workStart: '开始工作日期',
    nationCode: '民族',
    maritalStatus: '婚姻状况',
    fertilityStatus: '生育状况',
    mobile: '联系电话',
    bankCardNo: '银行卡号',
    bankName: '银行名称',
    wx: '微信号',
    englishName: '英文名',
    departmentName: '部门',
    groupName: '组别',
    businessCostCenter: '成本中心',
    contractChangeRecord: '合同变更记录',
    exWorkStart: '上一份合同开始日期',
    useComputer: '是否用公司电脑',
    hrbp: 'HRBP',
    superiorsNo: '上级编号',
    superiorsName: '上级姓名',
    rankName: '职级',
    titleName: '职位',
    roles: '角色',
    workPlace: '工作地'
  }
  useEffect(() =>{
    let newArr: string[] = [];
    Object.keys(exportName).map(item => {
      newArr.push(item);
    });
    setChecked([...newArr]);
  }, [visible]);
  const columns: ColumnProps<any>[] = [
    {
      title: '员工编号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '所属业务线',
      dataIndex: 'businessName',
      key: 'businessName',
      align: 'center',
    },
    {
      title: '成本中心',
      dataIndex: 'businessCostCenter',
      key: 'businessCostCenter',
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
    },
    {
      title: '用工类型',
      dataIndex: 'employmentType',
      key: 'employmentType',
      align: 'center',
      render: text => {
        const data = { 1: '正式', 2: '实习', 3: '外聘', 4: '兼职' };
        return <span>{data[text]}</span>;
      },
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      align: 'center',
    },
    {
      title: '合同起始日期',
      dataIndex: 'contractStart',
      key: 'contractStart',
      align: 'center',
    },
    {
      title: '合同结束日期',
      dataIndex: 'contractEnd',
      key: 'contractEnd',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Link
              to={`detail?employeeId=${record.employeeId}&resumeId=${record.resumeId}`}
            >
              查看详情
            </Link>
            <Divider type="vertical" />
            <Link to={`edit?employeeId=${record.employeeId}`}>编辑</Link>
          </span>
        );
      },
    },
  ];
  const { TableContent, searchForm } = useTable({
    queryMethod: listByConditionsRoster,
    columns,
    rowKeyName: 'employeeId',
  });

  const changeCheck = (checkedValues) => {
    setChecked(checkedValues);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    const value = checked.join(',');
    window.open(serialize(`/api/talent/employeeRoster/export?includ=${value}`, searchForm.getFieldsValue()));
    handleCancel();
  };

  return (
    <Card
      title="员工花名册"
      extra={
        <div>
          <Button type="primary">
            <Link to={`edit`}>新增员工</Link>
          </Button>
          <Button
            onClick={_ => setVisible(true)}
            style={{ marginLeft: 10 }}
          >
            导出
          </Button>
        </div>
      }
    >
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="岗位" name="postId">
              <Select showSearch optionFilterProp="children">
                {jobList?.map(item => {
                  return (
                    <Option key={item.jobId} value={item.jobId}>
                      {item.jobName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="员工编号" name="employeeId">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="业务线" name="businessCode">
              <Select showSearch optionFilterProp="children">
                {businessList?.map(item => {
                  return (
                    <Option key={item.businessCode} value={item.businessCode}>
                      {item.businessLineName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        title="导出内容"
        visible={visible}
        cancelText="取消"
        okText="确认"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{height: 200, overflowY: 'scroll'}}>
          <Checkbox.Group value={checked} onChange={changeCheck}>
            {
              Object.keys(exportName)?.map(item => {
                return (
                  <div key={item}>
                    <Checkbox value={item}>{exportName[item]}</Checkbox>
                  </div>
                )
              })
            }
          </Checkbox.Group>
        </div>
      </Modal>
    </Card>
  );
};
