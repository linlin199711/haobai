/**
 * 号码本地搜 - 客户详情面板组件
 * @description 右侧固定展示客户详情
 * @version 1.0.0
 */

<template>
  <div class="customer-detail-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <h3 class="panel-title">客户详情</h3>
      <el-button type="text" @click="handleClose">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>

    <!-- 面板内容 -->
    <div v-if="customer" class="panel-content">
      <!-- 基本信息 -->
      <div class="detail-section">
        <h4 class="section-title">基本信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">客户名称</span>
            <span class="info-value">
              {{ customer.name }}
              <el-tag v-if="customer.isConfidential" type="danger" size="small">保密</el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">名称编码</span>
            <span class="info-value">{{ customer.nameCode }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户号码</span>
            <span class="info-value">
              <template v-if="customer.isConfidential">
                <span class="confidential-text">***********</span>
              </template>
              <template v-else>
                {{ customer.phoneNumber }}
              </template>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">客户地址</span>
            <span class="info-value">
              <template v-if="customer.isConfidential">
                <span class="confidential-text">***********</span>
              </template>
              <template v-else>
                {{ customer.address }}
              </template>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">地址编码</span>
            <span class="info-value">{{ customer.addressCode }}</span>
          </div>
        </div>
      </div>

      <!-- 区域信息 -->
      <div class="detail-section">
        <h4 class="section-title">区域信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">所属区域</span>
            <span class="info-value">{{ customer.region }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">地市</span>
            <span class="info-value">{{ customer.city }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">区县</span>
            <span class="info-value">{{ customer.district }}</span>
          </div>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="detail-section">
        <h4 class="section-title">其他信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">行业</span>
            <span class="info-value">{{ customer.industry || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">备注</span>
            <span class="info-value">{{ customer.remark || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联词汇</span>
            <span class="info-value">{{ customer.relatedWords || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="detail-section">
        <h4 class="section-title">状态信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">保密状态</span>
            <span class="info-value">
              <el-tag :type="customer.isConfidential ? 'danger' : 'success'" size="small">
                {{ customer.isConfidential ? '保密' : '公开' }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">号码状态</span>
            <span class="info-value">
              <el-tag :type="customer.isOutOfService ? 'danger' : 'success'" size="small">
                {{ customer.isOutOfService ? '停机' : '正常' }}
              </el-tag>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">级别</span>
            <span class="info-value">{{ customer.level }}级</span>
          </div>
        </div>
      </div>

      <!-- 级联关系 -->
      <div class="detail-section" v-if="cascadeData.parent || (cascadeData.children && cascadeData.children.length > 0)">
        <h4 class="section-title">级联关系</h4>
        
        <!-- 上级 -->
        <div v-if="cascadeData.parent" class="cascade-section">
          <div class="cascade-label">上级单位</div>
          <div class="cascade-item">
            <el-icon><ArrowUp /></el-icon>
            <span>{{ cascadeData.parent.name }}</span>
            <el-tag size="small" type="info">{{ cascadeData.parent.phoneNumber }}</el-tag>
          </div>
        </div>

        <!-- 下级 -->
        <div v-if="cascadeData.children && cascadeData.children.length > 0" class="cascade-section">
          <div class="cascade-label">下级单位 ({{ cascadeData.children.length }})</div>
          <div v-for="child in cascadeData.children" :key="child.id" class="cascade-item">
            <el-icon><ArrowDown /></el-icon>
            <span>{{ child.name }}</span>
            <el-tag size="small" type="info">{{ child.phoneNumber }}</el-tag>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else description="暂无客户信息" />
  </div>
</template>

<script setup lang="ts">
import { Close, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import type { CustomerInfo } from '../types'

interface Props {
  customer: CustomerInfo | null
  cascadeData: {
    parent: CustomerInfo | null
    children: CustomerInfo[]
  }
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.customer-detail-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;

  .panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #1890ff;
}

.info-list {
  background: #fafafa;
  border-radius: 4px;
  padding: 12px;
}

.info-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  width: 80px;
  color: #606266;
  font-size: 13px;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  color: #303133;
  font-size: 13px;
  word-break: break-all;

  .confidential-text {
    color: #909399;
    letter-spacing: 2px;
  }
}

.cascade-section {
  margin-top: 12px;
}

.cascade-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.cascade-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;

  .el-icon {
    color: #1890ff;
  }
}
</style>
