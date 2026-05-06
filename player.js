const id = new URLSearchParams(location.search).get('id');
const player = document.getElementById('player');
const videoTitle = document.getElementById('videoTitle');
const videoMeta = document.getElementById('videoMeta');
const videoDesc = document.getElementById('videoDesc');
const commentsList = document.getElementById('commentsList');

async function load(){
  const res = await fetch(`/api/videos/${id}`); const data = await res.json();
  player.src = data.video.video_url; videoTitle.textContent = data.video.title;
  videoMeta.textContent = `${data.video.channel_name} • ${data.video.views} views • ${data.video.time_ago}`;
  videoDesc.textContent = data.video.description;
  commentsList.innerHTML = data.comments.map(c=>`<p><strong>${c.author}</strong><br/>${c.body}</p>`).join('');
}

document.getElementById('likeBtn').onclick = async ()=>{await fetch(`/api/videos/${id}/like`,{method:'POST'});load();};
document.getElementById('subBtn').onclick = async ()=>{await fetch(`/api/videos/${id}/subscribe`,{method:'POST'});alert('Subscribed!');};
document.getElementById('commentForm').onsubmit = async (e)=>{e.preventDefault();await fetch(`/api/videos/${id}/comments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({author:'Guest',body:commentText.value})});commentText.value='';load();};
load();
