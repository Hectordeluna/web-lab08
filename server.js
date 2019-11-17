let express = require('express');
let morgan = require('morgan');
let mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
let { PostList } = require('./blog-post-model');
const dotenv = require('dotenv');
dotenv.config();
let { DATABASE_URL, PORT } = require('./config');

let app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));

let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    next();
  });

app.get('/blog-posts', (req, res, next) => {
    PostList.get()
    .then( posts => {
        return res.status( 200 ).json( posts );
    })
    .catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        })
    });
});

app.post('/blog-post', jsonParser, (req, res, next) => {
    let author = req.query.author;

    if (!author) {
        return res.status(404).json({
            code: 406,
            message: "Author not passed",
        });
    }

    PostList.findWhere( { author : author } )
    .then( posts => {
        return res.status( 200 ).json( posts );
    })
    .catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        })
    });
});

app.post('/blog-posts', jsonParser, (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    
    const {title, content, author} = req.body;
    if (!title || !content || !author) {
        return res.status(406).json({
            code: 406,
            message: "Not Enough fields",
        });       
    }

    let id = uuidv4();
    let publishDate = new Date();

	let newPost = {
        author,
		title,
		content,
        id,
        publishDate,
	};

    PostList.post(newPost)
    .then( post => {
        return res.status( 201 ).json({
            message : "Post added to the list",
            status : 201,
            student : post
        });
    })
    .catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        });
    });
});

app.delete('/blog-posts/:id', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Delete");
    const idDel = req.params["id"];
    if (idDel == null) {
        return res.status(406).json({
            code: 406,
            message: "Missing id param",
        });  
    }

    PostList.delete({ id : idDel })
    .then( post => {
        return res.status(200).json(post); 
    })
    .catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        });
    });
}); 

app.put('/blog-posts/:idHead', jsonParser, (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const idHead = req.params["idHead"];
    const {id, title, content, author} = req.body;
    console.log(req.body);

    if (id == null || idHead == null) {
        console.log(idHead);
        return res.status(406).json({
            code: 406,
            message: "Missing id param",
        });  
    }
    if (id != idHead) {
        return res.status(406).json({
            code: 409,
            message: "IDs do not match",
        });   
    }

    let post = {};

    if (author) {
        post.author = author;
    }
    if (title) {
        post.title = title;
    }
    if (content) {
        post.content = content;
    }
    

    PostList.update({ id : idHead }, post)
        .then( post => {
            return res.status(200).json(post); 
        })
        .catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            });
        });
}); 

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };