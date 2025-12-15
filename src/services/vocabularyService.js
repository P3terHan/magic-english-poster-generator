import {
  vocabularyDatabase,
  themeKeywordMapping,
  defaultVocabulary,
} from '../data/vocabularyDatabase.js'

/**
 * 词汇联想服务
 * 根据主题/场景自动联想相关的英文词汇
 */

class VocabularyService {
  /**
   * 根据主题获取词汇
   * @param {string} theme - 主题/场景（如："超市"、"医院"、"公园"）
   * @returns {Object} 包含三类词汇的对象：coreRoles, commonItems, environment
   */
  static getVocabularyByTheme(theme) {
    if (!theme || typeof theme !== 'string' || theme.trim() === '') {
      return this.getDefaultVocabulary()
    }

    const normalizedTheme = theme.toLowerCase().trim()

    // 1. 尝试精确匹配数据库中的主题
    const exactMatch = vocabularyDatabase[normalizedTheme]
    if (exactMatch) {
      return this.formatVocabulary(exactMatch)
    }

    // 2. 尝试关键词映射匹配
    const mappedTheme = this.findThemeByKeywordMapping(normalizedTheme)
    if (mappedTheme && vocabularyDatabase[mappedTheme]) {
      return this.formatVocabulary(vocabularyDatabase[mappedTheme])
    }

    // 3. 尝试部分匹配（包含关系）
    const partialMatch = this.findThemeByPartialMatch(normalizedTheme)
    if (partialMatch) {
      return this.formatVocabulary(vocabularyDatabase[partialMatch])
    }

    // 4. 返回默认词汇
    return this.getDefaultVocabulary()
  }

  /**
   * 通过关键词映射查找主题
   * @param {string} input - 输入的主题
   * @returns {string|null} 映射后的主题key或null
   */
  static findThemeByKeywordMapping(input) {
    // 检查中文关键词映射
    for (const [keyword, theme] of Object.entries(themeKeywordMapping)) {
      if (input.includes(keyword.toLowerCase())) {
        return theme
      }
    }
    return null
  }

  /**
   * 通过部分匹配查找主题
   * @param {string} input - 输入的主题
   * @returns {string|null} 匹配的主题key或null
   */
  static findThemeByPartialMatch(input) {
    const themeKeys = Object.keys(vocabularyDatabase)

    for (const themeKey of themeKeys) {
      // 如果输入包含主题关键词或主题关键词包含输入
      if (input.includes(themeKey) || themeKey.includes(input)) {
        return themeKey
      }
    }

    return null
  }

  /**
   * 获取默认词汇
   * @returns {Object} 默认词汇
   */
  static getDefaultVocabulary() {
    return this.formatVocabulary(defaultVocabulary)
  }

  /**
   * 格式化词汇，确保每类词汇数量适中
   * @param {Object} vocab - 原始词汇对象
   * @returns {Object} 格式化后的词汇对象
   */
  static formatVocabulary(vocab) {
    return {
      coreRoles: this.limitItems(vocab.coreRoles, 5),      // 最多5个核心角色
      commonItems: this.limitItems(vocab.commonItems, 8),  // 最多8个常见物品
      environment: this.limitItems(vocab.environment, 5),  // 最多5个环境装饰
    }
  }

  /**
   * 限制数组项数
   * @param {Array} items - 原始数组
   * @param {number} maxCount - 最大数量
   * @returns {Array} 限制后的数组
   */
  static limitItems(items, maxCount) {
    if (!Array.isArray(items)) {
      return []
    }
    return items.slice(0, maxCount)
  }

  /**
   * 获取所有可用主题列表
   * @returns {Array} 主题列表
   */
  static getAvailableThemes() {
    return Object.keys(vocabularyDatabase).map(key => ({
      id: key,
      name: this.getThemeDisplayName(key),
      description: this.getThemeDescription(key),
    }))
  }

  /**
   * 获取主题显示名称
   * @param {string} themeKey - 主题key
   * @returns {string} 显示名称
   */
  static getThemeDisplayName(themeKey) {
    const displayNames = {
      supermarket: '超市',
      hospital: '医院',
      park: '公园',
      school: '学校',
      zoo: '动物园',
      beach: '海滩',
      farm: '农场',
      restaurant: '餐厅',
      library: '图书馆',
      amusementpark: '游乐园',
    }
    return displayNames[themeKey] || themeKey
  }

  /**
   * 获取主题描述
   * @param {string} themeKey - 主题key
   * @returns {string} 描述
   */
  static getThemeDescription(themeKey) {
    const descriptions = {
      supermarket: '购物场景，学习食品和日常用品词汇',
      hospital: '医疗场景，学习医疗相关词汇',
      park: '户外场景，学习自然和娱乐词汇',
      school: '学习场景，学习学校和教育词汇',
      zoo: '动物场景，学习动物和自然词汇',
      beach: '海滨场景，学习海洋和度假词汇',
      farm: '农业场景，学习农场和动物词汇',
      restaurant: '餐饮场景，学习食物和餐具词汇',
      library: '阅读场景，学习书籍和学习词汇',
      amusementpark: '娱乐场景，学习游乐设施和娱乐词汇',
    }
    return descriptions[themeKey] || '儿童学习场景'
  }

  /**
   * 添加自定义词汇
   * @param {Object} currentVocabulary - 当前词汇
   * @param {string} category - 类别（coreRoles/commonItems/environment）
   * @param {Object} newWord - 新词汇 { english: '', chinese: '' }
   * @returns {Object} 更新后的词汇
   */
  static addCustomWord(currentVocabulary, category, newWord) {
    if (!currentVocabulary[category]) {
      currentVocabulary[category] = []
    }

    return {
      ...currentVocabulary,
      [category]: [...currentVocabulary[category], newWord],
    }
  }

  /**
   * 删除词汇
   * @param {Object} currentVocabulary - 当前词汇
   * @param {string} category - 类别
   * @param {number} index - 索引
   * @returns {Object} 更新后的词汇
   */
  static removeWord(currentVocabulary, category, index) {
    if (!currentVocabulary[category] || index < 0 || index >= currentVocabulary[category].length) {
      return currentVocabulary
    }

    return {
      ...currentVocabulary,
      [category]: currentVocabulary[category].filter((_, i) => i !== index),
    }
  }

  /**
   * 更新词汇
   * @param {Object} currentVocabulary - 当前词汇
   * @param {string} category - 类别
   * @param {number} index - 索引
   * @param {Object} updatedWord - 更新的词汇
   * @returns {Object} 更新后的词汇
   */
  static updateWord(currentVocabulary, category, index, updatedWord) {
    if (!currentVocabulary[category] || index < 0 || index >= currentVocabulary[category].length) {
      return currentVocabulary
    }

    const newItems = [...currentVocabulary[category]]
    newItems[index] = { ...newItems[index], ...updatedWord }

    return {
      ...currentVocabulary,
      [category]: newItems,
    }
  }

  /**
   * 获取词汇统计
   * @param {Object} vocabulary - 词汇对象
   * @returns {Object} 统计信息
   */
  static getVocabularyStats(vocabulary) {
    const total = Object.values(vocabulary).flat().length
    const coreRolesCount = vocabulary.coreRoles?.length || 0
    const commonItemsCount = vocabulary.commonItems?.length || 0
    const environmentCount = vocabulary.environment?.length || 0

    return {
      total,
      coreRolesCount,
      commonItemsCount,
      environmentCount,
      isComplete: total >= 15, // 建议至少15个词汇
    }
  }
}

export default VocabularyService