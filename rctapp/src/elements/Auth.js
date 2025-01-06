import {auth, provider} from "../firebase-config.js";
import {signInWithPopup} from "firebase/auth";
import Cookies from 'universal-cookie'
const cookies = new Cookies();
import "./Auth.css";

export const Auth = (props) => {
    const {setIsAuth} = props; 

    const signInWithGoogle = async () => { 

        try {                       // catching any sign in errors
        const result = await signInWithPopup(auth, provider);   
        cookies.set("authtoken", result.user.refreshToken)  // saves the users infomation in a token
        setIsAuth(true);                                    // and stores token in the cookie
        }                                                   // 
        catch (err){
            console.error(err);
        }
        
    };
            // sign in button for auth page
    return ( 
     <div className="auth">
         <p> Sign In Bitch </p>   
         <button onClick={signInWithGoogle}> Sign in with Google </button>
    </div>
    );
};  // button calls the function from  firebase