/**
 * 缓存清理工具函数
 */

/**
 * 清理浏览器缓存
 */
export const clearBrowserCache = () => {
  try {
    // 清理localStorage
    if (typeof Storage !== 'undefined') {
      localStorage.clear()
    }
    
    // 清理sessionStorage
    if (typeof Storage !== 'undefined') {
      sessionStorage.clear()
    }
    
    // 清理IndexedDB（如果存在）
    if ('indexedDB' in window) {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          indexedDB.deleteDatabase(db.name)
        })
      }).catch(err => {
        console.warn('清理IndexedDB失败:', err)
      })
    }
    
    // 清理Service Worker缓存
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister()
        })
      })
    }
    
    // 清理Cache API
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName)
        })
      })
    }
    
    console.log('浏览器缓存已清理')
  } catch (error) {
    console.warn('清理缓存时出错:', error)
  }
}

/**
 * 强制刷新页面
 */
export const forceRefresh = () => {
  // 添加时间戳参数防止缓存
  const url = new URL(window.location.href)
  url.searchParams.set('_t', Date.now().toString())
  window.location.href = url.toString()
}

/**
 * 检查并清理过期缓存
 */
export const checkAndClearExpiredCache = () => {
  const lastClearTime = localStorage.getItem('lastCacheClear')
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000 // 24小时
  
  // 如果超过24小时没有清理缓存，则清理
  if (!lastClearTime || (now - parseInt(lastClearTime)) > oneDay) {
    clearBrowserCache()
    localStorage.setItem('lastCacheClear', now.toString())
  }
}

/**
 * 添加缓存清理监听器
 */
export const addCacheClearListeners = () => {
  // 页面加载时清理缓存
  window.addEventListener('load', () => {
    checkAndClearExpiredCache()
  })
  
  // 页面显示时检查缓存
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkAndClearExpiredCache()
    }
  })
  
  // 路由变化时清理缓存
  window.addEventListener('beforeunload', () => {
    // 清理一些临时数据
    sessionStorage.removeItem('tempData')
  })
}

/**
 * 获取构建时间戳
 */
export const getBuildTime = () => {
  return __BUILD_TIME__ || new Date().toISOString()
}

/**
 * 生成防缓存URL
 */
export const getNoCacheUrl = (url) => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_t=${Date.now()}`
}
