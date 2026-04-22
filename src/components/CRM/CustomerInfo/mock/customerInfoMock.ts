/**
 * 客户基础信息模块 - Mock数据和API接口
 * 模拟后端接口数据
 */

import type {
  CustomerInfo,
  CustomerListQueryParams,
  PageResult,
  ApiResponse,
  City,
  District,
  ConfidentialityLevel,
  PhoneStatus
} from '../types/customerInfo'

// ==================== Mock数据 ====================

/** 地市级联数据 */
export const mockCities: City[] = [
  { code: '350100', name: '福州市' },
  { code: '350800', name: '龙岩市' },
  { code: '350200', name: '厦门市' },
  { code: '350300', name: '莆田市' },
  { code: '350400', name: '三明市' },
  { code: '350500', name: '泉州市' },
  { code: '350600', name: '漳州市' },
  { code: '350700', name: '南平市' },
  { code: '350900', name: '宁德市' }
]

/** 区县级联数据 */
export const mockDistricts: District[] = [
  // 福州市
  { code: '350102', name: '鼓楼区', cityCode: '350100' },
  { code: '350103', name: '台江区', cityCode: '350100' },
  { code: '350104', name: '仓山区', cityCode: '350100' },
  { code: '350105', name: '马尾区', cityCode: '350100' },
  { code: '350111', name: '晋安区', cityCode: '350100' },
  { code: '350112', name: '长乐区', cityCode: '350100' },
  { code: '350121', name: '闽侯县', cityCode: '350100' },
  { code: '350122', name: '连江县', cityCode: '350100' },
  { code: '350123', name: '罗源县', cityCode: '350100' },
  { code: '350124', name: '闽清县', cityCode: '350100' },
  { code: '350125', name: '永泰县', cityCode: '350100' },
  { code: '350128', name: '平潭县', cityCode: '350100' },
  { code: '350181', name: '福清市', cityCode: '350100' },
  // 龙岩市
  { code: '350802', name: '新罗区', cityCode: '350800' },
  { code: '350803', name: '永定区', cityCode: '350800' },
  { code: '350821', name: '长汀县', cityCode: '350800' },
  { code: '350823', name: '上杭县', cityCode: '350800' },
  { code: '350824', name: '武平县', cityCode: '350800' },
  { code: '350825', name: '连城县', cityCode: '350800' },
  { code: '350881', name: '漳平市', cityCode: '350800' }
]

