var good_order = ['wood','stone','ceramic','fabric','spear'];
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
        this.turn = new Turn(this.activePlayer(),this.log, this.resolveDisasters);
    }.bind(this)
    this.activePlayer = function() {
        return this.players[this.active_player_index];
    }.bind(this);
    this.shownPlayer = function() {
        return this.players[this.shown_player_index];
    }.bind(this);    
    this.resolveDisasters = function(skull_count) {
        console.log('resolving disasters');
        console.log(skull_count);
        switch(skull_count) {
            case 2: 
                this.log(this.players[this.active_player_index].name + ' suffered Drought');
                this.players[this.active_player_index].disaster_count += 2;
                break;
            case 3: 
                this.log(this.players[this.active_player_index].name + ' caused Pestilence');
                for(i in this.players) {
                    if(i != this.active_player_index) {
                        this.players[i].disaster_count += 3;
                    }
                }
                break;
            case 4:
                this.log(this.players[this.active_player_index].name + ' was Invaded');
                this.players[this.active_player_index].disaster_count += 4;
                break;
                break;  
            case 5:
                this.log(this.players[this.active_player_index].name + ' experienced a Revolt');
                for(i in this.players[this.active_player_index].goods) {
                    this.players[this.active_player_index].goods[i] = 0;
                }
                break;              
        }
    }.bind(this)
    this.log = function(text) {
        this.log_items.unshift(text);
    }.bind(this)
}
function Turn(player,log,resolveDisasters) {
    this.rolls_remaining = 3;
    this.phase = 'rolling';
    this.dice = [];
    
    // resources gained this turn
    this.food = 0;
    this.goods = 0;
    this.skulls = 0;
    this.men = 0;
    this.coin = 0;

    this.log = log;
    this.resolveDisasters = resolveDisasters;
    while(this.dice.length < player.cityCount()) {
        this.dice.push(new Dice());
    }    
    this.roll = function() {
        if(this.rolls_remaining < 1) return;
        var dice_count = 0;
        for(index in this.dice) {
            if(!this.dice[index].held && this.dice[index].shown_side != '1xSkull + 2xGood') {
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
            for(i in this.dice) {
                if(this.dice[i].shown_side == '2xFoodOr2xMen') {
                    return;
                }
            }    
            this.finishRoll();        
        }
    }.bind(this)

    this.finishRoll = function() {
        for(i in this.dice) {
            if(this.dice[i].shown_side == '2xFoodOr2xMen' && this.dice[i].choice == null) {
                alert('You must select food or men');
                return;
            }
        }
        for(i in this.dice) {
            switch(this.dice[i].shown_side) {
                case '3xFood':
                    this.food += 3;
                    break;
                case '1xGood':
                    this.goods += 1;
                    break;
                case '1xSkull + 2xGood':
                    this.skulls += 1;
                    this.goods += 2;
                    break;
                case '2xFoodOr2xMen':
                    switch(this.dice[i].choice) {
                        case 'men': 
                            this.men += 2;
                            break;
                        case 'food': 
                            this.food += 2;
                            break;
                    }
                    break;
                case '3xMen':
                    this.men += 3;
                    break;
                case 'Coin':
                    this.coin += 7;
                    break;
            }
        }
        player.addGoods(this.goods);
        player.food_count += this.food;
        this.resolveDisasters(this.skulls);
        this.phase = 'buying';
    }.bind(this);
}
function Dice() {
    this.shown_side = null;
    this.held = false;
    this.sides = ['3xFood','1xGood','1xSkull + 2xGood','2xFoodOr2xMen','3xMen','Coin'];
    this.choice = null;
    this.roll = function() {
        this.shown_side = this.sides[Math.floor(Math.random()*this.sides.length)];        
    }
    this.toggleHold = function() {
        this.held = !this.held;
    }
};
function Player(name) {
    this.name = name;
    this.food_count = 3;
    this.disaster_count = 0;
    this.monuments = [];
    this.developments = [];
    this.cities = [
        {men_required: 0, men_filled: 0},
        {men_required: 0, men_filled: 0},
        {men_required: 0, men_filled: 0},
        {men_required: 3, men_filled: 0},
        {men_required: 4, men_filled: 0},
        {men_required: 5, men_filled: 0},
        {men_required: 6, men_filled: 0},
    ];
    this.goods = {
        'spear': 0,
        'fabric': 0,
        'ceramic': 0,
        'stone': 0,
        'wood': 0,
    };
    this.addGoods = function(good_count) {
        i = 0;
        while(good_count > 0) {
            if(i > 4) i = 0;
            this.goods[good_order[i]]++;
            i++;
            good_count--;
        }
    }.bind(this);
    this.cityCount = function() {
        var city_count = 0;
        for(i in this.cities) {
            if(this.cities[i].men_required == this.cities[i].men_filled) {
                city_count++;
            }
        }
        return city_count;
    }.bind(this)
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
