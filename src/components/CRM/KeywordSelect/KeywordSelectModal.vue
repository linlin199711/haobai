<!--
  CRM关键词选择模块 - 关键词选择弹窗
  @description 基于销售单元的CRM关键词选择，支持单个关键词选择
  @version 3.0.0
-->
<template>
  <transition name="modal-fade">
    <div v-if="visible" class="keyword-select-modal" @click.self="handleClose">
      <!-- 遮罩层 -->
      <div class="modal-overlay"></div>

      <!-- 弹窗内容 -->
      <div class="modal-container">
        <!-- 顶部标题栏 -->
        <div class="modal-header">
          <span class="modal-title">CRM关键词选择</span>
          <button class="close-btn" @click="handleClose">
            <el-icon size="18"><Close /></el-icon>
          </button>
        </div>

        <!-- 无销售单元提示 -->
        <div v-if="!hasSalesUnits" class="empty-sales-unit">
          <el-empty description="请先创建销售单元">
            <template #description>
              <div class="empty-description">
                <el-icon size="48" color="#909399"><Warning /></el-icon>
                <p>暂无可用销售单元</p>
                <p class="empty-tip">请先前往【销售单元信息管理】创建销售单元</p>
              </div>
            </template>
          </el-empty>
        </div>

        <template v-else>
          <!-- 查询区域 -->
          <div class="query-section">
            <div class="query-item">
              <label class="query-label">关键词：</label>
              <el-input
                v-model="queryForm.keyword"
                placeholder="请输入关键词"
                clearable
                class="query-input"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="query-item">
              <label class="query-label">地区选择：</label>
              <el-select
                v-model="queryForm.region"
                placeholder="请选择地区"
                clearable
                class="query-select"
                @change="handleRegionChange"
              >
                <el-option
                  v-for="item in regionConfigs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="query-item">
              <label class="query-label">行业：</label>
              <el-select
                v-model="queryForm.industry"
                placeholder="请选择行业"
                clearable
                class="query-select"
                @change="handleSearch"
              >
                <el-option
                  v-for="item in industryConfigs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <el-button
              type="success"
              :loading="loading"
              class="query-btn"
              @click="handleSearch"
            >
              查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>

          <!-- 主体内容区 - 表格区域 -->
          <div class="table-section">
            <el-table
              ref="tableRef"
              :data="salesUnitList"
              stripe
              border
              v-loading="loading"
              highlight-current-row
              @row-click="handleRowClick"
              class="sales-unit-table"
              row-key="id"
              height="400"
            >
              <!-- 单选列 -->
              <el-table-column
                width="60"
                align="center"
              >
                <template #default="{ row }">
                  <el-radio
                    v-model="selectedItemId"
                    :label="row.id"
                    @click.stop
                  />
                </template>
              </el-table-column>

              <!-- ID -->
              <el-table-column
                prop="id"
                label="ID"
                width="80"
                align="center"
              />

              <!-- 区域 -->
              <el-table-column
                label="区域"
                min-width="150"
                align="center"
              >
                <template #default="{ row }">
                  {{ row.regionName }}{{ row.districtName ? ' ' + row.districtName : '' }}
                </template>
              </el-table-column>

              <!-- 所属商圈 -->
              <el-table-column
                label="所属商圈"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  - <!-- 占位符 -->
                </template>
              </el-table-column>

              <!-- 行业 -->
              <el-table-column
                prop="industryName"
                label="行业"
                width="100"
                align="center"
              />

              <!-- 关键词 -->
              <el-table-column
                prop="keyword"
                label="关键词"
                min-width="120"
                show-overflow-tooltip
              />

              <!-- 开始时段 -->
              <el-table-column
                label="开始时段"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  - <!-- 占位符 -->
                </template>
              </el-table-column>

              <!-- 结束时段 -->
              <el-table-column
                label="结束时段"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  - <!-- 占位符 -->
                </template>
              </el-table-column>

              <!-- 最大销售数 -->
              <el-table-column
                prop="maxSalesCount"
                label="最大销售数"
                width="100"
                align="center"
              />

              <!-- 实际销售数 -->
              <el-table-column
                label="实际销售数"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  - <!-- 占位符 -->
                </template>
              </el-table-column>

              <!-- 建议售价 -->
              <el-table-column
                prop="suggestedPrice"
                label="建议售价"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  ¥{{ row.suggestedPrice }}
                </template>
              </el-table-column>

              <!-- 排序模式 -->
              <el-table-column
                prop="sortMode"
                label="排序模式"
                width="100"
                align="center"
              />
            </el-table>

            <!-- 空状态 -->
            <el-empty
              v-if="!loading && salesUnitList.length === 0"
              description="暂无符合条件的销售单元"
              class="empty-state"
            />

            <!-- 分页区域 -->
            <div class="pagination-section">
              <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.pageSize"
                :total="pagination.total"
                :page-sizes="[10, 15, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageChange"
                background
              />
            </div>
          </div>
        </template>

        <!-- 底部按钮 -->
        <div class="modal-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button 
            type="primary" 
            :disabled="!selectedItem || !hasSalesUnits"
            @click="handleConfirm"
          >
            确认选择
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Close,
  Warning
} from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import type { SalesUnitItem, SalesUnitQueryParams } from '../SalesUnitManage/types/salesUnitManage'
import { AuditStatusEnum } from '../SalesUnitManage/types/salesUnitManage'
import { regionConfigs, industryConfigs } from '../SalesUnitManage/mock/salesUnitManageMock'
import { crmStore } from '../store/crmStore'

