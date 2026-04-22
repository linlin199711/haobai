<template>
  <div class="module-container">
    <div class="module-header">
      <h2>我的班次</h2>
      <p>查看个人排班信息</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>排班日历</span>
              <el-radio-group v-model="viewType" size="small">
                <el-radio-button label="month">月视图</el-radio-button>
                <el-radio-button label="week">周视图</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <el-calendar v-model="currentDate">
            <template #date-cell="{ data }">
              <div class="calendar-cell">
                <span>{{ data.day.split('-').pop() }}</span>
                <el-tag v-if="getShiftType(data.day)" size="small" :type="getShiftTagType(data.day)">
                  {{ getShiftType(data.day) }}
                </el-tag>
              </div>
            </template>
          </el-calendar>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="shift-info-card">
          <template #header>
            <span>今日班次</span>
          </template>

          <div class="today-shift">
            <div class="shift-badge" :class="todayShift.type">
              {{ todayShift.name }}
            </div>
            <div class="shift-time">
              <p><strong>上班时间：</strong>{{ todayShift.startTime }}</p>
              <p><strong>下班时间：</strong>{{ todayShift.endTime }}</p>
            </div>
          </div>

          <el-divider />

          <div class="shift-stats">
            <h4>本月统计</h4>
            <div class="stat-item">
              <span>正常出勤</span>
              <el-tag type="success">18天</el-tag>
            </div>
            <div class="stat-item">
              <span>请假</span>
              <el-tag type="warning">1天</el-tag>
            </div>
            <div class="stat-item">
              <span>调休</span>
              <el-tag type="info">2天</el-tag>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="shift-apply-card">
          <template #header>
            <span>班次申请</span>
          </template>

          <el-button type="primary" style="width: 100%; margin-bottom: 10px;">
            <el-icon><Edit /></el-icon>
            请假申请
          </el-button>
          <el-button style="width: 100%;">
            <el-icon><Switch /></el-icon>
            调班申请
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Edit, Switch } from '@element-plus/icons-vue'

const currentDate = ref(new Date())
const viewType = ref('month')

const todayShift = {
  name: '早班',
  type: 'morning',
  startTime: '08:00',
  endTime: '16:00'
}

const shiftData: Record<string, string> = {
  '2024-01-15': '早班',
  '2024-01-16': '早班',
  '2024-01-17': '晚班',
  '2024-01-18': '晚班',
  '2024-01-19': '休息',
  '2024-01-20': '休息',
}

const getShiftType = (day: string) => {
  return shiftData[day] || ''
}

const getShiftTagType = (day: string): 'success' | 'warning' | 'info' | '' => {
  const type = shiftData[day]
  if (type === '早班') return 'success'
  if (type === '晚班') return 'warning'
  if (type === '休息') return 'info'
  return ''
}
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.shift-info-card {
  margin-bottom: 20px;

  .today-shift {
    text-align: center;

    .shift-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      margin: 0 auto 16px;

      &.morning {
        background: linear-gradient(135deg, #52c41a, #95de64);
      }

      &.evening {
        background: linear-gradient(135deg, #fa8c16, #ffc53d);
      }
    }

    .shift-time {
      p {
        margin: 8px 0;
        color: #606266;
      }
    }
  }

  .shift-stats {
    h4 {
      margin-bottom: 16px;
      color: #303133;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      span {
        color: #606266;
      }
    }
  }
}

.shift-apply-card {
  .el-button {
    justify-content: center;
  }
}
</style>
