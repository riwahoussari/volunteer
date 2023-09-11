import {useUser} from '../hooks/useUser'
import { useState, useEffect, useRef } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {ArrowForwardRounded, NewspaperRounded} from '@mui/icons-material'
import NewPills from '../components/NewPills';

export function CreatePostStep1(){
    let navigate = useNavigate();
    let {state} = useLocation();
    let eventNameRef = useRef(), volNbRef = useRef(), aboutRef = useRef(), locationRef = useRef();
    let eventInfo = {
        eventName: '',
        volNb: [],
        location: '',
        startDate: [],
        endDate: [],
        schedules: [],
        about: '',
        photo: '',
        requirements: []
    }
    
    useEffect(()=>{
        if(state && state.eventInfo){
            eventInfo = state.eventInfo;
            eventNameRef.current.value = state.eventInfo.eventName;
            volNbRef.current.value = state.eventInfo.volNb[1];
            locationRef.current.value = state.eventInfo.location;
            aboutRef.current.value = state.eventInfo.about;
        }
    }, [])
    
    //pass data to next step
    function handleSubmit(e){
        e.preventDefault()
        eventInfo.eventName = eventNameRef.current.value;
        eventInfo.volNb = ['0', volNbRef.current.value];
        eventInfo.location = locationRef.current.value;
        eventInfo.about = aboutRef.current.value;
        navigate('../step2',{replace: true, state: {eventInfo}})
    }

    let userInfo = useUser();
    return(<>
        {userInfo.auth === false && navigate('../../../login', {replace: true})}
        {userInfo.auth && userInfo.user.userType === 'user' && navigate('../../../', {replace: true})}
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 1 / 3</p>
                <Link to={'../../../'}>Exit</Link>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>Event Name</label>
                <input type="text" name='eventName' ref={eventNameRef} required />
            </div>
            <div>
                <label>Number of volunteers</label>
                <input type="number" name='volNb' ref={volNbRef} required/>
            </div>
            <div>
                <label>Location</label>
                <input type="text" name="location" ref={locationRef} required/>
            </div>
            <div>
                <label>About</label>
                <textarea name="about" ref={aboutRef} required></textarea>
            </div>
            
            <div className="next-buttons">
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}

export function CreatePostStep2(){
    let navigate = useNavigate();
    let {state} = useLocation();
    let startDateRef = useRef(), endDateRef = useRef(), startTimeRef = useRef(), finishTimeRef = useRef();
    let eventInfo = {
        eventName: '',
        volNb: [],
        location: '',
        startDate: [],
        endDate: [],
        schedules: [],
        about: '',
        photo: '',
        requirements: []
    }
    
        if(state && state.eventInfo){
            eventInfo = state.eventInfo;
            console.log(eventInfo)
        }else{
            navigate('../step1', {replace: true})
        }
    
    // //pass data to next step
    function handleSubmit(e){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        e.preventDefault()
        let startDate = new Date(startDateRef.current.value);
        eventInfo.startDate = [`${startDate.getDate()}`, `${months[startDate.getMonth()]}`, `${startDate.getFullYear()}`]

        if(isEndDateOn){
            let endDate = new Date(endDateRef.current.value);
            eventInfo.endDate = [`${endDate.getDate()}`, `${months[endDate.getMonth()]}`, `${endDate.getFullYear()}`]
        }

        let checked = [... e.target.querySelectorAll('input[type="checkbox"]')].map(box => {
            if(box.checked){
                return box.value
            }
        }).filter(i => i)

        if(checked.length > 0){
            let startTime = startTimeRef.current.value.split(':')
            if(Number(startTime[0]) > 12){
                startTime = `${Number(startTime[0] - 12)}:${startTime[1]}PM`
            }else{
                startTime = `${startTime.join(':')}AM`
            }
            let finishTime = finishTimeRef.current.value.split(':')
            if(Number(finishTime[0]) > 12){
                finishTime = `${Number(finishTime[0] - 12)}:${finishTime[1]}PM`
            }else{
                finishTime = `${finishTime.join(':')}AM`
            }

            eventInfo.schedules = [{days: checked, time: [[startTime, finishTime]]}]
            navigate('../step3',{replace: true, state: {eventInfo}})
        }
    }

    let userInfo = useUser();
    const [isEndDateOn, setIsEndDateOn] = useState(false)
    return(<>
        {userInfo.auth === false && navigate('../../../login', {replace: true})}
        {userInfo.auth && userInfo.user.userType === 'user' && navigate('../../../', {replace: true})}
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 1 / 3</p>
                <Link to={'../../../'}>Exit</Link>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>Start Date</label>
                <input type="date" name='startDate' ref={startDateRef} required />
            </div>
            <div>
                <label>End Date</label>
                {isEndDateOn ? 
                    <input type="date" name='endDate' ref={endDateRef} required /> : 
                    <input type="date" name='endDate' disabled />
                }
                <div 
                    className={`theme-toggle-switch ${isEndDateOn && 'theme-toggle-switch-dark'}`}
                    onClick={()=>setIsEndDateOn(prev => !prev)}
                >
                    <div className="theme-toggle-circle"/>
                </div>
            </div>

            <div>
                <label>Start Time</label>
                <input type="time" name='startTime' ref={startTimeRef} required />
            </div>
            <div>
                <label>Finish Time</label>
                <input type="time" name='finishTime' ref={finishTimeRef} required />
            </div>
            <div>
                <label>Days</label>
                <div>
                    <label>Mon <input type="checkbox" name='Mon' value='Mon' /></label>
                    <label> Tue <input type="checkbox" name='Tue' value='Tue' /></label>
                    <label> Wed <input type="checkbox" name='Wed' value='Wed' /></label>
                    <label> Thu <input type="checkbox" name='Thu' value='Thu' /></label>
                    <label> Fri <input type="checkbox" name='Fri' value='Fri' /></label>
                    <label> Sat <input type="checkbox" name='Sat' value='Sat' /></label>
                    <label> Sun <input type="checkbox" name='Sun' value='Sun' /></label>
                </div>
                
            </div>
           
            <div className="next-buttons">
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}

export function CreatePostStep3(){
    let userInfo = useUser();
    let navigate = useNavigate();
    let {state} = useLocation();

    let eventInfo = {
        eventName: '',
        volNb: [],
        location: '',
        startDate: [],
        endDate: [],
        schedules: [],
        about: '',
        photo: '',
        requirements: []
    }
    
        if(state && state.eventInfo){
            eventInfo = state.eventInfo;
            console.log(eventInfo)
        }else{navigate('../step1', {replace: true})}
    
    //pass data to next step
    function handleSubmit(e){
        e.preventDefault();
        fetch('http://localhost:2500/addPost', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(eventInfo),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                navigate('../../../', {replace: true})
            }
        })
        .catch(err => console.log(err.message))
    }
    const [img, setImg] = useState(eventInfo.photo)
    function changeImg(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = function(){
            setImg(reader.result)
            eventInfo = {...eventInfo, photo: reader.result}
        }
        if (file) {
            reader.readAsDataURL(file)
        }else{
            setImg('')
        }
    }

    const [requirements, setRequirements] = useState(eventInfo.requirements);
    function removePill(requirement){
        let newArr = requirements.filter(i=> i!=requirement)
        setRequirements(newArr)
    }
    function addPill(requirement){
        if(requirement.match(/[a-zA-Z]/) && !requirements.includes(requirement)){
            let Arr = requirements
            Arr.unshift(requirement)
            setRequirements(Arr)
        }
    }
    return(<>
        {userInfo.auth === false && navigate('../../../login', {replace: true})}
        {userInfo.auth && userInfo.user.userType === 'user' && navigate('../../../', {replace: true})}
        <div className="reg-header">
            <div className="reg-header-text">
                <p>Step 1 / 3</p>
                <Link to={'../../../'}>Exit</Link>
            </div>
            <div className="reg-header-bar ">
                <div style={{width: '130px'}}/>
            </div>
        </div>

        <form className="reg-form" onSubmit={(e)=>handleSubmit(e)}>
            <div className="add-photo">
                <div className="img" style={{backgroundImage: `url("${eventInfo.photo}")`}}/>
                <input type="file" accept="image/png" placeholder=''
                onChange={(e)=>changeImg(e)}/>
            </div>

            <div>
                <NewPills label='Requirements' skills={requirements} addPill={addPill} removePill={removePill}/>
            </div>
            
            <div className="next-buttons">
                <button type="submit">Continue<ArrowForwardRounded/></button>
            </div>
        </form>

    </>)
}