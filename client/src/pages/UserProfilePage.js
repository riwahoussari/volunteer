import Header from "../components/Header"
import ThemeToggleSwitch from '../components/ThemeToggleSwitch.js'
import ProfileInfoSection from "../components/ProfileInfoSection"
import useFetch from "../hooks/useFetch"
import { useNavigate } from "react-router-dom"

export default function UserProfilePage(){
    const navigate = useNavigate()
    const {data} = useFetch('http://localhost:2500/auth/user',{credentials: 'include'})
    function logout(){
        fetch(`http://localhost:2500/auth/logout`, {credentials: 'include'})
        .then(res=>{
            if(!res.ok){
                throw Error('could not log out user')
            }
            return res.json()
        })
        .then(data => {
            if(data.logedOut){navigate('../', {replace: true})}
            else{throw Error('could not log out user')}
        })
        .catch(err => {
            console.log(err.message);
        })
    }
    return (<>
        {data && !data.auth && navigate('../login', {replace: true})}
        {data && data.auth && <>
        <Header 
                icons={{left: ['back'], right:['favorite', 'history']}}
                text=''
        />

        <main className="profile-page-wrapper">
            <div className="profile">
                <img src={data.user.profilePic} />
                <p>{data.user.fullName}</p>
            </div>
            <div className="apperances">
                <p className="section-title">Apperances</p>
                <div>
                    <p>Dark Theme</p>
                    <ThemeToggleSwitch/>
                </div>
            </div>
            <div className="my-info">
                <p className="section-title">My Info</p>
                <p className="note">Note: the following information is only visible for organisations you apply to.</p>
                <div className="profile-info">
                    <ProfileInfoSection 
                        title='Personal Details'
                        key='Personal Details'
                        fields={[
                            {
                                type: 'text',
                                name: 'fullName',
                                value: data.user.fullName,
                                label: 'Full Name *'
                            },{
                                type: 'date',
                                name: 'dob',
                                value: data.user.dob,
                                label: 'Date Of Birth *'
                            },{
                                type: 'select',
                                name: 'gender',
                                value: data.user.gender.toLowerCase(),
                                label: 'Gender *'
                            },{
                                type: 'text',
                                name: 'address',
                                value: data.user.address,
                                label: 'Address'
                            }
                        ]}
                    />
                    <ProfileInfoSection 
                        title='Contact'
                        key='Contact'
                        fields={[
                            {
                                type: 'tel',
                                name: 'phoneNb',
                                value: data.user.phoneNb,
                                label: 'Phone Number *'
                            },{
                                type: 'email',
                                name: 'email',
                                value: data.user.email,
                                label: 'Email'
                            }
                        ]}
                    />
                    <ProfileInfoSection 
                        title='About Me'
                        key='About Me'
                        fields={[
                            {
                                type: 'pills',
                                name: 'skills',
                                value: data.user.skills,
                                label: 'Skills and Interests'
                            },{
                                type: 'textarea',
                                name: 'bio',
                                value: data.user.bio,
                                label: 'Bio'
                            }
                        ]}
                    />
                </div>

            </div>
            <button onClick={()=>logout()}>Log out</button>
        </main>
        </>}
    </>)
}