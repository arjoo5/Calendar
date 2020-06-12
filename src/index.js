import { JSONData, weekdays } from "./utils";

/* Html Elements */ 
var jsonInputElement = document.getElementById("json-area");
var updateButton = document.getElementById("update-button");
var yearGrid = document.getElementById("year-grid");
var yearInputBox = document.getElementById("year-input");


/* Assigning default values */
document.getElementById("json-area").defaultValue = JSON.stringify(
  JSONData,
  null,
  4
);
document.getElementById("year-input").defaultValue = "2014";

/* will be called when DOM loads for the first time */
document.addEventListener("DOMContentLoaded", function (event) {
  generateCalendarDay();
});

/* Returns day of the week */
var getDayOfWeek = (year, month, day) => {
  let days = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  year -= month <= 2 ? 1 : 0;
  return (year + parseInt(year / 4) - parseInt(year / 100) + parseInt(year / 400) + days[month - 1] + day) % 7;
};


/* Compares two dates to sort */
var dateSortDesc = (person1, person2) => {
  let date1 = new Date(person1.birthday);
  let date2 = new Date(person2.birthday);
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};

/* Returns dimension(height,width) for person square*/
var getDimensions = (numberOfBirthdays) => {
  return 100/Math.ceil(Math.sqrt(numberOfBirthdays));
};


/* Returns random color for person square*/
var getRandomColor = () => {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/* Generates card for each weekday */
var generateCalendarDay = () => {
  let personArray = JSON.parse(jsonInputElement.value);
  let year = document.getElementById("year-input").value;
  let calendar = {};
  personArray.forEach((person, index) => {
    let birthday = person.birthday.split("/");
    let day = getDayOfWeek(year, birthday[0], birthday[1]);
      if (!calendar[weekdays[day]]) {
        calendar[weekdays[day]] = [];
      }
      calendar[weekdays[day]].push(person);
      calendar[weekdays[day]].length > 1 &&
      calendar[weekdays[day]].sort(dateSortDesc);
  });
  weekdays.forEach(weekday => generatePersonsForADay(weekday, calendar));
};

/* Generates all person square for each weekday */
var generatePersonsForADay = (weekday, calendar) => {
  let day = document.getElementById(weekday);
  day.innerHTML = "";
  let birthdays = calendar[weekday]; // array contains details of all person on particular weekday
  if (birthdays) {
    let dimension = getDimensions(birthdays.length);
    birthdays.forEach((person) => generatePersonSquare(person,dimension,day));
  } else {
    day.classList.add('day--empty');
  }
};

/* Generates Individual Person Square */
var generatePersonSquare = (person,dimension,day) => {
  let personBox = document.createElement("div");
  let personInitials = person.name
    .split(" ")
    .map((n) => n[0])
    .join(" ");
  personBox.innerHTML =
    "<span class=person-text>" + personInitials + "</span>";
  personBox.classList.add("day__person");
  personBox.style["height"] = `${dimension}%`;
  personBox.style["width"] = `${dimension}%`;
  personBox.style["background"] = getRandomColor();
  day.appendChild(personBox);
}

/* checks if both json and year are valid */
var validateInputs = () => {
  let year = yearInputBox.value;
  let jsonInput = jsonInputElement.value;
  let warningElement = document.getElementById("warning-text");
  let yearErr = isValidYear(year);
  let bithDaysErr = areValidBirthDays(jsonInput)
  if (!!yearErr || !!bithDaysErr) {
    let warningText = yearErr || bithDaysErr;
    if(!!bithDaysErr) {
      jsonInputElement.classList.add("alert-danger");
    } else {
      jsonInputElement.classList.remove("alert-danger");
    }
    updateButton.disabled = true;
    if (!warningElement) {
      warningElement = document.createElement("div");
      warningElement.id = "warning-text";
    }
    warningElement.innerHTML =
      `<span class= text-danger> ${warningText} </span>`;
    yearGrid.appendChild(warningElement);
  } else {
    updateButton.disabled = false;
    if (!!warningElement) {
      warningElement.parentElement.removeChild(warningElement);
    }
    jsonInputElement.classList.remove("alert-danger");
  }
};

/* Checks if year is valid or not*/
var isValidYear = (year) => {
  if (year.length != 4) return "INVALID_YEAR";
  return "";
}

/* Returns error type for invalid JSON or invalid Birthday */
var areValidBirthDays = (str) =>{
  try {
    var persons = JSON.parse(str);
    for (const person of persons) {
      if  (new Date(person.birthday) == "Invalid Date") {
        return "INVALID_DATE";
      }
    }
    return "";
  } catch (err) {
    return "INVALID_JSON";
  }
}


/* Event Listeners for all app events */
jsonInputElement.addEventListener("keyup", function () {
  validateInputs();
});

yearInputBox.addEventListener("input", function () {
  validateInputs();
});

updateButton.addEventListener("click", function () {
  generateCalendarDay();
});


