//
//  logviewer.js
//  Whisper
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

// WARNING: This file depends on lnk2style.definitions.js
//inc('../definitions/common.js');

var starOnClick = 'onclick'; //ondblclick

// DECLARE GLOBAL VARIBLES
var resizeTimer = null;
var topicIsExpanded = false;
var historyIsExpanded = false;
var alt = 0;
var lastNick = "";
var oldLastNick = "";
var lastType = "";
var spotlightUserMessagesOnHoverEnabled = true;
var combinedMessagesEnabled;
var emoticonsEnabled;
var fontSize;
var lastBGColor;
var displayLock = false;

function setEmoticonsEnabled(enabled){
    emoticonsEnabled = enabled;
    
    return emoticonsEnabled;
}

function setCombinedMessagesEnabled(enabled){
    combinedMessagesEnabled = false;
    
    return false;
}

function setSpotlightUserMessagesOnHoverEnabled(enabled){
    spotlightUserMessagesOnHoverEnabled = false;
    
    return false;
}


function setVariant(name){
    if (name.toLowerCase != 'normal'); {
        STYLE_VARIANT = name.toLowerCase();
    }
}

function setFontSize(size){
    $('body').css('font-size', size + 'px');
}

function nearBottom() {
	return ( document.body.scrollTop >= ( document.getElementById('content').offsetHeight - ( window.innerHeight * 1.2 ) ) );
}

// TODO: Implement searching
function showSearch(){
    $('#search').slideToggle("fast");
    $('#content').css('padding-bottom', '29px');
}

function closeSearch(){
    $('#search').slideToggle("fast");
    $('#content').css('padding-bottom', '0px');
}

function collapseTopic(){
    topicIsExpanded = false;
    $('#topic span').css('overflow', 'hidden');
    $('#topic span').css('white-space', 'nowrap');
    var span = $('#topic span').css('min-height');
    var topicer = $('#topic').css('min-height');
    $('#topic').stop().animate({ height: topicer }, 300);
    $('#topic span').stop().animate({ height: span }, 300);
}

function expandTopic(){
    var span = $('#topic span').css('min-height'); 
    $('#topic span').css('overflow', 'visible');
    $('#topic span').css('height', 'auto');
    $('#topic span').css('white-space', 'normal');

    var currentHeight = $('#topic span').height() + 'px';
      
      if (span != currentHeight) {
          topicIsExpanded = true;

          $('#topic').css('height', 'auto');
          $('#topic span').css('height', 'auto');
      } else {
        $('#topic span').css('overflow', 'hidden');
        $('#topic span').css('height', span);
      }
}

function toggleTopic(){
    var e = window.event;
    e.stopPropagation();
        
    if (e.target.nodeName != 'A' && e.target.nodeName != 'IMG') { 
        if (topicIsExpanded) {
          collapseTopic();
        } else {
          expandTopic();
        } 
    }
}

function scrollToBottom(ignorePosition) {		
	if (ignorePosition || (!ignorePosition && nearBottom()))
	    document.body.scrollTop = document.getElementById('content').offsetHeight;	
}

function updateOverlayHeight(){
	$('#overlay').height($(document).height());
}

$(window).bind('resize', function() {
	if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateOverlayHeight, 100);
});

