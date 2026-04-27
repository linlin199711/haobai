/**
 * 号码本地搜 - 结果列表组件
 * @description 搜索结果表格与分页
 * @version 2.0.0
 */

<template>
  <div class="result-list">
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-table
        :data="data"
        stripe
        v-loading="loading"
        @row-click="handleRowClick"
        class="result-table"
        row-key="id"
      >
        <!-- 级联 -->
        <el-table-column label="级联" width="100" align="center">
          <template #default="{ row }">
            <div class="cascade-icons">
              <!-- 有上级时显示返回按钮（表示这是下级） -->
              <el-button
                v-if="hasParent(row)"
                type="info"
                link
                size="small"
                class="cascade-btn"
                @click.stop="viewParent(row)"
                title="查看上级"
              >
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <!-- 有下级时显示展开按钮（跳转到下级列表） -->
              <el-button
                v-else-if="hasChildren(row)"
                type="primary"
                link
                size="small"
                class="cascade-btn"
                @click.stop="viewChildren(row)"
                title="查看下级列表"
              >
                <el-icon><ArrowRight /></el-icon>
              </el-button>
              <span v-else class="no-cascade">-</span>
            </div>
          </template>
        </el-table-column>

        <!-- 名称 -->
        <el-table-column label="名称" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="name-cell">
              <!-- 优先播报标识（黑色三角号） -->
              <span v-if="row.isPriority" class="priority-icon" title="优先播报">▲</span>
              <!-- 停机标签 -->
              <el-tag
                v-if="row.isOutOfService"
                type="danger"
                size="small"
                class="status-tag"
              >
                停机
              </el-tag>
              <!-- 保密数据只显示名称 -->
              <template v-if="row.isConfidential">
                <span>{{ row.name }}</span>
                <el-tag type="danger" size="small" class="confidential-tag">保密</el-tag>
              </template>
              <template v-else>
                <span>{{ row.name }}</span>
              </template>
            </div>
          </template>
        </el-table-column>

        <!-- 电话 -->
        <el-table-column label="电话" width="160">
          <template #default="{ row }">
            <div class="phone-cell">
              <!-- 保密数据显示*号 -->
              <template v-if="row.isConfidential">
                <span class="confidential-text">***********</span>
              </template>
              <template v-else>
                <span>{{ row.phoneNumber }}</span>
              </template>
            </div>
          </template>
        </el-table-column>

        <!-- 地址 -->
        <el-table-column label="地址" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <template v-if="row.isConfidential">
              <span class="confidential-text">***********</span>
            </template>
            <template v-else>
              <span>{{ row.address }}</span>
            </template>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="360" fixed="right">
          <template #default="{ row }">
            <div class="operation-btns">
              <!-- 拍号：停机或保密不展示 -->
              <el-button
                v-if="hasService(row, 'dial')"
                type="primary"
                link
                size="small"
                @click.stop="handleDial(row)"
              >
                拍号
              </el-button>
              <!-- 优推 -->
              <el-button
                v-if="hasService(row, 'elegant')"
                type="primary"
                link
                size="small"
                @click.stop="handleElegant(row)"
              >
                优推
              </el-button>
              <!-- 广告 -->
              <el-button
                v-if="hasService(row, 'brand')"
                type="primary"
                link
                size="small"
                @click.stop="handleBrand(row)"
              >
                广告
              </el-button>
              <!-- 实名 -->
              <el-button
                v-if="hasService(row, 'realName')"
                type="primary"
                link
                size="small"
                @click.stop="handleRealName(row)"
              >
                实名
              </el-button>
              <!-- 转接 -->
              <el-button
                v-if="hasService(row, 'transfer')"
                type="primary"
                link
                size="small"
                :disabled="!canTransfer"
                @click.stop="handleTransfer(row)"
              >
                转接
              </el-button>
              <!-- 短信 -->
              <el-button
                v-if="hasService(row, 'sms')"
                type="primary"
                link
                size="small"
                @click.stop="handleSms(row)"
              >
                短信
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-wrapper">
      <div class="pagination-info">
        共 {{ pagination.total }} 条记录 第 {{ pagination.page }}/{{ pagination.totalPages }} 页
      </div>
      <div class="pagination-controls">
        <el-button
          :disabled="pagination.page <= 1"
          @click="handlePrevPage"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <el-button
          v-for="page in displayedPages"
          :key="page"
          :type="page === pagination.page ? 'primary' : 'default'"
          @click="handlePageClick(page)"
        >
          {{ page }}
        </el-button>
        <el-button
          :disabled="pagination.page >= pagination.totalPages"
          @click="handleNextPage"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-select
          v-model="currentPageSize"
          class="page-size-select"
          @change="handlePageSizeChange"
        >
          <el-option label="10条/页" :value="10" />
          <el-option label="20条/页" :value="20" />
          <el-option label="50条/页" :value="50" />
        </el-select>
        <span class="jump-text">跳至</span>
        <el-input
          v-model="jumpPage"
          class="jump-input"
          @keyup.enter="handleJump"
        />
        <span class="jump-text">页</span>
        <el-button type="primary" @click="handleJump">跳转</el-button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import type { CustomerInfo, AgentStatus } from '../types'

