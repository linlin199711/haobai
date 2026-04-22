<template>
  <el-dialog
    :model-value="modelValue"
    title="转接"
    width="500px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form :model="transferForm" label-width="80px">
      <el-form-item label="转接类型">
        <el-radio-group v-model="transferForm.type">
          <el-radio label="agent">坐席</el-radio>
          <el-radio label="department">部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="目标选择">
        <el-select 
          v-model="transferForm.target" 
          placeholder="请选择目标" 
          style="width: 100%"
          filterable
          :loading="loadingTargets"
        >
          <el-option
            v-for="item in targetOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="phoneNumber" label="转接号码">
        <el-input :value="phoneNumber" readonly />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue', false)">取消</el-button>
        <el-button type="primary" :loading="transferring" @click="handleTransfer">转接</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
  phoneNumber?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'transfer-success'): void
}>()

const transferring = ref(false)
const loadingTargets = ref(false)

const transferForm = reactive({
  type: 'agent',
  target: ''
})

const agentOptions = ref([
  { value: 'agent1', label: '坐席1 - 张三' },
  { value: 'agent2', label: '坐席2 - 李四' },
  { value: 'agent3', label: '坐席3 - 王五' },
  { value: 'agent4', label: '坐席4 - 赵六' },
  { value: 'agent5', label: '坐席5 - 钱七' }
])

const departmentOptions = ref([
  { value: 'dept1', label: '客服部' },
  { value: 'dept2', label: '售后部' },
  { value: 'dept3', label: '投诉部' },
  { value: 'dept4', label: '营销部' }
])

const targetOptions = computed(() => {
  return transferForm.type === 'agent' ? agentOptions.value : departmentOptions.value
})

watch(() => props.modelValue, (val) => {
  if (val) {
    transferForm.type = 'agent'
    transferForm.target = ''
    loadTargets()
  }
})

const loadTargets = async () => {
  loadingTargets.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    console.error('加载目标列表失败', error)
  } finally {
    loadingTargets.value = false
  }
}

const handleTransfer = async () => {
  if (!transferForm.target) {
    ElMessage.warning('请选择转接目标')
    return
  }

  transferring.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('转接成功')
    emit('update:modelValue', false)
    emit('transfer-success')
  } catch (error) {
    ElMessage.error('转接失败')
  } finally {
    transferring.value = false
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