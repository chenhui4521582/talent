import React, { useState, useEffect } from 'react';
import {
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  Modal,
  Row,
  Col,
  Form,
  Tooltip,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTable } from '@/components/GlobalTable/useTable';
import { Link } from 'umi';
import {
  categoryList,
  tsCategoryItem,
} from '@/pages/WFmanage/services/category';
import { ColumnProps } from 'antd/es/table';
import {
  useRankP,
  useRankM,
  useTitle,
  useJob,
  useLabor,
  useDepartment,
  useCost,
} from '@/models/global';
import { saveFile } from '@/services/global';
import { GlobalResParams } from '@/types/ITypes';
import { myListPageWt, tsList } from './services/home';
import { listHoliday, getAddSignTyp } from './services/detail';
import OzTreeSlect from '@/pages/Framework/components/OzTreeSlect';
import DepGroup from './DepGroup';

const { Option } = Select;
const { TextArea } = Input;

const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
  '4': '已归档',
};

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
          format="YYYY-MM-DD HH:mm"
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
    case 'business2':
      return <BusinessTemplate2 {...props} placeholder="请选择" />;
    //company 劳动关系下拉
    case 'labor':
      return <LaborTemplate {...props} placeholder="请选择" />;
    // 成本中心
    case 'cost':
      return <CostTemplate {...props} placeholder="请选择" />;
    case 'currBusiness2':
      return (
        <BusinessTemplate2 {...props} placeholder="请选择" disabled={true} />
      );
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
    case 'positionMLevel':
      return <LevelMTemplate {...props} placeholder="请选择" />;
    //wkTask 关联流程
    case 'wkTask':
      return <WkTask {...props} />;
    // 请假/销假类型 vacationType
    case 'vacationType':
      return <VacationType {...props} />;
    // 请假/销假开始时间 vacationStartTime
    case 'vacationStartTime':
      return <VacationStartTime {...props} />;
    // 请假/销假结束时间 vacationEndTime
    case 'vacationEndTime':
      return <VacationEndTime {...props} />;
    // 请假共计时长 totalVacationTime
    case 'totalVacationTime':
      return <TotalVacationTime {...props} />;
    //销假共计时长 totalReVacationTime
    case 'totalReVacationTime':
      return <TotalReVacationTime {...props} />;
    // 控件名称="overTimeStart", 加班开始时间
    case 'overTimeStart':
      return <OverTimeStart {...props} />;
    // 控件名称="overTimeEnd", 加班结束时间
    case 'overTimeEnd':
      return <OverTimeEnd {...props} />;
    // 控件名称="overTimeTotal", 加班共计时长
    case 'overTimeTotal':
      return <OverTimeTotal {...props} />;
    // 控件名称="remainCardNumber" 当月打卡次数
    case 'remainCardNumber':
      return <RemainCardNumber {...props} />;
    // 控件名称="outCheckStartTime", 出差/外出打卡开始时间
    case 'outCheckStartTime':
      return <OutCheckStartTime {...props} />;
    // 控件名称="outCheckEndTime", 出差/外出打卡结束时间
    case 'outCheckEndTime':
      return <OutCheckEndTime {...props} />;
    // 控件名称="outcheckTime", 出差/外出共计时长
    case 'outCheckTime':
      return <OutcheckTime {...props} />;
    //控件名称="vacationTime", 可休年假时长
    case 'vacationTime':
      return <VacationTime {...props} />;
    // 补卡类型
    case 'addSignType':
      return <AddSignType {...props} />;

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
    <Select
      {...props}
      allowClear
      placeholder="请选择"
      style={{ width: '100%' }}
    >
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
      allowClear
      placeholder="请选择"
      mode="multiple"
      style={{ width: '100%', minWidth: '14vw' }}
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
      allowClear
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
      allowClear
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
      allowClear
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
      allowClear
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

