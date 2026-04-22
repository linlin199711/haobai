<template>
  <div class="module-container">
    <div class="module-header">
      <h2>工作情况</h2>
      <p>实时查看工作数据统计</p>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in todayStats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ background: stat.bgColor }">
            <el-icon :size="24" color="#fff">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-compare" :class="stat.trend">
              {{ stat.compare }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>通话量趋势</span>
          </template>
          <div class="chart-placeholder">
            <el-icon :size="48" color="#dcdfe6"><TrendCharts /></el-icon>
            <p>通话量趋势图表区域</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>工作时长统计</span>
          </template>
          <div class="chart-placeholder">
            <el-icon :size="48" color="#dcdfe6"><PieChart /></el-icon>
            <p>工作时长统计图表区域</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="detail-card">
      <template #header>
        <div class="card-header">
          <span>详细数据</span>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
        </div>
      </template>

      <el-table :data="detailData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="calls" label="接听数" width="100" />
        <el-table-column prop="duration" label="通话时长" width="120" />
        <el-table-column prop="satisfaction" label="满意度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.satisfaction" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'warning'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Phone, Timer, Star, User } from '@element-plus/icons-vue'
import { TrendCharts, PieChart } from '@element-plus/icons-vue'

const todayStats = [
  { title: '今日接听', value: 45, compare: '较昨日 +12%', trend: 'up', icon: Phone, bgColor: '#1890ff' },
  { title: '通话时长', value: '3.5h', compare: '较昨日 +0.5h', trend: 'up', icon: Timer, bgColor: '#52c41a' },
  { title: '满意度', value: '4.8', compare: '较昨日 +0.2', trend: 'up', icon: Star, bgColor: '#faad14' },
  { title: '服务客户', value: 38, compare: '较昨日 +5', trend: 'up', icon: User, bgColor: '#722ed1' },
]

const dateRange = ref('')

const detailData = [
  { date: '2024-01-15', calls: 45, duration: '3.5h', satisfaction: 4.8, status: '正常', remark: '' },
  { date: '2024-01-14', calls: 38, duration: '3h', satisfaction: 4.6, status: '正常', remark: '' },
  { date: '2024-01-13', calls: 42, duration: '3.2h', satisfaction: 4.7, status: '正常', remark: '高峰期' },
  { date: '2024-01-12', calls: 35, duration: '2.8h', satisfaction: 4.5, status: '请假', remark: '下午请假' },
  { date: '2024-01-11', calls: 48, duration: '4h', satisfaction: 4.9, status: '正常', remark: '' },
]
</script>

<style scoped lang="scss">
.module-container {
  padding: 20px;
}

.module-header {
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #909399;
  }
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .stat-title {
      font-size: 14px;
      color: #909399;
      margin-bottom: 4px;
    }

    .stat-compare {
      font-size: 12px;

      &.up {
        color: #52c41a;
      }

      &.down {
        color: #f5222d;
      }
    }
  }
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;

  p {
    margin-top: 16px;
    color: #909399;
  }
}

.detail-card {
  margin-top: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
