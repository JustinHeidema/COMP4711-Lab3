var Model = function() {
    this.guess_letter_event = new Event(this);
    this.set_word_event = new Event(this);
    this.game_over_event = new Event(this);
    this.set_score_event = new Event(this);
    this.replay_event = new Event(this);
    this.set_word_display_event = new Event(this);
    this.modify_word_display_event = new Event(this);
    this.guesses_remaining_event = new Event(this);
    this.generate_leader_board_event = new Event(this);
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
    this.leader_board = this.generate_leader_board();
    
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
            this.set_victory_message("VICTORY");
        } else {
            this.set_victory_message("DEFEAT");
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

    generate_leader_board: function() {
        let xhttp = new XMLHttpRequest();
        let generate_leader_board_event = this.generate_leader_board_event;
        xhttp.open("GET", this.endpoint,  true);
        xhttp.setRequestHeader("Authorization", "eyJraWQiOiJFY2Z0TzdqbGdDVjJFQklUZUVLR0ZpV2p5VzF4dlplN25vZUdnOGloSFdrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZDUwYTM0YS0yZTg1LTQ5M2ItYmRjOS1iNzExYTRhNWNjNTIiLCJhdWQiOiI0b2U0OW12bTJwZTcyZXVsODlzMzQyZGZnZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImRhMzBhMjhkLWRiMTAtMTFlOC04OGU3LTQ5ODFmNDdiYzdjYSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQwNzcyNjA2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9OYjFkMWJ0SngiLCJjb2duaXRvOnVzZXJuYW1lIjoianJoZWlkZW1hQGdtYWlsLmNvbSIsImV4cCI6MTU0MDc4MDA2NiwiaWF0IjoxNTQwNzc2NDY2LCJlbWFpbCI6ImpyaGVpZGVtYUBnbWFpbC5jb20ifQ.N5DmjLJq34xpp4AU9xVpKy0ErVItbpGNRUNhtX9SvXXwclboJPxuwAng-O8hQ8qcNPbGP5R59l5moH3nKHg7Nu6aD71KIVifkoOKC0w1ylTmt3KwD9YO7mMqvlWtBIkl-YAqX3b3BE7Wh0QeSqsagyuph7AF73UXCl13Dojwg9La-71EvQNHixciDDTIiAZ8EcDS_DE73FHqvGE-V_HRfwqXmbxj9vQKOseOWRvxHBfnSZWgOKcsv2rE1mrnYrMc_jx6VAFeEcTXBIrw6to6T-lLe1w8L_J57Ltqi0ywM4HlcuGtJV_lJMRwSKSZiK7LcR4CN3asakCiRaKwdbCcww");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let leader_board = JSON.parse(this.responseText);
                console.log("generate_leader_board");
                console.log(leader_board);

                return leader_board;
            }
        };
    },

    save_score: function() {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", this.endpoint,  true);
        xhttp.setRequestHeader("Authorization", "eyJraWQiOiJFY2Z0TzdqbGdDVjJFQklUZUVLR0ZpV2p5VzF4dlplN25vZUdnOGloSFdrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZDUwYTM0YS0yZTg1LTQ5M2ItYmRjOS1iNzExYTRhNWNjNTIiLCJhdWQiOiI0b2U0OW12bTJwZTcyZXVsODlzMzQyZGZnZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImRhMzBhMjhkLWRiMTAtMTFlOC04OGU3LTQ5ODFmNDdiYzdjYSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTQwNzcyNjA2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9OYjFkMWJ0SngiLCJjb2duaXRvOnVzZXJuYW1lIjoianJoZWlkZW1hQGdtYWlsLmNvbSIsImV4cCI6MTU0MDc4MDA2NiwiaWF0IjoxNTQwNzc2NDY2LCJlbWFpbCI6ImpyaGVpZGVtYUBnbWFpbC5jb20ifQ.N5DmjLJq34xpp4AU9xVpKy0ErVItbpGNRUNhtX9SvXXwclboJPxuwAng-O8hQ8qcNPbGP5R59l5moH3nKHg7Nu6aD71KIVifkoOKC0w1ylTmt3KwD9YO7mMqvlWtBIkl-YAqX3b3BE7Wh0QeSqsagyuph7AF73UXCl13Dojwg9La-71EvQNHixciDDTIiAZ8EcDS_DE73FHqvGE-V_HRfwqXmbxj9vQKOseOWRvxHBfnSZWgOKcsv2rE1mrnYrMc_jx6VAFeEcTXBIrw6to6T-lLe1w8L_J57Ltqi0ywM4HlcuGtJV_lJMRwSKSZiK7LcR4CN3asakCiRaKwdbCcww");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({"score": this.score}));
        xhttp.onreadystatechange = function () {
            console.log(this.responseText);
            this.generate_leader_board();
        };
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