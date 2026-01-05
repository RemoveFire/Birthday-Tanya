/* =========================================================
   ОСНОВНЫЕ ЭЛЕМЕНТЫ
   ========================================================= */

const envelope = document.getElementById('envelope');
const start = document.getElementById('start');
const letter = document.getElementById('letter');
const video = document.getElementById('bgVideo');

const heroWords = document.querySelectorAll('.hero-title span');
const subtitle = document.getElementById('subtitle');
const scrollHint = document.getElementById('scrollHint');

const modal = document.getElementById('certificateModal');
const closeModal = document.getElementById('closeModal');
const mainContent = document.getElementById('mainContent');

const openPage = document.getElementById('openPage');
const downloadPdf = document.getElementById('downloadPdf');

const preloader = document.getElementById('preloader');
const progressBar = document.getElementById('preloaderProgress');

const heartFrame = document.getElementById('heartFrame');


/* =========================================================
   НАСТРОЙКИ ТЕКСТА
   ========================================================= */

const HERO_DELAY = 2000; // задержка перед первым словом
const HERO_STEP  = 700;  // задержка между словами


/* =========================================================
   НАСТРОЙКИ PNG-Анимации СЕРДЦА
   ========================================================= */

const TOTAL_FRAMES = 12;
const HEART_FRAMES = [];

// целевая частота кадров сердца (адаптивная)
const HEART_FPS = 10;
const FRAME_DURATION = 1000 / HEART_FPS;

let currentFrame = 0;
let lastFrameTime = 0;
let heartAnimationRunning = false;


/* =========================================================
   ПРЕДЗАГРУЗКА РЕСУРСОВ (PNG + VIDEO)
   ========================================================= */

const resources = [];
let loadedResources = 0;

// PNG кадры сердца
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = `img/frame${String(i).padStart(2, '0')}.png`;
  HEART_FRAMES.push(img);
  resources.push(img);
}

// Видео
resources.push(video);


/* =========================================================
   ОБНОВЛЕНИЕ ПРОГРЕССА ЗАГРУЗКИ
   ========================================================= */

function updateProgress() {
  loadedResources++;
  const percent = Math.round((loadedResources / resources.length) * 100);
  progressBar.style.width = percent + '%';

  if (loadedResources === resources.length) {
    startApp();
  }
}

// подписываемся на загрузку
resources.forEach(res => {
  if (res.tagName === 'VIDEO') {
    res.addEventListener('canplaythrough', updateProgress, { once: true });
    res.load();
  } else {
    res.onload = updateProgress;
  }
});


/* =========================================================
   REQUESTANIMATIONFRAME АНИМАЦИЯ СЕРДЦА
   ========================================================= */

function animateHeart(timestamp) {
  if (!heartAnimationRunning) return;

  if (timestamp - lastFrameTime >= FRAME_DURATION) {
    currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
    heartFrame.src = HEART_FRAMES[currentFrame].src;
    lastFrameTime = timestamp;
  }

  requestAnimationFrame(animateHeart);
}

function startHeartAnimation() {
  if (heartAnimationRunning) return;
  heartAnimationRunning = true;
  requestAnimationFrame(animateHeart);
}


/* =========================================================
   ЗАПУСК ПРИЛОЖЕНИЯ ПОСЛЕ ЗАГРУЗКИ
   ========================================================= */

function startApp() {
  // плавно убираем прелоадер
  preloader.style.opacity = '0';
  setTimeout(() => preloader.remove(), 600);

  // стартуем сердце
  startHeartAnimation();
}


/* =========================================================
   ПЕЧАТЬ ТЕКСТА (H2)
   ========================================================= */

function typeText(text, element, speed = 60) {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    element.textContent += text[i++];
    if (i === text.length) clearInterval(timer);
  }, speed);
}


/* =========================================================
   КЛИК ПО СЕРДЦУ → ОСНОВНАЯ СЦЕНА
   ========================================================= */

envelope.addEventListener('click', async () => {
  start.style.opacity = '0';

  setTimeout(async () => {
    start.style.display = 'none';
    letter.classList.add('active');

    await document.fonts.ready;
    video.play().catch(() => {});

    const heroTexts = ['С', 'Днём', 'Рождения', '!'];

    heroWords.forEach((word, i) => {
      word.textContent = heroTexts[i] || '';
      setTimeout(() => {
        word.style.opacity = 1;
      }, HERO_DELAY + i * HERO_STEP);
    });

    const heroTotalTime = HERO_DELAY + heroTexts.length * HERO_STEP;

    setTimeout(() => {
      typeText('У меня для тебя особенный подарок', subtitle);

      setTimeout(() => {
        scrollHint.classList.add('show');
      }, 6000);

    }, heroTotalTime);

  }, 900);
});


/* =========================================================
   МОДАЛЬНОЕ ОКНО
   ========================================================= */

mainContent.addEventListener('click', () => {
  letter.classList.add('fading');
  modal.classList.add('show');
  mainContent.classList.add('hidden');
  scrollHint.classList.remove('show');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
  mainContent.classList.remove('hidden');
  letter.classList.remove('fading');
});


/* =========================================================
   КНОПКИ
   ========================================================= */

openPage.addEventListener('click', () => {
  window.open('certificate.html', '_blank');
});

downloadPdf.addEventListener('click', () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    window.open('Сертификат.pdf', '_blank');
  } else {
    const link = document.createElement('a');
    link.href = 'Сертификат.pdf';
    link.download = 'Сертификат.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
