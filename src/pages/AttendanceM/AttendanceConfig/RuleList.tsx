import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { useReq } from '@/components/GlobalTable/useReq';
import { ColumnProps } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { ruleList, deleteRule } from './services/rule';
import { Card, notification, Button, Divider, Modal } from 'antd';
import { ItemTypes } from '@/pages/WFmanage/services/form';

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      align: 'center',
    },
    {
      title: '规则类型',
      dataIndex: 'clockTimeList',
      key: 'clockTimeList',
      align: 'center',
      render: (_, record) => {
        if (record.ruleType === 0) {
          return <span>固定时间上下班</span>;
        } else {
          return <span>按排班上下班</span>;
        }
      },
    },
    {
      title: '打卡时间段',
      dataIndex: 'clockTimeList',
      key: 'clockTimeList',
      align: 'center',
      render: (_, record) => {
        if (record.ruleType === 0) {
          return record?.clockTimeList?.map((item, index) => {
            let str: any[] = [];
            let timeStr: any[] = [];
            if (item.monday === 1) {
              str.push('星期一');
            }
            if (item.tuesday === 1) {
              str.push('星期二');
            }
            if (item.wednesday === 1) {
              str.push('星期三');
            }
            if (item.thursday === 1) {
              str.push('星期四');
            }
            if (item.friday === 1) {
              str.push('星期五');
            }
            if (item.saturday === 1) {
              str.push('星期六');
            }
            if (item.sunday === 1) {
              str.push('星期日');
            }
            timeStr.push(
              '上班' +
                item.clockPeriods.startTime +
                '-' +
                '下班' +
                item.clockPeriods.endTime,
            );
            return (
              <div key={index}>
                {str.join('，')}
                <br />
                {timeStr.join(',')}
              </div>
            );
          });
        } else {
          let html: any = [];
          for (let key in record?.scheduleDetail) {
            html.push(
              <div>
                <span style={{ marginRight: 20, display: 'inline-block' }}>
                  {key}
                </span>
                <span>
                  {record?.scheduleDetail[key].startTime} —{' '}
                  {record?.scheduleDetail[key].endTime}
                </span>
              </div>,
            );
          }
          return html;
        }
      },
    },
    {
      title: '手机打卡',
      dataIndex: 'enablePhoneClock',
      key: 'enablePhoneClock',
      align: 'center',
      render: (_, record) => {
        return <span>{record.enablePhoneClock ? '已开启' : '未开启'}</span>;
      },
    },
    {
      title: '打卡地点',
      dataIndex: 'rulePhone',
      key: 'rulePhone',
      align: 'center',
      render: (_, record) => {
        let wifiArr: any = [];
        let areasArr: any = [];
        record?.rulePhone?.wifis?.map(item => {
          wifiArr.push(item.wifiName + ' ' + item.wifiCode);
        });
        record?.rulePhone?.areas.map(item => {
          areasArr.push(item.areaName);
        });
        return (
          <div>
            <div>{areasArr.join(',')}</div>
            <div>{wifiArr.join(',')}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Link
              to={`/talent/attendanceconfig/addrule?ruleId=${record.ruleId}`}
            >
              编辑
            </Link>
            <Divider type="vertical" />
            <a
              onClick={() => {
                handleDelete(record);
              }}
            >
              删除
            </a>
          </>
        );
      },
    },
  ];

  const handleDelete = (record): void => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await deleteRule(record.ruleId);
        if (res.status === 200) {
          refresh();
          notification['success']({
            message: res.msg,
            description: '',
          });
        } else {
          notification['error']({
            message: res.msg,
            description: '',
          });
        }
      },
    });
  };

  const { TableContent, refresh } = useReq({
    queryMethod: ruleList,
    columns,
    rowKeyName: 'ruleId',
    cacheKey: '/attendance/rule/listRule',
  });

  return (
    <Card
      title="规则列表"
      extra={
        <div>
          <Button style={{ marginLeft: 10 }}>
            <Link to={`/talent/attendanceconfig/addrule`}>新增</Link>
          </Button>
        </div>
      }
    >
      <TableContent />
    </Card>
  );
};