// ==================== Props & Emits ====================
interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', selectedItem: SalesUnitItem): void
  (e: 'cancel'): void
}>()

// ==================== 响应式数据 ====================
const tableRef = ref<TableInstance>()
const loading = ref(false)
const salesUnitList = ref<SalesUnitItem[]>([])
const selectedItemId = ref<string>('')

// 查询表单
const queryForm = reactive<SalesUnitQueryParams>({
  keyword: '',
  region: undefined,
  page: 1,
  pageSize: 10
})

// 分页信息
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// ==================== 计算属性 ====================
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 是否有可用的已审核销售单元
const hasSalesUnits = computed(() => {
  return crmStore.state.salesUnitList.some(item => item.auditStatus === AuditStatusEnum.APPROVED)
})

// 当前选中的项
const selectedItem = computed(() => {
  return salesUnitList.value.find(item => item.id === selectedItemId.value)
})

// ==================== 方法 ====================

/**
 * 加载销售单元列表（只显示已审核通过的）
 */
const loadSalesUnitList = () => {
  loading.value = true
  try {
    // 从全局store获取数据，只筛选已审核通过的
    let list = crmStore.state.salesUnitList.filter(
      item => item.auditStatus === AuditStatusEnum.APPROVED
    )

    // 地区筛选
    if (queryForm.region) {
      list = list.filter(item => item.region === queryForm.region)
    }

    // 关键词搜索
    if (queryForm.keyword) {
      const keyword = queryForm.keyword.toLowerCase()
      list = list.filter(item =>
        item.keyword.toLowerCase().includes(keyword) ||
        item.industryName.toLowerCase().includes(keyword)
      )
    }

    // 行业筛选
    if (queryForm.industry) {
      list = list.filter(item => item.industry === queryForm.industry)
    }

    // 分页
    const total = list.length
    const start = (queryForm.page - 1) * queryForm.pageSize
    const end = start + queryForm.pageSize
    const pageList = list.slice(start, end)

    salesUnitList.value = pageList
    pagination.total = total
    pagination.page = queryForm.page
    pagination.pageSize = queryForm.pageSize
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  queryForm.page = 1
  loadSalesUnitList()
}

/**
 * 处理重置
 */
const handleReset = () => {
  queryForm.keyword = ''
  queryForm.region = undefined
  queryForm.industry = undefined
  queryForm.page = 1
  selectedItemId.value = ''
  loadSalesUnitList()
}

/**
 * 处理地区变化
 */
const handleRegionChange = () => {
  queryForm.page = 1
  loadSalesUnitList()
}

/**
 * 处理行点击（选择）
 */
const handleRowClick = (row: SalesUnitItem) => {
  selectedItemId.value = row.id
}

/**
 * 处理页码变化
 */
const handlePageChange = (page: number) => {
  queryForm.page = page
  loadSalesUnitList()
}

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = () => {
  queryForm.pageSize = pagination.pageSize
  queryForm.page = 1
  loadSalesUnitList()
}

/**
 * 处理确认选择
 */
const handleConfirm = () => {
  if (!selectedItem.value) {
    ElMessage.warning('请先选择一个销售单元')
    return
  }
  
  // 同步到全局store
  crmStore.clearCrmQueue()
  crmStore.addToCrmQueue(selectedItem.value)
  
  emit('confirm', selectedItem.value)
  handleClose()
}

/**
 * 处理关闭
 */
const handleClose = () => {
  visible.value = false
  emit('cancel')
}

/**
 * 键盘事件处理
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && visible.value) {
    handleClose()
  }
}

// ==================== 监听 ====================
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadSalesUnitList()
    // 恢复之前的选择
    const storedItem = crmStore.state.selectedSalesUnits[0]
    if (storedItem) {
      selectedItemId.value = storedItem.id
    }
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

// 监听销售单元数据变化，实时更新列表
watch(() => crmStore.state.salesUnitList, () => {
  if (visible.value) {
    loadSalesUnitList()
  }
}, { deep: true })

// ==================== 生命周期 ====================
onMounted(() => {
  if (visible.value) {
    loadSalesUnitList()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// ==================== 暴露方法 ====================
defineExpose({
  refresh: loadSalesUnitList,
  getSelectedItem: () => selectedItem.value
})
</script>

<style scoped lang="scss">
// 变量定义
$primary-green: #67c23a;
$header-green: #2e7d32;
$table-header-bg: #1a5fb4;
$table-header-color: #fff;
$border-color: #dcdfe6;

// 遮罩层
.keyword-select-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

// 弹窗容器
.modal-container {
  position: relative;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 顶部标题栏
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 48px;
  background: #1a5fb4;
  border-bottom: 1px solid $border-color;

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
}

// 无销售单元提示
.empty-sales-unit {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  .empty-description {
    text-align: center;

    p {
      margin: 8px 0;
      color: #606266;
      font-size: 14px;
    }

    .empty-tip {
      color: #909399;
      font-size: 13px;
    }
  }
}

// 查询区域
.query-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f5f7fa;
  border-bottom: 1px solid $border-color;
  flex-wrap: wrap;

  .query-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .query-label {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
    }

    .query-input {
      width: 180px;
    }

    .query-select {
      width: 150px;
    }
  }

  .query-btn {
    background-color: $primary-green;
    border-color: $primary-green;

    &:hover {
      background-color: darken($primary-green, 10%);
      border-color: darken($primary-green, 10%);
    }
  }
}

// 表格区域
.table-section {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: #fff;
  display: flex;
  flex-direction: column;

  .sales-unit-table {
    width: 100%;
    flex: 1;

    :deep(.el-table__header) {
      th {
        background-color: $table-header-bg !important;
        color: $table-header-color;
        font-weight: 600;
        font-size: 13px;
        padding: 10px 0;

        .cell {
          line-height: 1.4;
        }
      }
    }

    :deep(.el-table__row) {
      td {
        font-size: 13px;
        padding: 8px 0;
      }

      &.current-row {
        td {
          background-color: #ecf5ff !important;
        }
      }

      &:hover {
        cursor: pointer;
      }
    }

    // 单选按钮样式
    :deep(.el-radio__label) {
      display: none;
    }
  }

  .empty-state {
    padding: 40px 0;
  }
}

// 分页区域
.pagination-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  background: #fff;
  border-top: 1px solid $border-color;
}

// 底部按钮
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid $border-color;
}

// 过渡动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: translateY(-30px) scale(0.95);
  }
}

// 响应式适配
@media screen and (max-width: 1200px) {
  .modal-container {
    width: 95%;
  }
}

@media screen and (max-width: 768px) {
  .query-section {
    .query-item {
      width: 100%;

      .query-input,
      .query-select {
        flex: 1;
      }
    }
  }
}
</style>
