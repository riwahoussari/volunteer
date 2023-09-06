import { CheckRounded, EditRounded } from "@mui/icons-material"
import { useRef, useState } from "react"
import { useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
export default function InputField(props){
    const [isDisabled , setIsDisabled] = useState(true)
    let input;
    const [inputValue, setInputValue] = useState(props.value);
    const inputRef = useRef();
    const userInfo = useUser();
    if(props.type === 'select'){
        if(isDisabled){
            input = (
                <select ref={inputRef} name={props.name} disabled defaultValue='male'>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                </select>
            )
        }else{
            input = (
                <select ref={inputRef} name={props.name} defaultValue='male'>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                </select>
            )
        }
        
    }else if(props.type === 'textarea'){
        if(isDisabled){
            input = <textarea name={props.name} disabled ref={inputRef}></textarea>
        }else{
            input = <textarea name={props.name} ref={inputRef}></textarea>
        }
    }else{
        if(isDisabled){
            input = (<input 
                key={props.name}
                type={props.type} 
                name={props.name} 
                disabled
                ref={inputRef}
            />)
        }else{
            input = (<input 
                key={props.name}
                type={props.type} 
                name={props.name} 
                ref={inputRef}
            />)
        }
    }
    if(inputRef.current){inputRef.current.value = inputValue}

    function updateField(key, value){
        if(userInfo.user.userType === 'user'){
            fetch('http://localhost:2500/user', {
                method: "POST",
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify({[key]: value}),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    setInputValue(value)
                    sessionStorage.setItem('userInfo', JSON.stringify({...userInfo, user: {...userInfo.user, [key]: value}}))
                }
            })
            .catch((err) => console.log(err))
        }else if(userInfo.user.userType === 'org'){
            fetch('http://localhost:2500/org', {
                method: "POST",
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify({[key]: value}),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    setInputValue(value)
                    sessionStorage.setItem('userInfo', JSON.stringify({...userInfo, user: {...userInfo.user, [key]: value}}))
                }
            })
            .catch((err) => console.log(err))
        }else{
            console.log('user type not recognized')
        }
    }
    
    return(
        <div className="input-field">
            <p className="input-label">{props.label}</p>
            
            <div 
                className="input-wrapper" 
                style={props.type === 'textarea'?{alignItems: "end"}:{}}
            >
                {input}

                {isDisabled ?
                <EditRounded onClick={()=>setIsDisabled(!isDisabled)} />:
                <CheckRounded onClick={()=>{
                    setIsDisabled(!isDisabled)
                    updateField(inputRef.current.name ,inputRef.current.value);
                }} />
                }
            </div>
        </div>

    )
}