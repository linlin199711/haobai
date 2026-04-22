<!--
  销售品关键字管理 - 主页面
  @description 销售品关键字的增删改查管理页面
  @version 1.0.0
-->
<template>
  <div class="keyword-manage-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-title">
        <el-icon size="24" color="#1a5fb4"><Collection /></el-icon>
        <span>销售品关键字管理</span>
      </div>
    </div>

    <!-- 查询筛选区 -->
    <div class="query-section">
      <el-input
        v-model="queryForm.keyword"
        placeholder="请输入关键字名称/编码"
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" :loading="loading" @click="handleSearch">
        查询
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 列表操作区 -->
    <div class="operation-section">
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        新增关键字
      </el-button>
      <el-button
        v-if="permission.isAdmin && selectedIds.length > 0"
        type="danger"
        :icon="Delete"
        @click="handleBatchDelete"
      >
        批量删除({{ selectedIds.length }})
      </el-button>
    </div>

    <!-- 表格展示区 -->
    <div class="table-section">
      <el-table
        ref="tableRef"
        :data="keywordList"
        stripe
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="keyword-table"
      >
        <!-- 选择列（管理员显示） -->
        <el-table-column
          v-if="permission.isAdmin"
          type="selection"
          width="50"
          align="center"
        />

        <!-- 关键字名称 -->
        <el-table-column
          prop="name"
          label="关键字名称"
          min-width="120"
          show-overflow-tooltip
        />

        <!-- 关键字编码 -->
        <el-table-column
          prop="code"
          label="关键字编码"
          width="120"
          show-overflow-tooltip
        />

        <!-- 关键字说明 -->
        <el-table-column
          prop="description"
          label="关键字说明"
          min-width="200"
          show-overflow-tooltip
        />

        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
        />

        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="permission.isAdmin || row.creatorId === permission.userId"
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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

    <!-- 新增/编辑弹窗 -->
    <KeywordFormDialog
      v-model="dialogVisible"
      :type="dialogType"
      :data="currentRow"
      @submit="handleFormSubmit"
      @closed="handleDialogClosed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Collection } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import KeywordFormDialog from './components/KeywordFormDialog.vue'
import type {
  KeywordItem,
  KeywordQueryParams,
  KeywordFormData,
  PermissionConfig,
  ModalType
} from './types/keywordManage'
import {
  getKeywordList,
  addKeyword,
  updateKeyword,
  deleteKeyword,
  batchDeleteKeyword,
  currentUserPermission,
  adminPermission,
  logOperation
} from './mock/keywordManageMock'
import { crmStore } from '../store/crmStore'

// ==================== Props ====================
interface Props {
  permission?: PermissionConfig
}

const props = withDefaults(defineProps<Props>(), {
  permission: () => adminPermission // 默认使用管理员权限
})

// ==================== 响应式数据 ====================
const tableRef = ref<TableInstance>()
const loading = ref(false)
const keywordList = ref<KeywordItem[]>([])
const selectedIds = ref<string[]>([])
const selectedRows = ref<KeywordItem[]>([])

// 查询表单
const queryForm = reactive<KeywordQueryParams>({
  keyword: '',
  page: 1,
  pageSize: 10
})

// 分页信息
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 弹窗状态
const dialogVisible = ref(false)
const dialogType = ref<ModalType>('add')
const currentRow = ref<KeywordFormData>({
  name: '',
  code: '',
  description: ''
})

// ==================== 方法 ====================

/**
 * 加载关键字列表
 */
const loadKeywordList = async () => {
  loading.value = true
  try {
    const res = await getKeywordList(queryForm, props.permission)
    if (res.success) {
      keywordList.value = res.data.list
      pagination.total = res.data.total
      pagination.page = res.data.page
      pagination.pageSize = res.data.pageSize
      // 同步到全局store
      crmStore.setKeywordList(keywordList.value)
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
  queryForm.page = 1
  loadKeywordList()
}

/**
 * 处理新增
 */
const handleAdd = () => {
  dialogType.value = 'add'
  currentRow.value = {
    name: '',
    code: '',
    description: ''
  }
  dialogVisible.value = true
  logOperation('click', '打开新增关键字弹窗')
}

/**
 * 处理编辑
 */
const handleEdit = (row: KeywordItem) => {
  dialogType.value = 'edit'
  currentRow.value = {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description
  }
  dialogVisible.value = true
  logOperation('click', `打开编辑关键字弹窗: ${row.name}`)
}

/**
 * 处理删除
 */
const handleDelete = async (row: KeywordItem) => {
  try {
    await ElMessageBox.confirm(
      '确认删除该关键字？删除后不可恢复',
      '删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteKeyword(row.id, props.permission)
    if (res.success) {
      ElMessage.success('删除成功')
      loadKeywordList()
      logOperation('delete', `删除关键字: ${row.name}`)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    // 用户取消删除
  }
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认删除选中的 ${selectedIds.value.length} 个关键字？删除后不可恢复`,
      '批量删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await batchDeleteKeyword(selectedIds.value, props.permission)
    if (res.success) {
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      selectedRows.value = []
      loadKeywordList()
      logOperation('batch_delete', `批量删除关键字: ${selectedIds.value.length}个`)
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    // 用户取消删除
  }
}

/**
 * 处理表单提交
 */
const handleFormSubmit = async (data: KeywordFormData, continueAdd: boolean) => {
  try {
    let res
    if (dialogType.value === 'add') {
      res = await addKeyword(data, props.permission)
      if (res.success) {
        ElMessage.success('新增成功')
        logOperation('add', `新增关键字: ${data.name}`)
      }
    } else {
      res = await updateKeyword(data, props.permission)
      if (res.success) {
        ElMessage.success('编辑成功')
        logOperation('update', `编辑关键字: ${data.name}`)
      }
    }

    if (res.success) {
      loadKeywordList()
      if (!continueAdd) {
        dialogVisible.value = false
      }
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

/**
 * 处理弹窗关闭
 */
const handleDialogClosed = () => {
  currentRow.value = {
    name: '',
    code: '',
    description: ''
  }
}

/**
 * 处理选择变化
 */
const handleSelectionChange = (selection: KeywordItem[]) => {
  selectedRows.value = selection
  selectedIds.value = selection.map(item => item.id)
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
.keyword-manage-page {
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

  .search-input {
    width: 300px;
  }
}

// 列表操作区
.operation-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

// 表格展示区
.table-section {
  margin-bottom: 16px;

  .keyword-table {
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
</style>
