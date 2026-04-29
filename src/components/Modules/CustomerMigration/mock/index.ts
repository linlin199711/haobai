import type { CustomerInfo, RegionOption } from '../types'

export const regionOptions: RegionOption[] = [
  {
    value: 'fujian',
    label: '福建省',
    children: [
      { value: 'fuzhou', label: '福州市' },
      { value: 'xiamen', label: '厦门市' },
      { value: 'zhangzhou', label: '漳州市' },
      { value: 'quanzhou', label: '泉州市' },
      { value: 'putian', label: '莆田市' },
      { value: 'nanping', label: '南平市' },
      { value: 'longyan', label: '龙岩市' },
      { value: 'ningde', label: '宁德市' },
      { value: 'sanming', label: '三明市' }
    ]
  }
]

export const businessTypes = {
  elegant: { id: 'elegant', name: '优推业务', code: 'YT' },
  brand: { id: 'brand', name: '品牌广告', code: 'PP' },
  realName: { id: 'realName', name: '实名业务', code: 'SM' },
  transfer: { id: 'transfer', name: '转接业务', code: 'ZJ' },
  card: { id: 'card', name: '名片业务', code: 'MP' },
  sms: { id: 'sms', name: '短信业务', code: 'DX' }
}

export const mockSourceCustomers: CustomerInfo[] = [
  {
    id: 's1',
    customerId: 'CUST2024001',
    customerName: '福州科技有限公司',
    phoneNumber: '0591-88881234',
    customerType: '企业客户',
    region: '福州市',
    industry: '信息技术',
    infoSource: '线上渠道',
    acceptedBusiness: [businessTypes.elegant]
  },
  {
    id: 's2',
    customerId: 'CUST2024002',
    customerName: '厦门贸易集团',
    phoneNumber: '0592-66665678',
    customerType: '企业客户',
    region: '厦门市',
    industry: '贸易',
    infoSource: '线下拓展',
    acceptedBusiness: [businessTypes.elegant, businessTypes.brand, businessTypes.transfer]
  },
  {
    id: 's3',
    customerId: 'CUST2024003',
    customerName: '泉州制造有限公司',
    phoneNumber: '0595-77779012',
    customerType: '企业客户',
    region: '泉州市',
    industry: '制造业',
    infoSource: '老客户推荐',
    acceptedBusiness: [businessTypes.realName, businessTypes.card]
  },
  {
    id: 's4',
    customerId: 'CUST2024004',
    customerName: '漳州服务中心',
    phoneNumber: '0596-55553456',
    customerType: '企业客户',
    region: '漳州市',
    industry: '服务业',
    infoSource: '线上渠道',
    acceptedBusiness: [businessTypes.elegant, businessTypes.sms, businessTypes.transfer]
  },
  {
    id: 's5',
    customerId: 'CUST2024005',
    customerName: '莆田零售连锁',
    phoneNumber: '0594-44447890',
    customerType: '企业客户',
    region: '莆田市',
    industry: '零售业',
    infoSource: '线下拓展',
    acceptedBusiness: [businessTypes.brand, businessTypes.card]
  }
]

export const mockTargetCustomers: CustomerInfo[] = [
  {
    id: 't1',
    customerId: 'CUST2024010',
    customerName: '福建数字科技',
    phoneNumber: '0591-99991111',
    customerType: '企业客户',
    region: '福州市',
    industry: '信息技术',
    infoSource: '线上渠道',
    acceptedBusiness: [businessTypes.elegant]
  },
  {
    id: 't2',
    customerId: 'CUST2024011',
    customerName: '厦门创新集团',
    phoneNumber: '0592-88882222',
    customerType: '企业客户',
    region: '厦门市',
    industry: '科技创新',
    infoSource: '线下拓展',
    acceptedBusiness: [businessTypes.elegant, businessTypes.brand]
  },
  {
    id: 't3',
    customerId: 'CUST2024012',
    customerName: '泉州智造企业',
    phoneNumber: '0595-66663333',
    customerType: '企业客户',
    region: '泉州市',
    industry: '制造业',
    infoSource: '老客户推荐',
    acceptedBusiness: [businessTypes.transfer, businessTypes.card]
  },
  {
    id: 't4',
    customerId: 'CUST2024013',
    customerName: '漳州综合服务',
    phoneNumber: '0596-33334444',
    customerType: '企业客户',
    region: '漳州市',
    industry: '服务业',
    infoSource: '线上渠道',
    acceptedBusiness: [businessTypes.realName]
  },
  {
    id: 't5',
    customerId: 'CUST2024014',
    customerName: '莆田商业集团',
    phoneNumber: '0594-22225555',
    customerType: '企业客户',
    region: '莆田市',
    industry: '商业',
    infoSource: '线下拓展',
    acceptedBusiness: [businessTypes.sms, businessTypes.elegant]
  }
]

export function filterCustomers(
  customers: CustomerInfo[],
  customerName: string,
  customerId: string,
  phoneNumber: string,
  region: string,
  includeSubRegions: boolean
): CustomerInfo[] {
  return customers.filter(customer => {
    if (customerName && !customer.customerName.includes(customerName)) return false
    if (customerId && !customer.customerId.includes(customerId)) return false
    if (phoneNumber && !customer.phoneNumber.includes(phoneNumber)) return false
    if (region) {
      const regionMap: Record<string, string[]> = {
        fujian: ['福州市', '厦门市', '漳州市', '泉州市', '莆田市', '南平市', '龙岩市', '宁德市', '三明市'],
        fuzhou: ['福州市'],
        xiamen: ['厦门市'],
        zhangzhou: ['漳州市'],
        quanzhou: ['泉州市'],
        putian: ['莆田市'],
        nanping: ['南平市'],
        longyan: ['龙岩市'],
        ningde: ['宁德市'],
        sanming: ['三明市']
      }
      const targetRegions = includeSubRegions ? regionMap[region] || [] : [regionMap[region]?.[0]]
      if (targetRegions && !targetRegions.includes(customer.region)) return false
    }
    return true
  })
}

export function mockMigrateBusiness(sourceId: string, targetId: string, mode: 'business' | 'businessAndNumber'): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1
      resolve(success)
    }, 1500)
  })
}