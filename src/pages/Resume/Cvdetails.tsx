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

  const work_columns = [
    {
      title: '公司名',
      key: 'companyName',
      dataIndex: 'companyName'
    },
    {
      title: '时间',
      dataIndex: 'beginDate',
      key: 'beginDate',
      render: (text, record) => {
        return <span>{text}-{record.endDate}</span>
      }
    },
    {
      title: '职位',
      key: 'position',
      dataIndex: 'position'
    },
    {
      title: '工作内容',
      key: 'achievement',
      dataIndex: 'achievement'
    }
  ];

  const edu_columns = [
    {
      title: '学校名',
      key: 'schoolName',
      dataIndex: 'schoolName'
    },
    {
      title: '时间',
      dataIndex: 'beginDate',
      key: 'beginDate',
      render: (text, record) => {
        return <span>{text}-{record.endDate}</span>
      }
    },
    {
      title: '专业',
      key: 'major',
      dataIndex: 'major'
    },
    {
      title: '学历',
      key: 'degree',
      dataIndex: 'degree'
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
        <Col span={12}>
          <span>在职状态：{detail?.currentStatus}</span>
        </Col>
        <Col span={12}>
          <span>求职意向：{detail?.jobIntention ? detail.jobIntention : '***' }</span>
        </Col>
      </Row>
      <Row style={{marginTop: 20}}>
        <Col span={12}>
          <span>手机：{detail?.phone ? detail.phone : '***'}</span>
        </Col>
        <Col span={12}>
          <span>邮箱：{detail?.email ? detail.email : '***'}</span>
        </Col>
      </Row>
      <Divider />
      <h3 style={{marginTop: 40}}>工作经历</h3>
      <Divider />
      <Table
        rowKey='id'
        columns={work_columns}
        dataSource={detail?.workExp}
        pagination={false}
      />
      <h3 style={{marginTop: 40}}>教育经历</h3>
      <Divider />
      <Table
        rowKey='id'
        columns={edu_columns}
        dataSource={detail?.eduExp}
        pagination={false}
      />
      <div style={{display:(detail?.feedbackList && detail.feedbackList.length > 0) ? 'block' : 'none'}}>
        <h3 style={{marginTop: 40}}>面试情况</h3>
        <Divider />
        <Table
          onRow={() => {    //行点击事件
            return{
              onClick: handleClick
            }
          }}
          rowKey={ row => row.resumeId }
          columns={columns}
          dataSource={detail?.feedbackList}
          pagination={false}
        />
      </div>
    </Card>
  )
}