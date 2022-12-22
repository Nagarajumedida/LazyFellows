const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { Socket } = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors())

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is Running")
  // console.log("Fasak")
})

io.on("connection", (socket) => {

  socket.emit("me", socket.id)//my specific user && given own id to frontend side

//Sockent Handlers

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended")
  })

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name })
  })

  socket.on("answercall", (data) => { //reciving dataā
    io.to(data.to).emit("callaccepted", data.signal)
  })
})

server.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`))