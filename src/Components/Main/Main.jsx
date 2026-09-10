import { useContext } from 'react';
import './Main.css';
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context';

const Main = () => {

  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input}=useContext(Context)
  const suggestions = [
    ['Suggest some place for an upcoming trip of 4 members', assets.compass_icon],
    ['Help me to pass my examination with a 80% marks', assets.bulb_icon],
    ['Elon musk success stories in a single paragraph', assets.message_icon],
    ['Can you help me to improve my code ?', assets.code_icon],
  ]

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
                  :<p dangerouslySetInnerHTML={{__html:resultData}}></p>
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
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
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
