<template>
  <div class="call-center-app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 顶部话务条组件 - 为左侧菜单留出空间 -->
    <div class="call-bar-wrapper">
      <CallBar />
    </div>

    <!-- 页面主体布局 -->
    <div class="page-layout">
      <!-- 左侧功能导航栏 -->
      <aside class="left-sidebar" :class="{ 'is-collapsed': sidebarCollapsed }">
        <div class="sidebar-header">
          <el-icon class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <Fold v-if="!sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <span v-if="!sidebarCollapsed" class="sidebar-title">功能菜单</span>
        </div>

        <nav class="sidebar-nav">
          <!-- 门框菜单 -->
          <div
            class="nav-item"
            :class="{ active: currentModule === 'numberSearch' || currentModule === 'nonNumberQuery' || currentModule === 'carMove' || currentModule === 'pbx30' || showDoorFrameMenu }"
            @click="toggleDoorFrameMenu"
          >
            <el-icon><Grid /></el-icon>
            <span v-if="!sidebarCollapsed">门框菜单</span>
            <el-tooltip v-else content="门框菜单" placement="right">
              <span class="nav-tooltip">门框菜单</span>
            </el-tooltip>
          </div>

          <!-- 门框子菜单 -->
          <div v-if="showDoorFrameMenu && !sidebarCollapsed" class="sub-menu" @click.stop>
            <div class="sub-menu-item" :class="{ active: currentModule === 'numberSearch' }" @click="handleDoorFrameItem('numberSearch')">
              <el-icon><Search /></el-icon>
              <span>号码本地搜</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'nonNumberQuery' }" @click="handleDoorFrameItem('nonNumberQuery')">
              <el-icon><DocumentCopy /></el-icon>
              <span>非号码查询</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'carMove' }" @click="handleDoorFrameItem('carMove')">
              <el-icon><Van /></el-icon>
              <span>挪车登记</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'pbx30' }" @click="handleDoorFrameItem('pbx30')">
              <el-icon><PhoneFilled /></el-icon>
              <span>总机3.0</span>
            </div>
          </div>

          <!-- 运营管理 -->
          <div
            class="nav-item"
            :class="{ active: currentModule === 'operation' || showOperationMenu }"
            @click="toggleOperationMenu"
          >
            <el-icon><Management /></el-icon>
            <span v-if="!sidebarCollapsed">运营管理</span>
            <el-tooltip v-else content="运营管理" placement="right">
              <span class="nav-tooltip">运营管理</span>
            </el-tooltip>
          </div>

          <!-- 运营管理子菜单 -->
          <div v-if="showOperationMenu && !sidebarCollapsed" class="sub-menu" @click.stop>
            <!-- 客户管理（二级菜单） -->
            <div class="sub-menu-item" :class="{ active: showCustomerManageMenu }" @click.stop="toggleCustomerManageMenu">
              <span>客户管理</span>
              <el-icon class="arrow-icon" :class="{ 'is-expand': showCustomerManageMenu }"><ArrowRight /></el-icon>
            </div>
            <!-- 客户管理二级子菜单 -->
            <div v-if="showCustomerManageMenu" class="sub-menu level-2" @click.stop>
              <div class="sub-menu-item" :class="{ active: currentModule === 'customerInfoList' || currentModule === 'customerInfoDetail' }" @click="handleCustomerManageItem('customerInfoList')">
                <span>客户基础信息</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'customerAudit' }" @click="handleCustomerManageItem('customerAudit')">
                <span>客户业务审核</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'customerBusinessMigration' }" @click="handleCustomerManageItem('customerBusinessMigration')">
                <span>客户业务迁移</span>
              </div>
            </div>
            <!-- 销售品管理（二级菜单） -->
            <div class="sub-menu-item" :class="{ active: showProductManageMenu }" @click.stop="toggleProductManageMenu">
              <span>销售品管理</span>
              <el-icon class="arrow-icon" :class="{ 'is-expand': showProductManageMenu }"><ArrowRight /></el-icon>
            </div>
            <!-- 销售品管理二级子菜单 -->
            <div v-if="showProductManageMenu" class="sub-menu level-2" @click.stop>
              <div class="sub-menu-item" :class="{ active: currentModule === 'keywordManage' }" @click="handleProductManageItem('keywordManage')">
                <span>销售品关键字</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'synonymKeywordManage' }" @click="handleProductManageItem('synonymKeywordManage')">
                <span>同义关键字</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'associateKeywordManage' }" @click="handleProductManageItem('associateKeywordManage')">
                <span>联想关键字</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'salesUnitManage' }" @click="handleProductManageItem('salesUnitManage')">
                <span>销售单元信息</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'keywordAudit' }" @click="handleProductManageItem('keywordAudit')">
                <span>销售品关键字审核</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'salesUnitAudit' }" @click="handleProductManageItem('salesUnitAudit')">
                <span>销售单元信息审核</span>
              </div>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('keywordSelect')">
              <span>CRM关键字(嵌入CRM)</span>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('nonNumberInfoManage')">
              <span>非号码信息管理</span>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('aiDiversion')">
              <span>AI 接话分流管理</span>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('organization')">
              <span>组织架构（复用）</span>
            </div>
            <!-- 智能路由（二级菜单） -->
            <div class="sub-menu-item" :class="{ active: showSmartRoutingMenu }" @click.stop="toggleSmartRoutingMenu">
              <span>智能路由</span>
              <el-icon class="arrow-icon" :class="{ 'is-expand': showSmartRoutingMenu }"><ArrowRight /></el-icon>
            </div>
            <!-- 智能路由二级子菜单 -->
            <div v-if="showSmartRoutingMenu" class="sub-menu level-2" @click.stop>
              <div class="sub-menu-item" :class="{ active: currentModule === 'skillManagement' }" @click="handleSmartRoutingItem('skillManagement')">
                <span>技能管理</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'routeManagement' }" @click="handleSmartRoutingItem('routeManagement')">
                <span>路由管理</span>
              </div>
            </div>
          </div>

          <!-- 运营报表 -->
          <div
            class="nav-item"
            :class="{ active: currentModule === 'operationReport' || showOperationReportMenu }"
            @click="toggleOperationReportMenu"
          >
            <el-icon><TrendCharts /></el-icon>
            <span v-if="!sidebarCollapsed">运营报表</span>
            <el-tooltip v-else content="运营报表" placement="right">
              <span class="nav-tooltip">运营报表</span>
            </el-tooltip>
          </div>

          <!-- 运营报表子菜单 -->
          <div v-if="showOperationReportMenu && !sidebarCollapsed" class="sub-menu" @click.stop>
            <div class="sub-menu-item" :class="{ active: currentModule === 'operatorReport' }" @click="handleOperationReportItem('operatorReport')">
              <span>人工话务员接续报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'merchantQueryReport' }" @click="handleOperationReportItem('merchantQueryReport')">
              <span>优推商家查询量报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'keywordQueryReport' }" @click="handleOperationReportItem('keywordQueryReport')">
              <span>关键词查询量及资源统计报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'keywordSearchReport' }" @click="handleOperationReportItem('keywordSearchReport')">
              <span>话务员输入关键词搜索量统计表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'merchantDataReport' }" @click="handleOperationReportItem('merchantDataReport')">
              <span>114推广/百事通加盟商家数据报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'merchantCallReport' }" @click="handleOperationReportItem('merchantCallReport')">
              <span>商家报号明细数据报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'provinceCallReport' }" @click="handleOperationReportItem('provinceCallReport')">
              <span>全省综合话务统计报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'numberTransferReport' }" @click="handleOperationReportItem('numberTransferReport')">
              <span>号码转接报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'operatorWorkReport' }" @click="handleOperationReportItem('operatorWorkReport')">
              <span>操作员工作情况报表</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'operatorAttendanceReport' }" @click="handleOperationReportItem('operatorAttendanceReport')">
              <span>操作员考勤统计</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'operatorBusyDetailReport' }" @click="handleOperationReportItem('operatorBusyDetailReport')">
              <span>操作员示忙详情</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'numberQueryDetailReport' }" @click="handleOperationReportItem('numberQueryDetailReport')">
              <span>号码查询明细</span>
            </div>
            <div class="sub-menu-item" :class="{ active: currentModule === 'userSatisfactionReport' }" @click="handleOperationReportItem('userSatisfactionReport')">
              <span>用户满意度报表</span>
            </div>
          </div>

          <!-- 更多 -->
          <div class="nav-item more-item" @click="showMoreMenu = !showMoreMenu">
            <el-icon><MoreFilled /></el-icon>
            <span v-if="!sidebarCollapsed">更多</span>
            <el-tooltip v-else content="更多" placement="right">
              <span class="nav-tooltip">更多</span>
            </el-tooltip>
          </div>

          <!-- 更多菜单展开 -->
          <div v-if="showMoreMenu && !sidebarCollapsed" class="more-menu">
            <div class="more-menu-item" @click="handleMoreItem('updateNotes')">
              <el-icon><Document /></el-icon>
              <span>更新说明</span>
            </div>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <!-- 页面说明按钮 - 固定右上角 -->
        <div v-if="showPageInstruction" class="page-instruction-container">
          <PageInstructionDrawer
            :page-id="currentPageInstruction.pageId"
            :page-title="currentPageInstruction.pageTitle"
          />
        </div>

        <!-- 号码本地搜模块（默认显示） -->
        <div v-if="currentModule === 'numberSearch' || currentModule === ''" class="number-search-wrapper">
          <NumberSearch />
        </div>

        <!-- 非号码查询模块 -->
        <NonNumberQueryModule v-else-if="currentModule === 'nonNumberQuery'" />

        <!-- 挪车登记模块 -->
        <CarMoveModule v-else-if="currentModule === 'carMove'" />

        <!-- 总机3.0模块 -->
        <Pbx30Module v-else-if="currentModule === 'pbx30'" />

        <!-- 销售品关键字管理模块 -->
        <KeywordManage v-else-if="currentModule === 'keywordManage'" />

        <!-- 同义关键字管理模块 -->
        <SynonymKeywordManager v-else-if="currentModule === 'synonymKeywordManage'" mode="synonym" />

        <!-- 联想关键字管理模块 -->
        <SynonymKeywordManager v-else-if="currentModule === 'associateKeywordManage'" mode="associate" />

        <!-- 销售单元信息管理模块 -->
        <SalesUnitManage v-else-if="currentModule === 'salesUnitManage'" />

        <!-- 销售品关键字审核模块 -->
        <KeywordAudit v-else-if="currentModule === 'keywordAudit'" />

        <!-- 销售单元信息审核模块 -->
        <SalesUnitAudit v-else-if="currentModule === 'salesUnitAudit'" />

        <!-- 客户业务审核模块 -->
        <CustomerAudit v-else-if="currentModule === 'customerAudit'" />

        <!-- 非号码信息管理模块 -->
        <NonNumberInfoManage v-else-if="currentModule === 'nonNumberInfoManage'" />

        <!-- 更新说明模块 -->
        <UpdateNotes v-else-if="currentModule === 'updateNotes'" />

        <!-- 人工话务员接续报表 -->
        <OperatorReport v-else-if="currentModule === 'operatorReport'" />

        <!-- 优推商家查询量报表 -->
        <MerchantQueryReport v-else-if="currentModule === 'merchantQueryReport'" />

        <!-- 关键词查询量及资源统计报表 -->
        <KeywordQueryReport v-else-if="currentModule === 'keywordQueryReport'" />

        <!-- 话务员输入关键词搜索量统计表 -->
        <KeywordSearchReport v-else-if="currentModule === 'keywordSearchReport'" />

        <!-- 114推广/百事通加盟商家数据报表 -->
        <MerchantDataReport v-else-if="currentModule === 'merchantDataReport'" />

        <!-- 商家报号明细数据报表 -->
        <MerchantCallReport v-else-if="currentModule === 'merchantCallReport' " />
        <ProvinceCallReport v-else-if="currentModule === 'provinceCallReport' " />
        <NumberTransferReport v-else-if="currentModule === 'numberTransferReport' " />
        <OperatorWorkReport v-else-if="currentModule === 'operatorWorkReport' " />
        <OperatorAttendanceReport v-else-if="currentModule === 'operatorAttendanceReport' " />
        <OperatorBusyDetailReport v-else-if="currentModule === 'operatorBusyDetailReport' " />
        <NumberQueryDetailReport v-else-if="currentModule === 'numberQueryDetailReport' " />
        <UserSatisfactionReport v-else-if="currentModule === 'userSatisfactionReport' " />

        <!-- 运营报表 - 日报表 -->
        <div v-else-if="currentModule === 'dailyReport'" class="report-placeholder">
          <el-empty description="日报表功能开发中">
            <template #image>
              <el-icon :size="60" color="#409eff"><TrendCharts /></el-icon>
            </template>
            <p>日报表模块正在开发中，敬请期待...</p>
          </el-empty>
        </div>

        <!-- 运营报表 - 月报表 -->
        <div v-else-if="currentModule === 'monthlyReport'" class="report-placeholder">
          <el-empty description="月报表功能开发中">
            <template #image>
              <el-icon :size="60" color="#409eff"><TrendCharts /></el-icon>
            </template>
            <p>月报表模块正在开发中，敬请期待...</p>
          </el-empty>
        </div>

        <!-- 运营报表 - 话务统计 -->
        <div v-else-if="currentModule === 'callStatistics'" class="report-placeholder">
          <el-empty description="话务统计功能开发中">
            <template #image>
              <el-icon :size="60" color="#409eff"><TrendCharts /></el-icon>
            </template>
            <p>话务统计模块正在开发中，敬请期待...</p>
          </el-empty>
        </div>

        <!-- 运营报表 - 业务分析 -->
        <div v-else-if="currentModule === 'businessAnalysis'" class="report-placeholder">
          <el-empty description="业务分析功能开发中">
            <template #image>
              <el-icon :size="60" color="#409eff"><TrendCharts /></el-icon>
            </template>
            <p>业务分析模块正在开发中，敬请期待...</p>
          </el-empty>
        </div>

        <!-- 组织架构模块 -->
        <OrganizationManage v-else-if="currentModule === 'organization'" />

        <!-- AI 接话分流管理模块 -->
        <AiDiversionManage v-else-if="currentModule === 'aiDiversion'" />

        <!-- 技能管理模块 -->
        <div v-else-if="currentModule === 'skillManagement'" class="smart-routing-wrapper">
          <el-card shadow="never" class="smart-routing-card">
            <template #header>
              <div class="card-header">
                <el-icon><UserFilled /></el-icon>
                <span>技能管理</span>
              </div>
            </template>
            <div class="smart-routing-content">
              <div class="reuse-content">
                <div class="reuse-icon">
                  <el-icon :size="100" color="#e0e0e0"><OfficeBuilding /></el-icon>
                </div>
                <div class="reuse-text">
                  <p class="reuse-description">此页面为复用页面，具体功能待开发</p>
                  <p class="reuse-system">技能管理功能复用万号能力</p>
                  <p class="reuse-tip">如需使用请前往原系统进行操作</p>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 路由管理模块 -->
        <div v-else-if="currentModule === 'routeManagement'" class="smart-routing-wrapper">
          <el-card shadow="never" class="smart-routing-card">
            <template #header>
              <div class="card-header">
                <el-icon><Link /></el-icon>
                <span>路由管理</span>
              </div>
            </template>
            <div class="smart-routing-content">
              <div class="reuse-content">
                <div class="reuse-icon">
                  <el-icon :size="100" color="#e0e0e0"><OfficeBuilding /></el-icon>
                </div>
                <div class="reuse-text">
                  <p class="reuse-description">此页面为复用页面，具体功能待开发</p>
                  <p class="reuse-system">路由管理功能复用万号能力</p>
                  <p class="reuse-tip">如需使用请前往原系统进行操作</p>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 客户基本信息列表模块 -->
        <CustomerInfoList
          v-else-if="currentModule === 'customerInfoList'"
          @add="handleCustomerAdd"
          @view="handleCustomerView"
          @edit="handleCustomerEdit"
        />

        <!-- 客户基本信息详情/编辑模块 -->
        <CustomerInfoDetail
          v-else-if="currentModule === 'customerInfoDetail'"
          :mode="customerDetailMode"
          :customer-id="currentCustomerId"
          @back-to-list="handleBackToCustomerList"
          @switch-to-edit="handleSwitchToCustomerEdit"
          @save-success="handleCustomerSaveSuccess"
        />

        <!-- 客户业务迁移模块 -->
        <CustomerBusinessMigration v-else-if="currentModule === 'customerBusinessMigration'" />
      </main>

    </div>

    <!-- 功能演示弹窗 -->
    <el-dialog
      v-model="showDemo"
      title="功能演示说明"
      width="600px"
    >
      <div class="demo-content">
        <h4>测试步骤：</h4>
        <ol>
          <li>点击「签入」按钮，将坐席状态切换为在线</li>
          <li>等待约8秒，系统将自动模拟一通来电</li>
          <li>查看来电弹窗，展示用户信息</li>
          <li>点击「接听」开始通话，观察通话信息区变化</li>
          <li>测试「静音」、「挂断」等功能</li>
          <li>点击「示忙」后，测试「录音查看」功能</li>
          <li>测试「外呼」、「转接」等功能</li>
        </ol>

        <el-divider />

        <h4>注意事项：</h4>
        <ul>
          <li>当前使用模拟数据，实际项目需替换为真实接口</li>
          <li>来电弹窗会在签入且示闲状态下自动触发</li>
          <li>跨地市来电会自动显示地市标签</li>
        </ul>
      </div>
    </el-dialog>

    <!-- 接口文档弹窗 -->
    <el-dialog
      v-model="showDocs"
      title="接口字段说明"
      width="700px"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="坐席信息">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="agentId">坐席ID，唯一标识</el-descriptions-item>
            <el-descriptions-item label="agentName">坐席姓名</el-descriptions-item>
            <el-descriptions-item label="agentNo">坐席工号</el-descriptions-item>
            <el-descriptions-item label="department">所属部门</el-descriptions-item>
            <el-descriptions-item label="city">所属地市</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="通话信息">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="callerNumber">主叫号码</el-descriptions-item>
            <el-descriptions-item label="calleeNumber">被叫号码</el-descriptions-item>
            <el-descriptions-item label="duration">通话时长（秒）</el-descriptions-item>
            <el-descriptions-item label="userLevel">用户等级（VIP/gold/silver/normal）</el-descriptions-item>
            <el-descriptions-item label="userAddress">用户地址</el-descriptions-item>
            <el-descriptions-item label="city">来电地市</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="权限配置">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="noIncomingCall">不进线权限，开启后默认示忙</el-descriptions-item>
            <el-descriptions-item label="canViewRecording">录音查看权限</el-descriptions-item>
            <el-descriptions-item label="canOutbound">外呼权限</el-descriptions-item>
            <el-descriptions-item label="canTransfer">转接权限</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 来电用户信息面板 - 全局固定底部 -->
    <div class="caller-info-panel" v-if="callerInfo.show">
      <div class="caller-header">
        <span class="caller-title">来电用户</span>
        <el-tag :type="callerInfo.status === '通话中' ? 'success' : 'warning'" size="small" effect="dark">
          {{ callerInfo.status }}
        </el-tag>
      </div>
      <div class="caller-content">
        <!-- 合并为一排显示 -->
        <div class="caller-row">
          <div class="caller-item">
            <span class="label">主叫号码：</span>
            <span class="value">{{ callerInfo.callerNumber || callerInfo.phoneNumber }}</span>
          </div>
          <div class="caller-item">
            <span class="label">被叫号码：</span>
            <span class="value">{{ callerInfo.calleeNumber || '--' }}</span>
          </div>
          <div class="caller-item">
            <span class="label">呼叫时间：</span>
            <span class="value">{{ callerInfo.callTime || '--' }}</span>
          </div>
          <div class="caller-item">
            <span class="label">用户类型：</span>
            <span class="value">{{ callerInfo.userType || '普通' }}</span>
          </div>
          <div class="caller-item">
            <span class="label">名称：</span>
            <span class="value">{{ callerInfo.name || '未知' }}</span>
          </div>
          <div class="caller-item">
            <span class="label">地址：</span>
            <span class="value">{{ callerInfo.address || '未知' }}</span>
          </div>
          <div class="caller-item">
            <span class="label">主叫局向：</span>
            <span class="value">{{ callerInfo.callerDirection || '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部坐席用户信息展示 -->
    <BottomUserInfo ref="bottomUserInfoRef" />

    <!-- CRM关键词选择弹窗 -->
    <KeywordSelectModal
      v-model="showKeywordSelect"
      @confirm="handleKeywordConfirm"
      @cancel="handleKeywordCancel"
    />

    <!-- 通知接收弹窗 - 使用Store状态 -->
    <NoticePopup
      v-model="notificationStore.popupVisible"
      @confirm="handleNoticeConfirm"
      @open-reader="handleOpenNoticeReader"
      @close="handleNoticeClose"
    />

    <!-- 通知阅读器弹窗 - 使用Store状态 -->
    <el-dialog
      v-model="notificationStore.readerVisible"
      title="通知阅读器"
      width="900px"
      :close-on-click-modal="false"
      destroy-on-close
      class="notice-reader-dialog"
    >
      <NoticeReader
        v-model="notificationStore.readerVisible"
        @close="handleNoticeReaderClose"
        @read="handleNoticeRead"
      />
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Phone, CircleCheck, VideoPlay, Document, User, Setting,
  Search, DocumentCopy, Van, PhoneFilled,
  MoreFilled, Fold, Expand,
  QuestionFilled, ChatDotRound, Key, Management, InfoFilled, Collection, OfficeBuilding, DocumentChecked,
  Bell, Link, Connection, Check, Close, RefreshLeft, Cpu,
  UserFilled, Grid, ArrowRight, TrendCharts, SwitchButton
} from '@element-plus/icons-vue'
import CallBar from './components/CallBar/CallBar.vue'

// 通知接收组件
import { NoticePopup, NoticeReader } from './components/Settings/NoticeReceive'
import { useNotificationStore } from './stores/notificationStore'

// 使用通知Store
const notificationStore = useNotificationStore()

// 底部用户信息组件 - 首屏必需
import BottomUserInfo from './components/BottomUserInfo/BottomUserInfo.vue'

// 页面说明组件 - 首屏必需
import { PageInstructionDrawer } from './components/PageInstruction'

// ==================== 异步加载组件（按需加载，优化首屏性能）====================

// 更新说明组件 - 默认首页，首屏预加载
import UpdateNotes from './components/Settings/UpdateNotes/UpdateNotes.vue'

// 功能模块组件 - 异步加载
const NumberSearch = defineAsyncComponent(() => import('./components/NumberSearch/NumberSearch.vue'))
const NonNumberQueryModule = defineAsyncComponent(() => import('./components/Modules/NonNumberQueryModule.vue'))
const CarMoveModule = defineAsyncComponent(() => import('./components/Modules/CarMoveModule.vue'))
const Pbx30Module = defineAsyncComponent(() => import('./components/Modules/Pbx30Module.vue'))

// CRM关键词选择组件 - 异步加载
const KeywordSelectModal = defineAsyncComponent(() => import('./components/CRM/KeywordSelect/KeywordSelectModal.vue'))

// 销售品关键字管理组件 - 异步加载
const KeywordManage = defineAsyncComponent(() => import('./components/CRM/KeywordManage/KeywordManage.vue'))

// 同义关键字管理组件 - 异步加载
const SynonymKeywordManager = defineAsyncComponent(() => import('./components/Settings/SynonymKeyword/SynonymKeywordManager.vue'))

// 销售单元信息管理组件 - 异步加载
const SalesUnitManage = defineAsyncComponent(() => import('./components/CRM/SalesUnitManage/SalesUnitManage.vue'))

// 审核组件 - 异步加载
const KeywordAudit = defineAsyncComponent(() => import('./components/CRM/KeywordManage/KeywordAudit.vue'))
const SalesUnitAudit = defineAsyncComponent(() => import('./components/CRM/SalesUnitManage/SalesUnitAudit.vue'))

// 客户业务审核组件 - 异步加载
const CustomerAudit = defineAsyncComponent(() => import('./components/CRM/CustomerAudit/CustomerAudit.vue'))

// 非号码信息管理组件 - 异步加载
const NonNumberInfoManage = defineAsyncComponent(() => import('./components/Settings/NonNumberInfo/NonNumberInfoManage.vue'))

// 人工话务员接续报表组件 - 异步加载
const OperatorReport = defineAsyncComponent(() => import('./components/Reports/OperatorReport/OperatorReport.vue'))

// 优推商家查询量报表组件 - 异步加载
const MerchantQueryReport = defineAsyncComponent(() => import('./components/Reports/MerchantQueryReport/MerchantQueryReport.vue'))

// 关键词查询量及资源统计报表组件 - 异步加载
const KeywordQueryReport = defineAsyncComponent(() => import('./components/Reports/KeywordQueryReport/KeywordQueryReport.vue'))

// 话务员输入关键词搜索量统计表组件 - 异步加载
const KeywordSearchReport = defineAsyncComponent(() => import('./components/Reports/KeywordSearchReport/KeywordSearchReport.vue'))

// 114推广/百事通加盟商家数据报表组件 - 异步加载
const MerchantDataReport = defineAsyncComponent(() => import('./components/Reports/MerchantDataReport/MerchantDataReport.vue'))

// 商家报号明细数据报表组件 - 异步加载
const MerchantCallReport = defineAsyncComponent(() => import('./components/Reports/MerchantCallReport/MerchantCallReport.vue'))
const ProvinceCallReport = defineAsyncComponent(() => import('./components/Reports/ProvinceCallReport/ProvinceCallReport.vue'))
const NumberTransferReport = defineAsyncComponent(() => import('./components/Reports/NumberTransferReport/NumberTransferReport.vue'))
const OperatorWorkReport = defineAsyncComponent(() => import('./components/Reports/OperatorWorkReport/OperatorWorkReport.vue'))
const OperatorAttendanceReport = defineAsyncComponent(() => import('./components/Reports/OperatorAttendanceReport/OperatorAttendanceReport.vue'))
const OperatorBusyDetailReport = defineAsyncComponent(() => import('./components/Reports/OperatorBusyDetailReport/OperatorBusyDetailReport.vue'))
const NumberQueryDetailReport = defineAsyncComponent(() => import('./components/Reports/NumberQueryDetailReport/NumberQueryDetailReport.vue'))
const UserSatisfactionReport = defineAsyncComponent(() => import('./components/Reports/UserSatisfactionReport/UserSatisfactionReport.vue'))

// 组织架构管理组件 - 异步加载
const OrganizationManage = defineAsyncComponent(() => import('./components/Settings/Organization/OrganizationManage.vue'))

// AI 接话分流管理组件 - 异步加载
const AiDiversionManage = defineAsyncComponent(() => import('./components/Settings/AiDiversion/AiDiversionManage.vue'))

// 客户基本信息组件 - 异步加载
const CustomerInfoList = defineAsyncComponent(() => import('./components/CRM/CustomerInfo/CustomerInfoList.vue'))
const CustomerInfoDetail = defineAsyncComponent(() => import('./components/CRM/CustomerInfo/CustomerInfoDetail.vue'))

// 客户业务迁移组件 - 异步加载
const CustomerBusinessMigration = defineAsyncComponent(() => import('./components/CRM/CustomerBusinessMigration/CustomerBusinessMigration.vue'))

// 当前显示的模块（默认更新说明页面）
const currentModule = ref('updateNotes')

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 更多菜单显示状态
const showMoreMenu = ref(false)

// 运营管理菜单显示状态
const showOperationMenu = ref(false)

// 运营报表菜单显示状态
const showOperationReportMenu = ref(false)

// 门框菜单显示状态
const showDoorFrameMenu = ref(false)

// 客户管理菜单显示状态
const showCustomerManageMenu = ref(false)

// 销售品管理菜单显示状态
const showProductManageMenu = ref(false)

// 智能路由菜单显示状态
const showSmartRoutingMenu = ref(false)

// 弹窗显示状态
const showDemo = ref(false)
const showDocs = ref(false)
const showKeywordSelect = ref(false)

// 客户基本信息模块相关
const customerDetailMode = ref<'view' | 'edit' | 'add'>('view') // 客户详情页模式
const currentCustomerId = ref('') // 当前客户ID

// 来电用户信息（全局固定底部显示）
const callerInfo = ref({
  show: true,
  phoneNumber: '13312341234',
  name: '张三',
  address: '福建省福州市鼓楼区五四路123号',
  status: '通话中',
  duration: '02:35'
})

// 底部用户信息组件引用
const bottomUserInfoRef = ref<InstanceType<typeof BottomUserInfo>>()

// 主内容区底部预留高度（为底部信息栏留出空间）
const bottomInfoHeight = '40px'

// 页面说明配置 - 支持的页面列表
const supportedPageInstructions = [
  'numberSearch', 'nonNumberQuery', 'carMove', 'pbx30',
  'customerInfoList', 'customerInfoDetail', 'customerAudit', 'customerBusinessMigration',
  'keywordManage', 'synonymKeywordManage', 'associateKeywordManage',
  'salesUnitManage', 'keywordAudit', 'salesUnitAudit',
  'keywordSelect', 'nonNumberInfoManage', 'aiDiversion', 'organization',
  'skillManagement', 'routeManagement'
]

// 页面说明标题映射
const pageInstructionTitles: Record<string, string> = {
  numberSearch: '号码本地搜',
  nonNumberQuery: '非号码查询',
  carMove: '挪车登记',
  pbx30: '总机3.0',
  customerInfoList: '客户基础信息',
  customerInfoDetail: '客户详情',
  customerAudit: '客户业务审核',
  customerBusinessMigration: '客户业务迁移',
  keywordManage: '销售品关键字',
  synonymKeywordManage: '同义关键字',
  associateKeywordManage: '联想关键字',
  salesUnitManage: '销售单元信息',
  keywordAudit: '销售品关键字审核',
  salesUnitAudit: '销售单元信息审核',
  keywordSelect: 'CRM关键字（嵌入CRM）',
  nonNumberInfoManage: '非号码信息管理',
  aiDiversion: 'AI接话分流管理',
  organization: '组织架构（复用）',
  operatorReport: '人工话务员接续报表',
  merchantQueryReport: '优推商家查询量报表',
  keywordQueryReport: '关键词查询量及资源统计报表',
  keywordSearchReport: '话务员输入关键词搜索量统计表',
  merchantDataReport: '114推广/百事通加盟商家数据报表',
  merchantCallReport: '商家报号明细数据报表',
  dailyReport: '日报表',
  monthlyReport: '月报表',
  callStatistics: '话务统计',
  businessAnalysis: '业务分析',
  skillManagement: '技能管理',
  routeManagement: '路由管理'
}

// 是否显示页面说明按钮
const showPageInstruction = computed(() => {
  return supportedPageInstructions.includes(currentModule.value)
})

// 当前页面说明配置
const currentPageInstruction = computed(() => {
  const pageId = currentModule.value
  const pageTitle = pageInstructionTitles[pageId] || '未知页面'
  return { pageId, pageTitle }
})

// 切换模块
const switchModule = (module: string) => {
  currentModule.value = module
  showMoreMenu.value = false
  showOperationMenu.value = false
  showDoorFrameMenu.value = false
}

// 切换门框菜单
const toggleDoorFrameMenu = () => {
  showDoorFrameMenu.value = !showDoorFrameMenu.value
  console.log('门框菜单状态:', showDoorFrameMenu.value)
}

// 处理门框菜单项
const handleDoorFrameItem = (item: string) => {
  currentModule.value = item
  // 保持门框菜单展开
}

// 切换运营管理菜单
const toggleOperationMenu = () => {
  showOperationMenu.value = !showOperationMenu.value
  console.log('运营管理菜单状态:', showOperationMenu.value)
}

// 切换客户管理菜单
const toggleCustomerManageMenu = () => {
  showCustomerManageMenu.value = !showCustomerManageMenu.value
  console.log('客户管理菜单状态:', showCustomerManageMenu.value)
}

// 处理客户管理菜单项
const handleCustomerManageItem = (item: string) => {
  console.log('点击客户管理菜单项:', item)
  if (item === 'customerInfoList') {
    currentModule.value = 'customerInfoList'
    // 保持客户管理菜单展开
  } else if (item === 'customerAudit') {
    currentModule.value = 'customerAudit'
    // 保持客户管理菜单展开
  } else if (item === 'customerBusinessMigration') {
    currentModule.value = 'customerBusinessMigration'
    // 保持客户管理菜单展开
  }
}

// 切换销售品管理菜单
const toggleProductManageMenu = () => {
  showProductManageMenu.value = !showProductManageMenu.value
  console.log('销售品管理菜单状态:', showProductManageMenu.value)
}

// 处理销售品管理菜单项
const handleProductManageItem = (item: string) => {
  console.log('点击销售品管理菜单项:', item)
  if (item === 'keywordManage') {
    currentModule.value = 'keywordManage'
    // 保持销售品管理菜单展开
  } else if (item === 'synonymKeywordManage') {
    currentModule.value = 'synonymKeywordManage'
    // 保持销售品管理菜单展开
  } else if (item === 'associateKeywordManage') {
    currentModule.value = 'associateKeywordManage'
    // 保持销售品管理菜单展开
  } else if (item === 'salesUnitManage') {
    currentModule.value = 'salesUnitManage'
    // 保持销售品管理菜单展开
  } else if (item === 'keywordAudit') {
    currentModule.value = 'keywordAudit'
    // 保持销售品管理菜单展开
  } else if (item === 'salesUnitAudit') {
    currentModule.value = 'salesUnitAudit'
    // 保持销售品管理菜单展开
  }
}

// 切换智能路由菜单
const toggleSmartRoutingMenu = () => {
  showSmartRoutingMenu.value = !showSmartRoutingMenu.value
  console.log('智能路由菜单状态:', showSmartRoutingMenu.value)
}

// 处理智能路由菜单项
const handleSmartRoutingItem = (item: string) => {
  console.log('点击智能路由菜单项:', item)
  if (item === 'skillManagement') {
    currentModule.value = 'skillManagement'
    // 保持智能路由菜单展开
  } else if (item === 'routeManagement') {
    currentModule.value = 'routeManagement'
    // 保持智能路由菜单展开
  }
}

// 处理运营管理菜单项
const handleOperationItem = (item: string) => {
  console.log('点击运营管理菜单项:', item)
  if (item === 'customerInfoList') {
    currentModule.value = 'customerInfoList'
    // 保持运营管理菜单展开
  } else if (item === 'keywordSelect') {
    showKeywordSelect.value = true
  } else if (item === 'keywordManage') {
    currentModule.value = 'keywordManage'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'salesUnitManage') {
    currentModule.value = 'salesUnitManage'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'keywordAudit') {
    currentModule.value = 'keywordAudit'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'salesUnitAudit') {
    currentModule.value = 'salesUnitAudit'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'customerAudit') {
    currentModule.value = 'customerAudit'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'nonNumberInfoManage') {
    currentModule.value = 'nonNumberInfoManage'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'synonymKeywordManage') {
    currentModule.value = 'synonymKeywordManage'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'associateKeywordManage') {
    currentModule.value = 'associateKeywordManage'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'organization') {
    currentModule.value = 'organization'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  } else if (item === 'aiDiversion') {
    currentModule.value = 'aiDiversion'
    // 保持运营管理菜单展开，不设置 showOperationMenu.value = false
  }
}

// 切换运营报表菜单
const toggleOperationReportMenu = () => {
  showOperationReportMenu.value = !showOperationReportMenu.value
}

// 处理运营报表菜单项
const handleOperationReportItem = (item: string) => {
  console.log('点击运营报表菜单项:', item)
  if (item === 'operatorReport') {
    currentModule.value = 'operatorReport'
    // 保持运营报表菜单展开
  } else if (item === 'merchantQueryReport') {
    currentModule.value = 'merchantQueryReport'
    // 保持运营报表菜单展开
  } else if (item === 'keywordQueryReport') {
    currentModule.value = 'keywordQueryReport'
    // 保持运营报表菜单展开
  } else if (item === 'keywordSearchReport') {
    currentModule.value = 'keywordSearchReport'
    // 保持运营报表菜单展开
  } else if (item === 'merchantDataReport') {
    currentModule.value = 'merchantDataReport'
    // 保持运营报表菜单展开
  } else if (item === 'merchantCallReport') {
    currentModule.value = 'merchantCallReport'
    // 保持运营报表菜单展开
  } else if (item === 'provinceCallReport') {
    currentModule.value = 'provinceCallReport'
    // 保持运营报表菜单展开
  } else if (item === 'numberTransferReport') {
    currentModule.value = 'numberTransferReport'
    // 保持运营报表菜单展开
  } else if (item === 'operatorWorkReport') {
    currentModule.value = 'operatorWorkReport'
    // 保持运营报表菜单展开
  } else if (item === 'operatorAttendanceReport') {
    currentModule.value = 'operatorAttendanceReport'
    // 保持运营报表菜单展开
  } else if (item === 'operatorBusyDetailReport') {
    currentModule.value = 'operatorBusyDetailReport'
    // 保持运营报表菜单展开
  } else if (item === 'numberQueryDetailReport') {
    currentModule.value = 'numberQueryDetailReport'
    // 保持运营报表菜单展开
  } else if (item === 'userSatisfactionReport') {
    currentModule.value = 'userSatisfactionReport'
    // 保持运营报表菜单展开
  }
}

// 处理更多菜单项
const handleMoreItem = (item: string) => {
  showMoreMenu.value = false
  if (item === 'updateNotes') {
    currentModule.value = 'updateNotes'
  }
}

// 处理关键词选择确认
const handleKeywordConfirm = (selectedItems: any[]) => {
  ElMessage.success(`已选择 ${selectedItems.length} 个关键词`)
  console.log('选择的关键词:', selectedItems)
}

// 处理关键词选择取消
const handleKeywordCancel = () => {
  console.log('取消关键词选择')
}

// ==================== 客户基本信息模块事件处理 ====================

/**
 * 新增客户
 */
const handleCustomerAdd = () => {
  customerDetailMode.value = 'add'
  currentCustomerId.value = ''
  currentModule.value = 'customerInfoDetail'
}

/**
 * 查看客户
 */
const handleCustomerView = (customerId: string) => {
  customerDetailMode.value = 'view'
  currentCustomerId.value = customerId
  currentModule.value = 'customerInfoDetail'
}

/**
 * 编辑客户
 */
const handleCustomerEdit = (customerId: string) => {
  customerDetailMode.value = 'edit'
  currentCustomerId.value = customerId
  currentModule.value = 'customerInfoDetail'
}

/**
 * 返回客户列表
 */
const handleBackToCustomerList = () => {
  currentModule.value = 'customerInfoList'
  customerDetailMode.value = 'view'
  currentCustomerId.value = ''
}

/**
 * 切换为客户编辑模式
 */
const handleSwitchToCustomerEdit = (customerId: string) => {
  customerDetailMode.value = 'edit'
  currentCustomerId.value = customerId
}

/**
 * 客户保存成功
 */
const handleCustomerSaveSuccess = () => {
  currentModule.value = 'customerInfoList'
  customerDetailMode.value = 'view'
  currentCustomerId.value = ''
}

// 处理通知确认 - 标记为已读并关闭弹窗
const handleNoticeConfirm = async () => {
  console.log('通知弹窗确认')
  // 标记最新通知为已读
  if (notificationStore.latestNotice) {
    await notificationStore.markAsRead(notificationStore.latestNotice.id)
  }
  notificationStore.closePopup()
}

// 处理打开通知阅读器
const handleOpenNoticeReader = () => {
  notificationStore.closePopup()
  notificationStore.showReader()
  console.log('打开通知阅读器')
}

// 处理通知弹窗关闭
const handleNoticeClose = () => {
  notificationStore.closePopup()
  console.log('通知弹窗关闭')
}

// 处理通知阅读器关闭
const handleNoticeReaderClose = () => {
  notificationStore.closeReader()
  console.log('通知阅读器关闭')
  // 检查是否还有未读通知
  notificationStore.checkAndShowPopup()
}

// 处理通知已读
const handleNoticeRead = (noticeId: string) => {
  console.log('通知已读:', noticeId)
  notificationStore.markAsRead(noticeId)
}

// 组件挂载时初始化Store
onMounted(() => {
  // 初始化通知Store
  notificationStore.initStore()

  // 每30秒检查一次新通知
  setInterval(() => {
    notificationStore.checkAndShowPopup()
  }, 30000)
})
</script>

<style scoped lang="scss">
$primary-color: #1890ff;
$success-color: #52c41a;
$bg-light: #f0f2f5;
$text-primary: #303133;
$text-secondary: #606266;
$sidebar-bg: #1a1a2e;
$sidebar-active: #00a8ff;

.call-center-app {
  min-height: 100vh;
  background-color: $bg-light;
}

// 顶部话务条 - 固定在顶部，铺满红色框区域（从菜单右侧到页面右边）
.call-bar-wrapper {
  position: fixed;
  top: 0;
  left: 200px; // 从功能菜单右侧开始
  right: 0;
  z-index: 1000;
  // 移除任何阴影效果，保持平面样式
}

// 当侧边栏折叠时，话务条左移
.call-center-app.sidebar-collapsed .call-bar-wrapper {
  left: 64px;
}

// 页面布局
.page-layout {
  display: flex;
  padding-top: 48px; // 话务条高度（从56px改为48px）
  min-height: 100vh;
}

// 左侧导航栏 - 上移到顶部，与话务条并排
.left-sidebar {
  position: fixed;
  left: 0;
  top: 0; // 上移到顶部
  bottom: 0;
  width: 220px;
  background: $sidebar-bg;
  transition: width 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;

  &.is-collapsed {
    width: 64px;

    .nav-item {
      justify-content: center;
      padding: 0;

      .nav-tooltip {
        display: none;
      }
    }
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .toggle-btn {
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: $sidebar-active;
    }
  }

  .sidebar-title {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  &.active {
    background: rgba(0, 168, 255, 0.15);
    color: $sidebar-active;
    border-left-color: $sidebar-active;
  }

  .el-icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  span {
    font-size: 13px;
    white-space: nowrap;
  }

  &.more-item {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 12px;
  }
}

// 更多菜单
.more-menu {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 0;

  .more-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px 10px 48px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

// 运营管理子菜单
.sub-menu {
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 0;

  .sub-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px 8px 56px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    border-left: 3px solid transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }

    &.active {
      color: $sidebar-active;
      background: rgba(0, 168, 255, 0.15);
      border-left-color: $sidebar-active;
    }

    .el-icon {
      font-size: 14px;

      &.arrow-icon {
        margin-left: auto;
        font-size: 12px;
        transition: transform 0.3s ease;

        &.is-expand {
          transform: rotate(90deg);
        }
      }
    }
  }

  // 二级子菜单
  &.level-2 {
    background: rgba(0, 0, 0, 0.3);
    padding: 4px 0;

    .sub-menu-item {
      padding: 8px 16px 8px 76px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .el-icon {
        font-size: 13px;
      }
    }
  }
}

// 运营报表占位样式
.report-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background: #fff;
  border-radius: 8px;

  p {
    margin-top: 16px;
    color: #909399;
    font-size: 14px;
  }
}

