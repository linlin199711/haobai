/**
 * 同义关键字编辑弹窗
 * @description 新增/编辑销售品关键字与同义关键字的关联
 * @version 1.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="edit-form"
    >
      <el-form-item label="销售品关键字" prop="mainKeywordId">
        <el-select
          v-model="form.mainKeywordId"
          placeholder="请选择销售品关键字"
          style="width: 100%"
          :disabled="isEdit"
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
      </el-form-item>

      <el-form-item label="同义关键字" prop="synonyms">
        <div class="synonym-input-wrapper">
          <el-input
            v-model="synonymInput"
            placeholder="输入同义关键字，按回车确认"
            @keyup.enter="handleAddSynonym"
          >
            <template #append>
              <el-button @click="handleAddSynonym">添加</el-button>
            </template>
          </el-input>
          <div class="synonym-hint">提示：可同时添加多个，用逗号分隔</div>
        </div>
        <div class="synonym-list">
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
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { SynonymKeyword, SynonymKeywordForm } from '../types/synonymKeyword'
import { saveSynonymKeyword, mainKeywordOptions } from '../mock/synonymKeywordMock'

interface Props {
  modelValue: boolean
  data: SynonymKeyword | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null
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

// 是否为编辑模式
const isEdit = computed(() => !!props.data)

// 弹窗标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑同义关键字' : '新增同义关键字关联'
})

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = ref<SynonymKeywordForm>({
  mainKeyword: '',
  mainKeywordId: '',
  synonyms: [],
  status: 'enabled'
})

// 同义关键字输入
const synonymInput = ref('')

// 保存状态
const saving = ref(false)

// 表单校验规则
const rules = {
  mainKeywordId: [
    { required: true, message: '请选择销售品关键字', trigger: 'change' }
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

// 监听数据变化
watch(() => props.data, (newVal) => {
  if (newVal) {
    // 编辑模式
    form.value = {
      id: newVal.id,
      mainKeyword: newVal.mainKeyword,
      mainKeywordId: newVal.mainKeywordId,
      synonyms: newVal.synonyms.map(s => s.name),
      status: newVal.status
    }
  } else {
    // 新增模式
    form.value = {
      mainKeyword: '',
      mainKeywordId: '',
      synonyms: [],
      status: 'enabled'
    }
    synonymInput.value = ''
  }
}, { immediate: true })

// 监听销售品关键字选择变化
watch(() => form.value.mainKeywordId, (newVal) => {
  const keyword = mainKeywordOptions.find(item => item.id === newVal)
  if (keyword) {
    form.value.mainKeyword = keyword.name
  }
})

// 添加同义关键字
const handleAddSynonym = () => {
  const input = synonymInput.value.trim()
  if (!input) {
    ElMessage.warning('请输入同义关键字')
    return
  }

  // 支持逗号分隔批量添加
  const synonyms = input.split(/[,，]/).map(s => s.trim()).filter(s => s)
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

// 移除同义关键字
const handleRemoveSynonym = (index: number) => {
  form.value.synonyms.splice(index, 1)
}

// 保存
const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    const res = await saveSynonymKeyword(form.value)
    if (res) {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      visible.value = false
      emit('save')
    } else {
      ElMessage.error('保存失败')
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
  synonymInput.value = ''
}
</script>

<style scoped lang="scss">
.edit-form {
  .synonym-input-wrapper {
    .synonym-hint {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  .synonym-list {
    margin-top: 12px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
    min-height: 100px;

    .synonym-tag {
      margin-right: 8px;
      margin-bottom: 8px;
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
