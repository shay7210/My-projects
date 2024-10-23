class Player{
    constructor(balance=100){
        this.balance = balance
        this.cur_bet = 0
    }
    //bet money
    bet(betting_amount){
        this.balance -= betting_amount;
        this.cur_bet = betting_amount;
    }


    double_bet(){
        if (this.balance - this.cur_bet < 0){
            throw Error('cant bet less than 0')
        }
        this.balance -= this.cur_bet;
        this.cur_bet *= 2;
    }

    win(){
        this.balance += this.cur_bet * 2;
    }

    draw(){
        this.balance += this.cur_bet;
    }

    reset_cur_bet(){
      this.cur_bet = 0;
    }




}

class ScoreToken{
    constructor(name) {
        this.user_hand = [];
        this.rank_score = {'ace':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'jack':10,'queen':10,
        'king':10};
        this.score=[0]
        this.name=name
    }

    add_card(card){
        this.user_hand.push(card);
    } // adds a card to the score

    score_calculate(){
        this.score = [0]
        for (let i = 0; i < this.user_hand.length; i++){
            // case when first ace
            if (this.user_hand[i].rank === 'ace' && this.score.length === 1){  // in case of an ace
                this.score[0] += 1
                this.score.push(this.score[0] + 10)
            }
            // case when second or above aces are drawn
            else if (this.user_hand[i].rank === 'ace'){
                this.score[0] += 1;
                this.score[1] += 11;
            }
            // normal case no aces
           else if (this.score.length === 1) { // adds the score in case of one
                this.score[0] += this.rank_score[this.user_hand[i].rank]
            }

            else{                           // in case of ace already being put down
                this.score[0] += this.rank_score[this.user_hand[i].rank]
                this.score[1] += this.rank_score[this.user_hand[i].rank]
            }

            if (this.score.length === 2 && this.score[1] > 21){ // in case of an invalid hand takes away the
                // irelvent score
                this.score.pop()
            }
            // checks for invalid scores
            else if (this.score.length === 2 && this.score[1] === 21){
                this.score[0] = 21;
                this.score.pop();
            }
        }
    }

    get_score(){
        if (this.score.length === 1) {
            return this.score[0]
        }
        else
            return this.score[1]

}
    // reset score
    reset(){
        this.score = [0];
        this.user_hand = [];
    }


    to_String(){
        if (this.score.length === 1){
            return this.get_score();
        }
        else
            return this.score[0] + ' or ' + this.score[1];

        }

}

class Card{
    constructor(rank, suite){
        this.rank = rank;
        this.img_path = 'PNG-cards-1.3/' + rank + '_of_' + suite + '.png'
    }

    get_img_path(){
        return this.img_path;
    }
}

class Pack{
    constructor(){
        this.pack=[]
        let ranks, suites;
        ranks = ['ace','2','3','4','5','6','7','8','9','10','jack','queen','king'];
        suites =['clubs','hearts','spades','diamonds']

        for(let i = 0; i < suites.length; i++){
            for(let j = 0; j < ranks.length; j++){
               let cur_card = new Card(ranks[j],suites[i]);
                this.pack.push(cur_card);
            }
        }
    }

    get_pack(){
        return this.pack;
    }
}

class Deck {
    constructor(amount_of_packs=1) {
        if (amount_of_packs > 5) {
            throw new Error('Amount of deck should be less than 5')
        } else if (amount_of_packs < 0) {
            throw new Error('Amount of deck should be more than 0')
        }

        this.deck = []
        this.cur_card_index = -1;   //used for draw_card func

        for (let i = 0; i < amount_of_packs; i++) {
            let new_pack = new Pack()
            this.deck = this.deck.concat(new_pack.get_pack())
        }
    }

    // shuffle algorithm
    shuffle_deck() {
        // Iterate over the array from the last element to the first
        for (let i = this.deck.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));

