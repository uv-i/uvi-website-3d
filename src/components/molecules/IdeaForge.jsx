import React, { useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AIService } from '../../services/aiService';
import Button from '../atoms/Button';

const IdeaForge = () => {
  const { isDark } = useTheme();
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateIdea = async (e) => {
    e.preventDefault();
    if (!ideaPrompt.trim()) return;
    setIsGenerating(true);
    const result = await AIService.generateGameIdea(ideaPrompt);
    setGeneratedIdea(result);
    setIsGenerating(false);
  };

  return (
    <div className={`mb-16 border rounded-2xl p-8 relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-gray-900 to-black border-orange-500/30' : 'bg-gradient-to-r from-orange-50 to-white border-orange-200 shadow-lg'}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit size={120} className="text-orange-500" /></div>
      <div className="relative z-10">
        <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Sparkles className="text-amber-400" /> The Idea Forge
          <span className="text-xs bg-orange-600 px-2 py-0.5 rounded text-white ml-2">GEMINI AI</span>
        </h3>
        <p className={`mb-6 max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Running out of creativity? Let my AI prototype a new game concept for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={generateIdea} className="space-y-4">
            <input
              type="text"
              value={ideaPrompt}
              onChange={(e) => setIdeaPrompt(e.target.value)}
              placeholder="e.g., Cyberpunk farming simulator..."
              className={`w-full p-4 rounded border focus:outline-none transition-all ${
                isDark
                  ? 'bg-black/50 border-gray-700 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-orange-400 shadow-sm'
              }`}
            />
            <Button variant="ai" icon={BrainCircuit} isLoading={isGenerating}>Generate Concept ✨</Button>
          </form>
          <div className={`border rounded-lg p-6 min-h-[150px] flex flex-col justify-center ${isDark ? 'bg-black/40 border-gray-800' : 'bg-white/60 border-gray-200'}`}>
            {generatedIdea ? (
              <div className={`whitespace-pre-wrap font-mono text-sm leading-relaxed animate-[fadeIn_0.5s_ease-out] ${isDark ? 'text-amber-300' : 'text-orange-700'}`}>
                {generatedIdea}
              </div>
            ) : (
              <p className={`text-center italic text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {isGenerating ? "Analyzing gaming trends..." : "AI Output waiting for input..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaForge;
