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
  "Independent Study Journalism I, II",
  "Advanced Journalism: Yearbook II, III (Editors)",
  "Advanced Journalism: Newspaper II, III (Editors)",
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



function formatDateAndTime() {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(new Date());
    return formattedDateTime;
}

function findGrades () {
  let gradesGPA = [];
  let rawGPA = 0;
  const classGrades = document.querySelectorAll('td.fB.fWn.fIl a[data-lit="SM1"]');

  classGrades.forEach((currClassGrade) => { 
    const gradeNum = currClassGrade.textContent.trim();

    const calculatedGPADifference = (100 - gradeNum) * 0.05;
    gradesGPA.push(calculatedGPADifference);
    
    rawGPA += calculatedGPADifference;

  });

  return [rawGPA, gradesGPA.length];
}

function findClasses() {
  let classes = []; 
  const classNames = document.querySelectorAll('table tbody tr');

  classNames.forEach(row => {
    const courseNameElement = row.querySelector('.classDesc a[href="javascript:void(0)"]');
    if (courseNameElement) {
      const courseName = courseNameElement.textContent.trim();
      if (classes[classes.length-1] !== courseName) {
        classes.push(courseName);
      }
    }
  });

  return classes;
}

function calculateUnweighted() {
  const [GPADifference, numOfClasses] = findGrades();
  let unweightedRaw = (numOfClasses * 4 - GPADifference) / numOfClasses;

  return unweightedRaw.toFixed(2);
}



const classes = findClasses();
const formattedDateTime = formatDateAndTime();
const unweightedGPA = calculateUnweighted();
const weightedGPA = calculateWeighted();


function calculateWeighted() {
  let sumOfWeights = 0;

  for (let i = 0; i < classes.length; i++) {
    const currWeight = findWeight(classes[i]);
    sumOfWeights += currWeight;
  }

  const [GPADifference, numOfClasses] = findGrades();
  let weightedRaw = (sumOfWeights - GPADifference) / numOfClasses;

  return weightedRaw.toFixed(2);
}


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

    if (classNameArray[i] === "DC" || classNameArray[i] === "Advanced" || classNameArray[i] === "Dual") {
     return 4.5
     
    }


  }
  return 4.0;
}

const injectedHTML = `
    <div id="missingAssignmentsModuleWrapper"><div id="grid_missingAssignmentsModule_gridWrap" grid-theme="summary" class="gridWrap"><div class="sf_gridTableWrap"><table vpaginate="no" id="grid_missingAssignmentsModule" grid-table="summary" zebra="false"><tbody><tr class=""><td scope="row">Your weighted GPA is: ${weightedGPA} and your unweighted GPA is: ${unweightedGPA} as of ${formattedDateTime}.</td></tr></tbody></table></div></div></div>
`;

function injectGPA() {
  const targetDiv = document.getElementById("missingAssignmentsModuleWrapper");

  if (targetDiv) {
    const container = document.createElement('div');
    container.innerHTML = injectedHTML;
    targetDiv.insertAdjacentElement('afterend', container);
  }
}

const targetURL = "https://skyward.iscorp.com/scripts/wsisa.dll/WService=wseduallenisdtx/sfgradebook001.w";

if (window.location.href.startsWith(targetURL)) {
    injectGPA();
}