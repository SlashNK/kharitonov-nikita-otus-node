const express = require("express");
const http = require("http");
const socket = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const socketIo = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));
app.get("/locations.geojson", (req, res) => {
  res.sendFile(path.join(__dirname, "locations.geojson"));
});

let locations = [];

socketIo.on("connection", (socket) => {
  console.debug("user connected");
  socket.on("location", (location) => {
    console.debug("received location", location);
    locations.push(location);
    fs.writeFileSync(
      "locations.geojson",
      JSON.stringify(
        {
          type: "FeatureCollection",
          features: locations.map((loc) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [loc.lng, loc.lat],
            },
            properties: {},
          })),
        },
        null,
        2
      )
    );
  });
  socket.on("disconnect", () => {
    console.debug("user disconnected");
  });
});
server.listen(port, () => {
  console.debug(`Server running on port ${port}`);
});
