var Link = ReactRouter.Link;
var MainHeader = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
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
      loggedInUser: User.loggedInUser
    };
  },
  login: function (e) {
    e.preventDefault();
    window.location = '/auth/github';
  },
  render: function () {
    var loggedInUser = User.loggedInUser;
    var path = window.location.pathname;
    console.log(path);
    var loginLink = loggedInUser ? (
      <li>
        <a href={'/users/' + loggedInUser.id}>
          Hi <strong>{loggedInUser.displayName || loggedInUser.username}</strong>!
        </a>
      </li>
    ) : (
      <li>
        <a href="" onClick={this.login}>Login with Github</a>
      </li>
    );
    return (
      <div className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">js-data + React Example</a>
            <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className="navbar-collapse collapse" id="navbar-main">
            <ul className="nav navbar-nav">
              <li className={!path || path === '/' ? 'active' : ''}>
                <Link to="/">Home</Link>
              </li>
              <li className={path.indexOf('users') !== -1 ? 'active' : ''}>
                <Link to="users">Users</Link>
              </li>
              <li className={path.indexOf('posts') !== -1 ? 'active' : ''}>
                <Link to="posts">Posts</Link>
              </li>
              {loginLink}
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://github.com/js-data/js-data-examples" target="_blank">Code on Github</a>
              </li>
              <li>
                <a href="https://gitter.im/js-data/js-data" target="_blank">Gitter Channel</a>
              </li>
              <li>
                <a href="https://groups.io/org/groupsio/jsdata" target="_blank">Mailing List</a>
              </li>
              <li>
                <a href="https://www.js-data.io" target="_blank">js-data.io</a>
              </li>
            </ul>

          </div>
        </div>
      </div>

    );
  }
});
