# Student Grades Analyzer

A Node.js CLI application that manages student data and generates various statistics. This project demonstrates proficiency with JavaScript (ES6), file I/O using Node's built-in `fs` module, and clean code practices using classes, JSDoc, and modern array methods.

## Project Overview

**Student Grades Analyzer** allows you to:

- **Add Students:** Add a student with a name and a set of grades.
- **List Students:** Display all students with their respective grades.
- **Calculate Statistics:**
  - Compute each student's overall average.
  - Identify highest and lowest grades per student.
  - Identify the student with the highest and lowest overall averages.
- **Search and Filter:**
  - Search students by name.
  - Filter students above a certain average threshold.
- **Sort Students:** Sort students by their average grade in ascending or descending order.
- **Modify Data:** Update student grades or delete a student.
- **Export Data:** Export statistics and results in JSON and CSV formats.

## Use Cases

Refer to the [USE_CASES.md](./USE_CASES.md) file for a detailed list of use cases.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v12 or later) must be installed on your system.

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/justjslp/student-grades-analyzer.git
   cd student-grades-analyzer
   ```

2. **Install Dependencies:**

   There are no external dependencies for this project aside from Node.js. All funcionality is built-in.

3. **Run the Script:**

   (**Note:** Ensure you are in the root directory where **`studentGradesAnalyzer.js`** is located before running the command. This will guarantee that Node.js can properly locate and execute the script.)

   ```bash
   node studentGradesAnalyzer.js
   ```

## Usage Examples

When you run the script, it will perform the following operations:

- Create multiple student records.
- Calculate and export statistics:
  - A CSV file (e.g. courseA_statistics.csv) with overall statistics.
  - A JSON file (e.g. courseA_results.json) with compiled results from various use cases.

**Example Command:**

```bash
node studentGradesAnalyzer.js
```

**Expected Output:**

```bash
CSV File Generated: courseA_statistics.csv
JSON File Generated: courseA_results.json
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- Develped using Node.js and ES6 features.
- Inspired by modern clean practices and use case-driven design.
