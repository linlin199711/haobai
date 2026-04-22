/**
 * 客户业务信息审核模块 - 13类销售品表单配置
 * @description 配置13类销售品的表单字段
 * @version 1.0.0
 */

import type { ProductFormConfig, FormFieldConfig } from '../types/customerAudit'
import { ProductTypeEnum } from '../types/customerAudit'

// 查询转接商品表单配置
export const queryTransferConfig: ProductFormConfig = {
  productType: ProductTypeEnum.QUERY_TRANSFER,
  productName: '查询转接',
  fields: [
    {
      key: 'transferNumber1',
      label: '转接号码1',
      type: 'input',
      required: true,
      placeholder: '请输入转接号码1'
    },
    {
      key: 'transferNumber2',
      label: '转接号码2',
      type: 'input',
      required: false,
      placeholder: '请输入转接号码2'
    },
    {
      key: 'transferNumber3',
      label: '转接号码3',
      type: 'input',
      required: false,
      placeholder: '请输入转接号码3'
    },
    {
      key: 'transferTimeStart',
      label: '转接时段开始',
      type: 'time',
      required: true,
      placeholder: '开始时间'
    },
    {
      key: 'transferTimeEnd',
      label: '转接时段结束',
      type: 'time',
      required: true,
      placeholder: '结束时间'
    },
    {
      key: 'showCallerId',
      label: '是否显示主叫',
      type: 'radio',
      required: true,
      options: [
        { value: 'show_customer', label: '显示客户主叫' },
        { value: 'hide', label: '不显示主叫' },
        { value: 'show_114', label: '显示114' }
      ]
    }
  ]
}

// 实名查询商品表单配置
export const realNameQueryConfig: ProductFormConfig = {
  productType: ProductTypeEnum.REAL_NAME_QUERY,
  productName: '实名查询',
  fields: [
    {
      key: 'realName1',
      label: '实名名称1',
      type: 'input',
      required: true,
      placeholder: '请输入实名名称1'
    },
    {
      key: 'realNameCode1',
      label: '实名名称编码1',
      type: 'input',
      required: false,
      placeholder: '请输入实名名称编码1'
    },
    {
      key: 'realName2',
      label: '实名名称2',
      type: 'input',
      required: false,
      placeholder: '请输入实名名称2'
    },
    {
      key: 'realNameCode2',
      label: '实名名称编码2',
      type: 'input',
      required: false,
      placeholder: '请输入实名名称编码2'
    },
    {
      key: 'realName3',
      label: '实名名称3',
      type: 'input',
      required: false,
      placeholder: '请输入实名名称3'
    },
    {
      key: 'realNameCode3',
      label: '实名名称编码3',
      type: 'input',
      required: false,
      placeholder: '请输入实名名称编码3'
    }
  ]
}

// 优先报号表单配置
export const priorityReportConfig: ProductFormConfig = {
  productType: ProductTypeEnum.PRIORITY_REPORT,
  productName: '优先报号',
  fields: [
    {
      key: 'keyword',
      label: '报号关键字',
      type: 'input',
      required: true,
      placeholder: '请输入报号关键字'
    },
    {
      key: 'priority',
      label: '优先级',
      type: 'select',
      required: true,
      options: [
        { value: '1', label: '1级（最高）' },
        { value: '2', label: '2级' },
        { value: '3', label: '3级' },
        { value: '4', label: '4级' },
        { value: '5', label: '5级（最低）' }
      ]
    },
    {
      key: 'reportMode',
      label: '报号模式',
      type: 'radio',
      required: true,
      options: [
        { value: 'single', label: '单条报号' },
        { value: 'multiple', label: '多条报号' }
      ]
    }
  ]
}

// 百事通加盟（A版）表单配置
export const baishitongAConfig: ProductFormConfig = {
  productType: ProductTypeEnum.BAISHITONG_A,
  productName: '百事通加盟（A版）',
  fields: [
    {
      key: 'serviceContent',
      label: '服务内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入服务内容'
    },
    {
      key: 'serviceArea',
      label: '服务区域',
      type: 'input',
      required: true,
      placeholder: '请输入服务区域'
    },
    {
      key: 'contactPerson',
      label: '联系人',
      type: 'input',
      required: true,
      placeholder: '请输入联系人'
    },
    {
      key: 'contactPhone',
      label: '联系电话',
      type: 'input',
      required: true,
      placeholder: '请输入联系电话'
    }
  ]
}

