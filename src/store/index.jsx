import React, { createContext, useReducer, useContext } from 'react'
import reducer from './reducers'
import * as actions from './actions'

const initialState = {
  // 用户输入
  theme: '',
  title: '',

  // 词汇联想结果
  vocabulary: {
    coreRoles: [],
    commonItems: [],
    environment: [],
  },

  // API设置
  apiSettings: {
    apiKey: '',
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'png',
  },

  // 生成状态
  generation: {
    status: 'idle', // idle, generating, success, error
    taskId: null,
    resultUrl: null,
    error: null,
  },

  // 提示词
  prompt: '',

  // 工作流状态
  currentStep: 1,
  stepsCompleted: [1],
}

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = {
    state,
    dispatch,
    actions,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}