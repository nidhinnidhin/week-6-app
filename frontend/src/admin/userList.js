import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Box, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function UserList() {
  const [datas, setDatas] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userDetail, setUserDetail] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/user/userslist")
      .then((res) => {
        setDatas(res.data);
        if (localStorage.getItem("admintoken")) {
          navigate("/userslist");
        } else {
          navigate("/adminlogin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/adminlogin");
  };

  const handleOpenLogoutModal = () => setOpenLogoutModal(true);
  const handleCloseLogoutModal = () => setOpenLogoutModal(false);

  const handleOpenDeleteModal = (id) => {
    setSelectedUserId(id);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleDeleteUser = () => {
    axios
      .delete(`http://localhost:9000/api/admin/userdelete/${selectedUserId}`)
      .then((res) => {
        setDatas((prevData) =>
          prevData.filter((data) => data._id !== selectedUserId)
        );
        handleCloseDeleteModal();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleEdit = (id) => {
    setOpenEditModal(true);
    axios
      .get(`http://localhost:9000/api/admin/userdetail/${id}`)
      .then((res) => {
        setUserDetail(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:9000/api/admin/userupdate/${userDetail._id}`, {
        username: userDetail.username,
        email: userDetail.email,
      })
      .then((res) => {
        setDatas((prevData) =>
          prevData.map((data) =>
            data._id === userDetail._id ? res.data.updatedUser : data
          )
        );
        setOpenEditModal(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };


  const createUserHandler = () => setOpenCreateModal(true);
  const handleCreateUser = (e) => {
    const userData = {
      "username": username,
      "email": email,
      "password": password,
      "confirmpassword": confirmPassword
    }
    e.preventDefault();
    axios.post('http://localhost:9000/api/user', userData)
    .then((res) => {
      console.log(res.data);
      setOpenCreateModal(false)
      alert(res.data.message)
    })
    .catch((err) => {
      console.log(err.message);
      alert(err.message)
    })
  };

  return (
    <>
      {/* Create new user modal */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={style}>
          <form onSubmit={handleCreateUser}>
            <TextField
              fullWidth
              required
              id="new-username"
              name="username"
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              id="new-email"
              name="email"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              id="confirmpassword"
              name="password"
              label="Confirm password"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Create User
            </Button>
          </form>
        </Box>
      </Modal>
      {/* Edit User Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={style}>
          <form onSubmit={handleUpdateUser}>
            <TextField
              fullWidth
              required
              id="username"
              name="username"
              label="Username"
              value={userDetail.username || ""}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              id="email"
              name="email"
              label="Email"
              value={userDetail.email || ""}
              onChange={handleChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Update
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal open={openLogoutModal} onClose={handleCloseLogoutModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure you want to logout?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={logoutHandler}
            sx={{ mt: 2 }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseLogoutModal}
            sx={{ mt: 2, ml: 2 }}
          >
            No
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure you want to delete this user?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            sx={{ mt: 2 }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteModal}
            sx={{ mt: 2, ml: 2 }}
          >
            No
          </Button>
        </Box>
      </Modal>

      <TableContainer
        component={Paper}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          style={{ width: "80%" }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">
                <Button
                  variant="contained"
                  color="success"
                  onClick={createUserHandler}
                >
                  Create User
                </Button>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleOpenLogoutModal}
                >
                  Logout
                </Button>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((data) => (
              <StyledTableRow key={data._id}>
                <StyledTableCell>{data.username}</StyledTableCell>
                <StyledTableCell align="right">{data.email}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleEdit(data._id)}
                  >
                    Edit
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDeleteModal(data._id)}
                  >
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserList;
