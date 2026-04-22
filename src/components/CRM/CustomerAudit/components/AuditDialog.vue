<!--
  客户业务审核弹窗
  @description 支持13类销售品的审核表单弹窗，支持多业务tab切换
  @version 2.0.0
-->
<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="700px"
    :close-on-click-modal="false"
    destroy-on-close
    class="audit-dialog"
  >
    <!-- 客户信息 -->
    <div class="customer-info">
      <h4>客户信息</h4>
      <div class="customer-info-grid">
        <p><strong>客户名称：</strong>{{ customerInfo?.customerName }}</p>
        <p><strong>联系电话：</strong>{{ customerInfo?.phone }}</p>
        <p><strong>所属地区：</strong>{{ customerInfo?.region }}</p>
        <p><strong>所属行业：</strong>{{ customerInfo?.industry }}</p>
      </div>
    </div>

    <!-- 多业务Tab切换 -->
    <div v-if="pendingOrders.length > 1" class="business-tabs-wrapper">
      <div class="tabs-header">
        <span class="tabs-title">待审核业务列表</span>
        <el-tag type="warning" size="small">共 {{ pendingOrders.length }} 个业务</el-tag>
      </div>
      <el-tabs
        v-model="activeOrderId"
        type="border-card"
        class="business-tabs"
        @tab-change="handleTabChange"
      >
        <el-tab-pane
          v-for="(order, index) in pendingOrders"
          :key="order.id"
          :label="`${index + 1}. ${getProductName(order.productType)}`"
          :name="order.id"
        >
          <template #label>
            <span class="tab-label">
              <span class="tab-index">{{ index + 1 }}</span>
              <span class="tab-product">{{ getProductName(order.productType) }}</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 业务表单 -->
    <div class="business-form">
      <h4>
        <span>业务信息</span>
        <el-tag v-if="currentOrderInfo" :type="getOperationTypeTag(currentOrderInfo.operationType)" size="small">
          {{ getOperationTypeText(currentOrderInfo.operationType) }}
        </el-tag>
      </h4>

      <!-- 业务基本信息 -->
      <div v-if="currentOrderInfo" class="order-basic-info">
        <p><strong>业务编号：</strong>{{ currentOrderInfo.id }}</p>
        <p><strong>提交时间：</strong>{{ currentOrderInfo.submitTime }}</p>
        <p><strong>提交人：</strong>{{ currentOrderInfo.submitter }}</p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="130px"
        class="audit-form"
      >
        <!-- 动态渲染表单字段 -->
        <template v-for="field in currentFormFields" :key="field.key">
          <!-- 输入框 -->
          <el-form-item
            v-if="field.type === 'input'"
            :label="field.label"
            :prop="field.key"
            :required="field.required"
          >
            <el-input
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              clearable
            />
          </el-form-item>

          <!-- 数字输入框 -->
          <el-form-item
            v-if="field.type === 'number'"
            :label="field.label"
            :prop="field.key"
            :required="field.required"
          >
            <el-input-number
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              :min="0"
              class="form-number"
            />
          </el-form-item>

          <!-- 下拉选择 -->
          <el-form-item
            v-if="field.type === 'select'"
            :label="field.label"
            :prop="field.key"
            :required="field.required"
          >
            <el-select
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              clearable
              class="form-select"
            >
              <el-option
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>

          <!-- 单选组 -->
          <el-form-item
            v-if="field.type === 'radio'"
            :label="field.label"
            :prop="field.key"
            :required="field.required"
          >
            <el-radio-group v-model="formData[field.key]">
              <el-radio
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.value"
              >
                {{ opt.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 文本域 -->
          <el-form-item
            v-if="field.type === 'textarea'"
            :label="field.label"
            :prop="field.key"
            :required="field.required"
          >
            <el-input
              v-model="formData[field.key]"
              type="textarea"
              :rows="3"
              :placeholder="field.placeholder"
            />
          </el-form-item>

          <!-- 时间选择器 -->
          <el-form-item
            v-if="field.type === 'time'"
            :label="field.label"
            :prop="field.key"
            :required="field.required"
          >
            <el-time-picker
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              format="HH:mm"
              value-format="HH:mm"
              class="form-time"
            />
          </el-form-item>
        </template>

        <!-- 审核备注 -->
        <el-form-item label="审核备注" prop="auditRemark">
          <el-input
            v-model="auditRemark"
            type="textarea"
            :rows="2"
            placeholder="请输入审核备注（驳回时必填）"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <el-tag v-if="pendingOrders.length > 1" type="info" size="small">
            当前第 {{ currentOrderIndex + 1 }} / {{ pendingOrders.length }} 个业务
          </el-tag>
        </div>
        <div class="footer-right">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="danger" @click="handleReject">驳回</el-button>
          <el-button type="success" @click="handleApprove">
            {{ isLastOrder ? '通过并关闭' : '通过并下一个' }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { CustomerBusinessAggregate, BusinessOrder } from '../types/customerAudit'
import { ProductTypeEnum, ProductTypeNames, OperationTypeEnum, OperationTypeNames } from '../types/customerAudit'
import { getProductFormConfig } from '../config/productFormConfigs'
import { getOrderDetail, auditOrder, currentUserPermission } from '../mock/customerAuditMock'

// ==================== Props & Emits ====================
interface Props {
  modelValue: boolean
  order?: CustomerBusinessAggregate
}

const props = withDefaults(defineProps<Props>(), {
  order: undefined
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', result: { orderId: string; approved: boolean; remark?: string; hasMore?: boolean }): void
}>()

// ==================== 响应式数据 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const orderDetail = ref<BusinessOrder | null>(null)
const customerInfo = ref<CustomerBusinessAggregate | null>(null)
const auditRemark = ref('')

// 所有待审核订单
const pendingOrders = ref<BusinessOrder[]>([])

// 当前激活的订单ID
const activeOrderId = ref<string>('')

// 表单数据
const formData = reactive<Record<string, any>>({})

// 当前产品类型
const currentProductType = ref<ProductTypeEnum>(ProductTypeEnum.QUERY_TRANSFER)

// 当前表单配置
const currentFormConfig = computed(() => {
  return getProductFormConfig(currentProductType.value)
})

// 当前表单字段
const currentFormFields = computed(() => {
  return currentFormConfig.value?.fields || []
})

// 当前产品名称
const currentProductName = computed(() => {
  return currentFormConfig.value?.productName || ''
})

// 当前订单信息
const currentOrderInfo = computed(() => {
  return pendingOrders.value.find(o => o.id === activeOrderId.value)
})

// 当前订单索引
const currentOrderIndex = computed(() => {
  return pendingOrders.value.findIndex(o => o.id === activeOrderId.value)
})

// 是否是最后一个订单
const isLastOrder = computed(() => {
  return currentOrderIndex.value === pendingOrders.value.length - 1
})

// 弹窗标题
const dialogTitle = computed(() => {
  if (!customerInfo.value) return '业务审核'
  return `审核 - ${customerInfo.value.customerName}`
})

// 表单校验规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  currentFormFields.value.forEach(field => {
    if (field.required) {
      rules[field.key] = [
        { required: true, message: `请输入${field.label}`, trigger: 'blur' }
      ]
    }
  })
  return rules
})

