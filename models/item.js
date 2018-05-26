var mongoose 	=	require("mongoose");

var itemSchema = new mongoose.Schema({
	name		: 	String,
	image		: 	String,
	description	: 	String, 
	price		: 	Number,
	quatity		: 	{type: Number, default : 0},
	manufacture : 	String,
	date		: 	{type: Date, default: Date.now},
	customer	:   {
		id 		: {
			type: mongoose.Schema.Types.ObjectId,
			ref : "Customer"
		},
		username: String
	},
	comments 	: 	[
	{
		type 	: 	mongoose.Schema.Types.ObjectId,
		ref		: 	"Comment"
	}]
});


module.exports = mongoose.model("Item", itemSchema);