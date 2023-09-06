import Header from "../components/Header";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { LocationOnRounded, PersonRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
export default function PostApplyPage(){
    const navigate = useNavigate();
    const {postId} = useParams();
    const {state} = useLocation();
    const [infoFetch, setInfoFetch] = useState({org: null, post: null, auth: null, isPending: false, error: false})
    const userInfo = useUser();
    useEffect(()=>{
        if(state && userInfo.auth){
            if(state.post.applications.includes(userInfo.user._id)){ //if user already applied
                setInfoFetch({org: state.org, post: state.post, auth: null, isPending: true, error: null})
                fetch(`http://localhost:2500/applications/post/${postId}`, {method: 'GET', credentials: 'include'})
                .then(res=>{
                        if(!res.ok){
                            throw Error('could not fetch org')
                        }
                        return res.json()
                    })
                    .then(data => {
                        if(!data.success){throw Error(data.message)}
                        else{
                            setInfoFetch({org: state.org, post: state.post, auth: data.auth, isPending: false, error: null})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        setInfoFetch({org: state.org, post: state.post, auth: null, isPending: false, error: err.message})
                    })
            }else{
                setInfoFetch({org: state.org, post: state.post, auth: userInfo, isPending: false, error: null})
            }
        }else{
            setInfoFetch({org: null, post: null, auth: null, isPending: true, error: null})
            fetch(`http://localhost:2500/post/apply/${postId}`, {method: 'GET', credentials: 'include'})
            .then(res=>{
                    if(!res.ok){
                        throw Error('could not fetch org')
                    }
                    return res.json()
                })
                .then(data => {
                    setInfoFetch({org: data.org, post: data.post, auth: data.auth, isPending: false, error: null})
                })
                .catch(err => {
                    console.log(err)
                    setInfoFetch({org: null,post: null, auth: null, isPending: false, error: err.message})
                })
        }
    }, [userInfo])
    let color = '';
    let today = new Date().getTime();
    if(infoFetch.post){
        if(new Date(infoFetch.post.endDate.join(' ')).getTime() < today){color = 'red'}
        else if(new Date(infoFetch.post.startDate.join(' ')).getTime() > today){color = 'blue'}
        else if(new Date(infoFetch.post.endDate.join(' ')).getTime() > today && 
        new Date(infoFetch.post.startDate.join(' ')).getTime() < today){color = 'green'}
    }

    function handleApply(){
        fetch(`http://localhost:2500/post/apply/${postId}`, {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){console.log('applictions sent successfully')}
        })
        .catch((err) => console.log(err))
    }
    return(
    <>
        {infoFetch.auth && !infoFetch.auth.auth && navigate('../../../login', {replace: true})}
        {infoFetch.auth && infoFetch.post && infoFetch.org && <>
        <Header 
            icons={{left: ['back'], right: []}}
            text={''}
        />
        <div className={`post-apply-wrapper post-apply-wrapper-${color}`} key={'pageWrapper'}>
            <div className="event-info" key={'eventInfo'}>
                <div className="event-info-text" key={'eventInfoText'}>
                    <p className="event-name" key={'eventName'}>{infoFetch.post.eventName}</p>
                    <p className="event-location" key={'eventLocation'}><LocationOnRounded/>{infoFetch.post.location}</p>
                </div>
                <div className={`event-vol-nb ${(infoFetch.post.volNb[0]===infoFetch.post.volNb[1]) && 'event-vol-nb-full'}`} key={'eventVolNb'}>
                    <PersonRounded/>{infoFetch.post.volNb[0]}/{infoFetch.post.volNb[1]}
                </div>
            </div>
            <div className="org-info" key={'orgInfo'}>
                <p key={'postedBy'}>Posted By</p>
                <div className="org-profile" key={'orgProfile'}>
                    <img src={infoFetch.org.profilePic} className="org-profile-pic"/>
                    <div className="org-profile-text">
                        <p className="org-name">{infoFetch.org.orgName}</p>
                        <Link to={`/orgs/${infoFetch.org.orgId}`}>visit profile</Link>
                    </div>
                </div>
                <div className="contact" key={'contact'}>
                    <p>Contact Info:</p>
                    <ul>
                        {infoFetch.org.phoneNb.map((nb,i)=><li key={`nb${i}`}>{nb}</li>)}
                        {infoFetch.org.email.map((email,i)=><li key={`email${i}`}>{email}</li>)}
                    </ul>
                </div>
            </div>
            <div className="halfLine" key={'halfLine'}/>
            <div className="application-wrapper" key={'appWrapper'}>
                <p>This info will be sent to {infoFetch.org.orgName}</p>
                <div className="info-card">
                    <div className="info-card-head">
                        <div className="profile-pic" />
                        <div className="info-card-head-text">
                            <p className="user-fullName">{infoFetch.auth.user.fullName}</p>
                            <p className="user-dob">{infoFetch.auth.user.dob}<span>{infoFetch.auth.user.gender}</span></p>
                        </div>
                    </div>
                    <p key={'phoneNb'}><span>Phone Number: </span>{infoFetch.auth.user.phoneNb}</p>
                    <p key={'email'}><span>Email: </span>{infoFetch.auth.user.email}</p>
                    <p key={'address'}><span>Address: </span>{infoFetch.auth.user.address}</p>
                    <p key={'skills'}>
                        <span className="blockSpan">Skills and Interests: </span>
                        {infoFetch.auth.user.skills.map((skill, i)=>{
                            return i===0?skill:` - ${skill}`
                        } )}
                    </p>
                    <p key={'bio'}><span className="blockSpan">Bio: </span>{infoFetch.auth.user.bio}</p>
                </div>
            </div>
            {infoFetch.post.applications.includes(infoFetch.auth.user._id) ? 
                <div className="button-div" key={'buttonDiv'}>
                    <p>Status: <span>Under Review</span></p>
                    <button type="button" className="apply-btn apply-btn-disabled">Applied</button>
                </div> :
                <div className="button-div" key={'buttonDiv'}>
                    <button type="button" className="apply-btn" onClick={()=> handleApply()}>Apply</button>
                </div>
            }
        </div>
        </>}
    </>)
}