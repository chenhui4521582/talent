// 我的打卡
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Calendar, Badge, Tooltip } from 'antd';
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
  '-1': '未打卡',
  0: '无效打卡',
  1: '正常',
  2: '早退',
  3: '迟到',
  4: '缺卡',
  5: '地点异常',
  6: '设备异常',
  7: '加班打卡',
  8: '旷工',
  9: '补卡',
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
  const [selectItem, setSelectItem] = useState<any>();
  useEffect(() => {
    getListMyRecord(param);
  }, [param]);

  const getListMyRecord = async param => {
    let res: GlobalResParams<any> = await listMyRecord(param);
    if (res.status === 200) {
      setRecord(res.obj);
      setSelectItem(str);
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
    let html: any = (
      <span>
        <Badge color="#b8b8b8" />
      </span>
    );
    if (record?.currentMonthRecord && record?.currentMonthRecord?.length) {
      record?.currentMonthRecord?.map((item, index) => {
        if (value.format('YYYY-MM-DD') === handlenumTostring(item.date)) {
          if (
            (item.startStatus == 1 ||
              item.startStatus == 7 ||
              item.startStatus == 9) &&
            (item.endStatus == 1 || item.endStatus == 7 || item.endStatus == 9)
          ) {
            html = (
              <span key={index}>
                <Badge color="#87d068" />
                打卡正常
              </span>
            );
          } else if (item.endStatus == '-1' || item.startStatus == '-1') {
            html = (
              <span key={index}>
                <Badge color="red" />
                未打卡
              </span>
            );
          } else if (!item.startStatus && !item.endStatus) {
            html = (
              <span>
                <Badge color="#b8b8b8" />
                暂无当天打卡信息
              </span>
            );
          } else {
            html = (
              <span key={index}>
                <Badge color="red" />
                {startStatus[item.startStatus]}/{startStatus[item.endStatus]}
              </span>
            );
          }
        }
      });
    } else {
      html = (
        <span>
          <Badge color="#b8b8b8" />
        </span>
      );
    }
    return html;
  };

  const onChange = value => {
    setParam(value.format('YYYY-MM'));
  };

  const onSelect = value => {
    // alert(value.format('YYYY-MM-DD'))
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
    let HTML = (
      <div
        className="myclock-bottom"
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        暂无数据
      </div>
    );
    if (record?.currentMonthRecord && record?.currentMonthRecord?.length) {
      record?.currentMonthRecord.map((item: any, index) => {
        if (selectItem === handlenumTostring(item.date)) {
          let day: any = calendar.solar2lunar(handlenumTostring(item.date));
          let length = item?.outCLockRecords?.length;
          HTML = (
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
                <h3>{`上班打卡时间（${item?.startDate || '未打卡'}）`}</h3>
                <p>{startStatus[item.startStatus]}</p>
              </div>
              <div>
                <h3>{`下班打卡时间（ ${item?.endDate || '未打卡'}）`}</h3>
                <p>{startStatus[item.endStatus]}</p>
              </div>
              <div style={{}}>
                <h3>外出打卡</h3>
                {length > 3 ? (
                  <Tooltip
                    placement="left"
                    title={item?.outCLockRecords?.map(
                      (outCLockRecordsItem, outCLockRecordsIndex) => {
                        return (
                          <p>
                            <span>{outCLockRecordsItem.area}</span>
                            <span style={{ marginLeft: 5 }}>
                              {moment(outCLockRecordsItem.clockTime).format(
                                'HH:MM',
                              )}
                            </span>
                          </p>
                        );
                      },
                    )}
                  >
                    {item?.outCLockRecords?.map(
                      (outCLockRecordsItem, outCLockRecordsIndex) => {
                        if (outCLockRecordsIndex < 3) {
                          return (
                            <p>
                              <span>{outCLockRecordsItem.area}</span>
                              <span style={{ marginLeft: 5 }}>
                                {moment(outCLockRecordsItem.clockTime).format(
                                  'HH:MM',
                                )}
                              </span>
                            </p>
                          );
                        }
                      },
                    )}
                  </Tooltip>
                ) : (
                  <div>
                    {item?.outCLockRecords?.map(
                      (outCLockRecordsItem, outCLockRecordsIndex) => {
                        return (
                          <p>
                            <span>{outCLockRecordsItem.area}</span>
                            <span style={{ marginLeft: 5 }}>
                              {moment(outCLockRecordsItem.clockTime).format(
                                'HH:MM',
                              )}
                            </span>
                          </p>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }
      });
    }
    return HTML;
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
