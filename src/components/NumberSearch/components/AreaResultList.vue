<!--
  号码本地搜 - 地区搜索结果列表组件
  @description 地区搜索结果展示，支持地市和区县两种类型
  @version 1.0.0
-->

<template>
  <div class="area-result-list">
    <!-- 结果统计 -->
    <div class="result-header">
      <div class="result-stats">
        <el-tag type="info" effect="plain">
          共找到 <strong>{{ total }}</strong> 条结果
        </el-tag>
        <el-tag v-if="cityCount > 0" type="success" effect="plain" class="ml-2">
          地市 {{ cityCount }} 个
        </el-tag>
        <el-tag v-if="districtCount > 0" type="warning" effect="plain" class="ml-2">
          区县 {{ districtCount }} 个
        </el-tag>
      </div>
      <div class="result-actions">
        <el-button size="small" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button size="small" type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 结果列表 -->
    <div v-if="data.length > 0" class="result-content">
      <div
        v-for="item in data"
        :key="item.id"
        class="area-card"
        :class="{ 'is-city': item.type === 'city', 'is-district': item.type === 'district' }"
        @click="handleCardClick(item)"
      >
        <!-- 地市卡片 -->
        <template v-if="item.type === 'city' && item.city">
          <div class="card-header">
            <div class="area-type-tag city-tag">地市</div>
            <h3 class="area-name">{{ item.city.name }}</h3>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">邮编：</span>
              <span class="info-value">{{ item.city.zipCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">区号：</span>
              <span class="info-value">{{ item.city.areaCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">拼音：</span>
              <span class="info-value">{{ item.city.pinyin }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">下辖区县：</span>
              <span class="info-value">{{ item.city.districts.length }} 个</span>
            </div>
          </div>
        </template>

        <!-- 区县卡片 -->
        <template v-if="item.type === 'district' && item.district">
          <div class="card-header">
            <div class="area-type-tag district-tag">区县</div>
            <h3 class="area-name">{{ item.district.name }}</h3>
          </div>
          <div class="card-body">
            <div class="info-row highlight">
              <span class="info-label">所属地市：</span>
              <span class="info-value">{{ item.district.cityName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">地市邮编：</span>
              <span class="info-value">{{ item.district.cityZipCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">地市区号：</span>
              <span class="info-value">{{ item.district.cityAreaCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">区县邮编：</span>
              <span class="info-value">{{ item.district.zipCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">拼音：</span>
              <span class="info-value">{{ item.district.pinyin }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="暂无匹配的地区信息"
      class="empty-state"
    >
      <template #image>
        <el-icon :size="60" color="#c0c4cc"><Location /></el-icon>
      </template>
      <template #description>
        <div class="empty-description">
          <p>暂无匹配的地区信息</p>
          <p class="empty-tip">请尝试输入其他地区名称</p>
        </div>
      </template>
    </el-empty>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        size="small"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Refresh, Download, Location } from '@element-plus/icons-vue'
import type { AreaSearchResult } from '../types/areaSearch'

interface Props {
  data: AreaSearchResult[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'export'): void
  (e: 'select', item: AreaSearchResult): void
  (e: 'pageChange', page: number, pageSize: number): void
}>()

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 统计
const total = computed(() => props.data.length)
const cityCount = computed(() => props.data.filter(item => item.type === 'city').length)
const districtCount = computed(() => props.data.filter(item => item.type === 'district').length)

// 刷新
const handleRefresh = () => {
  emit('refresh')
}

// 导出
const handleExport = () => {
  emit('export')
}

// 卡片点击
const handleCardClick = (item: AreaSearchResult) => {
  emit('select', item)
}

// 分页变化
const handlePageChange = () => {
  emit('pageChange', currentPage.value, pageSize.value)
}
</script>

<style scoped lang="scss">
.area-result-list {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

// 结果头部
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;

  .result-stats {
    display: flex;
    align-items: center;

    .ml-2 {
      margin-left: 8px;
    }
  }

  .result-actions {
    display: flex;
    gap: 8px;
  }
}

// 结果内容
.result-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

// 地区卡片
.area-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #409eff;
  }

  &.is-city {
    border-left: 4px solid #67c23a;
  }

  &.is-district {
    border-left: 4px solid #e6a23c;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #e4e7ed;

    .area-type-tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &.city-tag {
        background: #e8f5e9;
        color: #2e7d32;
      }

      &.district-tag {
        background: #fff3e0;
        color: #ef6c00;
      }
    }

    .area-name {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .card-body {
    .info-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      &.highlight {
        background: #f5f7fa;
        padding: 4px 8px;
        border-radius: 4px;
        margin: 0 -8px 8px;
      }

      .info-label {
        color: #909399;
        width: 80px;
        flex-shrink: 0;
      }

      .info-value {
        color: #606266;
        font-weight: 500;
      }
    }
  }
}

// 空状态
.empty-state {
  padding: 40px 0;

  .empty-description {
    text-align: center;

    p {
      margin: 0;
      color: #606266;
      font-size: 14px;
    }

    .empty-tip {
      color: #909399;
      font-size: 12px;
      margin-top: 8px;
    }
  }
}

// 分页
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}
</style>
