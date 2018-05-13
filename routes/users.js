let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'demo';
const ObjectId = require('mongodb').ObjectID;

router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'json-token', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                console.log(decoded);
                req.user = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        // return res.status(403).send({
        //     success: false,
        //     message: 'No token provided.'
        // });
        next();
    }
});


/* GET users listing. */
router.post('/', function(req, res, next) {
    if(!req.user) { return res.send("Your don't login"); }
    MongoClient.connect(url, (err, client) => {
       if(err) { return res.send({err: "Mongo error"}); }
       let db = client.db(dbName);
       let userCollection = db.collection('user');
       userCollection.find({})
           .toArray()
           .then(result => {
           res.render('users', {data: result, myUser: req.user});
       })
           .catch(err => {
               res.send({err: err});
           });
    });
});


module.exports = router;
