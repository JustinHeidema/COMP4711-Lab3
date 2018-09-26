const lexicographic_offset = 97;

var View = function(model) {
    this.model = model;
    this.guess_letter_event = new Event(this);
    this.replay_event = new Event(this);

    this.alphabet_element = document.getElementById("alphabet");
    this.guesses_remaining_element = document.getElementById("guesses_remaining");
    this.alphabet_button_elements = document.getElementById("alphabet").getElementsByTagName("BUTTON");
    this.score_element = document.getElementById("score");
    this.replay_button_element = document.getElementById("replay_button_div");
    this.letter_placeholders_element = document.getElementById("letter_placeholders");
    this.definition_element = document.getElementById("definition");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    // Setup Handlers
    setup_handlers: function() {
        this.guess_letter_handler = this.guess_letter.bind(this);
        this.determine_btn_color_handler = this.determine_btn_color.bind(this);
        this.game_over_handler = this.game_over.bind(this);
        this.modify_score_handler = this.modify_score.bind(this);
        this.modify_guesses_handler = this.modify_guesses.bind(this);
        this.replay_button_handler = this.replay_button.bind(this);
        this.replay_handler = this.replay.bind(this);
        this.generate_letter_spaces_handler = this.generate_letter_spaces.bind(this);
        this.generate_definition_handler = this.generate_definition.bind(this);
    },

    // Add listeners
    enable: function() {
        this.model.guess_letter_event.add_listener(this.guess_letter_handler);
        this.model.game_over_event.add_listener(this.game_over_handler);
        this.model.guesses_remaining_event.add_listener(this.modify_guesses_handler);
        this.model.guesses_remaining_event.add_listener(this.modify_score_handler);
        this.model.replay_event.add_listener(this.replay_handler);
        this.model.set_word_display_event.add_listener(this.generate_letter_spaces_handler);
        this.model.set_word_display_event.add_listener(this.generate_definition_handler);
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

    // Modifies the score on the view
    modify_score: function() {
        this.score_element.textContent = "Score: " + this.model.get_score();
    },

    // Modifies the guesses on the view
    modify_guesses: function() {
        this.guesses_remaining_element.textContent = "Guesses Remaining: " + this.model.get_guesses_remaining();
    },

    // Initial render of the page
    render: function() {
        let alphabet = this.model.get_alphabet();

        for (let i = 0; i < alphabet.length; i++) {
            let btn = document.createElement("button");
            let current_letter = alphabet[i]['letter'];

            let text = document.createTextNode(current_letter);

            let attr_class = document.createAttribute("class");
            attr_class.value = this.determine_btn_color(current_letter);

            btn.setAttributeNode(attr_class);
            btn.setAttribute("id", current_letter);
            btn.appendChild(text);
            btn.onclick = this.return_btn_onclick_handler(current_letter);

            this.guesses_remaining_element.textContent = "Guesses Remaining: " + this.model.get_guesses_remaining();
            this.score_element.textContent = "Score: " + this.model.get_score();
            this.alphabet_element.appendChild(btn);
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

    // Disables all buttons, and displays replay button and victory message
    game_over: function(args) {
        for (let i = 0; i < this.alphabet_button_elements.length; i++) {
            this.alphabet_button_elements[i].setAttribute('onclick', '');
        }

        let btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-success");
        btn.setAttribute("id", "replay_button");

        btn.onclick = this.replay_button_handler;

        this.replay_button_element.appendChild(btn);
        btn.textContent = "Play Again";
        this.guesses_remaining_element.textContent = args.victory_message;
    },

    // Notifies controller to reset the model state
    replay_button: function() {
        this.replay_event.notify();
    },

    replay: function() {
        this.replay_button_element.textContent = '';

        for (let i = 0; i < this.alphabet_button_elements.length; i++) {
            let current_letter = String.fromCharCode(i + lexicographic_offset);
            let btn_color = this.determine_btn_color(current_letter);
            this.alphabet_button_elements[i].onclick = this.return_btn_onclick_handler(current_letter);
            this.alphabet_button_elements[i].setAttribute('class', btn_color);
        }
    },

    generate_letter_spaces: function() {
        let current_word_display = this.model.get_current_word_display();
        
        this.letter_placeholders_element.textContent = '';

        for (let i = 0; i < current_word_display.length; i++) {
            this.letter_placeholders_element.textContent += current_word_display[i] + " ";
        }   
    },

    generate_definition: function() {
        this.definition_element.textContent = this.model.get_current_definition();
    },
}
