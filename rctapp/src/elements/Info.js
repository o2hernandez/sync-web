import React, { useState } from "react";
import { db, auth } from "../firebase-config.js"; // Import Firestore and Firebase auth instances
import { doc, setDoc } from "firebase/firestore";

export const Info = ({ setIsSurveyCompleted }) => {
  const [formData, setFormData] = useState({
    dob: "",
    major: "",
    gender: "",
    phone: "",
    intensity: "",
    matching: "",
    collaboration: "",
    qualities: [],
  });

  const handleDragDrop = (draggedQualities) => {
    setFormData((prev) => ({ ...prev, qualities: draggedQualities }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const userProfileRef = doc(db, "profiles", user.uid); // Create or update the document for the user
        await setDoc(userProfileRef, formData, { merge: true });
        // alert("Profile submitted successfully!"); // notif from the website
        setIsSurveyCompleted(true); // Switch to the next component (e.g., Chat)
      }
    } catch (error) {
      console.error("Error saving profile: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        {/* Add drag-and-drop functionality for ranking */}
        {/* You can reuse your existing logic for this */}

        <button type="submit">Submit Profile</button>
      </form>
    </div>
  );
};
