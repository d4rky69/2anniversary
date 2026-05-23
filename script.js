document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const body = document.body;
  const masterFrame = document.getElementById('master-frame');
  const innerGlassPane = document.querySelector('.inner-glass-pane');
  const globalUI = document.querySelector('.global-ui');
  const crowsContainer = document.getElementById('crows-container');
  const calebBgElements = document.getElementById('caleb-bg-elements');
  const lockdownOverlay = document.getElementById('lockdown-overlay');
  
  // Array of all navigable phases (Glitch is handled separately as a transition)
  const phases = [
    document.getElementById('phase-sylus'),    // 0
    document.getElementById('phase-caleb'),    // 1
    document.getElementById('phase-firewall'), // 2
    document.getElementById('phase-calendar'), // 3
    document.getElementById('phase-sync'),     // 4
    document.getElementById('phase-letter'),   // 5
    document.getElementById('phase-finale'),   // 6
    document.getElementById('phase-dossier')   // 7
  ];
  
  let currentPhaseIndex = 0;
  let maxUnlockedPhase = 0; // Tracks the furthest she has progressed naturally

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // --- 0. GLOBAL UI & NAVIGATION ---
  document.addEventListener('pointerdown', (e) => {
    if(e.target.closest('.global-ui') || e.target.closest('button') || e.target.tagName === 'INPUT' || e.target.closest('.lightbox-content') || e.target.closest('.protocol-card') || e.target.id === 'fingerprint-btn' || e.target.tagName === 'TEXTAREA') return;
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

  // NAVIGATION LOGIC
  function updateNavButtons() {
    // Show/Hide Prev
    if (currentPhaseIndex > 0) prevBtn.classList.remove('hidden');
    else prevBtn.classList.add('hidden');

    // Show/Hide Next (only if she has naturally unlocked it)
    if (currentPhaseIndex < maxUnlockedPhase && currentPhaseIndex < phases.length - 1) {
        nextBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.add('hidden');
    }

    // Never show nav arrows on final Dossier or during shatter glitch
    if (currentPhaseIndex === 7 || masterFrame.classList.contains('shattering')) {
        nextBtn.classList.add('hidden');
    }

    // Trigger Letter Animation fresh every time she visits Phase 5
    if (currentPhaseIndex === 5) {
        playLetterAnimation();
    }
  }

  function advancePhase() {
    phases[currentPhaseIndex].classList.remove('active');
    phases[currentPhaseIndex].classList.add('hidden');
    currentPhaseIndex++;
    if (currentPhaseIndex > maxUnlockedPhase) maxUnlockedPhase = currentPhaseIndex;
    phases[currentPhaseIndex].classList.remove('hidden');
    phases[currentPhaseIndex].classList.add('active');
    updateNavButtons();
  }

  prevBtn.addEventListener('click', () => {
    if (currentPhaseIndex > 0) {
        phases[currentPhaseIndex].classList.remove('active');
        phases[currentPhaseIndex].classList.add('hidden');
        currentPhaseIndex--;
        phases[currentPhaseIndex].classList.remove('hidden');
        phases[currentPhaseIndex].classList.add('active');
        
        // Morph the box back to Sylus Red if we go to index 0
        if (currentPhaseIndex === 0) {
            masterFrame.classList.remove('blue-glass');
            masterFrame.classList.add('red-glass');
            body.classList.remove('theme-caleb-bg');
            body.classList.add('theme-sylus-bg');
        }
        updateNavButtons();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPhaseIndex < maxUnlockedPhase) {
        phases[currentPhaseIndex].classList.remove('active');
        phases[currentPhaseIndex].classList.add('hidden');
        currentPhaseIndex++;
        phases[currentPhaseIndex].classList.remove('hidden');
        phases[currentPhaseIndex].classList.add('active');
        
        // Restore Caleb Blue if moving past Sylus
        if (currentPhaseIndex > 0) {
            masterFrame.classList.remove('red-glass');
            masterFrame.classList.add('blue-glass');
            body.classList.remove('theme-sylus-bg');
            body.classList.add('theme-caleb-bg');
        }
        updateNavButtons();
    }
  });


  // LIGHTBOX LOGIC
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.getElementById('close-lightbox');
  const imagePopTrigger = document.getElementById('image-pop-trigger');
  const monthImage = document.getElementById('month-image');

  imagePopTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxImg.src = monthImage.src;
    lightbox.classList.remove('hidden');
    setTimeout(() => lightbox.classList.add('active'), 10);
  });
  closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    setTimeout(() => lightbox.classList.add('hidden'), 300);
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox.click(); 
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
  
  masterFrame.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.global-ui') || tapCount >= 3 || currentPhaseIndex !== 0) return; 
    
    const tapInstruction = document.getElementById('tap-instruction');
    tapCount++;
    masterFrame.style.transform = 'scale(0.96)';
    setTimeout(() => { masterFrame.style.transform = 'scale(1)'; }, 150);

    if (tapCount === 1) { 
        tapInstruction.innerText = "Tap 2 more times..."; 
    } else if (tapCount === 2) { 
        tapInstruction.innerText = "One more..."; 
        tapInstruction.style.color = "#ff4d4d"; 
    } else if (tapCount === 3) { 
        tapInstruction.innerText = "SYSTEM CRITICAL"; 
        triggerOverride(); 
    }
  });

  function triggerOverride() {
    masterFrame.classList.add('shattering');
    globalUI.style.opacity = '0'; 
    
    body.classList.remove('theme-sylus-bg');
    body.classList.add('theme-caleb-bg');

    const phaseGlitch = document.getElementById('phase-glitch');

    setTimeout(() => {
      phases[0].classList.remove('active');
      phases[0].classList.add('hidden');
      
      crowsContainer.style.display = 'none';
      calebBgElements.style.display = 'block';
      spawnPlanesAndApples();
      
      masterFrame.style.opacity = '0';
      
      setTimeout(() => {
        masterFrame.classList.remove('shattering', 'red-glass');
        masterFrame.classList.add('blue-glass');
        innerGlassPane.style.opacity = '1';
        
        void masterFrame.offsetWidth; 
        
        masterFrame.style.opacity = '1';
        globalUI.style.opacity = '1'; 
        
        phaseGlitch.classList.remove('hidden');
        phaseGlitch.classList.add('active');
      }, 100); 

    }, 1200);

    setTimeout(() => {
      phaseGlitch.classList.remove('active');
      phaseGlitch.classList.add('hidden');
      
      // Officially move to Caleb Phase
      currentPhaseIndex = 1;
      maxUnlockedPhase = 1;
      phases[1].classList.remove('hidden');
      phases[1].classList.add('active');
      updateNavButtons();
    }, 2800); 
  }

  document.getElementById('btn-proceed').addEventListener('click', advancePhase);


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
  const tauntBox = document.getElementById('taunt-message');
  const taunts = ["Try again, Mini. Keep your eyes on me.", "Wrong. Are you even trying?", "Not quite, sweetheart."];

  function loadQuestion() {
    if (currentQ >= quizData.length) {
      advancePhase(); // Go to Calendar
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

  // >>> FIX APPLIED HERE: Initialize the first question in the background <<<
  loadQuestion();


  // --- 4. FLIPPING TABLE CALENDAR ---
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
  const calInstruction = document.getElementById('calendar-instruction');

  function initCalendar() {
    updateCalendarUI();
    enableCalendarSwipe();
  }

  function updateCalendarUI() {
    monthLabel.innerText = months[currentMonthIndex];
    document.getElementById('month-image').src = `${currentMonthIndex}.jpg`; 
    document.getElementById('month-image').onerror = function() { this.src = 'placeholder.jpg'; };

    if (currentMonthIndex === months.length - 1) {
      calInstruction.innerText = "TAP OR SWIPE TO BURN THE PAST";
      calInstruction.style.color = "#ff4d4d";
    } else {
      calInstruction.innerText = "Tap or swipe to turn page";
      calInstruction.style.color = "#aaa";
    }
  }

  function enableCalendarSwipe() {
    let startY = 0;
    let isFlipping = false;
    let hasDragged = false;

    calendarContainer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; hasDragged = false;}, {passive: true});
    calendarContainer.addEventListener('touchmove', e => { if(Math.abs(e.touches[0].clientY - startY) > 5) hasDragged = true; }, {passive: true});
    calendarContainer.addEventListener('touchend', e => {
      if (isFlipping) return;
      if ((startY - e.changedTouches[0].clientY > 40) || !hasDragged) { handlePageTurn(); }
    });

    let isDraggingMouse = false;
    calendarContainer.addEventListener('mousedown', e => { isDraggingMouse = true; startY = e.clientY; hasDragged = false;});
    calendarContainer.addEventListener('mousemove', e => { if(isDraggingMouse && Math.abs(e.clientY - startY) > 5) hasDragged = true; });
    calendarContainer.addEventListener('mouseup', e => {
      if (!isDraggingMouse || isFlipping) return;
      isDraggingMouse = false;
      if ((startY - e.clientY > 40) || !hasDragged) { handlePageTurn(); }
    });

    function handlePageTurn() {
      if (currentMonthIndex === months.length - 1) {
        calendarContainer.classList.add('burn-effect');
        calInstruction.style.opacity = '0';
        setTimeout(() => {
          advancePhase(); // Go to Physical Sync
          initSyncPhase();
        }, 1500);
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


  // --- 5. PHYSICAL SYNC LOGIC ---
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
    fingerprintBtn.addEventListener('pointerleave', stopSync); 
  }

  function startSync(e) {
    e.preventDefault(); 
    syncStatus.innerText = "Syncing... Do not let go.";
    syncStatus.style.color = "#00ff41";
    if(navigator.vibrate) navigator.vibrate([100, 100, 100, 100, 100, 100]); 

    syncTimer = setInterval(() => {
      textStage++;
      if(textStage === 1) { text1.innerText = "Sylus can give you danger in a simulation, Mini."; text1.classList.add('visible'); } 
      else if (textStage === 2) { text2.innerText = "But he can't feel it when your breath catches. I can."; text2.classList.add('visible'); } 
      else if (textStage === 3) { text3.innerText = "Game over. My turn."; text3.classList.add('visible'); } 
      else if (textStage === 5) {
        clearInterval(syncTimer);
        advancePhase(); // Go to Anniversary Letter
      }
    }, 1200); 
  }

  function stopSync() {
    clearInterval(syncTimer);
    if (textStage < 5) { 
      textStage = 0;
      syncStatus.innerText = "Connection lost. I said don't pull away.";
      syncStatus.style.color = "#ff4d4d";
      text1.classList.remove('visible'); text2.classList.remove('visible'); text3.classList.remove('visible');
      if(navigator.vibrate) navigator.vibrate(0); 
    }
  }

  // --- 6. THE ANNIVERSARY LETTER & PILLS ---
  let letterTimers = [];

  function playLetterAnimation() {
    // Clear old timers if she navigated quickly
    letterTimers.forEach(t => clearTimeout(t));
    letterTimers = [];

    // Reset Pill State
    document.getElementById('red-pill').classList.remove('burst', 'hidden');
    document.getElementById('blue-pill').classList.remove('burst', 'hidden');
    document.getElementById('pill-container').classList.add('hidden');
    document.getElementById('pill-popup').classList.add('hidden');
    document.getElementById('pill-answer').value = "";
    
    // Reset Text Lines
    const lines = document.querySelectorAll('.letter-line');
    lines.forEach(line => line.classList.remove('visible'));
    
    // Staggered Fade In
    lines.forEach((line, index) => {
        let t = setTimeout(() => { line.classList.add('visible'); }, 800 * (index + 1));
        letterTimers.push(t);
    });
    
    // Fade in Pills
    let finalT = setTimeout(() => {
        const pContainer = document.getElementById('pill-container');
        pContainer.classList.remove('hidden');
        pContainer.style.opacity = 1;
    }, 800 * (lines.length + 1));
    letterTimers.push(finalT);
  }

  // Global function for the pill buttons
  window.choosePill = function(color) {
      const red = document.getElementById('red-pill');
      const blue = document.getElementById('blue-pill');
      const popup = document.getElementById('pill-popup');
      const question = document.getElementById('pill-question');
      
      if (color === 'red') {
          blue.classList.add('burst');
          setTimeout(() => blue.classList.add('hidden'), 500);
          question.innerText = "If you got a chance to go back to your past (2019), would you find me and start it all over?";
          popup.style.boxShadow = "inset 4px 4px 0px rgba(0,0,0,0.5), 0 10px 30px rgba(255, 77, 77, 0.4)";
          question.style.color = "#ff4d4d";
          question.style.textShadow = "0 0 15px rgba(255, 77, 77, 0.6)";
      } else {
          red.classList.add('burst');
          setTimeout(() => red.classList.add('hidden'), 500);
          question.innerText = "If you were given the chance to do something for me, what's the biggest thing you would do?";
          popup.style.boxShadow = "inset 4px 4px 0px rgba(0,0,0,0.5), 0 10px 30px rgba(100, 200, 255, 0.4)";
          question.style.color = "#64c8ff";
          question.style.textShadow = "0 0 15px rgba(100, 200, 255, 0.6)";
      }
      
      setTimeout(() => { popup.classList.remove('hidden'); }, 400);
  }

  window.submitPill = function() {
      advancePhase(); // Go to Finale
  }

  // --- 7. FINALE & INTIMATE DOSSIER ---
  document.getElementById('btn-claim').addEventListener('click', advancePhase); // Go to Dossier

  window.selectProtocol = function(card) {
    const isExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.protocol-card').forEach(c => c.classList.remove('expanded'));
    if (!isExpanded) card.classList.add('expanded');
  };

  document.querySelectorAll('.initiate-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      lockdownOverlay.classList.remove('hidden');
      setTimeout(() => { lockdownOverlay.classList.add('active'); }, 50);
    });
  });

});
