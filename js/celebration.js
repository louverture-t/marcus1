// Celebration system for Marcus Savings
(function(){
  
  function createConfettiPiece(){
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const piece = document.createElement('div');
    
    piece.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 2px;
      pointer-events: none;
      z-index: 10000;
    `;
    
    return piece;
  }

  function animateConfettiPiece(piece, startX, startY){
    const angle = Math.random() * Math.PI * 2;
    const velocity = 150 + Math.random() * 100;
    const gravity = 300;
    const drag = 0.99;
    const rotationSpeed = Math.random() * 360 - 180;
    
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 200;
    let x = startX;
    let y = startY;
    let rotation = 0;
    let opacity = 1;
    
    const startTime = Date.now();
    const duration = 3000;
    
    function animate(){
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if(progress >= 1){
        piece.remove();
        return;
      }
      
      // Physics
      vy += gravity * 0.016;
      vx *= drag;
      vy *= drag;
      x += vx * 0.016;
      y += vy * 0.016;
      rotation += rotationSpeed * 0.016;
      opacity = 1 - (progress * progress);
      
      // Apply transforms
      piece.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      piece.style.opacity = opacity;
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  function createConfettiBurst(x, y, count = 30){
    const container = document.createElement('div');
    container.className = 'confetti';
    document.body.appendChild(container);
    
    for(let i = 0; i < count; i++){
      const piece = createConfettiPiece();
      container.appendChild(piece);
      
      // Slight delay for more natural effect
      setTimeout(() => {
        animateConfettiPiece(piece, x, y);
      }, i * 10);
    }
    
    // Clean up container after animation
    setTimeout(() => {
      container.remove();
    }, 4000);
  }

  function createScreenConfetti(){
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const burstCount = 5;
    
    for(let i = 0; i < burstCount; i++){
      setTimeout(() => {
        const x = Math.random() * screenWidth;
        const y = Math.random() * screenHeight * 0.3; // Top third of screen
        createConfettiBurst(x, y, 20);
      }, i * 200);
    }
  }

  function showGoalCompleteCelebration(goalName, amount){
    // Create celebration overlay
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    document.body.appendChild(overlay);
    
    // Create celebration message
    const message = document.createElement('div');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const bgColor = isDarkTheme ? '#1e293b' : 'white';
    const textColor = isDarkTheme ? '#e2e8f0' : '#374151';
    const titleColor = isDarkTheme ? '#60a5fa' : '#1e3a8a';
    
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${bgColor};
        color: ${textColor};
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        text-align: center;
        z-index: 10001;
        max-width: 90vw;
        animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: ${isDarkTheme ? '1px solid #334155' : 'none'};
      ">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="font-size: 1.5rem; font-weight: bold; color: ${titleColor}; margin-bottom: 0.5rem;">
          Goal Completed!
        </h2>
        <p style="font-size: 1.125rem; color: ${textColor}; margin-bottom: 0.5rem;">
          ${goalName}
        </p>
        <p style="font-size: 2rem; font-weight: bold; color: #10b981; margin-bottom: 1.5rem;">
          ${MarcusUtils.formatCurrency(amount)}
        </p>
        <p style="color: ${isDarkTheme ? '#94a3b8' : '#6b7280'}; font-size: 0.875rem;">
          Congratulations on reaching your savings goal! 🎯
        </p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Screen confetti
    createScreenConfetti();
    
    // Additional confetti bursts
    setTimeout(() => createScreenConfetti(), 1000);
    
    // Play celebration sound (if available)
    playSuccessSound();
    
    // Clean up after animation
    setTimeout(() => {
      overlay.remove();
      message.remove();
    }, 4000);
  }

  function showMilestoneCelebration(milestone, description){
    // Create smaller celebration for milestones
    const message = document.createElement('div');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const bgGradient = isDarkTheme 
      ? 'linear-gradient(135deg, #1e40af, #1d4ed8)' 
      : 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${bgGradient};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(59,130,246,0.3);
        z-index: 10001;
        max-width: 300px;
        animation: slideInRight 0.5s ease-out;
        border: ${isDarkTheme ? '1px solid #334155' : 'none'};
      ">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="font-size: 1.5rem;">🏆</div>
          <div>
            <div style="font-weight: bold; margin-bottom: 0.25rem;">${milestone}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">${description}</div>
          </div>
        </div>
      </div>
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(message);
    
    // Small confetti burst from the notification
    const rect = message.querySelector('div').getBoundingClientRect();
    createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    
    // Clean up
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  function playSuccessSound(){
    // Create a simple success sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a series of ascending notes
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + index * 0.15 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
        
        oscillator.start(audioContext.currentTime + index * 0.15);
        oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
      });
    } catch(e) {
      // Audio not supported, continue without sound
    }
  }

  function triggerProgressCelebration(percentage){
    // Trigger different celebrations based on progress milestones
    if(percentage === 25){
      showMilestoneCelebration('Quarter Way!', 'You\'re 25% to your goal! 🎯');
    } else if(percentage === 50){
      showMilestoneCelebration('Halfway There!', 'You\'ve reached 50% of your goal! 💪');
    } else if(percentage === 75){
      showMilestoneCelebration('Almost There!', 'You\'re 75% to your goal! 🚀');
    } else if(percentage >= 100){
      // This will be handled by goal completion
      return true;
    }
    return false;
  }

  function addProgressBarAnimations(){
    // Add glow effect to progress bars when they update
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const percentage = parseFloat(bar.style.width);
      if(percentage >= 100){
        bar.classList.add('progress-complete');
      } else if(percentage >= 75){
        bar.classList.add('progress-bar-glow');
      }
    });
  }

  // Initialize celebration system
  function initCelebrations(){
    // Add stagger animation to existing cards
    const cards = document.querySelectorAll('.card-enter');
    cards.forEach((card, index) => {
      card.classList.add('stagger-item');
      card.style.animationDelay = `${index * 0.1}s`;
    });
    
    addProgressBarAnimations();
  }

  window.MarcusCelebration = {
    createConfettiBurst,
    createScreenConfetti,
    showGoalCompleteCelebration,
    showMilestoneCelebration,
    triggerProgressCelebration,
    addProgressBarAnimations,
    initCelebrations,
    playSuccessSound
  };
})();
