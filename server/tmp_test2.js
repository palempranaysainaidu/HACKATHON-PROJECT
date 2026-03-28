require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Event = require('./models/Event');
const openai = require('./config/openai');
const { getPlanGeneratorPrompt } = require('./prompts/planGeneratorPrompt');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const event = await Event.findById('69c6ae4df3dfd1917c3b3dbd') || { name: 'Demo', type: 'cultural', date: new Date(), budget: 50000, audience: 300, city: 'Hyderabad' };
  
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert event planning assistant. Always respond with valid JSON arrays only.' },
        { role: 'user', content: getPlanGeneratorPrompt(event) }
      ],
      temperature: 0.7
    });
    
    const rawContent = completion.choices[0].message.content.trim();
    fs.writeFileSync('debug.log', 'RAW:\n' + rawContent);
    
    const firstBracket = rawContent.indexOf('[');
    const lastBracket = rawContent.lastIndexOf(']');
    const cleaned = rawContent.substring(firstBracket, lastBracket + 1);
    
    fs.appendFileSync('debug.log', '\n\nCLEANED:\n' + cleaned);
    
    const tasks = JSON.parse(cleaned);
    fs.appendFileSync('debug.log', '\n\nPARSE SUCCESS! length: ' + tasks.length);
  } catch(e) {
    fs.appendFileSync('debug.log', '\n\nERROR:\n' + e.stack);
  }
  
  process.exit(0);
}
run();
