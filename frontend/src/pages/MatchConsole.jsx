import React, { useState, useEffect } from 'react';

const MatchConsole = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const mockBackendResponse = [
    {
      "creator": {
        "safetyFlags": {
          "adult": false,
          "controversial": false
        },
        "_id": "c1",
        "verticals": [
          "Fitness",
          "Lifestyle"
        ],
        "platforms": [
          "Instagram",
          "YouTube"
        ],
        "pastBrandCategories": [
          "Fashion",
          "Wellness"
        ],
        "contentTone": [
          "energetic",
          "fun"
        ],
        "handle": "@fitwithria",
        "audienceGeo": {
          "Mumbai": 0.42,
          "Delhi": 0.2
        },
        "audienceAge": {
          "18-24": 0.55,
          "25-34": 0.35
        },
        "avgViews": 120000,
        "engagementRate": 0.047,
        "basePriceINR": 80000,
        "__v": 0
      },
      "totalScore": 54,
      "reasons": [
        "Category/Vertical match",
        "Tone alignment",
        "Platform match",
        "Good engagement",
        "Strong views",
        "Within budget",
        "Meets safety constraint"
      ]
    },
    {
      "creator": {
        "safetyFlags": {
          "adult": false,
          "controversial": false
        },
        "_id": "c3",
        "verticals": [
          "Food",
          "Travel"
        ],
        "platforms": [
          "Instagram",
          "TikTok"
        ],
        "pastBrandCategories": [
          "Food & Beverage",
          "Travel"
        ],
        "contentTone": [
          "fun",
          "authentic"
        ],
        "handle": "@foodiesneha",
        "audienceGeo": {
          "Mumbai": 0.35,
          "Bangalore": 0.25,
          "Delhi": 0.15
        },
        "audienceAge": {
          "18-24": 0.45,
          "25-34": 0.40
        },
        "avgViews": 85000,
        "engagementRate": 0.062,
        "basePriceINR": 65000,
        "__v": 0
      },
      "totalScore": 42,
      "reasons": [
        "Platform match",
        "Good engagement",
        "Strong views",
        "Within budget",
        "Meets safety constraint"
      ]
    },
    {
      "creator": {
        "safetyFlags": {
          "adult": false,
          "controversial": false
        },
        "_id": "c2",
        "verticals": [
          "Technology",
          "Gaming"
        ],
        "platforms": [
          "YouTube",
          "Instagram"
        ],
        "pastBrandCategories": [
          "Technology",
          "Gaming"
        ],
        "contentTone": [
          "educational",
          "professional"
        ],
        "handle": "@techbyraj",
        "audienceGeo": {
          "Bangalore": 0.38,
          "Hyderabad": 0.22,
          "Mumbai": 0.18
        },
        "audienceAge": {
          "18-24": 0.35,
          "25-34": 0.45,
          "35-44": 0.20
        },
        "avgViews": 95000,
        "engagementRate": 0.038,
        "basePriceINR": 75000,
        "__v": 0
      },
      "totalScore": 38,
      "reasons": [
        "Platform match",
        "Good engagement",
        "Strong views",
        "Within budget",
        "Meets safety constraint"
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCreators(mockBackendResponse);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 50) return '#C5F37D';
    if (score >= 40) return '#057B51';
    if (score >= 30) return '#057B51';
    return '#666';
  };

  const getScoreGrade = (score) => {
    if (score >= 50) return 'Excellent';
    if (score >= 40) return 'Good';
    if (score >= 30) return 'Average';
    return 'Poor';
  };

  const getRankSuffix = (index) => {
    const rank = index + 1;
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (decimal) => {
    return `${(decimal * 100).toFixed(0)}%`;
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'Instagram': '📸',
      'YouTube': '📺',
      'TikTok': '🎵',
      'Facebook': '👥',
      'Twitter': '🐦',
      'LinkedIn': '💼'
    };
    return icons[platform] || '📱';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#C5F37D' }}></div>
          <p className="text-xl text-gray-300">Finding perfect creator matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#C5F37D' }}>
            Creator Matches
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered creator recommendations ranked by compatibility score
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-6 py-2 border border-green-800/30">
              <span className="text-gray-300">Found {creators.length} matching creators</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {creators.map((item, index) => {
              const { creator, totalScore, reasons } = item;
              return (
                <div
                  key={creator._id}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-green-800/30 hover:border-green-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start mb-4">
                        <div className="flex-shrink-0 mr-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4"
                            style={{backgroundColor: index === 0 ? '#C5F37D' : '#057B51'}}
                          >
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">
                              {creator.handle}
                            </h3>
                            <div className="flex gap-1">
                              {creator.safetyFlags.adult === false && creator.safetyFlags.controversial === false && (
                                <div className="px-2 py-1 bg-green-900/30 border border-green-600 rounded text-xs font-medium" style={{color: '#C5F37D'}}>
                                  ✓ Safe
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {creator.platforms.map(platform => (
                              <div key={platform} className="flex items-center gap-1 px-3 py-1 bg-gray-800/60 rounded-full text-sm">
                                <span>{getPlatformIcon(platform)}</span>
                                <span className="text-gray-300">{platform}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {creator.verticals.map(vertical => (
                              <div key={vertical} className="px-3 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#01402F', color: '#C5F37D'}}>
                                {vertical}
                              </div>
                            ))}
                            {creator.contentTone.map(tone => (
                              <div key={tone} className="px-3 py-1 bg-black/50 text-gray-300 rounded-full text-xs font-medium capitalize">
                                {tone}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-center p-3 bg-black/30 rounded-lg">
                              <div className="text-lg font-bold" style={{color: '#C5F37D'}}>
                                {formatNumber(creator.avgViews)}
                              </div>
                              <div className="text-xs text-gray-400">Avg Views</div>
                            </div>
                            <div className="text-center p-3 bg-black/30 rounded-lg">
                              <div className="text-lg font-bold" style={{color: '#C5F37D'}}>
                                {formatPercentage(creator.engagementRate)}
                              </div>
                              <div className="text-xs text-gray-400">Engagement</div>
                            </div>
                            <div className="text-center p-3 bg-black/30 rounded-lg">
                              <div className="text-lg font-bold" style={{color: '#C5F37D'}}>
                                {formatCurrency(creator.basePriceINR)}
                              </div>
                              <div className="text-xs text-gray-400">Base Price</div>
                            </div>
                            <div className="text-center p-3 bg-black/30 rounded-lg">
                              <div className="text-lg font-bold" style={{color: '#C5F37D'}}>
                                {Object.keys(creator.audienceGeo).length}
                              </div>
                              <div className="text-xs text-gray-400">Locations</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 lg:ml-6">
                      <div className="text-center lg:text-right">
                        <div 
                          className="text-4xl font-bold mb-1"
                          style={{color: getScoreColor(totalScore)}}
                        >
                          {totalScore}
                        </div>
                        <div className="text-sm text-gray-400 mb-4">
                          {getScoreGrade(totalScore)} Match
                        </div>
                        <button
                          onClick={() => setSelectedCreator(selectedCreator === creator._id ? null : creator._id)}
                          className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                          style={{backgroundColor: '#057B51', color: 'white', cursor: 'pointer'}}
                        >
                          {selectedCreator === creator._id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedCreator === creator._id && (
                    <div className="mt-8 pt-6 border-t border-green-800/30 animate-fade-in">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Match Reasons */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4" style={{color: '#C5F37D'}}>
                            Match Reasons
                          </h4>
                          <div className="grid gap-2">
                            {reasons.map((reason, reasonIndex) => (
                              <div
                                key={reasonIndex}
                                className="bg-green-900/20 border border-green-700/30 rounded-lg px-4 py-3"
                              >
                                <div className="flex items-center">
                                  <div 
                                    className="w-2 h-2 rounded-full mr-3"
                                    style={{backgroundColor: '#C5F37D'}}
                                  ></div>
                                  <span className="text-sm text-gray-200">{reason}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4" style={{color: '#C5F37D'}}>
                            Audience Demographics
                          </h4>

                          <div className="mb-6">
                            <h5 className="text-sm font-medium text-gray-300 mb-3">Geographic Distribution</h5>
                            <div className="space-y-2">
                              {Object.entries(creator.audienceGeo).map(([location, percentage]) => (
                                <div key={location} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-300">{location}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                          width: `${percentage * 100}%`,
                                          backgroundColor: '#057B51'
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium" style={{color: '#C5F37D'}}>
                                      {formatPercentage(percentage)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-3">Age Distribution</h5>
                            <div className="space-y-2">
                              {Object.entries(creator.audienceAge).map(([ageRange, percentage]) => (
                                <div key={ageRange} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-300">{ageRange}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                          width: `${percentage * 100}%`,
                                          backgroundColor: '#057B51'
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium" style={{color: '#C5F37D'}}>
                                      {formatPercentage(percentage)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Past Brand Categories */}
                          <div className="mt-6">
                            <h5 className="text-sm font-medium text-gray-300 mb-3">Past Brand Categories</h5>
                            <div className="flex flex-wrap gap-2">
                              {creator.pastBrandCategories.map(category => (
                                <div key={category} className="px-3 py-1 bg-black/60 rounded-full text-xs text-gray-300">
                                  {category}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {creators.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="mb-6">
                <div 
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                  style={{backgroundColor: '#01402F'}}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                No Creators Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your brand brief criteria to find matching creators.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            Data-led influencer matching • Measurable results through creative excellence
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MatchConsole;