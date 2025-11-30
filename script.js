// Global variables
let allCourses = [];
let filteredCourses = [];
let selectedCourse = null;

// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const errorMessage = document.getElementById('errorMessage');
const courseList = document.getElementById('courseList');
const courseDetails = document.getElementById('courseDetails');
const departmentFilter = document.getElementById('departmentFilter');
const levelFilter = document.getElementById('levelFilter');
const creditsFilter = document.getElementById('creditsFilter');
const instructorFilter = document.getElementById('instructorFilter');
const sortBy = document.getElementById('sortBy');

// Event Listeners
fileInput.addEventListener('change', handleFileUpload);
departmentFilter.addEventListener('change', applyFiltersAndSort);
levelFilter.addEventListener('change', applyFiltersAndSort);
creditsFilter.addEventListener('change', applyFiltersAndSort);
instructorFilter.addEventListener('change', applyFiltersAndSort);
sortBy.addEventListener('change', applyFiltersAndSort);

// File Upload Handler
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    fileName.textContent = file.name;
    
    // Check if file is JSON
    if (!file.name.endsWith('.json')) {
        showError('Invalid JSON file format.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate that data is an array
            if (!Array.isArray(data)) {
                throw new Error('JSON file must contain an array of courses');
            }

            // Create Course objects
            allCourses = data.map(courseData => new Course(courseData));
            filteredCourses = [...allCourses];
            
            // Clear any previous error
            hideError();
            
            // Initialize filters
            populateFilters();
            
            // Display courses
            displayCourses();
            
        } catch (error) {
            showError('Invalid JSON file format.');
            console.error('Error parsing JSON:', error);
        }
    };
    
    reader.onerror = function() {
        showError('Error reading file.');
    };
    
    reader.readAsText(file);
}

// Error Message Functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// Populate Filter Dropdowns
function populateFilters() {
    // Get unique values for each filter using Set
    const departments = new Set();
    const levels = new Set();
    const credits = new Set();
    const instructors = new Set();

    allCourses.forEach(course => {
        departments.add(course.department);
        levels.add(course.level);
        credits.add(course.credits);
        if (course.instructor) {
            instructors.add(course.instructor);
        }
    });

    // Populate department filter
    populateSelect(departmentFilter, Array.from(departments).sort());
    
    // Populate level filter (sort numerically)
    populateSelect(levelFilter, Array.from(levels).sort((a, b) => a - b));
    
    // Populate credits filter (sort numerically)
    populateSelect(creditsFilter, Array.from(credits).sort((a, b) => a - b));
    
    // Populate instructor filter
    populateSelect(instructorFilter, Array.from(instructors).sort());
}

// Helper function to populate select elements
function populateSelect(selectElement, values) {
    // Keep the "All" option
    selectElement.innerHTML = '<option value="All">All</option>';
    
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// Apply Filters and Sort
function applyFiltersAndSort() {
    // Start with all courses
    filteredCourses = [...allCourses];

    // Apply filters using the filter method
    filteredCourses = filteredCourses.filter(course => {
        // Department filter
        if (departmentFilter.value !== 'All' && course.department !== departmentFilter.value) {
            return false;
        }

        // Level filter
        if (levelFilter.value !== 'All' && course.level !== parseInt(levelFilter.value)) {
            return false;
        }

        // Credits filter
        if (creditsFilter.value !== 'All' && course.credits !== parseInt(creditsFilter.value)) {
            return false;
        }

        // Instructor filter
        if (instructorFilter.value !== 'All' && course.instructor !== instructorFilter.value) {
            return false;
        }

        return true;
    });

    // Apply sorting
    const sortOption = sortBy.value;
    
    if (sortOption !== 'None') {
        filteredCourses = sortCourses(filteredCourses, sortOption);
    }

    // Display filtered and sorted courses
    displayCourses();
}

// Sort Courses Function
function sortCourses(courses, sortOption) {
    const sorted = [...courses];

    switch (sortOption) {
        case 'ID (A-Z)':
            sorted.sort((a, b) => a.id.localeCompare(b.id));
            break;
        
        case 'ID (Z-A)':
            sorted.sort((a, b) => b.id.localeCompare(a.id));
            break;
        
        case 'Title (A-Z)':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        
        case 'Title (Z-A)':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        
        case 'Semester (Earliest first)':
            sorted.sort((a, b) => compareSemesters(a.semester, b.semester));
            break;
        
        case 'Semester (Latest first)':
            sorted.sort((a, b) => compareSemesters(b.semester, a.semester));
            break;
    }

    return sorted;
}

// Compare Semesters Function
// Assumes format "Season YYYY" (e.g., "Fall 2025", "Winter 2026")
function compareSemesters(sem1, sem2) {
    const seasonOrder = {
        'Winter': 1,
        'Spring': 2,
        'Summer': 3,
        'Fall': 4
    };

    // Parse semester strings
    const [season1, year1] = sem1.split(' ');
    const [season2, year2] = sem2.split(' ');

    // Compare years first
    const yearDiff = parseInt(year1) - parseInt(year2);
    if (yearDiff !== 0) {
        return yearDiff;
    }

    // If years are the same, compare seasons
    return seasonOrder[season1] - seasonOrder[season2];
}

// Display Courses in List
function displayCourses() {
    courseList.innerHTML = '';

    if (filteredCourses.length === 0) {
        courseList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No courses match the selected filters.</p>';
        return;
    }

    filteredCourses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.dataset.id = course.id;
        courseItem.innerHTML = `<h3>${course.id}</h3>`;
        
        courseItem.addEventListener('click', () => selectCourse(course));
        
        courseList.appendChild(courseItem);
    });
}

// Select Course and Display Details
function selectCourse(course) {
    selectedCourse = course;

    // Remove previous selection highlighting
    document.querySelectorAll('.course-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Highlight selected course
    const selectedItem = document.querySelector(`.course-item[data-id="${course.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }

    // Display course details
    courseDetails.innerHTML = course.getDetailsHTML();
}