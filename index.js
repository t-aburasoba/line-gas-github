var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN');

function doPost(e) {
    var event = JSON.parse(e.postData.contents).events[0];
    var replyToken= event.replyToken;

    if (typeof replyToken === 'undefined') {
        return;
    }
    var userId = event.source.userId;
    var nickname = getUserProfile(userId);

    if(event.type == 'message') {
    var userMessage = event.message.text;

    var replyMessage = userMessage;

    sendGitHubIssue(userMessage);

    var url = 'https://api.line.me/v2/bot/message/reply';

    UrlFetchApp.fetch(url, {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'replyToken': replyToken,
            'messages': [{
            'type': 'text',
            'text': replyMessage,
            }],
        }),
        });
        return ContentService.createTextOutput(
        JSON.stringify({'content': 'post ok'})
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

function getUserProfile(userId){
    var url = 'https://api.line.me/v2/bot/profile/' + userId;
    var userProfile = UrlFetchApp.fetch(url,{
    'headers': {
        'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    })
    return JSON.parse(userProfile).displayName;
}

function sendGitHubIssue(userMessage){
    var username = PropertiesService.getScriptProperties().getProperty('USER_NAME');
    var repository = PropertiesService.getScriptProperties().getProperty('REPOSITORY');
    var accesstoken = PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN');
    var gitHubUrl = "https://api.github.com/repos/"+username+"/"+repository+"/issues?access_token="+accesstoken;

    var title = userMessage;
    var issueBody = {title:title};
    var options =
    {
        "method" : "post",
        "payload" : JSON.stringify(issueBody),
        "muteHttpExceptions" : true
    };

    var response = UrlFetchApp.fetch(gitHubUrl, options);
}