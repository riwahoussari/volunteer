import { FilterAltRounded, SortRounded } from "@mui/icons-material"
export default function PostsTitle(props){
    return (
        <div className="postsTitle">
            <p>{props.text} events</p>
            <div>
                <div>
                    <FilterAltRounded />
                    <p>filter</p>
                </div>
                <div>
                    <SortRounded />
                    <p>sort</p>
                </div>
            </div>
        </div>
    )
}