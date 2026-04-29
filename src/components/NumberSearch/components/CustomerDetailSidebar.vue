/**
 * 号码本地搜 - 客户详情侧栏组件
 * @description 右侧客户详情展示
 * @version 1.0.0
 */

<template>
  <el-drawer
    v-model="visible"
    title="客户详情"
    size="400px"
    :with-header="true"
    :destroy-on-close="true"
    class="customer-detail-drawer"
  >
    <div v-if="customer" class="detail-content">
      <!-- 基本信息 -->
      <div class="detail-section">
        <h4 class="section-title">基本信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="客户名称">
            {{ customer.name }}
            <el-tag v-if="customer.isConfidential" type="danger" size="small" class="ml-2">保密</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="名称编码">{{ customer.nameCode }}</el-descriptions-item>
          <el-descriptions-item label="客户号码">
            {{ customer.phoneNumber }}
            <el-tag v-if="customer.isConfidential" type="danger" size="small" class="ml-2">保密</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户地址">{{ customer.address }}</el-descriptions-item>
          <el-descriptions-item label="地址编码">{{ customer.addressCode }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 区域信息 -->
      <div class="detail-section">
        <h4 class="section-title">区域信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="所属区域">{{ customer.region }}</el-descriptions-item>
          <el-descriptions-item label="地市">{{ customer.city }}</el-descriptions-item>
          <el-descriptions-item label="区县">{{ customer.district }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 其他信息 -->
      <div class="detail-section">
        <h4 class="section-title">其他信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="简称">{{ customer.shortName || '--' }}</el-descriptions-item>
          <el-descriptions-item label="简称编码">{{ customer.shortNameCode || '--' }}</el-descriptions-item>
          <el-descriptions-item label="别名">{{ customer.alias || '--' }}</el-descriptions-item>
          <el-descriptions-item label="别名编码">{{ customer.aliasCode || '--' }}</el-descriptions-item>
          <el-descriptions-item label="行业">{{ customer.industry || '--' }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ customer.remark || '--' }}</el-descriptions-item>
          <el-descriptions-item label="关联词汇">{{ customer.relatedWords || '--' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 状态信息 -->
      <div class="detail-section">
        <h4 class="section-title">状态信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="保密状态">
            <el-tag :type="customer.isConfidential ? 'danger' : 'success'">
              {{ customer.isConfidential ? '保密' : '公开' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="号码状态">
            <el-tag :type="customer.isOutOfService ? 'danger' : 'success'">
              {{ customer.isOutOfService ? '停机' : '正常' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="级别">{{ customer.level }}级</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 优推业务信息 -->
      <div v-if="customer.elegantBusiness" class="detail-section">
        <h4 class="section-title">优推业务信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="销售区域">{{ customer.elegantBusiness.salesArea || '--' }}</el-descriptions-item>
          <el-descriptions-item label="购买关键词">{{ customer.elegantBusiness.keywords || '--' }}</el-descriptions-item>
          <el-descriptions-item label="关键词编码">{{ customer.elegantBusiness.keywordCode || '--' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 实名业务信息 -->
      <div v-if="customer.realNameBusiness" class="detail-section">
        <h4 class="section-title">实名业务信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="公司实名">{{ customer.realNameBusiness.companyName || '--' }}</el-descriptions-item>
          <el-descriptions-item label="实名编码">{{ customer.realNameBusiness.realNameCode || '--' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 转接业务信息 -->
      <div v-if="customer.transferBusiness" class="detail-section">
        <h4 class="section-title">转接业务信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="转接号码">
            <div v-if="customer.transferBusiness.transferNumbers && customer.transferBusiness.transferNumbers.length > 0">
              <div v-for="(num, index) in customer.transferBusiness.transferNumbers" :key="index">
                {{ num }}
              </div>
            </div>
            <span v-else>--</span>
          </el-descriptions-item>
          <el-descriptions-item label="转接时段">
            {{ customer.transferBusiness.transferTimeStart || '--' }} - {{ customer.transferBusiness.transferTimeEnd || '--' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 企业广告业务信息 -->
      <div v-if="customer.brandBusiness" class="detail-section">
        <h4 class="section-title">企业广告业务信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="广告文字">{{ customer.brandBusiness.adText || '--' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <el-empty v-else description="暂无客户信息" />
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CustomerInfo } from '../types'

interface Props {
  modelValue: boolean
  customer: CustomerInfo | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    if (!val) {
      emit('close')
    }
  }
})
</script>

<style scoped lang="scss">
.customer-detail-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;

    span {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  :deep(.el-drawer__body) {
    padding: 20px;
    overflow-y: auto;
  }
}

.detail-content {
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

  :deep(.el-descriptions__label) {
    width: 100px;
    background-color: #f5f7fa;
  }

  .ml-2 {
    margin-left: 8px;
  }
}
</style>
