import { parseJQL } from "jql-parser";

export function validateJqlQuery(jqlQuery) {
  try {
    parseJQL(jqlQuery);
    return true; // JQL query is valid
  } catch (error) {
    console.error(error);
    return false; // JQL query is invalid
  }
};

