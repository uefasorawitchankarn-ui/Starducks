(function(){
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  signupForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(signupForm);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim().toLowerCase();
    const pwd = (fd.get('password')||'').toString();
    if(!name || !email || pwd.length<6) return alert('Please fill all fields.');
    const users = Starducks.getUsers();
    if(users.some(u=>u.email===email)) return alert('Email already used.');
    const id = Starducks.uid();
    users.push({id, name, email, password: btoa(pwd), country:'', flag:'', photo:''});
    Starducks.saveUsers(users);
    Starducks.setSession({userId:id});
    Starducks.recordStat('signupsByDay');
    location.href='index.html';
  });

  loginForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(loginForm);
    const email = (fd.get('email')||'').toString().trim().toLowerCase();
    const pwd = (fd.get('password')||'').toString();
    const u = Starducks.getUsers().find(x=>x.email===email && x.password===btoa(pwd));
    if(!u) return alert('Invalid credentials.');
    Starducks.setSession({userId:u.id});
    location.href='index.html';
  });
})();