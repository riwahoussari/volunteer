import Header from '../components/Header'
import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import CardsContainer from '../components/CardsContainer'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

export function HomeUserDecode(){
    //getting user info after loggin in with facebook or google to avoid an unnecessary api fetch request
    const navigate = useNavigate()
    const {search} = useLocation()
    const arr = decodeURIComponent(search).split('&')
    
    const user = {
        id: arr[0].split('=')[1],
        userType: arr[1].split('=')[1],
        fullName: arr[2].split('=')[1].split('+').join(' '),
        skills: arr[3].split('=')[1].split('+').join(' ').split(','),
        events: arr[4].split('=')[1].split(','),
        likes: arr[5].split('=')[1].split(','),
        address: arr[6].split('=')[1].split('+').join(' '),
        bio: arr[7].split('=')[1].split('+').join(' '),
        dob: arr[8].split('=')[1],
        email: arr[9].split('=')[1],
        gender: arr[10].split('=')[1],
        phoneNb: arr[11].split('=')[1].split('+').join(''),
        profilePic: arr[12].split('=')[1],
        applications: arr[13].split('=')[1].split(',')
    }
    sessionStorage.setItem('userInfo', JSON.stringify({auth: true, user}) )
    useEffect(()=>{
        navigate('../../../', {replace: true})
    }, [])
}

export default function HomePage(){
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
            {(userInfo && userInfo.isPending) ? <h1>Pending</h1> : 
            ((userInfo && !userInfo.auth) ? 
                <Header 
                icons={{left: ['signup'], right: ['login']}}
                text=''
            /> : ( userInfo.user.userType === 'user' ?
                <Header 
                icons={{left: ['history', 'favorite'], right: ['profile']}}
                text=''
            />:<Header 
                icons={{left: ['myPosts', 'addPost'], right: ['favorite','profile']}}
                text=''
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
