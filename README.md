#  Dynamic Question Assignment Writeup

## Introduction
To solve the dynamic question assignment problem, I began by focusing on the rotateQuestions function. The goal is to assign questions to different countries in such a way that no two regions have the same question in the same cycle, and the assignment rotates over time.

### Data Structures
I created a countryQuestionsMap to represent each country's set of questions. This map serves as a stand-in for a database in this example.

```javascript
// Country-Question map where each country has its own set of questions
type CountryQuestionsMap = Map<string, number[]>;
```

Additionally, I used:

- currentQuestionIndex: A map to keep track of the current index of the question to be assigned for each country.
- assignedQuestions: A set to keep track of the questions already assigned in the current cycle.

### Rotation Strategy
The strategy for rotating questions is as follows:

1. **Assignment per Country:** For each country, attempt to assign the question at the current index in its question list.

2. **Conflict Checking:** Before assigning, check if the question has already been assigned to another country in the current cycle by checking the assignedQuestions set.

3. **Index Incrementing:** If the question has been assigned elsewhere, increment the current index for that country by 1 (modulo the length of the question list to loop back if necessary) and check again. Repeat this process until an unassigned question is found or all questions have been checked.

4. **Assignment and Updating:** Once an unassigned question is found, assign it to the country. Add the question to the assignedQuestions set. Update the currentQuestionIndex for the country for the next cycle.

### Scheduling
Next, I had to tackle the issue of scheduling the rotation. This I divided into two parts:

1. **Calculating the time to next cycle:**
To handle this problem I used setTimeout. I first calculated the current time in milliseconds since January 1, 1970 (UTC) when clock strikes 7PM in Singapore on Monday, and then subtracted the current time in miliseconds. This gives me the miliseconds to 7PM on Monday in Singapore.

2. **Frequency of scheduling the Rotation:**
I used setTimeout to schedule the first rotation and then setInterval for further executions.

## Cons of this approach
1. **Time complexity:** The biggest downside of this approach would be the time complexity, it currently stands at 𝑂(𝐶×𝑁), where 𝐶 is the number of countries and 𝑁 is the maximum number of questions in any country's question set.

## Pros of this approach
1. **Conflict avoidance:** This approach guarantees that there won't be any conflct between the questions assigned to different regions. Everytime a unique question would be assigned to each country.
2. Despite the 𝑂(𝐶×𝑁) complexity, the approach is practical for handling 100k daily active users and scaling to millions, especially if 𝑁 (number of questions per country) is manageable.
3. The system can handle configurable cycle durations (e.g., 1 day, 7 days, 14 days, 30 days) without impacting the assignment logic.

## Potential Improvements
1. One possible way to handle the time complexity would be through some preprocessing of the data. Since the rotation happens every week, we can check for conflicts in advance and maintain a queue of questions. At each cycle, assign the next question in the queue to the country. This way the time complexity drops to O(C) per cycle, since we simply assign the next question from the queue.
2. Caching the previous assignments. This can help us guarantee that no region gets same question in two consecutive cycles.