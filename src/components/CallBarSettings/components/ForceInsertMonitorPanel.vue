/**
 * 话务条设置 - 强插监听面板
 * @description 强插和监听操作面板
 * @version 1.0.0
 */

<template>
  <div class="force-insert-monitor-panel">
    <!-- 顶部：地市选择 -->
    <div class="header-section">
      <div class="city-selector">
        <span class="label">所属地市：</span>
        <el-select
          v-model="selectedCity"
          placeholder="请选择地市"
          class="city-select"
          @change="handleCityChange"
        >
          <el-option
            v-for="city in cities"
            :key="city.code"
            :label="city.name"
            :value="city.code"
          />
        </el-select>
      </div>
    </div>

    <!-- 强插监听操作（仅管理员/班长可见） -->
    <div v-if="hasPermission" class="operation-section">
      <div class="section-title">
        <el-icon><Phone /></el-icon>
        <span>强插监听操作</span>
        <el-tag type="warning" size="small" effect="light" class="permission-tag">
          {{ userRoleText }}
        </el-tag>
      </div>

      <div class="operation-content">
        <el-tooltip content="强插：加入选中话务员的三方通话" placement="top">
          <el-button
            type="danger"
            size="large"
            class="operation-btn force-insert-btn"
            @click="handleOpenForceInsert"
          >
            <el-icon><PhoneFilled /></el-icon>
            <span>强插</span>
          </el-button>
        </el-tooltip>

        <el-tooltip content="监听：建立对选中话务员的单向监听" placement="top">
          <el-button
            type="primary"
            size="large"
            class="operation-btn monitor-btn"
            @click="handleOpenMonitor"
          >
            <el-icon><Headset /></el-icon>
            <span>监听</span>
          </el-button>
        </el-tooltip>
      </div>

      <div class="operation-hint">
        <el-icon><Warning /></el-icon>
        <span>提示：仅可选择通话中状态的话务员进行操作</span>
      </div>
    </div>

    <!-- 普通坐席提示 -->
    <div v-else class="no-permission-section">
      <el-empty
        description="暂无强插监听权限"
        :image-size="80"
      >
        <template #image>
          <el-icon :size="60" color="#909399"><Lock /></el-icon>
        </template>
        <template #description>
          <div class="no-permission-text">
            <p>您当前为普通坐席角色</p>
            <p class="sub-text">如需使用强插监听功能，请联系管理员申请权限</p>
          </div>
        </template>
      </el-empty>
    </div>

    <!-- 话务员选择弹窗 -->
    <AgentSelectDialog
      v-model="showAgentDialog"
      :operation-type="currentOperation"
      :city-code="selectedCity"
      @confirm="handleAgentSelected"
      @cancel="handleAgentCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Phone,
  PhoneFilled,
  Headset,
  Warning,
  Lock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AgentSelectDialog from './AgentSelectDialog.vue'
import type { CityInfo, OperationType, UserRole } from '../types'
import * as api from '../mock'

// ==================== 响应式数据 ====================
const cities = ref<CityInfo[]>([])
const selectedCity = ref('')
const hasPermission = ref(false)
const userRole = ref<UserRole>('agent')
const showAgentDialog = ref(false)
const currentOperation = ref<OperationType>('forceInsert')

// ==================== 计算属性 ====================
const userRoleText = computed(() => {
  const roleMap: Record<UserRole, string> = {
    admin: '管理员',
    supervisor: '班长',
    agent: '坐席'
  }
  return roleMap[userRole.value] || '未知'
})

// ==================== 方法 ====================
// 初始化加载
const init = async () => {
  try {
    // 加载当前用户信息
    const userRes = await api.getCurrentUser()
    if (userRes.success) {
      userRole.value = userRes.data.role
      selectedCity.value = userRes.data.cityCode
    }

    // 检查权限
    const permRes = await api.checkPermission()
    if (permRes.success) {
      hasPermission.value = permRes.data.hasPermission
    }

    // 加载地市列表
    const citiesRes = await api.getCities()
    if (citiesRes.success) {
      cities.value = citiesRes.data
    }
  } catch (error) {
    ElMessage.error('初始化失败')
  }
}

// 地市切换
const handleCityChange = async () => {
  ElMessage.success(`已切换到${cities.value.find(c => c.code === selectedCity.value)?.name || '未知地市'}`)
}

// 打开强插弹窗
const handleOpenForceInsert = () => {
  currentOperation.value = 'forceInsert'
  showAgentDialog.value = true
}

// 打开监听弹窗
const handleOpenMonitor = () => {
  currentOperation.value = 'monitor'
  showAgentDialog.value = true
}

// 话务员选择确认
const handleAgentSelected = () => {
  // 操作成功后的回调
}

// 话务员选择取消
const handleAgentCancel = () => {
  // 取消操作
}

// ==================== 生命周期 ====================
onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
.force-insert-monitor-panel {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;

  .header-section {
    background: #fff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .city-selector {
      display: flex;
      align-items: center;
      gap: 12px;

      .label {
        font-size: 14px;
        color: #606266;
        font-weight: 500;
      }

      .city-select {
        width: 200px;
      }
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;

    .el-icon {
      font-size: 18px;
      color: #409eff;
    }

    .permission-tag {
      margin-left: 8px;
    }
  }

  .operation-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .operation-content {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;

      .operation-btn {
        min-width: 140px;
        height: 48px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        .el-icon {
          font-size: 20px;
        }
      }

      .force-insert-btn {
        background: #f56c6c;
        border-color: #f56c6c;

        &:hover {
          background: #f78989;
          border-color: #f78989;
        }
      }

      .monitor-btn {
        background: #409eff;
        border-color: #409eff;

        &:hover {
          background: #66b1ff;
          border-color: #66b1ff;
        }
      }
    }

    .operation-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #e6a23c;
      font-size: 13px;
      padding: 10px 16px;
      background: #fdf6ec;
      border-radius: 4px;
      border: 1px solid #f5dab1;

      .el-icon {
        font-size: 16px;
      }
    }
  }

  .no-permission-section {
    background: #fff;
    padding: 40px 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .no-permission-text {
      text-align: center;
      color: #606266;

      p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
      }

      .sub-text {
        font-size: 12px;
        color: #909399;
        margin-top: 8px;
      }
    }
  }
}
</style>
