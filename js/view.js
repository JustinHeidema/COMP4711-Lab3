const lexicographic_offset = 97;

var View = function(model) {
    this.model = model;
    this.guess_letter_event = new Event(this);
    this.replay_event = new Event(this);

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    // Setup Handlers
    setup_handlers: function() {
        this.guess_letter_handler = this.guess_letter.bind(this);
        this.determine_btn_color_handler = this.determine_btn_color.bind(this);
        this.set_word_handler = this.set_word.bind(this);
        this.game_over_handler = this.game_over.bind(this);
        this.decrement_score_handler = this.decrement_score.bind(this);
        this.replay_button_handler = this.replay_button.bind(this);
        this.replay_handler = this.replay.bind(this);
        this.generate_letter_spaces_handler = this.generate_letter_spaces.bind(this);
        console.log(this.replay_handler);
    },

    // Add listeners
    enable: function() {
        this.model.guess_letter_event.add_listener(this.guess_letter_handler);
        this.model.set_word_event.add_listener(this.set_word_handler);
        this.model.game_over_event.add_listener(this.game_over_handler);
        this.model.set_score_event.add_listener(this.decrement_score_handler);
        this.model.replay_event.add_listener(this.replay_handler);
        this.model.set_word_display_event.add_listener(this.generate_letter_spaces_handler);
        this.model.modify_word_display_event.add_listener(this.generate_letter_spaces_handler);
    },

    // Determines which color of button should be displayed
    determine_btn_color: function(letter) {
        let btn_class = '';
        if (!this.letter_guessed(letter)) {
            btn_class = 'btn btn-info';
        } else if (this.letter_correct(letter)) {
            btn_class = 'btn btn-success';
        } else {
            btn_class = 'btn btn-danger';
        }
        return btn_class;
    },

    // Determines if the letter has been guessed
    letter_guessed: function(letter) {
        let alphabet = this.model.get_alphabet();
        let letter_index = letter.charCodeAt(0) - lexicographic_offset;
        let letter_selected = alphabet[letter_index]['selected'];

        return letter_selected;
    },

    // Determines if the letter was a correct letter
    letter_correct: function(letter) {
        let alphabet = this.model.get_alphabet();
        let letter_index = letter.charCodeAt(0) - lexicographic_offset;
        let letter_correct = alphabet[letter_index]['correct'];

        return letter_correct;
    },
    decrement_score: function(args) {
        console.log(args.score);
        let guesses_remaining_element = document.getElementById("guesses_remaining");
        guesses_remaining_element.textContent = "Guesses Remaining: " + args.score;
    },

    // Initial render of the page
    render: function() {
        let alphabet_element = document.getElementById('alphabet');
        let alphabet = this.model.get_alphabet();

        for (let i = 0; i < alphabet.length; i++) {
            let btn = document.createElement("button");
            let guesses_remaining_element = document.getElementById("guesses_remaining");

            let attr_class = document.createAttribute("class");
            let current_letter = alphabet[i]['letter'];

            let text = document.createTextNode(current_letter);

            attr_class.value = this.determine_btn_color(current_letter);
            btn.setAttributeNode(attr_class);
            btn.setAttribute("id", current_letter);
            btn.appendChild(text);

            guesses_remaining_element.textContent = "Guesses Remaining: " + this.model.get_score();
            btn.onclick = this.return_btn_onclick_handler(current_letter);
            alphabet_element.appendChild(btn);
        }
    },

    // Updates the page based on the guessed letter
    guess_letter: function(sender, args) {
        let btn = document.getElementById(args.letter);
        let attr_class = document.createAttribute("class");
        attr_class.value = this.determine_btn_color(args.letter);
        btn.setAttribute('onclick', '');

        btn.setAttributeNode(attr_class);
    },

    set_word: function(sender, args) {
        // let num_letters_in_word = args.current_word.length;
        console.log("Hello World");
    },

    // Returns a bounded onclick function for a button
    return_btn_onclick_handler: function(letter) {
        var temp = letter;
        function x() {
            this.guess_letter_event.notify({
                letter: temp
            })
        }

        return x.bind(this);
    },
    game_over: function(args) {
        console.log(args.victory_message);
        let replay_button_element = document.getElementById('replay_button_div');
        let alphabet_buttons = document.getElementById("alphabet").getElementsByTagName("BUTTON");
        
        for (let i = 0; i < alphabet_buttons.length; i++) {
            alphabet_buttons[i].setAttribute('onclick', '');
        }

        let btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-success");
        btn.setAttribute("id", "replay_button");

        btn.onclick = this.replay_button_handler;

        replay_button_element.appendChild(btn);
        btn.textContent = "Play Again";
        console.log("GAME OVER FROM VIEW");
    },

    replay_button: function() {
        this.replay_event.notify();
    },


    replay: function() {
        let alphabet_buttons = document.getElementById("alphabet").getElementsByTagName("BUTTON");
        let replay_button_element = document.getElementById('replay_button_div');


        replay_button_element.textContent = '';

        for (let i = 0; i < alphabet_buttons.length; i++) {
            let current_letter = String.fromCharCode(i + lexicographic_offset);
            console.log(current_letter);
            let btn_color = this.determine_btn_color(current_letter);
            alphabet_buttons[i].onclick = this.return_btn_onclick_handler(current_letter);
            alphabet_buttons[i].setAttribute('class', btn_color);
        }
    },

    generate_letter_spaces: function() {
        let current_word_display = this.model.get_current_word_display();
        let letter_placeholders_element = document.getElementById("letter_placeholders");
        letter_placeholders_element.textContent = '';

        for (let i = 0; i < current_word_display.length; i++) {
            letter_placeholders_element.textContent += current_word_display[i] + " ";
        }   
    }
}
