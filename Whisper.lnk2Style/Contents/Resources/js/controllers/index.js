//
//  index.js
//  Whisper
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

// WARNING: This file depends on lnk2style.definitions.js
//inc('../definitions/common.js');

var starOnClick = 'onclick'; //ondblclick

// DECLARE GLOBAL VARIBLES
var embedTimer = null;
var topicIsExpanded = false;
var alt = 0;
var lastNick = "";
var lastNickColor = "myself";
var lastType = "";
var spotlightUserMessagesOnHoverEnabled;
var combinedMessagesEnabled;
var emoticonsEnabled;
var fontSize;
var lastBGColor;
var lastBorderColor;
var displayLock = false;
var domReady = false;

function setEmoticonsEnabled(enabled){
    emoticonsEnabled = enabled;
    
    return emoticonsEnabled;
}

function setCombinedMessagesEnabled(enabled){
    combinedMessagesEnabled = enabled;
    
    return combinedMessagesEnabled;
}

function setSpotlightUserMessagesOnHoverEnabled(enabled){
    spotlightUserMessagesOnHoverEnabled = enabled;
    
    return spotlightUserMessagesOnHoverEnabled;
}

function setFontSize(size){
    $('body').css('font-size', size + 'px');
}

function setVariant(name){
	STYLE_VARIANT = name.toLowerCase();
	var actualStyle = STYLE_VARIANT.replace(" (flashembeds)", "");
	
    if (actualStyle != 'normal') {    	
	    var href = 'css/' + actualStyle + '.css',
	      html = '<link id="variant" rel="stylesheet" href="' + href
	        + '" type="text/css" media="screen" charset="utf-8" />',
	      elem;
	    
	    if ( domReady ) {
	      elem = $('#variant');
	      elem.length ? elem.attr( 'href', href ) : $('head').append( html );
	    } else {
	      document.write( html );
	    }
    }

		updateProviders();
}
  
function nearBottom() {
	return ( document.body.scrollTop >= ( (document.getElementById('pastcontent').offsetHeight +document.getElementById('content').offsetHeight ) - ( window.innerHeight * 1.2 ) ) );
}


// TODO: Implement searching
/*function showSearch(){
    $('#search').slideToggle("fast");
    $('#content').css('padding-bottom', '29px');
}

function closeSearch(){
    $('#search').slideToggle("fast");
    $('#content').css('padding-bottom', '0px');
}*/

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
	{
	    document.body.scrollTop =  (document.getElementById('pastcontent').offsetHeight + document.getElementById('content').offsetHeight);	
	}
}

