var vue = new Vue({
  el: '#body',
  data: {
    game: null,
    player_name: null,
  }, 
  ready: function() {
    this.game = new Game();
    this.game.players.push(new Player('Nathan'));
    this.game.players.push(new Player('Bob'));
    this.game.start();
  },
  computed: {
    log_text: function() {
        return this.game.log_items.join("\n");
    }
  },
  methods: {
    newGame: function() {
        this.game = new Game();
    },
    addPlayer: function(e) {
        e.preventDefault();
        this.game.players.push(new Player(this.player_name));
        this.player_name = null;
        return false;
    },
    getCityPopulation: function(city) {
        var squares = [];
        while(squares.length < city.men_required) {
            squares.push('O');
        }
        return squares;
    },
    getGoodIncrements: function(good) {
        var increments = [0];
        var total = good.increment;
        while(increments.length < good.max_count) {
            increments.push(total);
            total += good.increment * (increments.length+1);
        }
        return increments;
    },
    getChoiceDice: function() {
        choice_dice = [];
        for(i in this.game.turn.dice){
            if(this.game.turn.dice[i].shown_side == '2xFoodOr2xMen') {
                choice_dice.push(this.game.turn.dice[i]);
            }
        }
        console.log(choice_dice);
        return choice_dice;
    }
    // roll: function() {
    //     for(index in this.dice) {
    //         if(!this.dice[index].held)
    //             this.dice[index].roll();
    //     }
    // }
  }

})