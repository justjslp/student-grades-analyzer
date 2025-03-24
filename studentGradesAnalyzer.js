import fs from "fs";

/**
 * Represents a student.
 */

class Student {
  /**
   * Creates a new Student.
   * @param {number} id - The student's unique identifier.
   * @param {string} name - The student's name.
   * @param {object} listOfGrades - An object containing subjects as keys and grades as values.
   */
  constructor(id, name, listOfGrades) {
    this.id = id;
    this.name = name;
    this.listOfGrades = listOfGrades;
  }
}

/**
 * Represents a course that manages a collection of students and provides various statistics.
 */
class Course {
  constructor() {
    /** @type {Student[]} */
    this.listOfStudents = [];
    /** @type {number} */
    this.nextId = 1;
  }

  /**
   * Adds a new student to the course.
   * @param {string} name - The student's name.
   * @param {object} listOfGrades - The student's grades.
   */
  addStudent(name, listOfGrades) {
    this.listOfStudents.push(new Student(this.nextId++, name, listOfGrades));
  }

  /**
   * Returns the list of students with their details.
   * @returns {Array<Object>} An array of student objects.
   */
  getStudentsList() {
    if (this.listOfStudents.length === 0) return "The list is empty.";
    return this.listOfStudents.map(({ id, name, listOfGrades }) => ({
      id,
      name,
      listOfGrades,
    }));
  }

  /**
   * Calculates the average of the grades provided.
   * @param {object} listOfGrades - An object with subject grades.
   * @returns {number} The calculated average.
   */
  calculateAverage(listOfGrades) {
    return (
      Object.values(listOfGrades).reduce((a, b) => a + b, 0) /
      Object.keys(listOfGrades).length
    );
  }

  /**
   * Computes the overall average for each student.
   * @returns {Array<Object>} An array of objects with student name and average grade.
   */
  overallAverage() {
    return this.listOfStudents.map(({ name, listOfGrades }) => ({
      name,
      average: Number(
        parseFloat(this.calculateAverage(listOfGrades)).toFixed(2)
      ),
    }));
  }

  /**
   * Identifies the student with the highest and lowest overall average.
   * @returns {Array<Object>} An array where the first element is the student with the highest average and the second is with the lowest.
   */
  studentsPerformanceOverall() {
    const overallAverage = this.overallAverage();
    return [
      overallAverage.reduce(
        (max, student) => (student.average > max.average ? student : max),
        overallAverage[0]
      ),
      overallAverage.reduce(
        (min, student) => (student.average < min.average ? student : min),
        overallAverage[0]
      ),
    ];
  }

  /**
   * Obtains the subjects with the highest and lowest grade from a set of grades.
   * @param {object} listOfGrades - An object with subject grades.
   * @returns {Object} An object containing two properties: highestSubjects and lowestSubjects.
   */
  highestAndLowestGrade(listOfGrades) {
    const grades = Object.values(listOfGrades);
    const maxGrade = Math.max(...grades);
    const minGrade = Math.min(...grades);

    return {
      highestSubjects: Object.entries(listOfGrades)
        .filter(([_, grade]) => grade === maxGrade)
        .map(([subject, grade]) => ({ subject, grade })),
      lowestSubjects: Object.entries(listOfGrades)
        .filter(([_, grade]) => grade === minGrade)
        .map(([subject, grade]) => ({ subject, grade })),
    };
  }

  /**
   * Returns the individual statistics (highest and lowest subjects) for each student.
   * @returns {Array<Object>} An array with the overall statistics for each student.
   */
  getOverallStatistics() {
    return this.listOfStudents.map(({ name, listOfGrades }) => ({
      name,
      highestAndLowestSubjects: this.highestAndLowestGrade(listOfGrades),
    }));
  }

  /**
   * Retrieves detailed statistics for a specific student.
   * @param {string} name - The student's name.
   * @returns {Object|null} An object with the student's name, average, highest and lowest subjects, or null if not found.
   */
  getStudentStatistics(name) {
    const student = this.getStudentByName(name);

    if (!student) return null;

    return {
      name: student.name,
      average: this.overallAverage().find((student) => student.name === name)
        .average,
      ...this.highestAndLowestGrade(student.listOfGrades),
    };
  }

  /**
   * Searches for a student by name.
   * @param {string} name - The student's name.
   * @returns {Object|null} The student object or null if not found.
   */
  getStudentByName(name) {
    return (
      this.getStudentsList().find((student) => student.name === name) || null
    );
  }

  /**
   * Lists students whose average grade is above a defined threshold.
   * @param {number} threshold - The minimum average grade.
   * @returns {Array<Object>} An array of students meeting the threshold.
   */
  getStudentsAverageThreshold(threshold) {
    return this.overallAverage()
      .filter(({ average }) => average > threshold)
      .map(({ name, average }) => ({
        name,
        average,
        listOfGrades: this.getStudentByName(name).listOfGrades,
      }));
  }

  /**
   * Sorts students by their average grade.
   * @param {boolean} [descending=false] - If true, sorts in descending order; otherwise ascending.
   * @returns {Array<Object>} An array of sorted student averages.
   */

  sortStudentsAverage(descending = false) {
    return this.overallAverage().sort((a, b) =>
      descending ? b.average - a.average : a.average - b.average
    );
  }

