# Comment_Service
The service allows CRUD operations and the retrieval of basic statistical data
# Description
 It is built on top of NodeJS and Express. It is higly flexible because it provides the following features with opportunity to:

- Create comment by user
- Get specific comments by user
- Retrieve ranked list of top ten(10) hashTags and top ten(10) mentions
- Get all comments with pagination and search by hashTags and mentions
- Update comments by user
- Soft delete comment by users

# Getting Started
To obtain the postman documentation [url](https://documenter.getpostman.com/view/7775892/UzQvsjmM)

To obtain a copy of this app download or clone the repository at this [url](https://github.com/AbonyiXavier/Comment_Service)

# Prerequisites

You must have

- NodeJs Installed
- A browser Installed
- An Internet connection to download the dependencies.

## Installing locally

- (If the repository wasn't cloned)Extract the contents of the downloaded zip file into any suitable location on the computer
- In the command prompt, cd to the root of the directory you extracted the app into
- Run 'npm install' to install all dependencies
- Run 'npm run start' to start the application
- In a browser address bar navigate to `http://localhost:${PORT}` with your preferred PORT on env


## Current Design Image

![current-design-pattern drawio (1)](https://user-images.githubusercontent.com/49367987/179438672-7e2cf801-98cd-4ec5-b456-c996191fcc45.png)

## Built With

- NodeJs
- Express
- Mongodb(database)
- Mongoose (ODM)
- Deployed on Heroku

## Author

- AbonyiXavier
