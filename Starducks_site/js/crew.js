(function(){
  const me = Starducks.ensureSignedIn();
  const gate = document.getElementById('crewGate');
  const tools = document.getElementById('crewTools');
  const devMap = JSON.parse(localStorage.getItem(Starducks.LS.devAccess)||'{}');

  if(devMap[me.id]){
    gate.hidden = true; tools.hidden = false;
  }

  document.getElementById('crewCodeForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const code = new FormData(e.target).get('code');
    if(code==='1207'){
      const map = JSON.parse(localStorage.getItem(Starducks.LS.devAccess)||'{}');
      map[me.id] = true;
      localStorage.setItem(Starducks.LS.devAccess, JSON.stringify(map));
      Starducks.notify('Crew code used', `${me.name} (${me.email}) unlocked crew access.`);
      alert('Access granted. You are now Flight Crew.');
      gate.hidden = true; tools.hidden = false;
    }else{
      if(!me){ location.href='login.html'; return; }
      alert('Incorrect code.');
    }
  });
})();