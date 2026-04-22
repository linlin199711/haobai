/**
 * 同义关键字管理页面
 * @description 同义关键字CRUD管理，支撑号码本地搜搜索联动
 * @version 1.0.0
 */

<template>
  <div class="synonym-keyword-manager">
    <!-- 顶部搜索区 -->
    <div class="search-area">
      <el-form :model="queryForm" inline class="search-form">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="销售品关键字">
              <el-input
                v-model="queryForm.mainKeyword"
                placeholder="请输入销售品关键字查询"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select
                v-model="queryForm.status"
                placeholder="全部状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="modeText + '关键字'">
              <el-input
                v-model="queryForm.synonymName"
                :placeholder="`请输入${modeText}关键字查询`"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" class="btn-col">
            <el-button type="primary" :loading="loading" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="handleReset">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 批量操作区 -->
    <div class="batch-operation">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增关联
      </el-button>
      <el-button type="primary" @click="handleBatchAdd">
        <el-icon><DocumentAdd /></el-icon>
        批量添加
      </el-button>
      <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <el-upload
        class="upload-inline"
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".xlsx,.xls,.csv"
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          导入数据
        </el-button>
      </el-upload>
      <el-button type="primary" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出数据
      </el-button>
    </div>

    <!-- 列表展示区 -->
    <div class="table-area">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column
          prop="mainKeyword"
          label="销售品关键字"
          min-width="150"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag size="large" effect="dark" type="primary">
              {{ row.mainKeyword }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="modeText + '关键字'" min-width="300">
          <template #default="{ row }">
            <div class="synonym-tags">
              <el-tag
                v-for="synonym in row.synonyms"
                :key="synonym.id"
                :type="synonym.status === 'enabled' ? 'success' : 'info'"
                closable
                class="synonym-tag"
                @close="handleRemoveSynonym(row, synonym)"
              >
                {{ synonym.name }}
              </el-tag>
              <el-button
                v-if="row.synonyms.length < 10"
                link
                type="primary"
                size="small"
                @click="handleAddSynonym(row)"
              >
                <el-icon><Plus /></el-icon>
                添加
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="enabled"
              inactive-value="disabled"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="160" align="center">
          <template #default="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="tableData.length === 0 && !loading"
        :description="`暂无${modeText}关键字数据`"
        class="empty-state"
      >
        <template #image>
          <el-icon :size="60" color="#c0c4cc"><Collection /></el-icon>
        </template>
      </el-empty>
    </div>

    <!-- 分页控制 -->
    <div class="pagination-area">
      <el-pagination
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <SynonymKeywordEditDialog
      v-model="editDialogVisible"
      :data="currentRow"
      @save="handleSaveSuccess"
    />

    <!-- 批量添加弹窗 -->
    <SynonymKeywordBatchDialog
      v-model="batchDialogVisible"
      @save="handleBatchSaveSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ==================== Props ====================
interface Props {
  /** 模式：synonym-同义关键字, associate-联想关键字 */
  mode?: 'synonym' | 'associate'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'synonym'
})

// 根据模式计算显示文本
const modeText = computed(() => {
  return props.mode === 'associate' ? '联想' : '同义'
})
import {
  Search,
  RefreshRight,
  Plus,
  Delete,
  Edit,
  Download,
  Upload,
  DocumentAdd,
  Collection
} from '@element-plus/icons-vue'
import SynonymKeywordEditDialog from './components/SynonymKeywordEditDialog.vue'
import SynonymKeywordBatchDialog from './components/SynonymKeywordBatchDialog.vue'
import type {
  SynonymKeyword,
  SynonymKeywordQueryParams,
  SynonymItem
} from './types/synonymKeyword'
import {
  querySynonymKeywordList,
  deleteSynonymKeyword,
  batchDeleteSynonymKeyword,
  updateSynonymKeywordStatus,
  batchUpdateStatus,
  importSynonymKeywords,
  exportSynonymKeywords,
  deleteSingleSynonym,
  statusOptions
} from './mock/synonymKeywordMock'

// ==================== 查询表单 ====================
const queryForm = reactive<SynonymKeywordQueryParams>({
  mainKeyword: '',
  status: '',
  synonymName: '',
  page: 1,
  pageSize: 10
})

// ==================== 列表数据 ====================
const tableData = ref<SynonymKeyword[]>([])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<string[]>([])

// ==================== 弹窗控制 ====================
const editDialogVisible = ref(false)
const batchDialogVisible = ref(false)
const currentRow = ref<SynonymKeyword | null>(null)

// ==================== 初始化 ====================
onMounted(() => {
  fetchData()
})

