// 打卡月报
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Select } from 'antd';
import { listMyMonthRecord } from './services/list';
import { GlobalResParams } from '@/types/ITypes';
import echarts from 'echarts';

const { Option } = Select;
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth() + 1;
let monthArr: number[] = [];
let yearArr: number[] = [];
for (let i = 0; i < 4; i++) {
  yearArr.push(year - i);
}

for (let i = 0; i < 12; i++) {
  monthArr.push(i + 1);
}

const option = {
  title: {
    text: '上下班统计次数',
    subtext: '',
    left: 'left',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '60%'],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
    },
  ],
};

export default () => {
  const [selectYear, setSelectYear] = useState<number>(year);
  const [selectMonth, setSelectMonth] = useState<number>(month);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    getDetail();
  }, [selectMonth, selectYear]);

  const getDetail = async () => {
    let res: GlobalResParams<any> = await listMyMonthRecord(
      selectYear.toString() + '-' + month.toString(),
    );
    console.log(ref);
    const Chart = echarts.init((ref?.current as unknown) as HTMLDivElement);
    Chart.setOption(option as any);
  };

  const handleYearChange = value => {
    console.log(value);
    setSelectYear(value);
  };

  const handleMonthChange = value => {
    console.log(value);
    setSelectMonth(value);
  };

  return (
    <Card title="打卡月报">
      <Select
        style={{ width: 140, marginRight: 20 }}
        defaultValue={year}
        onChange={handleYearChange}
      >
        {yearArr.map(item => {
          return (
            <Option key={item} value={item}>
              {item}年
            </Option>
          );
        })}
      </Select>
      <Select
        style={{ width: 140 }}
        defaultValue={month}
        onChange={handleMonthChange}
      >
        {monthArr.map(item => {
          return (
            <Option key={item} value={item}>
              {item}月
            </Option>
          );
        })}
      </Select>

      <div style={{ padding: 20, border: '1px solid #d9d9d9', marginTop: 20 }}>
        <div style={{ display: 'flex' }}>
          <div
            style={{ width: '40vw', height: '40vh', display: 'flex' }}
            ref={ref}
          />
          <div style={{ marginTop: 20, marginLeft: 40 }}>
            <p>打卡异常明细</p>
            <div
              style={{
                border: '1px dashed #d9d9d9',
                width: '30vw',
                height: '30vh',
                display: 'flex',
              }}
            ></div>
          </div>
        </div>

        <div style={{ padding: 10 }}>
          <p style={{ fontWeight: 700, color: '#000', fontSize: 18 }}>
            加班统计 · 分钟
          </p>
          <div
            style={{
              border: '1px dashed #d9d9d9',
              width: '30vw',
              height: '10vh',
            }}
          ></div>
        </div>

        <div style={{ padding: 10 }}>
          <p style={{ fontWeight: 700, color: '#000', fontSize: 18 }}>
            假勤统计
          </p>
          <div
            style={{
              border: '1px dashed #d9d9d9',
              width: '74vw',
              height: '10vh',
            }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
