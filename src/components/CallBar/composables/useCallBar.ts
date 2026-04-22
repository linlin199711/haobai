/**
 * 呼叫中心话务条 - 核心逻辑组合式函数
 * @description 管理话务条的所有状态和操作逻辑
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  AgentStatus,
  BusyStatus,
  CallStatus,
  CallInfo,
  AgentInfo,
  PermissionConfig,
  TransferTarget
} from '../types'
import * as api from '../api/mock'

export function useCallBar() {
  // ========== 状态定义 ==========
  
  /** 坐席状态 */
  const agentStatus = ref<AgentStatus>('offline')
  
  /** 示忙状态 */
  const busyStatus = ref<BusyStatus>('idle')
  
  /** 通话状态 */
  const callStatus = ref<CallStatus>('idle')
  
  /** 静音状态 */
  const isMuted = ref(false)

  /** 保持状态 */
  const isHolding = ref(false)

  /** 加载状态 */
  const loading = ref({
    signInOut: false,
    busy: false,
    mute: false,
    hangUp: false,
    transfer: false,
    outbound: false,
    answer: false,
    reject: false,
    hold: false,
    consult: false
  })
  
  /** 坐席信息 */
  const agentInfo = ref<AgentInfo | null>(null)
  
  /** 权限配置 */
  const permissions = ref<PermissionConfig>({
    noIncomingCall: false,
    canViewRecording: true,
    canOutbound: true,
    canTransfer: true
  })
  
  /** 当前通话信息 */
  const currentCall = ref<CallInfo | null>(null)
  
  /** 通话时长（秒） */
  const callDuration = ref(0)
  
  /** 通话时长计时器 */
  let durationTimer: number | null = null
  
  /** 转接目标列表 */
  const transferTargets = ref<TransferTarget[]>([])
  
  /** 来电弹窗显示状态 */
  const incomingCallVisible = ref(false)
  
  /** 来电信息 */
  const incomingCallInfo = ref<CallInfo | null>(null)

  // ========== 计算属性 ==========
  
  /** 是否在线 */
  const isOnline = computed(() => agentStatus.value === 'online')
  
  /** 是否示忙 */
  const isBusy = computed(() => busyStatus.value === 'busy')
  
  /** 是否通话中 */
  const isInCall = computed(() => callStatus.value === 'talking' || callStatus.value === 'holding')
  
  /** 是否响铃中 */
  const isRinging = computed(() => callStatus.value === 'ringing')
  
  /** 是否可以接听 */
  const canAnswer = computed(() => isRinging.value)
  
  /** 是否可以挂断 */
  const canHangUp = computed(() => isInCall.value || isRinging.value)
  
  /** 是否可以静音 */
  const canMute = computed(() => isInCall.value)
  
  /** 是否可以转接 */
  const canTransfer = computed(() => 
    isInCall.value && 
    permissions.value.canTransfer && 
    !permissions.value.noIncomingCall
  )
  
  /** 是否可以外呼 */
  const canOutbound = computed(() => 
    isOnline.value && 
    permissions.value.canOutbound &&
    !isInCall.value &&
    !isRinging.value
  )
  
  /** 是否可以查看录音 */
  const canViewRecording = computed(() =>
    isBusy.value &&
    permissions.value.canViewRecording
  )

  /** 是否可以咨询 */
  const canConsult = computed(() =>
    isInCall.value &&
    permissions.value.canTransfer &&
    !permissions.value.noIncomingCall
  )

  /** 是否可以三方通话 */
  const canThreeWay = computed(() =>
    isInCall.value &&
    permissions.value.canTransfer &&
    !permissions.value.noIncomingCall
  )
  
  /** 格式化通话时长 */
  const formattedDuration = computed(() => {
    const hours = Math.floor(callDuration.value / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((callDuration.value % 3600) / 60).toString().padStart(2, '0')
    const seconds = (callDuration.value % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  })
  
  /** 状态文本 */
  const statusText = computed(() => {
    if (!isOnline.value) return '离线'
    if (isInCall.value) return '通话中'
    if (isRinging.value) return '响铃中'
    if (isBusy.value) return '示忙'
    return '示闲'
  })

  // ========== 方法 ==========
  
  /**
   * 初始化
   */
  const init = async () => {
    try {
      // 获取坐席信息
      const agentRes = await api.getAgentInfo()
      if (agentRes.success) {
        agentInfo.value = agentRes.data
      }
      
      // 获取权限配置
      const permRes = await api.getPermissionConfig()
      if (permRes.success) {
        permissions.value = permRes.data
        
        // 如果开启不进线权限，默认示忙
        if (permissions.value.noIncomingCall) {
          busyStatus.value = 'busy'
        }
      }
      
      // 获取转接目标列表
      const targetsRes = await api.getTransferTargets()
      if (targetsRes.success) {
        transferTargets.value = targetsRes.data
      }
    } catch (error) {
      console.error('初始化失败:', error)
      ElMessage.error('初始化失败')
    }
  }
  
  /**
   * 签入/签出
   */
  const toggleSignInOut = async () => {
    if (loading.value.signInOut) return
    
    loading.value.signInOut = true
    try {
      if (isOnline.value) {
        // 签出
        if (isInCall.value) {
          ElMessage.warning('通话中无法签出')
          return
        }
        const res = await api.signOut()
        if (res.success) {
          agentStatus.value = 'offline'
          busyStatus.value = 'idle'
          ElMessage.success('已签出')
        }
      } else {
        // 签入
        const res = await api.signIn()
        if (res.success) {
          agentStatus.value = 'online'
          // 如果开启不进线权限，签入后自动示忙
          if (permissions.value.noIncomingCall) {
            busyStatus.value = 'busy'
          }
          ElMessage.success('已签入')
        }
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.signInOut = false
    }
  }
  
  /**
   * 示忙/示闲切换
   */
  const toggleBusy = async () => {
    if (!isOnline.value) {
      ElMessage.warning('请先签入')
      return
    }
    if (loading.value.busy) return
    
    loading.value.busy = true
    try {
      if (isBusy.value) {
        const res = await api.setIdle()
        if (res.success) {
          busyStatus.value = 'idle'
          ElMessage.success('已示闲')
        }
      } else {
        const res = await api.setBusy()
        if (res.success) {
          busyStatus.value = 'busy'
          ElMessage.success('已示忙')
        }
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.busy = false
    }
  }
  
  /**
   * 静音/取消静音切换
   */
  const toggleMute = async () => {
    if (!canMute.value) return
    if (loading.value.mute) return
    
    loading.value.mute = true
    try {
      if (isMuted.value) {
        const res = await api.unmute()
        if (res.success) {
          isMuted.value = false
          ElMessage.success('已取消静音')
        }
      } else {
        const res = await api.mute()
        if (res.success) {
          isMuted.value = true
          ElMessage.success('已静音')
        }
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.mute = false
    }
  }
  
  /**
   * 挂断电话
   */
  const hangUp = async () => {
    if (!canHangUp.value) return
    if (loading.value.hangUp) return

    loading.value.hangUp = true
    try {
      const res = await api.hangUp()
      if (res.success) {
        stopDurationTimer()
        callStatus.value = 'idle'
        currentCall.value = null
        isMuted.value = false
        isHolding.value = false
        if (incomingCallVisible.value) {
          incomingCallVisible.value = false
          incomingCallInfo.value = null
        }
        ElMessage.success('已挂断')
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.hangUp = false
    }
  }

  /**
   * 保持/接回
   */
  const toggleHold = async () => {
    if (!isInCall.value) return
    if (loading.value.hold) return

    loading.value.hold = true
    try {
      if (isHolding.value) {
        const res = await api.unhold()
        if (res.success) {
          isHolding.value = false
          ElMessage.success('已接回')
        }
      } else {
        const res = await api.hold()
        if (res.success) {
          isHolding.value = true
          ElMessage.success('已保持')
        }
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.hold = false
    }
  }

  /**
   * 咨询
   */
  const consultCall = async (target: TransferTarget) => {
    if (!canConsult.value) return
    if (loading.value.consult) return

    loading.value.consult = true
    try {
      const res = await api.consultCall(target.id)
      if (res.success) {
        ElMessage.success(`已发起咨询至 ${target.name}`)
        return true
      }
    } catch (error) {
      ElMessage.error('咨询失败')
    } finally {
      loading.value.consult = false
    }
    return false
  }
  
  /**
   * 接听电话
   */
  const answerCall = async () => {
    if (!canAnswer.value) return
    if (loading.value.answer) return
    
    loading.value.answer = true
    try {
      const res = await api.answerCall()
      if (res.success) {
        incomingCallVisible.value = false
        callStatus.value = 'talking'
        currentCall.value = incomingCallInfo.value || res.data
        startDurationTimer()
        ElMessage.success('已接听')
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.answer = false
    }
  }
  
  /**
   * 拒绝来电
   */
  const rejectCall = async () => {
    if (!canAnswer.value) return
    if (loading.value.reject) return
    
    loading.value.reject = true
    try {
      await api.hangUp()
      incomingCallVisible.value = false
      incomingCallInfo.value = null
      callStatus.value = 'idle'
      ElMessage.success('已拒绝来电')
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      loading.value.reject = false
    }
  }
  
  /**
   * 转接电话
   */
  const transferCall = async (target: TransferTarget) => {
    if (!canTransfer.value) return
    if (loading.value.transfer) return
    
    loading.value.transfer = true
    try {
      const res = await api.transferCall(target.id)
      if (res.success) {
        stopDurationTimer()
        callStatus.value = 'idle'
        currentCall.value = null
        isMuted.value = false
        ElMessage.success(`已转接至 ${target.name}`)
        return true
      }
    } catch (error) {
      ElMessage.error('转接失败')
    } finally {
      loading.value.transfer = false
    }
    return false
  }
  
  /**
   * 外呼
   */
  const outboundCall = async (phoneNumber: string, businessCode?: string) => {
    if (!canOutbound.value) return
    if (loading.value.outbound) return
    
    loading.value.outbound = true
    try {
      const res = await api.outboundCall(phoneNumber, businessCode)
      if (res.success) {
        callStatus.value = 'talking'
        currentCall.value = res.data
        startDurationTimer()
        ElMessage.success('外呼成功')
        return true
      }
    } catch (error) {
      ElMessage.error('外呼失败')
    } finally {
      loading.value.outbound = false
    }
    return false
  }
  
  /**
   * 模拟来电（用于测试）
   */
  const simulateIncomingCall = async () => {
    if (!isOnline.value || isBusy.value || isInCall.value) return
    
    try {
      const res = await api.simulateIncomingCall()
      if (res.success) {
        incomingCallInfo.value = {
          callerNumber: res.data.callerNumber,
          calleeNumber: res.data.calleeNumber,
          duration: 0,
          userLevel: res.data.userLevel,
          userAddress: res.data.userAddress,
          city: res.data.city,
          userName: res.data.userName
        }
        incomingCallVisible.value = true
        callStatus.value = 'ringing'
      }
    } catch (error) {
      console.error('模拟来电失败:', error)
    }
  }
  
  /**
   * 启动通话时长计时器
   */
  const startDurationTimer = () => {
    callDuration.value = 0
    durationTimer = window.setInterval(() => {
      callDuration.value++
      if (currentCall.value) {
        currentCall.value.duration = callDuration.value
      }
    }, 1000)
  }
  
  /**
   * 停止通话时长计时器
   */
  const stopDurationTimer = () => {
    if (durationTimer) {
      clearInterval(durationTimer)
      durationTimer = null
    }
    callDuration.value = 0
  }
  
  /**
   * 生命周期 - 组件挂载时
   */
  onMounted(() => {
    init()
  })
  
  /**
   * 生命周期 - 组件卸载时
   */
  onUnmounted(() => {
    stopDurationTimer()
  })
  
  // ========== 暴露给模板的接口 ==========
  return {
    // 状态
    agentStatus,
    busyStatus,
    callStatus,
    isMuted,
    isHolding,
    loading,
    agentInfo,
    permissions,
    currentCall,
    callDuration,
    formattedDuration,
    statusText,
    transferTargets,
    incomingCallVisible,
    incomingCallInfo,

    // 计算属性
    isOnline,
    isBusy,
    isInCall,
    isRinging,
    canAnswer,
    canHangUp,
    canMute,
    canTransfer,
    canOutbound,
    canConsult,
    canThreeWay,
    canViewRecording,

    // 方法
    toggleSignInOut,
    toggleBusy,
    toggleMute,
    toggleHold,
    hangUp,
    answerCall,
    rejectCall,
    transferCall,
    outboundCall,
    consultCall,
    simulateIncomingCall,
    init
  }
}
