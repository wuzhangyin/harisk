import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useAuditStore = defineStore('audit', () => {
  // 状态
  const auditTasks = ref([])
  const currentTask = ref(null)
  const loading = ref(false)
  
  // 用户列表（实际项目中应该从API获取）
  const users = ref([
    { id: '1', name: '张三', department: '风控部', role: '高级审计师' },
    { id: '2', name: '李四', department: '风控部', role: '审计师' },
    { id: '3', name: '王五', department: '财务部', role: '财务经理' },
    { id: '4', name: '赵六', department: '运营部', role: '运营总监' },
    { id: '5', name: '陈七', department: '合规部', role: '合规专员' }
  ])

  // 审计类型配置
  const auditTypes = ref([
    { value: 'risk_assessment', label: '风险评估', description: '识别和评估潜在风险' },
    { value: 'compliance_check', label: '合规检查', description: '确保符合法规要求' },
    { value: 'internal_control', label: '内部控制', description: '评估内部控制有效性' },
    { value: 'financial_audit', label: '财务审计', description: '审查财务报表和记录' },
    { value: 'operational_audit', label: '运营审计', description: '评估运营流程效率' }
  ])

  // Actions
  const saveAuditTask = async (taskData) => {
    loading.value = true
    try {
      // 模拟API调用
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      auditTasks.value.push(newTask)
      currentTask.value = newTask
      
      return { success: true, data: newTask }
    } catch (error) {
      console.error('保存任务失败:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateAuditTask = async (taskId, updateData) => {
    loading.value = true
    try {
      const taskIndex = auditTasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        auditTasks.value[taskIndex] = {
          ...auditTasks.value[taskIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        }
        
        if (currentTask.value?.id === taskId) {
          currentTask.value = auditTasks.value[taskIndex]
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('更新任务失败:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const deleteAuditTask = async (taskId) => {
    loading.value = true
    try {
      const taskIndex = auditTasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        auditTasks.value.splice(taskIndex, 1)
      }
      
      if (currentTask.value?.id === taskId) {
        currentTask.value = null
      }
      
      return { success: true }
    } catch (error) {
      console.error('删除任务失败:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const getAuditTask = (taskId) => {
    return auditTasks.value.find(task => task.id === taskId)
  }

  const getUserById = (userId) => {
    return users.value.find(user => user.id === userId)
  }

  const getAuditTypeByValue = (value) => {
    return auditTypes.value.find(type => type.value === value)
  }

  // 生成任务编号
  const generateTaskNumber = () => {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    return `AUDIT-${year}-${timestamp}`
  }

  return {
    // 状态
    auditTasks,
    currentTask,
    loading,
    users,
    auditTypes,
    
    // Actions
    saveAuditTask,
    updateAuditTask,
    deleteAuditTask,
    getAuditTask,
    getUserById,
    getAuditTypeByValue,
    generateTaskNumber
  }
})
