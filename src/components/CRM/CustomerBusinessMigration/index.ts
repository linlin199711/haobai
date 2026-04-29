/**
 * 客户业务迁移模块 - 入口文件
 * 导出组件、类型和Mock服务
 */

// 导出主组件
export { default as CustomerBusinessMigration } from './CustomerBusinessMigration.vue'

// 导出类型定义
export * from './types/customerBusinessMigration'

// 导出Mock服务（开发调试用）
export * from './mock/customerBusinessMigrationMock'
