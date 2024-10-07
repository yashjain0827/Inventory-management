import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { addbill } from "../../../actions/billingAction";
import { getallproduct } from "../../../actions/productAction";

const AddBill = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [customerNumber, setCustomerNumber] = useState("+91");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setloading] = useState(false);
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);

    fetchProductOptions();
  }, [loginuser.adminId, loginuser.jwtToken]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        productId: "",
        productName: "",
        quantity: 0,
        sellingPrice: 0,
        maxQuantity: 0,
        productCode: "",
        totalPrice: 0,
      },
    ]);
  };

  const handleProductChange = (index, newValue) => {
    const selectedProduct = productOptions.find(
      (product) => product.productId === newValue?.productId
    );

    if (
      selectedProduct &&
      products.some(
        (product) => product.productId === selectedProduct.productId
      )
    ) {
      setError("This product is already added.");
      setOpenSnackbar(true);
      return;
    }

    const newProducts = [...products];
    if (selectedProduct) {
      newProducts[index] = {
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: 0,
        sellingPrice: selectedProduct.sellingPrice,
        maxQuantity: selectedProduct.quantity,
        productCode: selectedProduct.productCode,
        totalPrice: 0,
      };
      if (newProducts[index].maxQuantity <= 0) {
        setError("Item you have added is out of stock");
        setOpenSnackbar(true);
        return;
      }
    }
    setProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const handleProductQuantityChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].quantity = Math.min(
      Number(value),
      newProducts[index].maxQuantity
    );
    newProducts[index].totalPrice =
      Math.min(Number(value), newProducts[index].maxQuantity) *
      newProducts[index].sellingPrice;

    setProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
    updateTotalAmount(newProducts);
  };

  const updateTotalAmount = (products) => {
    const total = products.reduce((sum, product) => {
      return sum + product.quantity * product.sellingPrice;
    }, 0);
    setTotalAmount(total);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const items = products.map((product) => ({
      productId: product.productId,
      sellingPrice: product.sellingPrice,
      productCode: product.productCode,
      quantity: product.quantity,
      productName: product.productName,
      totalPrice: product.totalPrice,
    }));

    const order = {
      adminId: loginuser.adminId,
      customerName,
      description,
      phoneNo: customerNumber.replace(/ +/g, ""),
      products: items,
      totalAmount,
    };

    try {
      setloading(true);

      await addbill(order);
      setloading(false);

      navigate("/landingpage/billing");
    } catch (error) {
      setloading(false);
      handleTokenError(error);
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/landingpage/billing");
  };

  const handleChange = (newValue) => {
    setCustomerNumber(newValue);
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

  const fetchProductOptions = async () => {
    try {
      const response = await getallproduct();

      const availableProducts = response.data
        .filter((product) => product.isActive)
        // .filter((product) => product.quantity > 0)
        .map((product) => ({
          productId: product.productId,
          productName: product.productName,
          productType: product.productType,
          minimumQuantity: product.minimumQuantity,
          quantity: product.quantity,
          sellingPrice: product.sellingPrice,
          productCode: product.productCode,
          isActive: product.isActive,
        }));

      setProductOptions(availableProducts);
    } catch (error) {
      handleTokenError(error);
      console.error("Failed to fetch product options", error);
    }
  };

  const countWords = (str) => {
    return str.trim().length;
  };

  const validateForm = () => {
    const errors = [];

    if (!customerName.trim()) {
      errors.push("Customer Name is required.");
    }
    if (countWords(customerName) > 20) {
      errors.push("Customer Name cannot exceed 20 letters.");
    }
    if (!customerNumber.trim()) {
      errors.push("Phone Number is required.");
    }
    if (!description.trim()) {
      errors.push("Remarks are required.");
    }
    if (countWords(description) > 50) {
      errors.push("Remarks cannot exceed 50 letters.");
    }
    if (products.length === 0) {
      errors.push("Please add at least one product.");
    }

    for (const product of products) {
      if (!product.productId || !product.productName) {
        errors.push("Please ensure all added products are selected.");
      }
      if (product.quantity === 0) {
        errors.push(
          "Please ensure quantity is greater than zero for all products."
        );
      }
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };

  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>Add New Bill</h1>

      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSave}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 700,
          margin: "20px auto",
          padding: "20px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Total Amount: Rs {totalAmount}</Typography>
          <Typography variant="h5">Date: {date}</Typography>
        </Box>

        <TextField
          required
          label="Customer Name"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
          }}
          fullWidth
        />

        <MuiTelInput
          required
          value={customerNumber}
          onChange={handleChange}
          fullWidth
          label="Phone Number"
          inputProps={{ maxLength: 15 }}
        />

        <TextField
          required
          label="Remarks"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          multiline
          rows={4}
          fullWidth
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Products:</Typography>
          <Button variant="contained" onClick={handleAddProduct}>
            + Add Product
          </Button>
        </Box>

        {products.map((product, index) => (
          <Grid container spacing={2} key={index} alignItems="center">
            <Grid item xs={6}>
              <Autocomplete
                value={
                  productOptions.find(
                    (option) => option.productId === product.productId
                  ) || null
                }
                onChange={(event, newValue) =>
                  handleProductChange(index, newValue)
                }
                options={productOptions}
                getOptionLabel={(option) => option.productName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Product"
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                label="Quantity"
                value={product.quantity}
                inputProps={{ min: 0, max: product.maxQuantity }}
                onChange={(e) =>
                  handleProductQuantityChange(index, e.target.value)
                }
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <Typography>₹{product.totalPrice}</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveProduct(index)}>
                <DeleteForeverIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Save"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddBill;
