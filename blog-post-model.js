let mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
    id : { type : String, required: true },
	title : { type : String },
    author : { type : String },
    content : { type : String},
    publishDate : { type: Date }
});

let Post = mongoose.model( 'Post', postSchema );


let PostList = {
	get : function(){
		return Post.find()
				.then( posts => {
					return posts;
				})
				.catch( error => {
					throw Error( error );
				});
    },
    findWhere : function( author ){
		return Post.find().where( author )
				.then( posts => {
					return posts;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPost ){
		return Post.create( newPost )
				.then( post => {
					return post;
				})
				.catch( error => {
					throw Error(error);
				});
    },
    delete : function( id ){
        return Post.remove( id )
            .then( post => {
                return post;
            })
            .catch( error => {
                throw Error(error);
            });
    },
    update : function( id, post ){
        return Post.update(id, post)
            .then( post => {
                return post;
            })
            .catch( error => {
                return Error(error);
            });
    }
};

module.exports = { PostList };