// دالة لتنسيق التاريخ بالعربية
function formatDate(dateString) {
  const ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const ARABIC_DAYS = [
    'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];
  const date = new Date(dateString);
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const dayName = ARABIC_DAYS[date.getDay()];
  return `${dayName} ${day} ${month} ${year}`;
}

let allPosts = [];
let filteredPosts = [];
let allTags = new Set();

function renderTags(tags) {
  const tagsList = document.getElementById('tags-list');
  if (!tagsList) return;
  tagsList.innerHTML = '';
  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.className = 'badge-animated';
    btn.style.cssText = 'background:var(--gradient-start);color:var(--background-color);padding:0.3em 1em;border-radius:999px;font-weight:bold;cursor:pointer;border:none;margin-bottom:0.2em;';
    btn.onclick = () => filterByTag(tag);
    tagsList.appendChild(btn);
  });
}

function filterByTag(tag) {
  document.getElementById('search-input').value = '';
  filteredPosts = allPosts.filter(post => (post.tags||[]).includes(tag));
  renderPosts(filteredPosts);
}

function filterBySearch(query) {
  filteredPosts = allPosts.filter(post => post.title.includes(query) || post.content.includes(query));
  renderPosts(filteredPosts);
}

function renderPosts(posts) {
  const container = document.getElementById('posts-list');
  if (!container) return;
  if (!posts || posts.length === 0) {
    container.innerHTML = '<div class="no-posts">لم يتم العثور على تدوينات.</div>';
    return;
  }
  container.innerHTML = posts.map(post => `
    <div class="card-3d glow-on-hover">
      <div class="shimmer"></div>
      <div class="headline-3d text-gradient" style="font-size:2rem;font-weight:bold;">
        <a href="post.html?id=${post.id}" class="block text-gradient">${post.title}</a>
      </div>
      <div class="text-sm" style="opacity:0.8;">نُشر في ${formatDate(post.createdAt)}</div>
      <div class="prose prose-lg max-w-none" style="margin:1rem 0;">
        ${post.content.split("\n\n").slice(0,1).map(p => `<p>${p}</p>`).join('')}
      </div>
      <div class="flex flex-wrap gap-2">
        ${(post.tags||[]).map(tag => `<span class="badge-animated" style="background:var(--gradient-start);color:var(--background-color);padding:0.3em 1em;border-radius:999px;font-weight:bold;">${tag}</span>`).join(' ')}
      </div>
      <div style="margin-top:1rem;text-align:left;display:flex;gap:0.5em;">
        <a href="post.html?id=${post.id}" class="btn-animated" style="border:1px solid var(--primary-color);color:var(--primary-color);padding:0.5em 1.5em;border-radius:5px;text-decoration:none;">اقرأ المزيد</a>
        <button onclick="sharePost('${post.id}')" class="btn-animated" style="background:var(--secondary-color);color:#fff;padding:0.5em 1.2em;border-radius:5px;border:none;cursor:pointer;">مشاركة</button>
      </div>
    </div>
  `).join('');
}

async function loadPosts() {
  const container = document.getElementById('posts-list');
  if (!container) return;
  container.innerHTML = '<div class="loader"><div class="loading-spinner"></div> جاري تحميل التدوينات...</div>';
  try {
    const res = await fetch('public/data/posts.json');
    const data = await res.json();
    allPosts = data.posts;
    filteredPosts = allPosts;
    // جمع كل الوسوم
    allTags = new Set();
    allPosts.forEach(post => (post.tags||[]).forEach(tag => allTags.add(tag)));
    renderTags(Array.from(allTags));
    renderPosts(allPosts);
  } catch (e) {
    container.innerHTML = '<div class="error">حدث خطأ أثناء جلب التدوينات.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  // البحث
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      filterBySearch(e.target.value);
    });
  }
  // زر العودة للأعلى
  const scrollBtn = document.getElementById('scrollToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollBtn.style.display = 'flex';
    else scrollBtn.style.display = 'none';
  });
  scrollBtn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
});

// مشاركة التدوينة
function sharePost(id) {
  const url = window.location.origin + window.location.pathname.replace('index.html','') + `post.html?id=${id}`;
  if (navigator.share) {
    navigator.share({title:'تدوينة تقنية',url});
  } else {
    // عرض خيارات المشاركة
    if (confirm('هل تريد نسخ الرابط أم مشاركة على واتساب؟\nاضغط موافق للنسخ، إلغاء للمشاركة على واتساب.')) {
      navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`,'_blank');
    }
  }
} 