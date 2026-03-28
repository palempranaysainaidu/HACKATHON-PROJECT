const openai = require('../config/openai');
const Event = require('../models/Event');
const Task = require('../models/Task');
const Budget = require('../models/Budget');
const Email = require('../models/Email');
const { generateSlug } = require('../utils/slugGenerator');
const { getEventInitPrompt } = require('../prompts/eventInitPrompt');
const { getPlanGeneratorPrompt } = require('../prompts/planGeneratorPrompt');
const { getEmailGeneratorPrompt } = require('../prompts/emailGeneratorPrompt');
const { getBudgetEstimatorPrompt } = require('../prompts/budgetEstimatorPrompt');
const { getRiskPredictorPrompt } = require('../prompts/riskPredictorPrompt');

/**
 * Parse natural language event description and create event
 */
const initializeEvent = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: getEventInitPrompt() },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    });

    let parsed;
    try {
      const rawContent = completion.choices[0].message.content.trim();
      // Extract JSON object safely handling preamble
      const firstBrace = rawContent.indexOf('{');
      const lastBrace = rawContent.lastIndexOf('}');
      const cleaned = rawContent.substring(firstBrace, lastBrace + 1);
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: 'AI response was not valid JSON. Please try again.' });
    }

    const slug = generateSlug(parsed.name || 'event');

    const event = await Event.create({
      userId: req.user._id,
      name: parsed.name,
      type: parsed.type || 'other',
      date: parsed.date ? new Date(parsed.date) : new Date(Date.now() + 30 * 86400000),
      location: parsed.location,
      city: parsed.city,
      audience: parsed.audience || 100,
      budget: parsed.budget || 0,
      theme: parsed.theme,
      description: parsed.description,
      slug,
      timeline: parsed.timeline || [],
      status: 'draft'
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate complete task list for event
 */
const generatePlan = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert event planning assistant. Always respond with valid JSON arrays only.' },
        { role: 'user', content: getPlanGeneratorPrompt(event) }
      ],
      temperature: 0.7
    });

    let tasksData;
    try {
      const rawContent = completion.choices[0].message.content.trim();
      const firstBracket = rawContent.indexOf('[');
      const lastBracket = rawContent.lastIndexOf(']');
      const cleaned = rawContent.substring(firstBracket, lastBracket + 1);
      tasksData = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: 'AI response was not valid JSON. Please try again.' });
    }

    if (!Array.isArray(tasksData)) {
      return res.status(500).json({ success: false, message: 'AI did not return a valid task array.' });
    }

    // Calculate due dates based on event date
    const eventDate = new Date(event.date);
    const validTaskCats = ['logistics', 'marketing', 'permissions', 'volunteers', 'finance', 'technical', 'general'];
    const validPriorities = ['high', 'medium', 'low'];
    const tasksToInsert = tasksData.map(task => {
      const cat = String(task.category || '').toLowerCase();
      const prio = String(task.priority || '').toLowerCase();
      return {
        eventId: event._id,
        title: task.title || 'Generated Task',
        description: task.description || '',
        category: validTaskCats.includes(cat) ? cat : 'general',
        assignee: task.assignee || 'Team',
        priority: validPriorities.includes(prio) ? prio : 'medium',
        timelineLabel: task.timelineLabel || 'D-14',
        dueDate: new Date(eventDate.getTime() - (task.daysBeforeEvent || 7) * 86400000),
        status: 'pending'
      };
    });

    const tasks = await Task.insertMany(tasksToInsert);

    // Mark plan as generated
    await Event.findByIdAndUpdate(event._id, { planGenerated: true, status: 'planned' });

    res.json({ success: true, tasksCreated: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate email drafts for event
 */
const generateEmails = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional communication writer. Always respond with valid JSON arrays only.' },
        { role: 'user', content: getEmailGeneratorPrompt(event) }
      ],
      temperature: 0.7
    });

    let emailsData;
    try {
      const rawContent = completion.choices[0].message.content.trim();
      const firstBracket = rawContent.indexOf('[');
      const lastBracket = rawContent.lastIndexOf(']');
      const cleaned = rawContent.substring(firstBracket, lastBracket + 1);
      emailsData = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: 'AI response was not valid JSON. Please try again.' });
    }

    if (!Array.isArray(emailsData)) {
      return res.status(500).json({ success: false, message: 'AI did not return a valid email array.' });
    }

    const emailsToInsert = emailsData.map(email => ({
      eventId: event._id,
      type: email.type,
      subject: email.subject,
      body: email.body,
      status: 'draft',
      generatedByAI: true
    }));

    const emails = await Email.insertMany(emailsToInsert);

    res.json({ success: true, emails });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate budget estimate for event
 */
const estimateBudget = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert event budget planner. Always respond with valid JSON arrays only.' },
        { role: 'user', content: getBudgetEstimatorPrompt(event) }
      ],
      temperature: 0.7
    });

    let budgetData;
    try {
      const rawContent = completion.choices[0].message.content.trim();
      const firstBracket = rawContent.indexOf('[');
      const lastBracket = rawContent.lastIndexOf(']');
      const cleaned = rawContent.substring(firstBracket, lastBracket + 1);
      budgetData = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: 'AI response was not valid JSON. Please try again.' });
    }

    if (!Array.isArray(budgetData)) {
      return res.status(500).json({ success: false, message: 'AI did not return a valid budget array.' });
    }

    // Scale proportionally if total exceeds budget
    const totalEstimated = budgetData.reduce((sum, item) => sum + (item.estimatedAmount || 0), 0);
    if (totalEstimated > event.budget && event.budget > 0) {
      const ratio = event.budget / totalEstimated;
      budgetData = budgetData.map(item => ({
        ...item,
        estimatedAmount: Math.round((item.estimatedAmount || 0) * ratio)
      }));
    }

    const validBudgetCats = ['venue', 'catering', 'decoration', 'sound_av', 'marketing', 'transportation', 'prizes', 'miscellaneous'];
    const budgetItems = budgetData.map(item => {
      const cat = String(item.category || '').toLowerCase();
      return {
        eventId: event._id,
        category: validBudgetCats.includes(cat) ? cat : 'miscellaneous',
        description: item.description || '',
        estimatedAmount: parseInt(item.estimatedAmount) || 0,
        actualAmount: 0,
        isPaid: false
      };
    });

    const items = await Budget.insertMany(budgetItems);

    res.json({
      success: true,
      totalBudget: event.budget,
      items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Predict risks for event (P2 feature)
 */
const predictRisks = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const tasks = await Task.find({ eventId: event._id });
    const budget = await Budget.find({ eventId: event._id });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an experienced event risk analyst. Always respond with valid JSON arrays only.' },
        { role: 'user', content: getRiskPredictorPrompt(event, tasks, budget) }
      ],
      temperature: 0.7
    });

    let risks;
    try {
      const rawContent = completion.choices[0].message.content.trim();
      const firstBracket = rawContent.indexOf('[');
      const lastBracket = rawContent.lastIndexOf(']');
      const cleaned = rawContent.substring(firstBracket, lastBracket + 1);
      risks = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: 'AI response was not valid JSON. Please try again.' });
    }

    res.json({ success: true, risks });
  } catch (error) {
    next(error);
  }
};

module.exports = { initializeEvent, generatePlan, generateEmails, estimateBudget, predictRisks };
