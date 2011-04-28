// Global Vars
var embedTimer = null;
var combinedMessagesEnabled;
var emoticonsEnabled;
var embeddingEnabled;
var prevNick;
var prevType;
var timestampsEnabled = false;
var windowWidth = $(window).width();

document.onready = function(e){
    window.location.href = "linkinus-style://styleDidFinishLoading";
}

// Linkinus prefs
function setEmoticonsEnabled(enabled){
    emoticonsEnabled = enabled;
    
    return emoticonsEnabled;
}
function setCombinedMessagesEnabled(enabled){
    combinedMessagesEnabled = enabled;
    
    return combinedMessagesEnabled;
}
// Scrolling

function nearBottom() {
	return ( document.body.scrollTop >= ( (document.getElementById('content').offsetHeight ) - ( window.innerHeight * 1.2 ) ) );
}
function scrollToBottom(ignorePosition) {		
	if (ignorePosition || (!ignorePosition && nearBottom()))
	    document.body.scrollTop = document.getElementById('content').offsetHeight;	
}
function scrollForEmbedding() {
    scrollToBottom(true);
}

function handlePostEmbedding(){   
    if (embedTimer) clearTimeout(embedTimer);
    // This makes me feel dirty, but it works!
    embedTimer = setTimeout(scrollForEmbedding, 400);
}
// Resizing
function updateOverlayHeight(){
	if($('body').hasClass('query') || $('body').hasClass('console')) {
		if(document.getElementById('content').offsetHeight > $(window).height()){
			$('#overlay').height(document.getElementById('content').offsetHeight);
		} else {
			$('#overlay').height($(window).height());
		}
	} else {
		if(document.getElementById('content').offsetHeight+15 > $(window).height()){
			$('#overlay').height(document.getElementById('content').offsetHeight+15);
		} else {
			$('#overlay').height($(window).height());
		}
	
	}
}
function updateWidths() {
	windowWidth = $(window).width();
	$('#topic marquee').attr('width',$(window).width());
	$('span.message, div.post.normal span.message span.description').width(windowWidth-122);
	$('div.post.action span.message, div.post.join span.message, div.post.part span.message, div.post.quit span.message, div.post.nick span.message, div.post.topic-change span.message, div.post.topic-change span.message span.description, div.post.raw span.message, div.post.notice span.message, div.post.mode-change span.message, div.post.notice-auth span.message, div.post.topic-details-reply span.message, div.post.kick span.message').width(windowWidth-30);
}
$(window).bind('resize', function() {
	updateOverlayHeight();
	updateWidths();
   // $('#topic').css('top',-$('#topic').height()-10);
});
// Message Handling
function appendMessage(messageDetails) {
	var $message = '';
	var strTime = '';
	var lngNick = messageDetails[NICKNAME_KEY];
	var shtNick = messageDetails[NICKNAME_KEY];
	var id =  messageDetails[POST_ID_KEY];
	var extraclass = CL[messageDetails[NICK_COLOR_KEY]];
	
	if( messageDetails[TIMESTAMP_KEY].length > 0){
		strTime = '<span class="time">'+messageDetails[TIMESTAMP_KEY] + '</span>';
		timestampsEnabled = true;
		$('body').addClass('timestamps');
	}
	
	if(messageDetails[NICKNAME_KEY].length > NICK_CLIP){
		shtNick = messageDetails[NICKNAME_KEY].slice(0,NICK_CLIP-1) + '…';
	}
	
	shtNick = '<span class="nick">'+shtNick+':</span>';
	
	if (messageDetails[ALLOW_EMBEDDING_KEY] == 1) {
	    embeddingEnabled = true;
	} else {
	    embeddingEnabled = false;
	}
			
	if(messageDetails[MESSAGE_TYPE_KEY]) {
		var desc = performReplacements(messageDetails[DESCRIPTION_KEY], embeddingEnabled);
	} else {
		var desc = messageDetails[DESCRIPTION_KEY];
	}
			
	if(strTime.length > 0){
		extraclass += ' timestamp';
		window.console.log('true');
	}			
	if(messageDetails[MESSAGE_DIRECTION_KEY] == 1) {
		extraclass += ' mine';
	}	
	if(messageDetails[STARRED_KEY] == 1) {
		extraclass += ' starred';
	}	
	if(messageDetails[HIGHLIGHTED_KEY] == 1) {
		extraclass += ' highlighted';
	}		
	if(prevNick == messageDetails[NICKNAME_KEY] && combinedMessagesEnabled && prevType == 'msgMessage' && messageDetails[MESSAGE_TYPE_KEY] == 'msgMessage'){
		extraclass += ' hidenick';
	}
		
		
	switch(messageDetails[MESSAGE_TYPE_KEY]) {
	    case 'msgMessage':
	        $message = '<div id="'+ id +'" class="post '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="nickname" title="'+lngNick+'">'+strTime+shtNick+'</span><span class="message"><span class="description">'+desc+'</span></span>';
    	    break;
	    case 'msgAction':
    	    $message = '<div id="'+ id +'" class="post action '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> <span class="description">'+desc+'</span></span>';
    	    break;
    	case 'msgRaw':
    	    $message = '<div id="'+ id +'" class="post raw '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="description">'+desc+'</span></span>';
    	    break;
	    case 'msgJoin':
    	    $message = '<div id="'+ id +'" class="post join '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has joined the room <span class="description">'+desc+'</span></span>';
    	    break;
    	case 'msgPart':
    		if(desc.length > 0){desc = '('+desc+')';}
    	    $message = '<div id="'+ id +'" class="post part '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has parted the room <span class="description">'+desc+'</span></span>';
    	    break;
    	case 'msgQuit':
    		if(desc.length > 0){desc = '('+desc+')';}
    	    $message = '<div id="'+ id +'" class="post quit '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has quit <span class="description">'+desc+'</span></span>';
    	    break;
    	case 'msgKick':
    		if(desc.length > 0){desc = '('+desc+')';}
    	    $message = '<div id="'+ id +'" class="post kick '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has kicked <span class="description">'+messageDetails[EXTRA_DATA_KEY] + ' from the room ' + desc + '</span></span>';
    	    break;
    	case 'msgModeChange':
    	    $message = '<div id="'+ id +'" class="post mode-change '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has changed the mode to <span class="description">'+desc+'</span></span>';
    	    break;
    	case 'msgNick':
    	    $message = '<div id="'+ id +'" class="post nick '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has changed their nick to "<span class="description">'+desc+'</span>"</span>';
    	    break;
    	case 'msgTopicChange':
    	    $message = '<div id="'+ id +'" class="post topic-change '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="nickname">'+lngNick+'</span> has changed the topic to "<span class="description">'+desc+'</span>"</span>';
    	    break;
    	case 'msgTopicDetailsReply':
    	    $message = '<div id="'+ id +'" class="post topic-details-reply '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="description">Set by <span class="nickname">'+lngNick+'</span> on '+desc+'</span></span>';
    	    break;
    	case 'msgNotice':
    	case 'msgNoticeAuth':
    	    $message = '<div id="'+ id +'" class="post notice '+extraclass+'"><span class="star" onClick="starPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'"/><span class="message" style="width:'+parseInt(windowWidth-30)+'px"><span class="description">'+desc+'</span></span>';
    	    break;
	}	
		
	if (messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicChange' || messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicReply') {
		$('#topic span').html(linkify(messageDetails[DESCRIPTION_KEY], false));
		$('#topic').addClass('new').css('top',-$('#topic').height()+10);
	}	
	
	prevType = messageDetails[MESSAGE_TYPE_KEY];
	prevNick = messageDetails[NICKNAME_KEY];
			
		
	$('#inner').append($message);
	
	$('div.post:last .nickname').width($('div.post:last .nickname').width());

	updateOverlayHeight();
}
// Media functions
function performReplacements(text, embedsEnabled){    
    if (embedsEnabled) 
        text = expandShortURLs(text);
    
    if (emoticonsEnabled)
        text = replaceEmoticons(text.replace('\'', '&apos;'));  //FIX for 
    
    text = linkify(text, embedsEnabled);

    return text;
}
// User Events
//* Show/ Hide Topic
function topicUp() {
	$('#topic').stop().animate({opacity: 1.0}, 500).stop().animate({top:-$('#topic').height()+10}, 500, 'linear',function(){
		if($('#topic').hasClass('new')) {
			$('#topic').removeClass('new');
		}
	});
}
function topicDown() {
	$('#topic').stop().animate({opacity: 1.0}, 500).stop().animate({top:0}, 500);
}
//* 
function unfocus() {
	updateOverlayHeight();
	$('#overlay').fadeIn();			
}
function focus() {
	updateOverlayHeight();
	$('#overlay').fadeOut();
}
//* Starring
function starPost($this) {
	if($this.parent().hasClass('starred')) {
		window.console.log('unstarred: '+$this.parent().attr('id'));
		$this.parent().removeClass('starred');
		window.linkinus.unstarPosts_($this.parent().attr('id'));
	}else {
		window.console.log('starred: '+$this.parent().attr('id'));
		$this.parent().addClass('starred');
		window.linkinus.starPosts_($this.parent().attr('id'));
	}		    
	return false;
}
function markAsUnstarred(id) {
	$('#'+id).removeClass('starred');
}
//* Window Event
document.onclick = function(e){
	window.linkinus.focus();
}
//* Misc Linkinus Stuff
function deleteFirstMessage(){
	$('div.post:first').remove();
	updateOverlayHeight();
}
function scrollTo(id) {
	var curr = $('#'+id).offset().top - $('div#topic').height();
    $('body').animate({scrollTop: curr}, 1000);			
}
function addBreak() {
	$('#inner').append('<div class="break"></div>');
}
function setFontSize(size){
    $('body').css('font-size', size+'px');
}
function removeLastBreak(){
	$('div.break:last').remove();
}

