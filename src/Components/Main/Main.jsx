import { useContext, useEffect, useRef, useState } from "react";
import { Bot, Check, ChevronDown, Copy, Download, FileUp, Mic, Pencil, RefreshCw, Send, Sparkles, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "./Main.css";
import { Context } from "../../Context/Context";

const suggestions = [
  ["Map a product launch", "Turn a rough idea into a clear launch plan."],
  ["Review a code decision", "Explain a technical tradeoff with examples."],
  ["Learn something deeply", "Build a simple, step-by-step study plan."],
];

const Main = () => {
  const { onSent, showResult, loading, resultData, setInput, input, messages, regenerateResponse, editLatestPrompt, model, setModel, exportConversation, mode, setMode, customInstructions, setCustomInstructions, copyResponse, attachment, addAttachment, clearAttachment, stopGeneration, error } = useContext(Context);
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const visibleMessages = loading ? [...messages, { role: "assistant", content: resultData }] : messages;
  const lastUserIndex = visibleMessages.reduce((last, message, index) => message.role === "user" ? index : last, -1);
  const lastAssistantIndex = visibleMessages.reduce((last, message, index) => message.role === "assistant" ? index : last, -1);

  const toggleVoiceTyping = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { window.alert("Voice typing works best in Chrome or Edge."); return; }
    if (isListening) { recognitionRef.current?.stop(); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => setInput((current) => `${current}${current ? " " : ""}${event.results[0][0].transcript}`);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const copyLatest = async () => {
    await copyResponse();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return <main className="main">
    <header className="topbar">
      <div><span className="eyebrow">PERSONAL WORKSPACE</span><h1>Nexa <span>AI</span></h1></div>
      <div className="topbar-actions">
        <label className="select-control"><span>Model</span><select value={model} onChange={(event) => setModel(event.target.value)} aria-label="AI model"><option value="openai/gpt-oss-20b">GPT OSS 20B</option><option value="openai/gpt-oss-120b">GPT OSS 120B</option></select><ChevronDown size={14} /></label>
        {showResult ? <button className="outline-button" onClick={() => exportConversation("md")}><Download size={15} /> Export</button> : null}
      </div>
    </header>

    <div className="canvas">
      {error ? <div className="error-banner" role="alert">{error}</div> : null}
      {!showResult ? <section className="welcome-screen">
        <div className="welcome-kicker"><Sparkles size={16} /> Your thinking partner</div>
        <h2>Make space for<br /><em>better thinking.</em></h2>
        <p>Turn questions, files, and half-formed ideas into clear next steps with a workspace that stays out of your way.</p>
        <div className="suggestion-grid">{suggestions.map(([title, description]) => <button className="suggestion-card" key={title} onClick={() => onSent(title)}><strong>{title}</strong><span>{description}</span><Send size={16} /></button>)}</div>
        <div className="welcome-stats"><span><b>01</b> Ask anything</span><span><b>02</b> Add context</span><span><b>03</b> Build forward</span></div>
      </section> : <section className="conversation-canvas">
        <div className="conversation-intro"><div className="status-dot" /> <span>Live conversation</span><span className="conversation-mode">{mode} mode</span></div>
        {visibleMessages.map((message, index) => message.role === "user" ? <article className="user-message" key={`${message.role}-${index}`}><div className="message-meta"><span>You</span>{index === lastUserIndex && !loading ? <button onClick={editLatestPrompt} title="Edit prompt"><Pencil size={14} /> Edit</button> : null}</div><p>{message.content}</p></article> : <article className="assistant-message" key={`${message.role}-${index}`}><div className="assistant-avatar"><Bot size={18} /></div><div className="assistant-body"><div className="message-meta"><span>Nexa AI</span>{index === lastAssistantIndex && !loading ? <div className="message-tools"><button onClick={regenerateResponse} title="Regenerate"><RefreshCw size={14} /> Regenerate</button><button onClick={copyLatest} title="Copy response">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}</button></div> : null}</div>{loading && index === visibleMessages.length - 1 && !message.content ? <div className="loader"><i /><i /><i /></div> : <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown></div>}</div></article>)}
      </section>}
    </div>

    <section className="composer-area">
      <div className="mode-row"><label className="mode-label">Response style <select value={mode} onChange={(event) => setMode(event.target.value)}><option value="balanced">Balanced</option><option value="coding">Coding</option><option value="study">Study</option><option value="writing">Writing</option></select></label><input value={customInstructions} onChange={(event) => setCustomInstructions(event.target.value)} placeholder="Personal instruction (optional)" aria-label="Custom response instructions" /></div>
      {attachment ? <div className="attachment-chip"><FileUp size={14} /> {attachment.name}<button onClick={clearAttachment} aria-label="Remove attachment">Remove</button></div> : null}
      <div className="composer">
        <input ref={fileInputRef} className="file-input" type="file" accept=".txt,.md,.csv,.json,.pdf" onChange={(event) => addAttachment(event.target.files[0])} />
        <button className="composer-icon" onClick={() => fileInputRef.current?.click()} title="Attach a document"><FileUp size={19} /></button>
        <input className="prompt-input" onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && input.trim()) { event.preventDefault(); onSent(); } }} value={input} type="text" placeholder="Ask Nexa anything..." aria-label="Prompt" />
        <button className={isListening ? "composer-icon listening" : "composer-icon"} onClick={toggleVoiceTyping} title="Voice typing" aria-label="Voice typing"><Mic size={19} /></button>
        {loading ? <button className="send-button stop" onClick={stopGeneration} title="Stop generating"><Square size={16} fill="currentColor" /></button> : <button className="send-button" onClick={() => onSent()} disabled={!input.trim()} title="Send prompt"><Send size={17} /></button>}
      </div>
      <p className="composer-note">Nexa can make mistakes. Check important information before acting.</p>
    </section>
  </main>;
};

export default Main;
