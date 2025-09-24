// Friends management for Marcus Savings
(function(){
  
  // Demo friend data for showcasing the feature
  const DEMO_FRIENDS = [
    {
      id: 'friend_1',
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      joinedDate: '2025-08-15',
      totalSaved: 8500,
      activeGoals: 2,
      completedGoals: 3,
      currentGoals: [
        { name: 'Emergency Fund', progress: 85, amount: 8500, target: 10000 },
        { name: 'Vacation to Japan', progress: 45, amount: 2250, target: 5000 }
      ],
      achievements: ['First Goal', 'Consistent Saver', 'Goal Crusher'],
      lastActive: '2025-09-20'
    },
    {
      id: 'friend_2',
      name: 'Alex Rodriguez',
      avatar: '👨‍🎨',
      joinedDate: '2025-07-22',
      totalSaved: 12300,
      activeGoals: 3,
      completedGoals: 2,
      currentGoals: [
        { name: 'New Car Fund', progress: 67, amount: 10050, target: 15000 },
        { name: 'Wedding Ring', progress: 90, amount: 2250, target: 2500 },
        { name: 'Photography Equipment', progress: 12, amount: 120, target: 1000 }
      ],
      achievements: ['First Goal', 'Big Saver', 'Milestone Master'],
      lastActive: '2025-09-22'
    },
    {
      id: 'friend_3',
      name: 'Maya Patel',
      avatar: '👩‍🔬',
      joinedDate: '2025-09-01',
      totalSaved: 3200,
      activeGoals: 1,
      completedGoals: 1,
      currentGoals: [
        { name: 'Home Down Payment', progress: 16, amount: 3200, target: 20000 }
      ],
      achievements: ['First Goal', 'Rising Star'],
      lastActive: '2025-09-23'
    },
    {
      id: 'friend_4',
      name: 'Jordan Kim',
      avatar: '👨‍💻',
      joinedDate: '2025-06-10',
      totalSaved: 15600,
      activeGoals: 2,
      completedGoals: 5,
      currentGoals: [
        { name: 'Startup Investment', progress: 78, amount: 7800, target: 10000 },
        { name: 'Tech Conference Fund', progress: 100, amount: 1500, target: 1500 }
      ],
      achievements: ['First Goal', 'Consistent Saver', 'Goal Crusher', 'Big Saver', 'Milestone Master'],
      lastActive: '2025-09-23'
    }
  ];

  function getFriendsData(){
    // For demo purposes, we'll use the demo data
    // In a real app, this would fetch from a server
    return MarcusStorage.read('marcus_friends', DEMO_FRIENDS);
  }

  function saveFriendsData(friends){
    MarcusStorage.write('marcus_friends', friends);
  }

  function getFriendsStats(){
    const friends = getFriendsData();
    const totalFriends = friends.length;
    const totalActiveGoals = friends.reduce((sum, friend) => sum + friend.activeGoals, 0);
    const totalCompletedGoals = friends.reduce((sum, friend) => sum + friend.completedGoals, 0);
    
    return {
      totalFriends,
      totalActiveGoals,
      totalCompletedGoals,
      friends
    };
  }

  function generateShareLink(){
    // Generate a shareable link for inviting friends
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${baseUrl}?invite=${inviteCode}`;
  }

  function getShareText(){
    const userStats = MarcusGoals.getGoalStats();
    return `🎯 Join me on Marcus Savings Tracker!\n\n` +
           `I'm working on ${userStats.active} savings goals and have saved $${userStats.totalSaved} so far!\n\n` +
           `Let's motivate each other to reach our financial goals together! 💪\n\n` +
           `${generateShareLink()}`;
  }

  function shareFriendsInvite(){
    const shareText = getShareText();
    const shareUrl = generateShareLink();

    if(navigator.share) {
      navigator.share({
        title: 'Join Marcus Savings Tracker',
        text: shareText,
        url: shareUrl
      }).catch(() => copyToClipboard(shareText));
    } else {
      copyToClipboard(shareText);
    }
  }

  function copyToClipboard(text){
    if(navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        MarcusUtils.showToast('Invite link copied to clipboard!', 'success');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      MarcusUtils.showToast('Invite link copied to clipboard!', 'success');
    }
  }

  function renderFriendCard(friend){
    const recentGoal = friend.currentGoals[0];
    const isOnline = new Date() - new Date(friend.lastActive) < 24 * 60 * 60 * 1000; // Within 24 hours
    
    return `
      <div class="bg-white rounded-xl p-4 shadow-sm hover-lift card-enter">
        <div class="flex items-center gap-3 mb-3">
          <div class="relative">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              ${friend.avatar}
            </div>
            ${isOnline ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>' : ''}
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg">${friend.name}</h3>
            <p class="text-sm text-gray-600">Joined ${MarcusUtils.formatDate(friend.joinedDate)}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-lg">${MarcusUtils.formatCurrency(friend.totalSaved)}</p>
            <p class="text-xs text-gray-600">Total Saved</p>
          </div>
        </div>
        
        ${recentGoal ? `
          <div class="bg-gray-50 rounded-lg p-3 mb-3">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium text-sm">${recentGoal.name}</h4>
              <span class="text-sm font-bold">${recentGoal.progress}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-2 bg-blue-600 rounded-full transition-all duration-500" style="width: ${recentGoal.progress}%"></div>
            </div>
            <p class="text-xs text-gray-600 mt-1">${MarcusUtils.formatCurrency(recentGoal.amount)} of ${MarcusUtils.formatCurrency(recentGoal.target)}</p>
          </div>
        ` : ''}
        
        <div class="flex justify-between items-center text-sm">
          <div class="flex gap-4">
            <span class="text-gray-600">${friend.activeGoals} Active</span>
            <span class="text-green-600">${friend.completedGoals} Completed</span>
          </div>
          <div class="flex gap-1">
            ${friend.achievements.slice(0, 3).map(achievement => 
              `<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">${getAchievementEmoji(achievement)}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function getAchievementEmoji(achievement){
    const emojiMap = {
      'First Goal': '🎯',
      'Consistent Saver': '📈',
      'Goal Crusher': '💪',
      'Big Saver': '💰',
      'Milestone Master': '🏆',
      'Rising Star': '⭐'
    };
    return emojiMap[achievement] || '🏅';
  }

  // Initialize demo data on first load
  function initializeDemoData(){
    const existingFriends = MarcusStorage.read('marcus_friends', null);
    if(!existingFriends){
      saveFriendsData(DEMO_FRIENDS);
    }
  }

  window.MarcusFriends = {
    getFriendsData,
    saveFriendsData,
    getFriendsStats,
    generateShareLink,
    getShareText,
    shareFriendsInvite,
    copyToClipboard,
    renderFriendCard,
    initializeDemoData
  };
})();
