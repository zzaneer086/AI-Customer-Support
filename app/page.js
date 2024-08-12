"use client";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app, auth } from "../lib/firebaseConfig"; // Adjust the import path as necessary

export default function Home() {
  // State to store conversation history
  const [history, setHistory] = useState([]);
  // State to store current message input
  const [message, setMessage] = useState("");

  // Typing boolean for CSS animations
  const [typing, setTyping] = useState(false);

  // User authentication state
  const [user, setUser] = useState(null);

  const firstMessage =
    "Hi there! I'm the Headstarter virtual assistant. How can I help?";

  // Firebase Auth: Handle Sign In with Google
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Update user state on successful sign in
    } catch (error) {
      console.error("Error during sign in: ", error);
    }
  };

  // Firebase Auth: Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Update user state on successful sign out
    } catch (error) {
      console.error("Error during sign out: ", error);
    }
  };

  // Function to send message to chat bot
  const sendMessage = async () => {
    // Add user input to history
    setHistory((history) => [
      ...history,
      { role: "user", parts: [{ text: message }] },
    ]);
    // Clear input/curr message
    setMessage("");
    // Sending the actual request
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          ...history,
          { role: "user", parts: [{ text: message }] },
        ]),
      });

      const data = await response.json();
      // Add model's response to convo
      setHistory((history) => [
        ...history,
        { role: "model", parts: [{ text: data }] },
      ]);
    } catch (error) {
      console.error("error getting chatbot response:", error);
      setHistory((history) => [
        ...history,
        {
          role: "model",
          parts: [{ text: "Oops! Something went wrong. Please try again." }],
        },
      ]);
    }
  };

  useEffect(() => {
    // Optional: Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Box
      onClick={function (e) {
        e.target.id === "textfield" ? setTyping(true) : setTyping(false);
      }}
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "black",
        position: "relative", // Added to position the owl image properly
      }}
    >
      <Box
        sx={{
          width: "50vw",
          marginBottom: "50px",
        }}
      >
        {/* Always visible Owl Image */}
        <img className={"glow owl"} src="/owl.svg" alt="Owl" />

        {/* Sign Out Button */}
        {user && (
          <Button
            variant="contained"
            onClick={handleSignOut}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "cyan",
              border: "1px solid cyan",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "cyan",
                transform: "translate(-3px, -3px)",
                boxShadow: "3px 3px 0 blue",
              },
            }}
          >
            Sign Out
          </Button>
        )}

        <img
          className={typing ? "pupil glow focused" : "pupil glow idle"}
          id="left-pupil"
          src="/pupil.svg"
          alt="Left Pupil"
        />
        <img
          className={typing ? "pupil glow focused" : "pupil glow idle"}
          id="right-pupil"
          src="/pupil.svg"
          alt="Right Pupil"
        />

        {/* Chat History */}
        <Box
          maxHeight={"550px"}
          marginLeft={"15vw"}
          overflow={"hidden auto"}
          padding={"10px"}
        >
          <Typography>{firstMessage}</Typography>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {history.map((msg, index) => (
              <Typography
                key={index}
                align={msg.role === "user" ? "right" : "left"}
              >
                {msg.role === "user" ? "You: " : "Bot: "} {msg.parts[0].text}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* Input Field */}
        <TextField
          id="textfield"
          multiline
          rows={5}
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          sx={{
            boxSizing: "border-box",
            border: "2px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f8f8f8",
            marginTop: "10px",
            marginLeft: "15vw",
            width: "35vw",
            resize: "none",
            transition: "0.2s",
            transform: typing ? "translate(-3px, -3px)" : "translate(0, 0)",
            boxShadow: typing ? "3px 3px 0 cyan" : "0 0 0 transparent",
            "&:hover": {
              transform: "translate(-3px, -3px)",
              boxShadow: "3px 3px 0 cyan",
            },
          }}
        />

        {/* Sign In Button */}
        {!user && (
          <Button
            variant="contained"
            onClick={handleSignIn}
            sx={{
              mt: 1,
              backgroundColor: "cyan",
              border: "1px solid cyan",
              marginTop: "5px",
              float: "right",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "cyan",
                transform: "translate(-3px, -3px)",
                boxShadow: "3px 3px 0 blue",
              },
            }}
          >
            Sign In with Google
          </Button>
        )}

        {/* Send Button */}
        {user && (
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              mt: 1,
              backgroundColor: "transparent",
              border: "1px solid cyan",
              marginTop: "5px",
              float: "right",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "translate(-3px, -3px)",
                boxShadow: "3px 3px 0 cyan",
              },
            }}
          >
            Send
          </Button>
        )}
      </Box>
    </Box>
  );
}
