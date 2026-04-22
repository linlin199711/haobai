/**
 * 文件存储服务
 * 使用 IndexedDB 实现类文件系统的持久化存储
 * 支持 JSON 文件的导出和导入
 */

import type { PageInstruction, ServiceResponse } from '../types/pageInstruction'
import { getDefaultPageInstruction } from './defaultContent'

const DB_NAME = 'PageInstructionDB'
const DB_VERSION = 1
const STORE_NAME = 'pageInstructions'

// IndexedDB 实例
let dbInstance: IDBDatabase | null = null

/**
 * 初始化 IndexedDB
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // 创建对象存储，以 pageId 作为主键
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'pageId' })
        store.createIndex('updateTime', 'updateTime', { unique: false })
      }
    }
  })
}

/**
 * 获取页面说明（从 IndexedDB）
 * 如果文件不存在，自动创建并返回默认内容
 */
export const getPageInstructionFromFile = async (
  pageId: string,
  pageTitle: string
): Promise<ServiceResponse<PageInstruction>> => {
  try {
    const db = await initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(pageId)

      request.onsuccess = () => {
        if (request.result) {
          // 文件存在，返回内容
          resolve({
            success: true,
            data: request.result as PageInstruction
          })
        } else {
          // 文件不存在，创建默认内容
          const defaultContent = getDefaultPageInstruction(pageId, pageTitle)
          
          // 异步保存默认内容
          savePageInstructionToFile(
            pageId,
            pageTitle,
            defaultContent.content
          ).then(() => {
            resolve({
              success: true,
              data: defaultContent
            })
          }).catch((err) => {
            reject(err)
          })
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('从文件读取页面说明失败:', error)
    return {
      success: false,
      message: '读取页面说明文件失败'
    }
  }
}

/**
 * 保存页面说明（到 IndexedDB）
 */
export const savePageInstructionToFile = async (
  pageId: string,
  pageTitle: string,
  content: string
): Promise<ServiceResponse<PageInstruction>> => {
  try {
    const db = await initDB()
    
    const data: PageInstruction = {
      pageId,
      pageTitle,
      content,
      updateTime: new Date().toISOString()
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(data)

      request.onsuccess = () => {
        resolve({
          success: true,
          data
        })
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('保存页面说明到文件失败:', error)
    return {
      success: false,
      message: '保存页面说明文件失败'
    }
  }
}

/**
 * 删除页面说明文件
 */
export const deletePageInstructionFile = async (
  pageId: string
): Promise<ServiceResponse<void>> => {
  try {
    const db = await initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(pageId)

      request.onsuccess = () => {
        resolve({ success: true })
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('删除页面说明文件失败:', error)
    return {
      success: false,
      message: '删除页面说明文件失败'
    }
  }
}

/**
 * 获取所有页面说明（用于导出）
 */
export const getAllPageInstructions = async (): Promise<PageInstruction[]> => {
  try {
    const db = await initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result as PageInstruction[])
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('获取所有页面说明失败:', error)
    return []
  }
}

/**
 * 导出所有页面说明为 JSON 文件
 */
export const exportAllToJSON = async (): Promise<ServiceResponse<void>> => {
  try {
    const allData = await getAllPageInstructions()
    
    const exportData = {
      exportTime: new Date().toISOString(),
      version: '1.0',
      totalCount: allData.length,
      data: allData
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `page-instructions-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error('导出 JSON 文件失败:', error)
    return {
      success: false,
      message: '导出 JSON 文件失败'
    }
  }
}

/**
 * 从 JSON 文件导入页面说明
 */
export const importFromJSON = async (
  file: File
): Promise<ServiceResponse<{ imported: number; failed: number }>> => {
  try {
    const text = await file.text()
    const jsonData = JSON.parse(text)
    
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      return {
        success: false,
        message: '无效的 JSON 文件格式'
      }
    }

    const db = await initDB()
    let imported = 0
    let failed = 0

    for (const item of jsonData.data) {
      if (item.pageId && item.pageTitle && item.content) {
        try {
          await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.put({
              ...item,
              updateTime: new Date().toISOString()
            })
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
          })
          imported++
        } catch {
          failed++
        }
      } else {
        failed++
      }
    }

    return {
      success: true,
      data: { imported, failed }
    }
  } catch (error) {
    console.error('导入 JSON 文件失败:', error)
    return {
      success: false,
      message: '导入 JSON 文件失败，请检查文件格式'
    }
  }
}

/**
 * 清空所有页面说明
 */
export const clearAllPageInstructions = async (): Promise<ServiceResponse<void>> => {
  try {
    const db = await initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => {
        resolve({ success: true })
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('清空页面说明失败:', error)
    return {
      success: false,
      message: '清空页面说明失败'
    }
  }
}
