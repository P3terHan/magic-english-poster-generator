import { useState, useCallback } from 'react'
import VocabularyService from '../services/vocabularyService'

/**
 * 词汇联想自定义Hook
 */
export function useVocabulary() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * 根据主题获取词汇
   */
  const getVocabularyByTheme = useCallback(async (theme) => {
    if (!theme || theme.trim() === '') {
      setError('主题不能为空')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const vocabulary = VocabularyService.getVocabularyByTheme(theme)
      return vocabulary
    } catch (err) {
      setError(err.message || '获取词汇失败')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 获取所有可用主题
   */
  const getAvailableThemes = useCallback(() => {
    return VocabularyService.getAvailableThemes()
  }, [])

  /**
   * 添加自定义词汇
   */
  const addCustomWord = useCallback((currentVocabulary, category, newWord) => {
    return VocabularyService.addCustomWord(currentVocabulary, category, newWord)
  }, [])

  /**
   * 删除词汇
   */
  const removeWord = useCallback((currentVocabulary, category, index) => {
    return VocabularyService.removeWord(currentVocabulary, category, index)
  }, [])

  /**
   * 更新词汇
   */
  const updateWord = useCallback((currentVocabulary, category, index, updatedWord) => {
    return VocabularyService.updateWord(currentVocabulary, category, index, updatedWord)
  }, [])

  /**
   * 获取词汇统计
   */
  const getVocabularyStats = useCallback((vocabulary) => {
    return VocabularyService.getVocabularyStats(vocabulary)
  }, [])

  return {
    loading,
    error,
    getVocabularyByTheme,
    getAvailableThemes,
    addCustomWord,
    removeWord,
    updateWord,
    getVocabularyStats,
  }
}