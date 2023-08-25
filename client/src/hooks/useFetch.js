import {useState, useEffect} from 'react';

const UseFetch = (url, options) => {
    const [fetchResult, setFetchResult] = useState({data: null, isPending: true, error: null})

    useEffect(()=>{
        fetch(url, options)
        .then(res=>{
                if(!res.ok){
                    throw Error('could not fetch data for that resource')
                }
                return res.json()
            })
            .then(data => {
                setFetchResult({data: data, isPending: false, error: null})
            })
            .catch(err => {
                setFetchResult({data: null, isPending: false, error: err.message})
            })
    },[url])

    return fetchResult
}
const UseFetchPost = (url, data) => {
    const [fetchResult, setFetchResult] = useState({success: false, isPending: true, error: null})

    useEffect(()=>{
        fetch(url, {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            data: JSON.stringify(data),
            credentials: 'include'
        }).then(() => {
            setFetchResult({success: true, isPending: false, error: null})
        }).catch(err => {
            setFetchResult({success: false, isPending: false, error: err.message})
        })
    },[url])

    return fetchResult
}
export default UseFetch;
export {UseFetchPost};
