const axios = require("axios");
import refreshTokens from "./refreshTokens";
import { decryptCookie } from "./cookieHandler";
import { getCookies, hasCookie } from "cookies-next";
require("dotenv").config();

// GitLab API configuration
const GITLAB_API_URL = process.env.GITLAB_API_URL;
//Function to create a new branch from the live branch with give branch name and on given gitlab project id
const createBranch = async (
  projectId,
  branchName,
  sourceBranch,
  gitlabAccessToken
) => {
  try {
    const ref = sourceBranch; // or any other branch you want to base the new branch on

    const url = `${GITLAB_API_URL}/projects/${projectId}/repository/branches`;
    const response = await axios.post(
      url,
      {
        branch: branchName,
        ref,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gitlabAccessToken}`,
        },
      }
    );

    console.log(`New branch ${branchName} created successfully.`);
    return `New branch ${branchName} created successfully`;
  } catch (error) {
    if (error.response.data.message === "Branch already exists") {
      console.log("Branch already exists");

      return "Branch already exists";
    } else {
      console.error(
        "Failed to create new branch:",
        error.response.data.message
      );
      return "Failed to create new branch";
    }
  }
};
//API endpoint for creating a new branch
export default async (req, res) => {
  if (
    hasCookie("atlassianAccessToken1", { req, res }) &&
    hasCookie("atlassianAccessToken2", { req, res }) &&
    hasCookie("gitlabAccessToken", { req, res })
  ) {
    await refreshTokens(req, res);
    const { gitlabAccessToken } = getCookies({ req, res });
    const decryptedGitlabAccessToken = decryptCookie(gitlabAccessToken);

    const message = await createBranch(
      req.body.project_id,
      req.body.branchName,
      req.body.sourceBranch,
      decryptedGitlabAccessToken
    );
    console.log("---------------------------------");
    res.status(200).json({ message: message });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
