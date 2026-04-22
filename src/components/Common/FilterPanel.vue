<!--
  通用筛选区组件
  @description 基于 Element Plus 的数据筛选区组件，每行4个搜索选项
  @version 2.0.0
-->
<template>
  <div class="filter-panel">
    <el-form :model="formData" class="filter-form">
      <!-- 筛选选项网格：每行4个 -->
      <div class="filter-grid">
        <slot name="filters">
          <!-- 默认筛选项 -->
          <div
            v-for="(filter, index) in filters"
            :key="index"
            class="filter-item"
          >
            <label class="filter-label">{{ filter.label }}</label>

            <!-- 下拉选择框 -->
            <el-select
              v-if="filter.type === 'select'"
              v-model="formData[filter.field]"
              :placeholder="filter.placeholder || '请选择'"
              clearable
              class="filter-control"
            >
              <el-option
                v-for="option in filter.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 文本输入框 -->
            <el-input
              v-else-if="filter.type === 'text'"
              v-model="formData[filter.field]"
              :placeholder="filter.placeholder || '请输入'"
              clearable
              class="filter-control"
            />

            <!-- 日期选择器 -->
            <el-date-picker
              v-else-if="filter.type === 'date'"
              v-model="formData[filter.field]"
              type="date"
              :placeholder="filter.placeholder || '选择日期'"
              value-format="YYYY-MM-DD"
              class="filter-control"
            />

            <!-- 日期时间选择器 -->
            <el-date-picker
              v-else-if="filter.type === 'datetime'"
              v-model="formData[filter.field]"
              type="datetime"
              :placeholder="filter.placeholder || '选择时间'"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="filter-control"
            />

            <!-- 数字输入框 -->
            <el-input-number
              v-else-if="filter.type === 'number'"
              v-model="formData[filter.field]"
              :placeholder="filter.placeholder || '请输入数字'"
              :min="0"
              controls-position="right"
              class="filter-control"
            />

            <!-- 复选框 -->
            <el-checkbox
              v-else-if="filter.type === 'checkbox'"
              v-model="formData[filter.field]"
              class="filter-checkbox"
            >
              {{ filter.checkboxLabel || filter.label }}
            </el-checkbox>
          </div>
        </slot>
      </div>

      <!-- 按钮区域：底部右侧对齐 -->
      <div class="filter-actions">
        <el-button
          @click="handleReset"
          :icon="RefreshLeft"
        >
          重置
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          :icon="Search"
          @click="handleSearch"
        >
          {{ loading ? '搜索中...' : '搜索' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

// 筛选项配置接口
export interface FilterItem {
  /** 字段名 */
  field: string
  /** 标签文本 */
  label: string
  /** 输入类型 */
  type: 'select' | 'text' | 'date' | 'datetime' | 'number' | 'checkbox'
  /** 占位符文本 */
  placeholder?: string
  /** 复选框标签（仅checkbox类型） */
  checkboxLabel?: string
  /** 选项列表（仅select类型） */
  options?: { label: string; value: string | number }[]
  /** 默认值 */
  defaultValue?: any
}

// 组件Props
interface Props {
  /** 筛选配置 */
  filters: FilterItem[]
  /** 加载状态 */
  loading?: boolean
  /** 初始表单数据 */
  initialData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialData: () => ({})
})

// 组件事件
const emit = defineEmits<{
  (e: 'search', data: Record<string, any>): void
  (e: 'reset'): void
}>()

// 表单数据
const formData = reactive<Record<string, any>>({})

// 初始化表单数据
const initFormData = () => {
  props.filters.forEach(filter => {
    formData[filter.field] = props.initialData[filter.field] ?? filter.defaultValue ?? ''
  })
}

// 搜索
const handleSearch = () => {
  emit('search', { ...formData })
}

// 重置
const handleReset = () => {
  props.filters.forEach(filter => {
    formData[filter.field] = filter.defaultValue ?? ''
  })
  emit('reset')
}

// 监听初始数据变化
watch(() => props.initialData, () => {
  initFormData()
}, { deep: true })

// 初始化
initFormData()

// 暴露方法
defineExpose({
  getFormData: () => ({ ...formData }),
  setFormData: (data: Record<string, any>) => {
    Object.assign(formData, data)
  },
  reset: handleReset
})
</script>

<style scoped lang="scss">
.filter-panel {
  background: #fff;
  border-radius: 4px;
  padding: 16px 20px;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// 筛选网格：每行4个
.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 20px;

  // 响应式适配
  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

// 筛选项
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

// 标签
.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

// 控件
.filter-control {
  width: 100%;

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    width: 100%;
  }
}

// 复选框
.filter-checkbox {
  height: 32px;
  display: flex;
  align-items: center;
}

// 按钮区域
.filter-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  margin-top: 8px;
}
</style>
