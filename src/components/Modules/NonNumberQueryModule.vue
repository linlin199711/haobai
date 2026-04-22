<template>
  <div class="module-container">
    <div class="module-header">
      <h2>非号码查询</h2>
      <p>查询公交路线信息，支持多地市模糊搜索</p>
    </div>

    <el-card shadow="hover" class="query-card">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :model="searchForm" inline class="search-form">
          <div class="search-items">
            <el-form-item label="地市">
              <el-select v-model="searchForm.city" class="search-input" @change="handleCityChange">
                <el-option
                  v-for="city in cityList"
                  :key="city.code"
                  :label="city.name"
                  :value="city.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="公交路线">
              <el-input
                v-model="searchForm.routeName"
                placeholder="请输入公交路线，支持模糊搜索"
                clearable
                class="search-input"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </div>
          <el-form-item class="search-buttons">
            <el-button type="primary" :loading="loading" @click="handleSearch">
              <el-icon><Search /></el-icon> 查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 搜索结果列表 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="results-header">
          <span class="results-title">搜索结果（共 {{ searchResults.length }} 条）</span>
        </div>
        <el-table
          :data="searchResults"
          stripe
          highlight-current-row
          @row-click="handleRouteSelect"
          class="results-table"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="category" label="路线名称" width="120">
            <template #default="{ row }">
              <span class="highlight-route">{{ row.category }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="company" label="所属公交" width="180" />
          <el-table-column prop="phone" label="联系电话" width="150">
            <template #default="{ row }">
              <span class="highlight-phone">{{ row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="handleRouteSelect(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 非号码信息详情展示区 -->
      <div v-if="selectedRoute" class="info-detail-section">
        <h3 class="section-title">非号码信息详情</h3>
        
        <div class="info-rows">
          <!-- 第一行：类别 -->
          <div class="info-row">
            <el-checkbox v-model="checkedItems.category" class="row-checkbox">
              类别
            </el-checkbox>
            <span class="row-label">类别：</span>
            <span class="row-value highlight-yellow">{{ selectedRoute.category }}</span>
          </div>
          
          <!-- 第二行：问题 -->
          <div class="info-row">
            <el-checkbox v-model="checkedItems.question" class="row-checkbox">
              问题
            </el-checkbox>
            <span class="row-label">所属公交：</span>
            <span class="row-value">{{ selectedRoute.company }}</span>
          </div>
          
          <!-- 第三行：答案 -->
          <div class="info-row">
            <el-checkbox v-model="checkedItems.answer" class="row-checkbox">
              答案
            </el-checkbox>
            <span class="row-label">公交集团电话：</span>
            <span class="row-value highlight-phone">{{ selectedRoute.phone }}</span>
          </div>
        </div>
      </div>

      <!-- 报号内容编辑区 -->
      <div v-if="selectedRoute" class="report-section">
        <!-- 语音报号展示区（只读） -->
        <div class="report-block">
          <div class="block-header">
            <span class="block-title">语音报号</span>
            <span class="char-count">
              {{ voiceContent.length }}/{{ VOICE_MAX_LENGTH }}
            </span>
          </div>
          <div class="report-content readonly">
            {{ voiceContent }}
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="!selectedRoute && searchResults.length === 0 && !loading" class="empty-state">
        <el-empty description="请输入公交路线进行查询">
          <template #default>
            <p>支持查询福州、厦门、泉州等地市的公交路线信息</p>
            <p class="tip">提示：支持模糊搜索，如输入"1"可查询所有包含1的路线</p>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ==================== 常量定义 ====================
const VOICE_MAX_LENGTH = 241

// ==================== 类型定义 ====================
interface City {
  code: string
  name: string
}

interface RouteInfo {
  category: string
  company: string
  phone: string
  cityCode: string
}

// ==================== 地市列表 ====================
const cityList: City[] = [
  { code: 'fuzhou', name: '福州' },
  { code: 'xiamen', name: '厦门' },
  { code: 'quanzhou', name: '泉州' },
  { code: 'zhangzhou', name: '漳州' },
  { code: 'putian', name: '莆田' },
  { code: 'nanping', name: '南平' },
  { code: 'sanming', name: '三明' },
  { code: 'longyan', name: '龙岩' },
  { code: 'ningde', name: '宁德' }
]

// ==================== Mock数据 ====================
const mockRouteData: Record<string, Record<string, RouteInfo>> = {
  fuzhou: {
    'K1路': { category: 'K1路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    'K2路': { category: 'K2路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    'K3路': { category: 'K3路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '1路': { category: '1路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '10路': { category: '10路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '11路': { category: '11路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '100路': { category: '100路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '101路': { category: '101路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '328路': { category: '328路', company: '康驰新巴士', phone: '968803', cityCode: 'fuzhou' },
    '330路': { category: '330路', company: '康驰新巴士', phone: '968803', cityCode: 'fuzhou' }
  },
  xiamen: {
    '1路': { category: '1路', company: '厦门公交集团', phone: '968828', cityCode: 'xiamen' },
    '2路': { category: '2路', company: '厦门公交集团', phone: '968828', cityCode: 'xiamen' },
    '10路': { category: '10路', company: '厦门公交集团', phone: '968828', cityCode: 'xiamen' },
    '20路': { category: '20路', company: '厦门公交集团', phone: '968828', cityCode: 'xiamen' },
    '快1路': { category: '快1路', company: '厦门BRT', phone: '968828', cityCode: 'xiamen' },
    '快2路': { category: '快2路', company: '厦门BRT', phone: '968828', cityCode: 'xiamen' }
  },
  quanzhou: {
    '1路': { category: '1路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' },
    '2路': { category: '2路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' },
    'K1路': { category: 'K1路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' },
    'K2路': { category: 'K2路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' },
    '15路': { category: '15路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' }
  },
  zhangzhou: {
    '1路': { category: '1路', company: '漳州公交', phone: '968969', cityCode: 'zhangzhou' },
    '5路': { category: '5路', company: '漳州公交', phone: '968969', cityCode: 'zhangzhou' },
    'K1路': { category: 'K1路', company: '漳州公交', phone: '968969', cityCode: 'zhangzhou' }
  },
  putian: {
    '1路': { category: '1路', company: '莆田公交', phone: '968166', cityCode: 'putian' },
    '2路': { category: '2路', company: '莆田公交', phone: '968166', cityCode: 'putian' }
  },
  nanping: {
    '1路': { category: '1路', company: '南平公交', phone: '968811', cityCode: 'nanping' },
    '2路': { category: '2路', company: '南平公交', phone: '968811', cityCode: 'nanping' }
  },
  sanming: {
    '1路': { category: '1路', company: '三明公交', phone: '968822', cityCode: 'sanming' },
    '2路': { category: '2路', company: '三明公交', phone: '968822', cityCode: 'sanming' }
  },
  longyan: {
    '1路': { category: '1路', company: '龙岩公交', phone: '968833', cityCode: 'longyan' },
    'K1路': { category: 'K1路', company: '龙岩公交', phone: '968833', cityCode: 'longyan' }
  },
  ningde: {
    '1路': { category: '1路', company: '宁德公交', phone: '968855', cityCode: 'ningde' },
    '2路': { category: '2路', company: '宁德公交', phone: '968855', cityCode: 'ningde' }
  }
}

// ==================== 响应式数据 ====================
const searchForm = reactive({
  city: 'fuzhou',
  routeName: ''
})

const loading = ref(false)

const searchResults = ref<RouteInfo[]>([])
const selectedRoute = ref<RouteInfo | null>(null)

const checkedItems = reactive({
  category: true,
  question: true,
  answer: true
})

const voiceContent = ref('【福建电信114】')

// ==================== 计算属性 ====================
const voiceRemaining = computed(() => {
  return Math.max(0, VOICE_MAX_LENGTH - voiceContent.value.length)
})

// ==================== 方法 ====================

/**
 * 模糊搜索公交路线
 */
const handleSearch = async () => {
  if (!searchForm.routeName.trim()) {
    ElMessage.warning('请输入公交路线')
    return
  }

  loading.value = true
  searchResults.value = []
  selectedRoute.value = null
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const cityData = mockRouteData[searchForm.city]
    if (!cityData) {
      ElMessage.error('暂不支持该地市查询')
      return
    }
    
    const searchKey = searchForm.routeName.trim().toUpperCase()
    
    // 模糊搜索：匹配路线名称中包含搜索关键字的路线
    const matchedRoutes: RouteInfo[] = []
    
    for (const [routeName, routeInfo] of Object.entries(cityData)) {
      if (routeName.toUpperCase().includes(searchKey)) {
        matchedRoutes.push(routeInfo)
      }
    }
    
    if (matchedRoutes.length > 0) {
      searchResults.value = matchedRoutes
      ElMessage.success(`找到 ${matchedRoutes.length} 条相关路线`)
      
      // 如果只有一条结果，自动选中
      if (matchedRoutes.length === 1) {
        selectedRoute.value = matchedRoutes[0]
        updateReportContent(matchedRoutes[0])
      }
    } else {
      ElMessage.warning('未找到匹配的公交路线')
    }
  } catch (error) {
    ElMessage.error('查询失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 选择路线
 */
const handleRouteSelect = (row: RouteInfo) => {
  selectedRoute.value = row
  updateReportContent(row)
}

/**
 * 更新报号内容
 */
const updateReportContent = (route: RouteInfo) => {
  const defaultContent = `【福建电信114】${route.category}所属${route.company}，联系电话${route.phone}`
  voiceContent.value = defaultContent
}

/**
 * 重置查询
 */
const handleReset = () => {
  searchForm.routeName = ''
  searchResults.value = []
  selectedRoute.value = null
  voiceContent.value = '【福建电信114】'
  checkedItems.category = true
  checkedItems.question = true
  checkedItems.answer = true
}

/**
 * 地市切换
 */
const handleCityChange = () => {
  const cityName = cityList.find(c => c.code === searchForm.city)?.name || ''
  searchResults.value = []
  selectedRoute.value = null
  searchForm.routeName = ''
  voiceContent.value = '【福建电信114】'
  ElMessage.info(`已切换至${cityName}，请重新查询`)
}

// ==================== 监听器 ====================

watch(voiceContent, (newVal) => {
  if (newVal.length > VOICE_MAX_LENGTH) {
    voiceContent.value = newVal.slice(0, VOICE_MAX_LENGTH)
    ElMessage.warning(`语音内容不能超过${VOICE_MAX_LENGTH}个字符`)
  }
})
</script>

<style scoped lang="scss">
.module-container {
  padding: 12px 16px; // 减小padding
  height: 100%;
  overflow-y: auto;
}

.module-header {
  margin-bottom: 16px; // 减小margin

  h2 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #909399;
  }
}

.query-card {
  .search-section {
    margin-bottom: 12px; // 减小margin
    padding-bottom: 12px; // 减小padding
    border-bottom: 1px solid #ebeef5;
  }

  .search-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    
    .search-items {
      display: flex;
      flex-wrap: nowrap;
      gap: 12px;
      flex: 1;
      
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
      }
    }
    
    .search-input {
      width: 200px;
    }
    
    .search-buttons {
      margin-left: 12px;
      margin-bottom: 0;
      flex-shrink: 0;
    }
  }
}

// ==================== 搜索结果列表 ====================
.search-results {
  margin-bottom: 20px;
  
  .results-header {
    margin-bottom: 12px;
    
    .results-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .results-table {
    .highlight-route {
      background: #ffeb3b;
      padding: 2px 8px;
      border-radius: 3px;
      color: #333;
      font-weight: 600;
    }
    
    .highlight-phone {
      color: #409eff;
      font-weight: 600;
    }
  }
}

// ==================== 信息详情区域 ====================
.info-detail-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  .section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #f56c6c;
    border-left: 4px solid #f56c6c;
    padding-left: 12px;
  }
}

.info-rows {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f5f7fa;
  }
  
  .row-checkbox {
    margin-right: 12px;
  }
  
  .row-label {
    color: #606266;
    font-size: 14px;
    min-width: 100px;
  }
  
  .row-value {
    color: #303133;
    font-size: 14px;
    font-weight: 500;
    
    &.highlight-yellow {
      background: #ffeb3b;
      padding: 2px 8px;
      border-radius: 3px;
      color: #333;
    }
    
    &.highlight-phone {
      color: #409eff;
      font-weight: 600;
      font-size: 16px;
    }
  }
}

// ==================== 报号编辑区域 ====================
.report-section {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}

.char-count-tips {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  
  .tip-item {
    .count {
      color: #67c23a;
      font-weight: 600;
      
      &.warning {
        color: #e6a23c;
      }
    }
  }
  
  .divider {
    margin: 0 16px;
    color: #dcdfe6;
  }
}

.report-block {
  margin-bottom: 16px;
  
  .block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .block-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
    
    .char-count {
      font-size: 12px;
      color: #909399;
      
      &.error {
        color: #f56c6c;
        font-weight: 600;
      }
    }
  }
  
  .report-textarea {
    :deep(.el-textarea__inner) {
      font-family: 'Courier New', monospace;
    }
  }
  
  .report-content {
    padding: 12px;
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: #606266;
    min-height: 72px;
    white-space: pre-wrap;
    word-break: break-all;
    
    &.readonly {
      background: #f5f7fa;
      cursor: default;
      user-select: text;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

// ==================== 空状态 ====================
.empty-state {
  padding: 60px 20px;
  
  p {
    color: #909399;
    margin-top: 8px;
    
    &.tip {
      color: #409eff;
      font-size: 13px;
    }
  }
}
</style>
