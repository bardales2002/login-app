document.querySelector('form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const url = location.pathname.includes('register') ? '/api/register' : '/api/login';
  const body = Object.fromEntries(new FormData(e.target));
  const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(r.ok) location.href='dashboard.html';
  else alert((await r.json()).msg);
});
