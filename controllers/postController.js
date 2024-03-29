const Flash = require('../utils/Flash')
const {validationResult} = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const readingTime = require('reading-time')

const Post = require('../models/Post')
const Profile = require('../models/Profile')

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/createPost', {
        tittle: 'Create A New Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req, res, next) => {
    let {tittle, body, tags} = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

    if(!errors.isEmpty()) {
        res.render("pages/dashboard/post/createPost", {
          tittle: "Create A New Post",
          error: errors.mapped(),
          flashMessage: Flash.getMessage(req),
          value: {
            tittle,
            body,
            tags
          }
        });
    }

    if(tags) {
      tags = tags.split(', ')
    }

    let readTime = readingTime(body).text

    let post = new Post({
      tittle,
      body,
      tags,
      author: req.user._id,
      thumbnail: '',
      readTime,
      likes: [],
      dislikes: [],
      comments: []
    })

    if(req.file) {
      post.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
      let createdPost = await post.save()
      await Profile.findOneAndUpdate(
        { user: req.user._id },
        {$push: {'posts': createdPost._id}}
      )
      req.flash('success', 'Post Created Successfully')
      return res.redirect(`/posts/edit/${createdPost._id}`)
    } catch(e) {
      next(e)
    }
}

exports.editPostGetController = async(req, res, next) => {
  let postId = req.params.postId

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId})

    if(!post) {
      let error = new Error('404 Page Not Found')
      error.status = 404
      throw error
    }

    res.render('pages/dashboard/post/editPost', {
      tittle: 'Edit Your Post', 
      error: {},
      flashMessage: Flash.getMessage(req),
      post
    })
  } catch (e) {
    next(e)
  }
}

exports.editPostPostController = async(req, res, next) => {
  let { tittle, body, tags } = req.body;
  let postId = req.params.postId;
  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId})

    if (!post) {
      let error = new Error("404 Page Not Found");
      error.status = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      res.render("pages/dashboard/post/createPost", {
        tittle: "Create A New Post",
        error: errors.mapped(),
        flashMessage: Flash.getMessage(req),
        post
      });
    }

    if (tags) {
      tags = tags.split(", ");
    }

    let thumbnail = post.thumbnail
    if(req.file) {
      thumbnail = req.file.filename
    }

    await Post.findOneAndUpdate(
      { _id: post._id },
      { $set: {tittle, body, tags, thumbnail }},
      {new: true}
    )

    req.flash('success', 'Post Updated Successfully')
    res.redirect('/posts/edit/' + post._id)

  } catch (e) {
    next(e)
  }
  
}

exports.deletePostGetController = async (req, res, next) => {
  let { postId } = req.params;

  try {
    let post = await Post.findOne({author: req.user._id, _id: postId})

    if(!post) {
      let error = new Error('404 Page Not Found')
      error.status = 404
      throw error
    }

    await Post.findOneAndDelete({ _id: postId })
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {$pull: {'posts': postId}}
    )
    req.flash('success', 'Post Deleted Successfully')
    res.redirect('/posts')
  } catch (e) {
    next(e)
  }
}

exports.postsGetController = async(req, res, next) => {
  try {
    let posts = await Post.find({author: req.user._id})
    res.render('pages/dashboard/post/posts', {
      tittle: 'My Created Posts', 
      posts,
      flashMessage: Flash.getMessage(req)
    })
  } catch (e) {
    next(e)
  }
}