import { AddRounded, CheckRounded, CloseRounded } from "@mui/icons-material"
import { useRef, useState } from "react"
export default function Pills(props){
    const [skills, setSkills] = useState(props.value)
    const [isDisabled, setIsDisabled] = useState(true)
    const inputRef = useRef()

    function newArr(action, skill){
        if(action === 'add' && skill.match(/[a-zA-Z]/)){
            let arr = skills;
            arr.unshift(skill)
            updateField('skills', arr)
        }else if(action === 'remove'){
            let arr = skills.filter(i=> i!=skill)
            updateField('skills', arr)
        }
    }

    function updateField(key, value){
        fetch('http://localhost:2500/user', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({[key]: value}),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){setSkills(value)}
        })
        .catch((err) => console.log(err))
    }

    return (<div className="input-field">
        <p className="input-label">{props.label}</p>

        {isDisabled?
        <div className="pills-wrapper">
            <div className="pill addPill" onClick={()=>setIsDisabled(!isDisabled)}>
                <p>Add</p>
                <AddRounded />
            </div>
            {skills.map(skill=> (
                <div className="pill disabled">
                    <p>{skill}</p>
                    <CloseRounded />
                </div>
            ))}
        </div>:

        <div className="pills-wrapper">
            <div className="pill inputPill">
                <input type="text" ref={inputRef} maxLength="30"/>
                <CheckRounded onClick={()=>{
                    newArr('add', inputRef.current.value)
                    setIsDisabled(!isDisabled)
                }} />
            </div>
            {skills.map((skill, i)=> (
                <div className="pill" key={i} >
                    <p>{skill}</p>
                    <CloseRounded onClick={()=>newArr('remove', skill)}/>
                </div>
            ))}
        </div>
            
        }
        
    </div>)
}