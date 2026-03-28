const Event = require('../models/Event');
const Task = require('../models/Task');
const Budget = require('../models/Budget');
const VolunteerApplication = require('../models/VolunteerApplication');
const Venue = require('../models/Venue');
const openai = require('../config/openai');

const callGemini = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gemini-2.5-flash',
    messages: [{ role: 'user', content: prompt }]
    // Intentionally omitting max_tokens to prevent Google API truncation 500 error!
  });
  return response.choices[0].message.content;
};

const extractJSON = (text) => {
  const start = text.indexOf('[');
  const startObj = text.indexOf('{');
  const actualStart = start !== -1 && (startObj === -1 || start < startObj) ? start : startObj;
  
  const end = text.lastIndexOf(']');
  const endObj = text.lastIndexOf('}');
  const actualEnd = end !== -1 && (endObj === -1 || end > endObj) ? end : endObj;
  
  if (actualStart === -1 || actualEnd === -1) throw new Error("No JSON found");
  return JSON.parse(text.substring(actualStart, actualEnd + 1));
};

exports.initializeEvent = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const jsonStr = await callGemini(`Parse this event idea into JSON with fields: name, type(cultural, technical, sports, academic, social, fundraiser, other), description, expectedAudience(number), volunteersNeeded(number), minVolunteersForTaskDivision(number), requiredSkills(array of 5-8 strings, e.g. ["Event Registration", "Crowd Control", "A/V Setup", "Security", "Photography", "Stage Management"]). Idea: ${prompt}`);
    res.json({ success: true, parsed: extractJSON(jsonStr) });
  } catch (err) { next(err); }
};

exports.generatePlan = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const jsonStr = await callGemini(`Create 15 tasks for the event ${event.name} of type ${event.type}. Return ONLY a JSON array of objects with fields: title, description, category(logistics, marketing, permissions, volunteers, finance, technical, general), assignedRole(string label), priority(high, medium, low). No Markdown.`);
    const tasks = extractJSON(jsonStr).map(t => ({ ...t, eventId: event._id, createdBy: 'ai' }));
    await Task.insertMany(tasks);
    event.planGenerated = true;
    await event.save();
    res.json({ success: true, message: 'Plan generated' });
  } catch (err) { next(err); }
};

exports.generateEmails = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const jsonStr = await callGemini(`Write 3 email drafts for event ${event.name}: permission, sponsorship, volunteer recruitment. Return JSON: { permissionEmail: "", sponsorshipEmail: "", volunteerEmail: "" }`);
    res.json({ success: true, drafts: extractJSON(jsonStr) });
  } catch (err) { next(err); }
};

exports.estimateBudget = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const jsonStr = await callGemini(`Estimate budget for ${event.name} expected audience ${event.expectedAudience} with total ${event.totalBudget} INR. Return JSON array with: category(venue, catering, decoration, sound_av, marketing, transportation, prizes, security, miscellaneous), description, estimatedAmount(number). Array sum must equal total.`);
    const items = extractJSON(jsonStr).map(b => ({ ...b, eventId: event._id }));
    await Budget.insertMany(items);
    res.json({ success: true, message: 'Budget estimated' });
  } catch (err) { next(err); }
};

exports.predictRisks = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const jsonStr = await callGemini(`Identify 5 security/operations risks for event ${event.name} with expected audience ${event.expectedAudience} in ${event.city}. Return JSON array with: risk(name), severity(low, medium, high, critical), mitigation(description).`);
    event.securityRisks = extractJSON(jsonStr);
    await event.save();
    res.json({ success: true, risks: event.securityRisks });
  } catch (err) { next(err); }
};

exports.assignVolunteerRoles = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const volunteers = await VolunteerApplication.find({ eventId: event._id, status: 'accepted' }).populate('volunteerId', 'name');
    
    if (volunteers.length === 0) return res.status(400).json({ message: 'No accepted volunteers to assign' });

    const volData = volunteers.map(v => ({ id: v._id, name: v.volunteerId.name, skills: v.skills }));
    const jsonStr = await callGemini(`Assign roles to these volunteers for event ${event.name}. Volunteers: ${JSON.stringify(volData)}. Return JSON array of objects: { volunteerId, assignedRole, taskGroup, rationale }`);
    
    const assignments = extractJSON(jsonStr);
    for (const a of assignments) {
      await VolunteerApplication.findByIdAndUpdate(a.volunteerId, { assignedRole: a.assignedRole, taskGroup: a.taskGroup });
    }
    
    res.json({ success: true, assignments });
  } catch (err) { next(err); }
};

exports.assignTasksToVolunteers = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const tasks = await Task.find({ eventId: event._id, status: { $ne: 'completed' }, assignedTo: null });
    if (tasks.length === 0) return res.status(400).json({ message: 'No unassigned pending tasks available to distribute.' });

    const volunteers = await VolunteerApplication.find({ eventId: event._id, status: 'accepted' }).populate('volunteerId', 'name');
    if (volunteers.length < (event.minVolunteersForTaskDivision || 1)) {
      return res.status(400).json({ message: `Need at least ${event.minVolunteersForTaskDivision || 1} accepted volunteers to responsibly auto-assign tasks. You currently have ${volunteers.length}. Please hire more personnel.` });
    }

    const taskData = tasks.map(t => ({ id: t._id, title: t.title, category: t.category }));
    const volData = volunteers.map(v => ({ id: v.volunteerId._id, name: v.volunteerId.name, skills: v.skills }));

    const jsonStr = await callGemini(`Distribute these tasks among these volunteers evenly based on capability. Tasks: ${JSON.stringify(taskData)}. Volunteers: ${JSON.stringify(volData)}. Return ONLY a JSON array mapping every task to one volunteer: [{ "taskId": "string", "volunteerId": "string" }]`);
    
    const assignments = extractJSON(jsonStr);
    for (const a of assignments) {
      await Task.findByIdAndUpdate(a.taskId, { assignedTo: a.volunteerId });
    }
    
    res.json({ success: true, count: assignments.length });
  } catch (err) { next(err); }
};

exports.suggestVenues = async (req, res, next) => {
  try {
    const { city, expectedAudience, eventType, budget } = req.body;
    const venues = await Venue.find({ city: new RegExp(city, 'i'), capacity: { $gte: Number(expectedAudience) } }).limit(10);
    
    if (venues.length === 0) return res.json({ success: true, suggestions: [] });
    
    const venueData = venues.map(v => ({ id: v._id, name: v.name, capacity: v.capacity, price: v.pricePerDay }));
    const jsonStr = await callGemini(`Pick the best 3 venues from this list for a ${eventType} event with audience ${expectedAudience} and budget ${budget}. List: ${JSON.stringify(venueData)}. Return JSON array with: { id, name, reasoning }`);
    
    res.json({ success: true, suggestions: extractJSON(jsonStr) });
  } catch (err) { next(err); }
};
