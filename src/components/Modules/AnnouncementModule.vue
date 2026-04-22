<template>
  <div class="module-container">
    <div class="module-header">
      <h2>公告</h2>
      <p>查看最新公告和通知</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>公告列表</span>
              <el-radio-group v-model="noticeType" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="important">重要</el-radio-button>
                <el-radio-button label="normal">普通</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <div class="notice-list">
            <div
              v-for="notice in filteredNotices"
              :key="notice.id"
              class="notice-item"
              :class="{ unread: !notice.read, important: notice.type === 'important' }"
              @click="viewNotice(notice)"
            >
              <div class="notice-icon">
                <el-icon :size="20" :color="notice.type === 'important' ? '#f56c6c' : '#409eff'">
                  <Bell />
                </el-icon>
              </div>
              <div class="notice-content">
                <div class="notice-title">
                  <el-tag v-if="notice.type === 'important'" type="danger" size="small">重要</el-tag>
                  <span>{{ notice.title }}</span>
                </div>
                <div class="notice-meta">
                  <span>{{ notice.author }}</span>
                  <span>{{ notice.time }}</span>
                </div>
              </div>
              <el-icon v-if="!notice.read" class="unread-dot"><CircleFilled /></el-icon>
            </div>
          </div>

          <el-pagination class="pagination" background layout="prev, pager, next" :total="50" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <span>公告统计</span>
          </template>

          <div class="stats-list">
            <div class="stat-item">
              <div class="stat-label">未读公告</div>
              <div class="stat-value unread">5</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">今日发布</div>
              <div class="stat-value">2</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">本周发布</div>
              <div class="stat-value">8</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">重要公告</div>
              <div class="stat-value important">3</div>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="quick-card">
          <template #header>
            <span>快捷操作</span>
          </template>

          <el-button type="primary" style="width: 100%; margin-bottom: 10px;">
            <el-icon><Plus /></el-icon>
            发布公告
          </el-button>
          <el-button style="width: 100%;">
            <el-icon><Search /></el-icon>
            搜索公告
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 公告详情弹窗 -->
    <el-dialog v-model="detailVisible" title="公告详情" width="600px">
      <div class="notice-detail">
        <h3>{{ currentNotice?.title }}</h3>
        <div class="detail-meta">
          <span>发布人：{{ currentNotice?.author }}</span>
          <span>发布时间：{{ currentNotice?.time }}</span>
        </div>
        <el-divider />
        <div class="detail-content">
          {{ currentNotice?.content }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, CircleFilled, Plus, Search } from '@element-plus/icons-vue'

const noticeType = ref('all')
const detailVisible = ref(false)
const currentNotice = ref<any>(null)

const notices = ref([
  { id: 1, title: '关于系统升级维护的通知', type: 'important', author: '系统管理员', time: '2024-01-15 10:00', read: false, content: '系统将于今晚22:00-24:00进行升级维护，期间部分功能可能无法使用，请提前做好准备。' },
  { id: 2, title: '新业务培训通知', type: 'normal', author: '培训部', time: '2024-01-15 09:00', read: false, content: '本周五下午14:00将进行新业务培训，请相关人员准时参加。' },
  { id: 3, title: '节假日值班安排', type: 'important', author: '人事部', time: '2024-01-14 16:00', read: true, content: '春节值班安排已出，请查看附件中的排班表。' },
  { id: 4, title: '优秀员工表彰', type: 'normal', author: '人事部', time: '2024-01-14 10:00', read: true, content: '恭喜以下同事获得本月优秀员工称号...' },
  { id: 5, title: '系统功能更新说明', type: 'normal', author: '技术部', time: '2024-01-13 14:00', read: true, content: '本次更新新增了号码本地搜功能，详细使用说明请查看文档。' },
])

const filteredNotices = computed(() => {
  if (noticeType.value === 'all') return notices.value
  return notices.value.filter(n => n.type === noticeType.value)
})

const viewNotice = (notice: any) => {
  currentNotice.value = notice
  detailVisible.value = true
  notice.read = true
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

.notice-list {
  .notice-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f5f7fa;
    }

    &.unread {
      background: #f0f9ff;
    }

    &.important {
      border-left: 3px solid #f56c6c;
    }

    .notice-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e6f7ff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notice-content {
      flex: 1;

      .notice-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 500;

        .el-tag {
          margin-right: 8px;
        }
      }

      .notice-meta {
        font-size: 12px;
        color: #909399;

        span {
          margin-right: 16px;
        }
      }
    }

    .unread-dot {
      color: #409eff;
      font-size: 12px;
    }
  }
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.stats-card {
  margin-bottom: 20px;

  .stats-list {
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .stat-label {
        color: #606266;
      }

      .stat-value {
        font-size: 20px;
        font-weight: 600;
        color: #303133;

        &.unread {
          color: #409eff;
        }

        &.important {
          color: #f56c6c;
        }
      }
    }
  }
}

.quick-card {
  .el-button {
    justify-content: center;
  }
}

.notice-detail {
  h3 {
    font-size: 18px;
    color: #303133;
    margin-bottom: 16px;
  }

  .detail-meta {
    display: flex;
    gap: 24px;
    color: #909399;
    font-size: 14px;
  }

  .detail-content {
    line-height: 1.8;
    color: #606266;
  }
}
</style>
