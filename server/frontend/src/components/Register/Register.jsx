import { useState } from "react";
import "./Register.css";
import { X } from "lucide-react";

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  // Redirect to home
  const gohome = () => {
    window.location.href = window.location.origin;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin + "/djangoapp/register";

    // Send POST request to register endpoint
    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    });

    const json = await res.json();
    if (json.status) {
      // Save username in session and reload home
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="modalContainer">
      <form className="register_panel" onSubmit={register}>
        <div className="register_header">
          <h2 className="register_title">Create Account</h2>
          <button
            type="button"
            onClick={gohome}
            className="close_button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div>
          <span className="input_field">Username</span>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className="input_field"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="input_row">
          <div>
            <span className="input_field">First Name</span>
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              className="input_field"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <span className="input_field">Last Name</span>
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              className="input_field"
              onChange={(e) => setlastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <span className="input_field">Email Address</span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input_field"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <span className="input_field">Password</span>
          <input
            name="psw"
            type="password"
            placeholder="Create a password"
            className="input_field"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="submit_panel">
          <button className="action_button" type="submit">
            Create Account
          </button>
        </div>

        <a className="loginlink" href="/login">Already have an account? Login</a>
      </form>
    </div>
  );
};

export default Register;