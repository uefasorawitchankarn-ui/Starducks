(function(){
  const box = document.getElementById('chatBox');
  const list = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  const key = 'starducks_chat';
  const msgs = JSON.parse(localStorage.getItem(key)||'[]');

  function render(){
    const users = Starducks.getUsers();
    list.innerHTML = msgs.map(m=>{
      const u = users.find(x=>x.id===m.userId);
      return `<div class="chat-msg">
        <div class="avatar" style="background-image:url('${u?.photo||''}')"></div>
        <div class="bubble"><strong>${u?.name||'User'}</strong><br>${m.text}</div>
      </div>`;
    }).join('');
    list.scrollTop = list.scrollHeight;
  }
  render();

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const me = Starducks.me(); if(!me) return alert('Sign in first.');
    const text = input.value.trim(); if(!text) return;
    msgs.push({id:Starducks.uid(), userId: me.id, text, at:new Date().toISOString()});
    localStorage.setItem(key, JSON.stringify(msgs));
    input.value='';
    render();
  });
})();