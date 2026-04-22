<!--
  系统更新说明页面
  @description 记录和展示系统原型设计更新情况，支持本地持久化存储
  @version 1.0.0
-->
<template>
  <div class="update-notes-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Document /></el-icon>
        系统更新说明
      </h2>
      <p class="page-subtitle">记录系统原型设计更新情况，数据本地持久化保存</p>
    </div>

    <!-- 编辑表单区域 -->
    <div class="form-section">
      <el-card shadow="never" class="form-card">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑更新记录' : '新增更新记录' }}</span>
            <el-button v-if="isEdit" type="info" text @click="handleCancelEdit">
              <el-icon><Close /></el-icon>
              取消编辑
            </el-button>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          class="update-form"
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="更新时间" prop="updateDate">
                <el-date-picker
                  v-model="formData.updateDate"
                  type="date"
                  placeholder="选择更新日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item label="功能模块" prop="moduleName">
                <el-input
                  v-model="formData.moduleName"
                  placeholder="请输入功能模块名称，如：号码本地搜、CRM关键词等"
                  clearable
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="更新内容" prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="4"
              placeholder="请输入详细的更新内容描述..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="saving" @click="handleSave">
              <el-icon><Check /></el-icon>
              {{ isEdit ? '保存修改' : '保存记录' }}
            </el-button>
            <el-button @click="handleReset">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 历史记录列表 -->
    <div class="history-section">
      <el-card shadow="never" class="history-card">
        <template #header>
          <div class="card-header">
            <span>更新历史记录</span>
            <div class="header-actions">
              <el-tag type="info">共 {{ historyList.length }} 条记录</el-tag>
              <el-button type="danger" link @click="handleClearAll" v-if="historyList.length > 0">
                <el-icon><Delete /></el-icon>
                清空全部
              </el-button>
            </div>
          </div>
        </template>

        <div v-if="historyList.length === 0" class="empty-state">
          <el-empty description="暂无更新记录">
            <template #image>
              <el-icon :size="60" color="#c0c4cc"><Document /></el-icon>
            </template>
          </el-empty>
        </div>

        <div v-else class="history-list">
          <div
            v-for="item in sortedHistoryList"
            :key="item.id"
            class="history-item"
            :class="{ 'is-editing': isEdit && currentEditId === item.id }"
          >
            <div class="item-header">
              <div class="item-meta">
                <el-tag type="primary" effect="light" class="date-tag">
                  <el-icon><Calendar /></el-icon>
                  {{ item.updateDate }}
                </el-tag>
                <span class="module-name">{{ item.moduleName }}</span>
              </div>
              <div class="item-actions">
                <el-button type="primary" link size="small" @click="handleEdit(item)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button type="danger" link size="small" @click="handleDelete(item.id)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
            <div class="item-content">
              <p>{{ item.content }}</p>
            </div>
            <div class="item-footer">
              <span class="update-time">
                <el-icon><Timer /></el-icon>
                记录时间：{{ item.createTime }}
              </span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Document,
  Check,
  RefreshRight,
  Edit,
  Delete,
  Calendar,
  Timer,
  Close
} from '@element-plus/icons-vue'

// ==================== 类型定义 ====================
interface UpdateNoteItem {
  /** 唯一标识 */
  id: string
  /** 更新日期 */
  updateDate: string
  /** 功能模块名称 */
  moduleName: string
  /** 更新内容 */
  content: string
  /** 记录创建时间 */
  createTime: string
  /** 最后更新时间 */
  updateTime: string
}

interface FormData {
  updateDate: string
  moduleName: string
  content: string
}

// ==================== LocalStorage Key ====================
const STORAGE_KEY = 'callcenter_update_notes'

// ==================== 响应式数据 ====================
const formRef = ref<FormInstance>()
const saving = ref(false)
const isEdit = ref(false)
const currentEditId = ref<string>('')
const historyList = ref<UpdateNoteItem[]>([])

// 表单数据
const formData = reactive<FormData>({
  updateDate: '',
  moduleName: '',
  content: ''
})

// 表单验证规则
const formRules: FormRules = {
  updateDate: [
    { required: true, message: '请选择更新时间', trigger: 'change' }
  ],
  moduleName: [
    { required: true, message: '请输入功能模块', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入更新内容', trigger: 'blur' },
    { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 按日期降序排列的历史记录
const sortedHistoryList = computed(() => {
  return [...historyList.value].sort((a, b) => {
    return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
  })
})

// ==================== 本地存储操作 ====================

/**
 * 从 LocalStorage 加载数据
 */
const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      historyList.value = JSON.parse(data)
      console.log('[UpdateNotes] 从本地存储加载数据:', historyList.value.length, '条')
    }
  } catch (error) {
    console.error('[UpdateNotes] 加载本地数据失败:', error)
    ElMessage.error('加载历史记录失败')
  }
}

/**
 * 保存到 LocalStorage
 */
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyList.value))
    console.log('[UpdateNotes] 已保存到本地存储:', historyList.value.length, '条')
  } catch (error) {
    console.error('[UpdateNotes] 保存到本地失败:', error)
    throw error
  }
}