            // Swap elements at indices i and j
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        this.cur_card_index = -1;
        }

        //checks if a shuffle is necessery
        check_shuffle(){
        return this.cur_card_index > this.deck.length - 22;
        }

        // draws a card from the pack
        draw_card(){
        {
            if (this.cur_card_index > this.deck.length - 10) {
                throw new Error('Not enough cards, reshuffling is needed');

            }
            this.cur_card_index ++;
            return this.deck[this.cur_card_index];
        }
    }

}

// declare global number of decks to play with
let num_of_decks = 1
//blackjack_home buttons
document.addEventListener('DOMContentLoaded', () => {
    // Select the button using its ID
    const startBtn = document.getElementById('start-btn');
    const numOfDecks = document.getElementById('num-decks');

    // Add an event listener to respond when the button is clicked
    startBtn.addEventListener('click', () => {
        localStorage.setItem('num_of_decks', numOfDecks.value); // Get the number of decks
        window.location.href = 'blackjack_game.html';
    });


    //blackjack_game buttons
});   // transition from home to game

//blackjack_game buttons
document.addEventListener('DOMContentLoaded', () => {
    // updates the display of the balance
    function update_balance_display(player){
        current_balance.textContent = 'balance: ' + player.balance + '$';
    }
    //updates the display of the betting
    function update_betting_display(player , bet_value = ''){
        bet_enter.max = player.balance;
        bet_enter_display.textContent = 'bet amount: ' + player.balance + '$';
        if (bet_value !== ''){current_bet.textContent = 'current bet: ' + bet_value + '$'}
    }

    function update_user_Score(user, user_score){
        user_score.score_calculate()
        if (user === 'p'){
            player_points.textContent = 'Player Score: ' + user_score.to_String();
        }
        else if (user === 'd'){
            dealer_points.textContent = 'Dealer Points : ' + user_score.to_String();
        }
    }

    // back button segment
    const backBtn = document.getElementById('back-btn');
    const confirm_button = document.getElementById('confirm-button');
    const back_to_game_btn = document.getElementById('back-to-game-button');
    const menu_popup = document.getElementById('menu-popup');

    function close_menu_popup() {
        menu_popup.style.display = 'none';
    }
    function open_menu_popup(){
        menu_popup.style.display = 'block';
    }

    // audio functions
    function card_deal_audio() {
       const audio = new Audio('audio/card_deal.mp3');
       audio.play().then(r => console.log('audio played'))
           .catch(e => console.error(e));
    }

    function shuffle_deck_audio(){
        const audio = new Audio('audio/card_shuffle.mp3');
        audio.play().then(r => console.log('audio played'))
            .catch(e => console.error(e));
    }

    function flip_card_audio(){
        const audio = new Audio('audio/card_flip.mp3');
        audio.play().then(r => console.log('audio played'))
            .catch(e => console.error(e));
    }

    // game segment
    //retrive num_of_decks
    num_of_decks = localStorage.getItem('num_of_decks');
    // create the player and deck for the current session
    let player = new Player();
    let deck = new Deck(parseInt(num_of_decks));
    deck.shuffle_deck()

    // balance display and betting display
    const bet_enter = document.getElementById('bet-enter');
    const current_balance = document.getElementById('current-amount');
    const bet_btn = document.getElementById('bet-btn')
    const bet_enter_display = document.getElementById('bet-enter-display');
    const current_bet = document.getElementById('current-bet');
    const dealer_points = document.getElementById('d-title');
    const player_points = document.getElementById('p-title');
    
    // shuffle and reshuffle
    const shuffle_btn = document.getElementById('shuffle-btn')
    const shufflePopup = document.getElementById('shuffle-popup');
    const confirmShuffle = document.getElementById('confirm-shuffle');
    const closeBtn = document.getElementById('close-btn');

    // lost popup
    const lost_popup = document.getElementById('lost-popup');
    const menu_btn = document.getElementById('menu-btn');

    //double-hit-stay buttons
    const double_btn = document.getElementById('double');
    const hit_btn = document.getElementById('hit');
    const stay_btn = document.getElementById('stay');

    double_btn.disabled = true;
    hit_btn.disabled = true;
    stay_btn.disabled = true;



    //updates the balance,betting of the player
    update_balance_display(player);
    update_betting_display(player, '');



    let player_Score , dealer_Score, hidden_card , result;
    let current_player_image_index = 3; // index for adding the images to the display
    let current_dealer_image_index = 3;


    // when you press bet the game begins
    const handleBetClick = async () => {
        bet_btn.disabled = true; // Disable buttons
        shuffle_btn.disabled = true;

        let bet_value = parseInt(bet_enter.value) // receives the betting input
        player.bet(bet_value)

        update_balance_display(player);
        update_betting_display(player, bet_value);
        player_Score = new ScoreToken('player')
        dealer_Score = new ScoreToken('dealer')

        //beginning segment
        // card dealing segment
        dealer_Score.add_card(deck.draw_card())
        player_Score.add_card(deck.draw_card())
        hidden_card = deck.draw_card()
        player_Score.add_card(deck.draw_card())

        // reaching to the pictures in the html file
        let p_image1 = document.getElementById('p-card1');
        let p_image2 = document.getElementById('p-card2');
        let d_image1 = document.getElementById('d-card1');
        let d_image2 = document.getElementById('d-card2');

        // displaying the pictures
        card_deal_audio();
        d_image1.src = dealer_Score.user_hand[0].get_img_path();
        await delay(500);
        card_deal_audio();
        p_image1.src = player_Score.user_hand[0].get_img_path();
        await delay(500);
        card_deal_audio();
        d_image2.src = 'PNG-cards-1.3/upside_downcard.png';
        await delay(500);
        card_deal_audio();
        p_image2.src = player_Score.user_hand[1].get_img_path();

        update_user_Score('p', player_Score);
        update_user_Score('d', dealer_Score);

        double_btn.disabled = false;
        hit_btn.disabled = false;
        stay_btn.disabled = false;
    };

    //player chose double
    function choose_double() {
        try {
            player.double_bet()
        }
        catch (error) {
            console.log(error);
        }
        finally {
            update_balance_display(player);
            update_betting_display(player, player.cur_bet);
        }
        //button disabling
        double_btn.disabled = true;
        hit_btn.disabled = true;
        stay_btn.disabled = true;

        //hit once than stay
        player_Score.add_card(deck.draw_card())
        let p_image3 = document.getElementById('p-card3');
        card_deal_audio();
        p_image3.src = player_Score.user_hand[2].get_img_path()
        update_user_Score('p', player_Score)
        choose_stay().then(r => '')
    }


    function choose_hit(user){
        double_btn.disabled = true; // if you hit you cant double anymore
        let user_Score, img
        //in the case of user being the player
        if (user === 'p'){
            user_Score = player_Score
            img = document.getElementById(user + '-card' + current_player_image_index);
            //for the display of the image in html file
            current_player_image_index += 1; // update for future moves
        }
        //in the case of user being the dealer
        else if (user === 'd'){
            user_Score = dealer_Score
            img = document.getElementById(user + '-card' + current_dealer_image_index);
            current_dealer_image_index += 1;
        }

        //updates the score and the picture on screen
        user_Score.add_card(deck.draw_card())
        update_user_Score(user, user_Score)
        card_deal_audio();
        img.src = user_Score.user_hand[user_Score.user_hand.length-1].get_img_path();


        //player busts
        if (user === 'p' && user_Score.get_score() > 21){
            if (user === 'p'){player_Score = user_Score}
            else if (user === 'd'){dealer_Score = user_Score}
            calc_result(player_Score,dealer_Score);
            reset_game();
        }
    }
    //player chose stay
    async function choose_stay() {
        // btn disabling
        hit_btn.disabled = true;
        double_btn.disabled = true;
        stay_btn.disabled = true;
        await delay(500)
        //hidden card addition and display
        dealer_Score.add_card(hidden_card)
        let d_img2 = document.getElementById('d-card2');
        flip_card_audio();
        d_img2.src = hidden_card.get_img_path();
        dealer_Score.score_calculate();
        await delay(500);
        while (dealer_Score.get_score() < 17) {
            await delay(500)
            choose_hit('d')
        }
        // update dealer score
        update_user_Score('d', dealer_Score);
        await delay(1000)
        // finishes the game
        calc_result(player_Score,dealer_Score);
        reset_game();

    }

    // sets delay between hits
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // calculates the result of the game
    function calc_result(player_Score, dealer_Score) {
        let cur_bet = player.cur_bet
        if (player_Score.get_score() > 21){
            result = 'you bust \n -' + cur_bet + '$';
        }

        else if (dealer_Score.get_score() > 21 || player_Score.get_score() > dealer_Score.get_score()){
            result = 'you win \n +' + cur_bet + '$';
            player.win();
        }

        else if (dealer_Score.get_score() > player_Score.get_score()){
            result = 'you lost \n -' + cur_bet + '$';
        }

        else {
            result = 'draw'
            player.draw();
        }
        player.reset_cur_bet()

    }

    function reset_game(){
        // button reset
        double_btn.disabled = true;
        hit_btn.disabled = true;
        stay_btn.disabled = true;
        bet_btn.disabled = false;
        shuffle_btn.disabled = false;
        // open result pop up
        open_result_popup(result)

    }

    function img_reset(){
        //image reset
        let img
        //player
        for (let i=1; i < current_player_image_index; i++) {
            img = document.getElementById('p-card' + i);
            img.src = '';
        }
        //dealer
        for (let j=1;j < current_dealer_image_index; j++){
            img = document.getElementById('d-card' + j);
            img.src = '';
        }

    }

    function open_result_popup(result){
        // set the result
        const pop_window = document.getElementById('resultText');
        pop_window.textContent = result;
        if (result[4] === 'b' || result[4] === 'l') {
            pop_window.style.color = '#FF0000'
        }
        else if (result[4] === 'w') {
            pop_window.style.color = '#39FF14'
        }
        else {
            pop_window.style.color = '#fdfffd'
        }

        // display pop up
        const result_popup = document.getElementById('resultModal');
        result_popup.style.display = 'block';
    }

    function close_result_popup(){
        document.getElementById('resultModal').style.display = 'none';
        //reset score : make it after result shown
        player_Score.reset();
        dealer_Score.reset();
        update_user_Score('p', player_Score)
        update_user_Score('d', dealer_Score)
        update_balance_display(player);
        update_betting_display(player)
        img_reset();
        if (deck.check_shuffle()){
            shufflePopup.style.display = 'block';
            closeBtn.disabled = true;
        }
        if (player.balance === 0){
            lost_popup.style.display = 'block';
        }
    }

    // result pop up listener
    document.getElementById('continueBtn').addEventListener('click', close_result_popup);

    //bet click listener
    bet_btn.addEventListener('click', handleBetClick);

    // bet input listener
    bet_enter.addEventListener('input', () => {
        bet_enter_display.textContent = 'bet amount: ' + bet_enter.value + '$'; // Update the displayed value
    });
    // double, hit, stay listeners
    double_btn.addEventListener('click',choose_double)
    hit_btn.addEventListener('click', () => choose_hit('p'))
    stay_btn.addEventListener('click', choose_stay)


    //back button
    backBtn.addEventListener('click', () => {
        open_menu_popup()
    });

    confirm_button.addEventListener('click', () => {
        window.location.href = 'blackjack_home.html';
    })
    back_to_game_btn.addEventListener('click', () => {
        close_menu_popup()
    });


    //shuffle button
    shuffle_btn.addEventListener('click', () =>{
        shufflePopup.style.display = 'block';
        closeBtn.disabled = false;
    });

    // confirms the shuffle
    confirmShuffle.addEventListener('click', () =>{
        deck.shuffle_deck();
        shufflePopup.style.display = 'none';
        shuffle_deck_audio();
    })

    // Close the popup when the user clicks on <span> (x)
    closeBtn.addEventListener('click', () => {
        shufflePopup.style.display = 'none';
    });

    menu_btn.addEventListener('click', () =>{
        window.location.href = 'blackjack_home.html';
    })

});









