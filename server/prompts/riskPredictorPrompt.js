const getRiskPredictorPrompt = (event, tasks, budget) => `
You are an experienced event risk analyst. Analyze this event and predict the top 4-5 risks with preventive actions.

EVENT DETAILS:
- Name: ${event.name}
- Type: ${event.type}
- Date: ${new Date(event.date).toLocaleDateString('en-IN')}
- City: ${event.city}
- Expected Audience: ${event.audience} people
- Total Budget: Rs.${event.budget}
- Days Until Event: ${Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))}

CURRENT STATUS:
- Total Tasks: ${tasks.length}
- Completed Tasks: ${tasks.filter(t => t.status === 'completed').length}
- Pending High Priority Tasks: ${tasks.filter(t => t.status !== 'completed' && t.priority === 'high').length}

Consider these risk categories:
- Attendance and registration
- Budget and financial
- Logistics and venue
- Vendor reliability
- Weather and external factors
- Technical failures
- Volunteer and staffing

Each risk object must have:
- risk: Short risk name (max 50 characters)
- severity: "high", "medium", or "low"
- trigger: What condition or signal would indicate this risk is materializing
- preventiveAction: Specific, actionable steps to prevent or mitigate this risk

Respond ONLY with a valid JSON array of 4-5 risk objects. No explanation, no markdown, no code fences. Raw JSON only.
`;

module.exports = { getRiskPredictorPrompt };
