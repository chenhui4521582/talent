// 添加排班
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Divider, Select } from 'antd';
import moment from 'moment';
import { DeleteOutlined } from '@ant-design/icons';
import AddScheduling from './AddScheduling';
import '../styles/scheduling.less';

const { Option } = Select;
export default props => {
  const [visible, setVisible] = useState<boolean>(true);
  const [list, setList] = useState<any>([]);
  const ref = useRef<any>();

  useEffect(() => {}, []);

  const handleOk = () => {
    let form = ref.current.getvalue;
    console.log(form);
    form.validateFields().then(value => {
      let newList = JSON.parse(JSON.stringify(list));
      console.log(value);
      newList.push(value);
      setList(newList);
      setVisible(false);
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
            {item.clockPeriods.map(datas => {
              return (
                <>
                  {moment(datas[0]).format('HH:mm:ss') +
                    '——' +
                    moment(datas[1]).format('HH:mm:ss')}
                  <br />
                </>
              );
            })}
          </span>
          <span>
            <a>编辑</a>
            <a style={{ marginLeft: 6 }}>删除</a>
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
            setVisible(true);
          }}
        >
          添加
        </a>
      </div>
      <div className="scheduling-box-one">{renderList}</div>
      <SchedulingUser />
      <Modal
        title="添加排班"
        okText="确认"
        cancelText="取消"
        visible={visible}
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          ref.current.getvalue.re;
          setVisible(false);
        }}
      >
        <AddScheduling ref={ref} />
      </Modal>
    </>
  );
};

const SchedulingUser = () => {
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [dateList, setDateList] = useState<any[]>();
  const [yearArr, setYearArr] = useState<number[]>();
  const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    let date = new Date();
    let arr: number[] = [];

    for (let i = 0; i < 10; i++) {
      arr?.push(date.getFullYear() - i + 1);
    }
    setYearArr(arr);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }, []);

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
      console.log(arrDate);
    }

    // return d.getDate();
  }, [month, year]);

  return (
    <>
      年
      <Select
        value={year}
        onChange={e => {
          setYear(e);
        }}
      >
        {yearArr?.map(item => {
          return (
            <Option key={item} value={item}>
              {item}年
            </Option>
          );
        })}
      </Select>
      月
      <Select
        value={month}
        onChange={e => {
          setMonth(e);
        }}
      >
        {monthArr.map(item => {
          return (
            <Option key={item} value={item}>
              {item}月
            </Option>
          );
        })}
      </Select>
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
