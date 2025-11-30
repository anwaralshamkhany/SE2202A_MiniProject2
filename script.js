// Course class definition
class Course {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.department = data.department;
        this.level = data.level;
        this.credits = data.credits;
        this.instructor = data.instructor;
        this.description = data.description;
        this.semester = data.semester;
    }

    getFormattedDetails() {
        return `
            <h3>${this.id}</h3>
            <p><strong>Title:</strong> ${this.title}</p>
            <p><strong>Department:</strong> ${this.department}</p>
            <p><strong>Level:</strong> ${this.level}</p>
            <p><strong>Credits:</strong> ${this.credits}</p>
            <p><strong>Instructor:</strong> ${this.instructor || 'TBA'}</p>
            <p><strong>Semester:</strong> ${this.semester}</p>
            <p class="description">${this.description}</p>
        `;
    }
}

// Global variables
let allCourses = [];
let filteredCourses = [];
let selectedCourse = null;

// DOM elements
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

// Event listeners
fileInput.addEventListener('change', handleFileUpload);
departmentFilter.addEventListener('change', applyFiltersAndSort);
levelFilter.addEventListener('change', applyFiltersAndSort);
creditsFilter.addEventListener('change', applyFiltersAndSort);
instructorFilter.addEventListener('change', applyFiltersAndSort);
sortBy.addEventListener('change', applyFiltersAndSort);

// File upload handler
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    fileName.textContent = file.name;
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            if (!Array.isArray(jsonData)) {
                throw new Error('JSON data must be an array');
            }

            // Create Course objects from JSON data
            allCourses = jsonData.map(courseData => {
                // Validate required fields
                if (!courseData.id || !courseData.title || !courseData.department) {
                    throw new Error('Missing required course fields');
                }
                return new Course(courseData);
            });

            // Initialize filters
            populateFilters();
            
            // Display courses
            filteredCourses = [...allCourses];
            applyFiltersAndSort();
            
        } catch (error) {
            errorMessage.textContent = 'Invalid JSON file format.';
            errorMessage.classList.add('show');
            allCourses = [];
            filteredCourses = [];
            courseList.innerHTML = '';
            courseDetails.innerHTML = '<p class="placeholder">Select a course to view details</p>';
        }
    };

    reader.onerror = function() {
        errorMessage.textContent = 'Error reading file.';
        errorMessage.classList.add('show');
    };

    reader.readAsText(file);
}

// Populate filter dropdowns based on available data
function populateFilters() {
    // Get unique values using Set
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
    populateDropdown(departmentFilter, Array.from(departments).sort());
    
    // Populate level filter (sort numerically)
    populateDropdown(levelFilter, Array.from(levels).sort((a, b) => a - b));
    
    // Populate credits filter (sort numerically)
    populateDropdown(creditsFilter, Array.from(credits).sort((a, b) => a - b));
    
    // Populate instructor filter (sort alphabetically)
    populateDropdown(instructorFilter, Array.from(instructors).sort());
}

// Helper function to populate dropdown
function populateDropdown(dropdown, values) {
    // Keep the "All" option
    dropdown.innerHTML = '<option value="All">All</option>';
    
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

// Apply filters and sorting
function applyFiltersAndSort() {
    // Start with all courses
    filteredCourses = [...allCourses];

    // Apply department filter
    if (departmentFilter.value !== 'All') {
        filteredCourses = filteredCourses.filter(course => 
            course.department === departmentFilter.value
        );
    }

    // Apply level filter
    if (levelFilter.value !== 'All') {
        filteredCourses = filteredCourses.filter(course => 
            course.level === parseInt(levelFilter.value)
        );
    }

    // Apply credits filter
    if (creditsFilter.value !== 'All') {
        filteredCourses = filteredCourses.filter(course => 
            course.credits === parseInt(creditsFilter.value)
        );
    }

    // Apply instructor filter
    if (instructorFilter.value !== 'All') {
        filteredCourses = filteredCourses.filter(course => 
            course.instructor === instructorFilter.value
        );
    }

    // Apply sorting
    applySorting();

    // Display filtered and sorted courses
    displayCourses();
}

// Apply sorting based on selected option
function applySorting() {
    const sortOption = sortBy.value;

    switch(sortOption) {
        case 'ID (A–Z)':
            filteredCourses.sort((a, b) => a.id.localeCompare(b.id));
            break;
        case 'ID (Z–A)':
            filteredCourses.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'Title (A–Z)':
            filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'Title (Z–A)':
            filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'Semester (Earliest first)':
            filteredCourses.sort((a, b) => compareSemesters(a.semester, b.semester));
            break;
        case 'Semester (Latest first)':
            filteredCourses.sort((a, b) => compareSemesters(b.semester, a.semester));
            break;
        case 'None':
        default:
            // No sorting, keep original order
            break;
    }
}

// Compare semesters for sorting
function compareSemesters(sem1, sem2) {
    const semesterOrder = {
        'Winter': 1,
        'Spring': 2,
        'Summer': 3,
        'Fall': 4
    };

    // Parse semester strings (format: "Season YYYY")
    const [season1, year1] = sem1.split(' ');
    const [season2, year2] = sem2.split(' ');

    // Compare years first
    const yearDiff = parseInt(year1) - parseInt(year2);
    if (yearDiff !== 0) {
        return yearDiff;
    }

    // If years are equal, compare seasons
    return semesterOrder[season1] - semesterOrder[season2];
}

// Display courses in the list
function displayCourses() {
    courseList.innerHTML = '';

    if (filteredCourses.length === 0) {
        courseList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No courses found matching the selected filters.</p>';
        return;
    }

    filteredCourses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.textContent = course.id;
        courseItem.addEventListener('click', () => selectCourse(course, courseItem));
        courseList.appendChild(courseItem);
    });
}

// Select a course and display its details
function selectCourse(course, element) {
    // Remove previous selection
    document.querySelectorAll('.course-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Add selection to clicked item
    element.classList.add('selected');

    // Update course details
    selectedCourse = course;
    courseDetails.innerHTML = course.getFormattedDetails();
}