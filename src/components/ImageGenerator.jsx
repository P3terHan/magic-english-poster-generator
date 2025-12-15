import { useApp } from '../store'
import toast from 'react-hot-toast'
import { useState, useEffect, useCallback } from 'react'
import { useApi } from '../hooks/useApi'
import PromptGenerator from '../services/promptGenerator'

const ImageGenerator = () => {
  const { state, dispatch } = useApp()
  const { theme, title, vocabulary, apiSettings } = state
  const [prompt, setPrompt] = useState('')
  const [editedPrompt, setEditedPrompt] = useState('')
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const api = useApi(apiSettings.apiKey)

  // 自动生成提示词
  useEffect(() => {
    if (theme && title && vocabulary && !prompt) {
      generateInitialPrompt()
    }
  }, [theme, title, vocabulary])

  const generateInitialPrompt = useCallback(() => {
    if (!theme.trim() || !title.trim()) {
      toast.error('请先填写主题和标题')
      return
    }

    try {
      const generatedPrompt = PromptGenerator.generatePrompt(theme, title, vocabulary)
      setPrompt(generatedPrompt)
      setEditedPrompt(generatedPrompt)

      // 验证提示词
      const validation = PromptGenerator.validatePrompt(generatedPrompt)
      if (!validation.isValid) {
        console.warn('提示词验证警告:', validation.errors)
      }

      // 获取统计信息
      const stats = PromptGenerator.getPromptStats(generatedPrompt)
      toast.success(`提示词生成成功！(${stats.length} 字符, ${stats.lines} 行)`)
    } catch (error) {
      toast.error(`生成提示词失败: ${error.message}`)
    }
  }, [theme, title, vocabulary])

  const handleApiSettingsChange = (key, value) => {
    dispatch({ type: 'SET_API_SETTINGS', payload: { [key]: value } })
  }

  const handleGenerate = async () => {
    if (!apiSettings.apiKey) {
      toast.error('请先输入API Key')
      setShowApiSettings(true)
      return
    }

    const finalPrompt = isEditing ? editedPrompt : prompt
    if (!finalPrompt || finalPrompt.trim() === '') {
      toast.error('提示词不能为空')
      return
    }

    // 更新全局生成状态
    dispatch({ type: 'START_GENERATION' })
    toast.loading('开始生成图像...')

    try {
      // 转换参数命名：驼峰转下划线
      const options = {
        aspect_ratio: apiSettings.aspectRatio,
        resolution: apiSettings.resolution,
        output_format: apiSettings.outputFormat,
        image_input: [], // 默认空数组
      }

      const result = await api.generateImage(finalPrompt, options)

      // 提取第一个结果URL
      const resultUrl = result.resultUrls?.[0] || result.rawResponse?.resultJson?.resultUrls?.[0]

      if (resultUrl) {
        dispatch({ type: 'SET_GENERATION_TASK_ID', payload: result.taskId })
        dispatch({ type: 'SET_GENERATION_SUCCESS', payload: resultUrl })
        toast.success('图像生成成功！')
      } else {
        throw new Error('未获取到生成的图像URL')
      }
    } catch (error) {
      console.error('图像生成失败:', error)
      dispatch({ type: 'SET_GENERATION_ERROR', payload: error.message })
      toast.error(`生成失败: ${error.message}`)
    }
  }

  const handleRegeneratePrompt = () => {
    generateInitialPrompt()
    setIsEditing(false)
    toast.success('已重新生成提示词')
  }

  const handleUseEditedPrompt = () => {
    if (!editedPrompt.trim()) {
      toast.error('编辑后的提示词不能为空')
      return
    }
    setPrompt(editedPrompt)
    setIsEditing(false)
    toast.success('已使用编辑后的提示词')
  }

  const handleCopyPrompt = () => {
    const textToCopy = isEditing ? editedPrompt : prompt
    navigator.clipboard.writeText(textToCopy)
    toast.success('提示词已复制到剪贴板')
  }

  const handleDownload = () => {
    if (!state.generation.resultUrl) {
      toast.error('没有可下载的图像')
      return
    }

    try {
      const link = document.createElement('a')
      link.href = state.generation.resultUrl
      link.download = `魔法英文小报_${new Date().getTime()}.${apiSettings.outputFormat || 'png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('图像下载已开始')
    } catch (error) {
      console.error('下载失败:', error)
      toast.error('下载失败，请尝试右键另存为')
    }
  }

  const handleBack = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 3 }) // 回到词汇联想步骤
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_GENERATION' })
    dispatch({ type: 'RESET_WORKFLOW' })
    setPrompt('')
    setEditedPrompt('')
    setIsEditing(false)
    toast.success('已重置，可以开始新的生成')
  }

  const currentPrompt = isEditing ? editedPrompt : prompt
  const { generation } = state

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">生成图像</h2>
      <p className="text-gray-600 mb-8">
        基于您的主题和词汇生成提示词，并使用Nano Banana Pro API生成儿童识字小报图像。
      </p>

      {/* 提示词部分 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">生成提示词</h3>
          <div className="flex gap-2">
            <button
              onClick={handleRegeneratePrompt}
              className="btn-secondary text-sm"
              disabled={!theme || !title}
            >
              重新生成
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn-secondary text-sm ${isEditing ? 'bg-primary-100 text-primary-700' : ''}`}
            >
              {isEditing ? '取消编辑' : '编辑提示词'}
            </button>
            <button
              onClick={handleCopyPrompt}
              disabled={!currentPrompt}
              className={`btn-secondary text-sm ${!currentPrompt ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              复制
            </button>
          </div>
        </div>

        {!prompt ? (
          <div className="border rounded-lg p-8 bg-gray-50 text-center">
            <p className="text-gray-600 mb-4">等待生成提示词...</p>
            <button
              onClick={generateInitialPrompt}
              disabled={!theme || !title}
              className={`btn-primary ${!theme || !title ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              生成提示词
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <div>
                <textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  className="w-full h-64 border rounded-lg p-4 font-mono text-sm bg-gray-900 text-gray-100"
                  placeholder="编辑提示词..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm">
                    取消
                  </button>
                  <button onClick={handleUseEditedPrompt} className="btn-primary text-sm">
                    使用编辑后的提示词
                  </button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-900 text-gray-100">
                <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-64">
                  {currentPrompt}
                </pre>
              </div>
            )}

            {prompt && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-800 font-medium">提示词信息</p>
                <ul className="text-purple-700 text-sm mt-2 space-y-1">
                  <li>• 包含小报标题区、主体画面、必画物体清单、识字标注规则、画风参数</li>
                  <li>• 使用Mary GrandPré style画风（哈利波特插画风格）</li>
                  <li>• 包含{Object.values(vocabulary).flat().length}个词汇标注要求</li>
                  <li>• 专为儿童识字学习优化，物体边界清晰</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* API设置 */}
      <div className="mb-8">
        <button
          onClick={() => setShowApiSettings(!showApiSettings)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-4"
        >
          <span>{showApiSettings ? '隐藏' : '显示'}API设置</span>
          <span>{showApiSettings ? '▲' : '▼'}</span>
        </button>

        {showApiSettings && (
          <div className="border rounded-lg p-4 bg-gray-50 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiSettings.apiKey}
                onChange={(e) => handleApiSettingsChange('apiKey', e.target.value)}
                placeholder="输入Nano Banana Pro API Key"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                在 <a href="https://kie.ai/api-key" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">kie.ai/api-key</a> 获取API Key
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  宽高比
                </label>
                <select
                  value={apiSettings.aspectRatio}
                  onChange={(e) => handleApiSettingsChange('aspectRatio', e.target.value)}
                  className="input-field"
                >
                  <option value="1:1">1:1 (正方形)</option>
                  <option value="2:3">2:3 (竖版)</option>
                  <option value="3:2">3:2 (横版)</option>
                  <option value="3:4">3:4</option>
                  <option value="4:3">4:3</option>
                  <option value="4:5">4:5</option>
                  <option value="5:4">5:4</option>
                  <option value="9:16">9:16 (手机竖屏)</option>
                  <option value="16:9">16:9 (宽屏)</option>
                  <option value="21:9">21:9 (超宽屏)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分辨率
                </label>
                <select
                  value={apiSettings.resolution}
                  onChange={(e) => handleApiSettingsChange('resolution', e.target.value)}
                  className="input-field"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输出格式
                </label>
                <select
                  value={apiSettings.outputFormat}
                  onChange={(e) => handleApiSettingsChange('outputFormat', e.target.value)}
                  className="input-field"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 生成状态 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">生成状态</h4>
          <button
            onClick={handleGenerate}
            disabled={generation.status === 'generating' || !prompt}
            className={`btn-primary ${generation.status === 'generating' || !prompt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {generation.status === 'idle' ? '开始生成图像' :
             generation.status === 'generating' ? '生成中...' :
             '重新生成'}
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">状态:</span>
              <span className={`font-medium ${
                generation.status === 'success' ? 'text-green-600' :
                generation.status === 'error' ? 'text-red-600' :
                generation.status === 'generating' ? 'text-amber-600' :
                'text-gray-600'
              }`}>
                {generation.status === 'idle' && '等待生成'}
                {generation.status === 'generating' && '正在生成...'}
                {generation.status === 'success' && '生成成功'}
                {generation.status === 'error' && '生成失败'}
              </span>
            </div>

            {generation.taskId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">任务ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {generation.taskId}
                </span>
              </div>
            )}

            {generation.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-700 font-medium">错误信息:</p>
                <p className="text-red-600 text-sm mt-1">{generation.error}</p>
              </div>
            )}
          </div>

          {generation.status === 'generating' && (
            <div className="mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${api.progress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">
                {api.loading ? `AI正在生成图像... ${api.progress.toFixed(0)}%` : 'AI正在生成图像，这可能需要几分钟时间...'}
              </p>
              {api.error && (
                <p className="text-center text-red-600 text-sm mt-1">
                  错误: {api.error}
                </p>
              )}
            </div>
          )}

          {generation.status === 'success' && generation.resultUrl && (
            <div className="mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium">✓ 图像生成成功！</p>
                <p className="text-green-700 text-sm mt-1">
                  您的儿童识字小报已生成完成。
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="font-medium text-gray-800 mb-3">生成结果预览</p>
                {generation.resultUrl ? (
                  <div className="space-y-4">
                    <div className="border rounded overflow-hidden">
                      <img
                        src={generation.resultUrl}
                        alt="生成的儿童识字小报"
                        className="w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" fill="%236b7280">图像加载失败</text></svg>'
                        }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={handleDownload} className="btn-primary flex-1">
                        下载图像
                      </button>
                      <a
                        href={generation.resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1 text-center"
                      >
                        在新窗口打开
                      </a>
                    </div>
                    <p className="text-gray-500 text-sm">
                      图像由Nano Banana Pro生成，可能需要几秒钟加载。
                    </p>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-700 font-medium">生成的图像</p>
                      <p className="text-gray-500 text-sm mt-1">(URL解析中...)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <div className="flex gap-4">
          <button onClick={handleBack} className="btn-secondary">
            上一步：编辑词汇
          </button>
          <button onClick={handleReset} className="btn-secondary">
            重新开始
          </button>
        </div>

        {generation.status === 'success' && (
          <button onClick={handleDownload} className="btn-primary">
            下载图像
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageGenerator