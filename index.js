const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const path = require('path');
const port = process.env.PORT || 5000;
const SubmitSerway = require('./routes/UserSerway/submitSerway.js');
const VerifyUser = require('./routes/api/verifyuser.js');
const PostBlogs = require('./routes/api/blogs.js');
const forceSsl = require('force-ssl-heroku');
 

app.use(forceSsl);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// Middlewares
app.use(cors());
// Routes
const users = require("./routes/api/users");
app.use('/api/user/submitserway', SubmitSerway);
app.use('/email/confirm', VerifyUser)
app.use('/api/admin/postBlog/create',PostBlogs)
app.use('/api/admin/getBlog/read',PostBlogs)
app.use('/api/admin/updateBlog',PostBlogs)
app.use('/api/admin/deleteBlog',PostBlogs)
app.use('/api/admin/getUsers',users)

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true  }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, 'build')));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server Running at ${port}`);
});