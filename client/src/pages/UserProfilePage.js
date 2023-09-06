import Header from "../components/Header"
import ThemeToggleSwitch from '../components/ThemeToggleSwitch.js'
import ProfileInfoSection from "../components/ProfileInfoSection"
import { useNavigate } from "react-router-dom"
import { useUser } from "../hooks/useUser"

export default function UserProfilePage(){

    const navigate = useNavigate()
    const userInfo = useUser();

    function logout(){
        fetch(`http://localhost:2500/auth/logout`, {credentials: 'include'})
        .then(res=>{
            if(!res.ok){
                throw Error('could not log out user')
            }
            return res.json()
        })
        .then(data => {
            if(data.logedOut){
                sessionStorage.removeItem('userInfo')
                navigate('../', {replace: true})
            }
            else{throw Error('could not log out user')}
        })
        .catch(err => {
            console.log(err.message);
        })
    }
    
    return (<>
        {userInfo.isPending && <h1>Pending...</h1>}
        {!userInfo.isPending && !userInfo.auth && navigate('../login', {replace: true})}
        {/* user profile page */}
        {!userInfo.isPending && userInfo.auth && userInfo.user.userType === 'user' && <> 
        <Header 
                icons={{left: ['homeBack'], right:['favorite', 'history']}}
                text=''
        />

        <main className="profile-page-wrapper">
            <div className="profile">
                <img src={userInfo.user.profilePic} />
                <p>{userInfo.user.fullName}</p>
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
                                value: userInfo.user.fullName,
                                label: 'Full Name *'
                            },{
                                type: 'date',
                                name: 'dob',
                                value: userInfo.user.dob,
                                label: 'Date Of Birth *'
                            },{
                                type: 'select',
                                name: 'gender',
                                value: userInfo.user.gender.toLowerCase(),
                                label: 'Gender *'
                            },{
                                type: 'text',
                                name: 'address',
                                value: userInfo.user.address,
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
                                value: userInfo.user.phoneNb,
                                label: 'Phone Number *'
                            },{
                                type: 'email',
                                name: 'email',
                                value: userInfo.user.email,
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
                                value: userInfo.user.skills,
                                label: 'Skills and Interests'
                            },{
                                type: 'textarea',
                                name: 'bio',
                                value: userInfo.user.bio,
                                label: 'Bio'
                            }
                        ]}
                    />
                </div>

            </div>
            <button onClick={()=>logout()}>Log out</button>
        </main>
        </>}
        {/* org profile page */}
        {!userInfo.isPending && userInfo.auth && userInfo.user.userType === 'org' && <> 
        <Header 
                icons={{left: ['home'], right:['myPosts']}}
                text=''
        />

        <main className="profile-page-wrapper">
            <div className="profile">
                <img src={userInfo.user.profilePic} />
                <p>{userInfo.user.orgName}</p>
            </div>
            <div className="apperances">
                <p className="section-title">Apperances</p>
                <div>
                    <p>Dark Theme</p>
                    <ThemeToggleSwitch/>
                </div>
            </div>
            <div className="my-info">
                <p className="section-title">Org Info</p>
                <div className="profile-info">
                <ProfileInfoSection 
                        title='Basic Information'
                        key='Basic Information'
                        fields={[
                            {
                                type: 'text',
                                name: 'orgName',
                                value: userInfo.user.orgName,
                                label: 'Organization Name'
                            },{
                                type: 'pills',
                                name: 'address',
                                value: userInfo.user.address,
                                label: 'Address'
                            },{
                                type: 'text',
                                name: 'website',
                                value: userInfo.user.website,
                                label: 'Website'
                            }
                        ]}
                    />
                    <ProfileInfoSection 
                        title='Contact'
                        key='contact'
                        fields={[
                            {
                                type: 'pills',
                                name: 'phoneNb',
                                value: userInfo.user.phoneNb,
                                label: 'Phone Number'
                            },{
                                type: 'pills',
                                name: 'email',
                                value: userInfo.user.email,
                                label: 'Email'
                            }
                        ]}
                    />
                    <ProfileInfoSection 
                        title='About'
                        key='about'
                        fields={[
                            {
                                type: 'textarea',
                                name: 'mission',
                                value: userInfo.user.mission,
                                label: 'Mission'
                            },{
                                type: 'textarea',
                                name: 'vision',
                                value: userInfo.user.vision,
                                label: 'Vision'
                            },{
                                type: 'textarea',
                                name: 'about',
                                value: userInfo.user.about,
                                label: 'About'
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