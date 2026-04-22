<!--
  AI 接话分流管理 - 查看弹窗
-->
<template>
  <el-dialog
    :model-value="visible"
    title="查看分流规则"
    width="500px"
    @update:model-value="(val) => $emit('update:visible', val)"
  >
    <div v-if="data" class="view-content">
      <div class="view-item">
        <span class="label">地市名称：</span>
        <span class="value">{{ data.cityName }}</span>
      </div>
      <div class="view-item">
        <span class="label">分流类型：</span>
        <span class="value">{{ data.diversionTypeName }}</span>
      </div>
      <div class="view-item">
        <span class="label">生效情况：</span>
        <span class="value">
          {{ effectText }}
          <el-tag v-if="isCross" type="warning" size="small" style="margin-left: 8px">跨天</el-tag>
        </span>
      </div>
      <div v-if="isCross" class="view-item">
        <span class="label">跨天说明：</span>
        <span class="value cross-day">{{ crossDayText }}</span>
      </div>
      <div class="view-item">
        <span class="label">使用状态：</span>
        <span class="value">
          <el-tag :type="data.useStatus === 'enabled' ? 'success' : 'info'" size="small">
            {{ data.useStatus === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </span>
      </div>
      <div class="view-item">
        <span class="label">创建人：</span>
        <span class="value">{{ data.creatorName }}</span>
      </div>
      <div class="view-item">
        <span class="label">创建时间：</span>
        <span class="value">{{ data.createTime }}</span>
      </div>
      <div class="view-item">
        <span class="label">最后操作人：</span>
        <span class="value">{{ data.operatorName }}</span>
      </div>
      <div class="view-item">
        <span class="label">最后操作时间：</span>
        <span class="value">{{ data.updateTime }}</span>
      </div>
    </div>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AiDiversionRule } from '../types/aiDiversion'
import { isCrossDay } from '../mock/aiDiversionMock'

const props = defineProps<{
  visible: boolean
  data: AiDiversionRule | null
}>()

defineEmits<{
  (e: 'update:visible', val: boolean): void
}>()

const effectText = computed(() => {
  if (!props.data) return '-'
  if (props.data.diversionType === 'allTime') return '全时段生效'
  if (!props.data.startTime || !props.data.endTime) return '时段性生效'
  return `${props.data.startTime}-${props.data.endTime}`
})

const isCross = computed(() => {
  if (!props.data || props.data.diversionType !== 'timePeriod') return false
  if (!props.data.startTime || !props.data.endTime) return false
  return isCrossDay(props.data.startTime, props.data.endTime)
})

const crossDayText = computed(() => {
  if (!props.data || !isCross.value) return ''
  return `该规则为跨天时段，从当日${props.data.startTime}生效至次日${props.data.endTime}`
})
</script>

<style scoped>
.view-content {
  padding: 20px;
}
.view-item {
  display: flex;
  margin-bottom: 16px;
  line-height: 1.6;
}
.view-item:last-child {
  margin-bottom: 0;
}
.label {
  width: 100px;
  color: #606266;
  flex-shrink: 0;
}
.value {
  flex: 1;
  color: #303133;
  font-weight: 500;
}
.cross-day {
  color: #e6a23c;
  font-size: 13px;
  padding: 8px 12px;
  background: #fdf6ec;
  border: 1px solid #f5dab1;
  border-radius: 4px;
}
</style>
