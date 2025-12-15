import { useState, useCallback, useRef } from 'react'
import NanoBananaApi from '../services/api'

/**
 * API集成自定义Hook
 */
export function useApi(apiKey) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const apiRef = useRef(null)

  // 初始化API实例
  const getApiInstance = useCallback(() => {
    if (!apiKey) {
      // 返回一个模拟API实例，所有方法都会提示需要API密钥
      return {
        apiKey: '',
        validateApiKey: async () => ({ isValid: false, message: '请先输入API密钥' }),
        generatePoster: async () => { throw new Error('请先输入API密钥') },
        createTask: async () => { throw new Error('请先输入API密钥') },
        getTaskStatus: async () => { throw new Error('请先输入API密钥') },
        pollTaskStatus: async () => { throw new Error('请先输入API密钥') },
      }
    }

    if (!apiRef.current || apiRef.current.apiKey !== apiKey) {
      apiRef.current = new NanoBananaApi(apiKey)
    }

    return apiRef.current
  }, [apiKey])

  /**
   * 验证API密钥
   */
  const validateApiKey = useCallback(async () => {
    if (!apiKey) {
      return { isValid: false, message: 'API密钥不能为空' }
    }

    setLoading(true)
    setError(null)

    try {
      const api = getApiInstance()
      const isValid = await api.validateApiKey()
      return {
        isValid,
        message: isValid ? 'API密钥有效' : 'API密钥无效',
      }
    } catch (err) {
      return {
        isValid: false,
        message: err.message || '验证API密钥失败',
      }
    } finally {
      setLoading(false)
    }
  }, [apiKey, getApiInstance])

  /**
   * 生成图像
   */
  const generateImage = useCallback(async (prompt, options = {}) => {
    if (!apiKey) {
      throw new Error('请先设置API密钥')
    }

    if (!prompt || prompt.trim() === '') {
      throw new Error('提示词不能为空')
    }

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const api = getApiInstance()

      // 模拟进度更新（实际应用中可以根据轮询状态更新）
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 1000)

      const result = await api.generatePoster(prompt, options)

      clearInterval(progressInterval)
      setProgress(100)

      return result
    } catch (err) {
      setError(err.message || '生成图像失败')
      throw err
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [apiKey, getApiInstance])

  /**
   * 创建任务（不等待完成）
   */
  const createTask = useCallback(async (prompt, options = {}) => {
    if (!apiKey) {
      throw new Error('请先设置API密钥')
    }

    setLoading(true)
    setError(null)

    try {
      const api = getApiInstance()
      const result = await api.createTask(prompt, options)
      return result
    } catch (err) {
      setError(err.message || '创建任务失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiKey, getApiInstance])

  /**
   * 查询任务状态
   */
  const getTaskStatus = useCallback(async (taskId) => {
    if (!apiKey) {
      throw new Error('请先设置API密钥')
    }

    if (!taskId) {
      throw new Error('任务ID不能为空')
    }

    setLoading(true)
    setError(null)

    try {
      const api = getApiInstance()
      const status = await api.getTaskStatus(taskId)
      return status
    } catch (err) {
      setError(err.message || '查询任务状态失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiKey, getApiInstance])

  /**
   * 轮询任务状态直到完成
   */
  const pollTaskStatus = useCallback(async (taskId, options = {}) => {
    if (!apiKey) {
      throw new Error('请先设置API密钥')
    }

    if (!taskId) {
      throw new Error('任务ID不能为空')
    }

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const api = getApiInstance()

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 5
          return newProgress > 95 ? 95 : newProgress
        })
      }, 1000)

      const status = await api.pollTaskStatus(taskId, options)

      clearInterval(progressInterval)
      setProgress(100)

      return status
    } catch (err) {
      setError(err.message || '轮询任务状态失败')
      throw err
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [apiKey, getApiInstance])

  /**
   * 获取支持的参数选项
   */
  const getSupportedOptions = useCallback(() => {
    return NanoBananaApi.getSupportedOptions()
  }, [])

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    progress,
    validateApiKey,
    generateImage,
    createTask,
    getTaskStatus,
    pollTaskStatus,
    getSupportedOptions,
    clearError,
  }
}