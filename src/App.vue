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
              <el-icon><UserFilled /></el-icon>
              <span>客户管理</span>
              <el-icon class="arrow-icon" :class="{ 'is-expand': showCustomerManageMenu }"><ArrowRight /></el-icon>
            </div>
            <!-- 客户管理二级子菜单 -->
            <div v-if="showCustomerManageMenu" class="sub-menu level-2" @click.stop>
              <div class="sub-menu-item" :class="{ active: currentModule === 'customerInfoList' || currentModule === 'customerInfoDetail' }" @click="handleCustomerManageItem('customerInfoList')">
                <el-icon><User /></el-icon>
                <span>客户基础信息</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'customerAudit' }" @click="handleCustomerManageItem('customerAudit')">
                <el-icon><DocumentChecked /></el-icon>
                <span>客户业务审核</span>
              </div>
            </div>
            <!-- 销售品管理（二级菜单） -->
            <div class="sub-menu-item" :class="{ active: showProductManageMenu }" @click.stop="toggleProductManageMenu">
              <el-icon><Collection /></el-icon>
              <span>销售品管理</span>
              <el-icon class="arrow-icon" :class="{ 'is-expand': showProductManageMenu }"><ArrowRight /></el-icon>
            </div>
            <!-- 销售品管理二级子菜单 -->
            <div v-if="showProductManageMenu" class="sub-menu level-2" @click.stop>
              <div class="sub-menu-item" :class="{ active: currentModule === 'keywordManage' }" @click="handleProductManageItem('keywordManage')">
                <el-icon><Collection /></el-icon>
                <span>销售品关键字管理</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'synonymKeywordManage' }" @click="handleProductManageItem('synonymKeywordManage')">
                <el-icon><Link /></el-icon>
                <span>同义关键字管理</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'associateKeywordManage' }" @click="handleProductManageItem('associateKeywordManage')">
                <el-icon><Connection /></el-icon>
                <span>联想关键字管理</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'salesUnitManage' }" @click="handleProductManageItem('salesUnitManage')">
                <el-icon><OfficeBuilding /></el-icon>
                <span>销售单元信息管理</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'keywordAudit' }" @click="handleProductManageItem('keywordAudit')">
                <el-icon><DocumentChecked /></el-icon>
                <span>销售品关键字审核</span>
              </div>
              <div class="sub-menu-item" :class="{ active: currentModule === 'salesUnitAudit' }" @click="handleProductManageItem('salesUnitAudit')">
                <el-icon><DocumentChecked /></el-icon>
                <span>销售单元信息审核</span>
              </div>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('keywordSelect')">
              <el-icon><Key /></el-icon>
              <span>CRM关键字(嵌入CRM)</span>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('nonNumberInfoManage')">
              <el-icon><Document /></el-icon>
              <span>非号码信息管理</span>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('aiDiversion')">
              <el-icon><Cpu /></el-icon>
              <span>AI 接话分流管理</span>
            </div>
            <div class="sub-menu-item" @click="handleOperationItem('organization')">
              <el-icon><OfficeBuilding /></el-icon>
              <span>组织架构（复用）</span>
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

        <!-- 组织架构模块 -->
        <OrganizationManage v-else-if="currentModule === 'organization'" />

        <!-- AI 接话分流管理模块 -->
        <AiDiversionManage v-else-if="currentModule === 'aiDiversion'" />

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
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Phone, CircleCheck, VideoPlay, Document, User, Setting,
  Search, DocumentCopy, Van, PhoneFilled,
  MoreFilled, Fold, Expand,
  QuestionFilled, ChatDotRound, Key, Management, InfoFilled, Collection, OfficeBuilding, DocumentChecked,
  Bell, Link, Connection, Check, Close, RefreshLeft, Cpu,
  UserFilled, Grid, ArrowRight
} from '@element-plus/icons-vue'
import CallBar from './components/CallBar/CallBar.vue'

// 通知接收组件
import { NoticePopup, NoticeReader } from './components/Settings/NoticeReceive'
import { useNotificationStore } from './stores/notificationStore'

// 使用通知Store
const notificationStore = useNotificationStore()

// 功能模块组件
import NumberSearch from './components/NumberSearch/NumberSearch.vue'
import NonNumberQueryModule from './components/Modules/NonNumberQueryModule.vue'
import CarMoveModule from './components/Modules/CarMoveModule.vue'
import Pbx30Module from './components/Modules/Pbx30Module.vue'

// CRM关键词选择组件
import { KeywordSelectModal } from './components/CRM/KeywordSelect'

// 销售品关键字管理组件
import { KeywordManage } from './components/CRM/KeywordManage'

// 同义关键字管理组件
import { SynonymKeywordManager } from './components/Settings/SynonymKeyword'

// 销售单元信息管理组件
import SalesUnitManage from './components/CRM/SalesUnitManage/SalesUnitManage.vue'

// 审核组件
import KeywordAudit from './components/CRM/KeywordManage/KeywordAudit.vue'
import SalesUnitAudit from './components/CRM/SalesUnitManage/SalesUnitAudit.vue'

// 客户业务审核组件
import CustomerAudit from './components/CRM/CustomerAudit/CustomerAudit.vue'

// 非号码信息管理组件
import NonNumberInfoManage from './components/Settings/NonNumberInfo/NonNumberInfoManage.vue'

// 更新说明组件
import UpdateNotes from './components/Settings/UpdateNotes/UpdateNotes.vue'

// 组织架构管理组件
import OrganizationManage from './components/Settings/Organization/OrganizationManage.vue'

// AI 接话分流管理组件
import AiDiversionManage from './components/Settings/AiDiversion/AiDiversionManage.vue'

// 客户基本信息组件
import { CustomerInfoList, CustomerInfoDetail } from './components/CRM/CustomerInfo'

// 底部用户信息组件
import BottomUserInfo from './components/BottomUserInfo/BottomUserInfo.vue'

// 页面说明组件 - 完全独立，与业务系统无任何关联
import { PageInstructionDrawer } from './components/PageInstruction'

// 当前显示的模块（默认号码本地搜）
const currentModule = ref('numberSearch')

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 更多菜单显示状态
const showMoreMenu = ref(false)

// 运营管理菜单显示状态
const showOperationMenu = ref(false)

// 门框菜单显示状态
const showDoorFrameMenu = ref(false)

// 客户管理菜单显示状态
const showCustomerManageMenu = ref(false)

// 销售品管理菜单显示状态
const showProductManageMenu = ref(false)

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
  'customerInfoList', 'customerInfoDetail', 'customerAudit',
  'keywordManage', 'synonymKeywordManage', 'associateKeywordManage',
  'salesUnitManage', 'keywordAudit', 'salesUnitAudit',
  'keywordSelect', 'nonNumberInfoManage', 'aiDiversion', 'organization'
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
  keywordManage: '销售品关键字管理',
  synonymKeywordManage: '同义关键字管理',
  associateKeywordManage: '联想关键字管理',
  salesUnitManage: '销售单元信息管理',
  keywordAudit: '销售品关键字审核',
  salesUnitAudit: '销售单元信息审核',
  keywordSelect: 'CRM关键字（嵌入CRM）',
  nonNumberInfoManage: '非号码信息管理',
  aiDiversion: 'AI接话分流管理',
  organization: '组织架构（复用）'
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
  width: 200px;
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
    padding: 8px 20px 8px 56px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    border-left: 3px solid transparent;

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
      padding: 8px 20px 8px 76px;
      font-size: 12px;

      .el-icon {
        font-size: 13px;
      }
    }
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
  margin-left: 200px;
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

</style>