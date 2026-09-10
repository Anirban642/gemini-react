import { useEffect, useRef, useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import './Main.css';
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context';

const Main = () => {

  const {onSent,showResult,loading,resultData,setInput,input,messages,regenerateResponse,editLatestPrompt,model,setModel,exportConversation,mode,setMode,customInstructions,setCustomInstructions,copyResponse,attachment,addAttachment,clearAttachment,stopGeneration,error}=useContext(Context)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const suggestions = [
    ['Suggest some place for an upcoming trip of 4 members', assets.compass_icon],
    ['Help me to pass my examination with a 80% marks', assets.bulb_icon],
    ['Elon musk success stories in a single paragraph', assets.message_icon],
    ['Can you help me to improve my code ?', assets.code_icon],
  ]

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const visibleMessages = loading
    ? [...messages, { role: 'assistant', content: resultData }]
    : messages;
  const lastUserIndex = visibleMessages.reduce((lastIndex, message, index) => message.role === 'user' ? index : lastIndex, -1);
  const lastAssistantIndex = visibleMessages.reduce((lastIndex, message, index) => message.role === 'assistant' ? index : lastIndex, -1);

  const toggleVoiceTyping = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      window.alert('Voice typing is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((currentInput) => `${currentInput}${currentInput ? ' ' : ''}${transcript}`);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Nexa AI</p>
        <div className="nav-tools">
          <select value={model} onChange={(event) => setModel(event.target.value)} aria-label="AI model">
            <option value="openai/gpt-oss-20b">GPT OSS 20B</option>
            <option value="openai/gpt-oss-120b">GPT OSS 120B</option>
          </select>
          <select value={mode} onChange={(event) => setMode(event.target.value)} aria-label="AI mode">
            <option value="balanced">Balanced</option>
            <option value="coding">Coding</option>
            <option value="study">Study</option>
            <option value="writing">Writing</option>
          </select>
          {showResult ? <button onClick={() => exportConversation('md')} title="Export Markdown">Export</button> : null}
          {showResult ? <button onClick={() => exportConversation('json')} title="Export JSON">JSON</button> : null}
        </div>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
          {error ? <div className="error-banner" role="alert">{error}</div> : null}

          {!showResult
            ?<>
              <div className="greet">
          <p><span>Hello , Friend.</span></p>
          <p>How can I help you today ?</p>
        </div>
        <div className="cards">
          {suggestions.map(([suggestion, icon]) => (
            <div
              className="card"
              key={suggestion}
              onClick={() => onSent(suggestion)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSent(suggestion)
              }}
              role="button"
              tabIndex="0"
            >
              <p>{suggestion}</p>
              <img src={icon} alt="" />
            </div>
          ))}
        </div>
            </>
            : <div className="result">
                {visibleMessages.map((message, index) => message.role === 'user'
                  ? <div className="result-title" key={`${message.role}-${index}`}>
                      <img src={assets.user_icon} alt="User" />
                      <p>{message.content}</p>
                      {index === lastUserIndex && !loading ? <button className="message-action" onClick={editLatestPrompt} title="Edit prompt">Edit</button> : null}
                    </div>
                  : <div className="result-data" key={`${message.role}-${index}`}>
                      <img src={assets.gemini_icon} alt="Nexa AI" />
                      {loading && index === visibleMessages.length - 1 && !message.content
                        ? <div className="loader">
                            <hr />
                            <hr />
                            <hr />
                          </div>
                        : <div className="markdown-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                              {message.content}
                            </ReactMarkdown>
                            </div>}
                          {index === lastAssistantIndex && !loading ? <div className="response-actions">
                            <button className="message-action" onClick={regenerateResponse} title="Generate another response">Regenerate</button>
                            <button className="message-action" onClick={copyResponse} title="Copy latest response">Copy</button>
                          </div> : null}
                    </div>)}
            </div>
          }

        
        <div className="main-bottom">
          <input
            className="instructions-input"
            value={customInstructions}
            onChange={(event) => setCustomInstructions(event.target.value)}
            placeholder="Optional response instructions, e.g. keep answers concise"
            aria-label="Custom response instructions"
          />
          <div className="search-box">
            <input
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && input.trim()) onSent()
              }}
              value={input}
              type="text"
              placeholder='Enter a prompt'
              aria-label="Prompt"
            />
            <div>
              <button className="attach-button" onClick={() => fileInputRef.current?.click()} title="Attach text file">Attach</button>
              <input ref={fileInputRef} className="file-input" type="file" accept=".txt,.md,.csv,.json" onChange={(event) => addAttachment(event.target.files[0])} />
              <img
                className={isListening ? 'voice-button listening' : 'voice-button'}
                onClick={toggleVoiceTyping}
                src={assets.mic_icon}
                alt={isListening ? 'Stop voice typing' : 'Start voice typing'}
                title={isListening ? 'Stop voice typing' : 'Start voice typing'}
              />
              {loading ? <button className="stop-button" onClick={stopGeneration}>Stop</button> : input.trim() ? <img onClick={()=>onSent()} src={assets.send_icon} alt="Send prompt" /> : null}
            </div>
          </div>
          {attachment ? <div className="attachment-preview">Attached: {attachment.name}<button onClick={clearAttachment} aria-label="Remove attachment">Remove</button></div> : null}
          <p className="bottom-info">
            Nexa may display inaccurate info, including about people, so double-check its responses. <b>made By Anirban Das.</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main
