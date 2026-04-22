/**
 * 总机3.0模块 - 主组件
 * @description 呼叫中心总机3.0 - 公司/科室/员工三级结构
 * @version 4.0.0
 */

<template>
  <div class="pbx30-module">
    <!-- 统一搜索栏（所有层级都显示） -->
    <div class="search-section">
      <FilterPanel
        :filters="filterConfig"
        :loading="loading"
        @search="handleFilterSearch"
        @reset="handleFilterReset"
      />
    </div>

    <!-- 公司信息卡片（当根据来电号码匹配到公司时显示） -->
    <div v-if="matchedCompany" class="company-info-card">
      <div class="company-header">
        <h3 class="company-name">{{ matchedCompany.name }}</h3>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="enterDepartmentList">
            <el-icon><View /></el-icon> 查看二级信息
          </el-button>
          <el-tag type="success" effect="dark">当前来电</el-tag>
        </div>
      </div>
      <div class="company-details">
        <div class="detail-item">
          <span class="label">公司地址：</span>
          <span class="value">{{ matchedCompany.address }}</span>
        </div>
        <div class="detail-item">
          <span class="label">总机号码：</span>
          <span class="value">{{ matchedCompany.phone }}</span>
        </div>
      </div>
    </div>

    <!-- 未匹配到公司时显示提示 -->
    <div v-else-if="!loading && currentLevel === 'company'" class="no-match-tip">
      <el-empty description="无法根据来电号码匹配到公司">
        <template #default>
          <p>当前来电号码：{{ incomingPhoneNumber }}</p>
          <p>请检查号码配置或手动选择公司</p>
        </template>
      </el-empty>
    </div>

    <!-- 第一层：一级信息（公司列表） -->
    <div v-if="currentLevel === 'company' && !matchedCompany" class="level-section">
      <div class="section-header">
        <h3 class="section-title">一级信息</h3>
      </div>
      
      <el-table
        :data="companyList"
        v-loading="loading"
        stripe
        highlight-current-row
        @row-click="handleCompanyClick"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="公司名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="address" label="公司地址" min-width="300" show-overflow-tooltip />
        <el-table-column prop="phone" label="公司电话" width="150" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="operation-btns">
              <el-button type="primary" link size="small" @click.stop="handleCompanyClick(row)">
                <el-icon><View /></el-icon> 查看科室
              </el-button>
              <el-button type="success" link size="small" @click.stop="handleCompanyVoiceReport(row)">
                <el-icon><Microphone /></el-icon> 语音报号
              </el-button>
              <el-button type="warning" link size="small" @click.stop="handleCompanySmsReport(row)">
                <el-icon><Message /></el-icon> 短信报号
              </el-button>
              <el-button type="danger" link size="small" @click.stop="handleCompanyTransfer(row)">
                <el-icon><Phone /></el-icon> 电话转接
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          共 {{ companyPagination.total }} 条记录 第 {{ companyPagination.page }}/{{ companyPagination.totalPages }} 页
        </div>
        <div class="pagination-controls">
          <el-button :disabled="companyPagination.page <= 1" @click="handleCompanyPrevPage">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button
            v-for="page in displayedCompanyPages"
            :key="page"
            :type="page === companyPagination.page ? 'primary' : 'default'"
            @click="handleCompanyPageClick(page)"
          >
            {{ page }}
          </el-button>
          <el-button :disabled="companyPagination.page >= companyPagination.totalPages" @click="handleCompanyNextPage">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-select v-model="companyPagination.pageSize" class="page-size-select" @change="handleCompanyPageSizeChange">
            <el-option label="10条/页" :value="10" />
            <el-option label="20条/页" :value="20" />
          </el-select>
          <span class="jump-text">跳至</span>
          <el-input v-model="companyJumpPage" class="jump-input" @keyup.enter="handleCompanyJump" />
          <span class="jump-text">页</span>
          <el-button type="primary" @click="handleCompanyJump">跳转</el-button>
        </div>
      </div>
    </div>

    <!-- 第二层：二级信息（科室列表） -->
    <div v-else-if="currentLevel === 'department'" class="level-section">
      <div class="section-header">
        <div class="header-left">
          <el-button type="default" @click="backToCompany">
            <el-icon><ArrowLeft /></el-icon> 返回一级信息
          </el-button>
          <h3 class="section-title">{{ currentCompany?.name }} - 二级信息</h3>
        </div>
      </div>

      <!-- 科室列表 -->
      <el-table
        :data="departmentList"
        v-loading="loading"
        stripe
        highlight-current-row
        @current-change="handleDepartmentSelect"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="科室名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="extension" label="分机号" width="100" />
        <el-table-column prop="location" label="位置" min-width="200" show-overflow-tooltip />
        <el-table-column prop="staffCount" label="员工数" width="100" align="center" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="operation-btns">
              <el-button
                type="primary"
                link
                size="small"
                :disabled="!selectedDepartment || selectedDepartment.id !== row.id || !isInCall"
                :loading="loadingVoice"
                @click="handleDeptVoiceReport(row)"
              >
                语音报号
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                :disabled="!selectedDepartment || selectedDepartment.id !== row.id || !isInCall"
                :loading="loadingSms"
                @click="handleDeptSmsReport(row)"
              >
                短信报号
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                :disabled="!selectedDepartment || selectedDepartment.id !== row.id || !isInCall"
                :loading="loadingTransfer"
                @click="handleDeptTransfer(row)"
              >
                电话转接
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                @click.stop="handleDepartmentClick(row)"
              >
                查看员工
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          共 {{ deptPagination.total }} 条记录 第 {{ deptPagination.page }}/{{ deptPagination.totalPages }} 页
        </div>
        <div class="pagination-controls">
          <el-button :disabled="deptPagination.page <= 1" @click="handleDeptPrevPage">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button
            v-for="page in displayedDeptPages"
            :key="page"
            :type="page === deptPagination.page ? 'primary' : 'default'"
            @click="handleDeptPageClick(page)"
          >
            {{ page }}
          </el-button>
          <el-button :disabled="deptPagination.page >= deptPagination.totalPages" @click="handleDeptNextPage">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-select v-model="deptPagination.pageSize" class="page-size-select" @change="handleDeptPageSizeChange">
            <el-option label="10条/页" :value="10" />
            <el-option label="20条/页" :value="20" />
          </el-select>
          <span class="jump-text">跳至</span>
          <el-input v-model="deptJumpPage" class="jump-input" @keyup.enter="handleDeptJump" />
          <span class="jump-text">页</span>
          <el-button type="primary" @click="handleDeptJump">跳转</el-button>
        </div>
      </div>
    </div>

    <!-- 第三层：三级信息（员工详情） -->
    <div v-else-if="currentLevel === 'detail'" class="level-section">
      <div class="section-header">
        <div class="header-left">
          <el-button type="default" @click="backToDepartment">
            <el-icon><ArrowLeft /></el-icon> 返回二级信息
          </el-button>
          <h3 class="section-title">{{ currentDepartment?.name }} - 三级信息</h3>
        </div>
      </div>

      <!-- 员工/设备列表 -->
      <el-table
        :data="staffList"
        v-loading="loading"
        stripe
        highlight-current-row
        @current-change="handleStaffSelect"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="extension" label="分机号" width="100" />
        <el-table-column prop="department" label="部门" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="operation-btns">
              <el-button
                type="primary"
                link
                size="small"
                :disabled="!selectedStaff || selectedStaff.id !== row.id || !isInCall"
                :loading="loadingVoice"
                @click="handleVoiceReport(row)"
              >
                语音报号
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                :disabled="!selectedStaff || selectedStaff.id !== row.id || !isInCall"
                :loading="loadingSms"
                @click="handleSmsReport(row)"
              >
                短信报号
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                :disabled="!selectedStaff || selectedStaff.id !== row.id || !isInCall"
                :loading="loadingTransfer"
                @click="handleTransfer(row)"
              >
                电话转接
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          共 {{ staffPagination.total }} 条记录 第 {{ staffPagination.page }}/{{ staffPagination.totalPages }} 页
        </div>
        <div class="pagination-controls">
          <el-button :disabled="staffPagination.page <= 1" @click="handleStaffPrevPage">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button
            v-for="page in displayedStaffPages"
            :key="page"
            :type="page === staffPagination.page ? 'primary' : 'default'"
            @click="handleStaffPageClick(page)"
          >
            {{ page }}
          </el-button>
          <el-button :disabled="staffPagination.page >= staffPagination.totalPages" @click="handleStaffNextPage">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-select v-model="staffPagination.pageSize" class="page-size-select" @change="handleStaffPageSizeChange">
            <el-option label="10条/页" :value="10" />
            <el-option label="20条/页" :value="20" />
          </el-select>
          <span class="jump-text">跳至</span>
          <el-input v-model="staffJumpPage" class="jump-input" @keyup.enter="handleStaffJump" />
          <span class="jump-text">页</span>
          <el-button type="primary" @click="handleStaffJump">跳转</el-button>
        </div>
      </div>
    </div>

    <!-- 员工详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="员工详情"
      width="600px"
      class="detail-dialog"
    >
      <div v-if="currentStaffDetail" class="detail-content">
        <div class="detail-header">
          <h4>员工：{{ currentStaffDetail.name }}</h4>
        </div>
        <el-form label-width="120px" class="detail-form">
          <el-form-item label="姓名：">
            <el-input v-model="currentStaffDetail.name" disabled />
          </el-form-item>
          <el-form-item label="性别：">
            <el-input :value="currentStaffDetail.gender || '未知'" disabled />
          </el-form-item>
          <el-form-item label="职务：">
            <el-input :value="currentStaffDetail.position || '无'" disabled />
          </el-form-item>
          <el-form-item label="分机号：">
            <el-input v-model="currentStaffDetail.extension" disabled />
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input :value="currentStaffDetail.phone || '无'" disabled />
          </el-form-item>
          <el-form-item label="办公号码：">
            <el-input :value="currentStaffDetail.officePhone || '无'" disabled />
          </el-form-item>
          <el-form-item label="家庭号码：">
            <el-input :value="currentStaffDetail.homePhone || '无'" disabled />
          </el-form-item>
          <el-form-item label="其他号码：">
            <el-input :value="currentStaffDetail.otherPhone || '无'" disabled />
          </el-form-item>
          <el-form-item label="报号内容：" class="report-content">
            <div class="report-text">
              姓名：{{ currentStaffDetail.name }}，手机号码：{{ currentStaffDetail.phone || '无' }}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleDetailReport">报号</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, View, Microphone, Message, Phone } from '@element-plus/icons-vue'
