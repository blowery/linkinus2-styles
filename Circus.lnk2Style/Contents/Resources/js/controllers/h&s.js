// Global Vars
var embedTimer = null;
var extraclass = '';
// Scrolling
function scrollToBottom(ignorePosition) {		
	if (ignorePosition || (!ignorePosition && nearBottom()))
	    document.body.scrollTop = document.getElementById('content').offsetHeight;	
}

function updateWidths() {
	$('div.post span.message').width($(window).width()-30);
}

$(window).bind('resize', function() {
	updateWidths();
});
var i = 1;
// Message Handling
function appendMessage(messageDetails) {
	var $message = '';
	var lngNick = messageDetails[NICKNAME_KEY];
	var shtNick = messageDetails[NICKNAME_KEY];
	var id =  messageDetails[POST_ID_KEY];
	if(messageDetails[NICKNAME_KEY].length > NICK_CLIP){
		shtNick = messageDetails[NICKNAME_KEY].slice(0,NICK_CLIP-1) + '…';
	}
	
	
	var desc = messageDetails[DESCRIPTION_KEY];		
	var extraclass = '';
	
	if(messageDetails[HIGHLIGHTED_KEY] == 1) {
		extraclass += ' highlighted';
	}
	if(messageDetails[STARRED_KEY] == 1) {
		extraclass += ' starred';
	}
	
	switch(messageDetails[MESSAGE_TYPE_KEY]) {
	    case 'msgMessage':
	        $message = '<div id="'+ id +'" class="post'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+':&nbsp;</span><span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
	    case 'msgAction':
    	    $message = '<div id="'+ id +'" class="post action'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> <span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgRaw':
    	    $message = '<div id="'+ id +'" class="post raw'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
	    case 'msgJoin':
    	    $message = '<div id="'+ id +'" class="post join'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> has joined the room <span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgPart':
    	    $message = '<div id="'+ id +'" class="post part'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> has parted the room (<span class="description">'+desc+'</span>)</span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgQuit':
    	    $message = '<div id="'+ id +'" class="post quit'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> has quit (<span class="description">'+desc+'</span>)</span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgKick':
    	    $message = '<div id="'+ id +'" class="post kick'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> was kicked from the room (<span class="description">'+desc+'</span>)</span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgModeChange':
    	    $message = '<div id="'+ id +'" class="post mode-change'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> has changed the mode to <span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgNick':
    	    $message = '<div id="'+ id +'" class="post nick'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> has changed their nick to "<span class="description">'+desc+'</span>"</span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgTopicChange':
    	    $message = '<div id="'+ id +'" class="post topic-change'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="nickname" title="'+lngNick+'">'+shtNick+'</span> has changed the topic to "<span class="description">'+desc+'</span>"</span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgTopicDetailsReply':
    	    $message = '<div id="'+ id +'" class="post topic-details-reply'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="nickname" title="'+lngNick+'">'+shtNick+'</span><span class="message"><span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
    	case 'msgNotice':
    	case 'msgNoticeAuth':
    	    $message = '<div id="'+ id +'" class="post notice'+extraclass+'"><span class="remove" onClick="unStarPost($(this))" title="'+messageDetails[TIMESTAMP_KEY]+'">x</span><span class="message"><span class="description">'+desc+'</span></span><span class="arrow" onClick="gotoPost($(this))" />';
    	    break;
	}	
			
	$('#inner').append($message);

	updateWidths();
}

function unStarPost($this) {
	window.linkinus.unstarPosts_($this.parent().attr('id'));
	$this.parent().remove();	  
	return false;
}
function gotoPost($this) {
	window.console.log('going to post: ' + $this.parent().attr('id'));
	window.linkinus.clickPost_($this.parent().attr('id'));
}
function setFontSize(size){
    $('body').css('font-size', size+'px');
}
function deleteFirstMessage(){
	$('div.post:first').remove();
}

