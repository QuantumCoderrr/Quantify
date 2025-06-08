class QuantifyPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.volume = 0.7;
    this.likedSongs = [];
    this.recentlyPlayed = [];

    this.playlist = [
      { title: "Faded", artist: "Alan Walker", album: "Different World", file: "assets/songs/Faded.mp3", cover: "assets/images/Faded.jpeg", duration: "3:32" },
      { title: "Spectre", artist: "Alan Walker", album: "Spectre", file: "assets/songs/Spectre.mp3", cover: "assets/images/Spectre.jpeg", duration: "3:12" },
      { title: "Force", artist: "Alan Walker & Walkers", album: "Different World", file: "assets/songs/Force.mp3", cover: "assets/images/Force.webp", duration: "3:45" },
      { title: "Hope", artist: "Unknown Brain", album: "NCS Release", file: "assets/songs/Hope.mp3", cover: "assets/images/Hope.jpg", duration: "3:20" },
      { title: "Heroes", artist: "RetroVision", album: "NCS Release", file: "assets/songs/Heroes.mp3", cover: "assets/images/Heroes.jpg", duration: "3:45" },
      { title: "Sky High", artist: "Elektronomia", album: "NCS Release", file: "assets/songs/Sky High.mp3", cover: "assets/images/SkyHigh.jpg", duration: "3:20" },
      { title: "On & On", artist: "Cartoon ft. Daniel Levi", album: "NCS Release", file: "assets/songs/On & On.mp3", cover: "assets/images/On and On.jpeg", duration: "3:28" },
      { title: "Mortals", artist: "Warriyo ft. Laura Brehm", album: "NCS Release", file: "assets/songs/Mortals.mp3", cover: "assets/images/Mortals.webp", duration: "3:34" },
      { title: "Symbolism", artist: "Electro-Light", album: "NCS Release", file: "assets/songs/Symbolism.mp3", cover: "assets/images/Symbolism.jpg", duration: "3:50" },
      { title: "Invincible", artist: "DEAF KEV", album: "NCS Release", file: "assets/songs/Invincible.mp3", cover: "assets/images/Invincible.webp", duration: "4:00" }
    ];

    this.init();
  }

  init() {
  this.bindEvents();
  this.loadSong(this.currentIndex);
  this.audio.volume = this.volume;

  this.audio.addEventListener("timeupdate", () => this.updateProgress());
  this.audio.addEventListener("ended", () => this.handleSongEnd());

  // Sync shuffle & repeat button state on load
  document.querySelector(".fa-random").classList.toggle("active", this.isShuffle);
  document.querySelector(".fa-redo").classList.toggle("active", this.isRepeat);
}

  bindEvents() {
  document.querySelector(".play-pause-btn").addEventListener("click", () => this.togglePlayPause());

  document.querySelector(".fa-step-forward").parentElement.addEventListener("click", () => this.nextTrack());

  document.querySelector(".fa-step-backward").parentElement.addEventListener("click", () => this.prevTrack());

  // Shuffle toggle — toggle class for UI feedback
  const shuffleBtn = document.querySelector(".fa-random").parentElement;
  shuffleBtn.addEventListener("click", () => {
    this.toggleShuffle();
    shuffleBtn.classList.toggle("active", this.isShuffle);
  });

  // Repeat toggle — toggle class for UI feedback
  const repeatBtn = document.querySelector(".fa-redo").parentElement;
  repeatBtn.addEventListener("click", () => {
    this.toggleRepeat();
    repeatBtn.classList.toggle("active", this.isRepeat);
  });

  document.querySelector(".volume-bar").addEventListener("click", (e) => this.setVolume(e));

  document.querySelector(".progress-bar").addEventListener("click", (e) => this.seekTo(e));

  document.querySelector(".search-input").addEventListener("input", (e) => this.handleSearch(e.target.value));

  document.querySelectorAll(".song-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = parseInt(item.getAttribute("data-index"));
      this.playTrack(index);
    });
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      this.switchSection(link.textContent.trim().toLowerCase());
    });
  });

  // Like toggle for song items (heart icon)
  document.querySelectorAll(".song-item").forEach((item) => {
    const heart = item.querySelector(".fa-heart");
    if (heart) {
      heart.parentElement.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(item.getAttribute("data-index"));
        this.toggleLike(index);
      });
    }
  });

  // Like toggle in footer player
  const footerHeart = document.querySelector(".footer .fa-heart");
  if (footerHeart) {
    footerHeart.parentElement.addEventListener("click", () => {
      this.toggleLike(this.currentIndex);
      this.updateFooterHeartIcon();
    });
  }

  // Volume mute/unmute toggle with icon and volume bar update
  const speakerButton = document.querySelector(".volume-btn i");
  if (speakerButton) {
    speakerButton.parentElement.addEventListener("click", () => {
      this.audio.muted = !this.audio.muted;

      speakerButton.classList.toggle("fa-volume-up", !this.audio.muted);
      speakerButton.classList.toggle("fa-volume-mute", this.audio.muted);

      const volumeFill = document.querySelector(".volume-fill");
      if (this.audio.muted) {
        volumeFill.style.width = `0%`;
      } else {
        volumeFill.style.width = `${this.volume * 100}%`;
      }
    });
  }

