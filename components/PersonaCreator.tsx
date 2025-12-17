import React, { useState } from 'react';
import { User, Building2, Check, Sparkles, Copy, ArrowRight, ArrowLeft } from 'lucide-react';
import { INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS, TRAINING_OBJECTIVES, CHALLENGE_OPTIONS, CONVERSATION_TYPES } from '../constants';
import { Persona } from '../types';
import { generateDetailedPersona } from '../services/geminiService';

interface PersonaCreatorProps {
    onSave: (persona: Persona, startSession: boolean) => void;
}

const PersonaCreator: React.FC<PersonaCreatorProps> = ({ onSave }) => {
  const [step, setStep] = useState(0); // 0: Start, 1: Type, 2: Basic, 3: Professional, 4: Sales, 5: Framework, 6: Summary, 7: Loading, 8: Result
  
  const [formData, setFormData] = useState<Partial<Persona>>({
    type: 'B2B',
    name: '',
    age: 45,
    description: '',
    role: '',
    industry: '',
    companySize: '',
    productDetails: '',
    trainingObjectives: [],
    challenges: [],
    conversationType: '',
    objection: 'Budget'
  });

  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const toggleSelection = (list: string[], item: string, field: string) => {
    const newList = list.includes(item) 
      ? list.filter(i => i !== item)
      : [...list, item];
    setFormData({ ...formData, [field]: newList });
  };

  const handleGenerate = async () => {
    setStep(7); // Loading
    const result = await generateDetailedPersona(formData);
    setTimeout(() => {
        setGeneratedResult(result);
        setStep(8); // Done
    }, 2000); // Fake delay for UX
  };

  const handleFinalize = (startSession: boolean) => {
      // Construct final object
      const finalPersona: Persona = {
          id: Date.now().toString(),
          name: formData.name || 'Unknown Prospect',
          age: formData.age || 30,
          role: formData.role || 'Decision Maker',
          company: formData.company || 'Generic Corp',
          industry: formData.industry,
          companySize: formData.companySize,
          personality: 'AI Generated',
          description: generatedResult?.bio || formData.description,
          openingLine: generatedResult?.openingLine,
          productDetails: formData.productDetails,
          trainingObjectives: formData.trainingObjectives,
          challenges: formData.challenges,
          conversationType: formData.conversationType,
          objection: formData.objection || 'None',
          avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`,
          type: formData.type || 'B2B',
      };
      
      onSave(finalPersona, startSession);
  };

  // --- Step Render Functions ---

  const renderStep0Start = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Roleplay</h1>
        <p className="text-gray-500 mb-12">Create custom prospects or clone from calls to practice your sales pitch in realistic scenarios.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
             <button 
                onClick={handleNext}
                className="group relative bg-white border border-gray-200 rounded-xl p-8 hover:border-primary hover:shadow-lg transition-all text-left flex flex-col justify-between h-48"
             >
                <div className="w-12 h-12 bg-primary-bg rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900">Create New Prospect</h3>
                    <p className="text-sm text-gray-500 mt-1">Design a persona from scratch.</p>
                </div>
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} />
                </div>
             </button>

             <button 
                disabled
                className="group relative bg-gray-50 border border-gray-200 rounded-xl p-8 opacity-60 cursor-not-allowed text-left flex flex-col justify-between h-48"
             >
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4 text-gray-400">
                    <Copy size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900">Clone from Call Recording</h3>
                    <p className="text-sm text-gray-500 mt-1">Coming soon.</p>
                </div>
             </button>
        </div>
    </div>
  );

  const renderStep1Type = () => (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Prospect Type</h2>
        <p className="text-gray-500 mb-8">Which type of customer are you practicing sales with?</p>
        
        <div className="grid grid-cols-2 gap-6">
            {['B2B', 'B2C'].map((type) => (
                <button
                    key={type}
                    onClick={() => setFormData({...formData, type: type as 'B2B' | 'B2C'})}
                    className={`p-8 rounded-xl border-2 transition-all flex flex-col items-center justify-center h-64 space-y-4 ${
                        formData.type === type 
                        ? 'border-primary bg-primary-bg' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${formData.type === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {type === 'B2B' ? <Building2 size={32}/> : <User size={32}/>}
                    </div>
                    <div className="text-center">
                        <div className={`font-bold text-lg ${formData.type === type ? 'text-primary-dark' : 'text-gray-900'}`}>
                            {type === 'B2B' ? 'Business (B2B)' : 'Consumer (B2C)'}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            {type === 'B2B' ? 'Business clients with company roles.' : 'Individual consumers for personal sales.'}
                        </div>
                    </div>
                    {formData.type === type && <div className="absolute top-4 right-4 text-primary"><Check size={20} /></div>}
                </button>
            ))}
        </div>
    </div>
  );

  const renderStep2BasicInfo = () => (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-500 mb-8">Enter the fundamental details about your prospect.</p>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all"
                    placeholder="e.g. John Smith"
                    autoFocus
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <select 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary outline-none"
                >
                    {[25, 30, 35, 40, 45, 50, 55, 60, 65, 70].map(age => (
                        <option key={age} value={age}>{age}</option>
                    ))}
                </select>
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Personality</label>
            <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all h-32 resize-none"
                placeholder="e.g. Analytical decision-maker who values data-driven solutions. Direct communicator with limited time..."
            />
            <div className="text-right mt-2">
                <button className="text-xs text-primary font-medium flex items-center justify-end gap-1 hover:text-primary-dark">
                    <Sparkles size={12} /> Auto-enhance with AI
                </button>
            </div>
        </div>
    </div>
  );

  const renderStep3Professional = () => (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Profile</h2>
        <p className="text-gray-500 mb-8">Define the business context of your prospect.</p>
        
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Position</label>
                    <input 
                         type="text" 
                         value={formData.role}
                         onChange={(e) => setFormData({...formData, role: e.target.value})}
                         placeholder="Select or type position"
                         className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry Sector</label>
                    <select 
                         value={formData.industry}
                         onChange={(e) => setFormData({...formData, industry: e.target.value})}
                         className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary outline-none"
                    >
                        <option value="">Select industry</option>
                        {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>

            {formData.type === 'B2B' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select 
                         value={formData.companySize}
                         onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                         className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary outline-none"
                    >
                        <option value="">Select company size</option>
                        {COMPANY_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            )}
        </div>
    </div>
  );

  const renderStep4SalesContext = () => (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sales Offering</h2>
        <p className="text-gray-500 mb-8">Establish clear training objectives for the simulation.</p>

        <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product or Service Details</label>
            <textarea 
                value={formData.productDetails}
                onChange={(e) => setFormData({...formData, productDetails: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-primary outline-none h-24 resize-none text-sm"
                placeholder="Example: Enterprise CRM software priced at $299/month per user..."
            />
        </div>

        <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Training Objectives</label>
            <div className="flex flex-wrap gap-2">
                {TRAINING_OBJECTIVES.map(obj => (
                    <button 
                        key={obj}
                        onClick={() => toggleSelection(formData.trainingObjectives || [], obj, 'trainingObjectives')}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                            formData.trainingObjectives?.includes(obj)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                        }`}
                    >
                        {obj}
                    </button>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Challenges</label>
            <div className="flex flex-wrap gap-2">
                {CHALLENGE_OPTIONS.map(chal => (
                    <button 
                        key={chal}
                        onClick={() => toggleSelection(formData.challenges || [], chal, 'challenges')}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                            formData.challenges?.includes(chal)
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-red-200'
                        }`}
                    >
                        {chal}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderStep5Framework = () => (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversation Framework</h2>
        <p className="text-gray-500 mb-8">Configure the conversation type and parameters.</p>

        <label className="block text-sm font-medium text-gray-700 mb-4">Conversation Type</label>
        <div className="space-y-3">
            {CONVERSATION_TYPES.map(type => (
                <button 
                    key={type}
                    onClick={() => setFormData({...formData, conversationType: type})}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        formData.conversationType === type
                        ? 'bg-primary-bg border-primary'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.conversationType === type ? 'border-primary' : 'border-gray-300'}`}>
                            {formData.conversationType === type && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <span className={`font-medium ${formData.conversationType === type ? 'text-primary-dark' : 'text-gray-700'}`}>{type}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );

  const renderStep6Summary = () => (
    <div className="max-w-2xl mx-auto">
         <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration Summary</h2>
         
         <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
             <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                 <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</h4>
                     <p className="text-lg font-bold text-gray-900">{formData.name || '-'}</p>
                 </div>
                 <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Age</h4>
                     <p className="text-lg font-bold text-gray-900">{formData.age}</p>
                 </div>
                 <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Position</h4>
                     <p className="text-gray-900">{formData.role || '-'}</p>
                 </div>
                 <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Industry</h4>
                     <p className="text-gray-900">{formData.industry || '-'}</p>
                 </div>
                 
                 <div className="col-span-2 border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Training Goals</h4>
                    <div className="flex flex-wrap gap-2">
                        {formData.trainingObjectives?.length ? formData.trainingObjectives.map(t => (
                            <span key={t} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
                        )) : <span className="text-gray-400 text-sm">None selected</span>}
                    </div>
                 </div>

                 <div className="col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {formData.description || "No description provided."}
                    </p>
                 </div>
             </div>
         </div>
         
         <div className="mt-8 flex justify-end">
             <button 
                onClick={handleGenerate}
                disabled={!formData.name || !formData.role}
                className="px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                 Create Prospect <ArrowRight size={18} />
             </button>
         </div>
    </div>
  );

  const renderStep7Loading = () => (
      <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">75%</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Personality</h2>
          <p className="text-gray-500 mb-8">Bloom AI is analyzing your prospect profile...</p>
          
          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
              <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"><Check size={14} /></div>
                  <span className="text-green-600">Instructions</span>
              </div>
              <div className="w-16 h-px bg-gray-200"></div>
              <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white animate-pulse"><Sparkles size={14} /></div>
                  <span className="text-primary">Personality</span>
              </div>
              <div className="w-16 h-px bg-gray-200"></div>
              <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <span>Ready</span>
              </div>
          </div>
          
          <div className="mt-8 px-4 py-2 bg-primary-bg text-primary-dark rounded-full text-xs font-medium animate-pulse">
              Generating: {formData.name}
          </div>
      </div>
  );
  
  const renderStep8Result = () => (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
           <div className="w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
               <div className="w-24 h-24 bg-gradient-to-br from-primary-light to-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform -rotate-3">
                    <User size={48} className="text-white" />
               </div>
               
               <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h2>
               <p className="text-gray-500 text-sm mb-6">{formData.role} @ {formData.industry}</p>
               
               <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                   <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">AI Opening Line</div>
                   <p className="text-gray-700 italic">"{generatedResult?.openingLine}"</p>
               </div>
               
               <div className="space-y-3">
                   <button 
                        onClick={() => handleFinalize(true)}
                        className="w-full py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
                   >
                       Start Session
                   </button>
                   <button 
                        onClick={() => handleFinalize(false)}
                        className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all"
                   >
                       Save & Exit
                   </button>
               </div>
           </div>
      </div>
  );

  // --- Main Render ---

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
        {/* Progress Bar (Only visible in wizard steps) */}
        {step > 0 && step < 7 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${(step / 6) * 100}%` }}
                ></div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 pb-24">
            {step === 0 && renderStep0Start()}
            {step === 1 && renderStep1Type()}
            {step === 2 && renderStep2BasicInfo()}
            {step === 3 && renderStep3Professional()}
            {step === 4 && renderStep4SalesContext()}
            {step === 5 && renderStep5Framework()}
            {step === 6 && renderStep6Summary()}
            {step === 7 && renderStep7Loading()}
            {step === 8 && renderStep8Result()}
        </div>

        {/* Navigation Footer */}
        {step > 0 && step < 7 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
                <button 
                    onClick={handleBack}
                    className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                
                {step < 6 && (
                    <button 
                        onClick={handleNext}
                        className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                )}
            </div>
        )}
    </div>
  );
};

export default PersonaCreator;