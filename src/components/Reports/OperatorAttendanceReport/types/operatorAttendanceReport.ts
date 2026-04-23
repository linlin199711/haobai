/**
 * 操作员考勤统计报表 - 类型定义
 * @description 定义报表数据结构、筛选条件类型
 * @version 1.0.0
 */

/** 话务查询方式 */
export type CallQueryMethod = 'all' | 'manual' | 'auto'

/** 话务查询方式选项 */
export interface CallQueryMethodOption {
  value: CallQueryMethod
  label: string
}

/** 筛选表单数据类型 */
export interface FilterForm {
  /** 时间范围 [开始时间, 结束时间] */
  dateRange: string[]
  /** 话务查询方式 */
  callQueryMethod: CallQueryMethod
  /** 班组 */
  team: string
}

/** 操作员考勤记录数据项 */
export interface OperatorAttendanceItem {
  /** 唯一标识 */
  id: string
  /** 时间（日期） */
  date: string
  /** 工号 */
  employeeId: string
  /** 姓名 */
  employeeName: string
  /** 对应小号码 */
  smallNumber: string
  /** 签入时间 */
  checkInTime: string
  /** 签出时间（未签出时为null） */
  checkOutTime: string | null
  /** 工作时长（秒） */
  workDuration: number | null
}

/** 查询参数类型 */
export interface ReportQueryParams {
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
  /** 话务查询方式 */
  callQueryMethod?: CallQueryMethod
  /** 班组 */
  team?: string
}
