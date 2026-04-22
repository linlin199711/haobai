/**
 * 呼叫中心话务条 - 转接弹窗组件
 * @description 支持选择转接目标坐席或部门
 */

<template>
  <el-dialog
    v-model="visible"
    title="选择转接目标"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div class="transfer-dialog-content">
      <!-- 转接类型选择 -->
      <el-form label-width="80px">
        <el-form-item label="转接类型">
          <el-radio-group v-model="transferType">
            <el-radio-button label="agent">坐席</el-radio-button>
            <el-radio-button label="department">部门</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <!-- 搜索框 -->
        <el-form-item label="搜索">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入名称搜索"
            clearable
            :prefix-icon="Search"
          />
        </el-form-item>
        
        <!-- 目标列表 -->
        <el-form-item label="选择目标" required>
          <el-scrollbar height="280px" class="target-list">
            <div
              v-for="item in filteredTargets"
              :key="item.id"
              class="target-item"
              :class="{ 
                active: selectedTarget?.id === item.id,
                'is-offline': item.type === 'agent' && item.status === 'offline'
              }"
              @click="selectTarget(item)"
            >
              <div class="target-info">
                <div class="target-name">
                  <el-icon v-if="item.type === 'agent'">
                    <User />
                  </el-icon>
                  <el-icon v-else>
                    <OfficeBuilding />
                  </el-icon>
                  <span>{{ item.name }}</span>
                  <el-tag
                    v-if="item.type === 'agent'"
                    :type="getStatusType(item.status)"
                    size="small"
                    class="status-tag"
                  >
                    {{ getStatusText(item.status) }}
                  </el-tag>
                </div>
                <div v-if="item.department" class="target-dept">
                  {{ item.department }}
                </div>
              </div>
              <el-icon v-if="selectedTarget?.id === item.id" class="check-icon">
                <Check />
              </el-icon>
            </div>
            
            <!-- 空状态 -->
            <el-empty
              v-if="filteredTargets.length === 0"
              description="暂无匹配目标"
              :image-size="60"
            />
          </el-scrollbar>
        </el-form-item>
      </el-form>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!selectedTarget"
          @click="handleConfirm"
        >
          确认转接
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, User, OfficeBuilding, Check } from '@element-plus/icons-vue'
import type { TransferTarget } from '../types'

interface Props {
  modelValue: boolean
  targets: TransferTarget[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', target: TransferTarget): void
  (e: 'cancel'): void
}>()

// 弹窗显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 转接类型
const transferType = ref<'agent' | 'department'>('agent')

// 搜索关键词
const searchKeyword = ref('')

// 选中的目标
const selectedTarget = ref<TransferTarget | null>(null)

// 过滤后的目标列表
const filteredTargets = computed(() => {
  let list = props.targets.filter(item => item.type === transferType.value)
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      (item.department && item.department.toLowerCase().includes(keyword))
    )
  }
  
  // 按状态排序：在线 > 示忙 > 离线
  if (transferType.value === 'agent') {
    list.sort((a, b) => {
      const statusOrder = { online: 0, busy: 1, offline: 2 }
      return statusOrder[a.status || 'offline'] - statusOrder[b.status || 'offline']
    })
  }
  
  return list
})

// 选择目标
const selectTarget = (target: TransferTarget) => {
  if (target.type === 'agent' && target.status === 'offline') {
    return
  }
  selectedTarget.value = target
}

// 获取状态标签类型
const getStatusType = (status?: string): 'success' | 'warning' | 'info' => {
  switch (status) {
    case 'online':
      return 'success'
    case 'busy':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status?: string): string => {
  switch (status) {
    case 'online':
      return '在线'
    case 'busy':
      return '示忙'
    default:
      return '离线'
  }
}

// 确认转接
const handleConfirm = () => {
  if (selectedTarget.value) {
    emit('confirm', selectedTarget.value)
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

// 监听弹窗打开，重置状态
watch(() => props.modelValue, (val) => {
  if (val) {
    selectedTarget.value = null
    searchKeyword.value = ''
    transferType.value = 'agent'
  }
})
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

.transfer-dialog-content {
  padding: 10px 0;
}

.target-list {
  border: 1px solid $border-color;
  border-radius: 4px;
  padding: 8px;
  background-color: $bg-white;
}

.target-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: $bg-light;
  
  &:hover {
    background-color: #e6f7ff;
    border-color: $primary-color;
  }
  
  &.active {
    background-color: #e6f7ff;
    border: 1px solid $primary-color;
  }
  
  &.is-offline {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      background-color: $bg-light;
      border-color: transparent;
    }
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.target-info {
  flex: 1;
  min-width: 0;
}

.target-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: $text-primary;
  font-weight: 500;
  
  .el-icon {
    font-size: 16px;
    color: $primary-color;
  }
  
  .status-tag {
    margin-left: 4px;
  }
}

.target-dept {
  font-size: 12px;
  color: $text-muted;
  margin-top: 4px;
  margin-left: 24px;
}

.check-icon {
  font-size: 20px;
  color: $primary-color;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-radio-group) {
  .el-radio-button__inner {
    padding: 8px 20px;
  }
}
</style>