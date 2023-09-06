import { useState, useEffect } from "react";

export function useUser(){
    const [userInfo, setUserInfo] = useState({
        auth: null,
        user: null,
        isPending: true
    })

    useEffect(()=>{
        if(!('userInfo' in sessionStorage)){
            fetch(`http://localhost:2500/auth/user`, {credentials: 'include'})
            .then(res=>{
                    if(!res.ok){
                        throw Error('could not fetch data for that resource')
                    }
                    return res.json()
                })
                .then(data => {
                    setUserInfo({auth: data.auth, user: data.user, isPending: false})
                    sessionStorage.setItem('userInfo', JSON.stringify({auth: data.auth, user: data.user}))
                })
                .catch(err => {
                    setUserInfo({auth: null, user: null})
                    console.log(err.message)
                })
        }else{
            let storedUserInfo = sessionStorage.getItem('userInfo');
            setUserInfo({...JSON.parse(storedUserInfo), isPending: false});
        }
    }, [])

    return userInfo;
} 

