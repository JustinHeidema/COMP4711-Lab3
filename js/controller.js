const num_words = 10;

var Controller = function(model, view) {
    this.model = model;
    this.view = view;

    this.setup_handlers();
    this.enable();
    this.set_word();
}

Controller.prototype = {

    // Setup Handlers
    setup_handlers: function() {
        this.guess_letter_handler = this.guess_letter.bind(this);
        this.replay_handler = this.replay.bind(this);
    },

    // Add Listeners
    enable: function() {
        this.view.guess_letter_event.add_listener(this.guess_letter_handler);
        this.view.replay_event.add_listener(this.replay_handler);
        return this;
    },

    // Sets the word to be guessed in the game
    set_word: function() {
        let word_index = Math.floor((Math.random() * num_words));
        this.model.set_word(word_index);
    },
    replay: function() {
        this.set_word();
        this.model.replay();
    },

    modify_word_display: function(letter) {
        let current_word = this.model.get_current_word();
        let letter_indexes = []
        for (let i = 0; i < current_word.length; i++) {
            if (letter == current_word.charAt(i)) {
                console.log("pushing: " + i);
                letter_indexes.push(i);
            }
        }
        console.log(letter_indexes);
        this.model.modify_word_display(letter, letter_indexes); 
    },

    // Determines if the current words contains the guessed letter
    letter_in_word: function(letter) {
        let current_word = this.model.get_current_word();
        if (current_word.includes(letter)) {
            return true;
        } else {
            return false;
        }
    },

    // Updates the model with the guessed letter
    guess_letter: function(sender, args) {
        let letter_in_word = this.letter_in_word(args.letter);
        let current_score = this.model.get_score();
        if (letter_in_word) {
            this.modify_word_display(args.letter);
        } 
        let new_score = current_score - 1;
        this.model.set_score(new_score);
        this.model.guess_letter(args.letter, letter_in_word);
        
        let game_over = this.game_over();
        let win_condition_met = game_over[1];
        if (game_over[0]) {
            this.model.set_game_over(win_condition_met);
        }
    },

    // Determines if the game is over
    game_over: function() {
        console.log("game_over");
        let win_condition_met = this.check_word_display_for_win();
        let score = this.model.get_score();
        let game_over = (score === 0);

        if (win_condition_met) {
            game_over = true;
        }

        return [game_over, win_condition_met];
    },

    // Checks if all letters have been guessed for the word
    check_word_display_for_win: function() {
        let current_word_display = this.model.get_current_word_display();

        let win_condition_met = false;
        if (!current_word_display.includes("_")) {
            win_condition_met = true;
        }

        return win_condition_met;
    }
}

