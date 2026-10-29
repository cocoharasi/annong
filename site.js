/* ANNNONG ARCHIVE — GitHub Pages static blog engine (no build tools required). */
(() => {
  'use strict';
  const categoryList = [
    { id:'development', number:'01', en:'DEVELOPMENT', name:'개발', desc:'Python, 웹 개발, 자동화와 직접 구현한 프로젝트에서 배운 것을 기록합니다.' },
    { id:'ctf', number:'02', en:'CTF & WARGAME', name:'CTF / Wargame', desc:'문제의 조건, 접근법, 실패 원인과 풀이의 원리를 정리하는 공간입니다.' },
    { id:'bugbounty', number:'03', en:'BUG BOUNTY', name:'Bug Bounty', desc:'허가된 범위의 취약점 연구와 책임 있는 보안 테스트를 공부합니다.' },
    { id:'docs', number:'04', en:'TECHNICAL NOTES', name:'블로그 / 기술문서', desc:'환경 구축, 사용법, 설정 파일과 다시 따라 할 수 있는 가이드를 모읍니다.' },
    { id:'papers', number:'05', en:'PAPERS & CONFERENCES', name:'논문 / 컨퍼런스', desc:'연구 문제, 실험 설계, 논문 작성과 학술 발표의 과정을 기록합니다.' },
    { id:'growth', number:'06', en:'COMPETITIONS & CERTS', name:'공모전 / 자격증', desc:'자격증 학습과 공모전 도전을 준비하며 배운 내용들을 정리합니다.' }
  ];
  const categories = Object.fromEntries(categoryList.map(c => [c.id,c]));
  const raw = Array.isArray(window.ANNNONG_POSTS) ? window.ANNNONG_POSTS : [];
  const posts = raw.filter(p => p && typeof p.slug === 'string' && categories[p.category] && p.title && /^\d{4}-\d\d-\d\d$/.test(p.date)).sort((a,b) => b.date.localeCompare(a.date));
  const views = ['home','archive','category','post','about','notfound'];
  const pageTitle = 'ANNNONG ARCHIVE — The Unknown, Documented.';
  const baseDesc = '보안·개발·연구의 단서를 모으는 개인 아카이브. CTF, Bug Bounty, 논문과 자격증 학습 기록.';
  const state = { filter:'all', query:'' };
  const $ = selector => document.querySelector(selector);
  const escapeHTML = input => String(input ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad = n => String(n).padStart(2,'0');
  const formatDate = d => d.replace(/-/g,'.');
  const getCount = id => posts.filter(p => p.category === id).length;
  const readMins = p => Math.max(1,Math.ceil(String(p.body||'').length/700));

  function renderInline(source) {
    const codes = [];
    let html = escapeHTML(source);
    html = html.replace(/`([^`]+)`/g,(_,val) => { codes.push('<code>'+val+'</code>'); return '@@INLINE_CODE_'+(codes.length-1)+'@@'; });
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,(_,label,url) => '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a>');
    html = html.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
    return html.replace(/@@INLINE_CODE_(\d+)@@/g,(_,n)=>codes[Number(n)]||'');
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown||'').replace(/\r\n?/g,'\n').split('\n');
    const result = [];
    let i = 0;
    const isList = s => /^\s*(?:[-*] |\d+\. )/.test(s);
    const isBlock = s => /^\s*(?:#{1,4} |```|> |---\s*$)/.test(s) || isList(s);
    const cells = line => line.trim().replace(/^\||\|$/g,'').split('|').map(x => x.trim());
    while(i < lines.length) {
      const line = lines[i];
      if(!line.trim()){ i++; continue; }
      const fence = line.match(/^\s*```([^`]*)$/);
      if(fence) {
        const lang = fence[1].trim().replace(/[^\w-]/g,''); const code=[]; i++;
        while(i<lines.length && !/^\s*```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
        if(i<lines.length)i++;
        result.push('<pre><code'+(lang?' class="language-'+lang+'"':'')+'>'+escapeHTML(code.join('\n'))+'</code></pre>');
        continue;
      }
      const h = line.match(/^(#{1,4})\s+(.+)$/);
      if(h){const lvl = Math.min(4,h[1].length+1); result.push('<h'+lvl+'>'+renderInline(h[2])+'</h'+lvl+'>'); i++; continue;}
      if(/^\s*---\s*$/.test(line)){result.push('<hr>'); i++; continue;}
      if(/^\s*> ?/.test(line)){
        const parts=[]; while(i<lines.length && /^\s*> ?/.test(lines[i]))parts.push(lines[i++].replace(/^\s*> ?/,''));
        result.push('<blockquote><p>'+renderInline(parts.join(' '))+'</p></blockquote>'); continue;
      }
      if(line.includes('|') && i+1<lines.length && /^\s*\|?[\s:|\-]+\|?\s*$/.test(lines[i+1]) && lines[i+1].includes('-')){
        const heads=cells(line); i+=2;const rows=[];
        while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){rows.push(cells(lines[i]));i++;}
        result.push('<div class="table-overflow"><table><thead><tr>'+heads.map(c=>'<th>'+renderInline(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+heads.map((_,j)=>'<td>'+renderInline(row[j]||'')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');
        continue;
      }
      if(isList(line)){
        const ordered=/^\s*\d+\. /.test(line); const tag=ordered?'ol':'ul'; const list=[];
        while(i<lines.length&&isList(lines[i])){list.push(lines[i++].replace(/^\s*(?:[-*] |\d+\. )/,''));}
        result.push('<'+tag+'>'+list.map(v=>'<li>'+renderInline(v)+'</li>').join('')+'</'+tag+'>');
        continue;
      }
      const paragraph=[line.trim()];i++;
      while(i<lines.length && lines[i].trim() && !isBlock(lines[i]) && !(lines[i].includes('|') && i+1<lines.length && /^\s*\|?[\s:|\-]+\|?\s*$/.test(lines[i+1]))) paragraph.push(lines[i++].trim());
      result.push('<p>'+renderInline(paragraph.join(' '))+'</p>');
    }
    return result.join('\n');
  }

  function postRow(post, index) {
    const cat = categories[post.category];
    return '<a class="post-row" href="#/post/'+encodeURIComponent(post.slug)+'" aria-label="'+escapeHTML(post.title)+' 글 열기">'
      +'<span class="post-index"><b>'+escapeHTML(cat.name)+'</b>'+escapeHTML(formatDate(post.date))+'</span>'
      +'<span class="post-main"><h3>'+escapeHTML(post.title)+'</h3><p>'+escapeHTML(post.excerpt)+'</p></span>'
      +'<span class="post-arrow" aria-hidden="true">↗</span></a>';
  }
  function drawHome() {
    document.querySelectorAll('[data-count]').forEach(el => {el.textContent=pad(getCount(el.dataset.count));});
    const root=$('#latest-posts');
    root.innerHTML=posts.length?posts.slice(0,4).map(postRow).join(''):'<p class="empty-state">아직 기록된 게시글이 없습니다.</p>';
  }
  function drawFilters() {
    const options=[{id:'all',name:'전체 기록',count:posts.length},...categoryList.map(c=>({...c,count:getCount(c.id)}))];
    $('#category-filters').innerHTML=options.map(c=>'<button type="button" class="filter-btn" data-filter="'+c.id+'" aria-pressed="'+(state.filter===c.id?'true':'false')+'">'+escapeHTML(c.name)+' <span aria-hidden="true">'+pad(c.count)+'</span></button>').join('');
  }
  function drawArchive() {
    drawFilters();
    const q=state.query.trim().toLocaleLowerCase('ko-KR');
    const filtered=posts.filter(p=>{
      if(state.filter!=='all'&&p.category!==state.filter) return false;
      const search=[p.title,p.excerpt,(p.tags||[]).join(' '),categories[p.category].name,p.body||''].join(' ').toLocaleLowerCase('ko-KR');
      return !q||search.includes(q);
    });
    $('#archive-count').textContent=pad(filtered.length)+' / '+pad(posts.length)+' ENTRIES';
    $('#archive-posts').innerHTML=filtered.map(postRow).join('');
    $('#archive-empty').hidden=filtered.length>0;
  }
  function drawCategory(id) {
    const c=categories[id];if(!c)return false;
    const selected=posts.filter(p=>p.category===id);
    $('#category-breadcrumb').textContent=c.number+' / '+c.en;
    $('#category-kicker').textContent='FILE NO. '+c.number+' / '+c.en;
    $('#category-title').textContent=c.name;
    $('#category-description').textContent=c.desc;
    $('#category-count').textContent=pad(selected.length);
    $('#category-posts').innerHTML=selected.map(postRow).join('');
    $('#category-empty').hidden=selected.length>0;
    return true;
  }
  function drawPost(slug) {
    const p=posts.find(post=>post.slug===slug);if(!p)return false;
    const cat=categories[p.category];
    $('#post-breadcrumb').textContent='ROOT / '+cat.en+' / '+p.slug.toUpperCase();
    $('#post-kicker').textContent=(p.type||'FIELD NOTE')+' / FILE '+cat.number;
    $('#post-title').textContent=p.title;
    $('#post-subtitle').textContent=p.excerpt;
    $('#post-meta').innerHTML='<span>'+escapeHTML(formatDate(p.date))+'</span><span>'+escapeHTML(cat.name)+'</span><span>약 '+readMins(p)+'분 읽기</span>';
    $('#post-content').innerHTML=renderMarkdown(p.body);
    $('#post-aside').innerHTML='<div class="aside-item"><small>CLASSIFICATION</small><span>'+escapeHTML(cat.name)+'</span></div>'
      +'<div class="aside-item"><small>RECORDED</small><span>'+escapeHTML(formatDate(p.date))+'</span></div>'
      +'<div class="aside-item"><small>DOCUMENT TYPE</small><span>'+escapeHTML(p.type||'FIELD NOTE')+'</span></div>'
      +'<div class="aside-item"><small>KEYWORDS</small><div class="aside-tags">'+(p.tags||[]).map(tag=>'<span>'+escapeHTML(tag)+'</span>').join('')+'</div></div>';
    $('#copy-link').textContent='기록 링크 복사 ↗';
    return true;
  }
  function setMetadata(title, description) {
    document.title=title===null?pageTitle:title+' — ANNNONG ARCHIVE';
    const desc=document.querySelector('meta[name="description"]');if(desc)desc.setAttribute('content',description||baseDesc);
  }
  function toggleMenu(open) {
    const menu=$('#site-nav');const button=$('#menu-toggle');
    menu.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');
  }
  function navigate() {
    const hash=window.location.hash || '#/';
    const parts=hash.slice(2).split('/').filter(Boolean);
    const type=hash==='#/' || hash==='#top' || hash==='#'?'home':parts[0]||'home';
    let view=type, nav='home',title=null,description=baseDesc;
    if(type==='home')drawHome();
    else if(type==='archive') {view='archive';nav='archive';drawArchive();title='전체 기록';}
    else if(type==='category') {
      if(drawCategory(parts[1])) {view='category';nav='archive';title=categories[parts[1]].name;description=categories[parts[1]].desc;}
      else view='notfound';
    }
    else if(type==='post'){
      let slug='';try{slug=decodeURIComponent(parts.slice(1).join('/'));}catch(_){slug='';}
      if(drawPost(slug)){view='post';nav='archive';const p=posts.find(x=>x.slug===slug);title=p.title;description=p.excerpt;}
      else view='notfound';
    }
    else if(type==='about'){view='about';nav='about';title='소개';}
    else {view='notfound';title='페이지를 찾을 수 없습니다';}
    views.forEach(v=>$('#'+v+'-view').hidden=v!==view);
    document.querySelectorAll('[data-nav]').forEach(link=>{
      if(link.dataset.nav===nav && view!=='notfound')link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    setMetadata(title,description);toggleMenu(false);
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  function tryCopy(text) {
    if(navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const box=document.createElement('textarea');box.value=text;box.style.position='fixed';box.style.opacity='0';document.body.appendChild(box);box.select();
    try {const ok=document.execCommand('copy');box.remove();return ok?Promise.resolve():Promise.reject(new Error('copy unavailable'));}
    catch(e){box.remove();return Promise.reject(e);}
  }
  function init() {
    $('#current-year').textContent=String(new Date().getFullYear());
    $('#menu-toggle').addEventListener('click',()=>toggleMenu(!$('#site-nav').classList.contains('is-open')));
    $('#site-nav').addEventListener('click',e=>{if(e.target.closest('a'))toggleMenu(false);});
    document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))toggleMenu(false);});
    $('#category-filters').addEventListener('click',e=>{
      const button=e.target.closest('button[data-filter]');if(!button)return;
      state.filter=button.dataset.filter;drawArchive();
    });
    $('#post-search').addEventListener('input',e=>{state.query=e.target.value;drawArchive();});
    $('#copy-link').addEventListener('click',async()=>{
      const button=$('#copy-link');
      try{await tryCopy(window.location.href);button.textContent='복사 완료 ✓';}
      catch(_){button.textContent='복사할 수 없습니다 — 주소창을 사용하세요';}
    });
    $('#back-top').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape')toggleMenu(false);
      if(e.key!=='/' || e.ctrlKey || e.metaKey || e.altKey || ['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
      e.preventDefault();
      if($('#archive-view').hidden){window.location.hash='#/archive';setTimeout(()=>$('#post-search').focus(),0);}
      else $('#post-search').focus();
    });
    window.addEventListener('hashchange',navigate);
    navigate();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