// 欢迎面板
.welcome-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-content {
  h4 {
    color: $text-primary;
    margin-bottom: 12px;
  }

  ol, ul {
    padding-left: 20px;
    color: $text-secondary;
    line-height: 1.8;
  }

  li {
    margin-bottom: 6px;
  }
}

// 号码本地搜容器
.number-search-wrapper {
  height: calc(100vh - 56px);
  margin: -20px;
  overflow: hidden;
}

// 来电用户信息面板 - 全局固定底部（在底部用户信息栏上方）
.caller-info-panel {
  position: fixed;
  bottom: 40px; // 为底部用户信息栏预留40px空间
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  padding: 8px 16px; // 与底部用户信息栏保持一致的padding
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;

  .caller-header {
    display: none; // 隐藏标题，与底部用户信息栏保持一致的简洁风格
  }

  .caller-content {
    max-width: 1400px; // 与底部用户信息栏保持一致的宽度
    margin: 0 auto; // 居中对齐

    .caller-row {
      display: flex;
      align-items: center;
      justify-content: center; // 居中对齐，与底部用户信息栏一致
      gap: 24px; // 与底部用户信息栏保持一致的间距
      flex-wrap: wrap; // 允许换行
    }

    .caller-item {
      display: flex;
      align-items: center;
      white-space: nowrap;

      .label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 13px; // 与底部用户信息栏保持一致的字体大小
        margin-right: 4px;
      }

      .value {
        color: #fff;
        font-size: 13px; // 与底部用户信息栏保持一致的字体大小
        font-weight: 500;

        &.duration {
          color: #ffd700;
          font-family: 'Courier New', monospace;
        }
      }
    }
  }
}

