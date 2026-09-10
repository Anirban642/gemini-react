import { ArrowRight, Bot, Braces, Check, FileText, MessageSquareText, Mic, Moon, ShieldCheck, Sparkles, WandSparkles, Zap } from "lucide-react";
import PropTypes from "prop-types";
import "./Landing.css";

const features = [
  { icon: MessageSquareText, label: "Think in context", title: "Conversations that remember the thread.", text: "Nexa keeps your follow-ups, decisions, and ideas connected so you can move from question to outcome." },
  { icon: Braces, label: "Build with confidence", title: "A sharper partner for technical work.", text: "Switch into Coding mode for structured explanations, clean examples, and practical next steps." },
  { icon: FileText, label: "Bring the work in", title: "Ask questions about your documents.", text: "Drop in text, Markdown, CSV, JSON, or PDF files and turn dense material into useful answers." },
];

const Landing = ({ onStart }) => (
  <main className="landing">
    <nav className="landing-nav">
      <button className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Nexa home"><span>N</span><strong>Nexa <i>AI</i></strong></button>
      <div className="landing-nav-links"><a href="#capabilities">Capabilities</a><a href="#workflow">How it works</a><a href="#principles">Principles</a></div>
      <button className="nav-start" onClick={onStart}>Try Nexa <ArrowRight size={15} /></button>
    </nav>

    <section className="landing-hero">
      <div className="hero-copy">
        <div className="landing-eyebrow"><span className="eyebrow-line" /> A calmer way to work with AI</div>
        <h1>Make your next<br /><em>good idea</em> clearer.</h1>
        <p className="hero-description">Nexa is a thoughtful AI workspace for turning messy questions, complex files, and ambitious plans into work you can move forward with.</p>
        <div className="hero-actions"><button className="hero-cta" onClick={onStart}>Try Nexa for free <ArrowRight size={17} /></button><span><ShieldCheck size={15} /> No account required</span></div>
        <div className="hero-proof"><div className="proof-avatars"><span>AD</span><span>MK</span><span>JR</span></div><p><strong>Built for curious people</strong><br />who prefer clarity over noise.</p></div>
      </div>
      <div className="hero-visual" aria-label="Nexa AI workspace preview">
        <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
        <div className="preview-window">
          <div className="preview-top"><span className="preview-dots"><i /><i /><i /></span><span>nexa / workspace</span><span className="preview-live"><b /> live</span></div>
          <div className="preview-content"><div className="preview-label">PROJECT NOTE · 09:41</div><h2>Find the shape<br />of the problem.</h2><div className="preview-prompt"><span className="preview-avatar"><Bot size={14} /></span><p>Help me turn these scattered notes into a focused product brief.</p></div><div className="preview-answer"><div className="answer-bar" /><div className="answer-lines"><span /><span /><span /><span /></div></div><div className="preview-input"><span>Ask Nexa anything...</span><ArrowRight size={14} /></div></div>
        </div>
        <div className="floating-note note-top"><Sparkles size={15} /><span>Context retained</span><Check size={14} /></div><div className="floating-note note-bottom"><Zap size={15} /><span>Ready when you are</span></div>
      </div>
    </section>

    <section className="landing-strip"><span><WandSparkles size={16} /> Less prompting. More progress.</span><span><Mic size={16} /> Think out loud.</span><span><Moon size={16} /> Work your way.</span></section>

    <section className="capabilities-section" id="capabilities"><div className="section-heading"><span className="section-index">01 / CAPABILITIES</span><h2>Useful by design.<br /><em>Quietly powerful.</em></h2><p>Everything you need to get from a blank page to a better next step, without a crowded control panel.</p></div><div className="feature-grid">{features.map(({ icon: Icon, label, title, text }, index) => <article className="feature-card" key={label}><div className="feature-number">0{index + 1}</div><div className="feature-icon"><Icon size={20} /></div><span className="feature-label">{label}</span><h3>{title}</h3><p>{text}</p><ArrowRight className="feature-arrow" size={17} /></article>)}</div></section>

    <section className="workflow-section" id="workflow"><div className="workflow-heading"><span className="section-index">02 / THE WORKFLOW</span><h2>Start anywhere.<br /><em>End somewhere better.</em></h2></div><div className="workflow-steps"><div><b>01</b><strong>Bring a thought</strong><p>A question, a document, a half-built plan. Rough is welcome.</p></div><div><b>02</b><strong>Shape it together</strong><p>Ask follow-ups, change the mode, and keep the useful context close.</p></div><div><b>03</b><strong>Leave with momentum</strong><p>Save the thread, export the work, and take the next step.</p></div></div></section>

    <section className="principles-section" id="principles"><div><span className="section-index">03 / OUR APPROACH</span><h2>AI should feel<br /><em>like headroom.</em></h2></div><div className="principles-copy"><p>Nexa is made to give your thinking more room, not more tabs. It stays fast, direct, and flexible whether you are learning a concept, untangling code, or making a plan.</p><button className="text-link" onClick={onStart}>Open the workspace <ArrowRight size={16} /></button></div></section>

    <footer className="landing-footer"><div className="landing-brand"><span>N</span><strong>Nexa <i>AI</i></strong></div><span>Make room for better thinking.</span><button onClick={onStart}>Try it free <ArrowRight size={15} /></button></footer>
  </main>
);

Landing.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default Landing;