/** 模拟客户列表数据 - 20条（包含客户等级和上下级关系） */
let mockCustomerList: CustomerInfo[] = [
  {
    index: 1,
    platformCustomerNo: 'CUST_3151913',
    customerId: '3146068',
    customerName: '福建测试5组',
    phoneNumber: '122333444',
    city: '福州市',
    district: '市辖区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '1级',
    parentCustomerId: '',
    parentCustomerName: ''
  },
  {
    index: 2,
    platformCustomerNo: 'CUST_3151911',
    customerId: '3146066',
    customerName: '▲中国电信福建分公司',
    phoneNumber: '10000',
    city: '福州市',
    district: '鼓楼区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '1级',
    parentCustomerId: '',
    parentCustomerName: ''
  },
  {
    index: 3,
    platformCustomerNo: 'CUST_3151910',
    customerId: '3146065',
    customerName: '▲中国电信福建分公司-二级',
    phoneNumber: '10000',
    city: '福州市',
    district: '台江区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '2级',
    parentCustomerId: '3146066',
    parentCustomerName: '▲中国电信福建分公司'
  },
  {
    index: 4,
    platformCustomerNo: 'FINPESC80D4A7C72',
    customerId: '3146064',
    customerName: '浦城县欣佳利医药商店',
    phoneNumber: '4373636',
    city: '龙岩市',
    district: '新罗区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146063',
    parentCustomerName: '尤溪县万丰服装辅料店'
  },
  {
    index: 5,
    platformCustomerNo: 'FINP3A1D2CDB027D',
    customerId: '3146063',
    customerName: '尤溪县万丰服装辅料店',
    phoneNumber: '6318949',
    city: '龙岩市',
    district: '新罗区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '2级',
    parentCustomerId: '',
    parentCustomerName: ''
  },
  {
    index: 6,
    platformCustomerNo: 'FINP2034D079C28D',
    customerId: '3146062',
    customerName: '尤溪县城关中心幼儿园',
    phoneNumber: '7090275',
    city: '龙岩市',
    district: '新罗区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '4级',
    parentCustomerId: '3146063',
    parentCustomerName: '尤溪县万丰服装辅料店'
  },
  {
    index: 7,
    platformCustomerNo: 'FINPT3888108AEF1',
    customerId: '3146061',
    customerName: '大田县家味来中西餐厅',
    phoneNumber: '3733867',
    city: '龙岩市',
    district: '新罗区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146060',
    parentCustomerName: '大田县悦华日用品商店'
  },
  {
    index: 8,
    platformCustomerNo: 'FINP1196C75432B6',
    customerId: '3146060',
    customerName: '大田县悦华日用品商店',
    phoneNumber: '3053598',
    city: '龙岩市',
    district: '新罗区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '2级',
    parentCustomerId: '',
    parentCustomerName: ''
  },
  {
    index: 9,
    platformCustomerNo: 'FINPAB06E6D68419',
    customerId: '3146059',
    customerName: '大田县茂新餐椅制造公司',
    phoneNumber: '8352444',
    city: '龙岩市',
    district: '市辖区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '4级',
    parentCustomerId: '3146060',
    parentCustomerName: '大田县悦华日用品商店'
  },
  {
    index: 10,
    platformCustomerNo: 'FINP00BF0734B788',
    customerId: '3146058',
    customerName: '大田县自然秀鞋服店',
    phoneNumber: '2802452',
    city: '龙岩市',
    district: '市辖区',
    confidentialityLevel: '是' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146059',
    parentCustomerName: '大田县茂新餐椅制造公司'
  },
  {
    index: 11,
    platformCustomerNo: 'CUST_3151920',
    customerId: '3146075',
    customerName: '福建电信福州分公司',
    phoneNumber: '10001',
    city: '福州市',
    district: '仓山区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '2级',
    parentCustomerId: '3146066',
    parentCustomerName: '▲中国电信福建分公司'
  },
  {
    index: 12,
    platformCustomerNo: 'CUST_3151921',
    customerId: '3146076',
    customerName: '福建电信厦门分公司',
    phoneNumber: '10002',
    city: '厦门市',
    district: '思明区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '2级',
    parentCustomerId: '3146066',
    parentCustomerName: '▲中国电信福建分公司'
  },
  {
    index: 13,
    platformCustomerNo: 'CUST_3151922',
    customerId: '3146077',
    customerName: '福建电信莆田分公司',
    phoneNumber: '10003',
    city: '莆田市',
    district: '城厢区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146076',
    parentCustomerName: '福建电信厦门分公司'
  },
  {
    index: 14,
    platformCustomerNo: 'FINPESC80D4A7C73',
    customerId: '3146078',
    customerName: '福州市鼓楼区百货商店',
    phoneNumber: '8765432',
    city: '福州市',
    district: '鼓楼区',
    confidentialityLevel: '是' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '4级',
    parentCustomerId: '3146075',
    parentCustomerName: '福建电信福州分公司'
  },
  {
    index: 15,
    platformCustomerNo: 'FINP3A1D2CDB028E',
    customerId: '3146079',
    customerName: '厦门市思明区服装店',
    phoneNumber: '2345678',
    city: '厦门市',
    district: '思明区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146076',
    parentCustomerName: '福建电信厦门分公司'
  },
  {
    index: 16,
    platformCustomerNo: 'FINP2034D079C29F',
    customerId: '3146080',
    customerName: '泉州市丰泽区餐饮店',
    phoneNumber: '3456789',
    city: '泉州市',
    district: '丰泽区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '2级',
    parentCustomerId: '',
    parentCustomerName: ''
  },
  {
    index: 17,
    platformCustomerNo: 'FINPT3888108AF02',
    customerId: '3146081',
    customerName: '漳州市芗城区超市',
    phoneNumber: '4567890',
    city: '漳州市',
    district: '芗城区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146080',
    parentCustomerName: '泉州市丰泽区餐饮店'
  },
  {
    index: 18,
    platformCustomerNo: 'FINP1196C75433C7',
    customerId: '3146082',
    customerName: '南平市延平区药店',
    phoneNumber: '5678901',
    city: '南平市',
    district: '延平区',
    confidentialityLevel: '是' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '1级',
    parentCustomerId: '',
    parentCustomerName: ''
  },
  {
    index: 19,
    platformCustomerNo: 'FINPAB06E6D68520',
    customerId: '3146083',
    customerName: '宁德市蕉城区书店',
    phoneNumber: '6789012',
    city: '宁德市',
    district: '蕉城区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '停用' as PhoneStatus,
    customerLevel: '4级',
    parentCustomerId: '3146082',
    parentCustomerName: '南平市延平区药店'
  },
  {
    index: 20,
    platformCustomerNo: 'CUST_3151923',
    customerId: '3146084',
    customerName: '三明市梅列区手机店',
    phoneNumber: '7890123',
    city: '三明市',
    district: '梅列区',
    confidentialityLevel: '否' as ConfidentialityLevel,
    phoneStatus: '使用' as PhoneStatus,
    customerLevel: '3级',
    parentCustomerId: '3146080',
    parentCustomerName: '泉州市丰泽区餐饮店'
  }
]

