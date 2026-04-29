<template>
  <div class="customer-info-detail">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item @click="handleBack">客户基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 客户详情卡片 -->
    <el-card class="detail-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ pageTitle }}</span>
          <el-tag v-if="mode === 'view'" type="info">查看模式</el-tag>
          <el-tag v-else-if="mode === 'edit'" type="warning">编辑模式</el-tag>
          <el-tag v-else type="success">新增模式</el-tag>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        label-width="130px"
        class="detail-form"
        :disabled="mode === 'view'"
      >
        <!-- 第一行 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="是否一级客户">
              <el-select v-model="formData.isFirstLevel" placeholder="请选择" style="width: 100%">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="上级客户">
              <el-select v-model="formData.parentCustomer" placeholder="请选择" style="width: 100%">
                <el-option label="一级客户" value="一级客户" />
                <el-option label="中国电信福建分公司" value="中国电信福建分公司" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="客户等级">
              <el-input v-model="formData.customerLevel" placeholder="请输入" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="客户名称" required>
              <el-input
                v-model="formData.customerName"
                placeholder="请输入"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="客户名称编码">
              <el-input
                v-model="formData.customerNameCode"
                placeholder="请输入"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="客户ID">
              <el-input v-model="formData.customerId" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="平台客户编号">
              <el-input v-model="formData.platformCustomerNo" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="政企组织结构ID">
              <el-input v-model="formData.govOrgId" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="区号">
              <el-input
                v-model="formData.areaCode"
                placeholder="请输入"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="电话号码" required>
              <el-input
                v-model="formData.phoneNumber"
                placeholder="请输入"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="地市">
              <el-select v-model="formData.city" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="city in customerStore.cityOptions"
                  :key="city.value"
                  :label="city.label"
                  :value="city.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="区县">
              <el-select v-model="formData.district" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="district in customerStore.districtOptions"
                  :key="district.value"
                  :label="district.label"
                  :value="district.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="电话安装地址">
              <el-input
                v-model="formData.installAddress"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="简称">
              <el-input
                v-model="formData.shortName"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="简称编码">
              <el-input
                v-model="formData.shortNameCode"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="别名">
              <el-input
                v-model="formData.alias"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="别名编码">
              <el-input
                v-model="formData.aliasCode"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="客户类别">
              <el-select v-model="formData.customerCategory" placeholder="请选择" style="width: 100%">
                <el-option label="企业客户" value="企业客户" />
                <el-option label="政府客户" value="政府客户" />
                <el-option label="个人客户" value="个人客户" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="行业">
              <el-input
                v-model="formData.industry"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                placeholder="请输入"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="客户排序">
              <el-input
                v-model="formData.customerSort"
                placeholder="请输入"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="保密用户性质">
              <el-select v-model="formData.confidentialityLevel" placeholder="请选择" style="width: 100%">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="号码状态">
              <el-select v-model="formData.numberStatus" placeholder="请选择" style="width: 100%">
                <el-option label="使用" value="使用" />
                <el-option label="停用" value="停用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="是否首报号">
              <el-select v-model="formData.isFirstReport" placeholder="请选择" style="width: 100%">
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="关联词汇">
              <el-input
                v-model="formData.relatedKeywords"
                placeholder="请输入"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 关联信息 -->
        <el-divider content-position="left">关联信息</el-divider>
        <div class="related-info-section">
          <el-table :data="formData.relatedIntents" border size="small" style="width: 100%">
            <el-table-column prop="sceneType" label="场景类型" min-width="120" />
            <el-table-column prop="intentCategory" label="意图分类" min-width="150" />
            <el-table-column prop="intentName" label="意图名称" min-width="150" />
            <el-table-column prop="code" label="code" min-width="150" />
          </el-table>
        </div>

        <!-- 操作按钮 -->
        <el-row :gutter="20" justify="center" class="form-actions">
          <el-col :span="24" style="text-align: center;">
            <el-button v-if="mode !== 'view'" type="primary" @click="handleSave">
              保存
            </el-button>
            <el-button v-if="mode === 'view'" type="primary" @click="handleEdit">
              编辑
            </el-button>
            <el-button @click="handleBack">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 客户业务信息卡片 -->
    <el-card class="business-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">客户业务信息</span>
          <el-tag type="info">{{ formData.businessList.length }} 条业务</el-tag>
        </div>
      </template>

      <el-table :data="formData.businessList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="productName" label="业务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="业务状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getBusinessStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewBusiness(row)">查看</el-button>
            <el-button link type="warning" @click="handleEditBusiness(row)">编辑</el-button>
            <el-button link type="danger" @click="handleCancelBusiness(row)">注销</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="formData.businessList.length === 0" description="暂无业务信息" />
    </el-card>

    <!-- 业务详情弹窗 -->
    <el-dialog
      v-model="businessDialogVisible"
      :title="businessDialogTitle"
      width="700px"
      :close-on-click-modal="false"
      destroy-on-close
      class="business-detail-dialog"
    >
      <!-- 客户信息 -->
      <div class="customer-info-section" v-if="selectedBusiness">
        <h4>客户信息</h4>
        <div class="customer-info-grid">
          <p><strong>客户名称：</strong>{{ formData.customerName }}</p>
          <p><strong>联系电话：</strong>{{ formData.phoneNumber }}</p>
          <p><strong>所属地区：</strong>{{ formData.city }}{{ formData.district }}</p>
          <p><strong>客户类别：</strong>{{ formData.customerCategory }}</p>
        </div>
      </div>

      <!-- 业务信息 -->
        <div class="business-info-section" v-if="selectedBusiness">
        <h4>业务信息</h4>
        <div class="order-basic-info">
          <p><strong>业务编号：</strong>{{ selectedBusiness.id }}</p>
          <p><strong>业务名称：</strong>{{ selectedBusiness.productName }}</p>
          <p><strong>业务号码：</strong>
            <span v-if="selectedBusiness.formData">
              <span v-for="(value, key) in selectedBusiness.formData" :key="key" v-if="key.includes('transferNumber') && value">
                {{ value }}<br>
              </span>
              <span v-else>-</span>
            </span>
            <span v-else>-</span>
          </p>
          <p><strong>提交时间：</strong>{{ selectedBusiness.submitTime }}</p>
          <p><strong>提交人：</strong>{{ selectedBusiness.submitter }}</p>
        </div>

        <!-- 业务表单数据 -->
        <div class="form-data-section" v-if="selectedBusiness.formData && Object.keys(selectedBusiness.formData).length > 0">
          <h5>业务配置</h5>
          <div class="form-data-grid" v-if="!isEditMode">
            <div v-for="(value, key) in selectedBusiness.formData" :key="key" class="form-data-item">
              <span class="form-data-label">{{ formatFormFieldLabel(key) }}：</span>
              <span class="form-data-value">{{ formatFormFieldValue(value) }}</span>
            </div>
          </div>
          <!-- 编辑表单 -->
          <el-form v-else ref="editFormRef" :model="editFormData" label-width="120px" class="edit-form">
            <el-row :gutter="20">
              <el-col :xs="24" :md="12" v-for="(value, key) in selectedBusiness.formData" :key="key">
                <el-form-item :label="formatFormFieldLabel(key)">
                  <el-input v-model="editFormData[key]" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 弹窗底部按钮 -->
      <template #footer>
        <el-button @click="businessDialogVisible = false">取消</el-button>
        <el-button v-if="isEditMode" type="primary" @click="handleSaveBusinessEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCustomerInfoStore } from './store/customerInfoStore'
