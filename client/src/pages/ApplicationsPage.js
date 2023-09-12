import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useUser } from "../hooks/useUser";
import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { LocationOnRounded, PersonRounded } from "@mui/icons-material";
import Nav from "../components/Nav";
export default function ApplicationsPage(){
    const {state} = useLocation();
    const navigate = useNavigate();
    const {postId} = useParams();
    const userInfo = useUser();
    const [applications, setApplications] = useState({applications: null, isPending: true, error: null});
    const [postInfo, setPostInfo] = useState({post: null, isPending: true, error: null})
    const color = useRef();
    const noMoreSpots = useRef();
    useEffect(()=>{
        if(!userInfo.isPending){
            if(!userInfo.auth){
                navigate('../../../login', {replace: true})
            } else if(userInfo.user.userType !== 'org'){
                navigate('../../../login', {replace: true})
            } else {
                fetch(`http://localhost:2500/applications/${postId}`, {method: 'GET', credentials: 'include'})
                .then(res=>{
                        if(!res.ok){
                            throw Error('could not fetch org')
                        }
                        return res.json()
                    })
                    .then(data => {
                        if(!data.success){throw Error(data.message)}
                        else{
                            setApplications({applications: data.applications, isPending: false, error: null})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        setApplications({applications: null, isPending: false, error: err})
                    })
    
                if(state && state.post){
                    setPostInfo({post: state.post, isPending: false, error: null})
                    //set page color
                    const today = new Date().getTime();
                    if(new Date(state.post.endDate.join(' ')).getTime() < today){color.current = 'red'}
                    else if(new Date(state.post.startDate.join(' ')).getTime() > today){color.current = 'blue'}
                    else if(new Date(state.post.endDate.join(' ')).getTime() > today && 
                    new Date(state.post.startDate.join(' ')).getTime() < today){color.current = 'green'}
                    // check if all spots are registered
                    if(state.post.volNb[0] >= state.post.volNb[1]){noMoreSpots.current = true}
                }else{
                    fetch(`http://localhost:2500/post/${postId}`, {credentials: 'include'})
                    .then(res=>{
                            if(!res.ok){
                                throw Error('could not fetch post')
                            }
                            return res.json()
                        })
                        .then(data => {
                            setPostInfo({post: data, isPending: false, error: null})
                            //set page color
                            const today = new Date().getTime();
                            if(new Date(data.endDate.join(' ')).getTime() < today){color.current = 'red'}
                            else if(new Date(data.startDate.join(' ')).getTime() > today){color.current = 'blue'}
                            else if(new Date(data.endDate.join(' ')).getTime() > today && 
                            new Date(data.startDate.join(' ')).getTime() < today){color.current = 'green'}
                            // check if all spots are registered
                            if(data.volNb[0] >= data.volNb[1]){noMoreSpots.current = true}
                        })
                        .catch(err => {
                            console.log(err)
                            setPostInfo({post: null, isPending: false, error: err.message})
                        })
                }
            }
        }
    }, [userInfo])

    const [resource, setResource] = useState({name: 'new', color: 'blue'});
    function changeResource(newResource){
        setResource(newResource)
    }

    function handleUpdate(action, appId){
        fetch(`http://localhost:2500/applications/${action}/${appId}`, {method: 'PATCH', credentials: 'include'})
        .then(res=>{
            if(!res.ok){throw Error('could not update application status')}
            return res.json()
        })
        .then(data => {
            if(!data.success){throw Error(data.message)}
            else{
                const newApps = applications.applications.map(app => {
                    if(app._id === appId){
                        if(action === 'accept'){
                            return {...app, status: 'accepted'}
                        } else if (action === 'reject') {
                            return {...app, status: 'rejected'}
                        } else if (action === 'attended') {
                            return {...app, attendance: 'true'}
                        } else if (action === 'didNotAttend') {
                            return {...app, attendance: 'false'}
                        } 
                    } else { return app }
                })
                setApplications({applications: newApps, isPending: false, error: null})
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    return( <>
        <Header  icons={{left: ['back'], right: []}} text={'Event Applications'} />

        {postInfo.isPending ? <h1>Pending...</h1> : 
            <div className={`post-page-wrapper post-page-wrapper-${color.current}`}>
                <div className="event-info" key={'eventInfo'}>
                    <div className="event-info-text" key={'evenInfoText'}>
                        <p className="event-name" key={'eventName'}>{postInfo.post.eventName}</p>
                        <p className="event-location" key={'eventLocation'}><LocationOnRounded/>{postInfo.post.location}</p>
                    </div>
                    <div className={`event-vol-nb ${noMoreSpots.current && 'event-vol-nb-full'}`} key={'eventVolNb'}>
                        <PersonRounded/>{postInfo.post.volNb[0]}/{postInfo.post.volNb[1]}
                    </div>
                </div>
            </div>
        }

        <Nav blue={color.current === 'red' ? 'unreviewed' : 'new'} green='accepted' red='rejected' changeResource={changeResource}/>

        <div className={`post-apply-wrapper post-apply-wrapper-${resource.color}`} key={'pageWrapper'}>
        {applications.isPending ? <h1>Pending...</h1> : applications.applications.map((application, i) => {
            if(
                ((resource.name === 'new' || resource.name === 'unreviewed') && application.status === 'under review') || 
                (resource.name === 'rejected' && application.status === 'rejected') || 
                (resource.name === 'accepted' && application.status === 'accepted') 
            ){
            return (<>
            <div className="application-wrapper" key={'appWrapper'+i}>
                <div className="info-card">
                    {application.status === 'accepted' && <div style={{display: "flex", justifyContent: "space-between", background: "var(--green)"}}>
                        <h2>ACCEPTED</h2>
                        {color.current !== 'red' && <button onClick={()=>handleUpdate('reject', application._id)}>Reject</button>}
                        
                    </div>}
                    {application.status === 'rejected' && <div style={{display: "flex", justifyContent: "space-between", background: "var(--red)"}}>
                        <h2>REJECTED</h2>
                        {color.current !== 'red' && <button onClick={()=>handleUpdate('accept', application._id)}>Accept</button>}
                    </div>}
                    <div className="info-card-head">
                        <div className="profile-pic" />
                        <div className="info-card-head-text">
                            <p className="user-fullName">{application.userInfo.fullName}</p>
                            <p className="user-dob">{application.userInfo.dob}<span>{application.userInfo.gender}</span></p>
                        </div>
                    </div>
                    <p key={'phoneNb'}><span>Phone Number: </span>{application.userInfo.phoneNb}</p>
                    <p key={'email'}><span>Email: </span>{application.userInfo.email}</p>
                    <p key={'address'}><span>Address: </span>{application.userInfo.address}</p>
                    <p key={'skills'}>
                        <span className="blockSpan">Skills and Interests: </span>
                        {application.userInfo.skills.map((skill, i)=>{
                            return i===0?skill:` - ${skill}`
                        } )}
                    </p>
                    <p key={'bio'}><span className="blockSpan">Bio: </span>{application.userInfo.bio}</p>
                    {application.status === 'under review' && <div>
                        {color.current !== 'red' ? <>
                        <button onClick={()=>handleUpdate('reject', application._id)}>Reject</button>
                        <button onClick={()=>handleUpdate('accept', application._id)}>Accept</button>
                        </> : <h2>Not Reviewed</h2>}
                    </div>}

                    {color.current === 'red' && application.status === 'accepted' && <>
                        {application.attendance === 'pending' && <>
                            <button onClick={()=>handleUpdate('didNotAttend', application._id)}>Did Not Attend</button>
                            <button onClick={()=>handleUpdate('attended', application._id)}>Confirm Attendance</button>
                        </>}
                        {application.attendance === 'true' && <div style={{display: "flex", justifyContent: "space-between", background: "var(--green)"}}>
                            <h2>Attended</h2>
                            <button onClick={()=>handleUpdate('didNotAttend', application._id)}>Did Not Attend</button>
                        </div>}
                        {application.attendance === 'false' && <div style={{display: "flex", justifyContent: "space-between", background: "var(--red)"}}>
                            <h2>Did Not Attend</h2>
                            <button onClick={()=>handleUpdate('attended', application._id)}>Confirm Attendance</button>
                        </div>}
                    </>}
                </div>
            </div>
            </>)
            }
        })}
        </div>
    </>)
}