// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

// Define validation schema
const formSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  favLanguage: yup.string().required("Favorite language is required"),
  favFood: yup.string().required("Favorite food is required"),
  agreement: yup.boolean().oneOf([true], "You must agree to the terms"),
});

function App() {
  const [formState, setFormState] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: false,
  });

  const [errors, setErrors] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: '',
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const validateChange = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(() => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch(err => {
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
      });
  };
  
  const inputChange = e => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    };

    validateChange(e);
    setFormState(newFormData);
  };

  const formSubmit = e => {
    e.preventDefault();
    axios
      .post('https://your-api-endpoint.com', formState)
      .then(response => {
        setServerMessage(response.data);
        setFormState({
          username: '',
          favLanguage: '',
          favFood: '',
          agreement: false,
        });
      })
      .catch(err => {
        setServerMessage(err.response.data);
      });
  };

  return (
    <form onSubmit={formSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formState.username}
          onChange={inputChange}
        />
        {errors.username.length > 0 ? <p className="error">{errors.username}</p> : null}
      </label>
      <label>
        Favorite Language:
        <input
          type="text"
          name="favLanguage"
          value={formState.favLanguage}
          onChange={inputChange}
        />
        {errors.favLanguage.length > 0 ? <p className="error">{errors.favLanguage}</p> : null}
      </label>
      <label>
        Favorite Food:
        <input
          type="text"
          name="favFood"
          value={formState.favFood}
          onChange={inputChange}
        />
        {errors.favFood.length > 0 ? <p className="error">{errors.favFood}</p> : null}
      </label>
      <label>
        Agreement:
        <input
          type="checkbox"
          name="agreement"
          checked={formState.agreement}
          onChange={inputChange}
        />
        {errors.agreement.length > 0 ? <p className="error">{errors.agreement}</p> : null}
      </label>
      {serverMessage && <p>{serverMessage}</p>}
      <button disabled={buttonDisabled}>Submit</button>
    </form>
  );
}

export default App;
