import React, { useMemo, useEffect, useState } from 'react';
import {
  Card,
  Modal,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  notification,
  Cascader,
  Button,
  Divider,
  Radio,
  Spin,
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { LoadingOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import {
  historyList,
  deleteHistory,
  tsList,
} from '@/pages/WFmanage/services/history';
import {
  categoryList,
  tsCategoryItem,
} from '@/pages/WFmanage/services/category';
import { useOrganization } from '@/models/global';
import { ColumnProps } from 'antd/es/table';
import User from './User';
import { save, getRuleList } from './services/list';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;
const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
};

interface tsListItem {
  label: string;
  value: string;
  children?: tsListItem[];
}

interface IRuleList {
  id: number;
  stepName: string;
}

let flag = true;
export default props => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: '申请单号',
      dataIndex: 'formNumber',
      key: 'formNumber',
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '工作流',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '申请人',
      dataIndex: 'applyTruename',
      key: 'applyTruename',
      align: 'center',
    },
    {
      title: '申请人部门',
      dataIndex: 'applyDepartmentName',
      key: 'applyDepartmentName',
      align: 'center',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return <span>{status[record.status]}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <a
              onClick={() => {
                window.location.href = `/talent/workflow/detail/${record.id}`;
              }}
            >
              详情
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                setSelectItem(record);
                setVisible(true);
              }}
            >
              流程干预
            </a>
          </span>
        );
      },
    },
  ];
  const { organizationJson } = useOrganization();
  const [dataList, setDataList] = useState<tsListItem[]>([]);
  const [list, setList] = useState<tsCategoryItem[]>();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<tsList>();
  const [form] = Form.useForm();
  const [type, setType] = useState<number>(1);
  const [ruleList, setRuleList] = useState<IRuleList[]>();

  useEffect(() => {
    async function getCategoryList() {
      let res: GlobalResParams<tsCategoryItem[]> = await categoryList();
      if (res.status === 200) {
        setList(res.obj);
      }
    }
    getCategoryList();
  }, []);

  useEffect(() => {
    async function getRule() {
      let res: GlobalResParams<IRuleList[]> = await getRuleList(selectItem?.id);
      if (res.status === 200) {
        setRuleList(res.obj);
      }
    }
    if (selectItem) {
      getRule();
    }
  }, [selectItem]);

  useEffect(() => {
    handleList(organizationJson);
  }, [organizationJson]);

  const handleList = data => {
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].value = list[i].code;
        list[i].label = list[i].name;
        if (list[i].level === 3) {
          delete list[i].children;
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };

    handleItem(data);
    setDataList(data);
  };

  const { TableContent, refresh } = useTable({
    queryMethod: historyList,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/taskFormListByCondition',
  });

  const handleOk = async () => {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 1500);
      let data = form.getFieldsValue();
      let response = await save(data);
      if (response.status === 200) {
        flag = true;
        notification['success']({
          message: response.msg,
          description: '',
        });
        form.setFieldsValue({
          type: 1,
          resApprStepId: undefined,
          userCode: undefined,
        });
        setVisible(false);
      } else {
        notification['error']({
          message: response.msg,
          description: '',
        });
      }
    }
  };

  return (
    <Card
      title="流程干预"
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.history.go(-1);
          }}
        >
          返回
        </Button>
      }
    >
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="开始时间" name="startDate">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="结束时间" name="endDate">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="所属部门" name="departmentCode">
              <Cascader options={dataList} placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工作流类别" name="taskType">
              <Select placeholder="请选择" allowClear>
                {list?.map((item, i) => {
                  return (
                    <Option key={i} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item label="审批状态" name="status">
              <Select placeholder="请选择" allowClear>
                <Option value="0">已撤销</Option>
                <Option value="1">审批中</Option>
                <Option value="2">已通过</Option>
                <Option value="3">已驳回</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="申请单号" name="formNumber">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="申请人" name="applicant">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="关键字" name="title">
              <Input placeholder="搜索标题" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>

      <Modal
        title="流程干预"
        okText="确定"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          form.setFieldsValue({
            type: 1,
            resApprStepId: undefined,
            userCode: undefined,
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="taskFormId"
            name="taskFormId"
            initialValue={selectItem?.id}
            style={{ display: 'none' }}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="type"
            label="选择类型"
            rules={[{ required: true, message: '请选择类型!' }]}
            initialValue={type}
          >
            <Radio.Group
              onChange={e => {
                setType(parseInt(e.target.value));
              }}
              value={type}
            >
              <Radio value={1}>转发（当前节点重新指定接收人）</Radio>
              <br />
              <Radio value={2}>跳转（跳转到审批规则的任意一个节点）</Radio>
              <br />
              <Radio value={3}>驳回（驳回此流程至发起人）</Radio>
            </Radio.Group>
          </Form.Item>

          {type === 2 ? (
            <Form.Item
              name="resApprStepId"
              label="流转规则"
              rules={[{ required: true, message: '请选择跳转节点!' }]}
            >
              <Select placeholder="请选择跳转节点" allowClear>
                {ruleList?.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.stepName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : null}
          {type === 1 ? (
            <Form.Item
              name="userCode"
              label="请选择指定人员"
              rules={[{ required: true, message: '请选择指定人员!' }]}
            >
              <User
                renderUser={true}
                onlySelectUser={true}
                onlySelect={true}
                {...props}
              />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </Card>
  );
};
