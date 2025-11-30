// Course Constructor Function (alternative to ES6 class)
function Course(data) {
    this.id = data.id;
    this.title = data.title;
    this.department = data.department;
    this.level = data.level;
    this.credits = data.credits;
    this.instructor = data.instructor;
    this.description = data.description;
    this.semester = data.semester;
    this.assignments = data.assignments || [];
}

// Method to get formatted course details
Course.prototype.getDetails = function() {
    return {
        id: this.id,
        title: this.title,
        department: this.department,
        level: this.level,
        credits: this.credits,
        instructor: this.instructor || 'Not assigned',
        semester: this.semester,
        description: this.description
    };
};

// toString method for formatted output
Course.prototype.toString = function() {
    return `Course: ${this.title} | Instructor: ${this.instructor} | Credit Hours: ${this.credits}`;
};

// Method to display assignments
Course.prototype.displayAssignments = function() {
    if (this.assignments.length === 0) {
        return;
    }
    
    console.log('Assignments >>>');
    this.assignments.forEach(assignment => {
        console.log(`   Title: ${assignment.title} | Due Date: ${assignment.dueDate}`);
    });
};

// Method to print course information
Course.prototype.printCourseInfo = function() {
    console.log(this.toString());
    this.displayAssignments();
};

// Method to create HTML for course item in list
Course.prototype.getListHTML = function() {
    return `<div class="course-item" data-id="${this.id}">
                <h3>${this.id}</h3>
            </div>`;
};

// Method to create HTML for detailed course view
Course.prototype.getDetailsHTML = function() {
    const details = this.getDetails();
    return `
        <h3>${details.id}</h3>
        <p><strong>Title:</strong> ${details.title}</p>
        <p><strong>Department:</strong> ${details.department}</p>
        <p><strong>Level:</strong> ${details.level}</p>
        <p><strong>Credits:</strong> ${details.credits}</p>
        <p><strong>Instructor:</strong> ${details.instructor}</p>
        <p><strong>Semester:</strong> ${details.semester}</p>
        <div class="description">${details.description}</div>
    `;
};

// Export for Node.js
module.exports = Course;