import { FilterPanel, type FilterItem } from '@/components/Common'

// 公司接口
interface Company {
  id: string
  name: string
  address: string
  phone: string
  departments?: Department[]
}

// 科室接口
interface Department {
  id: string
  name: string
  extension: string
  location: string
  staffCount: number
  companyId: string
  staff?: StaffMember[]
}

// 员工接口
interface StaffMember {
  id: string
  name: string
  type: string
  extension: string
  department: string
  departmentId: string
  position?: string
  phone?: string
  gender?: string
  officePhone?: string
  homePhone?: string
  otherPhone?: string
}

// 当前层级
const currentLevel = ref<'company' | 'department' | 'detail'>('company')

// 当前选中的公司/科室/员工
const currentCompany = ref<Company | null>(null)
const currentDepartment = ref<Department | null>(null)
const selectedDepartment = ref<Department | null>(null)
const selectedStaff = ref<StaffMember | null>(null)
const currentStaffDetail = ref<StaffMember | null>(null)

// 根据来电号码匹配到的公司
const matchedCompany = ref<Company | null>(null)

// 模拟来电状态
const isInCall = ref(true)
const incomingPhoneNumber = ref('0591-87650001')

// 总机号码与公司映射关系
const phoneToCompanyMap: Record<string, string> = {
  '0591-87650001': 'C1',
  '0591-87650002': 'C2',
  '0591-87650003': 'C3',
  '0591-87650004': 'C4',
  '0591-87650005': 'C5',
  '0591-87650006': 'C6',
  '0591-87650007': 'C7',
  '0591-87650008': 'C8',
  '0591-87650009': 'C9',
  '0591-87650010': 'C10',
}

