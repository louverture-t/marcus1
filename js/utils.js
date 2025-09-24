// Utility functions for Marcus Savings
(function(){
  function formatCurrency(amount, currency = '$'){
    return `${currency}${Number(amount).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
  }

  function calculateDaysLeft(endDate){
    const today = new Date();
    const target = new Date(endDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function calculatePercentage(current, target){
    if(target <= 0) return 0;
    return Math.min(100, Math.round((current / target) * 100 * 10) / 10); // One decimal
  }

  function debounce(func, delay){
    let timeoutId;
    return function(...args){
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Toast functionality moved to MarcusComponents
  function showToast(message, type = 'info'){
    return MarcusComponents.showToast(message, type);
  }

  function formatDate(dateStr, format = 'MMM DD, YYYY'){
    const date = new Date(dateStr);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Simple theme management for all pages
  function getThemePreference(){
    const profile = MarcusStorage.read('marcus_profile', { preferences: { theme: 'light' } });
    return profile.preferences.theme;
  }

  function setThemePreference(theme){
    const profile = MarcusStorage.read('marcus_profile', { preferences: { theme: 'light' } });
    profile.preferences.theme = theme;
    MarcusStorage.write('marcus_profile', profile);
  }

  function applyTheme(theme){
    if(theme === 'dark'){
      document.body.classList.add('dark-theme');
      const themeToggle = document.getElementById('themeToggle');
      if(themeToggle) themeToggle.textContent = '🌙';
    } else {
      document.body.classList.remove('dark-theme');
      const themeToggle = document.getElementById('themeToggle');
      if(themeToggle) themeToggle.textContent = '☀️';
    }
    setThemePreference(theme);
  }

  function toggleTheme(){
    const currentTheme = getThemePreference();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} theme`, 'info');
  }  // Legacy validation functions - DEPRECATED
  // Use MarcusValidators instead for all new code
  function validateGoalName(name, existingGoals = []){
    console.warn('validateGoalName is deprecated. Use MarcusValidators.validateGoalName instead.');
    return MarcusValidators.validateGoalName(name) ? [MarcusValidators.validateGoalName(name)] : [];
  }

  function validateTargetAmount(amount){
    console.warn('validateTargetAmount is deprecated. Use MarcusValidators.validateTargetAmount instead.');
    return MarcusValidators.validateTargetAmount(amount) ? [MarcusValidators.validateTargetAmount(amount)] : [];
  }

  function validateTargetDate(dateStr){
    console.warn('validateTargetDate is deprecated. Use MarcusValidators.validateTargetDate instead.');
    return MarcusValidators.validateTargetDate(dateStr) ? [MarcusValidators.validateTargetDate(dateStr)] : [];
  }

  window.MarcusUtils = {
    formatCurrency, calculateDaysLeft, calculatePercentage, debounce, showToast, formatDate,
    getThemePreference, setThemePreference, applyTheme, toggleTheme,
    // Deprecated validation functions - use MarcusValidators instead
    validateGoalName, validateTargetAmount, validateTargetDate
  };
})();