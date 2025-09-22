import { createRouter, createWebHistory } from 'vue-router'
import AuditTaskDraft from '../views/AuditTaskDraft.vue'
import DispatchInterface from '../views/DispatchInterface.vue'
import CountyTaskProcessing from '../views/CountyTaskProcessing.vue'
import CityApprovalInterface from '../views/CityApprovalInterface.vue'
import MyTasks from '../views/MyTasks.vue'
import { checkAndClearExpiredCache } from '../utils/cacheUtils'

const routes = [
  {
    path: '/create',
    name: 'AuditTaskDraft',
    component: AuditTaskDraft
  },
  {
    path: '/',
    name: 'MyTasks',
    component: MyTasks
  },
  {
    path: '/dispatch',
    name: 'DispatchInterface',
    component: DispatchInterface
  },
  {
    path: '/county-task',
    name: 'CountyTaskProcessing',
    component: CountyTaskProcessing
  },
  {
    path: '/city-approval',
    name: 'CityApprovalInterface',
    component: CityApprovalInterface
  },
  {
    path: '/my-tasks',
    name: 'MyTasksList',
    component: MyTasks
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：每次路由变化时检查缓存
router.beforeEach((to, from, next) => {
  // 检查并清理过期缓存
  checkAndClearExpiredCache()
  
  // 添加时间戳到URL防止缓存
  if (import.meta.env.DEV) {
    const url = new URL(window.location.href)
    url.searchParams.set('_t', Date.now().toString())
    window.history.replaceState({}, '', url.toString())
  }
  
  next()
})

export default router
