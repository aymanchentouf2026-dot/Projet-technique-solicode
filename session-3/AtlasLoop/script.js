const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const toast = $("#toast");
let toastTimer;
function notify(text){toast.textContent=text;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),3200);}
const nav=$("#nav"), menuBtn=$("#menuBtn");
menuBtn.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));menuBtn.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';});
$$("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
function openModal(id){const el=$("#"+id);if(el){el.classList.remove("hidden");document.body.style.overflow="hidden";}}
function closeModal(el){el.classList.add("hidden");if(!$(".backdrop:not(.hidden)"))document.body.style.overflow="";}
$$("[data-modal]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.modal)));
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.closest(".backdrop"))));
$$(".backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)closeModal(b);}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".backdrop:not(.hidden)").forEach(closeModal);});

let activeFilter="all";
function refreshLoads(){
 const from=($("#from").value||"").trim().toLocaleLowerCase("fr"),to=($("#to").value||"").trim().toLocaleLowerCase("fr");
 let count=0;
 $$(".load").forEach(card=>{
   const okFrom=!from||card.dataset.from.toLocaleLowerCase("fr").includes(from);
   const okTo=!to||card.dataset.to.toLocaleLowerCase("fr").includes(to);
   const okType=activeFilter==="all"||card.dataset.type===activeFilter;
   const visible=okFrom&&okTo&&okType;card.classList.toggle("hidden",!visible);if(visible)count++;
 });
 $("#count").textContent=count+" demande"+(count>1?"s":"");
 $("#empty").classList.toggle("hidden",count>0);
 return count;
}
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();const n=refreshLoads();$("#searchMsg").textContent=n+" résultat"+(n>1?"s":"")+" dans les demandes de démonstration.";$("#loads").scrollIntoView({behavior:"smooth"});});
$$("[data-filter]").forEach(b=>b.addEventListener("click",()=>{$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));activeFilter=b.dataset.filter;refreshLoads();}));
$$(".offer").forEach(b=>b.addEventListener("click",()=>{$("#offerId").value=b.dataset.id;$("#offerRef").textContent=b.dataset.id;$("#offerMsg").textContent="";openModal("offer");}));
$("#requestForm").addEventListener("submit",e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));$("#requestMsg").textContent=`Demande préparée : ${d.from} → ${d.to}. Elle n'a pas été envoyée à un serveur.`;notify("Formulaire validé en mode démonstration.");e.currentTarget.reset();});
$("#offerForm").addEventListener("submit",e=>{e.preventDefault();const d=new FormData(e.currentTarget);$("#offerMsg").textContent=`Offre de ${Number(d.get("price")).toLocaleString("fr-FR")} MAD préparée pour ${$("#offerId").value}. Elle n'a pas été envoyée à un serveur.`;notify("Offre validée en mode démonstration.");});
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();$("#loginMsg").textContent="La connexion réelle nécessite un backend et une base de données. Ce formulaire est une démonstration.";});
$("#registerForm").addEventListener("submit",e=>{e.preventDefault();const d=new FormData(e.currentTarget);$("#registerMsg").textContent=`Formulaire vérifié pour « ${d.get("role")} ». La création du compte nécessite un backend.`;});
$$(".contact").forEach(b=>b.addEventListener("click",()=>notify("La messagerie de "+b.dataset.name+" sera disponible après connexion du backend.")));
$("#year").textContent=new Date().getFullYear();
const now=new Date(),today=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
$("#date").min=today;const reqDate=$('#requestForm input[name="date"]');if(reqDate)reqDate.min=today;