// 加载状态
const loading = ref(false)
const loadingVoice = ref(false)
const loadingSms = ref(false)
const loadingTransfer = ref(false)

// 弹窗显示
const showDetailDialog = ref(false)

// 统一搜索表单
let searchForm = reactive({
  departmentName: '',
  memberName: '',
  number: '',
  position: ''
})

// 筛选配置
const filterConfig = computed<FilterItem[]>(() => [
  {
    field: 'departmentName',
    label: '部门名称',
    type: 'text',
    placeholder: '请输入部门名称'
  },
  {
    field: 'memberName',
    label: '成员名称',
    type: 'text',
    placeholder: '请输入成员名称'
  },
  {
    field: 'number',
    label: '号码反查',
    type: 'text',
    placeholder: '请输入号码'
  },
  {
    field: 'position',
    label: '职务查询',
    type: 'text',
    placeholder: '请输入职务'
  }
])

// FilterPanel 搜索处理
const handleFilterSearch = (data: Record<string, any>) => {
  searchForm.departmentName = data.departmentName || ''
  searchForm.memberName = data.memberName || ''
  searchForm.number = data.number || ''
  searchForm.position = data.position || ''
  handleSearch()
}

// FilterPanel 重置处理
const handleFilterReset = () => {
  searchForm.departmentName = ''
  searchForm.memberName = ''
  searchForm.number = ''
  searchForm.position = ''
  handleReset()
}

