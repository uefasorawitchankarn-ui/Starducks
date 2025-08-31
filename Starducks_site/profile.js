(function(){
  const me = Starducks.ensureSignedIn();
  const form = document.getElementById('profileForm');
  const select = document.getElementById('countrySelect');
  const avatar = document.getElementById('avatarPreview');
  const fileInput = document.getElementById('avatarInput');

  // countries
  Starducks.countries().forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = `${c.flag} ${c.name}`;
    select.appendChild(opt);
  });

  // fill existing
  form.name.value = me.name||'';
  if(me.country){
    select.value = me.country;
    avatar.style.backgroundImage = me.photo ? `url('${me.photo}')` : '';
  }

  fileInput.addEventListener('change', ()=>{
    const f = fileInput.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      avatar.style.backgroundImage = `url('${reader.result}')`;
      form.dataset.photo = reader.result;
    };
    reader.readAsDataURL(f);
  });

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const users = Starducks.getUsers();
    const u = users.find(x=>x.id===me.id);
    u.name = form.name.value.trim() || u.name;
    const code = select.value;
    const country = Starducks.countries().find(c=>c.code===code);
    u.country = country?.name || '';
    u.flag = country?.flag || '';
    if(form.dataset.photo) u.photo = form.dataset.photo;
    Starducks.saveUsers(users);
    alert('Saved.');
    location.href='index.html';
  });
})();