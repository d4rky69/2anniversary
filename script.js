document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const body = document.body;
  const sylusFrame = document.getElementById('sylus-frame');
  const calebFrame = document.getElementById('caleb-frame');
  const crowsContainer = document.getElementById('crows-container');
  
  const phaseGlitch = document.getElementById('phase-glitch');
  const phaseCaleb = document.getElementById('phase-caleb');
  const phaseFirewall = document.getElementById('phase-firewall');
  
  const btnProceed = document.getElementById('btn-proceed');
  const btnSubmit = document.getElementById('btn-submit');
  const riddleInput = document.getElementById('riddle-answer');
  const tauntBox = document.getElementById('taunt-message');

  // --- 1. SPAWN CROWS ---
  function spawnCrows() {
    for (let i = 0; i < 6; i++) {
      let crow = document.createElement('div');
      crow.classList.add('crow');
      // Randomize height and delay so they fly across naturally
      crow.style.top = Math.random() * 80 + 'vh';
      crow.style.animationDuration = (Math.random() * 3 + 5) + 's'; // 5 to 8 seconds
      crow.style.animationDelay = (Math.random() * 2) + 's';
      crowsContainer.appendChild(crow);
    }
  }
  spawnCrows();

  // --- 2. TIMING & SHATTER LOGIC ---
  setTimeout(() => {
    // 1. Shatter the Sylus Glass
    sylusFrame.classList.add('shattering');
    
    // 2. Change Background to Caleb Deep Blue
    body.classList.remove('theme-sylus-bg');
    body.classList.add('theme-caleb-bg');

    // 3. Reveal Caleb's Inner Frame (Glitch Phase starts instantly)
    calebFrame.classList.remove('hidden');
    calebFrame.classList.add('active-frame');
    phaseGlitch.classList.add('active');
    
    // 4. Clean up crows and shattered glass so they don't block taps
    setTimeout(() => {
      sylusFrame.style.display = 'none';
      crowsContainer.style.display = 'none';
    }, 1500);

    // 5. End Glitch, reveal Caleb text
    setTimeout(() => {
      phaseGlitch.classList.remove('active');
      phaseCaleb.classList.add('active');
    }, 1800); 

  }, 4500); // 4.5 seconds of Sylus bait

  // --- 3. PROCEED BUTTON ---
  btnProceed.addEventListener('click', () => {
    phaseCaleb.classList.remove('active');
    phaseFirewall.classList.add('active');
  });

  // --- 4. FIREWALL RIDDLE LOGIC ---
  const correctAnswers = ["your_secret_word"]; // Replace with the actual answer
  const taunts = [
    "Try again, Mini. I have all day, and you're only making me want to punish you for forgetting.",
    "Wrong again. Are you distracted? Keep your eyes on me.",
    "Not quite, sweetheart. I expect better from you."
  ];
  let attemptCount = 0;

  btnSubmit.addEventListener('click', () => {
    const input = riddleInput.value.toLowerCase().trim();

    if (correctAnswers.includes(input)) {
      tauntBox.style.color = "#00ff41";
      tauntBox.innerText = "Firewall breached. Good girl.";
      
      setTimeout(() => {
        alert("Transitioning to Phase 3: Physical Sync...");
        // Here is where we drop the screen hold logic next!
      }, 1500);
    } else {
      tauntBox.style.color = "#ff4d4d";
      tauntBox.innerText = taunts[attemptCount % taunts.length];
      attemptCount++;
      riddleInput.value = ""; 
    }
  });

});
