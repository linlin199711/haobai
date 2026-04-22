<!--
  销售单元信息管理 - 新增/编辑弹窗
  @description 销售单元新增和编辑表单弹窗，支持判重、无审核提交、关键字下拉依赖、区县级联选择
  @version 2.0.0
-->
<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="550px"
    :close-on-click-modal="false"
    destroy-on-close
    class="sales-unit-form-dialog"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      class="sales-unit-form"
    >
      <!-- 所属地区 - 级联选择 -->
      <el-form-item label="所属地区" prop="region" required>
        <el-cascader
          v-model="regionCascaderValue"
          :options="regionCascaderOptions"
          :props="{ value: 'value', label: 'label', children: 'children' }"
          placeholder="请选择所属地区"
          :disabled="isEdit"
          class="form-cascader"
          clearable
          @change="handleRegionChange"
        />
        <div v-if="isEdit" class="form-tip">编辑时不可修改所属地区</div>
      </el-form-item>

      <!-- 所属行业 -->
      <el-form-item label="所属行业" prop="industry" required>
        <el-select
          v-model="formData.industry"
          placeholder="请选择所属行业"
          class="form-select"
        >
          <el-option
            v-for="item in industryConfigs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 所属关键字 - 下拉选择，依赖销售品关键字管理 -->
      <el-form-item label="所属关键字" prop="keyword" required>
        <el-select
          v-model="formData.keyword"
          placeholder="请选择所属关键字"
          :disabled="isEdit || keywordOptions.length === 0"
          class="form-select"
          filterable
          clearable
        >
          <el-option
            v-for="item in keywordOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div v-if="keywordOptions.length === 0" class="form-warning">
          <el-icon><Warning /></el-icon>
          <span>请先创建关键字</span>
        </div>
        <div v-else-if="isEdit" class="form-tip">编辑时不可修改所属关键字</div>
      </el-form-item>

      <!-- 排序模式 -->
      <el-form-item label="排序模式" prop="sortMode" required>
        <el-select
          v-model="formData.sortMode"
          placeholder="请选择排序模式"
          class="form-select"
        >
          <el-option
            v-for="item in sortModeConfigs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 最大销售数量 -->
      <el-form-item label="最大销售数量" prop="maxSalesCount" required>
        <el-input-number
          v-model="formData.maxSalesCount"
          :min="1"
          :max="999"
          :precision="0"
          placeholder="请输入最大销售数量"
          class="form-input-number"
        />
      </el-form-item>

      <!-- 建议售价 -->
      <el-form-item label="建议售价" prop="suggestedPrice" required>
        <el-input-number
          v-model="formData.suggestedPrice"
          :min="0"
          :max="999999"
          :precision="2"
          placeholder="请输入建议售价"
          class="form-input-number"
        >
          <template #prefix>
            <span>¥</span>
          </template>
        </el-input-number>
      </el-form-item>

      <!-- 保存并继续 -->
      <el-form-item v-if="!isEdit">
        <el-checkbox v-model="continueAdd" :disabled="keywordOptions.length === 0">
          是否保存并继续新增
        </el-checkbox>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleReset">重置</el-button>
        <el-button 
          type="primary" 
          :loading="submitting" 
          :disabled="keywordOptions.length === 0"
          @click="handleSubmit"
        >
          确定(Y)
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import type { SalesUnitFormData, ModalType, RegionType, IndustryType, SortModeEnum } from '../types/salesUnitManage'
import { AuditStatusEnum } from '../types/salesUnitManage'
import { regionConfigs, industryConfigs, sortModeConfigs, checkDuplicate } from '../mock/salesUnitManageMock'
import { crmStore } from '../../store/crmStore'

// ==================== Props & Emits ====================
interface Props {
  modelValue: boolean
  type: ModalType
  data?: SalesUnitFormData
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    region: '' as RegionType,
    district: '',
    industry: '' as IndustryType,
    keyword: '',
    sortMode: '固定排名' as SortModeEnum,
    maxSalesCount: 1,
    suggestedPrice: 0
  })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: SalesUnitFormData, continueAdd: boolean): void
  (e: 'closed'): void
}>()

// ==================== 响应式数据 ====================
const formRef = ref<FormInstance>()
const submitting = ref(false)
const continueAdd = ref(false)

// 表单数据
const formData = reactive<SalesUnitFormData>({
  id: '',
  region: '' as RegionType,
  district: '',
  industry: '' as IndustryType,
  keyword: '',
  sortMode: '固定排名' as SortModeEnum,
  maxSalesCount: 1,
  suggestedPrice: 0
})

// 级联选择值 [region, district]
const regionCascaderValue = ref<string[]>([])

// 关键字选项列表（只显示已审核通过的关键字）
const keywordOptions = computed(() => {
  return crmStore.state.keywordList
    .filter(keyword => keyword.auditStatus === AuditStatusEnum.APPROVED)
    .map(keyword => ({
      value: keyword.name,
      label: keyword.name
    }))
})

// 级联地区选项
const regionCascaderOptions = regionConfigs

// ==================== 计算属性 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => props.type === 'edit')

const dialogTitle = computed(() => (isEdit.value ? '编辑销售单元' : '新增销售单元'))

