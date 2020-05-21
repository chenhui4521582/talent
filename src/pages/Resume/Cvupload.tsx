import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Card, Upload, Row, Col, Progress, Button, notification, message, Select, Divider } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { selectJob, IJobParams, insertResume, updateDownResume } from './services/cvupload';
import { GlobalResParams } from '@/types/ITypes';

const { Dragger } = Upload;
const { Option } = Select;

export default (props) => {
  const [jobs, setJobs] = useState<IJobParams[]>();
  const [jobId, setJobId] = useState<string>(props.location.query.jobId);
  const [sourceId, setSourceId] = useState<string>(props.location.query.sourceId);
  const undownResumeId = props.location.query.undownResumeId;
  const [fileList, setFileList] = useState<any[]>([]);
  useEffect(() => {
    async function fetchJob() {
      let response: GlobalResParams<IJobParams[]> = await selectJob();
      setJobs(response.obj);
    };
    fetchJob();
  }, []);

  const handleChange = (value: string, type: string) => {
    if (type === 'job') {
      setJobId(value);
    } else {
      setSourceId(value);
    }
  };

  const customRequest = async (files) => {
    console.log(files);
    if(!jobId) {
      message.warning('请选择分类岗位');
      return false;
    }
    if(!sourceId) {
      message.warning('请选择来源');
      return false;
    }
    let res = await insertResume({
      file: files.file,
      jobId: jobId,
      source: sourceId,
      undownResumeId: undownResumeId,
    });
    let list = {
      uid: files.file.uid,
      name: files.file.name,
      status: res.status,
      amount: res.obj ? res.obj.amount : null,
      uList: res.obj ? res.obj.uList : null,
      resumeId: res.obj ? res.obj.resumeId : null,
      resume: res.obj ? res.obj.resume : null,
      percent: 100,
      uploadStatus: res.status === 200 ? '上传成功' : '上传失败（'+res.msg+'）',
      statusColor: res.status === 200 ? 'normal' : 'exception',
      response: res
    };
    setFileList([...fileList, list]);
  };

  const draggerProps = {
    name: 'file',
    multiple: true,
    action: '',
    accept:'.doc,.docx,.pdf',
    showUploadList: false,
    customRequest: customRequest,
  };

  const manualClick = () => {
    if(undownResumeId){
      history.push(`/Talent/resume/cvHandupload?undownResumeId=${undownResumeId}`);
    }else {
      history.push('/Talent/resume/cvHandupload');
    }
  };

  const checkDetail = (resumeId: number) => {
    window.open('/talent/Resume/Cvdetails?resumeId='+resumeId+'&resumeStatus=2');
  };

  const updateResume = async (item) => {
    let res: GlobalResParams<''> = await updateDownResume({
      resumeId: item.resumeId,
      resume: item.resume
    });
    let newArray = [...fileList];
    if(res.status === 200) {
      newArray.map(fileItem => {
        if (item.uid === fileItem.uid) {
          fileItem.status = 200;
          fileItem.uploadStatus = '简历更新成功';
          fileItem.statusColor = 'normal';
        }
      });
      setFileList(newArray);
      notification['success']({
        message: res.msg,
        description: '',
      });
    }else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };

  return(
    <Card title="上传简历">
      <div style={{minHeight: 500}}>
        <Row>
          <Col span={10} offset={5}>
            <Select placeholder="岗位选择" showSearch optionFilterProp='children' defaultValue={jobId} style={{ position:'absolute', zIndex:2, width: '30%', marginBottom:10 }} onChange={value => handleChange(value, 'job')}>
              {
                jobs?.map((item) => {
                  return <Option value={item.jobId} key={item.jobId}>{item.jobName}</Option>
                })
              }
            </Select>
            <Select placeholder="请选择来源" showSearch optionFilterProp='children' defaultValue={sourceId} style={{ position:'absolute', zIndex:2, width: '30%', left: '32%', marginBottom:10 }} onChange={value => handleChange(value, 'source')}>
              <Option value={1}>Boss</Option>
              <Option value={2}>拉勾</Option>
              <Option value={3}>猎聘</Option>
              <Option value={4}>智联</Option>
              <Option value={7}>51job</Option>
              <Option value={8}>其他</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={14} offset={5}>
            <div style={{height: 300}}>
              <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">将简历 Word、PDF文件拖拽至此区域</p>
                <p className="ant-upload-hint">每个文件大小5M以内</p>
                <p className="ant-upload-hint">目前支持Boss未下载（doc，docx格式），拉勾未下载和已下载（pdf格式），智联未下载和已下载（doc，docx格式），猎聘未下载和已下载（doc，docx格式），前程未下载和已下载（doc，docx格式）</p>
              </Dragger>
            </div>
            <Col span={24} offset={11}><Button type="primary" style={{marginTop:10}} onClick={manualClick}>手动添加</Button></Col>
            <div style={{maxHeight: 500,marginTop:50 }}>
              {fileList.map((item) => {
                return <div key={item.uid}>
                  <Row>
                    <Col span={7}><span>{item.name}</span></Col>
                    <Col span={14}><Progress status={item.statusColor} percent={item.percent} format={() => `${item.uploadStatus}`} /></Col>
                  </Row>
                  <Row style={{display:(item.status === 1001) ? 'block' : 'none'}}>
                    <Col>
                      <div style={{color: 'red'}}>您的简历重复上传，是否强制更新？</div>
                      <Col>
                        {
                          item.uList ? item.uList.map(item => {
                            return <div key={item.resumeId}>
                              <span style={{marginRight: 20}}>{item.userName}</span>
                              <span onClick={e => {checkDetail(item.resumeId)}}><Button type="link">点此查看</Button></span>
                            </div>
                          }) : ''
                        }
                      </Col>
                      <Button onClick={e => {checkDetail(item.resumeId)}} style={{marginRight: 20}} type="link">点此查看</Button>
                      <Button onClick={e => {updateResume(item)}} type="link">覆盖更新</Button>
                    </Col>
                  </Row>
                  <Divider />
                </div>
              })}
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  )
}