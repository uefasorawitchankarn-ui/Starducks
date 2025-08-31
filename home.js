(function(){
  // Song tile
  const tile = document.getElementById('songTile');
  if(tile){
    const song = JSON.parse(localStorage.getItem(Starducks.LS.song)||'null');
    if(song && song.videoId){
      const thumb = document.getElementById('songThumb');
      thumb.style.backgroundImage = `url(https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg)`;
      tile.addEventListener('click', ()=>{
        window.open(song.url, '_blank', 'noopener');
      });
    }else{
      tile.addEventListener('click', ()=>{
        alert('No song set yet.');
      });
    }
  }

  // World clocks
  const grid = document.getElementById('clockGrid');
  if(grid){
    const cities = JSON.parse(grid.dataset.cities);
    grid.innerHTML = cities.map((c,i)=>`
      <div class="clock" data-tz="${c.tz}">
        <div class="name">${c.name}</div>
        <div class="time" id="time-${i}">--:--</div>
        <div class="date" id="date-${i}"></div>
      </div>
    `).join('');
    function tick(){
      cities.forEach((c,i)=>{
        const d = new Date();
        const time = new Intl.DateTimeFormat([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone:c.tz}).format(d);
        const date = new Intl.DateTimeFormat([], {weekday:'short', year:'numeric', month:'short', day:'numeric', timeZone:c.tz}).format(d);
        document.getElementById('time-'+i).textContent = time;
        document.getElementById('date-'+i).textContent = date;
      });
    }
    tick(); setInterval(tick, 1000);
  }

  // Crew showcase
  const listEl = document.getElementById('crewList');
  if(listEl){
    const devMap = JSON.parse(localStorage.getItem(Starducks.LS.devAccess)||'{}');
    const users = Starducks.getUsers().filter(u => devMap[u.id]);
    if(users.length){
      document.getElementById('crewShowcase').hidden = false;
      listEl.innerHTML = users.map(u=>{
        return `<div class="crew-card">
          <div class="avatar" style="background-image:url('${u.photo||''}')"></div>
          <div>
            <div class="name">${u.name} <span class="flag">${u.flag||''}</span></div>
            <div class="tiny muted">${u.country||''}</div>
          </div>
        </div>`;
      }).join('');
    }
  }

  // Feed preview
  const feed = document.getElementById('postFeed');
  if(feed){
    const posts = JSON.parse(localStorage.getItem(Starducks.LS.posts)||'[]')
      .sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
      .slice(0,5);
    feed.innerHTML = posts.length ? posts.map(p=> renderPost(p)).join('') : `<p class="muted">No posts yet.</p>`;
    feed.addEventListener('click', onFeedClick);
  }

  function renderPost(p){
    const users = Starducks.getUsers();
    const author = users.find(u=>u.id===p.authorId);
    return `<article class="post" data-id="${p.id}">
      <div class="post-head">
        <div class="author">
          <div class="avatar" style="background-image:url('${author?.photo||''}')"></div>
          <div>
            <div class="name">${author?.name||'Unknown'} <span class="flag">${author?.flag||''}</span></div>
            <div class="meta">${Starducks.fmtDate(p.createdAt)}</div>
          </div>
        </div>
        <div class="flight" data-action="flight">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 16l20-8-8 8-2 6-2-6-8-0z"/>
          </svg>
          <span class="count">${p.flights||0}</span>
        </div>
      </div>
      <div class="content">${p.title?`<h3>${p.title}</h3>`:''}${p.html||''}</div>
      <div class="comments">
        ${ (p.comments||[]).slice(-3).map(c=>{
          const u = users.find(x=>x.id===c.userId);
          return `<div class="tiny muted">${u?.name||'User'}: ${c.text}</div>`;
        }).join('')}
      </div>
    </article>`;
  }

  function onFeedClick(e){
    const flightBtn = e.target.closest('[data-action="flight"]');
    const postEl = e.target.closest('.post');
    if(flightBtn && postEl){
      const id = postEl.dataset.id;
      const me = Starducks.me();
      if(!me) return alert('Sign in to Flight this post.');
      let posts = JSON.parse(localStorage.getItem(Starducks.LS.posts)||'[]');
      const p = posts.find(x=>x.id===id);
      if(!p._flighters) p._flighters = [];
      if(p._flighters.includes(me.id)) return; // one flight per user
      p._flighters.push(me.id);
      p.flights = (p.flights||0)+1;
      localStorage.setItem(Starducks.LS.posts, JSON.stringify(posts));
      // update count
      flightBtn.querySelector('.count').textContent = p.flights;
    }
  }
})();