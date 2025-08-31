(function(){
  const me = Starducks.ensureSignedIn();
  const postGate = document.getElementById('postGate');
  const editorWrap = document.getElementById('postEditorWrap');

  const devMap = JSON.parse(localStorage.getItem(Starducks.LS.devAccess)||'{}');
  if(devMap[me.id]){
    postGate.hidden = true; editorWrap.hidden = false;
  }

  document.getElementById('postCodeForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const code = new FormData(e.target).get('code');
    if(code==='1207'){
      const map = JSON.parse(localStorage.getItem(Starducks.LS.devAccess)||'{}');
      map[me.id] = true;
      localStorage.setItem(Starducks.LS.devAccess, JSON.stringify(map));
      Starducks.notify('Crew code used (via post page)', `${me.name} (${me.email}) unlocked on post page.`);
      postGate.hidden = true; editorWrap.hidden = false;
    }else{
      alert('Incorrect code.');
    }
  });

  // Editor logic
  const editor = document.getElementById('postEditor');
  const titleEl = document.getElementById('postTitle');
  const addImageBtn = document.getElementById('addImageBtn');
  const imageUrl = document.getElementById('imageUrl');
  const uploadInput = document.getElementById('uploadImageInput');

  addImageBtn?.addEventListener('click', e=>{
    e.preventDefault();
    const url = imageUrl.value.trim();
    if(!url) return;
    editor.focus();
    document.execCommand('insertHTML', false, `<p><img src="${url}" alt=""></p>`);
    imageUrl.value='';
  });

  uploadInput?.addEventListener('change', e=>{
    const file = uploadInput.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.focus();
      document.execCommand('insertHTML', false, `<p><img src="${reader.result}" alt=""></p>`);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('publishBtn')?.addEventListener('click', ()=>{
    const html = editor.innerHTML.trim();
    if(!html) return alert('Write something first.');
    const posts = JSON.parse(localStorage.getItem(Starducks.LS.posts)||'[]');
    const post = {
      id: Starducks.uid(),
      authorId: me.id,
      title: titleEl.value.trim(),
      html,
      createdAt: new Date().toISOString(),
      flights: 0,
      comments: []
    };
    posts.push(post);
    localStorage.setItem(Starducks.LS.posts, JSON.stringify(posts));
    Starducks.recordStat('postsCreatedByDay');
    Starducks.notify('New post created', `${me.name} posted "${post.title||'(no title)'}"`);
    alert('Published!');
    location.href='feed.html';
  });
})();