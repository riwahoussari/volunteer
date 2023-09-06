import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useRef } from "react";

export function LoginPage(){
    return(<>
        <Header icons={{left: ['home'], right:['']}}/>
    
        <div className="reg-page0-wrapper">
            <h2>LogIn As</h2>
    
            <div className="reg-as-buttons">
                <Link to='/login/user'><button className="reg-as-vol">VOLUNTEER</button></Link>
                <Link to='/login/org'><button className="reg-as-org">ORGANIZATION</button></Link>
            </div>
    
            <div className="line"/>

            <div className="login-wrapper">
                <p>Don't have an account?</p>
                <Link to="/register">
                <button className="login">Create Account</button>
                </Link>
            </div>
    
        </div>
    </>)
}
export function UserLoginPage(){
    const navigate = useNavigate();
    const usernameRef = useRef(), passwordRef = useRef();
    function handleSubmit(e){
        e.preventDefault()
        fetch('http://localhost:2500/auth/local/login/user', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            }),
            credentials: 'include'
        }).then(res => {
            if(!res.ok){throw Error("couldn't log you in")}
            return res.json()
        }).then(res => {
            if(res.success){
                navigate('../../', {replace: true})
                sessionStorage.setItem('userInfo', JSON.stringify({auth: true, user: res.user}) )
            }else{
                throw Error(res.message)
            }
        }).catch(err => console.log(err))
    }
    return (<>
    <Header icons={{left: ['home'], right:['createAccount']}}/>

    <div className="login-page-wrapper">
        <h2>Log In</h2>

        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="input-wrapper">
                <label>Username</label>
                <input type="text" name="username" ref={usernameRef}/>
            </div>
            <div className="input-wrapper">
                <label>Password</label>
                <input type="password" name="password" ref={passwordRef}/>
            </div>
            <button type="submit">Log In</button>
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
                    Sign in with Facebook
                </button>
            </a>
            <button className="apple">
                Sign in with Apple
            </button>
        </div>

    </div>
    </>)
}
export function OrgLoginPage(){
    const navigate = useNavigate();
    const usernameRef = useRef(), passwordRef = useRef();
    function handleSubmit(e){
        e.preventDefault()
        fetch('http://localhost:2500/auth/local/login/org', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            }),
            credentials: 'include'
        }).then(res => {
            if(!res.ok){throw Error("couldn't log you in")}
            return res.json()
        }).then(res => {
            if(res.success){
                navigate('../../', {replace: true})
                sessionStorage.setItem('userInfo', JSON.stringify({auth: true, user: res.user}))
            }else{
                throw Error(res.message)
            }
        }).catch(err => console.log(err))
    }
    return (<>
    <Header icons={{left: ['home'], right:['createAccount']}}/>

    <div className="login-page-wrapper">
        <h2>Log In</h2>

        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="input-wrapper">
                <label>Username</label>
                <input type="text" name="username" ref={usernameRef}/>
            </div>
            <div className="input-wrapper">
                <label>Password</label>
                <input type="password" name="password" ref={passwordRef}/>
            </div>
            <button type="submit">Log In</button>
        </form>

    </div>
    </>)
}
