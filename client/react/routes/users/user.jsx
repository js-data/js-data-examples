var UserView = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    var params = this.context.router.getCurrentParams();
    User.find(params.id, {bypassCache: true});
    return this.getState(params);
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
  /*
   * Methods
   */
  getState: function (params) {
    return {
      user: User.get(params.id) || {},
      posts: Post.filter({owner_id: params.id}),
      comments: Comment.filter({owner_id: params.id})
    };
  },
  render: function () {
    return (
      <div className="user">
        <h1 className="page-header">
          {this.state.user.name }
        </h1>

        <div className="row">
          <div className="col-md-6">
            <h3>Posts</h3>

            {this.state.posts.map(function (post) {
              return (
                <div>
                  <Link to="post" params={{id: post.id}}>{post.title}</Link>
                  <span className="pull-right">
                    {moment(post.created_at).fromNow()}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="col-md-6">
            <h3>Comments</h3>

            {this.state.comments.map(function (comment) {
              return (
                <div>
                  <Link to="post" params={{id: comment.post_id}}>Go to post</Link>&nbsp;
                  <span>{comment.body}</span>
                  <span className="pull-right">
                    {moment(comment.created_at).fromNow()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
});
