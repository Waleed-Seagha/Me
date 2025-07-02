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

// استخراج id من الرابط
function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// تحديث عداد المشاهدات في localStorage
function incrementViews(id) {
  const key = 'post_views_' + id;
  let views = parseInt(localStorage.getItem(key) || '0', 10);
  views++;
  localStorage.setItem(key, views);
  return views;
}

// توليد meta tags ديناميكية
function setMetaTags(post) {
  document.title = post.title + ' | مدونة وليد صياغة التقنية';
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', post.content.slice(0, 160));
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', post.title);
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', post.content.slice(0, 160));
}

// عرض تفاصيل التدوينة مع التحسينات
async function loadPost() {
  const container = document.getElementById('post-details');
  const titleEl = document.getElementById('post-title');
  const metaEl = document.getElementById('post-meta');
  const tagsEl = document.getElementById('post-tags');
  const actionsEl = document.getElementById('post-actions');
  const navEl = document.getElementById('post-nav');
  const relatedEl = document.getElementById('related-posts');
  if (!container) return;
  container.innerHTML = '<div class="loader"><div class="loading-spinner"></div> جاري تحميل التدوينة...</div>';
  const id = getPostId();
  if (!id) {
    container.innerHTML = '<div class="error">لم يتم تحديد التدوينة المطلوبة.</div>';
    return;
  }
  try {
    const res = await fetch('https://me-txd9.onrender.com/api/posts');
    const data = await res.json();
    const posts = data.posts;
    const post = posts.find(p => p.id === id);
    if (!post) {
      container.innerHTML = '<div class="error">لم يتم العثور على التدوينة المطلوبة.</div>';
      return;
    }
    // عداد مشاهدات
    const views = incrementViews(post.id);
    // meta tags
    setMetaTags(post);
    // العنوان
    if (titleEl) titleEl.textContent = post.title;
    // تاريخ النشر وآخر تحديث
    let lastUpdated = post.lastUpdated || post.createdAt;
    metaEl.innerHTML = `👁️ ${views} مشاهدة &nbsp; | &nbsp; 🗓️ نُشر في ${formatDate(post.createdAt)} &nbsp; | &nbsp; 🔄 آخر تحديث: ${formatDate(lastUpdated)}`;
    // الوسوم
    tagsEl.innerHTML = (post.tags||[]).map(tag => `<span class="badge-animated" style="background:var(--gradient-start);color:var(--background-color);padding:0.3em 1em;border-radius:999px;font-weight:bold;">${tag}</span>`).join(' ');
    // أزرار المشاركة
    actionsEl.innerHTML = `
      <button onclick="shareCurrentPost('${post.id}')" class="btn btn-primary">مشاركة</button>
      <button onclick="copyPostLink('${post.id}')" class="btn btn-secondary" style="background:var(--secondary-color);color:#fff;">نسخ الرابط</button>
    `;
    // نص التدوينة
    container.innerHTML = `<div class="card-3d">
      <div class="prose prose-lg max-w-none" style="margin:1rem 0;">
        ${post.content.split("\n\n").map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>`;
    // أزرار التالي/السابق
    const idx = posts.findIndex(p => p.id === id);
    let prev = idx > 0 ? posts[idx-1] : null;
    let next = idx < posts.length-1 ? posts[idx+1] : null;
    navEl.innerHTML = `
      <div>${prev ? `<a href="post.html?id=${prev.id}" class="btn btn-primary">← ${prev.title.slice(0,18)}...</a>` : ''}</div>
      <div>${next ? `<a href="post.html?id=${next.id}" class="btn btn-primary">${next.title.slice(0,18)}... →</a>` : ''}</div>
    `;
    // اقتراح تدوينات مشابهة (نفس الوسم أو عشوائي)
    let related = posts.filter(p => p.id !== id && (p.tags||[]).some(tag => (post.tags||[]).includes(tag)));
    if (related.length < 2) {
      // أكمل عشوائيًا
      related = related.concat(posts.filter(p => p.id !== id && !related.includes(p)).slice(0,2-related.length));
    }
    relatedEl.innerHTML = `<h3 style="margin-bottom:1em;text-align:center;">تدوينات مشابهة</h3><div style="display:flex;flex-wrap:wrap;gap:1.2em;justify-content:center;">` +
      related.slice(0,2).map(rp => `
        <div class="card-3d" style="max-width:340px;min-width:220px;">
          <div class="text-gradient" style="font-size:1.1rem;font-weight:bold;margin-bottom:0.5em;"><a href="post.html?id=${rp.id}">${rp.title}</a></div>
          <div style="font-size:0.98em;color:#aaa;">${formatDate(rp.createdAt)}</div>
          <div class="prose" style="font-size:0.98em;color:#888;">${rp.content.split("\n\n")[0].slice(0,80)}...</div>
        </div>
      `).join('') + '</div>';
  } catch (e) {
    container.innerHTML = '<div class="error">حدث خطأ أثناء جلب التدوينة.</div>';
  }
}

// مشاركة التدوينة الحالية
function shareCurrentPost(id) {
  const url = window.location.origin + window.location.pathname.replace('post.html','') + `post.html?id=${id}`;
  if (navigator.share) {
    navigator.share({title:'تدوينة تقنية',url});
  } else {
    if (confirm('هل تريد نسخ الرابط أم مشاركة على واتساب؟\nاضغط موافق للنسخ، إلغاء للمشاركة على واتساب.')) {
      navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`,'_blank');
    }
  }
}
function copyPostLink(id) {
  const url = window.location.origin + window.location.pathname.replace('post.html','') + `post.html?id=${id}`;
  navigator.clipboard.writeText(url);
  alert('تم نسخ الرابط!');
}

document.addEventListener('DOMContentLoaded', loadPost); 