import React, { useEffect, useState } from 'react';
import PDFObject from 'pdfobject';
import { Card, Descriptions, Tabs } from 'antd';
import { GlobalResParams, eduHash } from '@/types/ITypes';
import { commonDetail } from './services/staff';
import EmployeePrint from '@/pages/Evaluation/Print';

const { TabPane } = Tabs;
export default props => {
  const [detail, setDetail] = useState<any>({});
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const { resumeId, employeeId } = props.location.query;
  const [url, setUrl] = useState<string>();
  const [activeKey, setActiveKey] = useState<String>();
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await commonDetail(employeeId);
      setDetail(res?.obj);
      if (res.obj?.resumeUrl) {
        setUrl(res.obj.resumeUrl.split(':')[1]);
      } else {
        setIsEmpty(true);
      }
    }
    getDetail();
  }, []);

  useEffect(() => {
    if (activeKey) {
      PDFObject.embed(url, '#pdf1', options);
    }
  }, [activeKey]);

  const sexHash = { 1: '男', 2: '女' };
  const emHash = { 1: '正式', 2: '实习', 3: '外聘', 4: '兼职' };
  const deadlineHash = { 0: '未提醒', 1: '已提醒' };
  const marrigeHash = { 1: '未婚', 2: '已婚' };
  const bearHash = { 1: '已育', 0: '未育' };
  const computeHash = { 0: '否', 1: '是' };
  const positionHash = { 0: '离职', 1: '在职' };
  const options = {
    height: '900px',
    page: '1',
    pdfOpenParams: {
      view: 'FitV',
      pagemode: 'thumbs',
      search: 'lorem ipsum',
    },
  };
  return (
    <Card title="员工详情">
      <Tabs
        onChange={e => {
          setActiveKey(e);
        }}
      >
        <TabPane tab="花名册" key="1" style={{ wordBreak: 'break-all' }}>
          <div>
            <h2>基本信息</h2>
            <Descriptions bordered column={4}>
              <Descriptions.Item label="员工编号" style={{ maxWidth: '100px' }}>
                {detail?.employeeId || '  '}
              </Descriptions.Item>
              <Descriptions.Item label="姓名" style={{ maxWidth: '100px' }}>
                {detail?.name || '  '}
              </Descriptions.Item>
              <Descriptions.Item label="英文名" style={{ maxWidth: '100px' }}>
                {detail?.englishName || '  '}
              </Descriptions.Item>
              <Descriptions.Item label="入职日期" style={{ maxWidth: '100px' }}>
                {detail?.onboardingDate || ''}
              </Descriptions.Item>

              <Descriptions.Item label="性别" style={{ maxWidth: '100px' }}>
                {sexHash[detail?.sex] || '  '}
              </Descriptions.Item>
              <Descriptions.Item label="民族" style={{ maxWidth: '100px' }}>
                {detail?.nationCode || '  '}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" style={{ maxWidth: '100px' }}>
                {detail?.mobile || '  '}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱" style={{ maxWidth: '100px' }}>
                {detail?.email || '  '}
              </Descriptions.Item>

              <Descriptions.Item label="HRBP" style={{ maxWidth: '100px' }}>
                {detail?.hrbp || '  '}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div style={{ marginTop: 20 }}>
            <h2>职位信息</h2>
            <Descriptions bordered column={4}>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="一级业务线"
              >
                {detail?.firstBusinessName || '暂无'}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="二级业务线"
              >
                {detail?.businessName}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="部门">
                {detail?.departmentName || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="组别">
                {detail?.groupName || '  '}
              </Descriptions.Item>

              <Descriptions.Item style={{ maxWidth: '100px' }} label="技术岗位">
                {detail?.postName || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="职位">
                {detail?.titleName || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="管理职级">
                {detail?.manageRankName || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="技术职级">
                {detail?.rankName || '  '}
              </Descriptions.Item>

              <Descriptions.Item style={{ maxWidth: '100px' }} label="上级编号">
                {detail?.superiorsNo || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="上级姓名">
                {detail?.superiorsName || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="角色">
                {detail?.roles || '  '}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div style={{ marginTop: 20 }}>
            <h2>合同信息</h2>
            <Descriptions bordered column={4}>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="合同起始日期"
              >
                {detail?.contractStart || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="合同结束日期"
              >
                {detail?.contractEnd || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="试用期截止日期"
              >
                {detail?.probationEnd || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="试用期到期提醒"
              >
                {deadlineHash[detail?.probationRemind] || '  '}
              </Descriptions.Item>

              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="合同到期提醒"
              >
                {deadlineHash[detail?.contractRemind] || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="合同变更记录"
              >
                {detail?.contractChangeRecord || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="开始工作时间"
              >
                {detail?.workStart || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="上份合同开始时间"
              >
                {detail?.exWorkStart || '  '}
              </Descriptions.Item>

              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="实际劳动关系"
              >
                {' '}
                {detail?.businessLaborRelations}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="用工类型">
                {emHash[detail?.employmentType] || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="是否在职">
                {positionHash[detail?.currentPosition] || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="工作地">
                {detail?.workPlace || '  '}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div style={{ marginTop: 20 }}>
            <h2>银行、家庭信息</h2>
            <Descriptions bordered column={4}>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="银行名称">
                {detail?.bankName || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="银行卡号">
                {detail?.bankCardNo || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="身份证号">
                {detail?.idCard || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="出生日期">
                {detail?.birthDate || '  '}
              </Descriptions.Item>

              <Descriptions.Item style={{ maxWidth: '100px' }} label="毕业院校">
                {detail?.graduatedSchool || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="专业">
                {detail?.major || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="毕业日期">
                {detail?.graduationDate || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="文化程度">
                {eduHash[detail?.educationalLevel] || '  '}
              </Descriptions.Item>

              <Descriptions.Item style={{ maxWidth: '100px' }} label="婚姻状况">
                {marrigeHash[detail?.maritalStatus] || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="生育状况">
                {bearHash[detail?.fertilityStatus] || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="微信号">
                {detail?.wx || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="是否使用公司电脑"
              >
                {computeHash[detail?.useComputer] || '  '}
              </Descriptions.Item>

              <Descriptions.Item style={{ maxWidth: '100px' }} label="户籍地址">
                {detail?.residenceAddress || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="现居住地址"
              >
                {detail?.habitation || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="紧急联系人"
              >
                {detail?.relationshipName || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="紧急联系电话"
              >
                {detail?.emergencyContact || '  '}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div style={{ marginTop: 20 }}>
            <h2>财务信息</h2>
            <Descriptions bordered column={3}>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="部门（财务）"
              >
                {detail?.financeDepartment || '  '}
              </Descriptions.Item>
              <Descriptions.Item
                style={{ maxWidth: '100px' }}
                label="组别（财务）"
              >
                {detail?.financeGroup || '  '}
              </Descriptions.Item>
              <Descriptions.Item style={{ maxWidth: '100px' }} label="成本中心">
                {detail?.businessCostCenter || '  '}
              </Descriptions.Item>
              <Descriptions.Item span={3} label="备注">
                {detail?.costName || '  '}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
        <TabPane tab="员工登记表" key="2">
          <EmployeePrint resumeId={resumeId} type={2} isComponent={true} />
        </TabPane>
        <TabPane tab="简历预览" key="3">
          {isEmpty ? (
            <p
              style={{
                marginTop: 300,
                textAlign: 'center',
                marginBottom: 350,
                color: '#1890ff',
                fontSize: 20,
              }}
            >
              简历暂时无法预览，请通过修改进行查看
            </p>
          ) : (
            <div id="pdf1" style={{ minHeight: '800px' }}></div>
          )}
        </TabPane>
      </Tabs>
    </Card>
  );
};
