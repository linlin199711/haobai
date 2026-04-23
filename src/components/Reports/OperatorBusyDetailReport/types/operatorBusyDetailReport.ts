/**
 * 操作员示忙详情报表 - 类型定义
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

/** 操作员示忙记录数据项 */
export interface OperatorBusyItem {
  /** 唯一标识 */
  id: string
  /** 时间（日期） */
  date: string
  /** 工号 */
  employeeId: string
  /** 姓名 */
  employeeName: string
  /** 示忙开始时间 */
  busyStartTime: string
  /** 示忙结束时间（未结束时为null） */
  busyEndTime: string | null
  /** 示忙时长（秒） */
  busyDuration: number | null
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