function appendMessage(messageDetails) {
	var strTime = messageDetails[TIMESTAMP_KEY];
	var strDestination = '#content';
	var outputLine = '';
	var messageDirectionClass = calculatedColorForNick(messageDetails[NICKNAME_KEY]);
	var strNickname = messageDetails[NICKNAME_KEY];
	var strMessage = messageDetails[DESCRIPTION_KEY];
	var embeddingEnabled;
	
	if (strNickname.length > 16) { // don't hate the game hate the player
	    strNickname = strNickname.substr(0, 14) + '...';
	}
	
	if (messageDetails[MESSAGE_DIRECTION_KEY] == 1) {
	     messageDirectionClass = 'myself';
	} 
	
	if (messageDetails[ALLOW_EMBEDDING_KEY] == 1) {
	     embeddingEnabled = true;
	} else {
	    embeddingEnabled = false;
	}
	
	if (strMessage.length == 0) {
	    strMessage = '&nbsp;';
	}
	if (messageDetails[POST_TYPE_KEY] == POST_TYPE_HISTORY) strDestination = '#pastcontent';
	
	//<span class="starbox" id="starbox-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '"' +  onclick="starPost(\'' + messageDetails[POST_ID_KEY] + '\');">&nbsp;</span>
    type = 'channel';

	switch(messageDetails[MESSAGE_TYPE_KEY]) {
	    case 'msgMessage':
	        if (messageDetails[DISPLAY_UNENCRYPTED_KEY]) {
             strMessage = '<img src="img/unlock.tiff" style="display:inline;border:0;vertical-align:bottom; margin:0;padding:0;" /> ' + strMessage;
            }
	        if (combinedMessagesEnabled && (lastNick == messageDetails[NICKNAME_KEY] && lastType == 'msgMessage')) {
	             	messageDirectionClass = 'consecutive';
	                 
	                 outputLine = '<span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span id="sender-' + messageDetails[POST_ID_KEY] + '" class="sender" onmouseover="spotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')"  onmouseout="unSpotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" type="' + messageDirectionClass + '"  starred="' + hlstr(messageDetails[STARRED_KEY]) + '"  nick="' + messageDetails[NICKNAME_KEY] + '">&nbsp;</span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" type="privmsg" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" ' +  ' highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + performReplacements(strMessage, embeddingEnabled) + ' </span>';
	                 
	             if (oldLastNick != "") {
	                 outputLine = '<div class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="privmsg" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '">' + outputLine + '</div>';
	                 strDestination = '#content';
	             } else {
	                 strDestination = 'div.line[type="privmsg"]:last';
	             }
	        } else {
    	        outputLine = '<div class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="privmsg" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span id="sender-' + messageDetails[POST_ID_KEY] + '" class="sender" onmouseover="spotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" onmouseout="unSpotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" type="' + messageDirectionClass + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '">' + strNickname + '</span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" type="privmsg" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" ' +  ' highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + performReplacements(strMessage, embeddingEnabled) + ' </span></div>';
    	    }
    	    displayLock = false;
    	    break;
	    case 'msgAction':
	        if (messageDetails[DISPLAY_UNENCRYPTED_KEY]) {
             strMessage = '<img src="img/unlock.tiff" style="display:inline;border:0;vertical-align:bottom; margin:0;padding:0;" /> ' + strMessage;
             }
	        messageDirectionClass = messageDirectionClass;
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="action" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span id="sender-' + messageDetails[POST_ID_KEY] + '" class="sender" onmouseover="spotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" onmouseout="unSpotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" type="' + messageDirectionClass + '" ' +  'onclick="starPost(\'' + messageDetails[POST_ID_KEY] + '\');">' + strNickname + ' </span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" type="action" starred="' + hlstr(messageDetails[STARRED_KEY]) + '">' + performReplacements(strMessage, embeddingEnabled) + '</span></div>';
    	    break;
    	case 'msgRaw':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="system" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + '</span><span class="message" type="system">' + linkify(messageDetails[DESCRIPTION_KEY]) + '</span></div>';
    	    break;
	    case 'msgJoin':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="join" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="join">' + messageDetails[NICKNAME_KEY] + ' has joined the channel.</span></div>';
    	    break;
    	case 'msgPart':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="part" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="part">' + messageDetails[NICKNAME_KEY] + ' has left (' + linkify(messageDetails[DESCRIPTION_KEY]) + ')</span></div>';
    	    break;
    	case 'msgQuit':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="quit" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="quit">' + messageDetails[NICKNAME_KEY] + ' has left IRC (' + linkify(messageDetails[DESCRIPTION_KEY]) + ')</span></div>';
    	    break;
    	case 'msgKick':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="kick" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="kick">' + messageDetails[NICKNAME_KEY] + ' has kicked ' + messageDetails[EXTRA_DATA_KEY] + ' (' + linkify(messageDetails[DESCRIPTION_KEY]) + ')</span></div>';
    	    break;
    	case 'msgModeChange':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="mode" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="mode"><span class="address">' + messageDetails[NICKNAME_KEY] + '</span> has set mode: ' + linkify(messageDetails[DESCRIPTION_KEY]) + '</span></div>';
    	    break;
    	case 'msgNick':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="nick" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="nick">' + messageDetails[NICKNAME_KEY] + ' is now known as ' + linkify(messageDetails[DESCRIPTION_KEY]) + '</span></div>';
    	    break;
    	case 'msgTopicChange':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="topic" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="topic">' + messageDetails[NICKNAME_KEY] + ' has set topic: ' + linkify(messageDetails[DESCRIPTION_KEY]) + '</span></div>';
    	    break;
    	case 'msgTopicDetailsReply':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="reply" alternate="' + AL[alt] + '"  id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="reply">Topic set by ' + messageDetails[NICKNAME_KEY] + ' on ' + messageDetails[EXTRA_DATA_KEY] + '.</span></div>';
    	    break;
    	case 'msgNotice':
    	case 'msgNoticeAuth':
    	     var strDirection = 'from';
    	     var location = NICKNAME_KEY;
    	     
    	     if (messageDetails[MESSAGE_DIRECTION_KEY] == 1) {
	             strDirection = 'to';
	             location = LOCATION_KEY;

	         }
	         
    	     if (messageDetails[DISPLAY_UNENCRYPTED_KEY]) {
               strMessage = '<img src="img/unlock.tiff" style="display:inline;border:0;vertical-align:bottom; margin:0;padding:0" /> ' + strMessage;
             }
    	     outputLine = '<div class="clear:both"></div><div highlight="false" class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="notice" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span id="sender-' + messageDetails[POST_ID_KEY] + '" class="sender"  onmouseover="spotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')"  onmouseout="unSpotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" type="' + messageDirectionClass + '"><img src="img/' + variant_option('personImage') + '"  style="margin:0;padding:0; float:right; border:0; width:14px;height:14px;" /></span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" ' +  ' highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '"type="notice"><strong>Notice ' + strDirection +' ' + messageDetails[location] + '</strong>: ' + performReplacements(strMessage, embeddingEnabled) + '</span></div>';
    	    break;
	}
	
    lastNick = messageDetails[NICKNAME_KEY];
    lastType = messageDetails[MESSAGE_TYPE_KEY];
    
	if (messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicChange' || messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicReply') {
		$('#topic span').html(linkify(messageDetails[DESCRIPTION_KEY]));
		collapseTopic();
	}
	
    if (type == 'query' && messageDetails[MESSAGE_DIRECTION_KEY] != 1) {
        var moo =  messageDetails[USERHOST_KEY];
        if (moo != '') {
            moo = ' (' +  messageDetails[USERHOST_KEY] + ')';
        }
        $('#topic span').html('Query with ' + messageDetails[NICKNAME_KEY] + moo);    }
	   //outputLine = outputLine;
   
    $('#content').append(outputLine);
   
    $('#message-' + messageDetails[POST_ID_KEY]).css('min-height', $('#sender-' + messageDetails[POST_ID_KEY]).css('height'));

	if (alt == 0) { alt = 1; } else { alt = 0; }

    updateOverlayHeight();

    setFontSize(fontSize);
    
	return true;
}

