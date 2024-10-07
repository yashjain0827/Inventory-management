import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  TextField,
  Box,
  TableContainer,
  Paper,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { getallbill } from "../../../actions/billingAction";
import * as XLSX from "xlsx";

export default function Billing() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalBills, setTotalBills] = useState(0);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);

      const response = await getallbill(
        searchQuery.trim(),
        page,
        rowsPerPage,
        searchDate
      );
      setBills(response.data || []);
      setTotalBills(response.data[0].totalBills);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleTokenError(error);
      console.error("Error fetching bills:", error);
      setBills([]);
      setTotalBills(0);
    }
  };

  const fetchAllBills = async () => {
    try {
      setLoading(true);
      const response = await getallbill("", 0, 0, "");
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      handleTokenError(error);
      console.error("Error fetching all bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleAddBill = () => navigate("/landingpage/billing/app-bill");

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleDateChange = (e) => setSearchDate(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBills();
  };

  const handleViewDetails = (bill) =>
    navigate(`/landingpage/billing/details`, { state: { bill } });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTokenError = (error) => {
    if (error.response) {
      if (error.response.data.message) {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        setOpenSnackbar(true);
      }

      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("loginuser");
        navigate("/landingpage", {
          state: {
            errorMessage: "Invalid session, please login again",
          },
        });
      }
    } else {
      console.error("Error fetching order history:", error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleExtract = async () => {
    const extract = await fetchAllBills();
    console.log(extract);
    if (extract) {
      const worksheet = XLSX.utils.json_to_sheet(extract);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ExtractData");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extract_data.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <div className="billing-page">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="10px"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <TextField
              placeholder="search by name/number"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
              sx={{
                borderRadius: 1,
                padding: "4px 8px",
                width: "250px",
                marginRight: 2,
              }}
            />
            <TextField
              type="date"
              value={searchDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                borderRadius: 1,
                padding: "4px 8px",
                width: "200px",
                marginRight: 2,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "loading.." : "search"}
            </Button>
          </form>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleExtract}
            disabled={loading}
          >
            {loading ? "Loading..." : "Extract bills"}
          </Button>
          <Button variant="contained" color="primary" onClick={handleAddBill}>
            + Add Bill
          </Button>
        </Box>
      </Box>

      <div className="previous-billings">
        <h1>Previous Bills</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Id</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Number of product</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <TableRow key={bill.orderId}>
                    <TableCell>{bill.orderId}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell>{bill.products.length}</TableCell>
                    <TableCell>{bill.phoneNo}</TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>{bill.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(bill)}
                      >
                        View More Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No bills found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[2, 5, 10]}
            component="div"
            count={totalBills}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
