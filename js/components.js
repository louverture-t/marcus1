// Reusable UI Components for Marcus Savings Tracker
(function() {
  
  // Render a stat card component
  function renderStatCard({ label, value, icon }) {
    return `
      <div class="stat-card text-center">
        <div class="stat-label">
          ${icon ? `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">${icon}</svg>` : ''}
          ${label}
        </div>
        <div class="stat-value">${value}</div>
      </div>
    `;
  }

  // Render a progress bar component
  function renderProgressBar({ label, percentage, showPercentage = true }) {
    return `
      <div class="progress-container">
        <div class="progress-header">
          <span class="progress-label">${label}</span>
          ${showPercentage ? `<span class="progress-percentage">${percentage}%</span>` : ''}
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }

  // Render a goal card component
  function renderGoalCard(goal) {
    const percentage = MarcusUtils.calculatePercentage(goal.currentAmount, goal.targetAmount);
    const daysLeft = MarcusUtils.calculateDaysLeft(goal.endDate);
    const isOverdue = daysLeft < 0;
    
    return `
      <div class="goal-card fade-in" data-goal-id="${goal.id}">
        <div class="goal-header">
          <div class="goal-info">
            <div class="goal-title">${goal.name}</div>
            <div class="goal-category">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="12 2v20M2 12h20"></path>
              </svg>
              ${goal.category}
            </div>
          </div>
          <div class="goal-actions">
            <button onclick="shareGoal('${goal.id}')" class="share-btn" title="Share goal">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
            ${!goal.isCompleted ? `
              <button onclick="deleteGoalConfirm('${goal.id}')" class="share-btn" style="color: var(--accent-red);" title="Delete goal">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>
        
        <div class="goal-amount">
          <span class="goal-current">${MarcusUtils.formatCurrency(goal.currentAmount)}</span>
          <span class="goal-target">of ${MarcusUtils.formatCurrency(goal.targetAmount)}</span>
        </div>
        
        ${renderProgressBar({ 
          label: '', 
          percentage: percentage, 
          showPercentage: false 
        })}
        
        <div class="goal-footer">
          <span class="goal-date ${isOverdue ? 'text-red-600' : ''}">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${isOverdue ? 'Overdue' : `${daysLeft} days left`}
          </span>
          ${!goal.isCompleted 
            ? `<button onclick="showAddProgress('${goal.id}')" class="btn btn-primary">Add Progress</button>` 
            : `<span style="color: var(--accent-green); font-weight: 500;">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="8 12l2 2 4-4"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Completed
              </span>`
          }
        </div>
      </div>
    `;
  }

  // Render empty state component
  function renderEmptyState({ icon, title, description }) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <div class="empty-title">${title}</div>
        <div class="empty-description">${description}</div>
      </div>
    `;
  }

  // Toast notification system
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Expose components globally
  window.MarcusComponents = {
    renderStatCard,
    renderProgressBar,
    renderGoalCard,
    renderEmptyState,
    showToast
  };

})();