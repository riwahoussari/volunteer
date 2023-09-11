import Header from "../components/Header";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CardsContainer from "../components/CardsContainer";
import {useUser} from '../hooks/useUser';
export default function HistoryLayout(){
    const navigate = useNavigate();
    const userInfo = useUser();
    
    //change resource function for navbar
    const [resource, setResource] = useState({name: 'applications', color: 'blue'})
    function changeResource(newResource){
        setResource(newResource)
    }
    //fetch posts on resource change
    const [postsFetch, setpostsFetch] = useState({posts: null, isPending: false, error: null})
    useEffect(()=>{
        setpostsFetch({posts: null, isPending: true, error: null})
        fetch(`http://localhost:2500/history/${resource.name}`, {credentials: 'include'})
        .then(res=>{
                if(!res.ok){
                    throw Error('could not fetch posts for that resource')
                }
                return res.json()
            })
            .then(data => {
                if(data.success){
                    setpostsFetch({posts: data.posts, isPending: false, error: null})
                }else{
                    setpostsFetch({posts: null, isPending: false, error: data.message})
                }
            })
            .catch(err => {
                setpostsFetch({posts: null, isPending: false, error: err.message})
            })
    }, [resource.name])
    return <>
        {userInfo && !userInfo.auth && navigate('../login', {replace: 'true'})}
        {userInfo && userInfo.auth && userInfo.user.userType === 'org' && navigate('../', {replace: 'true'})}
        {userInfo && userInfo.auth && userInfo.user.userType === 'user' && <>
        <Header 
            icons={{left: ['back'], right: []}}
            text='My Events History'
            location={null}
        />
        <Nav blue='applications' red='attended' changeResource={changeResource}/>
        
        {postsFetch.isPending && <p>Loading...</p>}
        {postsFetch.error && <p>{postsFetch.error}</p>}
        {postsFetch.posts && <CardsContainer Posts={postsFetch.posts} auth={userInfo}/>}
        </>}
        
    </>
}