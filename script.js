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
  const phaseCalendar = document.getElementById('phase-calendar');
  
  const btnProceed = document.getElementById('btn-proceed');
  const tapInstruction = document.getElementById('tap-instruction');
  const tauntBox = document.getElementById('taunt-message');

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
      phaseFirewall.classList.remove('active');
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

  // --- 4. 3D FLIPPING TABLE CALENDAR LOGIC ---
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
      calInstruction.innerText = "SWIPE UP TO UNLOCK THE PRESENT";
    } else {
      calInstruction.innerText = "Swipe up to turn the page";
    }
  }

  function enableCalendarSwipe() {
    let startY = 0;
    let isFlipping = false;

    // Touch Support for Mobile
    calendarContainer.addEventListener('touchstart', e => { 
      startY = e.touches[0].clientY; 
    }, {passive: true});
    
    calendarContainer.addEventListener('touchend', e => {
      if (isFlipping) return;
      let endY = e.changedTouches[0].clientY;
      if (startY - endY > 40) { handlePageTurn(); }
    });

    // Mouse Drag Support for Desktop
    let isDragging = false;
    calendarContainer.addEventListener('mousedown', e => { 
      isDragging = true; startY = e.clientY; 
    });
    calendarContainer.addEventListener('mouseup', e => {
      if (!isDragging || isFlipping) return;
      isDragging = false;
      if (startY - e.clientY > 40) { handlePageTurn(); }
    });

    function handlePageTurn() {
      if (currentMonthIndex === months.length - 1) {
        triggerFinale();
        return;
      }

      isFlipping = true;
      
      // 1. Trigger the Flip UP animation
      calendarPage.classList.remove('turn-in');
      calendarPage.classList.add('turn-out');
      
      setTimeout(() => {
        // 2. Halfway through (when invisible), update the month content
        currentMonthIndex++;
        updateCalendarUI();
        
        // 3. Trigger the Flip DOWN animation
        calendarPage.classList.remove('turn-out');
        calendarPage.classList.add('turn-in');
        
        setTimeout(() => {
          isFlipping = false;
        }, 400); // Wait for turn-in to finish
      }, 400); // Wait for turn-out to finish
    }
  }

  function triggerFinale() {
    calebFrame.style.display = 'none'; 
    finaleScreen.classList.remove('hidden');
    setTimeout(() => { finaleScreen.classList.add('active'); }, 50);
  }

});
