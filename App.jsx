import { useState, useEffect, useRef } from "react";

const menuData = {
  "精選推薦": [
    { id:1, name:"招牌牛肉麵", desc:"精燉12小時濃郁湯頭，厚切牛腱", price:180, tag:"SIGNATURE", bg:"#8B6B47", emoji:"🍜" },
    { id:2, name:"脆皮烤鴨飯", desc:"皮脆肉嫩烤鴨，搭配香Q白飯", price:220, tag:"CHEF'S PICK", bg:"#6B4C3B", emoji:"🍱" },
    { id:3, name:"紅燒獅子頭", desc:"手工肉丸，慢燉入味", price:160, tag:"POPULAR", bg:"#7A5244", emoji:"🥘" },
  ],
  "主食": [
    { id:4, name:"三杯雞腿飯", desc:"香氣四溢的台式三杯醬料", price:150, bg:"#5C7A5C", emoji:"🍚" },
    { id:5, name:"叉燒炒飯", desc:"大火翻炒，粒粒分明", price:130, bg:"#7A6B3E", emoji:"🍳" },
    { id:6, name:"番茄牛肉義麵", desc:"慢熬番茄肉醬，義式風味", price:170, bg:"#8B4A4A", emoji:"🍝" },
  ],
  "小吃": [
    { id:7, name:"蔥油餅", desc:"酥脆外皮，層層分明", price:50, bg:"#6B7A3E", emoji:"🫓" },
    { id:8, name:"水晶餃", desc:"薄皮多汁，手工製作（6入）", price:80, bg:"#4A6B7A", emoji:"🥟" },
    { id:9, name:"滷味拼盤", desc:"豆乾、海帶、豬耳朵各一份", price:120, bg:"#5C4A6B", emoji:"🫙" },
  ],
  "飲品": [
    { id:10, name:"珍珠奶茶", desc:"特選阿薩姆紅茶，Q彈珍珠", price:70, bg:"#7A5C3E", emoji:"🧋" },
    { id:11, name:"冬瓜檸檬", desc:"清爽消暑，酸甜平衡", price:55, bg:"#4A7A5C", emoji:"🍋" },
    { id:12, name:"溫熱豆漿", desc:"非基改黃豆，濃醇香", price:40, bg:"#6B6B4A", emoji:"🥛" },
  ],
};

const CREAM = "#F5F2ED";
const DARK  = "#2A2520";

