/**
 * 录音回放模块 - 详情弹窗组件
 * @description 录音详情展示弹窗
 * @version 1.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    title="录音详情"
    width="700px"
    :close-on-click-modal="false"
    destroy-on-close
    class="record-detail-dialog"
  >
    <div v-if="record" class="detail-content">
      <!-- 基本信息区 -->
      <div class="detail-section">
        <div class="section-title">
          <el-icon><InfoFilled /></el-icon>
          <span>基本信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主叫号码">{{ record.callerNumber }}</el-descriptions-item>
          <el-descriptions-item label="被叫号码">{{ record.calleeNumber }}</el-descriptions-item>
          <el-descriptions-item label="业务类型">{{ businessType }}</el-descriptions-item>
          <el-descriptions-item label="通话时间">{{ record.callTime }}</el-descriptions-item>
          <el-descriptions-item label="录音时长">{{ formatDuration(record.duration) }}</el-descriptions-item>
          <el-descriptions-item label="满意度">
            <el-tag :type="getSatisfactionType(record.satisfaction)" size="small">
              {{ getSatisfactionLabel(record.satisfaction) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="话务员工号">{{ record.agentNo }}</el-descriptions-item>
          <el-descriptions-item label="话务员姓名">{{ record.agentName }}</el-descriptions-item>
          <el-descriptions-item label="座席号码">{{ record.seatNumber }}</el-descriptions-item>
          <el-descriptions-item label="流水号">{{ record.serialNo }}</el-descriptions-item>
          <el-descriptions-item label="业务键" :span="2">{{ record.businessKey }}</el-descriptions-item>
          <el-descriptions-item label="播报号码" :span="2">{{ businessInfo?.broadcastNumber || '--' }}</el-descriptions-item>
          <el-descriptions-item label="客户名称" :span="2">{{ businessInfo?.customerName || '--' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 业务内容区 -->
      <div class="detail-section" v-if="businessInfo?.businessContent">
        <div class="section-title">
          <el-icon><Document /></el-icon>
          <span>业务内容</span>
        </div>
        <div class="content-box">
          {{ businessInfo.businessContent }}
        </div>
      </div>

      <!-- 话务员操作记录 -->
      <div class="detail-section" v-if="businessInfo?.operatorActions?.length">
        <div class="section-title">
          <el-icon><List /></el-icon>
          <span>话务员操作记录</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(action, index) in businessInfo.operatorActions"
            :key="index"
            type="primary"
            :icon="Check"
          >
            {{ action }}
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 挪车业务详情 -->
      <div class="detail-section" v-if="businessInfo?.carMoveInfo">
        <div class="section-title">
          <el-icon><Van /></el-icon>
          <span>挪车业务详情</span>
          <el-button
            type="primary"
            link
            size="small"
            class="view-detail-btn"
            @click="handleViewCarMoveDetail"
          >
            查看挪车详情
          </el-button>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="挪车记录编号">{{ businessInfo.carMoveInfo.recordNo }}</el-descriptions-item>
          <el-descriptions-item label="车牌号码">{{ businessInfo.carMoveInfo.plateNumber }}</el-descriptions-item>
          <el-descriptions-item label="挪车地点" :span="2">{{ businessInfo.carMoveInfo.location }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 总机业务详情 -->
      <div class="detail-section" v-if="businessInfo?.pbxInfo">
        <div class="section-title">
          <el-icon><Phone /></el-icon>
          <span>总机业务详情</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="搜索内容">{{ businessInfo.pbxInfo.searchContent }}</el-descriptions-item>
          <el-descriptions-item label="转分机号">{{ businessInfo.pbxInfo.extensionNumber }}</el-descriptions-item>
          <el-descriptions-item label="转接号码" v-if="businessInfo.pbxInfo.transferNumber">
            {{ businessInfo.pbxInfo.transferNumber }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 优惠券/周边详情 -->
      <div class="detail-section" v-if="businessInfo?.couponInfo">
        <div class="section-title">
          <el-icon><Ticket /></el-icon>
          <span>优惠券/周边详情</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="优惠券类型">{{ businessInfo.couponInfo.couponType }}</el-descriptions-item>
          <el-descriptions-item label="商家级别">
            <el-tag :type="getMerchantLevelType(businessInfo.couponInfo.merchantLevel)" size="small">
              {{ getMerchantLevelLabel(businessInfo.couponInfo.merchantLevel) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :icon="VideoPlay" @click="handlePlay">
          播放录音
        </el-button>
        <el-button type="success" :icon="Download" @click="handleDownload">
          下载录音
        </el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  InfoFilled,
  Document,
  List,
  Check,
  Van,
  Phone,
  Ticket,
  VideoPlay,
  Download
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { RecordingRecord, BusinessInfo } from '../types'

interface Props {
  modelValue: boolean
  record?: RecordingRecord | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'play', record: RecordingRecord): void
  (e: 'download', record: RecordingRecord): void
}>()

// ==================== 计算属性 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const record = computed(() => props.record)

const businessInfo = computed<BusinessInfo | undefined>(() => {
  return record.value?.businessInfo
})

const businessType = computed(() => {
  return businessInfo.value?.businessType || '一般业务'
})

// ==================== 方法 ====================
// 格式化时长
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

// 获取满意度类型
const getSatisfactionType = (satisfaction: string): string => {
  const typeMap: Record<string, string> = {
    '5': 'success',
    '4': 'success',
    '3': 'warning',
    '2': 'danger',
    '1': 'danger'
  }
  return typeMap[satisfaction] || 'info'
}

// 获取满意度标签
const getSatisfactionLabel = (satisfaction: string): string => {
  const labelMap: Record<string, string> = {
    '5': '非常满意',
    '4': '满意',
    '3': '一般',
    '2': '不满意',
    '1': '非常不满意'
  }
  return labelMap[satisfaction] || '未知'
}

// 获取商家级别类型
const getMerchantLevelType = (level: string): string => {
  const typeMap: Record<string, string> = {
    gold: 'danger',
    silver: 'warning',
    bronze: 'success',
    normal: 'info'
  }
  return typeMap[level] || 'info'
}

// 获取商家级别标签
const getMerchantLevelLabel = (level: string): string => {
  const labelMap: Record<string, string> = {
    gold: '金牌',
    silver: '银牌',
    bronze: '铜牌',
    normal: '普通'
  }
  return labelMap[level] || level
}

// 播放
const handlePlay = () => {
  if (record.value) {
    emit('play', record.value)
  }
}

// 下载
const handleDownload = () => {
  if (record.value) {
    emit('download', record.value)
    ElMessage.success('开始下载录音')
  }
}

// 查看挪车详情
const handleViewCarMoveDetail = () => {
  ElMessage.info('跳转至挪车详情页面')
  // 实际项目中这里会跳转到挪车详情页
}

// 关闭
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped lang="scss">
.record-detail-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    margin-right: 0;
    padding: 16px 20px;

    .el-dialog__title {
      color: #fff;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      .el-icon {
        color: #fff;
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .detail-content {
    .detail-section {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 12px;

        .el-icon {
          font-size: 18px;
          color: #409eff;
        }

        .view-detail-btn {
          margin-left: auto;
        }
      }

      .content-box {
        background: #f5f7fa;
        padding: 12px 16px;
        border-radius: 4px;
        color: #606266;
        line-height: 1.6;
      }

      :deep(.el-descriptions) {
        .el-descriptions__label {
          background-color: #f5f7fa;
          font-weight: 500;
        }
      }

      :deep(.el-timeline) {
        padding-left: 8px;

        .el-timeline-item__content {
          color: #606266;
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
