import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material"
import { useEffect, useState } from "react"
export default function LikeButton({post, auth}){
    const [isLiked, setIsLiked] = useState(false);
    useEffect(()=>{
        if(auth.user.likes.includes(post._id)){
            setIsLiked(true);
        }
    }, [])
    function handleClick(){
        fetch('http://localhost:2500/user/likes', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({postId: post._id, add: !isLiked}),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){setIsLiked(!isLiked)}
        })
        .catch((err) => console.log(err))
    }
    return (
        <div 
            className={`like-button ${isLiked && "like-button-liked"}`}
            onClick={()=>handleClick()}>
            {isLiked ? <FavoriteRounded /> : <FavoriteBorderRounded/> }
        </div>
    )
}
export function CardLikeButton({post, auth}){
    const [isLiked, setIsLiked] = useState(false);
    useEffect(()=>{
        if(auth.user.likes.includes(post._id)){
            setIsLiked(true);
        }
    }, [])
    function handleClick(){
        fetch('http://localhost:2500/user/likes', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({postId: post._id, add: !isLiked}),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                setIsLiked(prev => !prev);
                //update likes in session storage
                const storedUser = JSON.parse(sessionStorage.getItem('userInfo')).user;
                let newLikes;
                if(isLiked){//remove post
                    newLikes = storedUser.likes.filter(like => like != post._id)
                }else{//add post
                    newLikes = [...storedUser.likes, post._id]
                }
                sessionStorage.setItem('userInfo', JSON.stringify({auth: true, user: {...storedUser, likes: newLikes}}))
            }
        })
        .catch((err) => console.log(err))
    }
    return (<>

        {isLiked ? 
            <FavoriteRounded onClick={()=>handleClick()} /> :
            <FavoriteBorderRounded onClick={()=>handleClick()}/> 
        }

    </>)
}