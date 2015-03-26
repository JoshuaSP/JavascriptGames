(function(){
  if (typeof S === 'undefined'){
    window.S = {};
  }

  var View = S.View = function(board, $el){
    var self = this;
    self.board = board;
    self.snake = board.snake;
    self.$el = $el;
    self.populateBoard();
    self.drawElements(self.snake.segments, "snake");
    self.drawElements(self.board.apples, "apple");
    self.bindKeys();
    var game = setInterval(function(){
      var move = self.snake.move.bind(self.snake)();
      if (move.tail) {
        self.removeElement(move.tail);
      }
      self.drawElements([move.head], "snake");
      var addedApple = self.board.happenThings();
      if (addedApple) {
        self.drawElements([addedApple], "apple");
      }
      if (self.board.gameover) {
        alert("OH NOES!");
        clearInterval(game);
      }
    }, 45);
  };

  View.prototype = {
    populateBoard: function() {
      for (var i = 0; i <= this.board.boardX; i++) {
        var $row = $("<div class='row clearfix'></div>");
        $row.attr("data-row", i);
        for (var j = 0; j <= this.board.boardY; j++) {
          var $cell = $("<div class='cell empty'></div>");
          $cell.attr("data-cell", j);
          $row.append($cell);
        }
        this.$el.append($row);
      }
    },

    drawElements: function(collection, name) {
      collection.forEach(function(el){
        $("[data-row='" + el.y + "'] [data-cell='" + el.x + "']").attr("class", "cell " + name);
      });
    },

    removeElement: function(pos) {
      $("[data-row='" + pos.y + "'] [data-cell='" + pos.x + "']").attr("class", "cell empty");
    },

    bindKeys: function(){
      var self = this;
      $(document).keydown(function(e) {
        self.snake.changeDir(["W", "N", "E", "S"][[37, 38, 39, 40].indexOf(e.which)]);
        e.preventDefault(); // prevent the default action (scroll / move caret)
      });
    }
  };

})();
