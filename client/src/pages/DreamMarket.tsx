import { useState, useEffect, useRef, useCallback } from "react";

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
  /* ── Dream System v2 ── */
  .dream-locked-overlay { position:relative;overflow:hidden; }
  .dream-locked-overlay::after { content:"🔒 잠긴 꿈";position:absolute;inset:0;background:rgba(18,15,31,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.78rem;font-weight:700;letter-spacing:.06em;border-radius:inherit; }
  .ts-chip { display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:50px;font-size:.62rem;font-weight:500;color:var(--ink3);background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.06); }
  .verified-badge { display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:50px;font-size:.63rem;font-weight:700;background:rgba(201,168,76,.12);color:var(--gold);border:1px solid rgba(201,168,76,.28); }
  .tag-reported { opacity:.38;text-decoration:line-through;cursor:pointer; }
  .tag-feedback { cursor:pointer;transition:opacity .15s; }
  .tag-feedback:hover { opacity:.55; }
  .similar-card { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--r1);background:rgba(255,255,255,.6);border:1px solid rgba(0,0,0,.06);cursor:pointer;transition:all .15s var(--ease); }
  .similar-card:hover { background:var(--acc-lt);border-color:rgba(107,92,231,.2);transform:translateX(3px); }
  .rec-timer { font-variant-numeric:tabular-nums;font-weight:700;color:var(--err);font-size:.85rem; }
  @keyframes recPulse { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:.7} }
  .rec-dot { width:9px;height:9px;border-radius:50%;background:var(--err);animation:recPulse .9s ease-in-out infinite;flex-shrink:0; }
  .lock-toggle { width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0; }
  .lock-thumb  { position:absolute;top:3px;border-radius:50%;width:18px;height:18px;background:#fff;transition:left .2s var(--ease);box-shadow:0 1px 4px rgba(0,0,0,.22); }
  .rank-pill { display:inline-flex;align-items:center;gap:3px;padding:2px 9px;border-radius:50px;font-size:.62rem;font-weight:700;background:rgba(107,92,231,.09);color:var(--acc);border:1px solid rgba(107,92,231,.18); }
  .streak-mini { display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:50px;font-size:.72rem;font-weight:700;background:rgba(239,68,68,.08);color:#ef4444;border:1px solid rgba(239,68,68,.18); }

  /* ── Edit Policy ── */
  .edited-badge { display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:50px;font-size:.63rem;font-weight:700;background:rgba(217,110,48,.10);color:var(--warn);border:1px solid rgba(217,110,48,.28); }
  .edit-locked-banner { padding:14px 18px;border-radius:var(--r1);background:rgba(224,92,92,.06);border:1px solid rgba(224,92,92,.2);margin-bottom:16px; }
  .edit-warn-banner { padding:14px 18px;border-radius:var(--r1);background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.22);margin-bottom:16px; }
  .edit-section-locked { position:relative; }
  .edit-section-locked::after { content:"🔒 수정 불가";position:absolute;inset:0;background:rgba(247,245,240,.84);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;color:var(--ink3);border-radius:inherit;pointer-events:none; }

  /* ── Memory Timeline ── */
  .mem-timeline { display:flex;flex-direction:column;gap:0; }
  .mem-node { display:flex;gap:14px;position:relative; }
  .mem-node::before { content:"";position:absolute;left:15px;top:34px;bottom:0;width:2px;background:linear-gradient(180deg,rgba(107,92,231,.22),rgba(107,92,231,.03)); }
  .mem-node:last-child::before { display:none; }
  .mem-dot { width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.85rem;margin-top:2px; }
  .mem-dot-origin { background:rgba(107,92,231,.13);border:2px solid rgba(107,92,231,.35); }
  .mem-dot-extra  { background:rgba(78,175,128,.12);border:2px solid rgba(78,175,128,.3); }
  .mem-card { flex:1;padding:16px 18px;border-radius:var(--r2);margin-bottom:14px;background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.07);animation:memIn .3s var(--ease) both; }
  .mem-card-origin { border-left:3px solid var(--acc); }
  .mem-card-extra  { border-left:3px solid var(--ok); }
  @keyframes memIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

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
/* ─────────────────────────────────────────────────────────────────
   DREAM AURA STATE HELPERS
───────────────────────────────────────────────────────────────── */
/** 꿈 dream 객체에서 aura 관련 초기값을 안전하게 반환 */
function getAuraMeta(dream) {
  return dream?.auraMeta ?? { generationCount: 0, lastGeneratedAt: null };
}

const DREAMS_INIT = (() => {
  const raw = [
    {
      id:"d1", title:"수중 도서관", mode:"narrative",
      content:"거대한 수중 도서관에 있었다. 책들이 물결 따라 흐르고 있었고, 나는 [?] 찾으려 했지만 도무지 기억나지 않았다. 출구는 끝이 없었다.",
      fragments:[], tags:["물","도서관","미로"], date:"2025-01-03",
      rarity:"rare", status:"Completed", verified:true, forSale:true, price:240,
      editCount:0, extraMemories:[],
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
  return raw.map(d => ({
    ...d,
    fortune:  runFortune(d),
    aura:     d.aura     ?? null,
    auraMeta: d.auraMeta ?? { generationCount: 0, lastGeneratedAt: null },
  }));
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
function HomeView({ dreams, onCard, onNew, streak }) {
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

      {/* Dream Streak */}
      {streak && <div style={{marginBottom:18}}><StreakBadge streak={streak}/></div>}

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
          const f   = dream.fortune;
          const gid = f?.grade.id;
          const isLocked = !!dream.locked;
          /* 메인 화면: 태그 3~5개만 표시 */
          const cardTags = (dream.tags ?? []).slice(0, 5);
          return (
            <div key={dream.id}
              className={`g dcard${isLocked ? " dream-locked-overlay" : ""}`}
              onClick={() => onCard(dream.id)}
              style={{ borderLeftColor: gid ? `var(--${gid})` : "transparent", position:"relative" }}>

              {/* ── 헤더 행 ── */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"var(--fd)",fontSize:"1.08rem",fontWeight:500}}>{dream.title}</span>
                  {isLocked && <span style={{fontSize:12}}>🔒</span>}
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0,marginLeft:8}}>
                  {f && <FortuneBadge fortune={f}/>}
                  <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
                </div>
              </div>

              {/* ── Timestamp + 배지 행 ── */}
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                {/* Verified 배지 */}
                {dream.verified && <span className="verified-badge">✦ Verified</span>}
                <EditedBadge dream={dream}/>
                {/* Rank Score */}
                {dream.rankScore > 0 && (
                  <span className="rank-pill">⚡ {dream.rankScore}pt</span>
                )}
                {/* Timestamp — createdAt 우선, 없으면 date */}
                <span className="ts-chip">
                  🕐 {dream.createdAt
                    ? formatDreamTime(dream.createdAt, { timezone: dream.timezone, compact: true })
                    : dream.date}
                </span>
              </div>

              {/* ── 본문 미리보기 (잠긴 꿈은 숨김) ── */}
              {!isLocked && (
                <p className="sm" style={{marginBottom:f?10:12,lineHeight:1.65,overflow:"hidden",
                  display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                  {dream.mode==="fragment"
                    ? (dream.structuredFrag
                        ? [dream.structuredFrag.place, dream.structuredFrag.event].filter(Boolean).join(" · ")
                        : dream.fragments.map(fr=>fr.word).join(" · "))
                    : dream.content.replace(/\[\?\]/g,"…")}
                </p>
              )}

              {/* ── Fortune mini bar ── */}
              {f && !isLocked && (
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 12px",
                  borderRadius:10,background:`var(--${gid}-lt)`,border:`1px solid var(--${gid}-bd)`}}>
                  <span style={{fontFamily:"var(--fd)",fontSize:"1.4rem",fontWeight:400,color:`var(--${gid})`,lineHeight:1}}>{f.score}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:".72rem",fontWeight:700,color:`var(--${gid})`}}>{f.grade.ko} {"—"} {f.grade.label}</div>
                    <div className="sm" style={{fontSize:".68rem",marginTop:1}}>{f.interp.slice(0,52)}…</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:".65rem",color:"var(--gold)",fontWeight:600}}>추천가</div>
                    <div style={{fontSize:".75rem",fontWeight:700,color:"var(--gold)"}}>{f.price.min}-{f.price.max}D</div>
                  </div>
                </div>
              )}

              {/* ── 태그 (3~5개) + 상태 배지 ── */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                {cardTags.map(t => <span key={t} className="tag">{t}</span>)}
                {(dream.tags ?? []).length > 5 && (
                  <span className="tag" style={{opacity:.55}}>+{dream.tags.length-5}</span>
                )}
                <div style={{marginLeft:"auto",display:"flex",gap:5}}>
                  {dream.analyzed && <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:50,fontSize:".67rem",fontWeight:600,background:"var(--ok-lt)",color:"var(--ok)"}}>분석 ✓</span>}
                  {dream.forSale  && <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:50,fontSize:".67rem",fontWeight:600,background:"var(--gold-lt)",color:"var(--gold)"}}>{dream.price}D</span>}
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
                <span style={{color:"var(--gold)",fontWeight:700}}>{fort.price.min}-{fort.price.max}D</span>
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

/* ═══════════════════════════════════════════════════════════════════
   DREAM AURA SYSTEM
   Dream Text → Visual DNA → Canvas Loop Animation
   생성 비용: 1회 무료 → 재생성 5/10/15 Dream Coins
═══════════════════════════════════════════════════════════════════ */

/* ── Visual DNA: emotion → palette ── */
const AURA_PALETTES = {
  great:   { bg:["#0a0800","#1a1000","#2a1e00"], orb:["#ffd700","#ffaa00","#ffe566","#c8860a"], glow:"#ffcc00" },
  good:    { bg:["#061208","#0a2010","#0d3018"], orb:["#4eff9a","#2adb7a","#a0ffd0","#1aaa5a"], glow:"#40e080" },
  neutral: { bg:["#080a18","#0c1028","#141838"], orb:["#7090ff","#a0b8ff","#4466dd","#c8d8ff"], glow:"#6080ff" },
  warn:    { bg:["#100800","#200e00","#301800"], orb:["#ff8c00","#ffb347","#dd6600","#ffd080"], glow:"#ff9900" },
  dark:    { bg:["#080004","#120008","#1c000c"], orb:["#cc2244","#ff4466","#880022","#ff8899"], glow:"#cc0033" },
};

/* ── motion pattern: emotion → style ── */
const MOTION_PATTERNS = {
  peaceful:   "float",
  joy:        "orbit",
  mystery:    "ripple",
  nostalgia:  "drift",
  warning:    "distort",
  dark:       "flicker",
};

/* ── symbol → floating element shapes ── */
const SYMBOL_SHAPES = {
  별:    "star",  달:    "crescent", 물:    "drop",  계단:  "step",
  용:    "scale", 구름:  "cloud",    불:    "flame",  바람:  "arc",
  나비:  "wing",  꽃:    "petal",    새:    "feather",산:    "peak",
  빛:    "ray",   거울:  "diamond",  시계:  "ring",   미상:  "orb",
};

/* ── Aura cost schedule ── */
const AURA_COST = [0, 0, 5, 10, 15, 20];   // index = generationCount (0,1=free)
function auraCost(count) { return AURA_COST[Math.min(count, AURA_COST.length-1)]; }

/* ─────────────────────────────────────────────────────────────────
   buildVisualDNA  — Dream → Visual DNA
───────────────────────────────────────────────────────────────── */
function buildVisualDNA(dream, seed = 0) {
  const grade   = dream.fortune?.grade?.id ?? "neutral";
  const symbols = dream.fortune?.symbols?.map(s => s.name) ?? ["미상"];
  const emos    = dream.analysis?.emotions ?? [];
  const score   = dream.fortune?.score ?? 50;

  /* palette */
  const palette = AURA_PALETTES[grade] ?? AURA_PALETTES.neutral;

  /* dominant emotion → motion */
  const topEmo   = emos[0]?.label ?? "mystery";
  const emoMap   = { 평온:"peaceful", 기쁨:"joy", 경이:"mystery",
                     그리움:"nostalgia", 불안:"warning", 공포:"dark", 설렘:"joy" };
  const motion   = MOTION_PATTERNS[emoMap[topEmo] ?? "mystery"];

  /* symbol shapes */
  const shapes   = [...new Set(symbols.map(s => SYMBOL_SHAPES[s] ?? "orb"))].slice(0,3);

  /* particle density */
  const density  = score > 75 ? "dense" : score > 40 ? "medium" : "sparse";
  const pCount   = density === "dense" ? 28 : density === "medium" ? 16 : 8;

  /* light style */
  const lightMap = { great:"golden", good:"soft", neutral:"ambient", warn:"dim", dark:"flicker" };
  const light    = lightMap[grade] ?? "ambient";

  /* deterministic-ish variation from seed */
  const rng = (n) => Math.abs(Math.sin(seed * 9301 + n * 49297)) % 1;

  return {
    auraID:   `aura_${dream.id}_s${seed}`,
    grade, palette, motion, shapes, density, pCount, light,
    seed, rng,
    orbCount: 4 + Math.floor(rng(1) * 5),
    speed:    0.25 + rng(2) * 0.55,
    scale:    0.8  + rng(3) * 0.5,
  };
}

