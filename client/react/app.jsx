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
    <Route name="users" path="/users" handler={UsersView}/>
    <Route name="posts" path="/posts" handler={PostsView}/>
  </Route>
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('main-container'));
});

var socket = io.connect('//' + window.location.hostname + ':' + window.location.port, {path: '/api/socket.io'});

socket.on('create', function (data) {
  if (data.ownerId && User.loggedInUser && User.loggedInUser.id === data.ownerId) {
    store.find(data.resource, data.id);
  }
});
socket.on('update', function (data) {
  if (data.id === 'all' && data.seriesId) {
    store.filter(data.resource, {seriesId: data.seriesId}).forEach(function (instance) {
      store.refresh(data.resource, instance.id);
    });
  } else {
    store.refresh(data.resource, data.id);
  }
});
socket.on('destroy', function (data) {
  if (data.id === 'all' && data.lessonId) {
    store.ejectAll(data.resource, {lessonId: data.lessonId});
  } else {
    store.eject(data.resource, data.id);
  }
});
