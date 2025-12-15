const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      }

    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      }

    case 'SET_PROMPT':
      return {
        ...state,
        prompt: action.payload,
      }

    case 'SET_VOCABULARY':
      return {
        ...state,
        vocabulary: action.payload,
      }

    case 'UPDATE_VOCABULARY_CATEGORY':
      return {
        ...state,
        vocabulary: {
          ...state.vocabulary,
          [action.payload.category]: action.payload.items,
        },
      }

    case 'SET_API_SETTINGS':
      return {
        ...state,
        apiSettings: {
          ...state.apiSettings,
          ...action.payload,
        },
      }

    case 'SET_API_KEY':
      return {
        ...state,
        apiSettings: {
          ...state.apiSettings,
          apiKey: action.payload,
        },
      }

    case 'START_GENERATION':
      return {
        ...state,
        generation: {
          ...state.generation,
          status: 'generating',
          error: null,
        },
      }

    case 'SET_GENERATION_TASK_ID':
      return {
        ...state,
        generation: {
          ...state.generation,
          taskId: action.payload,
        },
      }

    case 'SET_GENERATION_SUCCESS':
      return {
        ...state,
        generation: {
          ...state.generation,
          status: 'success',
          resultUrl: action.payload,
          error: null,
        },
      }

    case 'SET_GENERATION_ERROR':
      return {
        ...state,
        generation: {
          ...state.generation,
          status: 'error',
          error: action.payload,
        },
      }

    case 'RESET_GENERATION':
      return {
        ...state,
        generation: {
          status: 'idle',
          taskId: null,
          resultUrl: null,
          error: null,
        },
      }

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
      }

    case 'COMPLETE_STEP':
      return {
        ...state,
        stepsCompleted: [...new Set([...state.stepsCompleted, action.payload])],
      }

    case 'RESET_WORKFLOW':
      return {
        ...state,
        currentStep: 1,
        stepsCompleted: [1],
      }

    default:
      return state
  }
}

export default reducer