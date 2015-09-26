function Game() {
    this.players = [];
    this.active_player_index = null;
    this.turn = null;
    this.start = function() {
        // start the game with a random player    
        this.active_player_index = Math.floor(Math.random()*this.players.length);
        this.turn = new Turn(this.activePlayer());
    }.bind(this)
    this.activePlayer = function() {
        return this.players[this.active_player_index];
    }.bind(this);
}
function Turn(player) {
    this.rolls_remaining = 3;
    this.dice = [];
    while(this.dice.length < player.city_count) {
        this.dice.push(new Dice());
    }    
    this.roll = function() {
        if(this.rolls_remaining < 1) return;
        for(index in this.dice) {
            if(!this.dice[index].held && this.dice[index].shown_side != 'skull')
                this.dice[index].roll();
        }
        this.rolls_remaining--;
    }.bind(this)
}
function Dice() {
    this.shown_side = null;
    this.held = false;
    this.sides = ['3_food','good','skull','food_or_men','3_men','coin'];
    this.roll = function() {
        this.shown_side = this.sides[Math.floor(Math.random()*this.sides.length)];        
    }
    this.toggleHold = function() {
        this.held = !this.held;
    }
};
function Player(name) {
    this.name = name;
    this.city_count = 3;
    this.food_count = 3;
    this.disaster_count = 0;
    this.monuments = [];
    this.developments = [];
};
