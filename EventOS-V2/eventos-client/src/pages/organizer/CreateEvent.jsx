import { useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, Loader2 } from 'lucide-react';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // 'select', 'manual', 'ai'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStatus, setAiStatus] = useState('');
  
  const [aiConfig, setAiConfig] = useState({
    providesFood: false,
    providesTransport: false,
    ticketPrice: 0
  });
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', type: 'cultural', date: '', expectedAudience: '',
    city: '', description: '', totalBudget: 0,
    volunteersNeeded: 0, providesFood: false, providesTransport: false
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleToggle = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleManualSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/organizer/events', { ...formData, status: 'open' });
      navigate(`/organizer/events/${data.event._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenesis = async () => {
    if (!aiPrompt) return alert('Please enter an event vision first.');
    setLoading(true);
    
    try {
      // Step 1: Parse the idea
      setAiStatus('Parsing natural language blueprint...');
      const { data: initData } = await axios.post('/ai/initialize', { prompt: aiPrompt });
      const parsed = initData.parsed;
      
      // Step 2: Create the base event in database
      setAiStatus('Constructing database schemas...');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      
      const eventPayload = {
        name: parsed.name || 'AI Generated Event',
        type: parsed.type || 'other',
        description: parsed.description || aiPrompt,
        expectedAudience: parsed.expectedAudience || 500,
        city: 'Metropolis',
        date: defaultDate.toISOString().split('T')[0],
        totalBudget: 100000,
        volunteersNeeded: parsed.volunteersNeeded || 20,
        minVolunteersForTaskDivision: parsed.minVolunteersForTaskDivision || 2,
        requiredSkills: parsed.requiredSkills || [],
        providesFood: aiConfig.providesFood,
        providesTransport: aiConfig.providesTransport,
        ticketPrice: Number(aiConfig.ticketPrice),
        isFree: Number(aiConfig.ticketPrice) === 0,
        status: 'open'
      };
      
      const { data: eventData } = await axios.post('/organizer/events', eventPayload);
      const eventId = eventData.event._id;

      // Step 3: Concurrently build the massive logistics (Tasks, Budgets, Risks)
      setAiStatus('Orchestrating Tasks, Financials, and Risk Models...');
      await Promise.allSettled([
        axios.post(`/ai/generate-plan/${eventId}`),
        axios.post(`/ai/estimate-budget/${eventId}`),
        axios.post(`/ai/predict-risks/${eventId}`)
      ]);

      // Step 4: Blastoff
      navigate(`/organizer/events/${eventId}`);

    } catch (err) {
      console.error(err);
      alert('AI Generation encountered an anomaly. Check console.');
      setLoading(false);
      setAiStatus('');
    }
  };

  if (mode === 'select') {
    return (
      <div className="max-w-4xl mx-auto h-[70vh] flex flex-col items-center justify-center animate-fade-in-up">
        <h1 className="font-serif text-4xl font-black text-brand-white mb-4">How would you like to build?</h1>
        <p className="text-brand-mid font-sans mb-12 text-center max-w-lg">Choose the traditional multi-step forms, or let the Gemini Copilot engineer the entire event logistics pipeline autonomously.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <button onClick={() => setMode('ai')} className="group flex flex-col items-center justify-center p-10 bg-brand-surface border-2 border-transparent hover:border-brand-info hover:bg-brand-surface border border-brand-border transition-all shadow-sm rounded-none text-center">
             <div className="w-16 h-16 bg-brand-surface border border-brand-border border border-brand-border rounded-none flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
               <Bot className="w-8 h-8 text-brand-info" />
             </div>
             <h3 className="font-serif text-2xl font-bold text-brand-white mb-2">✨ Full AI Genesis</h3>
             <p className="font-sans text-sm text-brand-mid text-center px-4">Type a single paragraph. The network autonomously drafts the kanbans, calculates budgets, and sets the schedule.</p>
          </button>
          
          <button onClick={() => setMode('manual')} className="group flex flex-col items-center justify-center p-10 bg-brand-surface border-2 border-transparent hover:border-brand-accent hover:bg-brand-surface border border-brand-border transition-all shadow-sm rounded-none text-center">
             <div className="w-16 h-16 bg-brand-surface border border-brand-border border border-brand-border rounded-none flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform text-brand-white font-serif text-2xl font-bold">
               M
             </div>
             <h3 className="font-serif text-2xl font-bold text-brand-white mb-2">Manual Configuration</h3>
             <p className="font-sans text-sm text-brand-mid text-center px-4">Standard multi-step forms. Complete control over every variable from day one.</p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'ai') {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up mt-10">
        <div className="mb-8">
          <button onClick={() => setMode('select')} className="text-brand-mid hover:text-brand-white text-sm font-bold uppercase tracking-widest font-sans mb-6 inline-block">&larr; Back to Modes</button>
          <h1 className="font-serif text-4xl font-black text-brand-white mb-2 flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-brand-info" /> The Genesis Protocol.
          </h1>
          <p className="text-brand-mid font-sans text-lg">Describe your vision. The AI will engineer the entire logistical pipeline.</p>
        </div>

        <div className="bg-brand-surface border border-brand-border border border-brand-border p-8 shadow-sm">
          {!loading ? (
            <>
              <textarea 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. Plan a 3-day technical hackathon in Bangalore for 1000 developers, focused on AI and Quantum Computing. We have a budget of 5 Lakhs..."
                className="w-full h-48 border border-brand-border bg-brand-surface p-5 font-sans text-brand-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-info resize-none mb-6 text-lg leading-relaxed shadow-inner"
              ></textarea>
              
              <div className="border-t border-brand-border pt-6 mb-6">
                <h3 className="font-serif font-bold text-lg mb-4 text-brand-white">Base Configuration</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={aiConfig.providesFood} onChange={e => setAiConfig({...aiConfig, providesFood: e.target.checked})} className="w-5 h-5 accent-brand-black cursor-pointer" />
                    <span className="font-sans text-sm font-medium">Provide Food?</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={aiConfig.providesTransport} onChange={e => setAiConfig({...aiConfig, providesTransport: e.target.checked})} className="w-5 h-5 accent-brand-black cursor-pointer" />
                    <span className="font-sans text-sm font-medium">Provide Transport?</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-1">Ticket Price (INR)</label>
                    <input type="number" min="0" value={aiConfig.ticketPrice} onChange={e => setAiConfig({...aiConfig, ticketPrice: e.target.value})} className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-accent" placeholder="0 = Free" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleAIGenesis}
                  className="bg-brand-accent hover:bg-brand-accentHov  text-brand-bg px-10 py-4 font-sans font-bold shadow-md hover:-translate-y-1 transition-transform flex items-center group cursor-pointer"
                >
                  Engage Copilot <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-16 h-16 text-brand-info animate-spin" />
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-light animate-pulse">{aiStatus}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // mode === 'manual'
  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up mt-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <button onClick={() => setMode('select')} className="text-brand-mid hover:text-brand-white text-sm font-bold uppercase tracking-widest font-sans mb-6 inline-block">&larr; Back</button>
          <h1 className="font-serif text-3xl font-bold text-brand-white mb-2">Create New Event</h1>
          <div className="flex items-center space-x-2 text-sm font-sans text-brand-mid">
            <span className={step >= 1 ? 'font-bold text-brand-white' : ''}>1. Details</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'font-bold text-brand-white' : ''}>2. Logistics</span>
            <span>&rarr;</span>
            <span className={step >= 3 ? 'font-bold text-brand-white' : ''}>3. Review</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-border border border-brand-border shadow-sm p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-serif text-xl font-semibold border-b border-brand-border pb-2 mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Event Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" placeholder="Annual Tech Fest 2025" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Event Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent">
                  <option value="cultural">Cultural</option>
                  <option value="technical">Technical</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Expected Audience</label>
                <input type="number" name="expectedAudience" value={formData.expectedAudience} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" placeholder="500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" placeholder="Describe the vision..."></textarea>
            </div>

            <div className="flex justify-end pt-6">
              <button onClick={nextStep} className="bg-brand-accent hover:bg-brand-accentHov  text-brand-bg font-sans font-bold px-8 py-3 transition-colors">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-serif text-xl font-semibold border-b border-brand-border pb-2 mb-4">Logistics & Volunteers</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Total Estimated Budget (INR)</label>
              <input type="number" name="totalBudget" value={formData.totalBudget} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-mid mb-2">Number of Volunteers Needed</label>
              <input type="number" name="volunteersNeeded" value={formData.volunteersNeeded} onChange={handleChange} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans focus:outline-none focus:border-brand-accent" />
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-brand-border">
              <input type="checkbox" name="providesFood" checked={formData.providesFood} onChange={handleToggle} className="w-5 h-5 accent-brand-black border-brand-border" />
              <span className="font-sans text-brand-light font-medium">Will you provide food for attendees?</span>
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" name="providesTransport" checked={formData.providesTransport} onChange={handleToggle} className="w-5 h-5 accent-brand-black border-brand-border" />
              <span className="font-sans text-brand-light font-medium">Will you provide transportation for attendees?</span>
            </div>

            <div className="flex justify-between pt-6 mt-4 border-t border-brand-border">
              <button onClick={prevStep} className="border border-brand-border text-brand-light font-sans font-bold px-8 py-3 hover:bg-brand-surface">
                Back
              </button>
              <button onClick={nextStep} className="bg-brand-accent hover:bg-brand-accentHov  text-brand-bg font-sans font-bold px-8 py-3">
                Review Configuration
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-serif text-xl font-semibold border-b border-brand-border pb-2 mb-4">Review Your Event</h2>
            
            <div className="bg-brand-surface p-6 border border-brand-border">
              <h3 className="font-serif text-3xl font-bold text-brand-white mb-4">{formData.name || 'Untitled Event'}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                <p><span className="text-brand-mid font-bold uppercase tracking-wider text-xs block mb-1">Date:</span> {formData.date}</p>
                <p><span className="text-brand-mid font-bold uppercase tracking-wider text-xs block mb-1">City:</span> {formData.city}</p>
                <p><span className="text-brand-mid font-bold uppercase tracking-wider text-xs block mb-1">Audience:</span> {formData.expectedAudience}</p>
                <p><span className="text-brand-mid font-bold uppercase tracking-wider text-xs block mb-1">Budget:</span> ₹{formData.totalBudget}</p>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-brand-border">
              <button onClick={prevStep} className="border border-brand-border text-brand-light font-sans font-bold px-8 py-3 hover:bg-brand-surface">
                Back
              </button>
              <button onClick={handleManualSubmit} disabled={loading} className="bg-brand-accent hover:bg-brand-accentHov  text-brand-bg font-sans font-bold px-10 py-3 flex justify-center w-48 shadow-md hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Launch Engine'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
