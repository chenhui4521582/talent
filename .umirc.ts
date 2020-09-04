import { defineConfig } from 'umi';
import theme from './src/components/theme';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  theme: theme,
  targets: {
    edge: 13,
    ie: 10,
  },
  routes: [
    {
      path: '/user',
      component: '@/layouts/UserLayout',
      routes: [
        {
          path: '/user/login',
          component: '@/pages/User/Login',
        },
      ],
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        {
          path: '/talent/resume/cvupload',
          component: '@/pages/Resume/Cvupload',
        },
        {
          path: '/talent/resume/cvowner',
          component: '@/pages/Resume/Cvowner',
        },
        {
          path: '/talent/resume/cvlist',
          component: '@/pages/Resume/Cvlist',
        },
        {
          path: '/talent/resume/cvhandupload',
          component: '@/pages/Resume/Cvhandupload',
        },
        {
          path: '/talent/resume/print',
          component: '@/pages/Resume/Print',
        },
        {
          path: '/talent/resume/cvdetails',
          component: '@/pages/Resume/Cvdetails',
        },
        {
          path: '/talent/recruit/list',
          component: '@/pages/Recruit/List',
        },
        {
          path: '/talent/recruit/new',
          component: '@/pages/Recruit/New',
        },
        {
          path: '/talent/recruit/mytask',
          component: '@/pages/Recruit/Mytask',
        },
        {
          path: '/talent/recruit/mylist',
          component: '@/pages/Recruit/Mylist',
        },
        {
          path: '/talent/recruit/adminbole',
          component: '@/pages/Recruit/Adminbole',
        },
        {
          path: '/talent/recruit/hrbole',
          component: '@/pages/Recruit/Hrbole',
        },
        {
          path: '/talent/recruit/show/:id',
          component: '@/pages/Recruit/Show',
        },
        {
          path: '/talent/recruit/edit/:id',
          component: '@/pages/Recruit/Edit',
        },
        {
          path: '/talent/recruit/search/:id',
          component: '@/pages/Recruit/Search',
        },
        {
          path: '/talent/evaluation/hrlist',
          component: '@/pages/Evaluation/Hrlist',
        },
        {
          path: '/talent/evaluation/list',
          component: '@/pages/Evaluation/List',
        },
        {
          path: '/talent/evaluation/entry',
          component: '@/pages/Evaluation/Entry',
        },
        {
          path: '/talent/evaluation/application',
          component: '@/pages/Evaluation/Application',
        },
        {
          path: '/talent/evaluation/print',
          component: '@/pages/Evaluation/Print',
        },
        {
          path: '/talent/evaluation/interviewedit',
          component: '@/pages/Evaluation/Interviewedit',
        },
        {
          path: '/talent/evaluation/registration',
          component: '@/pages/Evaluation/Registration',
        },
        {
          path: '/talent/evaluation/edit',
          component: '@/pages/Evaluation/Edit',
        },
        {
          path: '/talent/system/hrmanage',
          component: '@/pages/System/Hrmanage',
        },
        {
          path: '/talent/system/tagmanage',
          component: '@/pages/System/Tagmanage',
        },
        {
          path: '/talent/trace/interview',
          component: '@/pages/Trace/Interview',
        },
        {
          path: '/talent/trace/luyong',
          component: '@/pages/Trace/Luyong',
        },
        {
          path: '/talent/trace/ruzhi',
          component: '@/pages/Trace/Ruzhi',
        },
        {
          path: '/talent/staff/list',
          component: '@/pages/Staff/List',
        },
        {
          path: '/talent/staffHrbp/list',
          component: '@/pages/Staff/HrbpList',
        },
        {
          path: '/talent/staff/upload',
          component: '@/pages/Staff/Upload',
        },
        {
          path: '/talent/staff/config',
          component: '@/pages/Staff/Config',
        },
        {
          path: '/talent/staff/relation',
          component: '@/pages/Staff/Relation',
        },
        {
          path: '/talent/staff/detail',
          component: '@/pages/Staff/Detail',
        },
        {
          path: '/talent/staff/edit',
          component: '@/pages/Staff/Edit',
        },
        {
          path: '/talent/report/demand',
          component: '@/pages/Report/Demand',
        },
        {
          path: '/talent/report/chioce',
          component: '@/pages/Report/Chioce',
        },
        {
          path: '/talent/report/pass',
          component: '@/pages/Report/Pass',
        },
        {
          path: '/talent/report/entry',
          component: '@/pages/Report/Entry',
        },
        {
          path: '/talent/report/completedtime',
          component: '@/pages/Report/Completedtime',
        },
        {
          path: '/talent/report/completedrate',
          component: '@/pages/Report/Completedrate',
        },
        {
          path: '/talent/report/validity',
          component: '@/pages/Report/Validity',
        },
        {
          path: '/talent/report/adjust',
          component: '@/pages/Report/Adjust',
        },
        {
          path: '/talent/myview/viewArrange',
          component: '@/pages/Myview/ViewArrange',
        },
        {
          path: '/talent/myview/resumeFilter',
          component: '@/pages/Myview/ResumeFilter',
        },
        {
          path: '/talent/company/costmanage',
          component: '@/pages/Company/Costmanage',
        },
        {
          path: '/talent/company/labourmanage',
          component: '@/pages/Company/Labourmanage',
        },
        {
          path: '/talent/workflow/home',
          component: '@/pages/Workflow/Home',
        },
        {
          path: '/talent/workflow/homedetail/:id',
          component: '@/pages/Workflow/HomeDetail',
        },
        {
          path: '/talent/workflow/mylist',
          component: '@/pages/Workflow/MyList',
        },
        {
          path: '/talent/workflow/complete',
          component: '@/pages/Workflow/Complete',
        },
        {
          path: '/talent/workflow/todo',
          component: '@/pages/Workflow/ToDo',
        },
        {
          path: '/talent/workflow/detail/:id',
          component: '@/pages/Workflow/Detail',
        },
        {
          path: '/talent/framework/organization',
          component: '@/pages/Framework/Organization',
        },
        {
          path: '/talent/framework/rolelabel',
          component: '@/pages/Framework/RoleLabel',
        },
        {
          path: '/talent/framework/systemLabel',
          component: '@/pages/Framework/Systemlabel',
        },
        {
          path: '/talent/wfmanage/list',
          component: '@/pages/WFmanage/List',
        },
        {
          path: '/talent/processm/list',
          component: '@/pages/ProcessM/List',
        },
        {
          path: '/talent/wfmanage/applicationrecord/:id',
          component: '@/pages/WFmanage/ApplicationRecord',
        },
        {
          path: '/talent/wfmanage/editRule/:id',
          component: '@/pages/WFmanage/EditRule',
        },
        {
          path: '/talent/wfmanage/new',
          component: '@/pages/WFmanage/New',
        },
        {
          path: '/talent/wfmanage/editForm/:id',
          component: '@/pages/WFmanage/EditForm',
        },
        {
          path: '/talent/wfmanage/category',
          component: '@/pages/WFmanage/Category',
        },
        {
          path: '/talent/systemm/list',
          component: '@/pages/SystemM/List',
        },
        {
          path: '/talent/systemm/notice/new',
          component: '@/pages/SystemM/notice/Edit',
        },
        {
          path: '/talent/systemm/notice/edit/:id',
          component: '@/pages/SystemM/notice/Edit',
        },
        {
          path: '/talent/systemm/notice/list',
          component: '@/pages/SystemM/notice/List',
        },
        //考勤管理
        {
          path: '/talent/attendancem/myclockIn',
          component: '@/pages/AttendanceM/MyAttendance/MyClockIn',
        },
        {
          path: '/talent/attendancem/monthlyreport',
          component: '@/pages/AttendanceM/MyAttendance/MonthlyReport',
        },
        {
          path: '/talent/attendancem/canleave',
          component: '@/pages/AttendanceM/MyAttendance/CanLeave',
        },

        {
          path: '/talent/attendanceconfig/rulelist',
          component: '@/pages/AttendanceM/AttendanceConfig/RuleList',
        },
        {
          path: '/talent/attendanceconfig/addrule',
          component: '@/pages/AttendanceM/AttendanceConfig/AddRule',
        },
        {
          path: '/talent/attendanceconfig/clockIntime',
          component: '@/pages/AttendanceM/AttendanceConfig/ClockInTime',
        },
        {
          path: '/talent/attendancem/editscheduling',
          component: '@/pages/AttendanceM/AttendanceConfig/EditScheduling',
        },
        {
          path: '/talent/attendancem/attendanceconfig/globalc',
          component: '@/pages/AttendanceM/AttendanceConfig/GlobalC',
        },
        {
          path: '/talent/attendancem/attendanceconfig/entranceguardc',
          component: '@/pages/AttendanceM/AttendanceConfig/EntranceGuardC',
        },
        {
          path: '/talent/attendancem/attendanceconfig/holidaym',
          component: '@/pages/AttendanceM/AttendanceConfig/holidayM',
        },
        {
          path: '/talent/Attendancem/attendanceconfig/duringholidaym',
          component: '@/pages/AttendanceM/AttendanceConfig/DuringHolidayM',
        },
        {
          path: '/talent/attendancem/attendanceconfig/bucklefalsem',
          component: '@/pages/AttendanceM/AttendanceConfig/BuckleFalseM',
        },
        {
          path: '/talent/attendancem/attendancesummary',
          component: '@/pages/AttendanceM/Atatistical/AttendanceSummary',
        },
        {
          path: '/talent/attendancem/annualLeavesummary',
          component: '@/pages/AttendanceM/Atatistical/AnnualLeaveSummary',
        },
        {
          path: '/talent/atatistical/cumulative',
          component: '@/pages/AttendanceM/Atatistical/Cumulative',
        },
        {
          path: '/talent/atatistical/percapita',
          component: '@/pages/AttendanceM/Atatistical/PerCapita',
        },
        {
          path: '/talent/atatistical/clockrate',
          component: '@/pages/AttendanceM/Atatistical/ClockRate',
        },
        {
          path: '/talent/atatistical/personal',
          component: '@/pages/AttendanceM/Atatistical/Personal',
        },
      ],
    },
  ],
  proxy: {
    '/api': {
      target: 'http://172.16.248.175:8087/',
      changeOrigin: true,
      pathRewrite: { '^/api': 'api' },
    },
  },
});
