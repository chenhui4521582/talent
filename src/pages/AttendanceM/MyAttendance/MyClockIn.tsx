// 我的打卡
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Calendar } from 'antd';
import locale from 'antd/lib/calendar/locale/zh_CN.js';
import { listMyRecord, IListMyRecord } from './services/list';
import { GlobalResParams } from '@/types/ITypes';
import './styles/myclockin.less';

export default () => {
  useEffect(() => {
    getListMyRecord();
  }, []);

  const getListMyRecord = async () => {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let res: GlobalResParams<IListMyRecord> = await listMyRecord(
      year.toString() + '-' + month.toString(),
    );
    console.log(res);
  };

  const dateCellRender = value => {
    // console.log(value.date())
    return 1;
  };

  const monthCellRender = value => {
    // console.log(value.month())
    return 2;
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <Card title="我的打卡">
      <Calendar
        locale={locale}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        onPanelChange={onPanelChange}
      />
      <div className="myclock-bottom">
        <div>
          <h3>2020年8月20日</h3>
          <p>农历七月初二</p>
          <p>星期四</p>
        </div>
        <div>
          <h3>上班（09:00|18::00）</h3>
          <p>上班打卡： 08:35</p>
        </div>
        <div>
          <h3>下班（09:00|18::00）</h3>
          <p>下班打卡： 08:35</p>
        </div>
        <div>
          <h3>外出打卡</h3>
          <p>第1次打卡：10:30</p>
        </div>
      </div>
    </Card>
  );
};
