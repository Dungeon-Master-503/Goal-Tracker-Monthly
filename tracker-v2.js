// Global Variables
let username = '';
let habits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];
let habitData = {};
const defaultHabits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
let pieChartInstance = null;
let barChartInstance = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

function init() {
  initializeUsername();
  initializeTheme();
  createHabitTracker();
  calculatePoints();
  setupEventListeners();
}

// Event Listeners Setup
function setupEventListeners() {
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
  document.getElementById('infoBtn').addEventListener('click', function() { openModal('infoModal'); });
  document.getElementById('infoClose').addEventListener('click', function() { closeModal('infoModal'); });
  document.getElementById('leaderboardBtn').addEventListener('click', openLeaderboard);
  document.getElementById('leaderboardClose').addEventListener('click', function() { closeModal('leaderboardModal'); });
  document.getElementById('reportBtn').addEventListener('click', openMonthlyReport);
  document.getElementById('reportClose').addEventListener('click', function() { closeModal('reportModal'); });
  document.getElementById('downloadReportBtn').addEventListener('click', downloadReport);
  document.getElementById('addBtn').addEventListener('click', addHabit);
  document.getElementById('deleteBtn').addEventListener('click', deleteHabit);
  document.getElementById('resetBtn').addEventListener('click', resetMonth);
  
  // Modal close on background click
  document.querySelectorAll('.modal').forEach(function(modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('show');
      }
    });
  });
}

// Username Management
function initializeUsername() {
  username = localStorage.getItem('habitTrackerUsername');
  if (!username) {
    username = prompt('Enter your username for the leaderboard:') || 'User' + Math.floor(Math.random() * 10000);
    localStorage.setItem('habitTrackerUsername', username);
  }
}

// Theme Management
function initializeTheme() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeBtn').innerHTML = 'Light Mode';
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  var btn = document.getElementById('themeBtn');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    btn.innerHTML = 'Light Mode';
  } else {
    localStorage.removeItem('darkMode');
    btn.innerHTML = 'Dark Mode';
  }
}

// Utility Functions
function getMonthKey() {
  var today = new Date();
  return monthNames[today.getMonth()] + today.getFullYear();
}