// ========== 公司列表相关 ==========
const companyList = ref<Company[]>([])
const companyPagination = reactive({ page: 1, pageSize: 10, total: 0, totalPages: 0 })
const companyJumpPage = ref('')

// ========== 科室列表相关 ==========
const departmentList = ref<Department[]>([])
const deptPagination = reactive({ page: 1, pageSize: 10, total: 0, totalPages: 0 })
const deptJumpPage = ref('')

// ========== 员工列表相关 ==========
const staffList = ref<StaffMember[]>([])
const staffPagination = reactive({ page: 1, pageSize: 10, total: 0, totalPages: 0 })
const staffJumpPage = ref('')

// 生成模拟数据
const generateMockData = () => {
  const companies: Company[] = []
  const departments: Department[] = []
  const staffMembers: StaffMember[] = []

  for (let c = 1; c <= 10; c++) {
    const company: Company = {
      id: `C${c}`,
      name: `福建省${['第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十'][c - 1]}人民医院`,
      address: `福建省福州市${['鼓楼区', '台江区', '仓山区', '晋安区', '马尾区'][c % 5]}五四路${c}号`,
      phone: `0591-8765${String(c).padStart(4, '0')}`,
      departments: []
    }

    const deptCount = 10 + Math.floor(Math.random() * 11)
    for (let d = 1; d <= deptCount; d++) {
      const deptNames = ['内科', '外科', '妇产科', '儿科', '骨科', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '精神科', '肿瘤科', '心血管科', '神经内科', '肾内科', '消化内科', '呼吸内科', '内分泌科', '血液科', '风湿免疫科', '康复科']
      const dept: Department = {
        id: `D${c}-${d}`,
        name: deptNames[(d - 1) % deptNames.length],
        extension: `${c}${String(d).padStart(3, '0')}`,
        location: `${c}号楼${Math.floor(Math.random() * 10) + 1}层`,
        staffCount: Math.floor(Math.random() * 20) + 5,
        companyId: company.id,
        staff: []
      }

      for (let s = 1; s <= dept.staffCount; s++) {
        const staff: StaffMember = {
          id: `S${c}-${d}-${s}`,
          name: `${dept.name}员工${s}`,
          type: ['员工', '医生', '护士', '主任'][Math.floor(Math.random() * 4)],
          extension: `${c}${String(d).padStart(2, '0')}${String(s).padStart(2, '0')}`,
          department: dept.name,
          departmentId: dept.id,
          position: ['主治医师', '副主任医师', '主任医师', '护士', '实习医生'][Math.floor(Math.random() * 5)],
          phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          gender: Math.random() > 0.5 ? '男' : '女',
          officePhone: `0591-8765${String(c).padStart(4, '0')}`,
          homePhone: Math.random() > 0.7 ? `0591-${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : undefined,
          otherPhone: Math.random() > 0.8 ? `139${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : undefined
        }
        staffMembers.push(staff)
        dept.staff?.push(staff)
      }

      departments.push(dept)
      company.departments?.push(dept)
    }

    companies.push(company)
  }

  return { companies, departments, staffMembers }
}

const { companies: allCompanies, departments: allDepartments, staffMembers: allStaff } = generateMockData()

// ========== 统一搜索方法 ==========
// 全局搜索：搜索整个企业的所有层级数据
const handleSearch = () => {
  // 如果在一级信息页面，需要判断搜索类型并可能跳转到二级或三级
  if (currentLevel.value === 'company') {
    // 检查是否在搜索部门名称
    if (searchForm.departmentName) {
      // 搜索部门，需要跳转到二级信息页面
      searchDepartmentsAcrossCompanies()
      return
    }
    // 检查是否在搜索成员名称、号码或职务
    if (searchForm.memberName || searchForm.number || searchForm.position) {
      // 搜索员工，需要跳转到三级信息页面
      searchStaffAcrossCompanies()
      return
    }
    // 否则只搜索公司
    companyPagination.page = 1
    loadCompanyList()
  } else if (currentLevel.value === 'department') {
    // 在二级页面，搜索当前公司的科室或员工
    if (searchForm.memberName || searchForm.position) {
      // 搜索员工，跳转到三级
      searchStaffInCurrentCompany()
    } else {
      // 搜索科室
      deptPagination.page = 1
      loadDepartmentList()
    }
  } else if (currentLevel.value === 'detail') {
    // 在三级页面，只搜索当前科室的员工
    staffPagination.page = 1
    loadStaffList()
  }
}

// 跨公司搜索部门，跳转到第一个匹配的公司的二级页面
const searchDepartmentsAcrossCompanies = () => {
  loading.value = true
  setTimeout(() => {
    // 在所有公司中搜索匹配的部门
    const matchedDepts = allDepartments.filter(d => 
      d.name.includes(searchForm.departmentName)
    )
    
    if (matchedDepts.length === 0) {
      ElMessage.warning('未找到匹配的部门')
      loading.value = false
      return
    }
    
    // 获取第一个匹配部门所属的公司
    const firstMatchedDept = matchedDepts[0]
    const company = allCompanies.find(c => c.id === firstMatchedDept.companyId)
    
    if (company) {
      // 切换到该公司并显示科室列表
      currentCompany.value = company
      currentLevel.value = 'department'
      deptPagination.page = 1
      selectedDepartment.value = null
      
      // 加载科室列表（会自动应用搜索条件）
      loadDepartmentList()
      ElMessage.success(`已找到 ${matchedDepts.length} 个匹配部门，显示在${company.name}`)
    }
    loading.value = false
  }, 300)
}

// 跨公司搜索员工，跳转到第一个匹配的部门的三级页面
const searchStaffAcrossCompanies = () => {
  loading.value = true
  setTimeout(() => {
    // 在所有员工中搜索
    let matchedStaff = [...allStaff]
    
    if (searchForm.memberName) {
      matchedStaff = matchedStaff.filter(s => 
        s.name.includes(searchForm.memberName) || 
        s.extension.includes(searchForm.memberName)
      )
    }
    if (searchForm.number) {
      matchedStaff = matchedStaff.filter(s => 
        s.extension.includes(searchForm.number) || 
        s.phone?.includes(searchForm.number)
      )
    }
    if (searchForm.position) {
      matchedStaff = matchedStaff.filter(s => 
        s.position?.includes(searchForm.position) || 
        s.type.includes(searchForm.position)
      )
    }
    
    if (matchedStaff.length === 0) {
      ElMessage.warning('未找到匹配的成员')
      loading.value = false
      return
    }
    
    // 获取第一个匹配员工所属的部门和公司
    const firstMatchedStaff = matchedStaff[0]
    const department = allDepartments.find(d => d.id === firstMatchedStaff.departmentId)
    const company = allCompanies.find(c => c.id === department?.companyId)
    
    if (company && department) {
      // 切换到该公司和部门，显示员工列表
      currentCompany.value = company
      currentDepartment.value = department
      currentLevel.value = 'detail'
      staffPagination.page = 1
      selectedStaff.value = null
      
      // 加载员工列表（会自动应用搜索条件）
      loadStaffList()
      ElMessage.success(`已找到 ${matchedStaff.length} 个匹配成员，显示在${department.name}`)
    }
    loading.value = false
  }, 300)
}

// 在当前公司中搜索员工，跳转到三级页面
const searchStaffInCurrentCompany = () => {
  loading.value = true
  setTimeout(() => {
    // 获取当前公司的所有部门ID
    const companyDeptIds = allDepartments
      .filter(d => d.companyId === currentCompany.value?.id)
      .map(d => d.id)
    
    // 在这些部门中搜索员工
    let matchedStaff = allStaff.filter(s => companyDeptIds.includes(s.departmentId))
    
    if (searchForm.memberName) {
      matchedStaff = matchedStaff.filter(s => 
        s.name.includes(searchForm.memberName) || 
        s.extension.includes(searchForm.memberName)
      )
    }
    if (searchForm.number) {
      matchedStaff = matchedStaff.filter(s => 
        s.extension.includes(searchForm.number) || 
        s.phone?.includes(searchForm.number)
      )
    }
    if (searchForm.position) {
      matchedStaff = matchedStaff.filter(s => 
        s.position?.includes(searchForm.position) || 
        s.type.includes(searchForm.position)
      )
    }
    
    if (matchedStaff.length === 0) {
      ElMessage.warning('未找到匹配的成员')
      loading.value = false
      return
    }
    
    // 获取第一个匹配员工所属的部门
    const firstMatchedStaff = matchedStaff[0]
    const department = allDepartments.find(d => d.id === firstMatchedStaff.departmentId)
    
    if (department) {
      // 切换到该部门，显示员工列表
      currentDepartment.value = department
      currentLevel.value = 'detail'
      staffPagination.page = 1
      selectedStaff.value = null
      
      // 加载员工列表
      loadStaffList()
      ElMessage.success(`已找到 ${matchedStaff.length} 个匹配成员，显示在${department.name}`)
    }
    loading.value = false
  }, 300)
}

const handleReset = () => {
  searchForm.departmentName = ''
  searchForm.memberName = ''
  searchForm.number = ''
  searchForm.position = ''
  handleSearch()
}

// ========== 公司列表方法 ==========
const loadCompanyList = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = [...allCompanies]
    if (searchForm.departmentName) {
      filtered = filtered.filter(c => c.name.includes(searchForm.departmentName))
    }
    if (searchForm.number) {
      filtered = filtered.filter(c => c.phone.includes(searchForm.number))
    }
    companyPagination.total = filtered.length
    companyPagination.totalPages = Math.ceil(filtered.length / companyPagination.pageSize)
    const start = (companyPagination.page - 1) * companyPagination.pageSize
    const end = start + companyPagination.pageSize
    companyList.value = filtered.slice(start, end)
    loading.value = false
  }, 300)
}

