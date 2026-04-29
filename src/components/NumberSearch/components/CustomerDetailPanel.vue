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
            <span class="info-label">简称</span>
            <span class="info-value">{{ customer.shortName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">简称编码</span>
            <span class="info-value">{{ customer.shortNameCode || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">别名</span>
            <span class="info-value">{{ customer.alias || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">别名编码</span>
            <span class="info-value">{{ customer.aliasCode || '--' }}</span>
          </div>
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

      <!-- 优推业务信息 -->
      <div v-if="customer.elegantBusiness" class="detail-section">
        <h4 class="section-title">优推业务信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">销售区域</span>
            <span class="info-value">{{ customer.elegantBusiness.salesArea || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">购买关键词</span>
            <span class="info-value">{{ customer.elegantBusiness.keywords || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关键词编码</span>
            <span class="info-value">{{ customer.elegantBusiness.keywordCode || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 实名业务信息 -->
      <div v-if="customer.realNameBusiness" class="detail-section">
        <h4 class="section-title">实名业务信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">公司实名</span>
            <span class="info-value">{{ customer.realNameBusiness.companyName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">实名编码</span>
            <span class="info-value">{{ customer.realNameBusiness.realNameCode || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 转接业务信息 -->
      <div v-if="customer.transferBusiness" class="detail-section">
        <h4 class="section-title">转接业务信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">转接号码</span>
            <span class="info-value">
              <template v-if="customer.transferBusiness.transferNumbers && customer.transferBusiness.transferNumbers.length > 0">
                <div v-for="(num, index) in customer.transferBusiness.transferNumbers" :key="index">
                  {{ num }}
                </div>
              </template>
              <span v-else>--</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">转接时段</span>
            <span class="info-value">
              {{ customer.transferBusiness.transferTimeStart || '--' }} - {{ customer.transferBusiness.transferTimeEnd || '--' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 企业广告业务信息 -->
      <div v-if="customer.brandBusiness" class="detail-section">
        <h4 class="section-title">企业广告业务信息</h4>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">广告文字</span>
            <span class="info-value">{{ customer.brandBusiness.adText || '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else description="暂无客户信息" />
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import type { CustomerInfo } from '../types'

interface Props {
  customer: CustomerInfo | null
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
