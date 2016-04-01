import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'
import {store} from './store'
import Header from './header'
import Posts from './posts'
import Post from './post'
import Edit from './edit'

const App = React.createClass({
  getInitialState () {
    // Fetch the current user, if any
    store.getMapper('user').getLoggedInUser()
    return this.getState()
  },
  componentDidMount () { store.on('all', this.onChange) },
  componentWillUnmount () { store.off('all', this.onChange) },
  onChange () { this.setState(this.getState()) },
  getState () { return { loggedInUser: store.getMapper('user').loggedInUser } },
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
})

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Posts}/>
      <Route path="/posts/:id" component={Post}></Route>
      <Route path="/posts/:id/edit" component={Edit}></Route>
    </Route>
  </Router>
), document.getElementById('app'))
