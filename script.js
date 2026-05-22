document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const phaseSylus = document.getElementById('phase-sylus');
  const phaseGlitch = document.getElementById('phase-glitch');
  const phaseCaleb = document.getElementById('phase-caleb');
  const phaseFirewall = document.getElementById('phase-firewall');
  const masterFrame = document.getElementById('master-frame');
  
  const btnProceed = document.getElementById('btn-proceed');
  const btnSubmit = document.getElementById('btn-submit');
  const riddleInput = document.getElementById('riddle-answer');
  const tauntBox = document.getElementById('taunt-message');

  // Phase 1 Timing Logic (Sylus -> Glitch -> Caleb)
  setTimeout(() => {
    phaseSylus.classList.remove('active');
    phaseGlitch.classList.add('active');
    
    // Change border to glitch green
    masterFrame.classList.remove('border-sylus');
    masterFrame.style.borderColor = "#00ff41"; 
    
    setTimeout(() => {
      phaseGlitch.classList.remove('active');
      phaseCaleb.classList.add('active');
      
      // Change border to Caleb blue
      masterFrame.style.borderColor = "";
      masterFrame.classList.add('border-caleb');
    }, 1800); 
  }, 4500); 

  // Proceed Button Logic
  btnProceed.addEventListener('click', () => {
    phaseCaleb.classList.remove('active');
    phaseFirewall.classList.add('active');
  });

  // Riddle Logic
  const correctAnswers = ["your_secret_word"]; // Replace this with the actual word!
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
      
      // Trigger Phase 3 transition
      setTimeout(() => {
        alert("Transitioning to Phase 3: Physical Sync...");
        // startPhaseThree(); 
      }, 1500);
    } else {
      tauntBox.style.color = "#ff4d4d";
      tauntBox.innerText = taunts[attemptCount % taunts.length];
      attemptCount++;
      riddleInput.value = ""; 
    }
  });

});