function unfocus() {
	updateOverlayHeight()
	$('#overlay').fadeIn();	
	
	if (typeof hideConnectionHintBox !== 'undefined')
        hideConnectionHintBox();
}

function focus() {
	updateOverlayHeight()
	$('#overlay').fadeOut();
	
   if (typeof hideConnectionHintBox !== 'undefined')
       hideConnectionHintBox();
}

function starPost(id) {
    if (typeof window.linkinus === 'undefined') {
        //window.console.log('FIXME: window.linkinus was unhooked somehow so aborting starring!');
        return false;
    }
    
    var s = $('#message-' + id).attr('starred');
	if(s.indexOf('true') > -1) {
		$('#message-' + id).attr('starred', 'false');
		$('#sender-' + id).attr('starred', 'false');
		$('#time-' + id).attr('starred', 'false');
		window.linkinus.unstarPosts_(id);
	}else {
		$('#message-' + id).attr('starred', 'true');
		$('#sender-' + id).attr('starred', 'true');
		$('#time-' + id).attr('starred', 'true');
		window.linkinus.starPosts_(id);
		return true;
	}
	
	return false;		    
}

document.onclick = function(e){
    if (typeof window.linkinus !== 'undefined') {
        window.linkinus.focus();
    }
}

document.onready = function(e){
    //closeSearch();
    $('#loading').fadeOut('fast');
}


