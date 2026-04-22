/**
 * 号码本地搜 - 主组件
 * @description 话务台嵌套下的号码本地搜页面，支持号码搜索和地区搜索
 * @version 3.0.0
 */

<template>
  <div class="number-search-container">
    <!-- 左侧：搜索和结果区域 -->
    <div class="main-area">
      <!-- 搜索区域 -->
      <SearchArea
        v-model="searchMode"
        v-model:search-form="searchForm"
        :cities="cities"
        :districts="currentDistricts"
        :loading="loading.search"
        @search="handleSearch"
        @area-search="handleAreaSearch"
        @reset="handleReset"
        @city-change="handleCityChange"
        @mode-change="handleModeChange"
      />

      <!-- 号码搜索结果列表 -->
      <ResultList
        v-if="searchMode === 'number'"
        :data="searchResult.list"
        :loading="loading.search"
        :pagination="pagination"
        :agent-status="agentStatus"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @row-click="handleRowClick"
        @dial="handleDial"
        @transfer="handleTransfer"
        @sms="handleSms"
        @view-parent="handleViewParent"
        @view-children="handleViewChildren"
      />

      <!-- 地区搜索结果列表 -->
      <AreaResultList
        v-else
        :data="areaSearchResults"
        :loading="loading.areaSearch"
        @refresh="handleAreaRefresh"
        @export="handleAreaExport"
        @select="handleAreaSelect"
      />
    </div>

    <!-- 右侧：客户详情区域（仅号码搜索模式显示） -->
    <div v-if="searchMode === 'number'" class="detail-area" :class="{ 'is-visible': showDetail }">
      <CustomerDetailPanel
        v-if="showDetail"
        :customer="currentCustomer"
        :cascade-data="cascadeData"
        @close="showDetail = false"
      />
      <div v-else class="detail-placeholder">
        <el-empty description="点击左侧列表查看详情">
          <el-icon :size="48" class="placeholder-icon"><Document /></el-icon>
        </el-empty>
      </div>
    </div>

    <!-- 拍号确认弹窗 -->
    <DialConfirmDialog
      v-model="showDialDialog"
      :customer="currentCustomer"
      :loading="loading.dial"
      @confirm="confirmDial"
    />

    <!-- 转接弹窗 -->
    <TransferDialog
      v-model="showTransferDialog"
      :customer="currentCustomer"
      :loading="loading.transfer"
      @confirm="confirmTransfer"
    />

    <!-- 短信发送弹窗 -->
    <SmsDialog
      v-model="showSmsDialog"
      :customer="currentCustomer"
      :loading="loading.sms"
      @confirm="confirmSms"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import SearchArea from './components/SearchArea.vue'
import ResultList from './components/ResultList.vue'
import AreaResultList from './components/AreaResultList.vue'
import CustomerDetailPanel from './components/CustomerDetailPanel.vue'
import DialConfirmDialog from './components/DialConfirmDialog.vue'
import TransferDialog from './components/TransferDialog.vue'
import SmsDialog from './components/SmsDialog.vue'
import type {
  SearchParams,
  SearchResult,
  CustomerInfo,
  CityInfo,
  DistrictInfo,
  TransferTarget,
  SmsTemplate,
  AgentStatus
} from './types'
import type { SearchMode, AreaSearchResult } from './types/areaSearch'
import * as api from './mock'
import { searchArea, getAllCities, mockCities } from './mock/areaData'

// ==================== 搜索模式 ====================
const searchMode = ref<SearchMode>('number')

// 搜索表单
const searchForm = reactive<SearchParams>({
  generalKeyword: '',
  customerName: '',
  phoneNumber: '',
  nameCode: '',
  relatedWords: '',
  city: '',
  district: '',
  page: 1,
  pageSize: 10
})

// 加载状态
const loading = reactive({
  search: false,
  areaSearch: false,
  dial: false,
  transfer: false,
  sms: false
})

// 地市列表
const cities = ref<CityInfo[]>([])

// 搜索结果
const searchResult = reactive<SearchResult>({
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0
})

// 地区搜索结果
const areaSearchResults = ref<AreaSearchResult[]>([])

// 分页信息
const pagination = computed(() => ({
  page: searchResult.page,
  pageSize: searchResult.pageSize,
  total: searchResult.total,
  totalPages: searchResult.totalPages
}))

// 当前选中的客户
const currentCustomer = ref<CustomerInfo | null>(null)

// 级联数据
const cascadeData = ref<{
  parent: CustomerInfo | null
  children: CustomerInfo[]
}>({
  parent: null,
  children: []
})

// 是否显示详情
const showDetail = ref(false)

// 弹窗显示状态
const showDialDialog = ref(false)
const showTransferDialog = ref(false)
const showSmsDialog = ref(false)

