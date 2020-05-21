import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Row, Card, Col, Button, Divider, Table } from 'antd';
import { GlobalResParams } from '@/types/ITypes';
import {
  getResumeDetail, IResumeDetail
} from './services/cvhand';
import { DownloadOutlined } from '@ant-design/icons';

export default (props) => {
  const resumeId = props.location.query.resumeId;
  const resumeStatus = props.location.query.resumeStatus;
  const [detail, setDetail] = useState<IResumeDetail>();
  useEffect(() => {
    async function fetchResumeDetail() {
      let res: GlobalResParams<IResumeDetail> = await getResumeDetail(resumeId, resumeStatus);
      setDetail(res.obj);
    }
    fetchResumeDetail();
  }, []);
  const handleClick = () => {
    history.push('/talent/feedback/itvdetails?resumeId=' + resumeId);
  };
  const columns = [
    {
      title: '日期',
      key: 'interviewDate',
      dataIndex: 'interviewDate'
    },
    {
      title: '职位',
      dataIndex: 'jobName',
      key: 'jobName',
    },
    {
      title: '面试官',
      key: 'interviewer',
      dataIndex: 'interviewer'
    },
    {
      title: '结果',
      key: 'result',
      dataIndex: 'result'
    },
    {
      title: '上传人',
      key: 'heir',
      dataIndex: 'heir'
    }
  ];
  return(
    <Card title="简历详情">
      <Row>
        <Col span={10}>
          <span>{detail?.name ? detail.name : '***'}</span>
        </Col>
        <Col span={3}>
          <Button type="link">简历编号：{detail?.resumeId ? detail.resumeId : '***'}</Button>
        </Col>
        <Col span={4} offset={6}>
          <Button type="primary" icon={<DownloadOutlined />} download href={detail?.resumeUrl}>下载简历</Button>
          <Button type="primary" icon={<DownloadOutlined />} download href={detail?.worksUrl} style={{marginLeft: 20,display: detail?.worksUrl ? 'block' : 'none'}}>作品下载</Button>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={2}>
          <span>在职状态：{detail?.currentStatus}</span>
          <Divider type="vertical" />
        </Col>
        <Col span={6}>
          <span>求职意向：{detail?.jobIntention ? detail.jobIntention : '***' }</span>
        </Col>
        <Divider type="vertical" />
        <Col span={3}>
          <span>手机：{detail?.phone ? detail.phone : '***'}</span>
          <Divider type="vertical" />
        </Col>
        <Col span={3}>
          <span>邮箱：{detail?.email ? detail.email : '***'}</span>
        </Col>
      </Row>
      <Divider />
      <Row style={{marginBottom:40}}>
        <Col style={{fontWeight:'bold'}}>工作经历</Col>
        <Divider />
        <Row>
          {
            detail?.workExp ? detail.workExp.map((item,i) => {
              return <div key={i} style={{marginBottom: 20}}>
                <Row><Col span={5} style={{fontWeight: 'bold'}}>{item.companyName}</Col><Col span={4} offset={11}>{item.beginDate}-{item.endDate}</Col></Row>
                <Row><Col span={3}><p>{item.position}</p></Col></Row>
                <Row><Col>{item.achievement}</Col></Row>
              </div>
            }) : ''
          }
        </Row>
      </Row>
      <Row style={{marginBottom:40}}>
        <Col style={{fontWeight:'bold'}}>教育经历</Col>
        <Divider />
        {
          detail?.eduExp ? detail.eduExp.map((item,i) => {
            return <div key={i}>
              <Row><Col span={3}>{item.schoolName}</Col><Col span={3}>{item.major}</Col><Col span={3}>{item.degree}</Col><Col span={3} offset={6}>{item.beginDate}-{item.endDate}</Col></Row>
            </div>
          }) : ''
        }
      </Row>
      <Row style={{display:(detail?.feedbackList && detail.feedbackList.length > 0) ? 'block' : 'none'}}>
        <Col style={{fontWeight:'bold'}}>
          面试情况
        </Col>
        <Divider />
        <Col>
          <Table
            onRow={(record) => {    //行点击事件
              return{
                onClick: handleClick
              }
            }}
            rowKey={ row => row.resumeId }
            columns={columns}
            dataSource={detail?.feedbackList}
            pagination={false}
          />
        </Col>
      </Row>
    </Card>
  )
}