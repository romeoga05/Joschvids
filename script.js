const videoFeed = document.getElementById("video-feed");
let unmuted = false;

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
      video.muted = true;       // start muted
      video.playsInline = true;
      video.controls = false;
      video.autoplay = true;

      container.appendChild(video);
      videoFeed.appendChild(container);
    });

    const allVideos = document.querySelectorAll("video");

    // Intersection Observer: play/pause videos
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

    // Auto-unmute on first user interaction (click/tap)
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