// 转接目标列表
const transferTargets = ref<TransferTarget[]>([])

// 短信模板列表
const smsTemplates = ref<SmsTemplate[]>([])

// 坐席状态
const agentStatus = reactive<AgentStatus>({
  isOnline: true,
  isBusy: false,
  city: 'fuzhou',
  noIncomingCall: false
})

// 当前地市对应的区县
const currentDistricts = computed<DistrictInfo[]>(() => {
  if (!searchForm.city) return []
  const city = cities.value.find(c => c.code === searchForm.city)
  return city?.districts || []
})

// ==================== 初始化 ====================
onMounted(async () => {
  // 获取地市列表
  const citiesRes = await getAllCities()
  cities.value = citiesRes
  // 默认选中当前坐席地市
  const defaultCity = cities.value.find(c => c.code === agentStatus.city)
  if (defaultCity) {
    searchForm.city = defaultCity.code
  }

  // 获取坐席状态
  const statusRes = await api.getAgentStatus()
  if (statusRes.success) {
    Object.assign(agentStatus, statusRes.data)
  }

  // 获取转接目标
  const targetsRes = await api.getTransferTargets()
  if (targetsRes.success) {
    transferTargets.value = targetsRes.data
  }

  // 获取短信模板
  const templatesRes = await api.getSmsTemplates()
  if (templatesRes.success) {
    smsTemplates.value = templatesRes.data
  }
})

// ==================== 搜索模式切换 ====================
const handleModeChange = (mode: SearchMode) => {
  searchMode.value = mode
  
  // 清空当前结果
  if (mode === 'number') {
    areaSearchResults.value = []
    handleSearch()
  } else {
    searchResult.list = []
    searchResult.total = 0
  }
  
  // 关闭详情面板
  showDetail.value = false
  currentCustomer.value = null
}

// ==================== 号码搜索 ====================
const handleCityChange = () => {
  searchForm.district = ''
}

const handleSearch = async () => {
  loading.search = true
  try {
    const res = await api.searchCustomers({ ...searchForm })
    if (res.success) {
      Object.assign(searchResult, res.data)
      if (res.data.list.length === 0) {
        ElMessage.info('暂无匹配数据')
      }
    }
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    loading.search = false
  }
}

// ==================== 地区搜索 ====================
const handleAreaSearch = async (keyword: string) => {
  if (!keyword.trim()) {
    ElMessage.warning('请输入地区名称或拼音首字母')
    return
  }

  loading.areaSearch = true
  try {
    const res = await searchArea({ keyword: keyword.trim() })
    areaSearchResults.value = res.list
    
    if (res.list.length === 0) {
      ElMessage.info('暂无匹配的地区信息')
    } else {
      ElMessage.success(`找到 ${res.total} 条结果`)
    }
  } catch (error) {
    ElMessage.error('地区搜索失败')
  } finally {
    loading.areaSearch = false
  }
}

const handleAreaRefresh = () => {
  ElMessage.info('刷新完成')
}

const handleAreaExport = () => {
  if (areaSearchResults.value.length === 0) {
    ElMessage.warning('没有可导出的数据')
    return
  }
  
  // 导出CSV
  const data = areaSearchResults.value.map(item => {
    if (item.type === 'city' && item.city) {
      return {
        类型: '地市',
        名称: item.city.name,
        邮编: item.city.zipCode,
        区号: item.city.areaCode,
        拼音: item.city.pinyin
      }
    } else if (item.type === 'district' && item.district) {
      return {
        类型: '区县',
        名称: item.district.name,
        所属地市: item.district.cityName,
        地市邮编: item.district.cityZipCode,
        地市区号: item.district.cityAreaCode,
        区县邮编: item.district.zipCode
      }
    }
    return {}
  })
  
  const headers = Object.keys(data[0] || {})
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${(row as any)[h] || ''}"`).join(','))
  ].join('\n')
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `地区搜索结果_${new Date().toLocaleDateString()}.csv`
  link.click()
  
  ElMessage.success('导出成功')
}

const handleAreaSelect = (item: AreaSearchResult) => {
  console.log('选中地区:', item)
  // 可以在这里添加选中后的处理逻辑
}

// ==================== 重置 ====================
const handleReset = () => {
  if (searchMode.value === 'number') {
    searchForm.generalKeyword = ''
    searchForm.customerName = ''
    searchForm.phoneNumber = ''
    searchForm.nameCode = ''
    searchForm.relatedWords = ''
    searchForm.city = ''
    searchForm.district = ''
    searchForm.page = 1
    searchResult.list = []
    searchResult.total = 0
    showDetail.value = false
  } else {
    areaSearchResults.value = []
  }

  ElMessage.success('已重置搜索条件')
}

