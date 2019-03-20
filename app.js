
//inicio locura
'use strict';

require('dotenv').config();

/**
 * Require the dependencies
 * @type {*|createApplication}
 */
var express = require('express');
var app = express();
var path = require('path');
var OAuthClient = require('intuit-oauth');
var bodyParser = require('body-parser');

var QuickBooks = require('node-quickbooks');



var oauthToken = 'Q0X8m2VxIRYt9VaWgBrfWLoyoOhHPq4ORdD0EIJp9CZ5JH1AVV';
var oauthTokenSecret= 'bFWq3W8Imdw9tdRn7g5ntpAzPfssqghxYpJOyusV';
var consumerKey    = 'aqerba34524sfasfdfafdadfasdf';
var consumerSecret = '52345adfa4qoxouagfaouasfdsy3422';
var realmId = '193514799384584';
var qbo = new QuickBooks(consumerKey,
                         consumerSecret,
                         oauthToken,
                         oauthTokenSecret,
                         realmId,
                         true, // use the sandbox?
                         true, // enable debugging?
                         12); // set minorversion

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

qbo.reportBalanceSheet({department: '1,4,7'}, function(err, balanceSheet) {
  console.log(balanceSheet)
})

var http       = require('http'),
    port       = process.env.PORT || 3000,
    request    = require('request'),
    qs         = require('querystring'),
    util       = require('util'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session    = require('express-session'),
    express    = require('express'),
    app        = express(),
    QuickBooks = require('../index')



// INSERT YOUR CONSUMER_KEY AND CONSUMER_SECRET HERE

var consumerKey    = '',
    consumerSecret = ''

app.get('/',function(req,res){
  res.redirect('/start');
})

app.get('/start', function(req, res) {
  res.render('intuit.ejs', {port:port, appCenter: QuickBooks.APP_CENTER_BASE})
})

app.get('/requestToken', function(req, res) {
  var postBody = {
    url: QuickBooks.REQUEST_TOKEN_URL,
    oauth: {
      callback:        'http://localhost:' + port + '/callback/',
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret
    }
  }
  request.post(postBody, function (e, r, data) {
    var requestToken = qs.parse(data)
    req.session.oauth_token_secret = requestToken.oauth_token_secret
    console.log(requestToken)
    res.redirect(QuickBooks.APP_CENTER_URL + requestToken.oauth_token)
  })
})

app.get('/callback', function(req, res) {
  var postBody = {
    url: QuickBooks.ACCESS_TOKEN_URL,
    oauth: {
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret,
      token:           req.query.oauth_token,
      token_secret:    req.session.oauth_token_secret,
      verifier:        req.query.oauth_verifier,
      realmId:         req.query.realmId
    }
  }
  request.post(postBody, function (e, r, data) {
    var accessToken = qs.parse(data)
    console.log(accessToken)
    console.log(postBody.oauth.realmId)

    // save the access token somewhere on behalf of the logged in user
    qbo = new QuickBooks(consumerKey,
                         consumerSecret,
                         accessToken.oauth_token,
                         accessToken.oauth_token_secret,
                         postBody.oauth.realmId,
                         true, // use the Sandbox
                         true); // turn debugging on

    // test out account access
    qbo.findAccounts(function(_, accounts) {
      accounts.QueryResponse.Account.forEach(function(account) {
        console.log(account.Name)
      })
    })
  })
  res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.reload(); window.close();</script></body></html>')
})

