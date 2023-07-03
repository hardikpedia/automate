export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#ffff",
    borderRadius: "4px",
    border: "none",
    boxShadow: "none",
    cursor: "pointer",
    width: "200px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000000",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#28AAE1" : "transparent",
    color: state.isSelected ? "#ffff" : "#3D454F",
    cursor: "pointer",
    // transition: "background-color 130ms", // Added transition properties
    ":hover": {
      backgroundColor: "#28AAE1",
      color: "#ffff",
    },
  }),
};
