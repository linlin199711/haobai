<template>
  <div class="module-container">
    <div class="module-header">
      <h2>号码本地搜</h2>
      <p>快速查询本地号码信息</p>
    </div>

    <el-card shadow="hover" class="search-card">
      <el-form :inline="true" class="search-form">
        <div class="search-items">
          <el-form-item label="号码">
            <el-input v-model="searchForm.number" placeholder="请输入号码" clearable class="search-input" />
          </el-form-item>
          <el-form-item label="归属地">
            <el-select v-model="searchForm.location" placeholder="请选择" clearable class="search-input">
              <el-option label="福州" value="fuzhou" />
              <el-option label="厦门" value="xiamen" />
              <el-option label="泉州" value="quanzhou" />
              <el-option label="莆田" value="putian" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="result-card">
      <template #header>
        <div class="card-header">
          <span>查询结果</span>
          <el-tag v-if="searchResult.length > 0" type="success">共 {{ searchResult.length }} 条</el-tag>
        </div>
      </template>

      <el-table v-if="searchResult.length > 0" :data="searchResult" stripe style="width: 100%">
        <el-table-column prop="number" label="号码" width="120" />
        <el-table-column prop="location" label="归属地" width="100" />
        <el-table-column prop="type" label="号码类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === '个人' ? 'primary' : 'success'">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="归属人" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="success" link size="small">外呼</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-else description="请输入查询条件进行搜索" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  number: '',
  location: ''
})

const searchResult = ref<any[]>([])

const handleSearch = () => {
  if (!searchForm.number && !searchForm.location) {
    ElMessage.warning('请输入查询条件')
    return
  }
  // 模拟查询结果
  searchResult.value = [
    { number: '0591-12345678', location: '福州', type: '企业', owner: '某某公司', status: '正常', remark: '重要客户' },
    { number: '13800138001', location: '福州', type: '个人', owner: '张三', status: '正常', remark: '' },
    { number: '0592-87654321', location: '厦门', type: '企业', owner: '某某科技', status: '停机', remark: '欠费停机' },
  ]
  ElMessage.success('查询成功')
}

const resetForm = () => {
  searchForm.number = ''
  searchForm.location = ''
  searchResult.value = []
}
</script>

<style scoped lang="scss">
.module-container {
  padding: 20px;
}

.module-header {
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #909399;
  }
}

.search-card {
  margin-bottom: 20px;
  
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
}

.result-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
