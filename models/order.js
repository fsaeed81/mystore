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
	customers: 	[
	{
		type: 	mongoose.Schema.Types.ObjectId,
		ref	: 	"Customer"
	}]
});


module.exports	=	mongoose.model("Order", orderSchema);