(function(){
  const feed = document.getElementById('postFeed');
  const posts = JSON.parse(localStorage.getItem(Starducks.LS.posts)||'[]')
    .sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
  const users = Starducks.getUsers();

  function renderPost(p){
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
      <div class="actions">
        <form class="inline-form comment-form" data-id="${p.id}">
          <input name="text" placeholder="Comment…" maxlength="200">
          <button class="btn ghost">Post</button>
        </form>
      </div>
      <div class="comments" id="c-${p.id}">
        ${(p.comments||[]).map(c=>{
          const u = users.find(x=>x.id===c.userId);
          return `<div class="tiny muted">${u?.name||'User'}: ${c.text}</div>`;
        }).join('')}
      </div>
    </article>`;
  }

  feed.innerHTML = posts.length? posts.map(renderPost).join('') : `<p class="muted">No posts yet.</p>`;

  feed.addEventListener('click', (e)=>{
    const flightBtn = e.target.closest('[data-action="flight"]');
    const postEl = e.target.closest('.post');
    if(flightBtn && postEl){
      const id = postEl.dataset.id;
      const me = Starducks.me();
      if(!me) return alert('Sign in to Flight this post.');
      let posts = JSON.parse(localStorage.getItem(Starducks.LS.posts)||'[]');
      const p = posts.find(x=>x.id===id);
      if(!p._flighters) p._flighters = [];
      if(p._flighters.includes(me.id)) return;
      p._flighters.push(me.id);
      p.flights = (p.flights||0)+1;
      localStorage.setItem(Starducks.LS.posts, JSON.stringify(posts));
      postEl.querySelector('.count').textContent = p.flights;
    }
  });

  feed.addEventListener('submit', (e)=>{
    const form = e.target.closest('.comment-form'); if(!form) return;
    e.preventDefault();
    const me = Starducks.me(); if(!me) return alert('Sign in to comment.');
    const id = form.dataset.id;
    const text = new FormData(form).get('text').toString().trim();
    if(!text) return;
    let posts = JSON.parse(localStorage.getItem(Starducks.LS.posts)||'[]');
    const p = posts.find(x=>x.id===id);
    p.comments = p.comments||[];
    p.comments.push({userId: me.id, text, at:new Date().toISOString()});
    localStorage.setItem(Starducks.LS.posts, JSON.stringify(posts));
    const list = document.getElementById('c-'+id);
    const users = Starducks.getUsers();
    const u = users.find(x=>x.id===me.id);
    list.insertAdjacentHTML('beforeend', `<div class="tiny muted">${u?.name||'User'}: ${text}</div>`);
    form.reset();
  });
})();