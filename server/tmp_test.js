require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Task = require('./models/Task');
const { generatePlan } = require('./controllers/ai.controller');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const req = { params: { eventId: '69c6ae4df3dfd1917c3b3dbd' } };
  const res = { 
    status: (s) => ({ json: (data) => console.log('RESPONSE STATUS:', s, data) }),
    json: (data) => console.log('RESPONSE JSON:', JSON.stringify(data, null, 2))
  };
  const next = (err) => console.error('CAUGHT NEXT ERROR:', err);
  
  console.log('Calling generatePlan...');
  await generatePlan(req, res, next);
  
  process.exit(0);
}

run().catch(console.error);
