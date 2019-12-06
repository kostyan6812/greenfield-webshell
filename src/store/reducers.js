import dialogs from './dialogs/reducer'
import { firebaseReducer as firebase } from 'react-redux-firebase'
import locale from './locale/reducer'
import persistentValues from './persistentValues/reducer'
import simpleValues from './simpleValues/reducer'
import themeSource from './themeSource/reducer'
import drawer from './drawer/reducer'
import { combineReducers } from 'redux'
import addToHomeScreen from './addToHomeScreen/reducer'

export const appReducers = {
  firebase,
  dialogs,
  locale,
  persistentValues,
  simpleValues,
  drawer,
  themeSource,
  addToHomeScreen
}

const rootReducer = combineReducers(appReducers)

export default (state, action) => rootReducer(state, action)
