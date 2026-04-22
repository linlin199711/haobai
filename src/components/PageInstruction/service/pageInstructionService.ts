/**
 * 页面说明服务层 - 统一导出
 * 使用 GitHub API 实现跨浏览器、跨用户数据共享
 */

export {
  getPageInstructionFromGitHub as getPageInstruction,
  savePageInstructionToGitHub as savePageInstruction,
  deletePageInstructionFromGitHub as deletePageInstruction,
  getGitHubRateLimit
} from './githubStorageService'

// 为了保持兼容性，保留原有的图片上传
import type { ImageUploadResponse, ServiceResponse } from '../types/pageInstruction'

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
): Promise<ServiceResponse<import('../types/pageInstruction').PageInstruction>> => {
  try {
    const { getDefaultPageInstruction } = await import('./defaultContent')
    const { savePageInstructionToGitHub } = await import('./githubStorageService')

    const defaultContent = getDefaultPageInstruction(pageId, pageTitle)
    const result = await savePageInstructionToGitHub(
      pageId,
      pageTitle,
      defaultContent.content
    )

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data
      }
    }

    return {
      success: false,
      message: '重置失败'
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
 * 检查页面说明是否存在
 * @param pageId 页面唯一标识
 */
export const checkPageInstructionExists = async (pageId: string): Promise<boolean> => {
  try {
    const { getPageInstructionFromGitHub } = await import('./githubStorageService')
    const result = await getPageInstructionFromGitHub(pageId, '')
    return result.success && !!result.data
  } catch {
    return false
  }
}
