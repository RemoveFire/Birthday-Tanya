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

const HERO_DELAY = 2000; // 2 секунды ожидания надписей после клика
const HERO_STEP = 700;

const TOTAL_FRAMES = 12;
const heartFrames = [];
let framesLoaded = 0;

function preloadHeartFrames(callback) {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `img/frame${String(i).padStart(2, '0')}.png`;
    img.onload = () => {
      framesLoaded++;
      if (framesLoaded === TOTAL_FRAMES) {
        callback();
      }
    };
    heartFrames.push(img);
  }
}


/* ❤️ PNG-анимация сердца */
// let frame = 1;
// const totalFrames = 12;
// const heartFrame = document.getElementById('heartFrame');

// setInterval(() => {
//   frame++;
//   if (frame > totalFrames) frame = 1;
//   heartFrame.src = `img/frame${String(frame).padStart(2, '0')}.png`;
// }, 120);
let frame = 0;
let heartInterval = null;

function startHeartAnimation() {
  if (heartInterval) return;

  heartInterval = setInterval(() => {
    frame++;
    if (frame >= TOTAL_FRAMES) frame = 0;
    heartFrame.src = heartFrames[frame].src;
  }, 120);
}


function typeText(text, element, speed = 60) {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    element.textContent += text[i++];
    if (i === text.length) clearInterval(timer);
  }, speed);
}

document.addEventListener('DOMContentLoaded', () => {
  preloadHeartFrames(() => {
    startHeartAnimation();
  });
});


envelope.addEventListener('click', async () => {
  start.style.opacity = '0';

  setTimeout(async () => {
    start.style.display = 'none';
    letter.classList.add('active');

    await document.fonts.ready;
    video.play().catch(() => {});

    // меняем текст span'ов программно
    const heroTexts = ['С', 'Днём', 'Рождения', '!'];

    heroWords.forEach((word, i) => {
      word.textContent = heroTexts[i] || '';
      setTimeout(() => {
        word.style.opacity = 1;
      }, HERO_DELAY + i * HERO_STEP);
    });

    // считаем, когда ВСЕ слова появились
    const heroTotalTime = HERO_DELAY + heroTexts.length * HERO_STEP;

    // только после этого печатаем h2
    setTimeout(() => {
      typeText(
        'У меня для тебя особенный подарок',
        subtitle
      );

      // и ещё через 6 сек — стрелка
      setTimeout(() => {
        scrollHint.classList.add('show');
      }, 6000);

    }, heroTotalTime);

  }, 900);
});


mainContent.addEventListener('click', () => {
  letter.classList.add('fading');   // затемнение + blur
  modal.classList.add('show');      // модалка
  mainContent.classList.add('hidden'); // текст гарантированно исчез
  scrollHint.classList.remove('show');
});


closeModal.addEventListener('click', () => {
  modal.classList.remove('show');       // убрали модалку
  mainContent.classList.remove('hidden'); // вернули текст
  letter.classList.remove('fading');    // убрали blur + затемнение
});


openPage.addEventListener('click', () => {
  window.open('certificate.html', '_blank');
});

downloadPdf.addEventListener('click', () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // iOS — открываем системный просмотрщик
    window.open('Сертификат.pdf', '_blank');
  } else {
    // Android / Desktop — нормальная загрузка
    const link = document.createElement('a');
    link.href = 'Сертификат.pdf';
    link.download = 'Сертификат.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
