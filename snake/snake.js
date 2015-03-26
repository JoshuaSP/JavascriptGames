(function(){
  if (typeof S === 'undefined'){
    window.S = {};
  }

  var Coord = S.Coord = function(pos){
    this.x = pos[0];
    this.y = pos[1];
  };

  Coord.prototype = {
    add: function(b) {
      return new Coord([this.x + b.x, this.y + b.y]);
    },
    eq: function(b){
      return this.x === b.x && this.y === b.y;
    }
  };


  var STARTSIZE = 6;
  var BOARDX = 50;
  var BOARDY = 50;
  var START = new Coord([25,25]);
  var DIRS = ["N", "E", "S", "W"];
  var MOVES = [[0,-1], [1,0], [0, 1], [-1,0]].map(function(move) {
    return new Coord(move);
  });
  var NUMAPPLES = 3;
  var NUTRITION = 3;

  var Board = S.Board = function(){
    this.apples = [];
    this.snake = new Snake();
    this.boardX = BOARDX;
    this.boardY = BOARDY;
    for (var i = 0; i < NUMAPPLES; i++) {
      this.apples.push(this.getRandomCoord());
    }
  };

  Board.prototype = {
    getRandomCoord: function(){
      var newPos;
      do {
        newPos = new Coord([Math.floor(Math.random() * BOARDX), Math.floor(Math.random() * BOARDY)]);
      } while (this.intersects(this.apples, newPos) || this.intersects(this.snake.segments, newPos));
      return newPos;
    },

    intersects: function(collection, pos) {
      return collection.filter(function(el) {
        return el.eq(pos);
      }).length > 0;
    },

    render: function() {
      var grid = this.grid = new Grid();
      this.apples.forEach(function(apple) {
        grid.set(apple, "A");
      });
      this.snake.segments.forEach(function(segment) {
        grid.set(segment, "S");
      });
      return grid;
    },

    happenThings: function() {
      var self = this;
      var snakeHead = self.snake.segments[0]
      self.snake.segments.slice(1).forEach(function(segment) {
        if (snakeHead.eq(segment)) {
          self.gameover = true;
        }
      });
      if (snakeHead.x < 0 || snakeHead.x > BOARDX || snakeHead.y < 0 || snakeHead.y > BOARDY){
        self.gameover = true;
      }

      var apples = self.apples;
      var addedApple = null;
      apples.forEach(function(apple) {
        if (snakeHead.eq(apple)) {
          apples.splice(apples.indexOf(apple), 1);
          self.snake.growing = NUTRITION;
          self.addApples();
          addedApple = apples[2];
        }
      });
      return addedApple;
    },

    addApples: function(){
      this.apples.push(this.getRandomCoord());
    }
  };

  var Grid = S.Grid = function(){
    this.g = new Array(BOARDX);
    for (var i = 0; i < this.g.length; i++){
      this.g[i] = new Array(BOARDY);
    }
  };

  Grid.prototype = {
    set: function(pos, value) {
      this.g[pos.x][pos.y] = value;
    }
  }


  var Snake = S.Snake = function(){
    this.dir = "N";
    this.segments = [];
    for (var i = 0; i < STARTSIZE; i++){
      this.segments.push(START.add(new Coord([0, i])));
    }
    this.growing = 0;
  };


  Snake.prototype = {
    move: function() {
      var move = {};
      var self = this;
      if (self.growing > 0) {
        self.growing -= 1;
      } else {
        move.tail = self.segments.pop();
      }
      move.head = self.segments[0].add(MOVES[ DIRS.indexOf(self.dir) ]);
      self.segments.unshift(move.head);
      return move;
    },

    changeDir: function(newDir){
      //
      if(Math.abs(DIRS.indexOf(newDir) - DIRS.indexOf(this.dir)) === 2) {
        return;
      } else {
        this.dir = newDir;
      }
    }
  };




})();
