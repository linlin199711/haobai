/**
 * JSON 文件存储服务
 * 直接读取项目根目录 /page-instruction/ 下的 JSON 文件
 * 前端无法直接写入文件，保存功能需要后端支持
 */

import type { PageInstruction, ServiceResponse, SavePageInstructionParams, ImageUploadResponse } from '../types/pageInstruction'
import { getDefaultPageInstruction } from './defaultContent'

/** JSON 文件基础路径 */
const JSON_BASE_PATH = '/page-instruction'

/**
 * 从 JSON 文件读取页面说明
 * @param pageId 页面唯一标识
 * @param pageTitle 页面标题
 */
export const getPageInstruction = async (
  pageId: string,
  pageTitle: string
): Promise<ServiceResponse<PageInstruction>> => {
  try {
    const filePath = `${JSON_BASE_PATH}/${pageId}.json`

    // 使用 fetch 读取 JSON 文件
    const response = await fetch(filePath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // 确保获取最新内容
      }
    })

    if (response.ok) {
      const data: PageInstruction = await response.json()
      return {
        success: true,
        data
      }
    } else if (response.status === 404) {
      // 文件不存在，返回默认内容
      const defaultContent = getDefaultPageInstruction(pageId, pageTitle)
      return {
        success: true,
        data: defaultContent
      }
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    console.error('读取 JSON 文件失败:', error)
    // 读取失败时返回默认内容
    const defaultContent = getDefaultPageInstruction(pageId, pageTitle)
    return {
      success: true,
      data: defaultContent
    }
  }
}

/**
 * 保存页面说明
 * ⚠️ 注意：纯前端无法直接写入服务器文件
 * 需要后端提供 API 支持，或手动修改 JSON 文件
 */
export const savePageInstruction = async (
  params: SavePageInstructionParams
): Promise<ServiceResponse<PageInstruction>> => {
  // 显示提示信息
  console.warn('保存功能需要后端支持')

  // 返回模拟的成功响应（实际未保存到文件）
  const data: PageInstruction = {
    pageId: params.pageId,
    pageTitle: params.pageTitle,
    content: params.content,
    updateTime: new Date().toISOString()
  }

  return {
    success: true,
    data,
    message: '前端无法直接保存文件，请手动修改 /page-instruction/' + params.pageId + '.json 文件'
  }
}

/**
 * 上传图片
 * 预留接口，可直接对接后端
 * @param file 图片文件
 */
export const uploadImage = async (
  file: File
): Promise<ServiceResponse<ImageUploadResponse>> => {
  try {
    // 模拟图片上传，实际项目中替换为真实上传接口
    const reader = new FileReader()

    return new Promise((resolve) => {
      reader.onload = () => {
        // 返回base64作为模拟URL
        resolve({
          success: true,
          data: {
            url: reader.result as string,
            name: file.name
          }
        })
      }

      reader.onerror = () => {
        resolve({
          success: false,
          message: '图片上传失败'
        })
      }

      reader.readAsDataURL(file)
    })
  } catch (error) {
    console.error('图片上传失败:', error)
    return {
      success: false,
      message: '图片上传失败'
    }
  }
}

/**
 * 重置为默认内容
 * @param pageId 页面唯一标识
 * @param pageTitle 页面标题
 */
export const resetToDefault = async (
  pageId: string,
  pageTitle: string
): Promise<ServiceResponse<PageInstruction>> => {
  try {
    const defaultContent = getDefaultPageInstruction(pageId, pageTitle)

    // 注意：这只是在内存中重置，不会写入文件
    return {
      success: true,
      data: defaultContent,
      message: '已恢复默认内容（未保存到文件）'
    }
  } catch (error) {
    console.error('重置页面说明失败:', error)
    return {
      success: false,
      message: '重置页面说明失败'
    }
  }
}

/**
 * 检查页面说明文件是否存在
 * @param pageId 页面唯一标识
 */
export const checkPageInstructionExists = async (pageId: string): Promise<boolean> => {
  try {
    const filePath = `${JSON_BASE_PATH}/${pageId}.json`
    const response = await fetch(filePath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * 导出所有页面说明
 * 由于直接读取文件，不需要导出功能
 */
export const exportAllToJSON = async (): Promise<ServiceResponse<void>> => {
  return {
    success: false,
    message: '当前使用静态 JSON 文件存储，无需导出'
  }
}

/**
 * 从 JSON 文件导入
 * 由于直接读取文件，不需要导入功能
 */
export const importFromJSON = async (
  file: File
): Promise<ServiceResponse<{ imported: number; failed: number }>> => {
  return {
    success: false,
    message: '当前使用静态 JSON 文件存储，请直接修改 /page-instruction/ 目录下的文件'
  }
}

/**
 * 删除页面说明
 * @param pageId 页面唯一标识
 */
export const deletePageInstruction = async (
  pageId: string
): Promise<ServiceResponse<void>> => {
  return {
    success: false,
    message: '前端无法删除服务器文件，请手动删除 /page-instruction/' + pageId + '.json'
  }
}

/**
 * 获取所有页面说明（用于备份）
 */
export const getAllPageInstructions = async (): Promise<PageInstruction[]> => {
  // 由于直接读取文件，无法枚举所有文件
  // 返回空数组
  return []
}

/**
 * 清空所有页面说明
 */
export const clearAllPageInstructions = async (): Promise<ServiceResponse<void>> => {
  return {
    success: false,
    message: '前端无法清空服务器文件，请手动删除 /page-instruction/ 目录下的文件'
  }
}
