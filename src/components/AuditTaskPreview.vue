<template>
  <div class="audit-task-preview">
    <div class="preview-header">
      <h2 class="preview-title">审计任务单</h2>
      <div class="task-number">任务编号：{{ formData.taskNumber }}</div>
    </div>

    <div class="preview-content">
      <div class="info-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>任务名称：</label>
            <span>{{ formData.taskName || '未填写' }}</span>
          </div>
          <div class="info-item">
            <label>审计类型：</label>
            <span>{{ getAuditTypeText(formData.auditType) }}</span>
          </div>
          <div class="info-item">
            <label>优先级：</label>
            <el-tag :type="getPriorityType(formData.priority)" size="small">
              {{ getPriorityText(formData.priority) }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>风险等级：</label>
            <el-tag :type="getRiskLevelType(formData.riskLevel)" size="small">
              {{ getRiskLevelText(formData.riskLevel) }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">人员安排</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>负责人：</label>
            <span>{{ getUserName(formData.assignee) }}</span>
          </div>
          <div class="info-item">
            <label>协助人：</label>
            <span>{{ getAssistantNames(formData.assistants) }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">时间安排</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>计划开始时间：</label>
            <span>{{ formData.startDate || '未设置' }}</span>
          </div>
          <div class="info-item">
            <label>预计完成时间：</label>
            <span>{{ formData.endDate || '未设置' }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">影响范围</h3>
        <div class="impact-scope">
          <el-tag
            v-for="scope in formData.impactScope"
            :key="scope"
            type="info"
            size="small"
            style="margin-right: 8px; margin-bottom: 8px;"
          >
            {{ getImpactScopeText(scope) }}
          </el-tag>
          <span v-if="!formData.impactScope || formData.impactScope.length === 0">
            未设置
          </span>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">任务描述</h3>
        <div class="description">
          <p>{{ formData.description || '暂无描述' }}</p>
        </div>
      </div>

      <div class="info-section" v-if="formData.checkpoints && formData.checkpoints.length > 0">
        <h3 class="section-title">关键检查点</h3>
        <div class="checkpoints">
          <div
            v-for="(checkpoint, index) in formData.checkpoints"
            :key="index"
            class="checkpoint-item"
            v-if="checkpoint.content"
          >
            <span class="checkpoint-number">{{ index + 1 }}.</span>
            <span class="checkpoint-content">{{ checkpoint.content }}</span>
          </div>
          <p v-if="!hasValidCheckpoints" class="no-checkpoints">暂无检查点</p>
        </div>
      </div>
    </div>

    <div class="preview-footer">
      <div class="footer-info">
        <p>创建时间：{{ new Date().toLocaleString('zh-CN') }}</p>
        <p>状态：草稿</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// 用户列表（应该从父组件传递或从store获取）
const userList = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
  { id: '5', name: '陈七' }
]

// 计算属性
const hasValidCheckpoints = computed(() => {
  return props.formData.checkpoints && 
         props.formData.checkpoints.some(checkpoint => checkpoint.content.trim() !== '')
})

// 方法
const getAuditTypeText = (type) => {
  const typeMap = {
    'risk_assessment': '风险评估',
    'compliance_check': '合规检查',
    'internal_control': '内部控制',
    'financial_audit': '财务审计',
    'operational_audit': '运营审计'
  }
  return typeMap[type] || '未设置'
}

const getPriorityText = (priority) => {
  const priorityMap = {
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  return priorityMap[priority] || '未设置'
}

const getPriorityType = (priority) => {
  const typeMap = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'success'
  }
  return typeMap[priority] || 'info'
}

const getRiskLevelText = (level) => {
  const levelMap = {
    'critical': '严重',
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  return levelMap[level] || '未设置'
}

const getRiskLevelType = (level) => {
  const typeMap = {
    'critical': 'danger',
    'high': 'warning',
    'medium': 'info',
    'low': 'success'
  }
  return typeMap[level] || 'info'
}

const getUserName = (userId) => {
  const user = userList.find(u => u.id === userId)
  return user ? user.name : '未设置'
}

const getAssistantNames = (userIds) => {
  if (!userIds || userIds.length === 0) return '未设置'
  const names = userIds.map(id => {
    const user = userList.find(u => u.id === id)
    return user ? user.name : id
  })
  return names.join('、')
}

const getImpactScopeText = (scope) => {
  const scopeMap = {
    'financial': '财务',
    'operational': '运营',
    'compliance': '合规',
    'reputation': '声誉'
  }
  return scopeMap[scope] || scope
}
</script>

<style scoped>
.audit-task-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
}

.preview-header {
  text-align: center;
  padding: 20px 0;
  border-bottom: 2px solid #e1e8ed;
  margin-bottom: 30px;
}

.preview-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.task-number {
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 500;
}

.preview-content {
  padding: 0 20px;
}

.info-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ecf0f1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 600;
  color: #5a6c7d;
  min-width: 120px;
  margin-right: 10px;
}

.info-item span {
  color: #2c3e50;
}

.description {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.description p {
  margin: 0;
  white-space: pre-wrap;
}

.impact-scope {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.checkpoints {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.checkpoint-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.checkpoint-item:last-child {
  margin-bottom: 0;
}

.checkpoint-number {
  font-weight: 600;
  color: #667eea;
  min-width: 25px;
  margin-right: 10px;
}

.checkpoint-content {
  color: #2c3e50;
  flex: 1;
}

.no-checkpoints {
  color: #7f8c8d;
  font-style: italic;
  margin: 0;
}

.preview-footer {
  margin-top: 40px;
  padding: 20px 20px 0;
  border-top: 1px solid #ecf0f1;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.footer-info p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .preview-content {
    padding: 0 10px;
  }
}

/* 打印样式 */
@media print {
  .audit-task-preview {
    background: white !important;
    color: black !important;
  }
  
  .preview-header {
    border-bottom: 2px solid #000;
  }
  
  .section-title {
    border-bottom: 1px solid #000;
  }
}
</style>
