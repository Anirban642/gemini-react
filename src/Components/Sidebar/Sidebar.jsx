import { useContext, useState } from 'react';
import './Sidebar.css';
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context';

const Sidebar = () => {

    const [extended,setExtended]=useState(false);

    const {prevPrompts,loadConversation,deleteConversation,clearHistory,newChat} = useContext(Context);

  return (
    <div className='sidebar'>
        <div className="top">
            <img onClick={()=>setExtended(prev=>!prev)} className='menu' src={assets.menu_icon} alt="" />
            <div onClick={()=>newChat()} className="new-chat">
                <img src={assets.plus_icon} alt="" />
                {extended?<p>New Chat</p>:null}
            </div>
            {extended
            ? <div className="recent">
                <div className="recent-heading">
                    <p className="recent-title">Recent</p>
                    {prevPrompts.length ? <button onClick={clearHistory} className="clear-history">Clear</button> : null}
                </div>
                {prevPrompts?.map((item)=>{
                    return (
                        <div key={item.id} onClick={()=>loadConversation(item)} className="recent-entry">
                            <img src={assets.message_icon} alt="" />
                            <p>{item.prompt.slice(0,18)}{item.prompt.length > 18 ? ' ...' : ''}</p>
                            <button
                                className="delete-entry"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    deleteConversation(item.id);
                                }}
                                aria-label={`Delete ${item.prompt}`}
                                title="Delete conversation"
                            >
                                x
                            </button>
                        </div>
                    )
                })}
            </div>
            :null    
        }
        </div>
        <div className="bottom">
            <div className="bottom-item recent-entry">
                <img src={assets.question_icon} alt="" />
                {extended?<p>Help</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.history_icon} alt="" />
                {extended?<p>Activity</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.setting_icon} alt="" />
                {extended?<p>Settings</p>:null}
            </div>
        </div>
    </div>
  )
}

export default Sidebar
