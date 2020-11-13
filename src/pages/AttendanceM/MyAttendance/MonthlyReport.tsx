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

export default () => {
  const [selectYear, setSelectYear] = useState<number>(year);
  const [selectMonth, setSelectMonth] = useState<number>(month);
  const [detali, setDetail] = useState<any>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    getDetail();
  }, [selectMonth, selectYear]);

  const getDetail = async () => {
    let res: GlobalResParams<any> = await listMyMonthRecord(
      selectYear.toString() + '-' + selectMonth.toString(),
    );
    if (res.status === 200) {
      setDetail(res.obj);
    }

    let days = new Date(selectYear, selectMonth, 0).getDate();
    let num =
      days - res.obj?.clockStatistics?.abnormalEquipment ||
      0 - res.obj?.clockStatistics?.abnormalLocation ||
      0 - res.obj?.clockStatistics?.absent ||
      0 - res.obj?.clockStatistics?.absenteeism ||
      0 - res.obj?.clockStatistics?.later ||
      0 - res.obj?.clockStatistics?.leaveEarly ||
      0;
    const Chart = echarts.init((ref?.current as unknown) as HTMLDivElement);

    let option = {
      title: {
        text: '上下班统计次数',
        subtext: '',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      series: [
        {
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
            { value: days - num, name: '异常' },
            { value: num, name: '正常' },
          ],
        },
      ],
    };
    Chart.setOption(option as any);
  };

  const handleYearChange = value => {
    setSelectYear(value);
  };

  const handleMonthChange = value => {
    setSelectMonth(value);
  };

  const renderClockStatistics = useMemo(() => {
    let item = detali?.clockStatistics;
    return (
      <>
        <div
          style={{
            display: 'flex',
            flex: '0 0 9.5vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span
            style={{ color: item?.later || item?.later === '0' ? 'red' : '' }}
          >
            {item?.later || 0}
          </span>
          <span>迟到</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0  9.5vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              color: item?.leaveEarly || item?.leaveEarly === '0' ? 'red' : '',
            }}
          >
            {item?.leaveEarly || 0}
          </span>
          <span>早退</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0  9.5vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              color:
                item?.absenteeism || item?.absenteeism === '0' ? 'red' : '',
            }}
          >
            {item?.absenteeism || 0}{' '}
          </span>
          <span>旷工</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0  9.5vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span
            style={{ color: item?.absent || item?.absent === '0' ? 'red' : '' }}
          >
            {item?.absent || 0}{' '}
          </span>
          <span>缺卡</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0  9.5vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              color:
                item?.abnormalLocation || item?.abnormalLocation === '0'
                  ? 'red'
                  : '',
            }}
          >
            {item?.abnormalLocation || 0}{' '}
          </span>
          <span>地点异常</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0  9.5vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              color:
                item?.abnormalEquipment || item?.abnormalEquipment === '0'
                  ? 'red'
                  : '',
            }}
          >
            {item?.abnormalEquipment || 0}{' '}
          </span>
          <span>设备异常</span>
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
            flex: '1',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.workingdayOvertime || 0}</span>
          <span> 工作日加班</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '1',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.offdayOvertime || 0}</span>
          <span> 休息日加班</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '1',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span>{detali?.overtimeStatistics?.holidayOvertime || 0}</span>
          <span>节假日加班</span>
        </div>
      </>
    );
  }, [detali]);

  const renderLeaveModel = useMemo(() => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.abortionLeave || 0}</span>
          <span> 流产假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.annualLeave || 0}</span>
          <span> 年假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.bereavementLeave || 0}</span>
          <span>丧假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.breastfeedingLeave || 0}</span>
          <span>哺乳假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.businessTrip || 0}</span>
          <span>出差 </span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.goOut || 0}</span>
          <span>外出</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.makeUp || 0}</span>
          <span> 补打卡</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.maritalLeave || 0}</span>
          <span>婚假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.maternityLeave || 0}</span>
          <span>产检假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.personalLeave || 0}</span>
          <span>事假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.restLeave || 0}</span>
          <span>调休</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.sickLeave || 0}</span>
          <span>病假</span>
        </div>
        <div
          style={{
            display: 'flex',
            flex: '0 0 12vw',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <span>{detali?.leaveStatistics?.otherLeave || 0}</span>
          <span>其他</span>
        </div>
      </>
    );
  }, [detali]);

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
                flexWrap: 'wrap',
              }}
            >
              {renderClockStatistics}
            </div>
          </div>
        </div>

        <div style={{ padding: 10 }}>
          <p style={{ fontWeight: 700, color: '#000', fontSize: 18 }}>
            加班统计 · 小时
          </p>
          <div
            style={{
              border: '1px dashed #d9d9d9',
              width: '30vw',
              height: '10vh',
              display: 'flex',
            }}
          >
            {renderOvertimeStatistics}
          </div>
        </div>

        <div style={{ padding: 10 }}>
          <p style={{ fontWeight: 700, color: '#000', fontSize: 18 }}>
            假勤统计
          </p>
          <div
            style={{
              border: '1px dashed #d9d9d9',
              width: '73vw',
              minHeight: '10vh',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {renderLeaveModel}
          </div>
        </div>
      </div>
    </Card>
  );
};
