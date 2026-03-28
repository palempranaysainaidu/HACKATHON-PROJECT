const getBudgetEstimatorPrompt = (event) => `
You are an expert event budget planner with deep knowledge of event costs in Indian cities. Estimate a realistic category-wise budget breakdown for the following event.

EVENT DETAILS:
- Name: ${event.name}
- Type: ${event.type}
- Date: ${new Date(event.date).toLocaleDateString('en-IN')}
- City: ${event.city}
- Expected Audience: ${event.audience} people
- Total Budget Available: Rs.${event.budget}
- Theme: ${event.theme || 'Not specified'}

Create budget items for these categories. Include ALL relevant categories for this event type:
- venue: Venue rental and setup
- catering: Food, drinks, refreshments for attendees
- decoration: Themed decoration, banners, backdrop, flowers
- sound_av: Sound system, microphones, projectors, screens
- marketing: Posters, flex printing, digital advertising, social media
- transportation: If performers or equipment need transportation
- prizes: If competition or award event
- miscellaneous: Contingency buffer (always include 10-15% of total)

Rules:
1. The SUM of all estimatedAmount values must NOT exceed Rs.${event.budget}
2. Allocate realistically based on ${event.city} market rates
3. For audience of ${event.audience} people, catering cost should be calculated per-head (Rs.50-150 per person depending on event type)
4. Always include a miscellaneous buffer of at least Rs.${Math.round(event.budget * 0.12)}

Each budget item must have:
- category: One of the categories listed above
- description: What specifically this covers
- estimatedAmount: Integer amount in rupees

Respond ONLY with a valid JSON array of budget items. No explanation, no markdown, no code fences. Raw JSON only.
`;

module.exports = { getBudgetEstimatorPrompt };
