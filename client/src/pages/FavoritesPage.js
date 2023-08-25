import Header from "../components/Header";
import CardsContainer from "../components/CardsContainer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function FavoritesPage(){
    const navigate = useNavigate();
    const [postsFetch, setpostsFetch] = useState({data: null, isPending: false, error: null})
    useEffect(()=>{
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
                setpostsFetch({data: data, isPending: false, error: null})
            })
            .catch(err => {
                setpostsFetch({data: null, isPending: false, error: err.message})
            })
    }, [])
    return (
        <>
        {postsFetch.data && !postsFetch.data.auth.auth && navigate('../login', {replace: true})}
        {postsFetch.data && postsFetch.data.auth.auth &&
            <>
            <Header icons={{left: ['back'], right: []}} text={'My favorites'}/>

            {postsFetch.data.posts.length ? 
                <CardsContainer Posts={postsFetch.data.posts} auth={postsFetch.data.auth} />:
                <p>No liked posts</p>
            }
            </>
        }
        </>
    )
}