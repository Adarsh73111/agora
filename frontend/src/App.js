import React, { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "https://5nyzjthmudhxtmov4e3he7wzoy0bvwxl.lambda-url.ap-south-1.on.aws";

const BOTS = {
  "Aristotle":         { emoji:"🏛️", color:"#c9a84c", glow:"#c9a84c", dark:"#7a5c1e", title:"The Philosopher",   trait:"calm & logical",       symbol:"Φ", grad:"135deg,#c9a84c22,#c9a84c06" },
  "Dr. Nova":          { emoji:"🔬", color:"#00e5cc", glow:"#00e5cc", dark:"#006b5e", title:"The Scientist",     trait:"sharp & data-driven",  symbol:"Σ", grad:"135deg,#00e5cc22,#00e5cc06" },
  "Maverick":          { emoji:"😈", color:"#ff4d6d", glow:"#ff4d6d", dark:"#8b1a2e", title:"Devil's Advocate",  trait:"bold & provocative",   symbol:"Ω", grad:"135deg,#ff4d6d22,#ff4d6d06" },
  "Professor Huxley":  { emoji:"📜", color:"#a78bfa", glow:"#a78bfa", dark:"#4c3585", title:"The Historian",     trait:"wise & contextual",    symbol:"Ψ", grad:"135deg,#a78bfa22,#a78bfa06" },
  "Zara 2050":         { emoji:"🚀", color:"#38bdf8", glow:"#38bdf8", dark:"#0e5a7a", title:"The Futurist",      trait:"visionary & fearless", symbol:"∞", grad:"135deg,#38bdf822,#38bdf806" }
};

function parseTranscript(t) {
  if (!t) return [];
  return t.split("\n\n").filter(l=>l.trim()).reduce((acc,line)=>{
    Object.keys(BOTS).forEach(name=>{ if(line.startsWith(name+":")) acc.push({name,text:line.replace(name+":","").trim()}); });
    return acc;
  },[]);
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    const particles = Array.from({length:140},()=>({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18,
      size:Math.random()*1.4+.3, opacity:Math.random()*.5+.1,
      color:["#c9a84c","#ffffff","#38bdf8","#a78bfa","#00e5cc"][Math.floor(Math.random()*5)]
    }));
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=p.color; ctx.globalAlpha=p.opacity; ctx.fill();
      });
      particles.forEach((p,i)=>particles.slice(i+1).forEach(q=>{
        const d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<90){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle="#c9a84c";ctx.globalAlpha=(1-d/90)*.07;ctx.lineWidth=.5;ctx.stroke();}
      }));
      ctx.globalAlpha=1; animId=requestAnimationFrame(draw);
    };
    draw();
    return()=>{window.removeEventListener("resize",resize);cancelAnimationFrame(animId);};
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

function SoundWave({color,active}) {
  const heights=[3,5,8,12,16,12,8,5,3];
  return (
    <div style={{display:"flex",alignItems:"center",gap:"2px",height:"20px"}}>
      {heights.map((h,i)=>(
        <div key={i} style={{
          width:"2.5px",borderRadius:"2px",background:color,
          height:active?`${h}px`:"3px",
          opacity:active?0.9:0.4,
          transition:"height .3s ease, opacity .3s ease",
          animation:active?`waveAnim ${.5+i*.07}s ease-in-out ${i*.04}s infinite alternate`:"none"
        }}/>
      ))}
    </div>
  );
}

