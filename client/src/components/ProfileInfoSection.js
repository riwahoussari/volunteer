import { useState } from "react"
import InputField from "./InputField"
import Pills from './Pills.js'
import { KeyboardArrowRightRounded as RightArrow, KeyboardArrowDownRounded as DownArrow } from "@mui/icons-material"
export default function ProfileInfoSection({fields, title}){
    const [isHidden, setIsHidden] = useState(true)
    return(<div className="profile-info-section">
        <h2 onClick={()=>setIsHidden(!isHidden)}>
            {isHidden ? <RightArrow /> : <DownArrow />}
            {title}
        </h2>
        <fieldset className={isHidden && 'hiddenFieldset'}>
            {fields.map(field=>{
                if(field.type === 'pills'){
                    return <Pills
                        name={field.name}
                        value={field.value}
                        label={field.label}
                    />
                }else{
                   return <InputField
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    label={field.label}
                /> 
                }
                
            })}
        </fieldset>
    </div>)
}