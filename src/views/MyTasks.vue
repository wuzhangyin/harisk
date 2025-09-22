<template>
  <div class="my-tasks">
    <!-- 顶部操作栏 -->
    <div class="top-actions-bar">
      <div class="actions-container">
        <div class="action-buttons">
          <el-button type="primary" size="default" @click="$router.push('/create')">新建</el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <div 
            class="tab" 
            :class="{ active: activeTab === 'initiated' }"
            @click="switchTab('initiated')"
          >
            我的发起
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'draft' }"
            @click="switchTab('draft')"
          >
            草稿箱
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'completed' }"
            @click="switchTab('completed')"
          >
            已办列表
          </div>
        </div>
        
        <div class="filter-form">
          <el-form :inline="true" class="filter-form-content">
            <el-form-item label="风险任务单派发时间：">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="2025-03-19"
                end-placeholder="选择日期"
                size="default"
              />
            </el-form-item>
            
            <el-form-item label="风险任务单标题：">
              <el-input v-model="taskTitle" placeholder="" size="default" />
            </el-form-item>
            
            <el-form-item label="风险任务单编号：">
              <el-input v-model="taskNumber" placeholder="" size="default" />
            </el-form-item>
            
            <el-form-item label="风险任务单类型：">
              <el-input v-model="taskType" placeholder="请选择" size="default" />
            </el-form-item>
            
            <el-form-item label="归属领域/产品：">
              <el-select v-model="domain" placeholder="请选择" size="default">
                <el-option label="有线类" value="wired" />
                <el-option label="ICT" value="ict" />
                <el-option label="互联网专线" value="internet" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="归属市级/区县：">
              <el-select v-model="region" placeholder="请选择" size="default">
                <el-option label="福建省" value="fujian" />
                <el-option label="厦门市" value="xiamen" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="关联责任人：">
              <el-input v-model="responsiblePerson" placeholder="" size="default" />
            </el-form-item>
            
            <el-form-item label="当前环节：">
              <el-select v-model="currentStage" placeholder="请选择" size="default">
                <el-option label="等待汇总" value="waiting_summary" />
                <el-option label="等待确认" value="waiting_confirm" />
                <el-option label="非程序批" value="non_program" />
                <el-option label="责任及举措确认" value="responsibility_confirm" />
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <div class="filter-actions">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button @click="handleExport">导出</el-button>
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="task-list-section">
        <el-table :data="getCurrentData()" style="width: 100%" class="task-table">
          <el-table-column prop="taskNumber" label="风险任务单编号" width="150" />
          <el-table-column prop="taskTitle" label="风险任务单标题" width="200" />
          <el-table-column prop="taskType" label="风险任务单类型" width="120" />
          <el-table-column prop="taskCategory" label="风险归属领域" width="120" />
          <el-table-column prop="taskProduct" label="风险归属产品" width="120" />
          <el-table-column prop="riskLevel" label="风险责任层级" width="120" />
          <el-table-column prop="responsibleRegion" label="责任归属区域" width="120" />
          <el-table-column prop="createTime" label="工单派发时间" width="150" />
          <el-table-column prop="currentStage" label="当前环节" width="120" />
          <el-table-column prop="creator" label="工单发起人" width="100" />
          <el-table-column prop="actions" label="操作" width="200" align="center">
            <template #default="scope">
              <div class="table-actions">
                <template v-if="activeTab === 'draft'">
                  <el-button type="text" size="small" @click="handleEditDraft(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="handleDeleteDraft(scope.row)">删除</el-button>
                </template>
                <template v-else>
                  <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
                  <el-button type="text" size="small" @click="handleModify(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="handleCopy(scope.row)">作废</el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="pagination-wrapper">
          <div class="pagination-info">
            <span>共 {{ getCurrentData().length }} 条</span>
            <span>10条/页</span>
          </div>
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 当前激活的标签页
const activeTab = ref('initiated')

