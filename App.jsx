import { useState, useEffect, useRef, useCallback } from "react";

const CREAM = "#F5F2ED";
const DARK  = "#2A2520";

const menuData = {
  "精選推薦": [
    { id:1, name:"招牌牛肉麵", desc:"精燉12小時濃郁湯頭，厚切牛腱", price:180, tag:"SIGNATURE", bg:"#7A5C3E", emoji:"🍜" },
    { id:2, name:"脆皮烤鴨飯", desc:"皮脆肉嫩烤鴨，搭配香Q白飯", price:220, tag:"CHEF'S PICK", bg:"#5C3E2E", emoji:"🍱" },
    { id:3, name:"紅燒獅子頭", desc:"手工肉丸，慢燉入味", price:160, tag:"POPULAR", bg:"#6B4A3A", emoji:"🥘" },
  ],
  "主食": [
    { id:4, name:"三杯雞腿飯", desc:"香氣四溢的台式三杯醬料", price:150, bg:"#3E5C3E", emoji:"🍚" },
    { id:5, name:"叉燒炒飯", desc:"大火翻炒，粒粒分明", price:130, bg:"#5C4E2E", emoji:"🍳" },
    { id:6, name:"番茄牛肉義麵", desc:"慢熬番茄肉醬，義式風味", price:170, bg:"#6B3A3A", emoji:"🍝" },
  ],
  "小吃": [
    { id:7, name:"蔥油餅", desc:"酥脆外皮，層層分明", price:50, bg:"#4A5C2E", emoji:"🫓" },
    { id:8, name:"水晶餃", desc:"薄皮多汁，手工製作（6入）", price:80, bg:"#2E4A5C", emoji:"🥟" },
    { id:9, name:"滷味拼盤", desc:"豆乾、海帶、豬耳朵各一份", price:120, bg:"#3E2E5C", emoji:"🫙" },
  ],
  "飲品": [
    { id:10, name:"珍珠奶茶", desc:"特選阿薩姆紅茶，Q彈珍珠", price:70, bg:"#5C3E2E", emoji:"🧋" },
    { id:11, name:"冬瓜檸檬", desc:"清爽消暑，酸甜平衡", price:55, bg:"#2E5C3E", emoji:"🍋" },
    { id:12, name:"溫熱豆漿", desc:"非基改黃豆，濃醇香", price:40, bg:"#4A4A2E", emoji:"🥛" },
  ],
};

