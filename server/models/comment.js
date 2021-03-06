var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	content: String,
  selection: String,
  text: String,
	restore: String,
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
