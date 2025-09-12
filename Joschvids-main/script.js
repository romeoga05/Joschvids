const videoFeed = document.getElementById("video-feed");
let unmuted = false; // track if user allowed sound

// Load videos from JSON
fetch("videos.json")
  .then(res => res.json())
  .then(videos => {
    videos.sort(() => Math.random() - 0.5); // shuffle

    videos.forEach(file => {
      const container = document.createElement("div");
      container.className = "video-container";

      const video = document.createElement("video");
      video.src = `videos/${file}`;
      video.loop = true;
      video.muted = true;      // start muted
      video.playsInline = true;
      video.controls = false;
      video.autoplay = true;

      // Unmute button
      const btn = document.createElement("div");
      btn.className = "unmute-btn";
      btn.innerText = "Unmute Sound";
      btn.addEventListener("click", () => {
        unmuted = true;
        document.querySelectorAll("video").forEach(v => v.muted = false);
        btn.style.display = "none";
      });

      container.append(video, btn);
      videoFeed.appendChild(container);
    });

    // Play/pause using Intersection Observer
    const allVideos = document.querySelectorAll("video");
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
  })
  .catch(err => console.error(err));
