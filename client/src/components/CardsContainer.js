import Card from "./Card"
export default function CardsContainer({Posts, auth}){
    return <div className="cards-container">
        {Posts.map(post => {
            return <Card
                key={post._id}
                post={post}
                auth={auth}
            />
        })}
    </div>
}