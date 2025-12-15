import { useApp } from '../store'
import ThemeInput from './ThemeInput'
import TitleInput from './TitleInput'
import VocabularyAssociation from './VocabularyAssociation'
import ImageGenerator from './ImageGenerator'

const steps = [
  { id: 1, title: '选择主题', component: ThemeInput },
  { id: 2, title: '输入标题', component: TitleInput },
  { id: 3, title: '词汇联想', component: VocabularyAssociation },
  { id: 4, title: '生成图像', component: ImageGenerator },
]

const WorkflowStepper = () => {
  const { state } = useApp()
  const { currentStep } = state

  const CurrentComponent = steps.find(step => step.id === currentStep)?.component

  return (
    <div className="max-w-6xl mx-auto">
      {/* 步骤指示器 */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        {steps.map((step) => {
          const isCompleted = state.stepsCompleted.includes(step.id)
          const isActive = currentStep === step.id
          const isAccessible = state.stepsCompleted.includes(step.id - 1) || step.id === 1

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <button
                onClick={() => isAccessible && state.dispatch({ type: 'GO_TO_STEP', payload: step.id })}
                disabled={!isAccessible}
                className={`step-indicator ${
                  isActive
                    ? 'step-indicator-active'
                    : isCompleted
                    ? 'step-indicator-completed'
                    : 'step-indicator-pending'
                } ${!isAccessible ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isCompleted ? '✓' : step.id}
              </button>
              <span className={`mt-2 text-sm font-medium ${isActive ? 'text-primary-700' : 'text-gray-600'}`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* 当前步骤内容 */}
      <div className="card">
        {CurrentComponent ? <CurrentComponent /> : <div>步骤组件未找到</div>}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => state.dispatch({ type: 'GO_TO_STEP', payload: currentStep - 1 })}
          disabled={currentStep === 1}
          className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          上一步
        </button>

        <button
          onClick={() => {
            state.dispatch({ type: 'COMPLETE_STEP', payload: currentStep })
            if (currentStep < steps.length) {
              state.dispatch({ type: 'GO_TO_STEP', payload: currentStep + 1 })
            }
          }}
          className="btn-primary"
        >
          {currentStep === steps.length ? '完成' : '下一步'}
        </button>
      </div>
    </div>
  )
}

export default WorkflowStepper