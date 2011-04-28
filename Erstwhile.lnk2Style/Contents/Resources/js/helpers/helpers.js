//
//  helpers.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

// WARNING: This file depends on definitions/common.js
inc('../definitions/common.js');

var myRequest;

function expandOldVariables(string, details, shouldEmbed){
    return string.replace(/\$username@\$hostname/g, details[USERHOST_KEY]).replace(/\$nickname/g, details[NICKNAME_KEY]).replace(/\$time/g, details[TIMESTAMP_KEY]).replace(/\$description/g, linkify(details[DESCRIPTION_KEY], shouldEmbed)).replace(/\$date/g, details[EXTRA_DATA_KEY]).replace(/\$recipient/g, details[EXTRA_DATA_KEY]);
}

function expandVariables(string, details, shouldEmbed){
    return expandOldVariables(string, details, shouldEmbed).replace(/\$highlighted/g, hlstr(details[HIGHLIGHTED_KEY])).replace(/\$starred/g, hlstr(details[STARRED_KEY])).replace(/\$id/g, details[POST_ID_KEY]);
}

function fancySize(size){
    for (var i=0; size > 1024 && i<SIZES.length - 1; i++) size /= 1024; 
    
    if (size == null) return 'N/A';
    return (Math.round(size) + ' ' + SIZES[i]); 
}

function hlstr(flag){
    if (flag == false || flag == 0 || flag == null || typeof flag === 'undefined' || flag == 'false' || flag == '0')
        return 'false';
        
    if (flag == true || flag == 1 | flag == 'true' || flag == '1')
        return 'true';
        
    return 'false';
}

function inc(filename)
{
   /* var body = document.getElementsByTagName('body').item(0);
    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    body.appendChild(script);*/
}

function replaceEmoticons(text){

    if (text.match(/color:/ig)) {
        return text;
    }
    
    text = text.replace(/(X-?\)~|&gt;:d|;-?\)|:-?\)|\(-?:|D-?:|(:-?@)|:-?\[|:-?s|:&apos;-?\(|:-?\||:-?\(|:-?o|:-?D|o:-?\)|&lt;3|8-?\)|:-?\*|:-?&apos;\(|(:-?\$|:-?p|:-?\\|\(N\)|\(Y\)|\(NL\)|\(OKEANOS\)|\(DRUDGE\)|\(CALTSAR\)))/ig, function(emote){ return imageForEmoticon(emote) } );

	return text;
}

function imageForEmoticon(emote){
    //window.console.log('emote = ' + emote);
    var result = emote;
    var imageName = EMOTE_LIST[emote.replace('-', '').toUpperCase()];
    
    if (imageName == null) return emote;
    
    switch(emote){
        default:
            result = '<img src="img/emoticons/' + imageName + '" class="emoticon" alt="'+emote+'" onclick="removeEmoticon(this, \'' + emote.replace('&apos;', 'WHISPERAPOS') + '\');" />';
    }

    return result;
}

function removeEmoticon($this, replacementText){
    var xOffset = 15;
	var yOffset = 15;
	var e = window.event;
	
	$('.poof').css({ left: e.pageX - xOffset + 'px', top: e.pageY - yOffset + 'px' }).show();
	animatePoof();

    $this.outerHTML = replacementText.replace('WHISPERAPOS', '&apos;');
}

function expandShortURLs(text){
    if (text.match(/(^|<|\s)http:\/\/tinyurl\.com\/\w+/) || text.match(/(^|<|\s)http:\/\/is\.gd\/\w+/) || text.match(/(^|<|\s)http:\/\/bit\.ly\/\w+/) || text.match(/(^|<|\s)http:\/\/tr\.im\/\w+/)) {

       
        myRequest = new XMLHttpRequest();
        myRequest.open("GET", 'http://conceitedsoftware.com/services/short.php?p=' + text, false);
        myRequest.send(null);
         
        if(myRequest.status == 200 && myRequest.responseText != '')        
            return myRequest.responseText;
    }
    
    return text;
}

function linkEmails(text) {
    var pattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/;
    
    return text.replace(pattern, '<a href="mailto:$1">$1</a>');
}

function parseLinks(text){
    var pattern = /(^|<|\s)((https?|ftp|news|file|telnet|sftp|svn|ssh|git|linkinus-reg|linkinus2-reg|clips1-reg):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/g;
    var matches = text.match(pattern);
  
  var pattern = /(^|<|\s)(www\.)(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;
  
    if(matches != null) {
        matches = matches.concat(text.match(pattern));
    } else {
        matches = text.match(pattern);
    }
    
    if (matches != null) {  
        return matches.filter(function(x){ return x != null; });
    }
    
    return false;
}

function grabLinkData(link){
    myRequest = new XMLHttpRequest();
    myRequest.open("HEAD", link, false);
    myRequest.send(null);
    
    return myRequest;
}

function heredoc(sStr){
    var s = sStr;
    
    s = s.replace(/function/, '');
    s = s.replace(/\(/, '');
    s = s.replace(/\)/, '');
    s = s.replace(/\{/, '');
    s = s.replace(/\}/, '', -1);
    s = s.replace(/\//, '');
    s = s.replace(/\*/, '');
    s = s.replace(/\//, '', -1);
    s = s.replace(/\*/, '', -1);
    
    return s;
}

function hasSuffix(str, str2) {
    return (str.match(str2+"$") == str2);
}

function hasPrefix(str, str2) {
    return (str.match("^"+str2) == str2);
}

function basename(path, suffix) {
    var b = path.replace(/^.*[\/\\]/g, '');
    
    if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
        b = b.substr(0, b.length-suffix.length);
    }
    
    return b;
}

function strpad(i,l,s) {
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
}

function animatePoof() {
	var bgTop = 0;
	var frames = 5;
	var frameSize = 32;
	var frameRate = 80;
	
	for(i=1;i<frames;i++) {
		$('.poof').animate({ backgroundPosition: '0 ' + (bgTop - frameSize) + 'px'}, frameRate);
		bgTop -= frameSize;
	}
	setTimeout("$('.poof').hide()", frames * frameRate);
}
