const lexicographic_offset = 97;

var View = function(model) {
    this.model = model;
    this.guess_letter_event = new Event(this);

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    setup_handlers: function() {
        this.guess_letter_handler = this.guess_letter.bind(this);
        this.determine_btn_color_handler = this.determine_btn_color.bind(this);
    },

    enable: function() {
        this.model.guess_letter_event.add_listener(this.guess_letter_handler);
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

    render: function() {
        alphabet_element = document.getElementById('alphabet');
        let alphabet = this.model.get_alphabet();

        for (let i = 0; i < alphabet.length; i++) {
            let btn = document.createElement("button");
            let attr_class = document.createAttribute("class");
            let current_letter = alphabet[i]['letter'];

            let text = document.createTextNode(current_letter);

            attr_class.value = this.determine_btn_color(current_letter);
            btn.setAttributeNode(attr_class);
            btn.setAttribute("id", current_letter);
            btn.appendChild(text);

            btn.onclick = this.return_btn_onclick_handler(current_letter);
            alphabet_element.appendChild(btn);
        }
    },

    guess_letter: function(sender, args) {
        let btn = document.getElementById(args.letter);
        let attr_class = document.createAttribute("class");
        attr_class.value = this.determine_btn_color(args.letter);

        btn.setAttributeNode(attr_class);
    },

    return_btn_onclick_handler: function(letter) {
        var temp = letter;
        function x() {
            this.guess_letter_event.notify({
                letter: temp
            })
        }

        return x.bind(this);
    }
}
