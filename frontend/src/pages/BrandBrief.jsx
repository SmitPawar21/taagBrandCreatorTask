import React, { useState } from 'react';

const BrandBrief = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    budgetINR: '',
    targetLocations: [],
    targetAges: [18, 30],
    goals: [],
    tone: [],
    platforms: [],
    constraints: {
      noAdultContent: false,
      timelineDays: 21
    }
  });

  const [generatedJson, setGeneratedJson] = useState(null);

  const categories = [
    'Fashion', 'Technology', 'Food & Beverage', 'Healthcare', 'Finance', 
    'Education', 'Travel', 'Entertainment', 'Automotive', 'Real Estate'
  ];

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur'
  ];

  const goalOptions = [
    'awareness', 'installs', 'engagement', 'conversions', 'leads', 'sales'
  ];

  const toneOptions = [
    'energetic', 'clean', 'professional', 'playful', 'sophisticated', 
    'minimalist', 'bold', 'friendly', 'luxurious', 'casual'
  ];

  const platformOptions = [
    'Instagram', 'YouTube', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'Snapchat'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleAgeChange = (index, value) => {
    const newAges = [...formData.targetAges];
    newAges[index] = parseInt(value);
    setFormData(prev => ({
      ...prev,
      targetAges: newAges
    }));
  };

  const handleConstraintChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        [field]: value
      }
    }));
  };

  const generateJson = () => {
    const jsonOutput = {
      _id: `b${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      category: formData.category,
      budgetINR: parseInt(formData.budgetINR),
      targetLocations: formData.targetLocations,
      targetAges: formData.targetAges,
      goals: formData.goals,
      tone: formData.tone,
      platforms: formData.platforms,
      constraints: {
        noAdultContent: formData.constraints.noAdultContent,
        timelineDays: formData.constraints.timelineDays
      }
    };
    setGeneratedJson(jsonOutput);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      budgetINR: '',
      targetLocations: [],
      targetAges: [18, 30],
      goals: [],
      tone: [],
      platforms: [],
      constraints: {
        noAdultContent: false,
        timelineDays: 21
      }
    });
    setGeneratedJson(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{color: '#C5F37D'}}>
            Brand Brief Form
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tell us about your brand and campaign goals. We'll help you create measurable results through creative excellence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-green-800/30">
            
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{color: '#C5F37D'}}>
                Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-green-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                    placeholder="Enter your brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-green-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Budget (INR) *
                  </label>
                  <input
                    type="number"
                    value={formData.budgetINR}
                    onChange={(e) => handleInputChange('budgetINR', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-green-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                    placeholder="Enter budget amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Timeline (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.constraints.timelineDays}
                    onChange={(e) => handleConstraintChange('timelineDays', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-green-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{color: '#C5F37D'}}>
                Target Audience
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-300">
                  Target Locations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {locations.map(location => (
                    <label key={location} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.targetLocations.includes(location)}
                        onChange={() => handleArrayToggle('targetLocations', location)}
                        className="sr-only"
                      />
                      <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center w-full ${
                        formData.targetLocations.includes(location)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}>
                        {location}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">
                  Target Age Range
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">From:</span>
                    <input
                      type="number"
                      value={formData.targetAges[0]}
                      onChange={(e) => handleAgeChange(0, e.target.value)}
                      className="w-20 px-3 py-2 bg-gray-800/50 border border-green-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white text-center"
                      min="13"
                      max="100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">To:</span>
                    <input
                      type="number"
                      value={formData.targetAges[1]}
                      onChange={(e) => handleAgeChange(1, e.target.value)}
                      className="w-20 px-3 py-2 bg-gray-800/50 border border-green-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white text-center"
                      min="13"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Goals */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{color: '#C5F37D'}}>
                Campaign Goals
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {goalOptions.map(goal => (
                  <label key={goal} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleArrayToggle('goals', goal)}
                      className="sr-only"
                    />
                    <div className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center w-full capitalize ${
                      formData.goals.includes(goal)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}>
                      {goal}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Tone */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{color: '#C5F37D'}}>
                Brand Tone
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {toneOptions.map(toneOption => (
                  <label key={toneOption} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tone.includes(toneOption)}
                      onChange={() => handleArrayToggle('tone', toneOption)}
                      className="sr-only"
                    />
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center w-full capitalize ${
                      formData.tone.includes(toneOption)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}>
                      {toneOption}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{color: '#C5F37D'}}>
                Platforms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platformOptions.map(platform => (
                  <label key={platform} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform)}
                      onChange={() => handleArrayToggle('platforms', platform)}
                      className="sr-only"
                    />
                    <div className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center w-full ${
                      formData.platforms.includes(platform)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}>
                      {platform}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6" style={{color: '#C5F37D'}}>
                Constraints
              </h3>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.constraints.noAdultContent}
                    onChange={(e) => handleConstraintChange('noAdultContent', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    formData.constraints.noAdultContent
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-500'
                  }`}>
                    {formData.constraints.noAdultContent && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-300">No Adult Content</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={generateJson}
                className="px-8 py-3 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                style={{backgroundColor: '#C5F37D', color: '#001719'}}
                disabled={!formData.name || !formData.category || !formData.budgetINR}
              >
                Generate JSON
              </button>
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Reset Form
              </button>
            </div>

            {/* Generated JSON Output */}
            {generatedJson && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4" style={{color: '#C5F37D'}}>
                  Generated JSON
                </h3>
                <div className="bg-gray-900/80 border border-green-700/50 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(generatedJson, null, 2)}
                  </pre>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedJson, null, 2))}
                  className="mt-4 px-6 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            Merging Tech, Agencies & Artists Globally
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandBrief;