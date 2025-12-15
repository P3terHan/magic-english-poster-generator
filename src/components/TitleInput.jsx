import { useApp } from '../store'
import toast from 'react-hot-toast'

const TitleInput = () => {
  const { state, dispatch } = useApp()
  const { theme, title } = state

  const titleSuggestions = [
    `走进${theme}`,
    `快乐${theme}`,
    `神奇的${theme}`,
    `${theme}探险记`,
    `我的${theme}之旅`,
    `${theme}的一天`,
  ]

  const handleTitleChange = (e) => {
    dispatch({ type: 'SET_TITLE', payload: e.target.value })
  }

  const handleTitleSelect = (suggestion) => {
    dispatch({ type: 'SET_TITLE', payload: suggestion })
    toast.success(`已使用标题: ${suggestion}`)
  }

  const handleNext = () => {
    if (!title.trim()) {
      toast.error('请先输入或选择一个标题')
      return
    }
    dispatch({ type: 'COMPLETE_STEP', payload: 2 })
    dispatch({ type: 'GO_TO_STEP', payload: 3 })
  }

  const handleBack = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 1 })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">输入小报标题</h2>
      <p className="text-gray-600 mb-8">
        为您的儿童识字小报输入一个有趣的标题。标题将显示在小报的顶部。
      </p>

      <div className="mb-8">
        <div className="flex items-center mb-3">
          <span className="text-sm font-medium text-gray-700">当前主题:</span>
          <span className="ml-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
            {theme}
          </span>
        </div>

        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          输入标题
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="例如：《走进超市》《快乐医院》..."
          className="input-field"
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">标题建议（基于主题）</p>
        <div className="flex flex-wrap gap-3">
          {titleSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleTitleSelect(suggestion)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                title === suggestion
                  ? 'bg-secondary-500 text-white border-secondary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-secondary-500'
              }`}
            >
              《{suggestion}》
            </button>
          ))}
        </div>
      </div>

      {title && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">小报标题预览</p>
          <h3 className="text-xl font-bold text-green-900 mt-2 font-display">《{title}》</h3>
          <p className="text-green-700 text-sm mt-2">
            标题将使用手绘海报风格，带有哈利波特魔法风格的装饰。
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button onClick={handleBack} className="btn-secondary">
          上一步：修改主题
        </button>
        <button onClick={handleNext} className="btn-primary">
          下一步：词汇联想
        </button>
      </div>
    </div>
  )
}

export default TitleInput