// 职级下拉框技术职级
const LevelTemplate = props => {
  const { rankList } = useRankP();
  return (
    <Select
      {...props}
      allowClear
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

// 职级下拉框技术职级
const LevelMTemplate = props => {
  const { rankList } = useRankM();
  return (
    <Select
      {...props}
      allowClear
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
      allowClear
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
      allowClear
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
  url: string;
  size: number;
  uid: string;
  type: string;
}

// 上传附件
const Uploads = props => {
  const [fileList, setFileList] = useState<Ilist[]>([]);

  useEffect(() => {
    if (props.fileLists && props.fileLists.length) {
      let lists: Ilist[] = [];
      props.fileLists.map(item => {
        lists.push({
          name: item.fileName + ' (文件大小' + getfilesize(item.fileSize) + ')',
          url: item.fileUrl,
          size: item.fileSize,
          uid: item.id,
          type: item.fileExtname,
        });
      });
      setFileList(lists);
    }
  }, [props.fileLists]);
  useEffect(() => {
    if (fileList?.length) {
      let newList = JSON.parse(JSON.stringify(fileList));
      newList.map((item, index) => {
        item.name = item.name.split(' (文件大小')[0];
      });
      props.onChange && props.onChange(newList);
    }
  }, [fileList]);

  const customRequestwork = async files => {
    const { onSuccess, onError, file } = files;
    if (file.size / 1024 / 1024 < 20) {
      let res: GlobalResParams<any> = await saveFile({ file: file });
      if (res.status === 200) {
        file.url = res.obj.url;
        fileList.push({
          name: file.name + ' (文件大小' + getfilesize(file.size) + ')',
          url: file.url,
          size: file.size,
          uid: file.uid,
          type: file.name.split('.')[file.name.split('.').length - 1],
        });
        setFileList([...fileList]);
        onSuccess();
      } else {
        message.error(res.msg);
        onError();
      }
    } else {
      message.warning('单个文件大小需要小于20M！');
    }
  };

  const onPreview = e => {
    fileList.map(item => {
      if (e.uid === item.uid) {
        window.open(item.url + '?filename=' + item.name.split('(文件大小')[0]);
      }
    });
  };

  const action = {
    name: 'file',
    multiple: true,
    action: '',
    accept: '*',
    customRequest: customRequestwork,
    onPreview: onPreview,
    onRemove: e => {
      let newList = JSON.parse(JSON.stringify(fileList));
      newList.map((item, index) => {
        if (e.uid === item.uid) {
          newList.splice(index, 1);
        }
      });
      setFileList(newList);
    },
    fileList: fileList,
  };

  function getfilesize(size) {
    if (!size) return '';

    var num = 1024.0; //byte

    if (size < num) return size + 'B';
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + 'K'; //kb
    if (size < Math.pow(num, 3))
      return (size / Math.pow(num, 2)).toFixed(2) + 'M'; //M
    if (size < Math.pow(num, 4))
      return (size / Math.pow(num, 3)).toFixed(2) + 'G'; //G
    return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
  }
  return (
    <Upload {...action} disabled={props.disabled}>
      {props.disabled === 0 ? (
        <>
          <UploadOutlined /> 上传附件(单个文件不大于20M)
        </>
      ) : (
        '附件上传'
      )}
    </Upload>
  );
};

// 关联流程
const WkTask = props => {
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<tsCategoryItem[]>();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    async function getCategoryList() {
      let res: GlobalResParams<tsCategoryItem[]> = await categoryList();
      if (res.status === 200) {
        setList(res.obj);
      }
    }
    getCategoryList();
  }, []);
  const columns: ColumnProps<tsList>[] = [
    {
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record: tsList) => <span>{status[record.status]}</span>,
    },
    {
      title: '未操作者',
      dataIndex: 'dealUser',
      key: 'dealUser',
      align: 'center',
      width: '15vw',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
  ];

  const {
    TableContent,
    refresh,
    selectKeys,
    allList,
    selectedRowKeys,
  } = useTable({
    queryMethod: myListPageWt,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/listMyFormPageWkTask',
    showCheck: true,
    noClearKey: true,
  });

  const handleOk = () => {
    let nameArr: any[] = [];
    selectKeys.map(item => {
      allList.map(itemObj => {
        if (itemObj.id === item) {
          nameArr.push(itemObj.title);
        }
      });
    });
    setValue(nameArr.join(','));
    setVisible(false);
  };

  useEffect(() => {
    if (props.item?.value) {
      let arr: number[] = [];
      props.item?.value.split(',').map(item => {
        arr.push(parseInt(item));
      });
      selectedRowKeys(arr);
    }
    if (props.item?.showValue) {
      setValue(props.item?.showValue);
    }
  }, [props.item]);

  useEffect(() => {
    props.onChange && props.onChange(selectKeys.join(',') + '-$-' + value);
  }, [value]);

  return (
    <>
      {value ? (
        <Tooltip
          title={() => {
            return value?.split(',').map(item => {
              return <p>{item}</p>;
            });
          }}
        >
          <Input
            readOnly={true}
            disabled={props.disabled}
            placeholder="关联流程"
            onClick={() => {
              setVisible(true);
            }}
            value={value}
          />
        </Tooltip>
      ) : (
        <Input
          readOnly={true}
          disabled={props.disabled}
          placeholder="关联流程"
          onClick={() => {
            setVisible(true);
          }}
          value={value}
        />
      )}
      <Modal
        title="关联流程"
        visible={visible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleOk}
        width="50vw"
      >
        <TableContent>
          <Row>
            <Col span={6}>
              <Form.Item label="开始时间" name="createTimeStart">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请选择"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="结束时间" name="createTimeEnd">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请选择"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="工作流类别" name="categoryId">
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
            <Col span={6}>
              <Form.Item label="申请单号" name="formNumber">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="申请人" name="createUserName">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="关键字" name="title">
                <Input placeholder="搜索标题" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </TableContent>
      </Modal>
    </>
  );
};

// 请假/销假类型 vacationType
const VacationType = props => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    async function getList() {
      let res: GlobalResParams<any[]> = await listHoliday();
      if (res.status === 200) {
        setList(res.obj);
      }
    }
    getList();
  }, []);

  return (
    <Select
      style={{ width: '100%', minWidth: '14vw' }}
      placeholder="请选择类型"
      {...props}
    >
      {list?.map((item, index) => {
        return (
          <Select key={index} value={item.typeId + '-$-' + item.name}>
            {item.name}
          </Select>
        );
      })}
    </Select>
  );
};

