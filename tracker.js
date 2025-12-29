document.addEventListener('DOMContentLoaded', function() {
    const themeBtn = document.getElementById('trp3');
    
    // Load saved theme
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Light Mode';
    }
    
    // Button click toggle
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            // Dark mode ON
            localStorage.setItem('darkMode', 'enabled');
            themeBtn.textContent = '☀️ Light Mode';
        } else {
            // Light mode ON
            localStorage.removeItem('darkMode');
            themeBtn.textContent = '🌙 Night Mode';
        }
    });
});

function createMonthlyHabitTracker() {
    const table = document.querySelector('.habit-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    // Get current month's first and last day
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Month name
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'][currentMonth];
    
    // Clear table
    thead.innerHTML = `<th>${monthName} ${currentYear}</th>`;
    tbody.innerHTML = '';
    
    // Generate all days of month (1 to 31/30/28)
    for (let i = 1; i <= daysInMonth; i++) {
        const th = document.createElement('th');
        const dateObj = new Date(currentYear, currentMonth, i);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        
        th.textContent = `${i}\n${dayName}`;
        th.style.fontSize = '12px';
        
        // Highlight today's column
        if (i === today.getDate()) {
            th.style.background = '#FFD700';
            th.style.fontWeight = 'bold';
        }
        
        thead.appendChild(th);
    }
    
    // Add habits
    const habits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];
    habits.forEach(habit => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${habit}</td>`;
        
        // Create checkboxes for each day
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-check';
            checkbox.id = `${habit}-day${day}`;
            
            // Load saved data from localStorage
            const saved = localStorage.getItem(`${monthName}${currentYear}-${habit}-day${day}`);
            checkbox.checked = saved === 'true';
            
            // Save data on change
            checkbox.addEventListener('change', function() {
                localStorage.setItem(`${monthName}${currentYear}-${habit}-day${day}`, this.checked);
            });
            
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createMonthlyHabitTracker();
    
    // Your existing theme toggle code
    const themeBtn = document.getElementById('trp3');
    
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Light Mode';
    }
    
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            themeBtn.textContent = '☀️ Light Mode';
        } else {
            localStorage.removeItem('darkMode');
            themeBtn.textContent = '🌙 Night Mode';
        }
    });
});

// Optional: Function to manually reset data (call when month ends)
function resetMonthlyData() {
    if (confirm('Reset all habit data for this month?')) {
        const keys = Object.keys(localStorage);
        const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        
        keys.forEach(key => {
            if (key.includes(currentMonth)) {
                localStorage.removeItem(key);
            }
        });
        
        location.reload();
    }
}


// this is fettest

let editMode = false;
const defaultHabits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];

function createMonthlyHabitTracker() {
    const table = document.querySelector('.habit-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'][currentMonth];
    
    thead.innerHTML = `<th>${monthName} ${currentYear}</th>`;
    tbody.innerHTML = '';
    
    // Days headers
    for (let i = 1; i <= daysInMonth; i++) {
        const th = document.createElement('th');
        const dateObj = new Date(currentYear, currentMonth, i);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        
        th.innerHTML = `${i}<br><small>${dayName}</small>`;
        th.style.cssText = 'font-size:12px;text-align:center;padding:8px 4px;white-space:nowrap;';
        
        if (i === today.getDate()) {
            th.style.background = '#FFD700';
            th.style.color = '#000';
            th.style.fontWeight = 'bold';
        }
        
        thead.appendChild(th);
    }
    
    // Load habits
    const savedHabitsKey = `${monthName}${currentYear}-habits`;
    let habitsArray = JSON.parse(localStorage.getItem(savedHabitsKey)) || defaultHabits;
    
    habitsArray.forEach((habit, habitIndex) => {
        const row = document.createElement('tr');
        const habitCell = document.createElement('td');
        habitCell.textContent = habit;
        habitCell.contentEditable = editMode;
        row.appendChild(habitCell);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-check';
            
            const saved = localStorage.getItem(`${monthName}${currentYear}-${habitIndex}-day${day}`);
            checkbox.checked = saved === 'true';
            
            checkbox.addEventListener('change', () => {
                localStorage.setItem(`${monthName}${currentYear}-${habitIndex}-day${day}`, checkbox.checked);
            });
            
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });
}

function toggleEditMode() {
    editMode = !editMode;
    const editBtn = document.getElementById('edit-btn');
    if (editMode) {
        editBtn.textContent = '✅ Save Goals';
        editBtn.style.background = '#4CAF50';
    } else {
        editBtn.textContent = '✏️ Edit Goals';
        editBtn.style.background = '#2196F3';
        saveHabits();
    }
    createMonthlyHabitTracker();
}

function saveHabits() {
    const habitCells = document.querySelectorAll('.habit-table tbody td:first-child');
    const newHabits = Array.from(habitCells).map(cell => cell.textContent.trim()).filter(habit => habit);
    
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    
    localStorage.setItem(`${monthName}${currentYear}-habits`, JSON.stringify(newHabits));
}

function addNewHabit() {
    const newHabitName = prompt('Enter new habit name:');
    if (newHabitName && newHabitName.trim()) {
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        const savedHabitsKey = `${monthName}${currentYear}-habits`;
        let savedHabits = JSON.parse(localStorage.getItem(savedHabitsKey)) || [];
        savedHabits.push(newHabitName.trim());
        localStorage.setItem(savedHabitsKey, JSON.stringify(savedHabits));
        createMonthlyHabitTracker();
    }
}

function resetMonthlyData() {
    if (confirm('Reset all habit data for this month?')) {
        const keys = Object.keys(localStorage);
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        
        keys.forEach(key => {
            if (key.includes(`${monthName}${currentYear}`)) {
                localStorage.removeItem(key);
            }
        });
        createMonthlyHabitTracker();
    }
}

// FIXED: Single DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    createMonthlyHabitTracker();
    
    // Theme toggle
    const themeBtn = document.getElementById('trp3');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Light Mode';
    }
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            themeBtn.textContent = '☀️ Light Mode';
        } else {
            localStorage.removeItem('darkMode');
            themeBtn.textContent = '🌙 Night Mode';
        }
    });
    
    // ✅ BUTTON EVENT LISTENERS - NOW WORKING!
    document.getElementById('edit-btn').addEventListener('click', toggleEditMode);
    document.getElementById('add-habit-btn').addEventListener('click', addNewHabit);
    document.getElementById('reset-btn').addEventListener('click', resetMonthlyData);
});function scrollToToday() {
  const today = new Date().getDate(); // Gets 29 today
  const todayCell = document.querySelector(`[data-date="${today}"]`);
  if (todayCell) {
    todayCell.scrollIntoView({ 
      behavior: 'smooth', 
      inline: 'start'  // Aligns to left edge (no horizontal scroll needed)
    });
  }
}
scrollToToday(); // Call on load




