// title, body, author, tags, thumbnail, readtime, likes, dislikes, comments

const { Schema, model } = require('mongoose')

const Comment = require('./Comment')

const postSchema = new Schema(
  {
    tittle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      maxlength: 5000
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    thumbnail: String,
    readTime: String,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: Comment,
      },
    ],
  },
  { timestamps: true }
); 

postSchema.index({
  tittle: 'text',
  body: 'text',
  tags: 'text'
}, {
  weights: {
    tittle:5,
    tags: 5,
    body:2

  }

})

const Post = new model('Post', postSchema)

module.exports = Post