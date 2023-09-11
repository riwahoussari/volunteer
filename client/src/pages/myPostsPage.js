import Header from '../components/Header'
import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import CardsContainer from '../components/CardsContainer'
import { useUser } from '../hooks/useUser'
import { Navigate, useNavigate } from 'react-router-dom'


export default function MyPostsPage(){
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

    const navigate = useNavigate()
    return (
        <>
            {(userInfo && userInfo.isPending) ? <h1>Pending</h1> : 
            ((userInfo && !userInfo.auth) ? 
                <Header 
                icons={{left: ['signup'], right: ['login']}}
                text=''
            /> : ( userInfo.user.userType === 'user' ?
                <Navigate to="../" replace="true"/>
            : <Header 
                icons={{left: ['home'], right: ['profile']}}
                text='My Posts'
            />
            ))
            }

            <Nav blue='upcoming' green='current' red='past' changeResource={changeResource}/>
            
            {postsFetch.isPending && <p>Loading...</p>}
            {postsFetch.error && <p>{postsFetch.error}</p>}
            {postsFetch.data && userInfo && <CardsContainer Posts={postsFetch.data} auth={userInfo}/>}
        </>
    )
}
