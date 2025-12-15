import { Toaster } from 'react-hot-toast'
import WorkflowStepper from './components/WorkflowStepper'
import { AppProvider } from './store/index.jsx'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center text-primary-700 font-display">
              魔法英文小报提示词生成器
            </h1>
            <p className="text-center text-gray-600 mt-2">
              轻松生成儿童识字小报的AI绘图提示词
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <WorkflowStepper />
        </main>

        <footer className="bg-white border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>基于 AI 图像生成技术 • 专为儿童英文学习设计</p>
            <p className="mt-1">提示词模板来自: 儿童识字小报提示词生成专家</p>
          </div>
        </footer>

        <Toaster position="top-right" />
      </div>
    </AppProvider>
  )
}

export default App