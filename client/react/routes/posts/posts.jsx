var PostsView = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    Post.findAll();
    return this.getState();
  },
  componentDidMount: function () {
    Post.on('DS.change', this.onChange);
  },
  componentWillUnmount: function () {
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
      users: Post.getAll()
    };
  },
  render: function () {
    return (
      <div>
        <h1 class="page-header">
          Posts
        </h1>

        {this.state.users.map(function (post) {
          return (
            <div key={post.id}>
              <a href={'/posts/' + post.id}>{post.title}</a>
              <small className="pull-right">{post.created_at}</small>
            </div>
          );
        })}
      </div>
    );
  }
});
