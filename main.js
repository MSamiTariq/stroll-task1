// This map keeps track of the current question index for each country
var currentQuestionIndex = new Map();
// Set to track the questions already assigned in this cycle
var assignedQuestions = new Set();
// Rotate questions function
function rotateQuestions(countryQuestionsMap) {
    // Clear the assigned questions set for a new cycle
    assignedQuestions.clear();
    // Loop over each country in the map
    countryQuestionsMap.forEach(function (questions, country) {
        var questionToAssign;
        // Get the current index for this country (or start at 0 if not assigned)
        var currentIdx = currentQuestionIndex.get(country) || 0;
        // Try to find a question that hasn't been assigned yet
        for (var i = 0; i < questions.length; i++) {
            var question = questions[currentIdx];
            // If the question is not assigned, break and use it
            if (!assignedQuestions.has(question)) {
                questionToAssign = question;
                break;
            }
            // Move to the next question in a cyclic manner
            currentIdx = (currentIdx + 1) % questions.length;
        }
        // Assign the found question
        if (questionToAssign !== undefined) {
            console.log("Assigning question ".concat(questionToAssign, " to ").concat(country));
            assignedQuestions.add(questionToAssign);
            currentQuestionIndex.set(country, (currentIdx + 1) % questions.length); // Update for next cycle
        }
        else {
            console.log("No unassigned question available for ".concat(country));
        }
    });
    console.log("Rotation complete. Assigned questions:", Array.from(assignedQuestions));
}

function getMonday7pmSGT() {
  var now = new Date();

  // Get the current time in Singapore Time (SGT)
  var SGTOffset = 8 * 60; // SGT is UTC+8
  var currentUTCTime = now.getTime() + now.getTimezoneOffset() * 60000;
  var SGTTime = new Date(currentUTCTime + SGTOffset * 60000);

  // Determine the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  var currentDay = SGTTime.getDay();
  var daysUntilMonday = (1 - currentDay + 7) % 7; // Calculate days until next Monday

  // Set the target time to the next Monday at 7 PM SGT
  var next7pmSGT = new Date(SGTTime);
  next7pmSGT.setHours(19, 0, 0, 0); // Set to 7 PM (19:00) instead of 7 AM

  // If today is Monday and current time is after 7 PM, move to the next Monday
  if (daysUntilMonday === 0 && SGTTime.getTime() > next7pmSGT.getTime()) {
    daysUntilMonday += 7; // Move to the next Monday
  }

  // Add the number of days to the next Monday's 7 PM
  next7pmSGT.setDate(next7pmSGT.getDate() + daysUntilMonday);

  return next7pmSGT.getTime() - SGTTime.getTime();
}

function scheduleTask() {
    var now = new Date();
    var timeUntilNext7amSGT = getMonday7pmSGT();
    var countryQuestionsMap = new Map([
        ["Singapore", [1, 2, 3]],
        ["USA", [1, 2, 3]],
        ["Australia", [1, 2, 3]],
    ]);

    // Schedule the first execution using setTimeout
    setTimeout(function () {
      rotateQuestions(countryQuestionsMap);
      // After the first execution, schedule subsequent calls at the specified frequency
      setInterval(function () {
        rotateQuestions(countryQuestionsMap);
      }, frequency);
    }, timeUntilNext7amSGT);
}

scheduleTask();
