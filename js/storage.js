// LocalStorage data layer for Marcus Savings
// Provides simple JSON read/write helpers and feature-specific APIs
(function(){
  const KEYS = {
    GOALS: 'marcus_goals',
    PROGRESS: 'marcus_progress',
    SETTINGS: 'marcus_settings',
    ACHIEVEMENTS: 'marcus_achievements',
    STATS: 'marcus_stats'
  };

  function isStorageAvailable(){
    try{ const test='__t'; localStorage.setItem(test,'1'); localStorage.removeItem(test); return true; }catch(e){ return false; }
  }

  function read(key, fallback){
    if(!isStorageAvailable()) return fallback;
    try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ return fallback; }
  }

  function write(key, value){
    if(!isStorageAvailable()) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Defaults
  const DEFAULT_SETTINGS = { theme: 'light', currency: '$', dateFormat: 'MM/DD/YYYY' };

  // Goals API
  function getGoals(){ return read(KEYS.GOALS, []); }
  function saveGoals(goals){ write(KEYS.GOALS, goals); }
  function findGoal(goals, id){ return goals.find(g => String(g.id) === String(id)); }
  function upsertGoal(goal){
    const goals = getGoals();
    const idx = goals.findIndex(g => String(g.id) === String(goal.id));
    if(idx >= 0){ goals[idx] = goal; }
    else { goals.push(goal); }
    saveGoals(goals);
    return goal;
  }

  function deleteGoal(id){
    const goals = getGoals().filter(g => String(g.id) !== String(id));
    saveGoals(goals);
  }

  // Progress API
  function getProgress(){ return read(KEYS.PROGRESS, []); }
  function saveProgress(list){ write(KEYS.PROGRESS, list); }
  function addProgress(goalId, amount){
    const list = getProgress();
    const entry = { goalId, amount: Number(amount), date: new Date().toISOString() };
    list.push(entry); saveProgress(list); return entry;
  }

  // Settings API
  function getSettings(){ return read(KEYS.SETTINGS, DEFAULT_SETTINGS); }
  function saveSettings(settings){ write(KEYS.SETTINGS, settings); }

  // Achievements/Stats (placeholders for future use)
  function getAchievements(){ return read(KEYS.ACHIEVEMENTS, []); }
  function saveAchievements(a){ write(KEYS.ACHIEVEMENTS, a); }
  function getStats(){ return read(KEYS.STATS, {}); }
  function saveStats(s){ write(KEYS.STATS, s); }

  window.MarcusStorage = {
    KEYS,
    read, write, isStorageAvailable,
    getGoals, saveGoals, upsertGoal, deleteGoal, findGoal,
    getProgress, saveProgress, addProgress,
    getSettings, saveSettings,
    getAchievements, saveAchievements,
    getStats, saveStats
  };
})();
