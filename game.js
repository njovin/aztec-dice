function Game() {
    this.players = [];
    this.active_player_index = null;
    this.shown_player_index = null;
    this.turn = null;
    this.log_items = [];
    this.goods = goods;
    this.start = function() {
        this.log('Game Started');
        // start the game with a random player    
        this.active_player_index = Math.floor(Math.random()*this.players.length);
        this.shown_player_index = this.active_player_index;
        this.log(this.activePlayer().name + ' randomly chosen to go first');
        this.turn = new Turn(this.activePlayer(),this.log);
    }.bind(this)
    this.activePlayer = function() {
        return this.players[this.active_player_index];
    }.bind(this);
    this.shownPlayer = function() {
        return this.players[this.shown_player_index];
    }.bind(this);    
    this.log = function(text) {
        this.log_items.unshift(text);
    }.bind(this)
}
function Turn(player,log) {
    this.rolls_remaining = 3;
    this.dice = [];
    this.log = log;
    while(this.dice.length < player.city_count) {
        this.dice.push(new Dice());
    }    
    this.roll = function() {
        if(this.rolls_remaining < 1) return;
        var dice_count = 0;
        for(index in this.dice) {
            if(!this.dice[index].held && this.dice[index].shown_side != 'skull') {
                dice_count++;
                this.dice[index].roll();
            }
        }
        log(player.name + ' rolled ' + dice_count + ' dice');
        this.rolls_remaining--;
        if(this.rolls_remaining == 0) {
            var shown_sides = [];
            this.dice.map(function(die){die.held = true;shown_sides.push(die.shown_side);});
            log(player.name + ' ended up with ' +  shown_sides.join(','));
        }
    }.bind(this)
}
function Dice() {
    this.shown_side = null;
    this.held = false;
    this.sides = ['3xFood','1xGood','1xSkull + 2xGood','2xFoodOr2xMen','3xMen','Coin'];
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
    this.goods = {
        'spear': 0,
        'fabric': 0,
        'ceramic': 0,
        'stone': 0,
        'wood': 0,
    };
};
goods = [
        {
            code: 'spear',
            display_name: 'Spear Head',
            increment: 5,
            max_count: 4
        },
        {
            code: 'fabric',
            display_name: 'Fabric',
            max_count: 5,
            increment: 4
        },
        {
            code: 'ceramic',
            display_name: 'Ceramic',
            max_count: 6,
            increment: 3
        },
        {
            code: 'stone',
            display_name: 'Stone',
            max_count: 7,
            increment: 2
        },
        {
            code: 'wood',
            display_name: 'Wood',
            max_count: 8,
            increment: 1
        },

];
