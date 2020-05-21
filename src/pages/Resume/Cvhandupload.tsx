import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Card, Descriptions, Button, Input, Select, Modal, Form, DatePicker, Table,
  Upload, Tabs
} from 'antd';
import { history } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import { selectJob, IJobParams } from './services/cvupload';
import { GlobalResParams } from '@/types/ITypes';
import {
  getResumeDetail, IResumeDetail, IWorkParams, IEduParams, uploadResume, saveFile,
  saveResume, updateResume, updateResumeUndown, saveResumeUndown
} from './services/cvhand';
import { useRes } from '@/components/useRes/useRes';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default (props) => {
  const [jobs, setJobs] = useState<IJobParams[]>();
  const resumeId = props.location.query.resumeId;
  const undownResumeId = props.location.query.undownResumeId;
  const resumeStatus = props.location.query.resumeStatus;
  const [detail, setDetail] = useState<IResumeDetail>();
  const [workList, setWorkList] = useState<IWorkParams[]>([]);
  const [eduList, setEduList] = useState<IEduParams[]>([]);
  const [form] = Form.useForm();
  const [workForm] = Form.useForm();
  const [eduForm] = Form.useForm();
  const [selectedWork, setSelectedWork] = useState<IWorkParams[]>([]);
  const [selectedEdu, setSelectedEdu] = useState<IEduParams[]>([]);
  const [modalName, setModalName] = useState<string>('');
  const { setGlobalRes } = useRes();
  useEffect(() => {
    async function fetchResumeDetail() {
      let res: GlobalResParams<IResumeDetail> = await getResumeDetail(resumeId, resumeStatus);
      form.setFieldsValue(res.obj);
      setDetail(res.obj);
      setWorkList(res.obj.workExp);
      setEduList(res.obj.eduExp);
    }
    if (resumeId) {
      fetchResumeDetail();
    }
  }, []);
  useEffect(() => {
    async function fetchJob() {
      let response: GlobalResParams<IJobParams[]> = await selectJob();
      setJobs(response.obj);
    };
    fetchJob();
  }, []);
  const workcolumns = [
    {
      title: '工作单位',
      dataIndex: 'companyName',
      key: 'companyName'
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      key: 'beginDate'
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate'
    },
  ];
  const educolumns = [
    {
      title: '学校',
      dataIndex: 'schoolName',
      key: 'schoolName'
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major'
    },
    {
      title: '学历',
      dataIndex: 'degree',
      key: 'degree'
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      key: 'beginDate'
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate'
    },
  ];

  const customRequest = async (files) => {
    let res: GlobalResParams<string> = await uploadResume({file: files.file});
    form.setFieldsValue({resumeUrl: res.obj});
  };

  const customRequestwork = async (files) => {
    let res: GlobalResParams<string> = await saveFile({file: files.file});
    form.setFieldsValue({worksUrl: res.obj});
  };

  const resumeprops = {
    name: 'file',
    multiple: true,
    action: '',
    accept:'.doc,.docx,.pdf',
    showUploadList: false,
    customRequest: customRequest
  };
  const workprops = {
    name: 'file',
    multiple: true,
    action: '',
    accept:'',
    showUploadList: false,
    customRequest: customRequestwork
  };

  const onSelectChange = (_,selectedRows: any[],values: string) => {
    if(values === 'work'){
      setSelectedWork(selectedRows);
    }else {
      setSelectedEdu(selectedRows);
    }
  };

  const workRowSelection = {
    selectedWork,
    onChange: (selectedRowKeys,selectedRows) => {onSelectChange(selectedRowKeys,selectedRows,'work')},
  };
  const eduRowSelection = {
    selectedEdu,
    onChange: (selectedRowKeys,selectedRows) => {onSelectChange(selectedRowKeys,selectedRows,'edu')},
  };

  const handleReset = () => { // 取消新增
    if(resumeId){
      history.goBack();
    }else{
      form.resetFields();
    }
  };

  const showModal = (type: string) => {
    setModalName(type);
  };

  const modalCancel = () => {
    workForm.resetFields();
    eduForm.resetFields();
    setModalName('');
  };

  const handleFinishForm = (values) => {
    values.beginDate = moment((values.month)[0]).format('YYYY-MM');
    values.endDate = moment((values.month)[1]).format('YYYY-MM');
    delete values.month;
    if (modalName === 'work') {
      setWorkList([...workList, values]);
    } else {
      setEduList([...eduList, values]);
    };
    modalCancel();
  };

  const removeArrary = (_arr, _obj) => {
    let length = _arr.length;
    for (var i = 0; i < length; i++) {
      if (_arr[i] === _obj) {
        if (i === 0) {
          _arr.shift();
          return _arr;
        }
        else if (i === length - 1) {
          _arr.pop();
          return _arr;
        }
        else {
          _arr.splice(i, 1);
          return _arr;
        }
      }
    }
  };

  const handleDelete = (type: string) => { // 删除
    if(type === 'work'){ // 工作经历删除
      let workData = [...workList];
      selectedWork.forEach(item => {
        removeArrary(workData,item)
      });
      setWorkList(workData);
    }else {
      let eduData = [...eduList];
      selectedEdu.forEach(item => {
        removeArrary(eduData,item)
      });
      setEduList(eduData);
    }
  };
  const handleSubmit = async values => {
    values = {
      ...values,
      eduExp: eduList,
      workExp: workList,
    };
    let res: GlobalResParams<string>;
    if (resumeStatus === '2') {
      values.undownResumeId = undownResumeId;
      if (resumeId) {
        values.resumeId = resumeId;
        res = await updateResume(values);
        setGlobalRes(res);
      } else {
        res = await saveResume(values);
        setGlobalRes(res);
      }
    } else if(resumeStatus === '1') {
      if (resumeId) {
        values.resumeId = resumeId;
        res = await updateResumeUndown(values);
        setGlobalRes(res);
      } else {
        res = await saveResumeUndown(values);
        setGlobalRes(res);
      }
    }
  }
  return(
    <Card style={{minHeight: 500}} title={resumeId ?'修改简历（* 为必填项）' : '新增简历（* 为必填项）'}>
      <Form
        form={form}
        onFinish={handleSubmit}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">
            <Descriptions bordered>
              <Descriptions.Item label="姓名">
                <Form.Item
                  name='name'
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label={<div><i style={{color:'red'}}>*</i>分类标签</div>}>
                <Form.Item
                  name="positionId"
                  rules={[{ required: true, message: '请选择分类' }]}
                >
                  <Select placeholder="请选择分类" showSearch optionFilterProp='children' style={{width: 200}}>
                    {
                      jobs?.map(item => {
                        return <Option key={item.jobId} value={item.jobId}>{item.jobName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label={<div><i style={{color:'red'}}>*</i>简历状态</div>}>
                <Form.Item
                  name="status"
                  rules={[{ required: true, message: '请选择简历状态' }]}
                >
                  <Select placeholder="请选择简历状态" style={{width: 200}}>
                    <Option value={2}>已下载</Option>
                    <Option value={1}>未下载</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label={<div><i style={{color:'red'}}>*</i>来源</div>}>
                <Form.Item
                  name="source"
                  rules= {[{ required: true, message: '请选择来源' }]}
                >
                  <Select placeholder="请选择来源">
                    <Option value={1}>Boss</Option>
                    <Option value={2}>拉勾</Option>
                    <Option value={3}>猎聘</Option>
                    <Option value={4}>智联</Option>
                    <Option value={7}>51job</Option>
                    <Option value={8}>其他</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label={<div><i style={{color:'red'}}>*</i>简历上传</div>} span={2}>
                <Form.Item
                  name="resumeUrl"
                  rules= {[{ required: true, message: '请上传简历' }]}
                >
                  <div>
                    <Upload {...resumeprops}>
                      <Button>
                        <UploadOutlined /> 简历上传
                      </Button>
                      <p style={{marginLeft: 10}}>{detail?.resumeUrl}</p>
                    </Upload>
                  </div>
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="详细信息" key="2">
            <Descriptions bordered>
              <Descriptions.Item label="性别">
                <Form.Item
                  name="sex"
                >
                  <Select placeholder="请选择性别">
                    <Option value={0}>保密</Option>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="手机">
                <Form.Item
                  name='phone'
                  rules={[{
                    pattern: /^1[34578]\d{9}$/,
                    message: '请输入正确的手机号码！',
                  }]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Form.Item
                  name='email'
                  rules={[{
                    pattern:  /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                    message: '请输入正确邮箱！',
                  }]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="求职意向">
                <Form.Item
                  name="jobIntention"
                >
                  <Input placeholder="请输入求职意向" />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="在职状态">
                <Form.Item
                  name="currentStatus"
                >
                  <Select placeholder="请选择在职状态">
                    <Option value="在职">在职</Option>
                    <Option value="离职">离职</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="学历">
                <Form.Item
                  name="degree"
                >
                  <Select placeholder="请选择学历">
                    <Option value={0}>未知</Option>
                    <Option value={1}>小学</Option>
                    <Option value={2}>初中</Option>
                    <Option value={3}>中专</Option>
                    <Option value={4}>高中</Option>
                    <Option value={5}>大专</Option>
                    <Option value={6}>本科</Option>
                    <Option value={7}>硕士</Option>
                    <Option value={8}>博士</Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="作品附件上传" span={3}>
                <Form.Item
                  name="worksUrl"
                >
                  <div>
                    <Upload {...workprops}>
                      <Button>
                        <UploadOutlined /> 作品附件上传
                      </Button>
                      <span style={{marginLeft: 10}}>{detail?.worksUrl}</span>
                    </Upload>
                  </div>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label={<div>工作经历</div>} span={3}>
                <p style={{textAlign: 'right'}}><Button type="primary" style={{marginRight: 10}} onClick={e => showModal('work')}>添加工作经历</Button><Button disabled={selectedWork.length === 0} onClick={e => handleDelete('work')}>删除</Button></p>
                <Table
                  rowSelection={workRowSelection}
                  rowKey={ row => row.companyName }
                  dataSource={workList}
                  columns={workcolumns}
                  pagination={false}
                  showHeader={true}
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.achievement}</p>}
                />
              </Descriptions.Item>
              <Descriptions.Item label={<div>教育经历</div>} span={3}>
                <p style={{textAlign: 'right'}}><Button type="primary" style={{marginRight: 10}} onClick={e => showModal('edu')}>添加教育经历</Button><Button disabled={selectedEdu.length === 0} onClick={e => handleDelete('edu')}>删除</Button></p>
                <Table
                  rowSelection={eduRowSelection}
                  rowKey={ row => row.schoolName }
                  dataSource={eduList}
                  columns={educolumns}
                  pagination={false}
                  showHeader={true}
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                />
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button type="primary" htmlType="submit" style={{marginRight: 20, marginTop: 20}}>
            确定
          </Button>
          <Button onClick={handleReset} >
            {
              resumeId ? '返回' : '清除'
            }
          </Button>
        </Form.Item>
      </Form>
      <Modal
        visible={modalName === 'work'}
        title="添加工作经历"
        okText="确定"
        cancelText="取消"
        onCancel={modalCancel}
        onOk={e => workForm.submit()}
      >
        <Form
          layout="vertical"
          form={workForm}
          onFinish={handleFinishForm}
        >
          <Form.Item
            label="公司"
            name="companyName"
            rules={[{ required: true, message: '请填写公司' }]}
          >
            <Input placeholder="请填写公司" />
          </Form.Item>
          <Form.Item
            label="职位"
            name="position"
            rules= {[{ required: true, message: '请填写职位' }]}
          >
            <Input placeholder="请填写职位" />
          </Form.Item>
          <Form.Item
            label="职责"
            name="achievement"
            rules={[{ required: true, message: '请填写工作职责' }]}
          >
            <TextArea rows={4} placeholder="请填写工作职责" />
          </Form.Item>

          <Form.Item
            label="工作时间"
            name="month"
            rules={[{ required: true, message: '请选择时间' }]}
          >
            <RangePicker picker="month" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={modalName === 'edu'}
        title="添加教育经历"
        okText="确定"
        cancelText="取消"
        onCancel={modalCancel}
        onOk={e => eduForm.submit()}
      >
        <Form
          layout="vertical"
          form={eduForm}
          onFinish={handleFinishForm}
        >
          <Form.Item
            label="学校"
            name="schoolName"
            rules={[{ required: true, message: '请填写学校' }]}
          >
            <Input placeholder="请填写学校" />
          </Form.Item>
          <Form.Item
            label="专业"
            name="major"
            rules={[{ required: true, message: '请填写专业' }]}
          >
            <Input placeholder="请填写专业" />
          </Form.Item>
          <Form.Item
            label="学历"
            name="degree"
            rules={[{ required: true, message: '请选择学历' }]}
          >
            <Select placeholder="请选择学历" showSearch optionFilterProp='children'>
              <Option value="未知">未知</Option>
              <Option value="小学">小学</Option>
              <Option value="初中">初中</Option>
              <Option value="中专">中专</Option>
              <Option value="高中">高中</Option>
              <Option value="大专">大专</Option>
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="工作时间"
            name="month"
            rules={[{ required: true, message: '请选择时间' }]}
          >
            <RangePicker picker="month" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}