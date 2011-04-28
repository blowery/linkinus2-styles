//
//  embed.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 5/30/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

var embedNum = 0;

function handleEmbeds(link){
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
                    result = embedAudio(link); break;
                default: 
                    result = createLinkFromText(link); break; 
            }
        } else {
            result = createLinkFromText(link);
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
                    result = embedImages(link, contentType); break;
                default: 
                    result = createLinkFromText(link); break; 
            }
        } else {
            result = createLinkFromText(link);
        }
    } else if(link.match(/5min\.com|amazon\.com|flickr\.com|video\.google\.|hulu\.com|imdb\.com|metacafe\.com|qik\.com|slideshare\.com|twicpic\.com|viddler\.com|vimeo\.com|youtube\.com/ig)) {
       result = embedURLs(link, true);
   } else {
       result = createLinkFromText(link);
   }

    /*var linkData = grabLinkData(link);
    var result = link;

   //result = embedURLs(link, true); break;


    if (linkData.status == 200) {
        var contentType = linkData.getResponseHeader('Content-Type');
        
        switch(contentType) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/tiff':
            case 'image/tif':
            case 'image/bmp':
               result = embedImages(link); break;
            case 'audio/mpeg':
            case 'audio/mp3':
            case 'audio/mp4':
            case 'audio/wav':
            case 'audio/aiff':
                result = embedAudio(link); break;
           case 'text/html; charset=utf-8':
           case 'text/html':
           default:
               if(link.toLowerCase().match(/5min\.com|amazon\.com|flickr\.com|video\.google\.|hulu\.com|imdb\.com|metacafe\.com|qik\.com|slideshare|twicpic\.com|viddler\.com|vimeo\.com|youtube\.com/)) {
                   result = embedURLs(link, true);
               } else {
                   result = createLinkFromText(link);
               }
               break;
        }
    }*/
    
    return result;
}

function embedAudio(link) {
	return '<embed wmode="transparent" width="300" height="20" src="swf/singlemp3player.swf?file=' + link + '&autoStart=false&backColor=aaaaaa&showDownload=false&frontColor=ffffff&songVolume=90" type="application/futuresplash" pluginspage="http://www.macromedia.com/go/getflashplayer" /> <a href="' + link + '" style="vertical-align:top">Open in Browser</a>';
}

function embedVideo(data, link) {
    embedNum++;
   	return '<div class="video" id="embed-'+embedNum+'" align="center"><div>' + data.html.replace('application/x-shockwave-flash', 'application/futuresplash') + '</div><a href="'+ link +'" title="'+ link +'"  style="position:relative; left:-9px"><img src="img/imgArrow.png" /></a>  <span onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\');return false;"  style="position:relative; left:-9px"><img src="img/imgCross.png" /></span></div>';
}

function embedImages(link) {
	embedNum++;
   	return '<div class="image" id="embed-'+embedNum+'"><div><img src="'+link+'" class="media" style="max-width:200px;max-height:'+$(window).height()*0.8+'px;" onClick="doQuicklookForImage(\'' + link + '\');" /></div><a href="'+link+'" title="'+link+'"  style="position:relative; left:-9px"><img src="img/imgArrow.png" /></a>  <span onClick="dismissEmbed(\'' + embedNum + '\', \'' + link + '\');return false;"  style="position:relative; left:-9px"><img src="img/imgCross.png" /></span></div>';
}

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


function dismissEmbed(id, link){
   document.getElementById('embed-'+id).outerHTML = createLinkFromText(link);
}

function embedMedia(link) {
    var provider = getOEmbedProvider(link);
    
    if (provider != null) {
    	provider.maxWidth = 500;
    	provider.maxHeight = 400;               
    	
    	return provider.embedCode(link);	
    }
    
    
    return embedPastie(link);
}

function embedURLs(link, shouldEmbed) {
   if (shouldEmbed) {
       return embedMedia(link);
   }
   
   return createLinkFromText(link);
}

function createLinkFromText(link) {
    return (' ' + ('<a href="' + link + '" title="Click to open in a new window or tab">' + link.replace(/^\s+|\s+$/g, '') + '</a>').replace('href="www', 'href="http://www') + ' ');
}

// ###### 

function linkify(text, shouldEmbed){
    text = linkEmails(text);
    var links = parseLinks(text);
    
    if (links !== false) {
        links.forEach(function(i) {
                if (shouldEmbed) {
                    var embeddedText = handleEmbeds(i);
                    
                    if ((embeddedText == i || typeof embeddedText == 'undefined')) { 
                        embeddedText = createLinkFromText(i);
                    
                    } else {
                        var test = typeof handlePostEmbedding;
                        if (test != 'undefined') {
                            handlePostEmbedding();
                        }
                    }
                    
                    text = text.replace(i, embeddedText);                    
                } else {
                    text = text.replace(i, embedURLs(i, shouldEmbed));
                } 
        });
    }
    return text;      
}


function embedPastie(link){   
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
    
        page_request.open('GET', url, false); 
        page_request.send(null);
    
        if (page_request.status == 200) {
        
            var lines = page_request.responseText.split("\n");
            var output = '<table cellspacing="0" cellpadding="0" style="code_table">';
            var count = CLIP_LINE_NUM;
            
            if (lines.length < CLIP_LINE_NUM) count = lines.length;
            
            for (var i = 0; i < count; i++) {
                output = output + '<tr><td class="code_line">' + (i+1) + '</td><td>&nbsp;</td><td class="code_code"><code>' + lines[i].replace('<', '&lt;').replace('>', '&gt;') + '</code></td></tr>';
            }

            output = output + '</table>';
            output = output + '<div class="code_menu">Showing ' + i + ' of ' + lines.length + ' lines | ' + fancySize(page_request.getResponseHeader("Content-Length")) + ' | <a href="' + link + '">Open in Browser</a></div>';
            
            return (output);
        }
    }
    return link;
}

function getOEmbedProvider(url) {
        for (var i = 0; i < providers.length; i++) {
            if (providers[i].matches(url))
                return providers[i];
        }
        return null;
    }

    var providers = [
        new OEmbedProvider("Fivemin", "5min.com"),
        new OEmbedProvider("Amazon", "amazon.com"),
        new OEmbedProvider("Flickr", "flickr", "http://flickr.com/services/oembed", "jsoncallback"),
        new OEmbedProvider("GoogleVideo", "video.google."),
        new OEmbedProvider("Hulu", "hulu.com"),
        new OEmbedProvider("IMDB", "imdb.com"),
        new OEmbedProvider("MetaCafe", "metacafe.com"),
        new OEmbedProvider("Qik", "qik.com"),
        new OEmbedProvider("Revision3", "slideshare"),
        new OEmbedProvider("SlideShare", "5min.com"),
        new OEmbedProvider("TwitPic", "twitpic.com"),
        new OEmbedProvider("Viddler", "viddler.com"),
        new OEmbedProvider("Vimeo", "vimeo.com", "http://vimeo.com/api/oembed.json"),
        new OEmbedProvider("YouTube", "youtube.com")
    ];

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

        this.embedCode = function(externalUrl, embedCallback) {
            var requestUrl = this.getRequestUrl(externalUrl);
            var code;
            var type;
            
            request = new XMLHttpRequest();
            request.open("GET", requestUrl, false);
            request.send(null);
            window.console.log(request);

            if (request.status == '200') {
                var data = eval('(' + request.responseText + ')');
                type = data.type;
                
                switch(type) {
                    case 'video':
                        code = embedVideo(data, externalUrl); break;
                    case 'photo':
                        code = embedImages(data.url); break;
                }
            }
            
            return code;
        }
    }