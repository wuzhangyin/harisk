<template>
  <div class="cache-clear-button" v-if="showButton">
    <el-button 
      type="warning" 
      size="small" 
      @click="handleClearCache"
      :loading="clearing"
    >
      <el-icon><Refresh /></el-icon>
      清理缓存
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { clearBrowserCache, forceRefresh } from '../utils/cacheUtils'

const showButton = ref(false)
const clearing = ref(false)

// 只在开发环境显示清理按钮
onMounted(() => {
  showButton.value = import.meta.env.DEV
})

const handleClearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清理浏览器缓存吗？这将清除所有本地存储的数据。',
      '清理缓存',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    clearing.value = true
    
    // 清理缓存
    clearBrowserCache()
    
    ElMessage.success('缓存清理成功！页面将刷新...')
    
    // 延迟刷新页面
    setTimeout(() => {
      forceRefresh()
    }, 1000)
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理缓存失败')
    }
  } finally {
    clearing.value = false
  }
}
</script>

<style scoped>
.cache-clear-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cache-clear-button .el-button {
  font-size: 12px;
}
</style>