import type { CustomerBusiness } from './types/customerInfo'
import { AuditStatusEnum, AuditStatusLabels } from '../CustomerAudit/types/customerAudit'
import { ProductTypeNames, ProductTypeEnum } from '../CustomerAudit/types/customerAudit'

// ==================== Props 和 Emits ====================

const props = defineProps<{
  customerId?: string
  mode?: 'view' | 'edit' | 'add'
}>()

const emit = defineEmits<{
  (e: 'back-to-list'): void
  (e: 'switch-to-edit', customerId: string): void
  (e: 'save-success'): void
}>()

// ==================== Store ====================

const customerStore = useCustomerInfoStore()

// ==================== 页面模式 ====================

const currentMode = computed(() => props.mode || 'view')
const currentCustomerId = computed(() => props.customerId || '')
const pageTitle = computed(() => {
  if (currentMode.value === 'add') return '新增客户'
  if (currentMode.value === 'edit') return '编辑客户'
  return '查看客户'
})

// ==================== 状态 ====================

const loading = ref(false)
const formRef = ref()
const businessDialogVisible = ref(false)
const selectedBusiness = ref<CustomerBusiness | null>(null)
const businessDialogTitle = ref('业务详情')
const isEditMode = ref(false)
const editFormRef = ref()
const editFormData = reactive({})

