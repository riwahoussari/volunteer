import { AddRounded, CheckRounded, CloseRounded } from "@mui/icons-material"
import { useRef, useState } from "react"
export default function NewPills(props){
    const [isDisabled, setIsDisabled] = useState(true)
    const inputRef = useRef()
    
    return (<div className="input-field">
        <label>{props.label}</label>

        <div className="pills-wrapper">
            {isDisabled ? 
            <div className="pill addPill" onClick={()=>setIsDisabled(!isDisabled)}>
                <p>Add</p>
                <AddRounded />
            </div>:
            <div className="pill inputPill">
                <input type="text" ref={inputRef} maxLength="30"/>
                <CheckRounded onClick={()=>{
                    props.addPill(inputRef.current.value)
                    setIsDisabled(!isDisabled)
                }} />
            </div>

            }
            {props.skills.map((skill, i)=> (
                <div className="pill" key={i} >
                    <p>{skill}</p>
                    <CloseRounded onClick={()=>props.removePill(skill)}/>
                </div>
            ))}
        </div>        
    </div>)
}