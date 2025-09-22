<template>
  <div class="dispatch-interface">
    <!-- 顶部操作栏 -->
    <div class="top-actions-bar">
      <div class="actions-container">
        <div class="action-buttons">
          <el-button size="default" @click="$router.push('/')">返回</el-button>
          <el-button type="primary" size="default" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </div>

    <!-- 步骤指示器 -->
    <div class="steps-container">
      <el-steps :active="1" finish-status="success" align-center class="custom-steps">
        <el-step title="任务单创建" description="创建任务单"></el-step>
        <el-step title="地市接口人派发" description="派发给地市接口人"></el-step>
        <el-step title="问题整改" description="执行问题整改"></el-step>
        <el-step title="整改确认" description="确认整改完成"></el-step>
        <el-step title="问题归档" description="归档处理"></el-step>
      </el-steps>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 风险专项任务单详情 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险专项任务单详情 
                <span class="title-description">查看任务单基本信息。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="task-details">
          <!-- 工单类型 - 单独一行，参考create样式 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="detail-item work-type-item">
                <label>工单类型：</label>
                <div class="work-type-display">
                  <span class="work-type-tag">风险整改单</span>
                </div>
              </div>
            </el-col>
          </el-row>

          <!-- 风险标题 - 单独一行 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="detail-item">
                <label>风险标题：</label>
                <span>{{ taskDetails.riskTaskTitle || '测试互联网专项公司流程' }}</span>
              </div>
            </el-col>
          </el-row>

          <!-- 其他信息 - 两列布局 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <label>工单编号：</label>
                <span>ZZ-20250920-000003</span>
              </div>
              <div class="detail-item">
                <label>归属产品领域：</label>
                <span>{{ taskDetails.belongingProductDomain || '有线类/互联网专线' }}</span>
              </div>
              <div class="detail-item">
                <label>是否重大违规风险：</label>
                <span>是</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>问题来源：</label>
                <span>{{ taskDetails.problemSource || '巡察' }}</span>
              </div>
            </el-col>
          </el-row>

          <!-- 问题发生区间和问题发现时间 - 同一行 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <label>问题发生区间：</label>
                <span>2022-09-01-2025-09-30</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>问题发现时间：</label>
                <span>2025-09-17</span>
              </div>
            </el-col>
          </el-row>

          <!-- 风险金额和收入流失 - 同一行 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <label>风险金额：</label>
                <span>{{ taskDetails.riskAmount ? taskDetails.riskAmount.toLocaleString() + '元' : '10,000元' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>收入流失：</label>
                <span>200,000元</span>
              </div>
            </el-col>
          </el-row>

          <!-- 风险整改单内容 - 最后一行 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="detail-item">
                <label>风险整改单内容：</label>
                <span>对互联网专项公司流程</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 风险问题相关附件上传 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险问题相关附件上传 
                <span class="title-description">查看相关附件及添加新附件。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="attachment-section">
          <div class="attachment-actions">
            <div class="actions-left"></div>
            <div class="actions-right">
              <el-button type="primary" plain>批量下载</el-button>
            </div>
          </div>
          
          <div class="attachment-table">
            <el-table :data="attachmentData" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="fileName" label="文件名" />
              <el-table-column prop="fileType" label="文件类型" />
              <el-table-column prop="uploadTime" label="上传时间" />
              <el-table-column prop="uploader" label="上传人" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button size="small" type="primary" plain>下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>

      <!-- 风险专题任务单反馈汇总一览图 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险专题任务单反馈汇总一览图 
                <span class="title-description">明确各情况地市，区县反馈情况汇总一览图</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="breakdown-section">
          <!-- 流程步骤 - 单独一行 -->
          <div class="process-steps">
            <el-steps direction="horizontal" :active="2" finish-status="success">
              <el-step title="开始" />
              <el-step title="问题整改" />
              <el-step title="等待汇总" />
              <el-step title="等待归档" />
              <el-step title="结束" />
            </el-steps>
          </div>

          <!-- 左右布局容器 -->
          <div class="left-right-layout">
            <!-- 左侧：任务级联信息 -->
            <div class="left-section">
              <!-- 任务级联一览图 -->
              <div class="task-cascade-section">
                <div class="cascade-header">
                  <h4 class="cascade-title">
                    <span class="cascade-icon">●</span>
                    任务级联一览图
                  </h4>
                </div>
                
                <div class="cascade-content">
                  <div class="task-item">
                    <span class="task-code">ZZ-20250920-000003</span>
                    <el-tag type="info" size="small">已反馈/需反馈数</el-tag>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：详细数据表格 -->
            <div class="right-section">
              <!-- 工单基本信息表格 -->
              <div class="organization-details">
                <h5 class="org-title">
                  <span class="org-icon">●</span>
                  工单基本信息
                </h5>
                
                <div class="org-table-container">
                  <el-table :data="cascadeTaskData" style="width: 100%" class="org-table">
                    <el-table-column prop="workOrderNumber" label="工单编号" width="120" />
                    <el-table-column prop="taskDispatchPerson" label="任务单派发人" width="120" />
                    <el-table-column prop="lastDispatchPerson" label="上一级派发人" width="120" />
                    <el-table-column prop="dispatchTime" label="任务单派发时间" width="150" />
                    <el-table-column prop="problemReformDeadline" label="问题整改环节反馈期限" width="180" />
                    <el-table-column prop="taskSummaryInfo" label="任务单汇总环节反馈信息" width="200" />
                    <el-table-column prop="taskArchiveInfo" label="任务单汇总环节反馈附件" width="200" />
                    <el-table-column prop="taskStatus" label="任务单环节信息" width="150">
                      <template #default="scope">
                        <span>问题整改</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 任务单明细清单 -->
              <div class="organization-details">
                <div class="detail-header">
                  <h5 class="org-title">
                    <span class="org-icon">●</span>
                    任务单明细清单
                  </h5>
                  <div class="detail-actions">
                    <el-button type="primary" size="small" @click="exportFeedbackList">
                      问题反馈清单导出
                    </el-button>
                  </div>
                </div>
                
                <div class="org-table-container">
                  <el-table :data="organizationData" style="width: 100%" class="org-table" height="300" @row-click="handleRowClick">
                    <el-table-column prop="city" label="归属地市" width="100" />
                    <el-table-column prop="district" label="归属区县" width="100" />
                    <el-table-column prop="groupName" label="集团名称" width="150" />
                    <el-table-column prop="groupCode" label="集团编码" width="120" />
                    <el-table-column prop="problemId" label="问题实例标识" width="150" />
                    <el-table-column prop="problemTime" label="*问题发生时间" width="120" />
                    <el-table-column prop="problemDescription" label="*问题描述" width="150" />
                    <el-table-column prop="expandableField1" label="可拓展字段1" width="150" />
                    <el-table-column prop="expandableField2" label="可拓展字段2" width="150" />
                    <el-table-column prop="expandableField3" label="可拓展字段3" width="120" />
                    <el-table-column prop="actions" label="操作" width="100">
                      <template #default="scope">
                        <el-button type="text" size="small" @click="viewDetails(scope.row)">
                          <el-icon><View /></el-icon>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              
              <!-- 问题反馈信息 - 只有选中数据时才显示 -->
              <div class="feedback-info-section" v-if="selectedRowData">
                <h5 class="feedback-title">
                  <span class="feedback-icon">●</span>
                  问题反馈信息
                  <span class="selected-info">（{{ selectedRowData.city }} - {{ selectedRowData.groupName }}）</span>
                </h5>
                
                <div class="feedback-table-container">
                  <el-table :data="currentFeedbackData" style="width: 100%" class="feedback-table">
                    <el-table-column prop="responsibleDomain" label="责任归属领域" width="150" />
                    <el-table-column prop="problemDescription" label="问题情况说明" width="300" />
                    <el-table-column prop="responsibleDepartment" label="责任责任部门" width="150" />
                    <el-table-column prop="rectificationDescription" label="整改说明" width="200" />
                  </el-table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-card>

      <!-- 风险任务定责环节 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险任务定责环节（定责操作） 
                <span class="title-description">任务单内容问题确认定责。支持同级转派/向下拆分/向上申诉/直接确认。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="feedback-section">
          <!-- 反馈选项 -->
          <div class="feedback-options">
            <el-form label-width="auto" class="feedback-form">
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="风险任务单定责操作：" required>
                    <el-radio-group v-model="feedbackType">
                      <el-radio label="downward_split">向下拆分</el-radio>
                      <el-radio label="peer_transfer">同级转派</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 向下拆分相关字段 -->
              <template v-if="feedbackType === 'downward_split'">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item label="派单规则：" required>
                      <el-radio-group v-model="dispatchRule">
                        <el-radio label="auto_dispatch">自动派发(通用规则)</el-radio>
                        <el-radio label="manual_assignment">手工指派(直接定责)</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 自动派发时显示归属领域和归属产品、第一责任人(多选) -->
                <template v-if="dispatchRule === 'auto_dispatch'">
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item label="归属领域：">
                        <span class="readonly-text">有线类</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="归属产品：">
                        <span class="readonly-text">ICT</span>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="24">
                    <el-col :span="24">
                      <el-form-item label="第一责任人(多选)：">
                        <el-input placeholder="地市管理员1,管理员" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>

                <!-- 手工指派时只显示第一责任人选择框 -->
                <template v-if="dispatchRule === 'manual_assignment'">
                  <el-row :gutter="24">
                    <el-col :span="24">
                      <el-form-item label="第一责任人选择：" required>
                        <el-select v-model="selectedResponsiblePerson" placeholder="请选择第一责任人" style="width: 100%">
                          <el-option label="地市管理员1" value="admin1" />
                          <el-option label="地市管理员2" value="admin2" />
                          <el-option label="区域管理员" value="region_admin" />
                          <el-option label="部门负责人" value="dept_head" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </template>

              <!-- 同级转派相关字段 -->
              <template v-if="feedbackType === 'peer_transfer'">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item label="归属领域/产品：">
                      <el-select v-model="attributionDomain" placeholder="请选择" style="width: 100%">
                        <el-option label="有线类 / 有线类(领域)" value="wired_domain" />
                        <el-option label="无线类 / 无线类(领域)" value="wireless_domain" />
                        <el-option label="ICT / ICT(领域)" value="ict_domain" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item label="关联责任人(多选)：" required>
                      <el-input 
                        v-model="responsiblePersons" 
                        placeholder="请选择关联责任人"
                        readonly
                        @click="showPersonSelector = true"
                      />
                      <div v-if="!responsiblePersons && formSubmitted" class="error-message">
                        不能为空
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </el-form>
          </div>

        </div>
      </el-card>

      <!-- 风险整改单环节反馈截止时间自定义 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险整改单环节反馈截止时间自定义 
                <span class="title-description">配置风险整改单反馈截止时间</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="deadline-config-section">
          <!-- 问题整改环节截止时间 -->
          <div class="deadline-item">
            <div class="deadline-row">
              <span class="deadline-label">问题整改环节截止时间</span>
              <el-date-picker
                v-model="deadlineConfig.reformDeadline"
                type="datetime"
                placeholder="2025-09-30 00:00:00"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 200px; margin-left: 20px;"
              />
              <span class="warning-description">临到期预警天数 <span class="warning-number">5</span> 天</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 风险任务历史环节履历 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险任务历史环节履历 
                <span class="title-description">展示风险任务历史完成情况。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="history-section">
          <el-table :data="historyData" style="width: 100%">
            <el-table-column prop="stage" label="流程环节" width="120" />
            <el-table-column prop="startTime" label="环节发起时间" width="150" />
            <el-table-column prop="status" label="环节状态" width="100" />
            <el-table-column prop="processor" label="工单处理人" width="120" />
            <el-table-column prop="contactMethod" label="环节处理人联系方式" width="150" />
            <el-table-column prop="processTime" label="环节处理时间" width="150" />
            <el-table-column prop="reportTrack" label="审批轨迹" width="100" />
            <el-table-column prop="remarks" label="备注" />
          </el-table>
        </div>
      </el-card>

    </div>

    <!-- 选择责任人对话框 -->
    <el-dialog
      v-model="showPersonSelector"
      title="选择责任人"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 搜索条件 -->
      <div class="search-form">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="员工姓名：">
              <el-input
                v-model="searchForm.employeeName"
                placeholder="请输入员工姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工工号：">
              <el-input
                v-model="searchForm.employeeId"
                placeholder="请输入员工工号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="searchResponsible">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 员工列表 -->
      <el-table
        :data="responsibleList"
        style="width: 100%"
        @selection-change="handleResponsibleSelectionChange"
        max-height="400"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="employeeName" label="员工姓名" width="120" />
        <el-table-column prop="employeeId" label="员工工号" width="120" />
        <el-table-column prop="riskDomain" label="风险归属领域" width="150" />
        <el-table-column prop="riskProduct" label="风险归属产品" width="150" />
        <el-table-column prop="userArea" label="用户归属区域" />
      </el-table>

      <!-- 对话框底部 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPersonSelector = false">取消</el-button>
          <el-button type="primary" @click="confirmResponsible">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { QuestionFilled, View, InfoFilled, Picture, Upload } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 任务详情数据（从create页面传递过来）
const taskDetails = ref({
  riskTaskTitle: '',
  belongingProductDomain: '',
  riskAmount: 0,
  problemSource: '巡察'
})

// 当前页码
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 反馈类型
const feedbackType = ref('downward_split')
const rectificationFeedback = ref('yes')

// 新增字段
const dispatchRule = ref('auto_dispatch')
const selectedResponsiblePerson = ref('')

// 同级转派相关字段
const attributionDomain = ref('wired_domain')
const responsiblePersons = ref('')
const showPersonSelector = ref(false)
const formSubmitted = ref(false)

// 选择责任人相关数据
const searchForm = reactive({
  employeeName: '',
  employeeId: ''
})
const responsibleList = ref([
  {
    employeeName: '张三',
    employeeId: 'E001',
    riskDomain: '网络建设',
    riskProduct: '宽带业务',
    userArea: '河南省'
  },
  {
    employeeName: '李四',
    employeeId: 'E002',
    riskDomain: '网络运维',
    riskProduct: '移动业务',
    userArea: '河南省郑州市'
  },
  {
    employeeName: '王五',
    employeeId: 'E003',
    riskDomain: '客户服务',
    riskProduct: '固网业务',
    userArea: '河南省洛阳市'
  },
  {
    employeeName: '赵六',
    employeeId: 'E004',
    riskDomain: '市场营销',
    riskProduct: '企业业务',
    userArea: '河南省开封市'
  },
  {
    employeeName: '钱七',
    employeeId: 'E005',
    riskDomain: '技术支持',
    riskProduct: '云计算业务',
    userArea: '河南省新乡市'
  },
  {
    employeeName: '孙八',
    employeeId: 'E006',
    riskDomain: '运营管理',
    riskProduct: '物联网业务',
    userArea: '河南省焦作市'
  }
])
const selectedResponsible = ref([])

// 级联任务数据 - 工单基本信息
const cascadeTaskData = ref([
  {
    workOrderNumber: 'ZZ-20250920-000003',
    taskDispatchPerson: '张三',
    lastDispatchPerson: '李四',
    dispatchTime: '2025-09-20 14:30:00',
    problemReformDeadline: '2025-10-20 18:00:00',
    taskSummaryInfo: '已完成初步整改',
    taskArchiveInfo: '整改报告.pdf',
    taskStatus: '等待汇总'
  }
])

// 生成随机10位数字
const generateRandomId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

// 组织数据
const organizationData = ref([
  {
    city: '郑州市',
    district: '金水区',
    groupName: '郑州金水智慧科技有限公司',
    groupCode: 'ZZ20240001',
    problemId: generateRandomId(),
    problemTime: '2025/9/11',
    problemDescription: '折扣为0.02',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '中原区',
    groupName: '河南中原数据服务有限公司',
    groupCode: 'ZZ20240002',
    problemId: generateRandomId(),
    problemTime: '2025/9/11',
    problemDescription: '折扣为0.01',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '二七区',
    groupName: '郑州二七网络技术有限公司',
    groupCode: 'ZZ20240003',
    problemId: generateRandomId(),
    problemTime: '2025/9/11',
    problemDescription: '折扣为0.01',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '管城区',
    groupName: '管城回族区科技有限公司',
    groupCode: 'ZZ20240004',
    problemId: generateRandomId(),
    problemTime: '2025/9/17',
    problemDescription: '折扣为0.01',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '惠济区',
    groupName: '惠济区物联网科技有限公司',
    groupCode: 'ZZ20240005',
    problemId: generateRandomId(),
    problemTime: '2025/9/17',
    problemDescription: '折扣为0.01',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '上街区',
    groupName: '上街区创新科技有限公司',
    groupCode: 'ZZ20240006',
    problemId: generateRandomId(),
    problemTime: '2025/9/17',
    problemDescription: '折扣为0.01',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '荥阳市',
    groupName: '荥阳市智能制造有限公司',
    groupCode: 'ZZ20240007',
    problemId: generateRandomId(),
    problemTime: '2025/9/17',
    problemDescription: '折扣为0.01',
    expandableField1: '检查项目：2025年组巡',
    expandableField2: '来源：专项检查',
    expandableField3: '年份：2025'
  },
  {
    city: '郑州市',
    district: '新密市',
    groupName: '新密市电子商务有限公司',
    groupCode: 'ZZ20240008',
    problemId: generateRandomId(),
  },
  {
    city: '郑州市',
    district: '新郑市',
    groupName: '新郑市通信技术有限公司',
    groupCode: 'ZZ20240009',
    problemId: generateRandomId(),
  },
  {
    city: '郑州市',
    district: '登封市',
    groupName: '登封市网络服务有限公司',
    groupCode: 'ZZ20240010',
    problemId: generateRandomId(),
  }
])

// 选中的行数据
const selectedRowData = ref(null)

// 当前显示的反馈数据
const currentFeedbackData = ref([])

// 问题反馈信息数据映射（根据集团编码）
const feedbackInfoMap = {
  '123456616': [
    {
      responsibleDomain: '网络运维',
      problemDescription: '网络设备老化导致连接不稳定',
      responsibleDepartment: '技术部',
      rectificationDescription: '已安排设备更换，预计本月底完成'
    }
  ],
  '123456615': [
    {
      responsibleDomain: '客户服务',
      problemDescription: '客户投诉响应时间过长',
      responsibleDepartment: '客服部',
      rectificationDescription: '优化客服流程，增加人员配置'
    }
  ],
  '123456614': [
    {
      responsibleDomain: '系统维护',
      problemDescription: '系统升级后功能异常',
      responsibleDepartment: '研发部',
      rectificationDescription: '紧急修复已完成，后续将加强测试'
    }
  ]
}

// 附件数据
const attachmentData = ref([
  {
    fileName: 'XM-20230917-000003',
    fileType: '已进展至问题整改',
    uploadTime: '2023-09-17',
    uploader: '张三'
  }
])

// 任务明细数据
const taskDetailData = ref([
  {
    city: '厦门市',
    district: '思明区',
    groupName: '厦门中资源集团',
    groupCode: '6889303288',
    problemId: '6889303288（集团...）',
    workOrderNumber: 'XM-20250917-000003',
    taskDispatchPerson: '姚海',
    lastDispatchPerson: '',
    dispatchTime: '2025-09-17 17:00:07',
    problemReformDeadline: '',
    taskSummaryInfo: '',
    taskArchiveInfo: '暂无'
  }
])

// 截止时间配置数据
const deadlineConfig = reactive({
  reformDeadline: '2025-09-30 00:00:00'
})

// 历史履历数据
const historyData = ref([
  {
    stage: '责任及举措确认',
    startTime: '2025-09-18 11:17:59',
    status: '待处理',
    processor: '管理员',
    contactMethod: '12345678999',
    processTime: '',
    reportTrack: '当前处理环节',
    remarks: ''
  },
  {
    stage: '举措审批',
    startTime: '2025-09-18 11:05:26',
    status: '已处理',
    processor: '(审批人员处理)',
    contactMethod: '18777777711',
    processTime: '2025-09-18 11:17:59',
    reportTrack: '',
    remarks: ''
  },
  {
    stage: '责任及举措确认',
    startTime: '2025-09-17 17:00:08',
    status: '已处理',
    processor: '管理员',
    contactMethod: '12345678999',
    processTime: '2025-09-18 11:05:26',
    reportTrack: '',
    remarks: ''
  },
  {
    stage: '首环节',
    startTime: '2025-09-17 17:00:08',
    status: '已处理',
    processor: '姚海',
    contactMethod: '18777777711',
    processTime: '2025-09-17 17:00:08',
    reportTrack: '',
    remarks: ''
  }
])

// 选中的附件
const selectedAttachments = ref([])

// 方法
const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSelectionChange = (selection) => {
  selectedAttachments.value = selection
}

// 查看详情
const viewDetails = (row) => {
  console.log('查看详情:', row)
}

// 处理图片上传
const handleImageUpload = (file, row) => {
  console.log('上传图片:', file, row)
  // 这里可以处理图片上传逻辑
  alert(`为 ${row.groupName} 上传图片: ${file.name}`)
  return false // 阻止自动上传
}

// 处理行点击事件
const handleRowClick = (row) => {
  selectedRowData.value = row
  // 根据集团编码获取对应的反馈信息
  currentFeedbackData.value = feedbackInfoMap[row.groupCode] || [
    {
      responsibleDomain: '待确认',
      problemDescription: '暂无问题反馈信息',
      responsibleDepartment: '待分配',
      rectificationDescription: '待处理'
    }
  ]
}

// 导出问题反馈清单
const exportFeedbackList = () => {
  // 这里应该实现导出功能
  console.log('导出问题反馈清单')
  // 可以调用API或生成Excel文件
  alert('问题反馈清单导出功能')
}

// 处理提交
const handleSubmit = () => {
  // 跳转到区县工单处理界面
  router.push('/county-task')
}

// 搜索责任人
const searchResponsible = () => {
  // 这里应该调用API搜索员工
  // 暂时使用模拟数据
  console.log('搜索员工:', searchForm)
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.employeeName = ''
  searchForm.employeeId = ''
  searchResponsible()
}

// 处理责任人选择变化
const handleResponsibleSelectionChange = (selection) => {
  selectedResponsible.value = selection
}

// 确认选择责任人
const confirmResponsible = () => {
  if (selectedResponsible.value.length === 0) {
    ElMessage.warning('请选择至少一个责任人')
    return
  }
  
  // 将选中的责任人信息设置到表单中
  const selectedNames = selectedResponsible.value.map(item => item.employeeName).join(', ')
  responsiblePersons.value = selectedNames
  
  showPersonSelector.value = false
  ElMessage.success('责任人选择完成')
}

// 组件挂载时接收路由参数
onMounted(() => {
  // 从路由查询参数中获取任务详情数据
  if (route.query.riskTaskTitle) {
    taskDetails.value.riskTaskTitle = route.query.riskTaskTitle
  }
  if (route.query.belongingProductDomain) {
    taskDetails.value.belongingProductDomain = route.query.belongingProductDomain
  }
  if (route.query.riskAmount) {
    taskDetails.value.riskAmount = parseInt(route.query.riskAmount) || 0
  }
  if (route.query.problemSource) {
    taskDetails.value.problemSource = route.query.problemSource
  }
})
</script>

<style scoped>
.dispatch-interface {
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
  align-items: center;
}

.steps-container {
  background: transparent;
  padding: 20px 0;
  margin-bottom: 20px;
}

.custom-steps {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.custom-steps :deep(.el-steps) {
  padding: 0;
  margin: 0;
}

.custom-steps :deep(.el-step) {
  flex: 1;
}

.custom-steps :deep(.el-step:first-child .el-step__head) {
  padding-left: 0;
}

.custom-steps :deep(.el-step:last-child .el-step__head) {
  padding-right: 0;
}

.custom-steps :deep(.el-step__title) {
  font-size: 14px;
  font-weight: 500;
  color: #666666;
}

.custom-steps :deep(.el-step__title.is-process) {
  color: #1890ff;
  font-weight: 600;
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

/* 当前处理步骤 - 蓝色填充 */
.custom-steps :deep(.el-step.is-process .el-step__icon) {
  background: #1890ff;
  border: 2px solid #1890ff;
  color: white;
}

/* 已处理步骤 - 蓝色打勾 */
.custom-steps :deep(.el-step.is-finish .el-step__icon) {
  background: #1890ff;
  border: 2px solid #1890ff;
  color: white;
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
  color: white;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

/* 未处理步骤 - 灰色填充 */
.custom-steps :deep(.el-step.is-wait .el-step__icon) {
  background: #d9d9d9;
  border: 2px solid #d9d9d9;
  color: white;
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
  padding: 0 24px 40px;
}

.form-section {
  margin-bottom: 20px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  line-height: 1.4;
}

.title-description {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 400;
  margin-left: 8px;
}

/* 任务详情样式 */
.task-details {
  padding: 24px;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.detail-item label {
  font-weight: 500;
  color: #595959;
  min-width: 120px;
  margin-right: 12px;
}

.detail-item span {
  color: #262626;
}

/* 工单类型样式 - 参考create页面 */
.work-type-item {
  margin-bottom: 20px;
}

.work-type-display {
  display: flex;
  align-items: center;
}

.work-type-tag {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 16px;
  background: #e6f7ff;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  border-color: #1890ff;
}

.tag {
  background: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 附件部分样式 */
.attachment-section {
  padding: 24px;
}

.attachment-actions {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-left {
  flex: 1;
}

.actions-right {
  display: flex;
  gap: 12px;
}

.attachment-table {
  margin-top: 16px;
}

/* 拆单信息样式 */
.breakdown-section {
  padding: 24px;
}

.process-steps {
  margin-bottom: 32px;
}

.process-steps :deep(.el-steps) {
  padding: 0 20px;
}

/* 任务级联一览图样式 */
.task-cascade-section {
  margin-bottom: 32px;
}

.cascade-header {
  margin-bottom: 16px;
}

.cascade-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.cascade-icon {
  color: #1890ff;
  font-size: 12px;
}

.cascade-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-code {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

/* 任务明细清单样式 */
.task-detail-section {
  margin-bottom: 32px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.detail-icon {
  color: #1890ff;
  font-size: 12px;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.export-label {
  font-size: 14px;
  color: #262626;
}

.help-icon {
  color: #8c8c8c;
  font-size: 16px;
}

.info-label {
  font-size: 14px;
  color: #1890ff;
}

.detail-table {
  border: 1px solid #e8e8e8;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

/* 工单基本信息样式 */
.work-order-info {
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.info-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.info-icon {
  color: #1890ff;
  font-size: 12px;
}

.info-content {
  padding: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-size: 14px;
  color: #595959;
  min-width: 140px;
  margin-right: 8px;
}

.info-item span {
  font-size: 14px;
  color: #262626;
}

.task-info-section {
  margin-top: 20px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

.task-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.task-number {
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.task-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.task-code {
  font-size: 14px;
  color: #262626;
}

.task-status {
  font-size: 12px;
  color: #1890ff;
}

.pagination-wrapper {
  margin-top: 16px;
  text-align: center;
}

/* 反馈部分样式 */
.feedback-section {
  padding: 24px;
}

.feedback-options {
  margin-bottom: 24px;
}

.feedback-form :deep(.el-form-item__label) {
  font-size: 14px;
  color: #262626;
  font-weight: 400;
  text-align: left;
}

.rectification-details {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 16px;
}

.rectification-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.rectification-number {
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.rectification-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.rectification-content {
  padding: 16px;
}

.rectification-form :deep(.el-form-item__label) {
  font-size: 14px;
  color: #262626;
  font-weight: 400;
  text-align: left;
}

.periodic-feedback {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.feedback-number {
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.feedback-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.feedback-content {
  padding: 16px;
}

.feedback-detail-form :deep(.el-form-item__label) {
  font-size: 14px;
  color: #262626;
  font-weight: 400;
  text-align: left;
}

/* 截止时间配置样式 */
.deadline-config-section {
  padding: 24px;
}

.deadline-item {
  margin-bottom: 20px;
}

.deadline-item:last-child {
  margin-bottom: 0;
}

.deadline-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.deadline-label {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
  min-width: 180px;
}

.warning-description {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
  margin-left: 20px;
}

.warning-number {
  color: #ff4d4f;
  font-weight: 600;
}

/* 历史履历样式 */
.history-section {
  padding: 24px;
}

/* 输入框带图标样式 */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .el-input {
  flex: 1;
}

/* 帮助图标样式 */
.help-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #8c8c8c;
  cursor: help;
  z-index: 10;
}

/* 错误消息样式 */
.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

/* 流程步骤独立行样式 */
.process-steps {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

/* 左右布局样式 */
.left-right-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.left-section {
  flex: 0 0 300px;
  min-width: 0;
}

.right-section {
  flex: 1;
  min-width: 0;
}


/* 级联任务样式 */
.cascade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cascade-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0;
  display: flex;
  align-items: center;
}

.cascade-icon {
  color: #1890ff;
  margin-right: 8px;
}

.work-order-label {
  font-size: 12px;
  color: #8c8c8c;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.task-code {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.task-details-table,
.org-table-container,
.feedback-table-container {
  margin-top: 16px;
}

.organization-details,
.feedback-info-section {
  margin-top: 24px;
}

.org-title,
.feedback-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.org-icon,
.feedback-icon {
  color: #1890ff;
  margin-right: 8px;
}

/* 选中信息样式 */
.selected-info {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: normal;
  margin-left: 8px;
}

/* 表格行可点击样式 */
.org-table :deep(.el-table__row) {
  cursor: pointer;
}

.org-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 占位符样式 */
.feedback-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #fafafa;
  border-radius: 6px;
  margin-top: 24px;
}

.placeholder-content {
  text-align: center;
  color: #8c8c8c;
}

.placeholder-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.placeholder-content p {
  margin: 0;
  font-size: 14px;
}

/* 只读文本样式 */
.readonly-text {
  color: #606266;
  font-size: 14px;
  line-height: 32px;
  padding: 0 11px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: inline-block;
  min-height: 32px;
  box-sizing: border-box;
}

/* 搜索表单样式 */
.search-form {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .left-right-layout {
    flex-direction: column;
    gap: 16px;
  }
  
  .left-section,
  .right-section {
    flex: none;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .task-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .task-actions {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