// 百事通加盟（A版）月缴套餐表单配置
export const baishitongAMonthlyConfig: ProductFormConfig = {
  productType: ProductTypeEnum.BAISHITONG_A_MONTHLY,
  productName: '百事通加盟（A版）月缴套餐',
  fields: [
    {
      key: 'serviceContent',
      label: '服务内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入服务内容'
    },
    {
      key: 'serviceArea',
      label: '服务区域',
      type: 'input',
      required: true,
      placeholder: '请输入服务区域'
    },
    {
      key: 'monthlyFee',
      label: '月缴费用',
      type: 'number',
      required: true,
      placeholder: '请输入月缴费用'
    },
    {
      key: 'contactPerson',
      label: '联系人',
      type: 'input',
      required: true,
      placeholder: '请输入联系人'
    },
    {
      key: 'contactPhone',
      label: '联系电话',
      type: 'input',
      required: true,
      placeholder: '请输入联系电话'
    }
  ]
}

// 百事通加盟（B版）表单配置
export const baishitongBConfig: ProductFormConfig = {
  productType: ProductTypeEnum.BAISHITONG_B,
  productName: '百事通加盟（B版）',
  fields: [
    {
      key: 'serviceContent',
      label: '服务内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入服务内容'
    },
    {
      key: 'serviceArea',
      label: '服务区域',
      type: 'input',
      required: true,
      placeholder: '请输入服务区域'
    },
    {
      key: 'businessHours',
      label: '营业时间',
      type: 'input',
      required: false,
      placeholder: '请输入营业时间'
    },
    {
      key: 'contactPerson',
      label: '联系人',
      type: 'input',
      required: true,
      placeholder: '请输入联系人'
    },
    {
      key: 'contactPhone',
      label: '联系电话',
      type: 'input',
      required: true,
      placeholder: '请输入联系电话'
    }
  ]
}

// 百事通加盟（B版）月缴套餐表单配置
export const baishitongBMonthlyConfig: ProductFormConfig = {
  productType: ProductTypeEnum.BAISHITONG_B_MONTHLY,
  productName: '百事通加盟（B版）月缴套餐',
  fields: [
    {
      key: 'serviceContent',
      label: '服务内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入服务内容'
    },
    {
      key: 'serviceArea',
      label: '服务区域',
      type: 'input',
      required: true,
      placeholder: '请输入服务区域'
    },
    {
      key: 'monthlyFee',
      label: '月缴费用',
      type: 'number',
      required: true,
      placeholder: '请输入月缴费用'
    },
    {
      key: 'businessHours',
      label: '营业时间',
      type: 'input',
      required: false,
      placeholder: '请输入营业时间'
    },
    {
      key: 'contactPerson',
      label: '联系人',
      type: 'input',
      required: true,
      placeholder: '请输入联系人'
    },
    {
      key: 'contactPhone',
      label: '联系电话',
      type: 'input',
      required: true,
      placeholder: '请输入联系电话'
    }
  ]
}

// 企业广告表单配置
export const enterpriseAdConfig: ProductFormConfig = {
  productType: ProductTypeEnum.ENTERPRISE_AD,
  productName: '企业广告',
  fields: [
    {
      key: 'adContent',
      label: '广告内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入广告内容'
    },
    {
      key: 'adType',
      label: '广告类型',
      type: 'select',
      required: true,
      options: [
        { value: 'text', label: '文字广告' },
        { value: 'voice', label: '语音广告' }
      ]
    },
    {
      key: 'playMode',
      label: '播放模式',
      type: 'radio',
      required: true,
      options: [
        { value: 'before', label: '报号前播放' },
        { value: 'after', label: '报号后播放' }
      ]
    }
  ]
}

// 网络名片（网百空间）表单配置
export const webCardConfig: ProductFormConfig = {
  productType: ProductTypeEnum.WEB_CARD,
  productName: '网络名片（网百空间）',
  fields: [
    {
      key: 'companyName',
      label: '企业名称',
      type: 'input',
      required: true,
      placeholder: '请输入企业名称'
    },
    {
      key: 'companyProfile',
      label: '企业简介',
      type: 'textarea',
      required: true,
      placeholder: '请输入企业简介'
    },
    {
      key: 'businessScope',
      label: '经营范围',
      type: 'textarea',
      required: true,
      placeholder: '请输入经营范围'
    },
    {
      key: 'websiteUrl',
      label: '网站链接',
      type: 'input',
      required: false,
      placeholder: '请输入网站链接'
    }
  ]
}