// ==================== 方法 ====================

/**
 * 获取产品名称
 */
const getProductName = (productType: string): string => {
  return ProductTypeNames[productType as ProductTypeEnum] || productType
}

/**
 * 获取操作类型标签样式
 */
const getOperationTypeTag = (type: string): string => {
  const tagMap: Record<string, string> = {
    [OperationTypeEnum.CREATE]: 'success',
    [OperationTypeEnum.MODIFY]: 'warning',
    [OperationTypeEnum.CANCEL]: 'danger'
  }
  return tagMap[type] || 'info'
}

/**
 * 获取操作类型文本
 */
const getOperationTypeText = (type: string): string => {
  return OperationTypeNames[type as OperationTypeEnum] || type
}

/**
 * 加载订单详情
 */
const loadOrderDetail = async () => {
  if (!props.order) return

  loading.value = true
  customerInfo.value = props.order

  // 获取所有待审核的业务
  const pendingList = props.order.orders.filter(o => o.status === 'pending')
  pendingOrders.value = pendingList

  if (pendingList.length > 0) {
    // 默认选中第一个待审核业务
    activeOrderId.value = pendingList[0].id
    await loadSingleOrderDetail(pendingList[0].id)
  }

  loading.value = false
}

/**
 * 加载单个订单详情
 */
const loadSingleOrderDetail = async (orderId: string) => {
  const res = await getOrderDetail(orderId)
  if (res.success) {
    orderDetail.value = res.data
    currentProductType.value = res.data.productType as ProductTypeEnum

    // 清空并回填表单数据
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
    Object.keys(res.data.formData).forEach(key => {
      formData[key] = res.data.formData[key]
    })

    // 重置审核备注
    auditRemark.value = ''
  }
}

/**
 * 处理Tab切换
 */