// Linkinus scrolling handlers
//* ˆ + ⌥ + →
function scrollToLastBreak(){
	var curr = $('div.break:last').offset().top - $('div#topic').height();
    $('body').animate({scrollTop: curr}, 700, 'swing');	
}
//* ˆ + ⌥ + ↑
function prevHighlight() {	 
	var blah = $('body').scrollTop();
	var arrOffset = [];
	$('div.highlighted').each(function(i){
		arrOffset[i] = $(this).offset().top - $('div#topic').height();	
		if(arrOffset[i-1] != blah) {	
			if(i==0 && $('body').scrollTop() < arrOffset[i]) {
				$('body').stop().animate({scrollTop: arrOffset[i]}, 1000, 'swing');
				return;
			} else if($('body').scrollTop() >= arrOffset[i-1] && $('body').scrollTop() <= arrOffset[i]) {
				$('body').stop().animate({scrollTop: arrOffset[i-1]}, 1000, 'swing');
				return;
			} else if($('body').scrollTop() > arrOffset[i]) {
				$('body').stop().animate({scrollTop: arrOffset[i]}, 1000, 'swing');
				return;			
			}
		}		
	});			
}
//* ˆ + ⌥ + ↓
function nextHighlight() {	
	var arrOffset = [];
	$('div.highlighted').each(function(i){
		arrOffset[i] = $(this).offset().top - $('div#topic').height();	
		var blah = arrOffset.length;			
		if(i==0 && $('body').scrollTop() < arrOffset[i]) {
			$('body').stop().animate({scrollTop: arrOffset[i]}, 1000, 'swing');
			return;
		} else if($('body').scrollTop() >= arrOffset[i-1] && $('body').scrollTop() <= arrOffset[i]) {
			$('body').stop().animate({scrollTop: arrOffset[i]}, 1000, 'swing');
			return;
		}			
	});	
	if($('body').scrollTop() == arrOffset[arrOffset.length-1]) {
		$('body').stop().animate({scrollTop: $('#inner').height()}, 1000, 'swing');
		return;	
	}
}


