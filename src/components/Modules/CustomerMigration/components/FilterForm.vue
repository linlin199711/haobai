<template>
  <el-card class="filter-card" shadow="never">
    <el-form
      ref="filterFormRef"
      :model="form"
      label-position="right"
      label-width="100px"
      class="filter-form"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="源客户名称">
            <el-input
              v-model="form.sourceCustomerName"
              placeholder="请输入源客户名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="源客户ID">
            <el-input
              v-model="form.sourceCustomerId"
              placeholder="请输入源客户ID"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="源客户号码">
            <el-input
              v-model="form.sourcePhoneNumber"
              placeholder="请输入源客户号码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="目标客户名称">
            <el-input
              v-model="form.targetCustomerName"
              placeholder="请输入目标客户名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="目标客户ID">
            <el-input
              v-model="form.targetCustomerId"
              placeholder="请输入目标客户ID"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="目标客户号码">
            <el-input
              v-model="form.targetPhoneNumber"
              placeholder="请输入目标客户号码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="16" :lg="12">
          <el-form-item label="地区选择">
            <el-select
              v-model="form.region"
              placeholder="请选择地区"
              clearable
              style="width: 200px; margin-right: 10px;"
            >
              <el-option
                v-for="region in regionOptions"
                :key="region.value"
                :label="region.label"
                :value="region.value"
              />
            </el-select>
            <el-checkbox v-model="form.includeSubRegions">包含下属地区</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" justify="end">
        <el-col :span="24" class="filter-buttons">
          <el-button type="primary" :loading="loading" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import type { FilterForm as FilterFormType, RegionOption } from '../types'
import { regionOptions as defaultRegionOptions } from '../mock'

const props = defineProps<{
  regionOptions?: RegionOption[]
}>()

const emit = defineEmits<{
  (e: 'search', form: FilterFormType): void
}>()

const filterFormRef = ref()
const loading = ref(false)

const regionOptions = props.regionOptions || defaultRegionOptions

const form = reactive<FilterFormType>({
  sourceCustomerName: '',
  sourceCustomerId: '',
  sourcePhoneNumber: '',
  targetCustomerName: '',
  targetCustomerId: '',
  targetPhoneNumber: '',
  region: '',
  includeSubRegions: false
})

const handleSearch = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  emit('search', { ...form })
  loading.value = false
}

const handleReset = () => {
  form.sourceCustomerName = ''
  form.sourceCustomerId = ''
  form.sourcePhoneNumber = ''
  form.targetCustomerName = ''
  form.targetCustomerId = ''
  form.targetPhoneNumber = ''
  form.region = ''
  form.includeSubRegions = false
  emit('search', { ...form })
}
</script>

<style scoped>
.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  padding: 10px 0;
}

.filter-buttons {
  padding-top: 10px;
}
</style>