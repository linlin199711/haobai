<!--
  FilterPanel 使用示例
  @description 展示如何在不同模块中使用 FilterPanel 组件
  @version 1.0.0
-->
<template>
  <div class="space-y-8 p-6">
    <!-- 示例1：号码本地搜筛选区 -->
    <section>
      <h2 class="text-lg font-semibold text-gray-800 mb-4">号码本地搜 - 筛选区</h2>
      <FilterPanel
        :filters="numberSearchFilters"
        :loading="loading1"
        @search="handleNumberSearch"
        @reset="handleNumberReset"
      />
    </section>

    <!-- 示例2：挪车登记筛选区 -->
    <section>
      <h2 class="text-lg font-semibold text-gray-800 mb-4">挪车登记 - 筛选区</h2>
      <FilterPanel
        :filters="carMoveFilters"
        :loading="loading2"
        @search="handleCarMoveSearch"
        @reset="handleCarMoveReset"
      />
    </section>

    <!-- 示例3：录音回放筛选区 -->
    <section>
      <h2 class="text-lg font-semibold text-gray-800 mb-4">录音回放 - 筛选区</h2>
      <FilterPanel
        :filters="recordingFilters"
        :loading="loading3"
        @search="handleRecordingSearch"
        @reset="handleRecordingReset"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FilterPanel, { type FilterItem } from './FilterPanel.vue'

// 加载状态
const loading1 = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)

// ==================== 号码本地搜筛选项 ====================
const numberSearchFilters: FilterItem[] = [
  {
    field: 'keyword',
    label: '查询关键字',
    type: 'text',
    placeholder: '请输入企业名称或号码'
  },
  {
    field: 'city',
    label: '所属地市',
    type: 'select',
    options: [
      { label: '福州市', value: 'fuzhou' },
      { label: '厦门市', value: 'xiamen' },
      { label: '泉州市', value: 'quanzhou' },
      { label: '漳州市', value: 'zhangzhou' }
    ]
  },
  {
    field: 'district',
    label: '所属区县',
    type: 'select',
    options: [
      { label: '鼓楼区', value: 'gulou' },
      { label: '台江区', value: 'taijiang' },
      { label: '仓山区', value: 'cangshan' },
      { label: '晋安区', value: 'jinan' }
    ]
  },
  {
    field: 'industry',
    label: '行业分类',
    type: 'select',
    options: [
      { label: '餐饮', value: 'catering' },
      { label: '酒店', value: 'hotel' },
      { label: '医疗', value: 'medical' },
      { label: '教育', value: 'education' }
    ]
  },
  {
    field: 'queryDate',
    label: '查询日期',
    type: 'date'
  },
  {
    field: 'resultType',
    label: '查询结果',
    type: 'select',
    options: [
      { label: '有结果', value: 'has_result' },
      { label: '无结果', value: 'no_result' }
    ]
  },
  {
    field: 'includeHistory',
    label: '包含历史',
    type: 'checkbox',
    checkboxLabel: '包含历史记录',
    defaultValue: false
  }
]

// ==================== 挪车登记筛选项 ====================
const carMoveFilters: FilterItem[] = [
  {
    field: 'plateNumber',
    label: '车牌号码',
    type: 'text',
    placeholder: '请输入车牌号'
  },
  {
    field: 'plateColor',
    label: '车牌颜色',
    type: 'select',
    options: [
      { label: '蓝牌', value: 'blue' },
      { label: '黄牌', value: 'yellow' },
      { label: '绿牌', value: 'green' },
      { label: '白牌', value: 'white' }
    ]
  },
  {
    field: 'district',
    label: '登记地区',
    type: 'select',
    options: [
      { label: '鼓楼区', value: 'gulou' },
      { label: '台江区', value: 'taijiang' },
      { label: '仓山区', value: 'cangshan' },
      { label: '晋安区', value: 'jinan' }
    ]
  },
  {
    field: 'moveReason',
    label: '移车原因',
    type: 'select',
    options: [
      { label: '移车通知', value: 'move_notice' },
      { label: '友情提示', value: 'friendly_reminder' }
    ]
  },
  {
    field: 'registerDate',
    label: '登记日期',
    type: 'date'
  },
  {
    field: 'syncStatus',
    label: '同步状态',
    type: 'select',
    options: [
      { label: '已同步', value: 'synced' },
      { label: '未同步', value: 'unsynced' },
      { label: '同步中', value: 'syncing' }
    ]
  },
  {
    field: 'phoneNumber',
    label: '来电号码',
    type: 'text',
    placeholder: '请输入来电号码'
  },
  {
    field: 'notificationStatus',
    label: '通知情况',
    type: 'select',
    options: [
      { label: '已通知', value: 'notified' },
      { label: '未通知', value: 'unnotified' }
    ]
  }
]

// ==================== 录音回放筛选项 ====================
const recordingFilters: FilterItem[] = [
  {
    field: 'startTime',
    label: '开始时间',
    type: 'datetime'
  },
  {
    field: 'endTime',
    label: '结束时间',
    type: 'datetime'
  },
  {
    field: 'agentNo',
    label: '话务员工号',
    type: 'select',
    options: [
      { label: 'A001', value: 'A001' },
      { label: 'A002', value: 'A002' },
      { label: 'A003', value: 'A003' }
    ]
  },
  {
    field: 'phoneNumber',
    label: '对方号码',
    type: 'text',
    placeholder: '请输入号码'
  },
  {
    field: 'businessKey',
    label: '业务键',
    type: 'text',
    placeholder: '请输入业务键'
  },
  {
    field: 'satisfaction',
    label: '满意度',
    type: 'select',
    options: [
      { label: '非常满意', value: '5' },
      { label: '满意', value: '4' },
      { label: '一般', value: '3' },
      { label: '不满意', value: '2' },
      { label: '非常不满意', value: '1' }
    ]
  },
  {
    field: 'duration',
    label: '时长(秒)',
    type: 'number',
    placeholder: '请输入时长'
  },
  {
    field: 'includeSubGroup',
    label: '包含子组',
    type: 'checkbox',
    checkboxLabel: '包含子组成员',
    defaultValue: false
  }
]

// ==================== 事件处理 ====================
const handleNumberSearch = (data: Record<string, any>) => {
  loading1.value = true
  console.log('号码本地搜筛选条件:', data)
  // 模拟搜索
  setTimeout(() => {
    loading1.value = false
  }, 1000)
}

const handleNumberReset = () => {
  console.log('号码本地搜重置筛选')
}

const handleCarMoveSearch = (data: Record<string, any>) => {
  loading2.value = true
  console.log('挪车登记筛选条件:', data)
  // 模拟搜索
  setTimeout(() => {
    loading2.value = false
  }, 1000)
}

const handleCarMoveReset = () => {
  console.log('挪车登记重置筛选')
}

const handleRecordingSearch = (data: Record<string, any>) => {
  loading3.value = true
  console.log('录音回放筛选条件:', data)
  // 模拟搜索
  setTimeout(() => {
    loading3.value = false
  }, 1000)
}

const handleRecordingReset = () => {
  console.log('录音回放重置筛选')
}
</script>
