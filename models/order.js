var mongoose 		=	require("mongoose");


// 	SCHEMA
var orderSchema = new mongoose.Schema({
	status	: 	String,
	date	: 	{type: Number, default: Date.now},
	items	: 	[
	{
		type: 	mongoose.Schema.Types.ObjectId,
		ref : 	"Item"
	}],
	customer: 	{
		id:		{
			type: 	mongoose.Schema.Types.ObjectId,
			ref	: 	"Customer"
				},
		username: String
	}
});


module.exports	=	mongoose.model("Order", orderSchema);