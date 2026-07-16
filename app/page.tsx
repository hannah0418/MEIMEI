
"use client";

import { useState, useEffect, useRef } from "react";

type Palette = { hood: string; body: string; bodyDark: string; blush: string };
type Persona = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  desc: string;
  traits: string[];
  emoji: string;
  a: string;
  b: string;
  palette: Palette;
};

const PERSONAS: Record<string, Persona> = {
  spark: {
    id: "spark", name: "Spark UI Designer", short: "Spark UI Designer",
    tagline: "You design. You code. You sparkle.",
    desc: "You have an eye for aesthetics and a mind for logic. In the College of Computer Studies you're the one making every prototype look like it belongs on a fan-cam thumbnail — clean, glowing, and full of personality, just like a MEI MEI stage outfit.",
    traits: ["Creative", "Detail-Oriented", "Innovative", "Expressive", "Tech-Savvy"],
    emoji: "🎨", a: "#ff4fa3", b: "#a855f7",
    palette: { hood: "#ff4fa3", body: "#a855f7", bodyDark: "#6d28d9", blush: "rgba(255,143,196,.5)" },
  },
  binary: {
    id: "binary", name: "Binary Babe", short: "Binary Babe",
    tagline: "You think in ones, zeros, and pure logic.",
    desc: "Your creativity lives inside the algorithm. You find elegant solutions where others see spaghetti code, and you turn messy problems into clean, danceable logic flows — precision is your choreography.",
    traits: ["Analytical", "Precise", "Sharp", "Focused", "Efficient"],
    emoji: "💻", a: "#22d3ee", b: "#0ea5e9",
    palette: { hood: "#22d3ee", body: "#0ea5e9", bodyDark: "#075985", blush: "rgba(147,236,255,.5)" },
  },
  scrum: {
    id: "scrum", name: "Diva Scrum Master", short: "Diva Scrum Master",
    tagline: "You lead the chaos into a masterpiece.",
    desc: "Deadlines, standups, group chats on fire — you turn it all into a well-rehearsed formation. Your creativity shows up in how you organize people, not just pixels, keeping every project on beat like a comeback single.",
    traits: ["Organized", "Charismatic", "Decisive", "Supportive", "Driven"],
    emoji: "👑", a: "#facc15", b: "#eab308",
    palette: { hood: "#facc15", body: "#eab308", bodyDark: "#a16207", blush: "rgba(255,224,130,.5)" },
  },
  loop: {
    id: "loop", name: "Loop Legend", short: "Loop Legend",
    tagline: "You never break, you just iterate.",
    desc: "Ten failed builds? You run an eleventh. Your creative power is persistence — every retry is a remix, every bug fix is a new take, until the routine is finally clean and worthy of the encore.",
    traits: ["Persistent", "Patient", "Resilient", "Consistent", "Determined"],
    emoji: "🔁", a: "#34d399", b: "#059669",
    palette: { hood: "#34d399", body: "#059669", bodyDark: "#065f46", blush: "rgba(167,255,214,.5)" },
  },
  cutie: {
    id: "cutie", name: "Code Cutie", short: "Code Cutie",
    tagline: "You bring the vibes to every commit.",
    desc: "You believe code reviews go better with memes and every group project needs a playlist. Your creativity is contagious energy — you make the whole org feel like a fandom, not a workload.",
    traits: ["Playful", "Fun-loving", "Energetic", "Friendly", "Bright"],
    emoji: "🍬", a: "#fb7185", b: "#f472b6",
    palette: { hood: "#fb7185", body: "#f472b6", bodyDark: "#be185d", blush: "rgba(255,182,206,.6)" },
  },
  debug: {
    id: "debug", name: "Debug Master", short: "Debug Master",
    tagline: "Bugs fear you. Logic respects you.",
    desc: "You treat every stack trace like a mystery worth solving. Calm under pressure, methodical, and quietly proud of every red console turned green — your creativity is in the hunt, not the noise.",
    traits: ["Analytical", "Calm", "Methodical", "Curious", "Sharp-Eyed"],
    emoji: "🐞", a: "#818cf8", b: "#6366f1",
    palette: { hood: "#818cf8", body: "#6366f1", bodyDark: "#3730a3", blush: "rgba(196,190,255,.5)" },
  },
  syntax: {
    id: "syntax", name: "Syntax Superstar", short: "Syntax Superstar",
    tagline: "You turn code into a whole performance.",
    desc: "You don't just build things, you present them like a comeback stage. Explaining a for-loop to your groupmates or pitching a thesis defense — either way, you've got the mic energy and the confidence to match.",
    traits: ["Expressive", "Communicative", "Bold", "Articulate", "Charismatic"],
    emoji: "🎤", a: "#f97316", b: "#fb923c",
    palette: { hood: "#f97316", body: "#fb923c", bodyDark: "#c2410c", blush: "rgba(255,199,140,.55)" },
  },
  cooldev: {
    id: "cooldev", name: "Cool Dev", short: "Cool Dev",
    tagline: "You break the rules to build the future.",
    desc: "Frameworks are suggestions, tutorials are starting points. You're the one trying the weird approach nobody asked for — and somehow it works. Your creativity is experimentation without fear of the wrong answer.",
    traits: ["Innovative", "Bold", "Curious", "Experimental", "Fearless"],
    emoji: "🚀", a: "#38bdf8", b: "#94a3b8",
    palette: { hood: "#e2e8f0", body: "#38bdf8", bodyDark: "#0369a1", blush: "rgba(210,240,255,.5)" },
  },
};

const PERSONA_ORDER = ["spark", "binary", "scrum", "loop", "cutie", "debug", "syntax", "cooldev"];

type Question = { q: string; opts: { t: string; c: string }[] };

