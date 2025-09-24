// Clean Goal Management for Marcus Savings Tracker
(function() {

  // Create a new goal with validation
  function createGoal(formData) {
    const existingGoals = MarcusStorage.getGoals();
    
    // Use consolidated validation
    const validation = MarcusValidators.validateGoal(formData, existingGoals);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }

    // Create goal object with sanitized data
    const goal = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: MarcusValidators.sanitizeText(formData.name.trim()),
      category: formData.category,
      targetAmount: Number(formData.targetAmount),
      currentAmount: 0,
      endDate: formData.endDate,
      createdAt: new Date().toISOString(),
      progressHistory: [],
      isCompleted: false,
      completedAt: null
    };

    return MarcusStorage.upsertGoal(goal);
  }

  // Add progress to a goal with validation
  function addProgressToGoal(goalId, amount) {
    const goals = MarcusStorage.getGoals();
    const goal = MarcusStorage.findGoal(goals, goalId);
    
    if (!goal) {
      throw new Error('Goal not found');
    }
    
    if (goal.isCompleted) {
      throw new Error('Cannot add progress to completed goal');
    }

    // Validate progress amount
    const validationError = MarcusValidators.validateProgressAmount(
      amount, 
      goal.currentAmount, 
      goal.targetAmount
    );
    
    if (validationError) {
      throw new Error(validationError);
    }

    const progressAmount = Number(amount);
    
    // Add to progress history
    const progressEntry = MarcusStorage.addProgress(goalId, progressAmount);
    
    // Update goal
    goal.currentAmount += progressAmount;
    goal.progressHistory.push(progressEntry);
    
    // Check completion
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      goal.completedAt = new Date().toISOString();
    }

    MarcusStorage.upsertGoal(goal);
    return goal;
  }

  // Delete a goal
  function deleteGoal(goalId) {
    MarcusStorage.deleteGoal(goalId);
  }

  // Get comprehensive goal statistics
  function getGoalStats() {
    const goals = MarcusStorage.getGoals();
    const active = goals.filter(g => !g.isCompleted);
    const completed = goals.filter(g => g.isCompleted);
    
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = active.reduce((sum, g) => sum + g.targetAmount, 0);
    const overallProgress = totalTarget > 0 
      ? MarcusUtils.calculatePercentage(totalSaved, totalTarget) 
      : 0;

    return {
      active: active.length,
      completed: completed.length,
      totalSaved,
      totalTarget,
      overallProgress,
      goals: { active, completed, all: goals }
    };
  }

  // Validate goal form (wrapper for consolidated validation)
  function validateGoalForm(formData) {
    const existingGoals = MarcusStorage.getGoals();
    return MarcusValidators.validateGoal(formData, existingGoals);
  }

  // Get a specific goal by ID
  function getGoal(goalId) {
    const goals = MarcusStorage.getGoals();
    return MarcusStorage.findGoal(goals, goalId);
  }

  // Update goal (for editing)
  function updateGoal(goalId, updates) {
    const goals = MarcusStorage.getGoals();
    const goal = MarcusStorage.findGoal(goals, goalId);
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Merge updates with existing goal
    const updatedGoal = { ...goal, ...updates };
    
    // Validate if critical fields are being updated
    if (updates.name || updates.targetAmount || updates.endDate) {
      const validation = MarcusValidators.validateGoal({
        name: updatedGoal.name,
        targetAmount: updatedGoal.targetAmount,
        endDate: updatedGoal.endDate
      }, goals.filter(g => g.id !== goalId));
      
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
    }

    return MarcusStorage.upsertGoal(updatedGoal);
  }

  // Export clean API
  window.MarcusGoals = {
    createGoal,
    addProgressToGoal,
    deleteGoal,
    getGoalStats,
    validateGoalForm,
    getGoal,
    updateGoal,
    MAX_GOALS: MarcusValidators.MAX_GOALS
  };

})();