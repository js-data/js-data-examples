import React from 'react'
import {Link} from 'react-router'
import {store} from './store'
import Header from './header'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    // Fetch the current user, if any
    store.getMapper('user').getLoggedInUser()
    this.state = this.getState()
  }
  componentDidMount () { store.on('all', this.onChange, this) }
  componentWillUnmount () { store.off('all', this.onChange) }
  onChange () { this.setState(this.getState()) }
  getState () { return { loggedInUser: store.getMapper('user').loggedInUser } }
  render () {
    const loggedInUser = this.state.loggedInUser
    let link = <Link to="/posts/new/edit">New post</Link>
    if (!loggedInUser) {
      link = <a href="/auth/github">Login to create a post</a>
    }
    return (
      <div className="container">
        <Header loggedInUser={this.state.loggedInUser}/>
        <div className="container main-container">{this.props.children}</div>
      </div>
    )
  }
}