const QUESTIONS: Question[] = [
  { q: "How do you usually handle a runtime error in your code?", opts: [
    { t: "Panic and fix it as fast as I can!", c: "cutie" },
    { t: "Check the error, calm down, and debug step by step.", c: "debug" },
    { t: "Google it, Stack Overflow it!", c: "binary" },
    { t: "Ask AI... or a friend.", c: "scrum" },
  ]},
  { q: "When designing a UI, what matters most to you?", opts: [
    { t: "Making it beautiful and eye-catching.", c: "spark" },
    { t: "Making sure the logic and structure is flawless.", c: "binary" },
    { t: "Making it fun and full of personality.", c: "cutie" },
    { t: "Making it accessible and easy for everyone.", c: "scrum" },
  ]},
  { q: "Your group project is falling behind schedule. What do you do?", opts: [
    { t: "Take charge, assign tasks, keep everyone on track.", c: "scrum" },
    { t: "Quietly grind through your part until it's done.", c: "loop" },
    { t: "Suggest a totally different approach to save time.", c: "cooldev" },
    { t: "Lighten the mood so the team doesn't burn out.", c: "cutie" },
  ]},
  { q: "You just found a working solution to a hard problem. What's next?", opts: [
    { t: "Ship it! On to the next challenge.", c: "cooldev" },
    { t: "Refactor it until it's clean and elegant.", c: "debug" },
    { t: "Write docs so everyone understands it.", c: "syntax" },
    { t: "Test it against every edge case you can think of.", c: "binary" },
  ]},
  { q: "Pick your ideal hackathon role:", opts: [
    { t: "UI/UX Designer", c: "spark" },
    { t: "Backend Architect", c: "binary" },
    { t: "Presenter / Pitch Person", c: "syntax" },
    { t: "Project Manager", c: "scrum" },
  ]},
  { q: "A feature keeps breaking no matter what you try. How do you feel?", opts: [
    { t: "Frustrated but determined — I won't stop till it's fixed.", c: "loop" },
    { t: "Curious — it's basically a puzzle to solve.", c: "debug" },
    { t: "Ready to try something completely different.", c: "cooldev" },
    { t: "I'd rather ask the team for a fresh perspective.", c: "scrum" },
  ]},
  { q: "What's your go-to way to unwind after coding all day?", opts: [
    { t: "Dancing / blasting a P-pop playlist.", c: "cutie" },
    { t: "Sketching UI concepts for fun.", c: "spark" },
    { t: "Reading about new frameworks and tech.", c: "cooldev" },
    { t: "Journaling or voice-memo-ing my ideas.", c: "syntax" },
  ]},
  { q: "In the group chat, you're usually the one who...", opts: [
    { t: "Sends the memes and keeps the energy up.", c: "cutie" },
    { t: "Organizes the to-do list.", c: "scrum" },
    { t: "Explains things clearly when someone's confused.", c: "syntax" },
    { t: "Quietly fixes typos and bugs no one asked about.", c: "debug" },
  ]},
  { q: "Your code finally works after hours of debugging. Your reaction?", opts: [
    { t: "\"Let's gooo!\" — happy dance at your desk.", c: "cutie" },
    { t: "Quiet relief, on to the next loop.", c: "loop" },
    { t: "Immediately think about how to optimize it more.", c: "binary" },
    { t: "Screenshot it to show your groupmates, proudly.", c: "syntax" },
  ]},
  { q: "Choose a P-pop-inspired app you'd love to design:", opts: [
    { t: "A glowing neon idol showcase app.", c: "spark" },
    { t: "A fan-vote ranking algorithm.", c: "binary" },
    { t: "A fandom community hub app.", c: "scrum" },
    { t: "An AI remix / experimental sound app.", c: "cooldev" },
  ]},
  { q: "When learning a new programming language or tool, you...", opts: [
    { t: "Build something small and fun with it right away.", c: "cutie" },
    { t: "Read the documentation cover to cover first.", c: "binary" },
    { t: "Break it on purpose just to see how it fails.", c: "debug" },
    { t: "Try combining it with something unconventional.", c: "cooldev" },
  ]},
  { q: "What's your creative superpower in the CCS org?", opts: [
    { t: "Making designs people can't stop staring at.", c: "spark" },
    { t: "Turning chaos into an organized sprint.", c: "scrum" },
    { t: "Never giving up till the bug dies.", c: "loop" },
    { t: "Explaining tech stuff so it finally makes sense.", c: "syntax" },
  ]},
];

type LBEntry = { name: string; persona: string; score: number; emoji: string; isYou?: boolean; rank?: number };

const LB_BASE: LBEntry[] = [
  { name: "Cool Dev", persona: "cooldev", score: 12540, emoji: "🚀" },
  { name: "Spark UI Designer", persona: "spark", score: 11820, emoji: "🎨" },
  { name: "Diva Scrum Master", persona: "scrum", score: 10980, emoji: "👑" },
  { name: "Binary Babe", persona: "binary", score: 9210, emoji: "💻" },
  { name: "Loop Legend", persona: "loop", score: 8760, emoji: "🔁" },
  { name: "Code Cutie", persona: "cutie", score: 7880, emoji: "🍬" },
  { name: "Debug Master", persona: "debug", score: 7240, emoji: "🐞" },
  { name: "Syntax Superstar", persona: "syntax", score: 6980, emoji: "🎤" },
];
const LB_FILLER: LBEntry[] = [];
for (let i = 9; i <= 40; i++) {
  LB_FILLER.push({
    name: "CCS Player #" + (100 + i),
    persona: PERSONA_ORDER[i % PERSONA_ORDER.length],
    score: Math.max(120, 6900 - (i - 8) * 180 - (i % 5) * 40),
    emoji: "🧑‍💻",
  });
}

type ResultType = { personaId: string; score: number; accuracy: number; matchCount: number; total: number };
type Page = "home" | "howtoplay" | "personas" | "nameentry" | "quiz" | "results" | "leaderboard";

