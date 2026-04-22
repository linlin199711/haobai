/**
 * 批量添加同义关键字弹窗
 * @description 批量配置多个销售品关键字的同义关键字
 * @version 1.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    title="批量添加同义关键字"
    width="700px"
    :close-on-click-modal="false"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="batch-form"
    >
      <el-form-item label="销售品关键字" prop="mainKeywordIds">
        <el-select
          v-model="form.mainKeywordIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择销售品关键字（可多选）"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in mainKeywordOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span>{{ item.name }}</span>
            <el-tag size="small" type="info" class="ml-2">{{ item.category }}</el-tag>
          </el-option>
        </el-select>
        <div class="form-hint">可同时为多个销售品关键字配置相同的同义关键字</div>
      </el-form-item>

      <el-form-item label="同义关键字" prop="synonyms">
        <div class="synonym-input-wrapper">
          <el-input
            v-model="synonymInput"
            type="textarea"
            :rows="4"
            placeholder="输入同义关键字，每行一个，或用逗号分隔"
            @keyup.enter="handleBatchAddSynonyms"
          />
          <div class="input-actions">
            <el-button type="primary" size="small" @click="handleBatchAddSynonyms">
              批量添加
            </el-button>
            <el-button size="small" @click="handleClearInput">清空</el-button>
          </div>
        </div>
        <div class="synonym-list">
          <div class="list-header">
            <span>已添加的同义关键字（{{ form.synonyms.length }}个）</span>
            <el-button link type="danger" size="small" @click="handleClearAll">
              清空全部
            </el-button>
          </div>
          <div class="list-content">
            <el-tag
              v-for="(synonym, index) in form.synonyms"
              :key="index"
              closable
              class="synonym-tag"
              @close="handleRemoveSynonym(index)"
            >
              {{ synonym }}
            </el-tag>
            <el-empty
              v-if="form.synonyms.length === 0"
              description="暂无同义关键字"
              :image-size="60"
            />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="enabled">启用</el-radio>
          <el-radio label="disabled">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          确认批量添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { BatchSynonymForm } from '../types/synonymKeyword'
import { saveSynonymKeyword, mainKeywordOptions } from '../mock/synonymKeywordMock'

interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save'): void
}>()

// 弹窗可见性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = ref<BatchSynonymForm>({
  mainKeywordIds: [],
  synonyms: [],
  status: 'enabled'
})

// 同义关键字输入
const synonymInput = ref('')

// 保存状态
const saving = ref(false)

// 表单校验规则
const rules = {
  mainKeywordIds: [
    { required: true, message: '请至少选择一个销售品关键字', trigger: 'change', type: 'array' }
  ],
  synonyms: [
    {
      validator: (rule: any, value: string[], callback: Function) => {
        if (!value || value.length === 0) {
          callback(new Error('请至少添加一个同义关键字'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 批量添加同义关键字
const handleBatchAddSynonyms = () => {
  const input = synonymInput.value.trim()
  if (!input) {
    ElMessage.warning('请输入同义关键字')
    return
  }

  // 支持换行和逗号分隔
  const synonyms = input
    .split(/[\n,，]/)
    .map(s => s.trim())
    .filter(s => s)

  const added: string[] = []
  const existed: string[] = []

  synonyms.forEach(name => {
    if (form.value.synonyms.includes(name)) {
      existed.push(name)
    } else {
      form.value.synonyms.push(name)
      added.push(name)
    }
  })

  if (added.length > 0) {
    ElMessage.success(`成功添加 ${added.length} 个同义关键字`)
  }
  if (existed.length > 0) {
    ElMessage.warning(`${existed.join('、')} 已存在`)
  }

  synonymInput.value = ''
}

// 清空输入
const handleClearInput = () => {
  synonymInput.value = ''
}

// 移除同义关键字
const handleRemoveSynonym = (index: number) => {
  form.value.synonyms.splice(index, 1)
}

// 清空全部
const handleClearAll = () => {
  form.value.synonyms = []
}

// 保存
const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    let successCount = 0
    let failCount = 0

    // 为每个销售品关键字保存配置
    for (const keywordId of form.value.mainKeywordIds) {
      const keyword = mainKeywordOptions.find(item => item.id === keywordId)
      if (keyword) {
        try {
          await saveSynonymKeyword({
            mainKeyword: keyword.name,
            mainKeywordId: keyword.id,
            synonyms: form.value.synonyms,
            status: form.value.status
          })
          successCount++
        } catch {
          failCount++
        }
      }
    }

    if (successCount > 0) {
      ElMessage.success(`成功配置 ${successCount} 个销售品关键字`)
      visible.value = false
      emit('save')
    } else {
      ElMessage.error('配置失败')
    }
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 弹窗关闭
const handleClosed = () => {
  formRef.value?.resetFields()
  form.value = {
    mainKeywordIds: [],
    synonyms: [],
    status: 'enabled'
  }
  synonymInput.value = ''
}
</script>

<style scoped lang="scss">
.batch-form {
  .form-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  .synonym-input-wrapper {
    .input-actions {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }
  }

  .synonym-list {
    margin-top: 16px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;
      font-size: 14px;
      color: #606266;
    }

    .list-content {
      padding: 12px;
      min-height: 120px;
      max-height: 200px;
      overflow-y: auto;

      .synonym-tag {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
