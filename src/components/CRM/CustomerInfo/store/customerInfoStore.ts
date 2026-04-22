/**
 * 客户基础信息模块 - Pinia Store
 * 管理客户全局数据、权限信息，保障跨页面数据一致性
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  CustomerInfo,
  CustomerListQueryParams,
  City,
  District
} from '../types/customerInfo'
import {
  getCityList,
  getDistrictListByCity,
  getCustomerList,
  deleteCustomer
} from '../mock/customerInfoMock'

export const useCustomerInfoStore = defineStore('customerInfo', () => {
  // ==================== State ====================

  /** 客户列表数据 */
  const customerList = ref<CustomerInfo[]>([])

  /** 列表总条数 */
  const total = ref(0)

  /** 当前页码 */
  const currentPage = ref(1)

  /** 每页条数 */
  const pageSize = ref(10)

  /** 地市列表 */
  const cityList = ref<City[]>([])

  /** 区县列表（根据选择的地市动态加载） */
  const districtList = ref<District[]>([])

  /** 查询参数缓存 */
  const queryParams = ref<CustomerListQueryParams>({
    pageNum: 1,
    pageSize: 10
  })

  /** 加载状态 */
  const loading = ref(false)

  // ==================== Getters ====================

  /**
   * 是否有客户数据
   */
  const hasCustomerData = computed(() => customerList.value.length > 0)

  /**
   * 地市选项（用于下拉选择）
   */
  const cityOptions = computed(() => {
    return cityList.value.map(city => ({
      label: city.name,
      value: city.name
    }))
  })

  /**
   * 区县选项（用于下拉选择）
   */
  const districtOptions = computed(() => {
    return districtList.value.map(district => ({
      label: district.name,
      value: district.name
    }))
  })

  // ==================== Actions ====================

  /**
   * 加载地市列表
   */
  const loadCityList = async () => {
    try {
      const res = await getCityList()
      if (res.success) {
        cityList.value = res.data
      }
      return res
    } catch (error) {
      console.error('加载地市列表失败:', error)
      throw error
    }
  }

  /**
   * 根据地市编码加载区县列表
   * @param cityCode 地市编码
   */
  const loadDistrictList = async (cityCode: string) => {
    if (!cityCode) {
      districtList.value = []
      return
    }
    try {
      const res = await getDistrictListByCity(cityCode)
      if (res.success) {
        districtList.value = res.data
      }
      return res
    } catch (error) {
      console.error('加载区县列表失败:', error)
      throw error
    }
  }

  /**
   * 加载客户列表
   * @param params 查询参数
   */
  const loadCustomerList = async (params: CustomerListQueryParams) => {
    loading.value = true
    try {
      // 缓存查询参数
      queryParams.value = { ...params }

      const res = await getCustomerList(params)
      if (res.success) {
        customerList.value = res.data.list
        total.value = res.data.total
        currentPage.value = res.data.pageNum
        pageSize.value = res.data.pageSize
      }
      return res
    } catch (error) {
      console.error('加载客户列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新当前列表
   */
  const refreshCustomerList = async () => {
    await loadCustomerList(queryParams.value)
  }

  /**
   * 删除客户
   * @param customerId 客户ID
   */
  const removeCustomer = async (customerId: string) => {
    loading.value = true
    try {
      const res = await deleteCustomer(customerId)
      if (res.success) {
        // 刷新列表
        await refreshCustomerList()
      }
      return res
    } catch (error) {
      console.error('删除客户失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置查询参数
   */
  const resetQueryParams = () => {
    queryParams.value = {
      pageNum: 1,
      pageSize: 10
    }
  }

  // ==================== 初始化 ====================

  /**
   * 初始化加载基础数据
   */
  const init = async () => {
    await loadCityList()
  }

  return {
    // State
    customerList,
    total,
    currentPage,
    pageSize,
    cityList,
    districtList,
    queryParams,
    loading,

    // Getters
    hasCustomerData,
    cityOptions,
    districtOptions,

    // Actions
    loadCityList,
    loadDistrictList,
    loadCustomerList,
    refreshCustomerList,
    removeCustomer,
    resetQueryParams,
    init
  }
})