// ==================== API接口 ====================

/**
 * 获取地市列表
 */
export const getCityList = (): Promise<ApiResponse<City[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: mockCities,
        success: true
      })
    }, 200)
  })
}

/**
 * 根据地市编码获取区县列表
 * @param cityCode 地市编码
 */
export const getDistrictListByCity = (cityCode: string): Promise<ApiResponse<District[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const districts = mockDistricts.filter(d => d.cityCode === cityCode)
      resolve({
        code: 200,
        message: 'success',
        data: districts,
        success: true
      })
    }, 150)
  })
}

/**
 * 获取客户列表（分页）
 * @param params 查询参数
 */
export const getCustomerList = (params: CustomerListQueryParams): Promise<ApiResponse<PageResult<CustomerInfo>>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockCustomerList]

      // 平台客户编号模糊查询
      if (params.platformCustomerNo) {
        filteredList = filteredList.filter(item =>
          item.platformCustomerNo.toLowerCase().includes(params.platformCustomerNo!.toLowerCase())
        )
      }

      // 客户ID模糊查询
      if (params.customerId) {
        filteredList = filteredList.filter(item =>
          item.customerId.includes(params.customerId!)
        )
      }

      // 客户名称模糊查询
      if (params.customerName) {
        filteredList = filteredList.filter(item =>
          item.customerName.includes(params.customerName!)
        )
      }

      // 电话号码模糊查询
      if (params.phoneNumber) {
        filteredList = filteredList.filter(item =>
          item.phoneNumber.includes(params.phoneNumber!)
        )
      }

      // 地区（地市）筛选
      if (params.city) {
        filteredList = filteredList.filter(item => item.city === params.city)
      }

      // 保密性质筛选
      if (params.confidentialityLevel) {
        filteredList = filteredList.filter(item => 
          item.confidentialityLevel === params.confidentialityLevel
        )
      }

      // 电话状态筛选
      if (params.phoneStatus) {
        filteredList = filteredList.filter(item => 
          item.phoneStatus === params.phoneStatus
        )
      }

      // 关联词汇模糊查询
      if (params.keyword) {
        filteredList = filteredList.filter(item =>
          item.customerName.includes(params.keyword!) ||
          item.platformCustomerNo.includes(params.keyword!)
        )
      }

      // 上下级查看：如果开启，连带展示查询结果的上下级客户
      if (params.showHierarchy && filteredList.length > 0) {
        const resultIds = new Set(filteredList.map(item => item.customerId))
        const relatedIds = new Set<string>()
        
        // 收集上下级客户ID
        filteredList.forEach(item => {
          // 查找上级
          if (item.parentCustomerId) {
            relatedIds.add(item.parentCustomerId)
          }
          // 查找下级
          mockCustomerList.forEach(child => {
            if (child.parentCustomerId === item.customerId) {
              relatedIds.add(child.customerId)
            }
          })
        })
        
        // 添加相关的上下级客户到结果中（排除已存在的）
        relatedIds.forEach(id => {
          if (!resultIds.has(id)) {
            const relatedCustomer = mockCustomerList.find(c => c.customerId === id)
            if (relatedCustomer) {
              filteredList.push(relatedCustomer)
            }
          }
        })
      }

      // 分页计算
      const total = filteredList.length
      const startIndex = (params.pageNum - 1) * params.pageSize
      const endIndex = startIndex + params.pageSize
      const pageList = filteredList.slice(startIndex, endIndex)
      const pages = Math.ceil(total / params.pageSize)

      resolve({
        code: 200,
        message: 'success',
        data: {
          list: pageList,
          total,
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          pages
        },
        success: true
      })
    }, 500)
  })
}

/**
 * 删除客户
 * @param customerId 客户ID
 */
export const deleteCustomer = (customerId: string): Promise<ApiResponse<void>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCustomerList.findIndex(c => c.customerId === customerId)
      if (index === -1) {
        reject({
          code: 404,
          message: '客户不存在',
          data: null,
          success: false
        })
        return
      }

      // 删除客户
      mockCustomerList.splice(index, 1)
      
      // 重新计算序号
      mockCustomerList.forEach((item, idx) => {
        item.index = idx + 1
      })

      resolve({
        code: 200,
        message: '删除客户成功',
        data: undefined,
        success: true
      })
    }, 400)
  })
}

// ==================== 导出Mock数据供组件直接使用 ====================

export { mockCustomerList }
