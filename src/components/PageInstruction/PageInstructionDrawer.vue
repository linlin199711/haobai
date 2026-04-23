<template>
  <div class="page-instruction-wrapper">
    <!-- 页面说明按钮 -->
    <el-button
      class="page-instruction-btn"
      type="primary"
      :icon="QuestionFilled"
      @click="handleOpen"
    >
      页面说明
    </el-button>

    <!-- 页面说明抽屉 -->
    <el-drawer
      v-model="visible"
      title="页面说明"
      direction="rtl"
      size="600px"
      :close-on-click-modal="true"
      :destroy-on-close="false"
      class="page-instruction-drawer page-instruction-drawer-wrapper"
      modal-class="page-instruction-modal"
      :style="{ top: '64px', bottom: '120px', height: 'auto' }"
      @close="handleClose"
    >
      <div class="drawer-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-wrapper">
          <el-skeleton :rows="10" animated />
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-wrapper">
          <el-result
            icon="error"
            title="加载失败"
            :sub-title="error"
          >
            <template #extra>
              <el-button type="primary" @click="loadData">重试</el-button>
            </template>
          </el-result>
        </div>

        <!-- 内容区域 -->
        <div v-else class="content-wrapper">
          <!-- 查看模式 -->
          <div v-if="!isEditing" class="view-mode">
            <div class="page-info">
              <el-tag size="small" type="info">{{ currentData?.pageTitle }}</el-tag>
              <span class="update-time">
                更新时间：{{ formatTime(currentData?.updateTime) }}
              </span>
              <el-tag
                v-if="rateLimit.remaining > 0"
                size="small"
                :type="rateLimit.remaining < 100 ? 'danger' : 'success'"
                class="rate-limit"
                :title="`GitHub API 剩余调用次数：${rateLimit.remaining}/${rateLimit.limit}`"
              >
                API: {{ rateLimit.remaining }}
              </el-tag>
            </div>
            <div class="rich-content" v-html="currentData?.content"></div>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-mode">
            <el-alert
              title="编辑模式"
              description="支持富文本编辑和图片上传"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 16px;"
            />
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :default-config="toolbarConfig"
              :mode="'default'"
            />
            <Editor
              v-model="editContent"
              style="height: calc(100% - 100px); overflow-y: hidden;"
              :default-config="editorConfig"
              :mode="'default'"
              @on-created="handleEditorCreated"
            />
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <template #footer>
        <div class="drawer-footer">
          <div class="footer-left">
            <el-button
              v-if="!isEditing"
              type="primary"
              :icon="Edit"
              @click="handleEdit"
            >
              编辑
            </el-button>
            <el-button
              v-if="!isEditing"
              type="warning"
              :icon="RefreshLeft"
              @click="handleReset"
            >
              恢复默认
            </el-button>
          </div>
          <div class="footer-right">
            <template v-if="isEditing">
              <el-button
                type="success"
                :icon="Check"
                :loading="saving"
                @click="handleSave"
              >
                保存
              </el-button>
              <el-button
                :icon="Close"
                @click="handleCancel"
              >
                取消
              </el-button>
            </template>
            <el-button @click="handleDrawerClose">
              关闭
            </el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
/**
 * 页面说明抽屉组件
 * 完全独立，与业务系统无任何关联
 */
import { ref, shallowRef, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuestionFilled, Edit, Check, Close, RefreshLeft } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

import type {
  PageInstruction,
  PageInstructionDrawerProps,
  PageInstructionDrawerEmits
} from './types/pageInstruction'

import {
  getPageInstruction,
  savePageInstruction,
  uploadImage,
  resetToDefault,
  getGitHubRateLimit
} from './service/pageInstructionService'

// Props & Emits
const props = defineProps<PageInstructionDrawerProps>()
const emit = defineEmits<PageInstructionDrawerEmits>()

// 状态
const visible = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const isEditing = ref(false)
const currentData = ref<PageInstruction | null>(null)
const editContent = ref('')
const originalContent = ref('')
const rateLimit = ref({ remaining: 0, limit: 5000 })

// 编辑器实例
const editorRef = shallowRef<IDomEditor | null>(null)

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'insertVideo',
    'insertTable',
    'codeBlock',
    'divider',
    'fullScreen'
  ]
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入页面说明内容...',
  autoFocus: false,
  scroll: true,
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
        try {
          const result = await uploadImage(file)
          if (result.success && result.data) {
            insertFn(result.data.url, result.data.name, result.data.url)
            ElMessage.success('图片上传成功')
          } else {
            ElMessage.error(result.message || '图片上传失败')
          }
        } catch (err) {
          ElMessage.error('图片上传失败')
        }
      }
    },
    fontSize: {
      fontSizeList: [
        '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'
      ]
    }
  }
}

// 格式化时间
const formatTime = (time?: string): string => {
  if (!time) return '-'
  try {
    const date = new Date(time)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return time
  }
}

// 处理编辑器创建
const handleEditorCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [result, rateResult] = await Promise.all([
      getPageInstruction(props.pageId, props.pageTitle),
      getGitHubRateLimit()
    ])

    if (result.success && result.data) {
      currentData.value = result.data
    } else {
      error.value = result.message || '加载失败'
    }

    if (rateResult.success && rateResult.data) {
      rateLimit.value = rateResult.data
    }
  } catch (err) {
    error.value = '加载页面说明失败'
  } finally {
    loading.value = false
  }
}

