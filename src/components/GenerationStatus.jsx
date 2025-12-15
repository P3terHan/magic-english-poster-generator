import { useApp } from '../store'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

const GenerationStatus = () => {
  const { state, dispatch } = useApp()
  const { apiSettings, generation, prompt } = state
  const [showApiSettings, setShowApiSettings] = useState(false)
  const api = useApi(apiSettings.apiKey)

  const handleApiSettingsChange = (key, value) => {
    dispatch({ type: 'SET_API_SETTINGS', payload: { [key]: value } })
  }

  const handleGenerate = async () => {
    if (!apiSettings.apiKey) {
      toast.error('请先输入API Key')
      setShowApiSettings(true)
      return
    }

    if (!prompt || prompt.trim() === '') {
      toast.error('请先在前一步生成提示词')
      return
    }

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

      const result = await api.generateImage(prompt, options)

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

  const handleReset = () => {
    dispatch({ type: 'RESET_GENERATION' })
    dispatch({ type: 'RESET_WORKFLOW' })
    toast.success('已重置，可以开始新的生成')
  }

  const handleBack = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 4 })
  }

  const handleDownload = () => {
    if (!generation.resultUrl) {
      toast.error('没有可下载的图像')
      return
    }

    try {
      const link = document.createElement('a')
      link.href = generation.resultUrl
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">生成图像</h2>
      <p className="text-gray-600 mb-8">
        使用Nano Banana Pro API生成儿童识字小报图像。需要提供API Key。
      </p>

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
            disabled={generation.status === 'generating'}
            className={`btn-primary ${generation.status === 'generating' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {generation.status === 'idle' ? '开始生成' :
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
            上一步：修改提示词
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

export default GenerationStatus