/* ======================================================================
   CSS
====================================================================== */
const CSS = `
:root{
  --bg:#07060f; --bg2:#0c0a1c; --panel:#120f26; --panel2:#171331;
  --line: rgba(255,79,163,.28); --line-soft: rgba(139,92,246,.22);
  --pink:#ff2f8e; --pink2:#ff6fb4; --purple:#9b5cf6; --purple2:#b794fa;
  --cyan:#33e6ff; --text:#efe9ff; --muted:#8f8ab0; --muted2:#a89fce; --gold:#ffd23f;
}
.mmq *{box-sizing:border-box;}
.mmq{
  background:
    radial-gradient(circle at 15% 0%, rgba(155,92,246,.16), transparent 45%),
    radial-gradient(circle at 85% 10%, rgba(255,47,142,.14), transparent 40%),
    repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0px, rgba(255,255,255,.018) 1px, transparent 1px, transparent 3px),
    var(--bg);
  color:var(--text); font-family:'VT323', monospace; font-size:19px; min-height:100vh; -webkit-font-smoothing:antialiased;
}
.mmq .pixel{font-family:'Press Start 2P', monospace;}
.mmq button{font-family:inherit; cursor:pointer;}
.mmq input{font-family:inherit;}
#mmq-app{min-height:100vh; display:flex; flex-direction:column;}
.mmq .shell{max-width:1400px; margin:0 auto; width:100%; padding:0 28px;}
.mmq .topnav{position:sticky; top:0; z-index:40; background:rgba(7,6,15,.86); backdrop-filter: blur(10px); border-bottom:1px solid var(--line);}
.mmq .topnav-inner{max-width:1400px; margin:0 auto; padding:14px 28px; display:flex; align-items:center; justify-content:space-between; gap:18px;}
.mmq .brand{display:flex; align-items:center; gap:10px; cursor:pointer; user-select:none;}
.mmq .brand-heart{font-size:20px; color:var(--pink); text-shadow:0 0 10px var(--pink), 0 0 22px var(--pink);}
.mmq .brand-name{font-size:16px; letter-spacing:1px; color:var(--pink2); text-shadow:0 0 12px rgba(255,47,142,.55);}
.mmq .navlinks{display:flex; align-items:center; gap:26px; font-size:13px; letter-spacing:.5px;}
.mmq .navlinks a{color:var(--muted); text-decoration:none; padding:6px 2px; position:relative; white-space:nowrap;}
.mmq .navlinks a.active{color:var(--pink2);}
.mmq .navlinks a.active::after{content:''; position:absolute; left:0; right:0; bottom:-14px; height:2px; background:linear-gradient(90deg,var(--pink),var(--purple)); box-shadow:0 0 8px var(--pink);}
.mmq .navlinks a:hover{color:var(--text);}
.mmq .nav-right{display:flex; align-items:center; gap:12px;}
.mmq .icon-btn{width:34px; height:34px; border-radius:8px; border:1px solid var(--line-soft); background:var(--panel); display:flex; align-items:center; justify-content:center; font-size:15px; color:var(--purple2);}
.mmq .icon-btn:hover{border-color:var(--pink);}
.mmq .user-chip{display:flex; align-items:center; gap:8px; background:var(--panel); border:1px solid var(--line-soft); border-radius:20px; padding:5px 12px 5px 6px; font-size:14px;}
.mmq .user-avatar-mini{width:22px; height:22px; border-radius:50%; background:radial-gradient(circle at 35% 30%, var(--pink2), var(--purple)); flex-shrink:0;}
.mmq .panel{background:linear-gradient(180deg, var(--panel), var(--panel2)); border:1px solid var(--line-soft); border-radius:14px; position:relative;}
.mmq .corners span{position:absolute; width:14px; height:14px; pointer-events:none;}
.mmq .corners .tl{top:-1px; left:-1px; border-top:2px solid var(--cyan); border-left:2px solid var(--cyan);}
.mmq .corners .tr{top:-1px; right:-1px; border-top:2px solid var(--cyan); border-right:2px solid var(--cyan);}
.mmq .corners .bl{bottom:-1px; left:-1px; border-bottom:2px solid var(--cyan); border-left:2px solid var(--cyan);}
.mmq .corners .br{bottom:-1px; right:-1px; border-bottom:2px solid var(--cyan); border-right:2px solid var(--cyan);}
.mmq .btn{border-radius:9px; border:1px solid transparent; padding:13px 22px; font-size:14px; letter-spacing:.5px; display:inline-flex; align-items:center; gap:9px; justify-content:center; transition:transform .12s ease;}
.mmq .btn:active{transform:scale(.97);}
.mmq .btn-primary{background:linear-gradient(90deg, var(--pink), #ff5fa8); color:#fff; box-shadow:0 6px 22px rgba(255,47,142,.35); font-family:'Press Start 2P'; font-size:12px;}
.mmq .btn-primary:hover{box-shadow:0 6px 26px rgba(255,47,142,.55);}
.mmq .btn-secondary{background:transparent; border:1px solid rgba(255,255,255,.18); color:var(--text); font-family:'Press Start 2P'; font-size:12px;}
.mmq .btn-secondary:hover{border-color:var(--purple2);}
.mmq .btn-ghost{background:transparent; border:1px solid var(--line-soft); color:var(--muted); font-size:15px;}
.mmq .btn:disabled{opacity:.4; cursor:not-allowed;}
.mmq .btn-block{width:100%;}
.mmq .eyebrow{font-family:'Press Start 2P'; font-size:10px; letter-spacing:2px; color:var(--cyan);}
.mmq .home-hero{display:grid; grid-template-columns:1.1fr .9fr; gap:40px; align-items:center; padding:56px 0 40px;}
.mmq .home-icons{display:flex; gap:26px; margin:22px 0 30px; flex-wrap:wrap;}
.mmq .home-icons .ic{display:flex; flex-direction:column; align-items:center; gap:6px; font-size:12px; color:var(--muted); width:78px; text-align:center;}
.mmq .home-icons .ic .glyph{font-size:20px; color:var(--pink2);}
.mmq .home-heart{font-size:34px; color:var(--pink); text-shadow:0 0 20px var(--pink); display:block; margin-bottom:6px;}
.mmq .home-title{font-family:'Press Start 2P'; font-size:52px; line-height:1.15; margin:0 0 6px; background:linear-gradient(90deg, var(--pink), var(--pink2) 40%, var(--purple2)); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 0 40px rgba(255,47,142,.25);}
.mmq .home-sub{font-family:'Press Start 2P'; font-size:16px; color:var(--purple2); letter-spacing:3px; margin-bottom:16px;}
.mmq .home-tag{color:var(--muted); font-size:19px; max-width:480px; line-height:1.5; margin-bottom:8px;}
.mmq .home-actions{display:flex; gap:14px; margin-top:26px; flex-wrap:wrap;}
.mmq .home-credit{margin-top:18px; font-size:14px; color:var(--muted);}
.mmq .home-credit b{color:var(--cyan);}
.mmq .hero-stage{position:relative; height:420px; border-radius:16px; overflow:visible; background:radial-gradient(circle at 50% 40%, rgba(155,92,246,.18), transparent 65%);}
.mmq .hero-platform{position:absolute; bottom:36px; left:50%; transform:translateX(-50%); width:220px; height:36px; border-radius:50%; background:radial-gradient(ellipse at center, rgba(255,47,142,.55), rgba(255,47,142,0) 70%); filter:blur(1px);}
.mmq .hero-avatar-wrap{position:absolute; bottom:52px; left:50%; transform:translateX(-50%); width:170px;}
.mmq .floaty{position:absolute; opacity:.85;}
.mmq .f1{top:6%; left:2%;} .mmq .f2{top:14%; right:0%;} .mmq .f3{bottom:20%; left:-4%;} .mmq .f4{bottom:8%; right:2%;}
.mmq .device{width:72px; height:52px; border-radius:6px; border:2px solid var(--purple2); background:linear-gradient(160deg, #1a1533, #0d0b1e); box-shadow:0 0 18px rgba(155,92,246,.35);}
.mmq .device::before{content:''; display:block; margin:8px; height:6px; border-radius:2px; background:linear-gradient(90deg,var(--pink),var(--cyan)); opacity:.7;}
.mmq .device::after{content:''; display:block; margin:0 8px; height:4px; width:60%; border-radius:2px; background:rgba(255,255,255,.15);}
.mmq .star{color:var(--cyan); font-size:18px; text-shadow:0 0 10px var(--cyan); animation:mmq-twinkle 2.4s ease-in-out infinite;}
.mmq .star.s2{animation-delay:.6s; color:var(--pink2); text-shadow:0 0 10px var(--pink2);}
.mmq .star.s3{animation-delay:1.2s;}
@keyframes mmq-twinkle{0%,100%{opacity:.3; transform:scale(.85);} 50%{opacity:1; transform:scale(1.1);}}
.mmq .musicbar{display:flex; align-items:center; gap:16px; padding:14px 22px; margin:10px 0 40px; border-top:1px solid var(--line-soft); border-bottom:1px solid var(--line-soft);}
.mmq .track-thumb{width:40px; height:40px; border-radius:8px; background:radial-gradient(circle at 30% 30%, var(--pink2), var(--purple)); flex-shrink:0;}
.mmq .track-meta{line-height:1.25; min-width:150px;}
.mmq .track-title{font-size:16px; color:var(--text);}
.mmq .track-artist{font-size:13px; color:var(--muted);}
.mmq .music-controls{display:flex; align-items:center; gap:14px; margin-left:auto;}
.mmq .music-controls button{background:transparent; border:none; color:var(--muted); font-size:17px;}
.mmq .music-controls .play{width:36px; height:36px; border-radius:50%; border:1px solid var(--pink2); color:var(--pink2); display:flex; align-items:center; justify-content:center; font-size:14px;}
.mmq .eq{display:flex; align-items:flex-end; gap:3px; height:18px; margin-left:6px;}
.mmq .eq span{width:3px; background:var(--cyan); border-radius:1px; animation:mmq-eqbar 1.1s ease-in-out infinite;}
@keyframes mmq-eqbar{0%,100%{transform:scaleY(.35);} 50%{transform:scaleY(1);}}
.mmq .paused .eq span{animation-play-state:paused; transform:scaleY(.3);}
.mmq .name-wrap{display:grid; grid-template-columns:.85fr 1.15fr; gap:26px; padding:44px 0 60px; align-items:start;}
.mmq .howit-item{display:flex; gap:12px; align-items:flex-start; margin:20px 0;}
.mmq .howit-glyph{width:34px; height:34px; border-radius:9px; background:var(--panel2); border:1px solid var(--line-soft); display:flex; align-items:center; justify-content:center; color:var(--pink2); font-size:15px; flex-shrink:0;}
.mmq .howit-text{font-size:16px; line-height:1.35; color:var(--text);}
.mmq .vibe-panel{margin-top:26px; padding:20px;}
.mmq .vibe-title{font-size:13px; color:var(--muted); letter-spacing:1px; margin-bottom:14px; display:flex; align-items:center; gap:8px;}
.mmq .vibe-bars{display:flex; align-items:flex-end; gap:5px; height:70px;}
.mmq .vibe-bars span{flex:1; background:linear-gradient(180deg, var(--pink2), var(--purple)); border-radius:2px 2px 0 0; animation:mmq-vibe 1.6s ease-in-out infinite;}
@keyframes mmq-vibe{0%,100%{transform:scaleY(.25);} 50%{transform:scaleY(1);}}
.mmq .begin-card{padding:38px 34px;}
.mmq .begin-title{font-family:'Press Start 2P'; font-size:22px; color:var(--cyan); text-align:center; text-shadow:0 0 18px rgba(51,230,255,.4); margin-bottom:10px;}
.mmq .begin-sub{text-align:center; color:var(--muted); font-size:16px; margin-bottom:26px;}
.mmq .input-wrap{position:relative; margin-bottom:22px;}
.mmq .input-wrap .ic{position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:16px;}
.mmq .name-input{width:100%; padding:15px 16px 15px 42px; border-radius:10px; border:1px solid var(--line-soft); background:var(--bg2); color:var(--text); font-size:17px; outline:none;}
.mmq .name-input:focus{border-color:var(--pink);}
.mmq .begin-tip{text-align:center; font-size:14px; color:var(--muted); margin-top:16px;}
.mmq .quiz-wrap{max-width:760px; margin:0 auto; padding:40px 0 60px;}
.mmq .quiz-top{display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;}
.mmq .quiz-counter{font-size:13px; letter-spacing:1px; color:var(--muted);}
.mmq .progress-track{display:flex; gap:5px; margin:14px 0 26px;}
.mmq .progress-seg{flex:1; height:6px; border-radius:3px; background:rgba(255,255,255,.08);}
.mmq .progress-seg.done{background:linear-gradient(90deg, var(--pink), var(--purple));}
.mmq .q-card{padding:26px;}
.mmq .q-head{display:flex; gap:14px; align-items:flex-start; margin-bottom:22px;}
.mmq .q-badge{width:44px; height:44px; border-radius:10px; background:var(--bg2); border:1px solid var(--line-soft); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;}
.mmq .q-text{font-size:21px; line-height:1.4; color:var(--text); padding-top:4px;}
.mmq .opt{display:flex; align-items:center; gap:14px; padding:15px 16px; margin-bottom:11px; border:1px solid var(--line-soft); border-radius:10px; background:var(--bg2); font-size:17px;}
.mmq .opt:hover{border-color:var(--purple2);}
.mmq .opt.selected{border-color:var(--cyan); background:rgba(51,230,255,.07); box-shadow:0 0 0 1px var(--cyan) inset;}
.mmq .opt-letter{width:26px; height:26px; border-radius:6px; background:var(--panel2); border:1px solid var(--line-soft); display:flex; align-items:center; justify-content:center; font-size:13px; color:var(--purple2); flex-shrink:0; font-family:'Press Start 2P';}
.mmq .opt.selected .opt-letter{background:var(--cyan); color:#04222b; border-color:var(--cyan);}
.mmq .opt-check{margin-left:auto; color:var(--cyan); font-size:18px; visibility:hidden;}
.mmq .opt.selected .opt-check{visibility:visible;}
.mmq .q-foot{display:flex; justify-content:space-between; align-items:center; margin-top:22px;}
.mmq .results-wrap{max-width:960px; margin:0 auto; padding:40px 0 60px; text-align:center;}
.mmq .results-eyebrow{font-size:15px; letter-spacing:3px; color:var(--muted);}
.mmq .results-title{font-family:'Press Start 2P'; font-size:36px; margin:12px 0 6px; background:linear-gradient(90deg, var(--persona-a, var(--pink)), var(--persona-b, var(--purple))); -webkit-background-clip:text; background-clip:text; color:transparent;}
.mmq .results-tagline{color:var(--muted); font-size:18px; margin-bottom:32px;}
.mmq .results-grid{display:grid; grid-template-columns:.8fr 1.2fr; gap:26px; text-align:left; margin-bottom:26px;}
.mmq .avatar-box{padding:20px; display:flex; align-items:center; justify-content:center; min-height:280px;}
.mmq .avatar-box svg{width:180px; height:auto; filter:drop-shadow(0 0 20px var(--persona-a, var(--pink)));}
.mmq .desc-box{padding:24px; display:flex; flex-direction:column; justify-content:center;}
.mmq .desc-text{font-size:17px; line-height:1.55; color:var(--text); margin-bottom:16px;}
.mmq .traits{display:flex; flex-wrap:wrap; gap:8px;}
.mmq .trait-chip{font-size:13px; padding:6px 12px; border-radius:20px; border:1px solid var(--persona-a, var(--pink2)); color:var(--persona-a, var(--pink2)); background:rgba(255,255,255,.02);}
.mmq .stats-row{display:flex; gap:16px; margin-bottom:26px;}
.mmq .stat-box{flex:1; padding:20px; text-align:center;}
.mmq .stat-label{font-size:13px; letter-spacing:1px; color:var(--muted); margin-bottom:6px;}
.mmq .stat-value{font-family:'Press Start 2P'; font-size:24px; color:var(--cyan);}
.mmq .share-box{padding:20px 24px; margin-bottom:20px; text-align:left;}
.mmq .share-title{font-size:13px; letter-spacing:1px; color:var(--muted); margin-bottom:12px;}
.mmq .share-row{display:flex; gap:10px; align-items:center; flex-wrap:wrap;}
.mmq .share-circle{width:38px; height:38px; border-radius:9px; border:1px solid var(--line-soft); background:var(--bg2); display:flex; align-items:center; justify-content:center; font-size:15px; color:var(--purple2);}
.mmq .download-btn{flex:1; min-width:180px; background:var(--gold); color:#241900; border:none; border-radius:9px; padding:12px 16px; font-family:'Press Start 2P'; font-size:11px; display:flex; align-items:center; justify-content:center; gap:8px;}
.mmq .results-actions{display:flex; gap:14px; justify-content:center; flex-wrap:wrap;}
.mmq .lb-wrap{display:grid; grid-template-columns:1.35fr .85fr; gap:24px; padding:40px 0 60px; align-items:start;}
.mmq .lb-tabs{display:flex; gap:8px; margin-bottom:18px;}
.mmq .lb-tab{padding:9px 20px; border-radius:8px; border:1px solid var(--line-soft); font-size:14px; color:var(--muted); background:var(--bg2);}
.mmq .lb-tab.active{background:linear-gradient(90deg,var(--pink),var(--purple)); color:#fff; border-color:transparent;}
.mmq .lb-panel{padding:22px;}
.mmq .lb-title{font-family:'Press Start 2P'; font-size:15px; color:var(--pink2); text-align:center; margin-bottom:20px;}
.mmq .lb-row{display:flex; align-items:center; gap:14px; padding:12px 6px; border-bottom:1px solid rgba(255,255,255,.06); font-size:17px;}
.mmq .lb-row:last-child{border-bottom:none;}
.mmq .lb-rank{width:26px; text-align:center; color:var(--muted); font-size:15px;}
.mmq .lb-row.top .lb-rank{color:var(--gold); font-family:'Press Start 2P'; font-size:12px;}
.mmq .lb-avatar{width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;}
.mmq .lb-name{flex:1;}
.mmq .lb-name .sub{display:block; font-size:12px; color:var(--muted);}
.mmq .lb-score{color:var(--cyan); font-size:16px;}
.mmq .lb-row.you{background:rgba(255,47,142,.08); border-radius:8px; border-bottom:none; margin-top:6px;}
.mmq .lb-row.you .lb-name{color:var(--pink2);}
.mmq .lb-gap{text-align:center; color:var(--muted); font-size:13px; padding:6px 0;}
.mmq .season-note{text-align:center; color:var(--muted); font-size:14px; margin-top:16px;}
.mmq .profile-card{padding:22px; text-align:center;}
.mmq .profile-avatar-wrap svg{width:100px;}
.mmq .profile-name{font-family:'Press Start 2P'; font-size:14px; color:var(--pink2); margin:12px 0 4px;}
.mmq .profile-persona{color:var(--muted); font-size:15px; margin-bottom:16px;}
.mmq .level-row{display:flex; justify-content:space-between; font-size:13px; color:var(--muted); margin-bottom:6px;}
.mmq .xp-track{height:8px; border-radius:4px; background:rgba(255,255,255,.08); overflow:hidden; margin-bottom:20px;}
.mmq .xp-fill{height:100%; background:linear-gradient(90deg,var(--cyan),var(--purple2));}
.mmq .badges-title{text-align:left; font-size:13px; color:var(--muted); letter-spacing:1px; margin-bottom:10px;}
.mmq .badges-row{display:flex; gap:10px; margin-bottom:20px;}
.mmq .badge-icon{width:40px; height:40px; border-radius:10px; background:var(--bg2); border:1px solid var(--line-soft); display:flex; align-items:center; justify-content:center; font-size:17px;}
.mmq .ach-title{text-align:left; font-size:13px; color:var(--muted); letter-spacing:1px; margin-bottom:10px;}
.mmq .ach-item{display:flex; align-items:center; gap:8px; text-align:left; font-size:14px; color:var(--text); margin-bottom:8px;}
.mmq .ach-item .dot{color:var(--cyan);}
.mmq .page-head{padding:44px 0 10px; text-align:center;}
.mmq .page-title{font-family:'Press Start 2P'; font-size:26px; color:var(--pink2); margin-bottom:10px;}
.mmq .page-sub{color:var(--muted); font-size:17px; max-width:600px; margin:0 auto;}
.mmq .steps-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:18px; padding:36px 0;}
.mmq .step-card{padding:22px; text-align:center;}
.mmq .step-num{font-family:'Press Start 2P'; font-size:11px; color:var(--cyan); margin-bottom:10px;}
.mmq .step-glyph{font-size:26px; margin-bottom:10px;}
.mmq .step-text{font-size:15px; color:var(--muted); line-height:1.4;}
.mmq .why-box{padding:26px; margin:0 0 50px; font-size:17px; line-height:1.6; color:var(--text);}
.mmq .why-box b{color:var(--cyan);}
.mmq .personas-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:18px; padding:30px 0 60px;}
.mmq .persona-card{padding:22px; text-align:center;}
.mmq .persona-card svg{width:88px;}
.mmq .persona-card h3{font-family:'Press Start 2P'; font-size:12px; margin:12px 0 6px; color:var(--persona-a,var(--pink2));}
.mmq .persona-card p{font-size:14px; color:var(--muted); line-height:1.4; min-height:56px;}
.mmq .persona-mini-traits{display:flex; gap:5px; flex-wrap:wrap; justify-content:center; margin-top:10px;}
.mmq .persona-mini-traits span{font-size:11px; padding:3px 8px; border-radius:10px; border:1px solid var(--line-soft); color:var(--muted);}
.mmq footer{margin-top:auto; border-top:1px solid var(--line-soft); padding:22px 0; text-align:center; color:var(--muted); font-size:13px;}
.mmq footer .fbrand{color:var(--pink2); font-family:'Press Start 2P'; font-size:11px; display:block; margin-bottom:8px;}
.mmq footer .flinks{margin-top:8px; display:flex; gap:18px; justify-content:center; font-size:12px;}
.mmq .toast{position:fixed; bottom:22px; left:50%; transform:translateX(-50%); background:var(--panel2); border:1px solid var(--pink2); color:var(--text); padding:12px 20px; border-radius:10px; font-size:14px; z-index:100; box-shadow:0 8px 30px rgba(0,0,0,.4);}
.mmq .modal-overlay{position:fixed; inset:0; background:rgba(4,3,10,.72); display:flex; align-items:center; justify-content:center; z-index:90; padding:20px;}
.mmq .modal-box{max-width:360px; width:100%; padding:26px; text-align:center;}
.mmq .modal-box p{font-size:17px; margin-bottom:20px; color:var(--text);}
.mmq .modal-actions{display:flex; gap:10px; justify-content:center;}
@media (max-width:980px){
  .mmq .home-hero, .mmq .name-wrap, .mmq .results-grid, .mmq .lb-wrap{grid-template-columns:1fr;}
  .mmq .steps-grid, .mmq .personas-grid{grid-template-columns:repeat(2,1fr);}
  .mmq .home-title{font-size:36px;}
  .mmq .hero-stage{height:280px;}
}
@media (max-width:640px){
  .mmq .navlinks{display:none;}
  .mmq .steps-grid, .mmq .personas-grid{grid-template-columns:1fr;}
  .mmq .stats-row{flex-direction:column;}
}
`;

