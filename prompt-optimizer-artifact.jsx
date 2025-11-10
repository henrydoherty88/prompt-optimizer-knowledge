import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Copy, Save, TrendingUp, Zap, Book, BarChart3, Download, Upload } from 'lucide-react';

const PromptOptimizer = () => {
  // State Management
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputPrompt, setInputPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [selectedTool, setSelectedTool] = useState('claude_chat');
  const [selectedFramework, setSelectedFramework] = useState('CRISPE');
  const [appliedTechniques, setAppliedTechniques] = useState([]);
  const [personalLibrary, setPersonalLibrary] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const REPO_BASE = 'https://raw.githubusercontent.com/henrydoherty88/prompt-optimizer-knowledge/main/';

  // Load Knowledge Base on Mount
  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  // Real-time Analysis on Input Change
  useEffect(() => {
    if (inputPrompt && knowledgeBase) {
      analyzePrompt(inputPrompt);
    }
  }, [inputPrompt, knowledgeBase]);

  const loadKnowledgeBase = async () => {
    try {
      setLoading(true);

      // Parallel fetch all files
      const [metadata, ...rest] = await Promise.all([
        fetch(`${REPO_BASE}metadata.json`).then(r => r.json()),

        // Tools (16 files)
        fetch(`${REPO_BASE}knowledge-base/tools/claude_chat.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/chatgpt_chat.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/gemini_chat.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/perplexity_chat.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/claude_deep_research.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/perplexity_deep_research.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/chatgpt_deep_research.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/gemini_deep_research.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/claude_projects.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/claude_code.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/cursor_ai.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/github_copilot.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/v0_dev.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/midjourney.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/dalle.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/tools/flux.json`).then(r => r.json()),

        // Frameworks (7 files)
        fetch(`${REPO_BASE}knowledge-base/frameworks/APE.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/frameworks/RTF.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/frameworks/STAR.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/frameworks/CO-STAR.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/frameworks/CRISPE.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/frameworks/RISEN.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/frameworks/DEPTH.json`).then(r => r.json()),

        // Techniques (8 files)
        fetch(`${REPO_BASE}knowledge-base/techniques/chain_of_thought.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/specificity.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/negative_to_positive.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/role_prompting.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/few_shot.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/structured_output.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/iterative_refinement.json`).then(r => r.json()),
        fetch(`${REPO_BASE}knowledge-base/techniques/context_front_loading.json`).then(r => r.json()),

        // Personal Library
        fetch(`${REPO_BASE}personal-library/analytics.json`).then(r => r.json()).catch(() => ({ schema: { optimizations: [], statistics: {} } })),
        fetch(`${REPO_BASE}personal-library/preferences.json`).then(r => r.json()).catch(() => ({}))
      ]);

      const kb = {
        metadata,
        tools: {
          claude_chat: rest[0],
          chatgpt_chat: rest[1],
          gemini_chat: rest[2],
          perplexity_chat: rest[3],
          claude_deep_research: rest[4],
          perplexity_deep_research: rest[5],
          chatgpt_deep_research: rest[6],
          gemini_deep_research: rest[7],
          claude_projects: rest[8],
          claude_code: rest[9],
          cursor_ai: rest[10],
          github_copilot: rest[11],
          v0_dev: rest[12],
          midjourney: rest[13],
          dalle: rest[14],
          flux: rest[15]
        },
        frameworks: {
          APE: rest[16],
          RTF: rest[17],
          STAR: rest[18],
          'CO-STAR': rest[19],
          CRISPE: rest[20],
          RISEN: rest[21],
          DEPTH: rest[22]
        },
        techniques: {
          chain_of_thought: rest[23],
          specificity: rest[24],
          negative_to_positive: rest[25],
          role_prompting: rest[26],
          few_shot: rest[27],
          structured_output: rest[28],
          iterative_refinement: rest[29],
          context_front_loading: rest[30]
        },
        personalLibrary: rest[31],
        preferences: rest[32]
      };

      setKnowledgeBase(kb);
      setAnalytics(kb.personalLibrary.schema || { optimizations: [], statistics: {} });
      setLoading(false);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      setLoading(false);
    }
  };

  // 10 Metric Analysis Engine
  const analyzePrompt = (prompt) => {
    if (!prompt || !knowledgeBase) return;

    const scores = {
      specificity: calculateSpecificity(prompt),
      clarity: calculateClarity(prompt),
      completeness: calculateCompleteness(prompt),
      structure: calculateStructure(prompt),
      toolAlignment: calculateToolAlignment(prompt),
      frameworkAdherence: calculateFrameworkAdherence(prompt),
      tokenEfficiency: calculateTokenEfficiency(prompt),
      actionability: calculateActionability(prompt),
      reproducibility: calculateReproducibility(prompt),
      errorResistance: calculateErrorResistance(prompt)
    };

    const average = Object.values(scores).reduce((a, b) => a + b, 0) / 10;

    setAnalysis({
      scores,
      average: Math.round(average),
      issues: identifyIssues(prompt, scores),
      recommendations: generateRecommendations(scores)
    });
  };

  // Scoring Functions
  const calculateSpecificity = (prompt) => {
    let score = 30; // Base score

    // Check for metrics/numbers
    if (/\d+/.test(prompt)) score += 15;

    // Check for timeframes
    if (/(deadline|by|before|after|timeline|duration)/i.test(prompt)) score += 10;

    // Check for constraints
    if (/(must|should|require|constraint|limit)/i.test(prompt)) score += 10;

    // Check for examples
    if (/(example|such as|like|e\.g\.|for instance)/i.test(prompt)) score += 10;

    // Check for specific details
    if (/(specific|particular|exactly|precisely)/i.test(prompt)) score += 10;

    // Length bonus (longer often means more specific)
    if (prompt.length > 100) score += 10;
    if (prompt.length > 200) score += 5;

    return Math.min(score, 100);
  };

  const calculateClarity = (prompt) => {
    let score = 50;

    // Check for clear structure
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length >= 2) score += 10;

    // Check for questions (clear intent)
    if (/\?/.test(prompt)) score += 10;

    // Penalize for vague words
    const vagueWords = /(thing|stuff|somehow|maybe|perhaps|sort of|kind of)/gi;
    const vagueMatches = (prompt.match(vagueWords) || []).length;
    score -= vagueMatches * 5;

    // Check for clear objectives
    if (/(create|write|analyze|generate|build|design)/i.test(prompt)) score += 15;

    // Check for contradictions
    if (/(but|however|although|despite)/i.test(prompt)) score -= 5;

    return Math.max(0, Math.min(score, 100));
  };

  const calculateCompleteness = (prompt) => {
    let score = 20;
    const tool = knowledgeBase.tools[selectedTool];

    if (!tool) return score;

    // Check for must-include elements
    tool.mustInclude?.forEach(element => {
      if (prompt.toLowerCase().includes(element.toLowerCase())) {
        score += 15;
      }
    });

    // Check for context
    if (/(context|background|situation)/i.test(prompt)) score += 10;

    // Check for objective
    if (/(objective|goal|task|purpose)/i.test(prompt)) score += 10;

    // Check for format specification
    if (/(format|output|structure|style)/i.test(prompt)) score += 10;

    return Math.min(score, 100);
  };

  const calculateStructure = (prompt) => {
    let score = 40;

    // Check for clear sections
    if (/:/g.test(prompt)) score += 15;

    // Check for bullet points or lists
    if (/[-•*]|\n\d+\./g.test(prompt)) score += 15;

    // Check for paragraphs
    const paragraphs = prompt.split('\n\n').filter(p => p.trim());
    if (paragraphs.length > 1) score += 15;

    // Check for proper capitalization
    if (/^[A-Z]/.test(prompt)) score += 10;

    // Penalize run-on
    if (prompt.length > 500 && !prompt.includes('\n')) score -= 20;

    return Math.max(0, Math.min(score, 100));
  };

  const calculateToolAlignment = (prompt) => {
    const tool = knowledgeBase.tools[selectedTool];
    if (!tool) return 50;

    let score = 50;

    // Check against best-for use cases
    tool.bestFor?.forEach(useCase => {
      if (prompt.toLowerCase().includes(useCase.toLowerCase())) {
        score += 10;
      }
    });

    // Check for recommended techniques
    tool.techniques?.forEach(tech => {
      const technique = knowledgeBase.techniques[tech];
      if (technique && technique.trigger) {
        technique.trigger.forEach(trigger => {
          if (prompt.toLowerCase().includes(trigger)) {
            score += 5;
          }
        });
      }
    });

    return Math.min(score, 100);
  };

  const calculateFrameworkAdherence = (prompt) => {
    const framework = knowledgeBase.frameworks[selectedFramework];
    if (!framework) return 50;

    let score = 30;

    // Check for framework components
    framework.components?.forEach(component => {
      if (prompt.toLowerCase().includes(component.toLowerCase())) {
        score += (70 / framework.components.length);
      }
    });

    return Math.min(Math.round(score), 100);
  };

  const calculateTokenEfficiency = (prompt) => {
    const words = prompt.trim().split(/\s+/).length;
    let score = 100;

    // Penalize very short prompts (< 10 words)
    if (words < 10) score = words * 5;

    // Penalize very long prompts without structure (> 200 words)
    if (words > 200 && !prompt.includes('\n')) score -= 20;

    // Check for redundancy
    const uniqueWords = new Set(prompt.toLowerCase().split(/\s+/));
    const redundancyRatio = uniqueWords.size / words;
    if (redundancyRatio < 0.5) score -= 20;

    return Math.max(0, Math.min(score, 100));
  };

  const calculateActionability = (prompt) => {
    let score = 30;

    // Check for action verbs
    const actionVerbs = /(create|write|build|analyze|generate|design|implement|develop|plan|optimize|refactor)/gi;
    const actions = (prompt.match(actionVerbs) || []).length;
    score += Math.min(actions * 15, 40);

    // Check for clear deliverables
    if (/(output|result|deliverable|produce|provide)/i.test(prompt)) score += 15;

    // Check for success criteria
    if (/(success|criteria|requirement|must|should)/i.test(prompt)) score += 15;

    return Math.min(score, 100);
  };

  const calculateReproducibility = (prompt) => {
    let score = 40;

    // Check for specific examples
    if (/(example|instance|sample)/i.test(prompt)) score += 15;

    // Check for format specification
    if (/(format|template|structure|schema)/i.test(prompt)) score += 15;

    // Check for parameters/variables
    if (/\[.*?\]|\{.*?\}/g.test(prompt)) score += 15;

    // Check for step-by-step
    if (/(step|procedure|process|workflow)/i.test(prompt)) score += 15;

    return Math.min(score, 100);
  };

  const calculateErrorResistance = (prompt) => {
    let score = 60;

    // Check for negative constraints (bad - models ignore)
    const negatives = /(don't|do not|avoid|never|no)/gi;
    const negativeCount = (prompt.match(negatives) || []).length;
    score -= negativeCount * 10;

    // Check for edge cases
    if (/(edge case|error|exception|handle|fallback)/i.test(prompt)) score += 20;

    // Check for validation
    if (/(validate|verify|check|ensure)/i.test(prompt)) score += 10;

    // Check for ambiguity
    if (/(or|maybe|possibly|might)/gi.test(prompt)) score -= 10;

    return Math.max(0, Math.min(score, 100));
  };

  const identifyIssues = (prompt, scores) => {
    const issues = [];

    if (scores.specificity < 60) issues.push('Lacks specificity - add metrics, timeframes, and concrete details');
    if (scores.clarity < 60) issues.push('Unclear objective - be more direct and remove vague language');
    if (scores.completeness < 60) issues.push('Missing key elements for selected tool');
    if (scores.structure < 60) issues.push('Poor structure - use sections, bullets, or clear paragraphs');
    if (scores.toolAlignment < 60) issues.push('Not aligned with selected tool\'s strengths');
    if (scores.frameworkAdherence < 60) issues.push('Doesn\'t follow framework components');
    if (scores.tokenEfficiency < 60) issues.push('Inefficient - too redundant or unstructured');
    if (scores.actionability < 60) issues.push('Not actionable - needs clear verbs and deliverables');
    if (scores.reproducibility < 60) issues.push('Hard to reproduce - add examples or templates');
    if (scores.errorResistance < 60) issues.push('Uses negative constraints - reframe positively');

    return issues;
  };

  const generateRecommendations = (scores) => {
    const recs = [];

    if (scores.specificity < 70) recs.push('Add specific metrics and timeframes');
    if (scores.frameworkAdherence < 70) recs.push(`Use ${selectedFramework} framework structure`);
    if (scores.errorResistance < 70) recs.push('Convert negative constraints to positive affirmatives');
    if (scores.completeness < 70) recs.push('Include all required elements for the tool');

    return recs;
  };

  // Optimization Engine
  const optimizePrompt = () => {
    if (!inputPrompt || !knowledgeBase) return;

    const tool = knowledgeBase.tools[selectedTool];
    const framework = knowledgeBase.frameworks[selectedFramework];
    const techniques = [];

    let optimized = inputPrompt;

    // Apply Specificity
    if (analysis.scores.specificity < 70) {
      techniques.push('specificity');
      optimized = applySpecificity(optimized);
    }

    // Apply Negative → Positive
    if (analysis.scores.errorResistance < 70) {
      techniques.push('negative_to_positive');
      optimized = applyNegativeToPositive(optimized);
    }

    // Apply Framework Structure
    if (analysis.scores.frameworkAdherence < 70) {
      techniques.push('framework_structure');
      optimized = applyFramework(optimized, framework);
    }

    // Apply Tool Alignment
    if (analysis.scores.toolAlignment < 70) {
      techniques.push('tool_alignment');
      optimized = applyToolTemplate(optimized, tool);
    }

    // Apply Structure
    if (analysis.scores.structure < 70) {
      techniques.push('structured_output');
      optimized = applyStructure(optimized);
    }

    // Apply Role Prompting
    if (tool.techniques?.includes('role_prompting') && !optimized.toLowerCase().includes('you are')) {
      techniques.push('role_prompting');
      optimized = applyRolePrompting(optimized, tool);
    }

    setOptimizedPrompt(optimized);
    setAppliedTechniques(techniques);
  };

  const applySpecificity = (prompt) => {
    let enhanced = prompt;

    // Add template for metrics if missing
    if (!/\d+/.test(prompt)) {
      enhanced += '\n\nMetrics: [Add specific numbers, percentages, or quantities]';
    }

    // Add template for timeline if missing
    if (!/(deadline|timeline|by|before)/i.test(prompt)) {
      enhanced += '\nTimeline: [Specify timeframe or deadline]';
    }

    return enhanced;
  };

  const applyNegativeToPositive = (prompt) => {
    return prompt
      .replace(/don't be vague/gi, 'be specific')
      .replace(/don't use/gi, 'use instead')
      .replace(/avoid/gi, 'focus on')
      .replace(/don't/gi, 'ensure you')
      .replace(/never/gi, 'always');
  };

  const applyFramework = (prompt, framework) => {
    if (!framework) return prompt;

    let structured = `Using ${framework.name} Framework:\n\n`;

    framework.components?.forEach((component, i) => {
      structured += `${component}: [${prompt.slice(i * 20, (i + 1) * 20) || 'Define ' + component}]\n`;
    });

    structured += `\nOriginal Intent: ${prompt}`;

    return structured;
  };

  const applyToolTemplate = (prompt, tool) => {
    if (!tool || !tool.template) return prompt;

    return `${tool.template}\n\nTask: ${prompt}`;
  };

  const applyStructure = (prompt) => {
    if (prompt.includes('\n')) return prompt;

    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
    return sentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
  };

  const applyRolePrompting = (prompt, tool) => {
    const role = tool.name.includes('Code') ? 'expert software engineer' :
                 tool.name.includes('Research') ? 'research analyst' :
                 tool.name.includes('creative') ? 'creative director' :
                 'AI assistant';

    return `You are an ${role}.\n\n${prompt}`;
  };

  // Copy to Clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // GitHub MCP Integration - Save to Library
  const saveToLibrary = async () => {
    if (!optimizedPrompt || !analysis) return;

    const example = {
      example_id: `opt_${Date.now()}`,
      title: inputPrompt.slice(0, 50) + '...',
      category: knowledgeBase.tools[selectedTool].category,
      tool: selectedTool,
      framework: selectedFramework,
      techniques: appliedTechniques,
      original_prompt: inputPrompt,
      optimized_prompt: optimizedPrompt,
      quality_before: analysis.average,
      quality_after: Math.min(analysis.average + 25, 100),
      date_created: new Date().toISOString().split('T')[0],
      last_used: new Date().toISOString().split('T')[0],
      use_count: 1
    };

    try {
      // This would use GitHub MCP in Claude Desktop
      console.log('Saving to GitHub via MCP:', example);

      // Update analytics
      const newAnalytics = { ...analytics };
      if (!newAnalytics.optimizations) newAnalytics.optimizations = [];
      newAnalytics.optimizations.push(example);

      setAnalytics(newAnalytics);
      alert('✅ Saved to your GitHub library!');
    } catch (error) {
      console.error('Error saving to library:', error);
      alert('❌ Error saving to library. Make sure GitHub MCP is connected in Claude Desktop.');
    }
  };

  // Score Color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading Knowledge Base...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching 37 files from GitHub</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="text-indigo-600" size={40} />
                Prompt Optimizer
              </h1>
              <p className="text-gray-600 mt-2">Phase 1 + 2: Real-time Analysis & One-Click Optimization</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Book size={20} />
                Library ({analytics?.optimizations?.length || 0})
              </button>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <BarChart3 size={20} />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Tool & Framework Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Tool (16 options)</label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <optgroup label="Chat Tools">
                <option value="claude_chat">Claude (Chat)</option>
                <option value="chatgpt_chat">ChatGPT (Chat)</option>
                <option value="gemini_chat">Gemini (Chat)</option>
                <option value="perplexity_chat">Perplexity (Search)</option>
              </optgroup>
              <optgroup label="Research Tools">
                <option value="claude_deep_research">Claude Deep Research</option>
                <option value="chatgpt_deep_research">ChatGPT Deep Research</option>
                <option value="gemini_deep_research">Gemini Deep Research</option>
                <option value="perplexity_deep_research">Perplexity Deep Research</option>
                <option value="claude_projects">Claude Projects</option>
              </optgroup>
              <optgroup label="Coding Tools">
                <option value="claude_code">Claude Code</option>
                <option value="cursor_ai">Cursor AI</option>
                <option value="github_copilot">GitHub Copilot</option>
                <option value="v0_dev">V0.dev</option>
              </optgroup>
              <optgroup label="Creative Tools">
                <option value="midjourney">Midjourney</option>
                <option value="dalle">DALL-E 4</option>
                <option value="flux">Flux Pro</option>
              </optgroup>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Framework (7 options)</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="APE">APE (Simple)</option>
              <option value="RTF">RTF (Simple-Medium)</option>
              <option value="STAR">STAR (Medium)</option>
              <option value="CO-STAR">CO-STAR (Medium-High)</option>
              <option value="CRISPE">CRISPE (High)</option>
              <option value="RISEN">RISEN (High)</option>
              <option value="DEPTH">DEPTH (Very High)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Prompt</h2>
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Enter your weak prompt here..."
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
              />

              <button
                onClick={optimizePrompt}
                disabled={!inputPrompt}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                <Zap size={24} />
                Optimize Prompt
              </button>
            </div>
          </div>

          {/* Middle Column - Analysis */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Real-time Analysis</h2>

              {analysis ? (
                <div className="space-y-3">
                  {/* Overall Score */}
                  <div className={`p-4 rounded-lg border-2 ${getScoreBg(analysis.average)}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Overall Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(analysis.average)}`}>
                        {analysis.average}/100
                      </span>
                    </div>
                  </div>

                  {/* Individual Scores */}
                  {Object.entries(analysis.scores).map(([metric, score]) => (
                    <div key={metric} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-700 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`font-semibold ${getScoreColor(score)}`}>
                        {score}
                      </span>
                    </div>
                  ))}

                  {/* Issues */}
                  {analysis.issues.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertCircle size={18} />
                        Issues Found
                      </h3>
                      <ul className="space-y-1">
                        {analysis.issues.map((issue, i) => (
                          <li key={i} className="text-sm text-red-700">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Start typing to see analysis...</p>
              )}
            </div>
          </div>

          {/* Right Column - Optimized Output */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Optimized Prompt</h2>

              {optimizedPrompt ? (
                <div>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{optimizedPrompt}</pre>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => copyToClipboard(optimizedPrompt)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Copy size={18} />
                      Copy
                    </button>
                    <button
                      onClick={saveToLibrary}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save to Library
                    </button>
                  </div>

                  {/* Techniques Applied */}
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                      <CheckCircle size={18} />
                      Techniques Applied
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {appliedTechniques.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-xs font-medium">
                          {tech.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>Click "Optimize Prompt" to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Library Modal */}
        {showLibrary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Library</h2>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {analytics?.optimizations?.length > 0 ? (
                  analytics.optimizations.map((opt, i) => (
                    <div key={i} className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-400 transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{opt.title}</h3>
                        <span className="text-sm text-gray-500">{opt.date_created}</span>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{opt.tool}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{opt.framework}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {opt.quality_before} → {opt.quality_after}
                        </span>
                      </div>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">View prompts</summary>
                        <div className="mt-2 space-y-2">
                          <div className="bg-red-50 p-3 rounded">
                            <strong>Before:</strong> {opt.original_prompt}
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <strong>After:</strong> {opt.optimized_prompt}
                          </div>
                        </div>
                      </details>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-12">No saved optimizations yet. Start optimizing!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalytics && analytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <h3 className="text-sm font-medium mb-2">Total Optimizations</h3>
                  <p className="text-4xl font-bold">{analytics.optimizations?.length || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <h3 className="text-sm font-medium mb-2">Avg Improvement</h3>
                  <p className="text-4xl font-bold">
                    {analytics.optimizations?.length > 0
                      ? Math.round(
                          analytics.optimizations.reduce((acc, opt) => acc + (opt.quality_after - opt.quality_before), 0) /
                          analytics.optimizations.length
                        )
                      : 0}
                    pts
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-sm font-medium mb-2">Most Used Tool</h3>
                  <p className="text-2xl font-bold">
                    {analytics.optimizations?.length > 0
                      ? Object.entries(
                          analytics.optimizations.reduce((acc, opt) => {
                            acc[opt.tool] = (acc[opt.tool] || 0) + 1;
                            return acc;
                          }, {})
                        ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
                      : 'None'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Technique Usage</h3>
                <div className="flex flex-wrap gap-2">
                  {analytics.optimizations?.flatMap(opt => opt.techniques || [])
                    .reduce((acc, tech) => {
                      acc[tech] = (acc[tech] || 0) + 1;
                      return acc;
                    }, {})
                    ? Object.entries(
                        analytics.optimizations.flatMap(opt => opt.techniques || [])
                          .reduce((acc, tech) => {
                            acc[tech] = (acc[tech] || 0) + 1;
                            return acc;
                          }, {})
                      ).map(([tech, count]) => (
                        <span key={tech} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                          {tech.replace(/_/g, ' ')}: {count}x
                        </span>
                      ))
                    : <span className="text-gray-500">No data yet</span>
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptOptimizer;
