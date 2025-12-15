/**
 * 提示词生成器
 * 基于prompt.md模板生成儿童识字小报的AI绘图提示词
 */

class PromptGenerator {
  /**
   * 生成完整提示词
   * @param {string} theme - 主题/场景
   * @param {string} title - 小报标题
   * @param {Object} vocabulary - 词汇对象 { coreRoles, commonItems, environment }
   * @returns {string} 生成的提示词（Markdown格式）
   */
  static generatePrompt(theme, title, vocabulary) {
    if (!theme || !title) {
      throw new Error('主题和标题不能为空')
    }

    // 格式化词汇列表
    const formattedVocabulary = this.formatVocabularyForPrompt(vocabulary)

    // 构建提示词模板（基于prompt.md）
    const prompt = `请生成一张儿童识字小报《${theme}》，竖版 A4，学习插画版式，适合学习英文与看图识物。

# 一、小报标题区（顶部）

**顶部居中大标题**：《${title}》
* **风格**：手绘海报、哈利波特魔法风格
* **文本要求**：大字、醒目、卡通手写体、彩色描边
* **装饰**：周围添加与 ${theme} 相关的贴纸风装饰，颜色鲜艳

# 二、小报主体（中间主画面）

画面中心是一幅 **卡通插画风的「${theme}」场景**：
* **整体气氛**：明亮、温暖、积极
* **构图**：物体边界清晰，方便对应文字，不要过于拥挤。

**场景分区与核心内容**
1.  **核心区域 A（主要对象）**：表现 ${theme} 的核心活动。
2.  **核心区域 B（配套设施）**：展示相关的工具或物品。
3.  **核心区域 C（环境背景）**：体现环境特征（如墙面、指示牌等）。

**主题人物**
* **角色**：1 位可爱卡通人物（职业/身份：与 ${theme} 匹配）。
* **动作**：正在进行与场景相关的自然互动。

# 三、必画物体与识字清单（Generated Content）

**请务必在画面中清晰绘制以下物体，并为其预留贴标签的位置：**

**1. 核心角色与设施：**
${formattedVocabulary.coreRoles}

**2. 常见物品/工具：**
${formattedVocabulary.commonItems}

**3. 环境与装饰：**
${formattedVocabulary.environment}

*(注意：画面中的物体数量不限于此，但以上列表必须作为重点描绘对象)*

# 四、识字标注规则

对上述清单中的物体，贴上中文识字标签：
* **格式**：两行制（第一行英文单词，第二行汉字翻译）。
* **样式**：彩色小贴纸风格，白底黑字或深色字，清晰可读。
* **排版**：标签靠近对应的物体，不遮挡主体。

# 五、画风参数
* **风格**：Mary GrandPré style
* **色彩**：warm amber and gold palette, soft pastel texture, magical swirling stars, cozy fireplace lighting, whimsical art, jewel tones, storybook illustration.
* **质量**：8k resolution, high detail, vector illustration style, clean lines.`

    return prompt
  }

  /**
   * 格式化词汇用于提示词
   * @param {Object} vocabulary - 词汇对象
   * @returns {Object} 格式化后的词汇文本
   */
  static formatVocabularyForPrompt(vocabulary) {
    return {
      coreRoles: this.formatVocabularyList(vocabulary.coreRoles || []),
      commonItems: this.formatVocabularyList(vocabulary.commonItems || []),
      environment: this.formatVocabularyList(vocabulary.environment || []),
    }
  }

  /**
   * 格式化单个词汇列表
   * @param {Array} items - 词汇数组 [{ english, chinese }]
   * @returns {string} 格式化后的文本
   */
  static formatVocabularyList(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return '(暂无词汇)'
    }

    return items
      .map(item => {
        if (!item.english && !item.chinese) {
          return ''
        }
        return `${item.english} ${item.chinese}`
      })
      .filter(text => text.trim() !== '')
      .join(', ')
  }

  /**
   * 获取提示词统计信息
   * @param {string} prompt - 生成的提示词
   * @returns {Object} 统计信息
   */
  static getPromptStats(prompt) {
    if (!prompt) {
      return {
        length: 0,
        lines: 0,
        sections: 0,
        wordCount: 0,
      }
    }

    const lines = prompt.split('\n').length
    const wordCount = prompt.split(/\s+/).length
    const sections = (prompt.match(/# /g) || []).length

    return {
      length: prompt.length,
      lines,
      sections,
      wordCount,
    }
  }

  /**
   * 验证提示词是否完整
   * @param {string} prompt - 生成的提示词
   * @returns {Object} 验证结果 { isValid: boolean, errors: Array }
   */
  static validatePrompt(prompt) {
    const errors = []

    if (!prompt || prompt.trim() === '') {
      errors.push('提示词不能为空')
    }

    if (prompt && prompt.length < 100) {
      errors.push('提示词过短，可能不完整')
    }

    // 检查必需部分
    const requiredSections = [
      '小报标题区',
      '小报主体',
      '必画物体与识字清单',
      '识字标注规则',
      '画风参数',
    ]

    for (const section of requiredSections) {
      if (!prompt.includes(section)) {
        errors.push(`缺少必需部分: ${section}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * 优化提示词（添加更多细节）
   * @param {string} prompt - 原始提示词
   * @param {Object} options - 优化选项
   * @returns {string} 优化后的提示词
   */
  static optimizePrompt(prompt, options = {}) {
    let optimized = prompt

    // 添加细节级别
    if (options.detailLevel === 'high') {
      optimized = optimized.replace(
        '8k resolution, high detail, vector illustration style, clean lines.',
        '8k resolution, ultra high detail, intricate vector illustration style, extremely clean lines, professional quality.'
      )
    }

    // 添加风格增强
    if (options.enhanceStyle) {
      optimized = optimized.replace(
        'Mary GrandPré style',
        'Mary GrandPré style, Harry Potter book cover illustration style'
      )
    }

    // 添加照明效果
    if (options.enhanceLighting) {
      optimized = optimized.replace(
        'cozy fireplace lighting',
        'cozy fireplace lighting, cinematic lighting, soft shadows, gentle highlights'
      )
    }

    return optimized
  }

  /**
   * 为特定AI模型调整提示词
   * @param {string} prompt - 原始提示词
   * @param {string} model - AI模型名称
   * @returns {string} 调整后的提示词
   */
  static adaptPromptForModel(prompt, model) {
    let adapted = prompt

    switch (model.toLowerCase()) {
      case 'nano-banana-pro':
        // Nano Banana Pro 不需要特殊调整
        break
      case 'dall-e':
        adapted = adapted.replace(/^请生成一张/, 'Generate a ')
        adapted = adapted.replace(/竖版 A4/, 'vertical A4 format')
        break
      case 'midjourney':
        adapted = 'Children\'s English learning poster: ' + adapted.substring(0, 100) + ' --style raw --ar 2:3'
        break
      case 'stable-diffusion':
        // SD 需要更简洁的提示词
        adapted = adapted.split('\n').slice(0, 20).join('\n')
        break
      default:
        // 保持原样
        break
    }

    return adapted
  }
}

export default PromptGenerator