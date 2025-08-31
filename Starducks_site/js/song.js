(function(){
  const gate = document.getElementById('songGate');
  const wrap = document.getElementById('songFormWrap');

  document.getElementById('songCodeForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const code = new FormData(e.target).get('code');
    if(code==='2626'){
      gate.hidden = true; wrap.hidden = false;
    }else{
      alert('Incorrect code.');
    }
  });

  document.getElementById('songForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const url = new FormData(e.target).get('url').toString().trim();
    const vid = Starducks.videoIdFromUrl(url);
    if(!vid) return alert('Invalid YouTube URL.');
    localStorage.setItem(Starducks.LS.song, JSON.stringify({url, videoId:vid}));
    alert('Song saved! It will show on the homepage.');
    location.href='index.html';
  });
})();