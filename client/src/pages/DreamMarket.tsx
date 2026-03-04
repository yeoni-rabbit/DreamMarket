import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #F7F5F0;
    --surface: rgba(255,255,255,0.72);
    --border:  rgba(255,255,255,0.90);
    --sh-sm:   0 2px 12px rgba(80,60,140,0.07), 0 1px 3px rgba(80,60,140,0.04);
    --sh-md:   0 8px 32px rgba(80,60,140,0.11), 0 2px 8px rgba(80,60,140,0.06);
    --sh-lg:   0 20px 56px rgba(80,60,140,0.15), 0 4px 16px rgba(80,60,140,0.08);
    --acc:     #6B5CE7;
    --acc-lt:  rgba(107,92,231,0.09);
    --acc-gl:  rgba(107,92,231,0.22);
    --ink:     #18151F;
    --ink2:    #4A4660;
    --ink3:    #8C88A0;
    --gold:    #C9A84C;
    --gold-lt: rgba(201,168,76,0.12);
    --ok:      #4EAF80;
    --ok-lt:   rgba(78,175,128,0.12);
    --err:     #E05C5C;
    --blur:    blur(22px) saturate(1.45);
    --r1: 12px; --r2: 18px; --r3: 24px;
    --fd: 'Playfair Display', Georgia, serif;
    --fb: 'Outfit', sans-serif;
    --ease:   cubic-bezier(0.4,0,0.2,1);
    --spring: cubic-bezier(0.34,1.56,0.64,1);

    /* Fortune colours */
    --great:      #C9921A; --great-lt:  rgba(201,146,26,0.11); --great-bd:  rgba(201,146,26,0.30);
    --good:       #4EAF80; --good-lt:   rgba(78,175,128,0.11); --good-bd:   rgba(78,175,128,0.28);
    --neutral:    #6B7FC4; --neutral-lt:rgba(107,127,196,0.10);--neutral-bd:rgba(107,127,196,0.26);
    --warn:       #D96E30; --warn-lt:   rgba(217,110,48,0.11); --warn-bd:   rgba(217,110,48,0.28);
    --dark:       #AA3A3A; --dark-lt:   rgba(170,58,58,0.11);  --dark-bd:   rgba(170,58,58,0.28);
  }

  html { font-size: 16px; }
  body { font-family: var(--fb); background: var(--bg); color: var(--ink); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  .shell {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 70% 50% at 15% -5%,  rgba(155,135,255,.15) 0%, transparent 65%),
      radial-gradient(ellipse 55% 45% at 92% 95%,  rgba(185,160,255,.10) 0%, transparent 60%),
      var(--bg);
  }

  /* NAV */
  .nav { position:fixed;top:0;left:0;right:0;z-index:300;height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(247,245,240,.82);border-bottom:1px solid rgba(255,255,255,.78);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);transition:box-shadow .3s var(--ease); }
  .nav.sc { box-shadow: var(--sh-sm); }
  .nav-brand { font-family:var(--fd);font-size:1.22rem;font-weight:700;color:var(--acc);letter-spacing:-.03em;cursor:pointer;user-select:none; }
  .nav-brand em { color:var(--ink);font-style:normal;font-weight:400; }
  .npills { display:flex;gap:3px; }
  .npill { display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:50px;border:none;font-family:var(--fb);font-size:.83rem;font-weight:500;color:var(--ink3);background:transparent;cursor:pointer;transition:all .2s var(--ease); }
  .npill:hover { color:var(--ink);background:rgba(107,92,231,.07); }
  .npill.on { color:#fff;background:var(--acc);box-shadow:0 4px 14px var(--acc-gl); }
  .wallet-chip { display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:50px;background:var(--gold-lt);border:1px solid rgba(201,168,76,.28);font-size:.80rem;font-weight:600;color:var(--gold); }

  /* PAGE */
  .page { padding:86px 28px 80px;max-width:1060px;margin:0 auto;animation:pgIn .38s var(--ease) both; }
  @keyframes pgIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none} }

  /* GLASS */
  .g   { background:var(--surface);border:1px solid var(--border);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-radius:var(--r2);box-shadow:var(--sh-sm); }
  .glg { background:var(--surface);border:1px solid var(--border);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-radius:var(--r3);box-shadow:var(--sh-lg); }

  /* TYPE */
  .disp { font-family:var(--fd);font-size:2.3rem;font-weight:500;line-height:1.15;letter-spacing:-.025em; }
  .lbl  { font-size:.69rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3); }
  .body { font-size:.89rem;line-height:1.72;color:var(--ink2); }
  .sm   { font-size:.77rem;color:var(--ink3); }

  /* BUTTONS */
  .btn  { display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 20px;border-radius:50px;border:none;font-family:var(--fb);font-size:.83rem;font-weight:500;cursor:pointer;transition:all .2s var(--ease);white-space:nowrap; }
  .bp   { background:var(--acc);color:#fff;box-shadow:0 4px 16px var(--acc-gl); }
  .bp:hover { background:#5a4cd4;transform:translateY(-1px);box-shadow:0 6px 22px var(--acc-gl); }
  .bp:active { transform:translateY(0); }
  .bp:disabled { opacity:.5;cursor:not-allowed;transform:none; }
  .bg   { background:transparent;color:var(--ink3);border:1px solid rgba(0,0,0,.09); }
  .bg:hover { background:var(--acc-lt);color:var(--acc);border-color:rgba(107,92,231,.26); }
  .bsm  { padding:6px 13px;font-size:.77rem; }
  .bico { padding:0;width:34px;height:34px;border-radius:50%;background:var(--surface);border:1px solid var(--border);box-shadow:var(--sh-sm);color:var(--ink2);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s var(--ease); }
  .bico:hover { background:var(--acc-lt);color:var(--acc); }
  .bback { display:inline-flex;align-items:center;gap:7px;padding:7px 15px;border-radius:50px;border:none;background:var(--surface);border:1px solid var(--border);box-shadow:var(--sh-sm);font-family:var(--fb);font-size:.83rem;font-weight:500;color:var(--ink2);cursor:pointer;transition:all .2s var(--ease); }
  .bback:hover { transform:translateX(-2px);box-shadow:var(--sh-md); }

  /* TAGS / RARITY / PILLS */
  .tag  { display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border-radius:50px;font-size:.69rem;font-weight:500;background:var(--acc-lt);color:var(--acc);border:1px solid rgba(107,92,231,.18); }
  .tag-x{ background:none;border:none;cursor:pointer;color:var(--acc);font-size:10px;padding:0;opacity:.5;line-height:1; }
  .tag-x:hover{opacity:1;}
  .rar  { display:inline-flex;align-items:center;padding:3px 10px;border-radius:50px;font-size:.65rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase; }
  .r-common    { background:rgba(100,120,200,.10);color:#5a6eaa;border:1px solid rgba(100,120,200,.20); }
  .r-rare      { background:rgba(60,170,130,.10); color:#2d9466;border:1px solid rgba(60,170,130,.22); }
  .r-epic      { background:rgba(130,70,200,.10); color:#7030b8;border:1px solid rgba(130,70,200,.22); }
  .r-legendary { background:var(--gold-lt);color:var(--gold);border:1px solid rgba(201,168,76,.30); }

  /* ── FORTUNE BADGES ── */
  .fb  { display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:50px;font-size:.70rem;font-weight:700;letter-spacing:.03em;border:1px solid; }
  .fb-great   { background:var(--great-lt);  color:var(--great);  border-color:var(--great-bd);  }
  .fb-good    { background:var(--good-lt);   color:var(--good);   border-color:var(--good-bd);   }
  .fb-neutral { background:var(--neutral-lt);color:var(--neutral);border-color:var(--neutral-bd);}
  .fb-warn    { background:var(--warn-lt);   color:var(--warn);   border-color:var(--warn-bd);   }
  .fb-dark    { background:var(--dark-lt);   color:var(--dark);   border-color:var(--dark-bd);   }

  /* Fortune score ring */
  .s-ring { position:relative;display:inline-flex;align-items:center;justify-content:center;flex-direction:column; }
  .s-ring svg { position:absolute;top:0;left:0; }
  .s-num  { font-family:var(--fd);font-size:2rem;font-weight:500;line-height:1; }
  .s-den  { font-size:.72rem;color:var(--ink3);margin-top:2px; }

  /* Fortune breakdown bar */
  .sb-track { height:6px;border-radius:3px;background:rgba(0,0,0,.07);overflow:hidden;flex:1; }
  .sb-fill  { height:100%;border-radius:3px;transition:width .9s var(--ease); }

  /* Fortune card tint */
  .fc-great   { border-radius:var(--r2);border:1.5px solid var(--great-bd);  background:linear-gradient(135deg,rgba(201,146,26,.07),rgba(201,146,26,.02)); }
  .fc-good    { border-radius:var(--r2);border:1.5px solid var(--good-bd);   background:linear-gradient(135deg,rgba(78,175,128,.07),rgba(78,175,128,.02)); }
  .fc-neutral { border-radius:var(--r2);border:1.5px solid var(--neutral-bd);background:linear-gradient(135deg,rgba(107,127,196,.07),rgba(107,127,196,.02)); }
  .fc-warn    { border-radius:var(--r2);border:1.5px solid var(--warn-bd);   background:linear-gradient(135deg,rgba(217,110,48,.07),rgba(217,110,48,.02)); }
  .fc-dark    { border-radius:var(--r2);border:1.5px solid var(--dark-bd);   background:linear-gradient(135deg,rgba(170,58,58,.08),rgba(170,58,58,.02)); }

  /* HOME CARD */
  .dcard { padding:20px 22px;cursor:pointer;position:relative;overflow:hidden;transition:all .24s var(--ease);border-left:3px solid transparent; }
  .dcard:hover { transform:translateY(-3px);box-shadow:var(--sh-md); }

  /* DETAIL TABS */
  .dtabs { display:flex;border-bottom:1px solid rgba(0,0,0,.07);margin-bottom:24px; }
  .dtab  { padding:11px 22px;border:none;background:transparent;font-family:var(--fb);font-size:.83rem;font-weight:500;color:var(--ink3);cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px;transition:all .2s var(--ease); }
  .dtab:hover { color:var(--ink); }
  .dtab.on { color:var(--acc);border-bottom-color:var(--acc);font-weight:600; }

  /* EMOTION BAR */
  .et { height:7px;border-radius:50px;background:rgba(0,0,0,.07);overflow:hidden; }
  .ef { height:100%;border-radius:50px;transition:width .85s var(--ease); }

  /* VIDEO PREVIEW */
  .vp { width:100%;aspect-ratio:16/9;border-radius:var(--r2);overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center; }
  .orb { width:100px;height:100px;border-radius:50%;background:radial-gradient(circle at 38% 36%,rgba(215,200,255,.95),rgba(98,62,228,.55));box-shadow:0 0 50px rgba(158,128,255,.55),0 0 100px rgba(108,74,248,.25);animation:orbf 4.5s ease-in-out infinite; }
  @keyframes orbf { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-13px) scale(1.06)} }

  /* STYLE CARD */
  .stcard { padding:15px;border-radius:var(--r1);cursor:pointer;border:1.5px solid rgba(0,0,0,.07);background:rgba(255,255,255,.45);transition:all .18s var(--ease);display:flex;flex-direction:column;align-items:center;gap:7px;text-align:center; }
  .stcard:hover { border-color:var(--acc);background:var(--acc-lt);transform:translateY(-2px); }
  .stcard.sel { border-color:var(--acc);background:var(--acc-lt);box-shadow:0 0 0 3px var(--acc-gl); }
  .stcard.rec { border-color:rgba(107,92,231,.32);background:rgba(107,92,231,.05); }
  .rec-badge { display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:50px;font-size:.61rem;font-weight:700;background:var(--acc);color:#fff;letter-spacing:.03em;text-transform:uppercase; }

  /* FRAG / AI-SUGGEST */
  .fchip { display:inline-flex;flex-direction:column;padding:9px 14px;border-radius:14px;border:1px solid rgba(0,0,0,.08);background:rgba(255,255,255,.55); }
  .aisug { padding:13px 15px;border-radius:14px;cursor:pointer;border:1.5px solid rgba(107,92,231,.13);background:rgba(107,92,231,.03);transition:all .18s var(--ease); }
  .aisug:hover { border-color:var(--acc);background:var(--acc-lt);transform:translateY(-1px); }
  .aisug.on { border-color:var(--acc);background:rgba(107,92,231,.11); }
  .myst { display:inline-flex;align-items:center;padding:1px 9px;border-radius:6px;margin:0 2px;background:rgba(107,92,231,.12);border:1.5px dashed rgba(107,92,231,.45);color:var(--acc);font-size:.80rem;font-weight:600;cursor:pointer;transition:background .15s; }
  .myst:hover { background:rgba(107,92,231,.22); }

  /* SYMBOL ROW */
  .sym-row { display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-bottom:1px solid rgba(0,0,0,.05); }
  .sym-row:last-child { border-bottom:none; }

  /* VIDEO PROMPT */
  .prompt-box { padding:16px;border-radius:var(--r1);background:rgba(18,14,32,.90);border:1px solid rgba(107,92,231,.35);font-family:monospace;font-size:.75rem;line-height:1.85;color:rgba(200,190,255,.8); }
  .pk  { color:#B8D4FF; }
  .pv  { color:#C8F0A0; }

  /* MODAL */
  .ovl  { position:fixed;inset:0;z-index:400;background:rgba(16,12,30,.50);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:24px;animation:fi .2s var(--ease) both; }
  .mbox { width:100%;max-width:490px;padding:28px;animation:pi .26s var(--spring) both; }
  @keyframes fi { from{opacity:0}to{opacity:1} }
  @keyframes pi { from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)} }

  /* MISC */
  .div { height:1px;background:rgba(0,0,0,.06);margin:18px 0; }
  .rec-dot { display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--err);animation:blink 1s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:.25} }
  .pulse { animation:pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
  .stag>*{ animation:pgIn .35s var(--ease) both; }
  .stag>*:nth-child(1){animation-delay:.04s}.stag>*:nth-child(2){animation-delay:.09s}
  .stag>*:nth-child(3){animation-delay:.14s}.stag>*:nth-child(4){animation-delay:.19s}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(107,92,231,.18);border-radius:2px}
  .g2 { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
  .g3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px; }
  .field { display:flex;flex-direction:column;gap:6px; }
  .flbl  { font-size:.75rem;font-weight:500;color:var(--ink3);letter-spacing:.03em; }
  .inp,.txta,.fsel { padding:10px 14px;border-radius:var(--r1);border:1px solid rgba(0,0,0,.09);background:rgba(255,255,255,.65);font-family:var(--fb);font-size:.87rem;color:var(--ink);outline:none;transition:all .2s; }
  .inp:focus,.txta:focus,.fsel:focus { border-color:var(--acc);box-shadow:0 0 0 3px rgba(107,92,231,.10);background:#fff; }
  .txta { resize:vertical;min-height:130px;line-height:1.75; }
  .fsel { appearance:none;cursor:pointer; }
  @media(max-width:700px){ .g2,.g3{grid-template-columns:1fr!important} .disp{font-size:1.8rem} .page{padding:78px 16px 60px} .nav{padding:0 16px} .npill span{display:none} }

  /* ── Trading System ── */
  @keyframes timerPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.97)} }
  .timer-urgent { animation: timerPulse 1s ease-in-out infinite; color: var(--err) !important; }
  @keyframes snipeFlash { 0%{background:rgba(107,92,231,.3)}100%{background:transparent} }
  .snipe-flash { animation: snipeFlash .6s ease-out; }
  .bid-row-top { background: rgba(107,92,231,.06); border: 1px solid rgba(107,92,231,.15); }
  .bid-row     { background: rgba(0,0,0,.025);      border: 1px solid rgba(0,0,0,.06); }
  .type-fixed   { background:rgba(78,175,128,.10);  color:var(--ok);  border-color:rgba(78,175,128,.3); }
  .type-offer   { background:rgba(107,92,231,.09);  color:var(--acc); border-color:rgba(107,92,231,.22); }
  .type-auction { background:rgba(224,92,92,.09);   color:var(--err); border-color:rgba(224,92,92,.22); }
  .sold-overlay { position:absolute;inset:0;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center; }
  .offer-pending  { background:rgba(201,168,76,.10);  border:1px solid rgba(201,168,76,.28); }
  .offer-counter  { background:rgba(107,92,231,.08);  border:1px solid rgba(107,92,231,.2); }
  .offer-accepted { background:rgba(78,175,128,.10);  border:1px solid rgba(78,175,128,.28); }
  .offer-declined { background:rgba(224,92,92,.08);   border:1px solid rgba(224,92,92,.2); }
  .quick-bid-btn { padding:5px 11px;border-radius:50px;border:1px solid rgba(107,92,231,.22);background:var(--acc-lt);color:var(--acc);font-size:.70rem;font-weight:600;cursor:pointer;transition:all .15s; }
  .quick-bid-btn:hover { background:var(--acc); color:#fff; }
  .buyout-btn { background:var(--gold-lt);color:var(--gold);border:1px solid rgba(201,168,76,.3);font-weight:700; }
  .buyout-btn:hover { background:var(--gold); color:#fff; }
  .listing-detail-scroll { max-height:90vh;overflow-y:auto;scroll-behavior:smooth; }
  .listing-detail-scroll::-webkit-scrollbar { width:3px; }
  .listing-detail-scroll::-webkit-scrollbar-thumb { background:rgba(107,92,231,.2);border-radius:2px; }
`;

/* ─────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────── */
const ic = {
  home:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  library: (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  wall:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  plus:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search:  (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  sparkle: (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 17l.75 2.25L22 20l-2.25.75L19 23l-.75-2.25L16 20l2.25-.75z"/></svg>,
  back:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  x:       (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  edit:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  mic:     (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  undo:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
  wave:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M2 12 Q 4 6, 6 12 Q 8 18, 10 12 Q 12 6, 14 12 Q 16 18, 18 12 Q 20 6, 22 12"/></svg>,
  coins:   (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/></svg>,
  heart:   (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  play:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  download:(s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  share:   (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  film:    (s,c)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
};
const I = ({ n, s=16, c="currentColor" }) => ic[n]?.(s,c) ?? null;

/* ═══════════════════════════════════════════════════════
   ███████╗ ██████╗ ██████╗ ████████╗██╗   ██╗███╗   ██╗███████╗
   ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║   ██║████╗  ██║██╔════╝
   █████╗  ██║   ██║██████╔╝   ██║   ██║   ██║██╔██╗ ██║█████╗
   ██╔══╝  ██║   ██║██╔══██╗   ██║   ██║   ██║██║╚██╗██║██╔══╝
   ██║     ╚██████╔╝██║  ██║   ██║   ╚██████╔╝██║ ╚████║███████╗
   DREAM FORTUNE SYSTEM — CORE ENGINE
══════════════════════════════════════════════════════ */

// ── Symbol Database ──────────────────────────────────
const SYMBOL_DB = {
  "돼지":   { base: 80, cat:"재물", en:"pig",          tags:["wealth","luck"],         mood:["golden light","abundance"] },
  "똥":     { base: 75, cat:"재물", en:"fortune",      tags:["wealth","abundance"],    mood:["earthy gold","rich tones"] },
  "용":     { base: 90, cat:"성공", en:"dragon",       tags:["power","success"],       mood:["majestic","celestial","flying"] },
  "호랑이": { base: 65, cat:"성공", en:"tiger",        tags:["power","courage"],       mood:["fierce","amber light","forest"] },
  "계단":   { base: 60, cat:"성장", en:"staircase",    tags:["growth","progress"],     mood:["ascending","architectural light"] },
  "물":     { base: 50, cat:"변화", en:"water",        tags:["change","flow"],         mood:["flowing water","reflective","calm"] },
  "불":     { base: 55, cat:"변화", en:"fire",         tags:["passion","change"],      mood:["flames","dramatic","orange glow"] },
  "달":     { base: 45, cat:"감성", en:"moon",         tags:["emotion","mystery"],     mood:["moonlight","ethereal","silver"] },
  "꽃":     { base: 55, cat:"아름다움", en:"flowers",  tags:["beauty","new start"],    mood:["blooming","pastel","soft light"] },
  "도서관": { base: 45, cat:"지식", en:"library",      tags:["knowledge","mystery"],   mood:["old books","warm light","floating pages"] },
  "책":     { base: 40, cat:"지식", en:"books",        tags:["knowledge","wisdom"],    mood:["open book","light rays"] },
  "집":     { base: 50, cat:"안정", en:"house",        tags:["stability","home"],      mood:["warm interior","amber","cozy"] },
  "별":     { base: 55, cat:"희망", en:"stars",        tags:["hope","guidance"],       mood:["starfield","cosmic","deep blue"] },
  "문":     { base: 60, cat:"기회", en:"door",         tags:["opportunity","start"],   mood:["mysterious door","opening light"] },
  "이빠짐": { base:-40, cat:"불안", en:"missing tooth",tags:["anxiety","loss"],        mood:["cold light","fragmented","unease"] },
  "추락":   { base:-55, cat:"위험", en:"falling",      tags:["control loss","fear"],   mood:["falling","vertigo","dark abyss"] },
  "뱀":     { base:-20, cat:"경고", en:"snake",        tags:["warning","betrayal"],    mood:["serpentine","tension","shadow"] },
};

// ── Context Modifiers ─────────────────────────────────
const CTX_PATTERNS = [
  { re:/잡[았]/,        mod:+25, label:"획득",    desc:"잡음 → 기회 실현" },
  { re:/올라[갔가]/,    mod:+20, label:"상승",    desc:"상승 → 성장 신호" },
  { re:/열[었]/,        mod:+20, label:"열림",    desc:"열림 → 새로운 기회" },
  { re:/맑[은]/,        mod:+20, label:"맑음",    desc:"맑음 → 긍정 변화" },
  { re:/빛나[는]/,      mod:+15, label:"빛남",    desc:"빛남 → 희망" },
  { re:/웃[었음]/,      mod:+15, label:"기쁨",    desc:"웃음 → 긍정 감정" },
  { re:/놓[쳤]/,        mod:-25, label:"상실",    desc:"놓침 → 기회 상실" },
  { re:/탁[한]/,        mod:-20, label:"탁함",    desc:"탁함 → 문제 암시" },
  { re:/길을 잃/,       mod:-25, label:"길 잃음", desc:"방향 상실" },
  { re:/쫓[기겼]/,      mod:-20, label:"추격",    desc:"추격당함 → 압박" },
  { re:/울[었]/,        mod:-15, label:"슬픔",    desc:"울음 → 슬픔 신호" },
  { re:/끝이 없[었는]/, mod:-15, label:"끝없음",  desc:"미완의 불안" },
];

// ── Emotion → Fortune Score ───────────────────────────
const EMO_SCORE = {
  "기쁨":85, "행복":85, "설렘":80, "안정":65, "평온":60,
  "경이":55, "호기심":50, "그리움":35, "슬픔":25,
  "불안":15, "공포":10, "분노":10,
};

// ── Outcome Patterns ──────────────────────────────────
const OUTCOME_PATTERNS = [
  { re:/문(을|이)\s*(열|통과)/,  score:85, label:"문이 열림",  desc:"새로운 시작과 기회" },
  { re:/정상(에|을)\s*올라/,     score:90, label:"정상 등극", desc:"목표 달성" },
  { re:/빛(이|을)\s*보[았]/,     score:80, label:"빛을 봄",   desc:"희망과 방향성" },
  { re:/찾[았]\s*다/,            score:75, label:"발견",       desc:"해답을 얻음" },
  { re:/길을 잃[었]/,            score:20, label:"길 잃음",   desc:"방향 상실과 혼란" },
  { re:/추락(했|하)/,            score:10, label:"추락",       desc:"통제 상실 경고" },
  { re:/끝이\s*없[었는]/,        score:30, label:"끝없음",    desc:"목표 미달성 불안" },
];

// ── Fortune Grades ────────────────────────────────────
const GRADES = [
  { min:80, id:"great",   label:"Great Fortune", ko:"대길", icon:"🌟" },
  { min:60, id:"good",    label:"Good Fortune",  ko:"길몽", icon:"✨" },
  { min:40, id:"neutral", label:"Neutral Dream", ko:"평몽", icon:"🌙" },
  { min:20, id:"warn",    label:"Warning Dream", ko:"흉조", icon:"⚠️" },
  { min:0,  id:"dark",    label:"Dark Omen",     ko:"흉몽", icon:"🌑" },
];
const getGrade = (score) => GRADES.find(g => score >= g.min) ?? GRADES[4];

// ── Video palette per fortune ─────────────────────────
const VID_PALETTE = {
  great:   { tone:"golden warm",      light:"bright volumetric light",  camera:"slow cinematic drift, shallow DOF" },
  good:    { tone:"warm ethereal",    light:"gentle diffused glow",     camera:"smooth floating movement" },
  neutral: { tone:"cool silver blue", light:"moonlight ambient",        camera:"meditative slow push" },
  warn:    { tone:"amber tension",    light:"harsh sidelight",          camera:"handheld urgency" },
  dark:    { tone:"cold desaturated", light:"harsh underlighting",      camera:"tense handheld, quick cuts" },
};

// ── MAIN ANALYSIS FUNCTION ────────────────────────────
function runFortune(dream) {
  const text = dream.mode === "fragment"
    ? dream.fragments.map(f => f.word + " " + f.desc).join(" ")
    : dream.content;

  // 1. Symbol extraction
  const symbols = [];
  for (const [name, data] of Object.entries(SYMBOL_DB)) {
    if (text.includes(name)) symbols.push({ name, ...data, score: data.base });
  }
  if (symbols.length === 0) symbols.push({ name:"미상", cat:"기타", en:"abstract", base:50, score:50, mood:["abstract","soft focus"] });

  // 2. Context modifiers
  const ctxHits = [];
  for (const cp of CTX_PATTERNS) {
    if (cp.re.test(text)) {
      ctxHits.push(cp);
      symbols.forEach(s => { s.score = Math.min(100, Math.max(-100, s.score + cp.mod)); });
    }
  }
  const symAvg = symbols.reduce((s, x) => s + x.score, 0) / symbols.length;
  const symNorm = Math.round((symAvg + 100) / 2);
  const ctxBonus = ctxHits.length
    ? Math.round(ctxHits.reduce((s,c) => s + (c.mod>0?Math.min(c.mod,30):Math.max(c.mod,-30)),0)/ctxHits.length + 50)
    : 50;

  // 3. Emotion
  const emos = dream.analysis?.emotions ?? [];
  let emoScore = 50;
  if (emos.length) {
    const wsum = emos.reduce((s,e)=>s+e.score,0);
    emoScore = Math.round(emos.reduce((s,e)=>s+(EMO_SCORE[e.label]??50)*e.score,0)/wsum);
  }

  // 4. Outcome
  let outScore=50, outLabel="결말 불명확", outDesc="꿈의 결말이 명확하지 않습니다";
  for (const op of OUTCOME_PATTERNS) {
    if (op.re.test(text)) { outScore=op.score; outLabel=op.label; outDesc=op.desc; break; }
  }

  // 5. Weighted final score
  const score = Math.min(100, Math.max(0, Math.round(
    symNorm * 0.35 + ctxBonus * 0.20 + emoScore * 0.25 + outScore * 0.20
  )));
  const grade = getGrade(score);
  const pal = VID_PALETTE[grade.id];

  // 6. Video prompt
  const symbolMoods = [...new Set(symbols.flatMap(s => s.mood))].slice(0,4);
  const emoMoods = emos.slice(0,2).map(e =>
    ({불안:"unease",경이:"awe",그리움:"nostalgia",평온:"serenity",기쁨:"euphoria"}[e.label] ?? "mystery")
  );
  const videoPrompt = {
    scene:   symbols.slice(0,2).map(s=>s.en).join(" and "),
    mood:    symbolMoods.join(", "),
    emotion: emoMoods.join(", ") || "mystery",
    lighting:pal.light,
    tone:    pal.tone,
    camera:  pal.camera,
    full:    `cinematic ${symbols.slice(0,2).map(s=>s.en).join(" and ")}, ${symbolMoods.slice(0,3).join(", ")}, ${pal.tone} color palette, ${pal.light}, ${pal.camera}, ultra-detailed, dreamlike atmosphere`,
  };

  // 7. Price suggestion
  const price =
    grade.id==="great"  ? {min:600, max:2000, reason:"대길몽 — 최고 거래 가치"} :
    grade.id==="good"   ? {min:200, max:800,  reason:"길몽 — 높은 거래 가치"} :
    grade.id==="neutral"? {min:80,  max:300,  reason:"평몽 — 중간 가치"} :
    grade.id==="warn"   ? {min:30,  max:150,  reason:"흉조 — 흉몽 판매 가능"} :
                          {min:10,  max:100,  reason:"흉몽 — 흉몽 특가 판매"};

  const interp = `이 꿈은 ${grade.ko}(${grade.label})으로 분류됩니다. `
    + (symbols[0].name!=="미상" ? `${symbols[0].name}(${symbols[0].cat}) 상징이 감지되었습니다. ` : "")
    + (ctxHits.length ? ctxHits[0].desc + "의 맥락이 반영되었습니다. " : "")
    + `결말은 '${outLabel}'(${outDesc})입니다.`;

  return {
    score, grade,
    breakdown:{
      symbol:  {score:symNorm,  label:"Symbol",  color:"#9B7EFF"},
      context: {score:ctxBonus, label:"Context", color:"#6FC3DF"},
      emotion: {score:emoScore, label:"Emotion", color:"#F4A9C2"},
      outcome: {score:outScore, label:"Outcome", color:"#8BD4B0"},
    },
    symbols, ctxHits, outLabel, outDesc, videoPrompt, price, interp,
  };
}

/* ─────────────────────────────────────────────────────
   SHARED MINI COMPONENTS
───────────────────────────────────────────────────── */
function FortuneBadge({ fortune, lg }) {
  if (!fortune) return null;
  const g = fortune.grade;
  return (
    <span className={`fb fb-${g.id}`} style={lg ? {fontSize:".82rem",padding:"6px 14px"} : {}}>
      {g.icon} {g.label}
    </span>
  );
}

function ScoreRing({ score, grade, size=90 }) {
  const r=36, circ=2*Math.PI*r, dash=(score/100)*circ;
  const col = `var(--${grade.id})`;
  return (
    <div className="s-ring" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(0,0,0,.07)" strokeWidth="6"/>
        <circle cx="44" cy="44" r={r} fill="none" stroke={col} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round"
          style={{transition:"stroke-dasharray 1s var(--ease)"}}/>
      </svg>
      <div className="s-num" style={{color:col}}>{score}</div>
      <div className="s-den">/ 100</div>
    </div>
  );
}

function EmoBar({label,score,color}) {
  return (
    <div style={{marginBottom:11}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:".82rem",fontWeight:500}}>{label}</span>
        <span className="sm">{score}%</span>
      </div>
      <div className="et"><div className="ef" style={{width:`${score}%`,background:color}}/></div>
    </div>
  );
}

function TagInput({ tags, onChange }) {
  const [v,setV] = useState("");
  const add = () => { const t=v.trim(); if(t&&!tags.includes(t)) onChange([...tags,t]); setV(""); };
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",padding:"8px 12px",background:"rgba(255,255,255,.65)",borderRadius:"var(--r1)",border:"1px solid rgba(0,0,0,.09)"}}>
      {tags.map(t=><span key={t} className="tag">{t}<button className="tag-x" onClick={()=>onChange(tags.filter(x=>x!==t))}>{ic.x(9)}</button></span>)}
      <input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}}
        placeholder="태그 입력 후 Enter" style={{border:"none",background:"transparent",outline:"none",fontSize:".83rem",minWidth:100,flex:1}}/>
      <button className="btn bg bsm" style={{padding:"4px 10px"}} onClick={add}>+</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MOCK DATA  (fortune pre-computed)
───────────────────────────────────────────────────── */
const DREAMS_INIT = (() => {
  const raw = [
    {
      id:"d1", title:"수중 도서관", mode:"narrative",
      content:"거대한 수중 도서관에 있었다. 책들이 물결 따라 흐르고 있었고, 나는 [?] 찾으려 했지만 도무지 기억나지 않았다. 출구는 끝이 없었다.",
      fragments:[], tags:["물","도서관","미로"], date:"2025-01-03",
      rarity:"rare", status:"Completed", verified:true, forSale:true, price:240,
      analyzed:true, video:null,
      analysis:{
        summary:"이 꿈은 통제 불가능한 무의식의 탐색과 관련 있습니다. 수중 공간은 자아의 심층을 상징하며 흐르는 책들은 기억과 정체성의 유동성을 나타냅니다.",
        emotions:[{label:"불안",score:72,color:"#9B7EFF"},{label:"경이",score:58,color:"#6FC3DF"},{label:"그리움",score:40,color:"#F4A9C2"}],
        keywords:["수중 공간","도서관","책","물결","출구"],
        symbols:[{sym:"물 / 수중 공간",type:"융",interp:"무의식의 심층. 감정과 자아 탐색의 공간."},{sym:"도서관 / 책",type:"프로이트",interp:"억압된 기억 또는 답을 찾으려는 욕망."}],
        questions:["최근 해야 하는데 못 하고 있는 일이 있나요?","출구가 없는 공간 — 일상에서 언제 그런 느낌을 받나요?"],
      },
    },
    {
      id:"d2", title:"붉은 달의 정원", mode:"narrative",
      content:"붉은 달이 뜬 정원에서 어머니와 함께 꽃을 심었다. 꽃들은 심을수록 사라졌고, 어머니는 미소 지으며 웃었다.",
      fragments:[], tags:["달","가족","정원"], date:"2025-01-05",
      rarity:"epic", status:"Polished", verified:true, forSale:true, price:560,
      analyzed:true, video:null,
      analysis:{
        summary:"이 꿈은 상실과 수용이라는 주제를 탐구합니다. 붉은 달은 감정적 격렬함을 의미하며 사라지는 꽃들은 지킬 수 없는 것에 대한 슬픔을 반영합니다.",
        emotions:[{label:"그리움",score:88,color:"#F4A9C2"},{label:"불안",score:52,color:"#9B7EFF"},{label:"평온",score:45,color:"#8BD4B0"}],
        keywords:["붉은 달","정원","꽃","어머니","사라짐"],
        symbols:[{sym:"붉은 달",type:"융",interp:"강렬한 감정적 에너지, 아니마의 상징."},{sym:"꽃이 사라짐",type:"공통",interp:"통제할 수 없는 상실의 표현."}],
        questions:["어머니와의 관계에서 아직 하지 못한 말이 있나요?","사라지는 것들에 대한 집착이 현재에도 나타나나요?"],
      },
    },
    {
      id:"d3", title:"파편 — 계단 끝", mode:"fragment",
      content:"",
      fragments:[{word:"흰 계단",desc:"끝없이 이어지는 대리석 계단"},{word:"낯선 목소리",desc:"이름을 부르는 소리"},{word:"빛",desc:"아래서 올라오는 강한 빛"}],
      tags:["계단","목소리"], date:"2025-01-07",
      rarity:"common", status:"Draft", verified:false, forSale:false, price:0,
      analyzed:false, video:null, analysis:null,
    },
    {
      id:"d4", title:"돼지를 잡았다", mode:"narrative",
      content:"커다란 황금빛 돼지를 잡았다. 잡는 순간 빛이 났고 집으로 돌아오는 길에 문을 열었다.",
      fragments:[], tags:["돼지","황금","집"], date:"2025-01-08",
      rarity:"legendary", status:"Polished", verified:true, forSale:true, price:0,
      analyzed:true, video:null,
      analysis:{
        summary:"재물과 행운을 상징하는 강력한 길몽입니다. 황금 돼지를 잡는 행위는 재물 획득의 직접적 예시입니다.",
        emotions:[{label:"기쁨",score:92,color:"#FFD700"},{label:"설렘",score:78,color:"#FFB347"},{label:"안정",score:60,color:"#8BD4B0"}],
        keywords:["돼지","황금빛","집","문"],
        symbols:[{sym:"황금 돼지",type:"한국 전통",interp:"재물과 복록의 직접적 상징."},{sym:"빛나는 문",type:"공통",interp:"새로운 기회의 문이 열림."}],
        questions:["최근 재물이나 사업과 관련된 기회가 있었나요?"],
      },
    },
  ];
  return raw.map(d => ({ ...d, fortune: runFortune(d) }));
})();

const WALL_ITEMS = [
  {id:"w1",author:"starweaver_92",title:"유리 도시의 소년",preview:"도시 전체가 유리로 되어 있고 발걸음마다 균열이 생겼다. 나는 멈출 수 없었다...",likes:142,comments:28,rarity:"legendary",price:1200,tags:["도시","유리"],hasVideo:true,fortuneId:"great"},
  {id:"w2",author:"void_dreamer", title:"역방향 시간",     preview:"시계가 거꾸로 돌고 사람들이 뒷걸음질쳤다. 나만 앞으로 걸을 수 있었다.",   likes:87, comments:14,rarity:"epic",    price:480, tags:["시간","역행"],      hasVideo:false,fortuneId:"neutral"},
  {id:"w3",author:"moonthread",   title:"고양이 언어",     preview:"고양이가 내게 인간의 언어로 말을 걸었다. '너는 매일 꿈에서만 깨어있다'고.",likes:203,comments:41,rarity:"rare",    price:320, tags:["고양이","언어"],    hasVideo:true, fortuneId:"good"},
];

const AI_FILLERS = [
  "갑자기 모든 책이 불꽃으로 변해버렸다",
  "읽어야 할 페이지 번호를 — 숫자가 계속 바뀌고 있었다",
  "그 도서관의 사서, 어딘가에서 본 듯한 낯선 누군가를",
];

const ALL_STYLES = [
  {id:"dreamy",  icon:"🌙",name:"몽환",    desc:"부드러운 안개, 파스텔",    for:["neutral","good"]},
  {id:"surreal", icon:"🌀",name:"초현실",  desc:"왜곡된 공간, 달리 스타일", for:["warn","neutral"]},
  {id:"warm",    icon:"🌅",name:"따뜻함",  desc:"황금빛 노스탤지어",         for:["great","good"]},
  {id:"ethereal",icon:"✨",name:"에테리얼",desc:"빛과 안개의 몽환 공간",     for:["great","good","neutral"]},
  {id:"dark",    icon:"🕸️",name:"다크",    desc:"어둠, 날카로운 대비",       for:["dark","warn"]},
  {id:"cosmic",  icon:"🪐",name:"코스믹",  desc:"우주, 무한한 공간감",       for:["great","neutral"]},
];

function getRecommendedStyles(fortune) {
  if (!fortune) return ALL_STYLES.slice(0,4);
  const gid = fortune.grade.id;
  return [...ALL_STYLES]
    .map(s=>({...s, rank: s.for[0]===gid?2 : s.for.includes(gid)?1 : 0}))
    .sort((a,b)=>b.rank-a.rank)
    .slice(0,4);
}

/* ═══════════════════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════════════════ */
function HomeView({ dreams, onCard, onNew }) {
  const [q,setQ] = useState("");
  const list = dreams.filter(d=>d.title.includes(q)||d.tags.some(t=>t.includes(q)));

  return (
    <div className="page">
      <div style={{marginBottom:36}}>
        <p className="lbl" style={{marginBottom:10}}>Dream Market</p>
        <h1 className="disp">
          당신의 꿈은<br/>
          <em style={{color:"var(--acc)",fontStyle:"italic"}}>어떤 운세인가요?</em>
        </h1>
        <p className="sm" style={{marginTop:12,fontSize:".87rem"}}>한국 전통 꿈 해석과 AI 분석이 만나는 드림 마켓</p>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:26,flexWrap:"wrap"}}>
        <button className="btn bp" onClick={onNew}><I n="plus" s={14}/> 새 꿈 기록</button>
        <div style={{flex:1,minWidth:200,position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><I n="search" s={14} c="var(--ink3)"/></span>
          <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="제목, 태그 검색…" style={{paddingLeft:36,width:"100%",background:"rgba(255,255,255,.7)"}}/>
        </div>
      </div>

      {/* Fortune stats */}
      <div className="g3" style={{marginBottom:26}}>
        {[
          {l:"길몽 (대길+길)",v:dreams.filter(d=>d.fortune&&["great","good"].includes(d.fortune.grade.id)).length},
          {l:"평몽",           v:dreams.filter(d=>d.fortune&&d.fortune.grade.id==="neutral").length},
          {l:"흉몽/흉조",      v:dreams.filter(d=>d.fortune&&["warn","dark"].includes(d.fortune.grade.id)).length},
        ].map(s=>(
          <div key={s.l} className="g" style={{padding:"16px 20px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--fd)",fontSize:"2rem",fontWeight:400,color:"var(--acc)",lineHeight:1}}>{s.v}</div>
            <div className="lbl" style={{marginTop:5}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Dream list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}} className="stag">
        {list.length===0 && (
          <div className="g" style={{padding:52,textAlign:"center"}}>
            <div style={{fontSize:42,marginBottom:12}}>🌙</div>
            <p style={{fontFamily:"var(--fd)",fontSize:"1.1rem",color:"var(--ink3)"}}>기록된 꿈이 없어요</p>
          </div>
        )}
        {list.map(dream => {
          const f=dream.fortune;
          const gid=f?.grade.id;
          return (
            <div key={dream.id} className="g dcard" onClick={()=>onCard(dream.id)}
              style={{borderLeftColor: gid ? `var(--${gid})` : "transparent"}}>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"var(--fd)",fontSize:"1.08rem",fontWeight:500}}>{dream.title}</span>
                  {dream.verified && <span style={{color:"var(--gold)",fontSize:11}}>✦</span>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,marginLeft:8}}>
                  {f && <FortuneBadge fortune={f}/>}
                  <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
                  <span className="sm">{dream.date}</span>
                </div>
              </div>

              <p className="sm" style={{marginBottom:f?10:12,lineHeight:1.65,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                {dream.mode==="fragment" ? dream.fragments.map(fr=>fr.word).join(" · ") : dream.content.replace(/\[\?\]/g,"…")}
              </p>

              {/* Fortune mini bar */}
              {f && (
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 12px",borderRadius:10,background:`var(--${gid}-lt)`,border:`1px solid var(--${gid}-bd)`}}>
                  <span style={{fontFamily:"var(--fd)",fontSize:"1.4rem",fontWeight:400,color:`var(--${gid})`,lineHeight:1}}>{f.score}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:".72rem",fontWeight:700,color:`var(--${gid})`}}>{f.grade.ko} — {f.grade.label}</div>
                    <div className="sm" style={{fontSize:".68rem",marginTop:1}}>{f.interp.slice(0,52)}…</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:".65rem",color:"var(--gold)",fontWeight:600}}>추천가</div>
                    <div style={{fontSize:".75rem",fontWeight:700,color:"var(--gold)"}}>{f.price.min}–{f.price.max}D</div>
                  </div>
                </div>
              )}

              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                {dream.tags.map(t=><span key={t} className="tag">{t}</span>)}
                <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  {dream.analyzed && <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:50,fontSize:".69rem",fontWeight:600,background:"var(--ok-lt)",color:"var(--ok)"}}>분석 ✓</span>}
                  {dream.video   && <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:50,fontSize:".69rem",fontWeight:600,background:"var(--acc-lt)",color:"var(--acc)"}}><I n="film" s={9} c="var(--acc)"/> 영상</span>}
                  {dream.forSale && <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:50,fontSize:".69rem",fontWeight:600,background:"var(--gold-lt)",color:"var(--gold)"}}>{dream.price}D</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ANALYSIS SECTION  — Dream Detail tab 1
═══════════════════════════════════════════════════════ */
function AnalysisSection({ dream, onSaveAnalysis }) {
  const [loading,setLoading] = useState(false);
  const [ana,setAna]         = useState(dream.analysis);
  const [fort,setFort]       = useState(dream.fortune);
  useEffect(()=>{setAna(dream.analysis);setFort(dream.fortune);},[dream.id]);

  const generate = () => {
    setLoading(true);
    setTimeout(()=>{
      const result = {
        summary:"AI가 이 꿈을 분석했습니다. 무의식 속 탐색과 통제 불가능한 흐름이 핵심 주제입니다.",
        emotions:[{label:"불안",score:68,color:"#9B7EFF"},{label:"경이",score:54,color:"#6FC3DF"},{label:"그리움",score:38,color:"#F4A9C2"}],
        keywords:dream.mode==="fragment" ? dream.fragments.map(f=>f.word) : ["장면","감정","인물","공간"],
        symbols:[{sym:"핵심 상징",type:"융",interp:"꿈의 원형적 의미."},{sym:"보조 상징",type:"공통",interp:"보편적 패턴."}],
        questions:["이 꿈에서 가장 인상 깊었던 장면은?","꿈 속 감정과 현재 일상이 닮아 있나요?"],
      };
      const updatedDream = {...dream, analysis:result};
      const newFort = runFortune(updatedDream);
      setAna(result); setFort(newFort);
      onSaveAnalysis(dream.id, result, newFort);
      setLoading(false);
    },2600);
  };

  if (!ana) return (
    <div className="g" style={{padding:60,textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:16}}>✨</div>
      <p style={{fontFamily:"var(--fd)",fontSize:"1.25rem",marginBottom:8}}>분석을 시작하세요</p>
      <p className="sm" style={{marginBottom:24}}>AI가 감정·상징·운세를 분석하고<br/>Dream Fortune Score를 자동 계산합니다</p>
      <button className={`btn bp ${loading?"pulse":""}`} onClick={generate} disabled={loading}>
        <I n="sparkle" s={14}/>{loading?"분석 생성 중…":"Dream Fortune 분석 생성"}
      </button>
    </div>
  );

  return (
    <div className="stag" style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* ── FORTUNE CARD ── */}
      {fort && (
        <div className={`fc-${fort.grade.id}`} style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
            <div style={{flex:1,minWidth:200}}>
              <p className="lbl" style={{marginBottom:10}}>Dream Fortune</p>
              <FortuneBadge fortune={fort} lg/>
              <p className="body" style={{marginTop:12,lineHeight:1.75}}>{fort.interp}</p>
              <div style={{marginTop:14,padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.45)",fontSize:".80rem",color:"var(--ink2)"}}>
                <span style={{fontWeight:600}}>💰 추천 거래가: </span>
                <span style={{color:"var(--gold)",fontWeight:700}}>{fort.price.min}–{fort.price.max}D</span>
                <span className="sm" style={{marginLeft:6}}>({fort.price.reason})</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <ScoreRing score={fort.score} grade={fort.grade}/>
              <button className={`btn bg bsm ${loading?"pulse":""}`} onClick={generate} disabled={loading}>
                <I n="sparkle" s={12}/>{loading?"재분석…":"갱신"}
              </button>
            </div>
          </div>

          {/* Score Breakdown */}
          <div style={{marginTop:18}}>
            <p className="lbl" style={{marginBottom:10}}>Score Breakdown</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {Object.values(fort.breakdown).map(b=>(
                <div key={b.label} style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:".75rem",fontWeight:500,minWidth:58,color:"var(--ink2)"}}>{b.label}</span>
                  <div className="sb-track"><div className="sb-fill" style={{width:`${b.score}%`,background:b.color}}/></div>
                  <span style={{fontSize:".75rem",fontWeight:600,minWidth:26,textAlign:"right",color:"var(--ink2)"}}>{b.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detected symbols */}
          {fort.symbols[0].name !== "미상" && (
            <div style={{marginTop:14}}>
              <p className="lbl" style={{marginBottom:8}}>감지된 상징</p>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {fort.symbols.map(s=>(
                  <div key={s.name} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:50,fontSize:".72rem",fontWeight:500,background:"rgba(255,255,255,.55)",border:"1px solid rgba(0,0,0,.10)"}}>
                    {s.name} <span className="sm">· {s.cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Context hits */}
          {fort.ctxHits.length>0 && (
            <div style={{marginTop:12}}>
              <p className="lbl" style={{marginBottom:8}}>맥락 해석</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {fort.ctxHits.map((c,i)=>(
                  <span key={i} style={{padding:"3px 10px",borderRadius:50,fontSize:".70rem",fontWeight:500,background:c.mod>0?"var(--ok-lt)":"var(--dark-lt)",color:c.mod>0?"var(--ok)":"var(--dark)"}}>
                    {c.mod>0?"↑":"↓"} {c.desc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary + Questions */}
      <div className="glg" style={{padding:26}}>
        <p className="lbl" style={{marginBottom:12}}>꿈 요약</p>
        <p className="body" style={{marginBottom:20}}>{ana.summary}</p>
        <div className="div"/>
        <p className="lbl" style={{marginBottom:12}}>AI가 던지는 질문</p>
        {ana.questions.map((q,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"10px 14px",background:"rgba(107,92,231,.05)",borderRadius:12,borderLeft:"3px solid rgba(107,92,231,.32)"}}>
            <span style={{color:"var(--acc)",fontFamily:"var(--fd)",fontWeight:500,minWidth:22}}>Q{i+1}</span>
            <p style={{fontSize:".84rem",lineHeight:1.65,color:"var(--ink2)"}}>{q}</p>
          </div>
        ))}
      </div>

      {/* Emotions + Keywords */}
      <div className="g2">
        <div className="g" style={{padding:20}}>
          <p className="lbl" style={{marginBottom:14}}>감정 분석</p>
          {ana.emotions.map(e=><EmoBar key={e.label} {...e}/>)}
        </div>
        <div className="g" style={{padding:20}}>
          <p className="lbl" style={{marginBottom:14}}>핵심 키워드</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {ana.keywords.map(k=>(
              <span key={k} style={{padding:"4px 11px",borderRadius:50,fontSize:".72rem",fontWeight:500,background:"rgba(100,120,200,.09)",color:"#5a6eaa",border:"1px solid rgba(100,120,200,.18)"}}>{k}</span>
            ))}
          </div>
          <div style={{marginTop:14}}>
            <p className="lbl" style={{marginBottom:8}}>심층 상징</p>
            {ana.symbols.map((s,i)=>(
              <div key={i} className="sym-row">
                <span style={{padding:"2px 8px",borderRadius:50,fontSize:".63rem",fontWeight:600,background:"var(--ok-lt)",color:"var(--ok)",flexShrink:0,marginTop:2}}>{s.type}</span>
                <div>
                  <span style={{fontSize:".82rem",fontWeight:600}}>{s.sym}</span><br/>
                  <span className="sm" style={{lineHeight:1.55}}>{s.interp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DREAM CONTENT SECTION  — Dream Detail tab 2
═══════════════════════════════════════════════════════ */
function DreamContentSection({ dream }) {
  const [content,setContent] = useState(dream.content);
  const [hist,setHist]       = useState([]);
  const [fillerOpen,setFillerOpen] = useState(false);
  const [chosen,setChosen]   = useState(null);
  const [rec,setRec]         = useState(false);
  useEffect(()=>{setContent(dream.content);setHist([]);},[dream.id]);

  const applyFiller = () => {
    if(chosen===null) return;
    setHist([...hist,content]);
    const parts=content.split("[?]");
    setContent(parts[0]+AI_FILLERS[chosen]+parts.slice(1).join("[?]"));
    setChosen(null); setFillerOpen(false);
  };
  const renderPH = txt => txt.split(/(\[\?\])/).map((p,i)=>
    p==="[?]" ? <span key={i} className="myst" onClick={()=>setFillerOpen(true)}>?</span> : <span key={i}>{p}</span>
  );

  return (
    <div className="stag" style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="glg" style={{padding:26}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span style={{padding:"4px 12px",borderRadius:50,fontSize:".72rem",fontWeight:600,background:"var(--acc-lt)",color:"var(--acc)",border:"1px solid rgba(107,92,231,.2)"}}>
            {dream.mode==="narrative"?"📝 줄글":"💭 파편"}
          </span>
          {hist.length>0 && <button className="btn bg bsm" onClick={()=>{setContent(hist[hist.length-1]);setHist(hist.slice(0,-1));}}><I n="undo" s={12}/> 되돌리기</button>}
        </div>
        {dream.mode==="narrative" ? (
          <>
            {content.includes("[?]") && (
              <div style={{marginBottom:14,padding:"12px 16px",background:"rgba(107,92,231,.05)",borderRadius:12,border:"1px dashed rgba(107,92,231,.25)"}}>
                <p className="lbl" style={{marginBottom:8}}>🔮 드림 필러 — <span style={{color:"var(--acc)"}}>[?]</span> 클릭 → AI 추천</p>
                <div style={{fontSize:".87rem",lineHeight:1.9}}>{renderPH(content)}</div>
              </div>
            )}
            <textarea className="txta inp" value={content} onChange={e=>setContent(e.target.value)} style={{width:"100%",minHeight:150}}/>
            <p className="sm" style={{marginTop:8}}>기억 안 나는 부분은 <code style={{background:"var(--acc-lt)",padding:"1px 5px",borderRadius:4,fontSize:".73rem"}}>[?]</code>로 표시</p>
          </>
        ) : (
          <>
            <p className="lbl" style={{marginBottom:12}}>파편 키워드</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {dream.fragments.map((f,i)=>(
                <div key={i} className="fchip">
                  <span style={{fontWeight:600,fontSize:".87rem"}}>{f.word}</span>
                  <span className="sm" style={{marginTop:3}}>{f.desc}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="g" style={{padding:20}}>
        <p className="lbl" style={{marginBottom:12}}>음성 기록</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button className="btn bg" style={rec?{background:"rgba(224,92,92,.09)",color:"var(--err)",borderColor:"rgba(224,92,92,.2)"}:{}} onClick={()=>setRec(!rec)}>
            {rec?<><span className="rec-dot" style={{marginRight:5}}/> 녹음 중지</>:<><I n="mic" s={14}/> 녹음 시작</>}
          </button>
          {rec&&<span className="sm" style={{lineHeight:"36px"}}>● 00:12</span>}
          <button className="btn bg bsm"><I n="wave" s={13}/> STT 변환</button>
        </div>
      </div>

      {fillerOpen && (
        <div className="ovl" onClick={()=>setFillerOpen(false)}>
          <div className="glg mbox" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div><p className="lbl" style={{marginBottom:4}}>✨ 드림 필러</p><h3 style={{fontFamily:"var(--fd)",fontSize:"1.3rem"}}>[?]를 채워볼까요?</h3></div>
              <button className="bico" onClick={()=>setFillerOpen(false)}><I n="x" s={14}/></button>
            </div>
            <p className="sm" style={{marginBottom:14}}>AI가 맥락을 분석해 3가지 시나리오를 제안합니다</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {AI_FILLERS.map((s,i)=>(
                <div key={i} className={`aisug ${chosen===i?"on":""}`} onClick={()=>setChosen(i)}>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{color:"var(--acc)",fontFamily:"var(--fd)",fontWeight:600,minWidth:20}}>{i+1}</span>
                    <p className="body">{s}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn bg" style={{flex:1}} onClick={()=>setFillerOpen(false)}>직접 입력</button>
              <button className="btn bp" style={{flex:1}} disabled={chosen===null} onClick={applyFiller}><I n="check" s={14}/> 선택 삽입</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VISUAL DREAM SECTION  — Dream Detail tab 3
   Fortune → Video Prompt → Style Recommendation
═══════════════════════════════════════════════════════ */
function VisualDreamSection({ dream, onSaveVideo }) {
  const [sel,setSel]           = useState(null);
  const [len,setLen]           = useState(7);
  const [status,setStatus]     = useState("idle");
  const [video,setVideo]       = useState(dream.video);
  const [showPrompt,setShowPrompt] = useState(false);
  useEffect(()=>{setVideo(dream.video);setStatus("idle");setSel(null);},[dream.id]);

  const fort     = dream.fortune;
  const recs     = getRecommendedStyles(fort);
  const hasAna   = !!dream.analysis;
  const prompt   = fort?.videoPrompt;
  const gid      = fort?.grade.id;

  const generate = () => {
    if(!sel) return;
    setStatus("generating");
    setTimeout(()=>{
      const v={style:sel,length:len,createdAt:new Date().toISOString()};
      setVideo(v); onSaveVideo(dream.id,v); setStatus("done");
    },4500);
  };

  return (
    <div className="stag" style={{display:"flex",flexDirection:"column",gap:16}}>

      {!hasAna && (
        <div style={{padding:"16px 20px",borderRadius:"var(--r2)",background:"rgba(201,168,76,.09)",border:"1px solid rgba(201,168,76,.28)",display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>
            <p style={{fontWeight:600,fontSize:".87rem",color:"var(--gold)",marginBottom:3}}>Dream Fortune 분석이 필요합니다</p>
            <p className="sm">Analysis 탭에서 먼저 분석을 생성하면 AI가 운세 기반 영상 스타일을 추천합니다.</p>
          </div>
        </div>
      )}

      {/* Fortune context pill */}
      {fort && (
        <div className={`fc-${gid}`} style={{padding:"14px 18px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <FortuneBadge fortune={fort}/>
          <span className="sm">→ 영상 톤/스타일에 반영됨</span>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginLeft:"auto"}}>
            {fort.symbols.slice(0,2).map(s=>(
              <span key={s.name} style={{padding:"3px 10px",borderRadius:50,fontSize:".70rem",fontWeight:500,background:"rgba(255,255,255,.5)",border:"1px solid rgba(0,0,0,.09)"}}>◆ {s.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Style selector */}
      <div className="glg" style={{padding:22}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <I n="sparkle" s={15} c="var(--acc)"/>
          <p className="lbl" style={{color:"var(--acc)"}}>AI 추천 영상 스타일</p>
          {fort && <span className="rec-badge">Fortune 기반 추천</span>}
        </div>

        <div className="g2" style={{gap:10}}>
          {recs.map((style,idx)=>(
            <div key={style.id}
              className={`stcard ${idx<2&&fort?"rec":""} ${sel===style.id?"sel":""}`}
              onClick={()=>hasAna&&setSel(style.id)}
              style={{opacity:hasAna?1:.45,cursor:hasAna?"pointer":"not-allowed"}}>
              {fort&&idx<2 && <span className="rec-badge" style={{marginBottom:2}}>✦ 강력 추천</span>}
              <div style={{fontSize:"2rem",lineHeight:1}}>{style.icon}</div>
              <div style={{fontWeight:600,fontSize:".84rem"}}>{style.name}</div>
              <div style={{fontSize:".70rem",color:"var(--ink3)",lineHeight:1.4}}>{style.desc}</div>
            </div>
          ))}
        </div>

        <div className="div" style={{margin:"18px 0"}}/>
        <div className="field">
          <label className="flbl">영상 길이 — {len}초</label>
          <input type="range" min={5} max={10} value={len} onChange={e=>setLen(+e.target.value)} style={{accentColor:"var(--acc)",width:"100%",marginTop:4}}/>
          <div style={{display:"flex",justifyContent:"space-between"}}><span className="sm">5초</span><span className="sm">10초</span></div>
        </div>

        {/* Video Prompt preview */}
        {prompt && (
          <div style={{marginTop:16}}>
            <button className="btn bg bsm" onClick={()=>setShowPrompt(!showPrompt)} style={{marginBottom:8}}>
              {showPrompt?"▲ 프롬프트 숨기기":"▼ AI 영상 프롬프트 보기"}
            </button>
            {showPrompt && (
              <div className="prompt-box">
                <div><span className="pk">scene:    </span><span className="pv">{prompt.scene}</span></div>
                <div><span className="pk">mood:     </span><span className="pv">{prompt.mood}</span></div>
                <div><span className="pk">emotion:  </span><span className="pv">{prompt.emotion}</span></div>
                <div><span className="pk">lighting: </span><span className="pv">{prompt.lighting}</span></div>
                <div><span className="pk">tone:     </span><span className="pv">{prompt.tone}</span></div>
                <div><span className="pk">camera:   </span><span className="pv">{prompt.camera}</span></div>
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(107,92,231,.3)",color:"rgba(200,190,255,.6)",fontSize:".72rem",lineHeight:1.75}}>{prompt.full}</div>
              </div>
            )}
          </div>
        )}

        <button className={`btn bp ${status==="generating"?"pulse":""}`}
          style={{width:"100%",justifyContent:"center",padding:"12px",marginTop:18}}
          onClick={generate} disabled={!sel||status==="generating"||!hasAna}>
          <I n="film" s={15}/>
          {status==="generating"?"AI 시네마틱 생성 중…":status==="done"?"재생성":"AI 시네마틱 생성"}
        </button>
        {!sel&&hasAna && <p className="sm" style={{textAlign:"center",marginTop:8}}>스타일을 선택해주세요</p>}
      </div>

      {/* Progress */}
      {status==="generating" && (
        <div className="g" style={{padding:20,display:"flex",alignItems:"center",gap:16}}>
          <div style={{flexShrink:0,width:44,height:44,borderRadius:12,background:"var(--acc-lt)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="film" s={18} c="var(--acc)"/></div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:".84rem",fontWeight:600}}>AI 시네마틱 영상 생성 중</span>
              <span className="sm">~{len*3}초</span>
            </div>
            <div style={{height:4,borderRadius:2,background:"rgba(0,0,0,.07)",overflow:"hidden"}}>
              <div style={{height:"100%",background:"var(--acc)",animation:"prog 4.5s var(--ease) forwards",width:0}}/>
            </div>
            <style>{`@keyframes prog{to{width:95%}}`}</style>
          </div>
        </div>
      )}

      {/* Result */}
      {status==="done" && video && (
        <div className="glg" style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <p className="lbl" style={{marginBottom:4}}>생성 완료</p>
              <p style={{fontFamily:"var(--fd)",fontSize:"1.1rem"}}>{recs.find(s=>s.id===video.style)?.name} · {video.length}초</p>
            </div>
            {fort && <FortuneBadge fortune={fort}/>}
          </div>
          <div className="vp" style={{marginBottom:16,background:
            gid==="great"?"linear-gradient(140deg,#1a1200,#3d2c00,#5c4200)" :
            gid==="dark" ?"linear-gradient(140deg,#0e0000,#1e0404,#300808)" :
            "linear-gradient(140deg,#0c0a1e,#17103c,#27155a)"}}>
            <div style={{textAlign:"center"}}>
              <div className="orb"/>
              <p style={{color:"rgba(255,255,255,.5)",marginTop:16,fontSize:".78rem"}}>{recs.find(s=>s.id===video.style)?.icon} {recs.find(s=>s.id===video.style)?.name} · {video.length}s</p>
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.35)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
                <I n="play" s={18} c="rgba(255,255,255,.9)"/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button className="btn bg" style={{flex:1}}><I n="download" s={14}/> 다운로드</button>
            <button className="btn bp" style={{flex:1}}><I n="share" s={14}/> Wall에 공유</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DREAM DETAIL PAGE
   DreamDetailPage
     ├─ AnalysisSection
     ├─ DreamContentSection
     └─ VisualDreamSection
═══════════════════════════════════════════════════════ */
function DreamDetailPage({ dream, onBack, onSaveAnalysis, onSaveVideo }) {
  const [tab,setTab] = useState("analysis");
  useEffect(()=>setTab("analysis"),[dream.id]);

  const TABS = [
    {id:"analysis",label:"Analysis"},
    {id:"content", label:"Dream Content"},
    {id:"visual",  label:"Visual Dream"},
  ];

  return (
    <div className="page" style={{maxWidth:780,animation:"pgIn .38s var(--ease) both"}}>
      <button className="bback" onClick={onBack} style={{marginBottom:22}}><I n="back" s={14}/> 돌아가기</button>

      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <p className="lbl" style={{marginBottom:8}}>꿈 상세</p>
            <h1 style={{fontFamily:"var(--fd)",fontSize:"1.95rem",fontWeight:500,letterSpacing:"-.025em",lineHeight:1.2}}>
              {dream.title}{dream.verified&&<span style={{color:"var(--gold)",marginLeft:8,fontSize:".9rem"}}>✦</span>}
            </h1>
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
              {dream.fortune && <FortuneBadge fortune={dream.fortune} lg/>}
              <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
              <span className="sm">{dream.date}</span>
              {dream.forSale && <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:50,fontSize:".69rem",fontWeight:600,background:"var(--gold-lt)",color:"var(--gold)"}}>{dream.price}D</span>}
            </div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
              {dream.tags.map(t=><span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <button className="btn bg bsm"><I n="edit" s={13}/> 편집</button>
        </div>
        {dream.video && (
          <div style={{marginTop:14,padding:"10px 16px",borderRadius:"var(--r1)",background:"var(--acc-lt)",border:"1px solid rgba(107,92,231,.2)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setTab("visual")}>
            <I n="film" s={15} c="var(--acc)"/><span style={{fontSize:".82rem",color:"var(--acc)",fontWeight:500}}>생성된 Visual Dream 보기 →</span>
          </div>
        )}
      </div>

      <div className="dtabs">
        {TABS.map(t=>(
          <button key={t.id} className={`dtab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
            {t.label}
            {t.id==="visual"&&!dream.analysis&&<span style={{marginLeft:6,fontSize:".62rem",padding:"1px 6px",borderRadius:50,background:"rgba(201,168,76,.18)",color:"var(--gold)",fontWeight:700}}>분석 필요</span>}
            {t.id==="visual"&&dream.video&&<span style={{marginLeft:6,fontSize:".62rem",padding:"1px 6px",borderRadius:50,background:"var(--ok-lt)",color:"var(--ok)",fontWeight:700}}>완성</span>}
          </button>
        ))}
      </div>

      {tab==="analysis" && <AnalysisSection dream={dream} onSaveAnalysis={onSaveAnalysis}/>}
      {tab==="content"  && <DreamContentSection dream={dream}/>}
      {tab==="visual"   && <VisualDreamSection dream={dream} onSaveVideo={onSaveVideo}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LIBRARY VIEW
═══════════════════════════════════════════════════════ */
function LibraryView({ dreams, onCard }) {
  const [filter,setFilter] = useState("all");
  const list = dreams.filter(d=>{
    if(filter==="analyzed") return d.analyzed;
    if(filter==="visual")   return d.video;
    if(filter==="great")    return d.fortune?.grade.id==="great";
    if(filter==="good")     return d.fortune?.grade.id==="good";
    if(filter==="warn")     return ["warn","dark"].includes(d.fortune?.grade.id);
    return true;
  });

  return (
    <div className="page">
      <div style={{marginBottom:32}}>
        <p className="lbl" style={{marginBottom:10}}>드림 라이브러리</p>
        <h1 className="disp">기억의<br/><em style={{color:"var(--acc)",fontStyle:"italic"}}>아카이브</em></h1>
      </div>
      <div className="g" style={{display:"inline-flex",gap:3,padding:4,marginBottom:24,borderRadius:50,flexWrap:"wrap"}}>
        {[["all","전체"],["great","🌟 대길"],["good","✨ 길몽"],["warn","⚠️ 흉몽"],["analyzed","분석됨"],["visual","영상"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)}
            style={{padding:"7px 16px",borderRadius:50,border:"none",cursor:"pointer",fontFamily:"var(--fb)",fontSize:".80rem",fontWeight:500,transition:"all .2s",background:filter===k?"var(--acc)":"transparent",color:filter===k?"#fff":"var(--ink3)"}}>
            {l}
          </button>
        ))}
      </div>
      <div className="g2 stag">
        {list.length===0&&<div className="g" style={{padding:44,textAlign:"center",gridColumn:"1/-1"}}><div style={{fontSize:38,marginBottom:12}}>📂</div><p style={{fontFamily:"var(--fd)",fontSize:"1.05rem",color:"var(--ink3)"}}>해당하는 꿈이 없습니다</p></div>}
        {list.map(dream=>{
          const f=dream.fortune;
          const gid=f?.grade.id;
          return (
            <div key={dream.id} className="g" style={{padding:20,cursor:"pointer",transition:"all .22s var(--ease)",borderLeft:(gid ? `3px solid var(--${gid})` : "3px solid transparent")}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh-md)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
              onClick={()=>onCard(dream.id)}>
              {dream.video ? (
                <div style={{height:90,borderRadius:10,marginBottom:14,background:"linear-gradient(135deg,#0c0a1e,#27155a)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"radial-gradient(circle at 38% 36%,rgba(215,200,255,.9),rgba(98,62,228,.5))",boxShadow:"0 0 24px rgba(155,120,255,.5)"}}/>
                  <div style={{position:"absolute",bottom:8,left:10,display:"flex",alignItems:"center",gap:5}}><I n="film" s={11} c="rgba(255,255,255,.6)"/><span style={{color:"rgba(255,255,255,.6)",fontSize:".68rem"}}>Visual Dream</span></div>
                </div>
              ) : (
                <div style={{height:90,borderRadius:10,marginBottom:14,background:"rgba(107,92,231,.05)",border:"1.5px dashed rgba(107,92,231,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:".76rem",color:"var(--ink3)"}}>영상 없음</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontFamily:"var(--fd)",fontSize:".98rem",fontWeight:500}}>{dream.title}</span>
                <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
              </div>
              {f&&<div style={{marginBottom:7}}><FortuneBadge fortune={f}/></div>}
              <p className="sm" style={{marginBottom:8,lineHeight:1.6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                {dream.mode==="fragment"?dream.fragments.map(fr=>fr.word).join(" · "):dream.content.replace(/\[\?\]/g,"…")}
              </p>
              {f&&<div style={{fontSize:".72rem",fontWeight:600,color:`var(--${gid})`}}>{f.grade.ko} — {f.score}/100</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ████████╗██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗
      ██║   ██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝
      ██║   ██████╔╝███████║██║  ██║██║██╔██╗ ██║██║  ███╗
      ██║   ██╔══██╗██╔══██║██║  ██║██║██║╚██╗██║██║   ██║
      ██║   ██║  ██║██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝
   DREAM MARKET  —  거래 시스템 v1
   FIXED · OFFER · AUCTION  +  Price Engine  +  Curation Engine
═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────
   § 1.  DATA MODELS
   ─────────────────────────────────────────────────────────────────
   Listing  { id, dreamId, sellerId, type, status,
              priceFixed, startPrice, currentPrice, minIncrement,
              buyoutPrice, startsAt, endsAt, createdAt }
   Bid      { id, listingId, bidderId, amount, createdAt }
   Offer    { id, listingId, buyerId, amount, status,
              counterAmount, createdAt, updatedAt }
   Transaction { id, listingId, buyerId, sellerId, type,
                 amount, feeAmount, status, createdAt }
───────────────────────────────────────────────────────────────── */
const FEE_RATE    = 0.10;   // 10 %
const SNIPE_WINDOW = 120;   // anti-sniping: 종료 120초 전
const SNIPE_EXT    = 120;   // 연장 초
const SNIPE_MAX    = 10;    // 최대 연장 횟수

/** 현재가 기준 최소 입찰 단위 */
function minIncrement(currentPrice) {
  if (currentPrice <= 300)  return 10;
  if (currentPrice <= 1000) return 25;
  return 50;
}

/* ─────────────────────────────────────────────────────────────────
   § 2.  IN-MEMORY STORE  (LocalStorage 영속화)
   useStore() 훅이 전역 상태 역할을 한다.
───────────────────────────────────────────────────────────────── */
/* In-memory only — localStorage not available in artifact environment */
function saveStore(_s) { /* no-op */ }

function makeInitialStore() {
  const now = Date.now();
  const listings = [
    {
      id:"l1", dreamId:"m1", sellerId:"starweaver_92",
      type:"AUCTION", status:"ACTIVE",
      priceFixed:null, startPrice:800, currentPrice:980,
      buyoutPrice:1400, startsAt: now - 3600*1000*5,
      endsAt: now + 3600*1000*2 + 840*1000,   // ~2h14m
      createdAt: now - 3600*1000*5, snipeCount:0,
    },
    {
      id:"l2", dreamId:"m2", sellerId:"void_dreamer",
      type:"OFFER", status:"ACTIVE",
      priceFixed:480, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*20,
      endsAt: null, createdAt: now - 3600*1000*20, snipeCount:0,
    },
    {
      id:"l3", dreamId:"m3", sellerId:"moonthread",
      type:"FIXED", status:"ACTIVE",
      priceFixed:320, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*8,
      endsAt: null, createdAt: now - 3600*1000*8, snipeCount:0,
    },
    {
      id:"l4", dreamId:"m4", sellerId:"dreamseller",
      type:"AUCTION", status:"ACTIVE",
      priceFixed:null, startPrice:1200, currentPrice:1640,
      buyoutPrice:2200, startsAt: now - 3600*1000*2,
      endsAt: now + 45*60*1000,   // 45분
      createdAt: now - 3600*1000*2, snipeCount:0,
    },
    {
      id:"l5", dreamId:"m5", sellerId:"nebula_ink",
      type:"FIXED", status:"ACTIVE",
      priceFixed:620, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*14,
      endsAt: null, createdAt: now - 3600*1000*14, snipeCount:0,
    },
    {
      id:"l6", dreamId:"m6", sellerId:"shadowwalker",
      type:"OFFER", status:"ACTIVE",
      priceFixed:180, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*36,
      endsAt: null, createdAt: now - 3600*1000*36, snipeCount:0,
    },
    {
      id:"l7", dreamId:"m7", sellerId:"rosecloud",
      type:"FIXED", status:"ACTIVE",
      priceFixed:390, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*10,
      endsAt: null, createdAt: now - 3600*1000*10, snipeCount:0,
    },
    {
      id:"l8", dreamId:"m8", sellerId:"deepvoid",
      type:"OFFER", status:"ACTIVE",
      priceFixed:null, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*48,
      endsAt: null, createdAt: now - 3600*1000*48, snipeCount:0,
    },
    {
      id:"l9", dreamId:"m9", sellerId:"nightcrawler",
      type:"OFFER", status:"ACTIVE",
      priceFixed:null, startPrice:null, currentPrice:null,
      buyoutPrice:null, startsAt: now - 3600*1000*6,
      endsAt: null, createdAt: now - 3600*1000*6, snipeCount:0,
    },
  ];

  const bids = [
    {id:"b1", listingId:"l1", bidderId:"moonthread",  amount:900,  createdAt: now - 3600*1000*3},
    {id:"b2", listingId:"l1", bidderId:"nebula_ink",  amount:940,  createdAt: now - 3600*1000*2},
    {id:"b3", listingId:"l1", bidderId:"moonthread",  amount:980,  createdAt: now - 3600*1000*1},
    {id:"b4", listingId:"l4", bidderId:"void_dreamer",amount:1280, createdAt: now - 3600*1000*1.5},
    {id:"b5", listingId:"l4", bidderId:"rosecloud",   amount:1400, createdAt: now - 3600*1000*0.8},
    {id:"b6", listingId:"l4", bidderId:"void_dreamer",amount:1560, createdAt: now - 3600*1000*0.3},
    {id:"b7", listingId:"l4", bidderId:"moonthread",  amount:1640, createdAt: now - 1800*1000},
  ];

  const offers = [
    {id:"o1", listingId:"l2", buyerId:"you", amount:380, status:"PENDING",
      counterAmount:null, createdAt: now - 3600*1000*2, updatedAt: now - 3600*1000*2},
    {id:"o2", listingId:"l6", buyerId:"nebula_ink", amount:140, status:"COUNTER",
      counterAmount:165, createdAt: now - 7200*1000, updatedAt: now - 3600*1000},
  ];

  const transactions = [];

  return { listings, bids, offers, transactions, wallet: 2000 };
}

/* ─────────────────────────────────────────────────────────────────
   § 3.  STORE HOOK
───────────────────────────────────────────────────────────────── */
function useStore() {
  const [store, setStore] = useState(() => makeInitialStore());

  const update = (fn) => setStore(prev => {
    const next = fn(prev);
    saveStore(next);
    return next;
  });

  /* ── API-equivalent actions ── */

  /** POST /api/listings/:id/bids */
  function placeBid(listingId, amount) {
    const result = { ok: false, error: null, listing: null };
    update(s => {
      const listing = s.listings.find(l => l.id === listingId);
      if (!listing) { result.error = "리스팅 없음"; return s; }
      if (listing.type !== "AUCTION") { result.error = "경매가 아닙니다"; return s; }
      if (listing.status !== "ACTIVE") { result.error = "종료된 경매입니다"; return s; }

      const now = Date.now();
      if (listing.endsAt && now > listing.endsAt) { result.error = "경매가 종료되었습니다"; return s; }

      const minBid = (listing.currentPrice ?? listing.startPrice ?? 0) + minIncrement(listing.currentPrice ?? 0);
      if (amount < minBid) { result.error = `최소 입찰가는 ${minBid}D 입니다`; return s; }

      /* buyout 즉시 낙찰 */
      const isBuyout = listing.buyoutPrice != null && amount >= listing.buyoutPrice;

      /* anti-sniping */
      let newEndsAt = listing.endsAt;
      let newSnipeCount = listing.snipeCount ?? 0;
      if (listing.endsAt && !isBuyout) {
        const remaining = (listing.endsAt - now) / 1000;
        if (remaining <= SNIPE_WINDOW && newSnipeCount < SNIPE_MAX) {
          newEndsAt = listing.endsAt + SNIPE_EXT * 1000;
          newSnipeCount += 1;
        }
      }

      const newBid = { id: `b${Date.now()}`, listingId, bidderId: "you", amount, createdAt: now };
      const newStatus = isBuyout ? "SOLD" : "ACTIVE";

      const newTx = isBuyout ? [{
        id: `tx${Date.now()}`, listingId, buyerId: "you",
        sellerId: listing.sellerId, type: "BUYOUT",
        amount, feeAmount: Math.round(amount * FEE_RATE),
        status: "COMPLETED", createdAt: now,
      }] : [];

      result.ok = true;
      result.isBuyout = isBuyout;
      result.newEndsAt = newEndsAt;
      result.sniped = newSnipeCount > (listing.snipeCount ?? 0);

      return {
        ...s,
        wallet: s.wallet - amount,
        bids: [...s.bids, newBid],
        listings: s.listings.map(l => l.id !== listingId ? l : {
          ...l, currentPrice: amount,
          status: newStatus, endsAt: newEndsAt,
          snipeCount: newSnipeCount,
        }),
        transactions: [...s.transactions, ...newTx],
      };
    });
    return result;
  }

  /** POST /api/listings/:id/offers */
  function makeOffer(listingId, amount) {
    const result = { ok: false, error: null };
    update(s => {
      const listing = s.listings.find(l => l.id === listingId);
      if (!listing) { result.error = "리스팅 없음"; return s; }
      if (listing.type !== "OFFER") { result.error = "가격 제안 리스팅이 아닙니다"; return s; }
      if (listing.status !== "ACTIVE") { result.error = "종료된 리스팅입니다"; return s; }

      const ask = listing.priceFixed ?? 0;
      if (amount <= 0) { result.error = "금액을 입력해주세요"; return s; }

      const now = Date.now();
      const newOffer = {
        id: `o${Date.now()}`, listingId, buyerId: "you", amount,
        status: "PENDING", counterAmount: null, createdAt: now, updatedAt: now,
      };
      result.ok = true;
      return { ...s, offers: [...s.offers, newOffer] };
    });
    return result;
  }

  /** Accept counter offer */
  function acceptCounter(offerId) {
    update(s => {
      const offer = s.offers.find(o => o.id === offerId);
      if (!offer || offer.status !== "COUNTER") return s;
      const now = Date.now();
      const amount = offer.counterAmount;
      const listing = s.listings.find(l => l.id === offer.listingId);
      const newTx = {
        id: `tx${Date.now()}`, listingId: offer.listingId,
        buyerId: "you", sellerId: listing?.sellerId ?? "",
        type: "OFFER_ACCEPTED", amount,
        feeAmount: Math.round(amount * FEE_RATE),
        status: "COMPLETED", createdAt: now,
      };
      return {
        ...s,
        wallet: s.wallet - amount,
        offers: s.offers.map(o => o.id !== offerId ? o : { ...o, status: "ACCEPTED", updatedAt: now }),
        listings: s.listings.map(l => l.id !== offer.listingId ? l : { ...l, status: "SOLD" }),
        transactions: [...s.transactions, newTx],
      };
    });
  }

  /** Decline counter offer */
  function declineCounter(offerId) {
    update(s => ({
      ...s,
      offers: s.offers.map(o =>
        o.id !== offerId ? o : { ...o, status: "DECLINED", updatedAt: Date.now() }
      ),
    }));
  }

  /** POST /api/listings/:id/buy  (FIXED) */
  function buyFixed(listingId) {
    const result = { ok: false, error: null };
    update(s => {
      const listing = s.listings.find(l => l.id === listingId);
      if (!listing) { result.error = "리스팅 없음"; return s; }
      if (listing.type !== "FIXED") { result.error = "즉시구매 리스팅이 아닙니다"; return s; }
      if (listing.status !== "ACTIVE") { result.error = "이미 판매된 꿈입니다"; return s; }
      const amount = listing.priceFixed ?? 0;
      if (s.wallet < amount) { result.error = "드림 코인이 부족합니다"; return s; }
      const now = Date.now();
      const newTx = {
        id: `tx${Date.now()}`, listingId, buyerId: "you",
        sellerId: listing.sellerId, type: "FIXED",
        amount, feeAmount: Math.round(amount * FEE_RATE),
        status: "COMPLETED", createdAt: now,
      };
      result.ok = true;
      return {
        ...s,
        wallet: s.wallet - amount,
        listings: s.listings.map(l => l.id !== listingId ? l : { ...l, status: "SOLD" }),
        transactions: [...s.transactions, newTx],
      };
    });
    return result;
  }

  return { store, placeBid, makeOffer, acceptCounter, declineCounter, buyFixed };
}

/* ─────────────────────────────────────────────────────────────────
   § 4.  MARKET DREAM CATALOG  (confirmed data with price fields)
───────────────────────────────────────────────────────────────── */
const MARKET_DREAMS = [
  { id:"m1", author:"starweaver_92", avatar:"🌟", title:"유리 도시의 소년",
    preview:"도시 전체가 유리로 되어 있고 발걸음마다 균열이 생겼다. 나는 멈출 수 없었고 결국 정상에 올라섰다.",
    likes:142, comments:28, rarity:"legendary",
    tags:["도시","유리","공포"], hasVideo:true, fortuneId:"great",
    symbols:["도시","빛","계단"], emotions:["경이","공포"],
    verified:true, hasGaps:false, hasAnalysis:true,
    weeklyLikes:38, weeklyComments:9, weeklyTrades:4, postedAt: Date.now()-1000*3600*5 },
  { id:"m2", author:"void_dreamer",  avatar:"🌀", title:"역방향 시간",
    preview:"시계가 거꾸로 돌고 사람들이 뒷걸음질쳤다. 나만 앞으로 걸을 수 있었다.",
    likes:87, comments:14, rarity:"epic",
    tags:["시간","역행"], hasVideo:false, fortuneId:"neutral",
    symbols:["시계","길"], emotions:["불안","경이"],
    verified:false, hasGaps:true, hasAnalysis:false,
    weeklyLikes:12, weeklyComments:3, weeklyTrades:1, postedAt: Date.now()-1000*3600*20 },
  { id:"m3", author:"moonthread",    avatar:"🌙", title:"고양이 언어",
    preview:"고양이가 내게 인간의 언어로 말을 걸었다. '너는 매일 꿈에서만 깨어있다'고.",
    likes:203, comments:41, rarity:"rare",
    tags:["고양이","언어","꽃"], hasVideo:true, fortuneId:"good",
    symbols:["달","꽃"], emotions:["평온","경이"],
    verified:true, hasGaps:false, hasAnalysis:true,
    weeklyLikes:55, weeklyComments:18, weeklyTrades:3, postedAt: Date.now()-1000*3600*8 },
  { id:"m4", author:"dreamseller",   avatar:"✨", title:"황금 돼지 시장",
    preview:"시장 한가운데 황금빛 돼지가 걸어다녔다. 돼지를 잡자 동전이 쏟아졌고 문이 열렸다.",
    likes:318, comments:62, rarity:"legendary",
    tags:["돼지","황금","재물"], hasVideo:true, fortuneId:"great",
    symbols:["돼지","금","문"], emotions:["기쁨","설렘"],
    verified:true, hasGaps:false, hasAnalysis:true,
    weeklyLikes:92, weeklyComments:31, weeklyTrades:7, postedAt: Date.now()-1000*3600*2 },
  { id:"m5", author:"nebula_ink",    avatar:"🪐", title:"우주 도서관",
    preview:"책들이 중력 없이 떠다니는 우주 도서관. 모든 책은 아직 쓰여지지 않은 내 이야기였다.",
    likes:156, comments:33, rarity:"epic",
    tags:["우주","도서관","별"], hasVideo:true, fortuneId:"good",
    symbols:["별","책"], emotions:["경이","그리움"],
    verified:true, hasGaps:false, hasAnalysis:true,
    weeklyLikes:44, weeklyComments:15, weeklyTrades:2, postedAt: Date.now()-1000*3600*14 },
  { id:"m6", author:"shadowwalker",  avatar:"🌑", title:"거울 속 나",
    preview:"거울을 봤는데 반대편의 나는 전혀 다른 표정이었다. 손을 뻗자 거울이 깨졌다.",
    likes:44, comments:9, rarity:"rare",
    tags:["거울","분열","불안"], hasVideo:false, fortuneId:"warn",
    symbols:["거울","물"], emotions:["불안","공포"],
    verified:false, hasGaps:false, hasAnalysis:true,
    weeklyLikes:8, weeklyComments:4, weeklyTrades:0, postedAt: Date.now()-1000*3600*36 },
  { id:"m7", author:"rosecloud",     avatar:"🌸", title:"분홍 계단 위",
    preview:"끝없이 이어지는 분홍빛 계단을 올라갔다. 꼭대기에는 아무도 없었지만 빛이 있었다.",
    likes:97, comments:18, rarity:"rare",
    tags:["계단","빛","성장"], hasVideo:false, fortuneId:"good",
    symbols:["계단","빛"], emotions:["설렘","평온"],
    verified:false, hasGaps:false, hasAnalysis:false,
    weeklyLikes:29, weeklyComments:8, weeklyTrades:1, postedAt: Date.now()-1000*3600*10 },
  { id:"m8", author:"deepvoid",      avatar:"🕳️", title:"추락하는 용",
    preview:"하늘에서 용이 추락했다. 나는 그걸 지켜보며 쫓기는 느낌이 들었다.",
    likes:31, comments:6, rarity:"common",
    tags:["용","추락","공포"], hasVideo:false, fortuneId:"dark",
    symbols:["용","추락"], emotions:["공포","불안"],
    verified:false, hasGaps:true, hasAnalysis:false,
    weeklyLikes:5, weeklyComments:2, weeklyTrades:0, postedAt: Date.now()-1000*3600*48 },
  { id:"m9", author:"nightcrawler",  avatar:"🦋", title:"이 빠진 밤",
    preview:"거울 앞에서 이가 하나씩 빠졌다. 무섭지 않았는데, 오히려 새 이가 나기 시작했다.",
    likes:22, comments:11, rarity:"common",
    tags:["이빠짐","변화"], hasVideo:false, fortuneId:"warn",
    symbols:["이빠짐","거울"], emotions:["불안","놀람"],
    verified:false, hasGaps:false, hasAnalysis:true,
    weeklyLikes:6, weeklyComments:5, weeklyTrades:0, postedAt: Date.now()-1000*3600*6 },
];

/* ─────────────────────────────────────────────────────────────────
   § 5.  PRICE ENGINE  (unchanged from v2)
───────────────────────────────────────────────────────────────── */
const FORTUNE_MUL  = { great:2.0, good:1.4, neutral:1.0, warn:0.6, dark:0.3 };
const BASE_PRICE   = { great:200, good:200, neutral:120 };
const BASE_PAYOUT  = { warn:30, dark:80 };
const TRANSFER_FEE = 10;

const SYMBOL_VALUE = {
  "돼지":0.30,"금":0.28,"용":0.25,"물고기":0.22,"똥":0.20,"맑은 물":0.18,
  "산":0.15,"꽃":0.12,"달":0.10,"별":0.10,"계단":0.08,"문":0.08,
  "책":0.06,"빛":0.07,"이빠짐":-0.05,"추락":-0.08,"거울":-0.05,"뱀":-0.06,
};

function calcPrice(dream) {
  const fid = dream.fortuneId ?? "neutral";
  const isExchange = fid === "warn" || fid === "dark";
  let qualMul = 1.0;
  if (!dream.hasGaps)         qualMul += 0.15;
  if ((dream.tags?.length??0) >= 3) qualMul += 0.05;
  if (dream.hasAnalysis)      qualMul += 0.10;
  if (dream.hasVideo)         qualMul += 0.25;
  let symBonus = 0;
  (dream.symbols ?? []).forEach(s => { symBonus += SYMBOL_VALUE[s] ?? 0.03; });
  const symMul    = Math.max(0.5, 1 + symBonus);
  const engagement = (dream.weeklyLikes??0) + (dream.weeklyComments??0)*2 + (dream.weeklyTrades??0)*5;
  const demandMul = 1 + Math.min(0.20, engagement / 300);
  const breakdown = {
    quality: Math.round((qualMul-1)*100),
    symbol:  Math.round(symBonus*100),
    demand:  Math.round((demandMul-1)*100),
  };
  if (isExchange) {
    const basePayout = BASE_PAYOUT[fid] ?? 30;
    const payout     = Math.round(basePayout * qualMul * symMul);
    return { isExchange:true, price:0, payout, netPayout: Math.max(0, payout - TRANSFER_FEE),
      transferFee: TRANSFER_FEE, breakdown,
      tooltip:`${(FORTUNE_MUL[fid]??0)*100}% Fortune · 완성도 +${breakdown.quality}% · 상징 +${breakdown.symbol}%` };
  }
  const base  = BASE_PRICE[fid] ?? 120;
  const fmul  = FORTUNE_MUL[fid] ?? 1.0;
  const price = Math.round(base * fmul * qualMul * symMul * demandMul);
  return { isExchange:false, price, payout:0, netPayout:0, transferFee:0, breakdown,
    tooltip:`기본가 ${base}D × Fortune×${fmul} · 완성도 +${breakdown.quality}% · 상징 +${breakdown.symbol}% · 수요 +${breakdown.demand}%` };
}

const PRICED_DREAMS = MARKET_DREAMS.map(d => ({ ...d, _price: calcPrice(d) }));

/* ─────────────────────────────────────────────────────────────────
   § 6.  CURATION ENGINE
───────────────────────────────────────────────────────────────── */
const USER_PROFILE = {
  favoriteGrades: ["great","good"],
  symbols: ["별","달","물","계단"],
  emotions: ["경이","평온","그리움"],
};
function jaccard(a=[], b=[]) {
  const sa = new Set(a), sb = new Set(b);
  const inter = [...sa].filter(x => sb.has(x)).length;
  const union = new Set([...sa,...sb]).size;
  return union === 0 ? 0 : inter / union;
}
function recommendScore(dream) {
  const fid = dream.fortuneId ?? "neutral";
  const fortuneMatch = USER_PROFILE.favoriteGrades.includes(fid) ? (fid==="great"?30:20) : (fid==="neutral"?10:0);
  const symbolScore  = Math.round(jaccard(dream.symbols, USER_PROFILE.symbols) * 25);
  const emotionScore = Math.round(jaccard(dream.emotions, USER_PROFILE.emotions) * 20);
  const eng   = (dream.weeklyLikes??0) + (dream.weeklyComments??0)*2 + (dream.weeklyTrades??0)*5;
  const engSc = Math.round(Math.min(15, eng/20));
  const ageH  = (Date.now() - (dream.postedAt??0)) / (1000*3600);
  const freshSc = Math.round(Math.max(0, 10 - ageH/5));
  return { total: fortuneMatch+symbolScore+emotionScore+engSc+freshSc, fortuneMatch, symbolScore, emotionScore, engSc, freshSc };
}

/* ─────────────────────────────────────────────────────────────────
   § 7.  VISUAL CONFIG
───────────────────────────────────────────────────────────────── */
const VID_BG = {
  great:  "linear-gradient(140deg,#1a1200,#3d2c00,#5c4200)",
  good:   "linear-gradient(140deg,#071a11,#0d3320,#154d2e)",
  neutral:"linear-gradient(140deg,#0a0c1e,#141832,#1e2248)",
  warn:   "linear-gradient(140deg,#1a0d00,#3d1f00,#5c3000)",
  dark:   "linear-gradient(140deg,#0e0000,#1e0404,#300808)",
};
const ORB_BG = {
  great:  "radial-gradient(circle,rgba(255,220,100,.95),rgba(201,146,26,.5))",
  good:   "radial-gradient(circle,rgba(130,230,180,.95),rgba(78,175,128,.5))",
  neutral:"radial-gradient(circle,rgba(180,195,240,.95),rgba(107,127,196,.5))",
  warn:   "radial-gradient(circle,rgba(255,180,100,.95),rgba(217,110,48,.5))",
  dark:   "radial-gradient(circle,rgba(220,140,140,.95),rgba(170,58,58,.5))",
};

/* ─────────────────────────────────────────────────────────────────
   § 8.  UTILITY HELPERS
───────────────────────────────────────────────────────────────── */
function fmtCountdown(endsAt) {
  if (!endsAt) return null;
  const diff = Math.max(0, endsAt - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit" });
}

function useCountdown(endsAt) {
  const [label, setLabel] = useState(() => fmtCountdown(endsAt));
  useEffect(() => {
    if (!endsAt) return;
    const t = setInterval(() => setLabel(fmtCountdown(endsAt)), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return label;
}

/* ─────────────────────────────────────────────────────────────────
   § 9.  TRADE TYPE BADGE
───────────────────────────────────────────────────────────────── */
function TypeBadge({ listing }) {
  if (!listing) return null;
  const cfg = {
    FIXED:   { label:"즉시구매",  bg:"rgba(78,175,128,.12)",  color:"var(--ok)",   icon:"💰" },
    OFFER:   { label:"가격 제안", bg:"rgba(107,92,231,.10)", color:"var(--acc)",  icon:"💬" },
    AUCTION: { label:"경매",      bg:"rgba(224,92,92,.10)",   color:"var(--err)",  icon:"⏱" },
  }[listing.type] ?? { label:listing.type, bg:"rgba(0,0,0,.06)", color:"var(--ink3)", icon:"●" };

  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:50,
      fontSize:".64rem",fontWeight:700,background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}40`}}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   § 10.  LISTING DETAIL MODAL  (FIXED / OFFER / AUCTION)
───────────────────────────────────────────────────────────────── */
function ListingDetail({ listing, dream, bids, offers, onClose, onPlaceBid, onMakeOffer, onBuyFixed, onAcceptCounter, onDeclineCounter, wallet }) {
  /* Safe defaults */
  const safeListing = listing ?? {};
  const safeDream   = dream   ?? {};
  const safeBids    = (bids   ?? []).filter(b => b.listingId === safeListing.id).sort((a,b) => b.amount - a.amount);
  const safeOffers  = (offers ?? []).filter(o => o.listingId === safeListing.id);
  const myOffer     = safeOffers.find(o => o.buyerId === "you") ?? null;

  const [bidAmt,  setBidAmt]  = useState("");
  const [offerAmt,setOfferAmt]= useState("");
  const [msg,     setMsg]     = useState(null);   // { type:"ok"|"err", text }
  const [busy,    setBusy]    = useState(false);
  const countdown = useCountdown(safeListing.endsAt ?? null);
  const grade = (typeof GRADES !== "undefined" ? GRADES : []).find(g => g.id === safeDream.fortuneId) ?? { id:"neutral", label:"Neutral", ko:"평몽", icon:"🌙" };

  const curPrice  = safeListing.currentPrice ?? safeListing.startPrice ?? 0;
  const minBid    = curPrice + minIncrement(curPrice);
  const isSold    = safeListing.status === "SOLD";
  const isActive  = safeListing.status === "ACTIVE";

  function showMsg(type, text) { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); }

  async function handleBid() {
    const amt = parseInt(bidAmt, 10);
    if (isNaN(amt)) { showMsg("err","금액을 입력하세요"); return; }
    setBusy(true);
    const res = onPlaceBid(safeListing.id, amt);
    setBusy(false);
    if (!res.ok) { showMsg("err", res.error ?? "오류 발생"); return; }
    setBidAmt("");
    if (res.isBuyout) showMsg("ok","즉시 낙찰 완료! 🎉");
    else if (res.sniped) showMsg("ok",`입찰 성공! Anti-sniping: +2분 연장 ⏱`);
    else showMsg("ok","입찰 성공!");
  }

  async function handleOffer() {
    const amt = parseInt(offerAmt, 10);
    if (isNaN(amt) || amt <= 0) { showMsg("err","금액을 입력하세요"); return; }
    setBusy(true);
    const res = onMakeOffer(safeListing.id, amt);
    setBusy(false);
    if (!res.ok) { showMsg("err", res.error ?? "오류 발생"); return; }
    setOfferAmt("");
    showMsg("ok","제안을 보냈습니다!");
  }

  async function handleBuyFixed() {
    setBusy(true);
    const res = onBuyFixed(safeListing.id);
    setBusy(false);
    if (!res.ok) { showMsg("err", res.error ?? "오류 발생"); return; }
    showMsg("ok","구매 완료! 🎉");
  }

  const auctionColor   = isActive && countdown ? "var(--err)" : "var(--ink3)";
  const fortuneColor   = `var(--${safeDream.fortuneId ?? "neutral"})`;

  return (
    <div className="ovl" onClick={onClose}>
      <div className="glg" style={{width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",padding:28,margin:"0 16px",animation:"pi .26s var(--spring) both"}} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div style={{flex:1,paddingRight:16}}>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:8}}>
              <TypeBadge listing={safeListing}/>
              {safeListing.status === "SOLD" && (
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:50,fontSize:".64rem",fontWeight:700,background:"rgba(78,175,128,.12)",color:"var(--ok)",border:"1px solid rgba(78,175,128,.3)"}}>✓ 판매 완료</span>
              )}
              <span className={`rar r-${safeDream.rarity ?? "common"}`}>{safeDream.rarity ?? "common"}</span>
            </div>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"1.5rem",fontWeight:500,lineHeight:1.2,marginBottom:6}}>{safeDream.title ?? "—"}</h2>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:"1rem"}}>{safeDream.avatar ?? "🌙"}</span>
              <span className="sm">{safeDream.author ?? "—"}</span>
              {safeDream.verified && <span style={{color:"var(--gold)",fontSize:11}}>✦ 인증</span>}
            </div>
          </div>
          <button className="bico" onClick={onClose}><I n="x" s={14}/></button>
        </div>

        {/* Thumbnail */}
        {safeDream.hasVideo && (
          <div style={{height:140,borderRadius:"var(--r2)",marginBottom:18,background:VID_BG[safeDream.fortuneId??"neutral"],position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:ORB_BG[safeDream.fortuneId??"neutral"],boxShadow:"0 0 36px rgba(155,120,255,.5)"}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.38)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
                <I n="play" s={16} c="rgba(255,255,255,.9)"/>
              </div>
            </div>
          </div>
        )}

        {/* Fortune */}
        <div style={{marginBottom:14,padding:"12px 16px",borderRadius:"var(--r1)",background:`var(--${safeDream.fortuneId??"neutral"}-lt)`,border:`1px solid var(--${safeDream.fortuneId??"neutral"}-bd)`}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
            <span className={`fb fb-${safeDream.fortuneId ?? "neutral"}`}>{grade.icon} {grade.label}</span>
            {safeDream.symbols?.map(s=>(
              <span key={s} style={{padding:"1px 7px",borderRadius:50,fontSize:".62rem",fontWeight:500,background:"rgba(107,92,231,.08)",color:"var(--acc)",border:"1px solid rgba(107,92,231,.15)"}}>◆ {s}</span>
            ))}
          </div>
          <p className="sm" style={{fontSize:".78rem",lineHeight:1.65}}>{safeDream.preview ?? ""}</p>
        </div>

        <div className="div"/>

        {/* ── AUCTION PANEL ── */}
        {safeListing.type === "AUCTION" && (
          <div>
            {/* Timer + price banner */}
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:130,padding:"14px 16px",borderRadius:"var(--r1)",background:"rgba(224,92,92,.06)",border:"1px solid rgba(224,92,92,.2)"}}>
                <div style={{fontSize:".68rem",fontWeight:600,color:"var(--err)",marginBottom:3}}>현재 입찰가</div>
                <div style={{fontFamily:"var(--fd)",fontSize:"1.85rem",color:"var(--err)",fontWeight:400,lineHeight:1}}>{curPrice.toLocaleString()}D</div>
              </div>
              {safeListing.endsAt && (
                <div style={{flex:1,minWidth:130,padding:"14px 16px",borderRadius:"var(--r1)",background:"rgba(224,92,92,.06)",border:"1px solid rgba(224,92,92,.2)"}}>
                  <div style={{fontSize:".68rem",fontWeight:600,color:"var(--err)",marginBottom:3}}>남은 시간</div>
                  <div style={{fontFamily:"var(--fd)",fontSize:"1.85rem",color:auctionColor,fontWeight:400,lineHeight:1}}>{countdown ?? "—"}</div>
                  {(safeListing.snipeCount ?? 0) > 0 && <div style={{fontSize:".62rem",color:"var(--ink3)",marginTop:3}}>+{(safeListing.snipeCount??0)*2}분 연장됨</div>}
                </div>
              )}
            </div>

            {/* Min increment & buyout info */}
            <div style={{marginBottom:14,padding:"10px 14px",borderRadius:10,background:"var(--acc-lt)",border:"1px solid rgba(107,92,231,.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                <div>
                  <div style={{fontSize:".65rem",color:"var(--acc)",fontWeight:600,marginBottom:1}}>최소 입찰 단위</div>
                  <div style={{fontFamily:"var(--fd)",fontSize:".95rem",color:"var(--acc)"}}>{minIncrement(curPrice)}D</div>
                </div>
                <div>
                  <div style={{fontSize:".65rem",color:"var(--acc)",fontWeight:600,marginBottom:1}}>최소 입찰가</div>
                  <div style={{fontFamily:"var(--fd)",fontSize:".95rem",color:"var(--acc)"}}>{minBid.toLocaleString()}D</div>
                </div>
                {safeListing.buyoutPrice != null && (
                  <div>
                    <div style={{fontSize:".65rem",color:"var(--gold)",fontWeight:600,marginBottom:1}}>즉시 낙찰가</div>
                    <div style={{fontFamily:"var(--fd)",fontSize:".95rem",color:"var(--gold)"}}>{safeListing.buyoutPrice.toLocaleString()}D</div>
                  </div>
                )}
                <div>
                  <div style={{fontSize:".65rem",color:"var(--ink3)",fontWeight:600,marginBottom:1}}>수수료 (10%)</div>
                  <div style={{fontFamily:"var(--fd)",fontSize:".95rem",color:"var(--ink3)"}}>{Math.round(curPrice*FEE_RATE)}D</div>
                </div>
              </div>
            </div>

            {/* Bid history */}
            {safeBids.length > 0 && (
              <div style={{marginBottom:16}}>
                <p className="lbl" style={{marginBottom:10}}>입찰 히스토리</p>
                <div style={{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                  {safeBids.map((b,i) => (
                    <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:10,background:i===0?"rgba(107,92,231,.06)":"rgba(0,0,0,.03)",border:i===0?"1px solid rgba(107,92,231,.15)":"1px solid rgba(0,0,0,.06)"}}>
                      <span style={{fontSize:".72rem",fontWeight:i===0?700:400,color:i===0?"var(--acc)":"var(--ink3)",minWidth:16}}>{i===0?"👑":i+1}</span>
                      <span style={{flex:1,fontSize:".80rem",fontWeight:i===0?600:400}}>{b.bidderId === "you" ? "나" : b.bidderId}</span>
                      <span style={{fontFamily:"var(--fd)",fontSize:".92rem",color:i===0?"var(--acc)":"var(--ink2)",fontWeight:i===0?600:400}}>{b.amount.toLocaleString()}D</span>
                      <span style={{fontSize:".65rem",color:"var(--ink3)"}}>{fmtTime(b.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bid input */}
            {isActive && !isSold && (
              <div style={{marginBottom:8}}>
                <p className="lbl" style={{marginBottom:8}}>입찰 금액</p>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="number" value={bidAmt} onChange={e=>setBidAmt(e.target.value)}
                    placeholder={`최소 ${minBid}D`}
                    style={{flex:1,padding:"10px 14px",borderRadius:"var(--r1)",border:"1px solid rgba(107,92,231,.25)",background:"rgba(255,255,255,.8)",fontFamily:"var(--fb)",fontSize:".90rem",outline:"none"}}/>
                  <button className="btn bp" disabled={busy||!bidAmt} onClick={handleBid} style={{flexShrink:0}}>
                    {busy ? "처리중…" : "입찰"}
                  </button>
                </div>
                {/* Quick amount buttons */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[minBid, minBid+minIncrement(curPrice)*2, minBid+minIncrement(curPrice)*5].map(v=>(
                    <button key={v} className="btn bg bsm" style={{fontSize:".70rem"}} onClick={()=>setBidAmt(String(v))}>{v.toLocaleString()}D</button>
                  ))}
                  {safeListing.buyoutPrice != null && (
                    <button className="btn bsm" style={{fontSize:".70rem",background:"var(--gold-lt)",color:"var(--gold)",border:"1px solid rgba(201,168,76,.3)",fontWeight:700}} onClick={()=>setBidAmt(String(safeListing.buyoutPrice))}>
                      즉시 낙찰 {safeListing.buyoutPrice.toLocaleString()}D
                    </button>
                  )}
                </div>
                <p className="sm" style={{marginTop:6,fontSize:".70rem"}}>
                  내 잔액: <strong>{wallet?.toLocaleString() ?? "—"}D</strong> · Anti-sniping 적용 (종료 2분 전 입찰 시 +2분 연장)
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── OFFER PANEL ── */}
        {safeListing.type === "OFFER" && (
          <div>
            <div style={{marginBottom:16,padding:"14px 16px",borderRadius:"var(--r1)",background:"var(--gold-lt)",border:"1px solid rgba(201,168,76,.28)"}}>
              <div style={{fontSize:".68rem",fontWeight:600,color:"var(--gold)",marginBottom:3}}>판매 희망가</div>
              <div style={{fontFamily:"var(--fd)",fontSize:"1.85rem",color:"var(--gold)",fontWeight:400}}>{(safeListing.priceFixed ?? 0).toLocaleString()}D</div>
            </div>

            {/* My offer status */}
            {myOffer && (
              <div style={{marginBottom:16,padding:"14px 16px",borderRadius:"var(--r1)",
                background: myOffer.status==="COUNTER"?"rgba(107,92,231,.07)": myOffer.status==="ACCEPTED"?"var(--ok-lt)": myOffer.status==="DECLINED"?"rgba(224,92,92,.07)":"rgba(0,0,0,.04)",
                border: `1px solid ${myOffer.status==="COUNTER"?"rgba(107,92,231,.2)": myOffer.status==="ACCEPTED"?"rgba(78,175,128,.28)": myOffer.status==="DECLINED"?"rgba(224,92,92,.2)":"rgba(0,0,0,.09)"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:".65rem",fontWeight:600,color:"var(--ink3)",marginBottom:2}}>내 제안</div>
                    <div style={{fontFamily:"var(--fd)",fontSize:"1.2rem",color:"var(--acc)"}}>{myOffer.amount.toLocaleString()}D</div>
                  </div>
                  <span style={{padding:"2px 8px",borderRadius:50,fontSize:".65rem",fontWeight:700,
                    background: myOffer.status==="PENDING"?"rgba(201,168,76,.15)": myOffer.status==="COUNTER"?"rgba(107,92,231,.12)": myOffer.status==="ACCEPTED"?"var(--ok-lt)":"rgba(224,92,92,.10)",
                    color: myOffer.status==="PENDING"?"var(--gold)": myOffer.status==="COUNTER"?"var(--acc)": myOffer.status==="ACCEPTED"?"var(--ok)":"var(--err)"}}>
                    {myOffer.status==="PENDING"?"검토 중": myOffer.status==="COUNTER"?"카운터 제안": myOffer.status==="ACCEPTED"?"수락됨":"거절됨"}
                  </span>
                </div>
                {myOffer.status === "COUNTER" && myOffer.counterAmount != null && (
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"10px 12px",borderRadius:10,background:"rgba(107,92,231,.07)",border:"1px solid rgba(107,92,231,.18)"}}>
                      <span style={{fontSize:".72rem",color:"var(--acc)"}}>판매자 카운터:</span>
                      <span style={{fontFamily:"var(--fd)",fontSize:"1.1rem",color:"var(--acc)",fontWeight:500}}>{myOffer.counterAmount.toLocaleString()}D</span>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn bp" style={{flex:1,justifyContent:"center"}} onClick={()=>onAcceptCounter(myOffer.id)}>
                        <I n="check" s={13}/> 수락 ({myOffer.counterAmount.toLocaleString()}D)
                      </button>
                      <button className="btn bg" style={{flex:1,justifyContent:"center"}} onClick={()=>onDeclineCounter(myOffer.id)}>거절</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Offer input */}
            {isActive && !myOffer && (
              <div>
                <p className="lbl" style={{marginBottom:8}}>제안 금액</p>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="number" value={offerAmt} onChange={e=>setOfferAmt(e.target.value)}
                    placeholder="제안할 금액…"
                    style={{flex:1,padding:"10px 14px",borderRadius:"var(--r1)",border:"1px solid rgba(107,92,231,.25)",background:"rgba(255,255,255,.8)",fontFamily:"var(--fb)",fontSize:".90rem",outline:"none"}}/>
                  <button className="btn bp" disabled={busy||!offerAmt} onClick={handleOffer}>{busy?"처리중…":"제안 전송"}</button>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {[0.7,0.8,0.9].map(r=>{
                    const v = Math.round((safeListing.priceFixed??0)*r);
                    return <button key={r} className="btn bg bsm" style={{fontSize:".70rem"}} onClick={()=>setOfferAmt(String(v))}>{(r*100).toFixed(0)}% = {v}D</button>;
                  })}
                </div>
                <p className="sm" style={{marginTop:8,fontSize:".70rem"}}>
                  제안은 24시간 유효 · 수수료 {Math.round((parseInt(offerAmt)||safeListing.priceFixed||0)*FEE_RATE)}D (10%)
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── FIXED PANEL ── */}
        {safeListing.type === "FIXED" && (
          <div>
            <div style={{marginBottom:16,padding:"14px 16px",borderRadius:"var(--r1)",background:"var(--gold-lt)",border:"1px solid rgba(201,168,76,.28)"}}>
              <div style={{fontSize:".68rem",fontWeight:600,color:"var(--gold)",marginBottom:3}}>즉시구매가</div>
              <div style={{fontFamily:"var(--fd)",fontSize:"1.85rem",color:"var(--gold)",fontWeight:400}}>{(safeListing.priceFixed??0).toLocaleString()}D</div>
            </div>
            <div style={{marginBottom:16,display:"flex",gap:12,flexWrap:"wrap"}}>
              {[["구매 금액",(safeListing.priceFixed??0).toLocaleString()+"D","var(--gold)"],
                ["수수료 (10%)",Math.round((safeListing.priceFixed??0)*FEE_RATE).toLocaleString()+"D","var(--ink3)"],
                ["내 잔액",(wallet??0).toLocaleString()+"D","var(--acc)"]].map(([l,v,c])=>(
                <div key={l} style={{flex:1,minWidth:100,padding:"10px 13px",borderRadius:10,background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)"}}>
                  <div style={{fontSize:".65rem",color:"var(--ink3)",marginBottom:2}}>{l}</div>
                  <div style={{fontFamily:"var(--fd)",fontSize:".95rem",color:c,fontWeight:400}}>{v}</div>
                </div>
              ))}
            </div>
            {isActive ? (
              <button className="btn bp" style={{width:"100%",justifyContent:"center",padding:"13px"}} disabled={busy||(wallet??0)<(safeListing.priceFixed??0)} onClick={handleBuyFixed}>
                {busy ? "처리중…" : <><I n="coins" s={14}/> 즉시구매 {(safeListing.priceFixed??0).toLocaleString()}D</>}
              </button>
            ) : (
              <div style={{textAlign:"center",padding:"16px",borderRadius:"var(--r1)",background:"var(--ok-lt)",border:"1px solid var(--good-bd)"}}>
                <p style={{fontWeight:600,color:"var(--ok)"}}>✓ 판매 완료된 꿈입니다</p>
              </div>
            )}
          </div>
        )}

        {/* Feedback message */}
        {msg && (
          <div style={{marginTop:12,padding:"10px 14px",borderRadius:10,display:"flex",alignItems:"center",gap:8,
            background:msg.type==="ok"?"var(--ok-lt)":"rgba(224,92,92,.1)",
            border:`1px solid ${msg.type==="ok"?"rgba(78,175,128,.28)":"rgba(224,92,92,.25)"}`}}>
            {msg.type==="ok" ? <I n="check" s={14} c="var(--ok)"/> : <span style={{color:"var(--err)",fontWeight:700}}>!</span>}
            <p style={{fontSize:".82rem",fontWeight:500,color:msg.type==="ok"?"var(--ok)":"var(--err)"}}>{msg.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   § 11.  WALL FEED CARD  (updated — shows trade type + smart CTA)
───────────────────────────────────────────────────────────────── */
function WallCard({ dream, listing, bids, onOpenDetail }) {
  const safeDream   = dream   ?? {};
  const safeListing = listing ?? {};
  const safeBids    = (bids ?? []).filter(b => b.listingId === safeListing.id);
  const curPrice    = safeListing.currentPrice ?? safeListing.startPrice ?? safeListing.priceFixed ?? 0;
  const countdown   = useCountdown(safeListing.endsAt ?? null);
  const grade       = (typeof GRADES !== "undefined" ? GRADES : []).find(g => g.id === safeDream.fortuneId) ?? { id:"neutral", icon:"🌙", label:"Neutral Dream" };
  const fid         = safeDream.fortuneId ?? "neutral";
  const isSold      = safeListing.status === "SOLD";

  return (
    <div className="g" style={{padding:0,overflow:"hidden",transition:"all .22s var(--ease)",cursor:"pointer",borderLeft:`3px solid var(--${fid})`,opacity:isSold?.65:1}}
      onMouseEnter={e=>{if(!isSold){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh-md)";}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>

      {/* Video thumb */}
      {safeDream.hasVideo && (
        <div style={{height:120,background:VID_BG[fid]??VID_BG.neutral,position:"relative",overflow:"hidden"}} onClick={()=>onOpenDetail(safeListing.id)}>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:ORB_BG[fid]??ORB_BG.neutral,boxShadow:"0 0 28px rgba(155,120,255,.45)"}}/>
          </div>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.18)",border:"2px solid rgba(255,255,255,.35)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
              <I n="play" s={14} c="rgba(255,255,255,.85)"/>
            </div>
          </div>
          {isSold && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:700,fontSize:"1rem",letterSpacing:".1em"}}>SOLD</span></div>}
        </div>
      )}

      <div style={{padding:"15px 17px"}} onClick={()=>onOpenDetail(safeListing.id)}>
        {/* Author row */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          <span style={{fontSize:".9rem"}}>{safeDream.avatar ?? "🌙"}</span>
          <span className="sm" style={{fontWeight:500}}>{safeDream.author ?? "—"}</span>
          {safeDream.verified && <span style={{color:"var(--gold)",fontSize:10}}>✦</span>}
          <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
            <TypeBadge listing={safeListing}/>
            {isSold && <span style={{padding:"2px 7px",borderRadius:50,fontSize:".62rem",fontWeight:700,background:"var(--ok-lt)",color:"var(--ok)",border:"1px solid rgba(78,175,128,.28)"}}>✓ 판매됨</span>}
          </div>
        </div>

        <h3 style={{fontFamily:"var(--fd)",fontSize:".98rem",fontWeight:500,lineHeight:1.3,marginBottom:7}}>{safeDream.title ?? "—"}</h3>
        <div style={{marginBottom:8}}><span className={`fb fb-${fid}`}>{grade.icon} {grade.label}</span></div>
        <p className="sm" style={{marginBottom:10,lineHeight:1.65,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
          {safeDream.preview ?? ""}
        </p>

        {/* Tags */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {(safeDream.tags ?? []).map(t=><span key={t} className="tag">{t}</span>)}
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:12,marginBottom:12,fontSize:".76rem",color:"var(--ink3)"}}>
          <span><I n="heart" s={11} c="var(--ink3)"/> {safeDream.likes ?? 0}</span>
          <span>💬 {safeDream.comments ?? 0}</span>
          {safeListing.type === "AUCTION" && <span style={{color:"var(--acc)"}}>👥 {safeBids.length}명 입찰</span>}
        </div>

        {/* ── CTA by trade type ── */}
        {!isSold && (
          <>
            {safeListing.type === "FIXED" && (
              <button className="btn bp bsm" style={{width:"100%",justifyContent:"center"}}>
                <I n="coins" s={12}/> 구매 {curPrice.toLocaleString()}D
              </button>
            )}
            {safeListing.type === "OFFER" && (
              <button className="btn bsm" style={{width:"100%",justifyContent:"center",background:"var(--acc-lt)",color:"var(--acc)",border:"1px solid rgba(107,92,231,.25)",fontWeight:600}}>
                💬 가격 제안 (희망가 {(safeListing.priceFixed??0).toLocaleString()}D)
              </button>
            )}
            {safeListing.type === "AUCTION" && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,padding:"8px 11px",borderRadius:10,background:"rgba(224,92,92,.06)",border:"1px solid rgba(224,92,92,.18)"}}>
                  <div>
                    <div style={{fontSize:".62rem",color:"var(--err)",fontWeight:600}}>현재가</div>
                    <div style={{fontFamily:"var(--fd)",fontSize:"1.05rem",color:"var(--err)",fontWeight:400}}>{curPrice.toLocaleString()}D</div>
                  </div>
                  {safeListing.endsAt && (
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:".62rem",color:"var(--err)",fontWeight:600}}>마감</div>
                      <div style={{fontFamily:"var(--fd)",fontSize:"1.05rem",color:"var(--err)"}}>{countdown ?? "—"}</div>
                    </div>
                  )}
                </div>
                <button className="btn bsm" style={{width:"100%",justifyContent:"center",background:"rgba(224,92,92,.09)",color:"var(--err)",border:"1px solid rgba(224,92,92,.2)",fontWeight:600}}>
                  ⏱ 입찰하기 (최소 {(curPrice+minIncrement(curPrice)).toLocaleString()}D)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   § 12.  SELL MODAL  (3-step — now creates a Listing in store)
───────────────────────────────────────────────────────────────── */
function SellModal({ userDreams, onClose, onCreate }) {
  const [step,     setStep]     = useState(1);
  const [dreamId,  setDreamId]  = useState("");
  const [tradeType,setTradeType]= useState("FIXED");
  const [fixedP,   setFixedP]   = useState(400);
  const [startP,   setStartP]   = useState(200);
  const [buyoutP,  setBuyoutP]  = useState("");
  const [duration, setDuration] = useState(24);
  const [isAuction]= [tradeType==="AUCTION"];

  const selDream = userDreams.find(d => d.id === dreamId) ?? null;

  function handleCreate() {
    const now = Date.now();
    const newListing = {
      id: `l${now}`,
      dreamId: dreamId,
      sellerId: "you",
      type: tradeType,
      status: "ACTIVE",
      priceFixed:  tradeType === "FIXED"   ? fixedP : tradeType === "OFFER" ? fixedP : null,
      startPrice:  tradeType === "AUCTION" ? startP : null,
      currentPrice:tradeType === "AUCTION" ? startP : null,
      minIncrement: minIncrement(startP),
      buyoutPrice:  tradeType === "AUCTION" && buyoutP ? parseInt(buyoutP,10) : null,
      startsAt: now,
      endsAt:   tradeType === "AUCTION" ? now + duration * 3600 * 1000 : null,
      createdAt: now,
      snipeCount: 0,
    };
    onCreate(newListing);
    onClose();
  }

  return (
    <div className="ovl" onClick={onClose}>
      <div className="glg mbox" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><p className="lbl" style={{marginBottom:3}}>판매 등록</p><h3 style={{fontFamily:"var(--fd)",fontSize:"1.35rem"}}>내 꿈 마켓에 올리기</h3></div>
          <button className="bico" onClick={onClose}><I n="x" s={14}/></button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {[1,2,3].map(s=><div key={s} style={{flex:1,height:3,borderRadius:2,background:step>=s?"var(--acc)":"rgba(0,0,0,.09)",transition:"background .3s"}}/>)}
        </div>

        {step===1 && (
          <>
            <div className="field" style={{marginBottom:16}}>
              <label className="flbl">판매할 꿈</label>
              <select className="inp fsel" value={dreamId} onChange={e=>setDreamId(e.target.value)}>
                <option value="">선택…</option>
                {userDreams.map(d=><option key={d.id} value={d.id}>{d.title} [{d.fortune?.grade?.ko??"미분석"}]</option>)}
              </select>
            </div>
            {selDream?.fortune && (
              <div className={`fc-${selDream.fortune.grade?.id}`} style={{padding:"12px 15px",marginBottom:16}}>
                <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
                  <FortuneBadge fortune={selDream.fortune}/>
                  <span style={{fontSize:".78rem",fontWeight:600}}>Score {selDream.fortune.score}/100</span>
                </div>
                <p style={{fontSize:".80rem",color:"var(--gold)",fontWeight:600}}>추천가: {selDream.fortune.price?.min}–{selDream.fortune.price?.max}D</p>
              </div>
            )}
            <button className="btn bp" style={{width:"100%",justifyContent:"center"}} disabled={!dreamId} onClick={()=>setStep(2)}>다음 → 거래 방식</button>
          </>
        )}

        {step===2 && (
          <>
            <p className="lbl" style={{marginBottom:10}}>거래 방식 선택</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
              {[
                {t:"FIXED",  icon:"💰", name:"즉시구매 (Fixed)",  desc:"정가 설정. 구매자가 바로 구매 가능"},
                {t:"OFFER",  icon:"💬", name:"가격 제안 (Offer)", desc:"희망가를 제시하고, 구매자가 제안 가능"},
                {t:"AUCTION",icon:"⏱", name:"경매 (Auction)",    desc:"시작가 설정, 최고 입찰자에게 낙찰"},
              ].map(o=>(
                <button key={o.t} onClick={()=>setTradeType(o.t)}
                  style={{padding:"13px 15px",borderRadius:"var(--r1)",border:`1.5px solid ${tradeType===o.t?"var(--acc)":"rgba(0,0,0,.09)"}`,cursor:"pointer",textAlign:"left",background:tradeType===o.t?"var(--acc-lt)":"transparent",transition:"all .18s"}}>
                  <div style={{fontWeight:600,marginBottom:3,fontSize:".87rem"}}>{o.icon} {o.name}</div>
                  <div style={{fontSize:".75rem",color:"var(--ink3)"}}>{o.desc}</div>
                </button>
              ))}
            </div>
            {(tradeType==="FIXED"||tradeType==="OFFER") && (
              <div className="field" style={{marginBottom:14}}>
                <label className="flbl">{tradeType==="FIXED"?"즉시구매가":"판매 희망가"} — {fixedP}D</label>
                <input type="range" min={10} max={3000} step={10} value={fixedP} onChange={e=>setFixedP(+e.target.value)} style={{width:"100%",accentColor:"var(--acc)"}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}><span className="sm">10D</span><span className="sm">3000D</span></div>
              </div>
            )}
            {tradeType==="AUCTION" && (
              <>
                <div className="field" style={{marginBottom:12}}>
                  <label className="flbl">시작가 — {startP}D</label>
                  <input type="range" min={10} max={2000} step={10} value={startP} onChange={e=>setStartP(+e.target.value)} style={{width:"100%",accentColor:"var(--acc)"}}/>
                </div>
                <div className="field" style={{marginBottom:12}}>
                  <label className="flbl">즉시 낙찰가 (선택)</label>
                  <input className="inp" type="number" value={buyoutP} onChange={e=>setBuyoutP(e.target.value)} placeholder="없으면 비워두세요"/>
                </div>
                <div className="field" style={{marginBottom:12}}>
                  <label className="flbl">경매 기간 — {duration}시간</label>
                  <input type="range" min={1} max={72} value={duration} onChange={e=>setDuration(+e.target.value)} style={{width:"100%",accentColor:"var(--acc)"}}/>
                </div>
              </>
            )}
            <div style={{padding:"10px 14px",background:"var(--gold-lt)",borderRadius:10,marginBottom:16,fontSize:".80rem",color:"var(--gold)"}}>
              수수료 10% · 예상 수령: <strong>{Math.round((tradeType==="AUCTION"?startP:fixedP)*0.9)}D+</strong>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn bg" style={{flex:"0 0 72px"}} onClick={()=>setStep(1)}>← 이전</button>
              <button className="btn bp" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(3)}>다음 → 확인</button>
            </div>
          </>
        )}

        {step===3 && (
          <>
            <div style={{padding:16,background:"var(--acc-lt)",borderRadius:16,marginBottom:16}}>
              <div style={{fontFamily:"var(--fd)",fontSize:"1.05rem",marginBottom:5}}>{selDream?.title ?? "—"}</div>
              {selDream?.fortune && <FortuneBadge fortune={selDream.fortune}/>}
              <div style={{marginTop:10,display:"flex",justifyContent:"space-between"}}>
                <span className="sm">{tradeType==="FIXED"?"즉시구매":tradeType==="OFFER"?"가격 제안":`경매 ${duration}h`}</span>
                <span style={{fontFamily:"var(--fd)",fontSize:"1.1rem",color:"var(--gold)"}}>{tradeType==="AUCTION"?`시작가 ${startP}D`:`${fixedP}D`}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn bg" style={{flex:"0 0 72px"}} onClick={()=>setStep(2)}>← 이전</button>
              <button className="btn bp" style={{flex:1,justifyContent:"center"}} onClick={handleCreate}><I n="check" s={14}/> 등록</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WALLET CHIP  (reads live store balance)
───────────────────────────────────────────────────────────────── */
function WalletChip({ wallet }) {
  return <div className="wallet-chip"><I n="coins" s={13}/> {(wallet ?? 2000).toLocaleString()} D</div>;
}

/* ─────────────────────────────────────────────────────────────────
───────────────────────────────────────────────────────────────── */
function WallView({ userDreams, onWalletChange }) {
  const { store, placeBid, makeOffer, acceptCounter, declineCounter, buyFixed } = useStore();
  useEffect(() => { onWalletChange && onWalletChange(store.wallet); }, [store.wallet]);

  /* extra listings added via SellModal */
  const [extraListings, setExtraListings] = useState([]);

  const allListings = [...store.listings, ...extraListings];

  const [filterType, setFilterType] = useState("all");
  const [sortBy,     setSortBy]     = useState("popular");
  const [liked,      setLiked]      = useState([]);
  const [activeId,   setActiveId]   = useState(null);   // open ListingDetail
  const [sellOpen,   setSellOpen]   = useState(false);

  /* Resolve listing → dream mapping */
  function getDream(listing) {
    return PRICED_DREAMS.find(d => d.id === listing?.dreamId) ?? null;
  }

  /* filter + sort */
  const visible = allListings
    .filter(l => {
      if (filterType !== "all" && l.type !== filterType) return false;
      return true;
    })
    .sort((a, b) => {
      const da = getDream(a), db = getDream(b);
      if (sortBy === "popular")  return ((db?.likes??0) - (da?.likes??0));
      if (sortBy === "price_h")  return ((b.priceFixed??b.currentPrice??0) - (a.priceFixed??a.currentPrice??0));
      if (sortBy === "price_l")  return ((a.priceFixed??a.currentPrice??0) - (b.priceFixed??b.currentPrice??0));
      return (b.createdAt??0) - (a.createdAt??0);
    });

  const activeListing = allListings.find(l => l.id === activeId) ?? null;
  const activeDream   = getDream(activeListing);

  /* stats */
  const activeCount  = allListings.filter(l => l.status === "ACTIVE").length;
  const auctionCount = allListings.filter(l => l.type === "AUCTION" && l.status === "ACTIVE").length;
  const soldCount    = allListings.filter(l => l.status === "SOLD").length;

  const pill = active => ({
    padding:"6px 15px", borderRadius:50,
    border:`1.5px solid ${active?"var(--acc)":"rgba(0,0,0,.09)"}`,
    cursor:"pointer", fontFamily:"var(--fb)", fontSize:".76rem", fontWeight:500,
    transition:"all .18s", background:active?"var(--acc)":"rgba(255,255,255,.6)",
    color:active?"#fff":"var(--ink3)",
  });

  return (
    <div className="page">
      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:14}}>
        <div>
          <p className="lbl" style={{marginBottom:8}}>Dream Marketplace</p>
          <h1 className="disp">꿈을 사고<br/><em style={{color:"var(--acc)",fontStyle:"italic"}}>꿈을 팔다</em></h1>
          <p className="sm" style={{marginTop:10}}>즉시구매 · 가격 제안 · 경매 · 흉몽 Exchange</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end"}}>
          <button className="btn bp" onClick={()=>setSellOpen(true)}><I n="coins" s={14}/> 내 꿈 판매 등록</button>
          <div style={{display:"flex",gap:10}}>
            {[
              {l:"활성 리스팅",v:activeCount,    c:"var(--acc)"},
              {l:"진행 중 경매",v:auctionCount,  c:"var(--err)"},
              {l:"판매 완료",   v:soldCount,      c:"var(--ok)"},
              {l:"내 지갑",     v:`${store.wallet.toLocaleString()}D`, c:"var(--gold)"},
            ].map(s=>(
              <div key={s.l} style={{textAlign:"center",padding:"6px 12px",borderRadius:10,background:"var(--surface)",border:"1px solid var(--border)"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:".95rem",color:s.c,fontWeight:400}}>{s.v}</div>
                <div style={{fontSize:".60rem",color:"var(--ink3)",fontWeight:500,marginTop:1}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="g" style={{padding:"14px 18px",marginBottom:22,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
        <div>
          <p className="lbl" style={{marginBottom:7}}>거래 유형</p>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {[["all","전체"],["FIXED","💰 즉시구매"],["OFFER","💬 가격 제안"],["AUCTION","⏱ 경매"]].map(([k,l])=>(
              <button key={k} style={pill(filterType===k)} onClick={()=>setFilterType(k)}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{width:1,height:36,background:"rgba(0,0,0,.07)"}}/>
        <div>
          <p className="lbl" style={{marginBottom:7}}>정렬</p>
          <div style={{display:"flex",gap:5}}>
            {[["popular","인기"],["latest","최신"],["price_h","고가"],["price_l","저가"]].map(([k,l])=>(
              <button key={k} style={pill(sortBy===k)} onClick={()=>setSortBy(k)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cards grid ── */}
      {visible.length === 0 ? (
        <div className="g" style={{padding:52,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>🔍</div>
          <p style={{fontFamily:"var(--fd)",fontSize:"1.05rem",color:"var(--ink3)"}}>조건에 맞는 리스팅이 없습니다</p>
        </div>
      ) : (
        <div className="g2 stag">
          {visible.map(listing => {
            const dream = getDream(listing);
            if (!dream) return null;
            return (
              <WallCard
                key={listing.id}
                dream={dream}
                listing={listing}
                bids={store.bids}
                onOpenDetail={id => setActiveId(id)}
              />
            );
          })}
        </div>
      )}

      {/* ── Modals ── */}
      {activeListing && activeDream && (
        <ListingDetail
          listing={activeListing}
          dream={activeDream}
          bids={store.bids}
          offers={store.offers}
          wallet={store.wallet}
          onClose={() => setActiveId(null)}
          onPlaceBid={placeBid}
          onMakeOffer={makeOffer}
          onBuyFixed={buyFixed}
          onAcceptCounter={acceptCounter}
          onDeclineCounter={declineCounter}
        />
      )}

      {sellOpen && (
        <SellModal
          userDreams={userDreams}
          onClose={() => setSellOpen(false)}
          onCreate={listing => setExtraListings(p => [...p, listing])}
        />
      )}
    </div>
  );
}

function DreamMarketApp() {
  const [route,setRoute]       = useState("home");
  const [navTab,setNavTab]     = useState("home");
  const [dreams,setDreams]     = useState(DREAMS_INIT);
  const [selectedId,setSelectedId] = useState(null);
  const [editDream,setEditDream]   = useState(null);
  const [scrolled,setScrolled]     = useState(false);
  const [walletDisplay, setWalletDisplay] = useState(2000);

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>4);
    window.addEventListener("scroll",h,{passive:true});
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const goHome = () => { setRoute("home"); setNavTab("home"); window.scrollTo({top:0,behavior:"smooth"}); };

  const openDetail = id => { setSelectedId(id); setRoute("detail"); window.scrollTo({top:0,behavior:"smooth"}); };
  const openEditor = (d=null) => { setEditDream(d); setRoute("editor"); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleSave = dream => {
    setDreams(p => { const ex=p.find(d=>d.id===dream.id); return ex?p.map(d=>d.id===dream.id?dream:d):[dream,...p]; });
    setSelectedId(dream.id);
    setRoute("home"); setNavTab("home");
  };

  const handleSaveAnalysis = (dreamId, analysis, fortune) => {
    setDreams(p => p.map(d => d.id===dreamId ? {...d, analysis, analyzed:true, fortune:fortune??runFortune({...d,analysis})} : d));
  };

  const handleSaveVideo = (dreamId, video) => {
    setDreams(p => p.map(d => d.id===dreamId ? {...d, video} : d));
  };

  const handleNavTab = tab => { setNavTab(tab); setRoute(tab); window.scrollTo({top:0,behavior:"smooth"}); };

  const selectedDream = dreams.find(d=>d.id===selectedId)??null;
  const inEditor = route==="editor";

  const NAV_TABS = [
    {id:"home",    label:"Home",    icon:"home"},
    {id:"library", label:"Library", icon:"library"},
    {id:"wall",    label:"Wall",    icon:"wall"},
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">
        {/* NAV */}
        <nav className={`nav ${scrolled?"sc":""}`}>
          <div className="nav-brand" onClick={goHome}>드림<em>마켓</em></div>
          {!inEditor && (
            <div className="npills">
              {NAV_TABS.map(t=>(
                <button key={t.id} className={`npill ${navTab===t.id&&route!=="detail"?"on":""}`} onClick={()=>handleNavTab(t.id)}>
                  <I n={t.icon} s={14}/><span>{t.label}</span>
                </button>
              ))}
            </div>
          )}
          <WalletChip wallet={walletDisplay}/>
        </nav>

        {/* CONTENT */}
        <main>
          {route==="home"    && <HomeView    dreams={dreams} onCard={openDetail} onNew={()=>openEditor()}/>}
          {route==="library" && <LibraryView dreams={dreams} onCard={openDetail}/>}
          {route==="wall"    && <WallView    userDreams={dreams} onWalletChange={setWalletDisplay}/>}
          {route==="detail"  && selectedDream && (
            <DreamDetailPage
              dream={selectedDream}
              onBack={goHome}
              onSaveAnalysis={handleSaveAnalysis}
              onSaveVideo={handleSaveVideo}
            />
          )}
          {route==="editor"  && <EditorView dream={editDream} onSave={handleSave} onCancel={goHome}/>}
        </main>
      </div>
    </>
  );
}

export default DreamMarketApp;