// 表单校验规则
const formRules: FormRules = {
  region: [
    { required: true, message: '请选择所属地区', trigger: 'change' }
  ],
  industry: [
    { required: true, message: '请选择所属行业', trigger: 'change' }
  ],
  keyword: [
    { required: true, message: '请选择所属关键字', trigger: 'change' }
  ],
  sortMode: [
    { required: true, message: '请选择排序模式', trigger: 'change' }
  ],
  maxSalesCount: [
    { required: true, message: '请输入最大销售数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 999, message: '请输入1-999之间的数字', trigger: 'blur' }
  ],
  suggestedPrice: [
    { required: true, message: '请输入建议售价', trigger: 'blur' },
    { type: 'number', min: 0, max: 999999, message: '请输入有效的金额', trigger: 'blur' }
  ]
}

// ==================== 方法 ====================

/**
 * 初始化表单数据
 */
const initFormData = () => {
  if (isEdit.value && props.data) {
    // 编辑模式：回填数据
    Object.assign(formData, props.data)
    // 设置级联选择值
    if (props.data.region && props.data.district) {
      regionCascaderValue.value = [props.data.region, props.data.district]
    }
  } else {
    // 新增模式：清空表单
    formData.id = ''
    formData.region = '' as RegionType
    formData.district = ''
    formData.industry = '' as IndustryType
    formData.keyword = ''
    formData.sortMode = '固定排名' as SortModeEnum
    formData.maxSalesCount = 1
    formData.suggestedPrice = 0
    regionCascaderValue.value = []
    continueAdd.value = false
  }
}

/**
 * 处理地区级联变化
 */
const handleRegionChange = (value: string[]) => {
  if (value && value.length === 2) {
    formData.region = value[0] as RegionType
    formData.district = value[1]
  } else {
    formData.region = '' as RegionType
    formData.district = ''
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return
  
  // 检查是否有可用关键字
  if (keywordOptions.value.length === 0) {
    ElMessage.warning('请先创建关键字')
    return
  }

  // 检查是否选择了地区
  if (!formData.region || !formData.district) {
    ElMessage.warning('请选择完整的所属地区（市和区县）')
    return
  }

  try {
    await formRef.value.validate()
    submitting.value = true

    // 判重校验（新增时）
    if (!isEdit.value) {
      const duplicateRes = await checkDuplicate(formData.region, formData.district, formData.keyword)
      if (duplicateRes.data) {
        ElMessage.error('该区域已存在该关键词的销售单元，不可重复新增')
        submitting.value = false
        return
      }
    }

    // 触发提交事件
    emit('submit', { ...formData }, continueAdd.value)

    // 如果不继续新增，关闭弹窗
    if (!continueAdd.value) {
      visible.value = false
    } else {
      // 继续新增：清空表单
      formData.region = '' as RegionType
      formData.district = ''
      formData.industry = '' as IndustryType
      formData.keyword = ''
      formData.sortMode = '固定排名' as SortModeEnum
      formData.maxSalesCount = 1
      formData.suggestedPrice = 0
      regionCascaderValue.value = []
      // 重置校验状态
      formRef.value.resetFields()
    }
  } catch (error) {
    console.error('表单校验失败:', error)
  } finally {
    submitting.value = false
  }
}

/**
 * 重置表单
 */
const handleReset = () => {
  if (!formRef.value) return

  if (isEdit.value) {
    // 编辑模式：恢复原数据
    initFormData()
  } else {
    // 新增模式：清空表单
    formData.region = '' as RegionType
    formData.district = ''
    formData.industry = '' as IndustryType
    formData.keyword = ''
    formData.sortMode = '固定排名' as SortModeEnum
    formData.maxSalesCount = 1
    formData.suggestedPrice = 0
    regionCascaderValue.value = []
    continueAdd.value = false
    formRef.value.resetFields()
  }
}

/**
 * 弹窗关闭回调
 */
const handleClosed = () => {
  emit('closed')
}

// ==================== 监听 ====================
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    initFormData()
  }
})

watch(() => props.data, () => {
  if (visible.value) {
    initFormData()
  }
}, { deep: true })

// 监听关键字列表变化，实时更新下拉选项
watch(() => crmStore.state.keywordList, (newList) => {
  console.log('[销售单元表单] 关键字列表已更新:', newList.length)
}, { deep: true })
</script>

<style scoped lang="scss">
.sales-unit-form-dialog {
  :deep(.el-dialog__header) {
    background: #1a5fb4;
    margin-right: 0;
    padding: 15px 20px;

    .el-dialog__title {
      color: #fff;
      font-size: 15px;
      font-weight: 500;
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
  }

  :deep(.el-dialog__footer) {
    padding: 10px 20px 20px;
    border-top: 1px solid #e4e7ed;
  }
}

.sales-unit-form {
  .form-select {
    width: 100%;
  }

  .form-cascader {
    width: 100%;
  }

  .form-input {
    width: 100%;
  }

  .form-input-number {
    width: 100%;

    :deep(.el-input__wrapper) {
      padding-left: 11px;
    }
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  .form-warning {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #e6a23c;
    margin-top: 4px;
    padding: 6px 10px;
    background: #fdf6ec;
    border-radius: 4px;
    border-left: 3px solid #e6a23c;
  }

  :deep(.el-textarea__inner) {
    font-family: inherit;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
