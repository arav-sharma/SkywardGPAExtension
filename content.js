// Creates a set of courses that do not have "advanced" in the class name that are weighted as 4.50
let levelIIExceptions = new Set([
  "Calculus",
  "Discrete Mathematics for Computer Science",
  "JROTC Leadership",
  "Computer Science II",
  "Computer Science I",
  "Medical Terminology",
  "Pathophysiology",
  "Anatomy & Physiology",
  "Pharmacy I",
  "Instructional Practices",
  "Independent Study Journalism I",
  "Independent Study Journalism II",
  "Advanced Journalism Yearbook II",
  "Advanced Journalism Yearbook III",
  "Advanced Journalism Newspaper II",
  "Advanced Journalism Newspaper III",
  "Business Computer Applications",
  "Networking/Networking Lab",
  "Evolving/Emerging Technologies-Esports II",
  "Hospitality Services",
  "Culinary Arts",
  "Principles of Financial Accounting",
  "Principles of Managerial Accounting",
  "Business Principles",
  "Audio/Video Production II",
  "Audio/Video Production II Lab",
  "Graphic Design & Illustration II",
  "Graphic Design II Lab",
  "Animation II",
  "Animation II Lab",
  "Interior Design II",
  "Veterinary Medical Applications",
  "Art Appreciation",
  "Advanced Music Orchestra 10",
  "Advanced Music Choir 10",
  "Advanced Music Band 10"
]);

// Creates a set that includes courses that do not have "AP" or "IB" in the class name but are weighted as 5.0
const levelIIIExceptions = new Set([
  "Computer Science III",
  "Robotics II",
  "Engineering Design & Presentation II",
  "Pharmacy II",
  "Evolving/Emerging Technologies-Esports III",
  "Advanced Marketing",
  "Advanced Music Choir 11",
  "Advanced Music Choir 12",
  "Advanced Music Band 11",
  "Advanced Music Band 12"
]);

// Finds the user's exact date, time and timezone
function formatDateAndTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);

    const formattedDate = dateFormatter.format(now).replace(',', ',');
    const formattedTime = timeFormatter.format(now);

    return `${formattedDate.replace(/ /g, ' ')} at ${formattedTime}`;
}

// Find the user's SM1 Grades
function findGrades (semester) {
  let gradesGPA = [];
  let rawGPA = 0;
  let classGrades;
  const classes = findClasses();

  if (semester === 1) {
    classGrades = document.querySelectorAll('[data-bkt="SEM 1"]');
  } else if (semester === 2) {
    classGrades = document.querySelectorAll('[data-bkt="SEM 2"]');
  }


  for (let i = 0; i < classGrades.length; i++) {
    const currClassGrade = classGrades[i];
    const gradeNum = currClassGrade.textContent.trim();

  
    let calculatedGPADifference = 0;
  
    if (gradeNum >= 70) {
      calculatedGPADifference = (100 - gradeNum) * 0.05;
    } else {
      currWeight = findWeight(classes[i]);

      calculatedGPADifference += currWeight;
    }
  
    gradesGPA.push(calculatedGPADifference);
    rawGPA += calculatedGPADifference;
  
  }




  return [rawGPA, gradesGPA.length];
}

// Finds the user's classes
function findClasses() {
  let classes = [];
  const classNames = document.querySelectorAll('table tbody tr');

  classNames.forEach((row) => {
    const courseNameElement = row.querySelector('.classDesc a[href="javascript:void(0)"]');
    if (courseNameElement) {
      const courseName = courseNameElement.textContent.trim();

      if (!courseName.includes("DC") && !courseName.includes("BM")) {
        if (classes[classes.length - 1] !== courseName) {
          classes.push(courseName);
        }
      }
    }
  });

  return classes;
}

const [GPADifference1, numOfClasses] = findGrades(1);
const [GPADifference2, numOfClasses2] = findGrades(2);

// Calculates the unweighted GPA of the student
function calculateUnweighted() {
  if (numOfClasses === 0) {
    return '0.00';
  }

  const unweightedRaw1 = (numOfClasses * 4 - GPADifference1) / numOfClasses;
  const unweightedRaw2 = (numOfClasses * 4 - GPADifference2) / numOfClasses;


  return [unweightedRaw1.toFixed(2), unweightedRaw2.toFixed(2)];
}

