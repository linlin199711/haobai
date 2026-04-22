/**
 * 录音回放模块 - 查询条件面板
 * @description 录音查询条件筛选面板
 * @version 2.0.0
 */

<template>
  <div class="record-query-panel">
    <!-- 标题栏 -->
    <div class="panel-header">
      <div class="title-section">
        <el-icon class="title-icon"><Microphone /></el-icon>
        <span class="title-text">录音回放</span>
      </div>
      <el-button type="primary" :icon="Search" @click="handleQuery" :loading="loading">
        搜索
      </el-button>
    </div>

    <!-- 查询条件区 - 新布局 -->
    <div class="query-form">
      <!-- 第一行：时间选择、地区选择、工号选择、用户评价 -->
      <div class="form-row four-cols">
        <div class="form-item">
          <span class="item-label">时间选择</span>
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="date-range-picker"
          />
        </div>
        <div class="form-item" v-if="!isAgent">
          <span class="item-label">地区选择</span>
          <el-select
            v-model="queryForm.city"
            placeholder="请选择地区"
            clearable
            class="standard-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="city in cityList"
              :key="city.code"
              :label="city.name"
              :value="city.code"
            />
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">工号选择</span>
          <el-select
            v-model="queryForm.agentNo"
            placeholder="请选择工号"
            clearable
            class="standard-select"
            :disabled="isAgent"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="agent in agentList"
              :key="agent.agentNo"
              :label="agent.agentNo"
              :value="agent.agentNo"
            />
          </el-select>
        </div>
        <div class="form-item">
          <span class="item-label">用户评价</span>
          <el-select
            v-model="queryForm.satisfaction"
            placeholder="请选择评价"
            clearable
            class="standard-select"
          >
            <el-option
              v-for="opt in satisfactionOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 第二行：呼入号码搜索、业务按键、录音时长选择、输入词 -->
      <div class="form-row four-cols">
        <div class="form-item">
          <span class="item-label">呼入号码</span>
          <el-input
            v-model="queryForm.phoneNumber"
            placeholder="支持模糊搜索"
            clearable
            class="standard-input"
          >
            <template #suffix>
              <el-tooltip content="支持模糊搜索" placement="top">
                <el-icon class="fuzzy-icon"><Info-Filled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <div class="form-item">
          <span class="item-label">业务按键</span>
          <el-input
            v-model="queryForm.businessKey"
            placeholder="请输入业务按键"
            clearable
            class="standard-input"
          />
        </div>
        <div class="form-item duration-range-item">
          <span class="item-label">录音时长</span>
          <div class="duration-range">
            <el-input-number
              v-model="queryForm.durationStart"
              :min="0"
              :step="10"
              placeholder="起始秒"
              class="duration-input"
              controls-position="right"
            />
            <span class="range-separator">至</span>
            <el-input-number
              v-model="queryForm.durationEnd"
              :min="0"
              :step="10"
              placeholder="结束秒"
              class="duration-input"
              controls-position="right"
            />
            <span class="unit-text">秒</span>
          </div>
        </div>
        <div class="form-item">
          <span class="item-label">输入词</span>
          <el-input
            v-model="queryForm.keyword"
            placeholder="请输入关键词"
            clearable
            class="standard-input"
          />
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-buttons">
      <el-button type="primary" :icon="Search" @click="handleQuery" :loading="loading">
        查询
      </el-button>
      <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
    </div>

    <!-- 分页信息区 -->
    <div class="pagination-info">
      <span class="info-item">录音总数：<strong>{{ total }}</strong></span>
      <span class="info-item">页总数：<strong>{{ totalPages }}</strong></span>
      <span class="info-item">当前索引：<strong>{{ currentPage }}</strong></span>
      <div class="page-jump">
        <el-button :icon="ArrowLeft" :disabled="currentPage <= 1" @click="handlePrevPage" />
        <el-button :icon="ArrowRight" :disabled="currentPage >= totalPages" @click="handleNextPage" />
        <el-input-number
          v-model="jumpPage"
          :min="1"
          :max="totalPages || 1"
          :controls="false"
          class="jump-input"
          @keyup.enter="handleJumpPage"
        />
        <el-button type="primary" size="small" @click="handleJumpPage">跳页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Microphone,
  Search,
  RefreshLeft,
  ArrowLeft,
  ArrowRight,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { RecordingQueryParams, UserRole } from '../types'
import {
  SatisfactionOptions
} from '../types'
import * as api from '../mock'

interface Props {
  loading?: boolean
  total?: number
  totalPages?: number
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
  totalPages: 0,
  currentPage: 1
})

const emit = defineEmits<{
  (e: 'query', params: RecordingQueryParams): void
  (e: 'reset'): void
  (e: 'page-change', page: number): void
}>()

// ==================== 响应式数据 ====================
const userRole = ref<UserRole>('agent')
const agentList = ref<{ agentNo: string; agentName: string }[]>([])
const cityList = ref<{ code: string; name: string }[]>([])
const jumpPage = ref(1)

