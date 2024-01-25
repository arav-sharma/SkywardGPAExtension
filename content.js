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
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);

    const formattedDate = dateFormatter.format(now).replace(',', '');
    const formattedTime = timeFormatter.format(now);

    return `${formattedDate.replace(/ /g, '-')} at ${formattedTime}`;
}

// Find the user's SM1 Grades
function findGrades (semester) {
  let gradesGPA = [];
  let rawGPA = 0;
  let classGrades;

  if (semester === 1) {
    classGrades = document.querySelectorAll('[data-bkt="SEM 1"]');
  } else if (semester === 2) {
    classGrades = document.querySelectorAll('[data-bkt="SEM 2"]');
  }
  
  classGrades.forEach((currClassGrade) => { 
    const gradeNum = currClassGrade.textContent.trim();
    let i = 1;
    console.log(i + " " + gradeNum);
    i++;
    
    let calculatedGPADifference = (100 - gradeNum) * 0.05;

    if (gradeNum < 70) {
      calculatedGPADifference = 0;
    }

    gradesGPA.push(calculatedGPADifference);
    rawGPA += calculatedGPADifference;

  });

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

// Calculates the unweighted GPA of the student
function calculateUnweighted() {
  const [GPADifference1, numOfClasses] = findGrades(1);
  const [GPADifference2, other] = findGrades(2);

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

  const [GPADifference1, numOfClasses] = findGrades(1);
  const [GPADifference2, other] = findGrades(2);

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
const injectedHTML = `
    <div id="missingAssignmentsModuleWrapper">
        <div id="grid_missingAssignmentsModule_gridWrap" grid-theme="summary" class="gridWrap">
            <div class="sf_gridTableWrap">
                <table vpaginate="no" id="grid_missingAssignmentsModule" grid-table="summary" zebra="false">
                    <tbody>
                        <tr class="">
                            <td scope="row">
                                SM1 Unweighted ${sem1UW} & Weighted: ${sem1W}
                            </td>
                        </tr>
                        <tr class="">
                            <td scope="row">
                               SM2 Unweighted ${sem2UW} & Weighted: ${sem2W}
                            </td>
                        </tr>
                         <tr class="">
                            <td scope="row">
                               <div style="display: flex; justify-content: space-between;">
                                   <span>2023-2024 Unweighted: ${averageUW} & Weighted: ${averageW}</span>
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

// Finds where to inject the HTML 
function injectGPA() {
  const targetDiv = document.getElementById("missingAssignmentsModuleWrapper");

  if (targetDiv) {
    const container = document.createElement('div');
    container.innerHTML = injectedHTML;
    targetDiv.insertAdjacentElement('afterend', container);
  }
}

// Defnines targetURL and ensures that the user is on the correct URL before injected HTML (failsafe)
const targetURL = "https://skyward.iscorp.com/scripts/wsisa.dll/WService=wseduallenisdtx/sfgradebook001.w";

if (window.location.href.startsWith(targetURL)) {
    injectGPA();
}
