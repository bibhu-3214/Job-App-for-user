import React from "react";

const ModalComponent = (props) => {
  const { result, handleClose, handleChange1, handleChange2, updateStatus } =
    props;

  return (
    <>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>

      <h1 className="display-4 text-capitalize mb-4">{result.name}</h1>
      <hr />
      <h4 className="mb-3">
        <strong>Contact Number - </strong> {result.phone}
      </h4>
      <h4 className="mb-3">
        <strong>Email - </strong> {result.email}
      </h4>
      <h4 className="mb-3">
        <strong>Skills - </strong> {result.skills}
      </h4>
      <h4 className="mb-3">
        <strong>Experience - </strong> {result.experience}
      </h4>
      <h4 className="mb-5">
        <strong>Status - </strong> {result.status}
      </h4>

      {result.status === "shortlisted" ? (
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="btn btn-danger me-md-2"
            onClick={() => handleChange1(result._id, updateStatus)}
          >
            Do reject
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            close
          </button>
        </div>
      ) : (
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            className="btn btn-success me-md-2"
            onClick={() => handleChange2(result._id, updateStatus)}
          >
            Do shortlist
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            close
          </button>
        </div>
      )}
    </>
  );
};

export default ModalComponent;
