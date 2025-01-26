import React, { useState } from "react";
import { db, auth } from "../firebase-config.js"; // Import Firestore and Firebase auth instances
import { doc, setDoc } from "firebase/firestore";

export const Info = ({ setIsSurveyCompleted, setRoom, setShowInfo }) => {

  const [formData, setFormData] = useState({
    dob: "",
    major: "",
    gender: "",
    phone: "",
    intensity: "",
    matching: "",
    collaboration: "",
    qualities: [
      "Creative",
      "Polite",
      "Direct",
      "Goal-Oriented",
      "Learning-Focused",
      "Exam-Centric",
      "Punctual",
      "Reliable",
      "Enthusiastic",
    ],
  });

  // Handle drag start
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index); // Store the index of the dragged item
    e.target.classList.add("dragging");
  };

  // Allow dropping by preventing default behavior
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle the drop event
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text/plain"); // Get the index of the dragged item
    const updatedQualities = [...formData.qualities];

    // Reorder the qualities array
    const [draggedItem] = updatedQualities.splice(draggedIndex, 1);
    updatedQualities.splice(targetIndex, 0, draggedItem);

    setFormData((prev) => ({ ...prev, qualities: updatedQualities })); // Update state
  };

  // Remove dragging class on drag end
  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const userProfileRef = doc(db, "profiles", user.uid); // Create or update the document for the user
        await setDoc(userProfileRef, formData, { merge: true });
        // alert("Profile submitted successfully!"); // notif from the website
        setIsSurveyCompleted(); // Switch to the next component (e.g., Chat)
      }
    } catch (error) {
      console.error("Error saving profile: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoBack = () => {
    setRoom(null); // Reset the room state
    setShowInfo(false); // Hide the Info component
  }

  return (
    <div>
      <h1>Sync Profile Setup</h1>
      <form onSubmit={handleSubmit}>
        
        <label>Date of Birth:</label>
        <input type="date" name="dob" onChange={handleChange} /><br />

        <label>Major:</label>
        <select name="major" onChange={handleChange}>
          <option value="">Select Major</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Biology">Biology</option>
          <option value="Economics">Economics</option>
        </select><br />

        <label>Gender:</label>
        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-Binary">Non-Binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select><br />

        <label>Phone Number:</label>
        <input type="text" name="phone" placeholder="Enter your phone number" onChange={handleChange} /><br />

        <label>Study Intensity Level:</label>
        <select name="intensity" onChange={handleChange}>
          <option value="">Select Intensity</option>
          <option value="Chillin">Chillin</option>
          <option value="Balanced">Balanced</option>
          <option value="Intense">Intense</option>
          <option value="Cracked">Cracked</option>
        </select><br />

        <label>Match with People Within:</label>
        <select name="matching" onChange={handleChange}>
          <option value="">Select Matching Preference</option>
          <option value="UCSD">UCSD</option>
          <option value="Major">Major</option>
          <option value="Department">Department</option>
        </select><br />

        <label>Collaboration Level:</label>
        <select name="collaboration" onChange={handleChange}>
          <option value="">Select Collaboration Level</option>
          <option value="Independent">Independent</option>
          <option value="Adaptive">Adaptive</option>
          <option value="Social">Social</option>
          <option value="Teamwork">Teamwork</option>
        </select><br />

        <label>Rank Qualities of Your Match:</label>
        <ul
          id="qualities"
          className="draggable-list"
          onDragOver={handleDragOver} // Allow dropping
        >
          {formData.qualities.map((quality, index) => (
            <li
              key={index}
              className="draggable"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index)} // Start dragging
              onDragEnd={handleDragEnd} // End dragging
              onDrop={(e) => handleDrop(e, index)} // Drop on a target
            >
              {quality}
            </li>
          ))}
        </ul>

        <style>
        {`
          .draggable-list {
            list-style: none;
            padding: 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            max-width: 300px;
          }

          .draggable {
            padding: 10px;
            margin: 5px 0;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: grab;
          }

          .draggable.dragging {
            opacity: 0.8;
            background-color: #d4e8fc;
          }
        `}
      </style>

        <button type="submit">Submit Profile</button>
      </form>

      <button onClick={handleGoBack} className="go-back-button">
          Go Back
        </button>

    </div>
  );
};
