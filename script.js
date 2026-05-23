document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const body = document.body;
  const sylusFrame = document.getElementById('phase-sylus');
  const masterFrame = document.getElementById('master-frame');
  const crowsContainer = document.getElementById('crows-container');
  const calebBgElements = document.getElementById('caleb-bg-elements');
  
  const phaseGlitch = document.getElementById('phase-glitch');
  const phaseCaleb = document.getElementById('phase-caleb');
  const phaseFirewall = document.getElementById('phase-firewall');
  const phaseCalendar = document.getElementById('phase-calendar');
  const phaseSync = document.getElementById('phase-sync');
  const phaseFinale = document.getElementById('phase-finale');
  
  const btnProceed = document.getElementById('btn-proceed');
  const tapInstruction = document.getElementById('tap-instruction');
  const tauntBox = document.getElementById('taunt-message');

  // --- 0. GLOBAL UI (Ripples, Fullscreen, Music) ---
  document.addEventListener('click', (e) => {
    if(e.target.closest('.global-ui') || e.target.closest('button') || e.target.tagName === 'INPUT' || e.target.id === 'fingerprint-btn') return;
    const ripple = document.createElement('div');
    ripple.className = 'tap-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

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

  const bgMusic = document.getElementById('bg-music');
  const cdPlayer = document.getElementById('cd-player');
  const musicMenu = document.getElementById('music-menu');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const volSlider = document.getElementById('volume-slider');

  cdPlayer.addEventListener('click', () => { musicMenu.classList.toggle('hidden'); });
  playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play(); cdPlayer.classList.remove('paused');
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      bgMusic.pause(); cdPlayer.classList.add('paused');
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });
  volSlider.addEventListener('input', (e) => { bgMusic.volume = e.target.value; });


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
    masterFrame.style.transform = 'scale(0.96)';
    setTimeout(() => { masterFrame.style.transform = 'scale(1)'; }, 150);

    if (tapCount === 1) { tapInstruction.innerText = "Tap 2 more times..."; } 
    else if (tapCount === 2) { tapInstruction.innerText = "One more..."; tapInstruction.style.color = "#ff4d4d"; } 
    else if (tapCount === 3) { tapInstruction.innerText = "SYSTEM CRITICAL"; triggerOverride(); }
  });

  function triggerOverride() {
    masterFrame.classList.add('shattering');
    body.classList.remove('theme-sylus-bg');
    body.classList.add('theme-caleb-bg');

    phaseGlitch.classList.remove('hidden');
    phaseGlitch.classList.add('active');
    
    setTimeout(() => {
      sylusFrame.classList.remove('active');
      sylusFrame.classList.add('hidden');
      crowsContainer.style.display = 'none';
      calebBgElements.style.display = 'block';
      spawnPlanesAndApples();
      
      // Morph the main box to Caleb styling
      masterFrame.classList.remove('shattering', 'red-glass');
      masterFrame.classList.add('blue-glass');
    }, 1200);

    setTimeout(() => {
      phaseGlitch.classList.remove('active');
      phaseGlitch.classList.add('hidden');
      phaseCaleb.classList.remove('hidden');
      phaseCaleb.classList.add('active');
    }, 2200); 
  }

  btnProceed.addEventListener('click', () => {
    phaseCaleb.classList.remove('active');
    phaseCaleb.classList.add('hidden');
    phaseFirewall.classList.remove('hidden');
    phaseFirewall.classList.add('active');
    loadQuestion();
  });

  // --- 3. INTIMATE QUIZ LOGIC ---
  const quizData = [
    { q: "Where would I kiss you the most?", options: ["On your neck", "On your lips", "On your feet"] },
    { q: "What is my absolute favorite thing to do when we are alone in the dark?", options: ["Run my hands all over you", "Just cuddle and fall asleep", "Watch a movie in silence"] },
    { q: "What's my favorite spot to leave a mark to remind everyone you're mine?", options: ["Right on your collarbone", "On your cheek", "On your hand"] }
  ];

  let currentQ = 0;
  const quizProgress = document.getElementById('quiz-progress');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptionsBox = document.getElementById('quiz-options');
  const taunts = ["Try again, Mini. Keep your eyes on me.", "Wrong. Are you even trying?", "Not quite, sweetheart."];

  function loadQuestion() {
    if (currentQ >= quizData.length) {
      phaseFirewall.classList.remove('active');
      phaseFirewall.classList.add('hidden');
      phaseCalendar.classList.remove('hidden');
      phaseCalendar.classList.add('active');
      initCalendar();
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
      tauntBox.innerText = "Good girl. Firewall breached.";
      setTimeout(() => { currentQ++; loadQuestion(); }, 1200);
    } else {
      tauntBox.style.color = "#ff4d4d";
      tauntBox.innerText = taunts[Math.floor(Math.random() * taunts.length)];
    }
  }

  // --- 4. FLIPPING TABLE CALENDAR (Smoother Swipe) ---
  const months = [
    "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", 
    "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025",
    "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025",
    "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026"
  ];
  
  let currentMonthIndex = 0;
  const calendarContainer = document.getElementById('calendar-container');
  const calendarPage = document.getElementById('calendar-page');
  const monthLabel = document.getElementById('month-label');
  const monthImage = document.getElementById('month-image');
  const calInstruction = document.getElementById('calendar-instruction');

  function initCalendar() {
    updateCalendarUI();
    enableCalendarSwipe();
  }

  function updateCalendarUI() {
    monthLabel.innerText = months[currentMonthIndex];
    monthImage.src = `${currentMonthIndex}.jpg`; 
    monthImage.onerror = function() { this.src = 'placeholder.jpg'; };

    if (currentMonthIndex === months.length - 1) {
      calInstruction.innerText = "SWIPE UP TO BURN THE PAST";
      calInstruction.style.color = "#ff4d4d";
    } else {
      calInstruction.innerText = "Swipe up to turn the page";
      calInstruction.style.color = "#aaa";
    }
  }

  function enableCalendarSwipe() {
    let startY = 0;
    let isFlipping = false;

    // Mobile touch
    calendarContainer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive: true});
    calendarContainer.addEventListener('touchend', e => {
      if (isFlipping) return;
      if (startY - e.changedTouches[0].clientY > 40) { handlePageTurn(); }
    });

    // Desktop mouse
    let isDragging = false;
    calendarContainer.addEventListener('mousedown', e => { isDragging = true; startY = e.clientY; });
    calendarContainer.addEventListener('mouseup', e => {
      if (!isDragging || isFlipping) return;
      isDragging = false;
      if (startY - e.clientY > 40) { handlePageTurn(); }
    });

    function handlePageTurn() {
      if (currentMonthIndex === months.length - 1) {
        triggerBurnAndSync();
        return;
      }

      isFlipping = true;
      calendarPage.classList.remove('turn-in');
      calendarPage.classList.add('turn-out');
      
      setTimeout(() => {
        currentMonthIndex++;
        updateCalendarUI();
        
        calendarPage.classList.remove('turn-out');
        calendarPage.classList.add('turn-in');
        
        setTimeout(() => { isFlipping = false; }, 350); 
      }, 350); 
    }
  }

  function triggerBurnAndSync() {
    calendarContainer.classList.add('burn-effect');
    calInstruction.style.opacity = '0';
    
    setTimeout(() => {
      phaseCalendar.classList.remove('active');
      phaseCalendar.classList.add('hidden');
      phaseSync.classList.remove('hidden');
      phaseSync.classList.add('active');
      initSyncPhase();
    }, 1500);
  }

  // --- 5. PHYSICAL SYNC (The Future Plans) ---
  const fingerprintBtn = document.getElementById('fingerprint-btn');
  const syncStatus = document.getElementById('sync-status');
  const text1 = document.getElementById('sync-text-1');
  const text2 = document.getElementById('sync-text-2');
  const text3 = document.getElementById('sync-text-3');
  
  let syncTimer;
  let textStage = 0;

  function initSyncPhase() {
    fingerprintBtn.addEventListener('pointerdown', startSync);
    fingerprintBtn.addEventListener('pointerup', stopSync);
    fingerprintBtn.addEventListener('pointerleave', stopSync); // In case finger slides off
  }

  function startSync(e) {
    e.preventDefault(); // Prevents default browser behaviors like highlighting
    syncStatus.innerText = "Syncing... Do not let go.";
    syncStatus.style.color = "#00ff41";
    
    // Vibrate phone if supported
    if(navigator.vibrate) navigator.vibrate([100, 100, 100, 100, 100, 100]); 

    syncTimer = setInterval(() => {
      textStage++;
      if(textStage === 1) {
        text1.innerText = "Sylus can give you danger in a simulation, Mini.";
        text1.classList.add('visible');
      } else if (textStage === 2) {
        text2.innerText = "But he can't feel it when your breath catches. I can.";
        text2.classList.add('visible');
      } else if (textStage === 3) {
        text3.innerText = "Game over. My turn.";
        text3.classList.add('visible');
      } else if (textStage === 5) {
        // Hold for a second after text finishes, then trigger finale
        clearInterval(syncTimer);
        triggerFinale();
      }
    }, 1200); // Reveals a new line every 1.2 seconds she holds
  }

  function stopSync() {
    clearInterval(syncTimer);
    if (textStage < 5) { // Only reset if she didn't finish
      textStage = 0;
      syncStatus.innerText = "Connection lost. I said don't pull away.";
      syncStatus.style.color = "#ff4d4d";
      text1.classList.remove('visible');
      text2.classList.remove('visible');
      text3.classList.remove('visible');
      if(navigator.vibrate) navigator.vibrate(0); // Stop vibration
    }
  }

  function triggerFinale() {
    phaseSync.classList.remove('active');
    phaseSync.classList.add('hidden');
    phaseFinale.classList.remove('hidden');
    phaseFinale.classList.add('active');
  }

});
