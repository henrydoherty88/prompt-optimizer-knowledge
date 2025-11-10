# Prompt Engineering Knowledge Base

A comprehensive, modular knowledge base for prompt engineering across 16+ AI tools, 7 frameworks, and 8 core techniques. Built from 100K+ words of research across 13 sources.

## Overview

This repository contains distilled prompt engineering knowledge organized into modular JSON files, making it easy to:
- 🔍 Query specific tools, frameworks, or techniques programmatically
- 🔄 Update individual components without touching the entire knowledge base
- 🤖 Integrate with AI applications via GitHub API or MCP (Model Context Protocol)
- 📊 Track your own prompt optimization journey

## Repository Structure

```
prompt-optimizer-knowledge/
├── README.md                          # This file
├── metadata.json                      # Central index with universal principles
│
├── knowledge-base/
│   ├── tools/                         # 16 AI tool configurations
│   │   ├── claude_chat.json
│   │   ├── chatgpt_chat.json
│   │   ├── gemini_chat.json
│   │   ├── perplexity_chat.json
│   │   ├── claude_deep_research.json
│   │   ├── perplexity_deep_research.json
│   │   ├── chatgpt_deep_research.json
│   │   ├── gemini_deep_research.json
│   │   ├── claude_projects.json
│   │   ├── claude_code.json
│   │   ├── cursor_ai.json
│   │   ├── github_copilot.json
│   │   ├── v0_dev.json
│   │   ├── midjourney.json
│   │   ├── dalle.json
│   │   └── flux.json
│   │
│   ├── frameworks/                    # 7 prompt frameworks
│   │   ├── APE.json                   # Simple: Action, Purpose, Expectation
│   │   ├── RTF.json                   # Simple-Medium: Role, Task, Format
│   │   ├── STAR.json                  # Medium: Situation, Task, Action, Result
│   │   ├── CO-STAR.json               # Medium-High: Context, Objective, Style, Tone, Audience, Response
│   │   ├── CRISPE.json                # High: Context, Role, Instruction, Specification, Performance, Example
│   │   ├── RISEN.json                 # High: Role, Instruction, Steps, Examples, Nuance
│   │   └── DEPTH.json                 # Very High: Define, Establish, Provide, Task, Human
│   │
│   └── techniques/                    # 8 core techniques
│       ├── chain_of_thought.json
│       ├── specificity.json
│       ├── negative_to_positive.json
│       ├── role_prompting.json
│       ├── few_shot.json
│       ├── structured_output.json
│       ├── iterative_refinement.json
│       └── context_front_loading.json
│
└── personal-library/                  # Your custom data (gitignore recommended)
    ├── analytics.json                 # Track optimization results
    ├── preferences.json               # Your default settings
    ├── history.json                   # Optimization history
    └── examples/
        └── .template.json             # Template for custom examples
```

## Quick Start

### 1. Clone or Fetch via API

**Clone the entire repository:**
```bash
git clone https://github.com/henrydoherty88/prompt-optimizer-knowledge.git
```

**Fetch individual files via GitHub API:**
```bash
# Fetch Claude Chat tool configuration
curl https://api.github.com/repos/henrydoherty88/prompt-optimizer-knowledge/contents/knowledge-base/tools/claude_chat.json

# Fetch CRISPE framework
curl https://api.github.com/repos/henrydoherty88/prompt-optimizer-knowledge/contents/knowledge-base/frameworks/CRISPE.json
```

**Fetch raw file content directly:**
```bash
curl https://raw.githubusercontent.com/henrydoherty88/prompt-optimizer-knowledge/main/knowledge-base/tools/claude_chat.json
```

### 2. Use in Your Application

**JavaScript/Node.js Example:**
```javascript
// Fetch all tool configurations
const tools = await Promise.all([
  'claude_chat',
  'chatgpt_chat',
  'midjourney'
].map(tool =>
  fetch(`https://raw.githubusercontent.com/henrydoherty88/prompt-optimizer-knowledge/main/knowledge-base/tools/${tool}.json`)
    .then(r => r.json())
));

// Get framework for a specific task
const framework = await fetch(
  'https://raw.githubusercontent.com/henrydoherty88/prompt-optimizer-knowledge/main/knowledge-base/frameworks/CRISPE.json'
).then(r => r.json());

console.log(framework.template);
// Output: "Context: [situation] Role: [expert] Instruction: [task]..."
```

**Python Example:**
```python
import requests

# Fetch tool configuration
url = "https://raw.githubusercontent.com/henrydoherty88/prompt-optimizer-knowledge/main/knowledge-base/tools/claude_chat.json"
tool_config = requests.get(url).json()

