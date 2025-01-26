import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { Auth } from "./elements/Auth.js";
import Cookies from 'universal-cookie'
import { Chat } from "./elements/Chat.js";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { Info } from "./elements/Info.js";

const cookies = new Cookies();

function App(){
    const [isAuth, setIsAuth] = useState(cookies.get("authtoken")) // grabs token from cookie to check is user is logged in
    const [room, setRoom] = useState(null)
    const roomInputRef = useRef(null) // used so that no change happens until the button is pressed
    const [isSurveyCompleted, setIsSurveyCompleted] = useState(false); // State for survey completion
    const [showInfo, setShowInfo] = useState(false); // State to control Info display

  
    // Fetch user data to check if the survey is completed
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const user = auth.currentUser; // Get the current logged-in user
          if (user) {
            const userDocRef = doc(db, "profiles", user.uid); // Reference to the user's profile document
            const userDoc = await getDoc(userDocRef); // Fetch the document
            if (userDoc.exists()) {
              setIsSurveyCompleted(true); // Survey is completed
            } else {
              setIsSurveyCompleted(false); // Survey not completed
              setShowInfo(true); // Force the Info screen if no profile is found
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
  
      if (isAuth) fetchUserProfile(); // Only fetch if the user is authenticated
    }, [isAuth]);
  
    const signOutUser = async () => {
      await signOut(auth);
      cookies.remove("authtoken"); // Delete cookie
      setIsAuth(false);
      setRoom(null);
      setIsSurveyCompleted(false); // Reset survey state
      setShowInfo(false); // Reset Info state
    };
  
    const handleInfoButtonClick = () => {
      setShowInfo(true); // Show the Info component
    };
  
    const handleSurveyComplete = () => {
      setIsSurveyCompleted(true); // Mark the survey as completed
      setShowInfo(false); // Hide the Info component
    };

    if(!isAuth){  
                  // if the user is not signed in then it prompts them to
    return (<div> <Auth setIsAuth={setIsAuth} /> </div>);
    }

    if (showInfo) {
        return <Info setIsSurveyCompleted={handleSurveyComplete} setRoom={setRoom} setShowInfo={setShowInfo} />;
      }

    return ( 
    <> 
        {room ? ( <div> <Chat room={room} setRoom= {setRoom}/> </div> ) // when the user is authenticated it prompts them to this page
        : (
         <div className="room"> 
         <label> Enter Room </label> 
         <input ref={roomInputRef}/>
         <button onClick={ () => setRoom(roomInputRef.current.value)}> Enter Chat </button>

         <div className="info">
        <button onClick={handleInfoButtonClick}>Information</button> 
      </div>

      <div className="signout"> 
            <button onClick={signOutUser}> Sign Out </button>
         </div>

         </div> // when the button is cliked it sets room to what is typed using a reference instead of onChange
                // info button can be pressed to change their survey information
         
        )}
      
    </>
    );
}

export default App;