<template>
  <div class="module-container">
    <div class="module-header">
      <h2>省内门户</h2>
      <p>省内业务信息查询与办理</p>
    </div>

    <el-row :gutter="20" class="portal-grid">
      <el-col :span="8" v-for="item in portalItems" :key="item.title">
        <el-card shadow="hover" class="portal-card" @click="handleClick(item)">
          <div class="portal-icon" :style="{ background: item.bgColor }">
            <el-icon :size="32" color="#fff">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="portal-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="notice-card">
      <template #header>
        <div class="card-header">
          <span>最新通知</span>
          <el-button type="primary" link>查看更多</el-button>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="notice in notices"
          :key="notice.id"
          :type="notice.type"
          :timestamp="notice.time"
        >
          <h4>{{ notice.title }}</h4>
          <p class="notice-content">{{ notice.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, User, Phone, Message, Setting, DataLine } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const portalItems = [
  { title: '业务办理', desc: '各类业务在线办理', icon: Document, bgColor: '#1890ff' },
  { title: '客户管理', desc: '客户信息查询管理', icon: User, bgColor: '#52c41a' },
  { title: '通话记录', desc: '查询通话详单', icon: Phone, bgColor: '#722ed1' },
  { title: '短信平台', desc: '短信发送管理', icon: Message, bgColor: '#eb2f96' },
  { title: '系统设置', desc: '系统参数配置', icon: Setting, bgColor: '#fa8c16' },
  { title: '数据统计', desc: '业务数据统计分析', icon: DataLine, bgColor: '#13c2c2' },
]

const notices = [
  { id: 1, title: '系统维护通知', content: '系统将于今晚22:00-24:00进行维护升级', time: '2024-01-15 10:00', type: 'warning' },
  { id: 2, title: '新业务上线', content: '号码本地搜功能已正式上线', time: '2024-01-14 09:00', type: 'success' },
  { id: 3, title: '培训通知', content: '本周五下午进行新业务培训', time: '2024-01-13 14:00', type: 'primary' },
]

const handleClick = (item: any) => {
  ElMessage.info(`${item.title}功能开发中`)
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

.portal-grid {
  margin-bottom: 20px;
}

.portal-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .portal-icon {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .portal-info {
    h3 {
      font-size: 18px;
      color: #303133;
      margin-bottom: 8px;
    }

    p {
      color: #909399;
      font-size: 14px;
    }
  }
}

.notice-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notice-content {
    color: #606266;
    margin-top: 4px;
  }
}
</style>
