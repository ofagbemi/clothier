function splitbackground(h, stripcolor, imgsrc) {
  var html = '<div class="background tophalf"></div><div class="background middlestrip"></div>';
  $('body').append(html);
  var winheight = window.innerHeight;
  var winwidth = window.innerWidth;
  var middlestripheight = 28;
  
  $('.background.tophalf')
	.css('height', (winheight - $('.background.middlestrip').height()) * h + 'px')
	.css('position', 'absolute')
    .css('top', '0px')
    .css('left', '0px')
    .css('width', winwidth + 'px')
	.css('z-index', -2)
	// .css('background-color', '#f5deb3'); // wheat
	.css('background-color', '#afd2dd'); // blue
	
  if(imgsrc) {
    var marginconst = 8;
    var imgstyle = 'min-width: ' + (winwidth + (marginconst * 2)) + 'px;' +
                   'min-height: ' + (winheight * h + (marginconst * 2)) + 'px;' +
                   'margin-left: ' + (-marginconst) + 'px;' +
                   'margin-top: ' + (-marginconst) + 'px';
    $('.background.tophalf')
      .css('overflow', 'hidden')
      .append(
        '<img style="' + imgstyle + '" src="' + imgsrc + '">'
      );
  }
  
  $('.background.middlestrip')
	.css('z-index', -1)
	.css('height', middlestripheight + 'px')
	.css('background-color', stripcolor)
	.css('position', 'absolute')
	.css('top', $('.background.tophalf').height() + 'px')
	.css('left', '0')
	.css('width', winwidth + 'px')
	.css('box-shadow', '0px 1px 4px rgba(0,0,0,0.24)');
}