function BotPodium({name,active,spoke,idle}) {
  const bot=BOTS[name];
  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",
      padding:"20px 14px",borderRadius:"16px",width:"140px",
      background:active?`linear-gradient(160deg,${bot.dark}66,rgba(7,7,15,0.9))`:spoke?"rgba(255,255,255,0.025)":"rgba(255,255,255,0.01)",
      border:active?`1px solid ${bot.color}55`:spoke?`1px solid ${bot.color}25`:"1px solid rgba(255,255,255,0.04)",
      transform:active?"translateY(-10px) scale(1.08)":"translateY(0) scale(1)",
      opacity:idle?0.2:1,
      transition:"all .5s cubic-bezier(.34,1.56,.64,1)",
      boxShadow:active?`0 12px 40px ${bot.glow}25,0 0 80px ${bot.glow}0a,inset 0 1px 0 ${bot.color}22`:"none",
      position:"relative",overflow:"hidden"
    }}>
      {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg,transparent,${bot.color}88,transparent)`}}/>}
      {active&&<div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${bot.color}0a,transparent 60%)`,pointerEvents:"none"}}/>}
      <div style={{
        position:"relative",width:"60px",height:"60px",borderRadius:"50%",
        background:`radial-gradient(circle at 35% 30%,${bot.dark}aa,#07070f)`,
        border:`2px solid ${active?bot.color:spoke?bot.color+"55":"rgba(255,255,255,0.08)"}`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",
        boxShadow:active?`0 0 0 5px ${bot.color}15,0 0 35px ${bot.glow}44`:"none",
        transition:"all .5s ease"
      }}>
        {bot.emoji}
        {active&&<div style={{position:"absolute",inset:"-6px",borderRadius:"50%",border:`1.5px solid ${bot.color}88`,animation:"ringOut 1.5s ease-out infinite"}}/>}
        <div style={{position:"absolute",bottom:"-3px",right:"-3px",width:"20px",height:"20px",borderRadius:"50%",background:"#07070f",border:`1px solid ${active?bot.color+"88":spoke?bot.color+"44":"rgba(255,255,255,0.08)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",color:active?bot.color:spoke?bot.color+"99":"rgba(255,255,255,0.2)",fontWeight:"900"}}>
          {bot.symbol}
        </div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"11px",fontWeight:"700",fontFamily:"'Cinzel',serif",letterSpacing:"1px",textTransform:"uppercase",color:active?bot.color:spoke?bot.color+"cc":"rgba(255,255,255,0.35)",transition:"color .4s"}}>{name.split(" ")[0]}</div>
        <div style={{fontSize:"9px",fontStyle:"italic",marginTop:"3px",color:active?bot.color+"99":spoke?bot.color+"55":"rgba(255,255,255,0.15)",transition:"color .4s"}}>{bot.trait}</div>
      </div>
      <SoundWave color={bot.color} active={active}/>
      {spoke&&!active&&<div style={{fontSize:"9px",fontWeight:"600",letterSpacing:"1.5px",textTransform:"uppercase",color:bot.color+"88"}}>✓ spoke</div>}
      {active&&<div style={{fontSize:"9px",color:bot.color,letterSpacing:"1.5px",animation:"blink 1s step-end infinite",textTransform:"uppercase",fontFamily:"'Cinzel',serif"}}>● live</div>}
    </div>
  );
}

function TypewriterText({text,onDone}) {
  const [shown,setShown]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    setShown("");setDone(false);let i=0;
    const speed=text.length>300?6:10;
    const id=setInterval(()=>{i++;setShown(text.slice(0,i));if(i>=text.length){clearInterval(id);setDone(true);onDone&&onDone();}},speed);
    return()=>clearInterval(id);
  },[text]);
  return <span>{shown}{!done&&<span style={{color:"#c9a84c",animation:"blink .7s step-end infinite"}}>▌</span>}</span>;
}

function Message({msg,visible,isActive,onTyped}) {
  const bot=BOTS[msg.name];
  const [typed,setTyped]=useState(false);
  return (
    <div style={{
      display:"flex",gap:"18px",alignItems:"flex-start",
      opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",
      transition:"opacity .7s ease, transform .7s cubic-bezier(.34,1.56,.64,1)"
    }}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
        <div style={{
          width:"48px",height:"48px",borderRadius:"50%",
          background:`radial-gradient(circle at 35% 30%,${bot.dark}88,#07070f)`,
          border:`2px solid ${bot.color}55`,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"20px",boxShadow:`0 0 20px ${bot.glow}22`,flexShrink:0
        }}>{bot.emoji}</div>
        <div style={{width:"1px",flex:1,background:`linear-gradient(180deg,${bot.color}33,transparent)`,marginTop:"8px",minHeight:"30px"}}/>
      </div>
      <div style={{flex:1,paddingBottom:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
          <span style={{fontSize:"14px",fontWeight:"700",color:bot.color,fontFamily:"'Cinzel',serif",letterSpacing:".5px"}}>{msg.name}</span>
          <span style={{height:"1px",flex:1,background:`linear-gradient(90deg,${bot.color}33,transparent)`}}/>
          <span style={{fontSize:"9px",color:bot.color+"77",letterSpacing:"2px",textTransform:"uppercase",fontStyle:"italic"}}>{bot.trait}</span>
        </div>
        <div style={{
          background:`linear-gradient(${bot.grad})`,
          border:`1px solid ${bot.color}22`,borderLeft:`3px solid ${bot.color}77`,
          borderRadius:"0 14px 14px 14px",padding:"18px 22px",
          fontSize:"14px",lineHeight:"1.9",color:"#d0d0e8",letterSpacing:".2px",
          boxShadow:`0 4px 32px ${bot.glow}08,inset 0 1px 0 ${bot.color}0a`
        }}>
          {isActive&&!typed?<TypewriterText text={msg.text} onDone={()=>{setTyped(true);onTyped&&onTyped();}}/>:msg.text}
        </div>
      </div>
    </div>
  );
}

function SessionComplete({messages,rounds}) {
  return (
    <div style={{marginTop:"72px",display:"flex",flexDirection:"column",alignItems:"center",gap:"0"}}>
      {/* Decorative top line */}
      <div style={{display:"flex",alignItems:"center",gap:"16px",width:"100%",maxWidth:"480px",marginBottom:"32px"}}>
        <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c55)"}}/>
        <div style={{fontSize:"20px",color:"#c9a84c66"}}>⚖</div>
        <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,#c9a84c55,transparent)"}}/>
      </div>

      {/* Main verdict card */}
      <div style={{
        border:"1px solid #c9a84c33",borderRadius:"12px",
        background:"linear-gradient(160deg,rgba(201,168,76,0.08),rgba(201,168,76,0.02))",
        padding:"36px 48px",textAlign:"center",maxWidth:"520px",width:"100%",
        boxShadow:"0 0 60px rgba(201,168,76,0.08),inset 0 1px 0 rgba(201,168,76,0.15)"
      }}>
        <div style={{fontSize:"11px",letterSpacing:"5px",color:"#c9a84c",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"16px",fontWeight:"600"}}>
          Session Adjourned
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"32px",marginBottom:"20px"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:"700",color:"#c9a84c",fontFamily:"'Cinzel',serif"}}>{messages.length}</div>
            <div style={{fontSize:"9px",color:"#c9a84c88",letterSpacing:"2px",textTransform:"uppercase",marginTop:"2px"}}>Arguments</div>
          </div>
          <div style={{width:"1px",background:"#c9a84c22"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:"700",color:"#c9a84c",fontFamily:"'Cinzel',serif"}}>{rounds}</div>
            <div style={{fontSize:"9px",color:"#c9a84c88",letterSpacing:"2px",textTransform:"uppercase",marginTop:"2px"}}>Round{rounds>1?"s":""}</div>
          </div>
          <div style={{width:"1px",background:"#c9a84c22"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"28px",fontWeight:"700",color:"#c9a84c",fontFamily:"'Cinzel',serif"}}>5</div>
            <div style={{fontSize:"9px",color:"#c9a84c88",letterSpacing:"2px",textTransform:"uppercase",marginTop:"2px"}}>Minds</div>
          </div>
        </div>
        <div style={{height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c33,transparent)",marginBottom:"20px"}}/>
        <p style={{fontSize:"13px",color:"#a09070",fontStyle:"italic",fontFamily:"'Cinzel',serif",margin:0,lineHeight:1.7,letterSpacing:".3px"}}>
          "The measure of intelligence is the ability to change."
        </p>
        <p style={{fontSize:"10px",color:"#c9a84c66",margin:"8px 0 0",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Cinzel',serif"}}>— Albert Einstein</p>
      </div>

      {/* Bottom decoration */}
      <div style={{display:"flex",alignItems:"center",gap:"16px",width:"100%",maxWidth:"480px",marginTop:"32px"}}>
        <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c22)"}}/>
        <div style={{fontSize:"10px",color:"#c9a84c44",letterSpacing:"3px",fontFamily:"'Cinzel',serif"}}>AGORA</div>
        <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,#c9a84c22,transparent)"}}/>
      </div>
    </div>
  );
}

