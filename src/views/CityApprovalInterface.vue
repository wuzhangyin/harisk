<template>
  <div class="city-approval-interface">
    <!-- 顶部操作栏 -->
    <div class="top-actions-bar">
      <div class="actions-container">
        <div class="action-buttons">
          <el-button size="default" @click="$router.push('/county-task')">返回</el-button>
          <el-button type="primary" size="default" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </div>

    <!-- 步骤指示器 -->
    <div class="steps-container">
      <el-steps :active="4" finish-status="success" align-center class="custom-steps">
        <el-step title="任务单创建" description="创建任务单"></el-step>
        <el-step title="地市接口人派发" description="派发给地市接口人"></el-step>
        <el-step title="问题整改" description="执行问题整改"></el-step>
        <el-step title="整改确认" description="确认整改完成"></el-step>
        <el-step title="问题归档" description="归档处理"></el-step>
      </el-steps>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 风险专项任务单工作详情 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险专项任务单工作详情 
                <span class="title-description">查看任务单基本信息。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="task-work-details">
          <div class="details-grid">
            <div class="left-column">
              <div class="detail-item">
                <label>工单编号：</label>
                <span>ZZ-JS-20250920-000001</span>
              </div>
              <div class="detail-item">
                <label>任务单标题：</label>
                <span>关于物联网异动异常情况的整改任务单</span>
              </div>
              <div class="detail-item">
                <label>归属领域：</label>
                <span>5G物联网</span>
              </div>
              <div class="detail-item">
                <label>问题发生时间：</label>
                <span>2025-09-16</span>
              </div>
              <div class="detail-item">
                <label>整改期限天数：</label>
                <span>30</span>
              </div>
            </div>
            <div class="right-column">
              <div class="detail-item">
                <label>工单类型：</label>
                <span>风险整改单</span>
              </div>
              <div class="detail-item">
                <label>问题来源：</label>
                <span>巡察</span>
              </div>
              <div class="detail-item">
                <label>归属产品：</label>
                <span>5G物联网(领域)</span>
              </div>
              <div class="detail-item">
                <label>是否重大违规风险：</label>
                <span>否</span>
              </div>
              <div class="detail-item">
                <label>临到期预警天数：</label>
                <span>3</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 风险专项任务单问题清单 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险专项任务单问题清单 
                <span class="title-description">查看问题清单详细信息。</span>
              </h3>
            </div>
            <div class="header-actions">
              <el-button type="primary" size="small" plain>问题清单导出下载</el-button>
              <el-button type="primary" size="small" plain>问题整改情况导出下载</el-button>
              <el-button type="primary" size="small" plain>问题整改情况导入批量上传</el-button>
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </div>
          </div>
        </template>

        <div class="problem-list-section">
          <!-- 问题清单详情 -->
          <div class="problem-details">
            <h5 class="problem-title">
              <span class="problem-icon">●</span>
              问题清单详情
            </h5>
            
            <div class="problem-table-container">
              <el-table :data="problemListData" style="width: 100%" class="problem-table">
                <el-table-column prop="city" label="地市" width="80" />
                <el-table-column prop="county" label="区县" width="80" />
                <el-table-column prop="problemNumber" label="问题编号" width="120" />
                <el-table-column prop="groupCode" label="集团编码" width="120" />
                <el-table-column prop="groupName" label="集团名称" width="150" />
                <el-table-column prop="status1" label="是否存在上述问题" width="150" align="center">
                  <template #default="scope">
                    <el-tag :type="scope.row.status1 === 'yes' ? 'success' : 'info'" size="small">
                      {{ scope.row.status1 === 'yes' ? '是' : '否' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status2" label="整改是否已完成" width="150" align="center">
                  <template #default="scope">
                    <el-tag :type="scope.row.status2 === 'yes' ? 'success' : 'warning'" size="small">
                      {{ scope.row.status2 === 'yes' ? '是' : '否' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="已完成整改情况说明" width="250">
                  <template #default="scope">
                    <span>{{ scope.row.description || '暂无说明' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="actions" label="操作" width="150" align="center">
                  <template #default="scope">
                    <div class="action-buttons">
                      <el-button type="text" size="small">查看详情</el-button>
                      <el-button type="text" size="small" @click="handleFeedback(scope.row)">反馈</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 分页器 -->
            <div class="pagination-wrapper">
              <div class="pagination-info">
                <span>共 5 条</span>
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
      </el-card>

      <!-- 新增问题反馈清单统计一览 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                新增问题反馈清单统计一览 
                <span class="title-description">展示问题反馈统计信息。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="statistics-section">
          <el-table :data="statisticsData" style="width: 100%" class="statistics-table">
            <el-table-column prop="workOrderNumber" label="工单编号" width="150" />
            <el-table-column prop="problemNumber" label="问题编号" width="120" />
            <el-table-column prop="problemCategory" label="问题类别" width="120" />
            <el-table-column prop="existingProblems" label="存在问题数量" width="120" />
            <el-table-column prop="completedRemediation" label="已完成整改数量" width="140" />
          </el-table>
        </div>
      </el-card>

      <!-- 地市接口人审批意见 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                地市接口人审批意见 
                <span class="title-description">对区县整改情况进行审批确认。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="approval-section">
          <el-form label-width="180px" label-position="left" class="approval-form">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="审批是否通过：" required>
                  <el-radio-group v-model="approvalResult">
                    <el-radio label="approved">是</el-radio>
                    <el-radio label="rejected">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="审批意见：">
                  <el-input
                    v-model="approvalComments"
                    type="textarea"
                    :rows="4"
                    placeholder="请填写审批意见..."
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="审批附件：">
                  <el-upload
                    class="upload-button"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="true"
                    :file-list="approvalFileList"
                  >
                    <el-button type="primary" plain size="small">
                      <el-icon><UploadFilled /></el-icon>
                      上传审批文件
                    </el-button>
                  </el-upload>
                  <div class="file-note">支持上传审批相关文件，文件大小不超过100M</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 问题整改反馈历史记录 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                问题整改反馈历史记录 
                <span class="title-description">展示历史反馈记录。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="history-section">
          <el-table :data="feedbackHistoryData" style="width: 100%" class="history-table">
            <el-table-column prop="processType" label="处理类型" width="150" />
            <el-table-column prop="processStatus" label="处理状态" width="120" />
            <el-table-column prop="environment" label="环节" width="100" />
            <el-table-column prop="processTime" label="处理时间" width="150" />
            <el-table-column prop="operation" label="操作" width="100" />
          </el-table>
        </div>
      </el-card>

      <!-- 风险任务历史环节履历 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险任务历史环节履历 
                <span class="title-description">展示风险任务单历史流转情况。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="履历-section">
          <el-table :data="taskHistoryData" style="width: 100%" class="task-history-table">
            <el-table-column prop="stage" label="流程环节" width="150" />
            <el-table-column prop="startTime" label="环节发起时间" width="180" />
            <el-table-column prop="status" label="环节状态" width="120" />
            <el-table-column prop="processor" label="工单处理人" width="150" />
            <el-table-column prop="contactMethod" label="环节处理人联系方式" width="180" />
            <el-table-column prop="processTime" label="环节处理时间" width="180" />
            <el-table-column prop="approvalTrack" label="审批轨迹" width="120" />
            <el-table-column prop="remarks" label="备注" />
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { QuestionFilled, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(5)

// 审批表单数据
const approvalResult = ref('')
const approvalComments = ref('')
const approvalFileList = ref([])

// 问题清单数据（只读显示）
const problemListData = ref([
  {
    city: '郑州市',
    county: '金水区',
    problemNumber: 'YWT1513168',
    groupCode: 'ZZ20240001',
    groupName: '郑州金水智慧科技有限公司',
    status1: 'yes',
    status2: 'yes',
    description: '已完成网络设备升级改造',
    actions: '查看详情'
  },
  {
    city: '郑州市',
    county: '金水区',
    problemNumber: 'YWT1513169',
    groupCode: 'ZZ20240002',
    groupName: '河南中原数据服务有限公司',
    status1: 'yes',
    status2: 'yes',
    description: '已优化数据处理流程',
    actions: '查看详情'
  },
  {
    city: '郑州市',
    county: '金水区',
    problemNumber: 'YWT1513170',
    groupCode: 'ZZ20240003',
    groupName: '金水区创新网络技术有限公司',
    status1: 'yes',
    status2: 'yes',
    description: '已加强网络安全防护',
    actions: '查看详情'
  },
  {
    city: '郑州市',
    county: '金水区',
    problemNumber: 'YWT1513171',
    groupCode: 'ZZ20240004',
    groupName: '郑州豫信物联网科技有限公司',
    status1: 'no',
    status2: 'no',
    description: '',
    actions: '查看详情'
  },
  {
    city: '郑州市',
    county: '金水区',
    problemNumber: 'YWT1513172',
    groupCode: 'ZZ20240005',
    groupName: '河南金水电子商务有限公司',
    status1: 'yes',
    status2: 'no',
    description: '正在制定整改方案',
    actions: '查看详情'
  }
])

// 统计数据
const statisticsData = ref([
  {
    workOrderNumber: 'YDGD-20250916-000002',
    problemNumber: '问题编号',
    problemCategory: '4',
    existingProblems: '3',
    completedRemediation: '2'
  }
])

// 问题整改反馈历史记录数据
const feedbackHistoryData = ref([])

// 风险任务历史环节履历数据
const taskHistoryData = ref([
  {
    stage: '风险确认及问题整改',
    startTime: '2025-09-16 09:41:42',
    status: '已处理',
    processor: '黄海',
    contactMethod: '12345678997',
    processTime: '2025-09-16 15:30:00',
    approvalTrack: '已提交',
    remarks: '整改完成'
  },
  {
    stage: '地市接口人审批',
    startTime: '2025-09-16 15:30:00',
    status: '待处理',
    processor: '李明',
    contactMethod: '13800138000',
    processTime: '',
    approvalTrack: '',
    remarks: '当前审批环节'
  },
  {
    stage: '首环节',
    startTime: '2025-09-16 09:41:42',
    status: '已处理',
    processor: '张三',
    contactMethod: '13900139000',
    processTime: '2025-09-16 09:41:42',
    approvalTrack: '已完成',
    remarks: '任务单创建'
  }
])

// 方法
const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSubmit = async () => {
  if (!approvalResult.value) {
    ElMessage.warning('请选择审批结果')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      '确定要提交审批结果吗？提交后流程将进入问题归档环节。',
      '确认提交',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    // 模拟提交审批结果
    console.log('审批结果:', {
      result: approvalResult.value,
      comments: approvalComments.value,
      files: approvalFileList.value
    })
    
    ElMessage.success('审批提交成功！流程已进入问题归档环节')
    
    // 延迟跳转到我的待办已办列表
    setTimeout(() => {
      router.push({
        path: '/my-tasks',
        query: {
          tab: 'completed', // 跳转到已办列表
          message: '审批完成，任务已归档'
        }
      })
    }, 1500)
    
  } catch (error) {
    // 用户取消操作
    console.log('用户取消提交')
  }
}

const handleFeedback = (row) => {
  ElMessage.info(`正在处理 ${row.groupName} 的反馈`)
}
</script>

<style scoped>
.city-approval-interface {
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

.steps-container {
  margin: 24px auto;
  max-width: 1200px;
  padding: 0 24px;
}

.custom-steps {
  margin-bottom: 32px;
}

.custom-steps :deep(.el-step__title) {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.custom-steps :deep(.el-step__description) {
  font-size: 12px;
  color: #999999;
}

.custom-steps :deep(.el-step__icon) {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* 当前步骤 - 蓝色 */
.custom-steps :deep(.el-step.is-process .el-step__icon) {
  background: #1890ff;
  border: 2px solid #1890ff;
  color: white;
}

/* 已完成步骤 - 浅蓝色带打勾 */
.custom-steps :deep(.el-step.is-finish .el-step__icon) {
  background: #e6f7ff;
  border: 2px solid #1890ff;
  color: #1890ff;
}

.custom-steps :deep(.el-step.is-finish .el-step__icon .el-step__icon-inner) {
  display: none;
}

.custom-steps :deep(.el-step.is-finish .el-step__icon::after) {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1890ff;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

/* 未完成步骤 - 灰色 */
.custom-steps :deep(.el-step.is-wait .el-step__icon) {
  background: #f5f5f5;
  border: 2px solid #d9d9d9;
  color: #8c8c8c;
}

.custom-steps :deep(.el-step__icon-inner) {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

/* 未完成步骤的标题和描述为灰色 */
.custom-steps :deep(.el-step.is-wait .el-step__title) {
  color: #8c8c8c !important;
}

.custom-steps :deep(.el-step.is-wait .el-step__description) {
  color: #bfbfbf !important;
}

/* 步骤间连接线样式 */
.custom-steps :deep(.el-step__line) {
  background: #e8e8e8;
}


.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.form-section {
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.form-section :deep(.el-card__header) {
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  display: flex;
  align-items: center;
}

.title-description {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 400;
  margin-left: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.help-icon {
  color: #8c8c8c;
  cursor: help;
  margin-left: 8px;
}

/* 任务工作详情样式 */
.task-work-details {
  padding: 24px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.detail-item label {
  font-weight: 500;
  color: #595959;
  min-width: 140px;
  flex-shrink: 0;
}

.detail-item span {
  color: #262626;
}

.tag-container {
  display: flex;
  align-items: center;
}

/* 问题清单样式 */
.problem-list-section {
  padding: 24px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.problem-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.problem-icon {
  color: #1890ff;
  margin-right: 8px;
}

.problem-table-container {
  margin-bottom: 16px;
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

/* 统计部分样式 */
.statistics-section {
  padding: 24px;
}

/* 审批部分样式 */
.approval-section {
  padding: 24px;
}

.approval-form {
  max-width: 800px;
}

.upload-button {
  display: inline-block;
}

.upload-button .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.file-note {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 历史记录样式 */
.history-section {
  padding: 24px;
}

.task-history-data {
  margin-top: 16px;
}

.history-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.history-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .header-actions {
    flex-wrap: wrap;
  }
  
  .history-row {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
