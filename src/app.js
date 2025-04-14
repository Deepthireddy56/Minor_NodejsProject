// require("dotenv").config();

// const cors = require('cors');
// const express = require('express');
// const session = require("express-session");
// const app = express();

// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const postRoutes = require("./routes/postRoutes");
// const MongoStore = require("connect-mongo");
// app.use(express.json());
// app.use(cors());

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
//   cookie: { secure: false }
// }));

// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/posts", postRoutes);

// module.exports = app;


require("dotenv").config();

const cors = require('cors');
const express = require('express');
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const communityRoutes = require("./routes/communityRoutes");
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities",communityRoutes)

module.exports = app;