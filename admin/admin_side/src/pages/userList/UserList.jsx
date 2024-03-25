import "./userList.css";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid component from Material-UI
import { DeleteOutline } from "@mui/icons-material"; // Import DeleteOutline icon from Material-UI
import { Link } from "react-router-dom"; // Import Link component from react-router-dom
import { useEffect, useState } from "react"; // Import useEffect and useState hooks from React
import { userRequest } from "../../requestMethods"; // Import userRequest function from requestMethods

export default function UserList() {
 
  // Define state variables to store the list of users and their transaction amounts
  const [data, setData] = useState([]);

  // Use useEffect hook to fetch the list of users and their transaction amounts when the component mounts
  useEffect(() => {
    const getUsers = async () => {
      try {
        // Send a request to fetch the list of users
        const res = await userRequest.get("users/");
        // Log the response for debugging purposes
        
        // Map over the list of users and fetch the transaction amount for each user
        const userData = await Promise.all(
          res.data.map(async (user, index) => {
            
            // Wait for the transaction amount for the current user
            const trans = await userRequest.get(`orders/find/${user._id}`);
           
            const t=trans.data?trans.data.amount:0;
            // Log the transaction amount for debugging purposes
          
            // Return an object containing the user data along with the transaction amount
            return { id: index + 1, status: "active", transaction:t, ...user };
          })
        );
        // Update the state variable with the user data including transaction amounts
       
        setData(userData);
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error fetching users:", error);
      }
    };
    // Call the getUsers function when the component mounts
    getUsers();
  }, []);

  // Define a function to handle deleting a user
  const handleDelete = (id) => {
    // Filter out the user with the specified id from the data state

    const d = async()=>{
try{
       const del=await userRequest.delete(`/users/${id}`);
}catch{};

    };
    d();
    setData(data.filter((item) => item._id !== id));

  };

  // Define the columns configuration for the DataGrid component
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      // Define a render function to customize the appearance of the User column
      renderCell: (params) => {
        
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.img} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "Transaction Volume",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      // Define a render function for the Action column to display edit and delete buttons
      renderCell: (params) => {
        return (
          <>
           
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">Edit</button>
            </Link>
           
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  // Render the UserList component
  return (
    <div className="userList">
    
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