// 筛选表单数据
const dateRange = ref(['2025-03-19', ''])
const taskTitle = ref('')
const taskNumber = ref('')
const taskType = ref('')
const domain = ref('')
const region = ref('')
const responsiblePerson = ref('')
const currentStage = ref('')

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(10)

// 草稿箱数据
const draftTaskListData = ref([])

// 已办列表数据
const completedTaskListData = ref([
  {
    taskNumber: 'ZZ-20250920-000003',
    taskTitle: '测试互联网专项公司流程',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '互联网专线',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-20 14:30:00',
    currentStage: '问题归档',
    creator: '姚海',
    actions: '查看'
  },
  {
    taskNumber: 'FJ-20250919-000019',
    taskTitle: '测试数据专线整改举措为5年',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '互联网专线',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-19 16:39:50',
    currentStage: '问题归档',
    creator: '姚海',
    actions: '查看'
  },
  {
    taskNumber: 'FJ-20250918-000018',
    taskTitle: 'destructionInfo-0918-yaohaics-...',
    taskType: '风险整改单',
    taskCategory: 'ICT',
    taskProduct: 'ICT(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-18 17:10:08',
    currentStage: '问题归档',
    creator: '姚海',
    actions: '查看'
  }
])

// 任务列表数据
const taskListData = ref([
  {
    taskNumber: 'FJ-20250919-000019',
    taskTitle: '测试数据专线整改举措为5年',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '互联网专线',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-19 16:39:50',
    currentStage: '等待汇总',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FJ-20250919-000005',
    taskTitle: '风险任务单0812',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '有线类(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-19 10:29:28',
    currentStage: '等待汇总',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FJ-20250918-000020',
    taskTitle: 'destructionInfo-0918-yaohaics-...',
    taskType: '风险整改单',
    taskCategory: 'ICT',
    taskProduct: 'ICT(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-18 17:52:57',
    currentStage: '非程序批',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FJ-20250918-000018',
    taskTitle: 'destructionInfo-0918-yaohaics-...',
    taskType: '风险整改单',
    taskCategory: 'ICT',
    taskProduct: 'ICT(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-18 17:10:08',
    currentStage: '流程结束',
    creator: '姚海',
    actions: '查看'
  },
  {
    taskNumber: 'FJ-20250918-000016',
    taskTitle: 'destructionInfo-0918-yaohaics-...',
    taskType: '风险整改单',
    taskCategory: 'ICT',
    taskProduct: 'ICT(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-18 16:26:57',
    currentStage: '非程序批',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FZ-20250917-000002',
    taskTitle: '测试互联网专线的流程',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '互联网专线',
    riskLevel: '市级',
    responsibleRegion: '福州市',
    createTime: '2025-09-17 17:00:07',
    currentStage: '责任及举措确认',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'XM-20250917-000003',
    taskTitle: '测试互联网专线的流程',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '互联网专线',
    riskLevel: '市级',
    responsibleRegion: '厦门市',
    createTime: '2025-09-17 17:00:07',
    currentStage: '责任及举措确认',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FJ-20250915-000010',
    taskTitle: '新建风险整改单',
    taskType: '风险整改单',
    taskCategory: '有线类',
    taskProduct: '互联网专线',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-15 16:47:02',
    currentStage: '等待汇总',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FJ-20250915-000015',
    taskTitle: '09150915',
    taskType: '风险整改单',
    taskCategory: 'ICT',
    taskProduct: 'ICT(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-15 16:31:14',
    currentStage: '等待汇总',
    creator: '姚海',
    actions: '查看 修改 作废'
  },
  {
    taskNumber: 'FJ-20250915-000012',
    taskTitle: 'dasdasd',
    taskType: '风险整改单',
    taskCategory: 'ICT',
    taskProduct: 'ICT(领域)',
    riskLevel: '省级',
    responsibleRegion: '福建省',
    createTime: '2025-09-15 16:23:46',
    currentStage: '等待汇总',
    creator: '姚海',
    actions: '查看 修改 作废'
  }
])

// 方法
const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSearch = () => {
  ElMessage.success('查询完成')
}

