// Our service for broadcasting messages to connected clients.
// A way of implementing a sort of "3-way binding"
module.exports = function (container) {

  function sendMessage(event, resource, instance) {
    var io = container.get('io');
    var message = {
      id: instance.id,
      owner_id: instance.owner_id,
      resource: resource,
      event: event
    };
    io.sockets.emit(event, message);
  }

  return {
    sendCreateMessage: function (resource, instance) {
      sendMessage('create', resource, instance);
    },

    sendDestroyMessage: function (resource, instance) {
      sendMessage('destroy', resource, instance);
    },

    sendUpdateMessage: function (resource, instance) {
      sendMessage('update', resource, instance);
    }
  };
};
