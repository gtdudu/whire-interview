myApp.factory('commentFactory', function($http) {

  var _commentFactory = {};

  _commentFactory.getComments = function() {
    var url = 'http://localhost:3000/api/comments';
    return $http.get(url);
  };

  _commentFactory.deleteComment = function(id) {
    var url = 'http://localhost:3000/api/comment/' + id;
    return $http.delete(url);
  };

  _commentFactory.createComment = function(comment) {
    var url = 'http://localhost:3000/api/comment/';
    return $http.post(url, {
      content: comment.content,
      text: comment.text,
      selection: comment.selection,
      restore: comment.restore
     });
  };

  _commentFactory.updateComment = function(comment) {
    var url = 'http://localhost:3000/api/comment/' + comment._id;
    return $http.put(url, {
      content: comment.content,
    });
  };

  return _commentFactory;
});
