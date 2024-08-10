'use client'
import { Box, Stack, TextField, Button, Typography } from "@mui/material"
import Image from "next/image";
// state var to store messages
import { useState } from "react"

export default function Home() {
  // to store the convo.
  const [history, setHistory] = useState([])
  // store the input/curr message
  const [message, setMessage] = useState("")

  const firstMessage = "Hi there! I'm the Headstarter virtual assistant. How can I help?"

  
  // send message to chat bot
  const sendMessage = async () => {
    // add user input to history
    setHistory((history) => [ ...history, { role: "user", parts: [{text: message }] }])
    // clear input/curr message
    setMessage('')
    // sending the actual reqest 
    try{
      const responce =await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...history, { role: "user", parts: [{ text: message }] }])
      })

      const data =await responce.json()
      // add model's responce to convo
      setHistory((history) => [...history, {role: "model", parts: [{text: data}] }])
    } catch (error) {
      console.error("error getting chatbot responce:", error)
      setHistory((history) => [...history, { role: "model", parts: [{ text: "Oops! Something went wrong. Please try again." }] }])
    }
  }
  


  // temp chat generated UI -->>

  return (
    <Box sx={{ p: 2 }}>
      {/* Chat History */}
      <Typography>{firstMessage}</Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        {history.map((msg, index) => (
          <Typography key={index} align={msg.role === "user" ? "right" : "left"}>
            {msg.role === "user" ? "You: " : "Bot: "} {msg.parts[0].text}
          </Typography>
        ))}
      </Stack>

      {/* Input Field */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />

      {/* Send Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={sendMessage} 
        sx={{ mt: 1 }}>
        Send
      </Button>
    </Box>
  )
}
