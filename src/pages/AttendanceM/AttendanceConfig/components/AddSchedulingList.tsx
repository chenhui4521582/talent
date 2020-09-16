// 添加排班
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Pagination, Select, Form } from 'antd';
import moment from 'moment';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import AddScheduling from './AddScheduling';
import { GlobalResParams } from '@/types/ITypes';
import { getScheduleDetail } from '../services/rule';
import { AutoSizer, List } from 'react-virtualized';
import '../styles/scheduling.less';

const { Option } = Select;
export default props => {
  const { userList } = props;
  const [visibleDate, setVisibleDate] = useState<boolean>(false);
  const [editType, setEditType] = useState<'edit' | 'add'>();
  const [list, setList] = useState<any>([]);
  const ref = useRef<any>();

  const handleOk = () => {
    let form = ref.current.getvalue;
    console.log(form);
    form.validateFields().then(value => {
      let newList = JSON.parse(JSON.stringify(list));
      console.log(value);
      newList.push(value);
      setList(newList);
      setEditType(undefined);
      form.resetFields();
    });
  };

  const renderList = useMemo(() => {
    console.log(list);
    return list.map((item, index) => {
      return (
        <div className="scheduling-box-one-item" key={index}>
          <span>{item.name}</span>
          <span>
            {moment(item.clockPeriods[0]).format('HH:mm:ss') +
              '——' +
              moment(item.clockPeriods[1]).format('HH:mm:ss')}
          </span>
          <span>
            <a
              onClick={() => {
                console.log(item);
                setEditType('edit');
                ref.current.getvalue.setFieldsValue(item);
              }}
            >
              编辑
            </a>
            <a
              style={{ marginLeft: 6 }}
              onClick={() => {
                let newList = JSON.parse(JSON.stringify(list));
                newList.splice(index, 1);
                setList(newList);
              }}
            >
              删除
            </a>
          </span>
        </div>
      );
    });
  }, [list]);

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        <a
          style={{ padding: '0px 12px', lineHeight: '40px' }}
          onClick={() => {
            setEditType('add');
          }}
        >
          添加
        </a>
        <a
          style={{ padding: '0px 12px', lineHeight: '40px' }}
          onClick={() => {
            setVisibleDate(true);
          }}
        >
          人员排班
        </a>
      </div>
      {list?.length ? (
        <div className="scheduling-box-one">{renderList}</div>
      ) : null}
      <Modal
        title={editType === 'edit' ? '编辑排版' : '新增排版'}
        okText="确认"
        cancelText="取消"
        visible={!!editType}
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          ref.current.getvalue.resetFields();
          setEditType(undefined);
        }}
      >
        <AddScheduling ref={ref} />
      </Modal>
      <Modal
        title="添加人员"
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '84vh', overflowY: 'auto' }}
        style={{ top: '2vh' }}
        width="94vw"
        visible={visibleDate}
        onOk={() => {
          setVisibleDate(false);
        }}
        onCancel={() => {
          setVisibleDate(false);
        }}
      >
        <SchedulingUser
          ruleId={props.ruleId}
          userList={userList()}
          list={list}
        />
      </Modal>
    </>
  );
};

