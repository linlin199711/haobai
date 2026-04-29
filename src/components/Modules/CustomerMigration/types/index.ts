export interface BusinessItem {
  id: string
  name: string
  code: string
}

export interface CustomerInfo {
  id: string
  customerId: string
  customerName: string
  phoneNumber: string
  customerType: string
  region: string
  industry: string
  infoSource: string
  acceptedBusiness: BusinessItem[]
}

export interface FilterForm {
  sourceCustomerName: string
  sourceCustomerId: string
  sourcePhoneNumber: string
  targetCustomerName: string
  targetCustomerId: string
  targetPhoneNumber: string
  region: string
  includeSubRegions: boolean
}

export interface RegionOption {
  value: string
  label: string
  children?: RegionOption[]
}

export type MigrationMode = 'business' | 'businessAndNumber'