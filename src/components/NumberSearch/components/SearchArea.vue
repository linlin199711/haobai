/**
 * 号码本地搜 - 搜索区域组件
 * @description 搜索表单区域，支持号码搜索和地区搜索模式切换
 * @version 2.0.0
 */

<template>
  <div class="search-area">
    <!-- 搜索模式切换和搜索框 -->
    <div class="search-mode-wrapper">
      <div class="search-mode-left">
        <el-select
          v-model="searchMode"
          class="mode-select"
          @change="handleModeChange"
        >
          <el-option label="号码搜索" value="number" />
          <el-option label="地区搜索" value="area" />
        </el-select>

        <template v-if="searchMode === 'area'">
          <el-input
            v-model="areaKeyword"
            :placeholder="areaPlaceholder"
            clearable
            class="search-input"
            @keyup.enter="handleAreaSearch"
            ref="areaInputRef"
          >
            <template #prefix>
              <el-icon><Location /></el-icon>
            </template>
          </el-input>

          <el-button type="primary" :loading="loading" @click="handleMainSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </template>
      </div>

      <div v-if="searchMode === 'area'" class="search-mode-right">
        <el-button @click="handleReset">
          <el-icon><RefreshRight /></el-icon>
          重置
        </el-button>
      </div>
    </div>

    <!-- 高级搜索条件（仅号码搜索模式显示） -->
    <el-form
      v-if="searchMode === 'number'"
      :model="searchForm"
      inline
      class="search-form"
    >
      <!-- 通用搜索 -->
      <el-row :gutter="16" class="general-search-row">
        <el-col :span="18">
          <el-form-item label="通用搜索" class="form-item general-search-item">
            <el-input
              v-model="searchForm.generalKeyword"
              placeholder="请输入关键词，模糊查询名称、号码、地址、简称编码等"
              clearable
              size="default"
              class="general-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="btn-col">
          <el-form-item class="form-item">
            <el-button
              type="primary"
              :loading="loading"
              @click="handleSearch"
            >
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>

    <!-- 地区搜索提示（仅地区搜索模式显示） -->
    <div v-else class="area-search-tips">
      <el-alert
        title="地区搜索支持："
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <span>支持地市/区县名称搜索、拼音首字母匹配（如：输入"fz"匹配"福州"）</span>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Location, Search, RefreshRight } from '@element-plus/icons-vue'
import type { SearchParams, CityInfo, DistrictInfo } from '../types'
import type { SearchMode } from '../types/areaSearch'

interface Props {
  searchForm: SearchParams
  cities: CityInfo[]
  districts: DistrictInfo[]
  loading: boolean
  modelValue?: SearchMode
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'number'
})

const emit = defineEmits<{
  (e: 'update:searchForm', value: SearchParams): void
  (e: 'update:modelValue', value: SearchMode): void
  (e: 'search'): void
  (e: 'areaSearch', keyword: string): void
  (e: 'reset'): void
  (e: 'cityChange'): void
  (e: 'modeChange', mode: SearchMode): void
}>()

// 搜索模式
const searchMode = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 地区搜索关键词
const areaKeyword = ref('')

// 输入框引用
const areaInputRef = ref<HTMLInputElement>()

// 搜索提示文字
const areaPlaceholder = '请输入地区名称或拼音首字母'

// 主搜索按钮处理
const handleMainSearch = () => {
  handleAreaSearch()
}

// 号码搜索
const handleSearch = () => {
  emit('search')
}

// 地区搜索
const handleAreaSearch = () => {
  if (!areaKeyword.value.trim()) {
    return
  }
  emit('areaSearch', areaKeyword.value.trim())
}

// 重置
const handleReset = () => {
  if (searchMode.value === 'area') {
    areaKeyword.value = ''
  }
  emit('reset')
}

// 地市切换
const handleCityChange = () => {
  emit('cityChange')
}

// 搜索模式切换
const handleModeChange = async (mode: SearchMode) => {
  // 清空当前搜索内容
  areaKeyword.value = ''
  
  // 清空表单
  const emptyForm: SearchParams = {
    generalKeyword: '',
    customerName: '',
    phoneNumber: '',
    nameCode: '',
    relatedWords: '',
    city: '',
    district: ''
  }
  emit('update:searchForm', emptyForm)
  
  // 通知父组件模式变化
  emit('modeChange', mode)
  
  // 自动聚焦到输入框
  await nextTick()
  areaInputRef.value?.focus()
  
  // 记录日志
  console.log(`[系统日志] 搜索模式切换为: ${mode === 'number' ? '号码搜索' : '地区搜索'}`)
}
</script>

<style scoped lang="scss">
.search-area {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

// 搜索模式切换区域
.search-mode-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  .search-mode-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;

    .mode-select {
      width: 120px;

      :deep(.el-input__wrapper) {
        background: #f5f7fa;
      }
    }

    .search-input {
      flex: 1;
      max-width: 400px;
    }
  }

  .search-mode-right {
    display: flex;
    gap: 8px;
  }
}

// 高级搜索表单
.search-form {
  .general-search-row {
    margin-bottom: 8px;

    .general-search-item {
      :deep(.el-form-item__label) {
        font-size: 15px;
        color: #303133;
        font-weight: 600;
      }

      .general-input {
        :deep(.el-input__wrapper) {
          padding-left: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

          .el-input__inner {
            font-size: 15px;
          }
        }

        :deep(.el-input-group__append) {
          padding: 0;

          .el-button {
            border-radius: 0 4px 4px 0;
            padding: 0 20px;
            height: 100%;
          }
        }
      }
    }
  }

  .search-divider {
    margin: 12px 0 16px;
  }

  .form-item {
    margin-bottom: 0;
    width: 100%;

    :deep(.el-form-item__label) {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 100%;
    }
  }

  .second-row {
    margin-top: 12px;
  }

  .btn-col {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    .el-button {
      min-width: 80px;
    }
  }
}

// 地区搜索提示
.area-search-tips {
  margin-top: 8px;

  :deep(.el-alert) {
    padding: 12px 16px;

    .el-alert__title {
      font-weight: 500;
    }
  }
}
</style>
