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
      item.style.animationDuration = (Math.random() * 5 + 5) + 's';
      calebBgElements.appendChild(item);
      
      setTimeout(() => item.remove(), 10000); // cleanup
    }, 1500);
  }
  spawnCrows();

  // --- 2. INTERACTIVE TAP TO SHATTER LOGIC ---
  let tapCount = 0;
  sylusFrame.addEventListener('click', () => {
    if (tapCount >= 3) return; 
    tapCount++;
    sylusFrame.style.transform = 'scale(0.96)';
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
    }, 1800); 
  }

  btnProceed.addEventListener('click', () => {
    phaseCaleb.classList.remove('active');
    phaseFirewall.classList.add('active');
    loadQuestion();
  });

  // --- 3. INTIMATE QUIZ LOGIC ---
  // Option 1 (index 0) is ALWAYS the correct answer per your instructions.
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
      // Quiz Complete - Move to Calendar
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
    if (selectedIndex === 0) { // 0 is always correct
      tauntBox.style.color = "#00ff41";
      tauntBox.innerText = "Good girl. Firewall breached.";
      setTimeout(() => {
        currentQ++;
        loadQuestion();
      }, 1200);
    } else {
      tauntBox.style.color = "#ff4d4d";
      tauntBox.innerText = taunts[Math.floor(Math.random() * taunts.length)];
    }
  }

  // --- 4. 24-MONTH CALENDAR & SWIPE LOGIC ---
  const months = [
    "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", 
    "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025",
    "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025",
    "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026"
  ];
  
  let currentMonthIndex = 0;
  const monthLabel = document.getElementById('month-label');
  const monthImage = document.getElementById('month-image');
  const swipeTarget = document.getElementById('swipe-target');
  const calInstruction = document.getElementById('calendar-instruction');

  function initCalendar() {
    updateCalendarUI();
  }

  function updateCalendarUI() {
    monthLabel.innerText = months[currentMonthIndex];
    // IMPORTANT: Name your images 0.jpg, 1.jpg, up to 24.jpg in your folder!
    // For now, it will look for them. If not found, it shows the placeholder.
    monthImage.src = `${currentMonthIndex}.jpg`; 
    monthImage.onerror = function() { this.src = 'placeholder.jpg'; }; // Fallback

    if (currentMonthIndex === months.length - 1) {
      calInstruction.innerText = "SWIPE UP TO UNLOCK THE PRESENT";
      calInstruction.classList.add('swipe-anim');
      enableSwipe();
    } else {
      calInstruction.innerText = "Tap card for next month";
      calInstruction.classList.remove('swipe-anim');
    }
  }

  // Tap to progress months
  swipeTarget.addEventListener('click', () => {
    if (currentMonthIndex < months.length - 1) {
      currentMonthIndex++;
      swipeTarget.style.transform = 'scale(0.95)';
      setTimeout(() => swipeTarget.style.transform = 'scale(1)', 150);
      updateCalendarUI();
    }
  });

  // Swipe Up Logic for the Final Month
  function enableSwipe() {
    let startY = 0;
    swipeTarget.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    swipeTarget.addEventListener('touchend', e => {
      let endY = e.changedTouches[0].clientY;
      if (startY - endY > 50 && currentMonthIndex === months.length - 1) { 
        triggerFinale();
      }
    });

    // Also support mouse drag for desktop testing
    let isDragging = false;
    swipeTarget.addEventListener('mousedown', e => { isDragging = true; startY = e.clientY; });
    swipeTarget.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      if (startY - e.clientY > 50 && currentMonthIndex === months.length - 1) {
        triggerFinale();
      }
    });
  }

  function triggerFinale() {
    calebFrame.style.display = 'none'; // Hide the box completely
    finaleScreen.classList.remove('hidden');
    
    // Tiny delay to allow display:block to render before fading opacity
    setTimeout(() => {
      finaleScreen.classList.add('active');
    }, 50);
  }

});
