/**
 * GitHub 存储服务
 * 使用 GitHub API 直接读写仓库中的 JSON 文件
 * 实现跨浏览器、跨用户的数据共享
 */

import type { PageInstruction, ServiceResponse } from '../types/pageInstruction'
import { getDefaultPageInstruction } from './defaultContent'

// GitHub 配置
// Token 从环境变量读取，构建时通过 GitHub Actions Secrets 注入
const GITHUB_CONFIG = {
  token: import.meta.env.VITE_GITHUB_TOKEN || '',
  owner: 'linlin199711',
  repo: 'haobai',
  branch: 'main',
  path: 'page-instruction'
}

/**
 * Base64 编码（支持中文）
 */
const encodeBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)))
}

/**
 * Base64 解码（支持中文）
 */
const decodeBase64 = (str: string): string => {
  return decodeURIComponent(escape(atob(str)))
}

/**
 * 从 GitHub 读取页面说明
 * @param pageId 页面唯一标识
 * @param pageTitle 页面标题
 */
export const getPageInstructionFromGitHub = async (
  pageId: string,
  pageTitle: string
): Promise<ServiceResponse<PageInstruction>> => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}/${pageId}.json?ref=${GITHUB_CONFIG.branch}`
    
    console.log('正在从 GitHub 读取:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PageInstructionApp'
      }
    })

    if (response.status === 404) {
      console.log('文件不存在，返回默认内容:', pageId)
      // 文件不存在，返回默认内容
      const defaultContent = getDefaultPageInstruction(pageId, pageTitle)
      return { success: true, data: defaultContent }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API 错误:', response.status, errorText)
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const fileData = await response.json()
    
    // Base64 解码内容
    const content = JSON.parse(decodeBase64(fileData.content))
    
    console.log('成功读取 GitHub 文件:', pageId)
    
    return {
      success: true,
      data: {
        ...content,
        sha: fileData.sha // 保存 sha 用于后续更新
      }
    }
  } catch (error: any) {
    console.error('从 GitHub 读取失败:', error)
    // 读取失败返回默认内容
    const defaultContent = getDefaultPageInstruction(pageId, pageTitle)
    return { 
      success: true, 
      data: defaultContent,
      message: '从 GitHub 读取失败，显示默认内容'
    }
  }
}

/**
 * 保存页面说明到 GitHub
 * @param pageId 页面唯一标识
 * @param pageTitle 页面标题
 * @param content 富文本内容
 * @param sha 现有文件的 sha（更新时需要）
 */
export const savePageInstructionToGitHub = async (
  pageId: string,
  pageTitle: string,
  content: string,
  sha?: string
): Promise<ServiceResponse<PageInstruction>> => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}/${pageId}.json`
    
    console.log('正在保存到 GitHub:', url)
    
    // 如果没有提供 sha，尝试获取现有文件的 sha
    let fileSha = sha
    if (!fileSha) {
      try {
        const getResponse = await fetch(`${url}?ref=${GITHUB_CONFIG.branch}`, {
          method: 'GET',
          headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PageInstructionApp'
          }
        })
        
        if (getResponse.ok) {
          const fileData = await getResponse.json()
          fileSha = fileData.sha
          console.log('获取到现有文件 sha:', fileSha)
        }
      } catch (err) {
        console.log('文件不存在，将创建新文件')
      }
    }

    // 准备数据
    const data: PageInstruction = {
      pageId,
      pageTitle,
      content,
      updateTime: new Date().toISOString()
    }
    
    // Base64 编码
    const contentBase64 = encodeBase64(JSON.stringify(data, null, 2))

    // 创建或更新文件
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'PageInstructionApp'
      },
      body: JSON.stringify({
        message: `Update page instruction: ${pageTitle} (${new Date().toLocaleString('zh-CN')})`,
        content: contentBase64,
        sha: fileSha || undefined,
        branch: GITHUB_CONFIG.branch,
        committer: {
          name: 'Page Instruction Bot',
          email: 'page-instruction@example.com'
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API 保存错误:', errorData)
      throw new Error(errorData.message || `保存失败: ${response.status}`)
    }

    const result = await response.json()
    
    console.log('成功保存到 GitHub:', pageId)
    
    return {
      success: true,
      data: {
        ...data,
        sha: result.content.sha
      }
    }
  } catch (error: any) {
    console.error('保存到 GitHub 失败:', error)
    return {
      success: false,
      message: error.message || '保存到 GitHub 失败，请检查网络连接和 Token 权限'
    }
  }
}

/**
 * 删除 GitHub 上的页面说明文件
 * @param pageId 页面唯一标识
 * @param sha 文件 sha
 */
export const deletePageInstructionFromGitHub = async (
  pageId: string,
  sha: string
): Promise<ServiceResponse<void>> => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}/${pageId}.json`
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'PageInstructionApp'
      },
      body: JSON.stringify({
        message: `Delete page instruction: ${pageId}`,
        sha: sha,
        branch: GITHUB_CONFIG.branch
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `删除失败: ${response.status}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('从 GitHub 删除失败:', error)
    return {
      success: false,
      message: error.message || '删除失败'
    }
  }
}

/**
 * 获取 GitHub API 限流状态
 */
export const getGitHubRateLimit = async (): Promise<ServiceResponse<{ remaining: number; limit: number }>> => {
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'User-Agent': 'PageInstructionApp'
      }
    })

    if (!response.ok) {
      throw new Error('获取限流状态失败')
    }

    const data = await response.json()
    return {
      success: true,
      data: {
        remaining: data.resources.core.remaining,
        limit: data.resources.core.limit
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}