/**
 * 生成唯一ID
 */
const generateId = () => {
  return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 获取当前格式化时间
 */
const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// ==================== 表单操作 ====================

/**
 * 保存记录
 */
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      saving.value = true

      try {
        if (isEdit.value && currentEditId.value) {
          // 编辑模式：更新已有记录
          const index = historyList.value.findIndex(item => item.id === currentEditId.value)
          if (index !== -1) {
            historyList.value[index] = {
              ...historyList.value[index],
              updateDate: formData.updateDate,
              moduleName: formData.moduleName,
              content: formData.content,
              updateTime: getCurrentTime()
            }
            ElMessage.success('记录修改成功')
          }
        } else {
          // 新增模式：添加新记录
          const newItem: UpdateNoteItem = {
            id: generateId(),
            updateDate: formData.updateDate,
            moduleName: formData.moduleName,
            content: formData.content,
            createTime: getCurrentTime(),
            updateTime: getCurrentTime()
          }
          historyList.value.unshift(newItem)
          ElMessage.success('记录保存成功')
        }

        // 保存到本地存储
        saveToStorage()

        // 重置表单
        handleReset()
      } catch (error) {
        ElMessage.error('保存失败，请重试')
      } finally {
        saving.value = false
      }
    }
  })
}

/**
 * 重置表单
 */
const handleReset = () => {
  formData.updateDate = ''
  formData.moduleName = ''
  formData.content = ''
  isEdit.value = false
  currentEditId.value = ''
  formRef.value?.resetFields()
}

/**
 * 取消编辑
 */
const handleCancelEdit = () => {
  handleReset()
  ElMessage.info('已取消编辑')
}

// ==================== 历史记录操作 ====================

/**
 * 编辑记录
 */
const handleEdit = (item: UpdateNoteItem) => {
  formData.updateDate = item.updateDate
  formData.moduleName = item.moduleName
  formData.content = item.content
  isEdit.value = true
  currentEditId.value = item.id

  // 滚动到表单区域
  document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })
}

/**
 * 删除记录
 */
const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条更新记录吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = historyList.value.findIndex(item => item.id === id)
    if (index !== -1) {
      historyList.value.splice(index, 1)
      saveToStorage()

      // 如果正在编辑这条记录，重置表单
      if (currentEditId.value === id) {
        handleReset()
      }

      ElMessage.success('删除成功')
    }
  } catch {
    // 取消删除
  }
}

/**
 * 清空全部记录
 */
const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要清空全部 ${historyList.value.length} 条更新记录吗？此操作不可恢复！`,
      '确认清空',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'danger'
      }
    )

    historyList.value = []
    saveToStorage()
    handleReset()
    ElMessage.success('已清空全部记录')
  } catch {
    // 取消操作
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped lang="scss">
.update-notes-page {
  padding: 20px;
  min-height: 100%;
  background-color: #f5f7fa;
}

// 页面头部
.page-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;

  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #303133;

    .el-icon {
      font-size: 24px;
      color: #409eff;
    }
  }

  .page-subtitle {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

// 表单区域
.form-section {
  margin-bottom: 20px;

  .form-card {
    border-radius: 8px;

    :deep(.el-card__header) {
      padding: 15px 20px;
      background-color: #fafafa;
      border-bottom: 1px solid #ebeef5;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      color: #303133;
    }
  }

  .update-form {
    padding: 10px 0;

    :deep(.el-date-editor) {
      width: 100%;
    }

    :deep(.el-textarea__inner) {
      resize: vertical;
      min-height: 100px;
    }
  }
}

// 历史记录区域
.history-section {
  .history-card {
    border-radius: 8px;

    :deep(.el-card__header) {
      padding: 15px 20px;
      background-color: #fafafa;
      border-bottom: 1px solid #ebeef5;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      color: #303133;

      .header-actions {
        display: flex;
        align-items: center;
        gap: 15px;
      }
    }
  }

  .empty-state {
    padding: 60px 0;
  }
}

// 历史记录列表
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-color: #d9ecff;
  }

  &.is-editing {
    border-color: #409eff;
    background-color: #f0f9ff;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .item-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .date-tag {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        padding: 4px 10px;
      }

      .module-name {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }
    }

    .item-actions {
      display: flex;
      gap: 8px;
    }
  }

  .item-content {
    margin-bottom: 12px;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;

    p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #606266;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  .item-footer {
    display: flex;
    justify-content: flex-end;

    .update-time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;

      .el-icon {
        font-size: 12px;
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .update-notes-page {
    padding: 12px;
  }

  .form-section {
    :deep(.el-col) {
      width: 100%;
      margin-bottom: 16px;
    }
  }

  .history-item {
    .item-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .item-meta {
        flex-wrap: wrap;
      }

      .item-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}
</style>
