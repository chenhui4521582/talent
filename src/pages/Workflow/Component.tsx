import React from 'react';
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

import OzTreeSlect from '@/pages/Framework/components/OzTreeSlect';

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default props => {
  const { s_type } = props;

  switch (s_type) {
    //单行文本
    case 'text':
      return <Input {...props} placeholder="请输入" />;
    //多行文本
    case 'areatext':
      return (
        <TextArea {...props} placeholder="请输入" style={{ width: '100%' }} />
      );
    //数字
    case 'number':
      return <InputNumber {...props} placeholder="请输入" />;
    //金额
    case 'money':
      return <InputNumber {...props} placeholder="请输入" />;
    //日期
    case 'date':
      return <DatePicker {...props} placeholder="请输入" />;
    //日期+时间
    case 'datetime':
      return <DatePicker {...props} showTime placeholder="请选择" />;
    //单选框
    case 'select':
      return <SelectTemplate {...props} placeholder="请选择" />;
    //多选框
    case 'multiple':
      return <MultipleTemplate {...props} />;
    //附件上传
    case 'files':
      return <Upload {...props} />;
    //remark 说明文字（<p><p>）
    case 'remark':
      return <TextArea {...props} style={{ width: '100%' }} />;
    //成员 user多选框
    case 'user':
      return (
        <OzTreeSlect
          renderUser={true}
          onlySelectUser={true}
          // onlySelect={true}
          {...props}
        />
      );
    //department 部门 走组织架构
    case 'department':
      return <OzTreeSlect onlySelect={true} {...props} />;
    //业务线 business
    case 'business':
      return <BusinessTemplate {...props} placeholder="请选择" />;
    //company 公司
    case 'company':
      return <CompanyTemplate {...props} placeholder="请选择" />;
    //currUser 当前成员
    case 'currUser':
      return <Input {...props} placeholder="当前成员" />;
    //currDepartment 当前部门
    case 'currDepartment':
      return <Input {...props} placeholder="当前部门" />;
    //currBusiness 当前业务线
    case 'currBusiness':
      return <Input {...props} placeholder="当前业务线" />;
    //currCompany 当前公司
    case 'currCompany':
      return <Input {...props} placeholder="当前公司" />;
    //currDate 当前日期
    case 'currDate':
      return <Input {...props} placeholder="当前日期" />;
    //currDatetime 当前日期+时间
    case 'currDatetime':
      return <Input {...props} placeholder="当前日期+时间" />;
    //position 职位
    case 'position':
      return <PositionTemplate {...props} placeholder="请选择" />;
    //job 岗位
    case 'job':
      return <JobTemplate {...props} placeholder="请选择" />;
    //title 标题
    case 'title':
      return <Input {...props} placeholder="标题" />;
    //formNumber 申请单号
    case 'formNumber':
      return <Input {...props} placeholder="申请单号" />;
    //positionLevel 职级
    case 'positionLevel':
      return <LevelTemplate {...props} placeholder="请选择" />;
    //wkTask 关联流程
    case 'wkTask':
      return <Input placeholder="关联流程" {...props} />;

    default:
      return <></>;
  }
};

// 单选框
const SelectTemplate = props => {
  const { list } = props;
  let data = [];
  if (Object.prototype.toString.call(list) === '[object String]') {
    data = list.split('|');
  }
  console.log(props.disabled);
  return (
    <Select {...props} placeholder="请选择" style={{ width: '100%' }}>
      {data.map((item, index) => {
        return (
          <Option key={index} value={item + '-$-' + item}>
            {item}
          </Option>
        );
      })}
    </Select>
  );
};

// 业务线单选框
const BusinessTemplate = props => {
  const { departmentList } = useDepartment(2);
  return (
    <Select
      {...props}
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择业务线"
    >
      {departmentList?.map(item => {
        return (
          <Option
            key={item.code + '-$-' + item.name}
            value={item.code + '-$-' + item.name}
          >
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
      {...props}
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择公司"
    >
      {companyList?.map(item => {
        return (
          <Option
            key={item.companyId + '-$-' + item.companyName}
            value={item.companyId + '-$-' + item.companyName}
          >
            {item.companyName}
          </Option>
        );
      })}
    </Select>
  );
};

// 职位单选框  useTitle
const PositionTemplate = props => {
  const { titleList } = useTitle();
  return (
    <Select
      {...props}
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择公司职位"
    >
      {titleList?.map(item => {
        return (
          <Option
            key={item.titleId + '-$-' + item.titleName}
            value={item.titleId + '-$-' + item.titleId}
          >
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
      {...props}
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择岗位"
    >
      {jobList?.map(item => {
        return (
          <Option
            key={item.jobId + '-$-' + item.jobName}
            value={item.jobId + '-$-' + item.jobName}
          >
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
      {...props}
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择职级"
    >
      {rankList?.map(item => {
        return (
          <Option
            key={item.rankId + '-$-' + item.rankName}
            value={item.rankId + '-$-' + item.rankName}
          >
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
