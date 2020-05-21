import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history } from 'umi';
import { Card, Tabs, Form, Button, Input, notification } from 'antd';
import Company from './components/regis/Company';
import Basic from './components/regis/Basic';
import { commonDetail, commonUpdate } from './services/registration';
import { GlobalResParams, newPageFormItemLayout } from '@/types/ITypes';
import CommonTable from './components/regis/CommonTable';
import Health from './components/regis/Health';
import {
  workColumns, workComponent, eduColumns, eduComponent, famColumns, famComponent,
  contColumns, contComponent, childColumns, childComponent, titleColumns, titleComponent
} from './components/regis/helper';

const { TabPane } = Tabs;
const { TextArea } = Input;

export default (props) => {
  const [detail, setDetail] = useState<any>();
  const [workList, setWorkList] = useState<any[]>([]);
  const [eduList, setEduList] = useState<any[]>([]);
  const [famList, setFamList] = useState<any[]>([]);
  const [contList, setContList] = useState<any[]>([]);
  const [childList, setChildList] = useState<any[]>([]);
  const [titleList, setTitleList] = useState<any[]>([]);
  const { resumeId } = props.location.query;
  const [form] = Form.useForm();
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await commonDetail({ resumeId });
      if (res.obj) {
        res.obj.companyModel.enterTime = moment(res['obj']['companyModel']['enterTime']);
        res.obj.baseInfoModel.birthDate = moment(res['obj']['baseInfoModel']['birthDate']);
        res.obj.baseInfoModel.graduateDate = moment(res['obj']['baseInfoModel']['graduateDate']);
        res.obj.baseInfoModel.employmentDate = moment(res['obj']['baseInfoModel']['employmentDate']);
        res.obj.baseInfoModel.nativePlace = [res['obj']['baseInfoModel']['province'], res['obj']['baseInfoModel']['city'], res['obj']['baseInfoModel']['county']];
        form.setFieldsValue(res.obj);
        setDetail(res.obj);
        setWorkList(res.obj.workList);
        setEduList(res.obj.educationList);
        setFamList(res.obj.familyList);
        setContList(res.obj.contactList);
        setChildList(res.obj.childModel.childList);
        setTitleList(res.obj.titleList);
      }
    }
    getDetail();
  }, [])
  const handleSubmit = async (values) => {
    values.companyModel.enterTime = moment(values['companyModel']['enterTime']).format('YYYY/MM/DD');
    values.baseInfoModel.birthDate = moment(values['baseInfoModel']['birthDate']).format('YYYY/MM/DD');
    values.baseInfoModel.graduateDate = moment(values['baseInfoModel']['graduateDate']).format('YYYY/MM/DD');
    values.baseInfoModel.employmentDate = moment(values['baseInfoModel']['employmentDate']).format('YYYY/MM/DD');
    values.baseInfoModel.province = values.baseInfoModel.nativePlace[0];
    values.baseInfoModel.city = values.baseInfoModel.nativePlace[1];
    values.baseInfoModel.county = values.baseInfoModel.nativePlace[2];
    let res: GlobalResParams<string> = await commonUpdate({
      ...values,
      childModel: {
        childrenStatus: detail.childModel.childrenStatus,
        resumeId,
        childList
      },
      contactList: contList,
      educationList: eduList,
      familyList: famList,
      resumeId,
      titleList,
      workList
    });
    if(res.status === 200) {
      notification['success']({
        message: res.msg,
        description: '',
      });
      history.push('/talent/evaluation/registration');
    }else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };
  return (
    <Card title="修改员工登记表">
      <Form
        onFinish={handleSubmit}
        form={form}
      >
        <Tabs defaultActiveKey="1" animated type="card">
          <TabPane tab="入司信息" key="1">
            <Company />
          </TabPane>
          <TabPane tab="基本信息" key="2" forceRender>
            <Basic />
          </TabPane>
          <TabPane tab="个人履历" key="3">
            <CommonTable data={workList} setData={setWorkList} cnName="个人履历" columns={workColumns} formComponent={workComponent} rowKeyName="company" />
          </TabPane>
          <TabPane tab="教育经历" key="4">
            <CommonTable data={eduList} setData={setEduList} cnName="教育经历" columns={eduColumns} formComponent={eduComponent} rowKeyName="college" />
          </TabPane>
          <TabPane tab="家庭信息" key="5">
            <CommonTable data={famList} setData={setFamList} cnName="家庭信息" columns={famColumns} formComponent={famComponent} rowKeyName="name" />
          </TabPane>
          <TabPane tab="紧急联系人" key="6">
            <CommonTable data={contList} setData={setContList} cnName="紧急联系人" columns={contColumns} formComponent={contComponent} rowKeyName="name" />
          </TabPane>
          <TabPane tab="子女信息" key="7">
            <CommonTable data={childList} setData={setChildList} cnName="子女信息" columns={childColumns} formComponent={childComponent} rowKeyName="name" />
          </TabPane>
          <TabPane tab="职称和职业资格" key="8">
            <CommonTable data={titleList} setData={setTitleList} cnName="职称和职业资格" columns={titleColumns} formComponent={titleComponent} rowKeyName="name" />
          </TabPane>
          <TabPane tab="健康情况" key="9" forceRender>
            <Health />
          </TabPane>
          <TabPane tab="兴趣爱好" key="10" forceRender>
            <Form.Item
              label="兴趣爱好"
              name={["baseInfoModel", "hobbies"]}
              {...newPageFormItemLayout}
            >
              <TextArea rows={4} />
            </Form.Item>
          </TabPane>
        </Tabs>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{marginRight: 20, marginTop: 20}}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}