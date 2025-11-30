// Course class using ES6 class notation
class Course {
    constructor(courseName, instructor, creditHours) {
        this.courseName = courseName;
        this.instructor = instructor;
        this.creditHours = creditHours;
        this.assignments = [];
    }

    addAssignment(assignment) {
        this.assignments.push(assignment);
    }

    displayCourseInfo() {
        console.log(`Course: ${this.courseName} | Instructor: ${this.instructor} | Credit Hours: ${this.creditHours}`);
        if (this.assignments.length > 0) {
            console.log("Assignments >>>");
            this.assignments.forEach(assignment => {
                console.log(`   Title: ${assignment.title} | Due Date: ${assignment.dueDate}`);
            });
        }
    }
}

// Assignment class using ES6 class notation
class Assignment {
    constructor(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
    }
}

// Create instances and test
const course1 = new Course("Software Engineering", "Dr. Pepper", 3);
const assignment1 = new Assignment("Project Proposal", "Jan 15");
const assignment2 = new Assignment("Midterm Report", "Feb 20");

course1.addAssignment(assignment1);
course1.addAssignment(assignment2);
course1.displayCourseInfo();