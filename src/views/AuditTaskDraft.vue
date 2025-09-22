<template>
  <div class="audit-task-draft">
    <!-- 顶部操作栏 -->
    <div class="top-actions-bar">
      <div class="actions-container">
        <div class="action-buttons">
          <el-button size="default" @click="$router.push('/my-tasks')">取消</el-button>
          <el-button size="default" @click="handleSaveDraft">存草稿</el-button>
          <el-button type="primary" size="default" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </div>

    <!-- 步骤指示器 -->
    <div class="steps-container">
      <el-steps :active="0" finish-status="success" align-center class="custom-steps">
        <el-step title="任务单创建" description="创建任务单"></el-step>
        <el-step title="地市接口人派发" description="派发给地市接口人"></el-step>
        <el-step title="问题整改" description="执行问题整改"></el-step>
        <el-step title="整改确认" description="确认整改完成"></el-step>
        <el-step title="问题归档" description="归档处理"></el-step>
      </el-steps>
    </div>


    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 第一部分：风险专项任务基础信息 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险专项任务基础信息 
                <span class="title-description">填写任务基本信息，明确任务目标和责任人员等基础信息。</span>
              </h3>
            </div>
          </div>
        </template>

        <el-form
          ref="auditFormRef"
          :model="auditForm"
          :rules="formRules"
          label-width="auto"
          class="audit-form"
          :hide-required-asterisk="false"
        >
          <!-- 工单类型 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="工单类型：" prop="workType">
                <el-radio-group v-model="auditForm.workType" class="work-type-group">
                  <el-radio label="risk_rectification" class="radio-button">风险整改单</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 基础信息 -->
          <div class="form-subsection">

            <!-- 风险任务标题 -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="风险任务标题：" prop="riskTaskTitle">
                  <el-input
                    v-model="auditForm.riskTaskTitle"
                    placeholder="请输入内容，最多100个中文字符"
                    maxlength="100"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 问题来源和检查名称 -->
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="问题来源：" prop="problemSource">
                  <el-select
                    v-model="auditForm.problemSource"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option label="外部审计检查" value="external_audit" />
                    <el-option label="总部审计检查" value="headquarters_audit" />
                    <el-option label="省内审计检查" value="provincial_audit" />
                    <el-option label="省内自查" value="provincial_self_check" />
                    <el-option label="巡视" value="inspection" />
                    <el-option label="巡察" value="patrol" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检查名称：" :required="false" class="no-required-asterisk">
                  <el-input
                    v-model="auditForm.inspectionName"
                    placeholder="请输入内容"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 关联公文 -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="关联公文：" class="full-width-field no-required-asterisk" :required="false">
                  <div class="document-input-container">
                    <el-input
                      v-model="auditForm.relatedDocument"
                      placeholder="请输入内容，最多100个中文字符"
                      maxlength="100"
                      show-word-limit
                      class="document-input"
                    />
                    <el-button size="default" type="primary" plain class="upload-button">上传文件</el-button>
                  </div>
                  <div class="upload-hint">
                    <span class="hint-text">如涉及关联文件，请同步上传，文件上传成功，会显示存储在下方附件区</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 问题发生区间和问题发现时间 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="问题发生区间：" prop="problemOccurrenceRange">
                <div class="date-range-container">
                  <el-date-picker
                    v-model="auditForm.problemStartDate"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 45%"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                  <span class="date-separator">至</span>
                  <el-date-picker
                    v-model="auditForm.problemEndDate"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 45%"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="问题发现时间：" prop="problemDiscoveryTime">
                <el-date-picker
                  v-model="auditForm.problemDiscoveryTime"
                  type="date"
                  placeholder="请选择"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 风险整改单内容 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="风险整改单内容：" prop="riskRectificationContent">
                <el-input
                  v-model="auditForm.riskRectificationContent"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入"
                  maxlength="2000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 归属产品领域 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="归属产品领域：" prop="belongingProductDomain">
                <el-cascader
                  v-model="auditForm.belongingProductDomain"
                  :options="productDomainOptions"
                  :props="cascaderProps"
                  placeholder="请选择归属产品领域"
                  style="width: 100%"
                  clearable
                  filterable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 原风险问题任务清单统计字段 -->
          <div class="statistics-subsection">
            <!-- 风险金额和收入流失 -->
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="风险金额：" prop="riskAmount">
                  <div class="amount-input-container">
                    <el-button size="small" class="amount-btn">—</el-button>
                    <el-input-number
                      v-model="auditForm.riskAmount"
                      :min="0"
                      :precision="0"
                      controls-position="right"
                      style="flex: 1; margin: 0 8px;"
                    />
                    <el-button size="small" class="amount-btn">+</el-button>
                    <span class="unit-text">元</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收入流失：" prop="incomeLoss">
                  <div class="amount-input-container">
                    <el-button size="small" class="amount-btn">—</el-button>
                    <el-input-number
                      v-model="auditForm.incomeLoss"
                      :min="0"
                      :precision="0"
                      controls-position="right"
                      style="flex: 1; margin: 0 8px;"
                    />
                    <el-button size="small" class="amount-btn">+</el-button>
                    <span class="unit-text">元</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 是否重大违规风险 -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="是否重大违规风险：" prop="isMajorViolationRisk">
                  <el-radio-group v-model="auditForm.isMajorViolationRisk">
                    <el-radio label="yes">是</el-radio>
                    <el-radio label="no">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>


            <!-- 整改反馈字段 -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="整改反馈字段：" prop="rectificationFeedback">
                  <el-cascader
                    v-model="auditForm.rectificationFeedback"
                    :options="feedbackCascaderOptions"
                    placeholder="请选择整改反馈字段"
                    style="width: 100%"
                    :show-all-levels="false"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :max-collapse-tags="3"
                    :props="{
                      expandTrigger: 'hover',
                      checkStrictly: false,
                      multiple: true
                    }"
                  />
                </el-form-item>
              </el-col>
            </el-row>

          </div>
        </el-form>
      </el-card>

      <!-- 风险问题任务单清单解析 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险问题任务单清单解析 
                <span class="title-description">根据附件清单进行解析功能</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="analysis-section">
          <!-- 问题清单管理 -->
          <div class="digital-list-section">
            <div class="analysis-actions">
              <el-button type="primary" plain @click="downloadTemplate">清单模版下载</el-button>
              <el-upload
                ref="uploadRef"
                :show-file-list="false"
                :before-upload="handleFileUpload"
                accept=".xlsx,.xls"
                class="upload-button-wrapper"
              >
                <el-button type="primary" plain><span style="color: #f56c6c;">*</span> 问题清单上传</el-button>
              </el-upload>
              <el-button type="primary" plain @click="clearTableData">数据解析清空</el-button>
            </div>
            
            <!-- 上传后的表格展示 -->
            <div v-if="uploadedData.length > 0" class="table-container">
              <el-table :data="uploadedData" style="width: 100%" border>
                <el-table-column prop="city" label="归属地市" width="120" />
                <el-table-column prop="district" label="归属区县" width="120" />
                <el-table-column prop="groupName" label="集团名称" width="200" show-overflow-tooltip />
                <el-table-column prop="groupCode" label="*集团编码" width="120" />
                <el-table-column prop="problemId" label="*问题实例标识" width="150" show-overflow-tooltip />
                <el-table-column prop="problemTime" label="*问题发生时间" width="140" />
                <el-table-column prop="problemDesc" label="*问题描述" width="150" show-overflow-tooltip />
                <el-table-column prop="expandField1" label="可拓展字段1" width="150" show-overflow-tooltip />
                <el-table-column prop="expandField2" label="可拓展字段2" width="120" show-overflow-tooltip />
                <el-table-column prop="expandField3" label="可拓展字段3" width="100" show-overflow-tooltip />
              </el-table>
              
              <!-- 分页器 -->
              <div class="pagination-wrapper">
                <div class="pagination-info">
                  <span>共 {{ uploadedData.length }} 条</span>
                  <span>10条/页</span>
                </div>
                <el-pagination
                  v-model:current-page="currentPage"
                  :page-size="pageSize"
                  :total="uploadedData.length"
                  layout="prev, pager, next"
                  small
                />
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 风险专项任务单派单规划 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险专项任务单派单规划 
                <span class="title-description">可在配置通用批量规则进行自动派单，也可手工进行风险定责。</span>
              </h3>
            </div>
          </div>
        </template>

        <el-form
          :model="auditForm"
          label-width="auto"
          class="audit-form"
        >
          <!-- 风险任务单定责操作 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="风险任务单定责操作：" prop="responsibilityOperation">
                <el-radio-group v-model="auditForm.responsibilityOperation">
                  <el-radio value="downward_split">向下拆分</el-radio>
                  <el-radio value="same_level_transfer">同级转派</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 向下拆分：派单规则 -->
          <div v-if="auditForm.responsibilityOperation === 'downward_split'">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="派单规则：" prop="dispatchRule">
                  <el-radio-group v-model="auditForm.dispatchRule" class="dispatch-rule-group">
                    <el-radio label="auto">
                      自动派发（通用规则）
                      <el-button type="primary" size="small" style="margin-left: 12px;" @click="handleRuleConfig">配置</el-button>
                    </el-radio>
                    <el-radio label="manual">手工指派（直接定责）</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 同级转派：关联责任人 -->
          <div v-if="auditForm.responsibilityOperation === 'same_level_transfer'">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="关联责任人：" prop="relatedResponsible">
                  <el-input
                    v-model="auditForm.relatedResponsible"
                    placeholder="请选择关联责任人"
                    readonly
                    @click="showResponsibleDialog = true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 向下拆分模式下的归属信息 -->
          <div v-if="auditForm.responsibilityOperation === 'downward_split'">
            <!-- 归属领域 -->
            <el-row :gutter="24" v-if="auditForm.dispatchRule === 'auto'">
              <el-col :span="24">
                <el-form-item label="归属领域：">
                  <span class="readonly-text">{{ auditForm.belongingDomain || '通用规则-归属领域' }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 归属产品和关联责任人 -->
            <el-row :gutter="24">
              <el-col :span="12" v-if="auditForm.dispatchRule === 'auto'">
                <el-form-item label="归属产品：" prop="belongingProduct">
                  <span class="readonly-text">{{ auditForm.belongingProduct || '通用规则-归属产品' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="auditForm.dispatchRule === 'manual'">
                <el-form-item label="关联责任人：" prop="relatedResponsible">
                  <el-input
                    v-model="auditForm.relatedResponsible"
                    placeholder="请选择关联责任人"
                    readonly
                    @click="showResponsibleDialog = true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="auditForm.dispatchRule === 'auto'">
                <el-form-item label="关联责任人：" prop="relatedResponsible">
                  <span class="readonly-text">{{ auditForm.relatedResponsible || '通用规则-关联责任人' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>


      <!-- 第四部分：风险问题相关附件上传 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险问题相关附件上传 
                <span class="title-description">上传相关的文件和材料，支持PDF、Word、Excel、图片等格式文件，单个文件不超过100MB。</span>
              </h3>
            </div>
          </div>
        </template>

        <div class="attachment-section">
          <el-upload
            class="upload-area"
            drag
            action="#"
            :on-change="handleFileChange"
            :file-list="fileList"
            multiple
            :before-upload="beforeUpload"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </div>
      </el-card>

      <!-- 第五部分：风险整改完成情时间安排 -->
      <el-card class="form-section" shadow="never">
        <template #header>
          <div class="section-header">
            <div class="section-info">
              <h3 class="section-title">
                风险整改完成情时间安排 
                <span class="title-description">制定整改完成时间和预警时间。</span>
              </h3>
            </div>
          </div>
        </template>

        <el-form
          :model="auditForm"
          label-width="auto"
          class="audit-form"
        >
          <!-- 截止时间和临到期预警天数 -->
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="截止时间：" prop="deadline">
                <el-date-picker
                  v-model="auditForm.deadline"
                  type="date"
                  placeholder="请选择截止时间"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="临到期预警天数：" prop="warningDays">
                <div class="warning-days-container">
                  <el-input-number
                    v-model="auditForm.warningDays"
                    :min="1"
                    :max="365"
                    placeholder="请输入天数"
                    style="flex: 1;"
                  />
                  <span class="unit-text-inline">天</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

    </div>

    <!-- 选择责任人对话框 -->
    <el-dialog
      v-model="showResponsibleDialog"
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
        @selection-change="handleSelectionChange"
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
          <el-button @click="showResponsibleDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmResponsible">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  Plus,
  Delete,
  UploadFilled,
  Key
} from '@element-plus/icons-vue'

// 响应式数据
const auditFormRef = ref()
const fileList = ref([])
const currentStep = ref(0)
const router = useRouter()

// 问题清单相关数据
const uploadedData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const uploadRef = ref()

// 选择责任人相关数据
const showResponsibleDialog = ref(false)
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

// 整改反馈字段级联选择器数据
const feedbackCascaderOptions = ref([
  {
    value: 'basic',
    label: '基础类',
    children: [
      {
        value: 'problem_confirmation',
        label: '问题确认',
        children: [
          { value: 'basic_problem_exists', label: '是否存在问题' },
          { value: 'basic_problem_description', label: '问题情况说明' },
          { value: 'basic_problem_voucher', label: '问题情况凭证(附件)' }
        ]
      },
      {
        value: 'rectification_status',
        label: '整改情况',
        children: [
          { value: 'basic_rectification_completed', label: '是否完成整改' },
          { value: 'basic_rectification_result', label: '整改结果说明' },
          { value: 'basic_rectification_voucher', label: '整改结果凭证' }
        ]
      }
    ]
  },
  {
    value: 'amount',
    label: '金额收入类',
    children: [
      {
        value: 'recovered_loss',
        label: '挽回金额',
        children: [
          { value: 'amount_recovered_loss_amount', label: '挽回损失金额' },
          { value: 'amount_recovered_loss_description', label: '挽回损失说明' },
          { value: 'amount_recovered_loss_voucher', label: '挽回损失凭证(附件)' }
        ]
      },
      {
        value: 'recovered_income',
        label: '挽回收入',
        children: [
          { value: 'amount_recovered_income_amount', label: '挽回收入金额' },
          { value: 'amount_recovered_income_description', label: '挽回收入说明' },
          { value: 'amount_recovered_income_voucher', label: '挽回收入凭证(附件)' }
        ]
      },
      {
        value: 'suspended_salary',
        label: '停发薪金',
        children: [
          { value: 'amount_suspended_salary_amount', label: '停发薪金金额' },
          { value: 'amount_suspended_salary_description', label: '停发薪金说明' },
          { value: 'amount_suspended_salary_voucher', label: '停发薪金凭证(附件)' }
        ]
      },
      {
        value: 'violation_penalty',
        label: '违规扣罚',
        children: [
          { value: 'amount_violation_penalty_amount', label: '违规扣罚金额' },
          { value: 'amount_violation_penalty_target', label: '违规扣罚对象' },
          { value: 'amount_violation_penalty_measures', label: '违规扣罚举措' },
          { value: 'amount_violation_penalty_voucher', label: '违规扣罚凭证(附件)' }
        ]
      }
    ]
  },
  {
    value: 'terminal',
    label: '终端回收类',
    children: [
      {
        value: 'ont_modem',
        label: '光/猫/一体机',
        children: [
          { value: 'terminal_ont_recovery_quantity', label: '光/猫/一体机回收数量' },
          { value: 'terminal_ont_recovery_model', label: '光/猫/一体机回收型号' },
          { value: 'terminal_ont_recovery_voucher', label: '光/猫/一体机回收凭证(附件)' }
        ]
      },
      {
        value: 'set_top_box',
        label: '机顶盒',
        children: [
          { value: 'terminal_stb_recovery_quantity', label: '机顶盒回收数量' },
          { value: 'terminal_stb_recovery_model', label: '机顶盒回收型号' },
          { value: 'terminal_stb_recovery_voucher', label: '机顶盒回收凭证(附件)' }
        ]
      },
      {
        value: 'security_camera',
        label: '安防摄像头',
        children: [
          { value: 'terminal_camera_recovery_quantity', label: '安防摄像头回收数量' },
          { value: 'terminal_camera_recovery_model', label: '安防摄像头回收型号' },
          { value: 'terminal_camera_recovery_voucher', label: '安防摄像头回收凭证(附件)' }
        ]
      },
      {
        value: 'remote_control',
        label: '遥控器',
        children: [
          { value: 'terminal_remote_recovery_quantity', label: '遥控器回收数量' },
          { value: 'terminal_remote_recovery_model', label: '遥控器回收型号' },
          { value: 'terminal_remote_recovery_voucher', label: '遥控器回收凭证(附件)' }
        ]
      },
      {
        value: 'other_terminals',
        label: '其他终端',
        children: [
          { value: 'terminal_other_recovery_quantity', label: '其他终端回收数量' },
          { value: 'terminal_other_recovery_model', label: '其他终端回收型号' },
          { value: 'terminal_other_recovery_voucher', label: '其他终端回收凭证(附件)' }
        ]
      }
    ]
  }
])


// 表单数据
const auditForm = reactive({
  taskNumber: 'AUDIT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
  workType: 'risk_rectification',
  riskTaskTitle: '',
  problemSource: '',
  inspectionName: '',
  relatedDocument: '',
  problemStartDate: '',
  problemEndDate: '',
  problemDiscoveryTime: '',
  riskRectificationContent: '',
  productDomain: '',
  belongingProductDomain: [],
  riskAmount: 0,
  incomeLoss: 0,
  isMajorViolationRisk: 'no',
  rectificationFeedback: [['basic', 'problem_confirmation', 'basic_problem_exists']],
  responsibilityOperation: 'downward_split',
  dispatchRule: 'auto',
  belongingDomain: '',
  belongingProduct: '',
  relatedResponsible: '',
  deadline: '',
  warningDays: 7,
  attachments: []
})

// 用户列表（模拟数据）
const userList = ref([
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
  { id: '5', name: '陈七' }
])

// 归属产品领域级联选择器数据
const productDomainOptions = ref([
  {
    value: 'business_process',
    label: '业务流程',
    children: [
      { value: 'business_process', label: '业务流程' }
    ]
  },
  {
    value: 'product',
    label: '产品',
    children: [
      { value: 'idc', label: 'IDC' },
      { value: 'iot', label: 'IOT' },
      { value: 'big_data', label: '大数据' },
      { value: 'sms_mms', label: '短彩' },
      { value: 'international', label: '国际业务' },
      { value: 'education', label: '和教育' },
      { value: 'group_payment', label: '集团代付/集团成员' },
      { value: 'dual_line', label: '双线' },
      { value: 'mobile_cloud', label: '移动云' },
      { value: 'cloud_video', label: '云视讯' }
    ]
  },
  {
    value: 'ict_project',
    label: 'ICT项目',
    children: [
      { value: 'ict_project', label: 'ICT项目' }
    ]
  },
  {
    value: 'non_ict_project',
    label: '非ICT项目',
    children: [
      { value: 'idc', label: 'IDC' },
      { value: 'iot', label: 'IOT' },
      { value: 'big_data', label: '大数据' },
      { value: 'sms_mms', label: '短彩' },
      { value: 'dual_line', label: '双线' },
      { value: 'mobile_cloud', label: '移动云' }
    ]
  },
  {
    value: 'cost_project',
    label: '成本类项目',
    children: [
      { value: 'cost_project', label: '成本类项目' }
    ]
  }
])

// 级联选择器配置
const cascaderProps = {
  multiple: true,
  checkStrictly: false,
  emitPath: false
}

// 表单验证规则
const formRules = {
  workType: [
    { required: true, message: '请选择工作类型', trigger: 'change' }
  ],
  inspectionTarget: [
    { required: true, message: '请输入被检查对象', trigger: 'blur' }
  ],
  inspectionMethod: [
    { required: true, message: '请选择检查方式', trigger: 'change' }
  ],
  inspectionType: [
    { required: true, message: '请选择检查类型', trigger: 'change' }
  ],
  inspectionSubject: [
    { required: true, message: '请输入问题检查主体', trigger: 'blur' }
  ],
  inspectionPeriod: [
    { required: true, message: '请输入问题检查期间', trigger: 'blur' }
  ],
  problemMainCategory: [
    { required: true, message: '请选择问题主要分类', trigger: 'change' }
  ],
  belongingProductDomain: [
    { required: true, message: '请选择归属产品领域', trigger: 'change' }
  ],
  responsibilityOperation: [
    { required: true, message: '请选择风险任务单定责操作', trigger: 'change' }
  ],
  rectificationFeedback: [
    { 
      required: true, 
      type: 'array',
      min: 1,
      message: '请至少选择一个整改反馈字段', 
      trigger: 'change' 
    }
  ]
}

// 自定义验证规则 - 问题清单上传必填
const validateUploadedData = (rule, value, callback) => {
  if (uploadedData.value.length === 0) {
    callback(new Error('请上传问题清单文件'))
  } else {
    callback()
  }
}

// 方法


// 下载模板文件
const downloadTemplate = () => {
  const link = document.createElement('a')
  link.href = '/resource/风险专题任务单导入模板.xlsx'
  link.download = '风险专题任务单导入模板.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('模板下载成功')
}

// 处理文件上传
const handleFileUpload = (file) => {
  const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel'
  
  if (!isValidType) {
    ElMessage.error('只支持上传Excel文件(.xlsx, .xls)')
    return false
  }
  
  // 模拟解析Excel数据
  const mockData = [
    {
      city: '福州市',
      district: '鼓楼区',
      groupName: '中国农业银行股份有...',
      groupCode: '5911001191',
      problemId: '5911001191 (集团...',
      problemTime: '2025-09-11',
      problemDesc: '折扣为0.02',
      expandField1: '检查项目 2025年组巡',
      expandField2: '来源 专项检查',
      expandField3: '年份 2025'
    },
    {
      city: '福州市',
      district: '仓山区',
      groupName: '仓山区人民法院',
      groupCode: '5911001192',
      problemId: '5911001192 (集团...',
      problemTime: '2025-09-11',
      problemDesc: '折扣为0.01',
      expandField1: '检查项目 2025年组巡',
      expandField2: '来源 专项检查',
      expandField3: '年份 2025'
    },
    {
      city: '福州市',
      district: '鼓楼区',
      groupName: '福建省公安厅',
      groupCode: '5911001193',
      problemId: '5911001193 (集团...',
      problemTime: '2025-09-11',
      problemDesc: '折扣为0.01',
      expandField1: '检查项目 2025年组巡',
      expandField2: '来源 专项检查',
      expandField3: '年份 2025'
    },
    {
      city: '厦门市',
      district: '思明区',
      groupName: '厦门中资源集团',
      groupCode: '6889303288',
      problemId: '6889303288 (集团...',
      problemTime: '2025-09-17',
      problemDesc: '折扣为0.01',
      expandField1: '检查项目 2025年组巡',
      expandField2: '来源 专项检查',
      expandField3: '年份 2025'
    }
  ]
  
  uploadedData.value = mockData
  ElMessage.success(`文件上传成功，共解析 ${mockData.length} 条数据`)
  return false // 阻止自动上传
}

// 清空表格数据
const clearTableData = () => {
  ElMessageBox.confirm(
    '确定要清空所有解析的数据吗？',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    uploadedData.value = []
    ElMessage.success('数据已清空')
  }).catch(() => {
    // 用户取消
  })
}

const beforeUpload = (file) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isValidType) {
    ElMessage.error('只支持上传PDF、Word、Excel、图片等格式的文件!')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('上传文件大小不能超过 100MB!')
    return false
  }
  return false // 阻止自动上传，这里只做本地处理
}

const handleFileChange = (file, fileList) => {
  console.log('文件变化:', file, fileList)
}

const handleSaveDraft = () => {
  // 验证必填字段
  if (!auditForm.riskTaskTitle) {
    ElMessage.warning('请填写风险任务标题')
    return
  }
  
  if (!auditForm.problemSource) {
    ElMessage.warning('请选择问题来源')
    return
  }
  
  // 保存草稿数据到localStorage
  const draftData = {
    id: Date.now().toString(),
    taskNumber: auditForm.taskNumber,
    riskTaskTitle: auditForm.riskTaskTitle,
    problemSource: auditForm.problemSource,
    inspectionName: auditForm.inspectionName,
    relatedDocument: auditForm.relatedDocument,
    problemStartDate: auditForm.problemStartDate,
    problemEndDate: auditForm.problemEndDate,
    problemDiscoveryTime: auditForm.problemDiscoveryTime,
    riskRectificationContent: auditForm.riskRectificationContent,
    belongingProductDomain: auditForm.belongingProductDomain,
    riskAmount: auditForm.riskAmount,
    incomeLoss: auditForm.incomeLoss,
    isMajorViolationRisk: auditForm.isMajorViolationRisk,
    rectificationFeedback: auditForm.rectificationFeedback,
    responsibilityOperation: auditForm.responsibilityOperation,
    dispatchRule: auditForm.dispatchRule,
    relatedResponsible: auditForm.relatedResponsible,
    deadline: auditForm.deadline,
    warningDays: auditForm.warningDays,
    uploadedData: uploadedData.value,
    saveTime: new Date().toISOString(),
    status: 'draft'
  }
  
  // 获取现有的草稿列表
  const existingDrafts = JSON.parse(localStorage.getItem('taskDrafts') || '[]')
  
  // 检查是否已存在相同标题的草稿
  const existingIndex = existingDrafts.findIndex(draft => draft.riskTaskTitle === auditForm.riskTaskTitle)
  
  if (existingIndex !== -1) {
    // 更新现有草稿
    existingDrafts[existingIndex] = draftData
    ElMessage.success('草稿更新成功！')
  } else {
    // 添加新草稿
    existingDrafts.push(draftData)
    ElMessage.success('草稿保存成功！')
  }
  
  // 保存到localStorage
  localStorage.setItem('taskDrafts', JSON.stringify(existingDrafts))
  
  // 延迟跳转到草稿箱
  setTimeout(() => {
    router.push({
      path: '/my-tasks',
      query: {
        tab: 'draft',
        message: '草稿已保存到草稿箱'
      }
    })
  }, 1000)
}

const handleRuleConfig = () => {
  ElMessage.info('打开通用派单规则配置')
}

// 搜索责任人
const searchResponsible = () => {
  // 这里应该调用API搜索员工
  // 暂时使用模拟数据
  ElMessage.success('搜索完成')
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.employeeName = ''
  searchForm.employeeId = ''
  searchResponsible()
}

// 处理选择变化
const handleSelectionChange = (selection) => {
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
  auditForm.relatedResponsible = selectedNames
  
  showResponsibleDialog.value = false
  ElMessage.success('责任人选择完成')
}




const handleSubmit = () => {
  // 验证问题清单上传
  if (uploadedData.value.length === 0) {
    ElMessage.error('请先上传问题清单文件')
    return
  }

  // 检查整改反馈字段
  if (!auditForm.rectificationFeedback || auditForm.rectificationFeedback.length === 0) {
    ElMessage.error('请至少选择一个整改反馈字段')
    return
  }
  
  auditFormRef.value.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('确定要提交吗？提交后将进入地市接口人派发环节。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 这里可以调用API提交数据
        console.log('提交数据:', auditForm)
        console.log('上传的问题清单数据:', uploadedData.value)
        ElMessage.success('任务单已提交！正在跳转到派发界面...')
        // 跳转到地市接口人派发界面，并传递任务数据
        setTimeout(() => {
          router.push({
            path: '/dispatch',
            query: {
              riskTaskTitle: auditForm.riskTaskTitle,
              belongingProductDomain: auditForm.belongingProductDomain?.join('/') || '',
              riskAmount: auditForm.riskAmount,
              problemSource: auditForm.problemSource
            }
          })
        }, 1500)
      })
    } else {
      ElMessage.error('请完善必填信息')
    }
  })
}

