<!--
  销售品关键字审核页面
  @description 管理员审核销售品关键字，支持通过/驳回操作
  @version 1.0.0
-->
<template>
  <div class="keyword-audit-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-title">
        <el-icon size="24" color="#1a5fb4"><DocumentChecked /></el-icon>
        <span>销售品关键字审核</span>
      </div>
      <div class="header-tip">
        <el-icon size="14" color="#e6a23c"><Warning /></el-icon>
        <span>仅管理员可操作，审核通过后关键字方可使用</span>
      </div>
    </div>

    <!-- 查询筛选区 -->
    <div class="query-section">
      <div class="query-item">
        <span class="query-label">关键词：</span>
        <el-input
          v-model="queryForm.keyword"
          placeholder="请输入关键字名称/编码"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="query-item">
        <span class="query-label">审核状态：</span>
        <el-select
          v-model="queryForm.auditStatus"
          placeholder="请选择审核状态"
          clearable
          class="status-select"
        >
          <el-option
            v-for="item in auditStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary" :loading="loading" @click="handleSearch">
        查询
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 表格展示区 -->
    <div class="table-section">
      <el-table
        :data="keywordList"
        stripe
        border
        v-loading="loading"
        class="keyword-audit-table"
      >
        <!-- 关键字名称 -->
        <el-table-column
          prop="name"
          label="关键字名称"
          min-width="120"
          show-overflow-tooltip
        />

        <!-- 编码 -->
        <el-table-column
          prop="code"
          label="编码"
          min-width="100"
        />

        <!-- 说明 -->
        <el-table-column
          prop="description"
          label="说明"
          min-width="150"
          show-overflow-tooltip
        />

        <!-- 创建人 -->
        <el-table-column
          prop="creatorName"
          label="创建人"
          width="100"
          align="center"
        />

        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
        />

        <!-- 审核状态 -->
        <el-table-column
          prop="auditStatus"
          label="审核状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="getAuditStatusType(row.auditStatus)"
              size="small"
            >
              {{ getAuditStatusLabel(row.auditStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 审核人 -->
        <el-table-column
          prop="auditorName"
          label="审核人"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ row.auditorName || '-' }}</span>
          </template>
        </el-table-column>

        <!-- 审核时间 -->
        <el-table-column
          prop="auditTime"
          label="审核时间"
          width="160"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ row.auditTime || '-' }}</span>
          </template>
        </el-table-column>

        <!-- 审核备注 -->
        <el-table-column
          prop="auditRemark"
          label="审核备注"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.auditRemark || '-' }}</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <template v-if="row.auditStatus === 'pending'">
              <el-button
                type="success"
                link
                size="small"
                @click="handleApprove(row)"
              >
                通过
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click="handleReject(row)"
              >
                驳回
              </el-button>
            </template>
            <template v-else>
              <el-button
                type="primary"
                link
                size="small"
                @click="handleView(row)"
              >
                查看
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && keywordList.length === 0"
        description="暂无数据"
        class="empty-state"
      />
    </div>

    <!-- 分页控制区 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        background
      />
    </div>

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="auditDialogVisible"
      :title="auditDialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="audit-info">
        <p><strong>关键字名称：</strong>{{ currentRow?.name }}</p>
        <p><strong>编码：</strong>{{ currentRow?.code || '-' }}</p>
        <p><strong>说明：</strong>{{ currentRow?.description || '-' }}</p>
        <p><strong>创建人：</strong>{{ currentRow?.creatorName }}</p>
        <p><strong>创建时间：</strong>{{ currentRow?.createTime }}</p>
      </div>
      <el-form
        v-if="auditType !== 'view'"
        :model="auditForm"
        label-width="80px"
        class="audit-form"
      >
        <el-form-item label="审核备注">
          <el-input
            v-model="auditForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注（驳回时必填）"
          />
        </el-form-item>
      </el-form>
      <div v-else class="audit-result">
        <p>
          <strong>审核状态：</strong>
          <el-tag :type="getAuditStatusType(currentRow?.auditStatus)">
            {{ getAuditStatusLabel(currentRow?.auditStatus) }}
          </el-tag>
        </p>
        <p><strong>审核人：</strong>{{ currentRow?.auditorName || '-' }}</p>
        <p><strong>审核时间：</strong>{{ currentRow?.auditTime || '-' }}</p>
        <p><strong>审核备注：</strong>{{ currentRow?.auditRemark || '-' }}</p>
      </div>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <template v-if="auditType === 'approve'">
          <el-button type="success" :loading="auditing" @click="submitAudit">
            确认通过
          </el-button>
        </template>
        <template v-else-if="auditType === 'reject'">
          <el-button type="danger" :loading="auditing" @click="submitAudit">
            确认驳回
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="auditDialogVisible = false">
            确定
          </el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentChecked, Warning } from '@element-plus/icons-vue'
import type { KeywordItem, KeywordQueryParams, AuditFormData } from './types/keywordManage'
import { AuditStatusEnum, AuditStatusLabels, AuditStatusColors } from './types/keywordManage'
import {
  getKeywordList,
  auditKeyword,
  adminPermission,
  logOperation
} from './mock/keywordManageMock'

