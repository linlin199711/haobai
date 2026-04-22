# 呼叫中心坐席系统 - 话务条 + 号码本地搜

## 技术栈
- Vue3 + TypeScript + Element Plus + SCSS
- 使用 Composition API 编写

## 项目结构

```
d:\ff\号百\HXHJB\HXHJB\
├── src/
│   ├── App.vue                        # 主应用组件（话务条 + 页面切换）
│   ├── main.ts                        # Vue应用入口
│   ├── styles.scss                    # 全局样式
│   ├── vite-env.d.ts                  # Vite类型声明
│   └── components/
│       ├── NumberSearch.vue           # 号码本地搜子页面
│       ├── SmsDialog.vue              # 短信发送弹窗
│       ├── TransferDialog.vue         # 转接弹窗
│       ├── HierarchySidebar.vue       # 上下级号码侧边栏
│       └── JieLiuReport.vue           # 截流播报弹窗
├── index.html                         # HTML入口
├── package.json                       # 项目配置
├── tsconfig.json                      # TypeScript配置
├── tsconfig.node.json                 # Node环境TypeScript配置
├── vite.config.ts                     # Vite配置
└── README.md                          # 组件使用说明
```

## 功能说明

### 一、整体布局

1. **顶部固定话务条区域**
   - 高度固定60px，采用position: fixed定位
   - 包含系统标题、页面切换按钮（话务条/号码本地搜）、状态操作按钮
   - 背景色采用蓝色渐变，符合企业办公系统风格

2. **主体区域**
   - 支持页面切换动画（淡入淡出）
   - 默认展示话务条核心功能页面
   - 点击「号码本地搜」切换到号码搜索子页面

### 二、话务条核心功能

#### 状态管理按钮
- **签入/签出**：控制坐席在线状态
- **示忙/示闲**：控制是否接收来电（需签入后才可操作）
- **静音**：在通话中控制麦克风状态（仅通话中可用）
- **挂断**：结束当前通话（仅通话中可用）

#### 页面切换
- **话务条**：返回话务条核心功能页面
- **号码本地搜**：切换到号码本地搜子页面

### 三、号码本地搜子页面

#### 搜索功能
- **多维度搜索**：支持按名称、地址、号码、业务信息搜索
- **空格通配符**：输入"仓山 人力"可匹配同时包含两个关键词的结果
- **回车搜索**：输入框支持回车键触发搜索
- **分页展示**：支持10/20/50/100条每页

#### 操作按钮
- **拍号**：仅在坐席签入、非通话中、非不进线权限时可用
  - 点击后弹出确认框
  - 确认后同步发送短信
- **短信发送**：打开短信编辑弹窗
  - 支持选择模板
  - 支持自定义编辑
  - 字数统计（限制200字）
- **转接**：打开转接目标选择弹窗
  - 支持按坐席或部门转接
  - 支持搜索筛选
- **上下级号码**：打开侧边栏展示关联号码
  - 上级号码展示
  - 下级号码展示
  - 支持点击卡片查看详情
- **查区号/邮编**：打开地区选择弹窗
  - 支持省市区三级联动
  - 自动填充区号和邮编
- **截流播报**（厦门专属）：打开截流播报弹窗
  - 展示当前排队数、平均等待时长等统计
  - 展示排队详情列表

#### 搜索结果展示
- **字段**：号码、名称、地址、业务信息、地市、状态
- **保密标记**：保密号码显示红色标记
- **停机提示**：停机号码显示红色"停机"标签
- **操作列**：反查、拍号、短信按钮

#### 反查功能
- 点击反查按钮弹出全量信息弹窗
- 展示客户详细信息

### 四、权限适配

1. **坐席不进线权限**
   - 开启后坐席签入默认示忙
   - 部分操作受限（拍号、短信、转接等）
   - 页面有权限提示

2. **状态同步**
   - 话务条状态与号码本地搜实时同步
   - 示忙状态下录音相关操作可用

### 五、Mock接口说明

```typescript
// 搜索接口
interface SearchRequest {
  dimension: 'name' | 'address' | 'phone' | 'business'
  keyword: string
  page: number
  pageSize: number
}

interface SearchResponse {
  success: boolean
  list: SearchResultItem[]
  total: number
}

interface SearchResultItem {
  number: string
  name: string
  address: string
  businessInfo: string
  city: string
  status: '正常' | '停机'
  isSecret: boolean
  customerLevel: string
  openDate: string
  remark: string
}

// 拍号接口
interface PaihaoRequest {
  phoneNumber: string
}

interface PaihaoResponse {
  success: boolean
  message: string
}

// 短信发送接口
interface SmsSendRequest {
  phoneNumber: string
  content: string
}

interface SmsSendResponse {
  success: boolean
  message: string
}

// 转接接口
interface TransferRequest {
  type: 'agent' | 'department'
  target: string
  phoneNumber?: string
}

interface TransferResponse {
  success: boolean
  message: string
}

// 上下级号码接口
interface HierarchyRequest {
  phoneNumber: string
}

interface HierarchyResponse {
  success: boolean
  superiorNumbers: HierarchyItem[]
  subordinateNumbers: HierarchyItem[]
}

interface HierarchyItem {
  number: string
  name: string
  address: string
  isSecret: boolean
}

// 截流播报接口
interface JieliuReportResponse {
  success: boolean
  stats: {
    waitingCount: number
    avgWaitTime: number
    todayConnected: number
    abandonRate: number
  }
  queueList: QueueItem[]
}

interface QueueItem {
  position: number
  phoneNumber: string
  waitTime: number
  customerLevel: string
  businessType: string
  lastArea: string
}

// 权限配置接口
interface PermissionResponse {
  success: boolean
  permissions: {
    noIncomingCall: boolean
  }
}
```

## 安装和运行

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 浏览器兼容性
- Chrome >= 60
- Firefox >= 55
- Safari >= 12
- Edge >= 79

## 注意事项

1. 本项目使用 Element Plus 作为 UI 框架
2. 所有按钮操作都有 loading 状态，避免重复点击
3. 页面切换有淡入淡出动画
4. 弹窗弹出/关闭有平滑动画
5. 搜索结果支持分页展示
6. 响应式布局，支持1920*1080及以上分辨率
7. 适配Chrome/Edge浏览器