
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
    "X)~"       : "Facial.png",
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