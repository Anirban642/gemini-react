import { useContext, useMemo, useState } from "react";
import { Archive, ChevronLeft, ChevronRight, FileText, Folder, Moon, Pin, Plus, Search, Settings, Sun, Trash2 } from "lucide-react";
import "./Sidebar.css";
import { Context } from "../../Context/Context";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { prevPrompts, loadConversation, deleteConversation, clearHistory, newChat, togglePin, theme, toggleTheme } = useContext(Context);
  const visiblePrompts = useMemo(() => [...prevPrompts]
    .sort((first, second) => Number(second.pinned) - Number(first.pinned))
    .filter((item) => `${item.title || ""} ${item.prompt}`.toLowerCase().includes(searchTerm.toLowerCase())), [prevPrompts, searchTerm]);

  return (
    <aside className={expanded ? "sidebar expanded" : "sidebar"}>
      <div>
        <div className="brand-row">
          <div className="brand-mark">N</div>
          {expanded ? <div><strong>Nexa</strong><span>AI workspace</span></div> : null}
          <button className="icon-button collapse-button" onClick={() => setExpanded((value) => !value)} aria-label="Toggle sidebar">
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        <button className="new-chat" onClick={newChat}><Plus size={18} />{expanded ? <span>New conversation</span> : null}</button>
        {expanded ? <>
          <label className="history-search"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search workspace" aria-label="Search workspace" /></label>
          <div className="sidebar-section-heading"><span>Conversations</span>{prevPrompts.length ? <button onClick={clearHistory}>Clear</button> : null}</div>
          <div className="conversation-list">
            {visiblePrompts.map((item) => <div className="conversation-entry" key={item.id} onClick={() => loadConversation(item)}>
              <FileText size={16} />
              <span>{item.title || item.prompt.slice(0, 28)}</span>
              <button className={item.pinned ? "entry-action pinned" : "entry-action"} onClick={(event) => { event.stopPropagation(); togglePin(item.id); }} aria-label="Pin conversation"><Pin size={14} /></button>
              <button className="entry-action delete" onClick={(event) => { event.stopPropagation(); deleteConversation(item.id); }} aria-label="Delete conversation"><Trash2 size={14} /></button>
            </div>)}
            {!visiblePrompts.length ? <p className="empty-history">No conversations found.</p> : null}
          </div>
        </> : null}
      </div>
      <div className="sidebar-footer">
        {expanded ? <>
          <button className="footer-action"><Archive size={16} /> Activity</button>
          <button className="footer-action"><Folder size={16} /> Collections</button>
          <button className="footer-action"><Settings size={16} /> Preferences</button>
          <button className="footer-action" onClick={toggleTheme}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />} {theme === "light" ? "Dark theme" : "Light theme"}</button>
        </> : <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button>}
        {expanded ? <div className="profile-chip"><div className="profile-avatar">AD</div><span><strong>Anirban Das</strong><small>Personal workspace</small></span></div> : null}
      </div>
    </aside>
  );
};

export default Sidebar;
