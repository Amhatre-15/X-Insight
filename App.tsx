import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, AlertCircle, Loader2, BarChart3, Activity, Zap, Globe2, Filter, Users, Flame, Sparkles } from 'lucide-react';
import { analyzeTopic } from './services/gemini';
import { TopicAnalysis, SentimentType, Tweet } from './types';
import { SentimentDistributionChart, EngagementBarChart } from './components/Charts';
import { TweetFeed } from './components/TweetFeed';
import { Logo } from './components/Logo';

type FilterType = 'all' | 'viral' | 'influencers';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TopicAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setActiveFilter('all'); // Reset filter on new search

    try {
      const result = await analyzeTopic(topic);
      setData(result);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTweets = useMemo(() => {
    if (!data) return [];
    let tweets = [...data.tweets];

    if (activeFilter === 'viral') {
      // Sort by total engagement
      return tweets.sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets));
    } else if (activeFilter === 'influencers') {
      // Sort by follower count
      return tweets.sort((a, b) => b.followerCount - a.followerCount);
    }
    
    // Default: 'all' usually just keeps the original sample order (or could be chronological)
    return tweets;
  }, [data, activeFilter]);

  const getDominantColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case SentimentType.POSITIVE: return 'text-neon-cyan drop-shadow-[0_0_10px_rgba(46,242,255,0.4)]';
      case SentimentType.NEGATIVE: return 'text-neon-purple drop-shadow-[0_0_10px_rgba(160,107,255,0.4)]';
      default: return 'text-neon-blue drop-shadow-[0_0_10px_rgba(58,140,255,0.4)]';
    }
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-neon-cyan/20 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#0A0F1F]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <div>
                <span className="font-display font-bold text-2xl tracking-tight text-white block leading-none">
                  X Insight
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                  AI Sentinel
                </span>
              </div>
            </div>
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shadow-inner">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">System Active</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Hero Search Section */}
        <div className={`transition-all duration-700 ease-out ${data ? 'mb-12 opacity-100 translate-y-0' : 'min-h-[50vh] flex flex-col justify-center items-center text-center opacity-100'}`}>
          {!data && (
            <div className="mb-12 space-y-8 max-w-4xl animate-in fade-in zoom-in duration-700 flex flex-col items-center">
              <Logo size="xl" className="mb-4" />
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl leading-[0.9]">
                Decode the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple animate-gradient-x">Digital Pulse</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                AI-powered sentiment intelligence for X.
                <br className="hidden sm:block" /> Analyze data points in seconds to reveal unbiased truths.
              </p>
            </div>
          )}

          <form onSubmit={handleSearch} className={`relative group w-full ${data ? 'max-w-xl' : 'max-w-2xl'} mx-auto`}>
            {/* Input Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
            
            <div className="relative flex items-center bg-[#0A0F1F]/90 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 transition-all shadow-2xl">
              <Search className="absolute left-6 w-5 h-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Analyze a topic (e.g. Bitcoin, SpaceX)..."
                className="w-full bg-transparent text-white pl-14 pr-36 py-5 rounded-2xl focus:outline-none placeholder:text-slate-600 font-medium text-lg tracking-wide"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white px-8 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(58,140,255,0.2)] hover:shadow-[0_0_25px_rgba(160,107,255,0.4)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-95 flex items-center gap-2"
              >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="hidden sm:inline">Processing</span>
                    </>
                ) : "Analyze"}
              </button>
            </div>
          </form>

          {loading && !data && (
             <div className="mt-8 flex flex-col items-center justify-center animate-pulse gap-3">
                <div className="text-neon-cyan font-mono text-sm tracking-widest uppercase">Analyzing data points...</div>
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan w-1/2 animate-[shimmer_1.5s_infinite]"></div>
                </div>
             </div>
          )}

          {error && (
            <div className="mt-8 px-6 py-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3 text-red-300 backdrop-blur-sm max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[20px] p-6 hover:bg-[#111827]/40 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-3 text-slate-400">
                   <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue group-hover:scale-110 transition-transform"><Globe2 className="w-4 h-4" /></div>
                   <span className="text-xs font-bold uppercase tracking-widest opacity-70">Analyzed Data</span>
                </div>
                <div className="text-3xl font-display font-bold text-white tracking-tight">{data.summary.totalTweets.toLocaleString()} <span className="text-sm text-slate-500 font-normal">tweets</span></div>
              </div>
              
              <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[20px] p-6 hover:bg-[#111827]/40 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-3 text-slate-400">
                   <div className="p-2 rounded-lg bg-neon-purple/10 text-neon-purple group-hover:scale-110 transition-transform"><Activity className="w-4 h-4" /></div>
                   <span className="text-xs font-bold uppercase tracking-widest opacity-70">Sentiment</span>
                </div>
                <div className={`text-3xl font-display font-bold tracking-tight ${getDominantColor(data.summary.dominantSentiment)}`}>
                  {data.summary.dominantSentiment}
                </div>
              </div>

              <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[20px] p-6 hover:bg-[#111827]/40 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-3 text-slate-400">
                   <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan group-hover:scale-110 transition-transform"><Zap className="w-4 h-4" /></div>
                   <span className="text-xs font-bold uppercase tracking-widest opacity-70">Confidence</span>
                </div>
                <div className="text-3xl font-display font-bold text-white tracking-tight">{data.summary.confidenceScore}%</div>
              </div>

              <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[20px] p-6 hover:bg-[#111827]/40 hover:border-white/10 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/10 rounded-full blur-2xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-3 mb-3 text-slate-400 relative z-10">
                   <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform"><TrendingUp className="w-4 h-4" /></div>
                   <span className="text-xs font-bold uppercase tracking-widest opacity-70">Net Score</span>
                </div>
                <div className="text-3xl font-display font-bold text-emerald-400 tracking-tight relative z-10">
                  {Math.round(((data.summary.positiveCount - data.summary.negativeCount) / data.summary.totalTweets) * 100)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Visualizations */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Sentiment Chart */}
                <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neon-blue/10 rounded-lg"><BarChart3 className="w-5 h-5 text-neon-blue" /></div>
                      <h2 className="text-xl font-display font-semibold text-white">Sentiment Distribution</h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="relative h-64">
                      <div className="absolute inset-0 bg-neon-blue/5 blur-3xl rounded-full scale-75"></div>
                      <SentimentDistributionChart data={data} />
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Positive', count: data.summary.positiveCount, color: 'bg-neon-cyan', text: 'text-neon-cyan', percent: Math.round((data.summary.positiveCount / data.summary.totalTweets) * 100) },
                        { label: 'Neutral', count: data.summary.neutralCount, color: 'bg-neon-blue', text: 'text-neon-blue', percent: Math.round((data.summary.neutralCount / data.summary.totalTweets) * 100) },
                        { label: 'Negative', count: data.summary.negativeCount, color: 'bg-neon-purple', text: 'text-neon-purple', percent: Math.round((data.summary.negativeCount / data.summary.totalTweets) * 100) }
                      ].map((item) => (
                        <div key={item.label} className="group flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-default">
                          <div className="flex items-center gap-4">
                            <span className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`}></span>
                            <div>
                              <div className="text-sm font-medium text-slate-300">{item.label}</div>
                              <div className="text-xs text-slate-500 font-mono">{item.percent}% of total</div>
                            </div>
                          </div>
                          <span className={`font-mono text-xl font-bold ${item.text}`}>{item.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Engagement Chart */}
                <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-neon-purple/10 rounded-lg"><Sparkles className="w-5 h-5 text-neon-purple" /></div>
                    <h2 className="text-xl font-display font-semibold text-white">Viral Drivers</h2>
                  </div>
                  <EngagementBarChart data={data} />
                </div>

                {/* Word Cloud / Themes */}
                <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neon-cyan/10 rounded-lg"><Activity className="w-5 h-5 text-neon-cyan" /></div>
                    <h2 className="text-xl font-display font-semibold text-white">Trending Narratives</h2>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {data.summary.keyThemes.map((theme, idx) => (
                      <span 
                        key={idx} 
                        className="px-4 py-2 bg-white/[0.03] hover:bg-neon-blue/10 border border-white/5 hover:border-neon-blue/30 rounded-lg text-sm font-medium text-slate-300 hover:text-neon-cyan transition-all cursor-default"
                      >
                        #{theme.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Feed */}
              <div className="lg:col-span-1">
                <div className="bg-[#111827]/30 backdrop-blur-md border border-white/5 rounded-[24px] p-6 h-full max-h-[1000px] flex flex-col sticky top-24">
                  <div className="mb-6">
                      <div className="flex items-center justify-between mb-4 pl-1">
                        <h2 className="text-xl font-display font-semibold text-white">Live Feed</h2>
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2.5 py-1 bg-white/5 rounded-md border border-white/5">
                        {filteredTweets.length} Results
                        </span>
                      </div>
                      
                      {/* Filter Tabs */}
                      <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${activeFilter === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Filter className="w-3 h-3" /> All
                        </button>
                        <button 
                            onClick={() => setActiveFilter('viral')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${activeFilter === 'viral' ? 'bg-neon-purple/20 text-neon-purple shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Flame className="w-3 h-3" /> Viral
                        </button>
                        <button 
                            onClick={() => setActiveFilter('influencers')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${activeFilter === 'influencers' ? 'bg-neon-cyan/20 text-neon-cyan shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Users className="w-3 h-3" /> Top
                        </button>
                      </div>
                  </div>

                  <div className="overflow-y-auto pr-1 -mr-1 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <TweetFeed tweets={filteredTweets} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;