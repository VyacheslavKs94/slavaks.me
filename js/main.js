const hiSection = document.getElementById('hiSection');
const whoSection = document.getElementById('whoSection');
const workedSection = document.getElementById('workedSection');
const workingSection = document.getElementById('workingSection');
const arrow = document.getElementById('arrow');

// Throttling функция для оптимизации производительности
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function onScroll() {
  const scrollY = window.scrollY;
  const wh = window.innerHeight;

  // Скрытие стрелки
  arrow.style.opacity = scrollY < 40 ? '0.7' : '0';

  // WHO AM I появляется после 10% первого экрана
  if (scrollY > wh * 0.1) {
    whoSection.classList.add('visible');
  } else {
    whoSection.classList.remove('visible');
  }

  // THINGS I WORKED ON появляется после 30% экранов
  if (scrollY > wh * 0.3) {
    workedSection.classList.add('visible');
  } else {
    workedSection.classList.remove('visible');
  }

  // THINGS I'M WORKING ON появляется после 50% экранов
  if (scrollY > wh * 0.5) {
    workingSection.classList.add('visible');
  } else {
    workingSection.classList.remove('visible');
  }
}

// Применяем throttling к функции скролла
const throttledOnScroll = throttle(onScroll, 16); // ~60fps

window.addEventListener('scroll', throttledOnScroll);
window.addEventListener('resize', throttledOnScroll);

document.body.style.minHeight = '250vh';

onScroll();

// === BLOBS BACKGROUND ===
const blobColors = [
  'hsl(260, 60%, 30%)', // тёмно-фиолетовый
  'hsl(200, 70%, 25%)', // тёмно-синий
  'hsl(170, 60%, 22%)', // тёмно-бирюзовый
  'hsl(340, 55%, 28%)', // тёмно-бордовый
  'hsl(120, 50%, 22%)', // тёмно-зелёный
  'hsl(30, 60%, 28%)',  // тёмно-оранжевый
  'hsl(220, 40%, 24%)', // графитово-синий
  'hsl(280, 50%, 26%)', // баклажан
  'hsl(190, 60%, 22%)', // глубокий сине-зелёный
  'hsl(50, 40%, 30%)',  // тёмно-жёлтый
];

// Адаптивное количество блобов в зависимости от размера экрана
const isMobile = window.innerWidth <= 700;
const blobsCount = isMobile ? 2 : 4;
const blobs = [];
const blobsBg = document.querySelector('.blobs-bg');

function createBlobs() {
  for (let i = 0; i < blobsCount; i++) {
    const blob = document.createElement('div');
    blob.className = 'blob';
    
    // Адаптивный размер блобов
    const baseSize = isMobile ? 200 : 320;
    const sizeVariation = isMobile ? 100 : 180;
    const size = baseSize + Math.random() * sizeVariation;
    
    blob.style.width = blob.style.height = `${size}px`;
    blob.style.left = `${10 + i*20 + Math.random()*20}%`;
    blob.style.top = `${20 + i*15 + Math.random()*10}%`;
    blob.style.background = blobColors[i % blobColors.length];
    blobsBg.appendChild(blob);
    blobs.push(blob);
  }
}

function updateBlobsOnScroll() {
  const scrollY = window.scrollY;
  const wh = window.innerHeight;
  blobs.forEach((blob, i) => {
    // Цвет зависит от scrollY и номера пятна
    const colorIdx = (i + Math.floor(scrollY / (wh/2))) % blobColors.length;
    blob.style.background = blobColors[colorIdx];
    
    // Базовые позиции для каждого блоба
    const baseLeft = 10 + i*20;
    const baseTop = 20 + i*15;
    
    // Анимация позиции с ограничениями (меньше движения на мобильных)
    const movementScale = isMobile ? 0.6 : 1;
    const leftOffset = 8 * movementScale * Math.sin(scrollY/300 + i*1.2);
    const topOffset = 6 * movementScale * Math.cos(scrollY/250 + i*2);
    
    // Ограничиваем позиции, чтобы блобы не уезжали за пределы экрана
    const left = Math.max(-10, Math.min(90, baseLeft + leftOffset));
    const top = Math.max(-10, Math.min(80, baseTop + topOffset));
    
    blob.style.left = `${left}%`;
    blob.style.top = `${top}%`;
  });
}

createBlobs();
// Применяем throttling к функции обновления блобов
const throttledUpdateBlobs = throttle(updateBlobsOnScroll, 16);
window.addEventListener('scroll', throttledUpdateBlobs);

// Обработчик изменения размера окна
function handleResize() {
  // Очищаем старые блобы
  blobsBg.innerHTML = '';
  blobs.length = 0;
  
  // Пересоздаем блобы с новыми параметрами
  createBlobs();
  updateBlobsOnScroll();
}

window.addEventListener('resize', throttle(handleResize, 250));
updateBlobsOnScroll(); 