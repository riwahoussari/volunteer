import {useUser} from "../hooks/useUser.js";
export default function Test(){
    console.log(useUser())
    return <>
      <h1>Test</h1>
    </>
}