const queryForm = reactive({
  dateRange: [] as string[],
  agentNo: '',
  businessKey: '',
  phoneNumber: '',
  satisfaction: '',
  city: '',
  keyword: '',
  durationStart: undefined as number | undefined,
  durationEnd: undefined as number | undefined,
  page: 1,
  pageSize: 10
})

// ==================== 计算属性 ====================
const isAgent = computed(() => userRole.value === 'agent')

const satisfactionOptions = SatisfactionOptions

// ==================== 方法 ====================
// 初始化
const init = async () => {
  try {
    // 获取用户信息
    const userRes = await api.getCurrentUser()
    if (userRes.success) {
      userRole.value = userRes.data.role
      // 普通坐席默认只查自己
      if (userRole.value === 'agent') {
        queryForm.agentNo = userRes.data.agentNo
      }
    }

    // 获取工号列表
    const agentRes = await api.getAgentList()
    if (agentRes.success) {
      agentList.value = agentRes.data
    }

    // 获取城市列表（仅管理员/班长）
    if (userRole.value !== 'agent') {
      const cityRes = await api.getCityList()
      if (cityRes.success) {
        cityList.value = cityRes.data
      }
    }
  } catch (error) {
    console.error('初始化失败', error)
  }
}

// 查询
const handleQuery = () => {
  queryForm.page = 1
  
  // 构建查询参数
  const params: RecordingQueryParams = {
    startTime: queryForm.dateRange && queryForm.dateRange[0] ? queryForm.dateRange[0] + ' 00:00:00' : '',
    endTime: queryForm.dateRange && queryForm.dateRange[1] ? queryForm.dateRange[1] + ' 23:59:59' : '',
    agentNo: queryForm.agentNo,
    businessKey: queryForm.businessKey,
    phoneNumber: queryForm.phoneNumber,
    satisfaction: queryForm.satisfaction,
    city: queryForm.city,
    keyword: queryForm.keyword,
    durationStart: queryForm.durationStart,
    durationEnd: queryForm.durationEnd,
    page: 1,
    pageSize: 10
  }
  
  emit('query', params)
  
  // 记录日志
  api.logOperation({
    operator: api.currentUser.name,
    operationType: 'query',
    operationContent: '查询录音列表',
    ipAddress: '127.0.0.1'
  })
}

// 重置
const handleReset = () => {
  queryForm.dateRange = []
  queryForm.agentNo = ''
  queryForm.businessKey = ''
  queryForm.phoneNumber = ''
  queryForm.satisfaction = ''
  queryForm.city = ''
  queryForm.keyword = ''
  queryForm.durationStart = undefined
  queryForm.durationEnd = undefined
  queryForm.page = 1
  
  // 普通坐席保持只查自己
  if (userRole.value === 'agent') {
    queryForm.agentNo = api.currentUser.agentNo
  }
  
  emit('reset')
  ElMessage.success('已重置查询条件')
}

// 上一页
const handlePrevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

// 下一页
const handleNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}

// 跳页
const handleJumpPage = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= props.totalPages) {
    emit('page-change', jumpPage.value)
  } else {
    ElMessage.warning('请输入有效的页码')
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  init()
})

// 暴露方法
defineExpose({
  getQueryParams: () => ({ ...queryForm }),
  setPage: (page: number) => {
    queryForm.page = page
  }
})
</script>

<style scoped lang="scss">
.record-query-panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;

    .title-section {
      display: flex;
      align-items: center;
      gap: 8px;

      .title-icon {
        font-size: 20px;
        color: #409eff;
      }

      .title-text {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }
  }

  .query-form {
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-item {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;

      .item-label {
        font-size: 13px;
        color: #606266;
        white-space: nowrap;
        min-width: 70px;
        text-align: right;
        flex-shrink: 0;
      }

      .date-range-picker {
        flex: 1;
        min-width: 200px;
      }

      .standard-select {
        flex: 1;
        min-width: 120px;
      }

      .standard-input {
        flex: 1;
        min-width: 120px;

        .fuzzy-icon {
          color: #909399;
          font-size: 14px;
          cursor: help;
        }
      }

      &.duration-range-item {
        .duration-range {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;

          .duration-input {
            flex: 1;
            min-width: 80px;
          }

          .range-separator {
            color: #606266;
            font-size: 13px;
            white-space: nowrap;
          }

          .unit-text {
            color: #606266;
            font-size: 13px;
            white-space: nowrap;
            margin-left: 2px;
          }
        }
      }
    }

    .four-cols {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      @media (max-width: 1400px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e4e7ed;

    .el-button {
      min-width: 90px;
    }
  }

  .pagination-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #e4e7ed;

    .info-item {
      font-size: 13px;
      color: #606266;
      margin-right: 20px;

      strong {
        color: #409eff;
        font-size: 14px;
      }
    }

    .page-jump {
      display: flex;
      align-items: center;
      gap: 8px;

      .jump-input {
        width: 60px;
      }
    }
  }
}
</style>
