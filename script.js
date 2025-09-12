const videoFeed = document.getElementById("video-feed");
let unmuted = false;

// Example captions + usernames
const captions = [
  { user: "@alice", text: "Chilling with the vibes ✨" },
  { user: "@bob", text: "Check out this move 🔥" },
  { user: "@charlie", text: "Life is better with music 🎶" },
];

fetch("videos.json")
  .then(res => res.json())
  .then(videos => {
    videos.sort(() => Math.random() - 0.5);

    videos.forEach((file, i) => {
      const container = document.createElement("div");
      container.className = "video-container";

      const video = document.createElement("video");
      video.src = `videos/${file}`;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.controls = false;
      video.autoplay = true;

      // Overlay with username + caption
      const overlay = document.createElement("div");
      overlay.className = "overlay";

      const username = document.createElement("div");
      username.className = "username";
      username.innerText = captions[i % captions.length].user;

      const caption = document.createElement("div");
      caption.className = "caption";
      caption.innerText = captions[i % captions.length].text;

      overlay.append(username, caption);

      // Side buttons
      const buttons = document.createElement("div");
      buttons.className = "side-buttons";

      // ❤️ Like button + counter
      const likeWrapper = document.createElement("div");
      const like = document.createElement("div");
      like.innerText = "❤️";
      const likeCount = document.createElement("div");
      likeCount.className = "like-count";
      let likes = Math.floor(Math.random() * 5000) + 100; // fake initial likes
      likeCount.innerText = likes;

      like.addEventListener("click", () => {
        likes++;
        likeCount.innerText = likes;

        // animate the heart
        like.classList.add("heart-anim");
        setTimeout(() => {
          like.classList.remove("heart-anim");
          like.classList.add("heart-anim-reset");
          setTimeout(() => like.classList.remove("heart-anim-reset"), 200);
        }, 200);
      });

      likeWrapper.append(like, likeCount);

      // 💬 Comment button
      const commentWrapper = document.createElement("div");
      const comment = document.createElement("div");
      comment.innerText = "💬";
      const commentCount = document.createElement("div");
      commentCount.className = "like-count";
      commentCount.innerText = Math.floor(Math.random() * 500); // fake
      commentWrapper.append(comment, commentCount);

      // 🔗 Share button
      const shareWrapper = document.createElement("div");
      const share = document.createElement("div");
      share.innerText = "🔗";
      const shareCount = document.createElement("div");
      shareCount.className = "like-count";
      shareCount.innerText = Math.floor(Math.random() * 100); // fake
      shareWrapper.append(share, shareCount);

      buttons.append(likeWrapper, commentWrapper, shareWrapper);

      container.append(video, overlay, buttons);
      videoFeed.appendChild(container);
    });

    const allVideos = document.querySelectorAll("video");

    // Play/pause visible video
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(err => console.log(err));
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.75 });

    allVideos.forEach(video => observer.observe(video));

    // Unmute all videos on first tap
    const unmuteAll = () => {
      if (!unmuted) {
        allVideos.forEach(v => v.muted = false);
        unmuted = true;
        document.removeEventListener("click", unmuteAll);
        document.removeEventListener("touchstart", unmuteAll);
      }
    };

    document.addEventListener("click", unmuteAll);
    document.addEventListener("touchstart", unmuteAll);
  })
  .catch(err => console.error(err));
