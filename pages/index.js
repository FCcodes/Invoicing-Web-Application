import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useState, useEffect, useRef, useContext } from "react";

//mui components
import { Box, Typography, Grid, Select, FormControl, FormHelperText, InputLabel, Menu, MenuItem, Drawer } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

//components
import InvoiceCard from "../components/InvoiceCard";
import CreateInvoiceForm from "../components/CreateInvoiceForm";

//ripple effect function
import { createRipple } from "../util/createRipple";

//Main Application State
import { MasterState } from "../lib/masterState";

const BaseInput = styled(InputBase)(({ theme }) => ({
	"& .MuiInputBase-input": {
		margin: 0,
	},
}));

export default function Home() {
	const { user } = useContext(MasterState);
	const [invoices, setInvoices] = useState([]);
	const [page, setPage] = useState({
		pageNumber: 1,
		feed: []
	})	
	const [filterBy, setFilterBy] = useState('None')
	const [invoiceFormIsOpen, setInvoiceFormIsOpen] = useState(false);
	const element = useRef(null);
	const invoiceButton = useRef(null);

	function toggleInvoiceForm() {
		return setInvoiceFormIsOpen((prev) => !prev);
	}	

	function callRippleFunc(e) {
		return createRipple(element.current, e);
	}

	useEffect(()=>{	
		if(invoices.length === 0) return 

		if(filterBy === "None"){			
			setPage((prev)=> ({...prev, feed: invoices }))
			return
		}		

		let targetInvoices = invoices.filter((invoice)=> invoice.state === filterBy)		
		setPage((prev)=> ({...prev, feed: targetInvoices }))
		return
		
	}, [filterBy, invoices])

	useEffect(() => {
		fetch(`http://localhost:3000/api/invoice?u=${user.id}`)
			.then((res) => {
				if (!res.ok) {					
					throw new Error("Ooops seems something went wrong");
					return;
				}
				return res.json();
			})
			.then((data) => {				
				setInvoices(data);
			})
			.catch((error) => {
				console.log(error);
			});

		return;
	}, [user.id]);

	return (
		<>
			<Head>
				<title>Invoice | Home</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Box
				component="div"
				id="Home-Page"
				sx={{
					py: { phone: 4 },
					px: { phone: 2 },
					minHeight: "100vh",
					backgroundColor: "grey.200",
				}}
			>
				<Grid container sx={{ mb: { phone: 5 } }}>
					<Grid
						item
						phone={5}
						phonexl={6}
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: { phone: "center" },
						}}
					>
						<Typography variant="h1" sx={{ fontWeight: 800 }}>
							Invoices
						</Typography>
						<Typography variant="subtitle2" sx={{ fontWeight: "700", color: "grey.500" }}>
							7 invoices
						</Typography>
					</Grid>

					<Grid
						item
						phone={7}
						phonexl={6}
						tablet={4}
						tabletxl={3}
						sx={{
							ml: "auto",
							display: "flex",
							flexDirection: {
								phone: "column-reverse",
								phonexl: "row",
							},
							justifyContent: "space-between",
							alignItems: "flex-end",
							alignContent: "center",
						}}
					>
						<FormControl
							sx={{
								py: "5px",
								backgroundColor: "grey.300",
								width: { phone: "60%", phonexl: "50%" },
								maxWidth: { tabletxl: "90px" },
								height: "2rem",
								borderRadius: "5px",
							}}
						>
							<Select
								id="filter-invoices"
								labelId="demo-simple-select-label"
								defaultValue="None"
								onChange={(e)=> setFilterBy(e.target.value) }
								fullWidth
								input={<BaseInput />}
								sx={{
									pl: 1,
									fontSize: ".8rem",
									backgroundColor: "grey.300",
									maxWidth: { tabletxl: "90px" },
								}}
							>
								<MenuItem className="ripple-effect" ref={element} onClick={callRippleFunc} value="None" sx={{ fontSize: ".8rem" }}>
									None
								</MenuItem>
								<MenuItem className="ripple-effect" ref={element} onClick={callRippleFunc} value="Paid" sx={{ fontSize: ".8rem" }}>
									Paid
								</MenuItem>
								<MenuItem className="ripple-effect" ref={element} onClick={callRippleFunc} value="Pending" sx={{ fontSize: ".8rem" }}>
									Pending
								</MenuItem>
								<MenuItem className="ripple-effect" ref={element} onClick={callRippleFunc} value="Draft" sx={{ fontSize: ".8rem" }}>
									Draft
								</MenuItem>
							</Select>
							<FormHelperText
								sx={{
									m: 0,
									mt: 0.5,
									textAlign: "center",
									letterSpacing: "1px",
									fontSize: { phone: ".55rem" },
								}}
							>
								Filter Invoices
							</FormHelperText>
						</FormControl>

						<Box
							component="button"
							className="ripple-effect"
							ref={invoiceButton}
							onClick={toggleInvoiceForm}
							sx={{
								mb: { phone: 1, phonexl: 0 },
								py: "5px",
								px: "8px",
								width: { phone: "60%", phonexl: "45%" },
								borderRadius: "5px",
								border: "none",
								backgroundColor: "rgb(124,93,249)",
								color: "white",
								display: "flex",
								justifyContent: "space-evenly",
								alignItems: "center",
								cursor: "pointer",
							}}
						>
							<Box component="span" sx={{ pointerEvents: "none" }}>
								<Box
									component="svg"
									sx={{
										mr: 0.5,
										width: "20px",
										height: "20px",
									}}
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
								</Box>
							</Box>
							<Box component="span" sx={{ pointerEvents: "none" }}>
								New
							</Box>
						</Box>
					</Grid>
				</Grid>

				<Drawer anchor="left" open={invoiceFormIsOpen}>
					<CreateInvoiceForm toggleInvoiceForm={toggleInvoiceForm} setInvoices={setInvoices} />
				</Drawer>

				<Grid container className="invoice-list-container">
					{page.feed.length === 0 ? (
						<>
							<Typography variant="body1" sx={{ my: 5, mx: "auto", color: "grey.700", textAlign: "center" }}>
								You have no Invoices
							</Typography>
						</>
					) : (
						page.feed.map((invoice) => <InvoiceCard invoice={invoice} key={invoice.id} />)
					)}
				</Grid>
			</Box>
		</>
	);
}
