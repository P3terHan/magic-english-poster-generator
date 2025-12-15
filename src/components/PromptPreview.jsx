import { useApp } from '../store'
import toast from 'react-hot-toast'
import PromptGenerator from '../services/promptGenerator'

const PromptPreview = () => {
  const { state, dispatch } = useApp()
  const { theme, title, vocabulary, prompt } = state

  const generatePrompt = () => {
    if (!theme.trim() || !title.trim()) {
      toast.error('请先填写主题和标题')
      return
    }

    try {
      const generatedPrompt = PromptGenerator.generatePrompt(theme, title, vocabulary)
      dispatch({ type: 'SET_PROMPT', payload: generatedPrompt })

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
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast.success('提示词已复制到剪贴板')
  }

  const handleNext = () => {
    if (!prompt.trim()) {
      toast.error('请先生成提示词')
      return
    }
    dispatch({ type: 'COMPLETE_STEP', payload: 4 })
    dispatch({ type: 'GO_TO_STEP', payload: 5 })
  }

  const handleBack = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 3 })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">提示词预览</h2>
      <p className="text-gray-600 mb-8">
        基于您输入的主题和词汇，系统生成了AI绘图提示词。您可以复制此提示词用于AI图像生成。
      </p>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button onClick={generatePrompt} className="btn-primary">
            生成提示词
          </button>
          <button
            onClick={handleCopyPrompt}
            disabled={!prompt}
            className={`btn-secondary ${!prompt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            复制提示词
          </button>
        </div>
        <p className="text-sm text-gray-500">
          提示词基于"儿童识字小报提示词生成专家"模板生成，包含完整的画风参数和词汇标注要求。
        </p>
      </div>

      {prompt && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-800">生成的提示词 (Markdown格式)</h4>
            <span className="text-sm text-gray-500">{prompt.length} 字符</span>
          </div>
          <div className="border rounded-lg p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">{prompt}</pre>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            此提示词专为Nano Banana Pro等AI图像生成模型优化。
          </p>
        </div>
      )}

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
        <p className="text-purple-800 font-medium">提示词信息</p>
        <ul className="text-purple-700 text-sm mt-2 space-y-1">
          <li>• 包含小报标题区、主体画面、必画物体清单、识字标注规则、画风参数</li>
          <li>• 使用Mary GrandPré style画风（哈利波特插画风格）</li>
          <li>• 包含{Object.values(vocabulary).flat().length}个词汇标注要求</li>
          <li>• 专为儿童识字学习优化，物体边界清晰</li>
        </ul>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={handleBack} className="btn-secondary">
          上一步：编辑词汇
        </button>
        <button onClick={handleNext} className="btn-primary">
          下一步：生成图像
        </button>
      </div>
    </div>
  )
}

export default PromptPreview