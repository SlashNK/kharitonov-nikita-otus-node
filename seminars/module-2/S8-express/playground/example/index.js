import express from "express";
import { router as corsRouter } from "./routes/cors.js";
import bodyParser from "body-parser";
import cors from "cors";
import basicAuth from "express-basic-auth";
import fs from "fs";
import xmlparser from "express-xml-bodyparser";
import { render } from "pug";

const app = express();

const users = [{ name: "user1", pwd: "password@@@" }];

app.use(cors());
// app.use(basicAuth({
//     users: { 'user1': 'password@@@' }
// }))
//middleware
// app.use((req, res, next) => {
//   req.zesty = 1;
//   console.log(`inside my custom middleware 1 zesty: ${req.zesty}`);
//   next();
//   console.log(`inside my custom middleware 1 after nexst zesty: ${req.zesty}`);
// });
// app.use((req, res, next) => {
//   req.zesty = req.zesty ? req.zesty + 1 : 0;
//   console.log(`inside my custom middleware 2 zesty: ${req.zesty}`);
//   next();
//   console.log(`inside my custom middleware 2 after nexst zesty: ${req.zesty}`);
// });
// app.use((req, res, next) => {
//   req.on("data", (da) => {
//     req.body = JSON.parse(da.toString());
//     // console.log(da.toString());
//   });
//   req.on("end", () => {
//     next();
//   });
// });

// app.use((req, res, next) => {
//     console.log(req.query);
//     console.log('inside 1st middleware');
//     res.on('finish', () => {
//         console.log('middleware 1 finish');
//     })
//     next();

// });

// app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(xmlparser());
//cors
app.use("/cors", corsRouter);
// app.use(cors())

// app.use((req, res, next) => {

//     const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
//     console.log(Buffer.from(b64auth, 'base64').toString());
//     const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
// console.log('login',login, 'passwd',password);
//     if (users.some(x => x.name === login && x.pwd === password)) {

//         return next();
//     }

//     res.set('WWW-Authenticate', 'Basic realm="401"') // change this
//     res.status(401).send('Authentication required.') // custom message
// });

app.get("/users", (_, res) => {
  console.log("inside request");
  res.send("ok1");
  console.log("after request");
});
//парсеры
app.post("/users", (req, res) => {
  console.log(req.body);
  res.send("ok");
});

app.post("/xml", (req, res) => {
  console.log(JSON.stringify(req.body));

  res.send("ok");
});

// app.get("/pug", (req, res) => {
//   res.render("index", {
//     list1: ["alpha", "beta", "gamma"],
//     msg: "aaa маленькое",
//   });
// });
// app.set("view engine", "pug");


app.listen(3001, () => {
  console.log("listening on port 3001");
});
