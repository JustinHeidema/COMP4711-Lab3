const lexicographic_offset = 97;

var View = function(model) {
    this.model = model;
    this.endpoint = "https://obbzuk8g48.execute-api.us-west-2.amazonaws.com/dev/api"

    this.guess_letter_event = new Event(this);
    this.replay_event = new Event(this);
    this.save_score_event = new Event(this);
    this.generate_leaderboard_event = new Event(this);
    this.update_leaderboard_event = new Event(this);

    this.alphabet_element = document.getElementById("alphabet");
    this.guesses_remaining_element = document.getElementById("guesses_remaining");
    this.alphabet_button_elements = document.getElementById("alphabet").getElementsByTagName("BUTTON");
    this.score_element = document.getElementById("score");
    this.replay_button_element = document.getElementById("replay_button");
    this.letter_placeholders_element = document.getElementById("letter_placeholders");
    this.definition_element = document.getElementById("definition");
    this.logout_button = document.getElementById("logout_button");
    this.modal_element = document.getElementById("modal");
    this.victory_message_element = document.getElementById("victory_message");
    this.save_score_button_element = document.getElementById("save_score_button");
    this.leaderboard_list_element = document.getElementById("leaderboard_list");

    this.canvas_element = document.getElementById("canvas");
    this.canvas_element.width = 300;
    this.canvas_element.height = 300;

    this.canvas_context = this.canvas_element.getContext('2d');
    this.canvas_context.translate(0.5, 0.5);

    this.canvasWidthCenter = this.canvas_element.width / 2;
    this.canvasHeightCenter = this.canvas_element.height / 2;

    this.headCenterX = this.canvasWidthCenter + 40;
    this.headCenterY = this.canvasHeightCenter - 40;
    this.headRadius = 28;

    this.leftEyeCenterX = this.headCenterX - 11;
    this.rightEyeCenterX = this.headCenterX + 11;
    this.bothEyeCenterY = this.headCenterY - 7;
    this.eyeRadius = 2;

    this.gallows_1 = {
        start_x: this.headCenterX,
        start_y: this.headCenterY - 20,
        end_x: this.headCenterX,
        end_y: this.headCenterY - 70
    }

    this.gallows_2 = {
        start_x: this.gallows_1.end_x,
        start_y: this.gallows_1.end_y,
        end_x: this.gallows_1.end_x - 120,
        end_y: this.gallows_1.end_y
    }

    this.gallows_3 = {
        start_x: this.gallows_2.end_x,
        start_y: this.gallows_2.end_y,
        end_x: this.gallows_2.end_x,
        end_y: this.gallows_2.end_y  + 250
    }

    this.hman_body = {
        start_x: this.headCenterX,
        start_y: this.headCenterY + this.headRadius,
        end_x: this.headCenterX,
        end_y: this.headCenterY + 100
    }

    this.hman_arm_right = {
        start_x: this.hman_body.start_x,
        start_y: this.hman_body.start_y + 25,
        end_x: this.hman_body.start_x + 40,
        end_y: this.hman_body.start_y + 15
    }

    this.hman_arm_left = {
        start_x: this.hman_body.start_x,
        start_y: this.hman_body.start_y + 25,
        end_x: this.hman_body.start_x - 40,
        end_y: this.hman_body.start_y + 15
    }

    this.hman_leg_right = {
        start_x: this.hman_body.end_x,
        start_y: this.hman_body.end_y,
        end_x: this.hman_body.end_x + 25,
        end_y: this.hman_body.end_y + 40
    }

    this.hman_leg_left = {
        start_x: this.hman_body.end_x,
        start_y: this.hman_body.end_y,
        end_x: this.hman_body.end_x - 25,
        end_y: this.hman_body.end_y + 40
    }

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
        this.save_score_handler = this.save_score.bind(this);
        this.generate_leader_board_handler = this.generate_leader_board.bind(this);
        this.save_score_update_handler = this.save_score_update.bind(this);
        this.add_body_part_handler = this.add_body_part.bind(this);
        this.generate_leaderboard_update_handler = this.generate_leaderboard_update.bind(this);
    },

    // Add listeners
    enable: function() {
        this.model.guess_letter_event.add_listener(this.guess_letter_handler);
        this.model.game_over_event.add_listener(this.game_over_handler);
        this.model.guesses_remaining_event.add_listener(this.modify_guesses_handler);
        this.model.guesses_remaining_event.add_listener(this.add_body_part_handler);
        this.model.guesses_remaining_event.add_listener(this.modify_score_handler);
        this.model.replay_event.add_listener(this.replay_handler);
        this.model.set_word_display_event.add_listener(this.generate_letter_spaces_handler);
        this.model.set_word_display_event.add_listener(this.generate_definition_handler);
        this.model.modify_word_display_event.add_listener(this.generate_letter_spaces_handler);
        this.model.save_score_event.add_listener(this.save_score_update_handler);
        this.model.generate_leaderboard_event.add_listener(this.generate_leaderboard_update_handler);
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
        this.score_element.textContent = score_message + this.model.get_score();
    },

    // Modifies the guesses on the view
    modify_guesses: function() {
        this.guesses_remaining_element.textContent = guesses_remaining_message + this.model.get_guesses_remaining();
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

            this.guesses_remaining_element.textContent = guesses_remaining_message + this.model.get_guesses_remaining();
            this.score_element.textContent = score_message + this.model.get_score();
            this.alphabet_element.appendChild(btn);
        }

        this.logout_button.onclick = this.badgebook_logout;
        this.replay_button_element.onclick = this.replay_button_handler;
        this.save_score_button_element.onclick = this.save_score_handler;
        this.generate_leader_board();
        this.draw_gallows();
    },

    // Updates leaderboard array in model
    generate_leader_board: function() {
        this.generate_leaderboard_event.notify();
    },

    // Updates leaderboard visually
    generate_leaderboard_update: function() {
        this.leaderboard_list_element.innerHTML = '';
        for (let i = 0; i < this.model.leaderboard_list.length; i++) {
            this.leaderboard_list_element.innerHTML += `<li class=\"list-group-item\">${this.model.leaderboard_list[i]['userId']}:\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${this.model.leaderboard_list[i]['score']}</li>`;
        }
    },

    // Helper function to draw lines
    draw_line: function(canvas_context, start_x, start_y, end_x, end_y) {
        canvas_context.beginPath();
        canvas_context.moveTo(start_x, start_y);
        canvas_context.lineTo(end_x, end_y);
        canvas_context.stroke();
    },

    draw_gallows: function() {
        this.canvas_context.lineWidth = 4;
        // Gallows 1
        this.draw_line(this.canvas_context, 
            this.gallows_1.start_x, 
            this.gallows_1.start_y, 
            this.gallows_1.end_x, 
            this.gallows_1.end_y);

        // Gallows 2
        this.draw_line(this.canvas_context, 
            this.gallows_2.start_x, 
            this.gallows_2.start_y, 
            this.gallows_2.end_x, 
            this.gallows_2.end_y);

        // Gallows 3
        this.draw_line(this.canvas_context, 
            this.gallows_3.start_x, 
            this.gallows_3.start_y, 
            this.gallows_3.end_x, 
            this.gallows_3.end_y);
    },

    // Adds a body part to the hangman
    add_body_part: function(sender, args) {
        this.canvas_context.lineWidth = 2;
        switch(args.guesses_remaining) {
            case 6:
                // Head
                this.canvas_context.beginPath();
                this.canvas_context.arc(this.headCenterX,this.headCenterY, this.headRadius, 0, 2 * Math.PI);
                this.canvas_context.fillStyle = 'black';
                this.canvas_context.stroke();
                this.canvas_context.fillStyle = 'white';
                this.canvas_context.fill();
                this.canvas_context.closePath();
                break;

            case 5:
                // Eyes
                this.canvas_context.beginPath();
                this.canvas_context.arc(this.leftEyeCenterX,this.bothEyeCenterY, this.eyeRadius, 0, 2 * Math.PI);
                this.canvas_context.arc(this.rightEyeCenterX,this.bothEyeCenterY, this.eyeRadius, 0, 2 * Math.PI);
                this.canvas_context.fillStyle = 'black';
                this.canvas_context.fill();
                // Mouth
                this.canvas_context.beginPath();
                this.canvas_context.moveTo(this.headCenterX - 12, this.headCenterY + 12);
                this.canvas_context.lineTo(this.headCenterX + 12, this.headCenterY + 12);
                this.canvas_context.stroke();
                break;

            case 4:
                // Body
                this.draw_line(this.canvas_context, 
                    this.hman_body.start_x, 
                    this.hman_body.start_y, 
                    this.hman_body.end_x, 
                    this.hman_body.end_y);
                break;

            case 3:
                 // Right Arm
                this.draw_line(this.canvas_context, 
                    this.hman_arm_right.start_x, 
                    this.hman_arm_right.start_y, 
                    this.hman_arm_right.end_x, 
                    this.hman_arm_right.end_y);
                break;
            
            case 2:
                // Left Arm
                this.draw_line(this.canvas_context, 
                    this.hman_arm_left.start_x, 
                    this.hman_arm_left.start_y, 
                    this.hman_arm_left.end_x, 
                    this.hman_arm_left.end_y);
                break;

            case 1:
                // Right Leg
                this.draw_line(this.canvas_context, 
                    this.hman_leg_right.start_x, 
                    this.hman_leg_right.start_y, 
                    this.hman_leg_right.end_x, 
                    this.hman_leg_right.end_y);
                break;

            case 0:
                // Left Leg
                this.draw_line(this.canvas_context, 
                    this.hman_leg_left.start_x, 
                    this.hman_leg_left.start_y, 
                    this.hman_leg_left.end_x, 
                    this.hman_leg_left.end_y);
                break;
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
        this.display_victory_message(args.victory_message);
    },

    // Notifies controller to reset the model state
    replay_button: function() {
        this.replay_event.notify();
        modal.style.display = "none";
    },

    // Saves the score
    save_score: function() {
        this.save_score_event.notify();
    },

    // Updates button to indicate score was saved
    save_score_update: function() {
        this.modify_save_score_button('', "btn btn-info", score_saved_button_message);
        this.update_leaderboard_event.notify();
    },

    // Re renders UI for another game
    replay: function() {
        for (let i = 0; i < this.alphabet_button_elements.length; i++) {
            let current_letter = String.fromCharCode(i + lexicographic_offset);
            let btn_color = this.determine_btn_color(current_letter);
            this.alphabet_button_elements[i].onclick = this.return_btn_onclick_handler(current_letter);
            this.alphabet_button_elements[i].setAttribute('class', btn_color);
        }
        this.modify_save_score_button(this.save_score_handler, "btn btn-success", save_score_button_message);
        this.canvas_context.clearRect(0, 0, canvas.width, canvas.height);
        this.generate_leaderboard_update();
        this.draw_gallows();
    },

    //  Helper function to modify display of save score button
    modify_save_score_button: function(handle, className, message) {
        this.save_score_button_element.onclick = handle;
        this.save_score_button_element.className = className
        this.save_score_button_element.innerHTML = message
    },

    // Generates letter spaces
    generate_letter_spaces: function() {
        let current_word_display = this.model.get_current_word_display();
        
        this.letter_placeholders_element.textContent = '';

        for (let i = 0; i < current_word_display.length; i++) {
            this.letter_placeholders_element.textContent += current_word_display[i] + " ";
        }   
    },

    // Adds definition to the UI
    generate_definition: function() {
        this.definition_element.textContent = this.model.get_current_definition();
    },

    // Adds signout functionality
    signout_button: function() {
        let poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
    
        let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        userPool.getCurrentUser().signOut();
        window.location.href= "index.html";
    },

    // Display win or loss message at end of game
    display_victory_message: function (victory_message) {
        modal.style.display = "block";
        this.victory_message_element.textContent = victory_message;
    },     
    
    badgebook_logout: function() {
        console.log("LOGOUT CLICKED")
        badgeBookTokenHandler.clearAccessToken();
    }
}
