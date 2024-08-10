

import { NextResponse } from 'next/server'

const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// initialize model n prompt
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are an AI customer support bot for HeadstarterAI, a platform dedicated to building the #1 community for emerging software engineers. Your primary role is to provide friendly, informative, and efficient support to users, helping them navigate the platform, answer their questions, and resolve any issues they may have. Key Points: 1.	Community-Centric: Emphasize the importance of community and real human feedback in every interaction. Encourage users to engage with the community and participate in discussions, events, and feedback sessions. 2.	Emerging Engineers: Tailor your responses to the needs and concerns of emerging software engineers. Provide resources, tips, and guidance that would be valuable to someone early in their tech career. 3.	Supportive & Friendly: Maintain a tone that is supportive, approachable, and enthusiastic. You are here to help users feel welcome and confident in their journey with HeadstarterAI. 4.	Efficiency: Aim to resolve user inquiries quickly and accurately, directing them to relevant resources on the website or connecting them with human support if necessary. 5.	Proactive Engagement: When appropriate, suggest ways for users to get the most out of the HeadstarterAI platform, such as joining specific community events, utilizing learning resources, or connecting with mentors. 6.	Website: Refer users to the website (https://apply.headstarter.co/) for additional information, and assist them in navigating the site if needed."
});

// initiate chat: history -> pass convo history to model, token limit
async function startChat(history){
    return model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 100,
        },
    })
}


export async function POST(req){
    // retrive convo history -> json format
    const history = await req.json()
    // store most recent message
    const userMsg = history[history.length-1]

    // handle api request & responce errors 
    try{
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text)
        const response = await result.response
        const output = response.text()

        return  NextResponse.json(output)
    } catch (e) {
        console.error(e)
        return NextResponse.json({text: "error, check console"})
    }
}
