import Head from "next/head";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { useRouter } from "next/router";

import CreateInvoiceForm from "../../components/CreateInvoiceForm";
import { createRipple } from "../../util/createRipple";
import { MasterState } from "../../lib/masterState";

//mui components
import { Box, Typography, Grid, Select, FormControl, FormHelperText, InputLabel, Menu, MenuItem, Paper, Drawer, Skeleton, Stack } from "@mui/material";

export default function InvoicePage() {
	let defaultText = "N/A";
	const router = useRouter();

	const invoiceID = router.query.id;
	const { user } = useContext(MasterState);
	const [invoice, setInvoice] = useState(null);
	const [statusTheme, setStatusTheme] = useState({
		color: "rgb(0, 0, 0, 0.8)",
		backgroundColor: "rgb(0, 0, 0, 0.15)",
		borderColor: "rgb(0, 0, 0, 0.1)",
	});
	const [readOnly, setReadOnly] = useState(true);

	const [invoiceFormIsOpen, setInvoiceFormIsOpen] = useState(false);

	function toggleInvoiceForm() {
		setInvoiceFormIsOpen((prev) => !prev);
	}

	async function changeInvoiceStatus() {
		if (!invoice) return;

		let stateCopy = invoice;
		// stateCopy = await JSON.parse(stateCopy)
		stateCopy.state = "Paid";

		try {
			let res = await fetch(`http://localhost:3000/api/invoice/changeInvoiceStatus?u=${user.id}&id=${invoice.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(stateCopy),
			});
			console.log(res);

			// if(!res.ok){
			// 	let data = await res.json()
			// 	console.log(res, data)
			// }

			if (res.ok) {
				let data = await res.json();
				console.log(data);
				setInvoice(data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteInvoice() {
		try {
			console.log("sending");

			let res = await fetch(`http://localhost:3000/api/invoice/deleteInvoice?u=${user.id}&id=${invoiceID}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				let data = await res.json();
				console.log("problem");
				console.log(data);
				return;
			}

			if (res.ok && res.redirected) {
				router.push("/");
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (!invoice) return;

		switch (invoice.state) {
			case "Paid":
				setStatusTheme({
					color: "rgb(104,189,160)",
					backgroundColor: "rgb(238,252,248)",
					borderColor: "rgb(0, 0, 0, 0.1)",
				});
				break;
			case "Pending":
				setStatusTheme({
					color: "rgb(0, 0, 0, 0.8)",
					backgroundColor: "rgb(255,243,218)",
					borderColor: "rgb(0, 0, 0, 0.1)",
				});
				break;
			default:
				break;
		}
	}, [invoice]);

	useEffect(() => {
		if (!router.isReady) return;
		console.log(router.isReady, invoiceID)

		fetch(`http://localhost:3000/api/invoice/${invoiceID}/?u=${user.id}`)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Ooops seems something went wrong");
				}
				return res.json();
			})
			.then((data) => {				
				if (data.state !== "Paid") {					
					setReadOnly(false);
				}				

				setInvoice(data);
			})
			.catch((err)=> console.log(error))

		return
	}, [invoiceID, router.isReady, user.id]);

	if (!invoice) {
		return (
			<>
				<Head>
					<title>Create Next App</title>
					<meta name="description" content="Generated by create next app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<Box
					className="invoice-Page"
					sx={{
						py: { phone: 4 },
						px: { phone: 2 },
						backgroundColor: "whitesmoke",
					}}
				>
					<Stack spacing={3}>
						<Skeleton variant="text" />
					</Stack>
				</Box>
			</>
		);
	} else {
		return (
			<>
				<Head>
					<title>Create Next App</title>
					<meta name="description" content="Generated by create next app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<Box
					className="invoice-PPage"
					sx={{
						py: { phone: 4 },
						px: { phone: 2 },
						backgroundColor: "whitesmoke",
					}}
				>
					<Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
						<Box
							component="svg"
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							onClick={() => router.push("/")}
							sx={{
								mr: 2,
								width: "25px",
								height: "25px",
								borderRadius: "50%",
								cursor: "pointer",
							}}
						>
							<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
						</Box>

						<Typography variant="body1" sx={{ cursor: "pointer" }}>
							<Link href="/">
								<a>Go Back</a>
							</Link>
						</Typography>
					</Box>

					<Paper
						elevation={0}
						sx={{
							mb: 2,
							px: 2,
							py: 1.5,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography variant="body1">Status</Typography>

						<Box
							sx={{
								px: 1.7,
								py: 1,
								width: "0%6",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								backgroundColor: statusTheme.backgroundColor,
								border: `1px solid ${statusTheme.borderColor}`,
								borderRadius: "5px",
							}}
						>
							<Box
								sx={{
									backgroundColor: statusTheme.color,
									width: "10px",
									height: "10px",
									borderRadius: "50px",
								}}
							></Box>
							<Typography variant="body1" sx={{ ml: 1.5, color: statusTheme.color }}>
								{invoice.state}
							</Typography>
						</Box>
					</Paper>

					<Grid
						container
						component="section"
						className="actionButtons"
						sx={{
							mb: 2,
							px: 2,
							py: 3,
							display: "flex",
							borderRadius: "10px",
							backgroundColor: "white",
						}}
					>
						<Box
							component="button"
							disabled={readOnly}
							onClick={toggleInvoiceForm}
							sx={{
								cursor: "pointer",
								border: "none",
								//mb: {phone: 1, phonexl: 0},
								mx: { phone: 0.45 },
								py: { phone: 0.9 },
								px: { phone: 1.2 },
								fontWeight: 500,
								borderRadius: "5px",
								color: "black",
								backgroundColor: "grey.400",
								"&:disabled": {
									border: "1px solid #999999",
									backgroundColor: " #cccccc",
									color: "#666666",
								},
								"&[disabled]": {
									border: "1px solid #999999",
									backgroundColor: " #cccccc",
									color: "#666666",
								},
							}}
						>
							Edit
						</Box>
						<Box
							component="button"
							onClick={deleteInvoice}
							sx={{
								cursor: "pointer",
								border: "none",
								//mb: {phone: 1, phonexl: 0},
								mx: { phone: 0.45 },
								py: { phone: 0.9 },
								px: { phone: 1.2 },
								fontWeight: 500,
								borderRadius: "5px",
								color: "white",
								backgroundColor: "rgb(240,85,84)",
							}}
						>
							Delete
						</Box>
						<Box
							component="button"
							disabled={invoice.state === "Paid" ? true : false}
							onClick={changeInvoiceStatus}
							sx={{
								cursor: "pointer",
								border: "none",
								mx: { phone: 0.45 },
								py: { phone: 0.9 },
								px: { phone: 1.2 },
								fontWeight: 500,
								borderRadius: "5px",
								color: "white",
								backgroundColor: "rgb(121,92,246)",
							}}
						>
							Mark as Paid
						</Box>
					</Grid>

					<Paper elevation={0} sx={{ px: 2, py: 3 }}>
						<Box sx={{ mb: 3 }}>
							<Typography
								variant="body1"
								sx={{
									mb: 0.1,
									alignSelf: "self-start",
									fontWeight: 700,
									fontSize: {
										phone: ".8rem",
									},
								}}
							>
								<Box
									component="span"
									sx={{
										color: "grey.400",
										fontFamily: "sans-serif",
									}}
								>
									#
								</Box>{" "}
								HT
							</Typography>
							<Typography variant="body2" sx={{ mb: 0.2, color: "grey.400" }}>
								{invoice.title}
							</Typography>
						</Box>

						<Box className="address-section" sx={{ mb: 4, width: "55%" }}>
							<Typography variant="body2" sx={{ mb: 0.2, color: "grey.400" }}>
								{invoice.billedFrom.streetAddress || defaultText}
							</Typography>
							<Typography variant="body2" sx={{ mb: 0.2, color: "grey.400" }}>
								{invoice.billedFrom.city || defaultText}
							</Typography>
							<Typography variant="body2" sx={{ mb: 0.2, color: "grey.400" }}>
								{invoice.billedFrom.postCode || defaultText}
							</Typography>
							<Typography variant="body2" sx={{ mb: 0.2, color: "grey.400" }}>
								{invoice.billedFrom.country || defaultText}
							</Typography>
						</Box>

						<Grid container sx={{ mb: 3 }}>
							<Grid item container phone={6} sx={{}}>
								<Grid item phone={12} sx={{ mb: 2 }}>
									<Typography
										variant="body2"
										sx={{
											mb: 0.8,
											color: "grey.400",
										}}
									>
										Invoice Date
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 700 }}>
										{invoice.created || defaultText}
									</Typography>
								</Grid>

								<Grid item phone={12}>
									<Typography
										variant="body2"
										sx={{
											mb: 0.8,
											color: "grey.400",
										}}
									>
										Payment Due
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 700 }}>
										{invoice.invoiceDueDate || defaultText}
									</Typography>
								</Grid>
							</Grid>

							<Grid item container phone={6} sx={{ display: "flex", flexDirection: "column" }}>
								<Typography
									variant="body2"
									sx={{
										mb: 0.8,
										color: "grey.400",
									}}
								>
									Bill To
								</Typography>
								<Typography variant="body1" sx={{ mb: 0.8, fontWeight: 700 }}>
									{invoice.billedTo.clientsName || defaultText}
								</Typography>

								<Typography
									variant="body2"
									sx={{
										mb: 0.2,
										color: "grey.400",
									}}
								>
									{invoice.billedTo.streetAddress || defaultText}
								</Typography>
								<Typography
									variant="body2"
									sx={{
										mb: 0.2,
										color: "grey.400",
									}}
								>
									{invoice.billedTo.city || defaultText}
								</Typography>
								<Typography
									variant="body2"
									sx={{
										mb: 0.2,
										color: "grey.400",
									}}
								>
									{invoice.billedTo.postCode || defaultText}
								</Typography>
								<Typography variant="body2" sx={{ color: "grey.400" }}>
									{invoice.billedTo.country || defaultText}
								</Typography>
							</Grid>
						</Grid>

						<Box item sx={{ mb: 3 }}>
							<Typography variant="body2" sx={{ mb: 0.8, color: "grey.400" }}>
								Sent To
							</Typography>

							<Typography variant="body1" sx={{ fontWeight: 700 }}>
								{invoice.billedTo.clientsEmail || defaultText}
							</Typography>
						</Box>

						<Grid
							container
							className="invoiceTotals"
							sx={{
								pt: 5,
								backgroundColor: "rgb(249,250,254)",
								borderRadius: "5px",
							}}
						>
							{invoice.invoiceItems.length !== 0 && invoice ? (
								<>
									{invoice.invoiceItems.map((item) => {
										return (
											<>
												<Grid
													item
													phone={12}
													sx={{
														mb: 3,
														px: 3,
														display: "flex",
														justifyContent: "space-between",
													}}
												>
													<Box component="span" className="itemInfo">
														<Typography variant="body2" sx={{ mb: 1, fontWeight: "700", width: "80%" }}>
															{item.itemName || defaultText}
														</Typography>
														<Typography variant="body2" sx={{ color: "grey.400" }}>
															{`${item.quantity} x ${item.price}` || defaultText}
														</Typography>
													</Box>

													<Typography variant="body2"> $ {item.total || defaultText}</Typography>
												</Grid>
											</>
										);
									})}
								</>
							) : (
								<>
									<Typography variant="body1" sx={{mx: "auto", mb: 2, color: 'grey.500'}}>You have no Items :(</Typography>
								</>
							)}
							<Grid
								item
								phone={12}
								sx={{
									mt: 2,
									px: 2,
									py: 3,
									backgroundColor: "rgb(55,59,84)",
									display: "flex",
									justifyContent: "space-between",
									borderRadius: "5px",
								}}
							>
								<Typography variant="body1" sx={{ color: "white" }}>
									Grand Total
								</Typography>
								<Typography variant="body1" sx={{ color: "white" }}>
									$ {invoice.totalCost.toFixed(2)}
								</Typography>
							</Grid>
						</Grid>
					</Paper>

					<Drawer anchor="left" open={invoiceFormIsOpen}>
						<CreateInvoiceForm toggleInvoiceForm={toggleInvoiceForm} setInvoice={setInvoice} invoice={invoice} />
					</Drawer>
				</Box>
			</>
		);
	}
}