interface Props {
  data: CustomerInfo[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  agentStatus: AgentStatus
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'pageSizeChange', pageSize: number): void
  (e: 'rowClick', row: CustomerInfo): void
  (e: 'dial', row: CustomerInfo): void
  (e: 'transfer', row: CustomerInfo): void
  (e: 'sms', row: CustomerInfo): void
  (e: 'viewParent', row: CustomerInfo): void
  (e: 'viewChildren', row: CustomerInfo): void
}>()

// 当前每页条数
const currentPageSize = ref(props.pagination.pageSize)

// 跳转页码
const jumpPage = ref('')

// 是否可以转接
const canTransfer = computed(() => {
  return props.agentStatus.isOnline && 
         !props.agentStatus.isBusy && 
         !props.agentStatus.noIncomingCall
})

// 显示的页码（最多显示9个）
const displayedPages = computed(() => {
  const { page, totalPages } = props.pagination
  const pages: number[] = []
  
  let start = Math.max(1, page - 4)
  let end = Math.min(totalPages, start + 8)
  
  if (end - start < 8) {
    start = Math.max(1, end - 8)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 判断是否有上级
const hasParent = (row: CustomerInfo) => {
  return !!row.parentId
}

// 判断是否有下级
const hasChildren = (row: CustomerInfo) => {
  return row.children && row.children.length > 0
}

// 判断是否拥有某项业务
const hasService = (row: CustomerInfo, service: string) => {
  return row.services && row.services.includes(service)
}

// 查看上级
const viewParent = (row: CustomerInfo) => {
  emit('viewParent', row)
}

// 查看下级
const viewChildren = (row: CustomerInfo) => {
  emit('viewChildren', row)
}

// 点击行
const handleRowClick = (row: CustomerInfo) => {
  emit('rowClick', row)
}

// 拍号
const handleDial = (row: CustomerInfo) => {
  emit('dial', row)
}

// 优推
const handleElegant = (row: CustomerInfo) => {
  console.log('优推', row)
}

// 品牌
const handleBrand = (row: CustomerInfo) => {
  console.log('品牌', row)
}

// 实名
const handleRealName = (row: CustomerInfo) => {
  console.log('实名', row)
}

// 转接
const handleTransfer = (row: CustomerInfo) => {
  emit('transfer', row)
}

// 短信
const handleSms = (row: CustomerInfo) => {
  emit('sms', row)
}

// 上一页
const handlePrevPage = () => {
  if (props.pagination.page > 1) {
    emit('pageChange', props.pagination.page - 1)
  }
}

// 下一页
const handleNextPage = () => {
  if (props.pagination.page < props.pagination.totalPages) {
    emit('pageChange', props.pagination.page + 1)
  }
}

// 点击页码
const handlePageClick = (page: number) => {
  emit('pageChange', page)
}

// 每页条数切换
const handlePageSizeChange = (pageSize: number) => {
  emit('pageSizeChange', pageSize)
}

// 跳转
const handleJump = () => {
  const page = parseInt(jumpPage.value)
  if (page && page >= 1 && page <= props.pagination.totalPages) {
    emit('pageChange', page)
    jumpPage.value = ''
  }
}
</script>

<style scoped lang="scss">
.result-list {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  padding: 12px; // 减小padding
}

.result-table {
  // 隐藏表格默认的展开图标
  :deep(.el-table__expand-icon) {
    display: none;
  }

  .cascade-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .cascade-btn {
      padding: 2px 6px;
      font-size: 12px;

      .el-icon {
        font-size: 14px;
      }
    }

    .no-cascade {
      color: #c0c4cc;
    }
  }

  .name-cell,
  .phone-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .priority-icon {
    color: #000;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .status-tag {
    flex-shrink: 0;
  }

  .confidential-tag {
    flex-shrink: 0;
  }

  .confidential-text {
    color: #909399;
    letter-spacing: 2px;
  }

  .operation-btns {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    .el-button {
      padding: 0 4px;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px; // 减小padding
  border-top: 1px solid #ebeef5;

  .pagination-info {
    color: #606266;
    font-size: 14px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
      min-width: 32px;
      padding: 0 8px;
    }

    .page-size-select {
      width: 100px;
    }

    .jump-text {
      color: #606266;
      font-size: 14px;
    }

    .jump-input {
      width: 50px;

      :deep(.el-input__wrapper) {
        padding: 0 8px;
      }
    }
  }
}

</style>
