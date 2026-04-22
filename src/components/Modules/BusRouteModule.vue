/**
 * 非号码查询模块 - 公交路线查询
 * @description 呼叫中心公交路线查询，支持地市切换、路线查询、报号内容编辑
 * @version 1.0.0
 */

<template>
  <div class="bus-route-module">
    <!-- 顶部搜索区域 -->
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
              placeholder="请输入公交路线，如K1路"
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

    <!-- 非号码信息详情展示区 -->
    <div v-if="routeInfo" class="info-detail-section">
      <h3 class="section-title">非号码信息详情</h3>
      
      <div class="info-rows">
        <!-- 第一行：类别 -->
        <div class="info-row">
          <el-checkbox v-model="checkedItems.category" class="row-checkbox">
            类别
          </el-checkbox>
          <span class="row-label">类别：</span>
          <span class="row-value highlight-yellow">{{ routeInfo.category }}</span>
        </div>
        
        <!-- 第二行：问题 -->
        <div class="info-row">
          <el-checkbox v-model="checkedItems.question" class="row-checkbox">
            问题
          </el-checkbox>
          <span class="row-label">所属公交：</span>
          <span class="row-value">{{ routeInfo.company }}</span>
        </div>
        
        <!-- 第三行：答案 -->
        <div class="info-row">
          <el-checkbox v-model="checkedItems.answer" class="row-checkbox">
            答案
          </el-checkbox>
          <span class="row-label">公交集团电话：</span>
          <span class="row-value highlight-phone">{{ routeInfo.phone }}</span>
        </div>
      </div>
    </div>

    <!-- 报号内容编辑区 -->
    <div v-if="routeInfo" class="report-section">
      <!-- 字符数提示 -->
      <div class="char-count-tips">
        <span class="tip-item">
          短信报号内容，您还可以输入
          <span class="count" :class="{ 'warning': smsRemaining < 50 }">{{ smsRemaining }}</span>
          个字符
        </span>
        <span class="divider">|</span>
        <span class="tip-item">
          语音报号内容，您还可以输入
          <span class="count" :class="{ 'warning': voiceRemaining < 20 }">{{ voiceRemaining }}</span>
          个字符
        </span>
      </div>

      <!-- 短信报号编辑区 -->
      <div class="report-block">
        <div class="block-header">
          <span class="block-title">短信报号</span>
          <span class="char-count" :class="{ 'error': smsContent.length > SMS_MAX_LENGTH }">
            {{ smsContent.length }}/{{ SMS_MAX_LENGTH }}
          </span>
        </div>
        <el-input
          v-model="smsContent"
          type="textarea"
          :rows="3"
          :maxlength="SMS_MAX_LENGTH"
          placeholder="请输入短信报号内容"
          class="report-textarea"
          show-word-limit
        />
      </div>

      <!-- 语音报号编辑区 -->
      <div class="report-block">
        <div class="block-header">
          <span class="block-title">语音报号</span>
          <span class="char-count" :class="{ 'error': voiceContent.length > VOICE_MAX_LENGTH }">
            {{ voiceContent.length }}/{{ VOICE_MAX_LENGTH }}
          </span>
        </div>
        <el-input
          v-model="voiceContent"
          type="textarea"
          :rows="3"
          :maxlength="VOICE_MAX_LENGTH"
          placeholder="请输入语音报号内容"
          class="report-textarea"
          show-word-limit
        />
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" :loading="loadingVoice" @click="handleVoiceReport">
          <el-icon><Microphone /></el-icon> 语音播报
        </el-button>
        <el-button type="success" :loading="loadingSms" @click="handleSmsReport">
          <el-icon><Message /></el-icon> 短信发送
        </el-button>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-else-if="!loading" class="empty-state">
      <el-empty description="请输入公交路线进行查询">
        <template #default>
          <p>支持查询福州、厦门、泉州等地市的公交路线信息</p>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Microphone, Message } from '@element-plus/icons-vue'

// ==================== 常量定义 ====================
const SMS_MAX_LENGTH = 691
const VOICE_MAX_LENGTH = 241

// ==================== 类型定义 ====================
interface City {
  code: string
  name: string
}

interface RouteInfo {
  category: string      // 类别（如K1路）
  company: string       // 所属公交集团
  phone: string         // 公交公司电话
  cityCode: string      // 所属地市
}

interface SearchForm {
  city: string
  routeName: string
}

interface CheckedItems {
  category: boolean
  question: boolean
  answer: boolean
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
    '1路': { category: '1路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '100路': { category: '100路', company: '公交集团', phone: '968803', cityCode: 'fuzhou' },
    '328路': { category: '328路', company: '康驰新巴士', phone: '968803', cityCode: 'fuzhou' }
  },
  xiamen: {
    '1路': { category: '1路', company: '厦门公交集团', phone: '968828', cityCode: 'xiamen' },
    '2路': { category: '2路', company: '厦门公交集团', phone: '968828', cityCode: 'xiamen' },
    '快1路': { category: '快1路', company: '厦门BRT', phone: '968828', cityCode: 'xiamen' }
  },
  quanzhou: {
    '1路': { category: '1路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' },
    'K1路': { category: 'K1路', company: '泉州公交', phone: '968856', cityCode: 'quanzhou' }
  }
}

