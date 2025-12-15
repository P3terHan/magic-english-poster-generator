/**
 * Nano Banana Pro API 集成服务
 * 基于 https://api.kie.ai/api/v1/jobs 接口
 */

const API_BASE_URL = 'https://api.kie.ai/api/v1/jobs'

class NanoBananaApi {
  /**
   * 构造函数
   * @param {string} apiKey - API密钥
   */
  constructor(apiKey) {
    this.apiKey = apiKey
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
  }

  /**
   * 创建生成任务
   * @param {string} prompt - 提示词
   * @param {Object} options - 选项
   * @param {Array} options.image_input - 输入图像数组
   * @param {string} options.aspect_ratio - 宽高比
   * @param {string} options.resolution - 分辨率
   * @param {string} options.output_format - 输出格式
   * @param {string} options.callBackUrl - 回调URL
   * @returns {Promise<Object>} 响应数据
   */
  async createTask(prompt, options = {}) {
    const payload = {
      model: 'nano-banana-pro',
      input: {
        prompt: prompt || '',
        image_input: options.image_input || [],
        aspect_ratio: options.aspect_ratio || '1:1',
        resolution: options.resolution || '1K',
        output_format: options.output_format || 'png',
      },
    }

    // 添加回调URL（如果提供）
    if (options.callBackUrl) {
      payload.callBackUrl = options.callBackUrl
    }

    try {
      const response = await fetch(`${API_BASE_URL}/createTask`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API请求失败 (${response.status}): ${errorText}`)
      }

      const result = await response.json()

      if (result.code !== 200) {
        throw new Error(`API返回错误: ${result.msg}`)
      }

      return result.data
    } catch (error) {
      console.error('创建任务失败:', error)
      throw this.normalizeError(error)
    }
  }

  /**
   * 查询任务状态
   * @param {string} taskId - 任务ID
   * @returns {Promise<Object>} 任务状态信息
   */
  async getTaskStatus(taskId) {
    if (!taskId) {
      throw new Error('任务ID不能为空')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recordInfo?taskId=${taskId}`, {
        headers: this.headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`状态查询失败 (${response.status}): ${errorText}`)
      }

      const result = await response.json()

      if (result.code !== 200) {
        throw new Error(`API返回错误: ${result.msg}`)
      }

      return result.data
    } catch (error) {
      console.error('查询任务状态失败:', error)
      throw this.normalizeError(error)
    }
  }

  /**
   * 轮询任务状态直到完成
   * @param {string} taskId - 任务ID
   * @param {Object} options - 轮询选项
   * @param {number} options.interval - 轮询间隔（毫秒，默认2000）
   * @param {number} options.timeout - 超时时间（毫秒，默认300000 = 5分钟）
   * @returns {Promise<Object>} 最终任务结果
   */
  async pollTaskStatus(taskId, options = {}) {
    const interval = options.interval || 2000
    const timeout = options.timeout || 300000
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const currentTime = Date.now()
          if (currentTime - startTime > timeout) {
            reject(new Error(`任务轮询超时 (${timeout}ms)`))
            return
          }

          const status = await this.getTaskStatus(taskId)

          switch (status.state) {
            case 'success':
              resolve(status)
              break
            case 'fail':
              reject(new Error(`任务失败: ${status.failMsg || '未知错误'}`))
              break
            case 'waiting':
            default:
              // 继续轮询
              setTimeout(poll, interval)
              break
          }
        } catch (error) {
          // 网络错误或其他错误，继续尝试
          console.warn('轮询过程中出错，继续尝试:', error.message)
          setTimeout(poll, interval)
        }
      }

      // 开始轮询
      poll()
    })
  }

  /**
   * 生成儿童识字小报图像
   * @param {string} prompt - 提示词
   * @param {Object} options - 生成选项
   * @returns {Promise<Object>} 生成结果
   */
  async generatePoster(prompt, options = {}) {
    try {
      // 1. 创建任务
      const createResult = await this.createTask(prompt, options)
      const taskId = createResult.taskId

      if (!taskId) {
        throw new Error('未获取到任务ID')
      }

      // 2. 轮询任务状态
      const finalStatus = await this.pollTaskStatus(taskId, {
        interval: options.pollInterval || 2000,
        timeout: options.pollTimeout || 300000,
      })

      // 3. 解析结果
      let resultUrls = []
      try {
        const resultJson = JSON.parse(finalStatus.resultJson || '{}')
        resultUrls = resultJson.resultUrls || []
      } catch (e) {
        console.warn('解析结果JSON失败:', e)
      }

      return {
        taskId,
        status: finalStatus.state,
        resultUrls,
        costTime: finalStatus.costTime,
        completeTime: finalStatus.completeTime,
        rawResponse: finalStatus,
      }
    } catch (error) {
      console.error('生成海报失败:', error)
      throw this.normalizeError(error)
    }
  }

  /**
   * 规范化错误信息
   * @param {Error} error - 原始错误
   * @returns {Error} 规范化后的错误
   */
  normalizeError(error) {
    // 处理网络错误
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new Error('网络连接失败，请检查网络设置')
    }

    // 处理认证错误
    if (error.message.includes('401') || error.message.includes('Authentication')) {
      return new Error('API密钥无效或已过期，请检查您的API Key')
    }

    // 处理余额不足
    if (error.message.includes('402') || error.message.includes('balance')) {
      return new Error('账户余额不足，请充值后重试')
    }

    // 处理频率限制
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return new Error('请求频率过高，请稍后再试')
    }

    // 返回原始错误
    return error
  }

  /**
   * 验证API密钥
   * @returns {Promise<boolean>} 是否有效
   */
  async validateApiKey() {
    try {
      // 尝试创建一个简单的测试任务
      const testPayload = {
        model: 'nano-banana-pro',
        input: {
          prompt: 'test',
          image_input: [],
          aspect_ratio: '1:1',
          resolution: '1K',
          output_format: 'png',
        },
      }

      const response = await fetch(`${API_BASE_URL}/createTask`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(testPayload),
      })

      // 如果返回401，说明密钥无效
      if (response.status === 401) {
        return false
      }

      // 其他状态码可能表示密钥有效但请求有问题
      return response.status !== 403 && response.status !== 402
    } catch (error) {
      console.error('验证API密钥失败:', error)
      return false
    }
  }

  /**
   * 获取支持的参数选项
   * @returns {Object} 支持的选项
   */
  static getSupportedOptions() {
    return {
      aspectRatios: [
        { value: '1:1', label: '1:1 (正方形)' },
        { value: '2:3', label: '2:3 (竖版)' },
        { value: '3:2', label: '3:2 (横版)' },
        { value: '3:4', label: '3:4' },
        { value: '4:3', label: '4:3' },
        { value: '4:5', label: '4:5' },
        { value: '5:4', label: '5:4' },
        { value: '9:16', label: '9:16 (手机竖屏)' },
        { value: '16:9', label: '16:9 (宽屏)' },
        { value: '21:9', label: '21:9 (超宽屏)' },
      ],
      resolutions: [
        { value: '1K', label: '1K' },
        { value: '2K', label: '2K' },
        { value: '4K', label: '4K' },
      ],
      outputFormats: [
        { value: 'png', label: 'PNG' },
        { value: 'jpg', label: 'JPG' },
      ],
    }
  }
}

export default NanoBananaApi