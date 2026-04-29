/**
 * 挪车登记模块 - 主组件
 * @description 话务台嵌套下的挪车登记页面
 * @version 2.0.0
 */

<template>
  <div class="car-move-module">
    <!-- 上半部分：登记表单 -->
    <div class="form-section">
      <div class="section-header">
        <h3 class="section-title">挪车登记</h3>
        <el-tag v-if="incomingCallInfo.phoneNumber" type="success" effect="dark">
          来电：{{ incomingCallInfo.phoneNumber }}
        </el-tag>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="car-move-form"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="登记地区" prop="district" required>
              <el-select v-model="formData.district" placeholder="请选择区县" class="w-full">
                <el-option
                  v-for="item in districtOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="详细地址" prop="address" required>
              <el-input v-model="formData.address" placeholder="请输入详细地址" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="来电号码" prop="phoneNumber">
              <el-input v-model="formData.phoneNumber" placeholder="自动填入呼入号码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="车牌颜色" prop="plateColor" required>
              <el-select v-model="formData.plateColor" placeholder="请选择" class="w-full">
                <el-option label="蓝牌" value="blue" />
                <el-option label="黄牌" value="yellow" />
                <el-option label="绿牌" value="green" />
                <el-option label="白牌" value="white" />
                <el-option label="黑牌" value="black" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="车牌号" prop="plateNumber" required>
              <el-input v-model="formData.plateNumber" placeholder="请输入车牌号" @input="handlePlateInput">
                <template #prepend>
                  <span class="plate-prefix">闽</span>
                  <el-input
                    v-model="formData.platePrefix"
                    class="prefix-input"
                    maxlength="1"
                    placeholder="A"
                    @input="handlePrefixInput"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="车身颜色" prop="carColor">
              <el-input v-model="formData.carColor" placeholder="请输入车身颜色" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="formData.carBrand" placeholder="请输入车辆品牌" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="短信通知号码" prop="smsPhoneNumber">
              <el-input v-model="formData.smsPhoneNumber" placeholder="默认填入来电号码" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="移车原因" prop="moveReason">
              <el-select v-model="formData.moveReason" placeholder="请选择" class="w-full">
                <el-option label="移车通知" value="move_notice" />
                <el-option label="友情提示" value="friendly_reminder" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="登记工号" prop="agentId">
              <el-input v-model="formData.agentId" placeholder="请输入登记工号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="16">
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="formData.remark" placeholder="请输入备注信息" maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="form-actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交登记</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 下半部分：记录列表 -->
    <div class="list-section">
      <div class="section-header">
        <h3 class="section-title">登记记录</h3>
      </div>

      <!-- 查询栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="来电号码">
            <el-input v-model="searchForm.phoneNumber" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model="searchForm.plateNumber" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleSearch">查询</el-button>
            <el-button @click="handleSearchReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 列表表格 -->
      <el-table :data="recordList" v-loading="loading" stripe border>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="来电号码" width="120">
          <template #default="{ row }">
            {{ maskPhone(row.phoneNumber) }}
          </template>
        </el-table-column>
        <el-table-column prop="fullPlateNumber" label="车牌号" width="120" />
        <el-table-column prop="plateColorLabel" label="车牌颜色" width="90" />
        <el-table-column prop="registerTime" label="登记时间" width="160" />
        <el-table-column prop="district" label="登记地区" width="100" />
        <el-table-column prop="address" label="详细地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="carColor" label="车身颜色" width="90" />
        <el-table-column prop="carBrand" label="车辆品牌" width="100" />
        <el-table-column prop="syncStatus" label="同步状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.syncStatus === 'synced' ? 'success' : 'danger'">
              {{ row.syncStatus === 'synced' ? '已同步' : '未同步' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="voiceNotificationResult" label="语音通知结果" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.voiceNotificationResult === 'success' ? 'success' : row.voiceNotificationResult === 'failed' ? 'danger' : 'info'">
              {{ row.voiceNotificationResult === 'success' ? '成功' : row.voiceNotificationResult === 'failed' ? '失败' : '未通知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="smsNotificationResult" label="短信通知结果" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.smsNotificationResult === 'success' ? 'success' : row.smsNotificationResult === 'failed' ? 'danger' : 'info'">
              {{ row.smsNotificationResult === 'success' ? '成功' : row.smsNotificationResult === 'failed' ? '失败' : '未通知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="agentId" label="登记工号" width="100" />
        <el-table-column prop="smsPhoneNumber" label="短信通知号码" width="130" />
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

// 模拟当前坐席信息
const agentInfo = {
  agentId: 'A001',
  agentName: '张三',
  city: 'fuzhou',
  cityName: '福州市',
  platePrefix: 'A'
}

// 模拟来电信息
const incomingCallInfo = reactive({
  phoneNumber: '13800138000',
  callTime: new Date().toISOString()
})

// 区县选项
const districtOptions = [
  { code: 'gulou', name: '鼓楼区' },
  { code: 'taijiang', name: '台江区' },
  { code: 'cangshan', name: '仓山区' },
  { code: 'jinan', name: '晋安区' },
  { code: 'mawei', name: '马尾区' },
  { code: 'minhou', name: '闽侯县' }
]

// 表单相关
const formRef = ref<FormInstance>()
const submitting = ref(false)
const platePrefix = computed(() => agentInfo.platePrefix)

const formData = reactive({
  district: '',
  address: '',
  phoneNumber: incomingCallInfo.phoneNumber,
  plateColor: '',
  platePrefix: agentInfo.platePrefix,  // 车牌前缀字母，根据地市默认显示
  plateNumber: '',
  carColor: '',
  carBrand: '',
  smsPhoneNumber: incomingCallInfo.phoneNumber,
  moveReason: 'move_notice',
  agentId: agentInfo.agentId,
  remark: ''
})

const formRules: FormRules = {
  district: [{ required: true, message: '请选择登记地区', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  plateColor: [{ required: true, message: '请选择车牌颜色', trigger: 'change' }],
  plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }]
}

// 车牌前缀输入处理（只允许输入一个大写字母）
const handlePrefixInput = (val: string) => {
  formData.platePrefix = val.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1)
}

// 车牌号输入处理
const handlePlateInput = (val: string) => {
  formData.plateNumber = val.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        ElMessage.success('登记成功')
        handleReset()
        handleSearch()
      }, 1000)
    }
  })
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  formData.phoneNumber = incomingCallInfo.phoneNumber
  formData.smsPhoneNumber = incomingCallInfo.phoneNumber
  formData.agentId = agentInfo.agentId
  formData.platePrefix = agentInfo.platePrefix
}

