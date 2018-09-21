/*===================
    Model
===================*/
// An array of letters to be used for the board game
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

// An array of word objects.  Each object contains the word and it's definition
var words = [
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

// The current word to be guessed
var current_word = '';

/*===================
    View
===================*/

// Word to be guessed
word_element = document.getElementById('word');
alphabet_element = document.getElementById('alphabet');

word_element.textContent = select_word();

/*===================
    Controller
===================*/

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


