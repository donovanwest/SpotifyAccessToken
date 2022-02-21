const SpotifyWebAPI = require('spotify-web-api-node');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
console.log("DWEST: SpotifyAccessToken api starting...");
let totalRequests = 0;
let clientId = process.env.CLIENT_ID;
let clientSecret = process.env.CLIENT_SECRET;



app.get('/accessToken', (req, res) => {
    totalRequests++;
    console.log("DWEST: access token request received. Number " + totalRequests);
    const host = req.get('host');
    const origin = req.get('origin');
    const validDomains = ["everythings-connected.com", "www.everythings-connected.com", "donovanwest.github.io", "127.0.0.1"];
    let valid = false;
    if(host && host.search("localhost") != -1 || host.search("127.0.0.1") != -1){
        valid = true;
    }
    validDomains.forEach(domain => {
        if(!valid && origin && origin.search(domain) != -1){
            valid = true;
        }
    });

    if(!valid){
        console.log("Invalid origin: " + origin + ". Host: " + host);
        res.send("Invalid origin. Nice try");
        return;
    }

    const spotifyAPI = new SpotifyWebAPI({
        clientId: clientId,
        clientSecret: clientSecret,
    });

    spotifyAPI.clientCredentialsGrant().then((data, err) => {
        if (err) console.log(err);
        const accessToken = data.body['access_token'];
        res.send(accessToken);
    });
});

const ports = [3000, 8081];
if(process.env.PORT) ports.push(process.env.PORT);
console.log("DWEST: all ports: " + ports);
ports.forEach(port => {
    app.listen(port, () => {
        console.log(`DWEST: Listening on port ${port}`)
    })
});






