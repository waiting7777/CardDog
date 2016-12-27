const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const https = require('https');
const CardPrice = require('../db/db').CardPrice;
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const jsonParser = bodyParser.json();
const options = require('../config/config');

function replyMsgToLineWithImage(replyToken, replyVal, cardname){

    let cardurl = 'https://www.mtgmintcard.com/images/mtg/singles/kld/eng-reg/' + cardname + '.jpg';

    console.log(cardurl);

    let replyObj = {
        replyToken : replyToken,
        messages : [
            {
                type : 'template',
                altText : 'this is a buttons template',
                template : {
                    type : 'buttons',
                    thumbnailImageUrl : cardurl,
                    title : 'Menu',
                    text : 'Please select',
                    actions : [
                        {
                            type : 'postback',
                            label : 'buy',
                            data : 'action=buy&itemid=123'
                        },
                        {
                            type : 'uri',
                            label : 'View detail',
                            uri : cardurl
                        }
                    ]
                }
            },
            {
                type : 'text',
                text : replyVal
            }

        ]
    }

    let replyJson = JSON.stringify(replyObj);

    let request = https.request(options.replyOption, function(response){
        response.setEncoding('utf8');
        response.on('data', function(body){
            console.log(body);
        });
    })
    request.on('error', function(e){
        console.log('Request error: ' + e.message);
    });
    request.end(replyJson);

}

function replyMsgToLine(replyToken, replyVal){

    let replyObj = {
        replyToken : replyToken,
        messages : [
            {
                type : 'text',
                text : replyVal
            }

        ]
    }

    let replyJson = JSON.stringify(replyObj);

    let request = https.request(options.replyOption, function(response){
        response.setEncoding('utf8');
        response.on('data', function(body){
            console.log(body);
        });
    })
    request.on('error', function(e){
        console.log('Request error: ' + e.message);
    });
    request.end(replyJson);

}

router.get('/', function(req, res, next){
    res.send('123');
});

router.post('/message', function(req, res, next){
    let event = req.body.events[0];
    let type = event.type;
    let msgType = event.message.type;
    let msg = event.message.text;
    let replyToken = event.replyToken;

    let replyVal = event.message.text;

    if(type == 'message' && msgType == 'text'){
        if(msg[0] == '@'){
            replyMsgToLine(replyToken, replyVal);
        }
        if(msg[0] == '#' && msg[4] == '#'){

            console.log(replyVal.slice(1, 4).toUpperCase().replace(' ', '-'));
            let CardNum = replyVal.slice(5, 9);
            CardPrice.find({ CardNumber : CardNum }, { _id : 0, __v : 0}).exec()
            .then(function(price){
                console.log(price);
                cardname = price[0]['CardName'].toUpperCase().replace(/ /g, '-');
                if(price.length == 1){
                    replyVal = price[0]['CardName'] + ':\n';
                    replyVal += '$' + price[0]['CardPrice'];
                    replyMsgToLineWithImage(replyToken, replyVal, cardname);
                }
                else{
                    replyVal = 'Sorry not find result';
                    replyMsgToLine(replyToken, replyVal);
                }

            })

        }
    }

    console.log(event);
    res.send('456');
});


module.exports = router;