// 调整主内容区域高度，为底部来电用户面板和底部用户信息栏留出空间
.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 12px 16px; // 减小padding
  transition: margin-left 0.3s ease;
  height: calc(100vh - 48px - 52px - 40px); // 减去话务条高度48px、来电用户面板约52px和底部信息栏40px
  overflow-y: auto; // 允许内容区域滚动
  position: relative; // 为页面说明按钮提供定位上下文

  &.sidebar-collapsed {
    margin-left: 64px;
  }

  // 页面说明按钮容器 - 固定右上角
  .page-instruction-container {
    position: absolute;
    top: 12px;
    right: 16px;
    z-index: 100;
  }
}

// 号码本地搜容器调整
.number-search-wrapper {
  height: calc(100vh - 48px - 52px - 40px); // 减去话务条、来电用户面板和底部信息栏高度
  margin: -12px -16px; // 调整负margin
  overflow: hidden;
}

// 通知阅读器弹窗样式
.notice-reader-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    height: 600px;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .left-sidebar {
    width: 64px;

    .sidebar-title,
    .nav-item span {
      display: none;
    }
  }

  .main-content {
    margin-left: 64px;
  }
}

// 智能路由设置模块样式
.smart-routing-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;

  .smart-routing-card {
    width: 100%;
    max-width: 800px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
    }

    .smart-routing-content {
      padding: 40px 20px;
      text-align: center;

      p {
        margin-top: 16px;
        color: #909399;
        font-size: 14px;
      }

      // 复用内容样式
      .reuse-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;

        .reuse-icon {
          margin-bottom: 32px;
        }

        .reuse-text {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;

          .reuse-description {
            color: #909399;
            font-size: 14px;
            margin: 0;
          }

          .reuse-system {
            color: #303133;
            font-size: 16px;
            font-weight: 500;
            margin: 0;
          }

          .reuse-tip {
            color: #909399;
            font-size: 14px;
            margin: 0;
          }
        }
      }
    }
  }
}

</style>