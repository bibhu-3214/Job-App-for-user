import axios from "axios";
import React,{ useState } from "react";
import { Link,Route,Switch } from "react-router-dom";
import ReactModal from "react-modal";
import FrontEnd from "./Dashboard Components/FrontEnd";
import FullStack from "./Dashboard Components/FullStack";
import MeanStack from "./Dashboard Components/MeanStack";
import Node from "./Dashboard Components/Node";
import ModalComponent from "./Dashboard Components/ModalComponent";

const Dashboard = () => {
  const [data,setData] = useState([]);
  const [result,setResult] = useState({});
  const [updateStatus,setUpdateStatus] = useState({});
  const [isOpen,setIsOpen] = useState(false);

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
      <div className="container mt-5" style={{ display: "flex",flexWrap: "wrap",justifyContent: "space-between",alignItems: "center" }}>
        <Link to="/dashboard/frontend" className="btn btn-lg btn-primary">
          FrontEnd Developer
        </Link>
        <Link to="/dashboard/nodejs" className="btn btn-lg btn-primary">
          Node.js Developer
        </Link>
        <Link to="/dashboard/meanstack" className="btn btn-lg btn-primary">
          Mean Stack Developer
        </Link>
        <Link to="/dashboard/fullstack" className="btn btn-lg btn-primary">
          Full Stack Developer
        </Link>
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
      <ReactModal
        isOpen={isOpen}
        style={CustomStyle}
        onRequestClose={handleClose}
      >
        <ModalComponent result={result} />
      </ReactModal>
    </>
  );
};

export default Dashboard;
