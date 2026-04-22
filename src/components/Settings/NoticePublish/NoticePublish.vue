<!--
  通知管理发布页
  @description 呼叫中心话务台系统通知发布功能，支持富文本编辑、多范围发送
  @version 1.1.0
-->
<template>
  <div class="notice-publish-container">
    <!-- 通知内容编辑区 -->
    <div class="notice-edit-section">
      <!-- 通知基础配置 -->
      <div class="notice-config">
        <el-form :model="noticeForm" :rules="formRules" ref="formRef" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="通知标题：" prop="title">
                <el-input
                  v-model="noticeForm.title"
                  placeholder="请输入通知标题"
                  maxlength="50"
                  show-word-limit
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="有效日期：" prop="validDays">
                <el-input-number
                  v-model="noticeForm.validDays"
                  :min="1"
                  :max="30"
                  :step="1"
                  style="width: 100px"
                />
                <span class="unit-text">天</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="通知类型：" prop="noticeType">
                <el-select v-model="noticeForm.noticeType" style="width: 140px">
                  <el-option
                    v-for="item in noticeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 富文本编辑区 -->
      <div class="editor-section">
        <div class="editor-toolbar">
          <el-button-group>
            <el-button
              size="small"
              :class="{ 'is-active': isBold }"
              @click="execCommand('bold')"
              title="加粗"
            >
              <strong>B</strong>
            </el-button>
            <el-button
              size="small"
              :class="{ 'is-active': isItalic }"
              @click="execCommand('italic')"
              title="斜体"
            >
              <em>I</em>
            </el-button>
            <el-button
              size="small"
              :class="{ 'is-active': isUnderline }"
              @click="execCommand('underline')"
              title="下划线"
            >
              <u>U</u>
            </el-button>
          </el-button-group>
          <el-divider direction="vertical" />
          <el-button-group>
            <el-button
              size="small"
              :class="{ 'is-active': align === 'left' }"
              @click="execCommand('justifyLeft')"
              title="左对齐"
            >
              <el-icon><Back /></el-icon>
            </el-button>
            <el-button
              size="small"
              :class="{ 'is-active': align === 'center' }"
              @click="execCommand('justifyCenter')"
              title="居中对齐"
            >
              <el-icon><Sort /></el-icon>
            </el-button>
            <el-button
              size="small"
              :class="{ 'is-active': align === 'right' }"
              @click="execCommand('justifyRight')"
              title="右对齐"
            >
              <el-icon><Right /></el-icon>
            </el-button>
          </el-button-group>
          <el-divider direction="vertical" />
          <el-color-picker
            v-model="foreColor"
            size="small"
            show-alpha
            @change="execCommand('foreColor', foreColor)"
            title="字体颜色"
          />
          <el-color-picker
            v-model="backColor"
            size="small"
            show-alpha
            @change="execCommand('hiliteColor', backColor)"
            title="背景颜色"
          />
          <el-divider direction="vertical" />
          <el-button-group>
            <el-button size="small" @click="execCommand('undo')" title="撤销">
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <el-button size="small" @click="execCommand('redo')" title="重做">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-button-group>
        </div>
        <div
          ref="editorRef"
          class="editor-content"
          contenteditable="true"
          placeholder="请输入通知内容..."
          @input="handleEditorInput"
          @keydown="handleEditorKeydown"
        ></div>
        <div class="editor-footer">
          <span class="char-count">{{ contentLength }}/2000 字符</span>
        </div>
      </div>
    </div>

    <!-- 发送选项区 -->
    <div class="send-options-section">
      <el-checkbox v-model="noticeForm.sendToSelf" class="send-to-self">
        同时发给自己
      </el-checkbox>
      <el-divider direction="vertical" />
      <span class="range-label">发送范围：</span>
      <el-checkbox-group v-model="noticeForm.sendRanges">
        <el-checkbox
          v-for="option in sendRangeOptions"
          :key="option.key"
          :label="option.key"
        >
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 底部操作区 -->
    <div class="action-section">
      <div class="action-left">
        <el-tag v-if="noticeForm.sendRanges.length > 0" type="success">
          已选择 {{ noticeForm.sendRanges.length }} 个发送范围
        </el-tag>
      </div>
      <div class="action-right">
        <el-button type="primary" :loading="publishing" @click="handlePublish">
          确定(Y)
        </el-button>
        <el-button @click="handleClear">清空(C)</el-button>
        <el-button @click="handleClose">关闭(N)</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Back,
  Right,
  Sort
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { NoticeFormData } from './types/noticePublish'
import {
  NoticeTypeEnum,
  NoticeTypeNames,
  sendRangeOptions as defaultSendRangeOptions
} from './types/noticePublish'
import { useNotificationStore } from '@/stores/notificationStore'

// ==================== Props & Emits ====================
interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'publish', data: any): void
}>()

// 使用通知Store
const notificationStore = useNotificationStore()

// ==================== 响应式数据 ====================
const publishing = ref(false)
const formRef = ref<FormInstance>()
const editorRef = ref<HTMLDivElement>()

// 编辑器状态
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const align = ref<'left' | 'center' | 'right'>('left')
const foreColor = ref('#000000')
const backColor = ref('#ffffff')
const contentLength = ref(0)

// 通知表单
const noticeForm = reactive<NoticeFormData>({
  title: '',
  validDays: 1,
  noticeType: NoticeTypeEnum.MONITOR_NOTICE,
  content: '',
  sendToSelf: true,
  sendRanges: [],
  selectedAgents: []
})

