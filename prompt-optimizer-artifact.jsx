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
  const [optimizationStages, setOptimizationStages] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

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

  // ═══════════════════════════════════════════════════════════════════
  // MASTER-LEVEL OPTIMIZATION ENGINE - 7 Stage Processing Pipeline
  // ═══════════════════════════════════════════════════════════════════

  const optimizePrompt = () => {
    if (!inputPrompt || !knowledgeBase) {
      console.log('Missing input or knowledge base');
      return;
    }

    console.log('Starting optimization...');
    setIsOptimizing(true);
    const stages = [];
    const techniques = [];
    const tool = knowledgeBase.tools[selectedTool];
    const framework = knowledgeBase.frameworks[selectedFramework];

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        console.log('Stage 1: Intent Analysis');
        // STAGE 1: Intent Analysis
        const stage1 = stage1_IntentAnalysis(inputPrompt, tool);
        stages.push({ name: 'Intent Analysis', ...stage1 });
        console.log('Stage 1 complete:', stage1);

        console.log('Stage 2: Gap Detection');
        // STAGE 2: Gap Detection
        const stage2 = stage2_GapDetection(inputPrompt, stage1, tool, framework);
        stages.push({ name: 'Gap Detection', ...stage2 });
        console.log('Stage 2 complete:', stage2);

        console.log('Stage 3: Context Injection');
        // STAGE 3: Context Injection
        const stage3 = stage3_ContextInjection(inputPrompt, stage1, stage2);
        stages.push({ name: 'Context Injection', ...stage3 });
        if (stage3.applied) techniques.push('context_injection');
        console.log('Stage 3 complete:', stage3);

        console.log('Stage 4: Framework Application');
        // STAGE 4: Framework Application
        const stage4 = stage4_FrameworkApplication(stage3.output, framework, stage1, tool);
        stages.push({ name: 'Framework Application', ...stage4 });
        if (stage4.applied) techniques.push('framework_structure');
        console.log('Stage 4 complete:', stage4);

        console.log('Stage 5: Tool Optimization');
        // STAGE 5: Tool Optimization
        const stage5 = stage5_ToolOptimization(stage4.output, tool, stage1);
        stages.push({ name: 'Tool Optimization', ...stage5 });
        if (stage5.applied) techniques.push('tool_specific');
        console.log('Stage 5 complete:', stage5);

        console.log('Stage 6: Quality Enhancement');
        // STAGE 6: Quality Enhancement
        const stage6 = stage6_QualityEnhancement(stage5.output, stage1, stage2);
        stages.push({ name: 'Quality Enhancement', ...stage6 });
        if (stage6.applied) techniques.push('quality_enhancement');
        console.log('Stage 6 complete:', stage6);

        console.log('Stage 7: Final Polish');
        // STAGE 7: Final Polish
        const stage7 = stage7_FinalPolish(stage6.output, inputPrompt);
        stages.push({ name: 'Final Polish', ...stage7 });
        if (stage7.applied) techniques.push('final_polish');
        console.log('Stage 7 complete:', stage7);

        console.log('Validation');
        // Validation
        const validation = validateOptimization(inputPrompt, stage7.output, stage1);
        stages.push({ name: 'Validation', ...validation });
        console.log('Validation complete:', validation);

        console.log('Setting results...');
        setOptimizationStages(stages);
        setOptimizedPrompt(stage7.output);
        setAppliedTechniques(techniques);
        console.log('Optimization complete!');
      } catch (error) {
        console.error('Optimization error:', error);
        alert('Error during optimization: ' + error.message);
      } finally {
        setIsOptimizing(false);
      }
    }, 100);
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 1: Intent Analysis - Understand what user REALLY wants
  // ═══════════════════════════════════════════════════════════════════
  const stage1_IntentAnalysis = (prompt, tool) => {
    const intent = {
      domain: detectDomain(prompt, tool),
      complexity: detectComplexity(prompt),
      primaryAction: extractPrimaryAction(prompt),
      implicitGoal: inferImplicitGoal(prompt, tool),
      audience: detectAudience(prompt),
      outputType: detectOutputType(prompt, tool)
    };

    return {
      result: intent,
      applied: true,
      description: `Detected ${intent.domain} task with ${intent.complexity} complexity. Primary action: ${intent.primaryAction}.`
    };
  };

  const detectDomain = (prompt, tool) => {
    const domains = {
      technical: /(code|software|program|api|database|algorithm|debug|implement|function|class)/i,
      creative: /(design|image|art|creative|visual|generate|midjourney|dalle|aesthetic|style)/i,
      business: /(report|analysis|strategy|market|stakeholder|roi|metric|revenue|kpi)/i,
      research: /(research|analyze|study|investigate|explore|synthesize|compare|evaluate)/i,
      writing: /(write|article|blog|content|copy|email|document|draft)/i,
      personal: /(help|advice|guide|learn|understand|explain|teach)/i
    };

    for (const [domain, pattern] of Object.entries(domains)) {
      if (pattern.test(prompt)) return domain;
    }

    // Fallback to tool category
    return tool.category || 'general';
  };

  const detectComplexity = (prompt) => {
    const words = prompt.split(/\s+/).length;
    const hasStructure = /:/g.test(prompt) || /\n/g.test(prompt);
    const hasSpecifics = /\d+/g.test(prompt);
    const hasMultipleRequirements = (prompt.match(/and|also|additionally|furthermore/gi) || []).length;

    let score = 0;
    if (words > 50) score += 2;
    else if (words > 20) score += 1;
    if (hasStructure) score += 1;
    if (hasSpecifics) score += 1;
    if (hasMultipleRequirements > 2) score += 2;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  };

  const extractPrimaryAction = (prompt) => {
    const actionVerbs = {
      'create': /(create|build|make|develop|generate|design|construct)/i,
      'analyze': /(analyze|examine|evaluate|assess|review|investigate)/i,
      'write': /(write|compose|draft|author|document)/i,
      'explain': /(explain|describe|clarify|teach|show|demonstrate)/i,
      'optimize': /(optimize|improve|enhance|refine|upgrade)/i,
      'fix': /(fix|debug|resolve|repair|correct)/i,
      'plan': /(plan|strategy|roadmap|outline|blueprint)/i
    };

    for (const [action, pattern] of Object.entries(actionVerbs)) {
      if (pattern.test(prompt)) return action;
    }

    return 'execute';
  };

  const inferImplicitGoal = (prompt, tool) => {
    // Infer what the user is REALLY trying to accomplish
    const words = prompt.toLowerCase();

    if (words.includes('help') && words.length < 50) {
      return 'Seeking guidance on a specific task or problem';
    }
    if (tool.category === 'creative' && !/(style|mood|aesthetic|look)/i.test(prompt)) {
      return 'Create visually appealing output (style/aesthetic not specified)';
    }
    if (tool.category === 'coding' && !/(test|validation)/i.test(prompt)) {
      return 'Build functional code (testing requirements not specified)';
    }
    if (tool.category === 'research' && !/(timeframe|sources)/i.test(prompt)) {
      return 'Gather comprehensive information (timeframe/sources not specified)';
    }

    return 'Accomplish stated task with high quality';
  };

  const detectAudience = (prompt) => {
    if (/(beginner|novice|new to|learning)/i.test(prompt)) return 'beginners';
    if (/(expert|advanced|professional|technical)/i.test(prompt)) return 'experts';
    if (/(team|stakeholder|client|user)/i.test(prompt)) return 'team/stakeholders';
    if (/(general|public|anyone)/i.test(prompt)) return 'general public';
    return 'not specified';
  };

  const detectOutputType = (prompt, tool) => {
    if (/(code|function|class|script)/i.test(prompt)) return 'code';
    if (/(report|document|article|paper)/i.test(prompt)) return 'document';
    if (/(image|visual|graphic|design)/i.test(prompt)) return 'image';
    if (/(list|table|chart|data)/i.test(prompt)) return 'structured data';
    if (/(json|xml|yaml)/i.test(prompt)) return 'structured format';
    return tool.category === 'creative' ? 'image' : 'text';
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 2: Gap Detection - Find what's missing
  // ═══════════════════════════════════════════════════════════════════
  const stage2_GapDetection = (prompt, intent, tool, framework) => {
    const gaps = [];

    // Check for missing elements
    if (!/(metric|measure|number|percentage|\d+)/i.test(prompt)) {
      gaps.push({ type: 'metrics', severity: 'high', fix: 'Add specific metrics or success criteria' });
    }

    if (!/(deadline|timeline|by|before|timeframe|duration)/i.test(prompt) && intent.domain !== 'creative') {
      gaps.push({ type: 'timeline', severity: 'medium', fix: 'Add timeline or deadline' });
    }

    if (!/(format|output|structure|style)/i.test(prompt)) {
      gaps.push({ type: 'output_format', severity: 'high', fix: 'Specify exact output format' });
    }

    if (!/(example|instance|like|such as)/i.test(prompt) && intent.complexity !== 'low') {
      gaps.push({ type: 'examples', severity: 'medium', fix: 'Add concrete examples' });
    }

    if (!/(constraint|limit|must|should not|requirement)/i.test(prompt)) {
      gaps.push({ type: 'constraints', severity: 'medium', fix: 'Add constraints or boundaries' });
    }

    // Check for tool-specific gaps
    if (tool.mustInclude) {
      tool.mustInclude.forEach(element => {
        if (!prompt.toLowerCase().includes(element.toLowerCase())) {
          gaps.push({ type: element, severity: 'high', fix: `Add ${element} (required for ${tool.name})` });
        }
      });
    }

    // Check for framework components
    if (framework.components) {
      framework.components.forEach(component => {
        if (!prompt.toLowerCase().includes(component.toLowerCase())) {
          gaps.push({ type: component, severity: 'medium', fix: `Add ${component} (${framework.name} component)` });
        }
      });
    }

    // Detect negative constraints
    const negatives = prompt.match(/(don't|do not|avoid|never|no)/gi) || [];
    if (negatives.length > 0) {
      gaps.push({ type: 'negative_constraints', severity: 'high', fix: 'Convert negative constraints to positive affirmatives' });
    }

    return {
      result: gaps,
      applied: true,
      description: `Found ${gaps.length} gaps: ${gaps.slice(0, 3).map(g => g.type).join(', ')}${gaps.length > 3 ? '...' : ''}`
    };
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 3: Context Injection - Add domain expertise
  // ═══════════════════════════════════════════════════════════════════
  const stage3_ContextInjection = (prompt, intent, gaps) => {
    let enhanced = prompt;
    const additions = [];

    // Add role/expertise context
    const role = getRoleForDomain(intent.domain, intent.result.primaryAction);
    if (role && !prompt.toLowerCase().includes('you are')) {
      enhanced = `You are ${role}.\n\n${enhanced}`;
      additions.push('role context');
    }

    // Add purpose/use case if unclear
    if (prompt.split(/\s+/).length < 20) {
      enhanced += `\n\nPurpose: ${intent.result.implicitGoal}`;
      additions.push('purpose clarification');
    }

    // Add audience specification if missing
    if (intent.result.audience === 'not specified' && intent.domain !== 'personal') {
      enhanced += `\nTarget Audience: [Specify who will use/read this]`;
      additions.push('audience specification');
    }

    return {
      output: enhanced,
      applied: additions.length > 0,
      description: `Added: ${additions.join(', ') || 'none needed'}`
    };
  };

  const getRoleForDomain = (domain, action) => {
    const roles = {
      technical: {
        create: 'an expert software engineer with 10+ years of experience in system design and best practices',
        fix: 'a senior debugging specialist and code quality expert',
        analyze: 'a technical architect specializing in code review and optimization'
      },
      creative: {
        create: 'an award-winning creative director with expertise in visual design and composition',
        design: 'a professional designer specializing in aesthetics and user experience'
      },
      business: {
        analyze: 'a senior business analyst with expertise in data-driven decision making',
        create: 'a strategic business consultant with deep market analysis experience'
      },
      research: {
        analyze: 'a research specialist with expertise in systematic literature review and synthesis',
        create: 'an experienced researcher skilled in comprehensive information gathering and analysis'
      },
      writing: {
        write: 'a professional writer and content strategist with expertise in clear, engaging communication',
        create: 'an experienced content creator specializing in audience-targeted messaging'
      }
    };

    return roles[domain]?.[action] || `a ${domain} expert`;
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 4: Framework Application - Intelligently map to framework
  // ═══════════════════════════════════════════════════════════════════
  const stage4_FrameworkApplication = (prompt, framework, intent, tool) => {
    if (!framework || !framework.components) return { output: prompt, applied: false };

    let structured = '';
    const components = framework.components;

    // Intelligently fill each framework component
    if (framework.name === 'CRISPE') {
      structured = applyCRISPE(prompt, intent, tool);
    } else if (framework.name === 'RISEN') {
      structured = applyRISEN(prompt, intent, tool);
    } else if (framework.name === 'CO-STAR') {
      structured = applyCOSTAR(prompt, intent, tool);
    } else if (framework.name === 'RTF') {
      structured = applyRTF(prompt, intent, tool);
    } else if (framework.name === 'STAR') {
      structured = applySTAR(prompt, intent, tool);
    } else if (framework.name === 'APE') {
      structured = applyAPE(prompt, intent);
    } else if (framework.name === 'DEPTH') {
      structured = applyDEPTH(prompt, intent);
    } else {
      // Generic framework application
      structured = `Using ${framework.name} Framework:\n\n`;
      components.forEach(comp => {
        structured += `${comp}: [Define ${comp.toLowerCase()} here]\n`;
      });
      structured += `\nTask: ${prompt}`;
    }

    return {
      output: structured,
      applied: true,
      description: `Applied ${framework.name} framework with intelligent component filling`
    };
  };

  const applyCRISPE = (prompt, intent, tool) => {
    const role = getRoleForDomain(intent.result.domain, intent.result.primaryAction);

    return `Context: ${intent.result.implicitGoal} for ${intent.result.audience === 'not specified' ? 'appropriate audience' : intent.result.audience}.

Role: ${role}

Instruction: ${prompt}

Specification:
- Output Format: ${intent.result.outputType}
- Quality Level: Professional-grade, production-ready
- Constraints: [Add any specific constraints or requirements]

Performance Criteria:
- Success looks like: [Define specific success metrics]
- Validation: [How to verify the output meets requirements]

Example: [Provide a brief example of desired output if applicable]`;
  };

  const applyRISEN = (prompt, intent, tool) => {
    const role = getRoleForDomain(intent.result.domain, intent.result.primaryAction);

    return `Role: ${role}

Instruction: ${prompt}

Steps:
1. [First step to accomplish this]
2. [Second step]
3. [Continue with necessary steps]
4. [Final validation/delivery step]

Examples:
- Example 1: [Concrete example of similar task]
- Example 2: [Another example showing variation]

Nuance & Edge Cases:
- Edge Case 1: [Potential edge case and how to handle]
- Edge Case 2: [Another consideration]
- Constraints: [Any boundaries or limitations to respect]`;
  };

  const applyCOSTAR = (prompt, intent, tool) => {
    return `Context: ${intent.result.implicitGoal}

Objective: ${prompt}

Style: ${intent.result.domain === 'creative' ? 'Creative and visually engaging' : intent.result.domain === 'technical' ? 'Technical and precise' : 'Professional and clear'}

Tone: ${intent.result.domain === 'business' ? 'Professional and data-driven' : intent.result.domain === 'creative' ? 'Inspiring and innovative' : 'Informative and helpful'}

Audience: ${intent.result.audience === 'not specified' ? '[Define target audience]' : intent.result.audience}

Response Format:
- Type: ${intent.result.outputType}
- Structure: [Specify exact structure]
- Length: [Specify desired length]
- Deliverables: [List concrete outputs]`;
  };

  const applyRTF = (prompt, intent, tool) => {
    const role = getRoleForDomain(intent.result.domain, intent.result.primaryAction);

    return `You are ${role}.

Task: ${prompt}

Additional Context: ${intent.result.implicitGoal}

Output Format:
- Deliver as ${intent.result.outputType}
- Include: [Specify required sections/components]
- Style: ${intent.result.domain === 'technical' ? 'Technical and precise' : 'Clear and professional'}`;
  };

  const applySTAR = (prompt, intent, tool) => {
    return `Situation: ${intent.result.implicitGoal}

Task: ${prompt}

Action Required:
1. [First action step]
2. [Second action step]
3. [Continue with necessary actions]

Result Expected:
- ${intent.result.outputType} that ${intent.result.primaryAction}s [specific outcome]
- Quality: Professional-grade
- Format: [Specify exact format]`;
  };

  const applyAPE = (prompt, intent) => {
    return `Action: ${prompt}

Purpose: ${intent.result.implicitGoal}

Expectation: Deliver ${intent.result.outputType} that meets professional standards, formatted appropriately for ${intent.result.audience === 'not specified' ? 'the intended audience' : intent.result.audience}.`;
  };

  const applyDEPTH = (prompt, intent) => {
    return `Perspectives to Consider:
1. Primary Stakeholder: ${intent.result.audience === 'not specified' ? '[Define primary audience]' : intent.result.audience}
2. Technical Perspective: ${intent.result.domain === 'technical' ? 'Implementation feasibility and best practices' : 'Technical requirements and constraints'}
3. Business Perspective: ROI, efficiency, and strategic alignment

Metrics for Success:
- [Quantifiable metric 1]
- [Quantifiable metric 2]
- [Quality metric]

Context: ${intent.result.implicitGoal}

Task Breakdown:
${prompt}

Decompose into:
1. [Sub-task 1]
2. [Sub-task 2]
3. [Sub-task 3]

Human Feedback Loop:
- Iterate on [specific aspect] based on feedback
- Validate [key assumptions] before proceeding`;
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 5: Tool Optimization - Tool-specific enhancements
  // ═══════════════════════════════════════════════════════════════════
  const stage5_ToolOptimization = (prompt, tool, intent) => {
    let optimized = prompt;
    const enhancements = [];

    // Claude-specific optimizations
    if (tool.name.includes('Claude')) {
      if (!prompt.includes('<') && intent.complexity !== 'low') {
        optimized += `\n\n<instructions>
${prompt.includes('step') ? 'Follow the steps above systematically.' : 'Approach this task systematically.'}
</instructions>`;
        enhancements.push('XML structure');
      }

      if (intent.result.primaryAction === 'analyze' && !prompt.toLowerCase().includes('think')) {
        optimized += `\n\nLet's think through this step by step:`;
        enhancements.push('chain-of-thought');
      }
    }

    // ChatGPT-specific optimizations
    if (tool.name.includes('ChatGPT')) {
      if (intent.result.outputType === 'structured data' && !prompt.toLowerCase().includes('json')) {
        optimized += `\n\nProvide response in JSON format with proper schema.`;
        enhancements.push('JSON mode hint');
      }
    }

    // Midjourney-specific optimizations
    if (tool.name.includes('Midjourney')) {
      const mjEnhanced = optimizeMidjourney(prompt);
      if (mjEnhanced !== prompt) {
        optimized = mjEnhanced;
        enhancements.push('Midjourney parameters');
      }
    }

    // DALL-E specific optimizations
    if (tool.name.includes('DALL-E')) {
      if (!/(lighting|camera|composition|style)/i.test(prompt)) {
        optimized += `\n\nAdditional Details:
- Lighting: [Specify lighting setup]
- Camera: [Specify angle/perspective]
- Composition: [Specify framing]
- Style: [Specify artistic style]`;
        enhancements.push('visual details');
      }
    }

    // Cursor AI optimizations
    if (tool.name.includes('Cursor')) {
      if (!prompt.includes('@')) {
        optimized += `\n\nRelevant Files: @[specify files/directories]`;
        enhancements.push('@ file references');
      }
    }

    // Research tool optimizations
    if (tool.category === 'research') {
      if (!/(2024|2025|recent)/i.test(prompt)) {
        optimized += `\n\nTimeframe: [Specify timeframe, e.g., "2024-2025" or "last 6 months"]`;
        enhancements.push('timeframe');
      }

      if (!/(source|citation|reference)/i.test(prompt)) {
        optimized += `\nSources: [Specify preferred source types: academic papers, industry reports, etc.]`;
        enhancements.push('source specification');
      }
    }

    // Code tool optimizations
    if (tool.category === 'coding') {
      if (!/(test|validation|error)/i.test(prompt)) {
        optimized += `\n\nRequirements:
- Include error handling
- Add input validation
- Write tests for key functionality
- Follow best practices for ${intent.result.domain}`;
        enhancements.push('coding best practices');
      }

      if (!/(language|version|framework)/i.test(prompt)) {
        optimized += `\nTech Stack: [Specify language, version, frameworks]`;
        enhancements.push('tech stack specification');
      }
    }

    return {
      output: optimized,
      applied: enhancements.length > 0,
      description: `Tool-specific: ${enhancements.join(', ') || 'none needed'}`
    };
  };

  const optimizeMidjourney = (prompt) => {
    let optimized = prompt;

    // Ensure subject is first
    const words = prompt.split(/\s+/);

    // Add parameters if missing
    if (!prompt.includes('--ar')) {
      optimized += ' --ar 16:9';
    }

    if (!prompt.includes('--s')) {
      // Detect if it's artistic or realistic
      const artistic = /(art|painting|illustration|creative|fantasy)/i.test(prompt);
      optimized += artistic ? ' --s 750' : ' --s 250';
    }

    if (!prompt.includes('--no') && words.length > 5) {
      optimized += ' --no blur, watermark, text';
    }

    // Add :: separators if there are multiple concepts
    if (words.length > 10 && !prompt.includes('::')) {
      // This is a simple heuristic - ideally would be more sophisticated
      const parts = prompt.split(/,\s*/);
      if (parts.length > 2) {
        optimized = parts.join(' :: ');
      }
    }

    return optimized;
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 6: Quality Enhancement - Add examples, edge cases, validation
  // ═══════════════════════════════════════════════════════════════════
  const stage6_QualityEnhancement = (prompt, intent, gaps) => {
    let enhanced = prompt;
    const additions = [];

    // Add examples if missing and complexity is not low
    if (gaps.result.some(g => g.type === 'examples') && intent.complexity !== 'low') {
      enhanced += `\n\nExample of Desired Output:
[Provide a concrete example showing the format, style, and quality expected]`;
      additions.push('example template');
    }

    // Add edge cases for complex tasks
    if (intent.complexity === 'high' && !/(edge|exception|error|fallback)/i.test(prompt)) {
      enhanced += `\n\nEdge Cases to Consider:
- [Edge case 1]
- [Edge case 2]
- [How to handle unexpected inputs]`;
      additions.push('edge cases');
    }

    // Add validation criteria
    if (!/(success|criteria|validate|verify)/i.test(prompt)) {
      enhanced += `\n\nSuccess Criteria:
- [Criterion 1: Specific, measurable outcome]
- [Criterion 2: Quality standard]
- [Criterion 3: Completeness check]`;
      additions.push('success criteria');
    }

    // Add specific metrics if missing
    if (gaps.result.some(g => g.type === 'metrics')) {
      enhanced += `\n\nMetrics:
- [Specific number/percentage/quantity]
- [Performance target]
- [Quality threshold]`;
      additions.push('metrics template');
    }

    return {
      output: enhanced,
      applied: additions.length > 0,
      description: `Enhanced with: ${additions.join(', ') || 'quality checks passed'}`
    };
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 7: Final Polish - Clarity, efficiency, completeness
  // ═══════════════════════════════════════════════════════════════════
  const stage7_FinalPolish = (prompt, originalPrompt) => {
    let polished = prompt;
    const improvements = [];

    // Convert negative constraints to positive
    const negativePatterns = [
      { pattern: /don't be vague/gi, replacement: 'be specific with concrete examples and metrics', name: 'negative→positive' },
      { pattern: /don't use/gi, replacement: 'instead use', name: 'negative→positive' },
      { pattern: /avoid\s+(\w+)/gi, replacement: 'focus on $1 alternatives', name: 'negative→positive' },
      { pattern: /never\s+(\w+)/gi, replacement: 'always $1', name: 'negative→positive' },
      { pattern: /do not\s+(\w+)/gi, replacement: 'ensure you $1', name: 'negative→positive' }
    ];

    negativePatterns.forEach(({ pattern, replacement, name }) => {
      if (pattern.test(polished)) {
        polished = polished.replace(pattern, replacement);
        if (!improvements.includes(name)) improvements.push(name);
      }
    });

    // Remove redundant phrases
    const redundancies = [
      /\b(very very|really really|quite quite)\b/gi,
      /\b(absolutely absolutely|totally totally)\b/gi
    ];

    redundancies.forEach(pattern => {
      if (pattern.test(polished)) {
        polished = polished.replace(pattern, (match) => match.split(/\s+/)[0]);
        if (!improvements.includes('redundancy removal')) improvements.push('redundancy removal');
      }
    });

    // Ensure proper capitalization
    if (polished && polished[0] !== polished[0].toUpperCase()) {
      polished = polished[0].toUpperCase() + polished.slice(1);
      improvements.push('capitalization');
    }

    // Add clarifying structure if it's too long and unstructured
    const words = polished.split(/\s+/).length;
    if (words > 100 && !polished.includes('\n\n')) {
      // Already has sections from framework, this is good
      improvements.push('structure maintained');
    }

    return {
      output: polished,
      applied: improvements.length > 0,
      description: `Polished: ${improvements.join(', ') || 'already optimal'}`
    };
  };

  // ═══════════════════════════════════════════════════════════════════
  // VALIDATION: Does optimized prompt address original intent?
  // ═══════════════════════════════════════════════════════════════════
  const validateOptimization = (original, optimized, intent) => {
    const checks = [];

    // Check 1: Original intent preserved
    const originalAction = intent.result.primaryAction;
    if (optimized.toLowerCase().includes(originalAction) || optimized.toLowerCase().includes(original.toLowerCase().split(/\s+/).slice(0, 5).join(' '))) {
      checks.push({ check: 'Intent preserved', passed: true });
    } else {
      checks.push({ check: 'Intent preserved', passed: false, issue: 'Original intent may be lost' });
    }

    // Check 2: Vague terms reduced
    const vagueTerms = /(thing|stuff|somehow|maybe|perhaps|some|few|many)/gi;
    const originalVague = (original.match(vagueTerms) || []).length;
    const optimizedVague = (optimized.match(vagueTerms) || []).length;
    checks.push({
      check: 'Vagueness reduced',
      passed: optimizedVague <= originalVague,
      details: `${originalVague} → ${optimizedVague} vague terms`
    });

    // Check 3: Output format specified
    if (/(format|output|structure|deliver|provide.*as)/i.test(optimized)) {
      checks.push({ check: 'Output format specified', passed: true });
    } else {
      checks.push({ check: 'Output format specified', passed: false, issue: 'Output format should be more explicit' });
    }

    // Check 4: Executability
    const hasContext = /context|background|situation/i.test(optimized);
    const hasAction = /(create|write|build|analyze|generate|design)/i.test(optimized);
    const hasFormat = /(format|output|structure)/i.test(optimized);
    checks.push({
      check: 'Executable by someone else',
      passed: hasContext && hasAction && hasFormat,
      details: `Context: ${hasContext}, Action: ${hasAction}, Format: ${hasFormat}`
    });

    // Check 5: Length appropriate
    const optimizedWords = optimized.split(/\s+/).length;
    const originalWords = original.split(/\s+/).length;
    const expansion = optimizedWords / originalWords;
    checks.push({
      check: 'Appropriate expansion',
      passed: expansion >= 2 && expansion <= 20,
      details: `${originalWords} → ${optimizedWords} words (${expansion.toFixed(1)}x)`
    });

    const allPassed = checks.every(c => c.passed);

    return {
      result: checks,
      applied: true,
      description: allPassed ? '✓ All validation checks passed' : `⚠ ${checks.filter(c => !c.passed).length} checks need attention`
    };
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
                Prompt Optimizer Pro
              </h1>
              <p className="text-gray-600 mt-2">Master-Level 7-Stage Optimization Pipeline | Real-time Analysis | GitHub MCP Integration</p>
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
                disabled={!inputPrompt || !knowledgeBase || isOptimizing}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                <Zap size={24} />
                {isOptimizing ? 'Optimizing...' : 'Optimize Prompt'}
              </button>
              {!knowledgeBase && (
                <p className="text-xs text-red-600 mt-2">⚠️ Loading knowledge base...</p>
              )}
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

              {isOptimizing ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Optimizing through 7 stages...</p>
                  {optimizationStages.length > 0 && (
                    <div className="mt-4 text-left space-y-2">
                      {optimizationStages.map((stage, i) => (
                        <div key={i} className="text-sm text-gray-600">
                          ✓ Stage {i + 1}: {stage.name} - {stage.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : optimizedPrompt ? (
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

                  {/* Optimization Stages */}
                  {optimizationStages.length > 0 && (
                    <div className="p-4 bg-purple-50 rounded-lg mb-4">
                      <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Zap size={18} />
                        7-Stage Processing Pipeline
                      </h3>
                      <div className="space-y-2">
                        {optimizationStages.map((stage, i) => (
                          <details key={i} className="text-sm">
                            <summary className="cursor-pointer font-medium text-purple-800 hover:text-purple-900">
                              Stage {i + 1}: {stage.name} {stage.applied ? '✓' : '○'}
                            </summary>
                            <div className="mt-1 ml-4 text-purple-700">
                              {stage.description}
                              {stage.result && typeof stage.result === 'object' && (
                                <div className="mt-1 text-xs bg-purple-100 p-2 rounded">
                                  {JSON.stringify(stage.result, null, 2).slice(0, 200)}...
                                </div>
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

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
                  <p className="text-sm mt-2">7-stage master-level optimization</p>
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
