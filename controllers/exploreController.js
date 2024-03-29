const moment = require("moment");

const Flash = require("../utils/Flash");
const Post = require("../models/Post");
const Profile = require('../models/Profile')
function genDate(days) {
  let date = moment().subtract(days, "days");
  return date.toDate();
}

function generateFilterObject(filter) {
  let filterObj = {};
  let order = 1;

  switch (filter) {
    case 'week': {
      filterObj = {
        createdAt: { 
          $gt: genDate(7),
        },
      };
      order = -1;
      break;
    }
    case 'month': {
      filterObj = {
        createdAt: {
          $gt: genDate(30),
        },
      };
      order = -1;
      break;
    }
    case 'all': {
      order = -1;
      break;
    }
  }
  return {
    filterObj,
    order,
  };
}

exports.exploreGetController = async (req, res, next) => {
  let filter = req.query.filter || 'latest';

  let { order, filterObj } = generateFilterObject(filter.toLowerCase());
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 2;

  try {
    let posts = await Post.find(filterObj)
      .populate('author', 'username')
      .sort(order === 1 ? '-createdAt' : 'createdAt')
      .skip((itemPerPage * currentPage) - itemPerPage)
      .limit(itemPerPage);

    let totalPost = await Post.countDocuments(); 
    let totalPage = totalPost / itemPerPage;
    let bookmarks = []
    if(req.user){
        let profile = await Profile.findOne({ user: req.user._id})
        if(profile){
            bookmarks=profile.bookmarks
        }
    }

    res.render('pages/explorer/explorer', {
      tittle: "Explore All Posts",
      filter,
      flashMessage: Flash.getMessage(req),
      posts,
      itemPerPage,
      currentPage,
      totalPage,
      bookmarks,
    });
  } catch (e) {
    console.log("Can not get params");
    next(e);
  }
};

exports.singlePostGetController = async (req, res, next) => {
  let {postId} = req.params

  try {
    let post = await Post.findById(postId)
        .populate('author', 'username profilePics')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username profilePics'
          }
        })
        .populate({
          path: 'comments',
          populate: {
            path: 'replies.user',
            select: 'username profilePics'
          }
        })

        if(!post) {
          let error = new Error('404 Page Not Found')
          error.status = 404
          throw error
        }

        let bookmarks = []
        if(req.user) {
          let profile = await Profile.findOne({user: req.user._id})
          if(profile) {
            bookmarks = profile.bookmarks
          }
        }

        res.render('pages/explorer/singlePage', {
          tittle: post.tittle,
          flashMessage: Flash.getMessage(req),
          post,
          bookmarks
        })
  } catch (e) {
    next(e)
  }
}