// 可休假
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from 'antd';
import { listMyHoliday } from './services/list';
import { GlobalResParams } from '@/types/ITypes';
import echarts from 'echarts';

export default () => {
  const [detali, setDetail] = useState<any>();
  const ref = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    let res: GlobalResParams<any> = await listMyHoliday();
    if (res.status === 200) {
      setDetail(res.obj);
    }

    const option1 = {
      title: {
        text: '年假统计',
        subtext: '',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
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
            {
              name: '当前剩余天数',
              value: res.obj?.annualLeaveStatistics?.currentLeft || 0,
            },
            {
              name: '当前法定年假',
              value: res.obj?.annualLeaveStatistics?.currentStatutory || 0,
            },
            {
              name: '今年已休天数',
              value: res.obj?.annualLeaveStatistics?.currentUsed || 0,
            },
            {
              name: '当前福利年假',
              value: res.obj?.annualLeaveStatistics?.currentWelfare || 0,
            },
            {
              name: '当前年假天数',
              value: res.obj?.annualLeaveStatistics?.currentYearTotal || 0,
            },
            {
              name: '上年度剩余天数',
              value: res.obj?.annualLeaveStatistics?.lastYear || 0,
            },
          ],
        },
      ],
    };

    const option2 = {
      title: {
        text: '调休统计',
        subtext: '',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
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
            {
              name: '当前可调休时长',
              value: res.obj?.overtimeStatistics?.avaliableOvertime || 0,
            },
            {
              name: '有效加班时长',
              value: res.obj?.overtimeStatistics?.effectOvertime || 0,
            },
            {
              name: '过期加班时长',
              value: res.obj?.overtimeStatistics?.expiredOvertime || 0,
            },
            {
              name: '节假日加班',
              value: res.obj?.overtimeStatistics?.holidayOvertime || 0,
            },
            {
              name: '休息日加班 ',
              value: res.obj?.overtimeStatistics?.offdayOvertime || 0,
            },
            {
              name: '已用调休时长',
              value: res.obj?.overtimeStatistics?.usedOvertime || 0,
            },
            {
              name: '工作日加班',
              value: res.obj?.overtimeStatistics?.workingdayOvertime || 0,
            },
          ],
        },
      ],
    };

    const Chart = echarts.init((ref?.current as unknown) as HTMLDivElement);
    Chart.setOption(option1 as any);
    const Chart1 = echarts.init((ref1?.current as unknown) as HTMLDivElement);
    Chart1.setOption(option2 as any);
  };

  const renderAnnualLeaveStatistics = useMemo(() => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.annualLeaveStatistics?.currentLeft || 0}</span>
          <span> 当前剩余天数</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.annualLeaveStatistics?.currentStatutory || 0}</span>
          <span> 当前法定年假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.annualLeaveStatistics?.currentUsed || 0}</span>
          <span>今年已休天数 </span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.annualLeaveStatistics?.currentWelfare || 0}</span>
          <span>当前福利年假 </span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.annualLeaveStatistics?.currentYearTotal || 0}</span>
          <span>当前年假天数</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.annualLeaveStatistics?.lastYear || 0}</span>
          <span>上年度剩余天数</span>
        </div>
      </>
    );
  }, [detali]);

  const renderOvertimeStatistics = useMemo(() => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.avaliableOvertime || 0}</span>
          <span> 有效加班时长</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.effectOvertime || 0}</span>
          <span> 有效加班时长</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.expiredOvertime || 0}</span>
          <span>过期加班时长 </span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.holidayOvertime || 0}</span>
          <span>节假日加班 </span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.offdayOvertime || 0}</span>
          <span>休息日加班</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.usedOvertime || 0}</span>
          <span>已用调休时长</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 10vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.workingdayOvertime || 0}</span>
          <span>工作日加班</span>
        </div>
      </>
    );
  }, [detali]);

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
                width: '31vw',
                height: '30vh',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {renderAnnualLeaveStatistics}
            </div>
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
                width: '31vw',
                height: '30vh',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {renderOvertimeStatistics}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
