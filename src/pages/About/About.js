import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import Activity from '../../containers/Activity'
import Scrollbar from '../../components/Scrollbar'

class About extends Component {
  // Sorry for using setState here but I have to remove 'marked' from the dependencies
  // because of a vulnerability issue
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  render () {
    const { intl } = this.props

    return (
      <Activity
        title={intl.formatMessage({ id: 'about' })}>

        <Scrollbar>
          <div style={{ backgroundColor: 'white', padding: 5 }} />
        </Scrollbar>

      </Activity>
    )
  }
}

About.propTypes = {}

export default injectIntl(About)