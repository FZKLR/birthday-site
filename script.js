document.addEventListener("DOMContentLoaded", () => {
  const birthDate = new Date("2006-10-06T00:00:00");
  const countdownElement = document.getElementById("countdown");

  function updateAge() {
    if (!countdownElement) return;

    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }

    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }

    if (hours < 0) {
      hours += 24;
      days -= 1;
    }

    if (days < 0) {
      const previousMonthDays = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      ).getDate();

      days += previousMonthDays;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    countdownElement.textContent =
      `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateAge();
  setInterval(updateAge, 1000);

  const gallery = document.getElementById("lightgallery");

  if (gallery && typeof lightGallery !== "undefined") {
    lightGallery(gallery, {
      speed: 450,
      download: false,
      selector: "a"
    });
  }

  const scroller = document.getElementById("hall-of-fame-scroller");
  const scrollLeftButton = document.getElementById("scroll-left-btn");
  const scrollRightButton = document.getElementById("scroll-right-btn");

  if (scroller && scrollLeftButton && scrollRightButton) {
    const getScrollDistance = () => {
      const firstCard = scroller.querySelector(".snap-center");
      if (!firstCard) return 250;

      const styles = window.getComputedStyle(scroller);
      const gap = Number.parseInt(styles.gap, 10) || 0;

      return firstCard.offsetWidth + gap;
    };

    scrollRightButton.addEventListener("click", () => {
      scroller.scrollBy({
        left: getScrollDistance(),
        behavior: "smooth"
      });
    });

    scrollLeftButton.addEventListener("click", () => {
      scroller.scrollBy({
        left: -getScrollDistance(),
        behavior: "smooth"
      });
    });
  }

  const videoUploadInput = document.getElementById("video-upload");
  const videoPlayer = document.getElementById("video-player");
  const videoUploadLabel = document.getElementById("video-upload-label");

  if (videoUploadInput && videoPlayer && videoUploadLabel) {
    videoUploadInput.addEventListener("change", (event) => {
      const selectedFile = event.target.files?.[0];

      if (!selectedFile) return;

      const videoUrl = URL.createObjectURL(selectedFile);

      videoPlayer.src = videoUrl;
      videoPlayer.classList.remove("hidden");
      videoUploadLabel.classList.add("hidden");
      videoPlayer.play().catch(() => {});
    });
  }

  const canvas = document.getElementById("sakura-canvas");

  if (!canvas) return;

  const context = canvas.getContext("2d");
  const petalCount = 38;
  let petals = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Petal {
    constructor(startAnywhere = true) {
      this.reset(startAnywhere);
    }

    reset(startAnywhere = false) {
      this.x = Math.random() * canvas.width;
      this.y = startAnywhere
        ? Math.random() * canvas.height
        : -20 - Math.random() * 160;

      this.width = 9 + Math.random() * 12;
      this.height = 7 + Math.random() * 9;
      this.opacity = 0.32 + Math.random() * 0.42;
      this.xSpeed = -0.25 + Math.random() * 0.8;
      this.ySpeed = 0.45 + Math.random() * 1.25;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = -0.025 + Math.random() * 0.05;
      this.color = Math.random() > 0.5 ? "#ff4fb8" : "#c78cff";
    }

    update() {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      this.rotation += this.rotationSpeed;

      if (
        this.y > canvas.height + 30 ||
        this.x < -30 ||
        this.x > canvas.width + 30
      ) {
        this.reset(false);
      }
    }

    draw() {
      context.save();
      context.globalAlpha = this.opacity;
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.fillStyle = this.color;

      context.beginPath();
      context.moveTo(0, -this.height / 2);
      context.bezierCurveTo(
        this.width / 2,
        -this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        this.height / 2
      );
      context.bezierCurveTo(
        -this.width / 2,
        this.height / 2,
        -this.width / 2,
        -this.height / 2,
        0,
        -this.height / 2
      );
      context.fill();

      context.restore();
    }
  }

  function createPetals() {
    petals = Array.from({ length: petalCount }, () => new Petal(true));
  }

  function animatePetals() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    petals.forEach((petal) => {
      petal.update();
      petal.draw();
    });

    requestAnimationFrame(animatePetals);
  }

  resizeCanvas();
  createPetals();
  animatePetals();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createPetals();
  });
});