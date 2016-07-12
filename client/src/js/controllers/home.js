(function(){
  'use strict';

  angular
    .module('ngclient')
    .controller('homeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', '$route', '$window', 'commentFactory'];

  function HomeCtrl($scope, $route, $window, commentFactory){

    rangy.init();
    var applier = rangy.createClassApplier("selected");
    var rangyBox = $window.document.getElementById('rangy-box');

    // variables
    $scope.store = [];
    $scope.current = {};
    $scope.selection = rangy.getSelection();
    $scope.editing = false;
    $scope.indexEdit = -1;

    //functions
    $scope.init = init;
    $scope.select = select;
    $scope.cancelSelection = cancelSelection;
    $scope.retrieve = retrieve;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.create = create;

    // restore all selections stored in db and applies class="selected [selection._id]"
    function init() {
      commentFactory.getComments().then(function(data) {
        $scope.store = data.data;
        $scope.storeLength = $scope.store.length;
        $scope.store.sort(function(a,b){
          var c = new Date(a.date);
          var d = new Date(b.date);
          return c-d;
        });
        for (var i = 0; i < $scope.store.length; i++) {
          var serialized = $scope.store[i].restore;
          if (rangy.canDeserializeSelection(serialized, rangyBox)) {
            rangy.deserializeSelection(serialized, rangyBox);
            var applierId = rangy.createClassApplier($scope.store[i]._id);
            applier.toggleSelection();
            applierId.toggleSelection();
          }
        }
        $scope.selection.removeAllRanges();
      });
    }

    // when onMouseDown fires in div#rangy-box, retrieves selection if it exits
    function retrieve(e) {
      if (e.target.className.substring(0, 8) === 'selected') {
        var query = e.target.className.substring(9);
        for (var i = 0; i < $scope.store.length; i++) {
          if ($scope.store[i]._id === query) {
            $scope.current = $scope.store[i];
            $scope.indexEdit = i;
            $scope.editing = true;
          }
        }
      }
    }

    // when onMouseUp is fired in div#rangy-box, serializes the selection to be able to restore it later
    // and adds "selected" class to the selection
    function select() {
      if (!$scope.current.selection) {
        $scope.selection.refresh();
        if (!$scope.selection.isCollapsed) {
          var nodes = $scope.selection.getRangeAt(0).getNodes(false, function (el) {
             return el.parentNode && el.parentNode.className !== "";
          });
          if (!nodes.length) {
            $scope.selecting = true;
            $scope.current.restore = rangy.serializeSelection($scope.selection, true, rangyBox);
            applier.toggleSelection();
            $scope.current.selection = rangy.serializeSelection($scope.selection, true, rangyBox);
            $scope.current.text = $scope.selection.toString();
          } else {
            alert("Click on highlighted text to select it or select only non highlighted text to create a new comment");
          }
        }
      }
    }

    // reset current object to empty object and removes "selected" class if necessary
    function cancelSelection() {
      if ($scope.current.selection && !$scope.editing ) {
        if (rangy.canDeserializeSelection($scope.current.selection, rangyBox)) {
          rangy.deserializeSelection($scope.current.selection, rangyBox);
          applier.toggleSelection();
          $scope.selection.removeAllRanges();
          $scope.current = {};
        } else {
          console.log("can't deserialize...");
        }
      } else if ($scope.editing) {
        $scope.editing = false;
        $scope.current = {};
        $scope.indexEdit = -1;
      }
    }

    // updates current selection's comment
    function edit() {
      $scope.store[$scope.indexEdit].content = $scope.current.content;
      commentFactory.updateComment($scope.current).then(function(data) {
          $scope.editing = false;
          $scope.indexEdit = -1;
          $scope.current = {};
      });
    }

    // creates new comment for current selection
    function create() {
      var comment = {};
      if($scope.current.content && $scope.current.selection && !$scope.editing) {
        comment.content = $scope.current.content;
        comment.selection = $scope.current.selection;
        comment.text = $scope.current.text;
        comment.restore = $scope.current.restore;
        commentFactory.createComment(comment).then(function(data) {
          var inserted = data.data;
          if (rangy.canDeserializeSelection(inserted.selection, rangyBox)) {
            rangy.deserializeSelection(inserted.selection, rangyBox);
            var applierId = rangy.createClassApplier(inserted._id);
            applierId.toggleSelection();
          }
          $scope.store.push(inserted);
          $scope.current = {};
          $scope.selection.removeAllRanges();
        });
      }
    }

    // removes current selection's commment
    function remove() {
      commentFactory.deleteComment($scope.current._id);
      var index = $scope.current.index;
      $scope.store.splice(index, 1);
      $route.reload();
    }

  }

})();
