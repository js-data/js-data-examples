import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import App from './app'
import Posts from './posts'
import Post from './post'
import Edit from './edit'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Posts}/>
      <Route path="/posts/:id" component={Post}></Route>
      <Route path="/posts/:id/edit" component={Edit}></Route>
    </Route>
  </Router>
), document.getElementById('app'))
