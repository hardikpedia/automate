import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
function SearchableIssuesTable({ issues }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFullErrorMessage, setShowFullErrorMessage] = useState("");

  const filteredIssues = issues.filter(
    (issue) =>
      issue[1].issueKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue[1].message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const truncateErrorMessage = (errorMessage) => {
    const words = errorMessage.split(" ");
    if (words.length > 4) {
      return words.slice(0, 4).join(" ") + " ...";
    } else {
      return errorMessage;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-">Conflicting Issues:</h2>
        <div className="flex">
          <button className="search-button" onClick={handleSearchToggle}>
            <SearchIcon />
            <span className="ml-2">Search</span>
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-96 border border-sprinklr-gray p-2 rounded-md "
          />
        </div>
      )}
      <div className="table-container">
        <table className="table-auto border-collapse border border-sprinklr-gray min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-r border-sprinklr-gray w-48">
                Issue Key
              </th>
              <th className="px-4 py-2 border-b border-l  border-r border-sprinklr-gray w-96">
                Merge Commit SHA
              </th>
              <th className="px-4 py-2 border-b border-l  border-r border-sprinklr-gray w-96">
                Error Message
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No issues found.
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr key={issue[0]} className="border border-sprinklr-gray">
                  <td className="px-4 py-2 border-r border-sprinklr-gray">
                    {issue[1].issueKey}
                  </td>
                  <td className="px-4 py-2 border-l border-r border-sprinklr-gray font-mono">
                    {issue[0]}
                  </td>
                  <td className="px-4 py-2 border-l border-r border-sprinklr-gray">
                    {issue[1].message.split(" ").length > 4 ? (
                      showFullErrorMessage === issue[0] ? (
                        <>
                          {issue[1].message}{" "}
                          <span onClick={() => setShowFullErrorMessage("")} className="hover:cursor-pointer text-sprinklr-blue">
                            Read less
                          </span>
                        </>
                      ) : (
                        <>
                          {truncateErrorMessage(issue[1].message)}{" "}
                          <span
                            onClick={() => setShowFullErrorMessage(issue[0])}
                            className="hover:cursor-pointer text-sprinklr-blue"
                          >
                            Read more
                          </span>
                        </>
                      )
                    ) : (
                      issue[1].message
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchableIssuesTable;
