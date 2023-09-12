import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import { LocationOnRounded, PersonRounded } from "@mui/icons-material";
import LikeButton from "../components/LikeButton";
import { useState, useEffect, useRef } from "react";
import {useUser} from '../hooks/useUser'

export default function PostPage(){
    //post fetch
    const {postId} = useParams();
    const [postFetch, setPostFetch] = useState({post: null, isPending: false, error: null});
    const color = useRef('black');
    const noMoreSpots = useRef(false);
    const userApplied = useRef(false);
    const userInfo = useUser(); 

    const {state} = useLocation();
    useEffect(()=>{
        if(state && userInfo.auth !== null){
            setPostFetch({post: state.post, isPending: false, error: null});
            color.current = state.color;
            if(Number(state.post.volNb[0]) >= Number(state.post.volNb[1])){noMoreSpots.current = true}
            if(userInfo.auth && userInfo.user.userType === 'user' && userInfo.user.applications.includes(postId)){userApplied.current = true}
            else{userApplied.current = false}
        }else if(userInfo.auth !== null){

            setPostFetch({post: null, isPending: true, error: null})
            fetch(`http://localhost:2500/post/${postId}`, {credentials: 'include'})
            .then(res=>{
                    if(!res.ok){
                        throw Error('could not fetch post')
                    }
                    return res.json()
                })
                .then(data => {
                    setPostFetch({post: data, isPending: false, error: null})
                    //set page color
                    const today = new Date().getTime();
                    if(new Date(data.post.endDate.join(' ')).getTime() < today){color.current = 'red'}
                    else if(new Date(data.post.startDate.join(' ')).getTime() > today){color.current = 'blue'}
                    else if(new Date(data.post.endDate.join(' ')).getTime() > today && 
                    new Date(data.post.startDate.join(' ')).getTime() < today){color.current = 'green'}
                    // check if all spots are registered
                    if(data.post.volNb[0] >= data.post.volNb[1]){noMoreSpots.current = true}
                })
                .catch(err => {
                    setPostFetch({post: null, isPending: false, error: err.message})
                })

        }
    }, [userInfo])

    //fetch organization
    const [orgFetch, setOrgFetch] = useState({org: null, isPending: false, error: null});
    useEffect(()=>{
        setOrgFetch({org: null, isPending: true, error: null})
        if(postFetch.post){
        let orgId = postFetch.post.orgId;
        fetch(`http://localhost:2500/org/${orgId}`)
        .then(res=>{
                if(!res.ok){
                    throw Error('could not fetch org')
                }
                return res.json()
            })
            .then(org => {
                setOrgFetch({org: org, isPending: false, error: null})
            })
            .catch(err => {
                console.log(err)
                setOrgFetch({org: null, isPending: false, error: err.message})
            })
        }
    }, [postFetch])
    
    return(<>
        {postFetch.isPending && <p>Loading post...</p>}
        {postFetch.error && <p>{postFetch.error}</p>}
        {postFetch.post && orgFetch.org && <>
        <Header 
            icons={{left: ['back'], right: ['share']}}
            text={orgFetch.org.orgName}
        />
        <div className={`post-page-wrapper post-page-wrapper-${color.current}`}>
            <div className="img" key={'img'}/>
            <div className="event-info" key={'eventInfo'}>
                <div className="event-info-text" key={'evenInfoText'}>
                    <p className="event-name" key={'eventName'}>{postFetch.post.eventName}</p>
                    <p className="event-location" key={'eventLocation'}><LocationOnRounded/>{postFetch.post.location}</p>
                </div>
                <div className={`event-vol-nb ${noMoreSpots.current && 'event-vol-nb-full'}`} key={'eventVolNb'}>
                    <PersonRounded/>{postFetch.post.volNb[0]}/{postFetch.post.volNb[1]}
                </div>
            </div>
            <div className="event-schedule" key={'eventSchedule'}>
                <div className="dates" key={'dates'}>
                    {postFetch.post.endDate && 
                        <div className="dates-design">
                            <div className="circle" key={'circle'}></div>
                            <div className="line" key={'line'}></div>
                        </div>
                    }
                    <p className="start-date"><span>{postFetch.post.startDate[0]}</span>{postFetch.post.startDate[1]}</p>
                    {postFetch.post.endDate && <p className="end-date"><span>{postFetch.post.endDate[0]}</span>{postFetch.post.endDate[1]}</p>}
                </div>
                {postFetch.post.schedules.map((schedule,i)=>  (
                    <div className="schedule" key={`schedule${i}`}>
                        <p className="schedule-days" key={'scheduleDays'}>
                            {schedule.days.map((day, i) =>{
                                return i===0 ? day : ' - ' + day
                            } )}
                        </p>
                        {schedule.time.map((t,i)=>(
                            <p className="schedule-hours" key={`scheduleHours${i}`}>{t[0]+' - '+t[1]}</p>
                        ))}
                    </div>
                ))}
            </div>
            <p className="event-about" key={'eventAbout'}>
                <span>About this event: </span>{postFetch.post.about}
            </p>
            <div className="halfLine" key={'halfLine'} />
            <div className="requirements" key={'requirements'}>
                <p>Requirements</p>
                <ul>
                    {postFetch.post.requirements.map((req,i)=> <li key={i}>{req}</li>)}
                </ul>
            </div>
            <div className="fullLine" key={'fullLine'}/>
            <div className="org-info" key={'orgInfo'}>
                <p>Posted By</p>
                <div className="org-profile" key={'orgProfile'}>
                    <img src={orgFetch.org.profileImg} className="org-profile-pic"/>
                    <div className="org-profile-text">
                        <p className="org-name">{orgFetch.org.orgName}</p>
                        <Link to={`/orgs/${orgFetch.org._id}`} state={orgFetch.org}>visit profile</Link>
                    </div>
                </div>
                <div className="contact" key={'contact'}>
                    <p>Contact Info:</p>
                    <ul>
                        {orgFetch.org.phoneNb.map(nb=><li key='nb'>{nb}</li>)}
                        {orgFetch.org.email.map(email=><li key={'email'}>{email}</li>)}
                    </ul>
                </div>
            </div>
            <div className="buttons" key={'buttons'}>
                {userInfo.auth && <LikeButton key={'likeButton'} post={postFetch.post} auth={userInfo}/>}
    
                {/* See Application */}
                {(!userInfo.auth || (userInfo.auth && userInfo.user.userType === 'user')) &&
                    (userApplied.current ?
                    <Link key={'button'}
                        to={`/posts/apply/${postId}`} 
                        state={{
                            org: orgFetch.org,
                            post: postFetch.post,
                        }} >
                        <div className="apply-now-btn">See Application</div>
                    </Link> :
                    /* Event Ended */
                    (color.current === 'red' ?
                        <div className="apply-now-btn apply-now-btn-disabled" key={'button'}>Event Ended</div>:
                        /* No More Spots */
                        (noMoreSpots.current ? 
                            <div className="apply-now-btn apply-now-btn-disabled" key={'button'}>No More Spots</div>:
                            /* Apply Now */
                            (userInfo.auth ?
                            <Link key={'button'}
                                to={`/posts/apply/${postId}`} 
                                state={{
                                org: orgFetch.org,
                                post: postFetch.post,
                            }} >
                                <div className="apply-now-btn">Apply Now</div>
                            </Link> : 
                            /* Log In */
                            <Link key={'button'} to={`/login`} >
                                <div className="apply-now-btn">Log In</div>
                            </Link>
                            )
                        )
                    )
                )}
                {userInfo.auth && userInfo.user.userType === 'org' && userInfo.user._id === orgFetch.org._id && 
                    <Link key={'button'} to={`/posts/${postId}/applications`} state={{post: postFetch.post}} >
                        <div className="apply-now-btn">See Applications</div>
                    </Link> 
                }
            </div>
        </div>

        </>}
    </>)
}