function appendMessage(messageDetails) {
	var strTime = messageDetails[TIMESTAMP_KEY];
	var strDestination = '#content';
	var outputLine = '';
	
	var messageDirectionClass = calculatedColorForNick(messageDetails[NICKNAME_KEY]);
  var exists = document.getElementById(messageDetails[POST_ID_KEY]);

  if (exists !== null) {
    console.log(exists);
    console.log("wtf");

    return;
  }

	if (messageDetails[NICK_COLOR_KEY] == 0) {
		messageDirectionClass = CL[0];
	}
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
	
	if (strMessage.length == 0 || strMessage == ' ') {
	    strMessage = '&nbsp;';
	}
	if (messageDetails[POST_TYPE_KEY] == POST_TYPE_HISTORY) strDestination = '#pastcontent';

	var matched = messageDetails[DESCRIPTION_KEY].match("^s\/(.*)\/(.*)\/$");
	var lastLine = $('div.line[nick=' + messageDetails[NICKNAME_KEY] +']:last');
	
	var lineNick = $(lastLine).attr('nick');
	
	if (lineNick)
		lineNick = lineNick.replace('@', '').replace('%', '').replace('~', '').replace('+', '');
	
	var newNick = messageDetails[NICKNAME_KEY].replace('@', '').replace('%', '').replace('~', '').replace('+', '');
	if (lineNick == newNick && matched !=null && matched.length == 3) {	
			var replaced = $(lastLine).html();
			if (replaced.indexOf(matched[1]) >= 0) {
				$(lastLine).html($(lastLine).html().replace( matched[1], matched[2]));
				return;
			}
	}
	switch(messageDetails[MESSAGE_TYPE_KEY]) {
	    case 'msgMessage':
	        if (messageDetails[DISPLAY_UNENCRYPTED_KEY]) {
             strMessage = '<img src="img/unlock.tiff" style="display:inline;border:0;vertical-align:bottom; margin:0;padding:0;" /> ' + strMessage;
            }
	        if (lastNick == messageDetails[NICKNAME_KEY] && combinedMessagesEnabled && lastType == 'msgMessage') {
	             	messageDirectionClass = lastNickColor;
                    if (messageDetails[MESSAGE_DIRECTION_KEY] == 1) messageDirectionClass = 'myself';
	                 strNickname = '';
	        }
	        outputLine = '<div class="line text" nick="' + messageDetails[NICKNAME_KEY].replace('\\', 'SLASH') + '" type="privmsg" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span id="sender-' + messageDetails[POST_ID_KEY] + '" class="sender" onmouseover="spotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY].replace('\\', 'SLASH')  + '\')" onmouseout="unSpotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY].replace('\\', 'SLASH')  + '\')" type="' + messageDirectionClass + '" ' +  'onclick="starPost(\'' + messageDetails[POST_ID_KEY] + '\');" starred="' + hlstr(messageDetails[STARRED_KEY]) + '">' + strNickname + '</span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" type="privmsg" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" ' +  ' highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + performReplacements(strMessage, embeddingEnabled) + ' </span></div>';
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
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="system" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + '</span><span class="message" type="system">' + linkify(messageDetails[DESCRIPTION_KEY], false) + '</span></div>';
    	    break;
	    case 'msgJoin':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="join" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="join">' + messageDetails[NICKNAME_KEY] + ' has joined the channel.</span></div>';
    	    break;
    	case 'msgPart':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="part" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="part">' + messageDetails[NICKNAME_KEY] + ' has left (' + linkify(messageDetails[DESCRIPTION_KEY], false) + ')</span></div>';
    	    break;
    	case 'msgQuit':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="quit" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="quit">' + messageDetails[NICKNAME_KEY] + ' has left IRC (' + linkify(messageDetails[DESCRIPTION_KEY], false) + ')</span></div>';
    	    break;
    	case 'msgKick':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="kick" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="kick">' + messageDetails[NICKNAME_KEY] + ' has kicked ' + messageDetails[EXTRA_DATA_KEY] + ' (' + linkify(messageDetails[DESCRIPTION_KEY], false) + ')</span></div>';
    	    break;
    	case 'msgModeChange':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="mode" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="mode"><span class="address">' + messageDetails[NICKNAME_KEY] + '</span> has set mode: ' + linkify(messageDetails[DESCRIPTION_KEY], false) + '</span></div>';
    	    break;
    	case 'msgNick':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="nick" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="nick">' + messageDetails[NICKNAME_KEY] + ' is now known as ' + linkify(messageDetails[DESCRIPTION_KEY], false) + '</span></div>';
    	    break;
    	case 'msgTopicChange':
    	    outputLine = '<div highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '" class="line event" type="topic" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span class="message" type="topic">' + messageDetails[NICKNAME_KEY] + ' has set topic: ' + linkify(messageDetails[DESCRIPTION_KEY], false) + '</span></div>';
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
    	     outputLine = '<div highlight="false" class="line text" nick="' + messageDetails[NICKNAME_KEY] + '" type="notice" alternate="' + AL[alt] + '" id="' + messageDetails[POST_ID_KEY] + '"><span class="time" id="time-' + messageDetails[POST_ID_KEY] + '" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '">' + strTime + ' </span><span id="sender-' + messageDetails[POST_ID_KEY] + '" class="sender"  onmouseover="spotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')"  onmouseout="unSpotlightUserMessagesFor(\'' + messageDetails[NICKNAME_KEY] + '\')" type="' + messageDirectionClass + '" onclick="starPost(\'' + messageDetails[POST_ID_KEY] + '\');"><img src="img/' + variant_option('personImage') + '"  style="margin:0;padding:0; float:right; border:0; width:14px;height:14px;" /></span><span id="message-' + messageDetails[POST_ID_KEY] + '" class="message" starred="' + hlstr(messageDetails[STARRED_KEY]) + '" ' +  ' highlight="' + hlstr(messageDetails[HIGHLIGHTED_KEY]) + '"type="notice"><strong>Notice ' + strDirection + ' ' + messageDetails[location] + '</strong>: ' + performReplacements(strMessage, embeddingEnabled) + '</span></div>';
    	    break;
	}
	
    lastNick = messageDetails[NICKNAME_KEY];
    lastNickColor = calculatedColorForNick(messageDetails[NICKNAME_KEY]);

		if (messageDetails[NICK_COLOR_KEY] == 0) {
			lastNickColor = CL[0];
		}
		
    lastType = messageDetails[MESSAGE_TYPE_KEY];
    
	if (messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicChange' || messageDetails[MESSAGE_TYPE_KEY] === 'msgTopicReply') {
		$('#topic span').html(linkify(messageDetails[DESCRIPTION_KEY], false));
		collapseTopic();
		$('#topic span').longurlplease({lengthenShortUrl: urlExpander });

	}
	
    if (type == 'query' && messageDetails[MESSAGE_DIRECTION_KEY] != 1) {
        var moo =  messageDetails[USERHOST_KEY];
        var moob = '';
        
        if (moo != '') {
            moob = ' with ';
            moo = ' (' +  messageDetails[USERHOST_KEY] + ')';
        }
        $('#topic span').html('Query' + moob + messageDetails[NICKNAME_KEY] + moo);    }
	   //outputLine = outputLine;
   
    $(strDestination).append(outputLine);

    $('#message-' + messageDetails[POST_ID_KEY]).css('min-height', $('#sender-' + messageDetails[POST_ID_KEY]).css('height'));
    
    
    if (embeddingEnabled) $('#message-' + messageDetails[POST_ID_KEY]).longurlplease({lengthenShortUrl: urlExpander });
    
	if (alt == 0) { alt = 1; } else { alt = 0; }
    
	return true;
}

