/**
 * 呼叫中心话务条 - 来电弹窗组件
 * @description 展示来电信息，支持接听/挂断
 */

<template>
  <teleport to="body">
    <!-- 遮罩层 -->
    <transition name="fade">
      <div v-if="visible" class="incoming-call-mask" @click="handleReject" />
    </transition>
    
    <!-- 来电弹窗 -->
    <transition name="scale">
      <div v-if="visible" class="incoming-call-popup">
        <!-- 响铃动画 -->
        <div class="ringing-animation">
          <div class="ringing-circle"></div>
          <div class="ringing-circle delay-1"></div>
          <div class="ringing-circle delay-2"></div>
          <div class="phone-icon">
            <el-icon><Phone /></el-icon>
          </div>
        </div>
        
        <!-- 标题 -->
        <h3 class="popup-title">来电提醒</h3>
        
        <!-- 来电信息 -->
        <div class="call-info">
          <div class="info-item">
            <label>来电号码</label>
            <span class="phone-number">{{ callInfo?.callerNumber || '--' }}</span>
          </div>
          
          <div class="info-item">
            <label>用户姓名</label>
            <span>{{ callInfo?.userName || '未知' }}</span>
          </div>
          
          <div class="info-item">
            <label>用户等级</label>
            <el-tag :type="getLevelType(callInfo?.userLevel)" size="small">
              {{ callInfo?.userLevel || '普通' }}
            </el-tag>
          </div>
          
          <div class="info-item">
            <label>用户地址</label>
            <span class="address">{{ callInfo?.userAddress || '--' }}</span>
          </div>
          
          <!-- 跨地市标签 -->
          <div v-if="isCrossCity" class="cross-city-tag">
            <el-tag type="warning" effect="dark" size="small">
              <el-icon><Location /></el-icon>
              {{ callInfo?.city }}来电
            </el-tag>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="popup-actions">
          <el-button
            type="success"
            size="large"
            :loading="loadingAnswer"
            class="action-btn answer-btn"
            @click="handleAnswer"
          >
            <el-icon><VideoPlay /></el-icon>
            接听
          </el-button>
          
          <el-button
            type="danger"
            size="large"
            :loading="loadingReject"
            class="action-btn reject-btn"
            @click="handleReject"
          >
            <el-icon><CircleClose /></el-icon>
            挂断
          </el-button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Location, VideoPlay, CircleClose } from '@element-plus/icons-vue'
import type { CallInfo, AgentInfo } from '../types'

interface Props {
  modelValue: boolean
  callInfo: CallInfo | null
  agentInfo: AgentInfo | null
  loadingAnswer?: boolean
  loadingReject?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loadingAnswer: false,
  loadingReject: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'answer'): void
  (e: 'reject'): void
}>()

// 弹窗显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 是否跨地市来电
const isCrossCity = computed(() => {
  if (!props.callInfo?.city || !props.agentInfo?.city) return false
  return props.callInfo.city !== props.agentInfo.city
})

// 获取等级标签类型
const getLevelType = (level?: string): 'danger' | 'warning' | 'success' | 'info' => {
  switch (level) {
    case 'VIP':
      return 'danger'
    case 'gold':
      return 'warning'
    case 'silver':
      return 'success'
    default:
      return 'info'
  }
}

// 接听
const handleAnswer = () => {
  emit('answer')
}

// 拒绝
const handleReject = () => {
  if (props.loadingAnswer || props.loadingReject) return
  emit('reject')
}
</script>

<style scoped lang="scss">
$primary-color: #1890ff;
$success-color: #52c41a;
$danger-color: #f5222d;
$warning-color: #faad14;
$bg-white: #ffffff;
$text-primary: #303133;
$text-secondary: #606266;

// 遮罩层
.incoming-call-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
}

// 来电弹窗
.incoming-call-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  padding: 30px 40px;
  z-index: 2000;
  min-width: 380px;
  text-align: center;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

// 响铃动画
.ringing-animation {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  
  .ringing-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba($success-color, 0.2);
    animation: ring 2s ease-out infinite;
    
    &.delay-1 {
      animation-delay: 0.5s;
    }
    
    &.delay-2 {
      animation-delay: 1s;
    }
  }
  
  .phone-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, $success-color 0%, #73d13d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba($success-color, 0.4);
    
    .el-icon {
      font-size: 28px;
      color: white;
      animation: shake 0.5s ease-in-out infinite;
    }
  }
}

@keyframes ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

// 标题
.popup-title {
  color: $text-primary;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

// 来电信息
.call-info {
  margin-bottom: 24px;
  
  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    
    &:last-child {
      border-bottom: none;
    }
    
    label {
      color: $text-secondary;
      font-size: 14px;
    }
    
    span {
      color: $text-primary;
      font-size: 14px;
      font-weight: 500;
      
      &.phone-number {
        font-size: 18px;
        color: $primary-color;
        font-weight: 600;
      }
      
      &.address {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  
  .cross-city-tag {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed #ebeef5;
    
    .el-tag {
      font-size: 13px;
      padding: 4px 12px;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

// 操作按钮
.popup-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  
  .action-btn {
    min-width: 120px;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    
    .el-icon {
      margin-right: 6px;
      font-size: 18px;
    }
    
    &.answer-btn {
      background: linear-gradient(135deg, $success-color 0%, #73d13d 100%);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #47c936 0%, #85e04a 100%);
      }
    }
    
    &.reject-btn {
      background: linear-gradient(135deg, $danger-color 0%, #ff7875 100%);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #ff4d4f 0%, #ff9c96 100%);
      }
    }
  }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}
</style>
