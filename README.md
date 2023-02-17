# Glen Stanbridge Lumina Learning Project

## Technologies

As this is a small project, to keep things lightweight no framework was used.

Backend is bespoke PHP to serve the requirements of the project.
Pages are not dynamically served, all requests that require database data are served via AJAX
Front end is styled with SASS - processed via a Gulp
Interactivity is provided by JQuery
A MySQL database is used for the database. I have changed the structure of the database in order to store question answer options and the correct answer, this reduces duplication of question text.

## How it works

A simple index.html is served and contains simple markup.
A JQuery script initialises on page load and interrogates the backend for the set of questions and options, which are then dynamically inserted into the DOM
The user is then presented with the first question and options, until an option is chosen they are cannot progress to the next question.
When all questions have been answered, these are then sent via AJAX to the backend and scored with a single query.
The score is then presented to the user along with the option to add a username, if they do, their score is recorded and the backend also provides the front end with the Top5 scores as well as the average score recorded.

## Improvements

The UI is simple but effective, but can certainly be improved upon, especially on mobile. Time constraints have limited my work in this area.
Ideally, a number of security measures should be used to prevent CSRF events - at the moment a score and username could be added by any request.
Sessions should be used to record scores, currently the application doesn't record a score for a session in the backend so can be user manipulated on the front end.





