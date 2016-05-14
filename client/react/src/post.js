import React from 'react'
import {store} from './store'

export default class Post extends React.Component{
  constructor (props) {
    super(props)
    store.find('post', this.props.params.id)
    this.state = this.getState()
  }
  componentDidMount () { store.on('all', this.onChange, this) }
  componentWillUnmount () { store.off('all', this.onChange, this) }
  onChange () { this.setState(this.getState()) }
  getState () {
    return {
      post: store.get('post', this.props.params.id) || {}
    }
  }
  render () {
    return (
      <div className="post">
        <h2 className="page-header">
          {this.state.post.title}
          <small>{this.state.post.created_at}</small>
        </h2>
        <div>{this.state.post.content}</div>
      </div>
    )
  }
}

Post.contextTypes = { router: React.PropTypes.object }
