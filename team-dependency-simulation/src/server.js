const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const os = require('os')

var prod = os.hostname() == "agilesimulations" ? true : false

var connectDebugOff = prod
var debugOn = !prod

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

io.on("connection", (socket) => {
  connectDebugOff || console.log(`A user connected with socket id ${socket.id}.`)

  socket.on("disconnect", () => {
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
  })

  socket.on("setRemoteState", (data) => { emit("setRemoteState", data) })

  socket.on("nextSprint", () => { emit("nextSprint") })

  socket.on("resetState", () => { emit("resetState") })
})

var port = process.argv[2] || 3001

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