// 搜索相关
const loading = ref(false)
const searchForm = reactive({
  phoneNumber: '',
  plateNumber: '',
  timeRange: [] as string[]
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const recordList = ref<any[]>([])

// 生成模拟数据
const generateMockData = () => {
  const list = []
  for (let i = 1; i <= 35; i++) {
    list.push({
      id: i.toString(),
      phoneNumber: `138${String(i).padStart(4, '0')}8000`,
      fullPlateNumber: `闽A${String(Math.floor(Math.random() * 90000) + 10000)}`,
      plateColor: ['blue', 'yellow', 'green', 'white', 'black'][Math.floor(Math.random() * 5)],
      plateColorLabel: ['蓝牌', '黄牌', '绿牌', '白牌', '黑牌'][Math.floor(Math.random() * 5)],
      registerTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      district: districtOptions[Math.floor(Math.random() * districtOptions.length)].name,
      address: `福建省福州市${districtOptions[Math.floor(Math.random() * districtOptions.length)].name}某某路${Math.floor(Math.random() * 100)}号`,
      carColor: ['白色', '黑色', '银色', '红色', '蓝色'][Math.floor(Math.random() * 5)],
      carBrand: ['丰田', '本田', '大众', '宝马', '奔驰'][Math.floor(Math.random() * 5)],
      syncStatus: ['synced', 'unsynced'][Math.floor(Math.random() * 2)],
      voiceNotificationResult: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)],
      smsNotificationResult: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)],
      notificationStatus: Math.random() > 0.3 ? 'notified' : 'unnotified',
      agentId: `A${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      smsPhoneNumber: `138${String(i).padStart(4, '0')}8000`,
      remark: Math.random() > 0.7 ? '需要重点关注' : ''
    })
  }
  return list
}

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    const allData = generateMockData()
    let filtered = allData
    if (searchForm.phoneNumber) {
      filtered = filtered.filter(item => item.phoneNumber.includes(searchForm.phoneNumber))
    }
    if (searchForm.plateNumber) {
      filtered = filtered.filter(item => item.fullPlateNumber.includes(searchForm.plateNumber))
    }
    recordList.value = filtered.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
    pagination.total = filtered.length
    loading.value = false
  }, 500)
}

// 重置搜索
const handleSearchReset = () => {
  searchForm.phoneNumber = ''
  searchForm.plateNumber = ''
  searchForm.timeRange = []
  pagination.page = 1
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}

const handlePageChange = (val: number) => {
  pagination.page = val
  handleSearch()
}

// 手机号脱敏
const maskPhone = (phone: string) => {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 疑似套牌切换
const handleCloneToggle = (row: any) => {
  ElMessage.success(`已${row.isSuspectedClone ? '标记' : '取消标记'}为疑似套牌`)
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.car-move-module {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 56px);
}

.form-section,
.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.form-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.search-bar {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.w-full {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

.plate-prefix {
  margin-right: 4px;
}

.prefix-input {
  width: 40px;

  :deep(.el-input__wrapper) {
    padding: 0 4px;
  }

  :deep(.el-input__inner) {
    text-align: center;
    padding: 0;
  }
}
</style>
