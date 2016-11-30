
import * as types from './mutation-types'

export const setTitle = ({ commit }, title) => {
  commit(types.SET_TITLE, title)
}
