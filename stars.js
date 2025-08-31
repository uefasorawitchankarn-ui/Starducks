(function(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h, dpr;
  let stars = [];
  const STAR_COUNT = 800; // lots of stars
  function resize(){
    dpr = Math.max(1, window.devicePixelRatio||1);
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  function init(){
    stars = [];
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        z: Math.random()*1 + 0.2, // parallax depth
        r: Math.random()*1.2 + 0.2,
        vx: (Math.random()-.5)*0.02,
        vy: (Math.random()-.5)*0.02
      });
    }
  }
  init();

  function step(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#fff';
    for(const s of stars){
      s.x += s.vx * (1/s.z);
      s.y += s.vy * (1/s.z);
      if(s.x<0) s.x+=w; if(s.x>w) s.x-=w;
      if(s.y<0) s.y+=h; if(s.y>h) s.y-=h;
      ctx.globalAlpha = Math.min(1, 0.6 + (1-s.z)*0.8);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  step();
})();