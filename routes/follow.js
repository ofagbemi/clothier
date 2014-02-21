var data = require('../data.json');
var util = require('./util.js');
var profile = require('./profile.js');
var dashboard = require('./dashboard.js');

exports.followuser = function(req, res) {
  var ret = {'follow': false};
  
  // prevent user from following themselves
  if(req.body.followeruserid == req.body.follweduserid) {
    console.log('follow.js: user ' + req.body.follweruserid + ' tried to follow him/herself');
    res.writeHead(403);
    res.end();
    return;
  }
  
  var follower = data['users'][req.body.followeruserid];
  var followed = data['users'][req.body.followeduserid];
  
  if(!isfollowing(follower['id'], followed['id'])) {
    followed['followers_ids'].unshift(follower['id']);
    follower['following_ids'].unshift(followed['id']);
    ret['follow'] = true;
    console.log('follow.js: ' + follower['id'] + ' is following ' + followed['id']);
    console.log('follow.js: ' + follower['id'] + ' is now following ' + follower['following_ids'].length + ' users');
    
    dashboard.addaisleposts(follower, followed);
  } else {
    // if already following, unfollows
    var index = followed['followers_ids'].indexOf(req.body.followeruserid);
    if(index > -1) followed['followers_ids'].splice(index, 1);
	
    var index2 = follower['following_ids'].indexOf(req.body.followeduserid);
    if(index2 > -1) follower['following_ids'].splice(index2, 1);
    ret['follow'] = false;
    console.log('follow.js: ' + req.body.followeruserid + ' is not following ' + req.body.followeduserid);
    
    dashboard.removeaisleposts(follower, followed);
  }
  
  res.json(ret);
}

function isfollowing(followerid, followedid) {
  var follower = data['users'][followerid];
  if(follower) {
    return util.contains(followedid, follower['following_ids']);
  } else {
    console.log('follow.js: couldn\'t find user ' + followerid);
  }
}

function isloggedinfollowing(userid) {
  var logged_in_user = profile.getloggedinuser(req);
  if(logged_in_user) {
    return util.contains(userid, logged_in_user['following_ids']);
  }
}

exports.isloggedinfollowing = isloggedinfollowing;
exports.isfollowing = isfollowing;