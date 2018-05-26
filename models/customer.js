var mongoose 				=	require("mongoose"),
	passportLocalMongoose 	= 	require("passport-local-mongoose");


//	SCHEMA
var CustomerSchema = new mongoose.Schema({
	username: 	String,
	password:  	String,
	fName	: 	String,
	lName	: 	String,
	street	: 	String,
	city	: 	String,
	state	: 	String,
	zip		: 	Number,
	phone	: 	String,
	orders	: 	[
	{
		type: 	mongoose.Schema.Types.ObjectId,
		ref	: 	"Order"
	}],
	date	: 	{type: Number, default: Date.now}
});

CustomerSchema.plugin(passportLocalMongoose);

module.exports	=	mongoose.model("Customer", CustomerSchema);