import { useContext, useMemo, useState } from 'react';
import './Sidebar.css';
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context';

const Sidebar = () => {

    const [extended,setExtended]=useState(false);

    const {prevPrompts,loadConversation,deleteConversation,clearHistory,newChat,togglePin,theme,toggleTheme} = useContext(Context);
    const [searchTerm, setSearchTerm] = useState('');
    const visiblePrompts = useMemo(() => [...prevPrompts]
        .sort((first, second) => Number(second.pinned) - Number(first.pinned))
        .filter((item) => `${item.title || ''} ${item.prompt}`.toLowerCase().includes(searchTerm.toLowerCase())), [prevPrompts, searchTerm]);

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
                <input className="history-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search chats" aria-label="Search chats" />
                {visiblePrompts.map((item)=>{
                    return (
                        <div key={item.id} onClick={()=>loadConversation(item)} className="recent-entry">
                            <img src={assets.message_icon} alt="" />
                            <p>{item.title || item.prompt.slice(0,18)}{!item.title && item.prompt.length > 18 ? ' ...' : ''}</p>
                            <button className={item.pinned ? 'pin-entry pinned' : 'pin-entry'} onClick={(event) => { event.stopPropagation(); togglePin(item.id); }} aria-label={item.pinned ? 'Unpin conversation' : 'Pin conversation'} title={item.pinned ? 'Unpin' : 'Pin'}>Pin</button>
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
                <button onClick={toggleTheme} className="theme-toggle">{extended ? (theme === 'light' ? 'Dark mode' : 'Light mode') : ''}</button>
            </div>
        </div>
    </div>
  )
}

export default Sidebar
