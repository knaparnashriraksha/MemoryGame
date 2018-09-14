/*
 * Create a list that holds all of your cards
 */
var myCards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 //Timer object to keep track of time
var myTimer = new Timer();
myTimer.addEventListener('secondsUpdated', function (e) {
    $('#myGameTimer').html(myTimer.getTimeValues().toString());
});

//Variables to keep track of number of moves and number of matches
var myGameMoves = 0;
var myCardMatches = 0;

//Variable to check if the game is in progress
var myGameInProgress = false;

//Array to keep track of open cards
myOpenCards = [];

// function to shuffle an array from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Animation Function
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});


//Function to create game cards dynamically
function makeMyCard(card) {
    $('#myCardDeck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

//Function to generate random cards
function myRandomCards() {
    for (var i = 0; i < 2; i++) {
        myCards = shuffle(myCards);
        myCards.forEach(makeMyCard);
    }
}

//Function to leave matching cards open
function openMe() {
    myOpenCards.forEach(function (card) {
        card.off('click');
    });
}

//Function to enable clicking of cards
function clickMe() {
    myOpenCards[0].click(toggleCard);
}

//Function to clear non-matching open cards
function clearMe() {
    myOpenCards = [];
}

//Function to check if game is won
function youMatchedIt() {
    myCardMatches += 1;
    //Show the results to the user if all sets have been matched
    //Since the card deck has 16 cards, we have 8 sets
    if (myCardMatches == 8) {
        congratulateWinner();
    }
}

// Function to check if cards match
function formMyPair() {
    if (myOpenCards[0][0].firstChild.className == myOpenCards[1][0].firstChild.className) {
        // console.log("The cards match"); //to check in console if we are logging 8 statements for each set
        myOpenCards[0].addClass("match").animateCss('pulse');
        myOpenCards[1].addClass("match").animateCss('pulse');
        openMe();
        clearMe();
        setTimeout(youMatchedIt, 500); //decrease the time of animation to make user less irritated because there is a timer
    }
    else {
        myOpenCards[0].toggleClass("show open").animateCss('flipInY');
        myOpenCards[1].toggleClass("show open").animateCss('flipInY');
        clickMe();
        clearMe();
    }
}

// Function to remove stars based on moves used
function removeMyStar() {
    $('#myStars').children()[0].remove();
    $('#myStars').append('<li><i class="fa fa-star-o"></i></li>');
}

// Function to increase the number of moves and update stars
function movesUsed() {
    //increment moves by 1
    myGameMoves += 1;
    //display num of moves in html to user
    $('#myMoves').html(`${myGameMoves} Moves`);
    // Also, remove stars if the user is taking many moves
    // All moves below are one more than the desired number of moves
    if (myGameMoves == 30){
        removeMyStar();
    }
    else if (myGameMoves == 15){
        removeMyStar();
    }
}

/*
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function toggleCard() {
    // Keep track of time once the game starts
    if (myGameInProgress == false) {
        myGameInProgress = true;
        myTimer.start();
    }
    // Check if it is the first card to be opened. If yes, keep it open
    if (myOpenCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        myOpenCards.push($(this));
        openMe();
    }
    //If it is not the first card to be opened, check if it forms a set. If yes, keep both cards open. Otherwise, close both the cards.
    else if (myOpenCards.length === 1) {
        // increment moves
        movesUsed();
        $(this).toggleClass("show open").animateCss('flipInY');
        myOpenCards.push($(this));
        setTimeout(formMyPair, 350); //decrease time that the cards will be open, to make the game more challenging
    }
}

//Function to show number of stars achieved
function starsWithMe(n) {
    for (var i = 0; i < n; i++) {
        $('#myStars').append('<li><i class="fa fa-star"></i></li>');
    }
}

//Function that starts the game
function startMyGame() {
    myRandomCards();
    $('.card').click(toggleCard);
    $('#myMoves').html("Moves: 0"); //Intial moves are 0
    starsWithMe(3); //Initial Stars are 3
}

//Function that resets the game
function resetGame() {
    myGameMoves = 0;
    myCardMatches = 0;
    $('#myCardDeck').empty();
    $('#myStars').empty();
    $('#myGame')[0].style.display = "";
    $('#wonGame')[0].style.display = "none";
    myGameInProgress=false;
    myTimer.stop();
    $('#myGameTimer').html("00:00:00");
    startMyGame();
}

$('#resetMyGame').click(resetGame);

//Function to display results after game ends
function congratulateWinner() {
    $('#wonGame').empty();
    myTimer.pause(); //pause the timer. Don't stop as it will reset the timer.
    var scoreBoard = `
        <p class="success"> Yippie!!! You Matched It To Win It!!! </p>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${myGameMoves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${myTimer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>    
             </div>
             <div class="star">
                <i class="fa ${ (myGameMoves > 29) ? "fa-star-o" : "fa-star"}  fa-3x"></i>    
             </div>
            <div class="star">
                <i class="fa ${ (myGameMoves > 14) ? "fa-star-o" : "fa-star"} fa-3x"></i>    
             </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
            <i class="fa fa-repeat fa-2x"></i>
        </div>
    `;
    $('#myGame')[0].style.display = "none";
    $('#wonGame')[0].style.display = "block";
    $('#wonGame').append($(scoreBoard));
    $('#restart').click(resetGame);
}

// Game begins
startMyGame();