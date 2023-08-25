import { useState, useRef, useEffect } from "react"
import Header from "../components/Header"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowForwardRounded, FunctionsRounded } from "@mui/icons-material"
import NewPills from '../components/NewPills.js'

export function RegisterUserDecode(){
    //getting user info after registering with facebook or google to avoid an unnecessary api fetch request
    const navigate = useNavigate()
    const {search} = useLocation()
    const arr = decodeURIComponent(search).split('&')
    const fullName = arr[0].split('=')[1]
    let profilePic
    if(arr.length === 2){
        profilePic = arr[1].split('=')[1]
    }
    useEffect(()=>{
        navigate('../step2', {replace: true, state: {auth: {auth: true, user: {fullName, profilePic}}}})
    }, [])
}
export function Register(){
    return(<>
        <Header icons={{left: ['home'], right:['']}}/>
    
        <div className="reg-page0-wrapper">
            <h2>Register As</h2>
    
            <div className="reg-as-buttons">
                <Link to='/register/user/step1'><button className="reg-as-vol">VOLUNTEER</button></Link>
                <Link to='/register/org/step1'><button className="reg-as-org">ORGANIZATION</button></Link>
            </div>
    
            <div className="line"/>

            <div className="login-wrapper">
                <p>Already have an account?</p>
                <Link to="/login">
                <button className="login">Log In</button>
                </Link>
            </div>
    
        </div>
    </>)
}
export function RegisterUserStep1(){
    const navigate = useNavigate();
    const usernameRef = useRef(), passwordRef = useRef();
    function handleSubmit(e){
        e.preventDefault()
        fetch('http://localhost:2500/auth/local/register/user', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            }),
            credentials: 'include'
        }).then(res => {
            if(!res.ok){throw Error("couldn't create user")}
            return res.json()
        }).then(res => {
            if(res.success){
                navigate('../step2', {replace: true, state: {auth: res.auth}})
            }else if(res.redirect){
                navigate('../../../login', {replace: true})
            }else{
                throw Error(res.message)
            }
        }).catch(err => console.log(err))
    }
    return(<>
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 1: Registration</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '15px'}}/>
            </div>
        </div>

        <div className="reg-text">
            <h2>Create Your Account</h2>
        </div>

        <div className="login-page-wrapper">

            <form onSubmit={(e)=>handleSubmit(e)}>
                <div className="input-wrapper">
                    <label>Username</label>
                    <input type="text" name="username" ref={usernameRef} required/>
                </div>
                <div className="input-wrapper">
                    <label>Create Password</label>
                    <input type="password" name="password" ref={passwordRef} required/>
                </div>
                <button type="submit">Create Account</button>
            </form>

            <div className="social-logs-wrapper">
                <div className="line"/>
                <a href="http://localhost:2500/auth/google">
                    <button className="google">
                        Sign up with Google
                    </button>
                </a>
                <a href="http://localhost:2500/auth/facebook">
                    <button className="facebook">
                        Sign up with Facebook
                    </button>
                </a>
                <button className="apple">
                    Sign up with Apple
                </button>
            </div>
        </div>

        <div className="next-buttons">
            {/* <Link to='/register/'>back</Link> */}
            <Link to='/register/user/step2'>
                <button>Create Account<ArrowForwardRounded/></button>
            </Link>
        </div>
    </>)
}
export function RegisterUserStep2(){
    let navigate = useNavigate();
    let {state} = useLocation();
    let fullNameRef = useRef(), phoneNbRef = useRef(), dobRef = useRef(), genderRef = useRef();
    let userInfo = {fullName: '', phoneNb: '', dob: '', gender: '', email: '', address: '', bio: '', skills: [], profilePic: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'};
    
    useEffect(()=>{
        if(!state){navigate('../step1', {replace: true})}
        else {
            if(state.userInfo){
                userInfo = state.userInfo;
                fullNameRef.current.value = userInfo.fullName;
                phoneNbRef.current.value = userInfo.phoneNb;
                dobRef.current.value = userInfo.dob;
                genderRef.current.value = userInfo.gender;
            }else if(state.auth.user){
                if(state.auth.user.fullName){
                    userInfo.fullName = state.auth.user.fullName
                    fullNameRef.current.value = state.auth.user.fullName
                }
                if(state.auth.user.profilePic){
                    userInfo.profilePic = state.auth.user.profilePic
                }
            }
        }
    }, [])
    
    //pass data to next step
    function handleSubmit(e){
        e.preventDefault()
        userInfo.fullName = fullNameRef.current.value;
        userInfo.phoneNb = phoneNbRef.current.value;
        userInfo.dob = dobRef.current.value;
        userInfo.gender = genderRef.current.value;
        navigate('../step3',{replace: true, state: {auth: state.auth, userInfo}})
    }
    return(<>
        {/* {authFetch.auth && !authFetch.auth.auth && navigate("../step1", {replace: true})} */}

        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 2: Personal Details</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <div className="reg-text">
            <h2>Basic Information</h2>
            <p>Organizations need to know you. The info will only be visible to the organizations you apply to.</p>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>Full Name</label>
                <input type="text" name='fullName' ref={fullNameRef} required />
            </div>
            <div>
                <label>Phone Number</label>
                <input type="tel" name='phoneNb' ref={phoneNbRef} required/>
            </div>
            <div>
                <label>Date of Birth</label>
                <input type="date" name="dob" ref={dobRef} required/>
            </div>
            <div>
                <label>Gender</label>
                <select name="gender" ref={genderRef}>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>
            
            <div className="next-buttons">
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}
export function RegisterUserStep3(){
    const navigate = useNavigate()
    let {state} = useLocation()
    let emailRef = useRef(), addressRef = useRef(), bioRef = useRef();
    const [skills, setSkills] = useState([])

    let [userInfo, setUserInfo] = useState({})

    useEffect(()=>{
        if(!state){
            navigate('../step1', {replace: true})
        }
        else if(state.userInfo){
            setUserInfo(state.userInfo)
            emailRef.current.value = state.userInfo.email;
            addressRef.current.value = state.userInfo.address;
            bioRef.current.value = state.userInfo.bio;
            setSkills(state.userInfo.skills)
        }
    }, [])

    function handleSubmit(e){
        e.preventDefault()
        
        navigate('../step4',{replace: true, state: {auth: state.auth, userInfo: {
            ...userInfo, 
            email: emailRef.current.value,
            address: addressRef.current.value,
            bio: bioRef.current.value,
            skills: skills
        }}})
    }

    function handleBack(){
        navigate('../step2',{replace: true, state: {auth: state.auth, userInfo: {
            ...userInfo, 
            email: emailRef.current.value,
            address: addressRef.current.value,
            bio: bioRef.current.value,
            skills: skills
        }}})
    }

    function removePill(skill){
        console.log(`remove ${skill}`)
        let newArr = skills.filter(i=> i!=skill)
        setSkills(newArr)
    }
    function addPill(skill){
        if(skill.match(/[a-zA-Z]/) && !skills.includes(skill)){
            let Arr = skills
            Arr.unshift(skill)
            setSkills(Arr)
        }
    }

    return(<>
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 3: About You</p>
                <Link to='/register/user/step4'><p className="skip">skip</p></Link>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '260px'}}/>
            </div>
        </div>

        <div className="reg-text">
            <h2>Tell Us A Bit About You!</h2>
            <p>This will only be visible to organizations you apply to.</p>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>Email</label>
                <input type="email" name='email' ref={emailRef}/>
            </div>
            <div>
                <label>Address</label>
                <input type="text" name='address' ref={addressRef}/>
            </div>
            <div>
                <label>Bio</label>
                <textarea name="bio" ref={bioRef}/>
            </div>
             
            <NewPills label='Skills and Interests' skills={skills} addPill={addPill} removePill={removePill}/>
            
            <div className="next-buttons">
                <button type="button" onClick={()=>handleBack()}>back</button>
                <button type="submit">Final Step<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}
export function RegisterUserStep4(){
    let {state} = useLocation();
    let navigate = useNavigate()
    const [img, setImg] = useState('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541')
    let [userInfo, setUserInfo] = useState({})
    
    useEffect(()=>{
        if(!state){
            navigate('../step1', {replace: true})
        }
        else if(state.userInfo){
            setUserInfo(state.userInfo);
            setImg(state.userInfo.profilePic)
        }
    }, [])

    function changeImg(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = function(){
            setImg(reader.result)
            setUserInfo(prev => ({
                ...prev,
                profilePic: reader.result
            }))
        }
        if (file) {
            reader.readAsDataURL(file)
        }else{
            setImg('')
        }
    }
    function handleBack(){
        navigate('../step3',{replace: true, state: {auth: state.auth, userInfo}})
    }

    const [postResult, setPostResult] = useState({isPending: false, err: false})
    function handleSubmit(){
        setPostResult({isPending: true, err: false})
        fetch('http://localhost:2500/user', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(userInfo),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                setPostResult({isPending: false, err: false})
                navigate('../../../', {replace: true})
            }else{
                setPostResult({isPending: false, err: true})
            }
        })
        .catch(err => setPostResult({isPending: false, err: true}))
    }
    return(<>
        {postResult.isPending && <div className="popUp">Loading...</div>}
        {postResult.err && <div className="popUp">Failed to add your info. Please try again.</div>}
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Final Step: Personalizaiton</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '375px'}}/>
            </div>
        </div>

        <div className="reg-text">
            <h2>Add a photo.</h2>
            <p>Add a photo to let organizations know recognize you.</p>
        </div>

        <div className="add-photo">
            <div className="img" style={{backgroundImage: `url("${userInfo.profilePic}")`}}/>
            <input type="file" accept="image/png" placeholder=''
            onChange={(e)=>changeImg(e)}/>
        </div>

        <div className="next-buttons">
            <button type="button" onClick={()=>handleBack()}>back</button>
            <button onClick={()=>handleSubmit()}>Done</button>
        </div>
    </>)
}

