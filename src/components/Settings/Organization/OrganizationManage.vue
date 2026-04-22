<!--
  组织架构管理页面
  @description 组织架构配置管理（班组、工号、技能组）
  @version 1.0.0
-->
<template>
  <div class="organization-manage-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><OfficeBuilding /></el-icon>
        组织架构管理
      </h2>
      <p class="page-subtitle">配置班组、工号、技能组信息</p>
    </div>

    <!-- 提示信息区域 -->
    <div class="notice-section">
      <el-card shadow="never" class="notice-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Warning /></el-icon>
            <span>配置注意事项</span>
          </div>
        </template>

        <div class="notice-content">
          <el-alert
            title="组织架构配置需关注以下要点："
            type="warning"
            :closable="false"
            show-icon
          />
          
          <div class="notice-list">
            <div class="notice-item">
              <el-tag type="primary" effect="light">班组配置</el-tag>
              <p>需注意班组的层级结构、班组长设置以及班组所属的业务条线</p>
            </div>
            <div class="notice-item">
              <el-tag type="success" effect="light">工号配置</el-tag>
              <p>需注意工号的唯一性、所属班组、角色权限以及技能等级设置</p>
            </div>
            <div class="notice-item">
              <el-tag type="warning" effect="light">技能组配置</el-tag>
              <p>需注意技能组的业务类型、服务范围以及组内成员的分配规则</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 占位提示 -->
    <div class="placeholder-section">
      <el-empty description="此页面为复用页面，具体功能待开发">
        <template #image>
          <el-icon :size="80" color="#c0c4cc"><OfficeBuilding /></el-icon>
        </template>
        <template #default>
          <p class="placeholder-text">组织架构功能复用自现有系统</p>
          <p class="placeholder-subtext">如需使用请前往原系统进行操作</p>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OfficeBuilding, Warning } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.organization-manage-page {
  padding: 20px;
  min-height: 100%;
  background-color: #f5f7fa;
}

// 页面头部
.page-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;

  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #303133;

    .el-icon {
      font-size: 24px;
      color: #409eff;
    }
  }

  .page-subtitle {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

// 提示区域
.notice-section {
  margin-bottom: 30px;

  .notice-card {
    border-radius: 8px;

    :deep(.el-card__header) {
      padding: 15px 20px;
      background-color: #fdf6ec;
      border-bottom: 1px solid #f5dab1;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #e6a23c;

      .header-icon {
        font-size: 18px;
      }
    }
  }

  .notice-content {
    padding: 10px 0;

    :deep(.el-alert) {
      margin-bottom: 20px;
    }
  }

  .notice-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .notice-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 6px;
    border-left: 4px solid #409eff;

    .el-tag {
      flex-shrink: 0;
      min-width: 90px;
      text-align: center;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #606266;
      line-height: 1.6;
    }
  }
}

// 占位区域
.placeholder-section {
  padding: 60px 0;

  :deep(.el-empty__image) {
    margin-bottom: 20px;
  }

  .placeholder-text {
    font-size: 16px;
    color: #606266;
    margin: 0 0 8px 0;
  }

  .placeholder-subtext {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}
</style>
