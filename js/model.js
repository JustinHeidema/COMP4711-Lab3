var Model = function() {
    this.guess_letter_event = new Event(this);
    this.set_word_event = new Event(this);
    this.game_over_event = new Event(this);
    this.set_score_event = new Event(this);
    this.replay_event = new Event(this);
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
    this.score = 7;
    this.game_over = false;
}


Model.prototype = {

    get_alphabet: function() {
        return this.alphabet;
    },
    get_score: function() {
        return this.score;
    },
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
    set_word: function(index) {
        this.current_word = this.words[index]['word'];
        console.log(this.current_word);
        this.set_word_display(this.current_word);
        this.set_word_event.notify({

        });
    },
    set_word_display: function(current_word) {
        for (let i = 0; i < current_word.length; i++) {
            this.current_word_display += "_ ";
        }
        console.log("set_word_display");
        console.log(this.current_word_display);
    },
    set_game_over: function() {
        this.game_over = true;
        this.game_over_event.notify();
    },
    set_score: function(new_score) {
        console.log(new_score);
        this.score = new_score;
        this.set_score_event.notify({
            score: this.score
        });
    },
    get_score: function() {
        return this.score;
    },
    get_current_word: function() {
        return this.current_word;
    },
    get_current_word_display: function() {
        return this.current_word_display;
    },
    replay: function() {
        this.reset_alphabet();
        this.set_word_display(this.current_word);
        this.set_score(7);
        this.replay_event.notify();
    },
    reset_alphabet: function() {
        this.alphabet.forEach(element => {
            element['selected'] = false;
            element['correct'] = false;
            console.log(element);
        });
    },
}