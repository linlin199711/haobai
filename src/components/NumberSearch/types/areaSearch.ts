/**
 * 号码本地搜 - 地区搜索类型定义
 * @description 地区搜索模块所有类型定义
 * @version 1.0.0
 */

/** 搜索模式 */
export type SearchMode = 'number' | 'area'

/** 地区类型 */
export type AreaType = 'city' | 'district'

/** 地市信息 */
export interface CityInfo {
  id: string
  code: string
  name: string
  pinyin: string
  pinyinInitial: string // 拼音首字母
  zipCode: string // 邮编
  areaCode: string // 区号
  districts: DistrictInfo[]
}

/** 区县信息 */
export interface DistrictInfo {
  id: string
  code: string
  name: string
  pinyin: string
  pinyinInitial: string // 拼音首字母
  zipCode: string // 区县邮编
  cityCode: string // 所属地市编码
  cityName: string // 所属地市名称
  cityZipCode: string // 地市邮编
  cityAreaCode: string // 地市区号
}

/** 地区搜索结果 */
export interface AreaSearchResult {
  id: string
  type: AreaType
  city?: CityInfo
  district?: DistrictInfo
}

/** 地区搜索参数 */
export interface AreaSearchParams {
  keyword: string
  type?: AreaType
}

/** 搜索模式配置 */
export interface SearchModeConfig {
  value: SearchMode
  label: string
  placeholder: string
}

/** 地区搜索状态 */
export interface AreaSearchState {
  mode: SearchMode
  keyword: string
  results: AreaSearchResult[]
  loading: boolean
  cache: Map<string, { data: AreaSearchResult[]; timestamp: number }>
}

/** 地区搜索响应 */
export interface AreaSearchResponse {
  list: AreaSearchResult[]
  total: number
}
