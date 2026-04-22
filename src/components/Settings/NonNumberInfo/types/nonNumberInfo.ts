/**
 * 非号码信息管理 - 类型定义
 * @description 非号码信息查询、管理模块所有类型定义
 * @version 1.0.0
 */

/** 审核状态 */
export type AuditStatus = 'approved' | 'pending' | 'rejected'

/** 信息来源 */
export type InfoSource = 'manual' | 'import' | 'sync' | 'third_party'

/** 信息精度 */
export type InfoPrecision = 'high' | 'medium' | 'low'

/** 查询类型 */
export type QueryType = 'bus_route' | 'bus_group' | 'all'

/** 查询模式 */
export type QueryMode = 'exact' | 'fuzzy'

/** 行业类型 */
export type IndustryType = 'transport' | 'medical' | 'education' | 'government' | 'finance' | 'other'

/** 信息类型 */
export type InfoType = 'route' | 'station' | 'schedule' | 'contact' | 'other'

/** 业务类型 */
export type BusinessType = 'bus_route' | 'bus_group'

/** 地区信息 */
export interface RegionInfo {
  province: string
  city: string
  district?: string
  includeSubordinate: boolean
}

/** 非号码信息基础信息 */
export interface NonNumberInfoBase {
  id: string
  infoTitle: string
  auditStatus: AuditStatus
  infoSource: InfoSource
  infoPrecision: InfoPrecision
  queryType: QueryType
  queryMode: QueryMode
  industryType: IndustryType
  infoType: InfoType
  collectTime: string
  validStartTime: string
  validEndTime: string
  region: RegionInfo
  createTime: string
  updateTime: string
  creator: string
  auditor: string
  auditTime?: string
  auditRemark?: string
  businessType: BusinessType
}

/** 公交路线信息 */
export interface BusRouteInfo {
  routeId: string
  routeName: string
  routeNo: string
  startStation: string
  endStation: string
  operatingTime: string
  ticketPrice: string
  stationList: BusStation[]
  routeType: string
  isNightRoute: boolean
  intervalTime: string
  operator: string
  contactPhone: string
  remarks: string
}

/** 公交站点 */
export interface BusStation {
  stationId: string
  stationName: string
  stationOrder: number
  isTransfer: boolean
  transferLines?: string[]
}

/** 公交集团信息 */
export interface BusGroupInfo {
  groupId: string
  groupName: string
  groupCode: string
  address: string
  contactPhone: string
  serviceHotline: string
  complaintHotline: string
  officialWebsite: string
  businessHours: string
  serviceScope: string
  subCompanies: SubCompany[]
  remarks: string
}

/** 子公司信息 */
export interface SubCompany {
  companyId: string
  companyName: string
  address: string
  contactPhone: string
  responsibleArea: string
}

/** 扩展信息 */
export interface ExtendedInfo {
  keywords: string[]
  tags: string[]
  attachmentUrls?: string[]
  relatedInfoIds?: string[]
  extraFields?: Record<string, any>
}

/** 非号码信息完整数据 */
export interface NonNumberInfo extends NonNumberInfoBase {
  busRouteInfo?: BusRouteInfo
  busGroupInfo?: BusGroupInfo
  extendedInfo?: ExtendedInfo
}

/** 查询参数 */
export interface NonNumberInfoQueryParams {
  infoTitle?: string
  auditStatus?: AuditStatus
  infoSource?: InfoSource
  infoPrecision?: InfoPrecision
  queryType?: QueryType
  queryMode?: QueryMode
  industryType?: IndustryType
  infoType?: InfoType
  collectTimeStart?: string
  collectTimeEnd?: string
  validTimeStart?: string
  validTimeEnd?: string
  province?: string
  city?: string
  district?: string
  includeSubordinate?: boolean
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

/** 列表响应数据 */
export interface NonNumberInfoListResponse {
  list: NonNumberInfo[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 审核状态选项 */
export interface AuditStatusOption {
  value: AuditStatus
  label: string
  color: string
}

/** 信息来源选项 */
export interface InfoSourceOption {
  value: InfoSource
  label: string
}

/** 信息精度选项 */
export interface InfoPrecisionOption {
  value: InfoPrecision
  label: string
}

/** 查询类型选项 */
export interface QueryTypeOption {
  value: QueryType
  label: string
}

/** 查询模式选项 */
export interface QueryModeOption {
  value: QueryMode
  label: string
}

/** 行业类型选项 */
export interface IndustryTypeOption {
  value: IndustryType
  label: string
}

/** 信息类型选项 */
export interface InfoTypeOption {
  value: InfoType
  label: string
}
