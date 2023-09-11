import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import Header from "../components/Header";
import Nav from "../components/Nav";
import CardsContainer from "../components/CardsContainer";

export default function OrgPostsPage(){
    const navigate = useNavigate();
    //user authentication
    const userInfo = useUser();

    //change resource function for navbar
    const [resource, setResource] = useState({name: 'upcoming', color: 'blue'})
    function changeResource(newResource){
        setResource(newResource)
    }
    //fetch posts on resource change
    const [postsFetch, setpostsFetch] = useState({data: null, isPending: false, error: null})
    useEffect(()=>{
        setpostsFetch({data: null, isPending: true, error: null})
        fetch(`http://localhost:2500/org/posts/${resource.name}`, {credentials: 'include'})
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
    }, [resource.name])
    return (
        <>
            {userInfo.auth === null && <h1>Pending</h1>} 
            {userInfo.auth === false && navigate('../../login', {replace: true})}
            {userInfo.auth && userInfo.user.userType === 'user' && navigate('../../', {replace: true})}

            <Header 
                icons={{left: ['back'], right: []}}
                text='My Posts'
            />
            <Nav blue='upcoming' green='current' red='past' changeResource={changeResource}/>
            
            {postsFetch.isPending && <p>Loading...</p>}
            {postsFetch.error && <p>{postsFetch.error}</p>}
            {postsFetch.data && userInfo && <CardsContainer Posts={postsFetch.data} auth={userInfo}/>}

            <button onClick={() => navigate('../addPost')}>Add Post</button>

        </>
    )
}
