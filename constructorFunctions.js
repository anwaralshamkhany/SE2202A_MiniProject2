// Course constructor function
function Course(courseName, instructor, creditHours) {
    this.courseName = courseName;
    this.instructor = instructor;
    this.creditHours = creditHours;
    this.assignments = [];
}

Course.prototype.addAssignment = function(assignment) {
    this.assignments.push(assignment);
};

Course.prototype.displayCourseInfo = function() {
    console.log(`Course: ${this.courseName} | Instructor: ${this.instructor} | Credit Hours: ${this.creditHours}`);
    if (this.assignments.length > 0) {
        console.log("Assignments >>>");
        this.assignments.forEach(assignment => {
            console.log(`   Title: ${assignment.title} | Due Date: ${assignment.dueDate}`);
        });
    }
};

// Assignment constructor function
function Assignment(title, dueDate) {
    this.title = title;
    this.dueDate = dueDate;
}

// Create instances and test
const course1 = new Course("Software Engineering", "Dr. Pepper", 3);
const assignment1 = new Assignment("Project Proposal", "Jan 15");
const assignment2 = new Assignment("Midterm Report", "Feb 20");

course1.addAssignment(assignment1);
course1.addAssignment(assignment2);
course1.displayCourseInfo();