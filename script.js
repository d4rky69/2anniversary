document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const body = document.body;
  const sylusFrame = document.getElementById('sylus-frame');
  const calebFrame = document.getElementById('caleb-frame');
  const crowsContainer = document.getElementById('crows-container');
  const calebBgElements = document.getElementById('caleb-bg-elements');
  const finaleScreen = document.getElementById('finale-screen');
  
  const phaseGlitch = document.getElementById('phase-glitch');
  const phaseCaleb = document.getElementById('phase-caleb');
  const phaseFirewall = document.getElementById('phase-firewall');
  const phasePhotoStack = document.getElementById('phase-photo-stack');
  const cardStack = document.getElementById('card-stack');
  
  const btnProceed = document.getElementById('btn-proceed');
  const tapInstruction = document.getElementById('tap-instruction');
  const tauntBox = document.getElementById('taunt-message');

  // --- 0. GLOBAL UI (Ripples, Fullscreen, Music) ---
  
  // Tap Ripples
  document.addEventListener('click', (e) => {
    // Prevent ripple on UI buttons to avoid visual mess
    if(e.target.closest('.global-ui') || e.target.closest('button') || e.target.tagName === 'INPUT') return;
    
    const ripple = document.createElement('div');
    ripple.className = 'tap-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // Fullscreen Logic
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      document.exitFullscreen();
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  });

  // Music Player Logic
  const bgMusic = document.getElementById('bg-music');
  const cdPlayer = document.getElementById('cd-player');
  const musicMenu = document.getElementById('music-menu');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const volSlider = document.getElementById('volume-slider');

  cdPlayer.addEventListener('click', () => {
    musicMenu.classList.toggle('hidden');
  });

  playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      cdPlayer.classList.remove('paused');
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      bgMusic.pause();
      cdPlayer.classList.add('paused');
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });

  volSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
  });


  // --- 1. SPAWN BACKGROUND AMBIENCE ---
  function spawnCrows() {
    for (let i = 0; i < 5; i++) {
      let crow = document.createElement('div');
      crow.classList.add('crow');
      crow.style.top = Math.random() * 80 + 'vh';
      crow.style.animationDuration = (Math.random() * 3 + 5) + 's'; 
      crow.style.animationDelay = (Math.random() * 2) + 's';
      crowsContainer.appendChild(crow);
    }
  }
  
  function spawnPlanesAndApples() {
    const emojis = ['✈️', '🍎', '✈️'];
    setInterval(() => {
      let item = document.createElement('div');
      item.classList.add(Math.random() > 0.5 ? 'plane' : 'apple');
      item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      item.style.left = (Math.random() * 100) + 'vw';
      item.style.animationDuration = (Math.random() * 5 + 6) + 's';
      calebBgElements.appendChild(item);
      setTimeout(() => item.remove(), 12000);
    }, 1800);
  }
  spawnCrows();

  // --- 2. INTERACTIVE TAP TO SHATTER LOGIC ---
  let tapCount = 0;
  sylusFrame.addEventListener('click', () => {
    if (tapCount >= 3) return; 
    tapCount++;
    sylusFrame.style.transform = 'scale(0.95)';
    setTimeout(() => { sylusFrame.style.transform = 'scale(1)'; }, 150);

    if (tapCount === 1) { tapInstruction.innerText = "Tap 2 more times..."; } 
    else if (tapCount === 2) { tapInstruction.innerText = "One more..."; tapInstruction.style.color = "#ff4d4d"; } 
    else if (tapCount === 3) { tapInstruction.innerText = "SYSTEM CRITICAL"; triggerOverride(); }
  });

  function triggerOverride() {
    sylusFrame.classList.add('shattering');
    body.classList.remove('theme-sylus-bg');
    body.classList.add('theme-caleb-bg');

    calebFrame.classList.remove('hidden');
    calebFrame.classList.add('active-frame');
    phaseGlitch.classList.add('active');
    
    setTimeout(() => {
      sylusFrame.style.display = 'none';
      crowsContainer.style.display = 'none';
      calebBgElements.style.display = 'block';
      spawnPlanesAndApples();
    }, 1500);

    setTimeout(() => {
      phaseGlitch.classList.remove('active');
      phaseCaleb.classList.add('active');
    }, 2200); 
  }

  btnProceed.addEventListener('click', () => {
    phaseCaleb.classList.remove('active');
    phaseFirewall.classList.add('active');
    loadQuestion();
  });

  // --- 3. INTIMATE QUIZ LOGIC ---
  const quizData = [
    {
      q: "Where would I kiss you the most?",
      options: ["On your neck", "On your lips", "On your feet"]
    },
    {
      q: "What is my absolute favorite thing to do when we are alone in the dark?",
      options: ["Run my hands all over you", "Just cuddle and fall asleep", "Watch a movie in silence"]
    },
    {
      q: "What's my favorite spot to leave a mark to remind everyone you're mine?",
      options: ["Right on your collarbone", "On your cheek", "On your hand"]
    }
  ];

  let currentQ = 0;
  const quizProgress = document.getElementById('quiz-progress');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptionsBox = document.getElementById('quiz-options');
  const taunts = [
    "Try again, Mini. Keep your eyes on me.",
    "Wrong. Are you even trying? Don't make me come over there.",
    "Not quite, sweetheart. I expect better memory from you."
  ];

  function loadQuestion() {
    if (currentQ >= quizData.length) {
      calebFrame.style.display = 'none';
      phasePhotoStack.classList.remove('hidden');
      initPhotoStack();
      return;
    }

    quizProgress.innerText = `QUESTION ${currentQ + 1} / 3`;
    quizQuestion.innerText = quizData[currentQ].q;
    quizOptionsBox.innerHTML = '';
    tauntBox.innerText = '';

    quizData[currentQ].options.forEach((opt, index) => {
      let btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(index);
      quizOptionsBox.appendChild(btn);
    });
  }

  function checkAnswer(selectedIndex) {
    if (selectedIndex === 0) { 
      tauntBox.style.color = "#00ff41";
      tauntBox.style.textShadow = "0 0 10px rgba(0,255,65,0.5)";
      tauntBox.innerText = "Good girl. Firewall breached.";
      setTimeout(() => {
        currentQ++;
        loadQuestion();
      }, 1200);
    } else {
      tauntBox.style.color = "#ff4d4d";
      tauntBox.style.textShadow = "0 0 10px rgba(255,71,87,0.5)";
      tauntBox.innerText = taunts[Math.floor(Math.random() * taunts.length)];
    }
  }

  // --- 4. OPTIMIZED INTERACTIVE PHOTO STACK LOGIC ---
  const totalPhotos = 25; 
  let cards = [];
  
  function initPhotoStack() {
    for (let i = totalPhotos - 1; i >= 0; i--) {
      let card = document.createElement('div');
      card.className = 'photo-card';
      card.dataset.index = i;
      
      let img = document.createElement('img');
      img.src = `${i}.jpg`; // Expects 0.jpg through 24.jpg
      img.onerror = function() { this.src = 'placeholder.jpg'; }; 
      card.appendChild(img);
      
      let rotation = Math.floor(Math.random() * 16) - 8; 
      let xOffset = Math.floor(Math.random() * 16) - 8; 
      let yOffset = Math.floor(Math.random() * 16) - 8;
      
      let baseTransform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
      card.dataset.baseTransform = baseTransform;
      card.style.transform = baseTransform;
      card.style.zIndex = totalPhotos - i;
      
      cardStack.appendChild(card);
      cards.push(card);
    }
    
    cards.reverse();
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('drop-in');
        setTimeout(() => {
          card.classList.remove('drop-in');
          card.style.opacity = 1; 
        }, 600);
      }, (totalPhotos - index) * 80); 
    });

    setTimeout(enableDragLogic, totalPhotos * 80 + 600);
  }

  function enableDragLogic() {
    let activeCardIndex = 0;
    
    function attachDrag(card) {
      if (!card) return;
      
      let isDragging = false;
      let startX = 0, currentX = 0;
      
      // Pointer events for ultra-smooth tracking on mobile/desktop
      card.addEventListener('pointerdown', e => {
        isDragging = true;
        startX = e.clientX;
        card.style.transition = 'none'; 
        card.style.cursor = 'grabbing';
        card.setPointerCapture(e.pointerId);
      });

      card.addEventListener('pointermove', e => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        let dragRotation = currentX * 0.05; 
        // Moves the card based on finger distance
        card.style.transform = `${card.dataset.baseTransform} translate(${currentX}px, ${Math.abs(currentX)*0.1}px) rotate(${dragRotation}deg)`;
      });

      card.addEventListener('pointerup', e => {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';
        card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Threshold to swipe away
        if (currentX > 120 || currentX < -120) {
          handleCardRemoval(card, currentX);
        } else {
          // Snap back
          card.style.transform = card.dataset.baseTransform;
        }
        currentX = 0;
        card.releasePointerCapture(e.pointerId);
      });
    }

    function handleCardRemoval(card, throwDistance) {
      if (activeCardIndex === totalPhotos - 1) {
        triggerBurnAndFinale(card);
        return;
      }

      // Throw physics
      let throwX = throwDistance > 0 ? window.innerWidth : -window.innerWidth;
      card.style.transform = `translate(${throwX}px, 100px) rotate(${throwDistance * 0.1}deg)`;
      card.style.opacity = '0';
      
      setTimeout(() => { card.remove(); }, 400);

      activeCardIndex++;
      attachDrag(cards[activeCardIndex]);
    }

    attachDrag(cards[activeCardIndex]);
  }

  function triggerBurnAndFinale(lastCard) {
    lastCard.style.transform = lastCard.dataset.baseTransform;
    lastCard.classList.add('burn-effect');

    setTimeout(() => {
      phasePhotoStack.style.display = 'none';
      finaleScreen.classList.remove('hidden');
      setTimeout(() => { finaleScreen.classList.add('active'); }, 50);
    }, 1800);
  }

});
