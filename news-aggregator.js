console.log('Loading news feed aggregator');

var http = require('http');
var https = require('https');

var audioURLRegex = new RegExp(/enclosure url="(.*?)"/);
var pubTimeRegex = new RegExp(/<pubDate>(.*?)<\/pubDate>/);

var rssParseFunction = function (rawText) {
    return {
        url: audioURLRegex.exec(rawText)[1],
        pubDate: pubTimeRegex.exec(rawText)[1]
    }
};

var nprApiParseFunction = function (apiResponse) {
    var result = JSON.parse(apiResponse).list.story[0];
    return {
        url: result.audio[0].format.mp3[0].$text,
        pubDate: result.storyDate.$text
    }
};

var nprKey = 'MDIxMDY2MTYzMDE0NDY0MDQ5NzY4YWJlNg000';
var podcastInfos = [{
    type: 'pri',
    url: 'http://www.pri.org/programs/3704/episodes/feed',
    parseFunction: rssParseFunction,
    protocol: http
}, {
    type: 'bbc-global',
    url: 'http://www.bbc.co.uk/programmes/p02nq0gn/episodes/downloads.rss',
    parseFunction: rssParseFunction,
    protocol: http
}, {
    type: 'npr',
    url: 'https://api.npr.org/query?id=500005&profileTypeId=15&meta=inherit&apiKey=' + nprKey + '&output=JSON&numResults=1&fields=storyDate,audio',
    parseFunction: nprApiParseFunction,
    protocol: https
}];
    
exports.handler = function (event, context) {
    console.log(context);
    console.log(event);
    var response = {};
    
    for (var i in podcastInfos) {
        getAudioURL(podcastInfos[i]);
    }
    
    function getAudioURL(info) {
        info.protocol.get(info.url, function (res) {
        }).on('error', function (e) {
            console.log('Got error: ' + e.message);
            context.done(null, 'ERROR');
        }).on('response', function (response) {
            var dataStr = '';
            response.on('data', function (chunk) {
                if (chunk !== null && chunk !== "") {
                    dataStr += chunk;
                }
            });
            response.on('end', function () {
                addAudioUrlToResponse(info.type, info.parseFunction(dataStr));
            });
        });
    }

    function addAudioUrlToResponse (type, audioURL) {
        response[type] = audioURL;
        if (Object.keys(response).length === podcastInfos.length) {
            context.done(null, response);
        }
    }
};
