import React from 'react'
import Scrollbar from '../../components/Scrollbar'
import SelectableMenuList from '../../containers/SelectableMenuList'
import { useAppConfig } from '../../contexts/AppConfigProvider'
import { useHistory, useParams } from 'react-router-dom'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import { setDrawerMobileOpen } from '../../store/drawer/actions'
import { useUserId } from '../../utils/auth'

export const DrawerContent = React.memo(() => {
  const appConfig = useAppConfig()
  const firebase = useFirebase()
  const uid = useUserId()
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    open,
    mobileOpen,
    useMinified
  } = useSelector(({ drawer: { open, mobileOpen, useMinified } }) => ({
    open,
    mobileOpen,
    useMinified
  }), shallowEqual)
  const params = useParams()

  const handleSignOut = async () => {
    await firebase.ref(`/users/${uid}/connections`).remove()
    // TODO get messaging working
    // await database.ref(`users/${profile.uid}/notificationTokens/${messaging.token}`).remove()
    // TODO use firebase' build in user meta data functionality
    await firebase.ref(`/users/${uid}/lastOnline`).set(new Date())
    await firebase.logout()
    window.location.reload()
  }
  const menuItems = appConfig.useMenuItems(handleSignOut)

  const handleChange = (event, index) => {
    if (index !== undefined && mobileOpen) {
      dispatch(setDrawerMobileOpen(false))
    }

    if (index !== undefined && index !== Object(index)) {
      history.push(index)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar>
        <SelectableMenuList
          items={menuItems}
          onIndexChange={handleChange}
          index={params.path ? params.path : '/'}
          useMinified={useMinified && !open}
        />
      </Scrollbar>
    </div>
  )
})

export default DrawerContent