onMounted(() => {
  // 检查是否是编辑草稿模式
  const editingDraft = sessionStorage.getItem('editingDraft')
  if (editingDraft) {
    try {
      const draftData = JSON.parse(editingDraft)
      // 恢复草稿数据到表单
      Object.assign(auditForm, {
        taskNumber: draftData.taskNumber,
        riskTaskTitle: draftData.riskTaskTitle,
        problemSource: draftData.problemSource,
        inspectionName: draftData.inspectionName,
        relatedDocument: draftData.relatedDocument,
        problemStartDate: draftData.problemStartDate,
        problemEndDate: draftData.problemEndDate,
        problemDiscoveryTime: draftData.problemDiscoveryTime,
        riskRectificationContent: draftData.riskRectificationContent,
        belongingProductDomain: draftData.belongingProductDomain,
        riskAmount: draftData.riskAmount,
        incomeLoss: draftData.incomeLoss,
        isMajorViolationRisk: draftData.isMajorViolationRisk,
        rectificationFeedback: draftData.rectificationFeedback,
        responsibilityOperation: draftData.responsibilityOperation,
        dispatchRule: draftData.dispatchRule,
        relatedResponsible: draftData.relatedResponsible,
        deadline: draftData.deadline,
        warningDays: draftData.warningDays
      })
      
      // 恢复上传的数据
      if (draftData.uploadedData) {
        uploadedData.value = draftData.uploadedData
      }
      
      ElMessage.success('草稿数据已加载')
      
      // 清除sessionStorage中的编辑数据
      sessionStorage.removeItem('editingDraft')
    } catch (error) {
      console.error('加载草稿数据失败:', error)
      ElMessage.error('加载草稿数据失败')
    }
  }
})
</script>

