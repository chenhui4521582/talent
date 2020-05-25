import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  routes: [
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