print(tool_config['template'])
# Output: "You are [role]. Context: [situation] Task: [objective]..."

# Fetch multiple techniques
techniques = ['specificity', 'chain_of_thought', 'few_shot']
technique_data = {}

for technique in techniques:
    url = f"https://raw.githubusercontent.com/henrydoherty88/prompt-optimizer-knowledge/main/knowledge-base/techniques/{technique}.json"
    technique_data[technique] = requests.get(url).json()
```

### 3. GitHub MCP Integration

Use with Model Context Protocol for bidirectional sync:

```javascript
// Read knowledge base
const mcp = new GitHubMCP({
  repo: 'henrydoherty88/prompt-optimizer-knowledge',
  token: process.env.GITHUB_TOKEN
});

// Fetch tool configs
const tools = await mcp.list('knowledge-base/tools/');
const claudeConfig = await mcp.read('knowledge-base/tools/claude_chat.json');

// Update your personal library
await mcp.write('personal-library/analytics.json', {
  optimizations: [...],
  statistics: {...}
});
```

## Universal Principles

These principles apply across ALL AI tools:

### 1. **Specificity** (+40-50% quality)
- ❌ "Write an article"
- ✅ "Write a 1500-word technical article about [topic] for [audience]. Include: introduction, 3 main sections with examples, conclusion. Tone: professional. Format: markdown with H2 headers."

### 2. **Negative → Positive** (+22% adherence)
- ❌ "Don't be vague"
- ✅ "Be specific and include concrete examples"

### 3. **Context First** (90% cost savings with caching)
- Front-load all reusable context at the beginning
- Structure: `[Static Context] → [Varying Task]`

### 4. **Output Format** (95%+ vs 60-70% reliability)
- Always specify exact output format
- Use JSON schema, XML tags, or examples

## Tool Selection Guide

### Chat Tools (Quick Conversations)
- **Claude**: Long context (200K), complex reasoning, documents
- **ChatGPT**: General purpose, JSON mode, structured outputs
- **Gemini**: Multimodal (images/video), 1M context, Google integration
- **Perplexity**: Current events, citations, quick search

### Deep Research Tools (3-30 min processing)
- **Claude Deep Research**: Multi-document synthesis, complex analysis
- **Perplexity Deep Research**: Web synthesis, time-sensitive data
- **ChatGPT Deep Research**: Highest citation accuracy (82%)
- **Gemini Deep Research**: 50+ sources, comprehensive

### Coding Tools
- **Claude Code**: Autonomous multi-file coding, terminal integration
- **Cursor AI**: Best codebase awareness, pattern following
- **GitHub Copilot**: Inline completion, test generation
- **V0.dev**: React/UI components, shadcn/ui

### Creative Tools (Image Generation)
- **Midjourney**: Artistic, stylized, high aesthetic quality
- **DALL-E 4**: Photorealism, text rendering, anatomical accuracy
- **Flux Pro**: Fast (2-5s), cost-effective ($0.04), technical illustrations

## Framework Selection

Choose based on complexity:

| Complexity | Framework | Best For |
|------------|-----------|----------|
| Simple | **APE** | Quick tasks, beginners |
| Simple-Medium | **RTF** | General purpose, content generation |
| Medium | **STAR** | Problem-solving, advice |
| Medium-High | **CO-STAR** | Marketing, audience-targeted content |
| High | **CRISPE** | Technical tasks, complex requirements |
| High | **RISEN** | Multi-step processes, research |
| Very High | **DEPTH** | Strategic decisions, multi-agent analysis |

## Technique Reference

### Always Use
- **Specificity**: Add metrics, timeframes, constraints, examples (+40-50%)
- **Negative → Positive**: Reframe "don't" as "do instead" (+22%)

### Use When Needed
- **Chain of Thought**: Complex reasoning, math, logic (+30-40%)
- **Role Prompting**: Professional/technical tasks
- **Few-Shot Learning**: Pattern recognition, style transfer (+25-35%)
- **Structured Output**: API usage, data extraction (95%+ reliability)
- **Iterative Refinement**: Complex creative/research tasks
- **Context Front-Loading**: API usage, repeated tasks (90% cost savings)

## Contributing

This is a personal knowledge base, but feedback and suggestions are welcome via issues!

## License

MIT License - Free to use, modify, and distribute.

## Credits

Synthesized from 100K+ words across 13 research sources:
- Official AI tool documentation (Anthropic, OpenAI, Google, Midjourney)
- Academic prompt engineering research
- Practical community guides and benchmarks

---

**Version:** 2.0-MODULAR
**Last Updated:** 2025-11-10
**Maintainer:** [@henrydoherty88](https://github.com/henrydoherty88)