// 打开抽屉
const handleOpen = async () => {
  visible.value = true
  isEditing.value = false
  await loadData()
}

// 关闭抽屉
const handleClose = () => {
  if (isEditing.value && editContent.value !== originalContent.value) {
    ElMessageBox.confirm(
      '当前有未保存的修改，是否确认关闭？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        handleCancel()
        visible.value = false
        emit('close')
      })
      .catch(() => {})
  } else {
    visible.value = false
    emit('close')
  }
}

// 点击关闭按钮
const handleDrawerClose = () => {
  handleClose()
}

// 进入编辑模式
const handleEdit = () => {
  editContent.value = currentData.value?.content || ''
  originalContent.value = editContent.value
  isEditing.value = true
}

// 保存
const handleSave = async () => {
  if (!editContent.value.trim()) {
    ElMessage.warning('内容不能为空')
    return
  }

  saving.value = true

  try {
    const currentSha = currentData.value?.sha

    const result = await savePageInstruction(
      props.pageId,
      props.pageTitle,
      editContent.value,
      currentSha
    )

    if (result.success && result.data) {
      currentData.value = result.data
      isEditing.value = false
      ElMessage.success('保存成功到 GitHub')
      emit('saved', result.data)
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (err) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 取消编辑
const handleCancel = () => {
  if (editContent.value !== originalContent.value) {
    ElMessageBox.confirm(
      '确定取消编辑？未保存的修改将丢失。',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '继续编辑',
        type: 'warning'
      }
    )
      .then(() => {
        editContent.value = originalContent.value
        isEditing.value = false
        if (editorRef.value) {
          editorRef.value.destroy()
          editorRef.value = null
        }
      })
      .catch(() => {})
  } else {
    isEditing.value = false
    if (editorRef.value) {
      editorRef.value.destroy()
      editorRef.value = null
    }
  }
}

// 恢复默认内容
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      '确定恢复为默认内容？当前内容将被覆盖。',
      '警告',
      {
        confirmButtonText: '确定恢复',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await resetToDefault(props.pageId, props.pageTitle)
    if (result.success && result.data) {
      currentData.value = result.data
      ElMessage.success('已恢复为默认内容')
    } else {
      ElMessage.error(result.message || '恢复失败')
    }
  } catch {}
}

// 监听抽屉关闭
watch(visible, (val) => {
  if (!val && editorRef.value) {
    editorRef.value.destroy()
    editorRef.value = null
  }
})
</script>

<style scoped>
.page-instruction-wrapper {
  display: inline-block;
}

.page-instruction-btn {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  border-radius: 4px 0 0 4px;
  padding: 12px 8px;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  font-size: 14px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}

.page-instruction-btn :deep(.el-icon) {
  margin-bottom: 4px;
  margin-right: 0;
}

:deep(.page-instruction-drawer) .el-overlay {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

:deep(.page-instruction-drawer) .el-drawer__header {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.page-instruction-drawer) .el-drawer__header .el-drawer__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.page-instruction-drawer) .el-drawer__body {
  padding: 0;
  overflow: hidden;
}

:deep(.page-instruction-drawer) .el-drawer__footer {
  padding: 16px 20px;
  border-top: 1px solid #e4e7ed;
}

.drawer-content {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loading-wrapper,
.error-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.view-mode {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.view-mode .page-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.view-mode .page-info .update-time {
  font-size: 12px;
  color: #909399;
}

.view-mode .page-info .rate-limit {
  margin-left: auto;
  font-size: 11px;
}

.view-mode .rich-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
}

.view-mode .rich-content :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 20px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.view-mode .rich-content :deep(p) {
  margin: 12px 0;
}

.view-mode .rich-content :deep(ul),
.view-mode .rich-content :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.view-mode .rich-content :deep(ul) li,
.view-mode .rich-content :deep(ol) li {
  margin: 8px 0;
}

.view-mode .rich-content :deep(strong) {
  font-weight: 600;
  color: #409eff;
}

.view-mode .rich-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 12px 0;
}

.view-mode .rich-content :deep(blockquote) {
  border-left: 4px solid #409eff;
  padding: 8px 16px;
  margin: 12px 0;
  background: #f5f7fa;
  color: #606266;
}

.edit-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.edit-mode :deep(.w-e-text-container) {
  background: #fff;
}

.drawer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-footer .footer-left,
.drawer-footer .footer-right {
  display: flex;
  gap: 12px;
}
</style>

<style>
/* 页面说明抽屉样式 - 抽屉本身定位 */
.page-instruction-modal .el-drawer.rtl {
  top: 64px !important;
  bottom: 120px !important;
  height: auto !important;
  max-height: calc(100vh - 184px) !important;
  border-radius: 8px 0 0 8px;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.3);
  z-index: 9999 !important;
}

/* 遮罩层调整 */
.page-instruction-modal {
  top: 64px !important;
  bottom: 120px !important;
  height: auto !important;
  z-index: 9998 !important;
}

/* 备选选择器 - 最高优先级 */
body .el-overlay.page-instruction-modal + .el-overlay-dialog .el-drawer.rtl,
body .el-drawer__wrapper .page-instruction-drawer-wrapper,
.el-overlay.page-instruction-modal .el-drawer {
  top: 64px !important;
  bottom: 120px !important;
  height: auto !important;
  z-index: 9999 !important;
}

/* 确保话务条和呼入信息栏在遮罩下 */
.page-instruction-modal ~ * {
  z-index: 1 !important;
}
</style>
