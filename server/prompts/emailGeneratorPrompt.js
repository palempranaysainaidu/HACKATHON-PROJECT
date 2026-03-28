const getEmailGeneratorPrompt = (event) => `
You are a professional communication writer specializing in event management. Generate three professional email drafts for the following event.

EVENT DETAILS:
- Name: ${event.name}
- Type: ${event.type}
- Date: ${new Date(event.date).toLocaleDateString('en-IN')}
- Venue: ${event.location || 'College Venue'}, ${event.city}
- Expected Audience: ${event.audience} people
- Budget: Rs.${event.budget}
- Theme: ${event.theme || 'Not specified'}

Generate exactly 3 emails:

1. PERMISSION REQUEST (type: "permission")
   - Formal tone, addressed to college principal or administration
   - Include event name, date, venue, expected attendance, budget
   - Request permission and assure responsible execution
   - Sign off with placeholder [Event Head Name] and [Department/Organization]

2. SPONSORSHIP PROPOSAL (type: "sponsorship")
   - Professional business tone, addressed to potential sponsors
   - Highlight audience reach and demographics
   - Include 3 sponsorship tiers with amounts that add up to roughly 30-40% of event budget
   - Mention brand visibility benefits

3. VOLUNTEER RECRUITMENT (type: "volunteer_recruitment")
   - Friendly, enthusiastic tone
   - List 4-5 volunteer roles needed
   - Mention benefits (certificate, free entry, experience)
   - Include a call to action with placeholder [Form Link]

Each email object must have:
- type: as specified above
- subject: Professional email subject line
- body: Full email body with proper formatting, line breaks, and placeholder text in [brackets]

Respond ONLY with a valid JSON array of 3 email objects. No explanation, no markdown, no code fences. Raw JSON only.
`;

module.exports = { getEmailGeneratorPrompt };