let date = new Date();
const SchedulingUser = props => {
  const { ruleId, userList, list } = props;
  const [form] = Form.useForm();
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [year, setYear] = useState<number>(date.getFullYear());
  const [dateList, setDateList] = useState<any[]>();
  const [page, setPage] = useState<number>(1);
  const [values, setValues] = useState<any>();

  const getWeek = date => {
    let week;
    if (date.getDay() == 0) week = '日';
    if (date.getDay() == 1) week = '一';
    if (date.getDay() == 2) week = '二';
    if (date.getDay() == 3) week = '三';
    if (date.getDay() == 4) week = '四';
    if (date.getDay() == 5) week = '五';
    if (date.getDay() == 6) week = '六';
    return week;
  };

  useEffect(() => {
    if (year && month) {
      let d = new Date(year, month, 0);
      let days = d.getDate();
      let arrDate: any = [];
      for (let i = 0; i < days; i++) {
        let obj: any = {};
        obj.date = i + 1;
        obj.day = getWeek(new Date(year, month - 1, i + 1));
        console.log();
        arrDate.push(obj);
      }
      setDateList(arrDate);
      console.log(arrDate);
      async function getDetail() {
        let res: GlobalResParams<any> = await getScheduleDetail(
          ruleId,
          year + '-' + month,
        );
        console.log(res);
        if (res.status === 200) {
        }
      }
      getDetail();
    }
  }, [month, year]);

  const renderTableOne = useMemo(() => {
    return (
      <div className="schedul-table-one-item">
        <span style={{ width: 200, flex: '0 0 100px' }}>姓名</span>
        {dateList?.map(item => {
          return (
            <span key={item.date}>
              {item.date}
              <br />
              {item.day}
            </span>
          );
        })}
      </div>
    );
  }, [dateList]);

  const renderTableHead = useMemo(() => {
    return (
      <h3 style={{ textAlign: 'center' }}>
        <LeftOutlined
          onClick={() => {
            if (month && month - 1 === 0) {
              setMonth(12);
              setYear(year && year - 1);
            } else {
              setMonth(month && month - 1);
            }
          }}
        />
        <span style={{ padding: 4, display: 'inline-block', width: '7em' }}>
          {year}年{month}月
        </span>
        <RightOutlined
          onClick={() => {
            if (month && month + 1 === 13) {
              setMonth(1);
              setYear(year && year + 1);
            } else {
              setMonth(month && month + 1);
            }
          }}
        />
      </h3>
    );
  }, [month, year]);

  const renderUserList = useMemo(() => {
    console.log(userList);

    let arr: any = [];
    userList.map((items, indexs) => {
      if (indexs < page * 6 && indexs >= (page - 1) * 6) {
        arr.push(
          <div key={indexs} className="schedul-table-one-item">
            <span style={{ width: 200, flex: '0 0 100px' }}>{items.name}</span>
            {dateList?.map((item, index) => {
              return (
                <Form.Item
                  key={index}
                  name={month + '1' + year + item.date + '|' + items.code}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Select style={{ padding: '0 2px' }}>
                    {list.map(times => {
                      return (
                        <Option value={times.id || times.name}>
                          {times.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              );
            })}
          </div>,
        );
      }
    });
    return arr;
  }, [dateList, userList, month, year, page]);

  const handleStatisticsValue = (dataString, value) => {
    let num = 0;
    let values = form.getFieldsValue();
    console.log(values);
    for (let key in values) {
      if (key.indexOf(dataString) > -1 && values[key] === value) {
        num += 1;
      }
    }
    return num;
  };

  const renderStatistics = useMemo(() => {
    return list.map((items, indexs) => {
      return (
        <div key={indexs} className="schedul-table-one-item">
          <span style={{ width: 200, flex: '0 0 100px' }}>{items.name}</span>
          {dateList?.map((item, index) => {
            return (
              <span>
                {handleStatisticsValue(
                  month + '1' + year + item.date,
                  items.id || items.name,
                )}
              </span>
            );
          })}
        </div>
      );
    });
  }, [list, values, dateList, month, year, page]);

  return (
    <>
      {renderTableHead}
      <Form
        form={form}
        onValuesChange={value => {
          setTimeout(() => {
            setValues(value);
          }, 400);
        }}
      >
        <div className="schedul-table-one">
          {renderTableOne}
          {renderUserList}
          <Pagination
            defaultCurrent={1}
            total={userList.length}
            hideOnSinglePage
            current={page}
            pageSize={6}
            showSizeChanger={false}
            style={{ position: 'absolute', right: 0, bottom: 0 }}
            onChange={(page, pageSize) => {
              setPage(page);
              console.log(page, pageSize);
            }}
          />
        </div>
      </Form>
      <div className="schedul-table-one" style={{ marginTop: 30 }}>
        {renderStatistics}
      </div>
    </>
  );
};

// scheduleList:{
//   name:''
//   clockPeriods:[{
//     startTime:''
//     endTime:''
//    }
//   ]
//   breakTimeCalculation:休息时间是否开启
//   breakTimeStart:休息开始时间
//   breakTimeEnd:休息结束时间
//   scheduleDetailLis:[
//     {
//       time:上班日期
//       data:星期
//       value:排班
//     }
//   ]
// }
