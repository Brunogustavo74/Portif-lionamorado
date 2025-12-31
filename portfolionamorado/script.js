// script.js - Interações: scroll suave, animações de skills e modal

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href=a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(!el) return;
      // compensate for sticky header using CSS variable --header-offset
      const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 78;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// View CV button scrolls to experiência and triggers subtle reveal
const viewCv=document.getElementById('view-cv');
if(viewCv){
  viewCv.addEventListener('click', ()=>{
    document.getElementById('exp').scrollIntoView({behavior:'smooth'});
  });
}

// Modal logic for CTA
const schedule=document.getElementById('schedule');
const modal=document.getElementById('modal');
const closeModal=document.getElementById('close-modal');

function openModal(){
  modal.setAttribute('aria-hidden','false');
}
function hideModal(){
  modal.setAttribute('aria-hidden','true');
}
if(schedule){schedule.addEventListener('click', ()=>{
  // small charming delay
  setTimeout(openModal, 120);
});}
if(closeModal){closeModal.addEventListener('click', hideModal);} 

// Close modal on outside click
modal.addEventListener('click', (e)=>{ if(e.target===modal) hideModal(); });

// Reveal elements on scroll (fade-up)
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.12});

document.querySelectorAll('.fade-up').forEach(el=>observer.observe(el));

// Animate skill bars when visible
const skillObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.bar').forEach(b=>{
        const v = parseInt(b.getAttribute('data-value')||'0',10);
        b.style.setProperty('--w', v + '%');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.18});

// Observe skill containers (cards, lists) and tech lists added to projects
const skillContainers = document.querySelectorAll('.skills-grid, .skill-list, .card, .tech-list');
skillContainers.forEach(sc=>skillObserver.observe(sc));

// Ensure modal close with Escape
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hideModal(); });

// Small enhancement: add fade-up class to key blocks for reveal
['.hero-text','.hero-card','.card','.exp-item','.diff-card','.project','.cta'].forEach(sel=>{
  document.querySelectorAll(sel).forEach(el=>el.classList.add('fade-up'));
});

// Ensure observer watches newly-added fade-up elements (fix for disappearing elements)
document.querySelectorAll('.fade-up').forEach(el=>observer.observe(el));

// Accessibility: focus trap minimal (move focus to modal when opened)
schedule && schedule.addEventListener('click', ()=>{ setTimeout(()=>{ modal.querySelector('.modal-content a, .modal-content button')?.focus(); },200); });

// End of script
