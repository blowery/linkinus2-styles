
//
//  global.js
//  Whisper
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

// WARNING: This file depends on lnk2style.definitions.js
//inc('../definitions/common.js');

var alt = 0;
var starOnClick = 'onclick'; //ondblclick
var emoticonsEnabled;

function setEmoticonsEnabled(enabled){
    emoticonsEnabled = enabled;
    
    return emoticonsEnabled;
}

function setVariant(name){
    if (name.toLowerCase != 'normal'); {
        STYLE_VARIANT = name.toLowerCase();
    }
}

if (document.images) {
    closebuttonup       = new Image();
    closebuttonup.src   = "img/close.png" ;
    closebuttondown     = new Image() ;
    closebuttondown.src = "img/close-on.png" ;
}

function activateWindow(){
//
}

function deactivateWindow(){
//
}

function buttondown( buttonname )
{
    if (document.images) {
      document[ buttonname ].src = eval( buttonname + "down.src" );
    }
}
function buttonup ( buttonname )
{
    if (document.images) {
      document[ buttonname ].src = eval( buttonname + "up.src" );
    }
}

function setCombinedMessagesEnabled(enabled){
    combinedMessagesEnabled = enabled;
}

function setFontSize(size){
    $('body').css('font-size', size + 'px');
}

// Auto-scroll to bottom.  Use nearBottom to determine if a scrollToBottom is desired.
/*function nearBottom() {
	return ( document.body.scrollTop >= ( document.getElementById('content').offsetHeight - ( window.innerHeight * 1.2 ) ) );
}

function scrollToBottom(ignorePosition) {		
	if (ignorePosition || (!ignorePosition && nearBottom()))
	    document.body.scrollTop = document.getElementById('content').offsetHeight;	
}*/

function appendMessage(messageDetails) {
	var strTime = messageDetails[TIMESTAMP_KEY];
	//console.log('time = ' + strTime);
	var strDestination = '#content';
	var outputLine = '';
	var strNickname = messageDetails[NICKNAME_KEY];
	var removeStarHTML = '';
	
	if (strNickname.length > 18) { // don't hate the game hate the player
	    strNickname = strNickname.substr(0, 15) + '...';
	}
	
	if (hlstr(messageDetails[STARRED_KEY]) == 'true') {
	    removeStarHTML = '<span class="remove" onclick="unStarPost(\'' + messageDetails[POST_ID_KEY] + '\');"><img name="closebutton" src="img/close.png" height="13" width="12" onmouseover="buttondown(\'closebutton\')" onmouseout="buttonup(\'closebutton\')" /></span>';
	}
	if (messageDetails[POST_TYPE_KEY] == POST_TYPE_HISTORY) strDestination = '#pastcontent';
		
	switch(messageDetails[MESSAGE_TYPE_KEY]) {
	    case 'msgMessage':
	        outputLine = '<div class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="privmsg" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '">' + removeStarHTML + '<span class="time"><strong>' + messageDetails[LOCATION_KEY] + '</strong>' + strTime  + '</span><span class="sender" type="' + calculatedColorForNick(messageDetails[NICKNAME_KEY]) + '">' + strNickname + '</span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" type="privmsg" ' + starOnClick + '="postClicked(\'' + messageDetails[POST_ID_KEY] + '\');">' + do_subs(messageDetails[DESCRIPTION_KEY]) + ' </span></div>';
    	    break;
	    case 'msgAction':
    	    outputLine = '<div highlight="false" class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="action" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time"><strong>' + messageDetails[LOCATION_KEY] + '</strong>' + strTime + ' </span><span class="sender" type="' + calculatedColorForNick(messageDetails[NICKNAME_KEY]) + '">' + strNickname + ' </span><span class="message" type="action" ' + starOnClick + '="postClicked(\'' + messageDetails[POST_ID_KEY] + '\');">' + do_subs(messageDetails[DESCRIPTION_KEY]) + '</span></div>';
    	    break;
     	case 'msgNotice':
    	case 'msgNoticeAuth':
    	     var strDirection = 'from';
    	     var location = NICKNAME_KEY;
    	     if (messageDetails[MESSAGE_DIRECTION_KEY] == 1) {
	             strDirection = 'to';
    	         location = LOCATION_KEY;
	         }
	         
    	    outputLine = '<div class="clear:both"></div><div highlight="false" class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="notice" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time">' + strTime + ' </span><span class="sender" type="' + calculatedColorForNick(messageDetails[NICKNAME_KEY]) + '"><img src="img/' + variant_option('personImage') + '"  style="margin:0;padding:0; float:right; border:0; width:14px;height:14px;" /></span><span class="message" type="notice"><strong>Notice ' + strDirection + ' ' + messageDetails[location] + '</strong>: ' + do_subs(messageDetails[DESCRIPTION_KEY]) + '</span></div>';
    	    break;
	}
	
    lastNick = messageDetails[NICKNAME_KEY];
    lastType = messageDetails[MESSAGE_TYPE_KEY];
    
	if (messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicChange' || messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicReply') {
		$('#topic span').html(linkify(messageDetails[DESCRIPTION_KEY], false));
		collapseTopic();
	}
	   //outputLine = outputLine;
   
    $(strDestination).prepend(outputLine);
    $('#message-' + messageDetails[POST_ID_KEY]).css('min-height', $('#sender-' + messageDetails[POST_ID_KEY]).css('height'));
	if (alt == 0) { alt = 1; } else { alt = 0; }

	return true;
}

function scrollTo(id) {
	var curr = $('#message-'+id).offset().top - 30;
    $('body').animate({scrollTop: curr}, 700);			
}

function postClicked(postId)
{
    window.linkinus.clickPost_(postId);
    
    return postId;
}

function unStarPost(id) {
	window.linkinus.unstarPosts_(id);
	$('#' + id).remove();	  
	return false;
}

function removeMessage(uuid){
    $('#' + uuid).remove();
    
    return uuid;
}

function deleteFirstMessage() {	    
    $('div.line:last').remove();
    return $('div.line').size();
}


function do_subs(text){
    text = linkify(text, false);
    
    if (emoticonsEnabled)
        text = replaceEmoticons(text);
        
    return text;
}