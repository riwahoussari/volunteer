import {HomeRounded as HomeIcon, AccountCircleRounded, FavoriteBorderRounded, HistoryRounded, MoreHorizRounded, KeyboardBackspaceRounded as Back, ShareRounded, LocationOnRounded } from '@mui/icons-material/'
import { useNavigate, Link} from 'react-router-dom'
export default function Header(props){
    const {right, left} = props.icons;
    const navigate = useNavigate();
    let state='';
    if(props.state){state = props.state};

    return (
        <header>
            <div className='leftIcons'>
                {left.includes('history') && <Link state={state} to='/history'><HistoryRounded/></Link>}
                {left.includes('favorite') && <Link state={state} to='/favorites'><FavoriteBorderRounded/></Link>}
                {left.includes('back') && <Back onClick={()=>navigate(-1, {replace: true})}/>}
                {left.includes('home') && <HomeIcon/>}

                {left.includes('signup') && <Link state={state} to='/register'><button type='button'>SIGN UP</button></Link>}
            </div>
            <p>{props.text}</p>
            <div className='rightIcons'>
                {right.includes('history') && <HistoryRounded />}
                {right.includes('favorite') && <FavoriteBorderRounded/>}
                {right.includes('profile') && <Link state={state} to='/profile'><AccountCircleRounded/></Link>}
                {right.includes('menu') && <MoreHorizRounded/>}
                {right.includes('home') && <HomeIcon/>}
                {right.includes('share') && <ShareRounded/>}

                {right.includes('login') && <Link state={state} to='/login'><button type='button'>LOG IN</button></Link>}
                {right.includes('createAccount') && <Link state={state} to='/register'><button type='button'>Create Account</button></Link>}
            </div>
        </header>
    )
}