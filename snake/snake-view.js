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
    self.bindKeys();
    setInterval(function(){
      console.log("running");
      var move = self.snake.move();
      self.drawElements(self.board.apples, "apple");
      self.drawElements(self.snake, "snake");
      self.board.happenThings();  // grow the snake if it eats an apple, kill us if we hit ourselves or a wall
    }, 10);
  };

  View.prototype = {
    populateBoard: function() {
      for (var i = 0; i < this.board.boardX; i++) {
        var $row = $("<div class='row clearfix'></div>");
        $row.attr("data-row", i);
        for (var j = 0; j < this.board.boardY; j++) {
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
      })
    },

    bindKeys: function(){
      var self = this;
      $(document).keydown(function(e) {
        self.snake.dir = ["W", "N", "E", "S"][[37, 38, 39, 40].indexOf(e.which)];
        e.preventDefault(); // prevent the default action (scroll / move caret)
      });
    }
  };

})();
