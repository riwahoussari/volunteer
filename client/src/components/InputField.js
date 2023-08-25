import { CheckRounded, EditRounded } from "@mui/icons-material"
import { useRef, useState } from "react"
export default function InputField(props){
    const [isDisabled , setIsDisabled] = useState(true)
    let input;
    const [inputValue, setInputValue] = useState(props.value);
    const inputRef = useRef();
    if(props.type === 'select'){
        let options;
        // if(props.value === 'male'){
        //     options = (<>
        //         <option value='male' selected>Male</option>
        //         <option value='female'>Female</option>
        //     </>)
        // }else{
        //     options = (<>
        //         <option value='male'>Male</option>
        //         <option value='female' selected>Female</option>
        //     </>)
        // }
        console.log(props.value.toLowerCase())
        if(isDisabled){
            input = (
                <select ref={inputRef} name={props.name} disabled defaultValue='male'>
                    {/* {options} */}
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                </select>
            )
        }else{
            input = (
                <select ref={inputRef} name={props.name} defaultValue='male'>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    {/* {options} */}
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
        fetch('http://localhost:2500/user', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({[key]: value}),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){setInputValue(value)}
        })
        .catch((err) => console.log(err))
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