//
//  common.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

// Message detail locations --------------------------------------------------------------------------------
var MESSAGE_TYPE_KEY = 0;
var POST_ID_KEY = 1;
var NICKNAME_KEY = 2;
var DESCRIPTION_KEY = 3;
var TIMESTAMP_KEY = 4;
var NICK_COLOR_KEY = 5;
var EXTRA_DATA_KEY = 6;
var POST_TYPE_KEY = 7;
var HIGHLIGHTED_KEY = 8;
var STARRED_KEY = 9;
var ALLOW_EMBEDDING_KEY = 10;
var MESSAGE_DIRECTION_KEY = 11;
var USER_IMAGE_URL_KEY = 12;
var LOCATION_KEY = 13;
var USERHOST_KEY = 14;
var DISPLAY_UNENCRYPTED_KEY = 15;

// Post types  ---------------------------------------------------------------------------------------------
var POST_TYPE_HISTORY = 0;
var POST_TYPE_CURRENT = 1;

// Config --------------------------------------------------------------------------------------------------
var CLIP_LINE_NUM = 10;

// Utility   0         1    --------------------------------------------------------------------------------
var TF = [ 'false', 'true' ];
var SIZES =  ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; 

var EMOTE_LIST = {
    ";)"        : "Wink.png",
    "X)~"        : "Facial.png",
    "&GT;:D"    : "Angry Face.png",
    ":)"        : "Smile.png",
    "(:"        : "Smile.png",
    ":@"        : "Angry Face.png",
    ":["        : "Blush.png",
    ":S"        : "Undecided.png",
    ":&APOS;("  : "Crying.png",
    ":|"        : "Foot In Mouth.png",
    ":("        : "Frown.png",
    ":O"        : "Gasp.png",
    ":D"        : "Grin.png",
    "D:"        : "Gasp.png",
    " D:"        : "Gasp.png",
    "O:)"       : "Halo.png",
    "&LT;3"     : "Heart.png",
    "8)"        : "Wearing Sunglasses.png",
    ":*"        : "Kiss.png",
    ":$"        : "Money-mouth.png",
    ":P"        : "Sticking Out Tongue.png",
    ":\\"       : "Undecided.png",
    "(N)"       : "Thumbs Down.png",
    "(Y)"       : "Thumbs Up.png",
    "(NL)"      : "nl.png",
    "(OKEANOS)" : "okeanos.png",
    "(DRUDGE)"  : "drudge.png",
    "(CALTSAR)" : "caltsar.png"
};

function one_at_a_time(str) {
	var h = 0;
	for (i = 0; i < str.length; i++) {
		h += str.charCodeAt(i);
		h += (h << 10);
		h ^= (h >> 6);
	}

	h += h << 3;
	h ^= h >> 11;
	h += h << 15;
	return h;
}
function calculatedColorForNick(nick) {
	return CL[one_at_a_time(nick) % CL.length];
}

//
//  hintbox.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 5/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

var intDialog;

function setInternalDialog(dialog){
    intDialog = dialog;
}

function openConnectionHintBox(dialog) {
    intDialog = dialog;
	dialog.overlay.slideDown('fast', function () {
		dialog.container.slideDown('fast', function () {
			dialog.data.hide().slideDown('fast');	 
		});
	});
}

function closeConnectionHintBox(dialog) {
	dialog.data.slideUp('fast', function () {
		dialog.container.slideUp('fast', function () {
			dialog.overlay.slideUp('fast', function () {
				$.modal.close();
			});
		});
	});
	
    updateConnectionHintDisplayPreference();
}

function updateConnectionHintDisplayPreference()
{
    if (typeof window.linkinus.setDisableConnectionHintBox_ !== 'undefined') {
	    if (typeof $('#chkShowConnectionHintBox')[0] !== 'undefined') {
	        window.linkinus.setDisableConnectionHintBox_($('#chkShowConnectionHintBox')[0].checked);
	    }
	}
}

function displayJoinDialog(){
    if (typeof window.linkinus.displayJoinDialog !== 'undefined') {
        window.linkinus.displayJoinDialog();
    }
}

function displayChannelListDialog(){
    if (typeof window.linkinus.displayChannelList !== 'undefined') {
        window.linkinus.displayChannelList();
    }
}

function configureStyle(){
    if (typeof window.linkinus.showStylePreferences !== 'undefined') {
	    window.linkinus.showStylePreferences();
	}
}

function welcomeMain(){
    $('#WelcomeWhatsNew').fadeOut('slow');
    $('#WelcomeWhatsNewMore').fadeOut('slow');
    $('#WelcomeMain').fadeIn('slow');
}

function welcomeWhatsNew(){
    $('#WelcomeMain').fadeOut('slow');
    $('#WelcomeWhatsNewMore').fadeOut('slow');
    $('#WelcomeWhatsNew').fadeIn('slow');  
}

function welcomeWhatsNewMore(){
    $('#WelcomeWhatsNew').fadeOut('slow');
    $('#WelcomeWhatsNewMore').fadeIn('slow');  
}