/* ── SVG logo paths (all paths from YG_logo.svg) ─────────────────── */
const LOGO_PATHS = [
  "m28.84,71.78h-.65c-1.13,0-2.12.5-2.97,1.53-5.12,7.19-11.27,13.08-18.3,17.52l-.12.09c-.24.22-.51.64-.51,1.04,0,.67.5,1.16,1.19,1.16h.35l.13-.04c8.78-2.83,16.53-8.24,23.05-16.08l.07-.09c.47-.74.78-1.38.78-2.12,0-.51-.18-1.07-.45-1.43-.61-.99-1.57-1.58-2.57-1.58Z",
  "m11.24,16.02h8.82l-.02,9.29.02.87,24.62.02.87-.02v-10.16h8.82c2.99,0,5.43-2.43,5.43-5.43v-.87h-14.25v-3.59c0-3.09-2.37-5.43-5.52-5.43h-.87v9.01h-12.7v-3.59c0-3.09-2.37-5.43-5.52-5.43h-.87v9.01H5.82v.87c0,2.89,2.54,5.43,5.43,5.43Zm15.22,4.04v-4.04h12.7v4.04h-12.7Z",
  "m46.58,77.88c-2.77-2.54-5.91-4.63-9.32-6.21l-.27-.17-.19-.02c-.56-.07-1.09.24-1.36.82l-.41.85.74.46c1.49,1.45,3.31,3.56,5.71,6.62,2.37,3.02,4.04,5.7,4.96,7.97l.05.1c.34.6.94,1.42,2.14,1.58.24.03.48.05.7.05,1.91,0,3.12-1.07,3.6-2.07.33-.69.34-1.41.01-2.25-1.1-2.36-3.18-4.89-6.35-7.73Z",
  "m0,29.93c0,2.79,2.54,5.24,5.43,5.24h54.77c2.99,0,5.43-2.35,5.43-5.24v-.87H0v.87Z",
  "m10.92,69.17h44.45v-31.33H10.92v31.33Zm5.62-18.53v-6.99h13.11v6.99h-13.11Zm0,12.88v-7.16h13.11v7.16h-13.11Zm19.41-12.88v-6.99h13.1v6.99h-13.1Zm0,12.88v-7.16h13.1v7.16h-13.1Z",
  "m244.5,6.89c-1.54,0-2.72.75-3.53,2.24-4.81,9.41-10.4,17.87-16.62,25.15-.76-.38-1.61-.59-2.52-.59h-.87v59.43h.87c2.88,0,5.23-2.26,5.23-5.05v-49.33c0-.62-.1-1.21-.3-1.76,8.22-6.06,15.45-14.45,21.5-24.92.34-.58.51-1.17.51-1.77,0-.77-.35-1.55-.91-2.05-.8-.91-1.9-1.36-3.37-1.36Z",
  "m218.22,27.75c-3.67-7.98-9.11-14.82-16.15-20.31l-.15-.11-.54-.14-.42-.17-.35.35c-.43.27-.5.65-.5.85v.84l.18.24c5.18,6.72,9.33,13.72,12.36,20.84.62,1.24,1.56,1.84,2.87,1.84,1.6,0,2.96-1.31,2.96-2.87,0-.38-.11-.8-.21-1.21l-.05-.15Z",
  "m313.45,11.39c0,.26.04.51.08.76h-30.6v.87c0,2.74,2.4,5.14,5.14,5.14h20.62c2.74,0,5.05-2.35,5.05-5.14v-.03c.68,2.02,2.58,3.53,4.76,3.53h9.27l-1.03,7.43h-9.47v46.07h27.18V23.97h-13.61l3.31-7.43h9.06c2.74,0,5.05-2.35,5.05-5.14v-.87h-34.81v.87Zm9.92,25.38v-6.71h14.97v6.71h-14.97Zm0,12.72v-6.71h14.97v6.71h-14.97Zm0,14.53v-8.43h14.97v8.43h-14.97Z",
  "m310.02,25.06h-23.36v26.54h23.36v-26.54Zm-17.35,20.53v-14.43h11.34v14.43h-11.34Z",
  "m467.18,64.98c-1.54.51-4.24-.68-8.56-.74-2.02-.03-1.72.23-5.37.34-2.9.09-6.06-.06-6.06-.06-2.92-.13-7.49-.42-10.39.6-.25.09-.69.25-.99.66-.86,1.16.12,3.28.77,4.26,2.02,3.03,6.97,4.16,10.79,3.23,3.42-.84,5.71-3.05,5.71-3.05,1.2-1.16,1.64-2.13,3.15-2.76,1.38-.57,2.67-.44,3.82-.32,1.32.13,3.3.33,4.94,1.58.75.57,1.43,1.58,2.19,3.19v10.44h10V19.96h-10v45.02Z",
  "m486.47,19.96h10v62.39h-10z",
  "m527.84,39.09c-6.26,0-11.45,2.1-15.55,6.29-4.11,4.19-6.16,9.51-6.16,15.94s2.05,11.76,6.16,15.99c4.11,4.22,9.29,6.33,15.55,6.33s11.53-2.11,15.64-6.33c4.11-4.22,6.16-9.55,6.16-15.99s-2.05-11.75-6.16-15.94c-4.11-4.19-9.32-6.29-15.64-6.29Zm8.32,32.06c-2.27,2.36-5.04,3.53-8.32,3.53s-6.05-1.19-8.32-3.58c-2.27-2.38-3.4-5.64-3.4-9.78s1.13-7.37,3.4-9.69c2.27-2.33,5.04-3.49,8.32-3.49s6.05,1.16,8.32,3.49c2.27,2.33,3.4,5.56,3.4,9.69s-1.14,7.47-3.4,9.82Z",
  "m614.93,40.38h-2.83c-.86,0-1.61.57-1.85,1.39l-7.38,25.65c-.18.62-1.04.64-1.25.03l-7.77-22.78c-.88-2.57-3.29-4.29-6-4.29h-4.02c-1.07,0-2.02.68-2.37,1.69l-8.67,25.39c-.21.6-1.07.59-1.25-.03l-6.93-23.6c-.6-2.05-2.48-3.46-4.62-3.46h-4.74c-1.16,0-1.98,1.13-1.62,2.23l11.71,36.08c.71,2.18,2.74,3.66,5.04,3.66h2.79c2.16,0,4.08-1.38,4.77-3.43l8.4-24.91c.2-.59,1.04-.6,1.24,0l8.58,24.81c.73,2.12,2.73,3.54,4.97,3.54h2.47c2.25,0,4.25-1.46,4.94-3.6l10.49-32.76c.89-2.77-1.18-5.61-4.09-5.61Z",
  "m688.78,40.38h-2.55c-.85,0-1.54.69-1.54,1.54v3.8c-2.13-4.08-6.26-6.12-12.41-6.12-5.69,0-10.34,1.98-13.96,5.95s-5.43,8.79-5.43,14.48,1.82,10.8,5.47,14.65c3.65,3.85,8.29,5.77,13.92,5.77,2.87,0,5.37-.57,7.5-1.72,1.41-.76,2.57-1.66,3.47-2.71.41-.47,1.18-.18,1.18.45v2.26c0,8.39-3.96,12.58-11.89,12.58-2.82,0-5.18-.85-7.11-2.54-1.47-1.29-2.48-2.86-3.03-4.71-.29-.97-1.25-1.57-2.23-1.31l-4.29,1.12c-1.87.49-2.89,2.48-2.23,4.29,1.04,2.86,2.88,5.35,5.53,7.46,3.68,2.93,8.22,4.4,13.62,4.4,7.35,0,12.78-2.05,16.29-6.16,3.5-4.11,5.26-9.26,5.26-15.47v-32.44c0-3.07-2.49-5.57-5.57-5.57Zm-7.06,28.31c-1.98,2.15-4.58,3.23-7.8,3.23s-5.92-1.08-7.93-3.23c-2.01-2.15-3.02-5.04-3.02-8.66s1.02-6.42,3.06-8.57c2.04-2.15,4.67-3.23,7.89-3.23s5.74,1.08,7.76,3.23c2.01,2.15,3.02,5.01,3.02,8.57s-.99,6.51-2.97,8.66Z",
  "m711.49,19.1c-1.78,0-3.3.65-4.57,1.94-1.26,1.29-1.9,2.83-1.9,4.61s.63,3.3,1.9,4.57c1.26,1.26,2.79,1.9,4.57,1.9s3.39-.63,4.65-1.9c1.26-1.26,1.9-2.79,1.9-4.57s-.63-3.39-1.9-4.65c-1.26-1.26-2.82-1.9-4.65-1.9Z",
  "m711.45,40.38h-2.78c-1.16,0-2.09.94-2.09,2.09v35.22c0,2.57,2.09,4.66,4.66,4.66h2.79c1.36,0,2.46-1.1,2.46-2.46v-34.46c0-2.78-2.26-5.04-5.04-5.04Z",
  "m751.51,39.94c-.46-.05-.93-.07-1.41-.07-2.76,0-5.23.65-7.41,1.94-2.18,1.29-3.76,3.06-4.74,5.3v-2.35c0-2.41-1.96-4.37-4.37-4.37h-3.19c-1.2,0-2.17.97-2.17,2.17v38.18c0,.89.72,1.61,1.61,1.61h3.84c2.51,0,4.54-2.03,4.54-4.54v-15.45c0-8.22,3.76-12.32,11.29-12.32h.03c1.78,0,3.24-1.46,3.24-3.24v-5.46c0-.72-.54-1.32-1.26-1.4Z",
  "m767.33,19.96h-3.28c-.95,0-1.72.77-1.72,1.72v59.03c0,.9.73,1.64,1.64,1.64h3.36c2.76,0,5-2.24,5-5V24.96c0-2.76-2.24-5-5-5Z",
  "m444.33,39.34c.17-.34.24-.86,0-1.21-.53-.76-2.19-.2-4.84,0-1.56.12-2.84.06-3.63,0-1.22-.55-3.35-1.3-6.05-1.21-1.17.04-4.29.18-7.26,2.42-2.14,1.61-3.22,3.57-3.72,4.65-2.87,6.75-5.74,13.49-8.61,20.24-.24.57-1.05.58-1.3.02-3.03-6.67-6.07-13.35-9.1-20.02-1.4-3.07-4.46-5.04-7.83-5.04h-3.86c-.88,0-1.46.91-1.09,1.71,4.95,10.66,9.9,21.32,14.86,31.98.81,1.75.74,3.78-.2,5.47-3.27,5.88-6.53,11.76-9.8,17.64-.36.66.11,1.46.86,1.46h5.56c5.35,0,10.34-2.69,13.28-7.16l.07-.1c.65-1,1.64-2.66,2.59-4.82,1.45-3.32,1.98-6,2.25-7.28,0,0,2.34-11.13,7.26-21.79.72-1.56,1.77-3.69,3.63-6.05,1.72-2.18,3.34-3.54,4.84-4.84,3.41-2.94,5.1-4.54,7.26-4.84,1.8-.25,4.21.05,4.84-1.21Z",
  "m437.26,55.63c.07.39.25.71.47.99.56.7,1.4,1.02,2.24,1l15.6-.52c.44-.27.97-.72,1.12-1.44.35-1.75-1.95-3.73-2.56-4.26-3.06-2.64-6.56-2.49-7.8-2.42-1.16.07-4.24.42-6.94,2.91-.92.84-2.42,2.23-2.13,3.74Z",
  "m159.15,86.51l-.56.07c-.03-.05-.07-.15-.12-.3l-1.85-10.35-2.01,9.38c-.27,1.3-.89,1.83-2.12,1.83h-19.46c-1.41,0-2.64-1.24-2.64-2.64v-22.12l24.52-2.98c3.04-.56,4.41-2.96,4.41-5.09v-1.52l-28.93,3.42v-15.01l17.77-2.08c2.49-.5,4.3-2.64,4.3-5.09v-1.52l-22.08,2.7v-15.46l-.43-.25c-.49-.29-1.51-.75-2.82-.55-1.3.2-2.13.93-2.5,1.34l-.23.25v15.34l-19.14,2.36.13.88c.45,3.07,2.8,4.44,4.92,4.44l14.09-1.61v15.01l-26.02,3.08.17.91c.5,2.69,2.51,4.5,5,4.5l20.85-2.33v22.18c0,4.38,3.43,7.81,7.81,7.81h23.61c3.14,0,4.96-1.58,5.28-4.56v-.05s0-.35,0-.35c-.15-1.05-.86-1.65-1.94-1.65Z",
  "m120.18,11.16c3.34-1.94,8.77-3.23,15.33-2.52-8.48,1.07-13.05,1.96-19.57,7.62,3.52-2.25,8.86-4.26,14.82-1.71,5.2,2.23,8.94,4.62,11.99,6.25-.84-1.28-1.26-2.9-.75-4.96,0,0-.06,1.08.67,2.67,1.01,2.21,3.11,3.75,5.51,4.04,2.4.29,4.74-.7,6.14-2.62h0C159.13,13.36,150.75-.14,134.21,0c-9.98.25-16.18,7.02-19.51,12.6-5.89,4.67-9.21,11.83-7.76,20.47.16-2.33.37-14.46,13.24-21.91Z",
  "m314.98,75.05l.22-.65v-.14c0-.85-.57-1.23-1.14-1.23h-.14l-.49.17c-3.61,1.67-8.04,3.3-13.15,4.86-5.31,1.62-10.32,2.9-14.88,3.79-2.68.47-2.64,2.26-2.63,2.84v.19c0,1.52,1.07,3.14,3.05,3.14h.06l.77-.11c5.3-1.21,10.4-2.95,15.61-5.33,5.06-2.31,9.28-4.79,12.54-7.38l.2-.16Z",
  "m325.23,72.12h-.1c-1.14.13-2.11.96-2.89,2.55-2.35,5.92-5.55,11.44-9.5,16.4l-.12.15-.21,1.15.25.26c.27.43.65.49.85.49h.75l.23-.18c2.84-2.16,5.49-4.68,7.85-7.48,2.49-2.85,4.42-5.6,5.78-8.22.3-.71.43-1.27.43-1.89,0-.68-.16-1.26-.49-1.73-.52-.97-1.52-1.5-2.83-1.5Z",
  "m303.2,56.56v.05c-.88,5.98-2.21,12.18-3.98,18.42l-.03.24c0,.75.48,1.23,1.23,1.23h.3l.59-.3.13-.22c3.35-5.59,5.92-11.62,7.63-17.93l.12-1.14c0-2-1.53-3.05-3.05-3.05-1.6,0-2.59.91-2.94,2.7Z",
  "m335.11,73.84l-.14-.11-.85-.21-.29.14c-.63.31-.76.79-.76,1.14v.54l.3.3c3.17,4.2,5.9,9.1,8.13,14.6.76,1.68,1.64,2.24,2.24,2.41.16.05.33.07.48.07s.3-.02.43-.06c.96-.02,1.81-.42,2.4-1.13l.08-.11c.29-.49.58-1.02.58-1.72,0-.46-.1-.92-.37-1.58-2.84-5.49-6.96-10.3-12.24-14.29Z",
  "m289.96,55.02c-.18-.18-.49-.37-.8-.42-.45-.12-.77.05-.93.16-.22.16-.48.47-.48,1.06v.35l.06.15c1.99,5.03,3.37,10.34,4.22,16.24.3,2.19,1.36,3.3,3.2,3.3h.02c1.19,0,2.96-.94,2.96-2.96l-.11-.71c-1.19-6.16-3.91-11.91-8.08-17.1l-.06-.07Z",
  "m531.93,54.18c-1.13-.02-2.4,2.05-1.97,3.72.21.8.91,1.92,1.92,1.92,1.01,0,1.71-1.13,1.92-1.92.44-1.65-.74-3.71-1.86-3.72Z",
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function App() {
  const [progress, setProgress]       = useState(0);
  const [phase, setPhase]             = useState("load"); // load → out → done
  const [activeCategory, setActiveCategory] = useState("精選推薦");
  const [cart, setCart]               = useState({});
  const [cartOpen, setCartOpen]       = useState(false);
  const [checkout, setCheckout]       = useState(false);
  const [orderDone, setOrderDone]     = useState(false);
  const [form, setForm]               = useState({ name:"",phone:"",address:"",note:"",payment:"credit" });
  const [cursor, setCursor]           = useState({ x:-200, y:-200, big:false });
  const [heroVis, setHeroVis]         = useState(false);

  const [heroRef, heroInView]   = useInView(0.1);
  const [menuRef, menuInView]   = useInView(0.1);

  /* preloader */
  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 5 + 2;
      if (p >= 100) { p = 100; clearInterval(t); }
      setProgress(Math.round(p));
    }, 50);
    setTimeout(() => setPhase("out"),  2800);
    setTimeout(() => { setPhase("done"); setHeroVis(true); }, 3900);
  }, []);

  /* cursor */
  useEffect(() => {
    const fn = e => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY }));
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const big  = () => setCursor(c => ({ ...c, big: true  }));
  const small= () => setCursor(c => ({ ...c, big: false }));

  const addItem    = item => setCart(p => ({ ...p, [item.id]: { ...item, qty: (p[item.id]?.qty||0)+1 } }));
  const removeItem = id   => setCart(p => {
    const u = {...p};
    if (u[id].qty<=1) delete u[id]; else u[id]={...u[id],qty:u[id].qty-1};
    return u;
  });
  const cartItems  = Object.values(cart);
  const totalQty   = cartItems.reduce((s,i)=>s+i.qty,0);
  const totalPrice = cartItems.reduce((s,i)=>s+i.price*i.qty,0);

  return (
    <div style={{background:CREAM,minHeight:"100vh",color:DARK,fontFamily:"'Cormorant Garamond',Georgia,serif",overflow:phase!=="done"?"hidden":"auto"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      *{cursor:none!important;}
      ::selection{background:${DARK}18;}
      ::-webkit-scrollbar{width:1px;}
      ::-webkit-scrollbar-thumb{background:${DARK}33;}

      /* ── PRELOADER ────────────────────────────── */
      .preloader{
        position:fixed;inset:0;z-index:9000;
        background:${CREAM};
        display:grid;place-items:center;
        transition:clip-path 1.1s cubic-bezier(0.76,0,0.24,1);
        clip-path:inset(0 0 0% 0);
      }
      .preloader.out{ clip-path:inset(0 0 100% 0); }

      /* logo draw */
      .logo-path{
        fill:none;
        stroke:${DARK};
        stroke-width:0.8;
        stroke-dasharray:2000;
        stroke-dashoffset:2000;
        transition:stroke-dashoffset 2s ease;
      }
      .logo-path.draw{ stroke-dashoffset:0; }

      /* counter corners */
      .pre-corner{
        position:absolute;
        font-family:'Jost';font-size:13px;letter-spacing:2px;color:${DARK}66;
      }

      /* ── NAV ──────────────────────────────────── */
      .nav-btn{
        font-family:'Jost';font-size:10px;letter-spacing:3px;text-transform:uppercase;
        background:none;border:none;color:${DARK}77;transition:color .3s;padding:0;
      }
      .nav-btn:hover{color:${DARK};}

      /* ── HERO REVEALS ─────────────────────────── */
      .hero-line{
        overflow:hidden;
      }
      .hero-line-inner{
        display:block;
        transform:translateY(110%);
        transition:transform 1.1s cubic-bezier(0.16,1,0.3,1);
      }
      .hero-line-inner.up{ transform:translateY(0); }

      /* ── CATEGORY ─────────────────────────────── */
      .cat{
        font-family:'Jost';font-size:10px;letter-spacing:4px;text-transform:uppercase;
        background:none;border:none;color:${DARK}44;padding:10px 0;
        border-bottom:1px solid transparent;transition:all .3s;
      }
      .cat:hover{color:${DARK}88;}
      .cat.on{color:${DARK};border-bottom:1px solid ${DARK}33;}

      /* ── PRODUCT IMAGE CARD ───────────────────── */
      .prod-card{
        overflow:hidden;position:relative;
        opacity:0;transform:translateY(40px);
        transition:opacity .8s ease, transform .8s cubic-bezier(0.16,1,0.3,1);
      }
      .prod-card.show{opacity:1;transform:translateY(0);}
      .prod-img{
        width:100%;aspect-ratio:3/4;
        display:flex;align-items:center;justify-content:center;
        font-size:64px;
        transition:transform .6s cubic-bezier(0.16,1,0.3,1);
        position:relative;overflow:hidden;
      }
      .prod-card:hover .prod-img{transform:scale(1.04);}
      .prod-img::after{
        content:'';position:absolute;inset:0;
        background:linear-gradient(to top,${DARK}55 0%,transparent 50%);
      }

      /* ── ADD BTN ──────────────────────────────── */
      .add{
        font-family:'Jost';font-size:9px;letter-spacing:3px;text-transform:uppercase;
        background:transparent;border:1px solid ${DARK}22;color:${DARK}55;
        padding:7px 16px;transition:all .25s;
      }
      .add:hover,.add.on{background:${DARK};color:${CREAM};border-color:${DARK};}

      /* ── CART ─────────────────────────────────── */
      .cart-panel{
        position:fixed;top:0;right:0;width:400px;height:100vh;
        background:${CREAM};border-left:1px solid ${DARK}0a;
        z-index:600;transform:translateX(100%);
        transition:transform .75s cubic-bezier(0.76,0,0.24,1);
        display:flex;flex-direction:column;
      }
      .cart-panel.open{transform:translateX(0);}
      .overlay{
        position:fixed;inset:0;background:${DARK}44;backdrop-filter:blur(2px);
        z-index:500;opacity:0;pointer-events:none;transition:opacity .4s;
      }
      .overlay.on{opacity:1;pointer-events:all;}

      /* ── MODAL ────────────────────────────────── */
      .modal-bg{
        position:fixed;inset:0;background:${DARK}55;backdrop-filter:blur(6px);
        z-index:700;display:flex;align-items:center;justify-content:center;padding:20px;
      }
      .modal{
        background:${CREAM};border:1px solid ${DARK}0a;
        width:100%;max-width:460px;max-height:90vh;overflow-y:auto;
      }
      input,textarea{
        background:transparent;border:none;border-bottom:1px solid ${DARK}15;
        color:${DARK};font-family:'Jost';font-size:13px;letter-spacing:1px;
        padding:12px 0;width:100%;outline:none;transition:border-color .3s;
      }
      input:focus,textarea:focus{border-bottom-color:${DARK};}
      input::placeholder,textarea::placeholder{color:${DARK}33;font-size:11px;letter-spacing:2px;}
      textarea{resize:none;}
      .pay-opt{border:1px solid ${DARK}10;padding:12px 8px;text-align:center;transition:all .25s;}
      .pay-opt.on{border-color:${DARK}44;background:${DARK}06;}
      .submit{
        width:100%;background:${DARK};color:${CREAM};border:none;
        font-family:'Jost';font-size:10px;letter-spacing:4px;text-transform:uppercase;
        padding:17px;transition:all .3s;
      }
      .submit:hover:not(:disabled){background:#444;}
      .submit:disabled{background:${DARK}11;color:${DARK}33;}

      @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
      .fade-up{animation:fadeUp .6s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}
    `}</style>

    {/* ── CURSOR ── */}
    <div style={{
      position:"fixed",left:cursor.x,top:cursor.y,zIndex:99999,pointerEvents:"none",
      transform:"translate(-50%,-50%)",
      width:cursor.big?40:7,height:cursor.big?40:7,borderRadius:"50%",
      border:`1px solid ${DARK}${cursor.big?"77":""}`,
      background:cursor.big?`${DARK}0d`:DARK,
      transition:"width .3s,height .3s,background .3s",
      mixBlendMode:"multiply",
    }}/>

    {/* ══════════ PRELOADER ══════════ */}
    <div className={`preloader${phase==="out"||phase==="done"?" out":""}`}>
      {/* counter bottom-left */}
      <div className="pre-corner" style={{bottom:40,left:48}}>
        <span style={{fontFamily:"'Cormorant Garamond'",fontSize:18,fontWeight:300}}>{String(progress).padStart(2,"0")}</span>
      </div>
      {/* % bottom-right */}
      <div className="pre-corner" style={{bottom:40,right:48,fontStyle:"italic",fontFamily:"'Cormorant Garamond'",fontSize:18}}>
        %
      </div>
      {/* progress line top */}
      <div style={{position:"absolute",top:0,left:0,height:"1px",background:DARK,width:`${progress}%`,transition:"width .1s linear"}}/>
      {/* centered logo */}
      <div style={{width:"min(72vw,520px)",padding:"0 20px"}}>
        <svg viewBox="0 0 772.33 100.02" style={{width:"100%",height:"auto",display:"block"}}>
          {LOGO_PATHS.map((d,i)=>(
            <path key={i} d={d}
              className={`logo-path${phase!=="load"||progress>10?" draw":""}`}
              style={{transitionDelay:`${i*0.06}s`}}
            />
          ))}
        </svg>
      </div>
      {/* tagline */}
      <div style={{
        position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",
        fontFamily:"'Jost'",fontSize:9,letterSpacing:6,color:`${DARK}44`,
        textTransform:"uppercase",whiteSpace:"nowrap",
      }}>
        台中 · Est. 2010
      </div>
    </div>

    {/* ══════════ NAV ══════════ */}
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:400,
      height:60,padding:"0 48px",background:CREAM,
      borderBottom:`1px solid ${DARK}08`,
      display:"flex",alignItems:"center",justifyContent:"space-between",
    }}>
      <div style={{fontFamily:"'Cormorant Garamond'",fontSize:19,fontWeight:300,letterSpacing:5}}>
        味鮮<em style={{fontStyle:"italic",color:`${DARK}55`}}>小館</em>
      </div>
      <div style={{display:"flex",gap:36,alignItems:"center"}}>
        <span style={{fontFamily:"'Jost'",fontSize:10,letterSpacing:3,color:`${DARK}44`}}>台中 · 11:00–21:00</span>
        <button className="nav-btn" onClick={()=>setCartOpen(true)} onMouseEnter={big} onMouseLeave={small}>
          Order{totalQty>0&&<em style={{fontStyle:"italic",marginLeft:4}}>({totalQty})</em>}
        </button>
      </div>
    </nav>

    {/* ══════════ HERO ══════════ */}
    <div style={{
      height:"100vh",display:"flex",flexDirection:"column",
      justifyContent:"flex-end",padding:"0 48px 60px",
      borderBottom:`1px solid ${DARK}0a`,position:"relative",
    }}>
      {/* bg gradient */}
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(ellipse 50% 60% at 65% 35%,${DARK}06 0%,transparent 60%)`}}/>

      {/* floating date tag */}
      <div style={{
        position:"absolute",top:80,right:48,
        fontFamily:"'Jost'",fontSize:9,letterSpacing:5,color:`${DARK}44`,
        textTransform:"uppercase",
        opacity:heroVis?1:0,transition:"opacity 1.2s .9s",
      }}>Since 2010</div>

      {/* headline - line-by-line reveal */}
      <div style={{position:"relative",zIndex:1,marginBottom:40}}>
        {["道地","台灣","好味道"].map((line,i)=>(
          <div key={i} className="hero-line">
            <span className={`hero-line-inner${heroVis?" up":""}`}
              style={{
                transitionDelay:`${0.1+i*0.18}s`,
                fontSize:"clamp(60px,10vw,130px)",
                fontWeight:300,lineHeight:0.9,letterSpacing:-3,
                display:"block",
                fontStyle:i===1?"italic":"normal",
                color:i===1?`${DARK}55`:DARK,
              }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* sub + CTA */}
      <div style={{
        display:"flex",alignItems:"center",gap:40,
        opacity:heroVis?1:0,
        transform:heroVis?"translateY(0)":"translateY(20px)",
        transition:"all .9s cubic-bezier(0.16,1,0.3,1) .7s",
      }}>
        <button className="add on" onClick={()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"})}
          onMouseEnter={big} onMouseLeave={small}
          style={{padding:"12px 36px",fontSize:10,letterSpacing:4}}>
          探索菜單
        </button>
        <span style={{fontFamily:"'Jost'",fontSize:11,color:`${DARK}44`,letterSpacing:1}}>
          外送 30–45 分鐘 · NT$30
        </span>
      </div>

      {/* scroll line */}
      <div style={{
        position:"absolute",bottom:60,left:"50%",transform:"translateX(-50%)",
        opacity:heroVis?1:0,transition:"opacity 1s 1.2s",
      }}>
        <div style={{width:1,height:52,background:`linear-gradient(to bottom,${DARK},transparent)`,margin:"0 auto"}}/>
      </div>

      {/* rating */}