const displayedCompanyPages = computed(() => {
  const { page, totalPages } = companyPagination
  const pages: number[] = []
  let start = Math.max(1, page - 4)
  let end = Math.min(totalPages, start + 8)
  if (end - start < 8) start = Math.max(1, end - 8)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const handleCompanyClick = (row: Company) => {
  currentCompany.value = row
  currentLevel.value = 'department'
  deptPagination.page = 1
  selectedDepartment.value = null
  loadDepartmentList()
}

// 公司级别的操作按钮方法
const handleCompanyVoiceReport = (row: Company) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingVoice.value = true
  setTimeout(() => { 
    loadingVoice.value = false; 
    ElMessage.success(`语音播报：${row.name}，总机号码${row.phone}`) 
  }, 1000)
}

const handleCompanySmsReport = (row: Company) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingSms.value = true
  setTimeout(() => { 
    loadingSms.value = false; 
    ElMessage.success(`已向${incomingPhoneNumber.value}发送短信：${row.name}，地址：${row.address}，电话：${row.phone}`) 
  }, 1500)
}

const handleCompanyTransfer = (row: Company) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingTransfer.value = true
  setTimeout(() => { 
    loadingTransfer.value = false; 
    ElMessage.success(`已转接至${row.name}总机：${row.phone}`) 
  }, 2000)
}

