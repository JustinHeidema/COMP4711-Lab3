// Selects a word at random from eligible words for the game
function select_word() {
    let index = Math.floor(Math.random() * 10);
    current_word = words[index].word;
    return words[index].word;
}

// Returns the letters to be used in the game
function get_alphabet() {
    return alphabet;
}

// Returns the eligible words to be used in the game
function get_words() {
    return words;
}
