/**
 * 操作员示忙详情报表模块
 * 功能：统计操作员的示忙记录，包括示忙开始/结束时间、示忙时长等
 * 业务规则：同一天、同一个操作员的多条示忙记录，自动归集相邻展示
 */

export { default as OperatorBusyDetailReport } from './OperatorBusyDetailReport.vue'
export * from './types/operatorBusyDetailReport'