const handleCompanyPrevPage = () => { if (companyPagination.page > 1) { companyPagination.page--; loadCompanyList() } }
const handleCompanyNextPage = () => { if (companyPagination.page < companyPagination.totalPages) { companyPagination.page++; loadCompanyList() } }
const handleCompanyPageClick = (page: number) => { companyPagination.page = page; loadCompanyList() }
const handleCompanyPageSizeChange = () => { companyPagination.page = 1; loadCompanyList() }
const handleCompanyJump = () => {
  const page = parseInt(companyJumpPage.value)
  if (page && page >= 1 && page <= companyPagination.totalPages) {
    companyPagination.page = page
    loadCompanyList()
    companyJumpPage.value = ''
  }
}

// ========== 科室列表方法 ==========
const loadDepartmentList = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = allDepartments.filter(d => d.companyId === currentCompany.value?.id)
    if (searchForm.departmentName) {
      filtered = filtered.filter(d => d.name.includes(searchForm.departmentName))
    }
    if (searchForm.number) {
      filtered = filtered.filter(d => d.extension.includes(searchForm.number))
    }
    deptPagination.total = filtered.length
    deptPagination.totalPages = Math.ceil(filtered.length / deptPagination.pageSize)
    const start = (deptPagination.page - 1) * deptPagination.pageSize
    const end = start + deptPagination.pageSize
    departmentList.value = filtered.slice(start, end)
    loading.value = false
  }, 300)
}

