import React from 'react'
import {Link} from 'react-router'
import {store} from './store'

const PAGE_SIZE = 5

/**
 * @param {number} pageNum The page to retrieve.
 * @return {Promise} A Promise that resolves to a Page object.
 */
function fetchPage (pageNum) {
  return store.getMapper('post').findAll({
    limit: PAGE_SIZE,
    offset: (pageNum - 1) * PAGE_SIZE,
    orderBy: [['created_at', 'desc']]
  }).then(function (page) {
    page.data = store.add('post', page.data)
    return page
  })
}

export default class Posts extends React.Component {
  constructor (props) {
    super(props)
    fetchPage(1).then((page) => {
      this.setState(this.getState(1, page))
    })
    this.state = { posts: [], currentPage: 1, total: 0 }
  }
  getState (currentPage, page) {
    return {
      currentPage: page.page,
      total: page.total,
      posts: store.filter('post', {
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
        orderBy: [['created_at', 'DESC']]
      })
    }
  }
  fetchPage (pageNum) {
    fetchPage(pageNum).then((page) => {
      this.setState(this.getState(pageNum, page))
    })
  }
  prev (e, pageDecrease) {
    e.preventDefault()
    if (this.state.currentPage > 1) {
      this.fetchPage(this.state.currentPage - pageDecrease)
    }
  }
  next (e, pageIncrease) {
    e.preventDefault()
    if ((this.state.currentPage * PAGE_SIZE) < this.state.total) {
      this.fetchPage(this.state.currentPage + pageIncrease)
    }
  }
  render () {
    const currentPage = this.state.currentPage
    const total = this.state.total
    let posts = this.state.posts.map(function (post) {
      return (
        <div key={post.id}>
          <h3>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <small className="pull-right">{post.created_at}</small>
          </h3>
          <div>{post.content.substring(0, 200)}...</div>
        </div>
      )
    })
    const links = [
      <li key="1">
        <a href="" aria-label="Previous" onClick={(e) => this.prev(e, 1)}>
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    ]
    if (currentPage > 2) {
      links.push(<li key="2" onClick={(e) => this.prev(e, 2)}>
        <a href="">{currentPage - 2}</a>
      </li>)
    }
    if (currentPage > 1) {
      links.push(<li key="3" onClick={(e) => this.prev(e, 1)}>
        <a href="">{currentPage - 1}</a>
      </li>)
    }
    links.push(<li key="4" className="active"><a href="">{currentPage}</a></li>)
    if ((currentPage * PAGE_SIZE) < total) {
      links.push(<li key="5" onClick={(e) => this.next(e, 1)}>
        <a href="">{currentPage + 1}</a>
      </li>)
    }
    if (((currentPage + 1) * PAGE_SIZE) < total) {
      links.push(<li key="6" onClick={(e) => this.next(e, 2)}>
        <a href="">{currentPage + 2}</a>
      </li>)
    }
    links.push(<li key="7">
      <a href="" aria-label="Next" onClick={(e) => this.next(e, 1)}>
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>)
    let nav = <nav><ul className="pagination">{links}</ul></nav>
    if (total <= PAGE_SIZE) {
      nav = ''
    }
    if (!posts.length) {
      posts = 'No posts yet...'
    }
    return (<div>
      <div>{posts}</div>
      {nav}
    </div>)
  }
}