const handleReset = () => {
  dateRange.value = ['2025-03-19', '']
  taskTitle.value = ''
  taskNumber.value = ''
  taskType.value = ''
  domain.value = ''
  region.value = ''
  responsiblePerson.value = ''
  currentStage.value = ''
  ElMessage.success('重置完成')
}

const handleExport = () => {
  ElMessage.success('导出完成')
}

const handleView = (row) => {
  ElMessage.info(`查看任务：${row.taskTitle}`)
}

const handleModify = (row) => {
  ElMessage.info(`修改任务：${row.taskTitle}`)
}

const handleCopy = (row) => {
  ElMessage.warning(`作废任务：${row.taskTitle}`)
}

// 编辑草稿
const handleEditDraft = (row) => {
  // 将草稿数据存储到sessionStorage，供create页面使用
  sessionStorage.setItem('editingDraft', JSON.stringify(row.draftData))
  
  // 跳转到create页面
  router.push({
    path: '/create',
    query: {
      mode: 'edit',
      draftId: row.draftId
    }
  })
}

// 删除草稿
const handleDeleteDraft = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除草稿"${row.taskTitle}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 从localStorage中删除草稿
    const drafts = JSON.parse(localStorage.getItem('taskDrafts') || '[]')
    const updatedDrafts = drafts.filter(draft => draft.id !== row.draftId)
    localStorage.setItem('taskDrafts', JSON.stringify(updatedDrafts))
    
    // 重新加载草稿数据
    loadDraftData()
    total.value = draftTaskListData.value.length
    
    ElMessage.success('草稿删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
  // 重置分页
  currentPage.value = 1
  // 根据标签页更新总数
  if (tab === 'completed') {
    total.value = completedTaskListData.value.length
  } else if (tab === 'draft') {
    loadDraftData()
    total.value = draftTaskListData.value.length
  } else {
    total.value = taskListData.value.length
  }
}

// 加载草稿数据
const loadDraftData = () => {
  try {
    const drafts = JSON.parse(localStorage.getItem('taskDrafts') || '[]')
    draftTaskListData.value = drafts.map(draft => ({
      taskNumber: draft.taskNumber || 'DRAFT-' + draft.id.slice(-6),
      taskTitle: draft.riskTaskTitle,
      taskType: '风险整改单',
      taskCategory: draft.belongingProductDomain?.[0] || '未分类',
      taskProduct: draft.belongingProductDomain?.[1] || '未分类',
      riskLevel: '省级',
      responsibleRegion: '福建省',
      createTime: new Date(draft.saveTime).toLocaleString(),
      currentStage: '草稿',
      creator: '当前用户',
      actions: '编辑 删除',
      draftId: draft.id,
      draftData: draft
    }))
  } catch (error) {
    console.error('加载草稿数据失败:', error)
    draftTaskListData.value = []
  }
}

// 获取当前显示的数据
const getCurrentData = () => {
  if (activeTab.value === 'completed') {
    return completedTaskListData.value
  } else if (activeTab.value === 'draft') {
    return draftTaskListData.value
  }
  return taskListData.value
}

// 组件挂载时检查路由参数
onMounted(() => {
  // 检查是否有路由参数指定标签页
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
  
  // 检查是否有消息提示
  if (route.query.message) {
    ElMessage.success(route.query.message)
  }
  
  // 初始化数据
  switchTab(activeTab.value)
})
</script>

<style scoped>
.my-tasks {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 0;
  padding-top: 60px;
}

.top-actions-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  height: 60px;
}

.actions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}

.tab {
  padding: 16px 24px;
  cursor: pointer;
  font-size: 14px;
  color: #8c8c8c;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
  font-weight: 500;
}

.filter-form {
  padding: 24px;
}

.filter-form-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.help-icon {
  color: #8c8c8c;
  cursor: help;
  margin-left: 8px;
}

/* 任务列表样式 */
.task-list-section {
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  padding: 24px;
}

.table-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.pagination-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-form-content {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .filter-form-content {
    grid-template-columns: 1fr;
  }
  
  .table-actions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
