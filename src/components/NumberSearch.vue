<template>
  <div class="number-search-page">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card shadow="hover">
        <el-form :model="searchForm" inline @submit.prevent="handleSearch">
          <el-form-item label="搜索维度">
            <el-select v-model="searchForm.dimension" placeholder="请选择搜索维度" style="width: 150px">
              <el-option label="名称" value="name" />
              <el-option label="地址" value="address" />
              <el-option label="号码" value="phone" />
              <el-option label="业务信息" value="business" />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索内容">
            <el-input 
              v-model="searchForm.keyword" 
              placeholder="请输入搜索内容（支持空格分隔多关键词）" 
              style="width: 350px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="searchLoading" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-section">
      <el-row :gutter="15">
        <el-col :span="4">
          <el-button 
            type="primary" 
            :disabled="!canPaihao" 
            :loading="paihaoLoading"
            @click="handlePaihao"
          >
            拍号
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button 
            type="success" 
            :disabled="!canSendSms" 
            @click="openSmsDialog"
          >
            短信发送
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button 
            type="warning" 
            :disabled="!canTransfer" 
            @click="openTransferDialog"
          >
            转接
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button 
            type="info" 
            :disabled="!selectedNumber" 
            @click="openHierarchySidebar"
          >
            上下级号码
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button 
            type="info" 
            @click="openAreaCodeDialog"
          >
            查区号/邮编
          </el-button>
        </el-col>
        <el-col :span="4" v-if="agentCity === '厦门'">
          <el-button 
            type="danger" 
            @click="openJieliuReport"
          >
            截流播报
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 权限提示 -->
    <div v-if="noIncomingCallPermission" class="permission-notice">
      <el-alert
        title="不进线权限已开启，部分操作受限"
        type="warning"
        show-icon
        :closable="false"
      />
    </div>

    <!-- 搜索结果区域 -->
    <div class="result-section">
      <el-table
        v-loading="searchLoading"
        :data="searchResults"
        border
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="number" label="号码" width="130">
          <template #default="{ row }">
            <span :class="{ 'secret-number': row.isSecret }">
              {{ row.number }}
              <el-tag v-if="row.isSecret" type="danger" size="small">保密</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="businessInfo" label="业务信息" min-width="150" show-overflow-tooltip />
        <el-table-column prop="city" label="地市" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === '停机'" type="danger">{{ row.status }}</el-tag>
            <el-tag v-else type="success">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click.stop="handleReverseLookup(row)">
              反查
            </el-button>
            <el-button type="text" size="small" @click.stop="handlePaihaoRow(row)">
              拍号
            </el-button>
            <el-button type="text" size="small" @click.stop="handleSendSmsRow(row)">
              短信
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空数据提示 -->
      <div v-if="!searchLoading && searchResults.length === 0 && hasSearched" class="empty-result">
        <el-empty description="暂无匹配数据" />
      </div>

      <!-- 分页 -->
      <div v-if="searchResults.length > 0" class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 拍号确认弹窗 -->
    <el-dialog
      v-model="paihaoDialogVisible"
      title="拍号确认"
      width="450px"
    >
      <div class="paihao-content">
        <p>确定要拍号吗？</p>
        <div class="number-info">
          <span class="label">目标号码：</span>
          <span class="value">{{ selectedNumber?.number }}</span>
        </div>
        <div class="number-info">
          <span class="label">客户名称：</span>
          <span class="value">{{ selectedNumber?.name }}</span>
        </div>
        <div class="number-info">
          <span class="label">客户地址：</span>
          <span class="value">{{ selectedNumber?.address }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paihaoDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="paihaoLoading" @click="confirmPaihao">确认拍号</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 短信发送弹窗 -->
    <SmsDialog
      v-model="smsDialogVisible"
      :phone-number="selectedSmsNumber"
      @send-success="handleSmsSendSuccess"
    />

    <!-- 转接弹窗 -->
    <TransferDialog
      v-model="transferDialogVisible"
      :phone-number="selectedNumber?.number"
      @transfer-success="handleTransferSuccess"
    />

    <!-- 上下级号码侧边栏 -->
    <HierarchySidebar
      v-model="hierarchySidebarVisible"
      :phone-number="selectedNumber?.number"
    />

    <!-- 号码反查弹窗 -->
    <el-dialog
      v-model="reverseLookupDialogVisible"
      title="号码反查 - 全量信息"
      width="600px"
    >
      <div v-if="reverseLookupData" class="reverse-lookup-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="号码">{{ reverseLookupData.number }}</el-descriptions-item>
          <el-descriptions-item label="名称">{{ reverseLookupData.name }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ reverseLookupData.address }}</el-descriptions-item>
          <el-descriptions-item label="业务信息">{{ reverseLookupData.businessInfo }}</el-descriptions-item>
          <el-descriptions-item label="地市">{{ reverseLookupData.city }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ reverseLookupData.status }}</el-descriptions-item>
          <el-descriptions-item label="客户等级">{{ reverseLookupData.customerLevel }}</el-descriptions-item>
          <el-descriptions-item label="开户时间">{{ reverseLookupData.openDate }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ reverseLookupData.remark }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reverseLookupDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查区号/邮编弹窗 -->
    <el-dialog
      v-model="areaCodeDialogVisible"
      title="查区号/邮编"
      width="500px"
    >
      <el-form :model="areaCodeForm">
        <el-form-item label="选择地区">
          <el-cascader
            v-model="areaCodeForm.region"
            :options="regionOptions"
            placeholder="请选择省市区"
            style="width: 100%"
            @change="handleRegionChange"
          />
        </el-form-item>
        <el-form-item label="区号">
          <el-input v-model="areaCodeResult.areaCode" readonly />
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="areaCodeResult.postCode" readonly />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="areaCodeDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 截流播报弹窗 -->
    <JieLiuReport
      v-model="jieliuDialogVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import SmsDialog from './SmsDialog.vue'