  /**
   * Removes a student by name and reassigns IDs.
   * @param {string} name - The name of the student to delete.
   */
  deleteStudent(name) {
    this.listOfStudents = this.listOfStudents.filter(
      (student) => student.name !== name
    );
    this.listOfStudents.forEach((student, index) => (student.id = index + 1));
  }

  /**
   * Updates the grades of a specific student.
   * @param {string} name - The student's name.
   * @param {object} newGrades - An object with the new grades to update.
   * @returns {Object|null} The updated student object, or null if not found.
   */
  updateStudentGrades(name, newGrades) {
    const student = this.getStudentByName(name);
    if (!student) return null;
    Object.assign(student.listOfGrades, newGrades);
    return student;
  }

  /**
   * Exports overall statistics to a CSV file.
   * @param {string} filename - The name of the CSV file to create.
   */
  exportStatisticsToCSV(filename) {
    const overallAverage = this.overallAverage();
    const statistics = this.getOverallStatistics();
    const headers = "Name, Average, Highest Subjects, LowestSubjects\n";

    const rows = overallAverage
      .map(({ name, average }) => {
        const stat = statistics.find((student) => student.name === name);
        const highestStr = stat.highestAndLowestSubjects.highestSubjects
          .map(({ subject, grade }) => `${subject} (${grade})`)
          .join(" / ");
        const lowestStr = stat.highestAndLowestSubjects.lowestSubjects
          .map(({ subject, grade }) => `${subject} (${grade})`)
          .join(" / ");

        return `${name}, ${average}, "${highestStr}", "${lowestStr}"`;
      })
      .join("\n");

    const csvContent = headers + rows;

    fs.writeFileSync(filename, csvContent, "utf8");
    console.log(`CSV File Generated: ${filename}`);
  }

  /**
   * Exports provided results to a JSON file.
   * @param {object} result - The results object to export.
   * @param {string} filename - The name of the JSON file to create.
   */
  exportJSONResults(result, filename) {
    const jsonData = JSON.stringify(result, null, 2);

    fs.writeFileSync(filename, jsonData, "utf8");
    console.log(`JSON File Generated: ${filename}`);
  }
}

// ------------------------------------------
// Example usage

const courseA = new Course();

// 1. Add Students
courseA.addStudent("Student1", {
  math: 9.6,
  science: 8.8,
  history: 6.7,
  spanish: 8,
  computerScience: 10,
  business: 8,
});
courseA.addStudent("Student2", {
  math: 7,
  science: 8.5,
  history: 8,
  spanish: 9,
  computerScience: 10,
  business: 7.9,
});
courseA.addStudent("Student3", {
  math: 8.8,
  science: 9.6,
  history: 9,
  spanish: 9.2,
  computerScience: 9.6,
  business: 9,
});
courseA.addStudent("Student4", {
  math: 10,
  science: 10,
  history: 10,
  spanish: 10,
  computerScience: 10,
  business: 10,
});

// Aditional Insertions
for (let i = 5; i <= 50; i++) {
  courseA.addStudent(`Student${i}`, {
    math: Math.round((7 + Math.random() * 3) * 10) / 10,
    science: Math.round((7 + Math.random() * 3) * 10) / 10,
    history: Math.round((6 + Math.random() * 4) * 10) / 10,
    spanish: Math.round((7 + Math.random() * 3) * 10) / 10,
    computerScience: Math.round((8 + Math.random() * 2) * 10) / 10,
    business: Math.round((7 + Math.random() * 3) * 10) / 10,
  });
}

// 2. List Students
const courseAStudents = courseA.getStudentsList();

// 3. Calculate General Statistic
// 3.1. Overall Average
const overallAverage = courseA.overallAverage();

// 3.2. Identify the highest and lowest grades among all students
// 3.2.1. Students Performance Overall (highest and lowest overall average)
const studentsPerformanceOverall = courseA.studentsPerformanceOverall();

// 3.2.2. Overall Statistics (highest and lowest subjects per student)
const overallStatistics = courseA.getOverallStatistics();

// 4. Get Student Statistics for a specific student
const statisticsPStudent = courseA.getStudentStatistics("Student3");

// 5. Filter Students
// 5.1. Search student by name
const student = courseA.getStudentByName("Student1");

// 5.2. ist students with an average above a threshold
const studentsAverageThreshold = courseA.getStudentsAverageThreshold(8.39);

// 6. Sort Students by average grade (ascending and descending)
const studentsAverageAscending = courseA.sortStudentsAverage(false);
const studentsAverageDescending = courseA.sortStudentsAverage(true);

// 7. Delete a student by name
courseA.deleteStudent("Student3");

// 8. Update a student's grades
courseA.updateStudentGrades("Student4", {
  math: 8,
  science: 3,
  history: 8,
  computerScience: 9.2,
});

// 9. Export Statistics to CSV
courseA.exportStatisticsToCSV("courseA_statistics.csv");

// Compile results for export in JSON format
const results = {
  "List of students": courseAStudents,
  "Overall average": overallAverage,
  "Students Performance Overall": studentsPerformanceOverall,
  "Individual Student Statistics": statisticsPStudent,
  "Overall Statistics": overallStatistics,
  "Student's statistics": student,
  "Students Above Threshold": studentsAverageThreshold,
  "Sorted Students": {
    ascending: studentsAverageAscending,
    descending: studentsAverageDescending,
  },
};

// Export the compiled results to a JSON file
courseA.exportJSONResults(results, "courseA_results.json");
