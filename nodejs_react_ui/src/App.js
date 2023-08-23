import React, { useState, useEffect } from 'react';
import UsersTable from './components/UsersTable';

const App = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/User/get/all')
      .then(response => response.json())
      .then(data => setUsersData(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <UsersTable usersData={usersData} />
    </div>
  );
};

export default App;
