var createpost_userid = null;
var createpost_addeditems = [];
var createpost_addeditem_partial = '\
<a class="createpost_addeditem">\
  <div class="createpost_addediteminner" style="background:white;border:solid 1px rgba(0,0,0,0.15);">\
	<img src="/images/icons/shirt/shirt.svg" style="width:100%;">\
  </div>\
  <div style="color:black;display:inline-block;width:100%;text-align:center;">{{title}}</div>\
</a>'

// var createpost_addeditemiconheight = 40;
// var createpost_addeditemiconwidth = 40;

var createpost_uploadedimage = false;

function createpost_redirecttopost(response) {
  window.location.replace('/outfit?id=' + response['postid']);
}

function createpost_start(id) {
  createpost_userid = id;
  createpost_bindclicklisteners();
  $('.createpost_stepwrap.1')
    .css('margin-top', window.innerHeight/2 - $('.1').outerHeight())
    .fadeIn(600)
    .animate({
      marginTop: '0px'
    }, 600,
      function() {
        createpost_show(2);
        createpost_scrollto(2);
      });
}
function createpost_showpostbutton() {
  $('#post_button')
    .fadeIn(600);
}
function createpost_hidepostbutton() {
  $('#post_button')
    .fadeOut(600);
}
function createpost_show(num) {
  $('.createpost_stepwrap.' + num)
      .fadeIn(600);
  if(num == 4) {
    $('.photo_stage').slideUp();
  }
};
function createpost_hide(num) {
  $('.createpost_stepwrap.' + num).fadeOut(600);
  if(num == 4) {
    $('.photo_stage').slideDown();
  }
}
function createpost_scrollto(num) {
  $('html, body').animate({
    scrollTop: $('.createpost_stepwrap.' + num)
                 .offset().top
  }, 1800);
}
function createpost_bindclicklisteners() {
  $("input[name='post_title']")
    .unbind('keyup')
    .keyup(function(e) {
      if($(this).val() != '') {
        $('.img_upload_wrap').slideDown(600);
      } else {
        if(!createpost_uploadedimage) {
          $('.img_upload_wrap').slideUp(600);
        }
      }
    });
  $('#post_button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var title = $("input[name='post_title']").val();
      if(title == '') {
        alert('You have to give this post a title');
        return;
      }
      
      $(this).unbind('click');
      
      
      var time = (new Date()).toString();
      var price = createpost_gettotalprice(createpost_addeditems);
      var price_num = createpost_gettotalpricenum(createpost_addeditems);
      var tags = createpost_parsetags($('.tagbox.posttagbox').val());
      
      var img = $("input[name='img_from_url']").val();
      if(img == '') img = null;
      
      createpost_submitpost(createpost_userid, img, time,
        price, price_num, title, tags, createpost_addeditems,
        function(response) {
          // upload image on callback
          var postid_input = $('<input style="display:none;" name="postid">');
          postid_input.val(response['postid']);
          
          $('form.createpost_form')
            .append(postid_input)
            .submit();
        });
    });
  $('.placed.button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      // $('.marker_field .marker_field_img').unbind('click');
      $(this).parent().find('.getiteminfo').slideDown(400);
      $(this).slideUp();
    });
  $('.uploaditem.button')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var title = $(".getiteminfo input[name='title']").val();
      if(title == '') {
        alert('You have to give this item a title');
        return;
      }
      
      var retailer = $(".getiteminfo input[name='retailer']").val();
      var purchase_link = $(".getiteminfo input[name='purchase_link']").val();
      var price = $(".getiteminfo input[name='price']").val();
      
      var price_num = 0;
      
      if(price != '') {
        var floatprice = parseFloat(price);
        if(isNaN(floatprice)) {
          alert('Sorry, is that the right price?');
          return;
        }
        var denom = $('.getiteminfo select').find(':selected').attr('name');
        price = denom + floatprice;
        price_num += floatprice;
      }
    
      var time = (new Date()).toString();
      
      var img = null;
      
      
      var x = $('.marker').attr('x');
      var y = $('.marker').attr('y');
      
      var tags = createpost_parsetags(''); // createpost_parsetags($(this).parent().find('.tagbox').val());
      
      var type = "item";
      var item_ids = [];
      
      createpost_pushitem(type, createpost_userid, img, time, price,
                          price_num, title, x, y, retailer, purchase_link,
                          tags, item_ids);
      var addeditem = $(createpost_addeditem_partial.replace('{{title}}', title));
	  
	  /*addeditem
		.find('img')
		  .css('height', createpost_addeditemiconheight + 'px')
		  .css('width', createpost_addeditemiconwidth + 'px');*/
	  
	  $('.createpost_additem').parent().prepend(addeditem);
	  createpost_hide(4);
	  createpost_show(3);
	  createpost_cleanupmarkitem();
	  
	  createpost_show(5);
	  createpost_showpostbutton();
      
    });
  $('a.createpost_additem')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('.createpost_skip_additem')
        .text('or cancel...');
      createpost_addeditemiconheight = $('.createpost_additem img').height();
      createpost_addeditemiconwidth = $('.createpost_additem img').width();
      createpost_hide(3);
      createpost_show(4);
      createpost_hide(5);
      createpost_hidepostbutton();
    });
  $('a.img_upload')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      $('input.img_upload').trigger('click');
      $('.photo_stage .stage_image').hide();
    });
  $('input.img_upload').change(function(e){
    js_input = $(this)[0];
    if(js_input.files && js_input.files[0]) {
      var filereader = new FileReader();
      filereader.readAsDataURL(js_input.files[0]);
      filereader.onload = function(e) {
        /*$('.marker_field_img').load(
          function(e) {
		  var stepwrap = $('.createpost_stepwrap.4');
		  console.log(stepwrap);
		  var imgheight = $('.photo_stage .stage_image').height();
		  alert('hi ' + stepwrap.height() + ' ' + imgheight);
		  if(stepwrap.height() < imgheight) {
			stepwrap.css('min-height', (stepwrap.height() + imgheight) + 'px');
          }
        });*/
      
        $('.photo_stage .stage_image')
          .attr('src', e.target.result)
          .show();
        $('a.img_upload.replace').html(
          $('a.img_upload.replace')
            .html()
              .replace(/upload main photo/i,
                       'Upload a different photo')
        );
        
        
        createpost_uploadedimage = true;
        
        $('.marker_field .marker_field_img')
          .attr('src', e.target.result)
          .load(function() {
            $('.marker_field')
              .css('height', $('.marker_field .marker_field_img').height() + 'px');
              // slightly hacky, get height from image loaded above
          });
        
        createpost_show(4);
        createpost_scrollto(4);
      }
    }
  });
  
  $('.marker_field .marker_field_img')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      var imgpos = $(this).offset();
      var clickleft = e.pageX;
      var clicktop = e.pageY;
      
      var top = (clicktop - imgpos.top)/$(this).height();
      var left = (clickleft - imgpos.left)/$(this).width();
      
      if(!$('.marker_field .marker').is(':visible')) {
        $('.placed.button').slideDown();
      }
      // create the post marker after we check if the last
      // one was visible (if the user's already clicked before)
      createpost_placemarker(top, left, $(this).height(), $(this).width());
    });

  $('.createpost_skip_additem')
    .unbind('click')
    .click(function(e) {
      e.preventDefault();
      createpost_hide(4);
      createpost_show(3);
      createpost_show(5);
      createpost_scrollto(5);
      createpost_showpostbutton();
      createpost_cleanupmarkitem() 
    });
}

