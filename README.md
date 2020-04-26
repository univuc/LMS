# LMS

**LMS Management System**

> This project is part of [Univ UC](https://github.com/univuc).

## Features

### Lectures and assignments

LMS allows users to collection lectures and assignments without accessing Moodle LMS.    
It is done by parsing the website with given user id.

A lecture(or clip) consists of these fields:

- `id`: identifier of the lecture.
- `courseId`: id of the course where the lecture belongs.
- `type`: type of the lecture. `vod`, `econtents`, or `xncommons`.
- `title`: title of the lecture.
- `runningTime`: running time of the lecture.
- `dueStart`: start date and time of the due.
- `dueEnd`: end date and time of the due.

For an assignment:

- `id`: identifier of the assignment.
- `courseId`: id of the course where the assignment belongs.
- `title`: name of the assignment.
- `dueStart`: start date and time of the due.
- `dueEnd`: end date and time of the due.

### Hack records

Clips are hackable. Progress report happens in a user's browser.    
LMS mocks a 92% progress report request. No one can find suspicious moves from requests LMS make.    

It is important to make a right history to the server.     
The server collects a progress, followed by a learning time.    
If one watched over half of a one-hour length lecture within a minute, it would be very unnatural.

LMS covers it.    
It schedules a request to leave a right record at the server. Cool?

### Notify

Univ UC users have slack accounts.    
LMS sends a notification to a user when the user has not completed an assignment or lecture.

## Environments

LMS requires these options as environment variables:

- **`UAS_AUTH_SECRET`**: secret to verify a login token.
- `LMS_PORT`: port to listen to.
- `LMS_SLACK_TOKEN`: slack token for web api.
- `LMS_SLACK_SIGNING_SECRET`: a signing secret to authenticate incoming slack event.

## License

LMS is released under GPL v3.    
You can receive a full copy of it [here](https://github.com/univuc/UAS/blob/master/LICENSE).

