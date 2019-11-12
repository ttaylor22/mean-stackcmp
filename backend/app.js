const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

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
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents =>{
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
    });
  });
});

app.put('/api/posts/:id', (req,res,next)=>{
  Post.updateOne({_id: req.params.id}, { $set: { content: req.body.content }}).then(result => {
    res.status(200).json({ message: "Post updated!"})
  });
});


app.delete('/api/posts/:id', (req,res,next)=>{
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post removed!"})
  });
});

module.exports = app;
