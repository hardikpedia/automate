Cherry Picking Automation App

# Cherry Picking Automation App

## Overview

The Cherry Picking Automation App is a Next.js application that automates the process of cherry-picking merge commits from GitLab into a new branch. It fetches Jira issues using a JQL query provided by the user, extracts comments from those Jira issues, identifies GitLab PR links using regular expressions, fetches merge commit IDs from those PR links using the GitLab API, creates a new branch based on user input, and cherry picks the merge commits into the new branch.

## Prerequisites

Before running the app, make sure you have the following installed:

- Node.js (version X.X.X or later)
- GitLab account with API access
- Atlassian account with API access

## Getting Started
rfr
1.  Clone the repository:  
    `git clone https://github.com/your-username/cherry-picking-automation-app.git`
2.  Install the dependencies:  
    `cd cherry-picking-automation-app   npm install`
3.  Set up environment variables:  
    Rename the `.env.example` file to `.env` and provide the necessary values for the following environment variables:
    - `GITLAB_API_URL`: The URL of the GitLab API.
    - `GITLAB_CLIENT_ID`: The URL of the GitLab API.
    - `GITLAB_CLIENT_SECRET`: Your GitLab access token.
    - `JIRA_API_URL`: The URL of the Jira API.
    - `ATLASSIAN_CLIENT_ID`: Your Jira username.
    - `ATLASSIAN_CLIENT_SECRET`: Your Jira API token.
4.  Start the app:  
    `npm run dev`  
    The app will start on [http://localhost:3000](http://localhost:3000).

## Usage

1.  Access the app in your web browser by navigating to [http://localhost:3000](http://localhost:3000).
2.  Provide the JQL query to fetch the desired Jira issues.
3.  The app will fetch the Jira issues and extract comments from them.
4.  The app will identify GitLab PR links in the comments using regular expressions.
5.  The app will fetch the merge commit IDs from the GitLab PR links using the GitLab API.
6.  Enter the branch name you want to create and cherry pick the merge commits into.
7.  Click the "Cherry Pick" button to initiate the cherry-picking process.
8.  The app will create the new branch and cherry pick the merge commits into it.
9.  Monitor the app's console logs for progress and any errors.
10. Once the cherry-picking process is complete, you will see the list of conflicts, if any.

## Deployment

The Cherry Picking Automation App is deployed and accessible online. You can access the deployed version of the app using the following links:


