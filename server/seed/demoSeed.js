require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Task = require('../models/Task');
const Budget = require('../models/Budget');
const Email = require('../models/Email');
const Registration = require('../models/Registration');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing demo data
  const existingEvent = await Event.findOne({ slug: 'rajasthani-folk-demo' });
  if (existingEvent) {
    await Promise.all([
      Task.deleteMany({ eventId: existingEvent._id }),
      Budget.deleteMany({ eventId: existingEvent._id }),
      Email.deleteMany({ eventId: existingEvent._id }),
      Registration.deleteMany({ eventId: existingEvent._id }),
      Event.deleteOne({ _id: existingEvent._id })
    ]);
    console.log('Cleared existing demo data');
  }

  // Create demo user
  let demoUser = await User.findOne({ email: 'demo@eventos.ai' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Demo Organizer',
      email: 'demo@eventos.ai',
      password: await bcrypt.hash('demo1234', 10)
    });
  }

  // Create demo event
  const event = await Event.create({
    userId: demoUser._id,
    name: 'Rajasthani Folk Cultural Night (Demo)',
    type: 'cultural',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    location: 'Central Auditorium, JNTU',
    city: 'Hyderabad',
    audience: 300,
    budget: 50000,
    theme: 'Rajasthani Folk',
    slug: 'rajasthani-folk-demo',
    description: 'A vibrant cultural evening celebrating the rich folk traditions of Rajasthan, featuring live music, traditional dance performances, folk art exhibitions, and authentic Rajasthani food stalls.',
    planGenerated: true,
    status: 'planned',
    websiteTheme: 'modern',
    timeline: [
      { label: 'D-30', description: 'Permissions, vendor booking, volunteer recruitment' },
      { label: 'D-14', description: 'Marketing launch, sponsorship follow-ups, rehearsals' },
      { label: 'D-7', description: 'Final logistics confirmation, tech checks' },
      { label: 'D-1', description: 'Venue setup, volunteer briefing, equipment test' },
      { label: 'Event Day', description: 'Execution, attendance tracking, live management' }
    ]
  });

  // Seed Tasks
  await Task.insertMany([
    { eventId: event._id, title: 'Submit permission letter to principal', category: 'permissions', assignee: 'Event Head', priority: 'high', status: 'completed', timelineLabel: 'D-30', dueDate: new Date(Date.now() - 16 * 86400000) },
    { eventId: event._id, title: 'Book Central Auditorium', category: 'logistics', assignee: 'Logistics Head', priority: 'high', status: 'completed', timelineLabel: 'D-30', dueDate: new Date(Date.now() - 14 * 86400000) },
    { eventId: event._id, title: 'Design event poster and banner', category: 'marketing', assignee: 'Design Team', priority: 'high', status: 'completed', timelineLabel: 'D-14', dueDate: new Date(Date.now() - 7 * 86400000) },
    { eventId: event._id, title: 'Send sponsorship proposals to 10 companies', category: 'finance', assignee: 'Sponsorship Team', priority: 'high', status: 'in_progress', timelineLabel: 'D-14', dueDate: new Date(Date.now() + 2 * 86400000) },
    { eventId: event._id, title: 'Recruit 30 volunteers via forms', category: 'volunteers', assignee: 'Volunteer Coordinator', priority: 'medium', status: 'in_progress', timelineLabel: 'D-14', dueDate: new Date(Date.now() + 3 * 86400000) },
    { eventId: event._id, title: 'Finalize catering vendor', category: 'logistics', assignee: 'Logistics Head', priority: 'high', status: 'pending', timelineLabel: 'D-7', dueDate: new Date(Date.now() + 7 * 86400000) },
    { eventId: event._id, title: 'Sound system and AV setup confirmation', category: 'technical', assignee: 'Tech Head', priority: 'high', status: 'pending', timelineLabel: 'D-7', dueDate: new Date(Date.now() + 7 * 86400000) },
    { eventId: event._id, title: 'Launch Instagram and WhatsApp campaign', category: 'marketing', assignee: 'Social Media Team', priority: 'medium', status: 'pending', timelineLabel: 'D-14', dueDate: new Date(Date.now() + 4 * 86400000) },
    { eventId: event._id, title: 'Prepare event program schedule', category: 'logistics', assignee: 'Event Head', priority: 'medium', status: 'pending', timelineLabel: 'D-7', dueDate: new Date(Date.now() + 8 * 86400000) },
    { eventId: event._id, title: 'Confirm performers and anchors', category: 'logistics', assignee: 'Cultural Coordinator', priority: 'high', status: 'pending', timelineLabel: 'D-7', dueDate: new Date(Date.now() + 6 * 86400000) },
  ]);

  // Seed Budget
  await Budget.insertMany([
    { eventId: event._id, category: 'venue', description: 'Auditorium booking with AC and stage', estimatedAmount: 8000, actualAmount: 8000, isPaid: true },
    { eventId: event._id, category: 'catering', description: 'Snacks and refreshments for 300 attendees', estimatedAmount: 15000, actualAmount: 0 },
    { eventId: event._id, category: 'decoration', description: 'Rajasthani themed decoration, banners, backdrop', estimatedAmount: 7000, actualAmount: 0 },
    { eventId: event._id, category: 'sound_av', description: 'Sound system, mic set, projector rental', estimatedAmount: 8000, actualAmount: 0 },
    { eventId: event._id, category: 'marketing', description: 'Posters, flex banners, print materials', estimatedAmount: 5000, actualAmount: 2500 },
    { eventId: event._id, category: 'miscellaneous', description: 'Contingency and unplanned expenses', estimatedAmount: 7000, actualAmount: 0 },
  ]);

  // Seed Email Drafts
  const eventDate = new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-IN');
  await Email.insertMany([
    {
      eventId: event._id,
      type: 'permission',
      subject: "Request for Permission to Organize 'Rajasthani Folk Cultural Night'",
      body: `Respected Sir/Madam,\n\nWe, the students of the Cultural Committee, JNTU Hyderabad, seek your esteemed permission to organize "Rajasthani Folk Cultural Night" — a celebration of the rich folk traditions of Rajasthan.\n\nEvent Details:\n• Date: ${eventDate}\n• Venue: Central Auditorium, JNTU\n• Expected Attendance: 300 students\n• Estimated Budget: Rs.50,000 (self-funded + sponsorships)\n\nThe event will feature folk dance performances, live music, art exhibitions, and traditional food stalls. All activities will comply with college norms and conclude by 9:00 PM.\n\nWe assure you of responsible execution and will provide a detailed event report post-completion.\n\nYours sincerely,\n[Event Head Name]\nCultural Committee | JNTU Hyderabad`,
      status: 'draft',
      generatedByAI: true
    },
    {
      eventId: event._id,
      type: 'sponsorship',
      subject: "Sponsorship Opportunity — Rajasthani Folk Cultural Night | 300+ College Audience",
      body: `Dear [Company/Brand Name],\n\nWe are pleased to invite [Company Name] to be an official sponsor of "Rajasthani Folk Cultural Night" — a premier college cultural event at JNTU Hyderabad.\n\nWhy Sponsor Us?\n• Direct exposure to 300+ college students\n• Brand placement on all event materials, social media, and the venue\n• Opportunity to engage with the youth demographic directly\n\nSponsorship Tiers:\n• Title Sponsor: Rs.20,000 — Logo on all materials + stage banner + anchor mention\n• Co-Sponsor: Rs.10,000 — Logo on print materials + social media posts\n• Associate Sponsor: Rs.5,000 — Logo on digital materials\n\nWe would love to discuss a partnership that works for your brand. Please reply to this email or call [Contact Number] to schedule a call.\n\nWarm regards,\n[Event Head Name]\nSponsorship Team | Rajasthani Folk Cultural Night`,
      status: 'draft',
      generatedByAI: true
    },
    {
      eventId: event._id,
      type: 'volunteer_recruitment',
      subject: "Join Us as a Volunteer — Rajasthani Folk Cultural Night",
      body: `Hi [Name],\n\nWe are organizing "Rajasthani Folk Cultural Night" on ${eventDate} at JNTU Hyderabad, and we are looking for enthusiastic volunteers to be part of the team!\n\nVolunteer Roles Available:\n• Registration Desk Management\n• Stage and Backstage Coordination\n• Guest and Audience Management\n• Photography and Documentation\n• Food and Refreshments\n\nWhat You Get:\n• Official volunteer certificate\n• Free entry to the event\n• A chance to build event management experience\n• Loads of fun and memories!\n\nInterested? Fill out the volunteer form here: [Form Link]\n\nDeadline to register: [Date - 7 days]\n\nSee you there!\nThe Rajasthani Folk Cultural Night Team`,
      status: 'draft',
      generatedByAI: true
    }
  ]);

  // Seed Registrations
  const sampleNames = [
    ['Arjun Sharma', 'arjun@example.com'],
    ['Priya Reddy', 'priya@example.com'],
    ['Rahul Nair', 'rahul@example.com'],
    ['Kavya Singh', 'kavya@example.com'],
    ['Rohan Mehta', 'rohan@example.com'],
    ['Sneha Patel', 'sneha@example.com'],
    ['Aditya Kumar', 'aditya@example.com'],
    ['Divya Rao', 'divya@example.com'],
    ['Vikram Joshi', 'vikram@example.com'],
    ['Ananya Das', 'ananya@example.com'],
  ];

  await Registration.insertMany(
    sampleNames.map(([name, email]) => ({
      eventId: event._id,
      name,
      email,
      phone: '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
      organization: 'JNTU Hyderabad',
      numberOfPeople: 1,
      confirmationEmailSent: true
    }))
  );

  console.log('Demo seed completed successfully.');
  console.log(`Event ID: ${event._id}`);
  console.log(`Event Slug: ${event.slug}`);
  console.log(`Demo login: demo@eventos.ai / demo1234`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