// 请假/销假开始时间 vacationStartTime
const VacationStartTime = props => {
  return (
    <DatePicker
      {...props}
      format="YYYY-MM-DD HH:mm"
      showTime
      placeholder="请选择销假开始时间"
      style={{ width: '100%' }}
    />
  );
};

// 请假/销假结束时间 vacationEndTime
const VacationEndTime = props => {
  return (
    <DatePicker
      {...props}
      format="YYYY-MM-DD HH:mm"
      showTime
      placeholder="请选择销假结束时间"
      style={{ width: '100%' }}
    />
  );
};

// 请假共计时长 totalVacationTime
const TotalVacationTime = props => {
  // 需要调接口
  return <Input {...props} placeholder="请假共计时长" disabled={true} />;
};

//销假共计时长 totalReVacationTime
const TotalReVacationTime = props => {
  // 需要调接口
  return <Input {...props} placeholder="销假共计时长" disabled={true} />;
};

// 控件名称="overTimeStart", 加班开始时间
const OverTimeStart = props => {
  return (
    <DatePicker
      {...props}
      format="YYYY-MM-DD HH:mm"
      showTime
      placeholder="请选择加班开始时间"
      style={{ width: '100%' }}
    />
  );
};

// 控件名称="overTimeEnd", 加班结束时间
const OverTimeEnd = props => {
  return (
    <DatePicker
      {...props}
      format="YYYY-MM-DD HH:mm"
      showTime
      placeholder="请选择加班开始结束"
      style={{ width: '100%' }}
    />
  );
};

// 控件名称="overTimeTotal", 加班共计时长
const OverTimeTotal = props => {
  return <Input {...props} placeholder="销假共计时长" disabled={true} />;
};

// 控件名称="remainCardNumber" 当月剩余补卡次数
const RemainCardNumber = props => {
  return <Input {...props} placeholder="当月剩余补卡次数" disabled={true} />;
};

// 控件名称="outCheckStartTime", 出差/外出打卡开始时间
const OutCheckStartTime = props => {
  return (
    <DatePicker
      {...props}
      format="YYYY-MM-DD HH:mm"
      showTime
      placeholder="请选择"
      style={{ width: '100%' }}
    />
  );
};

// 控件名称="outCheckEndTime", 出差/外出打卡结束时间
const OutCheckEndTime = props => {
  return (
    <DatePicker
      {...props}
      format="YYYY-MM-DD HH:mm"
      showTime
      placeholder="请选择"
      style={{ width: '100%' }}
    />
  );
};

// 控件名称="outcheckTime", 出差/外出共计时长
const OutcheckTime = props => {
  return <Input {...props} placeholder="共计时长" disabled={true} />;
};

//控件名称="vacationTime", 可休年假时长
const VacationTime = props => {
  return <Input {...props} placeholder="可休年假时长" disabled={true} />;
};

// 不卡类型
const AddSignType = props => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    async function getList() {
      let res: GlobalResParams<any[]> = await getAddSignTyp();
      if (res.status === 200) {
        setList(res.obj);
      }
    }
    getList();
  }, []);

  return (
    <Select
      placeholder="请选择类型"
      {...props}
      style={{ width: '100%', minWidth: '14vw' }}
    >
      {list?.map((item, index) => {
        return (
          <Select key={index} value={item.code + '-$-' + item.desc}>
            {item.desc}
          </Select>
        );
      })}
    </Select>
  );
};
