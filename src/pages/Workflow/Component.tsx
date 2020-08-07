import React, { useState, useEffect } from 'react';
import { Input, Select, InputNumber, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import {
  useRank,
  useTitle,
  useJob,
  useLabor,
  useDepartment,
  useCost,
} from '@/models/global';
import { saveFile } from '@/services/global';
import { GlobalResParams } from '@/types/ITypes';

import OzTreeSlect from '@/pages/Framework/components/OzTreeSlect';
import DepGroup from './DepGroup';

const { Option } = Select;
const { TextArea } = Input;

export default props => {
  const { s_type, ismultiplechoice } = props;

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
      return (
        <InputNumber
          {...props}
          placeholder="请输入"
          style={{ width: '100%' }}
        />
      );
    //金额
    case 'money':
      return (
        <InputNumber
          {...props}
          placeholder="请输入"
          style={{ width: '100%' }}
        />
      );
    //日期
    case 'date':
      return (
        <DatePicker
          {...props}
          format="YYYY-MM-DD"
          placeholder="请输入"
          style={{ width: '100%' }}
        />
      );
    //日期+时间
    case 'datetime':
      return (
        <DatePicker
          {...props}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          placeholder="请选择"
          style={{ width: '100%' }}
        />
      );
    //单选框
    case 'select':
      return <SelectTemplate {...props} placeholder="请选择" />;
    //多选框
    case 'multiple':
      return <MultipleTemplate {...props} />;
    //附件上传
    case 'files':
      return <Uploads {...props} />;
    //remark 说明文字（<p><p>）
    case 'remark':
      return <TextArea {...props} style={{ width: '100%' }} />;
    //成员 user多选框
    case 'user':
      return (
        <OzTreeSlect
          renderUser={true}
          onlySelectUser={true}
          onlySelect={ismultiplechoice === 0}
          {...props}
        />
      );
    //department 部门 走组织架构
    case 'department':
    // return <OzTreeSlect onlySelect={ismultiplechoice === 0} {...props} />;
    //department 组别 走组织架构
    case 'depGroup':
      return <DepGroup onlySelect={ismultiplechoice === 0} {...props} />;
    //当前部门组
    case 'currDepGroup':
      return <Input {...props} placeholder="当前部门组" disabled={true} />;
    //业务线 business（一级）
    case 'business':
      return <BusinessTemplate {...props} placeholder="请选择" />;
    //业务线 business（二级）
    case 'business':
      return <BusinessTemplate2 {...props} placeholder="请选择" />;
    //company 劳动关系下拉
    case 'labor':
      return <LaborTemplate {...props} placeholder="请选择" />;
    // 成本中心
    case 'cost':
      return <CostTemplate {...props} placeholder="请选择" />;
    case 'currBusiness2':
      return <Input {...props} placeholder="当前部门组" disabled={true} />;
    //currUser 当前成员
    case 'currUser':
      return <Input {...props} placeholder="当前成员" disabled={true} />;
    //currDepartment 当前部门
    case 'currDepartment':
      return <Input {...props} placeholder="当前部门" disabled={true} />;
    //currBusiness 当前业务线
    case 'currBusiness':
      return <Input {...props} placeholder="当前业务线" disabled={true} />;
    //currCompany 当前公司
    case 'currCompany':
      return <Input {...props} placeholder="当前公司" disabled={true} />;
    //currDate 当前日期
    case 'currDate':
      return <Input {...props} placeholder="当前日期" disabled={true} />;
    //currDatetime 当前日期+时间
    case 'currDatetime':
      return <Input {...props} disabled={true} />;
    //当前用户工号
    case 'currJobNumber':
      return <Input {...props} disabled={true} />;
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
      return <Input {...props} />;
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

// 多选框
const MultipleTemplate = props => {
  const { list } = props;
  let data = [];
  if (Object.prototype.toString.call(list) === '[object String]') {
    data = list.split('|');
  }
  return (
    <Select
      {...props}
      placeholder="请选择"
      mode="multiple"
      style={{ width: '100%' }}
    >
      {data.map((item, index) => {
        return (
          <Option
            key={index}
            value={item + '-$-' + item}
            style={{ width: '100%' }}
          >
            {item}
          </Option>
        );
      })}
    </Select>
  );
};

// 业务线单选框(一级)
const BusinessTemplate = props => {
  const { departmentList } = useDepartment(1);
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

// 业务线单选框(二级)
const BusinessTemplate2 = props => {
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

// 成本中心
const CostTemplate = props => {
  const { costList } = useCost();
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
      {costList?.map(item => {
        return (
          <Option
            key={item.id + '-$-' + item.costCenterName}
            value={item.id + '-$-' + item.costCenterName}
          >
            {item.costCenterName}
          </Option>
        );
      })}
    </Select>
  );
};

// 劳动关系
const LaborTemplate = props => {
  const { laborList } = useLabor();
  return (
    <Select
      {...props}
      showSearch
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择劳动关系"
    >
      {laborList?.map(item => {
        return (
          <Option
            key={item.id + '-$-' + item.id}
            value={item.id + '-$-' + item.laborRelationName}
          >
            {item.laborRelationName}
          </Option>
        );
      })}
    </Select>
  );
};

interface Ilist {
  name: string;
  value: string;
}

// 上传附件
const Uploads = props => {
  const [list, setList] = useState<Ilist[]>([]);
  let newList = JSON.parse(JSON.stringify(list));
  const customRequestwork = async files => {
    const { onSuccess, onError, file, onProgress } = files;
    console.log(file);
    let res: GlobalResParams<any> = await saveFile({ file: file });
    if (res.status === 200) {
      let item: Ilist = { name: '', value: '' };
      item.name = file.uid;
      item.value = res.obj.url;
      newList.push(item);
      onSuccess();
      setList(newList);
    }
  };

  const handleRemove = e => {
    console.log(e.name);
    let newList: Ilist[] = [];
    list?.map(item => {
      if (item.name !== e.uid) {
        newList.push(item);
      }
    });
    setList(newList);
  };
  console.log(props);
  useEffect(() => {
    let valueList: string[] = [];
    console.log('list');
    console.log(list);
    list?.map(item => {
      valueList.push(item.value);
    });
    props.onChange && props.onChange(valueList.join(','));
  }, [list]);

  const onPreview = e => {
    const { uid } = e;
    list?.map(item => {
      if (item.name === uid) {
        window.open(item.value);
        return;
      }
    });
  };

  const action = {
    name: 'file',
    multiple: true,
    action: '',
    accept: '*',
    // showUploadList: false,
    customRequest: customRequestwork,
    onRemove: handleRemove,
    onPreview: onPreview,
  };
  return (
    <Upload {...action}>
      <UploadOutlined /> 上传附件
    </Upload>
  );
};
