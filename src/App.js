import Card from "./components/Card";
import {useEffect, useState} from "react";

// Import all the images dynamically
const images = require.context('./img/memory-pictures', true)
const imageList = images.keys().map(image => images(image));

function App() {

    // useStates
    const [cards, setCards] = useState([]);
    const [firstCard, setFirstCard] = useState();
    const [secondCard, setSecondCard] = useState();
    const [cardsMatched, setCardsMatched] = useState(0);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);
    const [lockClick, setLockClick] = useState(false)

    // on app load, generate the cards
    useEffect(() => {
        generateCards()
    }, []);

    useEffect(() => {
        // if the firstCard has been turned, and the second card has been turned, check if its matched, if matched points added, if not flip the cards.
        if (firstCard && secondCard) {
            setMoves(moves + 1)
            if (firstCard.matchId === secondCard.matchId) {
                firstCard.matched = true
                secondCard.matched = true
                setFirstCard(null)
                setSecondCard(null)
                setCardsMatched(cardsMatched + 1)
            } else {
                // make sure the player cant click any other cards while the two cards are flipped.
                setLockClick(true)
                // little wait before flipping the cards so that the player has time to see whats behind the card.
                setTimeout(() => {
                    setFirstCard(null)
                    setSecondCard(null)
                    setLockClick(false)
                }, 1000)
            }
        }
    }, [firstCard, secondCard]);


    // whenever cardsMatched gets updated, check if its the last card matched and if so, win the game.
    useEffect(() => {
        if (cardsMatched === cards.length / 2 && cards.length !== 0) {
            setWon(true)
        }
    }, [cardsMatched]);

    function generateCards() {
        // reset our useStates
        setMoves(0)
        setFirstCard(null)
        setSecondCard(null)
        setCardsMatched(0)
        setWon(false)

        // choose a size, should be an even number
        const size = 16;
        // all of our images
        let imgList = imageList;
        let idList = [];

        // make an array to randomly put the card sets in our grid. It would look like the following: [0, 0, 1, 1, 2, 2, 3, 3, ...]
        for (let i = 0; i < size; i++) {
            idList.push(Math.floor(i / 2))
        }

        let cardsArray = [];
        for (let i = 0; i < size; i++) {
            // grab a random index from our idList and push it into our cardsArray
            let randomIndex = Math.floor(Math.random() * idList.length)
            cardsArray.push({
                img: imgList[idList[randomIndex]],
                matchId: idList[randomIndex],
                matched: false
            })
            // remove the id from our idList, this way we can assure every card has a counterpart and is solvable
            idList.splice(randomIndex, 1);
        }
        setCards(cardsArray)
    }

    // when we click on a card, check if we aren't clicking the same card and if the firstCard had been set, else it's the firstCard being clicked
    function onCardClick(item) {
        if (lockClick || won) {
            return
        }
        if (firstCard && item !== firstCard) {
            setSecondCard(item)
        } else {
            setFirstCard(item)
        }
    }

    return (
        <div className="h-full p-5">
            <h1 className="text-center text-7xl m-9 text-white">Memory game</h1>
            <h1 className="text-center text-7xl m-9 text-white">zetten: {moves}</h1>
            {won ?
                <div className="flex justify-center">
                    <h1 className="text-7xl m-9 text-white bg-blue-900 p-9 rounded-2xl">Gewonnen!</h1>
                </div> : ""}
            <div className="flex justify-center items-center">
                <div className="flex flex-wrap w-1/2 justify-center">
                    {/* for every card, make a <Card> element and give it its flipped properties */}
                    {cards.map((item) => (
                        <Card item={item} flipped={item === firstCard
                            || item === secondCard
                            || item.matched === true} onClick={onCardClick}/>
                    ))}
                </div>
            </div>
            <div className="flex justify-center m-9">
                <button className="text-7xl text-white bg-blue-300 p-5 rounded-2xl" onClick={generateCards}>Nieuw spel</button>
            </div>
        </div>
    );
}

export default App;