// ==================== 表单数据 ====================

const formData = reactive({
  // 第一行
  isFirstLevel: '否',
  parentCustomer: '',
  customerLevel: '1',
  customerName: '',
  
  // 第二行
  customerNameCode: '',
  customerId: '',
  platformCustomerNo: '',
  govOrgId: '',
  
  // 第三行
  areaCode: '0591',
  phoneNumber: '',
  city: '福州市',
  district: '市辖区',
  
  // 第四行
  installAddress: '',
  shortName: '',
  shortNameCode: '',
  alias: '',
  
  // 第五行
  aliasCode: '',
  customerCategory: '企业客户',
  industry: '',
  remark: '',
  
  // 第六行
  customerSort: '10',
  confidentialityLevel: '否',
  numberStatus: '使用',
  isFirstReport: '否',
  relatedKeywords: '福州测试用户',
  
  // 关联信息
  relatedIntents: [
    {
      sceneType: '基础查询',
      intentCategory: '大学类号码查询',
      intentName: '闽江大学',
      code: '17_13_3143163'
    }
  ],
  
  // 业务信息
  businessList: [] as CustomerBusiness[]
})

// ==================== 方法 ====================

const handleBack = () => {
  emit('back-to-list')
}

const handleEdit = () => {
  if (currentCustomerId.value) {
    emit('switch-to-edit', currentCustomerId.value)
  }
}

const handleSave = () => {
  ElMessage.success('保存成功')
  emit('save-success')
}

const getBusinessStatusType = (status: string) => {
  switch (status) {
    case AuditStatusEnum.APPROVED: return 'success'
    case AuditStatusEnum.PENDING: return 'warning'
    case AuditStatusEnum.CANCELLED: return 'info'
    default: return 'info'
  }
}

const getStatusLabel = (status: string) => {
  return AuditStatusLabels[status as AuditStatusEnum] || status
}

const formatFormFieldLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    transferNumber1: '转接号码1',
    transferNumber2: '转接号码2',
    transferNumber3: '转接号码3',
    transferTimeStart: '转接开始时间',
    transferTimeEnd: '转接结束时间',
    showCallerId: '主叫号码显示',
    smsContent: '短信内容',
    smsType: '短信类型',
    realName1: '实名1',
    realNameCode1: '实名编码1',
    realName2: '实名2',
    realNameCode2: '实名编码2',
    realName3: '实名3',
    realNameCode3: '实名编码3'
  }
  return labelMap[key] || key
}

const formatFormFieldValue = (value: any): string => {
  if (value === null || value === undefined) return '-'
  if (value === '') return '-'
  if (typeof value === 'boolean') return value ? '是' : '否'
  return String(value)
}

const handleViewBusiness = (row: CustomerBusiness) => {
  selectedBusiness.value = row
  businessDialogTitle.value = '业务详情'
  isEditMode.value = false
  businessDialogVisible.value = true
}

const handleCancelBusiness = (row: CustomerBusiness) => {
  ElMessageBox.confirm(
    `确定要注销业务 "${row.businessName}" 吗？`,
    '注销确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = '已注销' as any
    ElMessage.success('业务已注销')
  }).catch(() => {})
}

const handleEditBusiness = (row: CustomerBusiness) => {
  selectedBusiness.value = row
  businessDialogTitle.value = '编辑业务'
  isEditMode.value = true
  // 复制业务数据到编辑表单
  Object.assign(editFormData, row.formData)
  businessDialogVisible.value = true
}

const handleSaveBusinessEdit = () => {
  if (selectedBusiness.value) {
    // 更新业务数据
    selectedBusiness.value.formData = { ...editFormData }
    ElMessage.success('业务信息已更新')
    businessDialogVisible.value = false
    // 重置编辑模式
    isEditMode.value = false
  }
}

// ==================== 加载数据 ====================

