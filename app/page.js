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

  // Typing boolean for CSS animations
  const [typing, setTyping] = useState(false)

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
  


  // temp chatgpt generated UI -->>

  return (
    <Box onClick={function(e){ e.target.id == 'textfield' ? setTyping(true) : setTyping(false)}} 
    sx={{   
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: 'black'
    }}>
      <Box sx={{
        width: '50vw', marginBottom: '50px'
      }}>
        {/* <img className={"glow eye"} id="left-eye" src="eye.svg"/> */}
        <img className={"glow owl"} src="owl.svg"/>
        <img className={typing ? "pupil glow focused" : "pupil glow idle"} id="left-pupil" src="pupil.svg"/>
        {/* <img className={"glow eye"} id="right-eye" src="eye.svg"/> */}
        <img className={typing ? "pupil glow focused" : "pupil glow idle"} id="right-pupil" src="pupil.svg"/>

        {/* Chat History */}
        {/* hard coded in first message  */}
        <Box maxHeight={'550px'} marginLeft={'15vw'} overflow={"hidden auto"} padding={'10px'}>
        <Typography>{firstMessage}</Typography>

        {/* using a stack to store chat history vertically.  */}
          <Stack spacing={2} sx={{ mb: 2 }}>
            {/* iterate through stack to display all chats! */}
            {history.map((msg, index) => (
              <Typography key={index} align={msg.role === "user" ? "right" : "left"}>
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
          // input -> message, so that it can display 
          value={message}
          // to update with input
          onChange={(e) => setMessage(e.target.value)}
          // enter key action
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          sx={{
            boxSizing: 'border-box',
            border: '2px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f8f8f8',
            marginTop: '10px',
            marginLeft: '15vw',
            width:'35vw',
            resize: 'none',
            transition: '0.2s',
            transform: typing ? 'translate(-3px, -3px)' : 'translate(0, 0)',
            boxShadow: typing ? "3px 3px 0 cyan": "0 0 0 transparent",
            "&:hover" : {
              transform: 'translate(-3px, -3px)',
              boxShadow: "3px 3px 0 cyan",
            }
          }}
        />

        {/* Send Button */}
        <Button 
          variant="contained" 
          // call the sendMessage function!
          onClick={sendMessage} 
          sx={{ 
            mt: 1,
            backgroundColor: "transparent",
            border: "1px solid cyan",
            marginTop: '5px',
            float: 'right',
            transition: '0.2s',
            "&:hover" : {
              backgroundColor: 'transparent',
              transform: 'translate(-3px, -3px)',
              boxShadow: "3px 3px 0 cyan",
            }
          }}>
          Send
        </Button>
      </Box>
    </Box>
  )
}
