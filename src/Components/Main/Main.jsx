import { useEffect, useRef, useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import './Main.css';
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context';

const Main = () => {

  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input}=useContext(Context)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const suggestions = [
    ['Suggest some place for an upcoming trip of 4 members', assets.compass_icon],
    ['Help me to pass my examination with a 80% marks', assets.bulb_icon],
    ['Elon musk success stories in a single paragraph', assets.message_icon],
    ['Can you help me to improve my code ?', assets.code_icon],
  ]

  useEffect(() => () => recognitionRef.current?.stop(), []);

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
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">

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
                <div className="result-title">
                  <img src={assets.user_icon} alt="User" />
                  <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                  <img src={assets.gemini_icon} alt="Nexa AI" />
                  {loading
                  ?<div className="loader">
                      <hr />
                      <hr />
                      <hr />
                  </div>
                  :<div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {resultData}
                    </ReactMarkdown>
                  </div>
                } 
                </div>
            </div>
          }

        
        <div className="main-bottom">
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
              <img
                className={isListening ? 'voice-button listening' : 'voice-button'}
                onClick={toggleVoiceTyping}
                src={assets.mic_icon}
                alt={isListening ? 'Stop voice typing' : 'Start voice typing'}
                title={isListening ? 'Stop voice typing' : 'Start voice typing'}
              />
              {input.trim() ? <img onClick={()=>onSent()} src={assets.send_icon} alt="Send prompt" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            Nexa may display inaccurate info, including about people, so double-check its responses. <b>made By Anirban Das.</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main
