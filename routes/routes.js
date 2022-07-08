
const express = require('express');

const { signup, login, isAuth, validateAuth } = require('../controllers/auth');
const { fetchUser, updateUser } = require('../controllers/users');
const { createPost, deletePost, fetchPost, fetchRecentPosts, fetchPopularPosts, fetchUserPosts, fetchNumUserPosts } = require('../controllers/posts');
const { createReply, createReplyToReply, deleteReply, deleteReplyToReply, fetchNumUserReplies } = require('../controllers/replies');
const { fetchTags, fetchUserTags, fetchPostTags, addUserTags, deleteUserTags, addPostTags, deletePostTags, createTags } = require('../controllers/tags');
const { addPostUpvote, addReplyUpvote, removePostUpvote, removeReplyUpvote } = require('../controllers/upvotes');

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.get('/private', validateAuth);

router.get('/fetchUser', isAuth, fetchUser);

router.post('/updateUser', isAuth, updateUser);

router.post('/createPost', isAuth, createPost);

router.post('/deletePost', isAuth, deletePost);

router.get('/fetchPost', isAuth, fetchPost);

router.get('/fetchRecentPosts', isAuth, fetchRecentPosts);

router.get('/fetchPopularPosts', isAuth, fetchPopularPosts);

router.get('/fetchUserPosts', isAuth, fetchUserPosts);

router.get('/fetchNumUserPosts', isAuth, fetchNumUserPosts);

router.post('/createReply', isAuth, createReply);

router.post('/createReplyToReply', isAuth, createReplyToReply);

router.post('/deleteReply', isAuth, deleteReply);

router.post('/deleteReplyToReply', isAuth, deleteReplyToReply);

router.get('/fetchNumUserReplies', isAuth, fetchNumUserReplies);

router.get('/fetchTags', isAuth, fetchTags);

router.get('/fetchUserTags', isAuth, fetchUserTags);

router.get('/fetchPostTags', isAuth, fetchPostTags);

router.post('/addUserTags', isAuth, addUserTags);

router.post('/deleteUserTags', isAuth, deleteUserTags);

router.post('/addPostTags', isAuth, addPostTags);

router.post('/deletePostTags', isAuth, deletePostTags);

router.post('/createTags', isAuth, createTags);

router.post('/upvotePost', isAuth, addPostUpvote);

router.post('/removeUpvotePost', isAuth, removePostUpvote);

router.post('/upvoteReply', isAuth, addReplyUpvote);

router.post('/removeUpvoteReply', isAuth, removeReplyUpvote);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

module.exports = router
//export default router;