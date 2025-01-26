import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from "firebase/firestore"
import { auth, db } from "../firebase-config.js"
// import "../styles/Chat.css";

export const Chat = (props) => {

    const { room, setRoom } = props; // Destructure the `setRoom` function from props // room is basically the person you're texting
    const [newMessage, setNewMessage] = useState("")
    const messagesRef = collection(db, "messages");
    const [message, setMessages] = useState([]);

    useEffect(() => {       // listens for changes in the query to update masssages
        const queryMessage = query(    // this query sets the order correctly using orderBy time is was created
            messagesRef, 
            where("room", "==", room),
            orderBy("createdAt")
        )

        const unsuscribe = onSnapshot(queryMessage, (snapshot) => { // uses firebase query to access message history
            let message = [];
            snapshot.forEach((doc) => {
                message.push({...doc.data(), id: doc.id});  // loops through all messages and displays them
            })
            setMessages(message);
        })

        return () => unsuscribe(); // clear allocated memory
    }, [])

    const handleSubmit = async (e) => {  //function to submit form (message)
        e.preventDefault();
        if (newMessage == "") return;

        await addDoc(messagesRef, {
            text: newMessage,               // message that was typed 
            createdAt: serverTimestamp(),   // time the message was created at
            user: auth.currentUser.displayName, // lot of user info can be used with this format
            room,     // dont need colon when they have same name

        });
        setNewMessage("")
    };

    const handleGoBack = () => {
        setRoom(null); // Reset the room state to null (or navigate to another page)
      };

    return (

        <div className="chat"> 
            <div className="header"> <h1> Welcome to {room} </h1> 
        </div>

            <div className="messages"> 
                {message.map((message) => (
                <div className="message" key={message.id}> 
                    <span className="user"> {message.user}: </span>
                    {message.text}
                 </div>  
                ))} 
            </div>
        <form onSubmit={handleSubmit} className="new-message-form">
            <input 
            className="new-message-input" 
            placeholder="Type Message" 
            onChange={ (e) => setNewMessage(e.target.value)}
            value={newMessage}
            />
            <button type="submit" className="send-button"> Send </button>

        
        </form>
        <button onClick={handleGoBack} className="go-back-button">
          Go Back
        </button>
     </div>

    );
};