// ==================== 响应式数据 ====================
const searchForm = reactive<SearchForm>({
  city: 'fuzhou',
  routeName: ''
})

const loading = ref(false)
const loadingVoice = ref(false)
const loadingSms = ref(false)

const routeInfo = ref<RouteInfo | null>(null)

const checkedItems = reactive<CheckedItems>({
  category: true,
  question: true,
  answer: true
})

const smsContent = ref('【福建电信114】')
const voiceContent = ref('【福建电信114】')

// ==================== 计算属性 ====================
const smsRemaining = computed(() => {
  return Math.max(0, SMS_MAX_LENGTH - smsContent.value.length)
})

const voiceRemaining = computed(() => {
  return Math.max(0, VOICE_MAX_LENGTH - voiceContent.value.length)
})

// ==================== 方法 ====================

/**
 * 查询公交路线
 */
const handleSearch = async () => {
  if (!searchForm.routeName.trim()) {
    ElMessage.warning('请输入公交路线')
    return
  }

  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const cityData = mockRouteData[searchForm.city]
    if (!cityData) {
      ElMessage.error('暂不支持该地市查询')
      routeInfo.value = null
      return
    }
    
    const routeName = searchForm.routeName.trim().toUpperCase()
    const info = cityData[routeName]
    
    if (info) {
      routeInfo.value = info
      // 自动填充报号内容
      const defaultContent = `【福建电信114】${info.category}所属${info.company}，联系电话${info.phone}`
      smsContent.value = defaultContent
      voiceContent.value = defaultContent
      
      ElMessage.success('查询成功')
      
      // 模拟自动播报
      setTimeout(() => {
        ElMessage.success(`自动播报：${info.phone}`)
      }, 1000)
    } else {
      routeInfo.value = null
      ElMessage.warning('未找到该公交路线信息')
    }
  } catch (error) {
    ElMessage.error('查询失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 重置查询
 */
const handleReset = () => {
  searchForm.routeName = ''
  routeInfo.value = null
  smsContent.value = '【福建电信114】'
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
  routeInfo.value = null
  searchForm.routeName = ''
  smsContent.value = '【福建电信114】'
  voiceContent.value = '【福建电信114】'
  ElMessage.info(`已切换至${cityName}，请重新查询`)
}

/**
 * 语音播报
 */
const handleVoiceReport = () => {
  if (!voiceContent.value.trim()) {
    ElMessage.warning('请输入语音报号内容')
    return
  }
  
  loadingVoice.value = true
  setTimeout(() => {
    loadingVoice.value = false
    ElMessage.success('语音播报成功')
  }, 1000)
}

/**
 * 短信发送
 */
const handleSmsReport = () => {
  if (!smsContent.value.trim()) {
    ElMessage.warning('请输入短信报号内容')
    return
  }
  
  loadingSms.value = true
  setTimeout(() => {
    loadingSms.value = false
    ElMessage.success('短信发送成功')
  }, 1500)
}

// ==================== 监听器 ====================
// 监听短信内容长度，超出限制时截断
watch(smsContent, (newVal) => {
  if (newVal.length > SMS_MAX_LENGTH) {
    smsContent.value = newVal.slice(0, SMS_MAX_LENGTH)
    ElMessage.warning(`短信内容不能超过${SMS_MAX_LENGTH}个字符`)
  }
})

// 监听语音内容长度，超出限制时截断
watch(voiceContent, (newVal) => {
  if (newVal.length > VOICE_MAX_LENGTH) {
    voiceContent.value = newVal.slice(0, VOICE_MAX_LENGTH)
    ElMessage.warning(`语音内容不能超过${VOICE_MAX_LENGTH}个字符`)
  }
})
</script>

<style scoped lang="scss">
.bus-route-module {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 56px - 60px);
}

// ==================== 搜索区域 ====================
.search-section {
  background: #fff;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: nowrap;
  
  .search-items {
    display: flex;
    flex-wrap: wrap;
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

// ==================== 信息详情区域 ====================
.info-detail-section {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c; // 红色标题
  border-left: 4px solid #f56c6c;
  padding-left: 12px;
}

.info-rows {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
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
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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
  background: #fff;
  border-radius: 4px;
  padding: 60px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  p {
    color: #909399;
    margin-top: 8px;
  }
}

// ==================== 响应式适配 ====================
@media (max-width: 768px) {
  .search-form {
    .route-input {
      width: 100%;
    }
  }
  
  .char-count-tips {
    .divider {
      display: block;
      margin: 8px 0;
      visibility: hidden;
    }
  }
}
</style>
