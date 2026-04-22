/**
 * 话务条设置模块 - 主组件（示忙人数设置版）
 * @description 话务台话务条设置页面，包含示忙人数设置
 * @version 2.0.0
 */

<template>
  <div class="callbar-settings-container">
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

    <!-- 中部：示忙人数设置 -->
    <div class="busy-limit-section">
      <div class="section-title">
        <el-icon><Setting /></el-icon>
        <span>示忙人数设置</span>
      </div>

      <div class="setting-content">
        <div class="input-group">
          <span class="input-label">示忙人数上限：</span>
          <el-input-number
            v-model="busyLimit"
            :min="1"
            :max="999"
            :step="1"
            :controls="true"
            class="limit-input"
            @change="handleLimitChange"
          />
        </div>

        <div class="hint-text">
          <el-icon><InfoFilled /></el-icon>
          <span>该地市最多同时允许 <strong>{{ busyLimit }}</strong> 人进行示忙</span>
        </div>

        <div class="action-buttons">
          <el-button
            type="primary"
            :loading="saving"
            @click="handleSave"
            class="save-btn"
          >
            <el-icon><Check /></el-icon>
            保存
          </el-button>
          <el-button
            :disabled="saving"
            @click="handleReset"
            class="reset-btn"
          >
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 操作日志区域 -->
    <div class="log-section">
      <div class="section-title">
        <el-icon><Document /></el-icon>
        <span>操作日志</span>
        <el-button
          link
          type="primary"
          size="small"
          @click="loadOperationLogs"
          class="refresh-log-btn"
        >
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>

      <div class="log-content">
        <el-timeline v-if="operationLogs.length > 0">
          <el-timeline-item
            v-for="log in operationLogs.slice(0, 5)"
            :key="log.id"
            :type="log.result === 'success' ? 'success' : 'danger'"
            :timestamp="log.timestamp"
          >
            <div class="log-item">
              <span class="operator">{{ log.operator }}</span>
              <span class="operation">{{ getOperationText(log.operationType) }}</span>
              <span :class="['result', log.result]">
                {{ log.result === 'success' ? '成功' : '失败' }}
              </span>
            </div>
            <div v-if="log.operationContent" class="log-detail">
              {{ log.operationContent }}
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无操作记录" :image-size="60" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Setting,
  InfoFilled,
  Check,
  RefreshLeft,
  Document,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CityInfo, OperationLog, UserRole } from './types'
import * as api from './mock'

// ==================== 响应式数据 ====================
const cities = ref<CityInfo[]>([])
const selectedCity = ref('')
const busyLimit = ref(10)
const savedLimit = ref(10)
const saving = ref(false)
const userRole = ref<UserRole>('agent')
const operationLogs = ref<OperationLog[]>([])

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
// 获取操作类型文本
const getOperationText = (type: string): string => {
  const textMap: Record<string, string> = {
    saveBusyLimit: '保存示忙人数',
    forceInsert: '强插操作',
    monitor: '监听操作',
    reset: '重置设置'
  }
  return textMap[type] || type
}

// 初始化加载
const init = async () => {
  try {
    // 加载当前用户信息
    const userRes = await api.getCurrentUser()
    if (userRes.success) {
      userRole.value = userRes.data.role
      selectedCity.value = userRes.data.cityCode
    }

    // 加载地市列表
    const citiesRes = await api.getCities()
    if (citiesRes.success) {
      cities.value = citiesRes.data
    }

    // 加载示忙人数配置
    await loadBusyLimitConfig()

    // 加载操作日志
    await loadOperationLogs()
  } catch (error) {
    ElMessage.error('初始化失败')
  }
}

// 加载示忙人数配置
const loadBusyLimitConfig = async () => {
  if (!selectedCity.value) return
  try {
    const res = await api.getBusyLimitConfig(selectedCity.value)
    if (res.success) {
      busyLimit.value = res.data.limit
      savedLimit.value = res.data.limit
    }
  } catch (error) {
    ElMessage.error('加载示忙人数配置失败')
  }
}

// 加载操作日志
const loadOperationLogs = async () => {
  try {
    const res = await api.getOperationLogs()
    if (res.success) {
      operationLogs.value = res.data
    }
  } catch (error) {
    console.error('加载操作日志失败', error)
  }
}

// 地市切换
const handleCityChange = async () => {
  await loadBusyLimitConfig()
  ElMessage.success(`已切换到${cities.value.find(c => c.code === selectedCity.value)?.name || '未知地市'}`)
}

// 示忙人数变化
const handleLimitChange = (value: number | undefined) => {
  if (value === undefined) return
  if (value < 1) {
    busyLimit.value = 1
    ElMessage.warning('示忙人数不能小于1')
  } else if (value > 999) {
    busyLimit.value = 999
    ElMessage.warning('示忙人数不能大于999')
  }
}

// 保存示忙人数
const handleSave = async () => {
  if (!selectedCity.value) {
    ElMessage.warning('请先选择地市')
    return
  }

  if (busyLimit.value < 1 || busyLimit.value > 999) {
    ElMessage.warning('请输入1-999之间的整数')
    return
  }

  saving.value = true
  try {
    const res = await api.saveBusyLimitConfig(selectedCity.value, busyLimit.value)
    if (res.success) {
      savedLimit.value = busyLimit.value
      ElMessage.success(res.message)
      await loadOperationLogs()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 重置
const handleReset = () => {
  busyLimit.value = savedLimit.value
  ElMessage.success('已重置为上次保存值')
}

// ==================== 生命周期 ====================
onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
.callbar-settings-container {
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

  .busy-limit-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .setting-content {
      .input-group {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .input-label {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }

        .limit-input {
          width: 180px;
        }
      }

      .hint-text {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #909399;
        font-size: 13px;
        margin-bottom: 20px;
        padding: 12px 16px;
        background: #f5f7fa;
        border-radius: 4px;

        .el-icon {
          color: #e6a23c;
        }

        strong {
          color: #409eff;
          font-size: 16px;
          margin: 0 4px;
        }
      }

      .action-buttons {
        display: flex;
        gap: 12px;

        .save-btn {
          min-width: 100px;
        }

        .reset-btn {
          min-width: 100px;
        }
      }
    }
  }

  .log-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .refresh-log-btn {
        font-size: 12px;
      }
    }

    .log-content {
      max-height: 300px;
      overflow-y: auto;

      .log-item {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        .operator {
          font-weight: 500;
          color: #303133;
        }

        .operation {
          color: #606266;
        }

        .result {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;

          &.success {
            color: #67c23a;
            background: #f0f9eb;
          }

          &.failed {
            color: #f56c6c;
            background: #fef0f0;
          }
        }
      }

      .log-detail {
        margin-top: 4px;
        font-size: 12px;
        color: #909399;
        padding-left: 8px;
        border-left: 2px solid #dcdfe6;
      }
    }
  }
}
</style>
