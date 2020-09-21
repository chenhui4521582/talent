// 我的打卡
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Calendar, Badge } from 'antd';
import locale from 'antd/lib/calendar/locale/zh_CN.js';
import { listMyRecord } from './services/list';
import { GlobalResParams } from '@/types/ITypes';
import calendar from 'solarday2lunarday';
import moment from 'moment';
import './styles/myclockin.less';

// 上班打卡方式
const startMethod = {
  0: '门禁',
  1: '手机',
};

//上班状态
const startStatus = {
  0: '无效打卡',
  1: '正常',
  2: '早退',
  3: '迟到',
  4: '缺卡',
  5: '地点异常',
  6: '设备异常7加班打卡8旷工',
};

let now = new Date();
let year = now.getFullYear();
let month =
  now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
let str = year.toString() + '-' + month.toString() + '-' + day;

export default () => {
  const [record, setRecord] = useState<any>();
  const [param, setParam] = useState<string>(
    year.toString() + '-' + month.toString(),
  );
  const [selectItem, setSelectItem] = useState<any>(str);
  useEffect(() => {
    getListMyRecord(param);
  }, [param]);

  const getListMyRecord = async param => {
    let res: GlobalResParams<any> = await listMyRecord(param);
    if (res.status === 200) {
      setRecord(res.obj);
    }
  };

  const handlenumTostring = (timestamp): string => {
    let d = new Date(timestamp);
    let date =
      d.getFullYear() +
      '-' +
      (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
      '-' +
      (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
    return date;
  };

  const dateCellRender = value => {
    if (record?.currentMonthRecord && record?.currentMonthRecord?.length) {
      return record?.currentMonthRecord?.map((item, index) => {
        if (value.format('YYYY-MM-DD') === handlenumTostring(item.date)) {
          if (item.startStatus === 1) {
            return (
              <span key={index}>
                <Badge color="#87d068" />
                打卡正常
              </span>
            );
          } else if (startStatus[item.startStatus]) {
            return (
              <span key={index}>
                <Badge color="red" />
                {startStatus[item.startStatus]}
              </span>
            );
          } else {
            return (
              <span>
                <Badge color="#b8b8b8" />
                暂无数据
              </span>
            );
          }
        } else {
          return (
            <span>
              <Badge color="#b8b8b8" />
            </span>
          );
        }
      });
    } else {
      return (
        <span>
          <Badge color="#b8b8b8" />
        </span>
      );
    }
  };

  const onChange = value => {
    setParam(value.format('YYYY-MM'));
  };

  const onSelect = value => {
    setSelectItem(value.format('YYYY-MM-DD'));
  };

  const incomeDetail = timestamp => {
    let d = new Date(timestamp);
    let date =
      d.getFullYear() +
      '/' +
      (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
      '/' +
      (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
    return `星期${'日一二三四五六'.charAt(new Date(date).getDay())}`;
  };

  const renderDetail = useMemo(() => {
    if (record?.currentMonthRecord && record?.currentMonthRecord?.length) {
      return record?.currentMonthRecord.map((item, index) => {
        if (selectItem === handlenumTostring(item.date)) {
          let day: any = calendar.solar2lunar(handlenumTostring(item.date));
          return (
            <div className="myclock-bottom" key={index}>
              <div>
                <h3>{handlenumTostring(item.date)}</h3>
                <p>
                  农历{day.lunarYearCN}年{day.IMonthCn}
                  {day.IDayCn}
                </p>
                <p>{incomeDetail(item.date)}</p>
              </div>
              <div>
                <h3>{`上班时间（${record?.startDate} | ${record?.endDate}）`}</h3>
                <p>上班打卡：{item?.startDate}</p>
              </div>
              <div>
                <h3>{`上班时间（${record?.startDate} | ${record?.endDate}）`}</h3>
                <p>下班打卡：{item?.endDate}</p>
              </div>
              {/* <div>
                <h3>外出打卡</h3>
                <p>第1次打卡：10:30</p>
              </div> */}
            </div>
          );
        } else {
          return (
            <div
              className="myclock-bottom"
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              暂无数据
            </div>
          );
        }
      });
    } else {
      return (
        <div
          className="myclock-bottom"
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          暂无数据
        </div>
      );
    }
  }, [selectItem]);

  return (
    <Card title="我的打卡">
      <Calendar
        locale={locale}
        dateCellRender={dateCellRender}
        onChange={onChange}
        onSelect={onSelect}
      />
      {renderDetail}
    </Card>
  );
};
