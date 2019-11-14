const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require("./routes/post");

const app = express();

mongoose.connect("mongodb+srv://bot12:74IIIyztcPD5GYH0@cluster0-rmzga.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Database connection passed');
  })
  .catch(() =>{
    console.log('Database connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