/* ======================================================================
   AVATAR (blocky retro chibi bust, recolored per persona)
====================================================================== */
function Avatar({ persona }: { persona: Persona }) {
  const pal = persona.palette;
  return (
    <svg
      viewBox="0 0 120 130"
      shapeRendering="crispEdges"
      style={{ ["--persona-a" as any]: persona.a }}
    >
      <rect x={20} y={6} width={80} height={26} rx={4} style={{ fill: pal.hood }} />
      <rect x={8} y={26} width={16} height={34} rx={3} style={{ fill: pal.hood }} />
      <rect x={96} y={26} width={16} height={34} rx={3} style={{ fill: pal.hood }} />
      <rect x={6} y={34} width={16} height={26} rx={4} style={{ fill: "#12121f" }} />
      <rect x={98} y={34} width={16} height={26} rx={4} style={{ fill: "#12121f" }} />
      <rect x={10} y={38} width={8} height={18} rx={3} style={{ fill: pal.bodyDark }} />
      <rect x={102} y={38} width={8} height={18} rx={3} style={{ fill: pal.bodyDark }} />
      <rect x={28} y={30} width={64} height={46} rx={10} style={{ fill: "#f4c9a0" }} />
      <rect x={40} y={52} width={10} height={6} rx={2} style={{ fill: "#1a1a2e" }} />
      <rect x={70} y={52} width={10} height={6} rx={2} style={{ fill: "#1a1a2e" }} />
      <rect x={42} y={66} width={8} height={5} rx={2} style={{ fill: pal.blush }} />
      <rect x={70} y={66} width={8} height={5} rx={2} style={{ fill: pal.blush }} />
      <rect x={48} y={70} width={24} height={4} rx={2} style={{ fill: "#c98a5c", opacity: 0.5 }} />
      <polygon points="14,112 106,112 118,130 2,130" style={{ fill: pal.body }} />
      <rect x={18} y={82} width={84} height={30} rx={8} style={{ fill: pal.body }} />
      <rect x={44} y={90} width={32} height={20} rx={6} style={{ fill: pal.bodyDark }} />
      <rect x={52} y={78} width={16} height={10} rx={4} style={{ fill: pal.bodyDark }} />
    </svg>
  );
}

