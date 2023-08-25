import { useRef } from "react";

export default function Nav(props){
    const blueBtn = useRef();
    const greenBtn = useRef();
    const redBtn = useRef();
    function setActiveClass(btn){
        if(btn === 'blue'){
            blueBtn.current.className = 'blue active';
            if(props.green){greenBtn.current.className = 'green';}
            redBtn.current.className = 'red';
        }else if(btn === 'green'){
            blueBtn.current.className = 'blue';
            if(props.green){greenBtn.current.className = 'green active';}
            redBtn.current.className = 'red';
        }else if(btn === 'red'){
            blueBtn.current.className = 'blue';
            if(props.green){greenBtn.current.className = 'green';}
            redBtn.current.className = 'red active';
        }
    }
    return (
        <div className="nav">
            <button 
                ref={blueBtn}
                className={'blue active'} 
                onClick={()=>{
                    props.changeResource({name: props.blue, color: 'blue'});
                    setActiveClass('blue');
                }}>
                {props.blue}
            </button>

            {props.green && 
                <button 
                    ref={greenBtn}
                    className={'green'} 
                    onClick={()=>{
                        props.changeResource({name: props.green, color: 'green'})
                        setActiveClass('green');
                    }}>
                    {props.green}
                </button> 
            }

            <button 
                ref={redBtn}
                className={'red'} 
                onClick={()=>{
                    props.changeResource({name: props.red, color: 'red'})
                    setActiveClass('red');
                }}>
                {props.red}
            </button>
        </div>
    )
}


