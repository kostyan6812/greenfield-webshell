import PropTypes from 'prop-types'
import React from 'react'
import Context from './Context'
import { useDispatch, useSelector } from 'react-redux'
import {
  compositorInitialized,
  compositorInitializing,
  createClient,
  createUserSurface,
  destroyClient,
  destroyUserSurface,
  updateUserSurface
} from '../../store/compositor'
import { showNotification } from '../../store/notification'

const importCompositorModule = import('compositor-module')
const compositorSession = { globals: null, webAppLauncher: null, remoteAppLauncher: null, actions: null }

window.GREENFIELD_DEBUG = process.env.NODE_ENV === 'development'

const CompositorProvider = React.memo(({ children }) => {
  const dispatch = useDispatch()

  const isInitialized = useSelector(({ compositor }) => compositor.initialized)
  const isInitializing = useSelector(({ compositor }) => compositor.initializing)

  if (!isInitialized && !isInitializing) {
    dispatch(compositorInitializing())
    importCompositorModule.then(({
      Globals,
      init,
      RemoteAppLauncher,
      RemoteSocket,
      Session,
      WebAppLauncher,
      WebAppSocket
    }) => {
      const initPromise = init()
      const session = Session.create()
      const userShell = session.userShell

      userShell.events.notify = (variant, message) => dispatch(showNotification({ variant, message }))
      session.display.onclientcreated = client => dispatch(createClient({ id: client.id }))
      session.display.onclientdestroyed = client => dispatch(destroyClient({ id: client.id }))
      userShell.events.createUserSurface = (userSurface, userSurfaceState) => {
        dispatch(createUserSurface({
          ...userSurface,
          ...userSurfaceState
        }))
      }
      userShell.events.updateUserSurface = (userSurface, userSurfaceState) => {
        dispatch(updateUserSurface({ ...userSurface, ...userSurfaceState }))
      }
      userShell.events.destroyUserSurface = userSurface => { dispatch(destroyUserSurface({ ...userSurface })) }

      const webAppSocket = WebAppSocket.create(session)
      const webAppLauncher = WebAppLauncher.create(webAppSocket)

      const remoteSocket = RemoteSocket.create(session)
      const remoteAppLauncher = RemoteAppLauncher.create(remoteSocket)

      compositorSession.webAppLauncher = webAppLauncher
      compositorSession.remoteAppLauncher = remoteAppLauncher
      compositorSession.actions = userShell.actions

      return initPromise.then(() => {
        compositorSession.globals = Globals.create(session)
      })
    }).then(() => {
      dispatch(compositorInitialized())
      compositorSession.globals.register()
    })
  }

  return <Context.Provider value={compositorSession}>{children}</Context.Provider>
})

CompositorProvider.propTypes = {
  children: PropTypes.any
}

export default CompositorProvider