import TransferDialog from './TransferDialog.vue'
import HierarchySidebar from './HierarchySidebar.vue'
import JieLiuReport from './JieLiuReport.vue'

// Props定义
interface Props {
  agentStatus: 'online' | 'offline'
  isBusy: boolean
  inCall: boolean
  noIncomingCallPermission: boolean
}

const props = defineProps<Props>()

// Emits定义
const emit = defineEmits<{
  (e: 'switch-page', page: 'home' | 'numberSearch'): void
}>()

// 搜索表单
const searchForm = reactive({
  dimension: 'name',
  keyword: ''
})

// 搜索结果
const searchResults = ref<any[]>([])
const searchLoading = ref(false)
const hasSearched = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 拍号
const paihaoDialogVisible = ref(false)
const paihaoLoading = ref(false)
const selectedNumber = ref<any>(null)
const selectedSmsNumber = ref('')

// 短信
const smsDialogVisible = ref(false)

// 转接
const transferDialogVisible = ref(false)

// 上下级号码
const hierarchySidebarVisible = ref(false)

// 反查
const reverseLookupDialogVisible = ref(false)
const reverseLookupData = ref<any>(null)

// 区号/邮编
const areaCodeDialogVisible = ref(false)
const areaCodeForm = reactive({
  region: []
})
const areaCodeResult = reactive({
  areaCode: '',
  postCode: ''
})

// 截流播报
const jieliuDialogVisible = ref(false)

// 坐席城市（模拟）
const agentCity = ref('福州')

// 计算属性
const canPaihao = computed(() => {
  return props.agentStatus === 'online' && !props.inCall && !props.noIncomingCallPermission
})

const canSendSms = computed(() => {
  return props.agentStatus === 'online' && !props.noIncomingCallPermission
})

const canTransfer = computed(() => {
  return props.agentStatus === 'online' && props.inCall && !props.noIncomingCallPermission
})

// 地区选择器选项
const regionOptions = [
  {
    value: 'fj',
    label: '福建省',
    children: [
      { value: 'fuzhou', label: '福州市', children: [
        { value: 'gulang', label: '鼓楼区' },
        { value: 'cangshan', label: '仓山区' },
        { value: 'taijiang', label: '台江区' }
      ]},
      { value: 'xiamen', label: '厦门市', children: [
        { value: 'siming', label: '思明区' },
        { value: 'haicang', label: '海沧区' }
      ]},
      { value: 'putian', label: '莆田市', children: [
        { value: 'chengxiang', label: '城厢区' },
        { value: 'hanian', label: '涵江区' }
      ]}
    ]
  }
]

// 搜索处理
const handleSearch = async () => {
  if (!searchForm.keyword.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }

  searchLoading.value = true
  hasSearched.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockData = generateMockData(searchForm.keyword)
    searchResults.value = mockData.list
    pagination.total = mockData.total
    pagination.currentPage = 1
    
    ElMessage.success('搜索完成')
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    searchLoading.value = false
  }
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchResults.value = []
  hasSearched.value = false
  pagination.currentPage = 1
  pagination.total = 0
}

// 生成本地数据
const generateMockData = (keyword: string) => {
  const keywords = keyword.split(' ').filter(k => k.trim())
  
  const allData = [
    {
      number: '13800138001',
      name: '张三（仓山人力）',
      address: '福建省福州市仓山区金山街道某大厦',
      businessInfo: '企业宽带100M',
      city: '福州',
      status: '正常',
      isSecret: false,
      customerLevel: 'VIP',
      openDate: '2020-05-20',
      remark: '企业客户，月消费500元'
    },
    {
      number: '13800138002',
      name: '李四',
      address: '福建省莆田市涵江区新涵大街',
      businessInfo: '家庭宽带200M',
      city: '莆田',
      status: '正常',
      isSecret: false,
      customerLevel: '普通',
      openDate: '2021-03-15',
      remark: '普通家庭用户'
    },
    {
      number: '138****8901',
      name: '王保密',
      address: '福建省福州市鼓楼区',
      businessInfo: '涉密业务',
      city: '福州',
      status: '正常',
      isSecret: true,
      customerLevel: '特殊',
      openDate: '2019-01-01',
      remark: '保密客户'
    },
    {
      number: '13900139001',
      name: '赵六（停机）',
      address: '福建省厦门市思明区',
      businessInfo: '企业固话',
      city: '厦门',
      status: '停机',
      isSecret: false,
      customerLevel: '普通',
      openDate: '2022-08-10',
      remark: '欠费停机'
    },
    {
      number: '13900139002',
      name: '钱七（仓山财务）',
      address: '福建省福州市仓山区万达广场',
      businessInfo: '企业总机',
      city: '福州',
      status: '正常',
      isSecret: false,
      customerLevel: '黄金',
      openDate: '2018-11-05',
      remark: '企业大客户'
    }
  ]

  const filteredData = allData.filter(item => {
    if (keywords.length === 0) return true
    return keywords.some(keyword => {
      const kw = keyword.toLowerCase()
      return (
        item.name.toLowerCase().includes(kw) ||
        item.address.toLowerCase().includes(kw) ||
        item.number.includes(kw) ||
        item.businessInfo.toLowerCase().includes(kw)
      )
    })
  })

  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize

  return {
    list: filteredData.slice(start, end),
    total: filteredData.length
  }
}

