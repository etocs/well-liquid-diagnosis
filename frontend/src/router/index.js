import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/exception-management',
    children: [
      {
        path: '/platform-home',
        name: 'PlatformHome',
        component: () => import('@/views/PlatformHome.vue'),
        meta: { title: '平台首页' }
      },
      {
        path: '/production-monitoring',
        name: 'ProductionMonitoring',
        component: () => import('@/views/ProductionMonitoring.vue'),
        meta: { title: '生产监控' }
      },
      {
        path: '/data-reports',
        name: 'DataReports',
        component: () => import('@/views/DataReports.vue'),
        meta: { title: '数据报表' }
      },
      {
        path: '/exception-management',
        name: 'ExceptionManagement',
        component: () => import('@/views/ExceptionManagement.vue'),
        meta: { title: '异常管理' }
      },
      {
        path: '/base-info',
        name: 'BaseInfo',
        component: () => import('@/views/BaseInfo.vue'),
        meta: { title: '基础信息' }
      },
      {
        path: '/system-management',
        name: 'SystemManagement',
        component: () => import('@/views/SystemManagement.vue'),
        meta: { title: '系统管理' }
      },
      {
        path: '/security-audit',
        name: 'SecurityAudit',
        component: () => import('@/views/SecurityAudit.vue'),
        meta: { title: '安全审计' }
      },
      {
        path: '/history-records',
        name: 'HistoryRecords',
        component: () => import('@/views/HistoryRecords.vue'),
        meta: { title: '历史预警记录' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
