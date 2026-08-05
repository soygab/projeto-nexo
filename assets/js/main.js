
function goToApp(){
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
}

function switchLoginTab(tab){
  const tabs=document.querySelectorAll('.login-tab');
  tabs.forEach((t,i)=>{t.classList.toggle('active',i===(tab==='login'?0:1))});
  document.getElementById('login-panel').style.display=tab==='login'?'block':'none';
  document.getElementById('register-panel').style.display=tab==='register'?'block':'none';
}

function showPage(page){
  document.querySelectorAll('.page-panel').forEach(p=>p.classList.remove('active'));
  const target=document.getElementById('page-'+page);
  if(target){target.classList.add('active')}
  document.querySelectorAll('.sidebar .nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.sidebar .nav-item').forEach(n=>{
    const onclick = n.getAttribute('onclick')||'';
    if(onclick.includes("'"+page+"'") || onclick.includes('"'+page+'"')){
      n.classList.add('active');
    }
  });
}

function openModal(id){document.getElementById(id).classList.add('active')}
function closeModal(id){document.getElementById(id).classList.remove('active')}

function switchTab(el){
  const siblings=el.parentElement.querySelectorAll('.tab');
  siblings.forEach(s=>s.classList.remove('active'));
  el.classList.add('active');
}

document.querySelectorAll('.modal-overlay').forEach(o=>{
  o.addEventListener('click',function(e){if(e.target===this)this.classList.remove('active')});
});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){document.querySelectorAll('.modal-overlay.active').forEach(m=>m.classList.remove('active'))}
});