const displayedDeptPages = computed(() => {
  const { page, totalPages } = deptPagination
  const pages: number[] = []
  let start = Math.max(1, page - 4)
  let end = Math.min(totalPages, start + 8)
  if (end - start < 8) start = Math.max(1, end - 8)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const handleDepartmentSelect = (val: Department | undefined) => {
  selectedDepartment.value = val || null
}

const handleDepartmentClick = (row: Department) => {
  currentDepartment.value = row
  currentLevel.value = 'detail'
  staffPagination.page = 1
  selectedStaff.value = null
  loadStaffList()
}

const backToCompany = () => {
  currentLevel.value = 'company'
  currentCompany.value = null
  selectedDepartment.value = null
  // 重新加载公司列表
  loadCompanyList()
}

// 科室操作按钮
const handleDeptVoiceReport = (row: Department) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingVoice.value = true
  setTimeout(() => { loadingVoice.value = false; ElMessage.success(`语音播报：${row.name}，分机号${row.extension}`) }, 1000)
}

const handleDeptSmsReport = (row: Department) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingSms.value = true
  setTimeout(() => { loadingSms.value = false; ElMessage.success(`已向${incomingPhoneNumber.value}发送短信，分机号：${row.extension}`) }, 1500)
}

const handleDeptTransfer = (row: Department) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingTransfer.value = true
  setTimeout(() => { loadingTransfer.value = false; ElMessage.success(`已转接至${row.extension}`) }, 2000)
}

const handleDeptPrevPage = () => { if (deptPagination.page > 1) { deptPagination.page--; loadDepartmentList() } }
const handleDeptNextPage = () => { if (deptPagination.page < deptPagination.totalPages) { deptPagination.page++; loadDepartmentList() } }
const handleDeptPageClick = (page: number) => { deptPagination.page = page; loadDepartmentList() }
const handleDeptPageSizeChange = () => { deptPagination.page = 1; loadDepartmentList() }
const handleDeptJump = () => {
  const page = parseInt(deptJumpPage.value)
  if (page && page >= 1 && page <= deptPagination.totalPages) {
    deptPagination.page = page
    loadDepartmentList()
    deptJumpPage.value = ''
  }
}

// ========== 员工列表方法 ==========
const loadStaffList = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = allStaff.filter(s => s.departmentId === currentDepartment.value?.id)
    if (searchForm.memberName) {
      filtered = filtered.filter(s => s.name.includes(searchForm.memberName) || s.extension.includes(searchForm.memberName))
    }
    if (searchForm.number) {
      filtered = filtered.filter(s => s.extension.includes(searchForm.number) || s.phone?.includes(searchForm.number))
    }
    if (searchForm.position) {
      filtered = filtered.filter(s => s.position?.includes(searchForm.position) || s.type.includes(searchForm.position))
    }
    staffPagination.total = filtered.length
    staffPagination.totalPages = Math.ceil(filtered.length / staffPagination.pageSize)
    const start = (staffPagination.page - 1) * staffPagination.pageSize
    const end = start + staffPagination.pageSize
    staffList.value = filtered.slice(start, end)
    loading.value = false
  }, 300)
}

