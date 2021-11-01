import { actionTypes } from '~/redux/constants'

const playerQueue = (state: any = {}, action) => {

  switch (action.type) {
    case actionTypes.PLAYER_QUEUE_LOAD_ITEMS:
      return {
        ...state,
        priorityItems: action.payload.priorityItems
      }
    case actionTypes.PLAYER_QUEUE_LOAD_PRIMARY_ITEMS:
      return {
        ...state,
        priorityItems: action.payload
      }
    default:
      return state
  }
  
}

export default playerQueue