/* ─ Scroll-reveal hook ─ */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─ Single product card ─ */
function Card({ item, idx, cart, onAdd, onRemove, onEnter, onLeave }) {
  const [ref, visible] = useReveal(0.1);
  const inCart = cart[item.id];
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(48px)",
      transition: `opacity .8s ease ${idx * 0.1}s, transform .9s cubic-bezier(0.16,1,0.3,1) ${idx * 0.1}s`,
    }}>
      {/* Image block */}
      <div style={{
        width: "100%", aspectRatio: "4/5", overflow: "hidden",
        background: `linear-gradient(150deg, ${item.bg}dd, ${item.bg}88)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", marginBottom: 16,
      }}
        onMouseEnter={onEnter} onMouseLeave={onLeave}
      >
        <span style={{
          fontSize: 76, lineHeight: 1,
          filter: "drop-shadow(0 6px 16px rgba(0,0,0,.3))",
          transition: "transform .5s cubic-bezier(0.16,1,0.3,1)",
        }}
          className="card-emoji"
        >{item.emoji}</span>
        {item.tag && (
          <div style={{
            position: "absolute", top: 16, left: 16,
            fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: 3,
            color: CREAM, border: `1px solid ${CREAM}55`,
            padding: "4px 10px", textTransform: "uppercase",
          }}>{item.tag}</div>
        )}
      </div>
      {/* Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <h3 style={{ fontSize: 20, fontWeight: 400, letterSpacing: 0.5 }}>{item.name}</h3>
        <span style={{ fontSize: 19, fontWeight: 300, flexShrink: 0, marginLeft: 8 }}>
          <span style={{ fontFamily: "'Jost'", fontSize: 9, color: `${DARK}55` }}>NT$</span>{item.price}
        </span>
      </div>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: `${DARK}55`, letterSpacing: 1, lineHeight: 1.75, marginBottom: 14 }}>{item.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {inCart && <>
          <button onClick={() => onRemove(item.id)} onMouseEnter={onEnter} onMouseLeave={onLeave}
            style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:2, background:"transparent", border:`1px solid ${DARK}20`, color:`${DARK}66`, padding:"6px 12px", transition:"all .25s" }}>−</button>
          <span style={{ fontFamily:"'Jost'", fontSize:13, minWidth:18, textAlign:"center" }}>{inCart.qty}</span>
        </>}
        <button onClick={() => onAdd(item)} onMouseEnter={onEnter} onMouseLeave={onLeave}
          style={{
            fontFamily:"'Jost'", fontSize:9, letterSpacing:3, textTransform:"uppercase",
            background: inCart ? DARK : "transparent",
            color: inCart ? CREAM : `${DARK}66`,
            border: `1px solid ${inCart ? DARK : DARK+"22"}`,
            padding:"7px 18px", transition:"all .25s",
          }}>
          {inCart ? "+" : "Add to order"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [loaderOut, setLoaderOut] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [activeTab, setActiveTab] = useState("精選推薦");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [form, setForm] = useState({ name:"",phone:"",address:"",note:"",payment:"credit" });
  const [cursor, setCursor] = useState({ x:-300, y:-300, big:false });

  /* preloader */
  useEffect(() => {
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 6 + 2;
      if (p >= 100) { p = 100; clearInterval(timer); }
      setProgress(Math.round(p));
    }, 55);
    const t1 = setTimeout(() => setLoaderOut(true), 2700);
    const t2 = setTimeout(() => { setLoaderDone(true); setHeroVis(true); }, 3700);
    return () => { clearInterval(timer); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* cursor */
  useEffect(() => {
    const fn = (e) => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY }));
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const onEnter = useCallback(() => setCursor(c => ({ ...c, big: true })), []);
  const onLeave = useCallback(() => setCursor(c => ({ ...c, big: false })), []);

  const addItem = (item) => setCart(p => ({ ...p, [item.id]: { ...item, qty: (p[item.id]?.qty || 0) + 1 } }));
  const removeItem = (id) => setCart(p => {
    const u = { ...p };
    if (u[id].qty <= 1) delete u[id]; else u[id] = { ...u[id], qty: u[id].qty - 1 };
    return u;
  });
  const cartItems  = Object.values(cart);
  const totalQty   = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ background: CREAM, minHeight: "100vh", color: DARK, fontFamily: "'Cormorant Garamond', Georgia, serif", overflow: loaderDone ? "auto" : "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        * { cursor: none !important; }
        ::selection { background: ${DARK}18; }
        ::-webkit-scrollbar { width: 1px; }
        ::-webkit-scrollbar-thumb { background: ${DARK}33; }
        .card-emoji { transition: transform .5s cubic-bezier(0.16,1,0.3,1); }
        div:hover > .card-emoji { transform: scale(1.08) translateY(-4px); }
        .cat-btn { font-family:'Jost',sans-serif; font-size:10px; letter-spacing:4px; text-transform:uppercase; background:none; border:none; color:${DARK}44; padding:10px 0; border-bottom:1px solid transparent; transition:all .3s; }
        .cat-btn:hover { color:${DARK}99; }
        .cat-btn.active { color:${DARK}; border-bottom:1px solid ${DARK}44; }
        .nav-btn { font-family:'Jost',sans-serif; font-size:10px; letter-spacing:3px; text-transform:uppercase; background:none; border:none; color:${DARK}77; transition:color .3s; padding:0; }
        .nav-btn:hover { color:${DARK}; }
        input, textarea { background:transparent; border:none; border-bottom:1px solid ${DARK}15; color:${DARK}; font-family:'Jost',sans-serif; font-size:13px; letter-spacing:1px; padding:12px 0; width:100%; outline:none; transition:border-color .3s; }
        input:focus, textarea:focus { border-bottom-color:${DARK}; }
        input::placeholder, textarea::placeholder { color:${DARK}33; font-size:11px; letter-spacing:2px; }
        textarea { resize:none; }
        .submit-btn { width:100%; background:${DARK}; color:${CREAM}; border:none; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:4px; text-transform:uppercase; padding:17px; transition:background .3s; }
        .submit-btn:hover:not(:disabled) { background:#3a3530; }
        .submit-btn:disabled { background:${DARK}11; color:${DARK}33; }
        .hero-word { display:block; overflow:hidden; }
        .hero-word-inner { display:block; }
      `}</style>

      {/* ── CURSOR ── */}
      <div style={{
        position: "fixed", left: cursor.x, top: cursor.y, zIndex: 99999, pointerEvents: "none",
        transform: "translate(-50%,-50%)",
        width: cursor.big ? 44 : 7, height: cursor.big ? 44 : 7,
        borderRadius: "50%",
        border: cursor.big ? `1px solid ${DARK}55` : "none",
        background: cursor.big ? `${DARK}0c` : DARK,
        transition: "width .35s cubic-bezier(0.16,1,0.3,1), height .35s cubic-bezier(0.16,1,0.3,1), background .3s",
        mixBlendMode: "multiply",
      }} />

      {/* ══ PRELOADER ══ */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: CREAM,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        clipPath: loaderOut ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
        transition: loaderOut ? "clip-path 1.1s cubic-bezier(0.76,0,0.24,1)" : "none",
        pointerEvents: loaderDone ? "none" : "all",
      }}>
        {/* top progress line */}
        <div style={{ position:"absolute", top:0, left:0, height:1, background:DARK, width:`${progress}%`, transition:"width .08s linear" }} />

        {/* logo SVG — fades in as it draws */}
        <div style={{ width: "min(68vw, 500px)", padding: "0 16px", opacity: progress > 5 ? 1 : 0, transition: "opacity .5s" }}>
          <svg viewBox="0 0 772.33 100.02" style={{ width:"100%", height:"auto", display:"block" }}>
            <defs>
              <clipPath id="logoReveal">
                <rect x="0" y="0" height="100.02"
                  width={`${772.33 * (progress / 100)}`}
                  style={{ transition: "width .1s linear" }}
                />
              </clipPath>
            </defs>
            {/* full logo in very faint */}
            <g opacity="0.08" fill={DARK}>
              <path d="m28.84,71.78h-.65c-1.13,0-2.12.5-2.97,1.53-5.12,7.19-11.27,13.08-18.3,17.52l-.12.09c-.24.22-.51.64-.51,1.04,0,.67.5,1.16,1.19,1.16h.35l.13-.04c8.78-2.83,16.53-8.24,23.05-16.08l.07-.09c.47-.74.78-1.38.78-2.12,0-.51-.18-1.07-.45-1.43-.61-.99-1.57-1.58-2.57-1.58Z"/><path d="m11.24,16.02h8.82l-.02,9.29.02.87,24.62.02.87-.02v-10.16h8.82c2.99,0,5.43-2.43,5.43-5.43v-.87h-14.25v-3.59c0-3.09-2.37-5.43-5.52-5.43h-.87v9.01h-12.7v-3.59c0-3.09-2.37-5.43-5.52-5.43h-.87v9.01H5.82v.87c0,2.89,2.54,5.43,5.43,5.43Zm15.22,4.04v-4.04h12.7v4.04h-12.7Z"/><path d="m46.58,77.88c-2.77-2.54-5.91-4.63-9.32-6.21l-.27-.17-.19-.02c-.56-.07-1.09.24-1.36.82l-.41.85.74.46c1.49,1.45,3.31,3.56,5.71,6.62,2.37,3.02,4.04,5.7,4.96,7.97l.05.1c.34.6.94,1.42,2.14,1.58.24.03.48.05.7.05,1.91,0,3.12-1.07,3.6-2.07.33-.69.34-1.41.01-2.25-1.1-2.36-3.18-4.89-6.35-7.73Z"/><path d="m0,29.93c0,2.79,2.54,5.24,5.43,5.24h54.77c2.99,0,5.43-2.35,5.43-5.24v-.87H0v.87Z"/><path d="m10.92,69.17h44.45v-31.33H10.92v31.33Zm5.62-18.53v-6.99h13.11v6.99h-13.11Zm0,12.88v-7.16h13.11v7.16h-13.11Zm19.41-12.88v-6.99h13.1v6.99h-13.1Zm0,12.88v-7.16h13.1v7.16h-13.1Z"/><path d="m244.5,6.89c-1.54,0-2.72.75-3.53,2.24-4.81,9.41-10.4,17.87-16.62,25.15-.76-.38-1.61-.59-2.52-.59h-.87v59.43h.87c2.88,0,5.23-2.26,5.23-5.05v-49.33c0-.62-.1-1.21-.3-1.76,8.22-6.06,15.45-14.45,21.5-24.92.34-.58.51-1.17.51-1.77,0-.77-.35-1.55-.91-2.05-.8-.91-1.9-1.36-3.37-1.36Z"/><path d="m218.22,27.75c-3.67-7.98-9.11-14.82-16.15-20.31l-.15-.11-.54-.14-.42-.17-.35.35c-.43.27-.5.65-.5.85v.84l.18.24c5.18,6.72,9.33,13.72,12.36,20.84.62,1.24,1.56,1.84,2.87,1.84,1.6,0,2.96-1.31,2.96-2.87,0-.38-.11-.8-.21-1.21l-.05-.15Z"/><path d="m313.45,11.39c0,.26.04.51.08.76h-30.6v.87c0,2.74,2.4,5.14,5.14,5.14h20.62c2.74,0,5.05-2.35,5.05-5.14v-.03c.68,2.02,2.58,3.53,4.76,3.53h9.27l-1.03,7.43h-9.47v46.07h27.18V23.97h-13.61l3.31-7.43h9.06c2.74,0,5.05-2.35,5.05-5.14v-.87h-34.81v.87Zm9.92,25.38v-6.71h14.97v6.71h-14.97Zm0,12.72v-6.71h14.97v6.71h-14.97Zm0,14.53v-8.43h14.97v8.43h-14.97Z"/><path d="m310.02,25.06h-23.36v26.54h23.36v-26.54Zm-17.35,20.53v-14.43h11.34v14.43h-11.34Z"/><path d="m467.18,64.98c-1.54.51-4.24-.68-8.56-.74-2.02-.03-1.72.23-5.37.34-2.9.09-6.06-.06-6.06-.06-2.92-.13-7.49-.42-10.39.6-.25.09-.69.25-.99.66-.86,1.16.12,3.28.77,4.26,2.02,3.03,6.97,4.16,10.79,3.23,3.42-.84,5.71-3.05,5.71-3.05,1.2-1.16,1.64-2.13,3.15-2.76,1.38-.57,2.67-.44,3.82-.32,1.32.13,3.3.33,4.94,1.58.75.57,1.43,1.58,2.19,3.19v10.44h10V19.96h-10v45.02Z"/><rect x="486.47" y="19.96" width="10" height="62.39"/><path d="m527.84,39.09c-6.26,0-11.45,2.1-15.55,6.29-4.11,4.19-6.16,9.51-6.16,15.94s2.05,11.76,6.16,15.99c4.11,4.22,9.29,6.33,15.55,6.33s11.53-2.11,15.64-6.33c4.11-4.22,6.16-9.55,6.16-15.99s-2.05-11.75-6.16-15.94c-4.11-4.19-9.32-6.29-15.64-6.29Zm8.32,32.06c-2.27,2.36-5.04,3.53-8.32,3.53s-6.05-1.19-8.32-3.58c-2.27-2.38-3.4-5.64-3.4-9.78s1.13-7.37,3.4-9.69c2.27-2.33,5.04-3.49,8.32-3.49s6.05,1.16,8.32,3.49c2.27,2.33,3.4,5.56,3.4,9.69s-1.14,7.47-3.4,9.82Z"/><path d="m614.93,40.38h-2.83c-.86,0-1.61.57-1.85,1.39l-7.38,25.65c-.18.62-1.04.64-1.25.03l-7.77-22.78c-.88-2.57-3.29-4.29-6-4.29h-4.02c-1.07,0-2.02.68-2.37,1.69l-8.67,25.39c-.21.6-1.07.59-1.25-.03l-6.93-23.6c-.6-2.05-2.48-3.46-4.62-3.46h-4.74c-1.16,0-1.98,1.13-1.62,2.23l11.71,36.08c.71,2.18,2.74,3.66,5.04,3.66h2.79c2.16,0,4.08-1.38,4.77-3.43l8.4-24.91c.2-.59,1.04-.6,1.24,0l8.58,24.81c.73,2.12,2.73,3.54,4.97,3.54h2.47c2.25,0,4.25-1.46,4.94-3.6l10.49-32.76c.89-2.77-1.18-5.61-4.09-5.61Z"/><path d="m688.78,40.38h-2.55c-.85,0-1.54.69-1.54,1.54v3.8c-2.13-4.08-6.26-6.12-12.41-6.12-5.69,0-10.34,1.98-13.96,5.95s-5.43,8.79-5.43,14.48,1.82,10.8,5.47,14.65c3.65,3.85,8.29,5.77,13.92,5.77,2.87,0,5.37-.57,7.5-1.72,1.41-.76,2.57-1.66,3.47-2.71.41-.47,1.18-.18,1.18.45v2.26c0,8.39-3.96,12.58-11.89,12.58-2.82,0-5.18-.85-7.11-2.54-1.47-1.29-2.48-2.86-3.03-4.71-.29-.97-1.25-1.57-2.23-1.31l-4.29,1.12c-1.87.49-2.89,2.48-2.23,4.29,1.04,2.86,2.88,5.35,5.53,7.46,3.68,2.93,8.22,4.4,13.62,4.4,7.35,0,12.78-2.05,16.29-6.16,3.5-4.11,5.26-9.26,5.26-15.47v-32.44c0-3.07-2.49-5.57-5.57-5.57Zm-7.06,28.31c-1.98,2.15-4.58,3.23-7.8,3.23s-5.92-1.08-7.93-3.23c-2.01-2.15-3.02-5.04-3.02-8.66s1.02-6.42,3.06-8.57c2.04-2.15,4.67-3.23,7.89-3.23s5.74,1.08,7.76,3.23c2.01,2.15,3.02,5.01,3.02,8.57s-.99,6.51-2.97,8.66Z"/><path d="m711.49,19.1c-1.78,0-3.3.65-4.57,1.94-1.26,1.29-1.9,2.83-1.9,4.61s.63,3.3,1.9,4.57c1.26,1.26,2.79,1.9,4.57,1.9s3.39-.63,4.65-1.9c1.26-1.26,1.9-2.79,1.9-4.57s-.63-3.39-1.9-4.65c-1.26-1.26-2.82-1.9-4.65-1.9Z"/><path d="m711.45,40.38h-2.78c-1.16,0-2.09.94-2.09,2.09v35.22c0,2.57,2.09,4.66,4.66,4.66h2.79c1.36,0,2.46-1.1,2.46-2.46v-34.46c0-2.78-2.26-5.04-5.04-5.04Z"/><path d="m751.51,39.94c-.46-.05-.93-.07-1.41-.07-2.76,0-5.23.65-7.41,1.94-2.18,1.29-3.76,3.06-4.74,5.3v-2.35c0-2.41-1.96-4.37-4.37-4.37h-3.19c-1.2,0-2.17.97-2.17,2.17v38.18c0,.89.72,1.61,1.61,1.61h3.84c2.51,0,4.54-2.03,4.54-4.54v-15.45c0-8.22,3.76-12.32,11.29-12.32h.03c1.78,0,3.24-1.46,3.24-3.24v-5.46c0-.72-.54-1.32-1.26-1.4Z"/><path d="m767.33,19.96h-3.28c-.95,0-1.72.77-1.72,1.72v59.03c0,.9.73,1.64,1.64,1.64h3.36c2.76,0,5-2.24,5-5V24.96c0-2.76-2.24-5-5-5Z"/><path d="m444.33,39.34c.17-.34.24-.86,0-1.21-.53-.76-2.19-.2-4.84,0-1.56.12-2.84.06-3.63,0-1.22-.55-3.35-1.3-6.05-1.21-1.17.04-4.29.18-7.26,2.42-2.14,1.61-3.22,3.57-3.72,4.65-2.87,6.75-5.74,13.49-8.61,20.24-.24.57-1.05.58-1.3.02-3.03-6.67-6.07-13.35-9.1-20.02-1.4-3.07-4.46-5.04-7.83-5.04h-3.86c-.88,0-1.46.91-1.09,1.71,4.95,10.66,9.9,21.32,14.86,31.98.81,1.75.74,3.78-.2,5.47-3.27,5.88-6.53,11.76-9.8,17.64-.36.66.11,1.46.86,1.46h5.56c5.35,0,10.34-2.69,13.28-7.16l.07-.1c.65-1,1.64-2.66,2.59-4.82,1.45-3.32,1.98-6,2.25-7.28,0,0,2.34-11.13,7.26-21.79.72-1.56,1.77-3.69,3.63-6.05,1.72-2.18,3.34-3.54,4.84-4.84,3.41-2.94,5.1-4.54,7.26-4.84,1.8-.25,4.21.05,4.84-1.21Z"/><path d="m437.26,55.63c.07.39.25.71.47.99.56.7,1.4,1.02,2.24,1l15.6-.52c.44-.27.97-.72,1.12-1.44.35-1.75-1.95-3.73-2.56-4.26-3.06-2.64-6.56-2.49-7.8-2.42-1.16.07-4.24.42-6.94,2.91-.92.84-2.42,2.23-2.13,3.74Z"/><path d="m159.15,86.51l-.56.07c-.03-.05-.07-.15-.12-.3l-1.85-10.35-2.01,9.38c-.27,1.3-.89,1.83-2.12,1.83h-19.46c-1.41,0-2.64-1.24-2.64-2.64v-22.12l24.52-2.98c3.04-.56,4.41-2.96,4.41-5.09v-1.52l-28.93,3.42v-15.01l17.77-2.08c2.49-.5,4.3-2.64,4.3-5.09v-1.52l-22.08,2.7v-15.46l-.43-.25c-.49-.29-1.51-.75-2.82-.55-1.3.2-2.13.93-2.5,1.34l-.23.25v15.34l-19.14,2.36.13.88c.45,3.07,2.8,4.44,4.92,4.44l14.09-1.61v15.01l-26.02,3.08.17.91c.5,2.69,2.51,4.5,5,4.5l20.85-2.33v22.18c0,4.38,3.43,7.81,7.81,7.81h23.61c3.14,0,4.96-1.58,5.28-4.56v-.05s0-.35,0-.35c-.15-1.05-.86-1.65-1.94-1.65Z"/><path d="m120.18,11.16c3.34-1.94,8.77-3.23,15.33-2.52-8.48,1.07-13.05,1.96-19.57,7.62,3.52-2.25,8.86-4.26,14.82-1.71,5.2,2.23,8.94,4.62,11.99,6.25-.84-1.28-1.26-2.9-.75-4.96,0,0-.06,1.08.67,2.67,1.01,2.21,3.11,3.75,5.51,4.04,2.4.29,4.74-.7,6.14-2.62h0C159.13,13.36,150.75-.14,134.21,0c-9.98.25-16.18,7.02-19.51,12.6-5.89,4.67-9.21,11.83-7.76,20.47.16-2.33.37-14.46,13.24-21.91Z"/><path d="m531.93,54.18c-1.13-.02-2.4,2.05-1.97,3.72.21.8.91,1.92,1.92,1.92,1.01,0,1.71-1.13,1.92-1.92.44-1.65-.74-3.71-1.86-3.72Z"/>
            </g>
            {/* revealed logo */}
            <g clipPath="url(#logoReveal)" fill={DARK}>
              <path d="m28.84,71.78h-.65c-1.13,0-2.12.5-2.97,1.53-5.12,7.19-11.27,13.08-18.3,17.52l-.12.09c-.24.22-.51.64-.51,1.04,0,.67.5,1.16,1.19,1.16h.35l.13-.04c8.78-2.83,16.53-8.24,23.05-16.08l.07-.09c.47-.74.78-1.38.78-2.12,0-.51-.18-1.07-.45-1.43-.61-.99-1.57-1.58-2.57-1.58Z"/><path d="m11.24,16.02h8.82l-.02,9.29.02.87,24.62.02.87-.02v-10.16h8.82c2.99,0,5.43-2.43,5.43-5.43v-.87h-14.25v-3.59c0-3.09-2.37-5.43-5.52-5.43h-.87v9.01h-12.7v-3.59c0-3.09-2.37-5.43-5.52-5.43h-.87v9.01H5.82v.87c0,2.89,2.54,5.43,5.43,5.43Zm15.22,4.04v-4.04h12.7v4.04h-12.7Z"/><path d="m46.58,77.88c-2.77-2.54-5.91-4.63-9.32-6.21l-.27-.17-.19-.02c-.56-.07-1.09.24-1.36.82l-.41.85.74.46c1.49,1.45,3.31,3.56,5.71,6.62,2.37,3.02,4.04,5.7,4.96,7.97l.05.1c.34.6.94,1.42,2.14,1.58.24.03.48.05.7.05,1.91,0,3.12-1.07,3.6-2.07.33-.69.34-1.41.01-2.25-1.1-2.36-3.18-4.89-6.35-7.73Z"/><path d="m0,29.93c0,2.79,2.54,5.24,5.43,5.24h54.77c2.99,0,5.43-2.35,5.43-5.24v-.87H0v.87Z"/><path d="m10.92,69.17h44.45v-31.33H10.92v31.33Zm5.62-18.53v-6.99h13.11v6.99h-13.11Zm0,12.88v-7.16h13.11v7.16h-13.11Zm19.41-12.88v-6.99h13.1v6.99h-13.1Zm0,12.88v-7.16h13.1v7.16h-13.1Z"/><path d="m244.5,6.89c-1.54,0-2.72.75-3.53,2.24-4.81,9.41-10.4,17.87-16.62,25.15-.76-.38-1.61-.59-2.52-.59h-.87v59.43h.87c2.88,0,5.23-2.26,5.23-5.05v-49.33c0-.62-.1-1.21-.3-1.76,8.22-6.06,15.45-14.45,21.5-24.92.34-.58.51-1.17.51-1.77,0-.77-.35-1.55-.91-2.05-.8-.91-1.9-1.36-3.37-1.36Z"/><path d="m218.22,27.75c-3.67-7.98-9.11-14.82-16.15-20.31l-.15-.11-.54-.14-.42-.17-.35.35c-.43.27-.5.65-.5.85v.84l.18.24c5.18,6.72,9.33,13.72,12.36,20.84.62,1.24,1.56,1.84,2.87,1.84,1.6,0,2.96-1.31,2.96-2.87,0-.38-.11-.8-.21-1.21l-.05-.15Z"/><path d="m313.45,11.39c0,.26.04.51.08.76h-30.6v.87c0,2.74,2.4,5.14,5.14,5.14h20.62c2.74,0,5.05-2.35,5.05-5.14v-.03c.68,2.02,2.58,3.53,4.76,3.53h9.27l-1.03,7.43h-9.47v46.07h27.18V23.97h-13.61l3.31-7.43h9.06c2.74,0,5.05-2.35,5.05-5.14v-.87h-34.81v.87Zm9.92,25.38v-6.71h14.97v6.71h-14.97Zm0,12.72v-6.71h14.97v6.71h-14.97Zm0,14.53v-8.43h14.97v8.43h-14.97Z"/><path d="m310.02,25.06h-23.36v26.54h23.36v-26.54Zm-17.35,20.53v-14.43h11.34v14.43h-11.34Z"/><path d="m467.18,64.98c-1.54.51-4.24-.68-8.56-.74-2.02-.03-1.72.23-5.37.34-2.9.09-6.06-.06-6.06-.06-2.92-.13-7.49-.42-10.39.6-.25.09-.69.25-.99.66-.86,1.16.12,3.28.77,4.26,2.02,3.03,6.97,4.16,10.79,3.23,3.42-.84,5.71-3.05,5.71-3.05,1.2-1.16,1.64-2.13,3.15-2.76,1.38-.57,2.67-.44,3.82-.32,1.32.13,3.3.33,4.94,1.58.75.57,1.43,1.58,2.19,3.19v10.44h10V19.96h-10v45.02Z"/><rect x="486.47" y="19.96" width="10" height="62.39"/><path d="m527.84,39.09c-6.26,0-11.45,2.1-15.55,6.29-4.11,4.19-6.16,9.51-6.16,15.94s2.05,11.76,6.16,15.99c4.11,4.22,9.29,6.33,15.55,6.33s11.53-2.11,15.64-6.33c4.11-4.22,6.16-9.55,6.16-15.99s-2.05-11.75-6.16-15.94c-4.11-4.19-9.32-6.29-15.64-6.29Zm8.32,32.06c-2.27,2.36-5.04,3.53-8.32,3.53s-6.05-1.19-8.32-3.58c-2.27-2.38-3.4-5.64-3.4-9.78s1.13-7.37,3.4-9.69c2.27-2.33,5.04-3.49,8.32-3.49s6.05,1.16,8.32,3.49c2.27,2.33,3.4,5.56,3.4,9.69s-1.14,7.47-3.4,9.82Z"/><path d="m614.93,40.38h-2.83c-.86,0-1.61.57-1.85,1.39l-7.38,25.65c-.18.62-1.04.64-1.25.03l-7.77-22.78c-.88-2.57-3.29-4.29-6-4.29h-4.02c-1.07,0-2.02.68-2.37,1.69l-8.67,25.39c-.21.6-1.07.59-1.25-.03l-6.93-23.6c-.6-2.05-2.48-3.46-4.62-3.46h-4.74c-1.16,0-1.98,1.13-1.62,2.23l11.71,36.08c.71,2.18,2.74,3.66,5.04,3.66h2.79c2.16,0,4.08-1.38,4.77-3.43l8.4-24.91c.2-.59,1.04-.6,1.24,0l8.58,24.81c.73,2.12,2.73,3.54,4.97,3.54h2.47c2.25,0,4.25-1.46,4.94-3.6l10.49-32.76c.89-2.77-1.18-5.61-4.09-5.61Z"/><path d="m688.78,40.38h-2.55c-.85,0-1.54.69-1.54,1.54v3.8c-2.13-4.08-6.26-6.12-12.41-6.12-5.69,0-10.34,1.98-13.96,5.95s-5.43,8.79-5.43,14.48,1.82,10.8,5.47,14.65c3.65,3.85,8.29,5.77,13.92,5.77,2.87,0,5.37-.57,7.5-1.72,1.41-.76,2.57-1.66,3.47-2.71.41-.47,1.18-.18,1.18.45v2.26c0,8.39-3.96,12.58-11.89,12.58-2.82,0-5.18-.85-7.11-2.54-1.47-1.29-2.48-2.86-3.03-4.71-.29-.97-1.25-1.57-2.23-1.31l-4.29,1.12c-1.87.49-2.89,2.48-2.23,4.29,1.04,2.86,2.88,5.35,5.53,7.46,3.68,2.93,8.22,4.4,13.62,4.4,7.35,0,12.78-2.05,16.29-6.16,3.5-4.11,5.26-9.26,5.26-15.47v-32.44c0-3.07-2.49-5.57-5.57-5.57Zm-7.06,28.31c-1.98,2.15-4.58,3.23-7.8,3.23s-5.92-1.08-7.93-3.23c-2.01-2.15-3.02-5.04-3.02-8.66s1.02-6.42,3.06-8.57c2.04-2.15,4.67-3.23,7.89-3.23s5.74,1.08,7.76,3.23c2.01,2.15,3.02,5.01,3.02,8.57s-.99,6.51-2.97,8.66Z"/><path d="m711.49,19.1c-1.78,0-3.3.65-4.57,1.94-1.26,1.29-1.9,2.83-1.9,4.61s.63,3.3,1.9,4.57c1.26,1.26,2.79,1.9,4.57,1.9s3.39-.63,4.65-1.9c1.26-1.26,1.9-2.79,1.9-4.57s-.63-3.39-1.9-4.65c-1.26-1.26-2.82-1.9-4.65-1.9Z"/><path d="m711.45,40.38h-2.78c-1.16,0-2.09.94-2.09,2.09v35.22c0,2.57,2.09,4.66,4.66,4.66h2.79c1.36,0,2.46-1.1,2.46-2.46v-34.46c0-2.78-2.26-5.04-5.04-5.04Z"/><path d="m751.51,39.94c-.46-.05-.93-.07-1.41-.07-2.76,0-5.23.65-7.41,1.94-2.18,1.29-3.76,3.06-4.74,5.3v-2.35c0-2.41-1.96-4.37-4.37-4.37h-3.19c-1.2,0-2.17.97-2.17,2.17v38.18c0,.89.72,1.61,1.61,1.61h3.84c2.51,0,4.54-2.03,4.54-4.54v-15.45c0-8.22,3.76-12.32,11.29-12.32h.03c1.78,0,3.24-1.46,3.24-3.24v-5.46c0-.72-.54-1.32-1.26-1.4Z"/><path d="m767.33,19.96h-3.28c-.95,0-1.72.77-1.72,1.72v59.03c0,.9.73,1.64,1.64,1.64h3.36c2.76,0,5-2.24,5-5V24.96c0-2.76-2.24-5-5-5Z"/><path d="m444.33,39.34c.17-.34.24-.86,0-1.21-.53-.76-2.19-.2-4.84,0-1.56.12-2.84.06-3.63,0-1.22-.55-3.35-1.3-6.05-1.21-1.17.04-4.29.18-7.26,2.42-2.14,1.61-3.22,3.57-3.72,4.65-2.87,6.75-5.74,13.49-8.61,20.24-.24.57-1.05.58-1.3.02-3.03-6.67-6.07-13.35-9.1-20.02-1.4-3.07-4.46-5.04-7.83-5.04h-3.86c-.88,0-1.46.91-1.09,1.71,4.95,10.66,9.9,21.32,14.86,31.98.81,1.75.74,3.78-.2,5.47-3.27,5.88-6.53,11.76-9.8,17.64-.36.66.11,1.46.86,1.46h5.56c5.35,0,10.34-2.69,13.28-7.16l.07-.1c.65-1,1.64-2.66,2.59-4.82,1.45-3.32,1.98-6,2.25-7.28,0,0,2.34-11.13,7.26-21.79.72-1.56,1.77-3.69,3.63-6.05,1.72-2.18,3.34-3.54,4.84-4.84,3.41-2.94,5.1-4.54,7.26-4.84,1.8-.25,4.21.05,4.84-1.21Z"/><path d="m437.26,55.63c.07.39.25.71.47.99.56.7,1.4,1.02,2.24,1l15.6-.52c.44-.27.97-.72,1.12-1.44.35-1.75-1.95-3.73-2.56-4.26-3.06-2.64-6.56-2.49-7.8-2.42-1.16.07-4.24.42-6.94,2.91-.92.84-2.42,2.23-2.13,3.74Z"/><path d="m159.15,86.51l-.56.07c-.03-.05-.07-.15-.12-.3l-1.85-10.35-2.01,9.38c-.27,1.3-.89,1.83-2.12,1.83h-19.46c-1.41,0-2.64-1.24-2.64-2.64v-22.12l24.52-2.98c3.04-.56,4.41-2.96,4.41-5.09v-1.52l-28.93,3.42v-15.01l17.77-2.08c2.49-.5,4.3-2.64,4.3-5.09v-1.52l-22.08,2.7v-15.46l-.43-.25c-.49-.29-1.51-.75-2.82-.55-1.3.2-2.13.93-2.5,1.34l-.23.25v15.34l-19.14,2.36.13.88c.45,3.07,2.8,4.44,4.92,4.44l14.09-1.61v15.01l-26.02,3.08.17.91c.5,2.69,2.51,4.5,5,4.5l20.85-2.33v22.18c0,4.38,3.43,7.81,7.81,7.81h23.61c3.14,0,4.96-1.58,5.28-4.56v-.05s0-.35,0-.35c-.15-1.05-.86-1.65-1.94-1.65Z"/><path d="m120.18,11.16c3.34-1.94,8.77-3.23,15.33-2.52-8.48,1.07-13.05,1.96-19.57,7.62,3.52-2.25,8.86-4.26,14.82-1.71,5.2,2.23,8.94,4.62,11.99,6.25-.84-1.28-1.26-2.9-.75-4.96,0,0-.06,1.08.67,2.67,1.01,2.21,3.11,3.75,5.51,4.04,2.4.29,4.74-.7,6.14-2.62h0C159.13,13.36,150.75-.14,134.21,0c-9.98.25-16.18,7.02-19.51,12.6-5.89,4.67-9.21,11.83-7.76,20.47.16-2.33.37-14.46,13.24-21.91Z"/><path d="m531.93,54.18c-1.13-.02-2.4,2.05-1.97,3.72.21.8.91,1.92,1.92,1.92,1.01,0,1.71-1.13,1.92-1.92.44-1.65-.74-3.71-1.86-3.72Z"/>
            </g>
          </svg>
        </div>

        {/* corners */}
        <div style={{ position:"absolute", bottom:36, left:44, fontFamily:"'Cormorant Garamond'", fontSize:20, fontWeight:300, color:`${DARK}66` }}>{String(progress).padStart(2,"0")}</div>
        <div style={{ position:"absolute", bottom:36, right:44, fontFamily:"'Cormorant Garamond'", fontStyle:"italic", fontSize:20, color:`${DARK}66` }}>%</div>
        <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", fontFamily:"'Jost'", fontSize:9, letterSpacing:6, color:`${DARK}44`, textTransform:"uppercase", whiteSpace:"nowrap" }}>台中 · Est. 2010</div>
      </div>

      {/* ══ NAV ══ */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:400, height:60, padding:"0 48px", background:CREAM, borderBottom:`1px solid ${DARK}0a`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Cormorant Garamond'", fontSize:19, fontWeight:300, letterSpacing:5 }}>
          味鮮<em style={{ fontStyle:"italic", color:`${DARK}55` }}>小館</em>
        </div>
        <div style={{ display:"flex", gap:36, alignItems:"center" }}>
          <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:3, color:`${DARK}44` }}>台中 · 11:00–21:00</span>
          <button className="nav-btn" onClick={()=>setCartOpen(true)} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            Order {totalQty>0 && <em style={{ fontStyle:"italic" }}>({totalQty})</em>}
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 48px 64px", borderBottom:`1px solid ${DARK}0a`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(ellipse 55% 65% at 65% 35%, ${DARK}05 0%, transparent 65%)` }} />
        <div style={{ position:"absolute", top:80, right:48, fontFamily:"'Jost'", fontSize:9, letterSpacing:5, color:`${DARK}44`, textTransform:"uppercase", opacity:heroVis?1:0, transition:"opacity 1.2s .9s" }}>Since 2010</div>

        {[["道地", 0], ["台灣", 0.18], ["好味道", 0.36]].map(([word, delay], i) => (
          <div key={word} style={{ overflow:"hidden" }}>
            <span style={{
              display:"block",
              fontFamily:"'Cormorant Garamond'",
              fontSize:"clamp(58px,9.5vw,128px)",
              fontWeight:300, lineHeight:0.9, letterSpacing:-3,
              fontStyle: i===1 ? "italic" : "normal",
              color: i===1 ? `${DARK}55` : DARK,
              transform: heroVis ? "translateY(0)" : "translateY(115%)",
              transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
              marginBottom: i===2 ? 40 : 0,
            }}>{word}</span>
          </div>
        ))}

        <div style={{ display:"flex", alignItems:"center", gap:40, opacity:heroVis?1:0, transform:heroVis?"translateY(0)":"translateY(20px)", transition:"all .9s cubic-bezier(0.16,1,0.3,1) .75s" }}>
          <button onClick={()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"})} onMouseEnter={onEnter} onMouseLeave={onLeave}
            style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:4, textTransform:"uppercase", background:DARK, color:CREAM, border:"none", padding:"13px 36px", transition:"background .3s" }}>
            探索菜單
          </button>
          <span style={{ fontFamily:"'Jost'", fontSize:11, color:`${DARK}44`, letterSpacing:1 }}>外送 30–45 分鐘 · NT$30</span>
        </div>

        <div style={{ position:"absolute", bottom:60, right:48, textAlign:"right", opacity:heroVis?1:0, transition:"opacity 1s 1s" }}>
          <div style={{ fontSize:42, fontWeight:300, lineHeight:1 }}>4.9</div>
          <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:3, color:`${DARK}44` }}>RATING</div>
        </div>
        <div style={{ position:"absolute", bottom:60, left:"50%", transform:"translateX(-50%)", opacity:heroVis?1:0, transition:"opacity 1s 1.2s" }}>
          <div style={{ width:1, height:52, background:`linear-gradient(to bottom,${DARK},transparent)`, margin:"0 auto" }} />
        </div>
      </div>

      {/* ══ MENU ══ */}
      <div id="menu" style={{ maxWidth:1200, margin:"0 auto", padding:"80px 48px 120px" }}>
        <MenuSection
          activeTab={activeTab} setActiveTab={setActiveTab}
          cart={cart} addItem={addItem} removeItem={removeItem}
          onEnter={onEnter} onLeave={onLeave}
          DARK={DARK} CREAM={CREAM}
        />
      </div>

      {/* overlay */}
      <div onClick={()=>setCartOpen(false)} style={{ position:"fixed", inset:0, background:`${DARK}44`, backdropFilter:"blur(2px)", zIndex:500, opacity:cartOpen?1:0, pointerEvents:cartOpen?"all":"none", transition:"opacity .4s" }} />

      {/* ══ CART ══ */}
      <div style={{ position:"fixed", top:0, right:0, width:400, height:"100vh", background:CREAM, borderLeft:`1px solid ${DARK}0a`, zIndex:600, transform:cartOpen?"translateX(0)":"translateX(100%)", transition:"transform .75s cubic-bezier(0.76,0,0.24,1)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"24px 32px", borderBottom:`1px solid ${DARK}08`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:5, color:`${DARK}44`, marginBottom:4 }}>YOUR ORDER</div>
            <div style={{ fontSize:26, fontWeight:300 }}>購物車</div>
          </div>
          <button className="nav-btn" onClick={()=>setCartOpen(false)} onMouseEnter={onEnter} onMouseLeave={onLeave}>Close</button>
        </div>
        {cartItems.length===0 ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ fontSize:36 }}>🛒</div>
            <div style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:3, color:`${DARK}33` }}>CART IS EMPTY</div>
          </div>
        ) : (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"16px 32px" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display:"flex", gap:12, padding:"16px 0", borderBottom:`1px solid ${DARK}08` }}>
                  <div style={{ width:52, height:52, borderRadius:4, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, marginBottom:3 }}>{item.name}</div>
                    <div style={{ fontFamily:"'Jost'", fontSize:10, color:`${DARK}44`, letterSpacing:1 }}>NT$ {item.price} × {item.qty}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                    <span style={{ fontSize:16, fontWeight:300 }}>NT$ {item.price*item.qty}</span>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <button onClick={()=>removeItem(item.id)} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ fontFamily:"'Jost'", fontSize:9, background:"transparent", border:`1px solid ${DARK}18`, color:`${DARK}66`, padding:"4px 10px" }}>−</button>
                      <span style={{ fontFamily:"'Jost'", fontSize:12, minWidth:18, textAlign:"center" }}>{item.qty}</span>
                      <button onClick={()=>addItem(item)} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ fontFamily:"'Jost'", fontSize:9, background:DARK, color:CREAM, border:`1px solid ${DARK}`, padding:"4px 10px" }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"18px 32px 28px", borderTop:`1px solid ${DARK}08` }}>
              {[["SUBTOTAL", totalPrice],["DELIVERY", 30]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontFamily:"'Jost'", fontSize:11, color:`${DARK}44` }}><span>{l}</span><span>NT$ {v}</span></div>
              ))}
              <div style={{ height:1, background:`${DARK}0f`, margin:"12px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, fontSize:22, fontWeight:300 }}><span>Total</span><span>NT$ {totalPrice+30}</span></div>
              <button className="submit-btn" onClick={()=>{setCartOpen(false);setCheckout(true);}} onMouseEnter={onEnter} onMouseLeave={onLeave}>Proceed to Checkout →</button>
            </div>
          </>
        )}
      </div>

      {/* ══ CHECKOUT ══ */}
      {checkout && (
        <div style={{ position:"fixed", inset:0, background:`${DARK}55`, backdropFilter:"blur(6px)", zIndex:700, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:CREAM, border:`1px solid ${DARK}0a`, width:"100%", maxWidth:460, maxHeight:"90vh", overflowY:"auto" }}>
            {!ordered ? (
              <>
                <div style={{ padding:"28px 32px", borderBottom:`1px solid ${DARK}08`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:5, color:`${DARK}44`, marginBottom:8 }}>CHECKOUT</div>
                    <div style={{ fontSize:28, fontWeight:300 }}>訂購資料</div>
                  </div>
                  <button className="nav-btn" onClick={()=>setCheckout(false)} onMouseEnter={onEnter} onMouseLeave={onLeave}>✕</button>
                </div>
                <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:20 }}>
                  {[["姓名 NAME","name","text","Your name"],["電話 PHONE","phone","tel","0912-345-678"],["地址 ADDRESS","address","text","台中市..."]].map(([label,key,type,ph])=>(
                    <div key={key}>
                      <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:4, color:`${DARK}44`, marginBottom:6 }}>{label}</div>
                      <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:4, color:`${DARK}44`, marginBottom:6 }}>備註 NOTE</div>
                    <textarea placeholder="特殊需求..." value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} rows={2} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:4, color:`${DARK}44`, marginBottom:10 }}>付款 PAYMENT</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                      {[["credit","💳","信用卡"],["linepay","💚","LINE Pay"],["cash","💵","貨到付款"]].map(([val,icon,label])=>(
                        <div key={val} onClick={()=>setForm(p=>({...p,payment:val}))} onMouseEnter={onEnter} onMouseLeave={onLeave}
                          style={{ border:`1px solid ${form.payment===val?DARK+"44":DARK+"10"}`, background:form.payment===val?`${DARK}06`:"transparent", padding:"12px 8px", textAlign:"center", transition:"all .25s" }}>
                          <div style={{ fontSize:18, marginBottom:5 }}>{icon}</div>
                          <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:2, color:form.payment===val?DARK:`${DARK}44` }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderTop:`1px solid ${DARK}08`, paddingTop:18 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, fontSize:20, fontWeight:300 }}>
                      <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:2, color:`${DARK}55`, alignSelf:"center" }}>TOTAL</span>
                      <span>NT$ {totalPrice+30}</span>
                    </div>
                    <button className="submit-btn" disabled={!form.name||!form.phone||!form.address}
                      onClick={()=>{if(form.name&&form.phone&&form.address)setOrdered(true);}}
                      onMouseEnter={onEnter} onMouseLeave={onLeave}>
                      確認下單 · Confirm Order
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding:"60px 40px", textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:16 }}>✓</div>
                <div style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:6, color:`${DARK}44`, marginBottom:12 }}>ORDER CONFIRMED</div>
                <div style={{ fontSize:36, fontWeight:300, marginBottom:8 }}>訂單成立</div>
                <div style={{ height:1, background:`${DARK}0f`, width:60, margin:"16px auto" }} />
                <p style={{ fontFamily:"'Jost'", fontSize:11, color:`${DARK}55`, letterSpacing:1, lineHeight:2, marginBottom:6 }}>感謝您，{form.name}<br/>預計 30–45 分鐘送達</p>
                <p style={{ fontFamily:"'Jost'", fontSize:10, color:`${DARK}33`, letterSpacing:2, marginBottom:36 }}>#ORD-{Math.floor(Math.random()*90000)+10000}</p>
                <button className="submit-btn" onClick={()=>{setCheckout(false);setOrdered(false);setCart({});setForm({name:"",phone:"",address:"",note:"",payment:"credit"});}} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                  繼續點餐 · Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* floating cart */}
      {totalQty>0 && !cartOpen && (
        <button onClick={()=>setCartOpen(true)} onMouseEnter={onEnter} onMouseLeave={onLeave}
          style={{ position:"fixed", bottom:36, right:36, background:DARK, color:CREAM, border:"none", borderRadius:"50%", width:58, height:58, fontFamily:"'Jost'", fontSize:9, letterSpacing:2, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:450, boxShadow:`0 8px 28px ${DARK}22` }}>
          <span style={{ fontSize:18 }}>🛒</span>
          <span>{totalQty}</span>
        </button>
      )}

      {/* footer */}
      <div style={{ borderTop:`1px solid ${DARK}08`, padding:"32px 48px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'Cormorant Garamond'", fontSize:18, fontWeight:300, letterSpacing:4 }}>味鮮小館</span>
        <span style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:3, color:`${DARK}33` }}>© 2024 · TAICHUNG</span>
        <span style={{ fontFamily:"'Jost'", fontSize:9, letterSpacing:2, color:`${DARK}33` }}>11:00–21:00 DAILY</span>
      </div>
    </div>
  );
}