// ==================== 响应式数据 ====================
const loading = ref(false)
const auditing = ref(false)
const keywordList = ref<KeywordItem[]>([])

// 查询表单
const queryForm = reactive<KeywordQueryParams>({
  keyword: '',
  auditStatus: undefined,
  page: 1,
  pageSize: 10
})

// 分页信息
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 审核弹窗
const auditDialogVisible = ref(false)
const auditDialogTitle = ref('')
const auditType = ref<'approve' | 'reject' | 'view'>('approve')
const currentRow = ref<KeywordItem | null>(null)
const auditForm = reactive({
  remark: ''
})

// 审核状态下拉选项
const auditStatusOptions = [
  { value: AuditStatusEnum.PENDING, label: '待审核' },
  { value: AuditStatusEnum.APPROVED, label: '已通过' },
  { value: AuditStatusEnum.REJECTED, label: '已驳回' }
]

// ==================== 方法 ====================

/**
 * 获取审核状态标签
 */
const getAuditStatusLabel = (status?: AuditStatusEnum) => {
  if (!status) return '-'
  return AuditStatusLabels[status] || status
}

/**
 * 获取审核状态颜色
 */
const getAuditStatusType = (status?: AuditStatusEnum): any => {
  if (!status) return 'info'
  return AuditStatusColors[status] || 'info'
}

/**
 * 加载关键字列表
 */
const loadKeywordList = async () => {
  loading.value = true
  try {
    const res = await getKeywordList(queryForm, adminPermission)
    if (res.success) {
      keywordList.value = res.data.list
      pagination.total = res.data.total
      pagination.page = res.data.page
      pagination.pageSize = res.data.pageSize
    } else {
      ElMessage.error(res.message)
    }
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
  loadKeywordList()
}

/**
 * 处理重置
 */
const handleReset = () => {
  queryForm.keyword = ''
  queryForm.auditStatus = undefined
  queryForm.page = 1
  loadKeywordList()
}

/**
 * 处理通过
 */
const handleApprove = (row: KeywordItem) => {
  currentRow.value = row
  auditType.value = 'approve'
  auditDialogTitle.value = '审核通过'
  auditForm.remark = ''
  auditDialogVisible.value = true
}

/**
 * 处理驳回
 */
const handleReject = (row: KeywordItem) => {
  currentRow.value = row
  auditType.value = 'reject'
  auditDialogTitle.value = '审核驳回'
  auditForm.remark = ''
  auditDialogVisible.value = true
}

/**
 * 处理查看
 */
const handleView = (row: KeywordItem) => {
  currentRow.value = row
  auditType.value = 'view'
  auditDialogTitle.value = '审核详情'
  auditDialogVisible.value = true
}

/**
 * 提交审核
 */
const submitAudit = async () => {
  if (!currentRow.value) return

  // 驳回时校验备注
  if (auditType.value === 'reject' && !auditForm.remark.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }

  auditing.value = true
  try {
    const auditData: AuditFormData = {
      id: currentRow.value.id,
      result: auditType.value === 'approve' ? 'approve' : 'reject',
      remark: auditForm.remark
    }

    const res = await auditKeyword(auditData, adminPermission)
    if (res.success) {
      ElMessage.success(auditType.value === 'approve' ? '审核通过成功' : '审核驳回成功')
      auditDialogVisible.value = false
      loadKeywordList()
      logOperation('audit', `${auditType.value === 'approve' ? '通过' : '驳回'}关键字: ${currentRow.value.name}`)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('审核操作失败')
  } finally {
    auditing.value = false
  }
}

/**
 * 处理页码变化
 */
const handlePageChange = (page: number) => {
  queryForm.page = page
  loadKeywordList()
}

/**
 * 处理每页条数变化
 */
const handleSizeChange = () => {
  queryForm.pageSize = pagination.pageSize
  queryForm.page = 1
  loadKeywordList()
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadKeywordList()
})
</script>

<style scoped lang="scss">
.keyword-audit-page {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

// 页面标题
.page-header {
  margin-bottom: 20px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .header-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #e6a23c;
    padding: 8px 12px;
    background: #fdf6ec;
    border-radius: 4px;
    border-left: 3px solid #e6a23c;
  }
}

// 查询筛选区
.query-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  .query-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .query-label {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
    }
  }

  .search-input {
    width: 220px;
  }

  .status-select {
    width: 150px;
  }
}

// 表格展示区
.table-section {
  margin-bottom: 16px;

  .keyword-audit-table {
    width: 100%;

    :deep(.el-table__header) {
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
        font-size: 13px;
      }
    }

    :deep(.el-table__row) {
      td {
        font-size: 13px;
      }
    }
  }

  .empty-state {
    padding: 40px 0;
  }
}

// 分页控制区
.pagination-section {
  display: flex;
  justify-content: flex-end;
}

// 审核弹窗
.audit-info {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  p {
    margin: 8px 0;
    font-size: 14px;
    color: #606266;

    strong {
      color: #303133;
    }
  }
}

.audit-form {
  margin-top: 16px;
}

.audit-result {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  p {
    margin: 8px 0;
    font-size: 14px;
    color: #606266;

    strong {
      color: #303133;
    }
  }
}
</style>
