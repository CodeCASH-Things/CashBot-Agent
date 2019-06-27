// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


import { request, GraphQLClient } from 'graphql-request';




var apiAccessToken = process.env.ACCESS_TOKEN;
var username="";
console.log("Access Token:"+apiAccessToken);


async function login(req) {
        let data = "query{user {activeServerSeed { seedHash seed nonce} activeClientSeed{seed} id balances{available{currency amount}} statistic {game bets wins losses amount profit currency}}}";
        let ret = await doRequest('', 'POST', data);
        return true;
    }



  async function bet(req) {

  		console.log("PayIn:"+req.body.PayIn);
  		console.log("High:"+req.body.High);
  		console.log("Currency:"+req.body.Currency);
  		console.log("Chance:"+req.body.Chance);



        let amount = req.body.PayIn/100000000;
        let condition = req.body.High == "true"?'above':'below';
        let currency = req.body.Currency.toLowerCase();
        let target = 0;
        if(req.body.High == "true"){
            target = 9999-Math.floor((req.body.Chance*100));
        } else {
            target = Math.floor((req.body.Chance*100));
        }
        target = parseFloat(target/100).toFixed(2);
        let data = " mutation{primediceRoll(amount:"+amount+",target:"+target+",condition:"+ condition +",currency:"+currency+ ") { id nonce currency amount payout state { ... on CasinoGamePrimedice { result target condition } } createdAt serverSeed{seedHash seed nonce} clientSeed{seed} user{balances{available{amount currency}} statistic{game bets wins losses amount profit currency}}}}";
     
        let ret = await doRequest('', 'POST', data);       
        return ret;
    }

   async function doRequest(route, method, body, accessToken){
     	const api_url = 'https://api.primedice.com/graphql';

        let endpoint =`${api_url}`;
        let apiAccessToken = process.env.ACCESS_TOKEN;


        let graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                'x-access-token': accessToken,
            },
        })

        console.log("Headers");
        console.log(graphQLClient.headers);


        try {

        	console.log(body);


            let res = await graphQLClient.request(body);
            return res;
        } catch(err) {
            console.log(err);
        }
    }













// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router




// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

//Currency=eth&PayIn=1&High=false&Chance=49.50&CurrencyValue=3&HouseEdge=0.01


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/bet', function(req, res) {

	req.body.Currency='eth';
	req.body.PayIn=1;
	req.body.High=false;
	req.body.Chance=49.50;
	req.body.CurrencyValue=3;
	req.body.HouseEdge=0.01;
	res.json(bet(req));
});



router.get('/login', function(req, res) {

	req.body.Currency='eth';
	req.body.PayIn=1;
	req.body.High=false;
	req.body.Chance=49.50;
	req.body.CurrencyValue=3;
	req.body.HouseEdge=0.01;
	res.json(login(req));
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);