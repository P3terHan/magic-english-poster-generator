import { useState, useCallback } from 'react'
import PromptGenerator from '../services/promptGenerator'

/**
 * 提示词生成自定义Hook
 */
export function usePrompt() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * 生成提示词
   */
  const generatePrompt = useCallback((theme, title, vocabulary) => {
    if (!theme || !title) {
      setError('主题和标题不能为空')
      return ''
    }

    setLoading(true)
    setError(null)

    try {
      const prompt = PromptGenerator.generatePrompt(theme, title, vocabulary)
      return prompt
    } catch (err) {
      setError(err.message || '生成提示词失败')
      return ''
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 验证提示词
   */
  const validatePrompt = useCallback((prompt) => {
    return PromptGenerator.validatePrompt(prompt)
  }, [])

  /**
   * 获取提示词统计
   */
  const getPromptStats = useCallback((prompt) => {
    return PromptGenerator.getPromptStats(prompt)
  }, [])

  /**
   * 优化提示词
   */
  const optimizePrompt = useCallback((prompt, options) => {
    return PromptGenerator.optimizePrompt(prompt, options)
  }, [])

  /**
   * 为特定模型调整提示词
   */
  const adaptPromptForModel = useCallback((prompt, model) => {
    return PromptGenerator.adaptPromptForModel(prompt, model)
  }, [])

  return {
    loading,
    error,
    generatePrompt,
    validatePrompt,
    getPromptStats,
    optimizePrompt,
    adaptPromptForModel,
  }
}