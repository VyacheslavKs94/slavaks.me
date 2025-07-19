const hiSection = document.getElementById('hiSection');
const whoSection = document.getElementById('whoSection');
const workedSection = document.getElementById('workedSection');
const workingSection = document.getElementById('workingSection');
const arrow = document.getElementById('arrow');

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

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', onScroll);

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
const blobsCount = 4;
const blobs = [];
const blobsBg = document.querySelector('.blobs-bg');

function createBlobs() {
  for (let i = 0; i < blobsCount; i++) {
    const blob = document.createElement('div');
    blob.className = 'blob';
    blob.style.width = blob.style.height = `${320 + Math.random()*180}px`;
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
    // Положение зависит только от scrollY
    const baseLeft = 10 + i*20;
    const baseTop = 20 + i*15;
    const left = baseLeft + 12*Math.sin(scrollY/200 + i*1.2);
    const top = baseTop + 10*Math.cos(scrollY/180 + i*2);
    blob.style.left = `${left}%`;
    blob.style.top = `${top}%`;
  });
}

createBlobs();
window.addEventListener('scroll', updateBlobsOnScroll);
window.addEventListener('resize', updateBlobsOnScroll);
updateBlobsOnScroll(); 