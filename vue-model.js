var vue = new Vue({
  el: '#body',
  data: {
    game: null,
    player_name: null
  }, 
  ready: function() {
    this.game = new Game();
    this.game.players.push(new Player('Nathan'));
    this.game.players.push(new Player('Bob'));
    this.game.start();
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
    roll: function() {
        for(index in this.dice) {
            if(!this.dice[index].held)
                this.dice[index].roll();
        }
    }
  }

})