#! /usr/bin/env node

const path = require("path")
require("dotenv").config({
    path: path.join(__dirname, ".env")
})
const package = require("./package.json");
const readline = require("readline")
const {Configuration, OpenAIApi} = require("openai")

const messages = []

const openai = new OpenAIApi(new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY
}))

const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

cli.on("line", async input => {
    const userMessage = {
        role: "user",
        content: input
    }

    messages.push(userMessage)

    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
    })

    const content = res.data.choices[0].message.content

    const assistantMessage = {
        role: "assistant",
        content
    }

    messages.push(assistantMessage)

    console.log(content)
    cli.prompt()
})

console.log(`ChatGPT-CLI v(${package.version})`)
cli.prompt()