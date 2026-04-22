<template>
  <el-dialog
    :model-value="modelValue"
    title="截流播报 - 厦门专属"
    width="700px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="jieliu-content">
      <el-alert
        title="截流播报功能说明"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px;"
      >
        <template #default>
          截流播报用于展示当前排队等待的来电信息，帮助坐席快速了解客户情况。
        </template>
      </el-alert>

      <div class="jieliu-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-statistic title="当前排队数" :value="stats.waitingCount">
              <template #suffix>
                <span class="unit">通</span>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="平均等待时长" :value="stats.avgWaitTime">
              <template #suffix>
                <span class="unit">秒</span>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="今日接入量" :value="stats.todayConnected">
              <template #suffix>
                <span class="unit">通</span>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="放弃率" :value="stats.abandonRate">
              <template #suffix>
                <span class="unit">%</span>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>

      <el-divider content-position="left">排队详情</el-divider>

      <el-table
        v-loading="loading"
        :data="queueList"
        border
        stripe
        max-height="300"
        style="width: 100%"
      >
        <el-table-column prop="position" label="排队位置" width="90" />
        <el-table-column prop="phoneNumber" label="来电号码" width="130" />
        <el-table-column prop="waitTime" label="等待时长" width="100">
          <template #default="{ row }">
            {{ row.waitTime }}秒
          </template>
        </el-table-column>
        <el-table-column prop="customerLevel" label="客户等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.customerLevel)" size="small">
              {{ row.customerLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型" min-width="120" />
        <el-table-column prop="lastArea" label="最近所属区域" min-width="120" />
      </el-table>

      <div class="action-bar">
        <el-button type="primary" :loading="refreshing" @click="refreshData">
          刷新数据
        </el-button>
        <el-button @click="$emit('update:modelValue', false)">
          关闭
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)
const refreshing = ref(false)

const stats = reactive({
  waitingCount: 0,
  avgWaitTime: 0,
  todayConnected: 0,
  abandonRate: 0
})

const queueList = ref<any[]>([])

watch(() => props.modelValue, async (val) => {
  if (val) {
    await loadData()
  }
})

const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    stats.waitingCount = 5
    stats.avgWaitTime = 32
    stats.todayConnected = 156
    stats.abandonRate = 3.2

    queueList.value = [
      {
        position: 1,
        phoneNumber: '13800138001',
        waitTime: 45,
        customerLevel: 'VIP',
        businessType: '投诉',
        lastArea: '思明区'
      },
      {
        position: 2,
        phoneNumber: '13900139001',
        waitTime: 32,
        customerLevel: '黄金',
        businessType: '查询',
        lastArea: '海沧区'
      },
      {
        position: 3,
        phoneNumber: '13700137001',
        waitTime: 28,
        customerLevel: '普通',
        businessType: '办理',
        lastArea: '湖里区'
      },
      {
        position: 4,
        phoneNumber: '13600136001',
        waitTime: 15,
        customerLevel: '普通',
        businessType: '咨询',
        lastArea: '集美区'
      },
      {
        position: 5,
        phoneNumber: '13500135001',
        waitTime: 8,
        customerLevel: '白银',
        businessType: '续费',
        lastArea: '同安区'
      }
    ]
  } catch (error) {
    console.error('加载截流播报数据失败', error)
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  refreshing.value = true
  try {
    await loadData()
  } finally {
    refreshing.value = false
  }
}

const getLevelType = (level: string) => {
  const typeMap: Record<string, string> = {
    'VIP': 'danger',
    '黄金': 'warning',
    '白银': 'info',
    '普通': 'success'
  }
  return typeMap[level] || 'info'
}
</script>

<style scoped lang="scss">
$primary-color: #1890ff;
$bg-light: #f5f7fa;
$bg-white: #ffffff;
$text-primary: #303133;
$text-secondary: #606266;
$text-muted: #909399;

.jieliu-content {
  .jieliu-stats {
    background-color: $bg-light;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    .unit {
      font-size: 12px;
      color: $text-muted;
    }
    
    :deep(.el-statistic__head) {
      font-size: 13px;
      color: $text-secondary;
    }
    
    :deep(.el-statistic__content) {
      font-size: 24px;
      font-weight: 600;
      color: $primary-color;
    }
  }
  
  .action-bar {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

:deep(.el-divider__text) {
  color: $text-secondary;
  font-weight: 500;
}
</style>