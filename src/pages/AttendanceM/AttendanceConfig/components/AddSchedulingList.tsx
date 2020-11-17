// 添加排班
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Modal, Pagination, Select, Form } from 'antd';
import moment from 'moment';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import AddScheduling from './AddScheduling';
import { GlobalResParams } from '@/types/ITypes';
import { getScheduleDetail } from '../services/rule';

import '../styles/scheduling.less';

const { Option } = Select;
export default props => {
  const { userList, scheduleList, ruleId } = props;
  const [visibleDate, setVisibleDate] = useState<boolean>(false);
  const [editType, setEditType] = useState<'edit' | 'add'>();
  const [list, setList] = useState<any>([]);
  const [detail, setDetail] = useState<any>();
  const [index, setIndex] = useState<number>();
  const ref = useRef<any>();
  const formRef = useRef<any>();
  const [restType, setRestType] = useState<number>(0);
  useEffect(() => {
    list && list.length && props.onChange({ list: list, detail: detail });
  }, [list, detail]);

  useEffect(() => {
    let newList = JSON.parse(JSON.stringify(list || []));
    scheduleList?.map(item => {
      let obj: any = {};
      obj.name = item.name;
      obj.scheduleId = item.scheduleId;
      obj.clockPeriods = [
        item?.clockPeriods?.startTime
          ? moment('2019-02-13 ' + item?.clockPeriods?.startTime + ':00')
          : undefined,
        item?.clockPeriods?.endTime
          ? moment('2019-02-13 ' + item?.clockPeriods?.endTime + ':00')
          : undefined,
      ];
      obj.flex = {
        flexible: item.flexible,
        leaveEarly: item.leaveEarly,
        leaveLater: item.leaveLater,
      };
      obj.rest = {
        breakTimeCalculation: item.breakTimeCalculation,
        'breakTimeStart-breakTimeEnd': [
          item.breakTimeStart
            ? moment('2019-02-13 ' + item.breakTimeStart + ':00')
            : undefined,
          item.breakTimeEnd
            ? moment('2019-02-13 ' + item.breakTimeEnd + ':00')
            : undefined,
        ],
      };

      obj.itemList = {
        endLimit: item.endLimit,
        startLimit: item.startLimit,
      };
      newList.push(obj);
    });
    setList(newList);
  }, [scheduleList]);

  const handleDetailOk = () => {
    let value = formRef.current.value;
    console.log(value);
    setDetail(value);
    setVisibleDate(false);
  };

  const handleOk = () => {
    let form = ref.current.getvalue;
    let newList = Object.assign([], list);
    form.validateFields().then(value => {
      if (editType === 'add') {
        newList.push(value);
      } else {
        if (index || index === 0) {
          newList.splice(index, 1, value);
        }
      }

      setList(newList);
      setEditType(undefined);
      setIndex(undefined);
      // form.resetFields();
    });
  };

  const renderList = useMemo(() => {
    return list.map((item, indexs) => {
      return (
        <div className="scheduling-box-one-item" key={indexs}>
          <span>{item.name}</span>
          <span>
            {moment(item.clockPeriods[0]).format('HH:mm') +
              ' —— ' +
              moment(item.clockPeriods[1]).format('HH:mm')}
          </span>
          <span>
            <a
              onClick={() => {
                setEditType('edit');
                setTimeout(() => {
                  setIndex(indexs);
                  setRestType(item.rest.breakTimeCalculation);

                  ref.current?.getvalue?.setFieldsValue(item);
                }, 200);
              }}
            >
              编辑
            </a>
            <a
              style={{ marginLeft: 6 }}
              onClick={() => {
                let newList = Object.assign([], list);
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
        {list && list.length ? (
          <a
            style={{ padding: '0px 12px', lineHeight: '40px' }}
            onClick={() => {
              setVisibleDate(true);
            }}
          >
            人员排班
          </a>
        ) : null}
      </div>
      {list?.length ? (
        <div className="scheduling-box-one">{renderList}</div>
      ) : null}
      <Modal
        title={editType === 'edit' ? '编辑排版' : '新增排版'}
        okText="确认"
        cancelText="取消"
        visible={!!editType}
        width="34vw"
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          setTimeout(() => {
            ref.current.getvalue.resetFields();
          }, 200);
          setRestType(1);
          setEditType(undefined);
        }}
      >
        <AddScheduling ref={ref} propsType={restType} />
      </Modal>
      <Modal
        title="人员排班"
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '84vh', overflowY: 'auto' }}
        style={{ top: '2vh' }}
        width="94vw"
        visible={visibleDate}
        onOk={handleDetailOk}
        onCancel={() => {
          // formRef.current?.getvalue?.resetFields();
          setVisibleDate(false);
        }}
      >
        <SchedulingUser
          // key={!!visibleDate+'1'}
          ruleId={ruleId}
          userList={userList()}
          list={list}
          ref={formRef}
        />
      </Modal>
    </>
  );
};

let date = new Date();
const SchedulingUser = forwardRef((props: any, formRef) => {
  const { ruleId, userList, list } = props;
  const [form] = Form.useForm();
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [year, setYear] = useState<number>(date.getFullYear());
  const [dateList, setDateList] = useState<any[]>();
  const [page, setPage] = useState<number>(1);
  const [values, setValues] = useState<any>();
  const [userDetail, setUserDetail] = useState<any>({});
  const [ownUserList, setOwnUserList] = useState<any[]>();
  const [allValue, setAllValue] = useState<any>({});

  useImperativeHandle(formRef, () => {
    return {
      value: allValue,
    };
  });

  useEffect(() => {
    if (year && month) {
      let d = new Date(year, month, 0);
      let days = d.getDate();
      let arrDate: any = [];
      for (let i = 0; i < days; i++) {
        let obj: any = {};
        obj.date = i + 1;
        obj.day = getWeek(new Date(year, month - 1, i + 1));
        arrDate.push(obj);
      }
      setDateList(arrDate);
      async function getDetail() {
        let res: GlobalResParams<any> = await getScheduleDetail(
          ruleId,
          year + '-' + month,
        );
        if (res.status === 200) {
          setUserDetail(res.obj);
        }
      }
      getDetail();
    }
  }, [month, year]);

  useEffect(() => {
    let newUserList: any = [];
    let obj: any = {};
    for (let key in userDetail) {
      newUserList.push({
        code: key.split(',')[0],
        name: key.split(',')[1],
      });

      userDetail[key].map(item => {
        list.map(listItem => {
          if (listItem.scheduleId === item.valueId) {
            obj[item.data + '|' + item.time + '|' + key.split(',')[0]] =
              listItem.name;
          }
        });
      });
    }
    let newVlaue = JSON.parse(JSON.stringify(allValue));
    let newAllValue = Object.assign(newVlaue, obj);
    setAllValue(newAllValue);
    form.setFieldsValue(obj);
    setValues(obj);
    userList?.map(item => {
      if (!item.key) {
        item.key = item.code;
      }
      if (!item.name) {
        item.name = item.title;
      }
      if (!item.title) {
        item.title = item.name;
      }
      newUserList.push(item);
    });

    let result: any = [];
    let obj1: any = {};
    for (let i = 0; i < newUserList.length; i++) {
      if (!obj1[newUserList[i].key]) {
        result.push(newUserList[i]);
        obj1[newUserList[i].code] = true;
      }
    }
    console.log(result);
    newUserList = result;

    setOwnUserList([...new Set(newUserList)]);
  }, [userDetail, list, userList]);

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

  const handleStatisticsValue = (dataString, value) => {
    let num = 0;
    // let values = form.getFieldsValue();
    for (let key in values) {
      if (key.indexOf(dataString) > -1 && values[key] === value) {
        num += 1;
      }
    }
    return num;
  };

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
    let arr: any = [];
    let newUserList = ownUserList || [];
    newUserList?.map((items, indexs) => {
      if (indexs < page * 6 && indexs >= (page - 1) * 6) {
        arr.push(
          <div key={indexs} className="schedul-table-one-item">
            <span style={{ width: 200, flex: '0 0 100px' }}>{items.name}</span>
            {dateList?.map((item, index) => {
              return (
                <Form.Item
                  key={index}
                  name={
                    item.day +
                    '|' +
                    (year < 10 ? '0' + year : year) +
                    '-' +
                    (month < 10 ? '0' + month : month) +
                    '-' +
                    (item.date < 10 ? '0' + item.date : item.date) +
                    '|' +
                    items.code
                  }
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Select style={{ padding: '0 2px' }} allowClear>
                    {list.map(times => {
                      return <Option value={times.name}>{times.name}</Option>;
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
  }, [dateList, userList, month, year, page, ownUserList]);

  const renderStatistics = useMemo(() => {
    return list.map((items, indexs) => {
      return (
        <div key={indexs} className="schedul-table-one-item">
          <span style={{ width: 200, flex: '0 0 100px' }}>{items.name}</span>
          {dateList?.map((item, index) => {
            return (
              <span>
                {handleStatisticsValue(
                  item.day +
                    '|' +
                    (year < 10 ? '0' + year : year) +
                    '-' +
                    (month < 10 ? '0' + month : month) +
                    '-' +
                    (item.date < 10 ? '0' + item.date : item.date),
                  items.name,
                )}
              </span>
            );
          })}
        </div>
      );
    });
  }, [list, values, dateList, month, year, page, userDetail]);

  return (
    <div style={{ width: '2400px' }}>
      {renderTableHead}
      <Form
        form={form}
        onValuesChange={value => {
          let newVlaue = JSON.parse(JSON.stringify(allValue));
          let newAllValue = Object.assign(newVlaue, form.getFieldsValue());
          setAllValue(newAllValue);
          setTimeout(() => {
            setValues(form.getFieldsValue());
          }, 400);
        }}
      >
        <div className="schedul-table-one">
          {renderTableOne}
          {renderUserList}
          <Pagination
            defaultCurrent={1}
            total={ownUserList?.length || 0}
            hideOnSinglePage
            current={page}
            pageSize={6}
            showSizeChanger={false}
            style={{ position: 'absolute', right: 0, bottom: 0 }}
            onChange={(page, pageSize) => {
              setPage(page);
            }}
          />
        </div>
      </Form>
      <div className="schedul-table-one" style={{ marginTop: 30 }}>
        {renderStatistics}
      </div>
    </div>
  );
});
