# Serverless BLOG


# Functionality of the application

This application will allow creating/removing/updating/fetching BLOG items. Each BLOG item can optionally have an attachment image. Each user only has access to BLOG items that he/she has created.

# BLOG items

The application should store BLOG items, and each BLOG item contains the following fields:

* `blogId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `title` (string) - title of a BLOG item
* `content` (string) - content of a BLOG item
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a BLOG item



# How to run the application

## Frontend

To run a client application run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless BLOG application.
