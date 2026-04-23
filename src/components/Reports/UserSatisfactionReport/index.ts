/**
 * 用户满意度报表模块
 * 功能：统计用户满意度评价明细，包括工号、姓名、主叫号、呼叫时间、用户评价等
 * 核心功能：
 * 1. 号码隐私脱敏：手机号中间位数用*号隐藏
 * 2. 评价标签规范化：非常满意、满意、一般、不满意四级评价
 * 3. 多维度筛选：是否实时、时间范围、组合方式、话务查询方式、班组
 */

export { default as UserSatisfactionReport } from './UserSatisfactionReport.vue'
export * from './types/userSatisfactionReport'
