<template>
  <el-drawer
    :model-value="modelValue"
    title="上下级号码"
    direction="rtl"
    size="450px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="phoneNumber" class="hierarchy-content">
      <div class="current-number">
        <span class="label">当前号码：</span>
        <span class="value">{{ phoneNumber }}</span>
      </div>

      <el-divider content-position="left">上级号码</el-divider>
      
      <div class="hierarchy-list">
        <el-empty v-if="loadingSuperior" description="加载中..." />
        <el-empty v-else-if="superiorNumbers.length === 0" description="无上级号码" />
        <div v-else class="number-card-list">
          <div 
            v-for="item in superiorNumbers" 
            :key="item.number" 
            class="number-card"
            @click="handleCardClick(item)"
          >
            <div class="card-header">
              <span class="number">{{ item.number }}</span>
              <el-tag :type="item.isSecret ? 'danger' : 'info'" size="small">
                {{ item.isSecret ? '保密' : '普通' }}
              </el-tag>
            </div>
            <div class="card-body">
              <p class="name">{{ item.name }}</p>
              <p class="address">{{ item.address }}</p>
            </div>
            <div class="card-footer">
              <el-button type="text" size="small" @click.stop="handleViewDetail(item)">详情</el-button>
              <el-button type="text" size="small" @click.stop="handleSendSms(item)">短信</el-button>
            </div>
          </div>
        </div>
      </div>

      <el-divider content-position="left">下级号码</el-divider>
      
      <div class="hierarchy-list">
        <el-empty v-if="loadingSubordinate" description="加载中..." />
        <el-empty v-else-if="subordinateNumbers.length === 0" description="无下级号码" />
        <div v-else class="number-card-list">
          <div 
            v-for="item in subordinateNumbers" 
            :key="item.number" 
            class="number-card"
            @click="handleCardClick(item)"
          >
            <div class="card-header">
              <span class="number">{{ item.number }}</span>
              <el-tag :type="item.isSecret ? 'danger' : 'info'" size="small">
                {{ item.isSecret ? '保密' : '普通' }}
              </el-tag>
            </div>
            <div class="card-body">
              <p class="name">{{ item.name }}</p>
              <p class="address">{{ item.address }}</p>
            </div>
            <div class="card-footer">
              <el-button type="text" size="small" @click.stop="handleViewDetail(item)">详情</el-button>
              <el-button type="text" size="small" @click.stop="handleSendSms(item)">短信</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <el-empty description="请先选择号码" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
  phoneNumber?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loadingSuperior = ref(false)
const loadingSubordinate = ref(false)

const superiorNumbers = ref<any[]>([])
const subordinateNumbers = ref<any[]>([])

watch(() => props.modelValue, async (val) => {
  if (val && props.phoneNumber) {
    await loadHierarchyData()
  }
})

const loadHierarchyData = async () => {
  if (!props.phoneNumber) return

  loadingSuperior.value = true
  loadingSubordinate.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    superiorNumbers.value = [
      {
        number: '0591-88888801',
        name: '福州分公司总机',
        address: '福建省福州市鼓楼区',
        isSecret: false
      },
      {
        number: '0591-88888802',
        name: '企业客户部',
        address: '福建省福州市鼓楼区',
        isSecret: false
      }
    ]

    subordinateNumbers.value = [
      {
        number: '13800138901',
        name: '分机1',
        address: '福建省福州市仓山区',
        isSecret: false
      },
      {
        number: '13800138902',
        name: '分机2',
        address: '福建省福州市仓山区',
        isSecret: false
      },
      {
        number: '138****8903',
        name: '保密分机',
        address: '福建省福州市仓山区',
        isSecret: true
      }
    ]
  } catch (error) {
    ElMessage.error('加载上下级号码失败')
  } finally {
    loadingSuperior.value = false
    loadingSubordinate.value = false
  }
}

const handleCardClick = (item: any) => {
  ElMessage.info(`已选择号码：${item.number}`)
}

const handleViewDetail = (item: any) => {
  ElMessage.info(`查看详情：${item.number}`)
}

const handleSendSms = (item: any) => {
  ElMessage.info(`发送短信至：${item.number}`)
}
</script>

<style scoped lang="scss">
$primary-color: #1890ff;
$bg-light: #f5f7fa;
$bg-white: #ffffff;
$text-primary: #303133;
$text-secondary: #606266;
$text-muted: #909399;
$border-color: #dcdfe6;

.hierarchy-content {
  padding: 0 10px;
  
  .current-number {
    background-color: $bg-light;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    .label {
      color: $text-muted;
    }
    
    .value {
      color: $primary-color;
      font-weight: 600;
    }
  }
  
  .hierarchy-list {
    min-height: 150px;
    margin-bottom: 20px;
    
    .number-card-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .number-card {
      background-color: $bg-white;
      border: 1px solid $border-color;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: $primary-color;
        box-shadow: 0 2px 8px rgba($primary-color, 0.2);
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .number {
          font-weight: 600;
          color: $text-primary;
        }
      }
      
      .card-body {
        margin-bottom: 8px;
        
        .name {
          color: $text-primary;
          font-weight: 500;
          margin: 0 0 4px 0;
        }
        
        .address {
          color: $text-muted;
          font-size: 12px;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .card-footer {
        display: flex;
        gap: 10px;
        border-top: 1px solid $border-color;
        padding-top: 8px;
        margin-top: 8px;
      }
    }
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

:deep(.el-divider__text) {
  color: $text-secondary;
  font-weight: 500;
}
</style>