// ==================== 分页 ====================
const handlePageChange = (page: number) => {
  searchForm.page = page
  handleSearch()
}

const handlePageSizeChange = (pageSize: number) => {
  searchForm.pageSize = pageSize
  searchForm.page = 1
  handleSearch()
}

// ==================== 行点击 ====================
const handleRowClick = async (row: CustomerInfo) => {
  currentCustomer.value = row
  await loadCascadeData(row)
  showDetail.value = true
}

const loadCascadeData = async (row: CustomerInfo) => {
  cascadeData.value = {
    parent: null,
    children: row.children || []
  }

  if (row.parentId) {
    const res = await api.getCustomerDetail(row.parentId)
    if (res.success) {
      cascadeData.value.parent = res.data
    }
  }
}

// ==================== 查看上级/下级 ====================
const handleViewParent = async (row: CustomerInfo) => {
  if (row.parentId) {
    const res = await api.getCustomerDetail(row.parentId)
    if (res.success) {
      searchResult.list = [res.data]
      searchResult.total = 1
      searchResult.totalPages = 1
      searchResult.page = 1
      ElMessage.success(`已显示 ${row.name} 的上级单位`)
      showDetail.value = false
      currentCustomer.value = null
    }
  }
}

const handleViewChildren = async (row: CustomerInfo) => {
  if (row.children && row.children.length > 0) {
    searchResult.list = row.children
    searchResult.total = row.children.length
    searchResult.totalPages = 1
    searchResult.page = 1
    ElMessage.success(`已显示 ${row.name} 的 ${row.children.length} 个下级单位`)
    showDetail.value = false
    currentCustomer.value = null
  }
}

// ==================== 拍号 ====================
const handleDial = (row: CustomerInfo) => {
  if (row.isOutOfService) {
    ElMessage.warning('该号码已停机，无法拍号')
    return
  }
  currentCustomer.value = row
  showDialDialog.value = true
}

const confirmDial = async () => {
  if (!currentCustomer.value) return
  
  loading.dial = true
  try {
    const res = await api.dialNumber({
      customerId: currentCustomer.value.id,
      phoneNumber: currentCustomer.value.phoneNumber,
      customerName: currentCustomer.value.name
    })
    if (res.success) {
      ElMessage.success(res.message)
      showDialDialog.value = false
    }
  } catch (error) {
    ElMessage.error('拍号失败')
  } finally {
    loading.dial = false
  }
}

// ==================== 转接 ====================
const handleTransfer = (row: CustomerInfo) => {
  if (agentStatus.isBusy) {
    ElMessage.warning('示忙状态下无法转接')
    return
  }
  if (agentStatus.noIncomingCall) {
    ElMessage.warning('不进线权限开启，无法转接')
    return
  }
  currentCustomer.value = row
  showTransferDialog.value = true
}

const confirmTransfer = async () => {
  if (!currentCustomer.value) return
  
  loading.transfer = true
  try {
    const res = await api.transferToCustomer({
      customerId: currentCustomer.value.id,
      customerName: currentCustomer.value.name,
      phoneNumber: currentCustomer.value.phoneNumber
    })
    if (res.success) {
      ElMessage.success(`已将来电转接至客户号码：${currentCustomer.value.phoneNumber}`)
      showTransferDialog.value = false
    }
  } catch (error) {
    ElMessage.error('转接失败')
  } finally {
    loading.transfer = false
  }
}

// ==================== 短信 ====================
const handleSms = (row: CustomerInfo) => {
  currentCustomer.value = row
  showSmsDialog.value = true
}

const confirmSms = async (content: string) => {
  if (!currentCustomer.value) return
  
  loading.sms = true
  try {
    const res = await api.sendSmsToCaller({
      customerId: currentCustomer.value.id,
      customerName: currentCustomer.value.name,
      customerPhone: currentCustomer.value.phoneNumber,
      customerAddress: currentCustomer.value.address,
      content
    })
    if (res.success) {
      ElMessage.success('短信已发送给来电用户')
      showSmsDialog.value = false
    }
  } catch (error) {
    ElMessage.error('短信发送失败')
  } finally {
    loading.sms = false
  }
}
</script>

<style scoped lang="scss">
.number-search-container {
  height: 100%;
  display: flex;
  background-color: #f5f7fa;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.detail-area {
  flex: 0 0 380px;
  background: #fff;
  border-left: 1px solid #ebeef5;
  overflow-y: auto;
  transition: all 0.3s ease;

  &.is-visible {
    background: #fff;
  }

  .detail-placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;

    .placeholder-icon {
      color: #c0c4cc;
      margin-bottom: 16px;
    }
  }
}
</style>
