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

console.log(classes);

let levelIIExceptions = new Set();
levelIIExceptions.add("Calculus");
levelIIExceptions.add("Discrete Mathematics for Computer Science");
levelIIExceptions.add("Computer Science I");

function calculateWeighted() {


  let sumOfWeights = 0;

  for (let i = 0; i < classes.length; i++) {
    const currWeight = findWeight(classes[i]);
    console.log(`${classes[i]} ${currWeight}`);
    sumOfWeights += currWeight;
    console.log(sumOfWeights);
  }

  console.log(sumOfWeights);

  const [GPADifference, numOfClasses] = findGrades();
  let weightedRaw = (numOfClasses * 4  - GPADifference) / numOfClasses;

  return weightedRaw.toFixed(2);
}


function findWeight(className) {
  const classNameArray = className.split(" ");

  if (levelIIExceptions.has(className)) {
    return 4.5;
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
