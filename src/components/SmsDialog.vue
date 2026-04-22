<template>
  <el-dialog
    :model-value="modelValue"
    title="短信发送"
    width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form :model="smsForm" label-width="80px">
      <el-form-item label="手机号码">
        <el-input v-model="smsForm.phoneNumber" readonly />
      </el-form-item>
      <el-form-item label="短信模板">
        <el-select v-model="smsForm.templateId" placeholder="请选择模板" style="width: 100%" @change="handleTemplateChange">
          <el-option label="业务通知" value="1" />
          <el-option label="温馨提醒" value="2" />
          <el-option label="营销活动" value="3" />
          <el-option label="自定义" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="短信内容">
        <el-input
          v-model="smsForm.content"
          type="textarea"
          :rows="6"
          placeholder="请输入短信内容"
        />
      </el-form-item>
      <el-form-item label="字数统计">
        <span>{{ smsForm.content.length }} / 200</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue', false)">取消</el-button>
        <el-button type="primary" :loading="sending" @click="handleSend">发送</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
  phoneNumber: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'send-success'): void
}>()

const sending = ref(false)

const smsForm = reactive({
  phoneNumber: '',
  templateId: '1',
  content: ''
})

const templates: Record<string, string> = {
  '1': '【客服通知】尊敬的客户，您的业务已办理成功，如有疑问请致电客服热线。',
  '2': '【温馨提醒】尊敬的客户，您的服务即将到期，请及时续费以保证正常使用。',
  '3': '【优惠活动】尊敬的客户，现在办理业务可享受优惠，详情请咨询客服。'
}

watch(() => props.modelValue, (val) => {
  if (val) {
    smsForm.phoneNumber = props.phoneNumber
    smsForm.templateId = '1'
    smsForm.content = templates['1']
  }
})

const handleTemplateChange = (templateId: string) => {
  if (templateId !== '0' && templates[templateId]) {
    smsForm.content = templates[templateId]
  }
}

const handleSend = async () => {
  if (!smsForm.content.trim()) {
    ElMessage.warning('请输入短信内容')
    return
  }

  if (smsForm.content.length > 200) {
    ElMessage.warning('短信内容不能超过200字')
    return
  }

  sending.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('短信发送成功')
    emit('update:modelValue', false)
    emit('send-success')
  } catch (error) {
    ElMessage.error('短信发送失败')
  } finally {
    sending.value = false
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>