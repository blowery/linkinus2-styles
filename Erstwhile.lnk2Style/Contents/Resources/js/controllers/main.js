// Global Vars
var embedTimer = null;
var combinedMessagesEnabled;
var emoticonsEnabled;
var prevNick;
var prevType;
var domReady = false;
var windowWidth = $(window).width();
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

document.onready = function(e){
	domReady = true;

    window.location.href = "linkinus-style://styleDidFinishLoading";
}

document.onclick = function(e){
	window.linkinus.focus();
}

// Message Handling
function appendMessage(messageDetails) {
	var $message = '';
	var lngNick = messageDetails[NICKNAME_KEY];
	var shtNick = messageDetails[NICKNAME_KEY];
	var id =  messageDetails[POST_ID_KEY];
	var extraclass = CL[messageDetails[NICK_COLOR_KEY]];
	var embeddingEnabled = false;
	
	if(messageDetails[NICKNAME_KEY].length > NICK_CLIP){
		shtNick = messageDetails[NICKNAME_KEY].slice(0,NICK_CLIP-1) + '…';
	}
	
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
	
	var messageHTML = '';
	
	switch(messageDetails[MESSAGE_TYPE_KEY]) {
	    case 'msgMessage':
	        messageHTML = file_get_contents('English.lproj/Incoming/Message.html');
    	    break;
	    case 'msgAction':
	        messageHTML = file_get_contents('English.lproj/Incoming/Action.html');
    	    break;
    	case 'msgRaw':
    	    messageHTML = file_get_contents('English.lproj/Incoming/Raw.html');
    	    break;
	    case 'msgJoin':
    	    messageHTML = file_get_contents('English.lproj/Incoming/Join.html');
    	    break;
    	case 'msgPart':
    		 messageHTML = file_get_contents('English.lproj/Incoming/Part.html');
    	    break;
    	case 'msgQuit':
    		messageHTML = file_get_contents('English.lproj/Incoming/Quit.html');
    	    break;
    	case 'msgKick':      	   	
    		 messageHTML = file_get_contents('English.lproj/Incoming/Kick.html');
    	    break;
    	case 'msgModeChange':
    		 messageHTML = file_get_contents('English.lproj/Incoming/ModeChange.html');
    	    break;
    	case 'msgNick':
    		 messageHTML = file_get_contents('English.lproj/Incoming/Nick.html');
    	    break;
    	case 'msgTopicChange':
    		 messageHTML = file_get_contents('English.lproj/Incoming/TopicChange.html');
    	    break;
    	case 'msgTopicDetailsReply':
    		 messageHTML = file_get_contents('English.lproj/Incoming/TopicReply.html');
    	    break;
    	case 'msgNotice':
    	case 'msgNoticeAuth':
    		 messageHTML = file_get_contents('English.lproj/Incoming/Notice.html');
    	    break;
	}	
	
	$message = expandVariables(messageHTML, messageDetails, embeddingEnabled);

	
	if (messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicChange' || messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicReply') {
		$('#topic span').html(linkify(messageDetails[DESCRIPTION_KEY], false));
		$('#topic').addClass('new').css('top',-$('#topic').height()+10);
	}	
	
	prevType = messageDetails[MESSAGE_TYPE_KEY];
	prevNick = messageDetails[NICKNAME_KEY];
		
	$('#content').append($message);
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
	$('#overlay').fadeIn();	
	updateOverlayHeight();		
}
function focus() {
	$('#overlay').fadeOut();
	updateOverlayHeight();
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