function createpost_placemarker(top, left, h, w) {
  var marker = $('<span class="marker"></span>');
  $('.marker_field .marker').remove();
  $('.marker_field')
    .append(marker.hide());
  var width = marker.width()
  marker
    .css('top', ((top * h) - width/2) + 'px')
    .css('left', ((left * w) - width/2) + 'px')
    .attr('x', left)
    .attr('y', top);
  marker.show();
}

function createpost_pushitem(type, userid, img, time, price, price_num, title, x, y,
                               retailer, purchase_link, tags, item_ids) {
  var data = {
    'type': type,
    'userid': userid,
    'img': img,
    'time': (new Date()).toString(),
    'price': price,
    'price_num': price_num,
    'title': title,
    'x': x,
    'y': y,
    'retailer': retailer,
    'purchase_link': purchase_link,
    'tags': tags,
    'item_ids': item_ids
  };
  
  createpost_addeditems.push(data);
}

function createpost_submitpost(userid, img, time, price, price_num, title, tags, items, success) {
  var post = {
    'type': 'outfit',
    'userid': createpost_userid,
    'img': img,
    'time': time,
    'price': price,
    'price_num': price_num,
    'title': title,
    'tags': tags
  };
  var data = {'items': items,
              'userid': userid,
              'post': post};
  $.ajax({
	type: 'POST',
	url: '/createnewpostfromitems',
	data: data,
	success: success
  });
}


/* createpost_parsetags(tagstr)
 * 
 * Takes in a raw input string--whatever was typed into the
 * tag box, and spits out an array of tag objects, i.e
 * [{'tag': 'cool'}, {'tag': 'hip'}, ... ]
 */
function createpost_parsetags(tagstr) {
  var tags = tagstr.split(',');
  for(var i=0;i<tags.length;i++) {
    tags[i] = $.trim(tags[i]);
    if(tags[i].charAt(0) == '#') {
      tags[i] = tags[i].substring(1);
    }
  }
  return tags;
}

/* createpost_cleanupmarkitem()
 * 
 * Cleanup function that gets run after the mark item
 * step. Clears the form and marker field out.
 */
function createpost_cleanupmarkitem() {
  $(".getiteminfo input[name='title']").val('');
  $(".getiteminfo input[name='retailer']").val('');
  $(".getiteminfo input[name='purchase_link']").val('');
  $(".getiteminfo input[name='price']").val('');
  // won't clear this: user probably wants to use the same currency
  // $('.getiteminfo select :nth-child(0)').prop('selected', true);
  
  $('.tagbox.itemtagbox').val('');
  $('.marker_field .marker')
    .removeAttr('x')
    .removeAttr('y')
    .hide();
    
  $('.placed.button').parent().find('.getiteminfo').hide();
}

function createpost_gettotalpricenum(items) {
  if(!items || items.length == 0) return null;
  var total = 0;
  for(var i=0;i<items.length;i++) {
    total += items[i]['price_num'];
  }
  return total;
}

/* createpost_gettotalprice(items)
 * 
 * Takes in a list of items and compiles their prices
 * into a single returned string
 */ 
function createpost_gettotalprice(items) {
  if(!items || items.length == 0) return null;
  
  var pricestr = items[0]['price'];
  for(var i=1;i<items.length;i++) {
    if(items[i]['price'].length < 1) continue;
    pricestr += (' + ' + items[i]['price']);
  }
  return $.trim(pricestr);
  
  /*
  var price = items[0]['price'];
  var dollarSplit = price.split('$');
  priceTotal += parseFloat(dollarSplit[1]);
  var priceTotal = 0.0;
  for(var i = 1; i < items.length; i++) {
     price += ' + ' + items[i]['price'];
     dollarSplit = items[i].split('$');
     priceTotal += parseFloat(dollarSplit[1]);
  }
  price += priceTotal;
  return $.trim(price);
  */
}