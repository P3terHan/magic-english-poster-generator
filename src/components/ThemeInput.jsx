import { useApp } from '../store'
import toast from 'react-hot-toast'

const ThemeInput = () => {
  const { state, dispatch } = useApp()
  const { theme } = state

  const commonThemes = ['超市', '医院', '公园', '学校', '动物园', '海滩', '农场', '餐厅', '图书馆', '游乐园']

  const handleThemeChange = (e) => {
    dispatch({ type: 'SET_THEME', payload: e.target.value })
  }

  const handleThemeSelect = (selectedTheme) => {
    dispatch({ type: 'SET_THEME', payload: selectedTheme })
    toast.success(`已选择主题: ${selectedTheme}`)
  }

  const handleNext = () => {
    if (!theme.trim()) {
      toast.error('请先输入或选择一个主题')
      return
    }
    dispatch({ type: 'COMPLETE_STEP', payload: 1 })
    dispatch({ type: 'GO_TO_STEP', payload: 2 })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">选择主题/场景</h2>
      <p className="text-gray-600 mb-8">
        请选择或输入一个主题场景，系统将自动联想相关的英文词汇。例如：超市、医院、公园等。
      </p>

      <div className="mb-8">
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
          输入主题
        </label>
        <input
          id="theme"
          type="text"
          value={theme}
          onChange={handleThemeChange}
          placeholder="例如：超市、医院、公园..."
          className="input-field"
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">常用主题推荐</p>
        <div className="flex flex-wrap gap-3">
          {commonThemes.map((commonTheme) => (
            <button
              key={commonTheme}
              onClick={() => handleThemeSelect(commonTheme)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                theme === commonTheme
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {commonTheme}
            </button>
          ))}
        </div>
      </div>

      {theme && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">已选择主题: <span className="font-bold">{theme}</span></p>
          <p className="text-amber-700 text-sm mt-1">
            系统将为您联想与<span className="font-semibold">{theme}</span>相关的15-20个英文词汇。
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button onClick={handleNext} className="btn-primary">
          下一步：输入标题
        </button>
      </div>
    </div>
  )
}

export default ThemeInput