var PostsView = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    Post.findAll();
    return this.getState();
  },
  componentDidMount: function () {
    User.on('DS.change', this.onChange);
    Post.on('DS.change', this.onChange);
  },
  componentWillUnmount: function () {
    User.off('DS.change', this.onChange);
    Post.off('DS.change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange: function () {
    this.setState(this.getState());
  },
  /*
   * Methods
   */
  getState: function () {
    return {
      loggedInUser: User.loggedInUser,
      posts: Post.getAll()
    };
  },
  render: function () {
    var link = this.state.loggedInUser ? (<Link className="btn btn-xs" to="newPost">New Post</Link>) : '';
    return (
      <div>
        <h1 className="page-header">
          Posts {link}
        </h1>

        {this.state.posts.map(function (post) {
          return (
            <div key={post.id}>
              <Link to="post" params={{id:post.id}}>{post.title}</Link>
              <small className="pull-right">{post.created_at}</small>
            </div>
          );
        })}
      </div>
    );
  }
});
