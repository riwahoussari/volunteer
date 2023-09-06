import Header from "../components/Header";
import CardsContainer from "../components/CardsContainer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {useUser} from '../hooks/useUser';
export default function FavoritesPage(){
    const navigate = useNavigate();
    const userInfo = useUser();

    const [postsFetch, setpostsFetch] = useState({data: null, isPending: false, error: null})
    useEffect(()=>{
        if(userInfo.user && userInfo.user.likes.length > 0){
            setpostsFetch({data: null, isPending: true, error: null})
            fetch(`http://localhost:2500/user/likes`, {
                method: "GET",
                credentials: 'include'
            })
            .then(res=>{
                    if(!res.ok){
                        throw Error('could not fetch data for that resource')
                    }
                    return res.json()
                })
                .then(data => {
                    setpostsFetch({data: data.posts, isPending: false, error: null})
                })
                .catch(err => {
                    setpostsFetch({data: null, isPending: false, error: err.message})
                })
        }
    }, [userInfo])

    return (
        <>
        {userInfo.isPending ? <h1>Pending...</h1> : 
            (!userInfo.auth ? 
                navigate('../login', {replace: true}) : 
                <>
                    <Header icons={{left: ['back'], right: []}} text={'My favorites'}/>

                    {postsFetch.data && postsFetch.data.length ? 
                        <CardsContainer Posts={postsFetch.data} auth={userInfo} />:
                        <p>No liked posts</p>
                    }
                </>
            )
        }
        </>
    )
}