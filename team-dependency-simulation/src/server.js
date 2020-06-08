const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

var debugOn = true
function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data);
}

io.on("connection", (socket) => {
  console.log(`A user connected with socket id ${socket.id}.`)

  socket.on("disconnect", () => {
    console.log(`User with socket id ${socket.id} has disconnected.`)
  });

  socket.on("setRemoteState", (data) => { emit("setRemoteState", data) })
});

var port = process.argv[2] || 3001

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
