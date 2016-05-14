import React from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router'
import {store} from './store'

export default React.createClass({
  render () {
    const loggedInUser = this.props.loggedInUser
    const path = window.location.pathname
    const links = [
      <li key="0" className={!path || path === '/' ? 'active' : ''}>
        <Link to="/">Home</Link>
      </li>
    ]
    if (loggedInUser) {
      links.push(
        <li key="1" className={path === '/posts/new/edit' ? 'active' : ''}>
          <Link to="/posts/new/edit">New post</Link>
        </li>
      )
      links.push(
        <li key="2">
          <Link to="/users/{loggedInUser.id}">
            Hi <strong>{loggedInUser.displayName || loggedInUser.username}</strong>!
          </Link>
        </li>
      )
    } else {
      links.push(<li key="2"><a href="/auth/github">Login with Github</a></li>)
    }
    return (
      <div className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">js-data blog example</a>
            <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className="navbar-collapse collapse" id="navbar-main">
            <ul className="nav navbar-nav">
              <li>
                <a href="https://github.com/js-data/js-data-examples" target="_blank">View source</a>
              </li>
              <li>
                <a href="https://www.js-data.io" target="_blank">js-data.io</a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">{links}</ul>
          </div>
        </div>
      </div>
    )
  }
})
