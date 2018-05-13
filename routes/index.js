const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'demo';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user-login', function (req, res, next) {
    MongoClient.connect(url, (err, client) => {
        if(err) {
            return res.send({error: "Mongo error"});
        }
        let db = client.db(dbName);
        let userCollection = db.collection('user');
        let query = {"username": req.body.username, "password": req.body.password};
        //let query = {"username": req.params.username, "password": req.params.password};
        userCollection.findOne(query, (err, user) => {
            if(err) { return res.send({err: err}); }
            if(!user) {return res.send({err: err}); }
            let token = jwt.sign(user, 'json-token', {
                expiresIn: 60 * 60
            });
            user.token = token;
            res.send({result: user});
        });
    })
});

module.exports = router;
