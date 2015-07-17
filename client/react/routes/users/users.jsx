var UsersView = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    User.findAll();
    return this.getState();
  },
  componentDidMount: function () {
    User.on('DS.change', this.onChange);
  },
  componentWillUnmount: function () {
    User.off('DS.change', this.onChange);
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
      users: User.getAll()
    };
  },
  render: function () {
    return (
      <div>
        <h1 className="page-header">
          Users
        </h1>

        {this.state.users.map(function (user) {
          return (
            <div key={user.id}>
              <Link to="user" params={{id: user.id}}>{user.name}</Link>
              <small className="pull-right">{user.username}</small>
            </div>
          );
        })}
      </div>
    );
  }
});
