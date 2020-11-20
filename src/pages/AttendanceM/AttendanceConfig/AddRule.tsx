//新增规则
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Radio,
  Checkbox,
  notification,
  Divider,
  Spin,
} from 'antd';
import { Map, Marker, Circle } from 'react-amap';
import moment from 'moment';
import AddUserList from './components/AddUserList';

import AddSchedulingList from './components/AddSchedulingList';
import { GlobalResParams } from '@/types/ITypes';
import { getRuleDetail } from './services/rule';
import DailyAttendance from './components/DailyAttendance';
import AreasList from './components/AreasList';
import Wifi from './components/Wifi';
import { saveRule, updateRule } from './services/rule';

// 部门 人员
interface IMemberList {
  code: string;
  type: string;
  codeName: string;
}

// 打卡时间
interface IClockTimeList {
  monday: 0 | 1;
  tuesday: 0 | 1;
  wednesday: 0 | 1;
  thursday: 0 | 1;
  friday: 0 | 1;
  saturday: 0 | 1;
  sunday: 0 | 1;
  clockPeriods: {
    endTime: string;
    startTime: string;
    periodId?: string;
  };
  breakTimeCalculation: 0 | 1;
  breakTimeStart: string;
  breakTimeEnd: string;
  flexible: 0 | 1;
  leaveEarly: number;
  leaveLater: number;
  startLimit: 1 | 2 | 3 | 4 | 5;
  endLimit: 1 | 2 | 3 | 4 | 5;
}

