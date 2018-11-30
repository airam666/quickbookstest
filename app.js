
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