<style scoped>
.audit-task-draft {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 0;
  padding-top: 60px; /* 为固定顶部栏留出空间 */
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
  justify-content: flex-end; /* 将按钮推到右边 */
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

.form-section :deep(.el-card__body) {
  padding: 0;
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

.section-description {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.3;
  display: none; /* 隐藏单独的描述，因为已经合并到标题中 */
}

.audit-form {
  padding: 24px;
}

.audit-form :deep(.el-form-item) {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.audit-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.audit-form :deep(.el-form-item__content) {
  flex: 1;
  min-width: 0;
}

.audit-form :deep(.el-form-item__label) {
  font-size: 14px;
  color: #262626;
  font-weight: 400;
  line-height: 1.5;
  padding-right: 8px;
  text-align: left;
  width: auto;
  min-width: auto;
  justify-content: flex-start;
}

.audit-form :deep(.el-form-item__label)::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.audit-form :deep(.el-input__wrapper) {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: none;
  background-color: #ffffff;
}

.audit-form :deep(.el-input__inner) {
  border: none;
  font-size: 14px;
  color: #262626;
  background: transparent;
}

.audit-form :deep(.el-input__wrapper:hover) {
  border-color: #40a9ff;
}

.audit-form :deep(.el-input__wrapper.is-focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.audit-form :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
  font-size: 14px;
}

.audit-form :deep(.el-select) {
  width: 100%;
}

.audit-form :deep(.el-select .el-input__wrapper) {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: none;
}

.audit-form :deep(.el-select .el-input__wrapper:hover) {
  border-color: #40a9ff;
}

.audit-form :deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.audit-form :deep(.el-select .el-input__inner) {
  border: none;
  background: transparent;
}

.audit-form :deep(.el-date-editor) {
  width: 100%;
}

.audit-form :deep(.el-date-editor .el-input__wrapper) {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: none;
}

.audit-form :deep(.el-date-editor .el-input__wrapper:hover) {
  border-color: #40a9ff;
}

.audit-form :deep(.el-date-editor .el-input__wrapper.is-focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.audit-form :deep(.el-textarea__inner) {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #262626;
  background-color: #ffffff;
}

.audit-form :deep(.el-textarea__inner:hover) {
  border-color: #40a9ff;
}

.audit-form :deep(.el-textarea__inner:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.audit-form :deep(.el-input-number) {
  width: 100%;
}

.audit-form :deep(.el-input-number .el-input__wrapper) {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: none;
}

.audit-form :deep(.el-input-number .el-input__wrapper:hover) {
  border-color: #40a9ff;
}

.audit-form :deep(.el-input-number .el-input__wrapper.is-focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.audit-form :deep(.el-input-number .el-input__inner) {
  border: none;
  background: transparent;
}

.work-type-group {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.work-type-group :deep(.el-radio) {
  margin-right: 0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 16px;
  background: white;
  transition: all 0.3s;
}

.work-type-group :deep(.el-radio:hover) {
  border-color: #1890ff;
}

.work-type-group :deep(.el-radio.is-checked) {
  border-color: #1890ff;
  background: #e6f7ff;
}

.work-type-group :deep(.el-radio__input) {
  display: none;
}

.work-type-group :deep(.el-radio__label) {
  color: #262626;
  font-size: 14px;
  font-weight: 500;
  padding-left: 0;
}

.form-subsection {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.audit-form :deep(.el-radio-group) {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.audit-form :deep(.el-radio) {
  margin-right: 0;
  white-space: nowrap;
}

.audit-form :deep(.el-radio__label) {
  font-size: 14px;
  color: #262626;
}

.audit-form :deep(.el-checkbox-group) {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.audit-form :deep(.el-checkbox) {
  margin-right: 0;
}

.audit-form :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #262626;
}

.unit-text {
  margin-left: 8px;
  color: #8c8c8c;
  font-size: 14px;
}

.upload-hint {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-text {
  font-size: 12px;
  color: #8c8c8c;
}

.date-range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #8c8c8c;
  font-size: 14px;
}

.amount-input-container {
  display: flex;
  align-items: center;
}

.amount-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  color: #666666;
}

.amount-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}


.form-subsection {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.attachment-section {
  padding: 24px;
}

.document-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  margin-bottom: 8px;
}

.statistics-subsection {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

/* 解析功能样式 */
.analysis-section {
  padding: 24px;
}

.digital-list-section {
  margin-bottom: 20px;
}

.subsection-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subsection-title::before {
  content: "•";
  color: #1890ff;
  font-size: 16px;
}

.analysis-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.upload-button-wrapper {
  display: inline-block;
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

/* 隐藏特定字段的必填标志 */
:deep(.no-required-asterisk .el-form-item__label::before) {
  display: none !important;
}

.table-container {
  margin-top: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.pagination-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

/* 派单规划样式 */
.dispatch-rule-group {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.dispatch-rule-group :deep(.el-radio) {
  margin-right: 0;
  white-space: nowrap;
}


.warning-days-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-text-inline {
  color: #8c8c8c;
  font-size: 14px;
  white-space: nowrap;
}

.document-input {
  flex: 1;
  min-width: 0;
}

.upload-button {
  flex-shrink: 0;
  white-space: nowrap;
}

.full-width-field {
  width: 100%;
}

.full-width-field :deep(.el-form-item__content) {
  width: 100%;
}

.statistics-subsection {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.upload-area {
  width: 100%;
}



.preview-content {
  max-height: 70vh;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}

/* 美化滚动条 */
:deep(.el-scrollbar__wrap) {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}
</style>