const { Option } = Select;
export default props => {
  const [form] = Form.useForm();
  const { ruleId } = props.location.query;
  const [ruleDetail, setRuleDetail] = useState<any>();
  const [userList, setUserList] = useState<any>([]);
  const [timeList, setTimeList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [ruleType, setRuleType] = useState<0 | 1>(0);
  const [phoneClock, setPhoneClock] = useState<0 | 1>(0);

  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await getRuleDetail(ruleId);
      if (res.status === 200) {
        setRuleDetail(res.obj);
        setRuleType(res.obj.ruleType);
        setPhoneClock(res.obj.enablePhoneClock);

        form.setFieldsValue({
          ruleName: res.obj.ruleName,
          ruleType: res.obj.ruleType,
          enablePhoneClock: [res.obj.enablePhoneClock],
          effectiveTime: res.obj.effectiveTime,
          clockOutOfRange: res.obj?.rulePhone?.clockOutOfRange,
          phoneTips: {
            goWorkRemind: res.obj?.rulePhone?.goWorkRemind,
            offWorkRemind: res.obj?.rulePhone?.offWorkRemind,
          },
        });
      }
    }
    if (ruleId) {
      getDetail();
    }
  }, []);

  const handleChangeUserList = list => {
    setUserList(list);
  };

  const submit = () => {
    form.validateFields().then(async data => {
      setLoading(true);
      let ruleName = data.ruleName;
      let ruleType = data.ruleType;

      // 打卡人员
      let memberList: IMemberList[] = [];
      memberList = data.memberList;

      //打卡时间
      let clockTimeList: IClockTimeList[] = [];
      data.clockTimeList?.map(item => {
        let clockTimeListObj: IMemberList | any = {};
        let day = item.day;
        if (item.clockTimeId) {
          clockTimeListObj.clockTimeId = item.clockTimeId;
        }
        clockTimeListObj['monday'] = day.indexOf('monday') > -1 ? 1 : 0;
        clockTimeListObj['tuesday'] = day.indexOf('tuesday') > -1 ? 1 : 0;
        clockTimeListObj['wednesday'] = day.indexOf('wednesday') > -1 ? 1 : 0;
        clockTimeListObj['thursday'] = day.indexOf('thursday') > -1 ? 1 : 0;
        clockTimeListObj['friday'] = day.indexOf('friday') > -1 ? 1 : 0;
        clockTimeListObj['saturday'] = day.indexOf('saturday') > -1 ? 1 : 0;
        clockTimeListObj['sunday'] = day.indexOf('sunday') > -1 ? 1 : 0;
        clockTimeListObj.clockPeriods = {
          startTime: moment(item.clockPeriods[0]).format('HH:mm'),
          endTime: moment(item.clockPeriods[1]).format('HH:mm'),
        };
        clockTimeListObj.breakTimeCalculation = item.rest.breakTimeCalculation;
        if (item.rest.breakTimeCalculation === 1) {
          clockTimeListObj.breakTimeStart = '';
          clockTimeListObj.breakTimeEnd = '';
        } else {
          clockTimeListObj.breakTimeStart = moment(
            item.rest['breakTimeStart-breakTimeEnd'][0],
          ).format('HH:mm');
          clockTimeListObj.breakTimeEnd = moment(
            item.rest['breakTimeStart-breakTimeEnd'][1],
          ).format('HH:mm');
        }

        clockTimeListObj.flexible = item.flex.flexible;
        clockTimeListObj.leaveEarly = item.flex.leaveEarly;
        clockTimeListObj.leaveLater = item.flex.leaveLater;
        clockTimeListObj.startLimit = item.itemList.startLimit;
        clockTimeListObj.endLimit = item.itemList.endLimit;
        clockTimeList.push(clockTimeListObj);
      });
      // 排班
      let scheduleList: any = [];

      data.scheduleList?.list?.map(item => {
        let scheduleListObj: any = {};
        (scheduleListObj.name = item.name),
          (scheduleListObj.clockPeriods = {
            startTime: moment(item.clockPeriods[0]).format('HH:mm'),
            endTime: moment(item.clockPeriods[1]).format('HH:mm'),
          });
        scheduleListObj.breakTimeCalculation = item.rest.breakTimeCalculation;
        if (item.rest.breakTimeCalculation === 1) {
          scheduleListObj.breakTimeStart = '';
          scheduleListObj.breakTimeEnd = '';
        } else {
          scheduleListObj.breakTimeStart = moment(
            item.rest['breakTimeStart-breakTimeEnd'][0],
          ).format('HH:mm');
          scheduleListObj.breakTimeEnd = moment(
            item.rest['breakTimeStart-breakTimeEnd'][1],
          ).format('HH:mm');
        }

        scheduleListObj.flexible = item.flex.flexible;
        scheduleListObj.leaveEarly = item.flex.leaveEarly;
        scheduleListObj.leaveLater = item.flex.leaveLater;
        scheduleListObj.startLimit = item.itemList.startLimit;
        scheduleListObj.endLimit = item.itemList.endLimit;
        item.scheduleId ? (scheduleListObj.scheduleId = item.scheduleId) : '';

        scheduleList.push(scheduleListObj);
      });
      // 人员排班
      let scheduleDetailList: any = {};
      if (data.scheduleList?.detail) {
        let scheduleDetailObj: any = {};
        for (let key in data.scheduleList?.detail) {
          if (data.scheduleList?.detail[key]) {
            if (!scheduleDetailObj[key.split('|')[2]]) {
              scheduleDetailObj[key.split('|')[2]] = [];
              scheduleDetailObj[key.split('|')[2]].push({
                time: key.split('|')[1],
                data: key.split('|')[0],
                value: data.scheduleList?.detail[key],
              });
            } else {
              scheduleDetailObj[key.split('|')[2]].push({
                time: key.split('|')[1],
                data: key.split('|')[0],
                value: data.scheduleList?.detail[key],
              });
            }
          }
        }
        scheduleDetailList = scheduleDetailObj;
      }
      let scheduleMonth: any[] = [];
      let month: string[] = [];
      for (let key in scheduleDetailList) {
        let list = scheduleDetailList[key];
        list.map(item => {
          month.push(item.time.substr(0, 7));
        });
      }
      month = [...new Set(month)];
      month?.map(item => {
        let scheduleMonthObj: any = {};
        scheduleMonthObj.month = item;
        scheduleMonthObj.scheduleDetailList = {};
        for (let key in scheduleDetailList) {
          let arr: any = [];
          scheduleDetailList[key].map(itemData => {
            if (itemData.time.indexOf(item) > -1) {
              arr.push(itemData);
            }
          });
          let result: any = [];
          let obj1: any = [];
          for (let i = 0; i < arr.length; i++) {
            if (obj1.indexOf(arr[i].time) === -1) {
              result.push(arr[i]);
              obj1.push(arr[i].time);
            }
          }
          scheduleMonthObj.scheduleDetailList[key] = [...new Set(result)];
        }
        scheduleMonth.push(scheduleMonthObj);
      });

      //位置
      let areas: any = [];
      data.areas?.map(item => {
        areas.push({
          areaName: item.areaName,
          range: item.range,
          lon: item.lng,
          lat: item.lat,
        });
      });
      //wifi
      let wifis: any = [];
      data.wifis?.map(item => {
        let wifisObj: any = {};
        wifisObj.wifiName = item.wifiName;
        wifisObj.wifiCode = Object.values(item.wifiCode).join(':');
        wifis.push(wifisObj);
      });
      // 手机打卡
      let enablePhoneClock =
        (data.enablePhoneClock && data.enablePhoneClock[0]) || 0;
      // 手机生效
      let effectiveTime = data.effectiveTime;

      let subdata: any;
      if (ruleType === 1) {
        if (phoneClock) {
          subdata = {
            ruleName,
            ruleType,
            enablePhoneClock: enablePhoneClock,
            effectiveTime,
            scheduleList,
            scheduleMonth,
            rulePhone: {
              areas,
              wifis,
              clockOutOfRange: data.clockOutOfRange,
              goWorkRemind: data.phoneTips.goWorkRemind,
              offWorkRemind: data.phoneTips.offWorkRemind,
            },
            memberList,
          };
        } else {
          subdata = {
            ruleName,
            ruleType,
            enablePhoneClock: enablePhoneClock,
            effectiveTime,
            scheduleList,
            scheduleMonth,
            memberList,
          };
        }
      } else {
        if (phoneClock) {
          subdata = {
            ruleName,
            ruleType,
            clockTimeList: clockTimeList || [],
            enablePhoneClock: enablePhoneClock,
            effectiveTime,
            memberList,
            rulePhone: {
              areas,
              wifis,
              clockOutOfRange: data.clockOutOfRange,
              goWorkRemind: data.phoneTips.goWorkRemind,
              offWorkRemind: data.phoneTips.offWorkRemind,
            },
          };
        } else {
          subdata = {
            ruleName,
            ruleType,
            clockTimeList: clockTimeList || [],
            enablePhoneClock: enablePhoneClock,
            effectiveTime,
            memberList,
          };
        }
      }
      let api = saveRule;
      if (ruleId) {
        api = updateRule;
        subdata.ruleId = ruleId;
      }

      let json: GlobalResParams<string> = await api(subdata);
      if (json.status === 200) {
        setLoading(false);
        notification['success']({
          message: json.msg,
          description: '',
        });
        history.go(-1);
      } else {
        setLoading(false);
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  return (
    <div>
      <Card title={ruleId ? '编辑规则' : '新增规则'}>
        <div style={{ display: 'none' }}>
          <Map amapkey="85c4671059c4372b39b0f42cb5edab97" zoom={15} />
        </div>
        <Form form={form}>
          <Form.Item
            label="规则名称"
            name="ruleName"
            rules={[{ required: true, message: '请输入规则名称!' }]}
            style={{ width: 400, marginBottom: 40 }}
          >
            <Input placeholder="规则名称" />
          </Form.Item>

          <Form.Item
            label="规则类型"
            name="ruleType"
            rules={[{ required: true, message: '请选择规则类型!' }]}
            style={{ width: 400, marginBottom: 20 }}
            initialValue={0}
          >
            <Radio.Group
              onChange={e => {
                setRuleType(e.target.value);
              }}
            >
              <Radio value={0} style={{ marginBottom: 6 }}>
                固定时间上下班
              </Radio>
              <Radio value={1} style={{ marginBottom: 6 }}>
                按排班上下班
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Divider style={{ margin: '30px 0' }} />
          <Form.Item
            label="打卡人员"
            name="memberList"
            // rules={[{ required: true, message: '请输入用户名称!' }]}
            style={{
              width: '82vw',
              marginBottom: 20,
              minHeight: '40px',
              overflowY: 'auto',
            }}
          >
            <AddUserList
              {...props}
              ruleDetail={ruleDetail}
              handleChangeUserList={handleChangeUserList}
            />
          </Form.Item>
          <Divider style={{ margin: '30px 0' }} />
          {ruleType === 1 ? (
            <Form.Item
              label="排班设置"
              name="scheduleList"
              rules={[{ required: true, message: '请填写排班设置!' }]}
              style={{ width: '82vw', marginBottom: 20, minHeight: '40px' }}
            >
              <AddSchedulingList
                {...props}
                scheduleList={ruleDetail?.scheduleList}
                ruleId={ruleId}
                userList={() => {
                  let newUserList: any = [];
                  userList?.map(item => {
                    for (let key in item) {
                      newUserList = newUserList.concat(item[key]);
                    }
                  });
                  return newUserList;
                }}
              />
            </Form.Item>
          ) : null}
          {ruleType === 0 ? (
            <Form.Item
              label="打卡时间"
              name="clockTimeList"
              rules={[{ required: true, message: '请添加打卡时间!' }]}
              style={{ width: '82vw', marginBottom: 20 }}
            >
              <DailyAttendance
                {...props}
                clockTimeList={ruleDetail?.clockTimeList}
              />
            </Form.Item>
          ) : null}
          <Divider style={{ margin: '30px 0' }} />
          <Form.Item
            label="手机打卡"
            name="enablePhoneClock"
            style={{ marginBottom: 20 }}
          >
            <Checkbox.Group
              onChange={e => {
                setPhoneClock(e.length === 0 ? 0 : 1);
              }}
            >
              <Checkbox value={1}>
                开启 开启手机端打卡，考勤状态将和门禁系统打卡结合统计
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>

          {phoneClock ? (
            <Form.Item label="打卡地点" name="">
              <div>位置和WIFI满足任意一项即可打卡</div>
            </Form.Item>
          ) : null}
          {phoneClock ? (
            <Form.Item
              label="位置"
              name="areas"
              style={{ marginLeft: 30 }}
              rules={[{ required: true, message: '请编辑位置!' }]}
            >
              <AreasList {...props} areas={ruleDetail?.rulePhone?.areas} />
            </Form.Item>
          ) : null}
          {phoneClock ? (
            <Form.Item label="wifi" name="wifis" style={{ marginLeft: 30 }}>
              <Wifi {...props} wifis={ruleDetail?.rulePhone?.wifis} />
            </Form.Item>
          ) : null}
          {phoneClock ? <Divider style={{ margin: '30px 0' }} /> : null}
          {phoneClock ? (
            <Form.Item
              label="手机提醒"
              name="phoneTips"
              rules={[{ required: true, message: '请选择范围外打卡!' }]}
            >
              <Input.Group compact style={{ marginTop: 6 }}>
                <Form.Item
                  name={['phoneTips', 'goWorkRemind']}
                  label="上班提醒"
                  initialValue={0}
                  style={{ paddingRight: 30 }}
                >
                  <Select placeholder="请选择" style={{ minWidth: 200 }}>
                    <Option value={0}>准点</Option>
                    <Option value={5}>前15分钟</Option>
                    <Option value={10}>前10分钟</Option>
                    <Option value={15}>前15分钟</Option>
                    <Option value={20}>前20分钟</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={['phoneTips', 'offWorkRemind']}
                  label="下班提醒"
                  initialValue={0}
                  style={{ paddingRight: 30 }}
                >
                  <Select placeholder="请选择" style={{ minWidth: 200 }}>
                    <Option value={0}>准点</Option>
                    <Option value={5}>后15分钟</Option>
                    <Option value={10}>后10分钟</Option>
                    <Option value={15}>后15分钟</Option>
                    <Option value={20}>后20分钟</Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          ) : null}
          {phoneClock ? <Divider style={{ margin: '30px 0' }} /> : null}
          {phoneClock ? (
            <Form.Item
              label="范围外打卡"
              name="clockOutOfRange"
              rules={[{ required: true, message: '请选择范围外打卡!' }]}
              initialValue={1}
            >
              <Radio.Group>
                <Radio style={{}} value={0}>
                  不允许范围外打卡
                </Radio>
                <Radio style={{}} value={1}>
                  允许范围外打卡，记录为打卡异常
                </Radio>
              </Radio.Group>
            </Form.Item>
          ) : null}
          <Divider style={{ margin: '30px 0' }} />
          <Form.Item
            label="规则生效"
            name="effectiveTime"
            rules={[{ required: true, message: '请选择范围外打卡!' }]}
            initialValue={1}
          >
            <Radio.Group>
              <Radio value={1}>立即生效</Radio>
              <Radio value={0}>明日生效</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            style={{ marginRight: 20 }}
            onClick={() => {
              submit();
            }}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              history.go(-1);
            }}
          >
            返回
          </Button>
        </div>
      </Card>
      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: -50,
            height: 'calc(100% + 60px)',
            width: 'calc(100% + 100px)',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
            marginBottom: '20px',
            padding: '30px 50px',
            margin: ' 20px 0',
          }}
        >
          <Spin
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-10px',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
