// 用户输入相关
export const setTheme = (theme) => ({
  type: 'SET_THEME',
  payload: theme,
})

export const setTitle = (title) => ({
  type: 'SET_TITLE',
  payload: title,
})

export const setPrompt = (prompt) => ({
  type: 'SET_PROMPT',
  payload: prompt,
})

// 词汇联想相关
export const setVocabulary = (vocabulary) => ({
  type: 'SET_VOCABULARY',
  payload: vocabulary,
})

export const updateVocabularyCategory = (category, items) => ({
  type: 'UPDATE_VOCABULARY_CATEGORY',
  payload: { category, items },
})

// API设置相关
export const setApiSettings = (settings) => ({
  type: 'SET_API_SETTINGS',
  payload: settings,
})

export const setApiKey = (apiKey) => ({
  type: 'SET_API_KEY',
  payload: apiKey,
})

// 生成状态相关
export const startGeneration = () => ({
  type: 'START_GENERATION',
})

export const setGenerationTaskId = (taskId) => ({
  type: 'SET_GENERATION_TASK_ID',
  payload: taskId,
})

export const setGenerationSuccess = (resultUrl) => ({
  type: 'SET_GENERATION_SUCCESS',
  payload: resultUrl,
})

export const setGenerationError = (error) => ({
  type: 'SET_GENERATION_ERROR',
  payload: error,
})

export const resetGeneration = () => ({
  type: 'RESET_GENERATION',
})

// 工作流相关
export const goToStep = (step) => ({
  type: 'GO_TO_STEP',
  payload: step,
})

export const completeStep = (step) => ({
  type: 'COMPLETE_STEP',
  payload: step,
})

export const resetWorkflow = () => ({
  type: 'RESET_WORKFLOW',
})