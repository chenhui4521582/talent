import React, { useEffect } from 'react';
import {
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  TreeSelect,
} from 'antd';

import {
  useRank,
  useTitle,
  useJob,
  useCompany,
  useDepartment,
} from '@/models/global';

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default props => {
  const { s_type } = props;
  switch (s_type) {
    //单行文本
    case 'text':
      return <Input {...props} />;
    //多行文本
    case 'areatext':
      return <TextArea {...props} />;
    //数字
    case 'number':
      return <InputNumber {...props} />;
    //金额
    case 'money':
      return <InputNumber {...props} />;
    //日期
    case 'date':
      return <DatePicker {...props} />;
    //日期+时间
    case 'datetime':
      return <DatePicker showTime {...props} />;
    //单选框
    case 'select':
      return <SelectTemplate {...props} />;
    //多选框
    case 'multiple':
      return <MultipleTemplate {...props} />;
    //附件上传
    case 'files':
      return <Upload {...props} />;
    //remark 说明文字（<p><p>）
    case 'remark':
      return <TextArea {...props} />;
    //成员 user多选框
    case 'user':
      return <UserTemplate {...props} />;
    //department 部门 走组织架构
    case 'department':
      return <DepartmentTemplate {...props} />;
    //业务线 business
    case 'business':
      return <BusinessTemplate {...props} />;
    //company 公司
    case 'company':
      return <CompanyTemplate {...props} />;
    //currUser 当前成员
    case 'currUser':
      return <Input {...props} placeholder="当前成员" readOnly />;
    //currDepartment 当前部门
    case 'currDepartment':
      return <Input {...props} placeholder="当前部门" readOnly />;
    //currBusiness 当前业务线
    case 'currBusiness':
      return <Input {...props} placeholder="当前业务线" readOnly />;
    //currCompany 当前公司
    case 'currCompany':
      return <Input {...props} placeholder="当前公司" readOnly />;
    //currDate 当前日期
    case 'currDate':
      return <Input {...props} placeholder="当前日期" readOnly />;
    //currDatetime 当前日期+时间
    case 'currDatetime':
      return <Input {...props} placeholder="当前日期+时间" readOnly />;
    //position 职位
    case 'position':
      return <PositionTemplate {...props} />;
    //job 岗位
    case 'job':
      return <JobTemplate {...props} />;
    //title 标题
    case 'title':
      return <Input {...props} placeholder="标题" readOnly />;
    //formNumber 申请单号
    case 'formNumber':
      return <Input {...props} placeholder="申请单号" readOnly />;
    //positionLevel 职级
    case 'positionLevel':
      return <LevelTemplate {...props} />;
    //wkTask 关联流程
    case 'wkTask':
      return <Input {...props} placeholder="关联流程" readOnly />;

    default:
      return <></>;
  }
};

// 单选框
const SelectTemplate = props => {
  const { list, changSubData, id } = props;
  let data = [];
  if (Object.prototype.toString.call(list) === '[object String]') {
    data = list.split('|');
  }
  return (
    <Select
      placeholder="请选择"
      style={{ width: '100%' }}
      onSelect={e => {
        changSubData(id, e);
      }}
    >
      {data.map((item, index) => {
        return (
          <Option key={index} value={item}>
            {item}
          </Option>
        );
      })}
    </Select>
  );
};

// 业务线单选框
const BusinessTemplate = props => {
  const { departmentList } = useDepartment(1);
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      defaultValue="请选择职位"
    >
      {departmentList?.map(item => {
        return (
          <Option key={item.code} value={item.code}>
            {item.name}
          </Option>
        );
      })}
    </Select>
  );
};

// 公司单选框
const CompanyTemplate = props => {
  const { companyList } = useCompany();
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      defaultValue="请选择职位"
    >
      {companyList?.map(item => {
        return (
          <Option key={item.companyId} value={item.companyId}>
            {item.companyName}
          </Option>
        );
      })}
    </Select>
  );
};
// 公司职位单选框  useTitle
const PositionTemplate = props => {
  const { titleList } = useTitle();
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      defaultValue="请选择职位"
    >
      {titleList?.map(item => {
        return (
          <Option key={item.titleId} value={item.titleId}>
            {item.titleName}
          </Option>
        );
      })}
    </Select>
  );
};

// 岗位单选框
const JobTemplate = props => {
  const { jobList } = useJob();
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      defaultValue="请选择岗位"
    >
      {jobList?.map(item => {
        return (
          <Option key={item.jobId} value={item.jobId}>
            {item.jobName}
          </Option>
        );
      })}
    </Select>
  );
};

// 职级下拉框
const LevelTemplate = props => {
  const { rankList } = useRank();
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      defaultValue="请选择职级"
    >
      {rankList?.map(item => {
        return (
          <Option key={item.rankId} value={item.rankId}>
            {item.rankName}
          </Option>
        );
      })}
    </Select>
  );
};

// 多选框
const MultipleTemplate = props => {
  return (
    <TreeSelect placeholder="Please select 我是多选框">
      <TreeNode value="parent 1" title="parent 1">
        <TreeNode value="parent 1-0" title="parent 1-0">
          <TreeNode value="leaf1" title="my leaf" />
          <TreeNode value="leaf2" title="your leaf" />
        </TreeNode>
        <TreeNode value="parent 1-1" title="parent 1-1">
          <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
        </TreeNode>
      </TreeNode>
    </TreeSelect>
  );
};

// 成员多选组织架构
const UserTemplate = peops => {
  return (
    <TreeSelect placeholder="Please select 我是成员">
      <TreeNode value="parent 1" title="parent 1">
        <TreeNode value="parent 1-0" title="parent 1-0">
          <TreeNode value="leaf1" title="my leaf" />
          <TreeNode value="leaf2" title="your leaf" />
        </TreeNode>
        <TreeNode value="parent 1-1" title="parent 1-1">
          <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
        </TreeNode>
      </TreeNode>
    </TreeSelect>
  );
};

// department 部门多选组织架构
const DepartmentTemplate = props => {
  return (
    <TreeSelect placeholder="Please select 我是部门组织架构">
      <TreeNode value="parent 1" title="parent 1">
        <TreeNode value="parent 1-0" title="parent 1-0">
          <TreeNode value="leaf1" title="my leaf" />
          <TreeNode value="leaf2" title="your leaf" />
        </TreeNode>
        <TreeNode value="parent 1-1" title="parent 1-1">
          <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
        </TreeNode>
      </TreeNode>
    </TreeSelect>
  );
};

// 人员， 组织架构  关联流程 （部门 走组织架构）
