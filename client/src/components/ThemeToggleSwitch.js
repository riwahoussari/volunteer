import { dividerClasses } from "@mui/material";
import { useState } from "react";
export default function ThemeToggleSwitch(){
    const [isDark, setIsDark] = useState(false)

    return (
        <div 
            className={`theme-toggle-switch ${isDark && 'theme-toggle-switch-dark'}`}
            onClick={()=>setIsDark(!isDark)}
        >
            <div className="theme-toggle-circle"/>
        </div>
    )
}