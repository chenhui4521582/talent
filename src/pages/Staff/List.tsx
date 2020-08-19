import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { listByConditionsRoster } from './services/staff';
import {
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Divider,
  Modal,
  Checkbox,
} from 'antd';
import { useBusiness } from '@/models/global';
import { serialize } from '@/utils/serialize';
import { useJob } from '@/models/global';
import { getlevelOr } from '@/services/global';
import { GlobalResParams } from '@/types/ITypes';

interface tsItem {
  code: string;
  name: string;
}

const sexHash = { 1: '男', 2: '女' };
const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const [visible, setVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [business1, setBusiness1] = useState<tsItem[]>();
  const [business2, setBusiness2] = useState<tsItem[]>();
  const [select1, setSelect1] = useState<string>();
  const exportName = {
    employeeId: '编号',
    name: '姓名',
    firstBusinessName: '一级业务',
    businessName: '二级业务',
    departmentName: '部门',
    groupName: '组别',
    postName: '岗位',
    titleName: '职位',
    rankName: '技术职级',
    manageRankName: '管理职级',
    onboardingDate: '入职日期',
    sex: '性别',
    roles: '角色',
    superiorsNo: '上级编号',
    superiorsName: '上级姓名',
    workPlace: '工作地',
    businessLaborRelations: '劳动关系',
    employmentType: '用工类型',
    contractStart: '合同起始日期',
    contractEnd: '合同结束日期',
    contractRemind: '合同到期提醒',
    probationEnd: '试用期截止日期',
    probationRemind: '试用期到期提醒',
    idCard: '身份证号码',
    birthDate: '出生日期',
    residenceAddress: '户籍地址',
    habitation: '现居住地址',
    relationshipName: '紧急联系人',
    emergencyPhone: '紧急联系电话',
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
    contractChangeRecord: '合同变更记录',
    exWorkStart: '上一份合同开始日期',
    useComputer: '是否使用公司电脑',
    hrbp: 'HRBP',
    financeDepartment: '部门（财务）',
    financeGroup: '组别（财务）',
    businessCostCenter: '成本中心',
    remark: '备注',
    email: '邮箱',
    currentPosition: '是否在职',
    trainingAgreement: '培训协议',
    other: '其他',
  };

  useEffect(() => {
    async function list() {
      let res: GlobalResParams<tsItem[]> = await getlevelOr('');
      if (res.status === 200) {
        setBusiness1(res.obj);
      }
    }
    list();
  }, []);

  useEffect(() => {
    async function list() {
      if (select1) {
        let res: GlobalResParams<tsItem[]> = await getlevelOr(select1);
        if (res.status === 200) {
          setBusiness2(res.obj);
        }
      }
    }
    if (select1) {
      list();
    }
  }, [select1]);

  useEffect(() => {
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
      title: '一级业务',
      dataIndex: 'firstBusinessName',
      key: 'firstBusinessName',
      align: 'center',
    },
    {
      title: '二级业务',
      dataIndex: 'businessName',
      key: 'businessName',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '组别',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
    },
    {
      title: '技术岗位',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
    },
    {
      title: '职位',
      dataIndex: 'titleName',
      key: 'titleName',
      align: 'center',
    },
    {
      title: '入职日期',
      dataIndex: 'onboardingDate',
      key: 'onboardingDate',
      align: 'center',
      render: (_, record) => {
        return <span>{record.onboardingDate || '暂未填写'}</span>;
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
      render: (_, record) => {
        return <span>{sexHash[record.sex]}</span>;
      },
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
    cacheKey: 'employeeRoster/listByConditionsRoster',
  });

  const changeCheck = checkedValues => {
    setChecked(checkedValues);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    const value = checked.join(',');

    window.open(
      serialize(
        `/api/talent/employeeRoster/export?includ=${value}`,
        searchForm.getFieldsValue(),
      ),
    );

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
          <Button onClick={_ => setVisible(true)} style={{ marginLeft: 10 }}>
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
            <Form.Item label="一级业务线" name="firstBusinessCode">
              <Select
                showSearch
                optionFilterProp="children"
                onChange={e => {
                  searchForm.setFieldsValue({ businessCode2: undefined });
                  setSelect1(e as any);
                }}
              >
                {business1?.map(item => {
                  return (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="二级业务线" name="businessCode">
              <Select showSearch optionFilterProp="children" allowClear>
                {business2?.map(item => {
                  return (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="是否在职" name="currentPosition">
              <Select showSearch optionFilterProp="children">
                <Option value={0}>离职</Option>
                <Option value={1}>在职</Option>
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
        <div style={{ height: 200, overflowY: 'scroll' }}>
          <Checkbox.Group value={checked} onChange={changeCheck}>
            {Object.keys(exportName)?.map(item => {
              return (
                <div key={item}>
                  <Checkbox value={item}>{exportName[item]}</Checkbox>
                </div>
              );
            })}
          </Checkbox.Group>
        </div>
      </Modal>
    </Card>
  );
};
