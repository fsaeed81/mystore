var mongoose	=	require("mongoose");

var commentSchema = new mongoose.Schema({
	title		: 	String,
	description : 	String,
	date		: 	{type: String, default: Date.now},
	customer	: 	{
		id 		: 	{
			type: 	mongoose.Schema.Types.ObjectId,
			ref : 	"Customer"
			},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);