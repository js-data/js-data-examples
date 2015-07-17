var NewPostView = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return {
      title: '',
      body: ''
    };
  },
  /*
   * Event Handlers
   */
  onTitleChange: function (e) {
    e.preventDefault();
    this.setState({title: e.target.value});
  },
  onBodyChange: function (e) {
    e.preventDefault();
    this.setState({body: e.target.value});
  },
  onSubmit: function (e) {
    e.preventDefault();
    var _this = this;
    Post.create({
      title: this.state.title,
      body: this.state.body
    }).then(function (post) {
      _this.context.router.transitionTo('post', {id: post.id});
    });
  },
  /*
   * Methods
   */
  render: function () {
    return (
      <div>
        <h1 className="page-header">
          New Post
        </h1>

        <form id="new-post-form" name="new-post-form">
          <div className="form-group">
            <label className="control-label" for="title">Title</label>
            <input type="text" required id="title" name="title" onChange={this.onTitleChange}
                   className="form-control" value={this.state.title}/>
          </div>
          <div className="form-group">
            <label className="control-label" for="body">Content</label>
            <textarea required id="body" name="body" value={this.state.body} onChange={this.onBodyChange}
                      className="form-control"></textarea>
          </div>
          <div className="form-group">
            <button onClick={this.onSubmit} className="btn btn-success">Publish Post</button>
          </div>
        </form>
      </div>
    );
  }
});
