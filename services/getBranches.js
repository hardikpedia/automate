import axios from "axios";
  

//Function to fetch branches from gitlab

export const getBranches = async (project_id) => {
  console.log("Fetching branches");

  const response = await axios.post("/api/getBranches", {
    project_id,
  });

  return response.data.branches;
};
