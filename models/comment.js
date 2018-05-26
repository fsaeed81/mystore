var mongoose	=	require("mongoose");

var commentSchema = new mongoose.Schema({
	title		: 	String,
	description : 	String,
	date		: 	{type: String, default: Date.now},
	customer	: 	[
	{
		type 	: 	mongoose.Schema.Types.ObjectId,
		ref		: 	"Customer"
	}] 
});

module.exports = mongoose.model("Comment", commentSchema);