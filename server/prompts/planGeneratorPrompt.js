const getPlanGeneratorPrompt = (event) => `
You are an expert event planning assistant. Generate a comprehensive task list for the following event.

EVENT DETAILS:
- Name: ${event.name}
- Type: ${event.type}
- Date: ${new Date(event.date).toLocaleDateString('en-IN')}
- Location: ${event.location || 'TBD'}, ${event.city}
- Expected Audience: ${event.audience} people
- Budget: Rs.${event.budget}
- Theme: ${event.theme || 'None'}

Generate between 18 and 24 tasks covering all aspects of the event. Each task must belong to one of these categories: logistics, marketing, permissions, volunteers, finance, technical, general.

Distribute tasks roughly as:
- permissions: 2-3 tasks
- logistics: 4-5 tasks
- marketing: 3-4 tasks
- finance: 2-3 tasks
- volunteers: 2-3 tasks
- technical: 2-3 tasks
- general: 2-3 tasks

Each task object must have these fields:
- title: Clear, action-oriented task name (max 60 characters)
- description: 1-2 sentence detail about what this task involves
- category: One of the categories above
- assignee: Suggested role name (e.g., "Event Head", "Logistics Team", "Design Team")
- priority: "high", "medium", or "low"
- timelineLabel: One of "D-30", "D-21", "D-14", "D-7", "D-3", "D-1", "Event Day"
- daysBeforeEvent: Integer number of days before event this task should be done

Respond ONLY with a valid JSON array. No explanation, no markdown, no code fences. Just a raw JSON array.
`;

module.exports = { getPlanGeneratorPrompt };
