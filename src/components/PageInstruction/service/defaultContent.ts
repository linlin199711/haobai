/**
 * 默认页面说明内容配置
 * 每个页面强制预置通用默认说明
 */

import type { PageInstruction } from '../types/pageInstruction'

/** 页面默认说明内容映射 */
export const DEFAULT_PAGE_CONTENTS: Record<string, string> = {
  // 门框菜单
  numberSearch: `<h3>【号码本地搜 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>号码本地搜模块提供企业号码、公交线路等非号码信息的快速查询功能。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>支持号码搜索和地区搜索两种模式</li>
  <li>可查询企业号码、公交路线等非号码信息</li>
  <li>支持同义关键字和联想关键字搜索</li>
  <li>搜索结果支持多维度筛选和排序</li>
</ul>
<p><strong>三、使用说明</strong></p>
<ol>
  <li>选择搜索模式（号码搜索/地区搜索）</li>
  <li>输入关键词或选择筛选条件</li>
  <li>点击查询按钮获取结果</li>
  <li>可查看详情或进行相关操作</li>
</ol>`,

  nonNumberQuery: `<h3>【非号码查询 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>非号码查询模块提供天气、公交、快递等公共信息查询服务。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>天气查询：支持全国城市天气预报</li>
  <li>公交查询：公交线路、站点信息</li>
  <li>快递查询：支持主流快递公司</li>
  <li>其他公共服务信息</li>
</ul>`,

  carMove: `<h3>【挪车登记 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>挪车登记模块用于处理车辆挪移请求，快速联系车主。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>登记挪车请求信息</li>
  <li>系统自动通知车主</li>
  <li>记录挪车历史</li>
  <li>支持批量处理</li>
</ul>`,

  pbx30: `<h3>【总机3.0 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>总机3.0模块提供转分机、查询部门号码等企业总机服务。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>转分机：快速转分机号码</li>
  <li>部门查询：查询企业各部门联系方式</li>
  <li>员工查询：查询企业员工信息</li>
</ul>`,

  // 运营管理 - 客户管理
  customerInfoList: `<h3>【客户基础信息 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>客户基础信息管理模块用于维护客户的基本信息档案。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>客户信息查询：支持多条件组合查询</li>
  <li>客户信息维护：新增、编辑、删除客户</li>
  <li>客户业务查看：查看关联业务信息</li>
  <li>批量导入导出</li>
</ul>
<p><strong>三、字段说明</strong></p>
<ul>
  <li>平台客户编号：系统自动生成的唯一标识</li>
  <li>客户ID：内部系统客户标识</li>
  <li>保密性质：是否保密客户</li>
</ul>`,

  customerAudit: `<h3>【客户业务审核 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>客户业务审核模块用于处理客户提交的各类业务申请。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>待审核业务列表</li>
  <li>业务详情查看</li>
  <li>审核通过/驳回操作</li>
  <li>审核历史查询</li>
</ul>
<p><strong>三、业务类型</strong></p>
<ul>
  <li>查询转接业务</li>
  <li>短信名片业务</li>
  <li>实名查询业务</li>
  <li>其他增值业务</li>
</ul>`,

  // 运营管理 - 销售品管理
  keywordManage: `<h3>【销售品关键字管理 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>销售品关键字管理模块用于维护销售品的关键字信息。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>关键字新增、编辑、删除</li>
  <li>关键字分类管理</li>
  <li>关键字状态管理</li>
  <li>批量操作</li>
</ul>`,

  synonymKeywordManage: `<h3>【同义关键字管理 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>同义关键字管理模块用于维护关键字的同义词映射关系。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>同义词组管理</li>
  <li>关键字映射关系维护</li>
  <li>智能联想配置</li>
</ul>`,

  associateKeywordManage: `<h3>【联想关键字管理 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>联想关键字管理模块用于配置搜索时的关键字联想提示。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>联想词库管理</li>
  <li>联想规则配置</li>
  <li>搜索热度统计</li>
</ul>`,

  salesUnitManage: `<h3>【销售单元信息管理 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>销售单元信息管理模块用于维护销售单元的基本信息。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>销售单元新增、编辑</li>
  <li>销售单元状态管理</li>
  <li>关联销售品管理</li>
  <li>有效期管理</li>
</ul>`,

  keywordAudit: `<h3>【销售品关键字审核 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>销售品关键字审核模块用于审核关键字的新增和修改申请。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>待审核关键字列表</li>
  <li>关键字详情查看</li>
  <li>审核通过/驳回</li>
  <li>审核记录查询</li>
</ul>`,

  salesUnitAudit: `<h3>【销售单元信息审核 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>销售单元信息审核模块用于审核销售单元的新增和变更申请。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>待审核销售单元列表</li>
  <li>销售单元详情查看</li>
  <li>审核操作</li>
  <li>批量审核</li>
</ul>`,

  // 其他运营管理菜单
  keywordSelect: `<h3>【CRM关键字（嵌入CRM）- 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>CRM关键字模块提供与CRM系统集成的关键字选择功能。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>关键字搜索选择</li>
  <li>关键字分类浏览</li>
  <li>快速定位关键字</li>
  <li>CRM系统集成</li>
</ul>`,

  nonNumberInfoManage: `<h3>【非号码信息管理 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>非号码信息管理模块用于维护非号码类信息数据。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>非号码信息新增、编辑</li>
  <li>分类管理</li>
  <li>状态管理</li>
  <li>数据导入导出</li>
</ul>`,

  aiDiversion: `<h3>【AI接话分流管理 - 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>AI接话分流管理模块用于配置智能客服的接话和分流规则。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>分流规则配置</li>
  <li>AI话术管理</li>
  <li>转人工规则</li>
  <li>数据统计分析</li>
</ul>`,

  organization: `<h3>【组织架构（复用）- 页面说明】</h3>
<p><strong>一、功能概述</strong></p>
<p>组织架构模块提供企业组织架构的管理和查看功能。</p>
<p><strong>二、主要功能</strong></p>
<ul>
  <li>组织架构树形展示</li>
  <li>部门信息管理</li>
  <li>人员信息管理</li>
  <li>权限配置</li>
</ul>`,

  // 默认内容
  default: `<h3>【页面说明】</h3>
<p>欢迎使用本系统！</p>
<p>本页面暂无详细说明，您可以通过编辑功能添加自定义说明内容。</p>
<p>支持富文本编辑和图片插入。</p>`
}

/**
 * 获取页面默认说明内容
 * @param pageId 页面ID
 * @param pageTitle 页面标题
 */
export const getDefaultPageInstruction = (
  pageId: string,
  pageTitle: string
): PageInstruction => {
  const content = DEFAULT_PAGE_CONTENTS[pageId] || DEFAULT_PAGE_CONTENTS.default

  return {
    pageId,
    pageTitle,
    content,
    updateTime: new Date().toISOString()
  }
}

/**
 * 获取默认内容HTML
 * @param pageId 页面ID
 */
export const getDefaultContent = (pageId: string): string => {
  return DEFAULT_PAGE_CONTENTS[pageId] || DEFAULT_PAGE_CONTENTS.default
}
