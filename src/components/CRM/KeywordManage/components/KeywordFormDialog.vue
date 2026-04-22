<!--
  销售品关键字管理 - 新增/编辑弹窗
  @description 关键字新增和编辑表单弹窗
  @version 1.0.0
-->
<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
    class="keyword-form-dialog"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="keyword-form"
    >
      <!-- 关键字名称 -->
      <el-form-item label="关键字名称" prop="name" required>
        <el-input
          v-model="formData.name"
          placeholder="请输入关键字名称"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>

      <!-- 关键字编码 -->
      <el-form-item label="关键字编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="请输入关键字编码"
          maxlength="20"
          show-word-limit
          clearable
          :disabled="isEdit"
        />
        <div v-if="isEdit" class="form-tip">编码提交后不可修改</div>
      </el-form-item>

      <!-- 关键字说明 -->
      <el-form-item label="关键字说明" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入关键字说明"
          maxlength="100"
          show-word-limit
          resize="none"
        />
      </el-form-item>

      <!-- 保存并继续 -->
      <el-form-item v-if="!isEdit">
        <el-checkbox v-model="continueAdd">
          是否保存并继续新增
        </el-checkbox>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定(Y)
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { KeywordFormData, ModalType } from '../types/keywordManage'

// ==================== Props & Emits ====================
interface Props {
  modelValue: boolean
  type: ModalType
  data?: KeywordFormData
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    name: '',
    code: '',
    description: ''
  })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: KeywordFormData, continueAdd: boolean): void
  (e: 'closed'): void
}>()

// ==================== 响应式数据 ====================
const formRef = ref<FormInstance>()
const submitting = ref(false)
const continueAdd = ref(false)

// 表单数据
const formData = reactive<KeywordFormData>({
  id: '',
  name: '',
  code: '',
  description: ''
})

// ==================== 计算属性 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => props.type === 'edit')

const dialogTitle = computed(() => (isEdit.value ? '编辑关键字' : '新增关键字'))

// 表单校验规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入关键字名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
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
  } else {
    // 新增模式：清空表单
    formData.id = ''
    formData.name = ''
    formData.code = ''
    formData.description = ''
    continueAdd.value = false
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 触发提交事件
    emit('submit', { ...formData }, continueAdd.value)

    // 如果不继续新增，关闭弹窗
    if (!continueAdd.value) {
      visible.value = false
    } else {
      // 继续新增：清空表单（保留编码可选）
      formData.name = ''
      formData.description = ''
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
    formData.name = ''
    formData.code = ''
    formData.description = ''
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
</script>

<style scoped lang="scss">
.keyword-form-dialog {
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

.keyword-form {
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
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
