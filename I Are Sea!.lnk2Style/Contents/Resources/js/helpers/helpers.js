//
//  helpers.js
//  Linkinus 2.0 Style Engine
//
//  Created by Nicholas Penree on 4/21/09.
//  Copyright 2009 Conceited Software. All rights reserved.
//

function expandOldVariables(string, details){
    return string.replace(/\$raw/g, linkify(details[EXTRA_DATA_KEY])).replace(/\$username@\$hostname/g, details[USERHOST_KEY]).replace(/\$nickname/g, details[NICKNAME_KEY]).replace(/\$time/g, details[TIMESTAMP_KEY]).replace(/\$description/g, linkify(details[DESCRIPTION_KEY])).replace(/\$date/g, details[EXTRA_DATA_KEY]).replace(/\$recipient/g, details[EXTRA_DATA_KEY]);
}

function expandVariables(string, details){
    return expandOldVariables(string, details).replace(/\$highlighted/g, TF[details[HIGHLIGHTED_KEY]]).replace(/\$starred/g, TF[details[STARRED_KEY]]).replace(/\$id/g, details[POST_ID_KEY]);
}