function showConnectionHintBox(network, server, nickname, realname){
var html = function() {
/*
    <div id="connectionHintBox" style="display: none">
        <div id="connectionHintBoxContent">
            <div id="connectionHintBoxAssistant">
                <img src="img//hintbox/assistant.png" />
            </div>
            <div id="connectionHintBoxAssistantText">
                <h2>Welcome, <strong>$REALNAME!</strong> You are now connected to the <strong>$NETWORK</strong> network as <strong>$NICKNAME</strong>.</h2>
                <p>Now that you're connected, why not join a channel and start chatting?</p>
            </div>
            <div class="connectionHintBoxJoinOption join" onclick="displayJoinDialog()">
                <img src="img/hintbox/channel.png" /> Join a specific channel
            </div>
            <div class="connectionHintBoxJoinOption chanlist" onclick="displayChannelListDialog()">
                <img src="img/hintbox/list.png" /> Browse channel listing
            </div>
            <div class="connectionHintBoxJoinOption console" onclick="hideConnectionHintBox()">
                <img src="img/hintbox/console.png" /> View console activity&nbsp;&nbsp;
            </div>
            <div class="connectionHintBoxWelcomeOption" style="display:block" id="WelcomeMain">
                <h3>New to Linkinus?</h3>
                    <img src="img/hintbox/crowd.png" id="crowd" />
                    <img src="img/hintbox/customize.png" id="customize" />
                    <img src="img/hintbox/map.png" id="map" />
                    
                    <p class="intro">Linkinus 2 provides a rich, social IRC experience; featuring embedded media, message starring, nickname coloring, emoticons, and more!</p> <p class="customize">Linkinus is highly configurable. You can choose between different emoticon sets, style variants, etc. Enjoy!</p>
                    
                    <div class="connectionHintBoxConfigureOption configureWelcome" onclick="configureStyle()">
                        <p>Configure...</p>
                    </div>
                    <div class="connectionHintBoxConfigureOption whatsNew" onclick="welcomeWhatsNew()">
                        <p>What's New?</p>
                    </div>
                </div>
                <div class="connectionHintBoxWelcomeOption" style="display:none" id="WelcomeWhatsNew">
                    <img src="img/hintbox/stars.png" id="stars" />
                    <img src="img/hintbox/media.png" id="media" />
                    <img src="img/hintbox/colorednicks.png" id="colorednicks" />
                    
                    <p class="stars">With <span style="background-color: #BDEFBC;text-shadow:none">message starring</span> you're in control. Star messages and review them later in the Highlights &amp; Stars window. Press ⌘1 to manage your interesting messages.</p>
                    
                    <p class="media">Embedded content like you've never seen before. Embed all kinds of audio, video, and even document files right in your chat window.</p>
                    
                    <p class="colorednicks">Add a splash of color with colorized nicknames.</p>
                    
                    <div class="connectionHintBoxConfigureOption configureWelcome" onclick="welcomeMain()">
                        <p>Back</p>
                    </div>

                    <div class="connectionHintBoxConfigureOption whatsNew" onclick="welcomeWhatsNewMore()">
                        <p>More</p>
                    </div>
                </div>
                <div class="connectionHintBoxWelcomeOption" style="display:none" id="WelcomeWhatsNewMore" >
                    <img src="img/hintbox/links.png" id="links" />
                    <img src="img/hintbox/emoticons.png" id="emoticons" />
                    <img src="img/hintbox/groups.png" id="groups" />
                    
                    <p class="stars">Avoid clicking misleading links. With automatic link expansion for multiple URL shorting services you can easily see where a link will take you before you click it.</p>
                    
                    <p class="media">Make your smiles visually appealing! Styles may now include their own emoticon sets for you to enjoy.</p>
                    
                    <p class="colorednicks">Use Groups to save your combined chat view layouts for repeat use!</p>
                    
                    <div class="connectionHintBoxConfigureOption whatsNew" onclick="welcomeWhatsNew()">
                        <p>Back</p>
                    </div>
                </div>
                
                <span id="connectionHintCheck">
                    <input id="chkShowConnectionHintBox" type="checkbox" onclick="updateConnectionHintDisplayPreference();" /> Don't show this message again
                </span>
            </div>
        </div>
*/
    }
    var outputLine = heredoc(new String(html));
    
    outputLine = outputLine.replace(/\$NETWORK/g, network).replace(/\$SERVER/g, server).replace(/\$NICKNAME/g, nickname).replace(/\$REALNAME/g, realname);
    
    $(outputLine).modal({onOpen: openConnectionHintBox, onClose: closeConnectionHintBox});
}

function hideConnectionHintBox(){
    closeConnectionHintBox(intDialog);
}

function hintboxButtonPressed($this){
    $($this).addClass('pressed');
}

function hintboxButtonReleased($this){
    $($this).removeClass('pressed');
}

//
//  custom.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//


var AL = [ 'even', 'odd' ];
var CL = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty' ];


//
//  variants.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 5/22/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

STYLE_VARIANT = '';

var STYLE_VARIANT_OPTIONS = {
    "normal": {
        "historyIcon": 'history.png',
        "personImage": 'person.png',
        "topicColor": '-webkit-gradient(linear, left top, left bottom, from(#d1d1d1), to(#bcbcbc))',
        "topicColorBackup": '#bcbcbc',
        "topicColorInactive": '#dddddd',
        "spotLightColor": '#dfdfdf'
    },
		"normal (flashembeds)": {
        "historyIcon": 'history.png',
        "personImage": 'person.png',
        "topicColor": '-webkit-gradient(linear, left top, left bottom, from(#d1d1d1), to(#bcbcbc))',
        "topicColorBackup": '#bcbcbc',
        "topicColorInactive": '#dddddd',
        "spotLightColor": '#dfdfdf'
    },
    'dark': {
        "historyIcon": 'darkhistory.png',
        "personImage": 'person-white.png',
        "topicColor": '-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(98, 98, 98)), color-stop(0.5, rgb(32, 32, 32)), color-stop(0.5, rgb(0, 0, 0)), to(rgb(0, 0, 0)))',
        "topicColorBackup": '#111',
        "topicColorInactive": '#444',
        "spotLightColor": '#333'
    },
		'dark (flashembeds)': {
        "historyIcon": 'darkhistory.png',
        "personImage": 'person-white.png',
        "topicColor": '-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(98, 98, 98)), color-stop(0.5, rgb(32, 32, 32)), color-stop(0.5, rgb(0, 0, 0)), to(rgb(0, 0, 0)))',
        "topicColorBackup": '#111',
        "topicColorInactive": '#444',
        "spotLightColor": '#333'
    }

};

function variant_option(setting){
    var variant = STYLE_VARIANT;
    
    if (variant == '') {
        variant = 'normal';
    }
    
    return STYLE_VARIANT_OPTIONS[variant][setting];
}


/////////////////////



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

function hlstr(flag){
    if (flag == false || flag == 0 || flag == null || typeof flag === 'undefined' || flag == 'false' || flag == '0')
        return 'false';
        
    if (flag == true || flag == 1 | flag == 'true' || flag == '1')
        return 'true';
        
    return 'false';
}

function replaceEmoticons(text){

    if (text.match(/color:/ig)) {
        return text;
    }
    
    text = text.replace(/(^D-?:)|\s(D-?:)|(X-?\)~|&gt;:d|;-?\)|:-?\)|\(-?:|(:-?@)|:-?\[|:-?s|:&apos;-?\(|:-?\||:-?\(|:-?o|:-?D|o:-?\)|&lt;3|8-?\)|:-?\*|:-?&apos;\(|(:-?\$|:-?p|:-?\\|\(N\)|\(Y\)|\(NL\)|\(OKEANOS\)|\(DRUDGE\)|\(CALTSAR\)))/ig, function(emote){ return imageForEmoticon(emote) } );

	return text;
}

