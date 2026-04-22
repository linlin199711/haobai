<!--
  AI 接话分流管理页面
-->
<template>
  <div class="ai-diversion-page">
    <h2 class="page-title">AI 接话分流管理</h2>

    <!-- 筛选区 -->
    <div class="filter-area">
      <el-select v-model="query.cityCodes" multiple collapse-tags placeholder="接话地市" clearable style="width: 200px">
        <el-option v-for="city in cities" :key="city.code" :label="city.name" :value="city.code" />
      </el-select>
      <el-select v-model="query.diversionType" placeholder="分流类型" clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option label="时段性生效" value="timePeriod" />
        <el-option label="全时段生效" value="allTime" />
      </el-select>
      <el-select v-model="query.useStatus" placeholder="使用状态" clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option label="启用" value="enabled" />
        <el-option label="禁用" value="disabled" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
      <el-button type="primary" @click="openAdd">+ 新增分流规则</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="cityName" label="地市名称" align="center" />
      <el-table-column prop="diversionTypeName" label="分流类型" align="center" />
      <el-table-column label="生效情况" align="center">
        <template #default="{ row }">
          {{ getEffectText(row) }}
        </template>
      </el-table-column>
      <el-table-column label="使用状态" align="center" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.useStatus"
            active-value="enabled"
            inactive-value="disabled"
            @change="(val) => toggleStatus(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="openView(row)">查看</el-button>
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @change="loadData"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 弹窗 -->
    <AiDiversionEditDialog
      :visible="editVisible"
      :type="editType"
      :data="currentRow"
      @update:visible="(v) => editVisible = v"
      @success="loadData"
    />

    <AiDiversionViewDialog
      :visible="viewVisible"
      :data="currentRow"
      @update:visible="(v) => viewVisible = v"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AiDiversionEditDialog from './components/AiDiversionEditDialog.vue'
import AiDiversionViewDialog from './components/AiDiversionViewDialog.vue'
import type { AiDiversionRule } from './types/aiDiversion'
import { FUJIAN_CITIES } from './types/aiDiversion'
import { queryAiDiversionList, deleteAiDiversionRule, updateUseStatus, isCrossDay } from './mock/aiDiversionMock'

const cities = FUJIAN_CITIES

const query = reactive({
  cityCodes: [] as string[],
  diversionType: '',
  useStatus: '',
  page: 1,
  pageSize: 10
})

const list = ref<AiDiversionRule[]>([])
const total = ref(0)
const loading = ref(false)

const editVisible = ref(false)
const viewVisible = ref(false)
const editType = ref<'add' | 'edit'>('add')
const currentRow = ref<AiDiversionRule | null>(null)

const getEffectText = (row: AiDiversionRule) => {
  if (row.diversionType === 'allTime') return '全时段生效'
  if (!row.startTime || !row.endTime) return '-'
  const cross = isCrossDay(row.startTime, row.endTime)
  return `${row.startTime}-${row.endTime}${cross ? '（跨天）' : ''}`
}

const loadData = async () => {
  loading.value = true
  const res = await queryAiDiversionList({
    cityCodes: query.cityCodes as any,
    diversionType: query.diversionType as any,
    useStatus: query.useStatus as any,
    page: query.page,
    pageSize: query.pageSize
  })
  if (res.success) {
    list.value = res.data.list
    total.value = res.data.total
  }
  loading.value = false
}

const resetQuery = () => {
  query.cityCodes = []
  query.diversionType = ''
  query.useStatus = ''
  query.page = 1
  loadData()
}

const toggleStatus = async (row: AiDiversionRule, val: string) => {
  const res = await updateUseStatus(row.id, val as any)
  if (res.success) {
    ElMessage.success(val === 'enabled' ? '已启用' : '已禁用')
  } else {
    ElMessage.error(res.message)
    row.useStatus = val === 'enabled' ? 'disabled' : 'enabled'
  }
}

const openAdd = () => {
  editType.value = 'add'
  currentRow.value = null
  editVisible.value = true
}

const openEdit = (row: AiDiversionRule) => {
  editType.value = 'edit'
  currentRow.value = row
  editVisible.value = true
}

const openView = (row: AiDiversionRule) => {
  currentRow.value = row
  viewVisible.value = true
}

const delRow = async (row: AiDiversionRule) => {
  try {
    await ElMessageBox.confirm(`确定删除【${row.cityName}】的规则吗？`, '提示', { type: 'warning' })
    const res = await deleteAiDiversionRule(row.id)
    if (res.success) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(res.message)
    }
  } catch {}
}

onMounted(loadData)
</script>

<style scoped>
.ai-diversion-page {
  padding: 20px;
}
.page-title {
  margin-bottom: 20px;
  font-size: 20px;
}
.filter-area {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