// ==================== 计算属性 ====================

// 通知类型选项
const noticeTypeOptions = computed(() => [
  { value: NoticeTypeEnum.MONITOR_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.MONITOR_NOTICE] },
  { value: NoticeTypeEnum.SYSTEM_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.SYSTEM_NOTICE] },
  { value: NoticeTypeEnum.BUSINESS_NOTICE, label: NoticeTypeNames[NoticeTypeEnum.BUSINESS_NOTICE] }
])

// 发送范围选项
const sendRangeOptions = computed(() => defaultSendRangeOptions)

// 表单校验规则
const formRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度2-50个字符', trigger: 'blur' }
  ],
  validDays: [
    { required: true, message: '请输入有效天数', trigger: 'blur' },
    { type: 'number', min: 1, max: 30, message: '有效天数1-30天', trigger: 'blur' }
  ],
  noticeType: [
    { required: true, message: '请选择通知类型', trigger: 'change' }
  ]
})

// ==================== 方法 ====================

/**
 * 执行编辑器命令
 */
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  updateEditorState()
  editorRef.value?.focus()
}

/**
 * 更新编辑器状态
 */
const updateEditorState = () => {
  isBold.value = document.queryCommandState('bold')
  isItalic.value = document.queryCommandState('italic')
  isUnderline.value = document.queryCommandState('underline')
  
  if (document.queryCommandState('justifyLeft')) {
    align.value = 'left'
  } else if (document.queryCommandState('justifyCenter')) {
    align.value = 'center'
  } else if (document.queryCommandState('justifyRight')) {
    align.value = 'right'
  }
}

/**
 * 处理编辑器输入
 */
const handleEditorInput = () => {
  if (editorRef.value) {
    noticeForm.content = editorRef.value.innerHTML
    contentLength.value = editorRef.value.textContent?.length || 0
  }
}

/**
 * 处理编辑器键盘事件
 */
const handleEditorKeydown = (e: KeyboardEvent) => {
  // 限制最大长度
  if (contentLength.value >= 2000 && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    ElMessage.warning('内容已达最大长度限制')
  }
}

/**
 * 处理发布 - 使用Store发送通知
 */
const handlePublish = async () => {
  // 校验表单
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 校验内容
  if (!noticeForm.content || noticeForm.content.trim() === '') {
    ElMessage.warning('请输入通知内容')
    editorRef.value?.focus()
    return
  }

  // 校验发送目标
  if (noticeForm.sendRanges.length === 0) {
    ElMessage.warning('请选择发送范围')
    return
  }

  publishing.value = true
  
  // 使用Store发送通知
  const res = await notificationStore.sendNotification({
    title: noticeForm.title,
    content: noticeForm.content,
    validDays: noticeForm.validDays,
    noticeType: noticeForm.noticeType,
    sendToSelf: noticeForm.sendToSelf,
    sendRanges: noticeForm.sendRanges
  })

  if (res.success) {
    emit('publish', {
      noticeId: res.data.id,
      title: noticeForm.title,
      sendCount: 1,
      ...noticeForm
    })
    handleClear()
  }

  publishing.value = false
}

/**
 * 处理清空
 */
const handleClear = () => {
  formRef.value?.resetFields()
  noticeForm.title = ''
  noticeForm.validDays = 1
  noticeForm.noticeType = NoticeTypeEnum.MONITOR_NOTICE
  noticeForm.content = ''
  noticeForm.sendToSelf = true
  noticeForm.sendRanges = []
  noticeForm.selectedAgents = []
  
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
  }
  contentLength.value = 0
  
  // 重置编辑器状态
  isBold.value = false
  isItalic.value = false
  isUnderline.value = false
  align.value = 'left'
  foreColor.value = '#000000'
  backColor.value = '#ffffff'
}

/**
 * 处理关闭
 */
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 监听编辑器选择变化
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === editorRef.value) {
      updateEditorState()
    }
  })
})
</script>

<style scoped lang="scss">
.notice-publish-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa;
  padding: 16px;
  gap: 16px;
}

// 通知编辑区
.notice-edit-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .notice-config {
    background: #f5f7fa;
    padding: 16px;
    border-radius: 4px;

    .unit-text {
      margin-left: 8px;
      color: #606266;
      font-size: 13px;
    }
  }

  .editor-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .editor-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;

      .el-button {
        padding: 6px 12px;

        &.is-active {
          background: #409eff;
          color: #fff;
          border-color: #409eff;
        }

        strong, em, u {
          font-size: 14px;
        }
      }

      .el-divider {
        margin: 0 4px;
      }
    }

    .editor-content {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.6;
      color: #303133;
      background: #fff;
      min-height: 200px;

      &:empty:before {
        content: attr(placeholder);
        color: #c0c4cc;
      }

      &:focus {
        outline: none;
      }
    }

    .editor-footer {
      display: flex;
      justify-content: flex-end;
      padding: 8px 12px;
      background: #f5f7fa;
      border-top: 1px solid #dcdfe6;

      .char-count {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

// 发送选项区
.send-options-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .send-to-self {
    font-weight: 500;
  }

  .range-label {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
  }

  :deep(.el-checkbox-group) {
    display: flex;
    gap: 16px;
  }
}

// 底部操作区
.action-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .action-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .action-right {
    display: flex;
    gap: 12px;

    .el-button {
      min-width: 100px;
    }
  }
}
</style>
