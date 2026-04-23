/**
 * 操作员考勤统计报表模块
 * 功能：统计操作员的考勤记录，包括签入签出时间、工作时长等
 * 业务规则：同一天、同一个话务员的多条考勤记录，自动归集相邻展示
 */

export { default as OperatorAttendanceReport } from './OperatorAttendanceReport.vue'
export * from './types/operatorAttendanceReport'
