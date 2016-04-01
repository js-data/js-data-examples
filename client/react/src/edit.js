import React from 'react'
import {store} from './store'

export default class Edit extends React.Component {
  constructor (props) {
    super(props)
    const id = this.props.params.id
    if (id && id !== 'new') {
      store.find('post', id).then((post) => {
        this.setState({
          title: post.title,
          content: post.content
        })
      })
    }
    this.state = { title: '', content: '' }
  }
  onTitleChange (e) {
    e.preventDefault()
    this.setState({ title: e.target.value })
  }
  onContentChange (e) {
    e.preventDefault()
    this.setState({ content: e.target.value })
  }
  onSubmit (e) {
    const id = this.props.params.id
    e.preventDefault()
    const props = {
      title: this.state.title,
      content: this.state.content
    }
    let promise
    if (id === 'new') {
      promise = store.create('post', props)
    } else {
      promise = store.update('post', id, props)
    }
    promise.then((post) => {
      this.context.router.push(`/post/${post.id}`)
    })
  }
  render () {
    return (
      <div>
        <form id="new-post-form" name="new-post-form">
          <div className="form-group">
            <label className="control-label" htmlFor="title">Title</label>
            <input type="text" required id="title" name="title" onChange={this.onTitleChange.bind(this)}
                   className="form-control" value={this.state.title}/>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor="content">Content</label>
            <textarea required id="content" name="content" value={this.state.content} onChange={this.onContentChange.bind(this)}
                      className="form-control"></textarea>
          </div>
          <div className="form-group">
            <button onClick={this.onSubmit.bind(this)} className="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    )
  }
}

Edit.contextTypes = { router: React.PropTypes.object }
