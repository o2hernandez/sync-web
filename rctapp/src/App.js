import React, { useState, useRef } from "react";
import "./App.css";
import { Auth } from "./elements/Auth.js";
import Cookies from 'universal-cookie'
import { Chat } from "./elements/Chat.js";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import { Info } from "./elements/Info.js"

const cookies = new Cookies();

function App(){
    const [isAuth, setIsAuth] = useState(cookies.get("authtoken")) // grabs token from cookie to check is user is logged in
    const [room, setRoom] = useState(null)
    const roomInputRef = useRef(null) // used so that no change happens until the button is pressed

    const [isSurveyCompleted, setIsSurveyCompleted] = useState(false); // Add survey completion state

    const signOutUser = async () => {
        await signOut(auth);
        cookies.remove("authtoken");  // delete cookie
        setIsAuth(false);
        setRoom(null);
    };

    if(!isAuth){  
                  // if the user is not signed in then it prompts them to
    return (<div> <Auth setIsAuth={setIsAuth} /> </div>);
    }

    if (!isSurveyCompleted) {
        // Display the Info component for profile setup
        return <Info setIsSurveyCompleted={setIsSurveyCompleted} />;
      }

    return ( 
    <> 
        {room ? ( <div> <Chat room={room}/> </div> ) // when the user is authenticated it prompts them to this page
        : (
         <div className="room"> 
         <label> Enter Room </label> 
         <input ref={roomInputRef}/>
         <button onClick={ () => setRoom(roomInputRef.current.value)}> Enter Chat Bitch </button>
         </div> // when the button is cliked it sets room to what is typed using a reference instead of onChange
        )}
        <div className="signout"> 
            <button onClick={signOutUser}> Sign Out </button>
         </div>
    </>
    );
}

export default App;