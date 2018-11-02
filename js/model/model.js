var Model = function(authToken) {
    this.token = authToken;
    this.guess_letter_event = new Event(this);
    this.set_word_event = new Event(this);
    this.game_over_event = new Event(this);
    this.set_score_event = new Event(this);
    this.replay_event = new Event(this);
    this.set_word_display_event = new Event(this);
    this.modify_word_display_event = new Event(this);
    this.guesses_remaining_event = new Event(this);
    this.save_score_event = new Event(this);
    this.endpoint = "https://obbzuk8g48.execute-api.us-west-2.amazonaws.com/dev/api"
    this.alphabet = [
        {
            letter: 'a',
            selected: false,
            correct: false
        },
        {
            letter: 'b',
            selected: false,
            correct: false
        },
        {
            letter: 'c',
            selected: false,
            correct: false
        },
        {
            letter: 'd',
            selected: false,
            correct: false
        },
        {
            letter: 'e',
            selected: false,
            correct: false
        },
        {
            letter: 'f',
            selected: false,
            correct: false
        },
        {
            letter: 'g',
            selected: false,
            correct: false
        },
        {
            letter: 'h',
            selected: false,
            correct: false
        },
        {
            letter: 'i',
            selected: false,
            correct: false
        },
        {
            letter: 'j',
            selected: false,
            correct: false
        },
        {
            letter: 'k',
            selected: false,
            correct: false
        },
        {
            letter: 'l',
            selected: false,
            correct: false
        },
        {
            letter: 'm',
            selected: false,
            correct: false
        },
        {
            letter: 'n',
            selected: false,
            correct: false
        },
        {
            letter: 'o',
            selected: false,
            correct: false
        },
        {
            letter: 'p',
            selected: false,
            correct: false
        },
        {
            letter: 'q',
            selected: false,
            correct: false
        },
        {
            letter: 'r',
            selected: false,
            correct: false
        },
        {
            letter: 's',
            selected: false,
            correct: false
        },
        {
            letter: 't',
            selected: false,
            correct: false
        },
        {
            letter: 'u',
            selected: false,
            correct: false
        },
        {
            letter: 'v',
            selected: false,
            correct: false
        },
        {
            letter: 'w',
            selected: false,
            correct: false
        },
        {
            letter: 'x',
            selected: false,
            correct: false
        },
        {
            letter: 'y',
            selected: false,
            correct: false
        },
        {
            letter: 'z',
            selected: false,
            correct: false
        },
    ]
    this.words = [
        {
            word: "octopus",
            definition: "An eight legged ocean creature"
        },
        {
            word: "renaissance",
            definition: "The revival of European art and literature under the influence of classical models in the 14th–16th centuries."
        },
        {
            word: "pioneer",
            definition: "A person who is among the first to explore or settle a new country or area"
        },
        {
            word: "placable",
            definition: "Easily calmed; gentle and forgiving"
        },
        {
            word: "posit",
            definition: "Put forward as fact or as a basis for argument."
        },
        {
            word: "qualm",
            definition: "An uneasy feeling of doubt, worry, or fear, especially about one's own conduct; a misgiving"
        },
        {
            word: "chivalrous",
            definition: "courteous and gallant, especially towards women"
        },
        {
            word: "awesome",
            definition: "Extremely impressive or daunting; inspiring awe"
        },
        {
            word: "unabated",
            definition: "Without any reduction in intensity or strength"
        },
        {
            word: "ecstatic",
            definition: "Feeling or expressing overwhelming happiness or joyful excitement"
        }
    ];
    this.current_word = '';
    this.current_word_display = '';
    this.current_word_display_l = []
    this.guesses_remaining = 7;
    this.score = 0;
    this.game_over = false;
    this.victory_message = '';
    this.current_definition = '';
    this.save_score.bind(this);
}


Model.prototype = {

    // Updates the state of the letter that was just guessed
    // with whether it was correct or not
    guess_letter: function(letter, correct) {
        let letter_index = letter.charCodeAt(0) - lexicographic_offset;
        this.alphabet[letter_index]['selected'] = true;
        if (correct === true) {
            this.alphabet[letter_index]['correct'] = true;
        } 
        this.guess_letter_event.notify({
            letter: letter
        });
    },

    // Sets the word to be guessed for the round
    set_word: function(index) {
        this.current_word = this.words[index]['word'];
        this.current_definition = this.words[index]['definition'];

        this.set_word_display(this.current_word);
        this.set_word_event.notify({

        });
    },

    // Resets the word display so it shows that
    // no letters have been chosen
    set_word_display: function(current_word) {
        this.current_word_display_l = [];
        for (let i = 0; i < current_word.length; i++) {
            this.current_word_display_l.push("_");

        }
        this.set_word_display_event.notify();
    },

    // Sets game_over, and notifies view with appropriate
    // victory message
    set_game_over: function(win_condition_met) {
        if (win_condition_met) {
            this.set_victory_message(victory_message);
        } else {
            this.set_victory_message(defeat_message);
        }  
        this.game_over = true;
        this.game_over_event.notify({
            victory_message: this.victory_message
        });
    },

    // Sets guesses_remaining, and notifies the view of update
    set_guesses_remaining: function(guesses_remaining) {
        this.guesses_remaining = guesses_remaining;
        this.guesses_remaining_event.notify({
            guesses_remaining: this.guesses_remaining
        });
    },

    // Sets score, and notifies the view of update
    set_score: function(new_score) {
        this.score = new_score;
        this.set_score_event.notify({
            score: this.score
        });
    },

    save_score: function() {
        save(this.token, this.endpoint, this.score, this.save_score_event);
    },

    // Resets data for a new game, and notifies the view of update
    replay: function() {
        this.reset_alphabet();
        this.set_word_display(this.current_word);
        this.set_guesses_remaining(7);
        this.set_victory_message('');
        this.replay_event.notify();
    },

    // Resets the state for each letter in the alphabet
    reset_alphabet: function() {
        this.alphabet.forEach(element => {
            element['selected'] = false;
            element['correct'] = false;
        });
    },

    // Modifies the appropriate blank spaces in the word
    // display with the letter guessed and notifies the view
    modify_word_display: function(letter, letter_indexes) {
        for (let i = 0; i < letter_indexes.length; i++) {
            let index = letter_indexes[i];
            this.current_word_display_l[letter_indexes[i]] = letter;
        }
        this.modify_word_display_event.notify();
    },
    set_victory_message: function(message) {
        this.victory_message = message;
    },
    get_guesses_remaining: function() {
        return this.guesses_remaining;
    },
    get_alphabet: function() {
        return this.alphabet;
    },
    get_score: function() {
        return this.score;
    },
    get_current_definition: function() {
        return this.current_definition;
    },
    get_score: function() {
        return this.score;
    },
    get_current_word: function() {
        return this.current_word;
    },
    get_current_word_display: function() {
        return this.current_word_display_l;
    },
    get_victory_message: function() {
        return this.victory_message;
    },
    get_leader_board: function() {
        return this.leader_board;
    }
}

function save(auth, url, score, event) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url,  true);
    xhttp.setRequestHeader("Authorization", auth);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({"score": score}));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            event.notify();
        }
    };
}