import { PersonRounded, ArrowCircleRightOutlined as Arrow, FavoriteBorderRounded } from "@mui/icons-material"
import {NavLink} from 'react-router-dom'
import { CardLikeButton } from "./LikeButton";
export default function Card({post, auth}){
    //set page color
    let color;
    const today = new Date().getTime();
    if(new Date(post.endDate.join(' ')).getTime() < today){color = 'red'}
    else if(new Date(post.startDate.join(' ')).getTime() < today && post.endDate.length === 0){color = 'red'}
    else if(new Date(post.startDate.join(' ')).getTime() > today){color = 'blue'}
    else if(new Date(post.endDate.join(' ')).getTime() > today && 
    new Date(post.startDate.join(' ')).getTime() < today){color = 'green'}
    return(
        <div className={`card card-${color}`}>

            <div className="img"></div>

            <NavLink to={`/posts/${post._id}`} state={{post, color}}>
                <div className="card-content">
                    <div className="card-content-text">
                        <p className="card-event-name">{post.eventName}</p>
                        <p className="card-org-name">{post.orgName}</p>
                    </div>
                    <Arrow />
                </div>
            </NavLink>

            <div className="date"><span>{post.startDate[0]}</span><span>{post.startDate[1].slice(0, 3)}</span></div>
            {auth.auth && <CardLikeButton post={post} auth={auth}/>}
            
            
            <p className="volNb">
                <PersonRounded/>{post.volNb[0]}<span>/{post.volNb[1]}</span>
            </p>
            
        </div>
    )
}