/* ─────────────────────────────────────────────────────────────────
   DreamAuraCanvas  — Canvas 루프 애니메이션 렌더러
───────────────────────────────────────────────────────────────── */
function DreamAuraCanvas({ dna, size = 320, autoPlay = false, compact = false }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const stRef     = useRef({ t: 0, orbs: [], particles: [], playing: false });
  const [playing, setPlaying] = useState(autoPlay);

  const H = compact ? 180 : size * 0.62;
  const W = size;

  /* ── init scene ── */
  function initScene(c) {
    const st  = stRef.current;
    const pal = dna.palette;

    /* orbs */
    st.orbs = Array.from({ length: dna.orbCount }, (_, i) => {
      const angle = (i / dna.orbCount) * Math.PI * 2 + dna.rng(i + 10) * 0.8;
      return {
        x: W * (0.2 + dna.rng(i) * 0.6),
        y: H * (0.15 + dna.rng(i + 5) * 0.7),
        r: (22 + dna.rng(i + 20) * 52) * dna.scale,
        color: pal.orb[i % pal.orb.length],
        phase:  dna.rng(i + 30) * Math.PI * 2,
        phaseY: dna.rng(i + 40) * Math.PI * 2,
        orbitR: 18 + dna.rng(i + 50) * 38,
        baseX:  W * (0.2 + dna.rng(i) * 0.6),
        baseY:  H * (0.15 + dna.rng(i + 5) * 0.7),
        speed:  dna.speed * (0.5 + dna.rng(i + 60) * 1.2),
        alpha:  0.18 + dna.rng(i + 70) * 0.38,
      };
    });

    /* particles */
    st.particles = Array.from({ length: dna.pCount }, (_, i) => ({
      x: dna.rng(i + 100) * W,
      y: dna.rng(i + 110) * H,
      r: 1 + dna.rng(i + 120) * 3,
      color: pal.orb[(i * 3) % pal.orb.length],
      dx: (dna.rng(i + 130) - 0.5) * dna.speed * 0.6,
      dy: -(0.2 + dna.rng(i + 140) * 0.5) * dna.speed,
      alpha: 0.3 + dna.rng(i + 150) * 0.5,
      life: dna.rng(i + 160),
    }));
  }

  /* ── draw one frame ── */
  function frame() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const st  = stRef.current;
    const t   = st.t;
    const pal = dna.palette;

    /* background gradient */
    const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bg.addColorStop(0,   pal.bg[0]);
    bg.addColorStop(0.5, pal.bg[1]);
    bg.addColorStop(1,   pal.bg[2] ?? pal.bg[1]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── motion patterns ── */
    st.orbs.forEach((o, i) => {
      let x = o.baseX, y = o.baseY;

      if (dna.motion === "float") {
        x += Math.sin(t * o.speed + o.phase)  * o.orbitR * 0.9;
        y += Math.cos(t * o.speed + o.phaseY) * o.orbitR * 0.6;
      } else if (dna.motion === "orbit") {
        const a = t * o.speed + o.phase;
        x += Math.cos(a) * o.orbitR;
        y += Math.sin(a * 0.7) * o.orbitR * 0.55;
      } else if (dna.motion === "ripple") {
        x += Math.sin(t * o.speed + o.phase + y * 0.012) * o.orbitR;
        y += Math.cos(t * o.speed * 0.7 + o.phaseY) * o.orbitR * 0.45;
      } else if (dna.motion === "drift") {
        x += Math.sin(t * o.speed * 0.5 + o.phase) * o.orbitR * 1.3;
        y += (t * o.speed * 0.12) % H - H * 0.1;
      } else if (dna.motion === "distort") {
        x += Math.sin(t * o.speed + o.phase) * o.orbitR * (1 + Math.sin(t*0.3)*0.4);
        y += Math.cos(t * o.speed * 1.3 + o.phaseY) * o.orbitR * 0.8;
      } else { /* flicker */
        x += Math.sin(t * o.speed + o.phase) * o.orbitR;
        y += Math.cos(t * o.speed + o.phaseY) * o.orbitR * 0.7;
      }

      o.x = x; o.y = y;

      /* glow flicker for dark/warn */
      const flickerA = dna.light === "flicker"
        ? o.alpha * (0.5 + 0.5 * Math.sin(t * 3.7 + i))
        : o.alpha;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, o.r);
      grad.addColorStop(0,   o.color + "ee");
      grad.addColorStop(0.4, o.color + "77");
      grad.addColorStop(1,   o.color + "00");
      ctx.globalAlpha = flickerA;
      ctx.beginPath();
      ctx.arc(x, y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    /* ── particles ── */
    ctx.globalAlpha = 1;
    st.particles.forEach(p => {
      p.x  += p.dx;
      p.y  += p.dy;
      p.life += 0.004;
      if (p.life >= 1 || p.y < -4 || p.x < -4 || p.x > W + 4) {
        p.x    = dna.rng(p.life * 999 % 1 * 200 + 200) * W;
        p.y    = H + 4;
        p.life = 0;
      }
      const a = p.alpha * Math.sin(p.life * Math.PI);
      ctx.globalAlpha = Math.max(0, a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    /* ── central glow ── */
    ctx.globalAlpha = 1;
    const cx = W * 0.5, cy = H * 0.48;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.42);
    cg.addColorStop(0,   pal.glow + "22");
    cg.addColorStop(0.5, pal.glow + "0a");
    cg.addColorStop(1,   pal.glow + "00");
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, W, H);

    /* ── light styles ── */
    if (dna.light === "golden") {
      /* golden shimmer streaks */
      for (let i = 0; i < 3; i++) {
        const sx = W * (0.2 + i * 0.25 + Math.sin(t * 0.4 + i) * 0.05);
        const sy = 0, ey = H;
        const sg = ctx.createLinearGradient(sx, sy, sx + 8, ey);
        sg.addColorStop(0,   "#ffd70000");
        sg.addColorStop(0.4, "#ffd70018");
        sg.addColorStop(0.6, "#ffd70018");
        sg.addColorStop(1,   "#ffd70000");
        ctx.fillStyle = sg;
        ctx.fillRect(sx, 0, 6 + Math.sin(t + i) * 3, H);
      }
    }

    /* scanlines */
    for (let y = 0; y < H; y += 4) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, y, W, 1);
    }

    /* vignette */
    ctx.globalAlpha = 1;
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.22, W/2, H/2, H*0.82);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.62)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    st.t += 0.018;
    if (st.playing) rafRef.current = requestAnimationFrame(frame);
  }

  /* ── mount/dna change ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = W; c.height = H;
    initScene(c);
    /* draw one static frame immediately */
    frame();
    if (autoPlay || stRef.current.playing) {
      stRef.current.playing = true;
      setPlaying(true);
      rafRef.current = requestAnimationFrame(frame);
    }
    return () => {
      stRef.current.playing = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dna.auraID, W, H]);

  function togglePlay() {
    const st = stRef.current;
    if (st.playing) {
      st.playing = false;
      setPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      st.playing = true;
      setPlaying(true);
      rafRef.current = requestAnimationFrame(frame);
    }
  }

  return (
    <div style={{ position:"relative", borderRadius:"var(--r2)", overflow:"hidden",
      cursor:"pointer", userSelect:"none" }} onClick={togglePlay}>
      <canvas ref={canvasRef} style={{ width:"100%", height:H, display:"block" }}/>
      {!playing && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
          justifyContent:"center", background:"rgba(0,0,0,.25)" }}>
          <div style={{ width:52, height:52, borderRadius:"50%",
            background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            backdropFilter:"blur(6px)" }}>
            <I n="play" s={20} c="rgba(255,255,255,.9)"/>
          </div>
        </div>
      )}
      {playing && !compact && (
        <div style={{ position:"absolute", bottom:10, right:10 }}>
          <span style={{ padding:"3px 9px", borderRadius:50, fontSize:".64rem",
            background:"rgba(0,0,0,.5)", color:"rgba(255,255,255,.8)",
            backdropFilter:"blur(4px)" }}>⏸ 일시정지</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DreamAuraSection  —  Detail 탭의 Dream Aura 생성 / 재생성 UI
───────────────────────────────────────────────────────────────── */
function DreamAuraSection({ dream, dreamCoins = 100, onSaveAura }) {
  const hasAna  = !!dream.analysis;
  const meta    = dream.auraMeta ?? { generationCount: 0 };
  const aura    = dream.aura    ?? null;   /* DreamVisualDNA */

  const [dna,        setDna]        = useState(() => aura ?? (hasAna ? buildVisualDNA(dream, 0) : null));
  const [modal,      setModal]      = useState(false);
  /* dreamCoins는 App에서 관리 — 로컬 표시용으로만 사용 */
  const [localCoins, setLocalCoins] = useState(dreamCoins);
  const [genCount,   setGenCount]   = useState(meta.generationCount ?? 0);
  const [generating, setGenerating] = useState(false);
  const [genPct,     setGenPct]     = useState(0);

  /* dream 바뀌면 초기화 */
  useEffect(() => {
    const m = dream.auraMeta ?? { generationCount:0 };
    setDna(dream.aura ?? (dream.analysis ? buildVisualDNA(dream, 0) : null));
    setGenCount(m.generationCount ?? 0);
    setLocalCoins(dreamCoins);
    setGenerating(false);
    setModal(false);
  }, [dream.id]);

  /* dreamCoins prop 변경 동기화 */
  useEffect(() => { setLocalCoins(dreamCoins); }, [dreamCoins]);

  const cost      = auraCost(genCount + 1);
  const isFirst   = genCount === 0;
  const canAfford = localCoins >= cost;

  function runGeneration(newSeed) {
    setGenerating(true);
    setGenPct(0);
    const steps = [15, 38, 60, 78, 92, 100];
    let i = 0;
    const iv = setInterval(() => {
      setGenPct(steps[i++]);
      if (i >= steps.length) {
        clearInterval(iv);
        const newDna = buildVisualDNA(dream, newSeed);
        const newCount = genCount + 1;
        const spent = isFirst ? 0 : cost;
        setDna(newDna);
        setGenCount(newCount);
        setLocalCoins(c => c - spent);
        setGenerating(false);
        setGenPct(0);
        if (typeof onSaveAura === "function") {
          onSaveAura(dream.id, {
            aura:     newDna,
            auraMeta: { generationCount: newCount, lastGeneratedAt: new Date().toISOString() },
            spent,   /* App에서 dreamCoins 차감에 사용 */
          });
        }
      }
    }, 220);
  }

  function handleGenerate() {
    if (isFirst) { runGeneration(Date.now() % 9999); return; }
    setModal(true);
  }

  function handleConfirm() {
    setModal(false);
    runGeneration(Date.now() % 9999);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* ── Analysis 필요 ── */}
      {!hasAna && (
        <div style={{ padding:"16px 20px", borderRadius:"var(--r2)",
          background:"rgba(201,168,76,.09)", border:"1px solid rgba(201,168,76,.28)",
          display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div>
            <p style={{ fontWeight:600, fontSize:".87rem", color:"var(--gold)", marginBottom:3 }}>
              Dream Fortune 분석이 필요합니다
            </p>
            <p className="sm">Analysis 탭에서 먼저 분석을 완료해야 Dream Aura를 생성할 수 있습니다.</p>
          </div>
        </div>
      )}

      {/* ── Aura 미리보기 ── */}
      {dna && (
        <div className="glg" style={{ padding:0, overflow:"hidden" }}>
          <DreamAuraCanvas dna={dna} size={560} autoPlay={false}/>
          <div style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between",
            alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div>
              <p style={{ fontSize:".72rem", fontWeight:700, color:"var(--ink3)", marginBottom:2 }}>
                DREAM AURA  ·  {dna.motion?.toUpperCase()}  ·  {dna.density?.toUpperCase()}
              </p>
              <p style={{ fontFamily:"var(--fd)", fontSize:".95rem" }}>{dna.auraID}</p>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ fontSize:".72rem", color:"var(--gold)",
                padding:"3px 10px", borderRadius:50,
                background:"rgba(201,168,76,.12)", border:"1px solid rgba(201,168,76,.24)" }}>
                💰 {localCoins} Dream Coins
              </div>
              {genCount > 0 && (
                <span style={{ fontSize:".68rem", color:"var(--ink3)" }}>
                  {genCount}회 생성됨
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 생성 진행 바 ── */}
      {generating && (
        <div style={{ padding:"14px 18px", borderRadius:"var(--r1)",
          background:"var(--acc-lt)", border:"1px solid rgba(107,92,231,.2)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:".84rem", fontWeight:600, color:"var(--acc)" }}>
              ✨ Dream Aura 생성 중…
            </span>
            <span style={{ fontSize:".78rem", color:"var(--acc)", fontWeight:700 }}>{genPct}%</span>
          </div>
          <div style={{ height:5, borderRadius:3, background:"rgba(0,0,0,.07)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${genPct}%`, borderRadius:3,
              background:"var(--acc)", transition:"width .22s var(--ease)" }}/>
          </div>
        </div>
      )}

      {/* ── 생성 / 재생성 버튼 패널 ── */}
      <div className="glg" style={{ padding:22 }}>
        {/* Fortune context */}
        {dream.fortune && (
          <div className={`fc-${dream.fortune.grade.id}`}
            style={{ padding:"12px 16px", marginBottom:18, display:"flex",
              gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <FortuneBadge fortune={dream.fortune}/>
            <span className="sm">→ Aura 색상/모션에 반영됨</span>
            <div style={{ display:"flex", gap:6, marginLeft:"auto", flexWrap:"wrap" }}>
              {(dream.fortune.symbols ?? []).slice(0,3).map(s => (
                <span key={s.name} style={{ padding:"2px 8px", borderRadius:50,
                  fontSize:".67rem", fontWeight:500,
                  background:"rgba(255,255,255,.5)", border:"1px solid rgba(0,0,0,.09)" }}>
                  ◆ {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DNA preview */}
        {dna && (
          <div style={{ marginBottom:18, display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              { l:"모션",   v: dna.motion   },
              { l:"밀도",   v: dna.density  },
              { l:"조명",   v: dna.light    },
              { l:"Seed",   v: `#${dna.seed}` },
            ].map(item => (
              <div key={item.l} style={{ padding:"5px 11px", borderRadius:8,
                background:"rgba(0,0,0,.04)", border:"1px solid rgba(0,0,0,.07)" }}>
                <div style={{ fontSize:".59rem", color:"var(--ink3)", fontWeight:600 }}>{item.l}</div>
                <div style={{ fontSize:".78rem", fontWeight:500, marginTop:1 }}>{item.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          className="btn bp"
          style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:".92rem" }}
          disabled={!hasAna || generating}
          onClick={handleGenerate}>
          <I n="sparkle" s={15}/>
          {generating ? "생성 중…"
            : isFirst  ? "✨ Dream Aura 생성 (무료)"
            : `🔄 재생성 - ${cost} Dream Coins`}
        </button>

        {!isFirst && (
          <p className="sm" style={{ textAlign:"center", marginTop:8, fontSize:".72rem" }}>
            {genCount}번 생성됨 · 다음 재생성 비용: {auraCost(genCount+1)} Coins
          </p>
        )}
        {!hasAna && (
          <p className="sm" style={{ textAlign:"center", marginTop:8 }}>
            Analysis 탭에서 꿈을 분석하면 Aura를 생성할 수 있습니다
          </p>
        )}
      </div>

      {/* ── 재생성 확인 모달 ── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:9999, backdropFilter:"blur(6px)", padding:20 }}>
          <div style={{ background:"var(--surface)", borderRadius:"var(--r2)",
            padding:"32px 28px", maxWidth:360, width:"100%",
            boxShadow:"0 24px 60px rgba(0,0,0,.3)", border:"1px solid var(--border)",
            animation:"pi .25s var(--spring) both" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🌀</div>
              <h2 style={{ fontFamily:"var(--fd)", fontSize:"1.25rem", marginBottom:8 }}>
                Dream Aura 재생성
              </h2>
              <p className="sm" style={{ lineHeight:1.65 }}>
                새로운 Seed로 Aura를 재생성합니다.<br/>
                색상·모션·파티클이 달라집니다.
              </p>
            </div>
            <div style={{ padding:"14px 16px", borderRadius:"var(--r1)", marginBottom:20,
              background:"var(--acc-lt)", border:"1px solid rgba(107,92,231,.2)",
              textAlign:"center" }}>
              <div style={{ fontSize:".72rem", color:"var(--ink3)", marginBottom:4 }}>재생성 비용</div>
              <div style={{ fontFamily:"var(--fd)", fontSize:"1.8rem", color:"var(--acc)", lineHeight:1 }}>
                {cost}
              </div>
              <div style={{ fontSize:".78rem", color:"var(--acc)", marginTop:2 }}>Dream Coins</div>
            </div>
            <div style={{ fontSize:".72rem", color:"var(--ink3)", textAlign:"center", marginBottom:18 }}>
              현재 잔액: <strong style={{ color: canAfford?"var(--ok)":"var(--err)" }}>
                {localCoins} Coins
              </strong>
              {!canAfford && <span style={{ color:"var(--err)", display:"block", marginTop:4 }}>
                잔액이 부족합니다
              </span>}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn bg" style={{ flex:1, justifyContent:"center" }}
                onClick={() => setModal(false)}>취소</button>
              <button className="btn bp" style={{ flex:1, justifyContent:"center" }}
                disabled={!canAfford}
                onClick={handleConfirm}>
                확인 · {cost} Coins
              </button>
            </div>
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
     └─ DreamAuraSection
═══════════════════════════════════════════════════════ */
function DreamDetailPage({ dream, dreamCoins, onBack, onSaveAnalysis, onSaveAura, allDreams, onCard, onEdit, onSaveMemory }) {
  const [tab,     setTab]     = useState("analysis");
  const [unlocked,setUnlocked]= useState(false);
  useEffect(()=>{ setTab("analysis"); setUnlocked(false); },[dream.id]);

  const isLocked   = dream.locked && !unlocked;
  const detailTags = (dream.tags ?? []).slice(0, 7);
  const editPolicy = calcEditPolicy(dream);
  const memCount   = (dream.extraMemories ?? []).length;

  const TABS = [
    { id:"analysis", label:"Analysis" },
    { id:"content",  label:"Dream Content" },
    { id:"visual",   label:"Dream Aura" },
    { id:"memory",   label:"기억 타임라인" },
    { id:"similar",  label:"Similar Dreams" },
  ];

  return (
    <div className="page" style={{maxWidth:780,animation:"pgIn .38s var(--ease) both"}}>
      <button className="bback" onClick={onBack} style={{marginBottom:22}}><I n="back" s={14}/> 돌아가기</button>

      {/* ── 잠금 알림 배너 ── */}
      {isLocked && (
        <div style={{marginBottom:16,padding:"12px 18px",borderRadius:"var(--r1)",
          background:"rgba(107,92,231,.07)",border:"1px solid rgba(107,92,231,.2)",
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:"1.2rem"}}>🔒</span>
            <div>
              <p style={{fontSize:".8rem",fontWeight:700,marginBottom:2}}>잠긴 꿈입니다</p>
              <p className="sm">내용과 분석은 잠금 해제 후 열람 가능합니다</p>
            </div>
          </div>
          <button className="btn bp bsm" onClick={()=>setUnlocked(true)}>잠금 해제</button>
        </div>
      )}

      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div style={{flex:1}}>
            <p className="lbl" style={{marginBottom:6}}>꿈 상세</p>
            <h1 style={{fontFamily:"var(--fd)",fontSize:"1.95rem",fontWeight:500,letterSpacing:"-.025em",lineHeight:1.2,marginBottom:10}}>
              {dream.title}
              {dream.locked && <span style={{marginLeft:8,fontSize:".8rem"}}>🔒</span>}
            </h1>

            {/* ── 배지 행 1: 운세 + 희귀도 + 가격 ── */}
            <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:8}}>
              {dream.fortune && <FortuneBadge fortune={dream.fortune} lg/>}
              <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
              {dream.verified && <span className="verified-badge">✦ Verified Dream</span>}
              {dream.rankScore > 0 && <span className="rank-pill">⚡ {dream.rankScore}pt</span>}
              <EditedBadge dream={dream}/>
              {dream.forSale && <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:50,fontSize:".69rem",fontWeight:600,background:"var(--gold-lt)",color:"var(--gold)"}}>{dream.price}D</span>}
            </div>

            {/* ── Timestamp (수정 불가 — 읽기 전용 표시) ── */}
            <div style={{marginBottom:10,display:"flex",flexDirection:"column",gap:3}}>
              {dream.createdAt ? (
                <span className="ts-chip">
                  📝 기록: {formatDreamTime(dream.createdAt, { timezone: dream.timezone })}
                </span>
              ) : dream.date ? (
                <span className="ts-chip">📝 기록: {dream.date}</span>
              ) : null}
              {dream.updatedAt && dream.updatedAt !== dream.createdAt && (
                <span className="ts-chip" style={{opacity:.7}}>
                  ✏️ 수정: {formatDreamTime(dream.updatedAt, { compact:true })}
                </span>
              )}
            </div>

            {/* ── 태그 (3~7개) ── */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {detailTags.map(t=><span key={t} className="tag">{t}</span>)}
              {(dream.tags ?? []).length > 7 && (
                <span className="tag" style={{opacity:.5}}>+{dream.tags.length-7}개</span>
              )}
            </div>
          </div>

          {/* ── 오른쪽: 편집 + 배지 ── */}
          <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
            <button className="btn bg bsm"
              onClick={() => typeof onEdit === "function" && onEdit(dream)}
              title={editPolicy.canEditContent ? "수정 가능" : "메타 정보만 수정 가능"}>
              <I n="edit" s={13}/>
              {editPolicy.canEditContent ? "편집" : "설정 변경"}
            </button>
            {/* 편집 정책 상태 */}
            {editPolicy.policy === "free" && (
              <span style={{fontSize:".62rem",color:"var(--ok)",fontWeight:600}}>
                ⏱️ {editPolicy.minutesLeft}분 남음
              </span>
            )}
            {editPolicy.policy === "meta_only" && (
              <span style={{fontSize:".62rem",color:"var(--warn)",fontWeight:600}}>
                🔐 내용 잠김
              </span>
            )}
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              {dream.locked && <span style={{fontSize:".68rem",color:"var(--ink3)"}}>🔒 잠김</span>}
              <EditedBadge dream={dream}/>
            </div>
          </div>
        </div>

        {dream.aura && (
          <div style={{marginTop:14,padding:"10px 16px",borderRadius:"var(--r1)",background:"var(--acc-lt)",border:"1px solid rgba(107,92,231,.2)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setTab("visual")}>
            <I n="sparkle" s={15} c="var(--acc)"/><span style={{fontSize:".82rem",color:"var(--acc)",fontWeight:500}}>Dream Aura 보기 →</span>
          </div>
        )}
      </div>

      <div className="dtabs">
        {TABS.map(t=>(
          <button key={t.id} className={`dtab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
            {t.label}
            {t.id==="visual"&&!dream.analysis&&<span style={{marginLeft:6,fontSize:".62rem",padding:"1px 6px",borderRadius:50,background:"rgba(201,168,76,.18)",color:"var(--gold)",fontWeight:700}}>분석 필요</span>}
            {t.id==="visual"&&dream.aura&&<span style={{marginLeft:6,fontSize:".62rem",padding:"1px 6px",borderRadius:50,background:"var(--ok-lt)",color:"var(--ok)",fontWeight:700}}>완성</span>}
            {t.id==="memory"&&memCount>0&&<span style={{marginLeft:6,fontSize:".62rem",padding:"1px 6px",borderRadius:50,background:"var(--ok-lt)",color:"var(--ok)",fontWeight:700}}>{memCount}</span>}
            {t.id==="similar"&&(allDreams?.length>1)&&<span style={{marginLeft:6,fontSize:".62rem",padding:"1px 6px",borderRadius:50,background:"var(--acc-lt)",color:"var(--acc)",fontWeight:700}}>{Math.min(3,getSimilarDreams(dream,allDreams,3).length)}</span>}
          </button>
        ))}
      </div>

      {tab==="analysis" && !isLocked && <AnalysisSection dream={dream} onSaveAnalysis={onSaveAnalysis}/>}
      {tab==="analysis" && isLocked  && (
        <div style={{padding:40,textAlign:"center",color:"var(--ink3)"}}>
          <div style={{fontSize:36,marginBottom:10}}>🔒</div>
          <p style={{fontFamily:"var(--fd)",fontSize:"1.1rem"}}>잠금을 해제하면 분석을 볼 수 있습니다</p>
        </div>
      )}
      {tab==="content"  && <DreamContentSection dream={dream}/>}
      {tab==="visual"   && <DreamAuraSection dream={dream} dreamCoins={dreamCoins ?? 100} onSaveAura={onSaveAura}/>}
      {tab==="memory"   && (
        <MemoryTimeline dream={dream} onSaveMemory={onSaveMemory}/>
      )}
      {tab==="similar"  && (
        <div className="stag" style={{paddingTop:16}}>
          {allDreams && <SimilarDreamsPanel dream={dream} allDreams={allDreams} onCard={onCard}/>}
          {!allDreams && <p className="sm" style={{textAlign:"center",padding:30}}>유사 꿈 데이터를 불러오는 중…</p>}
        </div>
      )}
    </div>
  );
}




/* ─────────────────────────────────────────────────────────────────
   DREAM SIMILARITY  —  태그·감정·상징 기반 유사도 계산
───────────────────────────────────────────────────────────────── */
function calcSimilarity(dreamA, dreamB) {
  if (!dreamA || !dreamB || dreamA.id === dreamB.id) return 0;
  const setA = new Set([...(dreamA.tags ?? []), ...(dreamA.emotions ?? [])]);
  const setB = new Set([...(dreamB.tags ?? []), ...(dreamB.emotions ?? [])]);
  if (setA.size === 0 || setB.size === 0) return 0;
  /* Jaccard 유사도 */
  const inter = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  const jaccard = inter / union;
  /* 희귀도 보너스 */
  const rarBonus = dreamA.rarity === dreamB.rarity ? 0.1 : 0;
  /* 감정 유사도 추가 */
  const emoA = new Set(dreamA.emotions ?? []);
  const emoB = new Set(dreamB.emotions ?? []);
  const emoInter = [...emoA].filter(x => emoB.has(x)).length;
  const emoScore = emoA.size + emoB.size > 0
    ? emoInter / Math.max(emoA.size, emoB.size) * 0.25
    : 0;
  return Math.min(1, jaccard + rarBonus + emoScore);
}

function getSimilarDreams(dream, allDreams, limit = 3) {
  if (!dream || !allDreams) return [];
  return allDreams
    .filter(d => d.id !== dream.id && !d.locked)
    .map(d => ({ dream: d, score: calcSimilarity(dream, d) }))
    .filter(x => x.score > 0.08)
    .sort((a,b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.dream);
}

/* Similar Dreams UI */
function SimilarDreamsPanel({ dream, allDreams, onCard }) {
  const similar = getSimilarDreams(dream, allDreams, 3);

  if (similar.length === 0) return (
    <div className="glg" style={{ padding:32, textAlign:"center" }}>
      <div style={{ fontSize:36, marginBottom:10 }}>🌙</div>
      <p style={{ fontFamily:"var(--fd)", fontSize:"1rem", color:"var(--ink3)", marginBottom:6 }}>
        아직 비슷한 꿈이 없습니다
      </p>
      <p className="sm">더 많은 꿈을 기록하면 AI가 유사한 꿈을 연결해드립니다</p>
    </div>
  );

  /* 공통 태그/감정 찾기 */
  const commonWith = (d) => {
    const sA = new Set([...(dream.tags ?? []), ...(dream.emotions ?? [])]);
    return [...(d.tags ?? []), ...(d.emotions ?? [])].filter(x => sA.has(x)).slice(0,3);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, padding:"0 2px" }}>
        <I n="sparkle" s={15} c="var(--acc)"/>
        <p className="lbl" style={{ color:"var(--acc)" }}>이 꿈과 비슷한 꿈</p>
        <span style={{ fontSize:".65rem", color:"var(--ink3)" }}>— 태그·감정·상징 기반 유사도</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {similar.map((d, idx) => {
          const common = commonWith(d);
          const score  = calcSimilarity(dream, d);
          return (
            <div key={d.id}
              className="similar-card"
              onClick={() => typeof onCard === "function" && onCard(d.id)}
              style={{ animationDelay:`${idx*0.07}s` }}>
              {/* 순위 번호 */}
              <div style={{ width:28, height:28, borderRadius:8, background:"var(--acc-lt)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"var(--fd)", fontSize:".82rem", fontWeight:700, color:"var(--acc)", flexShrink:0 }}>
                {idx+1}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"var(--fd)", fontSize:".95rem", fontWeight:500, marginBottom:4 }}>
                  {d.title}
                  {d.locked && <span style={{marginLeft:5,fontSize:11}}>🔒</span>}
                </p>
                {/* 공통 요소 */}
                {common.length > 0 && (
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:3 }}>
                    {common.map(t => (
                      <span key={t} style={{ fontSize:".64rem", padding:"1px 6px", borderRadius:50,
                        background:"rgba(107,92,231,.09)", color:"var(--acc)", fontWeight:600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize:".65rem", color:"var(--ink3)" }}>
                  유사도 {Math.round(score*100)}%
                  {d.rarity && <span style={{marginLeft:6}} className={`rar r-${d.rarity}`}>{d.rarity}</span>}
                </p>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                {d.fortune && <FortuneBadge fortune={d.fortune}/>}
                {d.rankScore > 0 && (
                  <p style={{ fontSize:".62rem", color:"var(--acc)", marginTop:4 }}>⚡{d.rankScore}pt</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 유사도 설명 */}
      <div style={{ marginTop:16, padding:"10px 14px", borderRadius:"var(--r1)",
        background:"rgba(0,0,0,.03)", border:"1px dashed rgba(0,0,0,.08)" }}>
        <p style={{ fontSize:".68rem", color:"var(--ink3)", lineHeight:1.7 }}>
          💡 유사도는 <strong>태그</strong>·<strong>감정</strong>·<strong>상징</strong>의 Jaccard 유사도로 계산됩니다.
          같은 꿈을 꿨다면 Dream Market에서 연결해 세계관을 공유하세요.
        </p>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   DREAM EDIT POLICY  —  시간 기반 편집 제한 + 추가 기억 시스템
═══════════════════════════════════════════════════════════════════ */

/**
 * 편집 정책 계산
 * @returns {
 *   canEditContent   — 꿈 내용(텍스트/파편) 수정 가능 여부
 *   canEditMeta      — 공개여부/판매여부 수정 가능 여부
 *   isMarketListed   — Market 등록된 꿈 여부 (내용 수정 항상 불가)
 *   minutesLeft      — 자유 수정 가능 잔여 분 (0이면 잠김)
 *   policy           — "free" | "meta_only" | "locked"
 * }
 */
function calcEditPolicy(dream) {
  if (!dream) return { canEditContent:false, canEditMeta:false, isMarketListed:false, minutesLeft:0, policy:"locked" };

  const isMarketListed = !!dream.forSale;
  const ageMs  = Date.now() - new Date(dream.createdAt ?? Date.now()).getTime();
  const ageMin = ageMs / 60000;
  const minutesLeft = Math.max(0, 60 - Math.floor(ageMin));

  /* Market 등록 꿈 — 내용 수정 절대 불가 */
  if (isMarketListed) {
    return { canEditContent:false, canEditMeta:true, isMarketListed:true, minutesLeft:0, policy:"meta_only" };
  }

  /* 1시간 이내 — 모든 수정 가능 */
  if (ageMin < 60) {
    return { canEditContent:true, canEditMeta:true, isMarketListed:false, minutesLeft, policy:"free" };
  }

  /* 1시간 이후 — 메타(공개/판매)만 가능 */
  return { canEditContent:false, canEditMeta:true, isMarketListed:false, minutesLeft:0, policy:"meta_only" };
}

/** Edited Dream 배지: editCount > 0 이면 표시 */
function EditedBadge({ dream }) {
  if (!dream?.editCount || dream.editCount === 0) return null;
  return (
    <span className="edited-badge" title={`${dream.editCount}회 수정됨`}>
      ✏️ Edited
    </span>
  );
}

/** 편집 정책 안내 배너 */
function EditPolicyBanner({ policy, minutesLeft, isMarketListed }) {
  if (policy === "free") {
    return (
      <div className="edit-warn-banner" style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:"1.1rem", flexShrink:0 }}>⏱️</span>
        <div>
          <p style={{ fontSize:".80rem", fontWeight:700, marginBottom:2, color:"var(--warn)" }}>
            자유 수정 가능 — {minutesLeft}분 남음
          </p>
          <p className="sm">기록 후 1시간 이내입니다. 꿈 내용·감정·선명도를 자유롭게 수정할 수 있습니다.</p>
        </div>
      </div>
    );
  }
  if (isMarketListed) {
    return (
      <div className="edit-locked-banner" style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:"1.1rem", flexShrink:0 }}>🛒</span>
        <div>
          <p style={{ fontSize:".80rem", fontWeight:700, marginBottom:2, color:"var(--err)" }}>
            Dream Market 등록 — 내용 수정 불가
          </p>
          <p className="sm">판매 등록된 꿈은 신뢰성 보호를 위해 내용을 수정할 수 없습니다. 공개 여부와 판매 설정만 변경 가능합니다.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="edit-locked-banner" style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
      <span style={{ fontSize:"1.1rem", flexShrink:0 }}>🔐</span>
      <div>
        <p style={{ fontSize:".80rem", fontWeight:700, marginBottom:2, color:"var(--err)" }}>
          기록 1시간 경과 — 내용 수정 불가
        </p>
        <p className="sm">꿈의 진실성을 보호하기 위해 기록 1시간 이후에는 내용을 수정할 수 없습니다. 공개 여부·판매 설정은 변경 가능합니다.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MEMORY TIMELINE  —  추가 기억 데이터 구조 + UI
───────────────────────────────────────────────────────────────── */

/**
 * extraMemories: Array<{
 *   id:        string,
 *   text:      string,
 *   createdAt: string (ISO),
 *   timezone:  string,
 * }>
 */

function MemoryTimeline({ dream, onSaveMemory }) {
  const [open,    setOpen]    = useState(false);
  const [newText, setNewText] = useState("");
  const [saving,  setSaving]  = useState(false);
  const { show: showToast, node: toastNode } = useToast();

  const memories = dream?.extraMemories ?? [];

  function handleAdd() {
    if (!newText.trim()) { showToast("추가 기억 내용을 입력해주세요", "warn"); return; }
    setSaving(true);
    const entry = {
      id:        `mem_${Date.now()}`,
      text:      newText.trim(),
      createdAt: new Date().toISOString(),
      timezone:  Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    setTimeout(() => {
      if (typeof onSaveMemory === "function") onSaveMemory(dream.id, entry);
      setNewText("");
      setOpen(false);
      setSaving(false);
      showToast("추가 기억이 기록되었습니다 🌙", "ok");
    }, 350);
  }

  return (
    <div style={{ marginTop:24 }}>
      {toastNode}

      {/* 섹션 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <p className="lbl" style={{ marginBottom:3 }}>
            🌙 추가 기억 타임라인
          </p>
          <p className="sm">원본 꿈은 보존되고 나중에 떠오른 기억을 덧붙일 수 있습니다</p>
        </div>
        <button className="btn bp bsm" onClick={() => setOpen(p => !p)} style={{ gap:5 }}>
          <I n="plus" s={12}/> 추가 기억
        </button>
      </div>

      {/* 추가 기억 입력 폼 */}
      {open && (
        <div style={{ marginBottom:20, padding:"16px 18px", borderRadius:"var(--r2)",
          background:"rgba(78,175,128,.05)", border:"1.5px solid rgba(78,175,128,.22)",
          animation:"memIn .25s var(--ease) both" }}>
          <p style={{ fontSize:".75rem", fontWeight:600, color:"var(--ok)", marginBottom:10 }}>
            💡 방금 떠오른 기억을 추가하세요
          </p>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder={"잠결에 다시 기억났거나, 나중에 떠오른 장면·감각을 자유롭게 적어보세요.\n\n예) 아, 그때 주변에 꽃 향기가 났던 것 같다."}
            rows={4}
            style={{ width:"100%", padding:"11px 14px", borderRadius:"var(--r1)",
              border:"1.5px solid rgba(78,175,128,.25)", background:"rgba(255,255,255,.8)",
              fontFamily:"var(--fb)", fontSize:".86rem", lineHeight:1.75,
              resize:"vertical", outline:"none", transition:"border .15s" }}
            onFocus={e  => e.target.style.borderColor = "var(--ok)"}
            onBlur={e   => e.target.style.borderColor = "rgba(78,175,128,.25)"}
          />
          <div style={{ display:"flex", gap:10, marginTop:10 }}>
            <button className="btn bg" style={{ flex:1, justifyContent:"center" }}
              onClick={() => { setOpen(false); setNewText(""); }}>
              취소
            </button>
            <button className="btn bp" style={{ flex:2, justifyContent:"center",
              background:"var(--ok)", borderColor:"var(--ok)" }}
              disabled={saving}
              onClick={handleAdd}>
              {saving ? "저장 중…" : <><I n="check" s={14}/> 추가 기억 저장</>}
            </button>
          </div>
          <p style={{ fontSize:".65rem", color:"var(--ink3)", marginTop:8 }}>
            ✓ 추가 기억은 원본 꿈에 타임라인으로 연결됩니다 · 삭제 불가
          </p>
        </div>
      )}

      {/* 타임라인 */}
      <div className="mem-timeline">

        {/* ── 원본 꿈 노드 ── */}
        <div className="mem-node">
          <div className="mem-dot mem-dot-origin">✨</div>
          <div className="mem-card mem-card-origin" style={{ marginBottom: memories.length > 0 ? 14 : 0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <p style={{ fontSize:".72rem", fontWeight:700, color:"var(--acc)", marginBottom:2 }}>
                  원본 꿈 기록
                </p>
                <span className="ts-chip">
                  🕐 {dream.createdAt
                    ? formatDreamTime(dream.createdAt, { timezone: dream.timezone })
                    : (dream.date ?? "—")}
                </span>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
                <span className={`rar r-${dream.rarity ?? "common"}`}>{dream.rarity ?? "common"}</span>
                {dream.verified && <span className="verified-badge">✦ Verified</span>}
                <EditedBadge dream={dream}/>
              </div>
            </div>
            {/* 원본 내용 */}
            {dream.mode === "fragment" ? (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(dream.structuredFrag?.place || dream.structuredFrag?.person) && (
                  <div style={{ width:"100%", marginBottom:6, fontSize:".78rem", color:"var(--ink2)", lineHeight:1.7 }}>
                    {[
                      dream.structuredFrag?.person  && `👤 ${dream.structuredFrag.person}`,
                      dream.structuredFrag?.place   && `📍 ${dream.structuredFrag.place}`,
                      dream.structuredFrag?.event   && `⚡ ${dream.structuredFrag.event}`,
                      dream.structuredFrag?.emotion && `💫 ${dream.structuredFrag.emotion}`,
                    ].filter(Boolean).map((s,i) => <span key={i} style={{ marginRight:10 }}>{s}</span>)}
                  </div>
                )}
                {(dream.fragments ?? []).map((f,i) => (
                  <div key={i} style={{ padding:"5px 11px", borderRadius:"var(--r1)",
                    background:"rgba(107,92,231,.07)", border:"1px solid rgba(107,92,231,.14)",
                    fontSize:".82rem" }}>
                    <strong>{f.word}</strong>
                    {f.desc && <span style={{ color:"var(--ink3)", marginLeft:5 }}>{"—"} {f.desc}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:".87rem", lineHeight:1.8, color:"var(--ink)", whiteSpace:"pre-wrap" }}>
                {dream.content?.replace(/\[\?\]/g, "…") ?? ""}
              </p>
            )}
            {/* 태그 */}
            {(dream.tags ?? []).length > 0 && (
              <div style={{ marginTop:10, display:"flex", gap:5, flexWrap:"wrap" }}>
                {(dream.tags ?? []).slice(0,5).map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* ── 추가 기억 노드들 ── */}
        {memories.map((mem, idx) => (
          <div key={mem.id} className="mem-node" style={{ animationDelay:`${idx*0.06}s` }}>
            <div className="mem-dot mem-dot-extra">🌙</div>
            <div className="mem-card mem-card-extra">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <p style={{ fontSize:".72rem", fontWeight:700, color:"var(--ok)" }}>
                  추가 기억 #{idx + 1}
                </p>
                <span className="ts-chip">
                  🕐 {formatDreamTime(mem.createdAt, { timezone: mem.timezone, compact: true })}
                </span>
              </div>
              <p style={{ fontSize:".87rem", lineHeight:1.8, color:"var(--ink)", whiteSpace:"pre-wrap" }}>
                {mem.text}
              </p>
              {/* 원본 기록으로부터 경과 시간 */}
              {dream.createdAt && (
                <p style={{ fontSize:".63rem", color:"var(--ink3)", marginTop:8 }}>
                  {(() => {
                    const diff = new Date(mem.createdAt) - new Date(dream.createdAt);
                    const h = Math.floor(diff/3600000);
                    const m = Math.floor((diff%3600000)/60000);
                    return `원본 기록으로부터 ${h > 0 ? `${h}시간 ` : ""}${m}분 후`;
                  })()}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* ── 비어있을 때 ── */}
        {memories.length === 0 && !open && (
          <div style={{ paddingLeft:44, paddingBottom:8 }}>
            <div style={{ padding:"14px 18px", borderRadius:"var(--r1)",
              background:"rgba(0,0,0,.025)", border:"1px dashed rgba(0,0,0,.09)" }}>
              <p style={{ fontSize:".78rem", color:"var(--ink3)", lineHeight:1.7 }}>
                아직 추가 기억이 없습니다.<br/>
                나중에 떠오른 장면·감각이 있다면 <strong>추가 기억</strong> 버튼으로 기록해보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DREAM STREAK SYSTEM  —  연속 기록 추적
═══════════════════════════════════════════════════════════════════ */

/** 꿈 배열에서 현재 연속 기록 일수를 계산 */
function calcStreak(dreams) {
  if (!dreams || dreams.length === 0) return { current: 0, best: 0, lastDate: null };

  /* 날짜별로 기록 있는 날 집합 생성 (KST 기준 YYYY-MM-DD) */
  const dateFmt = iso => {
    const d = new Date(iso ?? Date.now());
    return d.toISOString().slice(0, 10);
  };
  const days = new Set(dreams.map(d => dateFmt(d.createdAt ?? d.date ?? Date.now())));
  const sorted = [...days].sort().reverse();   /* 최신순 */

  if (sorted.length === 0) return { current: 0, best: 0, lastDate: null };

  const today     = dateFmt(Date.now());
  const yesterday = dateFmt(Date.now() - 86400000);

  /* 오늘 또는 어제 기록이 없으면 streak 끊김 */
  const hasRecent = sorted[0] === today || sorted[0] === yesterday;
  if (!hasRecent) return { current: 0, best: calcBestStreak(sorted), lastDate: sorted[0] };

  /* 현재 streak 계산 */
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i-1]).getTime();
    const curr = new Date(sorted[i]).getTime();
    if (prev - curr === 86400000) { current++; }
    else break;
  }

  return { current, best: calcBestStreak(sorted), lastDate: sorted[0], recordedToday: sorted[0] === today };
}

function calcBestStreak(sortedDays) {
  if (!sortedDays.length) return 0;
  let best = 1, run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i-1]).getTime();
    const curr = new Date(sortedDays[i]).getTime();
    if (prev - curr === 86400000) { run++; best = Math.max(best, run); }
    else run = 1;
  }
  return best;
}

/** streak 마일스톤 및 보너스 코인 */
const STREAK_MILESTONES = [
  { days:3,  label:"3일 연속",  bonus:5,  icon:"🔥" },
  { days:7,  label:"7일 연속",  bonus:15, icon:"⚡" },
  { days:14, label:"2주 연속",  bonus:30, icon:"🌟" },
  { days:30, label:"30일 연속", bonus:80, icon:"💎" },
];

function getStreakMilestone(streak) {
  return [...STREAK_MILESTONES].reverse().find(m => streak >= m.days) ?? null;
}

/* ── Streak Badge UI 컴포넌트 ── */
function StreakBadge({ streak, compact = false }) {
  const { current, best, recordedToday } = streak ?? { current:0, best:0 };
  const milestone = getStreakMilestone(current);
  if (current === 0 && !compact) return null;

  const color = current >= 30 ? "#a855f7"
              : current >= 14 ? "#f59e0b"
              : current >= 7  ? "#3b82f6"
              : current >= 3  ? "#ef4444"
              : "var(--ink3)";

  if (compact) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:"1rem" }}>{milestone?.icon ?? "🔥"}</span>
        <span style={{ fontSize:".78rem", fontWeight:700, color }}>{current}일 연속</span>
        {recordedToday && (
          <span style={{ fontSize:".60rem", padding:"1px 6px", borderRadius:50,
            background:"rgba(78,175,128,.12)", color:"var(--ok)", fontWeight:600 }}>오늘 ✓</span>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding:"16px 20px", borderRadius:"var(--r2)",
      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
      border:`1px solid ${color}30`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <span style={{ fontSize:"1.5rem" }}>{milestone?.icon ?? "🔥"}</span>
          <span style={{ fontFamily:"var(--fd)", fontSize:"1.4rem", fontWeight:600, color }}>{current}일</span>
          <span style={{ fontSize:".82rem", color:"var(--ink2)", fontWeight:500 }}>연속 기록 중</span>
        </div>
        <p style={{ fontSize:".72rem", color:"var(--ink3)" }}>
          최고 기록: {best}일
          {milestone && <span style={{ marginLeft:8, color, fontWeight:600 }}>· {milestone.label} 달성!</span>}
        </p>
      </div>
      <div style={{ textAlign:"right" }}>
        {recordedToday
          ? <span style={{ fontSize:".75rem", padding:"4px 10px", borderRadius:50,
              background:"var(--ok-lt)", color:"var(--ok)", fontWeight:600 }}>오늘 기록 ✓</span>
          : <span style={{ fontSize:".75rem", padding:"4px 10px", borderRadius:50,
              background:"rgba(0,0,0,.05)", color:"var(--ink3)", fontWeight:500 }}>오늘 기록 전</span>
        }
        {milestone && (
          <p style={{ fontSize:".68rem", color:"var(--gold)", marginTop:6, fontWeight:600 }}>
            💰 +{milestone.bonus} Coins
          </p>
        )}
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────
   DREAM TIMESTAMP  —  기록 시각 포맷터 (수정 불가)
───────────────────────────────────────────────────────────────── */
const DAYS_KO = ["일","월","화","수","목","금","토"];

function formatDreamTime(iso, opts = {}) {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = n => String(n).padStart(2,"0");
  const ymd = `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} (${DAYS_KO[d.getDay()]})`;
  const hm  = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const tz  = opts.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzShort = tz.includes("Seoul") || tz.includes("Asia/Seoul") ? "KST" : tz.split("/").pop();
  if (opts.compact) return `${ymd} ${hm}`;
  return `${ymd} ${hm} ${tzShort}`;
}

/* Verified Dream 배지 조건 계산 */
function calcVerified(dream) {
  if (!dream) return false;
  /* 조건 1: 기록 후 30분 이내 */
  const h = (Date.now() - new Date(dream.createdAt ?? Date.now()).getTime()) / 3600000;
  const fresh = h < 0.5;
  /* 조건 2: 음성 녹음 포함 */
  const hasAudio = !!dream.hasAudio;
  /* 조건 3: 수정 없음 */
  const noEdit = !dream.editCount || dream.editCount === 0;
  /* 조건 4: 감정 선택 + 선명도 5 */
  const highVivid = (dream.vividness ?? 3) >= 4;
  return (fresh || hasAudio) && noEdit && highVivid;
}

/* DreamTimestamp UI 컴포넌트 */
function DreamTimestamp({ createdAt, timezone, compact = false, style: extraStyle }) {
  if (!createdAt) return null;
  const label = formatDreamTime(createdAt, { timezone, compact });
  return (
    <span style={{
      fontSize: compact ? ".62rem" : ".72rem",
      color:"var(--ink3)", fontVariantNumeric:"tabular-nums",
      ...extraStyle,
    }}>
      🕐 {label}
    </span>
  );
}

/* Verified Dream Badge */
function VerifiedBadge({ dream, style: extraStyle }) {
  const ok = dream?.verified ?? calcVerified(dream);
  if (!ok) return null;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding:"2px 8px", borderRadius:50, fontSize:".65rem", fontWeight:700,
      background:"rgba(201,168,76,.12)", color:"var(--gold)",
      border:"1px solid rgba(201,168,76,.28)",
      ...extraStyle,
    }}>
      ✦ Verified
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EDITOR VIEW  v2  —  고도화된 꿈 기록 시스템
   ✓ EditorView is not defined 방지 — 이 파일 내 완전 정의
   ✓ handleSaveAura undefined 방지 — typeof 체크 + optional chaining
   ✓ 희귀도 AI 자동 판정  ✓ 음성 녹음  ✓ 자동 제목·태그
   ✓ 감정·선명도·기억 상태  ✓ 가격 알고리즘  ✓ 결과 화면
   ✓ fallback UI · Toast 알림 · React strict mode 안전
═══════════════════════════════════════════════════════════════════ */

/* ── 상수 ── */
const EMOTIONS_LIST = [
  { id:"두려움", icon:"😨", intensity:0.9, grade:"dark"    },
  { id:"신비",   icon:"🔮", intensity:0.7, grade:"neutral" },
  { id:"평온",   icon:"😌", intensity:0.3, grade:"good"    },
  { id:"슬픔",   icon:"😢", intensity:0.6, grade:"neutral" },
  { id:"긴장",   icon:"😰", intensity:0.8, grade:"warn"    },
  { id:"경이",   icon:"🌟", intensity:0.8, grade:"great"   },
  { id:"기쁨",   icon:"😊", intensity:0.7, grade:"great"   },
  { id:"설렘",   icon:"💫", intensity:0.6, grade:"good"    },
];
const MEMORY_TYPES = [
  { id:"perfect",  label:"완벽히 기억", icon:"💎" },
  { id:"partial",  label:"부분 기억",   icon:"🌙" },
  { id:"fragment", label:"조각 기억",   icon:"🧩" },
];
const VIVIDNESS_LABELS = ["", "흐릿함", "희미", "보통", "또렷", "매우 생생"];

/* ── AI 분석 함수 (순수 로직) ── */
/* ─────────────────────────────────────────────────────────────────
   TAG SYSTEM v2  — 명사·상징 중심, 불용어 완전 차단
   파이프라인: 불용어 제거 → 품사 필터 → 상징 우선 → 중복 제거
───────────────────────────────────────────────────────────────── */

/* 1. 확장 불용어 사전 — 조사·접속사·대명사·서술형·의미없는 일반어 */
const STOPWORDS = new Set([
  /* 조사 */
  "이","가","은","는","을","를","의","에","에서","으로","로","와","과","도","만","까지","부터","에게","한테","께","에서","보다",
  /* 접속사·부사 */
  "그리고","그런데","하지만","그래서","그러나","또한","또","그냥","계속","그때","그곳","거기","여기",
  "아주","매우","정말","너무","약간","좀","막","다시","이미","항상","보통","갑자기","금방","나중에",
  /* 대명사 */
  "나","나는","나를","내가","나에게","우리","그","그는","그녀","그들","이것","저것","무언가","누군가","모두","아무",
  /* 서술형·동사 어간 */
  "있었","했다","했고","하며","하면서","였다","이었","됐다","됐고","가고","오고","봤다","봤고","갔다","왔다",
  "들어","나와","지나","달려","서있","앉아","걷고","뛰고","느꼈","보였","들렸","생각","말했",
  /* 의미 없는 일반어 */
  "것","일","때","곳","말","사람","사람들","뭔가","어떤","다른","같은","없는","있는","모든","하나","두개",
  "진짜","가장","이미","이런","저런","그런","어디","언제","왜","어떻게","그냥",
  /* 어미·접미사 잔재 */
  "하고","하는","이고","이라","하면","한다","한다면","이다","이란","처럼","만큼","대로","라고",
]);

/* 2. 상징·장소·인물 사전 (우선순위 1~3) */
const TAG_DICT = {
  /* 장소 (우선순위 1) */
  places: ["도서관","정원","바다","산","숲","학교","집","방","계단","길","터널","다리","역","공원","마을","성","탑","동굴","사막","들판","하늘","우주","지하","수중","거울","문"],
  /* 상징 오브젝트 (우선순위 2) */
  symbols: ["달","별","태양","빛","어둠","물","불","바람","구름","눈","비","꽃","나무","새","나비","뱀","용","고양이","책","시계","거울","열쇠","문","계단","탑","종","칼","보석","알약","창문"],
  /* 감정 (우선순위 3 — 한국어 감정 명사형) */
  emotions: ["불안","공포","두려움","슬픔","그리움","기쁨","경이","평온","설렘","분노","혼란","외로움","희망","무기력","황홀","긴장","당혹","충격"],
  /* 인물 (우선순위 4) */
  persons: ["엄마","아빠","부모","가족","친구","연인","남자","여자","아이","어른","노인","낯선인","추격자","안내자","그림자"],
};

const ALL_DICT_WORDS = [
  ...TAG_DICT.places, ...TAG_DICT.symbols,
  ...TAG_DICT.emotions, ...TAG_DICT.persons,
];

/* 3. 유사어 통합 맵 */
const TAG_ALIAS = {
  "어머니":"엄마","아버지":"아빠","공포":"두려움","무서움":"두려움",
  "바닷속":"수중","물속":"수중","도망":"추격","쫓김":"추격",
};

/* 4. 메인 태그 생성 함수 */
function extractTags(text, fragments, structuredFrags) {
  const frags  = fragments  ?? [];
  const sfrags = structuredFrags ?? null;

  /* 모든 텍스트 소스 수집 */
  const sources = [
    text ?? "",
    ...frags.map(f => (f.word ?? "") + " " + (f.desc ?? "")),
  ];
  if (sfrags) {
    sources.push(
      sfrags.person  ?? "",
      sfrags.place   ?? "",
      sfrags.event   ?? "",
      sfrags.emotion ?? "",
    );
  }
  const allText = sources.join(" ");

  /* 5. 사전 매칭 (우선순위 순) */
  const dictTags = [];
  for (const cat of ["places","symbols","emotions","persons"]) {
    for (const w of TAG_DICT[cat]) {
      if (allText.includes(w) && !dictTags.includes(w)) dictTags.push(w);
    }
  }

  /* 6. 자유 단어 추출 — STOPWORDS 제거 + 2글자 이상 명사 후보 */
  const words = allText
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w =>
      w.length >= 2 &&                    /* 2글자 이상 */
      !STOPWORDS.has(w) &&                /* 불용어 제외 */
      !/[가-힣]{1}[이가은는을를의에]$/.test(w) && /* 조사 붙은 단어 제외 */
      !/[했했는이된하다고며고서]$/.test(w) && /* 서술형 어미 제외 */
      !/^\d+$/.test(w)                    /* 숫자만 제외 */
    );

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] ?? 0) + 1; });
  const freqWords = Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .map(([w]) => TAG_ALIAS[w] ?? w)
    .filter(w => !dictTags.includes(w) && !STOPWORDS.has(w));

  /* 7. 합치고 중복 제거 후 7개 제한 */
  const raw = [...dictTags, ...freqWords];
  const deduped = [...new Set(raw.map(w => TAG_ALIAS[w] ?? w))];
  return deduped.slice(0, 7);
}

/* 태그 품질 피드백 저장소 (in-memory, 실서버에선 API로 교체) */
const _tagReports = {};
function reportTag(dreamId, tag) {
  _tagReports[dreamId] = _tagReports[dreamId] ?? new Set();
  _tagReports[dreamId].add(tag);
}
function isTagReported(dreamId, tag) {
  return _tagReports[dreamId]?.has(tag) ?? false;
}

function analyzeRarity({ content, fragments, emotions, vividness, memoryType }) {
  const frags = fragments ?? [];
  const emos  = emotions  ?? [];
  const text  = (content ?? "") + frags.map(f => f.word ?? "").join(" ");
  const len   = text.trim().length;
  let score   = 0;
  const avgI  = emos.reduce((s,e) => s + (EMOTIONS_LIST.find(x=>x.id===e)?.intensity ?? 0.5), 0) / Math.max(emos.length, 1);
  score += avgI * 30;
  score += Math.min(emos.length * 8, 20);
  if (len > 300) score += 25; else if (len > 150) score += 15; else if (len > 60) score += 8;
  score += ((vividness ?? 3) / 5) * 15;
  if (memoryType === "perfect") score += 10; else if (memoryType === "partial") score += 5;
  if (score >= 75) return "legendary";
  if (score >= 52) return "epic";
  if (score >= 30) return "rare";
  return "common";
}

function calcRankScore(dream) {
  const BASE_R = { common:10, rare:30, epic:70, legendary:150 };
  const rs = BASE_R[dream.rarity ?? "common"] ?? 10;
  const ei = (dream.emotions ?? []).reduce((s,e) => s + (EMOTIONS_LIST.find(x=>x.id===e)?.intensity ?? 0.5), 0) * 15;
  const sd = extractTags(dream.content ?? "", dream.fragments ?? []).length * 4;
  const vs = (dream.vividness ?? 3) * 5;
  const h  = (Date.now() - new Date(dream.createdAt ?? Date.now()).getTime()) / 3600000;
  const rb = h < 24 ? 20 : h < 72 ? 10 : h < 168 ? 5 : 0;
  return Math.round(rs + ei + sd + vs + rb);
}

function calcDreamPrice(dream) {
  const BASE  = { common:10, rare:40, epic:120, legendary:400 };
  const RMULT = { common:1.0, rare:1.6, epic:2.8, legendary:5.5 };
  const VMULT = [0, 0.6, 0.8, 1.0, 1.3, 1.7];
  const r  = dream.rarity ?? "common";
  const v  = dream.vividness ?? 3;
  const ss = extractTags(dream.content ?? "", dream.fragments ?? []).length * 3;
  const es = (dream.emotions ?? []).reduce((s,e) => s + (EMOTIONS_LIST.find(x=>x.id===e)?.intensity ?? 0.5) * 8, 0);
  const h  = (Date.now() - new Date(dream.createdAt ?? Date.now()).getTime()) / 3600000;
  const rb = h < 24 ? 15 : h < 72 ? 8 : 3;
  return Math.round((BASE[r] ?? 10) * (RMULT[r] ?? 1) * (VMULT[v] ?? 1) + ss + es + rb);
}

function generateDreamTitle(content, fragments, emotions, tags) {
  const frags = fragments ?? [];
  const PREFIXES = {
    두려움:["어둠 속의","끝없는","사라지는"], 신비:["미지의","숨겨진","빛나는"],
    평온:["고요한","투명한","새벽빛"],        슬픔:["잃어버린","희미한","저무는"],
    긴장:["균열 속","흔들리는","불안한"],      경이:["빛의","경이로운","눈부신"],
    기쁨:["반짝이는","따뜻한","황금빛"],       설렘:["두근거리는","첫번째","새로운"],
  };
  const NOUNS = ["방","세계","길","기억","목소리","정원","도서관","바다","계단","거울","빛","조각"];
  const SUFFS = ["의 꿈","속으로","의 방","의 기억","를 건너"];
  const topEmo = emotions?.[0] ?? "신비";
  const pfxArr = PREFIXES[topEmo] ?? ["신비한"];
  const pfx    = pfxArr[Math.floor(Math.random() * pfxArr.length)];
  const kws    = ((content ?? "") + " " + frags.map(f=>f.word).join(" "))
    .split(/[\s,。.!?]+/).filter(w => w.length >= 2 && w.length <= 5);
  const noun   = kws[1] ?? tags?.[0] ?? NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const suf    = SUFFS[Math.floor(Math.random() * SUFFS.length)];
  return `${pfx} ${noun}${suf}`;
}

/* ── Toast ── */
function Toast({ msg, type, onDone }) {
  useEffect(() => { const id = setTimeout(onDone, 2800); return () => clearTimeout(id); }, []);
  const BG = { info:"var(--acc)", ok:"var(--ok)", err:"var(--err)", warn:"#e07a00" };
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background: BG[type ?? "info"] ?? "var(--acc)", color:"#fff",
      padding:"11px 22px", borderRadius:50, fontSize:".84rem", fontWeight:600,
      boxShadow:"0 8px 28px rgba(0,0,0,.22)", zIndex:10000,
      animation:"toastUp .28s var(--spring) both", whiteSpace:"nowrap" }}>
      {msg}
    </div>
  );
}
function useToast() {
  const [t, setT] = useState(null);
  const show = (msg, type) => setT({ msg, type, key: Date.now() });
  const hide = () => setT(null);
  const node = t ? <Toast key={t.key} msg={t.msg} type={t.type} onDone={hide}/> : null;
  return { show, node };
}

/* ── 분석 결과 화면 ── */
function AnalysisResultScreen({ dream, onDone, streak }) {
  const [step, setStep] = useState(0);
  const STEPS = [
    { label:"꿈 분석 중…",      icon:"🌀" },
    { label:"상징 추출 중…",    icon:"🔮" },
    { label:"희귀도 판정 중…",  icon:"✨" },
    { label:"Dream Aura 생성…", icon:"🌌" },
    { label:"가격 산정 중…",    icon:"💎" },
  ];
  useEffect(() => {
    if (step >= STEPS.length) return;
    const id = setTimeout(() => setStep(s => s + 1), 650);
    return () => clearTimeout(id);
  }, [step]);

  const RCFG = {
    common:    { label:"Common",    cls:"r-common"    },
    rare:      { label:"Rare",      cls:"r-rare"      },
    epic:      { label:"Epic",      cls:"r-epic"      },
    legendary: { label:"Legendary", cls:"r-legendary" },
  };
  const rc   = RCFG[dream.rarity] ?? RCFG.common;
  const done = step >= STEPS.length;

  return (
    <div className="page" style={{ maxWidth:560, animation:"pgIn .38s var(--ease) both" }}>
      <div className="glg" style={{ padding:32, textAlign:"center" }}>
        {!done && (
          <>
            <div style={{ fontSize:48, marginBottom:16, animation:"spin 1.5s linear infinite" }}>
              {STEPS[Math.min(step, STEPS.length-1)].icon}
            </div>
            <p style={{ fontFamily:"var(--fd)", fontSize:"1.2rem", marginBottom:24 }}>
              {STEPS[Math.min(step, STEPS.length-1)].label}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
                  opacity: i <= step ? 1 : 0.25, transition:"opacity .4s" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                    background: i < step ? "var(--ok)" : i === step ? "var(--acc)" : "rgba(0,0,0,.1)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:".65rem", color:"#fff", transition:"background .4s" }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize:".82rem", color: i <= step ? "var(--ink1)" : "var(--ink3)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {done && (
          <div style={{ animation:"pgIn .45s var(--ease) both" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>✨</div>
            <h2 style={{ fontFamily:"var(--fd)", fontSize:"1.6rem", marginBottom:4 }}>{dream.title}</h2>
            <p className="sm" style={{ marginBottom:12 }}>꿈이 기록되었습니다</p>
            {dream.createdAt && (
              <p style={{ fontSize:".68rem", color:"var(--ink3)", marginBottom:16 }}>
                🕐 {formatDreamTime(dream.createdAt, { timezone: dream.timezone })}
              </p>
            )}
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:18 }}>
              <span className={`rar ${rc.cls}`}>{rc.label}</span>
              {dream.verified && <span className="verified-badge">✦ Verified Dream</span>}
              <span style={{ padding:"3px 10px", borderRadius:50, fontSize:".68rem", fontWeight:700,
                background:"var(--acc-lt)", color:"var(--acc)", border:"1px solid rgba(107,92,231,.2)" }}>
                ⚡ {dream.rankScore}점
              </span>
              <span style={{ padding:"3px 10px", borderRadius:50, fontSize:".68rem", fontWeight:700,
                background:"var(--gold-lt)", color:"var(--gold)", border:"1px solid rgba(201,168,76,.25)" }}>
                💰 {dream.price}D
              </span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginBottom:20 }}>
              {(dream.tags ?? []).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            {dream.fortune && (
              <div style={{ borderRadius:"var(--r2)", overflow:"hidden", marginBottom:20 }}>
                <DreamAuraCanvas dna={buildVisualDNA(dream, dream.seed ?? 42)} size={460} autoPlay={true} compact={true}/>
              </div>
            )}
            {/* Streak 마일스톤 표시 */}
            {streak && streak.current >= 3 && (
              <div style={{ marginBottom:16 }}>
                <StreakBadge streak={streak} compact={false}/>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn bg" style={{ flex:1, justifyContent:"center" }} onClick={onDone}>라이브러리로</button>
              <button className="btn bp" style={{ flex:1, justifyContent:"center" }} onClick={onDone}>
                <I n="sparkle" s={14}/> 상세 보기
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes toastUp{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}

/* ── 음성 입력 훅 v2 — 타이머 + 재녹음 ── */
function useSpeechInput(onResult, onHasAudio) {
  const [recording,  setRecording]  = useState(false);
  const [seconds,    setSeconds]    = useState(0);
  const [supported]                 = useState(() =>
    typeof window !== "undefined" && (
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    )
  );
  const recRef    = useRef(null);
  const timerRef  = useRef(null);

  function startRecording() {
    if (!supported) return;
    const SR  = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "ko-KR"; rec.continuous = true; rec.interimResults = true;
    rec.onresult = e => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      onResult(t);
    };
    rec.onend  = () => { setRecording(false); clearInterval(timerRef.current); };
    rec.onerror= () => { setRecording(false); clearInterval(timerRef.current); };
    recRef.current = rec;
    rec.start();
    setRecording(true);
    setSeconds(0);
    if (typeof onHasAudio === "function") onHasAudio(true);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }

  function stopRecording() {
    recRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  }

  function resetRecording() {
    stopRecording();
    setSeconds(0);
    onResult("");
    if (typeof onHasAudio === "function") onHasAudio(false);
  }

  useEffect(() => () => {
    recRef.current?.stop();
    clearInterval(timerRef.current);
  }, []);

  const timerLabel = `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  return { recording, supported, seconds, timerLabel, startRecording, stopRecording, resetRecording };
}

/* ─────────────────────────────────────────────────────────────────
   EDITOR VIEW  (메인 컴포넌트)
───────────────────────────────────────────────────────────────── */
function EditorView({ dream: initDream, onSave, onCancel, dreams }) {
  /* ── Fallback: 핸들러 미연결 방어 ── */
  if (typeof onSave !== "function") {
    return (
      <div className="page" style={{ maxWidth:560, textAlign:"center", paddingTop:60 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
        <p style={{ fontFamily:"var(--fd)", fontSize:"1.3rem", marginBottom:8 }}>에디터를 열 수 없습니다</p>
        <p className="sm" style={{ marginBottom:20 }}>저장 핸들러가 연결되지 않았습니다.</p>
        {typeof onCancel === "function" && <button className="btn bg" onClick={onCancel}>돌아가기</button>}
      </div>
    );
  }

  const isEdit     = !!initDream?.id;
  const editPolicy = isEdit ? calcEditPolicy(initDream) : { canEditContent:true, canEditMeta:true, isMarketListed:false, minutesLeft:60, policy:"free" };
  const { show: showToast, node: toastNode } = useToast();

  const [mode,           setMode]          = useState(initDream?.mode          ?? "narrative");
  const [content,        setContent]       = useState(initDream?.content       ?? "");
  const [fragments,      setFragments]     = useState(initDream?.fragments     ?? []);
  const [structuredFrag, setStructuredFrag]= useState(initDream?.structuredFrag ?? { person:"", place:"", event:"", emotion:"" });
  const [emotions,       setEmotions]      = useState(initDream?.emotions      ?? []);
  const [vividness,      setVividness]     = useState(initDream?.vividness     ?? 3);
  const [memoryType,     setMemoryType]    = useState(initDream?.memoryType    ?? "partial");
  const [locked,         setLocked]        = useState(initDream?.locked        ?? false);
  const [forSale,        setForSale]       = useState(initDream?.forSale       ?? false);
  const [errors,         setErrors]        = useState({});
  const [phase,          setPhase]         = useState("edit");
  const [savedDream,     setSavedDream]    = useState(null);
  const editCount  = useRef(initDream?.editCount ?? 0);
  const startedAt  = useRef(new Date().toISOString());
  const [tagReports, setTagReports] = useState({});

  const [hasAudio, setHasAudio] = useState(initDream?.hasAudio ?? false);
  const { recording, supported: sttOk, seconds: recSec, timerLabel: recTimer,
          startRecording, stopRecording, resetRecording } =
    useSpeechInput(t => setContent(t), setHasAudio);

  function toggleEmotion(id) {
    setEmotions(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) { showToast("감정은 최대 3개까지 선택할 수 있습니다", "warn"); return prev; }
      return [...prev, id];
    });
  }
  function addFragment()         { setFragments(p => [...p, { word:"", desc:"" }]); }
  function removeFragment(i)     { setFragments(p => p.filter((_,idx) => idx !== i)); }
  function updateFragment(i,f,v) { setFragments(p => p.map((fr,idx) => idx===i ? {...fr,[f]:v} : fr)); }

  function validate() {
    const e = {};
    /* 내용 수정 가능할 때만 내용 검증 */
    if (editPolicy.canEditContent) {
      if (mode === "narrative" && content.trim().length < 10) e.content = "꿈 내용을 조금 더 적어주세요 (10자 이상)";
      if (mode === "fragment"  && fragments.filter(f=>f.word.trim()).length === 0) e.fragments = "파편을 하나 이상 입력해주세요";
      if (emotions.length === 0) e.emotions = "감정을 하나 이상 선택해주세요";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) { showToast("입력 내용을 확인해주세요", "err"); return; }
    const now    = new Date();
    const tags   = extractTags(content, fragments, structuredFrag);
    const rarity = analyzeRarity({ content, fragments, emotions, vividness, memoryType });
    const seed   = Date.now() % 99999;
    const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const base = {
      id:              initDream?.id ?? `d_${Date.now()}`,
      mode, content:   content.trim(),
      fragments:       fragments.filter(f => f.word.trim()),
      structuredFrag,
      emotions, vividness, memoryType, tags, rarity, forSale, seed,
      locked,
      editCount:       isEdit ? (initDream?.editCount ?? 0) + 1 : 0,
      edited:          isEdit,
      hasAudio:        hasAudio,
      createdAt:       initDream?.createdAt ?? now.toISOString(),
      createdAtLocal:  formatDreamTime(initDream?.createdAt ?? now.toISOString(), { timezone: tz }),
      timezone:        tz,
      updatedAt:       now.toISOString(),
      startedAt:       startedAt.current,
      analyzed:false, aura:null, auraMeta:{ generationCount:0, lastGeneratedAt:null },
      analysis:null, fortune:null, status:"Draft", likes:0, comments:0,
      ...(isEdit ? {
        analyzed: initDream.analyzed, fortune: initDream.fortune,
        analysis: initDream.analysis, aura: initDream.aura,
        auraMeta: initDream.auraMeta, verified: initDream.verified,
        status: initDream.status, likes: initDream.likes ?? 0, comments: initDream.comments ?? 0,
      } : {}),
    };
    base.title     = (isEdit && initDream?.title) ? initDream.title : generateDreamTitle(content, fragments, emotions, tags);
    base.verified  = calcVerified(base);
    base.rankScore = calcRankScore(base);
    base.price     = calcDreamPrice(base);
    base.fortune   = runFortune(base);
    setSavedDream(base);
    setPhase("result");
    showToast("꿈이 저장되었습니다 ✨", "ok");
    if (typeof onSave === "function") onSave(base);
  }

  if (phase === "result" && savedDream) {
    const resultStreak = calcStreak([savedDream, ...(dreams ?? [])]);
    /* 편집 완료 시: 분석 화면 없이 즉시 복귀 */
    if (isEdit) {
      return (
        <div className="page" style={{ maxWidth:520, textAlign:"center", paddingTop:60,
          animation:"pgIn .38s var(--ease) both" }}>
          <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
          <h2 style={{ fontFamily:"var(--fd)", fontSize:"1.5rem", marginBottom:8 }}>
            {editPolicy.canEditContent ? "꿈이 수정되었습니다" : "설정이 저장되었습니다"}
          </h2>
          <p className="sm" style={{ marginBottom:8 }}>
            {editPolicy.canEditContent
              ? "내용이 업데이트되었습니다"
              : "공개·판매 설정이 변경되었습니다"}
          </p>
          {savedDream.editCount > 0 && (
            <div style={{ marginBottom:20 }}>
              <span className="edited-badge">✏️ Edited ×{savedDream.editCount}</span>
            </div>
          )}
          {/* 편집된 꿈 요약 */}
          <div className="g" style={{ maxWidth:360, margin:"0 auto 24px", padding:"16px 20px", textAlign:"left" }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10, alignItems:"center" }}>
              <span className={`rar r-${savedDream.rarity}`}>{savedDream.rarity}</span>
              {savedDream.verified && <span className="verified-badge">✦ Verified Dream</span>}
              <EditedBadge dream={savedDream}/>
            </div>
            <p style={{ fontFamily:"var(--fd)", fontSize:"1.05rem", marginBottom:8 }}>{savedDream.title}</p>
            {savedDream.createdAt && (
              <span className="ts-chip">🕐 {formatDreamTime(savedDream.createdAt, { timezone: savedDream.timezone })}</span>
            )}
          </div>
          <button className="btn bp" style={{ width:"100%", maxWidth:320, justifyContent:"center", padding:"12px" }}
            onClick={() => { if (typeof onCancel === "function") onCancel(); }}>
            꿈 상세로 돌아가기
          </button>
          {toastNode}
        </div>
      );
    }
    return (
      <>
        <AnalysisResultScreen dream={savedDream} streak={resultStreak}
          onDone={() => { if (typeof onCancel === "function") onCancel(); }}/>
        {toastNode}
      </>
    );
  }

  const previewRarity = analyzeRarity({ content, fragments, emotions, vividness, memoryType });
  const previewTags   = extractTags(content, fragments, structuredFrag);
  const RCLS = { common:"r-common", rare:"r-rare", epic:"r-epic", legendary:"r-legendary" };
  const charCount = mode === "narrative" ? content.length : fragments.filter(f=>f.word).length;

  return (
    <>
    <div className="page" style={{ maxWidth:680, animation:"pgIn .38s var(--ease) both" }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <button className="bback"
          onClick={() => typeof onCancel === "function" && onCancel()}
          style={{ marginBottom:10 }}>
          <I n="back" s={14}/> 취소
        </button>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <h1 style={{ fontFamily:"var(--fd)", fontSize:"1.8rem", fontWeight:500 }}>
              {isEdit ? "꿈 편집" : "새 꿈 기록"}
            </h1>
            <p className="sm" style={{ marginTop:6 }}>
              {isEdit
                ? "공개 여부·판매 설정은 언제든 변경 가능합니다"
                : "AI가 희귀도·제목·태그·Aura·가격을 자동으로 분석합니다"}
            </p>
          </div>
          {/* Dream Timestamp */}
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <p style={{ fontSize:".62rem", color:"var(--ink3)", marginBottom:2 }}>작성 시작</p>
            <p style={{ fontSize:".75rem", fontWeight:600, color:"var(--acc)" }}>
              {new Date(startedAt.current).toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit" })}
            </p>
            <p style={{ fontSize:".58rem", color:"var(--ink3)" }}>
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>
        </div>
      </div>

      {/* ── 편집 정책 배너 (편집 모드일 때만) ── */}
      {isEdit && (
        <EditPolicyBanner
          policy={editPolicy.policy}
          minutesLeft={editPolicy.minutesLeft}
          isMarketListed={editPolicy.isMarketListed}
        />
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

        {/* ── 내용 편집 영역 (잠금 정책 적용) ── */}
        <div className={!editPolicy.canEditContent && isEdit ? "edit-section-locked" : ""} style={{ display:"flex", flexDirection:"column", gap:18 }}>

        {/* 1. 기록 방식 */}
        <div className="glg" style={{ padding:22 }}>
          <p className="lbl" style={{ marginBottom:14 }}>기록 방식</p>
          <div style={{ display:"flex", gap:10 }}>
            {[
              { id:"narrative", icon:"📖", label:"이야기 기록", desc:"꿈을 한 편의 이야기처럼 남기기" },
              { id:"fragment",  icon:"🧩", label:"장면 기록",   desc:"기억나는 장면만 조각처럼 남기기" },
            ].map(m => (
              <div key={m.id} onClick={() => setMode(m.id)}
                style={{ flex:1, padding:"14px 16px", borderRadius:"var(--r1)", cursor:"pointer",
                  border:`1.5px solid ${mode===m.id?"var(--acc)":"rgba(0,0,0,.08)"}`,
                  background: mode===m.id ? "var(--acc-lt)" : "rgba(255,255,255,.5)",
                  transition:"all .18s var(--ease)" }}>
                <div style={{ fontSize:"1.4rem", marginBottom:6 }}>{m.icon}</div>
                <div style={{ fontWeight:600, fontSize:".85rem", marginBottom:3 }}>{m.label}</div>
                <div style={{ fontSize:".72rem", color:"var(--ink3)" }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2a. 이야기 기록 + 음성 */}
        {mode === "narrative" && (
          <div className="glg" style={{ padding:22 }}>
            <div className="field">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <label className="flbl">꿈 이야기 *</label>
                {sttOk && (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {recording && (
                      <>
                        <div className="rec-dot"/>
                        <span className="rec-timer">{recTimer}</span>
                      </>
                    )}
                    {hasAudio && !recording && (
                      <span style={{ fontSize:".65rem", padding:"2px 7px", borderRadius:50,
                        background:"var(--ok-lt)", color:"var(--ok)", fontWeight:600 }}>
                        🎙️ 녹음됨
                      </span>
                    )}
                    <button onClick={recording ? stopRecording : startRecording}
                      className={`btn bsm ${recording ? "bp" : "bg"}`}
                      style={{ gap:5, padding:"5px 12px" }}>
                      <I n="mic" s={13} c={recording ? "#fff" : "var(--acc)"}/>
                      {recording ? "녹음 중단" : "녹음 기록"}
                    </button>
                    {hasAudio && !recording && (
                      <button onClick={resetRecording} className="btn bg bsm" style={{ padding:"5px 10px" }}>
                        재녹음
                      </button>
                    )}
                  </div>
                )}
              </div>
              <textarea value={content}
                onChange={e => { setContent(e.target.value); setErrors(p=>({...p,content:null})); }}
                placeholder={"꿈에서 본 것, 느낀 것, 기억나는 장면을 자유롭게 써주세요.\n\n예) 거대한 수중 도서관에 있었다…"}
                rows={8}
                style={{ padding:"12px 14px", borderRadius:"var(--r1)", fontSize:".88rem",
                  border:`1.5px solid ${errors.content?"var(--err)":"rgba(0,0,0,.1)"}`,
                  background:"rgba(255,255,255,.7)", outline:"none", width:"100%",
                  fontFamily:"var(--fb)", lineHeight:1.75, resize:"vertical", transition:"border .18s" }}
                onFocus={e=>e.target.style.borderColor="var(--acc)"}
                onBlur={e=>e.target.style.borderColor=errors.content?"var(--err)":"rgba(0,0,0,.1)"}/>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                {errors.content ? <p style={{fontSize:".72rem",color:"var(--err)"}}>{errors.content}</p> : <span/>}
                <span className="sm" style={{ fontSize:".68rem" }}>{charCount}자</span>
              </div>
            </div>
          </div>
        )}

        {/* 2b. 장면 기록 — 구조화 4-필드 모드 */}
        {mode === "fragment" && (
          <div className="glg" style={{ padding:22 }}>
            <div style={{ marginBottom:18 }}>
              <p className="lbl" style={{ marginBottom:4 }}>꿈의 조각 *</p>
              <p className="sm">인물·장소·사건·감정을 짧은 단어로 입력하면 AI가 꿈을 구조화합니다</p>
            </div>
            {errors.fragments && <p style={{fontSize:".72rem",color:"var(--err)",marginBottom:10}}>{errors.fragments}</p>}
            {/* 4-필드 구조화 입력 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
              {[
                { field:"person",  icon:"👤", label:"인물",  placeholder:"예: 엄마, 낯선 남자" },
                { field:"place",   icon:"📍", label:"장소",  placeholder:"예: 붉은 정원, 수중 도서관" },
                { field:"event",   icon:"⚡", label:"사건",  placeholder:"예: 꽃을 심음, 계단을 달림" },
                { field:"emotion", icon:"💫", label:"감정",  placeholder:"예: 그리움, 불안" },
              ].map(({ field, icon, label, placeholder }) => (
                <div key={field} style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  <label style={{ fontSize:".70rem", fontWeight:700, color:"var(--ink3)",
                    display:"flex", alignItems:"center", gap:4 }}>
                    <span>{icon}</span> {label}
                  </label>
                  <input
                    value={structuredFrag[field] ?? ""}
                    onChange={e => setStructuredFrag(p => ({...p, [field]: e.target.value}))}
                    placeholder={placeholder}
                    style={{ padding:"9px 12px", borderRadius:"var(--r1)", fontSize:".84rem",
                      border:"1.5px solid rgba(0,0,0,.08)", background:"rgba(255,255,255,.8)",
                      outline:"none", transition:"border .15s" }}
                    onFocus={e=>e.target.style.borderColor="var(--acc)"}
                    onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.08)"}/>
                </div>
              ))}
            </div>
            {/* 추가 조각 자유 입력 */}
            <div style={{ borderTop:"1px solid rgba(0,0,0,.06)", paddingTop:16, marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <p style={{ fontSize:".75rem", fontWeight:600, color:"var(--ink3)" }}>
                  추가 기억 조각 (선택)
                </p>
                <button className="btn bg bsm" onClick={addFragment}><I n="plus" s={12}/> 조각 추가</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {fragments.map((fr, i) => (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:"var(--acc-lt)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:".70rem", color:"var(--acc)", fontWeight:700, flexShrink:0 }}>{i+1}</div>
                    <input value={fr.word} onChange={e=>updateFragment(i,"word",e.target.value)}
                      placeholder="키워드"
                      style={{ flex:"0 0 120px", padding:"7px 10px", borderRadius:"var(--r1)",
                        fontSize:".82rem", border:"1px solid rgba(0,0,0,.09)",
                        background:"rgba(255,255,255,.8)", outline:"none", fontWeight:600 }}/>
                    <input value={fr.desc} onChange={e=>updateFragment(i,"desc",e.target.value)}
                      placeholder="설명 (선택)"
                      style={{ flex:1, padding:"7px 10px", borderRadius:"var(--r1)",
                        fontSize:".80rem", border:"1px solid rgba(0,0,0,.09)",
                        background:"rgba(255,255,255,.8)", outline:"none", color:"var(--ink2)" }}/>
                    <button onClick={() => removeFragment(i)}
                      style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink3)", padding:4 }}
                      onMouseEnter={e=>e.currentTarget.style.color="var(--err)"}
                      onMouseLeave={e=>e.currentTarget.style.color="var(--ink3)"}>
                      <I n="x" s={13}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* 구조화 미리보기 */}
            {(structuredFrag.person||structuredFrag.place||structuredFrag.event||structuredFrag.emotion) && (
              <div style={{ padding:"10px 14px", borderRadius:"var(--r1)",
                background:"rgba(107,92,231,.05)", border:"1px solid rgba(107,92,231,.15)" }}>
                <p style={{ fontSize:".68rem", color:"var(--acc)", fontWeight:600, marginBottom:6 }}>
                  🤖 AI 구조화 미리보기
                </p>
                <p style={{ fontSize:".78rem", lineHeight:1.7, color:"var(--ink2)" }}>
                  {[
                    structuredFrag.person  && `${structuredFrag.person}이(가)`,
                    structuredFrag.place   && `${structuredFrag.place}에서`,
                    structuredFrag.event   && structuredFrag.event,
                    structuredFrag.emotion && `- ${structuredFrag.emotion}의 감정을 느꼈다.`,
                  ].filter(Boolean).join(" ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. 감정 선택 */}
        <div className="glg" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <p className="lbl">꿈의 감정 *</p>
              <p className="sm" style={{ marginTop:2 }}>최대 3개 — 희귀도·Aura·가격에 반영됩니다</p>
            </div>
            <span style={{ fontSize:".72rem", color:emotions.length===3?"var(--acc)":"var(--ink3)",
              fontWeight:emotions.length===3?700:400 }}>{emotions.length}/3</span>
          </div>
          {errors.emotions && <p style={{fontSize:".72rem",color:"var(--err)",marginBottom:8}}>{errors.emotions}</p>}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {EMOTIONS_LIST.map(em => {
              const sel = emotions.includes(em.id);
              return (
                <div key={em.id} onClick={() => toggleEmotion(em.id)}
                  style={{ padding:"10px 8px", borderRadius:"var(--r1)", cursor:"pointer", textAlign:"center",
                    border:`1.5px solid ${sel?"var(--acc)":"rgba(0,0,0,.07)"}`,
                    background: sel ? "var(--acc-lt)" : "rgba(255,255,255,.5)",
                    transform: sel ? "scale(1.04)" : "scale(1)", transition:"all .15s var(--ease)" }}>
                  <div style={{ fontSize:"1.35rem", marginBottom:4 }}>{em.icon}</div>
                  <div style={{ fontSize:".72rem", fontWeight:sel?700:400 }}>{em.id}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 선명도 */}
        <div className="glg" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <p className="lbl">꿈 선명도</p>
            <span style={{ fontFamily:"var(--fd)", fontSize:"1rem", color:"var(--acc)" }}>
              {VIVIDNESS_LABELS[vividness]}
            </span>
          </div>
          <input type="range" min={1} max={5} value={vividness}
            onChange={e => setVividness(+e.target.value)}
            style={{ width:"100%", accentColor:"var(--acc)", marginBottom:8 }}/>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            {VIVIDNESS_LABELS.slice(1).map((l,i) => (
              <span key={i} style={{ fontSize:".62rem",
                color:(i+1)===vividness?"var(--acc)":"var(--ink3)",
                fontWeight:(i+1)===vividness?700:400 }}>{l}</span>
            ))}
          </div>
          <p className="sm" style={{ marginTop:10, fontSize:".70rem" }}>선명도가 높을수록 Dream 가치가 올라갑니다</p>
        </div>

        {/* 5. 기억 상태 */}
        <div className="glg" style={{ padding:22 }}>
          <p className="lbl" style={{ marginBottom:14 }}>기억 상태</p>
          <div style={{ display:"flex", gap:10 }}>
            {MEMORY_TYPES.map(mt => (
              <div key={mt.id} onClick={() => setMemoryType(mt.id)}
                style={{ flex:1, padding:"12px 10px", borderRadius:"var(--r1)", cursor:"pointer", textAlign:"center",
                  border:`1.5px solid ${memoryType===mt.id?"var(--acc)":"rgba(0,0,0,.07)"}`,
                  background: memoryType===mt.id ? "var(--acc-lt)" : "rgba(255,255,255,.5)",
                  transition:"all .15s var(--ease)" }}>
                <div style={{ fontSize:"1.3rem", marginBottom:6 }}>{mt.icon}</div>
                <div style={{ fontSize:".78rem", fontWeight:memoryType===mt.id?700:400 }}>{mt.label}</div>
              </div>
            ))}
          </div>
        </div>

        </div>{/* end 내용 편집 영역 */}

        {/* 6. AI 분석 미리보기 + 태그 피드백 */}
        <div className="glg" style={{ padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <p className="lbl" style={{ marginBottom:3 }}>AI 자동 분석</p>
              <p className="sm">저장 시 희귀도·제목·태그를 AI가 결정합니다</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <span className={`rar ${RCLS[previewRarity]}`}>{previewRarity.toUpperCase()}</span>
              <p style={{ fontSize:".60rem", color:"var(--ink3)", marginTop:4 }}>미리보기</p>
            </div>
          </div>
          {previewTags.length > 0 && (
            <div style={{ paddingTop:14, borderTop:"1px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <p style={{ fontSize:".68rem", color:"var(--ink3)" }}>🏷️ AI 태그 미리보기</p>
                <button className="btn bg bsm"
                  style={{ fontSize:".62rem", padding:"3px 8px" }}
                  onClick={() => {
                    const newTags = extractTags(content, fragments, structuredFrag);
                    showToast("태그를 재분석했습니다", "ok");
                  }}>
                  🔄 재분석
                </button>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {previewTags.map(t => {
                  const reported = tagReports[t];
                  return (
                    <span key={t}
                      className="tag"
                      style={{ cursor:"pointer", opacity: reported ? 0.45 : 1,
                        textDecoration: reported ? "line-through" : "none",
                        transition:"all .15s" }}
                      title={reported ? "신고됨" : "클릭하면 핵심 태그가 아님으로 신고"}
                      onClick={() => {
                        setTagReports(p => ({...p, [t]: !p[t]}));
                        if (!tagReports[t]) showToast(`'${t}' 태그 신고됨`, "warn");
                      }}>
                      {reported ? "✕ " : ""}{t}
                    </span>
                  );
                })}
              </div>
              <p style={{ fontSize:".62rem", color:"var(--ink3)", marginTop:6 }}>
                핵심이 아닌 태그를 클릭해 신고할 수 있습니다 · 신고 데이터는 AI 개선에 활용됩니다
              </p>
            </div>
          )}
        </div>

        {/* 7. 판매 설정 */}
        <div className="glg" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p className="lbl">Dream Market 판매</p>
              <p className="sm" style={{ marginTop:3 }}>저장 후 Market에 자동 등록됩니다</p>
            </div>
            <div onClick={() => setForSale(p => !p)}
              style={{ width:44, height:24, borderRadius:12, cursor:"pointer",
                background: forSale ? "var(--acc)" : "rgba(0,0,0,.12)",
                position:"relative", transition:"background .2s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, borderRadius:"50%", width:18, height:18,
                background:"#fff", transition:"left .2s var(--ease)",
                left: forSale ? 23 : 3, boxShadow:"0 1px 4px rgba(0,0,0,.22)" }}/>
            </div>
          </div>
          {forSale && (
            <div style={{ marginTop:14, padding:"12px 14px", borderRadius:"var(--r1)",
              background:"rgba(201,168,76,.07)", border:"1px solid rgba(201,168,76,.2)" }}>
              <p style={{ fontSize:".75rem", color:"var(--gold)", fontWeight:600, marginBottom:4 }}>💰 예상 가격 (자동 산정)</p>
              <p style={{ fontFamily:"var(--fd)", fontSize:"1.4rem", color:"var(--gold)" }}>
                {calcDreamPrice({ content, fragments, emotions, vividness, memoryType,
                  rarity: previewRarity, createdAt: new Date().toISOString() })} D
              </p>
              <p className="sm" style={{ marginTop:4, fontSize:".68rem" }}>희귀도·선명도·감정·상징 기반 자동 계산</p>
            </div>
          )}
        </div>

        {/* 7. 잠금 기능 */}
        <div className="glg" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                <span style={{ fontSize:"1.1rem" }}>🔒</span>
                <p className="lbl">꿈 잠금</p>
              </div>
              <p className="sm">잠긴 꿈은 목록에서 내용이 가려지며 인증 후 열람 가능합니다</p>
              {locked && forSale && (
                <p style={{ fontSize:".70rem", color:"var(--err)", marginTop:4 }}>
                  ⚠️ 판매 등록 시 잠금이 자동 해제됩니다
                </p>
              )}
            </div>
            <div onClick={() => setLocked(p => !p)}
              style={{ width:44, height:24, borderRadius:12, cursor:"pointer",
                background: locked ? "#6b5ce7" : "rgba(0,0,0,.12)",
                position:"relative", transition:"background .2s", flexShrink:0 }}>
              <div style={{ position:"absolute", top:3, borderRadius:"50%", width:18, height:18,
                background:"#fff", transition:"left .2s var(--ease)",
                left: locked ? 23 : 3, boxShadow:"0 1px 4px rgba(0,0,0,.22)" }}/>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div style={{ display:"flex", gap:12, paddingBottom:40 }}>
          <button className="btn bg" style={{ flex:1, justifyContent:"center", padding:"13px" }}
            onClick={() => typeof onCancel === "function" && onCancel()}>
            취소
          </button>
          <button className="btn bp" style={{ flex:2, justifyContent:"center", padding:"13px", fontSize:".94rem" }}
            onClick={handleSubmit}>
            <I n="sparkle" s={15}/>
            {isEdit
              ? (editPolicy.canEditContent ? "꿈 수정 저장" : "설정 저장")
              : "꿈 기록하기"}
          </button>
        </div>

      </div>
    </div>
    {toastNode}
    <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
    </>
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
          const isLocked = !!dream.locked;
          const libTags = (dream.tags ?? []).slice(0, 4);
          return (
            <div key={dream.id}
              className={`g${isLocked ? " dream-locked-overlay" : ""}`}
              style={{padding:20,cursor:"pointer",transition:"all .22s var(--ease)",position:"relative",
                borderLeft:(gid ? `3px solid var(--${gid})` : "3px solid transparent")}}
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
                  <span style={{fontSize:".76rem",color:"var(--ink3)"}}>{isLocked ? "🔒 잠긴 꿈" : "영상 없음"}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <span style={{fontFamily:"var(--fd)",fontSize:".98rem",fontWeight:500}}>
                  {dream.title}
                  {isLocked && <span style={{marginLeft:5,fontSize:10}}>🔒</span>}
                </span>
                <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
              </div>
              {/* 배지 행 */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
                {dream.verified && <span className="verified-badge">✦ Verified</span>}
                <EditedBadge dream={dream}/>
                {dream.rankScore > 0 && <span className="rank-pill">⚡{dream.rankScore}pt</span>}
                {(dream.extraMemories?.length ?? 0) > 0 && (
                  <span style={{fontSize:".62rem",padding:"1px 6px",borderRadius:50,
                    background:"rgba(78,175,128,.10)",color:"var(--ok)",fontWeight:600}}>
                    🌙 +{dream.extraMemories.length}
                  </span>
                )}
                {f && <FortuneBadge fortune={f}/>}
              </div>
              {/* Timestamp */}
              {(dream.createdAt || dream.date) && (
                <p className="ts-chip" style={{marginBottom:6,display:"inline-flex"}}>
                  🕐 {dream.createdAt
                    ? formatDreamTime(dream.createdAt, { timezone: dream.timezone, compact: true })
                    : dream.date}
                </p>
              )}
              {!isLocked && (
                <p className="sm" style={{marginBottom:6,lineHeight:1.6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                  {dream.mode==="fragment"?dream.fragments.map(fr=>fr.word).join(" · "):dream.content.replace(/\[\?\]/g,"…")}
                </p>
              )}
              {/* 태그 */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                {libTags.map(t=><span key={t} className="tag">{t}</span>)}
              </div>
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
                <p style={{fontSize:".80rem",color:"var(--gold)",fontWeight:600}}>추천가: {selDream.fortune.price?.min}-{selDream.fortune.price?.max}D</p>
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
                <label className="flbl">{tradeType==="FIXED"?"즉시구매가":"판매 희망가"} {"—"} {fixedP}D</label>
                <input type="range" min={10} max={3000} step={10} value={fixedP} onChange={e=>setFixedP(+e.target.value)} style={{width:"100%",accentColor:"var(--acc)"}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}><span className="sm">10D</span><span className="sm">3000D</span></div>
              </div>
            )}
            {tradeType==="AUCTION" && (
              <>
                <div className="field" style={{marginBottom:12}}>
                  <label className="flbl">{"시작가 —"} {startP}D</label>
                  <input type="range" min={10} max={2000} step={10} value={startP} onChange={e=>setStartP(+e.target.value)} style={{width:"100%",accentColor:"var(--acc)"}}/>
                </div>
                <div className="field" style={{marginBottom:12}}>
                  <label className="flbl">즉시 낙찰가 (선택)</label>
                  <input className="inp" type="number" value={buyoutP} onChange={e=>setBuyoutP(e.target.value)} placeholder="없으면 비워두세요"/>
                </div>
                <div className="field" style={{marginBottom:12}}>
                  <label className="flbl">{"경매 기간 —"} {duration}{"시간"}</label>
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

/* ════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
════════════════════════════════════════════════════════════════════ */

/* pill button style helper */
function mkPill(active, accent) {
  const a = accent || "var(--acc)";
  return {
    padding:"6px 15px", borderRadius:50,
    border:`1.5px solid ${active ? a : "rgba(0,0,0,.09)"}`,
    cursor:"pointer", fontFamily:"var(--fb)", fontSize:".76rem", fontWeight:500,
    transition:"all .18s var(--ease)",
    background: active ? a : "rgba(255,255,255,.6)",
    color: active ? "#fff" : "var(--ink3)",
  };
}

/* Horizontal scroll rail */
function HRail({ children }) {
  return (
    <div style={{
      display:"flex", gap:14, overflowX:"auto", paddingBottom:6,
      scrollbarWidth:"none", WebkitOverflowScrolling:"touch",
    }}>
      {children}
    </div>
  );
}

/* Section header */
function SectionHead({ icon, title, sub, badge }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:"var(--acc-lt)", border:"1px solid rgba(107,92,231,.18)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem",
        }}>{icon}</div>
        <div>
          <p className="lbl">{title}</p>
          {sub && <p className="sm" style={{marginTop:2,fontSize:".71rem"}}>{sub}</p>}
        </div>
      </div>
      {badge != null && (
        <span style={{
          padding:"3px 11px", borderRadius:50, fontSize:".65rem", fontWeight:700,
          background:"var(--acc-lt)", color:"var(--acc)", border:"1px solid rgba(107,92,231,.18)",
        }}>{badge}</span>
      )}
    </div>
  );
}

/* inline countdown — isolated re-render */
function Countdown({ endsAt }) {
  const label = useCountdown(endsAt);
  return <>{label ?? "—"}</>;
}

/* stat chip */
function StatChip({ label, value, color }) {
  return (
    <div style={{
      textAlign:"center", padding:"5px 12px", borderRadius:10,
      background:"var(--surface)", border:"1px solid var(--border)",
    }}>
      <div style={{fontFamily:"var(--fd)", fontSize:".94rem", color, fontWeight:400}}>{value}</div>
      <div style={{fontSize:".59rem", color:"var(--ink3)", fontWeight:500, marginTop:1}}>{label}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MARKET — SECTION CARDS
════════════════════════════════════════════════════════════════════ */

/* ── Top Picks Card ── */
function TopPickCard({ dream, listing, onOpen }) {
  const [hov, setHov] = useState(false);
  const fid   = dream.fortuneId ?? "neutral";
  const grade = GRADES.find(g => g.id === fid) ?? GRADES[2];
  const price = listing?.currentPrice ?? listing?.startPrice ?? listing?.priceFixed ?? dream._price.price;

  return (
    <div
      style={{
        flexShrink:0, width:228, borderRadius:"var(--r2)", overflow:"hidden", cursor:"pointer",
        background:"var(--surface)", border:"1px solid var(--border)",
        borderLeft:`3px solid var(--${fid})`,
        boxShadow: hov ? "var(--sh-md)" : "var(--sh-sm)",
        transform: hov ? "translateY(-4px)" : "none",
        transition:"all .22s var(--ease)",
      }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      onClick={()=>listing?.id && onOpen(listing.id)}
    >
      {/* thumb */}
      <div style={{
        height:96, position:"relative", overflow:"hidden",
        background: dream.hasVideo ? (VID_BG[fid] ?? VID_BG.neutral) : `var(--${fid}-lt)`,
      }}>
        <div style={{
          position:"absolute", inset:0, display:"flex",
          alignItems:"center", justifyContent:"center",
        }}>
          <div style={{
            width: hov ? 52 : 38, height: hov ? 52 : 38, borderRadius:"50%",
            background: ORB_BG[fid] ?? ORB_BG.neutral,
            boxShadow:"0 0 24px rgba(155,120,255,.4)",
            transition:"all .3s var(--ease)",
          }}/>
        </div>
        {dream.hasVideo && (
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:hov?1:0,transition:"opacity .2s"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.4)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
              <I n="play" s={12} c="rgba(255,255,255,.9)"/>
            </div>
          </div>
        )}
        {listing?.type === "AUCTION" && listing.endsAt && (
          <div style={{position:"absolute",top:7,right:7,padding:"2px 8px",borderRadius:50,fontSize:".60rem",fontWeight:700,background:"rgba(224,92,92,.85)",color:"#fff",backdropFilter:"blur(4px)"}}>
            ⏱ <Countdown endsAt={listing.endsAt}/>
          </div>
        )}
      </div>
      <div style={{padding:"12px 14px"}}>
        <span className={`fb fb-${fid}`} style={{marginBottom:6,display:"inline-flex",fontSize:".62rem"}}>{grade.icon} {grade.label}</span>
        <div style={{fontFamily:"var(--fd)",fontSize:".90rem",fontWeight:500,lineHeight:1.3,marginBottom:8,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{dream.title}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"var(--fd)",fontSize:"1.1rem",color:"var(--gold)",fontWeight:400}}>{price.toLocaleString()}D</span>
          <TypeBadge listing={listing}/>
        </div>
      </div>
    </div>
  );
}

/* ── Cinema Card ── */
function CinemaCard({ dream, listing, onOpen }) {
  const [hov, setHov] = useState(false);
  const fid   = dream.fortuneId ?? "neutral";
  const grade = GRADES.find(g => g.id === fid) ?? GRADES[2];
  const price = listing?.priceFixed ?? dream._price.price;

  return (
    <div
      style={{
        flexShrink:0, width:192, borderRadius:"var(--r2)", overflow:"hidden", cursor:"pointer",
        background:"var(--surface)", border:"1px solid var(--border)",
        boxShadow: hov ? "var(--sh-md)" : "var(--sh-sm)",
        transform: hov ? "translateY(-4px)" : "none",
        transition:"all .22s var(--ease)",
      }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      onClick={()=>listing?.id && onOpen(listing.id)}
    >
      <div style={{height:128,background:VID_BG[fid]??VID_BG.neutral,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{
            width: hov?60:42, height: hov?60:42, borderRadius:"50%",
            background: ORB_BG[fid]??ORB_BG.neutral,
            boxShadow:"0 0 32px rgba(155,120,255,.5)",
            transition:"all .3s var(--ease)",
          }}/>
        </div>
        {hov && (
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.15)"}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,.22)",border:"2px solid rgba(255,255,255,.44)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
              <I n="play" s={16} c="rgba(255,255,255,.95)"/>
            </div>
          </div>
        )}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"22px 10px 8px",background:"linear-gradient(transparent,rgba(0,0,0,.6))"}}>
          <span className={`fb fb-${fid}`} style={{fontSize:".58rem",padding:"2px 6px"}}>{grade.icon} {grade.ko ?? grade.label}</span>
        </div>
      </div>
      <div style={{padding:"10px 12px"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:".85rem",fontWeight:500,marginBottom:5,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{dream.title}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="sm" style={{fontSize:".65rem"}}>by {dream.author}</span>
          <span style={{fontFamily:"var(--fd)",fontSize:".88rem",color:"var(--gold)"}}>{price.toLocaleString()}D</span>
        </div>
      </div>
    </div>
  );
}

/* ── Trending Card ── */
function TrendingCard({ dream, listing, rank, onOpen }) {
  const fid   = dream.fortuneId ?? "neutral";
  const grade = GRADES.find(g => g.id === fid) ?? GRADES[2];
  const price = listing?.priceFixed ?? listing?.currentPrice ?? dream._price.price;

  return (
    <div
      style={{
        flexShrink:0, width:236, padding:"14px 15px", borderRadius:"var(--r2)", cursor:"pointer",
        background:"var(--surface)", border:"1px solid var(--border)",
        borderLeft:`3px solid var(--${fid})`,
        boxShadow:"var(--sh-sm)", transition:"all .22s var(--ease)",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh-md)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="var(--sh-sm)";}}
      onClick={()=>listing?.id && onOpen(listing.id)}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontFamily:"var(--fd)",fontSize:"1.6rem",color:"rgba(0,0,0,.06)",fontWeight:700,lineHeight:1,userSelect:"none"}}>{String(rank).padStart(2,"0")}</span>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          <span style={{fontSize:".71rem",fontWeight:700,color:"var(--acc)"}}>💬 {dream.comments}</span>
          <span style={{fontSize:".71rem",color:"var(--ink3)"}}>❤️ {dream.likes}</span>
        </div>
      </div>
      <span className={`fb fb-${fid}`} style={{marginBottom:7,display:"inline-flex"}}>{grade.icon}</span>
      <div style={{fontFamily:"var(--fd)",fontSize:".91rem",fontWeight:500,marginBottom:5,lineHeight:1.3}}>{dream.title}</div>
      <p className="sm" style={{fontSize:".70rem",lineHeight:1.55,marginBottom:10,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{dream.preview}</p>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <TypeBadge listing={listing}/>
        <span style={{fontFamily:"var(--fd)",fontSize:".92rem",color:"var(--gold)"}}>{price.toLocaleString()}D</span>
      </div>
    </div>
  );
}

/* ── Similar Card ── */
function SimilarCard({ dream, listing, onOpen }) {
  const fid   = dream.fortuneId ?? "neutral";
  const grade = GRADES.find(g => g.id === fid) ?? GRADES[2];
  const rec   = recommendScore(dream);
  const price = listing?.priceFixed ?? listing?.currentPrice ?? dream._price.price;

  return (
    <div
      style={{
        flexShrink:0, width:218, padding:"13px 14px", borderRadius:"var(--r2)", cursor:"pointer",
        background:"var(--surface)", border:"1px solid var(--border)",
        borderLeft:`3px solid var(--${fid})`,
        boxShadow:"var(--sh-sm)", transition:"all .22s var(--ease)",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh-md)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="var(--sh-sm)";}}
      onClick={()=>listing?.id && onOpen(listing.id)}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
        <span className={`fb fb-${fid}`} style={{fontSize:".62rem"}}>{grade.icon} {grade.label}</span>
        <span style={{fontSize:".63rem",fontWeight:700,color:"var(--acc)",padding:"2px 7px",borderRadius:50,background:"var(--acc-lt)",border:"1px solid rgba(107,92,231,.18)"}}>
          매칭 {rec.total}점
        </span>
      </div>
      <div style={{fontFamily:"var(--fd)",fontSize:".90rem",fontWeight:500,marginBottom:6,lineHeight:1.3}}>{dream.title}</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
        {rec.symbolScore  > 0 && <span style={{fontSize:".58rem",padding:"1px 6px",borderRadius:50,background:"rgba(155,126,255,.10)",color:"#9B7EFF",border:"1px solid rgba(155,126,255,.2)"}}>상징 {rec.symbolScore}p</span>}
        {rec.emotionScore > 0 && <span style={{fontSize:".58rem",padding:"1px 6px",borderRadius:50,background:"rgba(244,169,194,.12)",color:"#C0608A",border:"1px solid rgba(244,169,194,.26)"}}>감정 {rec.emotionScore}p</span>}
        {rec.freshSc      > 0 && <span style={{fontSize:".58rem",padding:"1px 6px",borderRadius:50,background:"var(--ok-lt)",color:"var(--ok)",border:"1px solid rgba(78,175,128,.24)"}}>신선 {rec.freshSc}p</span>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <TypeBadge listing={listing}/>
        <span style={{fontFamily:"var(--fd)",fontSize:".92rem",color:"var(--gold)"}}>{price.toLocaleString()}D</span>
      </div>
    </div>
  );
}

/* ── Feed Card (Dream Feed — vertical grid) ── */
function FeedCard({ dream, listing, bids, onOpen, onGoExchange }) {
  const fid    = dream.fortuneId ?? "neutral";
  const grade  = GRADES.find(g => g.id === fid) ?? GRADES[2];
  const isBad  = fid === "warn" || fid === "dark";
  const isSold = listing?.status === "SOLD";
  const safeBids = (bids ?? []).filter(b => b.listingId === listing?.id);
  const price  = listing?.currentPrice ?? listing?.startPrice ?? listing?.priceFixed ?? dream._price.price;

  return (
    <div
      className="g"
      style={{
        padding:0, overflow:"hidden", cursor:"pointer",
        borderLeft:`3px solid var(--${fid})`,
        opacity: isSold ? .62 : 1,
        transition:"all .22s var(--ease)",
      }}
      onMouseEnter={e=>{ if(!isSold){ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--sh-md)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
    >
      {/* video thumb */}
      {dream.hasVideo && (
        <div
          style={{height:116,background:VID_BG[fid]??VID_BG.neutral,position:"relative",overflow:"hidden"}}
          onClick={()=>listing?.id && onOpen(listing.id)}
        >
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:ORB_BG[fid]??ORB_BG.neutral,boxShadow:"0 0 28px rgba(155,120,255,.45)"}}/>
          </div>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.18)",border:"2px solid rgba(255,255,255,.34)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
              <I n="play" s={13} c="rgba(255,255,255,.85)"/>
            </div>
          </div>
          {isSold && (
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.42)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:700,letterSpacing:".1em",fontSize:".88rem"}}>SOLD</span>
            </div>
          )}
        </div>
      )}

      {/* body */}
      <div style={{padding:"14px 15px"}} onClick={()=>listing?.id && onOpen(listing.id)}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          <span style={{fontSize:".9rem"}}>{dream.avatar}</span>
          <span className="sm" style={{fontWeight:500}}>{dream.author}</span>
          {dream.verified && <span style={{color:"var(--gold)",fontSize:10}}>✦</span>}
          <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
            <TypeBadge listing={listing}/>
            {isSold && <span style={{padding:"2px 7px",borderRadius:50,fontSize:".61rem",fontWeight:700,background:"var(--ok-lt)",color:"var(--ok)",border:"1px solid rgba(78,175,128,.28)"}}>✓ SOLD</span>}
          </div>
        </div>

        <h3 style={{fontFamily:"var(--fd)",fontSize:".96rem",fontWeight:500,lineHeight:1.3,marginBottom:6}}>{dream.title}</h3>
        <span className={`fb fb-${fid}`} style={{marginBottom:8,display:"inline-flex",fontSize:".62rem"}}>{grade.icon} {grade.label}</span>
        <p className="sm" style={{marginBottom:8,lineHeight:1.65,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{dream.preview}</p>

        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>
          {(dream.tags ?? []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <div style={{display:"flex",gap:12,marginBottom:10,fontSize:".75rem",color:"var(--ink3)"}}>
          <span><I n="heart" s={11} c="var(--ink3)"/> {dream.likes}</span>
          <span>💬 {dream.comments}</span>
          {listing?.type === "AUCTION" && <span style={{color:"var(--acc)"}}>👥 {safeBids.length}명 입찰</span>}
        </div>

        {/* auction ticker */}
        {listing?.type === "AUCTION" && listing.endsAt && !isSold && (
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"7px 10px",borderRadius:9,background:"rgba(224,92,92,.06)",border:"1px solid rgba(224,92,92,.18)"}}>
            <div>
              <div style={{fontSize:".60rem",color:"var(--err)",fontWeight:600}}>현재가</div>
              <div style={{fontFamily:"var(--fd)",fontSize:"1.02rem",color:"var(--err)"}}>{price.toLocaleString()}D</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:".60rem",color:"var(--err)",fontWeight:600}}>마감</div>
              <div style={{fontFamily:"var(--fd)",fontSize:"1rem",color:"var(--err)"}}><Countdown endsAt={listing.endsAt}/></div>
            </div>
          </div>
        )}

        {/* price */}
        {!isSold && !isBad && listing?.type !== "AUCTION" && (
          <span style={{fontFamily:"var(--fd)",fontSize:"1.25rem",color:"var(--gold)",fontWeight:400}}>{price.toLocaleString()}D</span>
        )}
      </div>

      {/* CTA row — outside body onClick */}
      {!isSold && (
        <div style={{padding:"0 15px 14px",display:"flex",gap:7}}>
          {isBad ? (
            /* ── Warning/Dark → Exchange CTA ── */
            <button
              className="btn bsm"
              style={{
                flex:1, justifyContent:"center", fontWeight:700,
                background:`var(--${fid}-lt)`, color:`var(--${fid})`,
                border:`1.5px solid var(--${fid}-bd)`,
              }}
              onClick={e=>{ e.stopPropagation(); onGoExchange(); }}
            >
              🧧 정리소에서 처리
            </button>
          ) : (
            <>
              {listing?.type === "FIXED"   && <button className="btn bp bsm" style={{flex:1,justifyContent:"center"}} onClick={e=>{e.stopPropagation(); onOpen(listing.id);}}><I n="coins" s={12}/> 즉시구매 {price.toLocaleString()}D</button>}
              {listing?.type === "OFFER"   && <button className="btn bsm" style={{flex:1,justifyContent:"center",background:"var(--acc-lt)",color:"var(--acc)",border:"1px solid rgba(107,92,231,.24)",fontWeight:600}} onClick={e=>{e.stopPropagation(); onOpen(listing.id);}}>💬 가격 제안</button>}
              {listing?.type === "AUCTION" && <button className="btn bsm" style={{flex:1,justifyContent:"center",background:"rgba(224,92,92,.09)",color:"var(--err)",border:"1px solid rgba(224,92,92,.2)",fontWeight:600}} onClick={e=>{e.stopPropagation(); onOpen(listing.id);}}>⏱ 입찰하기</button>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MARKET PAGE
════════════════════════════════════════════════════════════════════ */
function MarketPage({ userDreams, onWalletChange, onGoExchange }) {
  const { store, placeBid, makeOffer, acceptCounter, declineCounter, buyFixed } = useStore();
  useEffect(() => { onWalletChange && onWalletChange(store.wallet); }, [store.wallet]);

  const [extraListings, setExtraListings] = useState([]);
  const [filterType,    setFilterType]    = useState("all");
  const [sortBy,        setSortBy]        = useState("popular");
  const [activeId,      setActiveId]      = useState(null);
  const [sellOpen,      setSellOpen]      = useState(false);

  const allListings = [...store.listings, ...extraListings];

  const getDream      = l => PRICED_DREAMS.find(d => d.id === l?.dreamId) ?? null;
  const getListingFor = id => allListings.find(l => l.dreamId === id && l.status === "ACTIVE") ?? null;

  /* curated – only길몽/평몽 for market sections */
  const goodDreams  = PRICED_DREAMS.filter(d => ["great","good"].includes(d.fortuneId));
  const vidDreams   = PRICED_DREAMS.filter(d => d.hasVideo);
  const trendDreams = [...PRICED_DREAMS]
    .sort((a,b)=>(b.comments*2+b.likes)-(a.comments*2+a.likes)).slice(0,7);
  const simDreams   = [...PRICED_DREAMS]
    .sort((a,b)=>recommendScore(b).total-recommendScore(a).total).slice(0,7);

  /* feed */
  const feedItems = allListings
    .filter(l => filterType === "all" || l.type === filterType)
    .sort((a,b) => {
      const da = getDream(a), db = getDream(b);
      if (sortBy === "popular") return (db?.likes??0)-(da?.likes??0);
      if (sortBy === "price_h") return (b.priceFixed??b.currentPrice??0)-(a.priceFixed??a.currentPrice??0);
      if (sortBy === "price_l") return (a.priceFixed??a.currentPrice??0)-(b.priceFixed??b.currentPrice??0);
      return (b.createdAt??0)-(a.createdAt??0);
    });

  const activeListing = allListings.find(l => l.id === activeId) ?? null;
  const activeDream   = getDream(activeListing);

  const activeCount  = allListings.filter(l => l.status==="ACTIVE").length;
  const auctionCount = allListings.filter(l => l.type==="AUCTION" && l.status==="ACTIVE").length;
  const soldCount    = allListings.filter(l => l.status==="SOLD").length;

  return (
    <div className="page">

      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:34,flexWrap:"wrap",gap:14}}>
        <div>
          <p className="lbl" style={{marginBottom:8}}>Dream Market</p>
          <h1 className="disp">꿈을 사고<br/><em style={{color:"var(--acc)",fontStyle:"italic"}}>꿈을 팔다</em></h1>
          <p className="sm" style={{marginTop:10}}>즉시구매 · 가격 제안 · 경매 — 꿈 탐색 & 거래 플랫폼</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end"}}>
          <button className="btn bp" onClick={()=>setSellOpen(true)}><I n="coins" s={14}/> 내 꿈 판매</button>
          <div style={{display:"flex",gap:8}}>
            <StatChip label="활성 리스팅" value={activeCount}                           color="var(--acc)"/>
            <StatChip label="진행 경매"   value={auctionCount}                          color="var(--err)"/>
            <StatChip label="판매 완료"   value={soldCount}                             color="var(--ok)"/>
            <StatChip label="내 지갑"     value={`${store.wallet.toLocaleString()}D`}   color="var(--gold)"/>
          </div>
        </div>
      </div>

      {/* ════ §1 TOP PICKS ════ */}
      <div style={{marginBottom:40}}>
        <SectionHead icon="🔥" title="Top Picks" sub="Great/Good Fortune · 최고 가치 길몽" badge={`${goodDreams.length}개`}/>
        <HRail>
          {goodDreams.map(d => <TopPickCard key={d.id} dream={d} listing={getListingFor(d.id)} onOpen={setActiveId}/>)}
        </HRail>
      </div>

      {/* ════ §2 CINEMA ════ */}
      <div style={{marginBottom:40}}>
        <SectionHead icon="🎬" title="Dream Cinema" sub="영상이 있는 꿈 · Visual Dream"/>
        <HRail>
          {vidDreams.map(d => <CinemaCard key={d.id} dream={d} listing={getListingFor(d.id)} onOpen={setActiveId}/>)}
        </HRail>
      </div>

      {/* ════ §3 TRENDING ════ */}
      <div style={{marginBottom:40}}>
        <SectionHead icon="💬" title="Trending Dreams" sub="댓글·좋아요 참여가 뜨거운 꿈"/>
        <HRail>
          {trendDreams.map((d,i) => <TrendingCard key={d.id} dream={d} listing={getListingFor(d.id)} rank={i+1} onOpen={setActiveId}/>)}
        </HRail>
      </div>

      {/* ════ §4 SIMILAR ════ */}
      <div style={{marginBottom:40}}>
        <SectionHead icon="✨" title="Similar Dreams" sub="내 취향 기반 AI 추천"/>
        <HRail>
          {simDreams.map(d => <SimilarCard key={d.id} dream={d} listing={getListingFor(d.id)} onOpen={setActiveId}/>)}
        </HRail>
      </div>

      {/* ════ §5 DREAM FEED ════ */}
      <div>
        {/* filter bar */}
        <div className="g" style={{padding:"13px 18px",marginBottom:22,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          <div>
            <p className="lbl" style={{marginBottom:6}}>거래 유형</p>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {[["all","전체"],["FIXED","💰 즉시"],["OFFER","💬 제안"],["AUCTION","⏱ 경매"]].map(([k,l])=>(
                <button key={k} style={mkPill(filterType===k)} onClick={()=>setFilterType(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{width:1,height:34,background:"rgba(0,0,0,.07)",flexShrink:0}}/>
          <div>
            <p className="lbl" style={{marginBottom:6}}>정렬</p>
            <div style={{display:"flex",gap:5}}>
              {[["popular","인기"],["latest","최신"],["price_h","↑가격"],["price_l","↓가격"]].map(([k,l])=>(
                <button key={k} style={mkPill(sortBy===k)} onClick={()=>setSortBy(k)}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <SectionHead icon="🌊" title="Dream Feed" sub={`${feedItems.length}개 리스팅 · 전체 꿈 피드`}/>

        {feedItems.length === 0 ? (
          <div className="g" style={{padding:50,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>🔍</div>
            <p style={{fontFamily:"var(--fd)",fontSize:"1rem",color:"var(--ink3)"}}>조건에 맞는 리스팅이 없습니다</p>
          </div>
        ) : (
          <div className="g2 stag">
            {feedItems.map(listing => {
              const dream = getDream(listing);
              if (!dream) return null;
              return (
                <FeedCard
                  key={listing.id}
                  dream={dream}
                  listing={listing}
                  bids={store.bids}
                  onOpen={setActiveId}
                  onGoExchange={onGoExchange}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* modals */}
      {activeListing && activeDream && (
        <ListingDetail
          listing={activeListing}
          dream={activeDream}
          bids={store.bids}
          offers={store.offers}
          wallet={store.wallet}
          onClose={()=>setActiveId(null)}
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
          onClose={()=>setSellOpen(false)}
          onCreate={l => setExtraListings(p=>[...p,l])}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EXCHANGE PAGE  —  정화 의식 / Ritual UI
════════════════════════════════════════════════════════════════════ */

const PURIFY_LEVELS = [
  { min:0,  label:"초보 정화사", icon:"🌱", color:"#6B7FC4" },
  { min:2,  label:"정화 견습",   icon:"🌿", color:"#4EAF80" },
  { min:5,  label:"정화 수련자", icon:"🌸", color:"#C9921A" },
  { min:10, label:"정화 수호자", icon:"🔮", color:"#9B7EFF" },
  { min:20, label:"꿈의 정화자", icon:"✨", color:"#C9A84C" },
];
function getPurifyLevel(n) {
  return [...PURIFY_LEVELS].reverse().find(l => n >= l.min) ?? PURIFY_LEVELS[0];
}

/* ── Exchange Card ── */
function ExchangeCard({ dream, onTransfer }) {
  const [phase, setPhase] = useState("idle");   // idle | confirm | ritual | done
  const [tick,  setTick]  = useState(3);
  const fid   = dream.fortuneId ?? "warn";
  const grade = GRADES.find(g => g.id === fid) ?? GRADES[3];
  const pc    = dream._price;

  /* ritual countdown */
  useEffect(() => {
    if (phase !== "ritual") return;
    if (tick <= 0) { setPhase("done"); onTransfer(dream); return; }
    const t = setTimeout(() => setTick(n => n-1), 800);
    return () => clearTimeout(t);
  }, [phase, tick]);

  if (phase === "done") return (
    <div style={{padding:"24px 18px",borderRadius:"var(--r2)",background:"var(--ok-lt)",border:"1px solid var(--good-bd)",textAlign:"center",animation:"pi .4s var(--spring) both"}}>
      <div style={{fontSize:42,marginBottom:10}}>✅</div>
      <p style={{fontFamily:"var(--fd)",fontSize:"1rem",fontWeight:500,marginBottom:5}}>정화 완료</p>
      <p style={{fontFamily:"var(--fd)",fontSize:"1.5rem",color:"var(--ok)",fontWeight:400}}>+{pc.netPayout}D 수령</p>
      <p className="sm" style={{marginTop:8}}>꿈이 우주로 돌아갔습니다</p>
    </div>
  );

  if (phase === "ritual") return (
    <div style={{padding:"24px 18px",borderRadius:"var(--r2)",background:`var(--${fid}-lt)`,border:`2px solid var(--${fid}-bd)`,textAlign:"center",animation:"pi .3s var(--spring) both"}}>
      <div style={{fontSize:50,marginBottom:12,display:"inline-block",animation:"orbf 1.2s ease-in-out infinite"}}>{grade.icon}</div>
      <p style={{fontFamily:"var(--fd)",fontSize:"1rem",color:`var(--${fid})`,fontWeight:500,marginBottom:12}}>정화 의식 진행 중…</p>
      <div style={{display:"flex",justifyContent:"center",gap:10}}>
        {[3,2,1].map(i => (
          <div key={i} style={{
            width:11, height:11, borderRadius:"50%",
            background: tick < i ? `var(--${fid})` : "rgba(0,0,0,.10)",
            transition:"background .4s",
          }}/>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      borderRadius:"var(--r2)", overflow:"hidden",
      background:"var(--surface)", border:`1.5px solid var(--${fid}-bd)`,
      boxShadow:"var(--sh-sm)", transition:"all .22s var(--ease)",
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--sh-md)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="var(--sh-sm)";}}>

      {/* fortune tinted header */}
      <div style={{padding:"10px 14px",background:`var(--${fid}-lt)`,borderBottom:`1px solid var(--${fid}-bd)`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span className={`fb fb-${fid}`}>{grade.icon} {grade.label}</span>
        <span className={`rar r-${dream.rarity}`}>{dream.rarity}</span>
      </div>

      <div style={{padding:"13px 14px"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:".93rem",fontWeight:500,marginBottom:5,lineHeight:1.3}}>{dream.title}</div>
        <p className="sm" style={{fontSize:".70rem",marginBottom:10,lineHeight:1.55,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{dream.preview}</p>

        {/* symbol tags */}
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
          {(dream.symbols ?? []).map(s => (
            <span key={s} style={{padding:"1px 7px",borderRadius:50,fontSize:".61rem",fontWeight:500,background:`var(--${fid}-lt)`,color:`var(--${fid})`,border:`1px solid var(--${fid}-bd)`}}>◆ {s}</span>
          ))}
        </div>

        {/* payout info */}
        <div style={{marginBottom:12,padding:"10px 12px",borderRadius:10,background:`var(--${fid}-lt)`,border:`1px solid var(--${fid}-bd)`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:".62rem",fontWeight:600,color:`var(--${fid})`,marginBottom:2}}>Transfer 보상금</div>
              <div style={{fontFamily:"var(--fd)",fontSize:"1.35rem",color:`var(--${fid})`,fontWeight:400,lineHeight:1}}>+{pc.netPayout}D</div>
            </div>
            <div style={{textAlign:"right",fontSize:".62rem",color:"var(--ink3)"}}>
              <div>원금 {pc.payout}D</div>
              <div>수수료 -{pc.transferFee}D</div>
            </div>
          </div>
        </div>

        {phase === "idle" && (
          <button className="btn bsm" style={{width:"100%",justifyContent:"center",fontWeight:700,background:`var(--${fid}-lt)`,color:`var(--${fid})`,border:`1.5px solid var(--${fid}-bd)`}} onClick={()=>setPhase("confirm")}>
            🧧 정화 Transfer
          </button>
        )}
        {phase === "confirm" && (
          <div>
            <p style={{fontSize:".75rem",color:`var(--${fid})`,fontWeight:500,marginBottom:9,textAlign:"center"}}>이 꿈을 정화하시겠습니까?</p>
            <div style={{display:"flex",gap:7}}>
              <button className="btn bg bsm" style={{flex:1,justifyContent:"center"}} onClick={()=>setPhase("idle")}>취소</button>
              <button className="btn bsm" style={{flex:1,justifyContent:"center",fontWeight:700,background:`var(--${fid})`,color:"#fff",border:"none"}} onClick={()=>{setTick(3);setPhase("ritual");}}>확정</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Purify Level Bar ── */
function PurifyBar({ count }) {
  const lv   = getPurifyLevel(count);
  const next = PURIFY_LEVELS.find(l => l.min > count) ?? null;
  const prev = getPurifyLevel(Math.max(0, count - 1));
  const range = next ? next.min - prev.min : 1;
  const prog  = next ? Math.min(100, Math.round(((count - prev.min) / range) * 100)) : 100;

  return (
    <div className="g" style={{padding:"20px 24px",marginBottom:32,display:"flex",gap:22,alignItems:"center",flexWrap:"wrap"}}>
      <div style={{textAlign:"center",minWidth:72}}>
        <div style={{fontSize:38,marginBottom:4}}>{lv.icon}</div>
        <div style={{fontSize:".68rem",fontWeight:700,color:lv.color}}>{lv.label}</div>
      </div>
      <div style={{flex:1,minWidth:160}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <p className="lbl">정화 레벨</p>
          <span className="sm" style={{fontWeight:600,color:lv.color}}>{count}회 정화</span>
        </div>
        <div style={{height:7,borderRadius:4,background:"rgba(0,0,0,.07)",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${prog}%`,borderRadius:4,background:`linear-gradient(90deg,${lv.color},${lv.color}99)`,transition:"width .9s var(--ease)"}}/>
        </div>
        {next && <p className="sm" style={{marginTop:5,fontSize:".67rem"}}>다음 레벨까지 {next.min - count}회</p>}
      </div>
      <div style={{display:"flex",gap:9}}>
        <StatChip label="총 정화"  value={`${count}회`}         color="var(--warn)"/>
        <StatChip label="획득 보상" value={`${count*45}D`}      color="var(--ok)"/>
      </div>
    </div>
  );
}

/* ── Exchange Page ── */
function ExchangePage() {
  const [transferred, setTransferred] = useState([]);
  const [tab, setTab] = useState("warn");

  const warnDreams = PRICED_DREAMS.filter(d => d.fortuneId === "warn");
  const darkDreams = PRICED_DREAMS.filter(d => d.fortuneId === "dark");
  const todayPool  = [...warnDreams, ...darkDreams].slice(0, 3);

  function handleTransfer(dream) {
    setTransferred(p => p.includes(dream.id) ? p : [...p, dream.id]);
  }

  const count = transferred.length;
  const lv    = getPurifyLevel(count);

  return (
    <div className="page">

      {/* ── Ritual Header ── */}
      <div style={{marginBottom:32,paddingBottom:28,borderBottom:"1px solid rgba(0,0,0,.07)"}}>
        <p className="lbl" style={{marginBottom:8,color:"var(--warn)"}}>Dream Exchange</p>
        <h1 className="disp" style={{marginBottom:10}}>
          흉몽을 정화하다<br/>
          <em style={{fontStyle:"italic",color:"var(--warn)"}}>Transfer & Release</em>
        </h1>
        <p style={{fontSize:".85rem",color:"var(--ink2)",lineHeight:1.75,maxWidth:540}}>
          흉몽은 팔지 않습니다. <strong>정화(Transfer)</strong>합니다.<br/>
          꿈을 우주로 돌려보내고 보상금을 받으세요. 소각 수수료 {TRANSFER_FEE}D가 균형을 유지합니다.
        </p>
      </div>

      {/* ── Ambient ritual banner ── */}
      <div style={{
        marginBottom:32,padding:"20px 24px",borderRadius:"var(--r2)",position:"relative",overflow:"hidden",
        background:"linear-gradient(135deg,rgba(170,58,58,.07) 0%,rgba(217,110,48,.05) 50%,rgba(107,92,231,.04) 100%)",
        border:"1px solid rgba(217,110,48,.2)",
      }}>
        <div style={{position:"absolute",top:-24,right:-24,width:130,height:130,borderRadius:"50%",background:"radial-gradient(circle,rgba(217,110,48,.14),transparent 70%)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap",position:"relative"}}>
          <div style={{fontSize:42}}>{lv.icon}</div>
          <div>
            <p style={{fontFamily:"var(--fd)",fontSize:"1.1rem",fontWeight:500,marginBottom:4}}>오늘의 정화 현황</p>
            <p className="sm">
              {count === 0
                ? "아직 정화된 꿈이 없습니다. 첫 번째 흉몽을 정화해보세요."
                : `${count}개의 꿈이 정화되었습니다. ${lv.label}로 승급했습니다.`}
            </p>
          </div>
          {count > 0 && (
            <div style={{marginLeft:"auto",padding:"8px 18px",borderRadius:50,background:"var(--ok-lt)",border:"1px solid var(--good-bd)",fontFamily:"var(--fd)",fontSize:".92rem",color:"var(--ok)"}}>
              +{count * 45}D 수령됨
            </div>
          )}
        </div>
      </div>

      {/* ── 정화 레벨 ── */}
      <PurifyBar count={count}/>

      {/* ── 오늘의 정화 ── */}
      <div style={{marginBottom:40}}>
        <SectionHead icon="🌟" title="오늘의 정화" sub="오늘 가장 많이 정화된 꿈 · 추천 순"/>
        {todayPool.every(d => transferred.includes(d.id)) ? (
          <div style={{padding:"28px",textAlign:"center",borderRadius:"var(--r2)",background:"var(--ok-lt)",border:"1px solid var(--good-bd)"}}>
            <div style={{fontSize:32,marginBottom:8}}>✨</div>
            <p style={{fontFamily:"var(--fd)",color:"var(--ok)"}}>오늘의 추천 꿈이 모두 정화되었습니다</p>
          </div>
        ) : (
          <div className="g2 stag">
            {todayPool.filter(d => !transferred.includes(d.id)).map(d => (
              <ExchangeCard key={d.id} dream={d} onTransfer={handleTransfer}/>
            ))}
          </div>
        )}
      </div>

      {/* ── Warning / Dark Tabs ── */}
      <div>
        <div style={{display:"flex",gap:0,marginBottom:22,borderRadius:50,background:"rgba(0,0,0,.05)",padding:4,width:"fit-content",border:"1px solid rgba(0,0,0,.07)"}}>
          {[["warn","⚠️ Warning Dreams",warnDreams.length],["dark","🌑 Dark Omens",darkDreams.length]].map(([k,l,cnt]) => (
            <button key={k} onClick={()=>setTab(k)} style={{
              padding:"8px 20px", borderRadius:50, border:"none", cursor:"pointer",
              fontFamily:"var(--fb)", fontSize:".80rem", fontWeight:600, transition:"all .2s",
              background: tab===k ? (k==="dark"?"var(--dark)":"var(--warn)") : "transparent",
              color: tab===k ? "#fff" : "var(--ink3)",
            }}>
              {l} <span style={{opacity:.7,fontSize:".70rem"}}>({cnt})</span>
            </button>
          ))}
        </div>

        {tab === "warn" && (
          <>
            <SectionHead icon="⚠️" title="Warning Dreams" sub="흉조 등급 · 불안과 변화의 꿈" badge={`${warnDreams.length}개`}/>
            <div className="g2 stag">
              {warnDreams.map(d => <ExchangeCard key={d.id} dream={d} onTransfer={handleTransfer}/>)}
            </div>
          </>
        )}
        {tab === "dark" && (
          <>
            <SectionHead icon="🌑" title="Dark Omens" sub="흉몽 등급 · 어둠과 두려움의 꿈" badge={`${darkDreams.length}개`}/>
            <div className="g2 stag">
              {darkDreams.map(d => <ExchangeCard key={d.id} dream={d} onTransfer={handleTransfer}/>)}
            </div>
          </>
        )}
      </div>

      {/* ── Footer Note ── */}
      <div style={{marginTop:42,padding:"15px 20px",borderRadius:"var(--r1)",background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)"}}>
        <p style={{fontSize:".75rem",color:"var(--ink3)",lineHeight:1.85}}>
          💡 <strong>정화란?</strong> — 흉몽을 Transfer하면 꿈이 익명의 처리자에게 전달되고 소각됩니다.
          소각 수수료({TRANSFER_FEE}D)는 드림 이코노미 균형 유지에 사용됩니다.
          Warning 기본 보상 {BASE_PAYOUT.warn}D / Dark 기본 보상 {BASE_PAYOUT.dark}D.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   APP  —  Home · Library · Market · Exchange
════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [route,       setRoute]      = useState("home");
  const [navTab,      setNavTab]     = useState("home");
  const [dreams,      setDreams]     = useState(DREAMS_INIT);
  const [selId,       setSelId]      = useState(null);
  const [editDream,   setEditDream]  = useState(null);
  const [scrolled,    setScrolled]   = useState(false);
  const [wallet,      setWallet]     = useState(2000);
  /* Dream Aura 코인 지갑 — Market 거래 wallet과 분리 */
  const [dreamCoins,  setDreamCoins] = useState(100);

  /* ── Streak: dreams 변경 시 자동 재계산 ── */
  const streak = calcStreak(dreams);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav        = tab  => { setNavTab(tab); setRoute(tab); window.scrollTo({ top:0, behavior:"smooth" }); };
  const openDetail = id   => { setSelId(id);  setRoute("detail"); window.scrollTo({ top:0, behavior:"smooth" }); };
  const openEditor = (d=null, returnToDetail=false) => {
    setEditDream(d);
    setRoute("editor");
    if (d?.id) setSelId(d.id);   /* 편집 완료 후 detail로 복귀하기 위해 selId 유지 */
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleSave = dream => {
    if (!dream?.id) return;
    setDreams(p => {
      const updated = p.find(d => d.id === dream.id)
        ? p.map(d => d.id === dream.id ? { ...d, ...dream } : d)
        : [dream, ...p];
      /* 신규 꿈 저장 시 streak 마일스톤 보너스 코인 지급 */
      if (!p.find(d => d.id === dream.id)) {
        const newStreak = calcStreak(updated);
        const milestone = getStreakMilestone(newStreak.current);
        if (milestone && newStreak.current > 0) {
          /* 오늘 첫 기록이고 마일스톤 조건이면 코인 지급 */
          const prevStreak = calcStreak(p);
          if (newStreak.current > prevStreak.current && milestone.days === newStreak.current) {
            setDreamCoins(c => c + milestone.bonus);
          }
        }
      }
      return updated;
    });
    setSelId(dream.id);
    /* 편집(isEdit)이면 detail로, 신규면 library로 복귀는 EditorView onCancel이 담당 */
    if (editDream?.id) {
      setRoute("detail");
    }
  };
  const handleSaveAnalysis = (id, analysis, fortune) => {
    setDreams(p => p.map(d => d.id===id
      ? { ...d, analysis, analyzed:true, fortune: fortune ?? runFortune({...d, analysis}) }
      : d));
  };

  /** Dream Aura 저장 — aura DNA + auraMeta 업데이트, 코인 차감 */
  const handleSaveAura = (dreamId, payload) => {
    if (!dreamId || !payload) return;
    /* dreams 상태에 aura/auraMeta 병합 */
    setDreams(p => p.map(d => d.id === dreamId
      ? {
          ...d,
          aura:     payload.aura     ?? d.aura,
          auraMeta: payload.auraMeta ?? d.auraMeta,
        }
      : d));
    /* 코인 차감 (spent가 있을 때만) */
    if (typeof payload.spent === "number" && payload.spent > 0) {
      setDreamCoins(c => Math.max(0, c - payload.spent));
    }
  };


  /** 추가 기억 저장 — extraMemories 배열에 추가 */
  const handleSaveMemory = (dreamId, entry) => {
    if (!dreamId || !entry) return;
    setDreams(p => p.map(d => d.id === dreamId
      ? { ...d, extraMemories: [...(d.extraMemories ?? []), entry] }
      : d
    ));
  };

  /** 메타 전용 저장 — forSale / locked / public 만 업데이트 */
  const handleSaveMeta = (dream) => {
    if (!dream?.id) return;
    setDreams(p => p.map(d => d.id === dream.id
      ? { ...d,
          forSale: dream.forSale ?? d.forSale,
          locked:  dream.locked  ?? d.locked,
          price:   dream.price   ?? d.price,
          updatedAt: new Date().toISOString(),
        }
      : d
    ));
    setSelId(dream.id);
  };

  const selDream = dreams.find(d => d.id === selId) ?? null;
  const inEditor = route === "editor";

  const NAV_TABS = [
    { id:"home",     label:"Home",     icon:"home"    },
    { id:"library",  label:"Library",  icon:"library" },
    { id:"market",   label:"Market",   icon:"wall"    },
    { id:"exchange", label:"Exchange", icon:"sparkle" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        {/* ── Nav ── */}
        <nav className={`nav ${scrolled ? "sc" : ""}`}>
          <div className="nav-brand" onClick={()=>nav("home")}>드림<em>마켓</em></div>
          {!inEditor && (
            <div className="npills">
              {NAV_TABS.map(t => (
                <button
                  key={t.id}
                  className={`npill ${navTab===t.id && route!=="detail" ? "on" : ""}`}
                  style={t.id==="exchange" && navTab!==t.id ? { color:"var(--warn)" } : {}}
                  onClick={() => nav(t.id)}
                >
                  <I n={t.icon} s={14}/>
                  <span>{t.label}</span>
                  {/* Exchange dot indicator */}
                  {t.id === "exchange" && navTab !== t.id && (
                    <span style={{
                      width:5, height:5, borderRadius:"50%",
                      background:"var(--warn)", marginLeft:-3, marginTop:-8, flexShrink:0,
                    }}/>
                  )}
                </button>
              ))}
            </div>
          )}
          <WalletChip wallet={wallet}/>
          {streak.current >= 3 && (
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px",
              borderRadius:50, background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.18)",
              fontSize:".72rem", fontWeight:700, color:"#ef4444", flexShrink:0 }}>
              🔥 {streak.current}일
            </div>
          )}
        </nav>

        {/* ── Content ── */}
        <main>
          {route==="home"     && <HomeView    dreams={dreams} onCard={openDetail} onNew={()=>openEditor()} streak={streak}/>}
          {route==="library"  && <LibraryView dreams={dreams} onCard={openDetail}/>}
          {route==="market"   && <MarketPage  userDreams={dreams} onWalletChange={setWallet} onGoExchange={()=>nav("exchange")}/>}
          {route==="exchange" && <ExchangePage/>}
          {route==="detail"   && selDream && (
            <DreamDetailPage
              dream={selDream}
              dreamCoins={dreamCoins}
              allDreams={dreams}
              onBack={()=>nav("home")}
              onSaveAnalysis={handleSaveAnalysis}
              onSaveAura={handleSaveAura}
              onCard={openDetail}
              onEdit={d => openEditor(d)}
              onSaveMemory={handleSaveMemory}
            />
          )}
          {route==="editor"   && (
            <EditorView
              dream={editDream}
              onSave={handleSave}
              onCancel={() => editDream?.id ? setRoute("detail") : nav("library")}
              dreams={dreams}
            />
          )}
        </main>

      </div>
    </>
  );
}
