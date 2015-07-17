var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var RouteHandler = ReactRouter.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <div className="container">
        <MainHeader/>

        <div className="container">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={HomeView}/>
    <Route name="user" path="/users/:id" handler={UserView}/>
    <Route name="users" path="/users" handler={UsersView}/>
    <Route name="newPost" path="/posts/new" handler={NewPostView}/>
    <Route name="post" path="/posts/:id" handler={PostView}/>
    <Route name="posts" path="/posts" handler={PostsView}/>
  </Route>
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('main-container'));
});

var socket = io.connect(window.location.origin);

socket.on('create', function (data) {
  store.find(data.resource, data.id);
});
socket.on('update', function (data) {
  store.refresh(data.resource, data.id);
});
socket.on('destroy', function (data) {
  store.eject(data.resource, data.id);
});
