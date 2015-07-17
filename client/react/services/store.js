var store = new JSData.DS();
var adapter = new DSHttpAdapter({
  basePath: '/api'
});
store.registerAdapter('http', adapter, {'default': true});