const handleTabChange = async (tabName: string | number) => {
  // 保存当前表单数据（可选）
  await loadSingleOrderDetail(tabName as string)
}

/**
 * 切换到下一个订单
 */
const switchToNextOrder = () => {
  if (isLastOrder.value) {
    // 已经是最后一个，关闭弹窗
    visible.value = false
  } else {
    // 切换到下一个
    const nextIndex = currentOrderIndex.value + 1
    activeOrderId.value = pendingOrders.value[nextIndex].id
    loadSingleOrderDetail(activeOrderId.value)
  }
}

/**
 * 处理通过
 */
const handleApprove = async () => {
  if (!formRef.value) return
  if (!orderDetail.value) return

  try {
    await formRef.value.validate()

    const res = await auditOrder({
      orderId: orderDetail.value.id,
      result: 'approve',
      remark: auditRemark.value
    }, currentUserPermission)

    if (res.success) {
      ElMessage.success('审核通过')

      // 从待审核列表中移除已审核的订单
      const index = pendingOrders.value.findIndex(o => o.id === orderDetail.value?.id)
      if (index > -1) {
        pendingOrders.value.splice(index, 1)
      }

      emit('submit', {
        orderId: orderDetail.value.id,
        approved: true,
        remark: auditRemark.value,
        hasMore: pendingOrders.value.length > 0
      })

      // 切换到下一个或关闭
      if (pendingOrders.value.length > 0) {
        // 还有未审核的，切换到下一个
        const nextIndex = Math.min(index, pendingOrders.value.length - 1)
        activeOrderId.value = pendingOrders.value[nextIndex].id
        await loadSingleOrderDetail(activeOrderId.value)
        ElMessage.info(`还有 ${pendingOrders.value.length} 个业务待审核`)
      } else {
        // 全部审核完成
        visible.value = false
      }
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}

/**
 * 处理驳回
 */
const handleReject = async () => {
  if (!orderDetail.value) return

  if (!auditRemark.value.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }

  const res = await auditOrder({
    orderId: orderDetail.value.id,
    result: 'reject',
    remark: auditRemark.value
  }, currentUserPermission)

  if (res.success) {
    ElMessage.success('审核驳回')

    // 从待审核列表中移除已驳回的订单
    const index = pendingOrders.value.findIndex(o => o.id === orderDetail.value?.id)
    if (index > -1) {
      pendingOrders.value.splice(index, 1)
    }

    emit('submit', {
      orderId: orderDetail.value.id,
      approved: false,
      remark: auditRemark.value,
      hasMore: pendingOrders.value.length > 0
    })

    // 切换到下一个或关闭
    if (pendingOrders.value.length > 0) {
      const nextIndex = Math.min(index, pendingOrders.value.length - 1)
      activeOrderId.value = pendingOrders.value[nextIndex].id
      await loadSingleOrderDetail(activeOrderId.value)
      ElMessage.info(`还有 ${pendingOrders.value.length} 个业务待审核`)
    } else {
      visible.value = false
    }
  } else {
    ElMessage.error(res.message)
  }
}

/**
 * 处理重置
 */
const handleReset = () => {
  if (orderDetail.value) {
    Object.keys(orderDetail.value.formData).forEach(key => {
      formData[key] = orderDetail.value?.formData[key]
    })
  }
  auditRemark.value = ''
}

/**
 * 清空表单
 */
const clearForm = () => {
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })
  auditRemark.value = ''
  orderDetail.value = null
  customerInfo.value = null
  pendingOrders.value = []
  activeOrderId.value = ''
}

// ==================== 监听 ====================
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadOrderDetail()
  } else {
    clearForm()
  }
})
</script>

<style scoped lang="scss">
.audit-dialog {
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

.customer-info {
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

// 业务Tab切换样式
.business-tabs-wrapper {
  margin-bottom: 20px;

  .tabs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .tabs-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .business-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-tabs__content) {
      display: none;
    }

    .tab-label {
      display: flex;
      align-items: center;
      gap: 6px;

      .tab-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background: #e6a23c;
        color: #fff;
        border-radius: 50%;
        font-size: 11px;
      }

      .tab-product {
        font-size: 13px;
      }
    }

    :deep(.el-tabs__item.is-active) {
      .tab-index {
        background: #67c23a;
      }
    }
  }
}

.business-form {
  h4 {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #303133;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.audit-form {
  .form-select {
    width: 100%;
  }

  .form-number {
    width: 100%;
  }

  .form-time {
    width: 100%;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .footer-left {
    display: flex;
    align-items: center;
  }

  .footer-right {
    display: flex;
    gap: 12px;
  }
}
</style>