// Finds the weight of a specific class
function findWeight(className) {
  const classNameArray = className.split(" ");

  if (levelIIExceptions.has(className)) {
    return 4.5;
  }

  if (levelIIIExceptions.has(className)) {
    return 5.0;
  }

  for (let i = 0; i < classNameArray.length; i++) {
    if (classNameArray[i] === "AP" || classNameArray[i] === "IB" || classNameArray[i] === "Practicum") {
      return 5.0;
    }

    if (classNameArray[i] === "Advanced") {
     return 4.5

    }
  }
  return 4.0;
}

// Invokes functions
const classes = findClasses();
const formattedDateTime = formatDateAndTime();

// Calculates the weighted GPA of the student
function calculateWeighted() {
  let sumOfWeights = 0;

  for (let i = 0; i < classes.length; i++) {
    const currWeight = findWeight(classes[i]);
    sumOfWeights += currWeight;
  }

  if (numOfClasses === 0) {
    return '0.00';
  }

  let weightedRaw = (sumOfWeights - GPADifference1) / numOfClasses;
  let weightedRaw2 = (sumOfWeights - GPADifference2) / numOfClasses;

  return [weightedRaw.toFixed(2), weightedRaw2.toFixed(2)];
}

const [sem1UW, sem2UW] = calculateUnweighted();
const [sem1W, sem2W] = calculateWeighted();

const averageUW = ((parseFloat(sem1UW) + parseFloat(sem2UW))*0.5).toFixed(2)
const averageW = ((parseFloat(sem1W) + parseFloat(sem2W))*0.5).toFixed(2)

// HTML to be in added to the website
// Function to determine if only Semester 1 should be shown
function shouldShowSemester1Only() {
  const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)

  // Return true if the current month is between August (8) and December (12)
  return currentMonth >= 8 && currentMonth <= 12;
}

const currentYear = new Date().getFullYear();

// Determine whether to show both semesters or only Semester 1
const showSemester1Only = shouldShowSemester1Only();

// Prepare the HTML to be injected based on the current month
const injectedHTML = `
    <div id="missingAssignmentsModuleWrapper">
        <div id="grid_missingAssignmentsModule_gridWrap" grid-theme="summary" class="gridWrap">
            <div class="sf_gridTableWrap">
                <table vpaginate="no" id="grid_missingAssignmentsModule" grid-table="summary" zebra="false">
                    <tbody>
                        <!-- Always show Semester 1 -->
                        <tr class="">
                            <td scope="row">
                                SM1 Unweighted GPA ${sem1UW} & SM1 Weighted GPA: ${sem1W}
                            </td>
                        </tr>
                        <!-- Conditionally show Semester 2 if not restricted to Semester 1 only -->
                        ${!showSemester1Only ? `
                        <tr class="">
                            <td scope="row">
                               SM2 Unweighted GPA ${sem2UW} & SM2 Weighted GPA: ${sem2W}
                            </td>
                        </tr>
                        ` : ''}
                        <!-- Always show time information -->
                        <tr class="">
                            <td scope="row">
                               <div style="display: flex; justify-content: space-between;">
                                   ${!showSemester1Only ? `<span>${currentYear-1}-${currentYear} Unweighted: ${averageUW} & ${currentYear-1}-${currentYear} Weighted: ${averageW}</span>` : ''}
                                   <span>Last calculated on ${formattedDateTime}</span>
                               </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

// Function to inject the HTML
function injectGPA() {
  const targetDiv = document.getElementById("missingAssignmentsModuleWrapper");

  if (targetDiv) {
    const container = document.createElement('div');
    container.innerHTML = injectedHTML;
    targetDiv.insertAdjacentElement('afterend', container);
  }
}

// Define targetURL and ensure that the user is on the correct URL before injecting HTML (failsafe)
const targetURL = "https://skyward.iscorp.com/scripts/wsisa.dll/WService=wseduallenisdtx/sfgradebook001.w";

if (window.location.href.startsWith(targetURL)) {
  injectGPA();
}