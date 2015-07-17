var PostView = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    var params = this.context.router.getCurrentParams();
    Post.find(params.id);
    var state = this.getState(params);
    state.comment = '';
    return state;
  },
  componentDidMount: function () {
    User.on('DS.change', this.onChange);
    Post.on('DS.change', this.onChange);
    Comment.on('DS.change', this.onChange);
  },
  componentWillUnmount: function () {
    User.off('DS.change', this.onChange);
    Post.off('DS.change', this.onChange);
    Comment.off('DS.change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange: function () {
    this.setState(this.getState(this.context.router.getCurrentParams()));
  },
  onCommentChange: function (e) {
    e.preventDefault();
    this.setState({comment: e.target.value});
  },
  onSubmit: function (e) {
    e.preventDefault();
    var _this = this;
    Comment.create({
      body: this.state.comment,
      post_id: this.state.post.id
    }).then(function () {
      _this.setState({comment: ''});
    });
  },
  /*
   * Methods
   */
  getState: function (params) {
    return {
      loggedInUser: User.loggedInUser,
      post: Post.get(params.id) || {},
      comments: Comment.filter({post_id: params.id})
    };
  },
  render: function () {
    var loggedInUser = User.loggedInUser;
    var divider = this.state.comments.length ? <hr/> : '';
    var newComment = loggedInUser ? (
      <div className="row">
        <div className="col-md-10">
            <textarea value={this.state.comment} placeholder="comment" className="form-control"
                      onChange={this.onCommentChange}></textarea>
        </div>
        <div className="col-md-2">
          <button onClick={this.onSubmit} className="btn btn-primary">
            Submit comment
          </button>
        </div>
      </div>
    ) : '';
    return (
      <div className="post">
        <h2 className="page-header">
          {this.state.post.title}
          <small>{this.state.post.created_at}</small>
        </h2>
        <div>{this.state.post.body}</div>
        <hr/>
        {this.state.comments.map(function (comment) {
          return (
            <div>
              <h5>
                {comment.user.username}
                <small className="pull-right">{moment(comment.created_at).fromNow()}</small>
              </h5>

              <div>{comment.body}</div>
            </div>
          );
        })}
        {divider}
        {newComment}
      </div>
    );
  }
});
