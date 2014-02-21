var profile = require('./profile.js');
var dashboard = require('./dashboard.js');

exports.view = function(req, res) {
  var ret = {};
  // enclose in a list to do {{#each posts}}
  models.User.
        find("id", req.query.id).
        exec(afterSearchUser);

        function afterSearchUser(err, result) {
          ret['posts'] = result[0];
  
          ret['logged_in_user'] = profile.getloggedinuser(req);
  
          for(var i=0;i<ret['posts'].length;i++) {
            var post = ret['posts'][i];
            post['items'] = [];
            if(post['item_ids']) {
              post['items'] = dashboard.getpostsfromids(post['item_ids']);
            }
          }
          res.render('outfit', ret);
        }
};