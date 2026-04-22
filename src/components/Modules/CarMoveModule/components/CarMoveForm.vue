/**
 * 挪车登记模块 - 登记表单组件
 * @description 挪车登记表单，包含所有登记字段
 * @version 1.0.0
 */

<template>
  <div class="car-move-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      class="form-container"
    >
      <el-row :gutter="24">
        <!-- 登记地区 -->
        <el-col :span="8">
          <el-form-item label="登记地区" prop="district" required>
            <el-select
              v-model="formData.district"
              placeholder="请选择区县"
              class="w-full"
            >
              <el-option
                v-for="item in districtOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 详细地址 -->
        <el-col :span="16">
          <el-form-item label="详细地址" prop="address" required>
            <el-input
              v-model="formData.address"
              placeholder="请输入详细地址"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <!-- 来电号码 -->
        <el-col :span="8">
          <el-form-item label="来电号码" prop="phoneNumber">
            <el-input
              v-model="formData.phoneNumber"
              placeholder="自动填入呼入号码"
            />
          </el-form-item>
        </el-col>

        <!-- 车牌颜色 -->
        <el-col :span="8">
          <el-form-item label="车牌颜色" prop="plateColor" required>
            <el-select
              v-model="formData.plateColor"
              placeholder="请选择车牌颜色"
              class="w-full"
            >
              <el-option
                v-for="item in PLATE_COLOR_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 车牌号 -->
        <el-col :span="8">
          <el-form-item label="车牌号" prop="plateNumber" required>
            <el-input
              v-model="formData.plateNumber"
              placeholder="请输入车牌号"
              @input="handlePlateInput"
            >
              <template #prepend>闽{{ platePrefix }}</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <!-- 车身颜色 -->
        <el-col :span="8">
          <el-form-item label="车身颜色" prop="carColor">
            <el-input
              v-model="formData.carColor"
              placeholder="请输入车身颜色"
            />
          </el-form-item>
        </el-col>

        <!-- 车辆品牌 -->
        <el-col :span="8">
          <el-form-item label="车辆品牌" prop="carBrand">
            <el-input
              v-model="formData.carBrand"
              placeholder="请输入车辆品牌"
            />
          </el-form-item>
        </el-col>

        <!-- 短信通知号码 -->
        <el-col :span="8">
          <el-form-item label="短信通知号码" prop="smsPhoneNumber">
            <el-input
              v-model="formData.smsPhoneNumber"
              placeholder="默认填入来电号码"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <!-- 移车原因 -->
        <el-col :span="8">
          <el-form-item label="移车原因" prop="moveReason">
            <el-select
              v-model="formData.moveReason"
              placeholder="请选择移车原因"
              class="w-full"
            >
              <el-option
                v-for="item in MOVE_REASON_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 登记工号 -->
        <el-col :span="8">
          <el-form-item label="登记工号">
            <el-input
              v-model="formData.agentId"
              disabled
              placeholder="自动填充当前工号"
            />
          </el-form-item>
        </el-col>

        <!-- 备注信息 -->
        <el-col :span="8">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="formData.remark"
              placeholder="请输入备注信息"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 按钮区域 -->
      <el-form-item class="form-buttons">
        <el-button @click="handleReset">重置</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
          提交登记
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import type { CarMoveFormData } from '../types'
import { PLATE_COLOR_OPTIONS, MOVE_REASON_OPTIONS } from '../types'

interface Props {
  agentId: string
  platePrefix: string
  incomingPhone?: string
  districtOptions: Array<{ code: string; name: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: CarMoveFormData): void
  (e: 'reset'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = reactive<CarMoveFormData>({
  district: '',
  address: '',
  phoneNumber: '',
  plateColor: '',
  plateNumber: '',
  fullPlateNumber: '',
  carColor: '',
  carBrand: '',
  smsPhoneNumber: '',
  moveReason: 'move_notice',
  agentId: props.agentId,
  remark: ''
})

// 表单校验规则
const formRules: FormRules = {
  district: [{ required: true, message: '请选择登记地区', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  plateColor: [{ required: true, message: '请选择车牌颜色', trigger: 'change' }],
  plateNumber: [
    { required: true, message: '请输入车牌号', trigger: 'blur' },
    { pattern: /^[A-Z0-9]{5,6}$/, message: '车牌号格式不正确', trigger: 'blur' }
  ],
  carColor: [],
  carBrand: [],
  moveReason: []
}

// 监听来电号码自动填充
watch(() => props.incomingPhone, (newVal) => {
  if (newVal) {
    formData.phoneNumber = newVal
    if (!formData.smsPhoneNumber) {
      formData.smsPhoneNumber = newVal
    }
  }
}, { immediate: true })

// 监听工号变化
watch(() => props.agentId, (newVal) => {
  formData.agentId = newVal
})

// 车牌号输入处理（自动转大写）
const handlePlate