// ==================== 数据获取 ====================
const fetchData = async () => {
  loading.value = true
  try {
    const res = await querySynonymKeywordList({ ...queryForm })
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 查询操作 ====================
const handleSearch = () => {
  queryForm.page = 1
  fetchData()
}

const handleReset = () => {
  queryForm.mainKeyword = ''
  queryForm.status = ''
  queryForm.synonymName = ''
  queryForm.page = 1
  queryForm.pageSize = 10
  fetchData()
  ElMessage.success('已重置搜索条件')
}

// ==================== 表格选择 ====================
const handleSelectionChange = (selection: SynonymKeyword[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// ==================== 分页操作 ====================
const handlePageChange = (page: number) => {
  queryForm.page = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  queryForm.pageSize = size
  queryForm.page = 1
  fetchData()
}

// ==================== 新增/编辑操作 ====================
const handleAdd = () => {
  currentRow.value = null
  editDialogVisible.value = true
}

const handleEdit = (row: SynonymKeyword) => {
  currentRow.value = row
  editDialogVisible.value = true
}

const handleSaveSuccess = () => {
  fetchData()
}

// ==================== 批量添加 ====================
const handleBatchAdd = () => {
  batchDialogVisible.value = true
}

const handleBatchSaveSuccess = () => {
  fetchData()
}

// ==================== 删除操作 ====================
const handleDelete = async (row: SynonymKeyword) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${row.mainKeyword}" 的所有${modeText}关键字配置吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await deleteSynonymKeyword(row.id)
    if (res) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error('删除失败')
    }
  } catch {
    // 取消删除
  }
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await batchDeleteSynonymKeyword(selectedIds.value)
    if (res) {
      ElMessage.success('批量删除成功')
      fetchData()
    } else {
      ElMessage.error('批量删除失败')
    }
  } catch {
    // 取消删除
  }
}

// ==================== 移除单个关键字 ====================
const handleRemoveSynonym = async (row: SynonymKeyword, synonym: SynonymItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除${modeText}关键字 "${synonym.name}" 吗？`,
      '确认移除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await deleteSingleSynonym(row.id, synonym.id)
    if (res) {
      ElMessage.success('移除成功')
      fetchData()
    } else {
      ElMessage.error('移除失败')
    }
  } catch {
    // 取消移除
  }
}

// ==================== 添加关键字（快捷） ====================
const handleAddSynonym = (row: SynonymKeyword) => {
  currentRow.value = row
  editDialogVisible.value = true
}

// ==================== 状态变更 ====================
const handleStatusChange = async (row: SynonymKeyword) => {
  const status = row.status
  const label = status === 'enabled' ? '启用' : '禁用'
  try {
    const res = await updateSynonymKeywordStatus(row.id, status)
    if (res) {
      ElMessage.success(`${label}成功`)
      // 同步更新所有关键字的状态
      row.synonyms.forEach(s => {
        s.status = status as any
      })
    } else {
      ElMessage.error(`${label}失败`)
      row.status = status === 'enabled' ? 'disabled' : 'enabled'
    }
  } catch {
    row.status = status === 'enabled' ? 'disabled' : 'enabled'
  }
}

// ==================== 导入操作 ====================
const handleFileChange = async (file: any) => {
  try {
    loading.value = true
    const res = await importSynonymKeywords(file.raw)
    if (res.success) {
      ElMessage.success(`导入成功！共${res.total}条，成功${res.successCount}条`)
      if (res.failCount > 0 && res.failReasons) {
        ElMessage.warning(`失败${res.failCount}条：${res.failReasons.join('；')}`)
      }
      fetchData()
    } else {
      ElMessage.error('导入失败')
    }
  } catch {
    ElMessage.error('导入失败')
  } finally {
    loading.value = false
  }
}

// ==================== 导出操作 ====================
const handleExport = async () => {
  try {
    loading.value = true
    const blob = await exportSynonymKeywords(selectedIds.value)
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${modeText}关键字配置_${new Date().toLocaleDateString()}.csv`
    link.click()
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.synonym-keyword-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  padding: 16px;
}

// 搜索区
.search-area {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .search-form {
    :deep(.el-form-item) {
      margin-bottom: 0;
      width: 100%;
    }

    :deep(.el-form-item__label) {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }
  }

  .btn-col {
    display: flex;
    justify-content: flex-end;
  }
}

// 批量操作区
.batch-operation {
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;

  .upload-inline {
    display: inline-block;
  }
}

// 列表区
.table-area {
  flex: 1;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .synonym-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    .synonym-tag {
      margin: 0;
    }
  }

  .empty-state {
    padding: 40px 0;
  }
}

// 分页区
.pagination-area {
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  margin-top: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
}
</style>