const profileOption = document.querySelector('.dropdown-menu li:nth-child(1) a.dropdown-item');
const settingsOption = document.querySelector('.dropdown-menu li:nth-child(2) a.dropdown-item');

if (profileOption) {
  profileOption.addEventListener('click', (e) => {
    e.preventDefault();
    alert("👤 Profile page is coming soon! Meanwhile, enjoy the songs!");
  });
}

if (settingsOption) {
  settingsOption.addEventListener('click', (e) => {
    e.preventDefault();
    alert("⚙ Settings page is coming soon! Meanwhile, enjoy the songs!");
  });
}


}


  loadSong(index) {
  const song = this.playlist[index];
  this.audio.src = song.file;
  document.getElementById("player-title").textContent = song.title;
  document.getElementById("player-artist").textContent = song.artist;
  document.getElementById("player-cover").src = song.cover;

  document.querySelectorAll(".song-item").forEach(item => item.classList.remove("active"));
  const activeItem = document.querySelector(`.song-item[data-index="${index}"]`);
  if (activeItem) activeItem.classList.add("active");

  // Reset progress and time display on song load
  const progress = document.querySelector(".progress-fill");
  if (progress) progress.style.width = '0%';

  const currentTimeElem = document.querySelector(".time-current");
  const totalTimeElem = document.querySelector(".time-total");

  if (currentTimeElem) currentTimeElem.textContent = "0:00";
  if (totalTimeElem) totalTimeElem.textContent = song.duration || "0:00";
}

  playTrack(index = this.currentIndex) {
  this.currentIndex = index; // ✅ Always set current index
  this.loadSong(index);      // ✅ Always load track details
  this.audio.load();         // ✅ Always load audio
  this.audio.play();

  this.isPlaying = true;

  this.updatePlayPauseIcon();
  this.addToRecentlyPlayed(index);
  this.updateFooterDetails();        
  this.updateFooterHeartIcon();      
}

  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlaying = true;
    } else {
      this.audio.pause();
      this.isPlaying = false;
    }
    this.updatePlayPauseIcon();
  }

  updatePlayPauseIcon() {
    const icon = document.querySelector(".play-pause-btn i");
    icon.classList.toggle("fa-play", !this.isPlaying);
    icon.classList.toggle("fa-pause", this.isPlaying);
  }

  getRandomIndexExceptCurrent() {
    let rand;
    do {
      rand = Math.floor(Math.random() * this.playlist.length);
    } while (rand === this.currentIndex);
    return rand;
  }

  nextTrack() {
  const oldIndex = this.currentIndex;

  if (this.isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.playlist.length);
    } while (newIndex === oldIndex && this.playlist.length > 1);
    this.currentIndex = newIndex;
  } else {
    this.currentIndex++;
    if (this.currentIndex >= this.playlist.length) {
      if (this.isRepeat) {
        this.currentIndex = 0; // loop to first song if repeat on
      } else {
        this.currentIndex = this.playlist.length - 1; // stay at last song if no repeat
        this.pause(); // optional: stop playback at end of playlist
        return;
      }
    }
  }

  this.loadSong(this.currentIndex);
  this.playTrack(this.currentIndex);
}


prevTrack() {
  const oldIndex = this.currentIndex;
  if (this.isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.playlist.length);
    } while (newIndex === oldIndex);
    this.currentIndex = newIndex;
  } else {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
  }
  this.audio.pause();
  this.loadSong(this.currentIndex);
  this.audio.load();
  this.playTrack(this.currentIndex);
}


  toggleShuffle() {
  this.isShuffle = !this.isShuffle;
  document.querySelector(".fa-random").classList.toggle("active", this.isShuffle);
}

