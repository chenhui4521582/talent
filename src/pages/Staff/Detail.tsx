import React, { useEffect, useState } from 'react';
import PDFObject from 'pdfobject'
import {
  Card, Descriptions, Tabs
} from 'antd';
import { GlobalResParams, eduHash } from '@/types/ITypes';
import { commonDetail } from './services/staff';
import EmployeePrint from '@/pages/Evaluation/Print';

const { TabPane } = Tabs;
export default (props) => {
  const [detail, setDetail] = useState<any>({});
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const { resumeId, employeeId } = props.location.query;
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await commonDetail(employeeId);
      setDetail(res?.obj);
      if (res.obj.resumeUrl) {
        let url = res.obj.resumeUrl.split(':')[1]
        PDFObject.embed(url, '#pdf', options)
      } else {
        setIsEmpty(true);
      }
    }
    getDetail();
  }, []);
  const sexHash = { 1: '男', 2: '女' };
  const emHash = { 1: '正式', 2: '实习', 3: '外聘', 4: '兼职' };
  const deadlineHash= { 0: '已到期', 1: '未到期' };
  const marrigeHash = { 1: '未婚', 2: '已婚' };
  const bearHash = { 1: '已育', 0: '未育' };
  const computeHash = { 0: '否', 1: '是'};
  const options = {
    height: "900px",
    page: '1',
    pdfOpenParams: {
      view: 'FitV',
      pagemode: 'thumbs',
      search: 'lorem ipsum'
    }
  };
  return (
    <Card title="员工详情">
      <Tabs>
        <TabPane tab="花名册" key="1">
          <div>
            <Descriptions bordered>
              <Descriptions.Item label="员工编号">
                {detail?.employeeId}
              </Descriptions.Item>
              <Descriptions.Item label="姓名">
                {detail?.name}
              </Descriptions.Item>
              <Descriptions.Item label="英文名">
                {detail?.englishName}
              </Descriptions.Item>
              <Descriptions.Item label="性别">
                {sexHash[detail?.sex]}
              </Descriptions.Item>
              <Descriptions.Item label="所属业务线">
                {detail?.businessName}
              </Descriptions.Item>
              <Descriptions.Item label="部门">
                {detail?.departmentId}
              </Descriptions.Item>
              <Descriptions.Item label="成本中心">
                {detail?.businessCostCenter}
              </Descriptions.Item>
              <Descriptions.Item label="实际劳动关系">
                {detail?.businessLaborRelations}
              </Descriptions.Item>
              <Descriptions.Item label="用工类型">
                {emHash[detail?.employmentType]}
              </Descriptions.Item>
              <Descriptions.Item label="是否用公司电脑">
                {computeHash[detail?.useComputer]}
              </Descriptions.Item>
              <Descriptions.Item label="HRBP">
                {detail?.hrbp}
              </Descriptions.Item>
              <Descriptions.Item label="上级编号">
                {detail?.superiorsNo}
              </Descriptions.Item>
              <Descriptions.Item label="上级姓名">
                {detail?.superiorsName}
              </Descriptions.Item>
              <Descriptions.Item label="职级">
                {detail?.rankId}
              </Descriptions.Item>
              <Descriptions.Item label="职位">
                {detail?.titleId}
              </Descriptions.Item>
              <Descriptions.Item label="角色">
                {detail?.roles}
              </Descriptions.Item>
              <Descriptions.Item label="工作地">
                {detail?.workPlace}
              </Descriptions.Item>
            </Descriptions>
            <div style={{marginTop: 20}}>
              <Descriptions bordered>
                <Descriptions.Item label="合同起始日期">
                  {detail?.contractStart}
                </Descriptions.Item>
                <Descriptions.Item label="合同结束日期">
                  {detail?.contractEnd}
                </Descriptions.Item>
                <Descriptions.Item label="合同到期提醒">
                  {deadlineHash[detail?.contractRemind]}
                </Descriptions.Item>
                <Descriptions.Item label="试用期到期提醒">
                  {deadlineHash[detail?.probationRemind]}
                </Descriptions.Item>
                <Descriptions.Item label="入职日期">
                  {detail?.onboardingDate}
                </Descriptions.Item>
                <Descriptions.Item label="试用期截止日期">
                  {detail?.probationEnd}
                </Descriptions.Item>
                <Descriptions.Item label="开始工作时间">
                  {detail?.workStart}
                </Descriptions.Item>
                <Descriptions.Item label="上份合同开始时间" span={2}>
                  {detail?.exWorkStart}
                </Descriptions.Item>
                <Descriptions.Item label="合同变更记录" span={3}>
                  {detail?.contractChangeRecord}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{marginTop: 20}}>
              <Descriptions bordered>
                <Descriptions.Item label="岗位">
                  {detail?.post}
                </Descriptions.Item>
                <Descriptions.Item label="类别">
                  {detail?.category}
                </Descriptions.Item>
                <Descriptions.Item label="组别">
                  {detail?.group}
                </Descriptions.Item>
                <Descriptions.Item label="其他">
                  {detail?.other}
                </Descriptions.Item>
                <Descriptions.Item label="婚姻状况">
                  {marrigeHash[detail?.maritalStatus]}
                </Descriptions.Item>
                <Descriptions.Item label="生育状况">
                  {bearHash[detail?.fertilityStatus]}
                </Descriptions.Item>

                <Descriptions.Item label="民族">
                  {detail?.nationCode}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {detail?.mobile}
                </Descriptions.Item>
                <Descriptions.Item label="身份证号">
                  {detail?.idCard}
                </Descriptions.Item>
                <Descriptions.Item label="微信号">
                  {detail?.wx}
                </Descriptions.Item>
                <Descriptions.Item label="登记银行">
                  {detail?.bankName}
                </Descriptions.Item>
                <Descriptions.Item label="银行卡号">
                  {detail?.bankCardNo}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{marginTop: 20}}>
              <Descriptions bordered>
                <Descriptions.Item label="文化程度">
                  {eduHash[detail?.educationalLevel]}
                </Descriptions.Item>
                <Descriptions.Item label="毕业院校">
                  {detail?.graduatedSchool}
                </Descriptions.Item>
                <Descriptions.Item label="专业">
                  {detail?.major}
                </Descriptions.Item>

                <Descriptions.Item label="毕业日期">
                  {detail?.graduationDate}
                </Descriptions.Item>

                <Descriptions.Item label="紧急联系人">
                  {detail?.emergencyContact}
                </Descriptions.Item>

                <Descriptions.Item label="户籍地址">
                  {detail?.residenceAddress}
                </Descriptions.Item>
                <Descriptions.Item label="现居住地址">
                  {detail?.habitation}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{marginTop: 20}}>
              <Descriptions bordered>
                <Descriptions.Item label="备注">
                  {detail?.remark}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </TabPane>
        <TabPane tab="员工登记表" key="2">
          <EmployeePrint resumeId={resumeId} type={2} isComponent={true} />
        </TabPane>
        <TabPane tab="简历预览" key="3">
          {
            isEmpty ?
            <p style={{marginTop: 300,textAlign: 'center', marginBottom: 350, color:'#1890ff',fontSize: 20}}>简历暂时无法预览，请通过修改进行查看</p>
            :
            <div id="pdf" style={{minHeight: '800px'}}></div>
          }
        </TabPane>
      </Tabs>
    </Card>
  )
}