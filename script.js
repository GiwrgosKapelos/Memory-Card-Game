document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const timeDisplay = document.getElementById("time");
  const movesDisplay = document.getElementById("moves");
  const restartButton = document.getElementById("restart");

  let cards = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchedPairs = 0;
  let moves = 0;
  let timer;
  let seconds = 0;

  // Emoji pairs for the cards (8 pairs total)
  const emojis = ["🍎", "🍐", "🍌", "🍉", "🍇", "🍓", "🥝", "🍍"];

  // Initialize the game
  function initGame() {
    // Clear the board
    gameBoard.innerHTML = "";
    matchedPairs = 0;
    moves = 0;
    movesDisplay.textContent = moves;
    seconds = 0;
    timeDisplay.textContent = seconds;

    // Stop any existing timer
    if (timer) {
      clearInterval(timer);
    }

    // Start a new timer
    timer = setInterval(() => {
      seconds++;
      timeDisplay.textContent = seconds;
    }, 1000);

    // Create pairs of cards
    const cardValues = [...emojis, ...emojis];

    // Shuffle the cards
    shuffleArray(cardValues);

    // Create card elements
    cards = cardValues.map((value, index) => createCard(value, index));

    // Add cards to the board
    cards.forEach((card) => gameBoard.appendChild(card));
  }

  // Create a card element
  function createCard(value, index) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.dataset.index = index;

    const front = document.createElement("div");
    front.classList.add("front");
    front.textContent = value;

    const back = document.createElement("div");
    back.classList.add("back");

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", flipCard);
    return card;
  }

  // Flip a card
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      // First card flipped
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    // Second card flipped
    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;

    checkForMatch();
  }

  // Check if the two flipped cards match
  function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      disableCards();
      matchedPairs++;

      // Check if all pairs are matched
      if (matchedPairs === emojis.length) {
        endGame();
      }
    } else {
      unflipCards();
    }
  }

  // Disable matched cards
  function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
  }

  // Unflip non-matching cards
  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      resetBoard();
    }, 1000);
  }

  // Reset board state after each turn
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Shuffle array using Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // End the game when all pairs are matched
  function endGame() {
    clearInterval(timer);
    setTimeout(() => {
      alert(
        `Congratulations! You won in ${seconds} seconds with ${moves} moves!`
      );
    }, 500);
  }

  // Restart the game
  restartButton.addEventListener("click", initGame);

  // Initialize the game on page load
  initGame();
});