export function RegisterOrgStep1(){
    const navigate = useNavigate();
    const usernameRef = useRef(), passwordRef = useRef();
    function handleSubmit(e){
        e.preventDefault()
        fetch('http://localhost:2500/auth/local/register/org', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            }),
            credentials: 'include'
        }).then(res => {
            if(!res.ok){throw Error("couldn't create user")}
            return res.json()
        }).then(res => {
            if(res.success){
                navigate('../step2', {replace: true, state: {auth: res.auth}})
            }else if(res.redirect){
                navigate('../../../login', {replace: true})
            }else{
                throw Error(res.message)
            }
        }).catch(err => console.log(err))
    }
    return(<>
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 1: Registration</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '15px'}}/>
            </div>
        </div>

        <div className="reg-text">
            <h2>Create Your Account</h2>
        </div>

        <div className="login-page-wrapper">

            <form onSubmit={(e)=>handleSubmit(e)}>
                <div className="input-wrapper">
                    <label>Username or email</label>
                    <input type="text" name="username" ref={usernameRef} required/>
                </div>
                <div className="input-wrapper">
                    <label>Create Password</label>
                    <input type="password" name="password" ref={passwordRef} required/>
                </div>
                <button type="submit">Create Account</button>
            </form>

        </div>
    </>)
}
export function RegisterOrgStep2(){
    let navigate = useNavigate();
    let {state} = useLocation();
    const [orgInfo, setOrgInfo] = useState({orgName: '', phoneNb: [], email: [], address: [], website: '', socialLinks: {facebook: '', instagram: '', x: '', linkedin: ''}, about: '', mission: '', vision: '', profilePic: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'});
    let orgNameRef = useRef(), websiteRef = useRef();
    const [address, setAddress] = useState([]);
    const [img, setImg] = useState('');
    
    useEffect(()=>{
        if(!state){navigate('../step1', {replace: true})}
        else {
            if(state.orgInfo){
                setOrgInfo(state.orgInfo)
                orgNameRef.current.value = state.orgInfo.orgName;
                websiteRef.current.value = state.orgInfo.website;
                setAddress(state.orgInfo.address)
                setImg(state.orgInfo.profilePic)
            }
        }
    }, [])

    //pass data to next step
    function handleSubmit(e){
        e.preventDefault()
        if(address.length > 0){
            navigate('../step3', {replace: true, state: {auth: state.auth, orgInfo: {
                ...orgInfo,
                profilePic: img,
                address: address,
                website: websiteRef.current.value,
                orgName: orgNameRef.current.value
            }}})
        }
    }
    
    function changeImg(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = function(){
            setImg(reader.result)
        }
        if (file) {
            reader.readAsDataURL(file)
        }else{
            setImg('')
        }
    }

    function removeAddress(add){
        let newArr = address.filter(i=> i!=add)
        setAddress(newArr)
    }
    function addAddress(add){
        if(add.match(/[a-zA-Z]/) && !address.includes(add)){
            let Arr = address
            Arr.unshift(add)
            setAddress(Arr)
        }
    }
    
    return(<>

        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 2: Basic Information</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <div className="add-photo">
            <div className="img" style={{backgroundImage: `url("${orgInfo.profilePic}")`}}/>
            <input type="file" accept="image/png" placeholder=''
            onChange={(e)=>changeImg(e)}/>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>Organization Name</label>
                <input type="text" name='orgName' ref={orgNameRef} required />
            </div>
            <NewPills label='Address' skills={address} addPill={addAddress} removePill={removeAddress}/>
            <div>
                <label>Website URL</label>
                <input type="text" name='website' ref={websiteRef} required/>
            </div>
            
            
            <div className="next-buttons">
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}
export function RegisterOrgStep3(){
    let navigate = useNavigate();
    let {state} = useLocation();
    const [orgInfo, setOrgInfo] = useState({orgName: '', phoneNb: [], email: [], address: [], website: '', socialLinks: {facebook: '', instagram: '', x: '', linkedin: ''}, about: '', mission: '', vision: '', profilePic: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'});
    const [phoneNbs, setPhoneNbs] = useState([]);
    const [emails, setEmails] = useState([]);
    
    useEffect(()=>{
        if(!state){navigate('../step1', {replace: true})}
        else {
            if(state.orgInfo){
                setOrgInfo(state.orgInfo)
                setPhoneNbs(state.orgInfo.phoneNb)
                setEmails(state.orgInfo.email)
            }
        }
    }, [])

    //pass data to next step
    function handleSubmit(e){
        e.preventDefault()
        if(phoneNbs.length > 0 && emails.length > 0){
            navigate('../step4', {replace: true, state: {auth: state.auth, orgInfo: {
                ...orgInfo,
                phoneNb: phoneNbs,
                email: emails
            }}})
        }
    }
    function handleBack(){
        navigate('../step2', {replace: true, state: {auth: state.auth, orgInfo: {
            ...orgInfo,
            phoneNb: phoneNbs,
            email: emails
        }}})
    }

    function removePhoneNb(nb){
        let newArr = phoneNbs.filter(i=> i!=nb)
        setPhoneNbs(newArr)
    }
    function addPhoneNb(nb){
        if(!nb.match(/[a-zA-Z]/) && !phoneNbs.includes(nb)){
            let Arr = phoneNbs
            Arr.unshift(nb)
            setPhoneNbs(Arr)
        }
    }
    function removeEmail(email){
        let newArr = emails.filter(i=> i!=email)
        setEmails(newArr)
    }
    function addEmail(email){
        if(email.match(/[a-zA-Z]/) && !emails.includes(email)){
            let Arr = emails
            Arr.unshift(email)
            setEmails(Arr)
        }
    }
    
    return(<>

        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 3: Contact Information</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            
            <NewPills label='Phone Number' skills={phoneNbs} addPill={addPhoneNb} removePill={removePhoneNb}/>
            <NewPills label='Contact Email' skills={emails} addPill={addEmail} removePill={removeEmail}/>
            
            <div className="next-buttons">
                <button type="button" onClick={()=>handleBack()}>back</button>
                <button type="submit">Next Step<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}
export function RegisterOrgStep4(){
    let navigate = useNavigate();
    let {state} = useLocation();
    const [orgInfo, setOrgInfo] = useState({orgName: '', phoneNb: [], email: [], address: [], website: '', socialLinks: {facebook: '', instagram: '', x: '', linkedin: ''}, about: '', mission: '', vision: '', profilePic: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'});
    let aboutRef = useRef(), missionRef = useRef(), visionRef = useRef();
    
    useEffect(()=>{
        if(!state){navigate('../step1', {replace: true})}
        else {
            if(state.orgInfo){
                setOrgInfo(state.orgInfo)
                aboutRef.current.value = state.orgInfo.about;
                missionRef.current.value = state.orgInfo.mission;
                visionRef.current.value = state.orgInfo.vision;
            }
        }
    }, [])

    //pass data to next step
    function handleSubmit(e){
        e.preventDefault()
        navigate('../step5', {replace: true, state: {auth: state.auth, orgInfo: {
            ...orgInfo,
            about: aboutRef.current.value,
            vision: visionRef.current.value,
            mission: missionRef.current.value
        }}})
    }

    function handleBack(){
        navigate('../step3', {replace: true, state: {auth: state.auth, orgInfo: {
            ...orgInfo,
            about: aboutRef.current.value,
            vision: visionRef.current.value,
            mission: missionRef.current.value
        }}})
    }
    
    return(<>

        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 2: Basic Information</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>About</label>
                <textarea name="about" ref={aboutRef} required/>
            </div>
            <div>
                <label>Mission</label>
                <textarea name="mission" ref={missionRef} required/>
            </div>
            <div>
                <label>Vision</label>
                <textarea name="vision" ref={visionRef} required/>
            </div>
            
            
            <div className="next-buttons">
                <button type="button" onClick={()=>handleBack()}>back</button>
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}
export function RegisterOrgStep5(){
    let {state} = useLocation();
    let navigate = useNavigate()
    const [orgInfo, setOrgInfo] = useState({orgName: '', phoneNb: [], email: [], address: [], website: '', socialLinks: {facebook: '', instagram: '', x: '', linkedin: ''}, about: '', mission: '', vision: '', profilePic: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'});
    const facebookRef = useRef(), instagramRef = useRef(), xRef = useRef(), linkedinRef = useRef();
    
    useEffect(()=>{
        if(!state){
            navigate('../step1', {replace: true})
        }
        else if(state.orgInfo){
            setOrgInfo(state.orgInfo);
            facebookRef.current.value = state.orgInfo.socialLinks.facebook;
            instagramRef.current.value = state.orgInfo.socialLinks.instagram;
            xRef.current.value = state.orgInfo.socialLinks.x;
            linkedinRef.current.value = state.orgInfo.socialLinks.linkedin;
        }
    }, [])

    const [postResult, setPostResult] = useState({isPending: false, err: false})
    function handleSubmit(e){
        e.preventDefault()
        setPostResult({isPending: true, err: false})
        fetch('http://localhost:2500/org', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({
                ...orgInfo,
                socialLinks: {
                    facebook: facebookRef.current.value,
                    instagram: instagramRef.current.value,
                    x: xRef.current.value,
                    linkedin: linkedinRef.current.value
                }
            }),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                setPostResult({isPending: false, err: false})
                navigate('../../../', {replace: true})
            }else{
                setPostResult({isPending: false, err: true})
            }
        })
        .catch(err => setPostResult({isPending: false, err: true}))
    }

    function handleBack(){
        navigate('../step4', {replace: true, state: {auth: state.auth, orgInfo: {
            ...orgInfo,
            socialLinks: {
                facebook: facebookRef.current.value,
                instagram: instagramRef.current.value,
                x: xRef.current.value,
                linkedin: linkedinRef.current.value
            }
        }}})
    }
    return(<>
        {postResult.isPending && <div className="popUp">Loading...</div>}
        {postResult.err && <div className="popUp">Failed to add your info. Please try again.</div>}
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Final Step: Social Links</p>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '375px'}}/>
            </div>
        </div>


        <form onSubmit={(e)=>handleSubmit(e)} className="reg-form">

            <div className="input-wrapper">
                <label>Facebook</label>
                <input type="text" name="facebook" ref={facebookRef}/>
            </div>

            <div className="input-wrapper">
                <label>Instagram</label>
                <input type="text" name="instagram" ref={instagramRef}/>
            </div>

            <div className="input-wrapper">
                <label>X</label>
                <input type="text" name="x" ref={xRef}/>
            </div>

            <div className="input-wrapper">
                <label>Linkedin</label>
                <input type="text" name="linkedin" ref={linkedinRef}/>
            </div>

            <div className="next-buttons">
                <button type="button" onClick={()=>handleBack()}>back</button>
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

        


    </>)
}