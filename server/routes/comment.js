var Comment = require('../models/comment.js');

var comments = {

  getAll: function(req, res) {
    Comment.find({}, function(err, results) {
      if (err)
        res.send(err);
      res.json(results);
    });
  },

  create: function(req, res) {
    var comment = new Comment();

    comment.content = req.body.content;
    comment.text = req.body.text;
    comment.selection = req.body.selection;
    comment.restore = req.body.restore;
    comment.save(function(err, results) {
      if (err)
        res.send(err);
      res.json(comment);
    });
  },

  update: function(req, res) {
    Comment.findByIdAndUpdate({ _id: req.params.id }, {
      content: req.body.content,
    }, function(err, result) {
      if (err)
        res.send(err);
      res.json(result);
      });
  },

  delete: function(req, res) {
    Comment.findByIdAndRemove({ _id: req.params.id }, function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment has been removed' });
   });
  }
};

module.exports = comments;