const loadData = () => {
  if (currentCustomerId.value) {
    // 根据customerId生成不同的模拟数据
    const id = currentCustomerId.value
    formData.customerId = id
    formData.platformCustomerNo = 'CUST_' + id
    formData.govOrgId = 'DEPT_' + id
    formData.customerName = '福建测试' + id.slice(-2) + '组'
    formData.phoneNumber = '122333444'
    
    // 添加业务信息 - 参考客户业务审核数据结构
    formData.businessList = [
      {
        id: 'O' + id + '_001',
        productType: ProductTypeEnum.QUERY_TRANSFER,
        productName: ProductTypeNames[ProductTypeEnum.QUERY_TRANSFER],
        status: AuditStatusEnum.APPROVED,
        submitTime: '2024-01-15 10:30:00',
        submitter: '张三',
        formData: {
          transferNumber1: '0595-22284894',
          transferNumber2: '',
          transferNumber3: '',
          transferTimeStart: '00:00',
          transferTimeEnd: '23:59',
          showCallerId: 'show_customer'
        }
      },
      {
        id: 'O' + id + '_002',
        productType: ProductTypeEnum.SMS_CARD,
        productName: ProductTypeNames[ProductTypeEnum.SMS_CARD],
        status: AuditStatusEnum.APPROVED,
        submitTime: '2024-01-15 11:00:00',
        submitter: '张三',
        formData: {
          smsContent: '欢迎咨询服务，服务热线：0595-22284894',
          smsType: 'welcome'
        }
      },
      {
        id: 'O' + id + '_003',
        productType: ProductTypeEnum.REAL_NAME_QUERY,
        productName: ProductTypeNames[ProductTypeEnum.REAL_NAME_QUERY],
        status: AuditStatusEnum.PENDING,
        submitTime: '2024-01-16 09:15:00',
        submitter: '李四',
        formData: {
          realName1: formData.customerName,
          realNameCode1: '',
          realName2: '',
          realNameCode2: '',
          realName3: '',
          realNameCode3: ''
        }
      }
    ]
  } else {
    // 新增模式，清空数据
    formData.customerId = ''
    formData.platformCustomerNo = ''
    formData.govOrgId = ''
    formData.customerName = ''
    formData.phoneNumber = ''
    formData.businessList = []
  }
}

// ==================== 生命周期 ====================

watch(() => props.customerId, (newId) => {
  if (newId) {
    loadData()
  }
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  await customerStore.init()
  loadData()
  loading.value = false
})
</script>

<style scoped lang="scss">
.customer-info-detail {
  padding: 20px;

  .breadcrumb {
    margin-bottom: 20px;
  }

  .detail-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .detail-form {
      .el-form-item {
        margin-bottom: 18px;
      }
    }

    .related-info-section {
      margin: 20px 0;
    }

    .form-actions {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
    }
  }

  .business-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}

// 业务详情弹窗样式 - 参考客户业务审核
.business-detail-dialog {
  :deep(.el-dialog__header) {
    background: #1a5fb4;
    margin-right: 0;
    padding: 15px 20px;

    .el-dialog__title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      top: 15px;

      .el-dialog__close {
        color: rgba(255, 255, 255, 0.8);

        &:hover {
          color: #fff;
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 65vh;
    overflow-y: auto;
  }
}

.customer-info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #303133;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 8px;
  }

  .customer-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;

    p {
      margin: 0;
      font-size: 13px;
      color: #606266;

      strong {
        color: #303133;
      }
    }
  }
}

.business-info-section {
  h4 {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #303133;
    padding: 12px 16px;
    background: #e8f5e9;
    border-radius: 4px;
  }

  .order-basic-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: #fdf6ec;
    border-radius: 4px;
    border-left: 3px solid #e6a23c;

    p {
      margin: 0;
      font-size: 12px;
      color: #606266;

      strong {
        color: #303133;
      }
    }
  }
}

.form-data-section {
  margin-top: 16px;

  h5 {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: #606266;
    padding: 8px 12px;
    background: #f0f9ff;
    border-radius: 4px;
    border-left: 3px solid #409eff;
  }

  .form-data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
    padding: 12px 16px;
    background: #fafafa;
    border-radius: 4px;
  }

  .form-data-item {
    display: flex;
    align-items: flex-start;
    font-size: 12px;

    .form-data-label {
      color: #909399;
      min-width: 100px;
      flex-shrink: 0;
    }

    .form-data-value {
      color: #303133;
      word-break: break-all;
    }
  }
}

.edit-form {
  margin-top: 10px;
  
  .el-form-item {
    margin-bottom: 15px;
  }
  
  .el-input {
    width: 100%;
  }
}
</style>
