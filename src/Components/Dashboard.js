import axios from "axios";
import React, { useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import ReactModal from "react-modal";
import FrontEnd from "./Dashboard Components/FrontEnd";
import FullStack from "./Dashboard Components/FullStack";
import MeanStack from "./Dashboard Components/MeanStack";
import Node from "./Dashboard Components/Node";
import ModalComponent from "./Dashboard Components/ModalComponent";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const CustomStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
    },
  };

  axios
    .get("http://dct-application-form.herokuapp.com/users/application-forms")
    .then((resp) => {
      const result = resp.data;
      setData(result);
    })
    .catch((err) => {
      alert(err.message);
    });

  const handleClick = (_id) => {
    axios
      .get(
        `http://dct-application-form.herokuapp.com/users/application-form/${_id}`
      )
      .then((resp) => {
        const res = resp.data;
        setResult(res);
      })
      .catch((err) => {
        alert(err.message);
      });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange1 = (_id) => {
    const input = {
      status: "rejected",
    };
    axios
      .put(
        `http://dct-application-form.herokuapp.com/users/application-form/update/${_id}`,
        input
      )
      .then((resp) => {
        const res1 = resp.data;
        setUpdateStatus(res1);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleChange2 = (_id) => {
    const input = {
      status: "shortlisted",
    };
    axios
      .put(
        `http://dct-application-form.herokuapp.com/users/application-form/update/${_id}`,
        input
      )
      .then((resp) => {
        const res1 = resp.data;
        setUpdateStatus(res1);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      <div className="container mt-5">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link
              to="/dashboard/frontend"
              className="btn btn-lg btn-secondary me-5"
            >
              FrontEnd Developer
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/nodejs"
              className="btn btn-lg btn-secondary me-5"
            >
              Node.js Developer
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/meanstack"
              className="btn btn-lg btn-secondary me-5"
            >
              Mean Stack Developer
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard/fullstack"
              className="btn btn-lg btn-secondary me-5"
            >
              Full Stack Developer
            </Link>
          </li>
        </ul>
      </div>

      <Switch>
        <Route
          path="/dashboard/fullstack"
          render={(props) => {
            return (
              <FullStack
                {...props}
                data={data}
                handleClick={handleClick}
                handleChange1={handleChange1}
                handleChange2={handleChange2}
              />
            );
          }}
        />
        <Route
          path="/dashboard/meanstack"
          render={(props) => {
            return (
              <MeanStack
                {...props}
                data={data}
                handleClick={handleClick}
                handleChange1={handleChange1}
                handleChange2={handleChange2}
              />
            );
          }}
        />
        <Route
          path="/dashboard/nodejs"
          render={(props) => {
            return (
              <Node
                {...props}
                data={data}
                handleClick={handleClick}
                handleChange1={handleChange1}
                handleChange2={handleChange2}
              />
            );
          }}
        />
        <Route
          path="/dashboard/frontend"
          render={(props) => {
            return (
              <FrontEnd
                {...props}
                data={data}
                status={updateStatus}
                handleClick={handleClick}
                handleChange1={handleChange1}
                handleChange2={handleChange2}
              />
            );
          }}
        />
      </Switch>
      <div className="container-fluid my-5">
        <h1 className="display-4 text-black-50 text-center mb-5">
          Total Candidates Applied for JOB - {data.length}
        </h1>
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
                        <button className="btn btn-sm btn-success">
                          shortlist
                        </button>
                        <button className="btn btn-sm btn-danger">
                          reject
                        </button>
                      </div>
                    ) : d.status === "shortlisted" ? (
                      <button className="btn btn-sm btn-success">
                        shortlisted
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-danger">
                        rejected
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ReactModal
        isOpen={isOpen}
        style={CustomStyle}
        onRequestClose={handleClose}
      >
        <ModalComponent
          result={result}
          handleClose={handleClose}
          handleChange1={handleChange1}
          handleChange2={handleChange2}
          updateStatus={updateStatus}
        />
      </ReactModal>
    </>
  );
};

export default Dashboard;
