var winwidth = window.innerWidth;
var renderposts_aislepostindex = 1;
var renderposts_userid;
var renderposts_key;

function placemarkers() {
  $('.post_stage .marker').each(function() {
    $(this)
      .css('left', $(this).attr('x') * $(this).parent().width() + 'px')
      .css('top', $(this).attr('y') * $(this).parent().height() + 'px');
    });
}
function alignposts() {

}
function renderposts(userid, key) {
  renderposts_userid = userid;
  renderposts_key = key;
  alignposts();
  placemarkers();
  renderposts_bindclicklisteners();
  
  if(!key) {$('.load_more_posts_button').hide();}
}
// renders comments and posts
function renderpost(userid) {
  renderposts_userid = userid;
  alignposts();
  placemarkers();
  renderposts_bindclicklisteners();
  var totalwidth = $('.post_comment').width();
  var marginRight = 4;
  $('.comment_body')
    .css('max-width', totalwidth - ($('.profpic').width() + marginRight) + 'px');
}
// bind click listeners
function renderposts_bindclicklisteners() {
  /*
  $('.shopping_mode_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      
      if($(this).hasClass('active')) {
        $('.post').slideDown();
        $(this).removeClass('active');
      } else {
        $('.post').slideUp();
        $('.purchase_link').parents('.post').slideDown();
        $(this).addClass('active');
      }
    });
    */
  $('.user_attribution a, .user_link')
    .click(function(e) {
      // analytics
      var username = $(this).text();
      ga('send', 'event', 'user', 'click', 'user ' + username);
    });
  $('.marker')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      
      // analytics
      ga('send', 'event', 'post', 'item click');
      
      var title = $(this).attr('title');
      var item_stage = $(this).parent().find(".item_stage[title='" + title + "']");
      item_stage.fadeIn(200);
      // remember to look inside the parent of this marker
    });
  $('.post_stage .item_stage .close_button')
    .unbind('click')
    .click(function() {
      $(this).parent().fadeOut();
    });
  $('.load_more_posts_button a')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      renderposts_loadaisleposts(renderposts_userid);
    });
}

function renderposts_loadaisleposts(userid) {
  if(renderposts_key) {
	var data = {
	  'num_posts': 4,
	  'index': renderposts_aislepostindex,
	  'userid': userid,
	  'key': renderposts_key
	};
  
	$.ajax({
	  type: 'GET',
	  url: '/getaisleposts',
	  data: data,
	  success: renderposts_rendernewaisleposts
	});
  }
}

function renderposts_rendernewaisleposts(response) {
  if(response['no_more_posts']) {
    $('.load_more_posts_button').html('No more posts');
  } else {
    $(response)
      .hide()
      .insertBefore('.load_more_posts_button')
      .slideDown(function() {
        placemarkers();
      });;
    renderposts_aislepostindex++;
    setlinks(); // call to disable new href's
  }
}