toggleRepeat() {
  this.isRepeat = !this.isRepeat;
  document.querySelector(".fa-redo").classList.toggle("active", this.isRepeat);
}


  handleSongEnd() {
  if (this.isRepeat) {
    this.audio.currentTime = 0;
    this.audio.play();
  } else {
    this.nextTrack();
  }
}

  updateProgress() {
    const progress = document.querySelector(".progress-fill");
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration || 1;
    const percentage = (currentTime / duration) * 100;
    progress.style.width = `${percentage}%`;

    document.querySelector(".time-current").textContent = this.formatTime(currentTime);
    document.querySelector(".time-total").textContent = this.formatTime(duration);
  }

  seekTo(e) {
    const bar = e.currentTarget;
    const offsetX = e.offsetX;
    const width = bar.offsetWidth;
    const duration = this.audio.duration || 0;
    this.audio.currentTime = (offsetX / width) * duration;
  }

  setVolume(e) {
    const bar = e.currentTarget;
    const offsetX = e.offsetX;
    const width = bar.offsetWidth;
    this.volume = offsetX / width;
    this.audio.volume = this.volume;
    document.querySelector(".volume-fill").style.width = `${this.volume * 100}%`;
  }

  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  }

  toggleLike(index) {
  const liked = this.likedSongs.includes(index);
  if (liked) {
    this.likedSongs = this.likedSongs.filter(i => i !== index);
  } else {
    this.likedSongs.push(index);
  }

  this.renderLikedSongs();

  // Only update footer heart if it’s the current track
  if (index === this.currentIndex) {
    this.updateFooterHeartIcon();
  }
}

  addToRecentlyPlayed(index) {
    this.recentlyPlayed = this.recentlyPlayed.filter(i => i !== index);
    this.recentlyPlayed.unshift(index);
    if (this.recentlyPlayed.length > 10) {
      this.recentlyPlayed.pop();
    }
    this.renderRecentlyPlayed();
  }

  renderLikedSongs() {
    document.querySelectorAll(".song-item").forEach(item => {
      const index = parseInt(item.getAttribute("data-index"));
      const icon = item.querySelector(".fa-heart");
      if (!icon) return;

      icon.classList.toggle("fas", this.likedSongs.includes(index));
      icon.classList.toggle("far", !this.likedSongs.includes(index));
    });
  }

  updateFooterHeartIcon() {
  const footerHeart = document.querySelector(".footer .fa-heart");
  if (!footerHeart) return;

  const liked = this.likedSongs.includes(this.currentIndex);
  footerHeart.className = `fa-heart ${liked ? 'fas' : 'far'}`;
}
updateNowPlaying() {
  const nowPlayingMini = document.getElementById("nowPlayingMini");
  if (!nowPlayingMini) return;

  const thumb = nowPlayingMini.querySelector(".now-playing-thumb");
  const title = nowPlayingMini.querySelector(".now-playing-title");
  const artist = nowPlayingMini.querySelector(".now-playing-artist");

  const currentSong = this.playlist[this.currentIndex];

  if (!currentSong) {
    nowPlayingMini.classList.add("d-none");
    return;
  }

  // Show the container
  nowPlayingMini.classList.remove("d-none");

  // Update song info
  thumb.src = currentSong.cover || "assets/images/default.jpg";
  thumb.alt = `Cover for ${currentSong.title}`;

  title.textContent = currentSong.title || "Unknown Title";
  artist.textContent = currentSong.artist || "Unknown Artist";
}

  renderRecentlyPlayed() {
    const container = document.querySelector(".sidebar-section");
    if (!container) return;

    container.innerHTML = `<h6 class="sidebar-title">Recently Played</h6>` +
      this.recentlyPlayed.map(index => {
        const song = this.playlist[index];
        return `
          <div class="recent-item">
            <img src="${song.cover}" alt="${song.title}">
            <div class="recent-info">
              <div class="recent-name">${song.title}</div>
              <div class="recent-count">${song.artist}</div>
            </div>
          </div>`;
      }).join("");
  }

  handleSearch(query) {
    query = query.toLowerCase();
    document.querySelectorAll(".song-item").forEach(item => {
      const title = item.querySelector(".song-title").textContent.toLowerCase();
      const match = title.includes(query);
      item.style.display = match ? "grid" : "none";
    });
  }

  switchSection(section) {
    document.querySelectorAll(".song-item").forEach(item => {
      const index = parseInt(item.getAttribute("data-index"));
      if (section === "home") {
        item.style.display = "grid";
      } else if (section === "library") {
        item.style.display = this.likedSongs.includes(index) ? "grid" : "none";
      } else if (section === "explore") {
        item.style.display = index % 2 === 0 ? "grid" : "none";
      } else if (section === "playlists") {
        item.style.display = index % 2 === 1 ? "grid" : "none";
      }
    });
  }
}

// Power up the player when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new QuantifyPlayer();
});
