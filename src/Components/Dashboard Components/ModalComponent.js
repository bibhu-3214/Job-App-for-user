import React from "react";

const ModalComponent = (props) => {
  const { result } = props;
  return (
    <>
      <h1 className="display-4">{result.name}</h1>
      <hr />
      <h3 className="display-6">
        <strong>Contact Number - </strong> {result.phone}
      </h3>
      <h3 className="display-6">
        <strong>Email - </strong> {result.email}
      </h3>
      <h3 className="display-6">
        <strong>Skills - </strong> {result.skills}
      </h3>
      <h3 className="display-6">
        <strong>Experience - </strong> {result.experience}
      </h3>
    </>
  );
};

export default ModalComponent;
