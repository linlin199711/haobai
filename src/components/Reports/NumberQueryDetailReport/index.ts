/**
 * 号码查询明细报表模块
 * 功能：统计号码查询的详细记录，包括工号、呼入时间、主叫号码、商家名称等
 * 硬约束：
 * 1. 查询方式下拉框固定包含2个选项：查询号码、主叫号码
 * 2. 表格【查询类型】字段固定唯一值：信息查询
 * 3. 表格【播放模式】字段固定唯一值：语音报号
 */

export { default as NumberQueryDetailReport } from './NumberQueryDetailReport.vue'
export * from './types/numberQueryDetailReport'