function getDaysInMonth() {
  var today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

// Create Habit Tracker Table
function createHabitTracker() {
  var table = document.querySelector('.habit-table');
  var thead = table.querySelector('thead tr');
  var tbody = table.querySelector('tbody');
  
  thead.innerHTML = '<th>Habit</th>';
  tbody.innerHTML = '';
  
  var today = new Date().getDate();
  var daysInMonth = getDaysInMonth();
  
  // Create day headers
  for (var i = 1; i <= daysInMonth; i++) {
    var th = document.createElement('th');
    th.textContent = i;
    if (i === today) {
      th.classList.add('today');
    }
    thead.appendChild(th);
  }
  
  // Load habits from storage
  var monthKey = getMonthKey();
  var storedHabits = localStorage.getItem(monthKey + '-habits');
  if (storedHabits) {
    habits = JSON.parse(storedHabits);
  }
  
  // Load habit data
  habitData = {};
  for (var h = 0; h < habits.length; h++) {
    for (var d = 1; d <= daysInMonth; d++) {
      var key = h + '-' + d;
      var storedValue = localStorage.getItem(monthKey + '-' + key);
      habitData[key] = storedValue || '0';
    }
  }
  
  // Create habit rows
  for (var habitIndex = 0; habitIndex < habits.length; habitIndex++) {
    var row = document.createElement('tr');
    row.innerHTML = '<td class="habit-name">' + habits[habitIndex] + '</td>';
    
    for (var day = 1; day <= daysInMonth; day++) {
      var cellKey = habitIndex + '-' + day;
      var value = habitData[cellKey] || '0';
      
      var icon = '○';
      if (value === '1') icon = '✅';
      else if (value === '-1') icon = '❌';
      
      var td = document.createElement('td');
      td.className = 'habit-cell';
      td.innerHTML = '<span class="icon">' + icon + '</span>';
      td.setAttribute('data-habit', habitIndex);
      td.setAttribute('data-day', day);
      td.addEventListener('click', handleCellClick);
      
      row.appendChild(td);
    }
    
    tbody.appendChild(row);
  }
  
  // Create charts after table is built
  setTimeout(createProgressCharts, 300);
}

// Handle cell click
function handleCellClick() {
  var habitIdx = parseInt(this.getAttribute('data-habit'));
  var dayNum = parseInt(this.getAttribute('data-day'));
  toggleHabit(habitIdx, dayNum);
}

// Toggle Habit State
function toggleHabit(habitIndex, day) {
  var key = habitIndex + '-' + day;
  var currentValue = habitData[key] || '0';
  var newValue;
  
  if (currentValue === '0') newValue = '1';
  else if (currentValue === '1') newValue = '-1';
  else newValue = '0';
  
  habitData[key] = newValue;
  var monthKey = getMonthKey();
  localStorage.setItem(monthKey + '-' + key, newValue);
  
  createHabitTracker();
  calculatePoints();
  setTimeout(createProgressCharts, 50);
}

// Calculate Points
function calculatePoints() {
  var daysInMonth = getDaysInMonth();
  var today = new Date().getDate();
  
  var dailyPoints = 0;
  var monthlyPoints = 0;
  
  // Calculate for each day up to today
  for (var day = 1; day <= today; day++) {
    var completed = 0;
    
    for (var h = 0; h < habits.length; h++) {
      var key = h + '-' + day;
      if (habitData[key] === '1') completed++;
    }
    
    var percentage = habits.length > 0 ? (completed / habits.length) * 100 : 0;
    var dayPoints = 0;
    
    if (percentage === 100) dayPoints = 15;
    else if (percentage >= 80) dayPoints = 10;
    else if (percentage >= 60) dayPoints = 5;
    
    monthlyPoints += dayPoints;
    if (day === today) dailyPoints = dayPoints;
  }
  
  document.getElementById('todayPoints').textContent = dailyPoints + ' pts';
  document.getElementById('monthlyPoints').textContent = monthlyPoints + ' pts';
  
  saveToLeaderboard(monthlyPoints);
}

// Save to Leaderboard
function saveToLeaderboard(totalPoints) {
  if (!username || !window.storage) return;
  
  try {
    var monthKey = getMonthKey();
    var userKey = 'leaderboard-' + monthKey + '-' + username;
    
    var data = JSON.stringify({
      username: username,
      points: totalPoints,
      lastUpdated: new Date().toISOString()
    });
    
    window.storage.set(userKey, data, true).catch(function(error) {
      console.error('Error saving to leaderboard:', error);
    });
  } catch (error) {
    console.error('Error saving to leaderboard:', error);
  }
}

// Open Leaderboard
function openLeaderboard() {
  openModal('leaderboardModal');
  
  if (!window.storage) {
    document.getElementById('leaderboardContent').innerHTML = '<div class="empty-state">Leaderboard not available</div>';
    return;
  }
  
  var monthKey = getMonthKey();
  window.storage.list('leaderboard-' + monthKey + '-', true).then(function(result) {
    var leaderboardContent = document.getElementById('leaderboardContent');
    
    if (!result || !result.keys || result.keys.length === 0) {
      leaderboardContent.innerHTML = '<div class="empty-state">No data yet. Be the first to earn points!</div>';
      return;
    }
    
    var promises = [];
    for (var i = 0; i < result.keys.length; i++) {
      promises.push(window.storage.get(result.keys[i], true));
    }
    
    Promise.all(promises).then(function(responses) {
      var users = [];
      
      for (var j = 0; j < responses.length; j++) {
        if (responses[j] && responses[j].value) {
          try {
            users.push(JSON.parse(responses[j].value));
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
      
      users.sort(function(a, b) { return b.points - a.points; });
      
      var html = '';
      var topUsers = users.slice(0, 20);
      
      for (var k = 0; k < topUsers.length; k++) {
        var user = topUsers[k];
        var rankClass = '';
        if (k === 0) rankClass = 'gold';
        else if (k === 1) rankClass = 'silver';
        else if (k === 2) rankClass = 'bronze';
        
        var isCurrentUser = user.username === username;
        
        html += '<div class="leaderboard-item ' + (isCurrentUser ? 'current-user' : '') + '">';
        html += '<div class="leaderboard-rank ' + rankClass + '">#' + (k + 1) + '</div>';
        html += '<div class="leaderboard-name">' + user.username;
        if (isCurrentUser) {
          html += '<span style="color: var(--accent-blue); font-size: 0.875rem;"> (You)</span>';
        }
        html += '</div>';
        html += '<div class="leaderboard-points"><span>Trophy</span><span>' + user.points + '</span></div>';
        html += '</div>';
      }
      
      leaderboardContent.innerHTML = html;
    });
  }).catch(function(error) {
    console.error('Error loading leaderboard:', error);
    document.getElementById('leaderboardContent').innerHTML = '<div class="empty-state">Error loading leaderboard</div>';
  });
}

// Add Habit
function addHabit() {
  if (habits.length >= 20) {
    alert('Maximum 20 habits reached!');
    return;
  }
  
  var newHabit = prompt('Enter new habit name:');
  if (newHabit && newHabit.trim()) {
    habits.push(newHabit.trim());
    var monthKey = getMonthKey();
    localStorage.setItem(monthKey + '-habits', JSON.stringify(habits));
    createHabitTracker();
    calculatePoints();
  }
}

// Delete Habit
function deleteHabit() {
  if (habits.length === 0) {
    alert('No habits to delete!');
    return;
  }
  
  var habitList = '';
  for (var i = 0; i < habits.length; i++) {
    habitList += (i + 1) + '. ' + habits[i] + '\n';
  }
  
  var choice = prompt('Select habit to delete (enter number):\n\n' + habitList);
  var index = parseInt(choice) - 1;
  
  if (index >= 0 && index < habits.length) {
    if (confirm('Delete "' + habits[index] + '"?')) {
      habits.splice(index, 1);
      var monthKey = getMonthKey();
      localStorage.setItem(monthKey + '-habits', JSON.stringify(habits));
      createHabitTracker();
      calculatePoints();
    }
  } else {
    alert('Invalid selection!');
  }
}

// Reset Month
function resetMonth() {
  if (confirm('Reset all habit data for this month?')) {
    var monthKey = getMonthKey();
    var keys = Object.keys(localStorage);
    
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(monthKey) !== -1) {
        localStorage.removeItem(keys[i]);
      }
    }
    
    habits = defaultHabits.slice();
    createHabitTracker();
    calculatePoints();
  }
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

// Monthly Report Functions
function openMonthlyReport() {
  openModal('reportModal');
  generateMonthlyReport();
}

function generateMonthlyReport() {
  var daysInMonth = getDaysInMonth();
  var today = new Date();
  var currentMonth = monthNames[today.getMonth()];
  var currentYear = today.getFullYear();
  
  var totalHabits = habits.length;
  var totalDays = today.getDate();
  var totalPossible = totalHabits * totalDays;
  var totalCompleted = 0;
  var totalFailed = 0;
  var totalEmpty = 0;
  
  var habitStats = [];
  
  // Calculate statistics for each habit
  for (var i = 0; i < habits.length; i++) {
    var completed = 0;
    var failed = 0;
    var empty = 0;
    
    for (var day = 1; day <= totalDays; day++) {
      var key = i + '-' + day;
      var value = habitData[key] || '0';
      
      if (value === '1') {
        completed++;
        totalCompleted++;
      } else if (value === '-1') {
        failed++;
        totalFailed++;
      } else {
        empty++;
        totalEmpty++;
      }
    }
    
    var percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
    
    habitStats.push({
      name: habits[i],
      completed: completed,
      failed: failed,
      empty: empty,
      total: totalDays,
      percentage: percentage
    });
  }
  
  // Sort by percentage
  habitStats.sort(function(a, b) { return b.percentage - a.percentage; });
  
  var overallPercentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  
  // Calculate points
  var monthlyPoints = parseInt(document.getElementById('monthlyPoints').textContent);
  
  // Generate insights
  var insights = [];
  var bestHabit = habitStats[0];
  var worstHabit = habitStats[habitStats.length - 1];
  
  if (bestHabit.percentage === 100) {
    insights.push('🌟 Amazing! You achieved 100% completion on "' + bestHabit.name + '"!');
  } else if (bestHabit.percentage >= 80) {
    insights.push('🎯 Great job! Your best habit is "' + bestHabit.name + '" at ' + bestHabit.percentage + '% completion.');
  }
  
  if (overallPercentage >= 80) {
    insights.push('💪 Excellent consistency! You completed ' + overallPercentage + '% of all habits this month.');
  } else if (overallPercentage >= 60) {
    insights.push('👍 Good progress! You completed ' + overallPercentage + '% of all habits. Keep pushing!');
  } else {
    insights.push('📈 Room for improvement! Focus on building consistency in your habits.');
  }
  
  if (worstHabit.percentage < 50) {
    insights.push('💡 Tip: "' + worstHabit.name + '" needs more attention. Try setting a reminder!');
  }
  
  var currentStreak = calculateCurrentStreak();
  if (currentStreak > 0) {
    insights.push('🔥 Current streak: ' + currentStreak + ' days of completing at least one habit!');
  }
  
  // Build HTML
  var html = '';
  
  // Summary Stats
  html += '<div class="report-summary">';
  html += '<div class="report-stat">';
  html += '<div class="report-stat-value">' + overallPercentage + '%</div>';
  html += '<div class="report-stat-label">Overall Completion</div>';
  html += '</div>';
  
  html += '<div class="report-stat">';
  html += '<div class="report-stat-value">' + totalCompleted + '</div>';
  html += '<div class="report-stat-label">Completed</div>';
  html += '</div>';
  
  html += '<div class="report-stat">';
  html += '<div class="report-stat-value">' + monthlyPoints + '</div>';
  html += '<div class="report-stat-label">Total Points</div>';
  html += '</div>';
  
  html += '<div class="report-stat">';
  html += '<div class="report-stat-value">' + currentStreak + '</div>';
  html += '<div class="report-stat-label">Day Streak</div>';
  html += '</div>';
  html += '</div>';
  
  // Insights
  html += '<div class="report-insights">';
  html += '<h4>📊 Insights & Achievements</h4>';
  for (var j = 0; j < insights.length; j++) {
    html += '<div class="report-insight-item">' + insights[j] + '</div>';
  }
  html += '</div>';
  
  // Habit Details
  html += '<div class="report-habits">';
  html += '<h4 style="margin-bottom: 1rem; color: var(--text-primary);">Habit Performance</h4>';
  
  for (var k = 0; k < habitStats.length; k++) {
    var habit = habitStats[k];
    html += '<div class="report-habit-item">';
    html += '<div class="report-habit-name">' + habit.name + '</div>';
    html += '<div class="report-habit-stats">';
    html += '<div class="report-habit-count">' + habit.completed + '/' + habit.total + ' days</div>';
    html += '<div class="report-progress-bar">';
    html += '<div class="report-progress-fill" style="width: ' + habit.percentage + '%"></div>';
    html += '</div>';
    html += '<div class="report-habit-percentage">' + habit.percentage + '%</div>';
    html += '</div>';
    html += '</div>';
  }
  
  html += '</div>';
  
  document.getElementById('reportContent').innerHTML = html;
}

function calculateCurrentStreak() {
  var today = new Date().getDate();
  var streak = 0;
  
  for (var day = today; day >= 1; day--) {
    var dayHasCompletion = false;
    
    for (var h = 0; h < habits.length; h++) {
      var key = h + '-' + day;
      if (habitData[key] === '1') {
        dayHasCompletion = true;
        break;
      }
    }
    
    if (dayHasCompletion) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function downloadReport() {
  var today = new Date();
  var currentMonth = monthNames[today.getMonth()];
  var currentYear = today.getFullYear();
  
  var reportText = '=================================\n';
  reportText += '   MONTHLY HABIT REPORT\n';
  reportText += '   ' + currentMonth + ' ' + currentYear + '\n';
  reportText += '   User: ' + username + '\n';
  reportText += '=================================\n\n';
  
  var daysInMonth = getDaysInMonth();
  var totalDays = today.getDate();
  var totalHabits = habits.length;
  var totalPossible = totalHabits * totalDays;
  var totalCompleted = 0;
  
  for (var i = 0; i < habits.length; i++) {
    var completed = 0;
    
    for (var day = 1; day <= totalDays; day++) {
      var key = i + '-' + day;
      if (habitData[key] === '1') {
        completed++;
        totalCompleted++;
      }
    }
    
    var percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
    reportText += habits[i] + ': ' + completed + '/' + totalDays + ' days (' + percentage + '%)\n';
  }
  
  var overallPercentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  var monthlyPoints = parseInt(document.getElementById('monthlyPoints').textContent);
  
  reportText += '\n=================================\n';
  reportText += 'SUMMARY\n';
  reportText += '=================================\n';
  reportText += 'Overall Completion: ' + overallPercentage + '%\n';
  reportText += 'Total Completed: ' + totalCompleted + '/' + totalPossible + '\n';
  reportText += 'Monthly Points: ' + monthlyPoints + '\n';
  reportText += 'Current Streak: ' + calculateCurrentStreak() + ' days\n';
  
  // Create download
  var blob = new Blob([reportText], { type: 'text/plain' });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'HabitReport_' + currentMonth + '_' + currentYear + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Chart Functions
function getGoalProgressData() {
  var daysInMonth = getDaysInMonth();
  var progressData = [];
  
  for (var i = 0; i < habits.length; i++) {
    var completed = 0;
    for (var day = 1; day <= daysInMonth; day++) {
      var key = i + '-' + day;
      if (habitData[key] === '1') completed++;
    }
    progressData.push({
      name: habits[i],
      completed: completed,
      total: daysInMonth,
      percentage: Math.round((completed / daysInMonth) * 100)
    });
  }
  
  return progressData;
}

function getDailyProgressData() {
  var daysInMonth = getDaysInMonth();
  var dailyData = [];
  
  for (var day = 1; day <= daysInMonth; day++) {
    var daySuccess = 0;
    for (var i = 0; i < habits.length; i++) {
      var key = i + '-' + day;
      var state = habitData[key];
      if (state === '1') daySuccess++;
    }
    dailyData.push(daySuccess);
  }
  
  return dailyData;
}

function createProgressCharts() {
  if (pieChartInstance) pieChartInstance.destroy();
  if (barChartInstance) barChartInstance.destroy();
  
  var progressData = getGoalProgressData();
  var dailyData = getDailyProgressData();
  var daysInMonth = getDaysInMonth();
  
  var pieCtx = document.getElementById('pieChart');
  if (pieCtx) {
    pieChartInstance = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: progressData.map(function(d) { return d.name; }),
        datasets: [{
          data: progressData.map(function(d) { return d.percentage; }),
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#FFEB3B', '#ff8484', '#8BC34A', '#784e5c', '#3f7882'],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                var data = progressData[context.dataIndex];
                return data.name + ': ' + data.completed + '/' + data.total + ' (' + data.percentage + '%)';
              }
            }
          }
        }
      }
    });
  }
  
  var barCtx = document.getElementById('barChart');
  if (barCtx) {
    var maxVal = Math.max(4, Math.max.apply(null, dailyData) + 1);
    var labels = [];
    for (var i = 0; i < daysInMonth; i++) {
      labels.push('D' + (i + 1));
    }
    
    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Goals Done',
          data: dailyData,
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          borderColor: '#4CAF50',
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: maxVal,
            ticks: { stepSize: 1 }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}
