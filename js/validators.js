// Consolidated validation logic for Marcus Savings Tracker
(function() {
  
  const MAX_GOALS = 10;
  const MIN_AMOUNT = 1;
  const MAX_AMOUNT = 1000000;
  
  // Validate goal name
  function validateGoalName(name) {
    if (!name || name.trim().length === 0) {
      return 'Goal name is required';
    }
    if (name.trim().length < 2) {
      return 'Goal name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Goal name must be less than 50 characters';
    }
    return null;
  }
  
  // Validate target amount
  function validateTargetAmount(amount) {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) {
      return 'Target amount is required';
    }
    if (numAmount < MIN_AMOUNT) {
      return `Target amount must be at least $${MIN_AMOUNT}`;
    }
    if (numAmount > MAX_AMOUNT) {
      return `Target amount must be less than $${MAX_AMOUNT.toLocaleString()}`;
    }
    return null;
  }
  
  // Validate target date
  function validateTargetDate(date) {
    if (!date) {
      return 'Target date is required';
    }
    const targetDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (targetDate <= tomorrow) {
      return 'Target date must be at least tomorrow';
    }
    
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 5);
    
    if (targetDate > oneYearFromNow) {
      return 'Target date cannot be more than 5 years in the future';
    }
    
    return null;
  }
  
  // Validate progress amount
  function validateProgressAmount(amount, currentAmount, targetAmount) {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) {
      return 'Progress amount is required';
    }
    if (numAmount <= 0) {
      return 'Progress amount must be greater than 0';
    }
    if (numAmount > 10000) {
      return 'Progress amount cannot exceed $10,000 in a single entry';
    }
    if (currentAmount + numAmount > targetAmount * 1.1) {
      return 'Progress would exceed target by more than 10%';
    }
    return null;
  }
  
  // Comprehensive goal validation
  function validateGoal(formData, existingGoals = []) {
    const errors = {};
    
    // Validate name
    const nameError = validateGoalName(formData.name);
    if (nameError) errors.name = nameError;
    
    // Check for duplicate names
    const duplicateName = existingGoals.find(g => 
      g.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );
    if (duplicateName) {
      errors.name = 'A goal with this name already exists';
    }
    
    // Validate target amount
    const amountError = validateTargetAmount(formData.targetAmount);
    if (amountError) errors.targetAmount = amountError;
    
    // Validate target date
    const dateError = validateTargetDate(formData.endDate);
    if (dateError) errors.endDate = dateError;
    
    // Check goal limit
    if (existingGoals.length >= MAX_GOALS) {
      errors.limit = `You can have a maximum of ${MAX_GOALS} active goals`;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  // Sanitize text input to prevent XSS
  function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Expose validators globally
  window.MarcusValidators = {
    validateGoalName,
    validateTargetAmount,
    validateTargetDate,
    validateProgressAmount,
    validateGoal,
    sanitizeText,
    MAX_GOALS,
    MIN_AMOUNT,
    MAX_AMOUNT
  };

})();