export default function App() {
  const [topic,setTopic]=useState("");
  const [rounds,setRounds]=useState(1);
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [activeBot,setActiveBot]=useState(null);
  const [error,setError]=useState("");
  const [visibleCount,setVisibleCount]=useState(0);
  const [activeIndex,setActiveIndex]=useState(-1);
  const [history,setHistory]=useState([]);
  const [showHistory,setShowHistory]=useState(false);
  const [debated,setDebated]=useState(false);
  const [sessionStarted,setSessionStarted]=useState(false);
  const [inputFocused,setInputFocused]=useState(false);
  const bottomRef=useRef(null);
  const botKeys=Object.keys(BOTS);

  useEffect(()=>{const s=localStorage.getItem("agora-history");if(s)setHistory(JSON.parse(s));},[]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[visibleCount,activeIndex]);

  const handleTyped=useCallback((i)=>{setVisibleCount(i+1);setActiveIndex(i+1);},[]);

  async function startDebate() {
    if(!topic.trim()||loading) return;
    setLoading(true);setMessages([]);setError("");setDebated(false);
    setVisibleCount(0);setActiveBot(null);setActiveIndex(-1);
    setShowHistory(false);setSessionStarted(true);
    let i=0;
    const cycle=setInterval(()=>{setActiveBot(botKeys[i%botKeys.length]);i++;},1600);
    try {
      const res=await fetch(`${API_URL}/api/debate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic,rounds})});
      const data=await res.json();
      clearInterval(cycle);setActiveBot(null);
      if(data.success){
        const parsed=parseTranscript(data.transcript);
        setMessages(parsed);setDebated(true);setActiveIndex(0);
        const entry={topic,rounds,date:new Date().toLocaleString(),messages:parsed};
        const updated=[entry,...history].slice(0,10);
        setHistory(updated);localStorage.setItem("agora-history",JSON.stringify(updated));
      } else setError(data.error||"Something went wrong");
    } catch{clearInterval(cycle);setActiveBot(null);setError("Cannot connect to Agora API.");}
    finally{setLoading(false);}
  }

  const spokenBots=new Set(messages.slice(0,visibleCount).map(m=>m.name));
  const currentSpeaker=activeIndex>=0&&activeIndex<messages.length?messages[activeIndex]?.name:null;
  const isComplete=debated&&visibleCount>=messages.length&&messages.length>0&&activeIndex>=messages.length;

  return (
    <div style={{minHeight:"100vh",background:"#07070f",color:"#e8e8f0",fontFamily:"'DM Sans',sans-serif",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes waveAnim{0%{height:3px}100%{height:var(--h,12px)}}
        @keyframes ringOut{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.9);opacity:0}}
        @keyframes shimmerGold{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes floatUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px #c9a84c18}50%{box-shadow:0 0 50px #c9a84c33}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes subtitleReveal{from{opacity:0;letter-spacing:8px}to{opacity:1;letter-spacing:4px}}
        input::placeholder{color:#1a1a2e}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e1e2e;border-radius:2px}
        *{box-sizing:border-box}
        .hov-btn:hover{background:rgba(201,168,76,0.1)!important;color:#c9a84c!important;border-color:#c9a84c44!important}
        .hist-row:hover{border-color:#c9a84c22!important;background:rgba(201,168,76,0.025)!important}
      `}</style>

      <ParticleCanvas/>
      <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.02) 3px,rgba(0,0,0,0.02) 4px)"}}/>

      <div style={{position:"relative",zIndex:2,maxWidth:"880px",margin:"0 auto",padding:"60px 24px 120px"}}>

        {/* ── HEADER ── */}
        <div style={{textAlign:"center",marginBottom:"64px",animation:"floatUp 1s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"12px",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"3px",padding:"7px 22px",marginBottom:"28px",background:"rgba(201,168,76,0.04)",backdropFilter:"blur(10px)"}}>
            <span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:"blink 2s ease-in-out infinite"}}/>
            <span style={{fontSize:"9px",letterSpacing:"5px",color:"#c9a84c",textTransform:"uppercase",fontFamily:"'Cinzel',serif",fontWeight:"600"}}>AI Debate Platform</span>
            <span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:"blink 2s .5s ease-in-out infinite"}}/>
          </div>

          <h1 style={{
            fontSize:"clamp(72px,11vw,108px)",fontWeight:"900",margin:"0 0 20px",
            letterSpacing:"-4px",fontFamily:"'Cinzel',serif",lineHeight:.95,
            background:"linear-gradient(135deg,#6b4e1a 0%,#c9a84c 25%,#f7e8b0 50%,#c9a84c 75%,#6b4e1a 100%)",
            backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            animation:"shimmerGold 5s linear infinite",
            textShadow:"none",filter:"drop-shadow(0 0 40px rgba(201,168,76,0.3))"
          }}>AGORA</h1>

          {/* FIXED: High visibility subtitle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",marginBottom:"8px",animation:"subtitleReveal 1.5s ease .3s both"}}>
            <div style={{width:"48px",height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c77)"}}/>
            <p style={{fontSize:"11px",color:"#c9a84c99",letterSpacing:"4px",textTransform:"uppercase",fontFamily:"'Cinzel',serif",margin:0,fontWeight:"600"}}>Five Minds · One Truth · Zero Compromise</p>
            <div style={{width:"48px",height:"1px",background:"linear-gradient(90deg,#c9a84c77,transparent)"}}/>
          </div>
        </div>

        {/* ── INPUT ── */}
        <div style={{marginBottom:"28px",animation:"floatUp 1s ease .15s both"}}>
          <div style={{
            position:"relative",borderRadius:"10px",overflow:"hidden",
            border:`1px solid ${inputFocused?"#c9a84c55":"rgba(255,255,255,0.06)"}`,
            background:"rgba(255,255,255,0.018)",
            transition:"all .3s ease",
            boxShadow:inputFocused?"0 0 50px rgba(201,168,76,0.1),inset 0 1px 0 rgba(201,168,76,0.08)":"none",
          }}>
            <input style={{width:"100%",padding:"20px 190px 20px 24px",fontSize:"15px",background:"transparent",color:"#e8e8f0",border:"none",fontFamily:"'DM Sans',sans-serif",letterSpacing:".3px"}}
              placeholder="Propose a motion to the house..."
              value={topic}
              onChange={e=>setTopic(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!loading&&startDebate()}
              onFocus={()=>setInputFocused(true)}
              onBlur={()=>setInputFocused(false)}
              disabled={loading}
            />
            <button onClick={startDebate} disabled={loading} style={{
              position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",
              padding:"11px 22px",fontSize:"10px",fontWeight:"700",borderRadius:"7px",
              border:`1px solid ${loading?"rgba(255,255,255,0.06)":"#c9a84c66"}`,
              background:loading?"transparent":"linear-gradient(135deg,rgba(201,168,76,0.22),rgba(201,168,76,0.08))",
              color:loading?"#333":"#c9a84c",cursor:loading?"not-allowed":"pointer",
              letterSpacing:"2px",fontFamily:"'Cinzel',serif",transition:"all .3s ease",
              boxShadow:loading?"none":"0 0 30px rgba(201,168,76,0.18)"
            }}>
              {loading?"IN SESSION":"CONVENE ✦"}
            </button>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"12px",padding:"0 2px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"9px",color:"#c9a84c55",letterSpacing:"3px",textTransform:"uppercase",fontFamily:"'Cinzel',serif",fontWeight:"600"}}>Rounds</span>
              {[1,2,3].map(r=>(
                <button key={r} onClick={()=>setRounds(r)} disabled={loading} className="hov-btn" style={{
                  width:"34px",height:"34px",borderRadius:"5px",fontSize:"12px",fontWeight:"700",fontFamily:"'Cinzel',serif",
                  border:rounds===r?"1px solid #c9a84c55":"1px solid rgba(255,255,255,0.07)",
                  background:rounds===r?"rgba(201,168,76,0.14)":"transparent",
                  color:rounds===r?"#c9a84c":"rgba(255,255,255,0.25)",cursor:"pointer",transition:"all .2s ease"
                }}>{r}</button>
              ))}
            </div>
            {history.length>0&&(
              <button onClick={()=>setShowHistory(!showHistory)} className="hov-btn" style={{
                fontSize:"9px",padding:"7px 16px",borderRadius:"5px",letterSpacing:"2px",fontFamily:"'Cinzel',serif",
                border:"1px solid rgba(255,255,255,0.07)",background:"transparent",
                color:"rgba(255,255,255,0.25)",cursor:"pointer",textTransform:"uppercase",transition:"all .2s ease"
              }}>
                {showHistory?"Close":"Archive ("+history.length+")"}
              </button>
            )}
          </div>
        </div>

        {/* ── ARCHIVE ── */}
        {showHistory&&(
          <div style={{background:"rgba(255,255,255,0.015)",borderRadius:"10px",padding:"20px",marginBottom:"24px",border:"1px solid rgba(255,255,255,0.06)",animation:"fadeIn .3s ease"}}>
            <div style={{fontSize:"8px",letterSpacing:"4px",color:"#c9a84c66",textTransform:"uppercase",fontFamily:"'Cinzel',serif",marginBottom:"14px",fontWeight:"600"}}>Debate Archive</div>
            {history.map((entry,i)=>(
              <div key={i} className="hist-row" onClick={()=>{setTopic(entry.topic);setMessages(entry.messages);setDebated(true);setVisibleCount(entry.messages.length);setActiveIndex(entry.messages.length);setSessionStarted(true);setShowHistory(false);}}
                style={{padding:"12px 16px",borderRadius:"6px",cursor:"pointer",marginBottom:"6px",border:"1px solid rgba(255,255,255,0.04)",transition:"all .2s ease"}}>
                <div style={{fontSize:"13px",color:"rgba(255,255,255,0.55)",letterSpacing:".2px"}}>{entry.topic}</div>
                <div style={{fontSize:"9px",color:"rgba(255,255,255,0.2)",marginTop:"3px",letterSpacing:"1px",textTransform:"uppercase"}}>{entry.date} · {entry.rounds} Round{entry.rounds>1?"s":""}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── ERROR ── */}
        {error&&<div style={{border:"1px solid rgba(255,77,109,0.25)",borderRadius:"8px",padding:"14px 20px",marginBottom:"20px",color:"rgba(255,77,109,0.8)",fontSize:"13px",background:"rgba(255,77,109,0.06)"}}>⚠ {error}</div>}

        {/* ── BOT PANEL ── */}
        {sessionStarted&&(
          <div style={{
            background:"rgba(255,255,255,0.012)",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:"16px",padding:"28px 16px",marginBottom:"40px",
            backdropFilter:"blur(12px)",position:"relative",overflow:"hidden",
            animation:"floatUp .6s ease"
          }}>
            <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"300px",height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c44,transparent)"}}/>
            <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"200px",height:"1px",background:"linear-gradient(90deg,transparent,#c9a84c1a,transparent)"}}/>
            <div style={{textAlign:"center",marginBottom:"24px"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"4px 16px",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"20px",background:"rgba(255,255,255,0.02)"}}>
                {loading&&<span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:"blink 1s ease-in-out infinite"}}/>}
                <span style={{fontSize:"9px",letterSpacing:"4px",fontFamily:"'Cinzel',serif",textTransform:"uppercase",fontWeight:"600",
                  color:loading?"#c9a84c":isComplete?"#c9a84c88":"rgba(255,255,255,0.35)",transition:"color .5s"
                }}>
                  {loading?"Session In Progress":isComplete?"Session Complete":"The Panel"}
                </span>
                {loading&&<span style={{width:"5px",height:"5px",borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:"blink 1s .3s ease-in-out infinite"}}/>}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-around",alignItems:"flex-end",flexWrap:"wrap",gap:"8px"}}>
              {botKeys.map(name=>(
                <BotPodium key={name} name={name}
                  active={loading?activeBot===name:currentSpeaker===name}
                  spoke={spokenBots.has(name)&&currentSpeaker!==name}
                  idle={loading&&activeBot!==name&&!spokenBots.has(name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── TRANSCRIPT ── */}
        {debated&&(
          <div style={{animation:"fadeIn .5s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"28px"}}>
              <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.3))"}}/>
              <span style={{fontSize:"9px",letterSpacing:"4px",color:"#c9a84c77",textTransform:"uppercase",fontFamily:"'Cinzel',serif",fontWeight:"600"}}>Motion Before The House</span>
              <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(201,168,76,0.3),transparent)"}}/>
            </div>
            <div style={{textAlign:"center",marginBottom:"48px",padding:"0 20px"}}>
              <p style={{fontSize:"18px",color:"#c9a84c",fontStyle:"italic",fontFamily:"'Cinzel',serif",fontWeight:"400",lineHeight:1.7,margin:0,letterSpacing:".4px"}}>"{topic}"</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"32px"}}>
              {messages.map((msg,i)=>(
                <Message key={i} msg={msg}
                  visible={i<visibleCount||(i===activeIndex&&debated)}
                  isActive={i===activeIndex&&i>=visibleCount}
                  onTyped={()=>handleTyped(i)}
                />
              ))}
            </div>
            {isComplete&&<SessionComplete messages={messages} rounds={rounds}/>}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
    </div>
  );
}
