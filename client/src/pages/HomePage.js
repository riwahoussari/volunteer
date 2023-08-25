import Header from '../components/Header'
import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import CardsContainer from '../components/CardsContainer'

export default function HomePage(){
    //user authentication
    const [authFetch, setAuthFetch] = useState({data: null, isPending: false, error: null});
    useEffect(()=>{
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
    }, [])

    //change resource function for navbar
    const [resource, setResource] = useState({name: 'upcoming', color: 'blue'})
    function changeResource(newResource){
        setResource(newResource)
    }
    //fetch posts on resource change
    const [postsFetch, setpostsFetch] = useState({data: null, isPending: false, error: null})
    useEffect(()=>{
        setpostsFetch({data: null, isPending: true, error: null})
        fetch(`http://localhost:2500/posts/${resource.name}`)
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
            {authFetch.data && !authFetch.data.auth && <Header 
                icons={{left: ['signup'], right: ['login']}}
                text=''
            />
            }
            {authFetch.data && authFetch.data.auth &&
                <Header 
                icons={{left: ['history', 'favorite'], right: ['profile']}}
                text=''
                state={authFetch.data}

            />}

            <Nav blue='upcoming' green='current' red='past' changeResource={changeResource}/>
            
            {postsFetch.isPending && <p>Loading...</p>}
            {postsFetch.error && <p>{postsFetch.error}</p>}
            {postsFetch.data && authFetch.data && <CardsContainer Posts={postsFetch.data} auth={authFetch.data}/>}
        </>
    )
}
