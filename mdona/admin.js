const API_BASE = 'https://me-txd9.onrender.com';

// جلب وعرض جميع التدوينات
async function loadAdminPosts() {
  const tbody = document.getElementById('admin-posts-list');
  tbody.innerHTML = '<tr><td colspan="4">جاري التحميل...</td></tr>';
  try {
    const res = await fetch(`${API_BASE}/api/posts`);
    const data = await res.json();
    tbody.innerHTML = '';
    data.posts.forEach(post => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${post.title}</td>
        <td>${formatDate(post.createdAt)}</td>
        <td>${(post.tags||[]).join(', ')}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary" onclick="editPost('${post.id}')">تعديل</button>
          <button class="btn btn-danger" onclick="deletePost('${post.id}')">حذف</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="4">حدث خطأ أثناء جلب التدوينات.</td></tr>';
  }
}

// تنسيق التاريخ بالعربية (نفس دالة الواجهة)
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

// حذف تدوينة
async function deletePost(id) {
  if (!confirm('هل أنت متأكد من حذف هذه التدوينة؟')) return;
  try {
    const res = await fetch(`${API_BASE}/api/delete-post/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadAdminPosts();
    } else {
      alert('فشل الحذف!');
    }
  } catch (e) {
    alert('حدث خطأ أثناء الحذف.');
  }
}

// تعبئة نموذج التعديل
async function editPost(id) {
  try {
    const res = await fetch(`${API_BASE}/api/posts`);
    const data = await res.json();
    const post = data.posts.find(p => p.id === id);
    if (!post) return;
    document.getElementById('edit-id').value = post.id;
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;
    document.getElementById('edit-tags').value = (post.tags||[]).join(', ');
    document.getElementById('edit-post-form').style.display = 'block';
    document.getElementById('edit-msg').textContent = '';
    document.getElementById('edit-error').textContent = '';
    window.scrollTo({top:0,behavior:'smooth'});
  } catch (e) {
    alert('خطأ في جلب التدوينة للتعديل.');
  }
}

document.getElementById('cancel-edit').onclick = function() {
  document.getElementById('edit-post-form').style.display = 'none';
};

// حفظ التعديلات
 document.getElementById('edit-post-form').onsubmit = async function(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value;
  const content = document.getElementById('edit-content').value;
  const tags = document.getElementById('edit-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  try {
    const res = await fetch(`${API_BASE}/api/edit-post/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags })
    });
    if (res.ok) {
      document.getElementById('edit-msg').textContent = 'تم حفظ التعديلات بنجاح';
      document.getElementById('edit-error').textContent = '';
      loadAdminPosts();
      setTimeout(()=>{
        document.getElementById('edit-post-form').style.display = 'none';
      }, 1200);
    } else {
      document.getElementById('edit-error').textContent = 'فشل حفظ التعديلات!';
    }
  } catch (e) {
    document.getElementById('edit-error').textContent = 'حدث خطأ أثناء الحفظ.';
  }
};

// توليد منشور جديد
 document.getElementById('generate-post-btn').onclick = async function() {
  const msg = document.getElementById('generate-msg');
  msg.textContent = 'جاري التوليد...';
  try {
    const res = await fetch(`${API_BASE}/api/generate-post`, { method: 'POST' });
    if (res.ok) {
      msg.textContent = 'تم توليد منشور جديد بنجاح!';
      loadAdminPosts();
    } else {
      msg.textContent = 'فشل التوليد!';
    }
  } catch (e) {
    msg.textContent = 'حدث خطأ أثناء التوليد.';
  }
};

// تحميل التدوينات عند فتح الصفحة
window.onload = loadAdminPosts; 