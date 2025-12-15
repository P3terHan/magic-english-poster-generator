import { useApp } from '../store'
import toast from 'react-hot-toast'
import VocabularyService from '../services/vocabularyService'

const VocabularyAssociation = () => {
  const { state, dispatch } = useApp()
  const { theme, title, vocabulary } = state

  const handleLoadVocabulary = () => {
    if (!theme.trim()) {
      toast.error('请先选择主题')
      return
    }

    const generatedVocabulary = VocabularyService.getVocabularyByTheme(theme)
    dispatch({ type: 'SET_VOCABULARY', payload: generatedVocabulary })

    const totalWords = Object.values(generatedVocabulary).flat().length
    toast.success(`已为"${theme}"生成${totalWords}个相关词汇`)
  }

  const handleVocabularyUpdate = (category, index, field, value) => {
    const newItems = [...vocabulary[category]]
    newItems[index] = { ...newItems[index], [field]: value }
    dispatch({ type: 'UPDATE_VOCABULARY_CATEGORY', payload: { category, items: newItems } })
  }

  const handleAddWord = (category) => {
    const newItems = [...vocabulary[category], { english: '', chinese: '' }]
    dispatch({ type: 'UPDATE_VOCABULARY_CATEGORY', payload: { category, items: newItems } })
  }

  const handleRemoveWord = (category, index) => {
    const newItems = vocabulary[category].filter((_, i) => i !== index)
    dispatch({ type: 'UPDATE_VOCABULARY_CATEGORY', payload: { category, items: newItems } })
  }

  const handleNext = () => {
    const totalWords = Object.values(vocabulary).flat().length
    if (totalWords === 0) {
      toast.error('请先生成或输入词汇列表')
      return
    }
    if (totalWords < 10) {
      toast.error('建议至少输入10个词汇')
      return
    }
    dispatch({ type: 'COMPLETE_STEP', payload: 3 })
    dispatch({ type: 'GO_TO_STEP', payload: 4 })
  }

  const handleBack = () => {
    dispatch({ type: 'GO_TO_STEP', payload: 2 })
  }

  const VocabularyCategory = ({ title, category, words }) => (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <button
          onClick={() => handleAddWord(category)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          + 添加词汇
        </button>
      </div>

      <div className="space-y-3">
        {words.map((word, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              value={word.english}
              onChange={(e) => handleVocabularyUpdate(category, index, 'english', e.target.value)}
              placeholder="英文"
              className="flex-1 input-field text-sm"
            />
            <input
              type="text"
              value={word.chinese}
              onChange={(e) => handleVocabularyUpdate(category, index, 'chinese', e.target.value)}
              placeholder="中文"
              className="flex-1 input-field text-sm"
            />
            <button
              onClick={() => handleRemoveWord(category, index)}
              className="text-red-500 hover:text-red-700"
            >
              删除
            </button>
          </div>
        ))}
      </div>

      {words.length === 0 && (
        <p className="text-gray-500 text-sm italic">暂无词汇，点击"添加词汇"或"生成词汇"</p>
      )}
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">词汇联想</h2>
      <p className="text-gray-600 mb-8">
        系统将根据主题"<span className="font-semibold">{theme}</span>"自动联想相关英文词汇。
        您可以编辑、添加或删除词汇。建议总共15-20个词汇。
      </p>

      <div className="mb-6">
        <button
          onClick={handleLoadVocabulary}
          className="btn-primary mb-4"
        >
          生成词汇联想
        </button>
        <p className="text-sm text-gray-500">
          点击按钮生成与"{theme}"相关的词汇列表。系统将提供核心角色、常见物品和环境装饰三类词汇。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <VocabularyCategory
          title="核心角色与设施 (3-5个)"
          category="coreRoles"
          words={vocabulary.coreRoles}
        />
        <VocabularyCategory
          title="常见物品/工具 (5-8个)"
          category="commonItems"
          words={vocabulary.commonItems}
        />
        <VocabularyCategory
          title="环境与装饰 (3-5个)"
          category="environment"
          words={vocabulary.environment}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-800 font-medium">词汇统计</p>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">{vocabulary.coreRoles.length}</p>
            <p className="text-sm text-blue-600">核心角色</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">{vocabulary.commonItems.length}</p>
            <p className="text-sm text-blue-600">常见物品</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">{vocabulary.environment.length}</p>
            <p className="text-sm text-blue-600">环境装饰</p>
          </div>
        </div>
        <p className="text-blue-700 text-sm mt-3">
          总计: <span className="font-bold">{Object.values(vocabulary).flat().length}</span> 个词汇
          {Object.values(vocabulary).flat().length >= 15 ? ' ✓ 已达到建议数量' : ' ⚠️ 建议至少15个词汇'}
        </p>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={handleBack} className="btn-secondary">
          上一步：修改标题
        </button>
        <button onClick={handleNext} className="btn-primary">
          下一步：预览提示词
        </button>
      </div>
    </div>
  )
}

export default VocabularyAssociation