function unfocus() {
	$('#overlay').fadeIn();	
}

function focus() {
	$('#overlay').fadeOut();
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


function markAsUnstarred(id) {
		$('#message-' + id).attr('starred', 'false');
		$('#sender-' + id).attr('starred', 'false');
		$('#time-' + id).attr('starred', 'false');
}

document.onclick = function(e){
    if (typeof window.linkinus !== 'undefined') {
        window.linkinus.focus();
    }
}

document.onready = function(e){
	domReady = true;
    //closeSearch();
    //$('#searchButton').imghover({suffix: '-on'});
    $('#loading').fadeOut('fast');
    scrollToBottom(true);
    
    window.location.href = "linkinus-style://styleDidFinishLoading";
}


function activateWindow(){
    $('#topic').css('background-color', variant_option('topicColorBackup'));
    $('#search').css('background-color', variant_option('topicColorBackup'));
    
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
        	lastBorderColor = $(this).css('border');
        	
        	$(this.children).each(function(i){
        	    if ($(this).attr('starred') != 'true') {
                    $(this).css('background', variant_option('spotLightColor'));
                }
            });
        
            if ($(this).attr('starred') != 'true') {
                $(this).css('background', variant_option('spotLightColor'));
            }
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
    $('div.line:first').remove();
        
    return $('div.line').size();
}

function scrollForEmbedding() {
    scrollToBottom(true);
}

function handlePostEmbedding(){   
    if (embedTimer) clearTimeout(embedTimer);
    embedTimer = setTimeout(scrollForEmbedding, 400);
}
