<template>
  <div class="module-container">
    <div class="module-header">
      <h2>工作台</h2>
      <p>欢迎回来，这里是您的工作中心</p>
    </div>

    <el-row :gutter="20" class="dashboard-cards">
      <!-- 个人信息卡片 -->
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="dashboard-card user-card" shadow="hover">
          <div class="user-info">
            <el-avatar :size="80" :icon="UserFilled" class="user-avatar" />
            <div class="user-detail">
              <h3>赵某某</h3>
              <p>工号: 03615 | 班组: 某某班组</p>
              <div class="status-tags">
                <el-tag type="success" effect="dark">空闲</el-tag>
                <el-tag type="primary" effect="dark">福建</el-tag>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button type="primary" size="small">小休签出</el-button>
            <el-button type="warning" size="small">小休签出</el-button>
            <el-button type="danger" size="small">重新打开</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 统计数据卡片 -->
      <el-col :xs="24" :sm="12" :md="16">
        <el-row :gutter="20">
          <el-col :span="8" v-for="i in 6" :key="i">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">109</div>
                <div class="stat-label">签入时长(分)</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 所属技能 -->
    <el-card class="section-card" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>所属技能</span>
          <el-button type="primary" size="small">调整技能</el-button>
        </div>
      </template>
      <el-tabs type="border-card">
        <el-tab-pane label="语音技能">
          <el-tag v-for="i in 3" :key="i" class="skill-tag">{{ i }}星技能队列</el-tag>
        </el-tab-pane>
        <el-tab-pane label="文字技能">
          <el-tag v-for="i in 3" :key="i" :type="'success'" class="skill-tag">{{ i }}星技能队列</el-tag>
        </el-tab-pane>
        <el-tab-pane label="视频技能">
          <el-tag v-for="i in 3" :key="i" :type="'warning'" class="skill-tag">{{ i }}星技能队列</el-tag>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 质检评定 -->
    <el-card class="section-card" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>质检评定</span>
        </div>
      </template>
      <el-form :inline="true" class="search-form">
        <el-form-item label="主叫号码">
          <el-input placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="被叫号码">
          <el-input placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="流水号">
          <el-input placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="caller" label="主叫号码" width="120" />
        <el-table-column prop="callee" label="被叫号码" width="120" />
        <el-table-column prop="serialNo" label="流水号" width="150" />
        <el-table-column prop="agent" label="质检员" width="100" />
        <el-table-column prop="score" label="得分" width="80">
          <template #default="{ row }">
            <span class="score">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="问题描述" show-overflow-tooltip />
        <el-table-column prop="answer" label="正确答案" show-overflow-tooltip />
        <el-table-column prop="time" label="创建时间" width="160" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { UserFilled, Timer } from '@element-plus/icons-vue'

const tableData = [
  { caller: '13386935672', callee: '059110000', serialNo: '059110001111', agent: '王镜宇', score: '10.00', desc: '这是描述...', answer: '这是答案...', time: '2021/09/21 08:50:08' },
  { caller: '13386935672', callee: '059110000', serialNo: '059110001111', agent: '王镜宇', score: '10.00', desc: '这是描述...', answer: '这是答案...', time: '2021/09/21 08:50:08' },
  { caller: '13386935672', callee: '059110000', serialNo: '059110001111', agent: '王镜宇', score: '10.00', desc: '这是描述...', answer: '这是答案...', time: '2021/09/21 08:50:08' },
  { caller: '13386935672', callee: '059110000', serialNo: '059110001111', agent: '王镜宇', score: '10.00', desc: '这是描述...', answer: '这是答案...', time: '2021/09/21 08:50:08' },
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

.dashboard-cards {
  margin-bottom: 20px;
}

.user-card {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: #fff;
  height: 100%;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .user-info {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;

    .user-avatar {
      background: rgba(255, 255, 255, 0.3);
    }

    .user-detail {
      h3 {
        font-size: 20px;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        opacity: 0.9;
        margin-bottom: 12px;
      }

      .status-tags {
        display: flex;
        gap: 8px;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.stat-card {
  margin-bottom: 20px;
  text-align: center;

  :deep(.el-card__body) {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #e6f7ff;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon {
      font-size: 24px;
      color: #1890ff;
    }
  }

  .stat-content {
    text-align: left;

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .stat-label {
      font-size: 12px;
      color: #909399;
    }
  }
}

.section-card {
  margin-bottom: 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }
}

.skill-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.search-form {
  margin-bottom: 20px;
}

.score {
  color: #f56c6c;
  font-weight: 600;
}
</style>
