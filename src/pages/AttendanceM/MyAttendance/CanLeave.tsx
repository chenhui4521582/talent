// 可休假
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'antd';
import { listMyHoliday } from './services/list';
import { GlobalResParams } from '@/types/ITypes';
import echarts from 'echarts';

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
  const ref = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    let res: GlobalResParams<any> = await listMyHoliday();
    console.log(ref);
    const Chart = echarts.init((ref?.current as unknown) as HTMLDivElement);
    Chart.setOption(option as any);
    const Chart1 = echarts.init((ref1?.current as unknown) as HTMLDivElement);
    Chart1.setOption(option as any);
  };

  return (
    <Card title="我的可休假">
      <div style={{ padding: 20, border: '1px solid #d9d9d9', marginTop: 20 }}>
        <div style={{ display: 'flex' }}>
          <div
            style={{ width: '40vw', height: '40vh', display: 'flex' }}
            ref={ref}
          />
          <div style={{ marginTop: 20, marginLeft: 40 }}>
            <p>年假明细（天）</p>
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

        <div style={{ display: 'flex' }}>
          <div
            style={{ width: '40vw', height: '40vh', display: 'flex' }}
            ref={ref1}
          />
          <div style={{ marginTop: 20, marginLeft: 40 }}>
            <p>加班调休明细（小时）</p>
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
      </div>
    </Card>
  );
};
