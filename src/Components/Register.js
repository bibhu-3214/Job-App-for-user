import axios from "axios";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import TextError from "./TextError";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperiance] = useState("");
  const [skills, setSkils] = useState("");

  const initialValues = {
    FullName: "",
    Email: "",
  };

  const validationSchema = yup.object({
    FullName: yup.string().required("Required"),
    Email: yup.string().email("Invalid Format").required("Required"),
  });

  const handleChange = (e) => {
    if (e.target.name === "FullName") {
      setName(e.target.value);
    } else if (e.target.name === "Email") {
      setEmail(e.target.value);
    } else if (e.target.name === "contact") {
      setPhone(e.target.value);
    } else if (e.target.name === "Select") {
      setJobTitle(e.target.value);
    } else if (e.target.name === "Experiance") {
      setExperiance(e.target.value);
    } else if (e.target.name === "Skills") {
      setSkils(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: name,
      email: email,
      phone: phone,
      skills: skills,
      jobTitle: jobTitle,
      experience: experience,
    };
    axios
      .post(
        "http://dct-application-form.herokuapp.com/users/application-form",
        formData
      )
      .then((response) => {
        const result = response.data;
        console.log(result);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="container w-50">
      <h1 className="display-3 text-center my-5">Registration Form</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="row mb-4">
            <label className="form-label" htmlFor="FullName">
              FullName
            </label>{" "}
            <br />
            <div className="col-12">
              <Field
                className="form-control"
                type="text"
                name="FullName"
                id="FullName"
                value={name}
                onChange={handleChange}
                placeholder="Enter your FullName"
              />{" "}
              <br />
              <ErrorMessage name="FullName" component={TextError} />
            </div>
          </div>

          <div className="row mb-4">
            <label className="form-label" htmlFor="Email">
              Email
            </label>
            <div className="col-12">
              <Field
                className="form-control"
                type="email"
                name="Email"
                id="Email"
                value={email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
              <ErrorMessage name="Email" component={TextError} />
            </div>
          </div>

          <div className="row mb-4">
            <label className="form-label">Contact Number</label>
            <div className="col-12">
              <Field
                className="form-control"
                type="tel"
                pattern="[0-9]{10}"
                name="contact"
                value={phone}
                onChange={handleChange}
                placeholder="+91-9876543210"
                // required
              />
            </div>
          </div>

          <div className="row mb-4">
            <label className="form-label">Appling for Job</label>
            <div className="col-12">
              <select
                className="form-select"
                aria-label=".form-select-lg example"
                name="Select"
                value={jobTitle}
                onChange={handleChange}
                required
              >
                <option>Front-End Developer</option>
                <option>Node.js Developer</option>
                <option>MEAN Stack Developer</option>
                <option>FULL Stack Developer</option>
              </select>
            </div>
          </div>

          <div className="row mb-4">
            <label className="form-label">Experience</label>
            <div className="col-12">
              <Field
                className="form-control"
                type="text"
                name="Experiance"
                value={experience}
                onChange={handleChange}
                placeholder="Experiance(2years,3months)"
                // required
              />
            </div>
          </div>

          <div className="row mb-4">
            <label className="form-label">Technical Skils</label>
            <div className="col-12">
              <Field
                as="textarea"
                className="form-control"
                name="Skills"
                value={skills}
                onChange={handleChange}
                placeholder="Technical Skils"
                // required
              />
            </div>
          </div>

          <div className="col-12">
            <input
              className="btn btn-primary mb-4"
              type="submit"
              value="Send Application"
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
