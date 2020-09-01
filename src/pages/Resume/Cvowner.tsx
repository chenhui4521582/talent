import React, { useState, useEffect } from 'react';
import {
  Card,
  Divider,
  Modal,
  notification,
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
} from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { useTabTable } from '@/components/GlobalTable/useTabTable';
import {
  queryMyResume,
  IResumeTable,
  removeResume,
  selectDemand,
  IDemandParams,
  listResumeRecord,
  IChangeRecords,
  updateResumeStatus,
  IUpdateResume,
  addNote,
} from './services/cvowner';
import { selectJob, IJobParams } from './services/cvupload';
import { ColumnProps } from 'antd/es/table';
import {
  GlobalResParams,
  formItemLayout,
  ResumeStatus,
  eduHash,
} from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
export default props => {
  const [jobs, setJobs] = useState<IJobParams[]>();
  const [modalName, setModalName] = useState('');
  const [curRecord, setCurRecord] = useState<IResumeTable>();
  const [changeForm] = Form.useForm();
  const [noteForm] = Form.useForm();
  const [demands, setDemands] = useState<IDemandParams[]>();
  const [changeRecords, setChangeRecords] = useState<IChangeRecords[]>([]);
  const [curStatus, setCurStatus] = useState<number>();
  const [noteAction, setNoteAction] = useState<boolean>(false);
  useEffect(() => {
    async function fetchJob() {
      let response: GlobalResParams<IJobParams[]> = await selectJob();
      setJobs(response.obj);
    }
    fetchJob();
  }, []);
  const columns: ColumnProps<IResumeTable>[] = [
    {
      title: '简历编号',
      dataIndex: 'resumeId',
      key: 'resumeId',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '分类标签',
      key: 'jobLabel',
      dataIndex: 'jobLabel',
    },
    {
      title: '面试状态',
      key: 'resumeStatus',
      dataIndex: 'resumeStatus',
      render: text => {
        return <span>{ResumeStatus[text]}</span>;
      },
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
          <a onClick={e => handleClick(record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={e => handleEdit(record)}>修改</a>
          {curKey === '2' ? (
            <span>
              <Divider type="vertical" />
              <a onClick={e => handleshow(record, 'change')}>面试安排</a>
              <Divider type="vertical" />
              <a onClick={e => handleshow(record, 'record')}>记录</a>
            </span>
          ) : null}
          <Divider type="vertical" />
          <a onClick={e => handleDelete(record)}>删除</a>
          <Divider type="vertical" />
          <a
            onClick={e => {
              setNoteAction(true);
              setCurRecord(record);
              noteForm.setFieldsValue({ note: record.note });
            }}
          >
            便签
          </a>
        </span>
      ),
    },
  ];

  const { TableContent, refresh, curKey } = useTabTable({
    queryMethod: props.queryMethod ? props.queryMethod : queryMyResume,
    columns,
    paramName: 'resumeStatus',
    defaultValue: '2',
    tabData: [
      {
        name: '已下载简历',
        value: '2',
      },
      {
        name: '未下载简历',
        value: '1',
      },
    ],
    rowKeyName: 'resumeId',
    cacheKey: props.queryMethod ? '简历1' : '简历2',
  });

  const handleClick = (record: IResumeTable) => {
    // 查看简历详情
    history.push(
      `/talent/resume/print?resumeId=${record.resumeId}&resumeStatus=${record.status}`,
    );
  };
  const handleEdit = (record: IResumeTable) => {
    // 编辑简历
    history.push(
      '/talent/Resume/cvHandupload?resumeId=' +
        record.resumeId +
        '&resumeStatus=' +
        record.status,
    );
  };
  const handleshow = async (record: IResumeTable, type: string) => {
    if (type === 'change') {
      let res: GlobalResParams<IDemandParams[]> = await selectDemand();
      setDemands(res.obj);
    } else {
      let res: GlobalResParams<IChangeRecords[]> = await listResumeRecord(
        record.resumeId,
      );
      setChangeRecords(res.obj);
    }
    setCurRecord(record);
    setModalName(type);
  };

  const changeNote = () => {
    noteForm.validateFields().then(async fromSubData => {
      fromSubData.resumeId = curRecord?.resumeId;
      let res: GlobalResParams<string> = await addNote(fromSubData);
      if (res.status === 200) {
        refresh();
        modalCancel();
        setNoteAction(false);
        notification['success']({
          message: res.msg,
          description: '',
        });
      } else {
        notification['error']({
          message: res.msg,
          description: '',
        });
      }
    });
  };

  const handleDelete = (record: IResumeTable) => {
    // 删除简历
    Modal.confirm({
      title: '确认要删除简历?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await removeResume({
          resumeId: record.resumeId,
          resumeStatus: curKey,
        });
        if (res.status === 200) {
          refresh();
          notification['success']({
            message: res.msg,
            description: '',
          });
        } else {
          notification['error']({
            message: res.msg,
            description: '',
          });
        }
      },
    });
  };
  const modalCancel = () => {
    changeForm.resetFields();
    setCurRecord(undefined);
    setModalName('');
  };

  const handleChangeStatus = async () => {
    const data = changeForm.getFieldsValue();
    data.resumeId = curRecord?.resumeId;
    data.interviewTime &&
      (data.interviewTime = moment(data.interviewTime).format(
        'YYYY-MM-DD HH:mm:ss',
      ));
    let res: GlobalResParams<string> = await updateResumeStatus(
      data as IUpdateResume,
    );
    if (res.status === 200) {
      refresh();
      modalCancel();
      notification['success']({
        message: res.msg,
        description: '',
      });
    } else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };
  return (
    <Card title={props.name ? props.name : '我的简历'}>
      <TableContent>
        <div>
          <Row>
            <Col span={6}>
              <Form.Item label="岗位筛选" name="positionId">
                <Select
                  placeholder="请选择岗位"
                  showSearch
                  optionFilterProp="children"
                >
                  {jobs?.map(item => {
                    return (
                      <Option value={item.jobId} key={item.jobId}>
                        {item.jobName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="姓名" name="name">
                <Input placeholder="输入姓名" />
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="手机号码" name="phone">
                <Input placeholder="输入手机号码" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item label="学历筛选" name="degree">
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择学历"
                >
                  {Object.keys(eduHash).map(item => {
                    return (
                      <Option value={item} key={item}>
                        {eduHash[item]}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="邮箱" name="email">
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="面试状态" name="interviewStatus">
                <Select
                  placeholder="请选择面试状态"
                  showSearch
                  optionFilterProp="children"
                >
                  <Option value="1">未面试</Option>
                  <Option value="2">未通过</Option>
                  <Option value="3">已面试待入职</Option>
                  <Option value="4">未入职</Option>
                  <Option value="5">在职</Option>
                  <Option value="6">离职</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </TableContent>
      <Modal
        visible={modalName === 'change'}
        title="状态变更"
        okText="确定"
        cancelText="取消"
        onCancel={modalCancel}
        onOk={e => changeForm.submit()}
      >
        <Form
          {...formItemLayout}
          layout="vertical"
          form={changeForm}
          initialValues={{ demandId: curRecord?.demandId }}
          onFinish={handleChangeStatus}
        >
          <Form.Item
            label="招聘需求"
            name="demandId"
            rules={[{ required: true, message: '请选择招聘需求' }]}
          >
            <Select
              placeholder="请选择招聘需求"
              showSearch
              optionFilterProp="children"
            >
              {demands?.map(item => {
                return (
                  <Option value={item.demandId} key={item.demandId}>
                    {item.businessLineName}--{item.jobName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="状态变更为"
            name="status"
            rules={[{ required: true, message: '请选择变更的状态' }]}
          >
            <Select
              placeholder="请选择变更的状态"
              showSearch
              optionFilterProp="children"
              onChange={(value: number) => setCurStatus(value)}
            >
              <Option value={8}>待筛选</Option>
              <Option value={2}>待面试</Option>
              <Option value={3}>待录用</Option>
            </Select>
          </Form.Item>
          {(curStatus === 2 || curStatus === 3) && (
            <Form.Item
              label="面试时间"
              name="interviewTime"
              rules={[
                {
                  required: curStatus === 2 ? true : false,
                  message: '请选择面试时间',
                },
              ]}
            >
              <DatePicker showTime placeholder="请选择面试时间" />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        visible={modalName === 'record'}
        title="变更记录"
        okText="确定"
        cancelText="取消"
        onCancel={modalCancel}
        onOk={modalCancel}
      >
        <div>
          {changeRecords.length > 0 ? (
            changeRecords.map(item => {
              return (
                <p key={item.id}>
                  {item.createTime}：{item.description}
                </p>
              );
            })
          ) : (
            <p>暂无记录</p>
          )}
        </div>
      </Modal>
      <Modal
        visible={noteAction}
        title="我的便签"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          noteForm.resetFields();
          setCurRecord(undefined);
          setNoteAction(false);
        }}
        onOk={() => changeNote()}
      >
        <Form form={noteForm}>
          <Form.Item label="便签" name="note">
            <TextArea rows={4} placeholder="请填写标签" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
