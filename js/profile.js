// Profile management for Marcus Savings
(function(){
  
  const ACHIEVEMENTS_CONFIG = [
    {
      id: 'first_goal',
      name: 'First Goal',
      description: 'Created your first savings goal',
      emoji: '🎯',
      condition: (stats) => stats.goals.all.length >= 1
    },
    {
      id: 'consistent_saver',
      name: 'Consistent Saver',
      description: 'Added progress for 7 consecutive days',
      emoji: '📈',
      condition: (stats) => false // Simplified for demo
    },
    {
      id: 'goal_crusher',
      name: 'Goal Crusher',
      description: 'Completed your first goal',
      emoji: '💪',
      condition: (stats) => stats.completed >= 1
    },
    {
      id: 'big_saver',
      name: 'Big Saver',
      description: 'Saved over $10,000 total',
      emoji: '💰',
      condition: (stats) => stats.totalSaved >= 10000
    },
    {
      id: 'milestone_master',
      name: 'Milestone Master',
      description: 'Completed 3 goals',
      emoji: '🏆',
      condition: (stats) => stats.completed >= 3
    },
    {
      id: 'rising_star',
      name: 'Rising Star',
      description: 'Reached 50% progress on any goal',
      emoji: '⭐',
      condition: (stats) => stats.goals.all.some(g => (g.currentAmount / g.targetAmount) >= 0.5)
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Completed a goal exactly on target date',
      emoji: '🎪',
      condition: (stats) => false // Simplified for demo
    },
    {
      id: 'speed_saver',
      name: 'Speed Saver',
      description: 'Completed a goal in under 30 days',
      emoji: '⚡',
      condition: (stats) => false // Simplified for demo
    }
  ];

  function getUserProfile(){
    const defaultProfile = {
      name: 'Marcus',
      joinDate: '2025-09-23',
      avatar: '👤',
      preferences: {
        theme: 'light',
        currency: '$',
        dateFormat: 'MM/DD/YYYY',
        notifications: true
      }
    };
    return MarcusStorage.read('marcus_profile', defaultProfile);
  }

  function saveUserProfile(profile){
    MarcusStorage.write('marcus_profile', profile);
  }

  function getProfileStats(){
    const goalStats = MarcusGoals.getGoalStats();
    const profile = getUserProfile();
    
    // Calculate average progress
    const activeGoals = goalStats.goals.active;
    const avgProgress = activeGoals.length > 0 
      ? Math.round(activeGoals.reduce((sum, goal) => 
          sum + MarcusUtils.calculatePercentage(goal.currentAmount, goal.targetAmount), 0) / activeGoals.length)
      : 0;

    // Calculate member days
    const joinDate = new Date(profile.joinDate);
    const today = new Date();
    const memberDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));

    return {
      ...goalStats,
      avgProgress,
      memberDays,
      profile
    };
  }

  function getUnlockedAchievements(){
    const stats = getProfileStats();
    return ACHIEVEMENTS_CONFIG.filter(achievement => achievement.condition(stats));
  }

  function getLockedAchievements(){
    const stats = getProfileStats();
    return ACHIEVEMENTS_CONFIG.filter(achievement => !achievement.condition(stats));
  }

  function renderAchievementBadge(achievement, isUnlocked = true){
    return `
      <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'} text-center p-3 bg-gray-50 rounded-lg hover-lift transition-all duration-200">
        <div class="text-2xl mb-1 ${isUnlocked ? '' : 'grayscale opacity-50'}">${achievement.emoji}</div>
        <p class="text-xs font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}">${achievement.name}</p>
        <p class="text-xs text-gray-600 mt-1">${achievement.description}</p>
      </div>
    `;
  }

  function renderAchievementsGrid(){
    const unlocked = getUnlockedAchievements();
    const locked = getLockedAchievements().slice(0, 6 - unlocked.length); // Show max 6 total
    
    const achievementsList = [
      ...unlocked.map(a => renderAchievementBadge(a, true)),
      ...locked.map(a => renderAchievementBadge(a, false))
    ];

    return achievementsList.join('');
  }

  function updateUserSettings(newSettings){
    const profile = getUserProfile();
    profile.preferences = { ...profile.preferences, ...newSettings };
    saveUserProfile(profile);
    
    // Apply theme immediately if changed
    if(newSettings.theme){
      applyTheme(newSettings.theme);
    }
    
    return profile;
  }

  function applyTheme(theme){
    if(theme === 'dark'){
      document.body.classList.add('dark-theme');
      // Update theme toggle button on all pages
      const themeToggle = document.getElementById('themeToggle');
      if(themeToggle) themeToggle.textContent = '🌙';
    } else {
      document.body.classList.remove('dark-theme');
      // Update theme toggle button on all pages
      const themeToggle = document.getElementById('themeToggle');
      if(themeToggle) themeToggle.textContent = '☀️';
    }
    
    // Save theme preference
    const profile = getUserProfile();
    profile.preferences.theme = theme;
    saveUserProfile(profile);
  }

  function clearAllUserData(){
    if(confirm('⚠️ This will permanently delete all your goals, progress, and settings. This action cannot be undone.\n\nAre you sure you want to continue?')){
      // Clear all Marcus data
      ['marcus_goals', 'marcus_progress', 'marcus_settings', 'marcus_achievements', 'marcus_stats', 'marcus_profile', 'marcus_friends'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      MarcusUtils.showToast('All data cleared successfully', 'info');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  }

  function exportUserData(){
    const data = {
      goals: MarcusStorage.getGoals(),
      progress: MarcusStorage.getProgress(),
      settings: MarcusStorage.getSettings(),
      profile: getUserProfile(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marcus-savings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    MarcusUtils.showToast('Data exported successfully!', 'success');
  }

  // Initialize profile data
  function initializeProfile(){
    const profile = getUserProfile();
    applyTheme(profile.preferences.theme);
  }

  window.MarcusProfile = {
    getUserProfile,
    saveUserProfile,
    getProfileStats,
    getUnlockedAchievements,
    getLockedAchievements,
    renderAchievementBadge,
    renderAchievementsGrid,
    updateUserSettings,
    applyTheme,
    clearAllUserData,
    exportUserData,
    initializeProfile
  };
})();
