import request from '@/utils/request';

//endDate （0门禁 1手机）
export interface IListMyRecord {
  attendanceTime: IAttendanceTime[];
  currentMonthRecord: IAttendanceTime[];
  date: string;
  endDate: string;
  endMethod: 0 | 1;
  ruleId: number;
  startDate: string;
  startMethod: string;
}

export interface IAttendanceTime {
  endTime: String;
  startTime: String;
}

// 获取我的打卡
export async function listMyRecord(month: string) {
  return request(`/api/attendance/myAttendance/listMyRecord`, {
    method: 'POST',
    data: { month },
  });
}

// 获取我的月报
export async function listMyMonthRecord(month: string) {
  return request(`/api/attendance/myAttendance/listMyMonthRecord`, {
    method: 'POST',
    data: { month },
  });
}

// 我的可休假
export async function listMyHoliday() {
  return request(`/api/attendance/myAttendance/listMyHoliday`, {
    method: 'POST',
  });
}

// 获取某天的打卡时间
export async function listAttendanceTime(month: string, day: string) {
  return request(`/api/attendance/myAttendance/listAttendanceTime`, {
    method: 'POST',
    data: { month, day },
  });
}

export async function listMyRecordMock(month: string) {
  return request(`/api/currentUser`, {
    method: 'GET',
    data: { month },
  });
}
