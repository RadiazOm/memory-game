import backImg from "../img/silhouette_black.png"

function Card({item, flipped, onClick}) {

    return (
            // when flipped is changed, make transition
            <div className={"bg-white rounded-xl m-2 card " + (flipped ? "flip-card-transition" : '')} onClick={() => onClick(item)}>
                {/* when the card is flipped show the card image, otherwise show the back*/}
                <img src={"." + (flipped ? item.img : backImg)} alt="" className="object-contain"/>
            </div>
    )
}

export default Card