# 呼叫中心话务条组件 (CallBar)

现代化、高易用性的呼叫中心坐席系统话务条组件，基于 Vue3 + TypeScript + Element Plus 开发。

## 功能特性

### 核心功能

1. **状态管理模块**
   - 签入/签出：控制坐席在线状态
   - 示忙/示闲：控制坐席可接听状态
   - 静音/取消静音：通话中控制麦克风
   - 挂断：结束当前通话

2. **核心操作模块**
   - 录音查看：仅示忙状态下可查看
   - 呼叫历史：查看历史通话记录
   - 信息查询：查询用户信息
   - 外呼：主动拨打电话
   - 转接：转接至其他坐席或部门

3. **通话信息展示**
   - 主叫号码、被叫号码
   - 通话时长（实时计时）
   - 用户等级
   - 用户地址
   - 跨地市来电自动标识

4. **权限适配**
   - 支持「坐席不进线权限」
   - 开启后默认示忙，不接入来电排队
   - 权限状态动态获取

## 安装使用

### 基础用法

```vue
<template>
  <CallBar />
</template>

<script setup lang="ts">
import { CallBar } from './components/CallBar'
</script>
```

### 完整示例

```vue
<template>
  <div class="app">
    <CallBar />
    
    <!-- 业务内容区域 -->
    <main class="main-content">
      <!-- 你的业务组件 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { CallBar } from './components/CallBar'
</script>

<style>
.app {
  min-height: 100vh;
}

.main-content {
  padding: 20px;
  padding-top: 84px; /* 为话务条预留空间 */
}
</style>
```

## 组件结构

```
CallBar/
├── CallBar.vue              # 主组件
├── index.ts                 # 入口文件
├── types.ts                 # 类型定义
├── README.md                # 使用说明
├── api/
│   └── mock.ts             # 模拟接口
├── composables/
│   └── useCallBar.ts       # 核心逻辑
└── components/
    ├── TransferDialog.vue  # 转接弹窗
    ├── OutboundDialog.vue  # 外呼弹窗
    └── IncomingCallDialog.vue # 来电弹窗
```

## 接口字段说明

### 坐席信息 (AgentInfo)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| agentId | string | 坐席ID |
| agentName | string | 坐席姓名 |
| agentNo | string | 坐席工号 |
| department | string | 所属部门 |
| city | string | 所属地市 |

### 权限配置 (PermissionConfig)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| noIncomingCall | boolean | 不进线权限 |
| canViewRecording | boolean | 录音查看权限 |
| canOutbound | boolean | 外呼权限 |
| canTransfer | boolean | 转接权限 |

### 通话信息 (CallInfo)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| callerNumber | string | 主叫号码 |
| calleeNumber | string | 被叫号码 |
| duration | number | 通话时长（秒） |
| userLevel | string | 用户等级 |
| userAddress | string | 用户地址 |
| city | string | 来电地市 |
| userName | string | 用户姓名 |
| userId | string | 用户ID |

### 转接目标 (TransferTarget)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 目标ID |
| name | string | 目标名称 |
| type | 'agent' \| 'department' | 目标类型 |
| department | string | 部门名称（仅坐席） |
| status | 'online' \| 'offline' \| 'busy' | 状态（仅坐席） |

## 替换真实接口

当前使用 `api/mock.ts` 提供模拟数据，生产环境请替换为真实接口：

1. 创建新的 API 文件 `api/index.ts`：

```typescript
import type { ApiResponse, AgentInfo, PermissionConfig } from '../types'

// 真实接口调用示例
export const getAgentInfo = async (): Promise<ApiResponse<AgentInfo>> => {
  const response = await fetch('/api/agent/info')
  return response.json()
}

export const getPermissionConfig = async (): Promise<ApiResponse<PermissionConfig>> => {
  const response = await fetch('/api/agent/permissions')
  return response.json()
}

// ... 其他接口
```

2. 修改 `composables/useCallBar.ts` 中的导入：

```typescript
// 将
import * as api from '../api/mock'
// 改为
import * as api from '../api'
```

## 状态流转

```
离线(offline)
  ↓ 签入
在线(online) → 示忙(busy) / 示闲(idle)
  ↓ 来电
响铃中(ringing)
  ↓ 接听
通话中(talking)
  ↓ 挂断
在线(online)
  ↓ 签出
离线(offline)
```

## 样式定制

组件使用 SCSS 变量，可在项目中覆盖：

```scss
// 自定义主题色
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$danger-color: #f5222d;
```

## 浏览器兼容

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 依赖说明

- Vue 3.2+
- Element Plus 2.0+
- TypeScript 4.5+

## 开发注意事项

1. 通话时长使用 `setInterval` 计时，组件卸载时会自动清理
2. 来电弹窗使用 `teleport` 渲染到 body，确保层级正确
3. 最近外呼号码存储在 localStorage，键名为 `callbar_recent_outbound`
4. 跨地市来电自动检测，根据 `callInfo.city` 与 `agentInfo.city` 对比

## 更新日志

### v1.0.0 (2024-01-15)

- 初始版本发布
- 实现核心话务条功能
- 支持状态管理、通话控制、转接外呼
- 支持权限适配、跨地市标识
