/**
 * 客户基础信息模块 - 统一导出入口
 * 
 * 模块结构：
 * - CustomerInfoList.vue: 客户基础信息列表页
 * - store/customerInfoStore.ts: Pinia状态管理
 * - types/customerInfo.ts: TypeScript类型声明
 * - mock/customerInfoMock.ts: Mock数据和API接口
 * 
 * 使用方式：
 * import { CustomerInfoList, useCustomerInfoStore } from './components/CRM/CustomerInfo'
 */

// 导出组件
export { default as CustomerInfoList } from './CustomerInfoList.vue'
export { default as CustomerInfoDetail } from './CustomerInfoDetail.vue'

// 导出Store
export { useCustomerInfoStore } from './store/customerInfoStore'

// 导出类型
export type {
  // 实体类型
  CustomerInfo,
  City,
  District,
  // 查询参数
  CustomerListQueryParams,
  // 响应类型
  PageResult,
  ApiResponse,
  // 组件Props
  CustomerListProps,
  // 事件类型
  CustomerListEmits,
  // 枚举
  ConfidentialityLevel,
  PhoneStatus,
  CustomerStatus
} from './types/customerInfo'

// 导出Mock API（供测试使用）
export {
  // 列表查询
  getCustomerList,
  // 删除
  deleteCustomer,
  // 枚举数据
  getCityList,
  getDistrictListByCity,
  // Mock数据（供开发调试）
  mockCities,
  mockDistricts,
  mockCustomerList
} from './mock/customerInfoMock'