// 短信名片表单配置
export const smsCardConfig: ProductFormConfig = {
  productType: ProductTypeEnum.SMS_CARD,
  productName: '短信名片',
  fields: [
    {
      key: 'smsContent',
      label: '短信内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入短信内容'
    },
    {
      key: 'smsType',
      label: '短信类型',
      type: 'select',
      required: true,
      options: [
        { value: 'welcome', label: '欢迎短信' },
        { value: 'promotion', label: '推广短信' },
        { value: 'notification', label: '通知短信' }
      ]
    }
  ]
}

// 企业名片表单配置
export const enterpriseCardConfig: ProductFormConfig = {
  productType: ProductTypeEnum.ENTERPRISE_CARD,
  productName: '企业名片',
  fields: [
    {
      key: 'companyName',
      label: '企业名称',
      type: 'input',
      required: true,
      placeholder: '请输入企业名称'
    },
    {
      key: 'address',
      label: '企业地址',
      type: 'input',
      required: true,
      placeholder: '请输入企业地址'
    },
    {
      key: 'contactPerson',
      label: '联系人',
      type: 'input',
      required: true,
      placeholder: '请输入联系人'
    },
    {
      key: 'contactPhone',
      label: '联系电话',
      type: 'input',
      required: true,
      placeholder: '请输入联系电话'
    },
    {
      key: 'businessScope',
      label: '经营范围',
      type: 'textarea',
      required: false,
      placeholder: '请输入经营范围'
    }
  ]
}

// 呼叫中心表单配置
export const callCenterConfig: ProductFormConfig = {
  productType: ProductTypeEnum.CALL_CENTER,
  productName: '呼叫中心',
  fields: [
    {
      key: 'centerName',
      label: '中心名称',
      type: 'input',
      required: true,
      placeholder: '请输入中心名称'
    },
    {
      key: 'seatCount',
      label: '座席数量',
      type: 'number',
      required: true,
      placeholder: '请输入座席数量'
    },
    {
      key: 'serviceTime',
      label: '服务时间',
      type: 'input',
      required: true,
      placeholder: '请输入服务时间'
    },
    {
      key: 'serviceContent',
      label: '服务内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入服务内容'
    }
  ]
}

// 语音信箱表单配置
export const voiceMailConfig: ProductFormConfig = {
  productType: ProductTypeEnum.VOICE_MAIL,
  productName: '语音信箱',
  fields: [
    {
      key: 'mailboxNumber',
      label: '信箱号码',
      type: 'input',
      required: true,
      placeholder: '请输入信箱号码'
    },
    {
      key: 'greetingMessage',
      label: '问候语',
      type: 'textarea',
      required: false,
      placeholder: '请输入问候语'
    },
    {
      key: 'maxMessages',
      label: '最大留言数',
      type: 'number',
      required: true,
      placeholder: '请输入最大留言数'
    }
  ]
}

// 所有销售品表单配置映射
export const productFormConfigMap: Record<string, ProductFormConfig> = {
  [ProductTypeEnum.QUERY_TRANSFER]: queryTransferConfig,
  [ProductTypeEnum.REAL_NAME_QUERY]: realNameQueryConfig,
  [ProductTypeEnum.PRIORITY_REPORT]: priorityReportConfig,
  [ProductTypeEnum.BAISHITONG_A]: baishitongAConfig,
  [ProductTypeEnum.BAISHITONG_A_MONTHLY]: baishitongAMonthlyConfig,
  [ProductTypeEnum.BAISHITONG_B]: baishitongBConfig,
  [ProductTypeEnum.BAISHITONG_B_MONTHLY]: baishitongBMonthlyConfig,
  [ProductTypeEnum.ENTERPRISE_AD]: enterpriseAdConfig,
  [ProductTypeEnum.WEB_CARD]: webCardConfig,
  [ProductTypeEnum.SMS_CARD]: smsCardConfig,
  [ProductTypeEnum.ENTERPRISE_CARD]: enterpriseCardConfig,
  [ProductTypeEnum.CALL_CENTER]: callCenterConfig,
  [ProductTypeEnum.VOICE_MAIL]: voiceMailConfig
}

// 获取销售品表单配置
export const getProductFormConfig = (productType: ProductTypeEnum): ProductFormConfig | undefined => {
  return productFormConfigMap[productType]
}

// 获取所有销售品列表
export const getAllProductTypes = (): { value: ProductTypeEnum; label: string }[] => {
  return Object.values(ProductTypeEnum).map(type => ({
    value: type,
    label: productFormConfigMap[type]?.productName || type
  }))
}
