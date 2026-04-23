/**
 * 更新说明 GitHub 存储服务
 * 使用 GitHub API 直接读写仓库中的 JSON 文件
 * 实现跨浏览器、跨用户的数据共享
 */

import type { UpdateNoteItem, ServiceResponse } from '../types/updateNotes'

// GitHub 配置 - 复用 PageInstruction 的配置
const GITHUB_CONFIG = {
  token: import.meta.env.VITE_GITHUB_TOKEN || '',
  owner: 'linlin199711',
  repo: 'haobai',
  branch: 'main',
  path: 'update-notes'
}

// 文件名
const FILENAME = 'update-notes-data.json'

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
 * 从 GitHub 读取更新说明数据
 */
export const getUpdateNotesFromGitHub = async (
): Promise<ServiceResponse<UpdateNoteItem[]>> => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}/${FILENAME}?ref=${GITHUB_CONFIG.branch}`

    console.log('[UpdateNotes] 正在从 GitHub 读取:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'UpdateNotesApp'
      }
    })

    if (response.status === 404) {
      console.log('[UpdateNotes] 文件不存在，返回空数组')
      // 文件不存在，返回空数组
      return { success: true, data: [] }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[UpdateNotes] GitHub API 错误:', response.status, errorText)
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const fileData = await response.json()

    // Base64 解码内容
    const content = JSON.parse(decodeBase64(fileData.content))

    console.log('[UpdateNotes] 成功读取 GitHub 文件，记录数:', content.length || 0)

    return {
      success: true,
      data: content,
      sha: fileData.sha
    }
  } catch (error: any) {
    console.error('[UpdateNotes] 从 GitHub 读取失败:', error)
    return {
      success: true,
      data: [],
      message: '从 GitHub 读取失败，显示空列表'
    }
  }
}

/**
 * 保存更新说明数据到 GitHub
 * @param notes 更新说明列表
 * @param sha 现有文件的 sha（更新时需要）
 */
export const saveUpdateNotesToGitHub = async (
  notes: UpdateNoteItem[],
  sha?: string
): Promise<ServiceResponse<UpdateNoteItem[]>> => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}/${FILENAME}`

    console.log('[UpdateNotes] 正在保存到 GitHub:', url)

    // 如果没有提供 sha，尝试获取现有文件的 sha
    let fileSha = sha
    if (!fileSha) {
      try {
        const getResponse = await fetch(`${url}?ref=${GITHUB_CONFIG.branch}`, {
          method: 'GET',
          headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'UpdateNotesApp'
          }
        })

        if (getResponse.ok) {
          const fileData = await getResponse.json()
          fileSha = fileData.sha
          console.log('[UpdateNotes] 获取到现有文件 sha:', fileSha)
        }
      } catch (err) {
        console.log('[UpdateNotes] 文件不存在，将创建新文件')
      }
    }

    // Base64 编码
    const contentBase64 = encodeBase64(JSON.stringify(notes, null, 2))

    // 创建或更新文件
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'UpdateNotesApp'
      },
      body: JSON.stringify({
        message: `Update update notes: ${notes.length} records (${new Date().toLocaleString('zh-CN')})`,
        content: contentBase64,
        sha: fileSha || undefined,
        branch: GITHUB_CONFIG.branch,
        committer: {
          name: 'Update Notes Bot',
          email: 'update-notes@example.com'
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[UpdateNotes] GitHub API 保存错误:', errorData)
      throw new Error(errorData.message || `保存失败: ${response.status}`)
    }

    const result = await response.json()

    console.log('[UpdateNotes] 成功保存到 GitHub')

    return {
      success: true,
      data: notes,
      sha: result.content.sha
    }
  } catch (error: any) {
    console.error('[UpdateNotes] 保存到 GitHub 失败:', error)
    return {
      success: false,
      message: error.message || '保存到 GitHub 失败，请检查网络连接和 Token 权限'
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
        'User-Agent': 'UpdateNotesApp'
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