function Corners() {
  return (
    <div className="corners">
      <span className="tl" />
      <span className="tr" />
      <span className="bl" />
      <span className="br" />
    </div>
  );
}

/* ======================================================================
   MAIN COMPONENT
====================================================================== */
export default function MeiMeiQuiz() {
  const [page, setPage] = useState<Page>("home");
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [name, setName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);
  const [lbTab, setLbTab] = useState<"global" | "friends">("global");
  const [toast, setToast] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [nameError, setNameError] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (page === "nameentry") {
      setNameError(false);
      const t = setTimeout(() => nameInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [page]);

  function goNav(p: Page) {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initQuiz() {
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
  }

  function submitName() {
    const val = nameDraft.trim();
    if (!val) {
      setNameError(true);
      nameInputRef.current?.focus();
      return;
    }
    setName(val);
    initQuiz();
    goNav("quiz");
  }

  function selectOption(i: number) {
    setSelected(i);
  }

  function computeResult(finalAnswers: string[]) {
    const counts: Record<string, number> = {};
    PERSONA_ORDER.forEach((p) => (counts[p] = 0));
    finalAnswers.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
    let best = PERSONA_ORDER[0];
    let bestCount = -1;
    PERSONA_ORDER.forEach((p) => {
      if (counts[p] > bestCount) {
        bestCount = counts[p];
        best = p;
      }
    });
    const total = finalAnswers.length;
    const accuracy = Math.round((bestCount / total) * 100);
    const score = Math.round(accuracy * 10 + 50);
    setResult({ personaId: best, score, accuracy, matchCount: bestCount, total });
  }

  function nextQuestion() {
    if (selected === null) return;
    const q = QUESTIONS[qIndex];
    const cat = q.opts[selected].c;
    const newAnswers = [...answers, cat];
    setAnswers(newAnswers);
    setSelected(null);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      computeResult(newAnswers);
      goNav("results");
    }
  }

  function confirmExit() {
    setShowExitConfirm(false);
    goNav("home");
  }

  function playAgain() {
    initQuiz();
    goNav("quiz");
  }

  function buildLeaderboard() {
    const all = [...LB_BASE, ...LB_FILLER].map((e) => ({ ...e }));
    let withYou: LBEntry[] = all;
    if (result) {
      const youEntry: LBEntry = {
        name: name || "You",
        persona: result.personaId,
        score: result.score,
        emoji: PERSONAS[result.personaId].emoji,
        isYou: true,
      };
      withYou = [...all, youEntry];
    }
    withYou.sort((a, b) => b.score - a.score);
    const ranked = withYou.map((e, i) => ({ ...e, rank: i + 1 }));
    const top8 = ranked.slice(0, 8);
    const you = ranked.find((e) => e.isYou);
    return { top8, you };
  }

  /* ---- shared nav / footer ---- */
  function NavBar() {
    const links: [Page, string][] = [
      ["home", "HOME"],
      ["howtoplay", "HOW TO PLAY"],
      ["personas", "PERSONAS"],
      ["leaderboard", "LEADERBOARD"],
    ];
    return (
      <div className="topnav">
        <div className="topnav-inner">
          <div className="brand" onClick={() => goNav("home")}>
            <span className="brand-heart">♥</span>
            <span className="brand-name pixel">MEI MEI</span>
          </div>
          <div className="navlinks">
            {links.map(([p, l]) => (
              <a key={p} className={page === p ? "active" : ""} onClick={() => goNav(p)}>
                {l}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <button className="icon-btn" onClick={() => setMuted(!muted)} title="Mute">
              {muted ? "🔇" : "🎵"}
            </button>
            <div className="user-chip">
              <div className="user-avatar-mini" />
              <span>{name || "Guest"}</span>
              <span style={{ color: "var(--muted)", fontSize: 11 }}>▾</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Footer() {
    return (
      <footer>
        <span className="fbrand">♥ MEI MEI</span>
        CODE. PLAY. EXPRESS. — a College of Computer Studies x P-pop showcase
        <div className="flinks">
          <a onClick={() => goNav("personas")}>Personas</a>
          <a onClick={() => goNav("leaderboard")}>Leaderboard</a>
          <a onClick={() => goNav("howtoplay")}>How to Play</a>
        </div>
      </footer>
    );
  }

  /* ---- HOME ---- */
  function PageHome() {
    return (
      <div className="shell">
        <div className="home-hero">
          <div className="home-title-wrap">
            <span className="home-heart">♥</span>
            <h1 className="home-title pixel">MEI MEI</h1>
            <div className="home-sub pixel">CODE. PLAY. EXPRESS.</div>
            <p className="home-tag">
              A cyber-retro quiz experience by the College of Computer Studies that matches your IT/CS creativity
              type to your P-pop energy!
            </p>
            <div className="home-icons">
              <div className="ic">
                <span className="glyph">&lt;/&gt;</span>Answer IT/CS Questions
              </div>
              <div className="ic">
                <span className="glyph">🎵</span>Enjoy P-pop Vibes
              </div>
              <div className="ic">
                <span className="glyph">🏆</span>Win Prizes
              </div>
              <div className="ic">
                <span className="glyph">👤</span>Unlock Personas
              </div>
            </div>
            <div className="home-actions">
              <button className="btn btn-primary" onClick={() => goNav("nameentry")}>
                START QUIZ →
              </button>
              <button className="btn btn-secondary" onClick={() => goNav("howtoplay")}>
                HOW TO PLAY
              </button>
            </div>
            <div className="home-credit">
              Made by <b>CCS</b> students, for creative coders everywhere.
            </div>
          </div>
          <div className="hero-stage">
            <span className="floaty f1 star">✦</span>
            <span className="floaty f2 star s2">✦</span>
            <span className="floaty f3 star s3">✦</span>
            <div className="floaty f4">
              <div className="device" />
            </div>
            <div className="floaty" style={{ top: "34%", left: "-6%" }}>
              <div className="device" style={{ width: 56, height: 40 }} />
            </div>
            <div className="hero-platform" />
            <div className="hero-avatar-wrap">
              <Avatar persona={PERSONAS.cooldev} />
            </div>
          </div>
        </div>

        <div className={"musicbar" + (playing ? "" : " paused")}>
          <div className="track-thumb" />
          <div className="track-meta">
            <div className="track-title">Loading Screen Love</div>
            <div className="track-artist">MEI MEI</div>
          </div>
          <div className="music-controls">
            <button title="Previous">⏮</button>
            <button className="play" onClick={() => setPlaying(!playing)}>
              {playing ? "❚❚" : "▶"}
            </button>
            <button title="Next">⏭</button>
            <div className="eq">
              <span style={{ height: "40%" }} />
              <span style={{ height: "100%", animationDelay: ".15s" }} />
              <span style={{ height: "65%", animationDelay: ".3s" }} />
              <span style={{ height: "85%", animationDelay: ".45s" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- HOW TO PLAY ---- */
  function PageHowToPlay() {
    const steps: [string, string, string][] = [
      ["01", "❓", "Answer 12 IT/CS questions about how you code, design, lead, and debug."],
      ["02", "🔀", "We match your answers to a creativity pattern — logic, design, leadership, or expression."],
      ["03", "👤", "Get your MEI MEI Persona — a College of Computer Studies creative type with a P-pop twist."],
      ["04", "🏆", "Climb the leaderboard, collect badges, and show off your persona to the org."],
    ];
    return (
      <div className="shell">
        <div className="page-head">
          <div className="eyebrow">CCS × P-POP</div>
          <h2 className="page-title pixel">HOW TO PLAY</h2>
          <p className="page-sub">Four easy steps to find out which kind of creative coder you really are.</p>
        </div>
        <div className="steps-grid">
          {steps.map(([n, g, t]) => (
            <div className="panel step-card" key={n}>
              <Corners />
              <div className="step-num pixel">{n}</div>
              <div className="step-glyph">{g}</div>
              <div className="step-text">{t}</div>
            </div>
          ))}
        </div>
        <div className="panel why-box">
          <Corners />
          Why creativity for a CS quiz? Because coding <b>is</b> a creative craft — the College of Computer Studies
          believes every debugger, designer, and dev-ops kid has their own creative fingerprint. MEI MEI just gives
          it a stage name, a color palette, and a comeback single.
        </div>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <button className="btn btn-primary" onClick={() => goNav("nameentry")}>
            START QUIZ →
          </button>
        </div>
      </div>
    );
  }

  /* ---- PERSONAS ---- */
  function PagePersonas() {
    return (
      <div className="shell">
        <div className="page-head">
          <div className="eyebrow">MEET THE LINE-UP</div>
          <h2 className="page-title pixel">8 CREATIVE PERSONAS</h2>
          <p className="page-sub">Every answer style unlocks a different creative identity. Which one is you?</p>
        </div>
        <div className="personas-grid">
          {PERSONA_ORDER.map((id) => {
            const p = PERSONAS[id];
            return (
              <div className="panel persona-card" style={{ ["--persona-a" as any]: p.a }} key={id}>
                <Corners />
                <Avatar persona={p} />
                <h3 className="pixel">{p.short}</h3>
                <p>{p.tagline}</p>
                <div className="persona-mini-traits">
                  {p.traits.slice(0, 3).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <button className="btn btn-primary" onClick={() => goNav("nameentry")}>
            FIND YOUR PERSONA →
          </button>
        </div>
      </div>
    );
  }

  /* ---- NAME ENTRY ---- */
  function PageNameEntry() {
    const howit: [string, string][] = [
      ["❓", "Answer 12<br/>IT/CS Questions"],
      ["🔀", "We match your<br/>answers"],
      ["👤", "Get your MEI MEI<br/>Persona"],
      ["🏆", "Win prizes &<br/>climb the leaderboard"],
    ];
    return (
      <div className="shell">
        <div className="name-wrap">
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              GETTING STARTED
            </div>
            <div className="pixel" style={{ fontSize: 15, color: "var(--text)", marginBottom: 6 }}>
              HOW IT WORKS
            </div>
            {howit.map(([g, t], i) => (
              <div className="howit-item" key={i}>
                <div className="howit-glyph">{g}</div>
                <div className="howit-text" dangerouslySetInnerHTML={{ __html: t }} />
              </div>
            ))}
            <div className="panel vibe-panel">
              <Corners />
              <div className="vibe-title">♥ YOUR VIBE TODAY</div>
              <div className="vibe-bars">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} style={{ animationDelay: `${(i % 6) * 0.12}s`, height: `${20 + ((i * 37) % 60)}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="panel begin-card">
            <Corners />
            <div className="begin-title pixel">READY TO BEGIN?</div>
            <div className="begin-sub">Enter your name to start!</div>
            <div className="input-wrap">
              <span className="ic">👤</span>
              <input
                ref={nameInputRef}
                className="name-input"
                placeholder="Type your name..."
                maxLength={24}
                value={nameDraft}
                onChange={(e) => {
                  setNameDraft(e.target.value);
                  if (nameError) setNameError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitName();
                }}
                style={nameError ? { borderColor: "var(--pink)" } : undefined}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={submitName}>
              LET'S GO! →
            </button>
            <div className="begin-tip">♥ Tip: There are no wrong answers, just your vibe!</div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- QUIZ ---- */
  function PageQuiz() {
    const q = QUESTIONS[qIndex];
    const letters = ["A", "B", "C", "D"];
    return (
      <div className="shell">
        <div className="quiz-wrap">
          <div className="quiz-top">
            <div className="quiz-counter">
              QUESTION {qIndex + 1} OF {QUESTIONS.length}
            </div>
          </div>
          <div className="progress-track">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={"progress-seg" + (i <= qIndex ? " done" : "")} />
            ))}
          </div>
          <div className="panel q-card">
            <Corners />
            <div className="q-head">
              <div className="q-badge">❓</div>
              <div className="q-text">{q.q}</div>
            </div>
            <div className="opts">
              {q.opts.map((o, i) => (
                <div
                  key={i}
                  className={"opt" + (selected === i ? " selected" : "")}
                  onClick={() => selectOption(i)}
                >
                  <span className="opt-letter">{letters[i]}</span>
                  <span>{o.t}</span>
                  <span className="opt-check">✓</span>
                </div>
              ))}
            </div>
            <div className="q-foot">
              <button className="btn btn-ghost" onClick={() => setShowExitConfirm(true)}>
                ⇱ EXIT QUIZ
              </button>
              <button className="btn btn-primary" disabled={selected === null} onClick={nextQuestion}>
                {qIndex === QUESTIONS.length - 1 ? "SEE RESULT" : "NEXT QUESTION"} →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- RESULTS ---- */
  function PageResults() {
    if (!result) {
      goNav("home");
      return null;
    }
    const p = PERSONAS[result.personaId];
    return (
      <div className="shell">
        <div className="results-wrap">
          <div className="results-eyebrow pixel" style={{ fontSize: 12 }}>
            YOU ARE A...
          </div>
          <div className="results-title pixel" style={{ ["--persona-a" as any]: p.a, ["--persona-b" as any]: p.b }}>
            {p.name.toUpperCase()}
          </div>
          <div className="results-tagline">{p.tagline}</div>

          <div className="results-grid">
            <div className="panel avatar-box" style={{ ["--persona-a" as any]: p.a }}>
              <Corners />
              <Avatar persona={p} />
            </div>
            <div className="panel desc-box" style={{ ["--persona-a" as any]: p.a }}>
              <Corners />
              <div className="desc-text">{p.desc}</div>
              <div className="traits">
                {p.traits.map((t) => (
                  <span className="trait-chip" style={{ ["--persona-a" as any]: p.a }} key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="panel stat-box">
              <Corners />
              <div className="stat-label">SCORE</div>
              <div className="stat-value">{result.score}</div>
            </div>
            <div className="panel stat-box">
              <Corners />
              <div className="stat-label">ACCURACY</div>
              <div className="stat-value">{result.accuracy}%</div>
            </div>
          </div>

          <div className="panel share-box">
            <Corners />
            <div className="share-title">SHARE YOUR RESULT</div>
            <div className="share-row">
              <button className="share-circle" title="Download image" onClick={() => setToast("Image saved! (demo)")}>
                ⬇
              </button>
              <button className="share-circle" title="Share to X" onClick={() => setToast("Shared to X! (demo)")}>
                𝕏
              </button>
              <button className="share-circle" title="Share to Facebook" onClick={() => setToast("Shared to Facebook! (demo)")}>
                f
              </button>
              <button className="share-circle" title="Copy link" onClick={() => setToast("Link copied! (demo)")}>
                🔗
              </button>
              <button className="download-btn" onClick={() => setToast("Badge saved to your device! (demo)")}>
                ⬇ DOWNLOAD BADGE
              </button>
            </div>
          </div>

          <div className="results-actions">
            <button className="btn btn-secondary" onClick={playAgain}>
              ↻ PLAY AGAIN
            </button>
            <button className="btn btn-primary" onClick={() => goNav("leaderboard")}>
              VIEW LEADERBOARD →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- LEADERBOARD ---- */
  function PageLeaderboard() {
    const { top8, you } = buildLeaderboard();
    const youInTop = !!you && (you.rank as number) <= 8;
    const p = result ? PERSONAS[result.personaId] : null;

    return (
      <div className="shell">
        <div className="lb-wrap">
          <div>
            <div className="lb-tabs">
              <button className={"lb-tab" + (lbTab === "global" ? " active" : "")} onClick={() => setLbTab("global")}>
                GLOBAL
              </button>
              <button className={"lb-tab" + (lbTab === "friends" ? " active" : "")} onClick={() => setLbTab("friends")}>
                FRIENDS
              </button>
            </div>
            <div className="panel lb-panel">
              <Corners />
              <div className="lb-title">♥ LEADERBOARD</div>
              {lbTab === "friends" ? (
                <div style={{ textAlign: "center", color: "var(--muted)", padding: "30px 10px" }}>
                  Connect with your CCS blockmates to compare vibes here!
                </div>
              ) : (
                <>
                  {top8.map((e) => (
                    <div
                      key={e.name + e.rank}
                      className={"lb-row" + ((e.rank as number) <= 3 ? " top" : "") + (e.isYou ? " you" : "")}
                    >
                      <div className="lb-rank">{e.rank}</div>
                      <div className="lb-avatar" style={{ background: PERSONAS[e.persona].a + "22" }}>
                        {e.emoji}
                      </div>
                      <div className="lb-name">
                        {e.name}
                        <span className="sub">{PERSONAS[e.persona].short}</span>
                      </div>
                      <div className="lb-score">{e.score.toLocaleString()}</div>
                    </div>
                  ))}
                  {!youInTop && you && (
                    <>
                      <div className="lb-gap">⋯</div>
                      <div className="lb-row you">
                        <div className="lb-rank">{you.rank}</div>
                        <div className="lb-avatar" style={{ background: PERSONAS[you.persona].a + "22" }}>
                          {you.emoji}
                        </div>
                        <div className="lb-name">You ({PERSONAS[you.persona].short})</div>
                        <div className="lb-score">{you.score.toLocaleString()}</div>
                      </div>
                    </>
                  )}
                  {!you && (
                    <div style={{ textAlign: "center", color: "var(--muted)", padding: "16px 10px 4px" }}>
                      Take the quiz to join the leaderboard!
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="season-note">Season ends in: 12d 08h 45m</div>
          </div>

          <div className="panel profile-card">
            <Corners />
            <div className="profile-avatar-wrap">
              <Avatar persona={p || PERSONAS.cooldev} />
            </div>
            <div className="profile-name pixel">{name || "Guest"}</div>
            <div className="profile-persona">{p ? p.short : "No persona yet — take the quiz!"}</div>
            <div className="level-row">
              <span>LEVEL 15</span>
              <span>1200 / 2000 XP</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: "60%" }} />
            </div>
            <div className="badges-title">BADGES</div>
            <div className="badges-row">
              <div className="badge-icon">💗</div>
              <div className="badge-icon">&lt;/&gt;</div>
              <div className="badge-icon">🎵</div>
              <div className="badge-icon" style={{ color: "var(--gold)" }}>
                🏆
              </div>
              <div className="badge-icon">{p ? p.emoji : "❔"}</div>
            </div>
            <div className="ach-title">RECENT ACHIEVEMENTS</div>
            <div className="ach-item">
              <span className="dot">✓</span> Completed {result ? 1 : 0} quiz{result ? "" : "zes"}
            </div>
            <div className="ach-item">
              <span className="dot">✓</span> Scored 80% or higher
            </div>
            <div className="ach-item">
              <span className="dot">✓</span> {p ? "Unlocked " + p.short : "No persona unlocked yet"}
            </div>
            <button className="btn btn-secondary btn-block" onClick={() => goNav("personas")}>
              VIEW ALL BADGES
            </button>
          </div>
        </div>
      </div>
    );
  }

  let body = null;
  switch (page) {
    case "home": body = <PageHome />; break;
    case "howtoplay": body = <PageHowToPlay />; break;
    case "personas": body = <PagePersonas />; break;
    case "nameentry": body = <PageNameEntry />; break;
    case "quiz": body = <PageQuiz />; break;
    case "results": body = <PageResults />; break;
    case "leaderboard": body = <PageLeaderboard />; break;
    default: body = <PageHome />;
  }

  return (
    <div className="mmq">
      <style>{CSS}</style>
      <div id="mmq-app">
        <NavBar />
        <main>{body}</main>
        <Footer />
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showExitConfirm && (
        <div className="modal-overlay" onClick={() => setShowExitConfirm(false)}>
          <div className="panel modal-box" onClick={(e) => e.stopPropagation()}>
            <Corners />
            <p>Exit the quiz? Your progress on this run will be lost.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowExitConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmExit}>
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}