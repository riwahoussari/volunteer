import Header from "../components/Header";
import Nav from "../components/Nav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CardsContainer from "../components/CardsContainer";
export default function HistoryLayout(){
    const navigate = useNavigate();
    const {state} = useLocation();
    const [authFetch, setAuthFetch] = useState({data: null, isPending: false, error: null});
    useEffect(()=>{
        if(state && state.auth){
            setAuthFetch({data: state, isPending: false, error: null})
        }else{
            setAuthFetch({data: null, isPending: true, error: null})
            fetch(`http://localhost:2500/auth/user`, {credentials: 'include'})
            .then(res=>{
                    if(!res.ok){
                        throw Error('could not fetch data for that resource')
                    }
                    return res.json()
                })
                .then(data => {
                    setAuthFetch({data: data, isPending: false, error: null})
                })
                .catch(err => {
                    setAuthFetch({data: null, isPending: false, error: err.message})
                })
        }
    }, [])

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
        {authFetch.data && !authFetch.data.auth && navigate('../login')}
        {authFetch.data && authFetch.data.auth && <>
        <Header 
            icons={{left: ['back'], right: []}}
            text='My Events History'
            location={null}
        />
        <Nav blue='applications' red='attended' changeResource={changeResource}/>
        
        {postsFetch.isPending && <p>Loading...</p>}
        {postsFetch.error && <p>{postsFetch.error}</p>}
        {postsFetch.posts && console.log(postsFetch.posts)}
        {postsFetch.posts && authFetch.data && <CardsContainer Posts={postsFetch.posts} auth={authFetch.data}/>}
        </>}
        
    </>
}