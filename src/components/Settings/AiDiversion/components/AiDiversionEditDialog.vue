<!--
  AI 接话分流管理 - 新增/编辑弹窗
-->
<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑分流规则' : '新增分流规则'"
    width="550px"
    :close-on-click-modal="false"
    @update:model-value="(val) => $emit('update:visible', val)"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="接话地市" prop="cityCode">
        <el-select v-model="form.cityCode" placeholder="请选择" :disabled="isEdit" style="width: 100%">
          <el-option
            v-for="city in cityList"
            :key="city.code"
            :label="city.name"
            :value="city.code"
          />
        </el-select>
        <div v-if="isEdit" style="font-size: 12px; color: #909399; margin-top: 4px">编辑模式下不可修改地市</div>
      </el-form-item>

      <el-form-item label="分流类型" prop="diversionType">
        <el-radio-group v-model="form.diversionType">
          <el-radio label="allTime">全时段生效</el-radio>
          <el-radio label="timePeriod">时段性生效</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.diversionType === 'timePeriod'"
        label="生效时间"
        prop="timeRange"
      >
        <div style="display: flex; align-items: center; gap: 10px">
          <el-time-picker
            v-model="form.startTime"
            placeholder="开始"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 140px"
          />
          <span>至</span>
          <el-time-picker
            v-model="form.endTime"
            placeholder="结束"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 140px"
          />
        </div>
        <div v-if="isCrossDayTime" style="margin-top: 8px; padding: 8px 12px; background: #fdf6ec; border: 1px solid #f5dab1; border-radius: 4px; color: #e6a23c; font-size: 13px">
          <el-icon style="margin-right: 4px"><Warning /></el-icon>
          该时段为跨天配置，从当日{{ form.startTime }}生效至次日{{ form.endTime }}
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { AiDiversionRule, CityConfig } from '../types/aiDiversion'
import { FUJIAN_CITIES } from '../types/aiDiversion'
import { addAiDiversionRule, updateAiDiversionRule, checkCityExists, isCrossDay } from '../mock/aiDiversionMock'

const props = defineProps<{
  visible: boolean
  type: 'add' | 'edit'
  data: AiDiversionRule | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const isEdit = computed(() => props.type === 'edit')

const form = reactive({
  id: '',
  cityCode: '',
  diversionType: 'allTime' as 'allTime' | 'timePeriod',
  startTime: '',
  endTime: ''
})

const cityList = computed<CityConfig[]>(() => {
  if (isEdit.value && props.data) {
    return FUJIAN_CITIES.filter(c => c.code === props.data!.cityCode)
  }
  return FUJIAN_CITIES
})

const isCrossDayTime = computed(() => {
  if (!form.startTime || !form.endTime) return false
  return isCrossDay(form.startTime, form.endTime)
})

const rules: FormRules = {
  cityCode: [{ required: true, message: '请选择接话地市', trigger: 'change' }],
  diversionType: [{ required: true, message: '请选择分流类型', trigger: 'change' }],
  timeRange: [{
    validator: (_, __, callback) => {
      if (form.diversionType === 'timePeriod' && (!form.startTime || !form.endTime)) {
        callback(new Error('请选择生效时间'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }]
}

watch(() => props.visible, (val) => {
  if (val) {
    if (props.data && isEdit.value) {
      form.id = props.data.id
      form.cityCode = props.data.cityCode
      form.diversionType = props.data.diversionType === 'allTime' ? 'allTime' : 'timePeriod'
      form.startTime = props.data.startTime || ''
      form.endTime = props.data.endTime || ''
    } else {
      form.id = ''
      form.cityCode = ''
      form.diversionType = 'allTime'
      form.startTime = ''
      form.endTime = ''
    }
  }
})

watch(() => form.diversionType, (val) => {
  if (val === 'allTime') {
    form.startTime = ''
    form.endTime = ''
  }
})

const handleClosed = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true

  try {
    if (!isEdit.value && form.cityCode) {
      const checkRes = await checkCityExists(form.cityCode as any)
      if (checkRes.success && checkRes.data) {
        ElMessage.error('该地市已存在分流规则，不可重复新增')
        submitting.value = false
        return
      }
    }

    const submitData = {
      id: form.id,
      cityCode: form.cityCode,
      diversionType: form.diversionType === 'allTime' ? 'allTime' as const : 'timePeriod' as const,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined
    }

    const res = isEdit.value
      ? await updateAiDiversionRule(submitData)
      : await addAiDiversionRule(submitData)

    if (res.success) {
      ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
      emit('update:visible', false)
      emit('success')
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>
