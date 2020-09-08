// 我的打卡
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Calendar } from 'antd';
import locale from 'antd/lib/calendar/locale/zh_CN.js';
import { listMyRecord, IListMyRecord } from './services/list';
import { GlobalResParams } from '@/types/ITypes';

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
    console.log(new Date(value.format('YYYY-MM-DD')).getTime(), mode);
  };

  return (
    <Card title="我的打卡">
      <Calendar
        locale={locale}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        onPanelChange={onPanelChange}
      />
    </Card>
  );
};
