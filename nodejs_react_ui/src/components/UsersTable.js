import React, { useState, useEffect } from 'react';

const UsersTable = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserHN, setSelectedUserHN] = useState(null);
  const [bypassConfirmModalTimeStamp, setBypassConfirmModalTimeStamp] = useState(null);

  const fetchUsersData = (searchTerm) => {
    fetch(`http://localhost:5000/User/search?searchTerm=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        const updatedData = data.map(user => {
          return { ...user, hnview: user.hn.toString().padStart(5, '0') };
        });
        setUsersData(updatedData);
        setCurrentPage(1);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchUsersData(searchTerm);
  }, [searchTerm]);

  const handlePostUser = () => {
    if (selectedUser.name.trim() === '' || selectedUser.lastname.trim() === '') {
      alert("Please enter the name and lastname.");
      return;
    }

    const { name, lastname, contact_Tel, contact_Email } = selectedUser;
    const newUser = {
      name,
      lastname,
      contact_Tel,
      contact_Email,
    };

    fetch(`http://localhost:5000/User/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then(() => {
        handleCloseModalUser();
        fetchUsersData(searchTerm);
      })
      .catch((error) => console.log(error));
    setSelectedUser(null);
  };

  const handleUpdateUser = () => {
    if (selectedUser.name.trim() === '' || selectedUser.lastname.trim() === '') {
      alert("Please enter the name and lastname.");
      return;
    }

    const { hn, name, lastname, contact_Tel, contact_Email } = selectedUser;
    const updatedUser = {
      name,
      lastname,
      contact_Tel,
      contact_Email,
    };

    fetch(`http://localhost:5000/User/update/hn/${hn}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then(() => {
        handleCloseModalUser();
        fetchUsersData(searchTerm);
      })
      .catch((error) => console.log(error));
    setSelectedUser(null);
  };

  const handleDeleteUser = (hn) => {
    const currentTimeStamp = Date.now();
    let bypassConfirm = false;
    if (bypassConfirmModalTimeStamp) {
      const differenceTime = Math.floor((currentTimeStamp - bypassConfirmModalTimeStamp) / 60000);
      if (differenceTime <= 0.25) {
        bypassConfirm = true;
      }
    }
    if (bypassConfirm) {
      deleteUser(hn);
    }
    else {
      setSelectedUserHN(hn);
      const modalContainer = document.querySelector(".modal-confirm");
      modalContainer.style.display = "block";
    }
  };

  const handleConfirmDeleteUser = () => {
    const checkbox = document.querySelector('input[type="checkbox"]');
    const isChecked = checkbox.checked;
    if (isChecked) {
      setBypassConfirmModalTimeStamp(Date.now());
    }
    deleteUser(selectedUserHN);
    handleCloseModalConfirm();
    if (selectedUser !== null) {
      handleCloseModalUser();
    }
  };

  const handleCancelDeleteUser = () => {
    setSelectedUserHN(null);
    const modalContainer = document.querySelector(".modal-confirm");
    modalContainer.style.display = "none";
  };

  const deleteUser = (hn) => {
    fetch(`http://localhost:5000/User/delete/hn/${hn}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        handleCloseModalUser();
        fetchUsersData(searchTerm);
      })
      .catch((error) => console.log(error));
  };

  const handlePerPageChange = event => {
    setPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleJumpToPage = page => {
    setCurrentPage(page);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    const modalContainer = document.querySelector(".modal-user");
    modalContainer.style.display = "block";
  };

  const handleCreateUser = () => {
    setSelectedUser({
      hn: '',
      name: '',
      lastname: '',
      contact_Tel: '',
      contact_Email: '',
    });
    const modalContainer = document.querySelector(".modal-user");
    modalContainer.style.display = "block";
  };

  const handleCloseModalUser = () => {
    setSelectedUser(null);
    const modalContainer = document.querySelector(".modal-user");
    modalContainer.style.display = "none";
  };

  const handleCloseModalConfirm = () => {
    setSelectedUserHN(null);
    const modalContainer = document.querySelector(".modal-confirm");
    modalContainer.style.display = "none";
  };

  const totalPages = Math.ceil(usersData.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return (
    <>
      <div className="content">
        <div className="container">
          <h2 className="mb-5">USERS TABLE</h2>
          <div className="table-responsive">
            <table className="table table-striped custom-table">
              <thead>
                <tr>
                  <th>SEARCH</th>
                  <th colSpan="5">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="HN / NAME / TEL / E-MAIL (Can use parts of words , Space = AND)"
                      aria-label="HN / NAME / TEL / E-MAIL (Can use parts of words , Space = AND)"
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </th>
                </tr>
                <tr>
                  <th colSpan="4">
                    <label>
                      <input
                        type="radio"
                        className="mr-2 ml-4"
                        value={10}
                        checked={perPage === 10}
                        onChange={handlePerPageChange}
                      />10 Perpage
                    </label>
                    <label>
                      <input
                        type="radio"
                        className="mr-2 ml-4"
                        value={20}
                        checked={perPage === 20}
                        onChange={handlePerPageChange}
                      />20 Perpage
                    </label>
                    <label>
                      <input
                        type="radio"
                        className="mr-2 ml-4"
                        value={40}
                        checked={perPage === 40}
                        onChange={handlePerPageChange}
                      />40 Perpage
                    </label>
                    <label>
                      <input
                        type="radio"
                        className="mr-2 ml-4"
                        value={usersData.length}
                        checked={perPage === usersData.length}
                        onChange={handlePerPageChange}
                      />All
                    </label>
                  </th>
                  <th colSpan="2" className="highlight" onClick={handleCreateUser}>
                    + CREATE USER
                  </th>
                </tr>
                <tr>
                  <th scope="col">HN</th>
                  <th scope="col">NAME</th>
                  <th scope="col">Tel</th>
                  <th scope="col">E-mail</th>
                  <th scope="col" style={{ width: "100px" }}></th>
                  <th scope="col" style={{ width: "100px" }}></th>
                </tr>
              </thead>
              <tbody>
                {usersData.slice(startIndex, endIndex).map(user => (
                  <tr key={user.record_ID} onDoubleClick={() => handleEditUser(user)}>
                    <td>{user.hnview}</td>
                    <td className="highlight">{user.name} {user.lastname}</td>
                    <td>{user.contact_Tel}</td>
                    <td>{user.contact_Email}</td>
                    <td className="highlight" onClick={() => handleEditUser(user)}>Edit</td>
                    <td className="highlight" onClick={() => handleDeleteUser(user.hn)}>Delete</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => handleJumpToPage(1)}
              disabled={currentPage === 1}
            >
              |&lt;
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn mx-2 ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleJumpToPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-secondary mx-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => handleJumpToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              &gt;|
            </button>
          </div>
        </div>
      </div>
      <div className="modal-container modal-user" style={{ display: "none" }}>
        {selectedUser && (
          <div className="form fixed-center">
            <div className="input-wrapper">
              <label>HN</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.hnview}
                readOnly
              />
            </div>
            <div className="input-wrapper">
              <label>NAME</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser((prevUser) => ({
                    ...prevUser,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="input-wrapper">
              <label>LASTNAME</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.lastname}
                onChange={(e) =>
                  setSelectedUser((prevUser) => ({
                    ...prevUser,
                    lastname: e.target.value,
                  }))
                }
              />
            </div>
            <div className="input-wrapper">
              <label>TEL</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.contact_Tel}
                onChange={(e) =>
                  setSelectedUser((prevUser) => ({
                    ...prevUser,
                    contact_Tel: e.target.value,
                  }))
                }
              />
            </div>
            <div className="input-wrapper">
              <label>E-MAIL</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.contact_Email}
                onChange={(e) =>
                  setSelectedUser((prevUser) => ({
                    ...prevUser,
                    contact_Email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="button-wrapper">
              <input type="button" value={selectedUser.hn ? "UPDATE" : "CREATE"} onClick={selectedUser.hn ? handleUpdateUser : handlePostUser} />
              {selectedUser.hn && <input type="button" value=" DELETE" onClick={() => handleDeleteUser(selectedUser.hn)} />}
              <input type="button" value=" CLOSE" onClick={handleCloseModalUser} />
            </div>
          </div>
        )}
        <div class="modal-close" onClick={handleCloseModalUser}></div>
      </div>
      <div className="modal-container modal-confirm" style={{ display: "none" }}>
        <div className="form fixed-center">
          Please confirm to delete user.
          <div className="button-wrapper">
            <label>
              <input type="checkbox" />Don't show again in 5 minutes.
            </label>
            <input type="button" value="CONFIRM" onClick={handleConfirmDeleteUser} />
            <input type="button" value="CANCEL" onClick={handleCancelDeleteUser} />
          </div>
        </div>
        <div className="modal-close" onClick={handleCloseModalConfirm}></div>
      </div>
    </>
  );
};

export default UsersTable;
