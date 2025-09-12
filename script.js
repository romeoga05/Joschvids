const videoFeed = document.getElementById("video-feed");
let unmuted = false, observer, videoFiles = [];

function createVideoContainer(file) {
  const container = document.createElement("div");
  container.className = "video-container";

  const video = document.createElement("video");
  video.src = `videos/${file}`;
  video.loop = true;
  video.muted = !unmuted;
  video.playsInline = true;
  video.controls = false;
  video.autoplay = true;

  const title = file.replace(/\.[^/.]+$/, "");
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `<div class="caption">${title}</div>`;

  const buttons = document.createElement("div");
  buttons.className = "side-buttons";

  const likeWrapper = document.createElement("div"); likeWrapper.style.textAlign="center";
  const like = document.createElement("div"); like.className="action-btn"; like.innerText="❤️";
  const likeCount = document.createElement("div"); likeCount.className="like-count"; let likes=Math.floor(Math.random()*5000)+100; likeCount.innerText=likes;
  like.addEventListener("click", () => { likes++; likeCount.innerText=likes; like.classList.add("heart-anim"); setTimeout(()=>like.classList.remove("heart-anim"),300); });
  likeWrapper.append(like, likeCount);

  const comment = document.createElement("div"); comment.className="action-btn"; comment.innerText="💬";

  const share = document.createElement("div"); share.className="action-btn"; share.innerText="🔗";
  share.addEventListener("click", () => {
    if(navigator.share){
      navigator.share({title, text:`Check out this video: ${title}`}).catch(err=>console.error(err));
    } else alert(`Share this video: ${title}`);
  });

  buttons.append(likeWrapper, comment, share);
  container.append(video, overlay, buttons);

  let lastTap = 0;
  container.addEventListener("click", e => {
    const now = new Date().getTime();
    if(now-lastTap<300 && now-lastTap>0){
      likes++; likeCount.innerText=likes;
      like.classList.add("heart-anim");
      setTimeout(()=>like.classList.remove("heart-anim"),300);

      const heart=document.createElement("div");
      heart.className="floating-heart"; heart.innerText="❤️";
      heart.style.left=`${e.clientX-30}px`; heart.style.top=`${e.clientY-30}px`;
      container.appendChild(heart); setTimeout(()=>heart.remove(),1000);
    }
    lastTap=now;
  });

  observer.observe(video);
  return container;
}

fetch("videos.json").then(res=>res.json()).then(videos=>{
  videoFiles=videos;
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const vid=entry.target;
    entry.isIntersecting?vid.play().catch(()=>{}):vid.pause();
  }),{threshold:0.75});

  for(let i=0;i<8;i++){
    const randomFile=videoFiles[Math.floor(Math.random()*videoFiles.length)];
    videoFeed.appendChild(createVideoContainer(randomFile));
  }

  videoFeed.addEventListener("scroll", ()=>{
    if(videoFeed.scrollTop+videoFeed.clientHeight>=videoFeed.scrollHeight-10){
      for(let i=0;i<5;i++){
        const randomFile=videoFiles[Math.floor(Math.random()*videoFiles.length)];
        videoFeed.appendChild(createVideoContainer(randomFile));
      }
    }
  });

  const unmuteAll=()=>{unmuted=true; document.querySelectorAll("video").forEach(v=>v.muted=false);};
  document.addEventListener("click", unmuteAll, {once:true});
  document.addEventListener("touchstart", unmuteAll, {once:true});
}).catch(err=>console.error(err));
