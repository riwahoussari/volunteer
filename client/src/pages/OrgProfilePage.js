import { useParams, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useState, useEffect } from "react";
export default function OrgProfilePage(){
    let {orgId} = useParams()
    let {state} = useLocation()
    const [orgFetch, setOrgFetch] = useState({org: null, isPending: false, error: null});
    useEffect(()=>{
        if(state){
           setOrgFetch({org: state, isPending: false, error: null})
        }else{
            setOrgFetch({org: null, isPending: true, error: null})
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
    }, [])
    
    return (<>
    {orgFetch.org && <>
        <Header 
            icons={{left: ['back'], right: ['home']}}
            text={''}
        />
        <div className="org-profile-wrapper">
            <div className="profile">
                <img src={orgFetch.org.profilePic} />
                <p className="org-name">{orgFetch.org.orgName}</p>
                {orgFetch.org.address.map(add=><p className="org-address">{add}</p>)}
            </div>
            <div className="contact">
                {orgFetch.org.phoneNb.map(nb=><p>{nb}</p>)}
                {orgFetch.org.email.map(email=><p>{email}</p>)}
                <p>{orgFetch.org.website}</p>
            </div>
            <div className="social-links">
                {orgFetch.org.facebook && <a target="_blank" href={orgFetch.org.facebook}>
                    <div className="social-link facebook-link" />
                </a>}
                {orgFetch.org.instagram && <a target="_blank" href={orgFetch.org.instagram}>
                    <div className="social-link instagram-link" />
                </a>}
                {orgFetch.org.x && <a target="_blank" href={orgFetch.org.x}>
                    <div className="social-link x-link" />
                </a>}
                {orgFetch.org.linkedin && <a target="_blank" href={orgFetch.org.linkedin}>
                    <div className="social-link linkedin-link" />
                </a>}
            </div>
            <div className="org-about">
                <div className="org-about-sec">
                    <p className="title">Mission</p>
                    <p className="content">{orgFetch.org.mission}</p>
                </div>
                <div className="org-about-sec">
                    <p className="title">Vision</p>
                    <p className="content">{orgFetch.org.vision}</p>
                </div>
                <div className="org-about-sec">
                    <p className="title">About</p>
                    <p className="content">{orgFetch.org.about}</p>
                </div>
            </div>
        </div>
    </>}
    </>)
}