// 行点击
const handleRowClick = (row: any) => {
  selectedNumber.value = row
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0) {
    selectedNumber.value = selection[0]
  }
}

// 拍号
const handlePaihao = () => {
  if (!selectedNumber.value) {
    ElMessage.warning('请先选择号码')
    return
  }
  paihaoDialogVisible.value = true
}

const handlePaihaoRow = (row: any) => {
  selectedNumber.value = row
  paihaoDialogVisible.value = true
}

const confirmPaihao = async () => {
  if (!selectedNumber.value) return

  paihaoLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    paihaoDialogVisible.value = false
    ElMessage.success('拍号成功，已同步发送短信')
  } catch (error) {
    ElMessage.error('拍号失败')
  } finally {
    paihaoLoading.value = false
  }
}

// 短信
const openSmsDialog = () => {
  if (!selectedNumber.value) {
    ElMessage.warning('请先选择号码')
    return
  }
  selectedSmsNumber.value = selectedNumber.value.number
  smsDialogVisible.value = true
}

const handleSendSmsRow = (row: any) => {
  selectedNumber.value = row
  selectedSmsNumber.value = row.number
  smsDialogVisible.value = true
}

const handleSmsSendSuccess = () => {
  ElMessage.success('短信发送成功')
}

// 转接
const openTransferDialog = () => {
  if (!selectedNumber.value && !props.inCall) {
    ElMessage.warning('请先选择号码或确保在通话中')
    return
  }
  transferDialogVisible.value = true
}

const handleTransferSuccess = () => {
  ElMessage.success('转接成功')
  emit('switch-page', 'home')
}

// 上下级号码
const openHierarchySidebar = () => {
  if (!selectedNumber.value) {
    ElMessage.warning('请先选择号码')
    return
  }
  hierarchySidebarVisible.value = true
}

// 反查
const handleReverseLookup = async (row: any) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    reverseLookupData.value = row
    reverseLookupDialogVisible.value = true
  } catch (error) {
    ElMessage.error('反查失败')
  }
}

// 查区号/邮编
const openAreaCodeDialog = () => {
  areaCodeForm.region = []
  areaCodeResult.areaCode = ''
  areaCodeResult.postCode = ''
  areaCodeDialogVisible.value = true
}

const handleRegionChange = (value: string[]) => {
  if (value.includes('fuzhou')) {
    areaCodeResult.areaCode = '0591'
    areaCodeResult.postCode = '350000'
  } else if (value.includes('xiamen')) {
    areaCodeResult.areaCode = '0592'
    areaCodeResult.postCode = '361000'
  } else if (value.includes('putian')) {
    areaCodeResult.areaCode = '0594'
    areaCodeResult.postCode = '351100'
  }
}

// 截流播报
const openJieliuReport = () => {
  jieliuDialogVisible.value = true
}

// 分页
const handleSizeChange = () => {
  handleSearch()
}

const handleCurrentChange = () => {
  handleSearch()
}
</script>

<style scoped lang="scss">
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$bg-light: #f5f7fa;
$bg-white: #ffffff;
$text-primary: #303133;
$text-secondary: #606266;
$text-muted: #909399;
$border-color: #dcdfe6;

.number-search-page {
  padding: 20px;
  background-color: $bg-light;
  min-height: calc(100vh - 80px);
}

.search-section {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.action-section {
  margin-bottom: 20px;
  
  .el-col {
    margin-bottom: 10px;
  }
}

.permission-notice {
  margin-bottom: 15px;
}

.result-section {
  background-color: $bg-white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  
  .secret-number {
    color: $error-color;
    font-weight: 600;
    
    .el-tag {
      margin-left: 5px;
    }
  }
  
  .empty-result {
    padding: 40px 0;
    text-align: center;
  }
  
  .pagination-section {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.paihao-content {
  p {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  .number-info {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: $text-muted;
      width: 80px;
    }
    
    .value {
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.reverse-lookup-content {
  :deep(.el-descriptions__label) {
    width: 120px;
    background-color: $bg-light;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .number-search-page {
    padding: 10px;
  }
  
  .action-section {
    .el-col {
      width: 50%;
    }
  }
}
</style>