function activateWindow(){
    $('#topic').css('background', variant_option('topicColor'));
    $('#search').css('background', variant_option('topicColor'));
}

function deactivateWindow(){
    $('#topic').css('background', variant_option('topicColorInactive'));
    $('#search').css('background', variant_option('topicColorInactive'));
}

function scrollTo(id) {
	var curr = $('#message-'+id).offset().top - 30;
    $('body').animate({scrollTop: curr}, 700);			
}

function prevHighlight() {	 
	var blah = $('body').scrollTop();
	var arrOffset = [];
	$('span[highlight=true]').each(function(i){
		arrOffset[i] = $(this).offset().top - 30;	
		if(arrOffset[i-1] != blah) {	
			if(i==0 && $('body').scrollTop() < arrOffset[i]) {
				$('body').stop().animate({scrollTop: arrOffset[i]}, 700);
				return;
			} else if($('body').scrollTop() >= arrOffset[i-1] && $('body').scrollTop() <= arrOffset[i]) {
				$('body').stop().animate({scrollTop: arrOffset[i-1]}, 700);
				return;
			} else if($('body').scrollTop() > arrOffset[i]) {
				$('body').stop().animate({scrollTop: arrOffset[i]}, 700);
				return;
			
			}
		}		
	});			
}

function nextHighlight() {	
	var arrOffset = [];
	$('span[highlight=true]').each(function(i){
		arrOffset[i] = $(this).offset().top - 30;	
		var blah = arrOffset.length;			
		if(i==0 && $('body').scrollTop() < arrOffset[i]) {
			$('body').stop().animate({scrollTop: arrOffset[i]}, 700);
			return;
		} else if($('body').scrollTop() >= arrOffset[i-1] && $('body').scrollTop() <= arrOffset[i]) {
			$('body').stop().animate({scrollTop: arrOffset[i]}, 700);
			return;
		}			
	});	
	if($('body').scrollTop() == arrOffset[arrOffset.length-1]) {
		$('body').stop().animate({scrollTop: $('#content').height()}, 700);
		return;	
	}
}

function toggleHistory(){
    if (historyIsExpanded) {
        historyIsExpanded = false;
        $("#pastcontent").slideUp(500);
        scrollToBottom(true);
        $("#pastcontent_outter").css('display', 'none');
    } else {
        $("#pastcontent_outter").css('display', 'block');
        historyIsExpanded = true;
        $("#pastcontent").slideDown(500);
        scrollTo('-1');
    }
}

function addBreak() {
	$('#content').append('<div class="linebreak"><img src="img/break.tiff" /></div>');
	oldLastNick = lastNick;
}

function removeLastBreak(){
	$('div.linebreak:last').remove();
	oldLastNick = "";
}

function scrollToLastBreak(){
	var curr = $('div.linebreak:last').offset().top;
    $('body').animate({scrollTop: curr}, 700);	
}

function showInspector() {
    if (typeof window.linkinus.showInspector !== 'undefined') {
	    window.linkinus.showInspector();
	}
}

function performReplacements(text, embedsEnabled){        
    if (emoticonsEnabled)
        text = replaceEmoticons(text.replace('\'', '&apos;'));  //FIX for 
    
    text = linkify(text, embedsEnabled);

    return text;
}

function spotlightUserMessagesFor(nick){
    if (spotlightUserMessagesOnHoverEnabled) {
     $('div[nick=' + nick +']').each(function(i){
        lastBGColor = $(this).css('background');
    	
    	$(this.children).each(function(i){
    	    $(this).css('background', variant_option('spotLightColor'));
        });
        
    	$(this).css('background', variant_option('spotLightColor'));
    	});
	}
}

function unSpotlightUserMessagesFor(nick){	
    if (spotlightUserMessagesOnHoverEnabled) {
     $('div[nick=' + nick +']').each(function(i){
             $(this.children).each(function(i){
    		$(this).css('background', lastBGColor);
             });
    		$(this).css('background', lastBGColor);
    	});	
	}		
}

function deleteFirstMessage() {	
	chat = document.getElementById("pastcontent");
	if (chat.hasChildNodes()) chat.removeChild( chat.firstChild );
	else
	{
		chat = document.getElementById("content");
		if (chat.hasChildNodes()) chat.removeChild( chat.firstChild );
	}
}