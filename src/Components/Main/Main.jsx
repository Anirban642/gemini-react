import React, { useContext } from 'react';
import './Main.css';
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context';

const Main = () => {

  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input}=useContext(Context)

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
          <div className="card">
              <p>Suggest some place for an upcoming trip of 4 members</p>
              <img src={assets.compass_icon} alt="" />
          </div>
          <div className="card">
              <p>Help me to pass my examination with a 80% marks</p>
              <img src={assets.bulb_icon} alt="" />
          </div>
          <div className="card">
              <p>Elon musk success stories in a single paragraph</p>
              <img src={assets.message_icon} alt="" />
          </div>
          <div className="card">
              <p>Can you help me to improve my code ?</p>
              <img src={assets.code_icon} alt="" />
          </div>
        </div>
            </>
            : <div className="result">
                <div className="result-title">
                  <img src={assets.user_icon} alt="" />
                  <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                  <img src={assets.gemini_icon} alt="" />
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
            <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input?<img onClick={()=>onSent()} src={assets.send_icon} alt="" />:null}
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
