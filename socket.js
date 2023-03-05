let _io;
const connectedUsers = {};

module.exports = {
  init: (server, option) => {
    _io = require("socket.io")(server, option);
    return _io;
  },
  getIO: () => {
    if (!_io) throw new Error("socket is not found!");
    return _io;
  },
  saveServer: (roomId, server) => {
    connectedUsers[roomId] = server;
  },
  getServer: (roomId) => {
    return connectedUsers[roomId];
  },
  deleteServer: (roomId) => {
    delete connectedUsers[roomId];
  },
};
