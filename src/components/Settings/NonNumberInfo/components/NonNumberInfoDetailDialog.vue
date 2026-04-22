/**
 * 非号码信息详情弹窗
 * @description 展示非号码信息完整详情，区分公交路线和公交集团业务
 * @version 1.0.0
 */

<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="900px"
    :close-on-click-modal="false"
    destroy-on-close
    class="non-number-detail-dialog"
    @closed="handleClosed"
  >
    <el-skeleton :rows="10" animated v-if="!data" />

    <div v-else class="detail-content">
      <!-- 基础信息 -->
      <div class="detail-section">
        <div class="section-title">
          <el-icon><Document /></el-icon>
          基础信息
        </div>
        <el-descriptions :column="2" border class="info-descriptions">
          <el-descriptions-item label="信息标题">
            {{ data.infoTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="业务类型">
            <el-tag :type="data.businessType === 'bus_route' ? 'success' : 'primary'">
              {{ data.businessType === 'bus_route' ? '公交路线' : '公交集团' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :color="getAuditStatusColor(data.auditStatus)" effect="dark">
              {{ getAuditStatusLabel(data.auditStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="信息来源">
            {{ getInfoSourceLabel(data.infoSource) }}
          </el-descriptions-item>
          <el-descriptions-item label="信息精度">
            <el-rate
              v-model="infoPrecisionRate"
              disabled
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            />
          </el-descriptions-item>
          <el-descriptions-item label="行业类型">
            {{ getIndustryTypeLabel(data.industryType) }}
          </el-descriptions-item>
          <el-descriptions-item label="信息类型">
            {{ getInfoTypeLabel(data.infoType) }}
          </el-descriptions-item>
          <el-descriptions-item label="查询模式">
            {{ data.queryMode === 'exact' ? '精确查询' : '模糊查询' }}
          </el-descriptions-item>
          <el-descriptions-item label="采编时间" :span="2">
            {{ data.collectTime }}
          </el-descriptions-item>
          <el-descriptions-item label="有效时间" :span="2">
            {{ data.validStartTime }} 至 {{ data.validEndTime }}
          </el-descriptions-item>
          <el-descriptions-item label="所属地区" :span="2">
            {{ getRegionLabel(data.region) }}
            <el-tag v-if="data.region.includeSubordinate" size="small" class="ml-2">
              含下属地区
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建人">{{ data.creator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ data.createTime }}</el-descriptions-item>
          <el-descriptions-item label="审核人">{{ data.auditor }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ data.auditTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 公交路线详情 -->
      <div v-if="data.businessType === 'bus_route' && data.busRouteInfo" class="detail-section">
        <div class="section-title">
          <el-icon><Van /></el-icon>
          公交路线详情
        </div>
        <el-descriptions :column="2" border class="info-descriptions">
          <el-descriptions-item label="路线名称">
            {{ data.busRouteInfo.routeName }}
          </el-descriptions-item>
          <el-descriptions-item label="路线编号">
            {{ data.busRouteInfo.routeNo }}
          </el-descriptions-item>
          <el-descriptions-item label="起点站">
            <el-tag type="success">{{ data.busRouteInfo.startStation }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="终点站">
            <el-tag type="danger">{{ data.busRouteInfo.endStation }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="运营时间">
            {{ data.busRouteInfo.operatingTime }}
          </el-descriptions-item>
          <el-descriptions-item label="票价">
            {{ data.busRouteInfo.ticketPrice }}
          </el-descriptions-item>
          <el-descriptions-item label="线路类型">
            {{ data.busRouteInfo.routeType }}
          </el-descriptions-item>
          <el-descriptions-item label="发车间隔">
            {{ data.busRouteInfo.intervalTime }}
          </el-descriptions-item>
          <el-descriptions-item label="夜间线路">
            <el-tag :type="data.busRouteInfo.isNightRoute ? 'warning' : 'info'">
              {{ data.busRouteInfo.isNightRoute ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="运营单位">
            {{ data.busRouteInfo.operator }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话" :span="2">
            <el-link type="primary" @click="copyToClipboard(data.busRouteInfo.contactPhone)">
              <el-icon><Phone /></el-icon>
              {{ data.busRouteInfo.contactPhone }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ data.busRouteInfo.remarks }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 站点列表 -->
        <div class="subsection">
          <div class="subsection-title">途经站点</div>
          <div class="station-timeline">
            <div
              v-for="(station, index) in data.busRouteInfo.stationList"
              :key="station.stationId"
              class="station-item"
            >
              <div class="station-marker" :class="{ 'is-transfer': station.isTransfer }">
                {{ index + 1 }}
              </div>
              <div class="station-info">
                <div class="station-name">{{ station.stationName }}</div>
                <div v-if="station.isTransfer && station.transferLines" class="transfer-lines">
                  <el-tag
                    v-for="line in station.transferLines"
                    :key="line"
                    size="small"
                    type="warning"
                    effect="plain"
                    class="transfer-line-tag"
                  >
                    可换乘{{ line }}
                  </el-tag>
                </div>
              </div>
              <div v-if="index < data.busRouteInfo.stationList.length - 1" class="station-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 公交集团详情 -->
      <div v-if="data.businessType === 'bus_group' && data.busGroupInfo" class="detail-section">
        <div class="section-title">
          <el-icon><OfficeBuilding /></el-icon>
          公交集团详情
        </div>
        <el-descriptions :column="2" border class="info-descriptions">
          <el-descriptions-item label="集团名称">
            {{ data.busGroupInfo.groupName }}
          </el-descriptions-item>
          <el-descriptions-item label="集团编码">
            {{ data.busGroupInfo.groupCode }}
          </el-descriptions-item>
          <el-descriptions-item label="详细地址" :span="2">
            {{ data.busGroupInfo.address }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            <el-link type="primary" @click="copyToClipboard(data.busGroupInfo.contactPhone)">
              <el-icon><Phone /></el-icon>
              {{ data.busGroupInfo.contactPhone }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="服务热线">
            <el-link type="primary" @click="copyToClipboard(data.busGroupInfo.serviceHotline)">
              <el-icon><Phone /></el-icon>
              {{ data.busGroupInfo.serviceHotline }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="投诉热线">
            <el-link type="danger" @click="copyToClipboard(data.busGroupInfo.complaintHotline)">
              <el-icon><Phone /></el-icon>
              {{ data.busGroupInfo.complaintHotline }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="官方网站">
            <el-link :href="'https://' + data.busGroupInfo.officialWebsite" target="_blank" type="primary">
              <el-icon><Link /></el-icon>
              {{ data.busGroupInfo.officialWebsite }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="营业时间">
            {{ data.busGroupInfo.businessHours }}
          </el-descriptions-item>
          <el-descriptions-item label="服务范围" :span="2">
            {{ data.busGroupInfo.serviceScope }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ data.busGroupInfo.remarks }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 子公司列表 -->
        <div class="subsection">
          <div class="subsection-title">下属分公司</div>
          <el-table :data="data.busGroupInfo.subCompanies" border stripe size="small">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="companyName" label="分公司名称" min-width="150" />
            <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
            <el-table-column prop="contactPhone" label="联系电话" width="130" align="center">
              <template #default="{ row }">
                <el-link type="primary" @click="copyToClipboard(row.contactPhone)">
                  {{ row.contactPhone }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="responsibleArea" label="负责区域" width="120" align="center" />
          </el-table>
        </div>
      </div>

      <!-- 扩展信息 -->
      <div v-if="data.extendedInfo" class="detail-section">
        <div class="section-title">
          <el-icon><More /></el-icon>
          扩展信息
        </div>
        <div class="extended-info">
          <div class="info-row">
            <span class="label">关键词：</span>
            <el-tag
              v-for="keyword in data.extendedInfo.keywords"
              :key="keyword"
              size="small"
              class="keyword-tag"
            >
              {{ keyword }}
            </el-tag>
          </div>
          <div class="info-row">
            <span class="label">标签：</span>
            <el-tag
              v-for="tag in data.extendedInfo.tags"
              :key="tag"
              size="small"
              type="success"
              effect="plain"
              class="keyword-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div v-if="data.extendedInfo.extraFields" class="info-row">
            <span class="label">其他信息：</span>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item
                v-for="(value, key) in data.extendedInfo.extraFields"
                :key="key"
                :label="key"
              >
                {{ value }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="copyAllInfo">
          <el-icon><CopyDocument /></el-icon>
          复制全部信息
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Van, OfficeBuilding, Phone, Link, More, CopyDocument } from '@element-plus/icons-vue'
import type { NonNumberInfo } from '../types/nonNumberInfo'
import {
  auditStatusOptions,
  infoSourceOptions,
  industryTypeOptions,
  infoTypeOptions,
  cityOptions,
  districtOptions
} from '../mock/nonNumberInfoMock'

interface Props {
  modelValue: boolean
  data: NonNumberInfo | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

// 弹窗可见性
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 弹窗标题
const dialogTitle = computed(() => {
  if (!props.data) return '查看详情'
  return `查看详情 - ${props.data.infoTitle}`
})

// 信息精度星级
const infoPrecisionRate = computed(() => {
  if (!props.data) return 0
  const precisionMap: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1
  }
  return precisionMap[props.data.infoPrecision] || 0
})

// 获取审核状态标签
const getAuditStatusLabel = (status: string): string => {
  const item = auditStatusOptions.find(opt => opt.value === status)
  return item?.label || status
}

// 获取审核状态颜色
const getAuditStatusColor = (status: string): string => {
  const item = auditStatusOptions.find(opt => opt.value === status)
  return item?.color || ''
}

// 获取信息来源标签
const getInfoSourceLabel = (value: string): string => {
  const item = infoSourceOptions.find(opt => opt.value === value)
  return item?.label || value
}

// 获取行业类型标签
const getIndustryTypeLabel = (value: string): string => {
  const item = industryTypeOptions.find(opt => opt.value === value)
  return item?.label || value
}

// 获取信息类型标签
const getInfoTypeLabel = (value: string): string => {
  const item = infoTypeOptions.find(opt => opt.value === value)
  return item?.label || value
}

// 获取地区标签
const getRegionLabel = (region: NonNumberInfo['region']): string => {
  const city = cityOptions.find(c => c.value === region.city)
  const district = districtOptions.find(d => d.value === region.district)
  let label = city?.label || ''
  if (district) {
    label += ` ${district.label}`
  }
  return label
}

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`已复制: ${text}`)
  }).catch(() => {
    // 降级方案
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage.success(`已复制: ${text}`)
  })
}

// 复制全部信息
const copyAllInfo = () => {
  if (!props.data) return
  
  let infoText = `【${props.data.infoTitle}】\n`
  infoText += `业务类型：${props.data.businessType === 'bus_route' ? '公交路线' : '公交集团'}\n`
  infoText += `审核状态：${getAuditStatusLabel(props.data.auditStatus)}\n`
  infoText += `采编时间：${props.data.collectTime}\n`
  infoText += `有效时间：${props.data.validStartTime} 至 ${props.data.validEndTime}\n`
  infoText += `所属地区：${getRegionLabel(props.data.region)}\n`

  if (props.data.businessType === 'bus_route' && props.data.busRouteInfo) {
    infoText += `\n【路线信息】\n`
    infoText += `路线：${props.data.busRouteInfo.routeName}\n`
    infoText += `起点：${props.data.busRouteInfo.startStation}\n`
    infoText += `终点：${props.data.busRouteInfo.endStation}\n`
    infoText += `运营时间：${props.data.busRouteInfo.operatingTime}\n`
    infoText += `票价：${props.data.busRouteInfo.ticketPrice}\n`
    infoText += `联系电话：${props.data.busRouteInfo.contactPhone}\n`
  }

  if (props.data.businessType === 'bus_group' && props.data.busGroupInfo) {
    infoText += `\n【集团信息】\n`
    infoText += `集团：${props.data.busGroupInfo.groupName}\n`
    infoText += `地址：${props.data.busGroupInfo.address}\n`
    infoText += `联系电话：${props.data.busGroupInfo.contactPhone}\n`
    infoText += `服务热线：${props.data.busGroupInfo.serviceHotline}\n`
    infoText += `营业时间：${props.data.busGroupInfo.businessHours}\n`
  }

  copyToClipboard(infoText)
}

// 弹窗关闭处理
const handleClosed = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.non-number-detail-dialog {
  :deep(.el-dialog__body) {
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px;
  }
}

.detail-content {
  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #409eff;

      .el-icon {
        font-size: 18px;
        color: #409eff;
      }
    }

    .info-descriptions {
      margin-bottom: 16px;
    }

    .subsection {
      margin-top: 16px;

      .subsection-title {
        font-size: 14px;
        font-weight: 500;
        color: #606266;
        margin-bottom: 12px;
        padding-left: 8px;
        border-left: 3px solid #67c23a;
      }
    }
  }
}

// 站点时间线样式
.station-timeline {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  .station-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative;
    padding-bottom: 16px;

    &:last-child {
      padding-bottom: 0;

      .station-line {
        display: none;
      }
    }

    .station-marker {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #409eff;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      flex-shrink: 0;
      z-index: 1;

      &.is-transfer {
        background: #e6a23c;
      }
    }

    .station-info {
      flex: 1;
      padding-top: 4px;

      .station-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }

      .transfer-lines {
        margin-top: 4px;

        .transfer-line-tag {
          margin-right: 4px;
          margin-bottom: 4px;
        }
      }
    }

    .station-line {
      position: absolute;
      left: 13px;
      top: 28px;
      width: 2px;
      height: calc(100% - 12px);
      background: #dcdfe6;
    }
  }
}

// 扩展信息样式
.extended-info {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  .info-row {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      margin-right: 8px;
    }

    .keyword-tag {
      margin-right: 8px;
      margin-bottom: 4px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
