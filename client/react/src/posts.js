import React from 'react'
import {Link} from 'react-router'
import {store} from './store'

const PAGE_SIZE = 5

export default class Posts extends React.Component {
  constructor (props) {
    super(props)
    const page = 1
    // Fetch all blog posts
    store.findAll('post', {
      limit: PAGE_SIZE,
      offset: PAGE_SIZE * (page - 1)
    })
    this.state = this.getState()
    this.state.page = page
  }
  componentDidMount () { store.on('all', this.onChange, this) }
  componentWillUnmount () { store.off('all', this.onChange, this) }
  onChange () { this.setState(this.getState()) }
  getState () { return { posts: store.getAll('post') } }
  render () {
    let posts = this.state.posts.map(function (post) {
      return (
        <div key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
          <small className="pull-right">{post.created_at}</small>
        </div>
      )
    })
    if (!posts.length) {
      posts = 'No posts yet...'
    }
    return (<div>{posts}</div>)
  }
}
