// Shared utilities & storage
(function(){
  const LS = {
    users: 'starducks_users',
    session: 'starducks_session',
    devAccess: 'starducks_dev_access',
    posts: 'starducks_posts',
    song: 'starducks_song',
    stats: 'starducks_stats'
  };

  window.Starducks = {
    LS,
    getUsers(){ return JSON.parse(localStorage.getItem(LS.users)||'[]'); },
    saveUsers(arr){ localStorage.setItem(LS.users, JSON.stringify(arr)); },
    getSession(){ return JSON.parse(localStorage.getItem(LS.session)||'null'); },
    setSession(obj){ localStorage.setItem(LS.session, JSON.stringify(obj)); },
    signOut(){ localStorage.removeItem(LS.session); location.href='index.html'; },
    me(){
      const s = this.getSession(); if(!s) return null;
      return this.getUsers().find(u=>u.id===s.userId) || null;
    },
    ensureSignedIn(){
      const me = this.me();
      if(!me){ location.href='login.html'; throw new Error('not signed in'); }
      return me;
    },
    notify(subject, body){
      // Optional: Netlify Function endpoint
      fetch('/.netlify/functions/notify', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({subject, body})
      }).catch(()=>{});
    },
    uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); },
    fmtDate(iso){
      const d = new Date(iso);
      return d.toLocaleString(undefined, {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
    },
    videoIdFromUrl(url){
      try{
        const u = new URL(url);
        if(u.hostname.includes('youtu.be')) return u.pathname.slice(1);
        if(u.searchParams.get('v')) return u.searchParams.get('v');
        // shorts
        const parts = u.pathname.split('/');
        const idx = parts.indexOf('shorts');
        if(idx>=0) return parts[idx+1];
      }catch(e){}
      return null;
    },
    countries(){
      // simple subset
      return [
        {code:'US', name:'United States', flag:'🇺🇸'},
        {code:'TH', name:'Thailand', flag:'🇹🇭'},
        {code:'JP', name:'Japan', flag:'🇯🇵'},
        {code:'GB', name:'United Kingdom', flag:'🇬🇧'},
        {code:'KR', name:'Korea', flag:'🇰🇷'},
        {code:'FR', name:'France', flag:'🇫🇷'},
        {code:'DE', name:'Germany', flag:'🇩🇪'},
        {code:'VN', name:'Vietnam', flag:'🇻🇳'},
        {code:'ES', name:'Spain', flag:'🇪🇸'},
        {code:'IT', name:'Italy', flag:'🇮🇹'}
      ];
    },
    recordStat(key){
      const today = new Date().toISOString().slice(0,10);
      const stats = JSON.parse(localStorage.getItem(LS.stats)||'{}');
      stats[key] = stats[key] || {};
      stats[key][today] = (stats[key][today]||0) + 1;
      localStorage.setItem(LS.stats, JSON.stringify(stats));
    }
  };

  // track page view
  Starducks.recordStat('pageviewsByDay');

  // header join button effect (optional)
})();