function imageForEmoticon(emote){
    //window.console.log('emote = "' + emote + '"');
    var result = emote;
    var imageName = EMOTE_LIST[emote.replace('-', '').toUpperCase()];
    
    if (imageName == null) return emote;
    
    switch(emote){
        case ' D:':
            result = '&nbsp;<img src="img/emoticons/' + imageName + '" class="emoticon" alt="'+emote+'" onclick="removeEmoticon(this, \'' + emote.replace('&apos;', 'WHISPERAPOS') + '\');" />';
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

//
//  helpers.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

// WARNING: This file depends on definitions/common.js
//inc('../definitions/common.js');

var myRequest;

function expandOldVariables(string, details){
    return string.replace(/\$username@\$hostname/g, details[USERHOST_KEY]).replace(/\$nickname/g, details[NICKNAME_KEY]).replace(/\$time/g, details[TIMESTAMP_KEY].substr(11,8)).replace(/\$description/g, linkify(details[DESCRIPTION_KEY])).replace(/\$date/g, details[EXTRA_DATA_KEY]).replace(/\$recipient/g, details[EXTRA_DATA_KEY]);
}

function expandVariables(string, details){
    return expandOldVariables(string, details).replace(/\$highlighted/g, TF[details[HIGHLIGHTED_KEY]]).replace(/\$starred/g, TF[details[STARRED_KEY]]).replace(/\$id/g, details[POST_ID_KEY]);
}

/*!
 * processLinks - v0.3 - 6/27/2009
 * http://benalman.com/code/test/js-linkify/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * Some regexps adapted from http://userscripts.org/scripts/review/7122
 */

// Turn text into linkified html.
// 
// var html = linkify( text, options );
// 
// options:
// 
//  callback (Function) - default: undefined - if defined, this will be called
//    for each link- or non-link-chunk with two arguments, text and href. If the
//    chunk is non-link, href will be omitted.
// 
//  punct_regexp (RegExp | Boolean) - a RegExp that can be used to trim trailing
//    punctuation from links, instead of the default.
// 
// This is a work in progress, please let me know if (and how) it fails!

window.processLinks = (function(){
  var
    SCHEME = "[a-z\\d.-]+://",
    IPV4 = "(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])",
    HOSTNAME = "(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+",
    TLD = "(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)",
    HOST_OR_IP = "(?:" + HOSTNAME + TLD + "|" + IPV4 + ")",
    PATH = "(?:[;/][^#?<>\\s]*)?",
    QUERY_FRAG = "(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?",
    URI1 = "\\b" + SCHEME + "[^<>\\s]+",
    URI2 = "\\b" + HOST_OR_IP + PATH + QUERY_FRAG + "(?!\\w)",
    
    MAILTO = "mailto:",
    EMAIL = "(?:" + MAILTO + ")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@" + HOST_OR_IP + QUERY_FRAG + "(?!\\w)",
    
    URI_RE = new RegExp( "(?:" + URI1 + "|" + URI2 + "|" + EMAIL + ")", "ig" ),
    SCHEME_RE = new RegExp( "^" + SCHEME, "i" ),
    
    quotes = {
      "'": "`",
      '>': '<',
      ')': '(',
      ']': '[',
      '}': '{',
      '»': '«',
      '›': '‹'
    },
    
    default_options = {
      callback: function( text, href ) {
        return href ? '<a href="' + href + '" title="' + href + '">' + text + '<\/a>' : text;
      },
      punct_regexp: /(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/
    };
  
  return function( txt, options ) {
    options = options || {};
    
    // Temp variables.
    var arr,
      i,
      link,
      href,
      
      // Output HTML.
      html = '',
      
      // Store text / link parts, in order, for re-combination.
      parts = [],
      
      // Used for keeping track of indices in the text.
      idx_prev,
      idx_last,
      idx,
      link_last,
      
      // Used for trimming trailing punctuation and quotes from links.
      matches_begin,
      matches_end,
      quote_begin,
      quote_end;
    
    // Initialize options.
    for ( i in default_options ) {
      if ( options[ i ] === undefined ) {
        options[ i ] = default_options[ i ];
      }
    }
    
    // Find links.
    while ( arr = URI_RE.exec( txt ) ) {
      
      link = arr[0];
      idx_last = URI_RE.lastIndex;
      idx = idx_last - link.length;
      
      // Not a link if preceded by certain characters.
      if ( /[\/:]/.test( txt.charAt( idx - 1 ) ) ) {
        continue;
      }
      
      // Trim trailing punctuation.
      do {
        // If no changes are made, we don't want to loop forever!
        link_last = link;
        
        quote_end = link.substr( -1 )
        quote_begin = quotes[ quote_end ];
        
        // Ending quote character?
        if ( quote_begin ) {
          matches_begin = link.match( new RegExp( '\\' + quote_begin + '(?!$)', 'g' ) );
          matches_end = link.match( new RegExp( '\\' + quote_end, 'g' ) );
          
          // If quotes are unbalanced, remove trailing quote character.
          if ( ( matches_begin ? matches_begin.length : 0 ) < ( matches_end ? matches_end.length : 0 ) ) {
            link = link.substr( 0, link.length - 1 );
            idx_last--;
          }
        }
        
        // Ending non-quote punctuation character?
        if ( options.punct_regexp ) {
          link = link.replace( options.punct_regexp, function(a){
            idx_last -= a.length;
            return '';
          });
        }
      } while ( link.length && link !== link_last );
      
      href = link;
      
      // Add appropriate protocol to naked links.
      if ( !SCHEME_RE.test( href ) ) {
        
        
        if (href.indexOf( '@' ) !== -1) {
            if (!href.indexOf( MAILTO )) {
                href = href;
            } else {
                href = MAILTO + href;
            }
        } else {
            if (href.indexOf( 'irc.' )!== -1) {
                href = 'irc://' + href;
            } else if (href.indexOf( 'ftp.' ) !== -1) {
               href = 'ftp://' + href; 
            }  else {
                href = 'http://' + href;
            }
        }
      }
      
      // Push preceding non-link text onto the array.
      if ((idx_prev != idx)) {
        parts.push([ txt.slice( idx_prev, idx ) ]);
        idx_prev = idx_last;
      }
      
      // Push massaged link onto the array
      parts.push([ link, href ]);
    };
    
    // Push remaining non-link text onto the array.
    parts.push([ txt.substr( idx_prev ) ]);
    
    // Process the array items.
    for ( i = 0; i < parts.length; i++ ) {
      html += options.callback.apply( window, parts[i] );
    }
    
    // In case of catastrophic failure, return the original text;
    return html || txt;
  };
  
})();


//
//  Utility Methods
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

function fancySize(size){
    for (var i=0; size > 1024 && i<SIZES.length - 1; i++) size /= 1024; 
    
    if (size == null) return 'N/A';
    return (Math.round(size) + ' ' + SIZES[i]); 
}

function grabLinkData(link){
    myRequest = new XMLHttpRequest();
    
    try {
        myRequest.open("HEAD", link, false);
        myRequest.send(null);
    } catch (e) {
        //window.console.log("Failed grabbing data!");
    }
    
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

//
//  EmbedKit
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 5/30/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

var embedNum = 0;
var gShouldEmbed = false;

function handleEmbeds(link, text){
    var contentType;
    var linkData;  
    
    if(link.match(/(mp3|m4a|wav|aiff)$/i)) {
        linkData = grabLinkData(link);  
        var contentType = linkData.getResponseHeader('Content-Type');
        
        if (linkData.status == 200) {
            switch(contentType) {
                case 'audio/mpeg':
                case 'audio/mp3':
                case 'audio/mp4':
                case 'audio/wav':
                case 'audio/aiff':
                    result = embedAudio(link, text); break;
                default: 
                    result = createLinkFromText(link, text); break; 
            }
        } else {
            result = createLinkFromText(link, text);
        }
    } else if(link.match(/(gif|jpg|jpeg|png|bmp|tiff)$/i)) {

        linkData = grabLinkData(link);  
        var contentType = linkData.getResponseHeader('Content-Type');
        
        if (linkData.status == 200) {
            switch(contentType) {
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/gif':
                case 'image/tiff':
                case 'image/tif':
                case 'image/bmp':
                    result = embedImages(link, link, text); break;
                default: 
                    result = createLinkFromText(link, text); break; 
            }
        } else {

           result = createLinkFromText(link, text);
        }
	 } else if(link.match(/5min\.com|amazon\.com|flickr\.com|video\.google\.|hulu\.com|imdb\.com|metacafe\.com|qik\.com|slideshare\.com|twitpic\.com|viddler\.com|vimeo\.com|youtube\.com\/watch/ig)) {
       result = embedURLs(link, text, true);
   } else if(link.match(/cl\.ly|strez\.at|cloud\..*\..*/ig)) {
	    result = embedCloudApp(link, text);
	 } else if(link.match(/instagr\.am\/p\/.*/ig)) {
			result = embedInstragram(link, text);
	// } /*else if(link.match(/d\.pr\/.*/ig)) {
//			result = embedDroplr(link, text);
	 } else if (link.match(/^http:\/\/img\.ly/ig)) {
       var imgToUse = link;
       
       if (!link.match(/http:\/\/img\.ly\/show/ig)) {
           imgToUse = 'http://img.ly/show/thumb/' + basename(link);
       }
       
       result = embedImages(imgToUse, link, text);
   } else if (link.match(/^https?:\/\/gist\.github\.com\/raw/ig)) {
       //window.console.log("gist in my pants");
       result = embedGist(link, text);
   } else if (link.match(/^http:\/\/pastie\.org\/pastes\/\d+$/) || link.match(/^http:\/\/www\.pastie\.org\/pastes\/\d+$/) || link.match(/^http:\/\/pastie\.org\/\d+\.txt$/) || link.match(/^http:\/\/pastie\.org\/\d+$/) || link.match(/^http:\/\/www\.pastie\.org\/\d+$/)) {
       result = embedPastie(link, text);
   } else {
      result = createLinkFromText(link, text);
   }
    
    return result;
}

function embedAudio(link, text) {
    embedNum++;
	return '<div class="audio" id="embed-'+embedNum+'"><div><audio class="media" src="' + link + '" controls="true">Safari 4 is required for embedded audio</audio><a href="'+ link +'" title="Click to open '+ link +' in your browser"><img src="img/imgArrow.png"/></a><span title="Close Embed" onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\', \'' + text + '\');return false;"><img src="img/imgCross.png" /></span></div></div>';
}

function embedVideo(data, link, text) {
    embedNum++;
   	return '<div class="video" id="embed-'+embedNum+'" align="center"><div>' + data.html.replace('application/x-shockwave-flash', 'application/futuresplash') + '</div><a href="'+ link +'" title="'+ link +'"  style="position:relative; left:-9px"><img src="img/imgArrow.png" /></a>  <span title="Close Embed" onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\', \'' + text + '\');return false;"  style="position:relative; left:-9px"><img src="img/imgCross.png" /></span></div>';
}

function embedCloudVideo(data, link, text) {
    embedNum++;
   	return '<div class="video" id="embed-'+embedNum+'" align="center"><div><video src="' + data.remote_url + '" width="640" height="385"></video></div><a href="'+ link +'" title="'+ link +'"  style="position:relative; left:-9px"><img src="img/imgArrow.png" /></a>  <span title="Close Embed" onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\', \'' + text + '\');return false;"  style="position:relative; left:-9px"><img src="img/imgCross.png" /></span></div>';
}

function embedImages(link, optlink, text) {
	embedNum++;

    if (!optlink) optlink = link;
	
   	return '<div class="image" id="embed-'+embedNum+'"><div><img src="'+link+'" class="media" style="max-width:200px;max-height:'+$(window).height()*0.8+'px;" onClick="doQuicklookForImage(\'' + link + '\');" /></div><a href="'+optlink+'" title="Click to open '+optlink+' in your browser"  style="position:relative; left:-9px"><img src="img/imgArrow.png" /></a>  <span title="Close Embed" onClick="dismissEmbed(\'' + embedNum + '\', \'' + optlink + '\', \'' + text + '\');return false;"  style="position:relative; left:-9px"><img src="img/imgCross.png" /></span></div>';
}

function embedMedia(link, text) {
    var provider = getOEmbedProvider(link);
    
    if (provider != null) {
    	provider.maxWidth = 500;
    	provider.maxHeight = 400;               
    	
    	return provider.embedCode(link, text);	
    }
    
    return createLinkFromText(link, text);
}

function embedURLs(link, text, shouldEmbed) {
   if (shouldEmbed) {
       return embedMedia(link, text);
   }
   
   return createLinkFromText(link, text);
}

function embedGist(link, text) {
  var page_request =  new XMLHttpRequest();
    
        try {
            page_request.open('GET', link, false); 
            page_request.send(null);
        } catch(e) {
            return link;
        }
        
        if (page_request.status == 200) {
                        embedNum++;

            var lines = page_request.responseText.split("\n");
            var output = '<div id="embed-'+embedNum+'"><table cellspacing="0" cellpadding="0" style="code_table">';
            var count = CLIP_LINE_NUM;
            
            if (lines.length < CLIP_LINE_NUM) count = lines.length;
            
            for (var i = 0; i < count; i++) {
                var first = '';
                
                if (i == 0) first = ' first';
                
                output = output + '<tr><td class="code_line' + first + '">' + (i+1) + '</td><td>&nbsp;</td><td class="code_code"><code>' + htmlEntities(lines[i]) + '</code></td></tr>';
            }

            output = output + '</table>';
            
            output = output + '<div class="code_menu">Showing ' + i + ' of ' + lines.length + ' lines | ' + fancySize(page_request.getResponseHeader("Content-Length")) + '&nbsp;&nbsp;&nbsp;<a href="'+link+'" title="Click to open '+link+' in your browser"><img src="img/imgArrow.png" /></a>&nbsp;&nbsp;&nbsp;<span style="display:inline;cursor:pointer" title="Close Embed" onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\', \'' + text + '\');return false;"><img src="img/imgCross.png" /></span><span style="float:right;color:#737373">powered by gist.github</span></div></div>';
            
            return (output);
        }
    return link;
}

function createLinkFromText(link, text) {
    return  '<a href="' + link + '" title="Click to open ' + link + '">' + text + '</a>';
}

//
//  Whisper Embed Helpers
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

function doQuicklookForImage(image){
    var output = '<div class="simplemodal-close" style="text-align:center;border:0;vertical-align:middle"><img src="' + image + '" style="background-color: #bcbcbc;background: -webkit-gradient(linear, left top, left bottom, from(#d1d1d1), to(#bcbcbc));padding: 5px 5px 5px 5px;-webkit-border-radius: 5px;border:0;z-index:102;max-width:95%;max-height:95%" /></div>';
    
    $(output).modal({
      onOpen: openQuicklook, 
    onClose: closeQuicklook,
    close: 'true',
  overlayId: '#embed-overlay',
  containerCss: {
    height: 600,
    width: 800,
    backgroundColor: 'transparent',
    border: 'none'
  }
});
}

function openQuicklook(dialog) {
	dialog.overlay.fadeIn('fast', function () {
		dialog.container.fadeIn('fast', function () {
			dialog.data.hide().fadeIn('fast');	 
		});
	});
}

function closeQuicklook(dialog) {
	dialog.data.fadeOut('fast', function () {
		dialog.container.fadeOut('fast', function () {
			dialog.overlay.fadeOut('fast', function () {
				$.modal.close();
			});
		});
	});
}


function dismissEmbed(id, link, text){
   document.getElementById('embed-'+id).outerHTML = createLinkFromText(link, text);
}

//
//  Long URL Handler
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

function urlExpander(aTag, longurl) {
    aTag.href = longurl;
    aTag.title = "Click to open " + longurl;
     
    if (longurl.length > 30)
      aTag.innerHTML = longurl.substring(0,15) + '...' + longurl.substring(longurl.length-15, longurl.length );
    else
      aTag.innerHTML = longurl;
}

//
//  Linkifcation Entrypoint
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

function linkify(text, shouldEmbed){
  gShouldEmbed = shouldEmbed;
  
  text = processLinks(text, { callback: function( text, href ) {
      
      if ( href ) {                
         if (gShouldEmbed) {
            var embeddedText = handleEmbeds(href, text);
            
            if (typeof handlePostEmbedding != 'undefined') {
                handlePostEmbedding();
            }
            text = text.replace(text, embeddedText);                    
        } else {
            text = text.replace(text, embedURLs(href, text, shouldEmbed));
        }      
      } 
      return text;
    }});
    
    return text;   
}

function embedCloudApp(link, text) {
    var code;
    var type;
    
    request = new XMLHttpRequest();
    try {
        request.open("GET", link, false);
	    	request.setRequestHeader('Accept', 'application/json');
        request.send(null);
    } catch (e) {
        return createLinkFromText(link, text);;
    }
    
    if (request.status == '200') {
        var data = eval('(' + request.responseText + ')');

				if (typeof data !== 'undefined') {
					switch (data.item_type) {
						case 'image':
        			return embedImages(data.remote_url, link, text);
						case 'video':
							//return embedCloudVideo(data, link, text);
						default:
							//console.log(data);
						break;
					}
        }
    }
    
    return createLinkFromText(link, text);
}

function embedInstragram(link, text) {
    var code;
    var type;
    
    request = new XMLHttpRequest();
    try {
        request.open("GET", link, false);
        request.send(null);
    } catch (e) {
        return link;
    }
    
    if (request.status == '200') {
        var data = $('img.photo', request.responseText);
				var img = data[0];
				
				if (typeof img !== 'undefined') {
					return embedImages(data[0].src, link, text);
				}
    }
    
    return createLinkFromText(link, text);
}

function embedDroplr(link, text) {
    var code;
    var type;
    
    request = new XMLHttpRequest();
    try {
        request.open("GET", link, false);
        request.send(null);
    } catch (e) {
        return link;
    }
    
    if (request.status == '200') {
        var data = jQuery(request.responseText).filter('#image').children().filter('img');

				if (typeof data !== 'undefined') {
					return embedImages(data[0].src, link, text);
				}
    }
    
    return createLinkFromText(link, text);
}

function embedPastie(link, text){   
    if (link.match(/^http:\/\/pastie\.org\/pastes\/\d+$/) || link.match(/^http:\/\/www\.pastie\.org\/pastes\/\d+$/)) {
        link = link.replace('/pastes', '');
    }
    
    if (link.match(/^http:\/\/pastie\.org\/\d+\.txt$/) || link.match(/^http:\/\/pastie\.org\/\d+$/) || link.match(/^http:\/\/www\.pastie\.org\/\d+$/)) {
        var url;
        
        if (link.match(".txt$")) {
            url = link;
        } else {
            url = link + '.txt';
        }
        var page_request =  new XMLHttpRequest();
    
        try {
            page_request.open('GET', url, false); 
            page_request.send(null);
        } catch(e) {
            return link;
        }
        
        if (page_request.status == 200) {
                        embedNum++;
		
			var html = page_request.responseText;
			var data = $(html);
			var testthing =  data[1].innerText;
            var lines = testthing.split("\n");
            var output = '<div id="embed-'+embedNum+'"><table cellspacing="0" cellpadding="0" style="code_table">';
            var count = CLIP_LINE_NUM;
            
            if (lines.length < CLIP_LINE_NUM) count = lines.length;
            
            for (var i = 0; i < count; i++) {
                var first = '';
                
                if (i == 0) first = ' first';
                
                output = output + '<tr><td class="code_line' + first + '">' + (i+1) + '</td><td>&nbsp;</td><td class="code_code"><code>' + htmlEntities(lines[i]) + '</code></td></tr>';
            }

            output = output + '</table>';
            
            output = output + '<div class="code_menu">Showing ' + i + ' of ' + lines.length + ' lines | ' + fancySize(page_request.getResponseHeader("Content-Length")) + '&nbsp;&nbsp;&nbsp;<a href="'+link+'" title="Click to open '+link+' in your browser"><img src="img/imgArrow.png" /></a>&nbsp;&nbsp;&nbsp;<span style="display:inline;cursor:pointer" title="Close Embed" onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\', \'' + text + '\');return false;"><img src="img/imgCross.png" /></span><span style="float:right;color:#737373">powered by pastie.org</span></div></div>';
            
            return (output);
        }
    }
    return link;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function getOEmbedProvider(url) {
        for (var i = 0; i < providers.length; i++) {
            if (providers[i].matches(url))
                return providers[i];
        }
        return null;
    }

function updateProviders()
{
	providers = [
      new OEmbedProvider("Amazon", "amazon.com"),
      new OEmbedProvider("Flickr", "flickr"),
      new OEmbedProvider("IMDB", "imdb.com"),
      new OEmbedProvider("TwitPic", "twitpic.com")
  ];

	if (typeof STYLE_VARIANT !== 'undefined' && STYLE_VARIANT.indexOf('flashembeds') != -1) {
		providers.push(new OEmbedProvider("Fivemin", "5min.com"));
    providers.push(new OEmbedProvider("GoogleVideo", "video.google."));
    providers.push(new OEmbedProvider("Hulu", "hulu.com"));
    providers.push(new OEmbedProvider("Viddler", "viddler.com"));
    providers.push(new OEmbedProvider("Vimeo", "vimeo.com", "http://vimeo.com/api/oembed.json"));
    providers.push(new OEmbedProvider("YouTube", "youtube.com"));
    providers.push(new OEmbedProvider("MetaCafe", "metacafe.com"));
    providers.push(new OEmbedProvider("Qik", "qik.com"));
    providers.push(new OEmbedProvider("Revision3", "slideshare"));
    providers.push(new OEmbedProvider("SlideShare", "5min.com"));
	}
}

    var providers = [
        new OEmbedProvider("Amazon", "amazon.com"),
        new OEmbedProvider("Flickr", "flickr"),
        new OEmbedProvider("IMDB", "imdb.com"),
        new OEmbedProvider("TwitPic", "twitpic.com")
    ];

		if (typeof STYLE_VARIANT !== 'undefined' && STYLE_VARIANT.indexOf('flashembeds') != -1) {
			providers.push(new OEmbedProvider("Fivemin", "5min.com"));
      providers.push(new OEmbedProvider("GoogleVideo", "video.google."));
      providers.push(new OEmbedProvider("Hulu", "hulu.com"));
      providers.push(new OEmbedProvider("Viddler", "viddler.com"));
      providers.push(new OEmbedProvider("Vimeo", "vimeo.com", "http://vimeo.com/api/oembed.json"));
      providers.push(new OEmbedProvider("YouTube", "youtube.com"));
      providers.push(new OEmbedProvider("MetaCafe", "metacafe.com"));
      providers.push(new OEmbedProvider("Qik", "qik.com"));
      providers.push(new OEmbedProvider("Revision3", "slideshare"));
      providers.push(new OEmbedProvider("SlideShare", "5min.com"));
		}

    function OEmbedProvider(name, urlPattern, oEmbedUrl, callbackparameter) {
        this.name = name;
        this.urlPattern = urlPattern;
        this.oEmbedUrl = (oEmbedUrl != null) ? oEmbedUrl : "http://oohembed.com/oohembed/";
        this.callbackparameter = (callbackparameter != null) ? callbackparameter : "callback";
        this.maxWidth = 500;
        this.maxHeight = 400;

        this.matches = function(externalUrl) {
            // TODO: Convert to Regex
            return externalUrl.indexOf(this.urlPattern) >= 0;
        };

        this.getRequestUrl = function(externalUrl) {

            var url = this.oEmbedUrl;

            if (url.indexOf("?") <= 0)
                url = url + "?";

            url += "maxwidth=" + this.maxWidth + 
						"&maxHeight=" + this.maxHeight + 
						"&format=json" + 
						"&url=" + escape(externalUrl);	
						
            return url;
        }

        this.embedCode = function(externalUrl, text, embedCallback) {
            var requestUrl = this.getRequestUrl(externalUrl);
            var code;
            var type;
            
            request = new XMLHttpRequest();
            
            try {
                request.open("GET", requestUrl, false);
                request.send(null);
            } catch (e) {
                return externalUrl;
            }
            
            if (request.status == '200') {
                var data = eval('(' + request.responseText + ')');
                type = data.type;
                
                switch(type) {
                    case 'video':
                        code = embedVideo(data, externalUrl, text); break;
                    case 'photo':
												//console.log('url = ' + data.url + '\nexternal = ' + externalUrl + '\ntext = ' + text);
                        code = embedImages(data.url, externalUrl, text); break;
                }
            } else {
                code = createLinkFromText(externalUrl, externalUrl);
            }
            
            return code;
        }
    }
    
    
    
    
//////////////////////////////////////////

var longurlplease = {
  // At the moment clients must maintain a list of services which they will attempt to lengthen short urls for
  shortUrlsPattern : new RegExp("^(http(s?)://(307\.to|adjix\.com|b23\.ru|bacn\.me|bit\.ly|fb\.me|goo\.gl|bloat\.me|budurl\.com|cli\.gs|clipurl\.us|cort\.as|digg\.com|dwarfurl\.com|ff\.im|fff\.to|href\.in|idek\.net|is\.gd|j\.mp|kl\.am|korta\.nu|lin\.cr|ln\-s\.net|loopt\.us|lost\.in|memurl\.com|merky\.de|migre\.me|moourl\.com|nanourl\.se|ow\.ly|peaurl\.com|ping\.fm|piurl\.com|plurl\.me|pnt\.me|poprl\.com|post\.ly|rde\.me|reallytinyurl\.com|redir\.ec|retwt\.me|rubyurl\.com|short\.ie|short\.to|smallr\.com|sn\.im|sn\.vc|snipr\.com|snipurl\.com|snurl\.com|su\.pr|tiny\.cc|tinysong\.com|tinyurl\.com|togoto\.us|tr\.im|tra\.kz|trg\.li|twurl\.cc|twurl\.nl|u\.mavrev\.com|u\.nu|ur1\.ca|url\.az|url\.ie|urlx\.ie|w34\.us|xrl\.us|yep\.it|zi\.ma|zurl\.ws)/[a-zA-Z0-9_-]+)$|((^http(s?)://[a-zA-Z0-9_-]+\.notlong\.com)|(^http(s?)://[a-zA-Z0-9_-]+\.qlnk\.net)|(^http(s?)://chilp\.it/[?][a-zA-Z0-9_-]+)|(^http(s?)://trim\.li/nk/[a-zA-Z0-9_-]+))[/]?$"),
  numberOfUrlsPerBatch : 4,
  lengthen : function(options) {
    if (typeof(options) == 'undefined')
      options = {}

    var makeRequest = function() { alert('not sure how to call api'); };
    if (options.transport != null ){
      if (options.transport.toLowerCase() == 'air')
        makeRequest = longurlplease.makeRequestWithAir;
      else if (options.transport.toLowerCase() == 'flxhr')
        makeRequest = longurlplease.makeRequestWithFlxhr;
      else if (options.transport.toLowerCase() == 'jquery')
        makeRequest = longurlplease.makeRequestWithJQuery;
    }

    var urlToElements = options.urlToElements;
    var toLengthen = options.toLengthen;
    if (toLengthen == null || urlToElements == null) {
      var parent = document;
      if(options.element != null)
        parent = options.element;
      urlToElements = {};
      toLengthen = [];
      var els = parent.getElementsByTagName('a');
      for (var elIndex = 0; elIndex < els.length; elIndex++) {
        var el = els[elIndex];
        if (longurlplease.shortUrlsPattern.test(el.href)) {
          toLengthen.push(el.href);
          var listOfElements = urlToElements[el.href];
          if (listOfElements == null)
            listOfElements = []
          listOfElements.push(el);
          urlToElements[el.href] = listOfElements;
        }
      }
    }

    var lengthenShortUrl = longurlplease.defaultExpandMethod;

    if (options.lengthenShortUrl != null)
    {
      if(typeof options.lengthenShortUrl == 'function')
        lengthenShortUrl = options.lengthenShortUrl
      else if(typeof options.lengthenShortUrl == 'string')
      {
        if(options.lengthenShortUrl == 'href-only')
          lengthenShortUrl = longurlplease.hrefOnlyExpandMethod;
        else if(options.lengthenShortUrl == 'full')
          lengthenShortUrl = longurlplease.fullExpandMethod;
        else if(options.lengthenShortUrl == 'text-and-title')
          lengthenShortUrl = longurlplease.textAndTitleExpandMethod;
      }
    }

    var handleResponseEntry = function(shortUrl, longUrl) {
      var aTags = urlToElements[shortUrl];
      for (var ai = 0; ai < aTags.length; ai++)
        lengthenShortUrl(aTags[ai], longUrl);
    };
    var subArray, i = 0;
    while (i < toLengthen.length) {
      subArray = toLengthen.slice(i, i + longurlplease.numberOfUrlsPerBatch)
      var paramString = longurlplease.toParamString(subArray);
      makeRequest(paramString, handleResponseEntry);
      i = i + longurlplease.numberOfUrlsPerBatch;
    }
  },
  defaultExpandMethod: function(aTag, longUrl) {
    // You can customize this - my intention here is to alter the visible text to use as much of the long url
    // as possible, but maintain the same number of characters to help keep visual consistancy.
    if (aTag.href == aTag.innerHTML) {
      var linkText = longUrl.replace(/^http(s?):\/\//, '').replace(/^www\./, '');
      aTag.innerHTML = linkText.substring(0, aTag.innerHTML.length - 3) + '...';
    }
    aTag.href = longUrl;
  },
  hrefOnlyExpandMethod : function(aTag, longUrl) {
    aTag.href = longUrl;
  },
  fullExpandMethod : function(aTag, longUrl) {
    aTag.href = longUrl;
    aTag.innerHTML = longUrl;
  },
  textAndTitleExpandMethod : function(aTag, longUrl) {
    var linkText = longUrl.replace(/^http(s?):\/\//, '').replace(/^www\./, '');
    aTag.innerHTML = linkText.substring(0, aTag.innerHTML.length - 3) + '...';
    aTag.title = longUrl;
  },
  toParamString : function(shortUrls) {
    var paramString = "";
    for (var j = 0; j < shortUrls.length; j++) {
      var href = shortUrls[j];
      paramString += "q=";
      paramString += encodeURI(href);
      if (j < shortUrls.length - 1)
        paramString += '&'
    }
    return paramString;
  },
  apiUrl : function() {
    return (("https:" == document.location.protocol) ? "https" : "http") + "://longurlplease.appspot.com/api/v1.1";
  },
  makeRequestWithAir : function(paramString, callback) {
    var loader = new air.URLLoader();
    loader.addEventListener(air.Event.COMPLETE, function (event) {
      JSON.parse(event.target.data, function (key, val) {
        if (typeof val === 'string' && val != null)
          callback(key, val);
      });
    });
    var request = new air.URLRequest(longurlplease.apiUrl() + "?ua=air&" + paramString);
    loader.load(request);
  },
  // made possible by http://flxhr.flensed.com/
  makeRequestWithFlxhr : function(paramString, callback) {
    var flproxy = new flensed.flXHR({ autoUpdatePlayer:true, xmlResponseText:false, instancePooling:true, onreadystatechange:function (XHRobj) {
      if (XHRobj.readyState == 4)
        JSON.parse(XHRobj.responseText, function (key, val) {
          if (typeof val === 'string' && val != null)
            callback(key, val);
        });
    }});
    flproxy.open("GET", longurlplease.apiUrl() + "?ua=flxhr&" + paramString);
    flproxy.send();
  },
  makeRequestWithJQuery : function(paramString, callback) {
    jQuery.getJSON(longurlplease.apiUrl() + "?ua=jquery&" + paramString + "&callback=?",
            function(data) {
              jQuery.each(data, function(key, val) {
                if (val != null)
                  callback(key, val);
              });
            });
  }
};

if (typeof(jQuery) != 'undefined') {
  jQuery.longurlplease = function(options) {
    jQuery('body').longurlplease(options)
  };
  jQuery.fn.longurlplease = function(options) {
    if (typeof(options) == 'undefined')
      options = {}
    options.transport = 'jquery';
    var toLengthen = [];
    var urlToElements = {};
    this.find('a').filter(function() {
      return this.href.match(longurlplease.shortUrlsPattern)
    }).each(function() {
      toLengthen.push(this.href);
      var listOfElements = urlToElements[this.href];
      if (listOfElements == null)
        listOfElements = []
      listOfElements.push(this);
      urlToElements[this.href] = listOfElements;
    });
    options.toLengthen = toLengthen;
    options.urlToElements = urlToElements;
    longurlplease.lengthen(options);
    return this;
  };
}
/*
 * SimpleModal 1.2.3 - jQuery Plugin
 * http://www.ericmmartin.com/projects/simplemodal/
 * Copyright (c) 2009 Eric Martin
 * Dual licensed under the MIT and GPL licenses
 * Revision: $Id: jquery.simplemodal.js 185 2009-02-09 21:51:12Z emartin24 $
 */
(function($){var ie6=$.browser.msie&&parseInt($.browser.version)==6&&typeof window['XMLHttpRequest']!="object",ieQuirks=null,w=[];$.modal=function(data,options){return $.modal.impl.init(data,options);};$.modal.close=function(){$.modal.impl.close();};$.fn.modal=function(options){return $.modal.impl.init(this,options);};$.modal.defaults={opacity:100,overlayId:'simplemodal-overlay',overlayCss:{},containerId:'simplemodal-container',containerCss:{},dataCss:{},zIndex:1000,close:true,closeHTML:'<a class="modalCloseImg" title="Close"></a>',closeClass:'simplemodal-close',position:null,persist:false,onOpen:null,onShow:null,onClose:null};$.modal.impl={opts:null,dialog:{},init:function(data,options){if(this.dialog.data){return false;}ieQuirks=$.browser.msie&&!$.boxModel;this.opts=$.extend({},$.modal.defaults,options);this.zIndex=this.opts.zIndex;this.occb=false;if(typeof data=='object'){data=data instanceof jQuery?data:$(data);if(data.parent().parent().size()>0){this.dialog.parentNode=data.parent();if(!this.opts.persist){this.dialog.orig=data.clone(true);}}}else if(typeof data=='string'||typeof data=='number'){data=$('<div/>').html(data);}else{alert('SimpleModal Error: Unsupported data type: '+typeof data);return false;}this.dialog.data=data.addClass('simplemodal-data').css(this.opts.dataCss);data=null;this.create();this.open();if($.isFunction(this.opts.onShow)){this.opts.onShow.apply(this,[this.dialog]);}return this;},create:function(){w=this.getDimensions();if(ie6){this.dialog.iframe=$('<iframe src="javascript:false;"/>').css($.extend(this.opts.iframeCss,{display:'none',opacity:0,position:'fixed',height:w[0],width:w[1],zIndex:this.opts.zIndex,top:0,left:0})).appendTo('body');}this.dialog.overlay=$('<div/>').attr('id',this.opts.overlayId).addClass('simplemodal-overlay').css($.extend(this.opts.overlayCss,{display:'none',opacity:this.opts.opacity/100,height:w[0],width:w[1],position:'fixed',left:0,top:0,zIndex:this.opts.zIndex+1})).appendTo('body');this.dialog.container=$('<div/>').attr('id',this.opts.containerId).addClass('simplemodal-container').css($.extend(this.opts.containerCss,{display:'none',position:'fixed',zIndex:this.opts.zIndex+2})).append(this.opts.close?$(this.opts.closeHTML).addClass(this.opts.closeClass):'').appendTo('body');this.setPosition();if(ie6||ieQuirks){this.fixIE();}this.dialog.container.append(this.dialog.data.hide());},bindEvents:function(){var self=this;$('.'+this.opts.closeClass).bind('click.simplemodal',function(e){e.preventDefault();self.close();});$(window).bind('resize.simplemodal',function(){w=self.getDimensions();self.setPosition();if(ie6||ieQuirks){self.fixIE();}else{self.dialog.iframe&&self.dialog.iframe.css({height:w[0],width:w[1]});self.dialog.overlay.css({height:w[0],width:w[1]});}});},unbindEvents:function(){$('.'+this.opts.closeClass).unbind('click.simplemodal');$(window).unbind('resize.simplemodal');},fixIE:function(){var p=this.opts.position;$.each([this.dialog.iframe||null,this.dialog.overlay,this.dialog.container],function(i,el){if(el){var bch='document.body.clientHeight',bcw='document.body.clientWidth',bsh='document.body.scrollHeight',bsl='document.body.scrollLeft',bst='document.body.scrollTop',bsw='document.body.scrollWidth',ch='document.documentElement.clientHeight',cw='document.documentElement.clientWidth',sl='document.documentElement.scrollLeft',st='document.documentElement.scrollTop',s=el[0].style;s.position='absolute';if(i<2){s.removeExpression('height');s.removeExpression('width');s.setExpression('height',''+bsh+' > '+bch+' ? '+bsh+' : '+bch+' + "px"');s.setExpression('width',''+bsw+' > '+bcw+' ? '+bsw+' : '+bcw+' + "px"');}else{var te,le;if(p&&p.constructor==Array){var top=p[0]?typeof p[0]=='number'?p[0].toString():p[0].replace(/px/,''):el.css('top').replace(/px/,'');te=top.indexOf('%')==-1?top+' + (t = '+st+' ? '+st+' : '+bst+') + "px"':parseInt(top.replace(/%/,''))+' * (('+ch+' || '+bch+') / 100) + (t = '+st+' ? '+st+' : '+bst+') + "px"';if(p[1]){var left=typeof p[1]=='number'?p[1].toString():p[1].replace(/px/,'');le=left.indexOf('%')==-1?left+' + (t = '+sl+' ? '+sl+' : '+bsl+') + "px"':parseInt(left.replace(/%/,''))+' * (('+cw+' || '+bcw+') / 100) + (t = '+sl+' ? '+sl+' : '+bsl+') + "px"';}}else{te='('+ch+' || '+bch+') / 2 - (this.offsetHeight / 2) + (t = '+st+' ? '+st+' : '+bst+') + "px"';le='('+cw+' || '+bcw+') / 2 - (this.offsetWidth / 2) + (t = '+sl+' ? '+sl+' : '+bsl+') + "px"';}s.removeExpression('top');s.removeExpression('left');s.setExpression('top',te);s.setExpression('left',le);}}});},getDimensions:function(){var el=$(window);var h=$.browser.opera&&$.browser.version>'9.5'&&$.fn.jquery<='1.2.6'?document.documentElement['clientHeight']:el.height();return[h,el.width()];},setPosition:function(){var top,left,hCenter=(w[0]/2)-((this.dialog.container.height()||this.dialog.data.height())/2),vCenter=(w[1]/2)-((this.dialog.container.width()||this.dialog.data.width())/2);if(this.opts.position&&this.opts.position.constructor==Array){top=this.opts.position[0]||hCenter;left=this.opts.position[1]||vCenter;}else{top=hCenter;left=vCenter;}this.dialog.container.css({left:left,top:top});},open:function(){this.dialog.iframe&&this.dialog.iframe.show();if($.isFunction(this.opts.onOpen)){this.opts.onOpen.apply(this,[this.dialog]);}else{this.dialog.overlay.show();this.dialog.container.show();this.dialog.data.show();}this.bindEvents();},close:function(){if(!this.dialog.data){return false;}if($.isFunction(this.opts.onClose)&&!this.occb){this.occb=true;this.opts.onClose.apply(this,[this.dialog]);}else{if(this.dialog.parentNode){if(this.opts.persist){this.dialog.data.hide().appendTo(this.dialog.parentNode);}else{this.dialog.data.remove();this.dialog.orig.appendTo(this.dialog.parentNode);}}else{this.dialog.data.remove();}this.dialog.container.remove();this.dialog.overlay.remove();this.dialog.iframe&&this.dialog.iframe.remove();this.dialog={};}this.unbindEvents();}};})(jQuery);

jQuery.fn.extend({
  slideRightShow: function() {
    return this.each(function() {
        $(this).show('slide', {direction: 'right'}, 1000);
    });
  },
  slideLeftHide: function() {
    return this.each(function() {
      $(this).hide('slide', {direction: 'left'}, 1000);
    });
  },
  slideRightHide: function() {
    return this.each(function() {
      $(this).hide('slide', {direction: 'right'}, 1000);
    });
  },
  slideLeftShow: function() {
    return this.each(function() {
      $(this).show('slide', {direction: 'left'}, 1000);
    });
  }
});
