const categories = ['Gaming', 'Music', 'Sports', 'Anime', 'Live', 'Technology', 'Trending', 'New'];
const categoryBar = document.getElementById('categoryBar');
const grid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const uploadDialog = document.getElementById('uploadDialog');
const uploadForm = document.getElementById('uploadForm');
const uploadProgress = document.getElementById('uploadProgress');

categories.forEach((c) => {
  const b = document.createElement('button'); b.className = 'cat'; b.textContent = c; b.onclick = () => loadVideos(c);
  categoryBar.appendChild(b);
  document.getElementById('categoryInput').innerHTML += `<option>${c}</option>`;
});

function fmtViews(v){return `${Number(v).toLocaleString()} views`;}
async function loadVideos(category=''){
  const query = new URLSearchParams({q:searchInput.value, category}).toString();
  const res = await fetch(`/api/videos?${query}`); const videos = await res.json();
  grid.innerHTML = videos.map(v => `<article class="card" onclick="location.href='/player.html?id=${v.id}'"><div class="thumb-wrap"><img src="${v.thumbnail_url}" alt="thumbnail" /><span class="duration">${v.duration_label||'--:--'}</span></div><div class="card-body"><div class="title">${v.title}</div><div class="muted">${v.channel_name}</div><div class="muted">${fmtViews(v.views)} • ${v.time_ago}</div></div></article>`).join('');
}
searchInput.addEventListener('input', () => loadVideos());

document.getElementById('openUploadBtn').onclick = () => uploadDialog.showModal();
document.getElementById('closeUploadBtn').onclick = () => uploadDialog.close();

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData();
  ['videoFile','thumbnailFile','titleInput','descriptionInput','categoryInput'].forEach((id)=>fd.append(id, document.getElementById(id).files?.[0] || document.getElementById(id).value));
  uploadProgress.value = 5;
  const timer = setInterval(()=> uploadProgress.value = Math.min(uploadProgress.value+10, 95), 120);
  const res = await fetch('/api/videos/upload', { method:'POST', body:fd });
  clearInterval(timer); uploadProgress.value = 100;
  if (!res.ok) return alert('Upload failed');
  uploadForm.reset(); setTimeout(()=>{uploadProgress.value=0; uploadDialog.close(); loadVideos();}, 500);
});

loadVideos();