const displayedStaffPages = computed(() => {
  const { page, totalPages } = staffPagination
  const pages: number[] = []
  let start = Math.max(1, page - 4)
  let end = Math.min(totalPages, start + 8)
  if (end - start < 8) start = Math.max(1, end - 8)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const handleStaffSelect = (val: StaffMember | undefined) => {
  selectedStaff.value = val || null
  if (val) {
    currentStaffDetail.value = val
    showDetailDialog.value = true
  }
}

const backToDepartment = () => {
  currentLevel.value = 'department'
  currentDepartment.value = null
  selectedStaff.value = null
  // 重新加载科室列表
  loadDepartmentList()
}

const handleStaffPrevPage = () => { if (staffPagination.page > 1) { staffPagination.page--; loadStaffList() } }
const handleStaffNextPage = () => { if (staffPagination.page < staffPagination.totalPages) { staffPagination.page++; loadStaffList() } }
const handleStaffPageClick = (page: number) => { staffPagination.page = page; loadStaffList() }
const handleStaffPageSizeChange = () => { staffPagination.page = 1; loadStaffList() }
const handleStaffJump = () => {
  const page = parseInt(staffJumpPage.value)
  if (page && page >= 1 && page <= staffPagination.totalPages) {
    staffPagination.page = page
    loadStaffList()
    staffJumpPage.value = ''
  }
}

// 员工操作按钮
const handleVoiceReport = (row: StaffMember) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingVoice.value = true
  setTimeout(() => { loadingVoice.value = false; ElMessage.success(`语音播报：${row.name}，分机号${row.extension}`) }, 1000)
}

const handleSmsReport = (row: StaffMember) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingSms.value = true
  setTimeout(() => { loadingSms.value = false; ElMessage.success(`已向${incomingPhoneNumber.value}发送短信`) }, 1500)
}

const handleTransfer = (row: StaffMember) => {
  if (!isInCall.value) { ElMessage.warning('当前不在通话中'); return }
  loadingTransfer.value = true
  setTimeout(() => { loadingTransfer.value = false; ElMessage.success(`已转接至${row.extension}`) }, 2000)
}

const handleDetailReport = () => {
  if (currentStaffDetail.value) {
    handleVoiceReport(currentStaffDetail.value)
  }
}

// 从公司信息卡片进入二级信息列表
const enterDepartmentList = () => {
  if (matchedCompany.value) {
    currentCompany.value = matchedCompany.value
    currentLevel.value = 'department'
    deptPagination.page = 1
    selectedDepartment.value = null
    loadDepartmentList()
  }
}

// 根据来电号码自动匹配公司
const matchCompanyByPhone = () => {
  const companyId = phoneToCompanyMap[incomingPhoneNumber.value]
  if (companyId) {
    const company = allCompanies.find(c => c.id === companyId)
    if (company) {
      matchedCompany.value = company
      currentCompany.value = company
      currentLevel.value = 'department'
      deptPagination.page = 1
      loadDepartmentList()
    }
  }
}

onMounted(() => {
  loadCompanyList()
  matchCompanyByPhone()
})
</script>

<style scoped lang="scss">
.pbx30-module {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 56px - 60px);
}

// 统一搜索栏
.search-section {
  background: #fff;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  
  .el-form-item {
    margin-bottom: 0;
  }
  
  .search-input {
    width: 160px;
  }
  
  .search-buttons {
    margin-left: auto;
  }
}

// 公司信息卡片
.company-info-card {
  background: linear-gradient(135deg, #1a5fb4 0%, #3584e4 100%);
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 20px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(26, 95, 180, 0.3);

  .company-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .company-name {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .company-details {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }

      .value {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

// 未匹配提示
.no-match-tip {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  margin-bottom: 20px;
  text-align: center;

  p {
    color: #909399;
    margin: 8px 0;
  }
}

.level-section {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.data-table {
  :deep(.el-table__row) {
    cursor: pointer;
    &.current-row { background-color: #ecf5ff !important; }
    &:hover { background-color: #f5f7fa; }
  }
}

.operation-btns {
  display: flex;
  gap: 8px;
  .el-button { padding: 0 4px; }
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;

  .pagination-info { color: #606266; font-size: 14px; }
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    .el-button { min-width: 32px; padding: 0 8px; }
    .page-size-select { width: 100px; }
    .jump-text { color: #606266; font-size: 14px; }
    .jump-input { width: 50px; :deep(.el-input__wrapper) { padding: 0 8px; } }
  }
}

// 详情弹窗样式
.detail-dialog {
  :deep(.el-dialog__body) { padding: 20px; }
}

.detail-content {
  .detail-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;
    h4 { margin: 0; font-size: 16px; color: #303133; }
  }
}

.detail-form {
  .el-form-item { margin-bottom: 16px; }
  .report-content {
    .report-text {
      padding: 12px;
      background: #f5f7fa;
      border-radius: 4px;
      color: #606266;
      line-height: 1.6;
    }
  }
}
</style>