function MenuSection({ activeTab, setActiveTab, cart, addItem, removeItem, onEnter, onLeave, DARK, CREAM }) {
  const [titleRef, titleVis] = useReveal(0.1);
  return (
    <>
      <div ref={titleRef} style={{ display:"flex", alignItems:"baseline", gap:20, marginBottom:52, opacity:titleVis?1:0, transform:titleVis?"none":"translateY(30px)", transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>
        <h2 style={{ fontSize:"clamp(40px,6vw,78px)", fontWeight:300, letterSpacing:-2 }}>Menu</h2>
        <div style={{ flex:1, height:1, background:`${DARK}0f`, alignSelf:"center" }}/>
        <span style={{ fontFamily:"'Jost'", fontSize:10, letterSpacing:3, color:`${DARK}33` }}>2024</span>
      </div>
      <div style={{ display:"flex", gap:28, marginBottom:52, borderBottom:`1px solid ${DARK}0a`, opacity:titleVis?1:0, transition:"opacity .8s .2s" }}>
        {Object.keys(menuData).map(tab => (
          <button key={tab} className={`cat-btn${activeTab===tab?" active":""}`} onClick={()=>setActiveTab(tab)} onMouseEnter={onEnter} onMouseLeave={onLeave}>{tab}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:32 }}>
        {menuData[activeTab].map((item, i) => (
          <Card key={item.id} item={item} idx={i} cart={cart} onAdd={addItem} onRemove={removeItem} onEnter={onEnter} onLeave={onLeave} />
        ))}
      </div>
    </>
  );
}
