import React from "react";

const MeanStack = (props) => {
  const { data, handleClick, handleChange1, handleChange2, UpdateStatus } =
    props;
  return (
    <div className="container mt-5">
      <h1 className="display-4 text-dark mb-4">MEAN Stack Developers</h1>
      <h5 className="text-secondary mb-4">
        List of candidates that applied for MEAN Stack Developer Job
      </h5>
      <table className="table table-striped table-borderless">
        <thead>
          <tr>
            <th>Name</th>
            <th>Technical Skils</th>
            <th>Experience</th>
            <th>Applied Date</th>
            <th>View Details</th>
            <th>Application Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, id) => {
            if (d.jobTitle === "MEAN Stack Developer") {
              return (
                <tr key={id}>
                  <td>{d.name}</td>
                  <td>{d.skills}</td>
                  <td>{d.experience}</td>
                  <td>{d.createdAt}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleClick(d._id)}
                    >
                      Details
                    </button>
                  </td>
                  <td>
                    {d.status === "applied" ? (
                      <div>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleChange2(d._id, UpdateStatus)}
                        >
                          shortlist
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleChange1(d._id, UpdateStatus)}
                        >
                          reject
                        </button>
                      </div>
                    ) : d.status === "shortlisted" ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleChange1(d._id, UpdateStatus)}
                      >
                        shortlisted
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleChange2(d._id, UpdateStatus)}
                      >
                        rejected
                      </button>
                    )}
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MeanStack;
