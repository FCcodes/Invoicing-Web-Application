import { useState, useContext, useEffect } from "react";
import { Box, Paper, Grid, FormControl, FormHelperText, Input, InputLabel, Typography, Select, MenuItem, TextField } from "@mui/material";
import { v4 as uuid4 } from "uuid";
import createInvoiceNumber from "../util/createInvoiceNumber";
import { MasterState } from "../lib/masterState";
import propTypes from "prop-types";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const BaseInput = styled(InputBase)(({ theme }) => ({
	"& .MuiInputBase-input": {
		margin: 5,
	},
}));

const CreateInvoiceForm = ({ toggleInvoiceForm, invoice, setInvoice, setInvoices }) => {
	let date = new Date();

	let { user } = useContext(MasterState);
	const [totalCost, setTotalCost] = useState(invoice ? invoice.totalCost : 0);
	const [invoiceForm, setInvoiceForm] = useState({
		authorID: invoice ? invoice.authorID : user.id,
		id: invoice ? invoice.id : uuid4(),
		number: invoice ? invoice.number : createInvoiceNumber(11),
		created: invoice ? invoice.created : date.toLocaleDateString(),
		billedFrom: {
			streetAddress: invoice ? invoice.billedFrom.streetAddress : "Street01",
			city: invoice ? invoice.billedFrom.city : "NYC",
			postCode: invoice ? invoice.billedFrom.postCode : "0000",
			country: invoice ? invoice.billedFrom.country : "US",
		},
		billedTo: {
			clientsName: invoice ? invoice.billedTo.clientsName : "Tom",
			clientsEmail: invoice ? invoice.billedTo.clientsEmail : "tom@gmail.com",
			streetAddress: invoice ? invoice.billedTo.streetAddress : "street01",
			city: invoice ? invoice.billedTo.city : "LA",
			postCode: invoice ? invoice.billedTo.postCode : "0000",
			country: invoice ? invoice.billedTo.country : "US",
		},
		invoiceDueDate: invoice ? invoice.invoiceDueDate : "",
		paymentTerms: invoice ? invoice.paymentTerms : "",
		invoiceMessage: invoice ? invoice.invoiceMessage : "Simple Project",
		state: invoice ? invoice.billedTo.state : "",
	});
	const [invoiceItems, setInvoiceItems] = useState(
		invoice
			? invoice.invoiceItems
			: [
					// {
					// 	id: uuid4(),
					// 	itemName: "Website Development",
					// 	quantity: 1,
					// 	price: "156.00",
					// 	total: "156.00",
					// 	error: false,
					// },
			  ]
	);

	const [disable, setDisable] = useState(invoice.state === "Paid" ? true : false);

	function discardInvoice() {
		setInvoiceForm({
			authorID: user.id,
			id: uuid4(),
			number: createInvoiceNumber(),
			created: date.toLocaleDateString(),
			billedFrom: {
				streetAddress: "",
				city: "",
				postCode: "",
				country: "",
			},
			billedTo: {
				clientsName: "",
				clientsEmail: "",
				streetAddress: "",
				city: "",
				postCode: "",
				country: "",
			},
			invoiceDueDate: "",
			paymentTerms: "",
			invoiceMessage: "",
			totalCost: "",
			state: "",
		});
		setInvoiceItems([]);
		toggleInvoiceForm();
	}

	function deleteInvoiceItem(id) {
		let newItemList = invoiceItems.filter((item) => item.id !== id);
		setInvoiceItems([...newItemList]);
	}

	async function saveAndSend(e) {
		e.preventDefault();
		let invoicePayload = {
			...invoiceForm,
			state: "Pending",
			totalCost,
			invoiceItems: [...invoiceItems],
		};
		let payload = JSON.stringify(invoicePayload);
		let query = invoice.id ? `?id=${invoice.id}` : `/`;
		console.log(query);

		try {
			console.log("sent");
			let res = await fetch(`http://localhost:3000/api/invoice/sendInvoice${query}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(invoicePayload),
			});

			console.log("server responded");

			if (!res.ok) {
				console.log(res);
				let message = await res.json();
				console.log(message);
				return;
			}

			let data = await res.json();
			console.log(data.message);
			console.log(data);
			if (invoice) {
				setInvoice(data.invoice);
				setInvoiceForm({
					authorID: "",
					title: "",
					id: "",
					number: "",
					created: "",
					billedFrom: {
						streetAddress: "",
						city: "",
						postCode: "",
						country: "",
					},
					billedTo: {
						clientsName: "",
						clientsEmail: "",
						streetAddress: "",
						city: "",
						postCode: "",
						country: "",
					},
					invoiceDueDate: "",
					paymentTerms: "",
					invoiceMessage: "",
					state: "",
				});
				setInvoiceItems([]);
				toggleInvoiceForm();
			}

			setInvoices(data.invoices);
			setInvoiceForm({
				authorID: "",
				id: "",
				number: "",
				created: "",
				billedFrom: {
					streetAddress: "",
					city: "",
					postCode: "",
					country: "",
				},
				billedTo: {
					clientsName: "",
					clientsEmail: "",
					streetAddress: "",
					city: "",
					postCode: "",
					country: "",
				},
				invoiceDueDate: "",
				paymentTerms: "",
				invoiceMessage: "",
				state: "",
			});
			setInvoiceItems([]);
			toggleInvoiceForm();
			return;
		} catch (error) {
			console.error(error);
		}
	}

	async function saveAsDraft() {
		let invoicePayload = {
			...invoiceForm,
			state: "draft",
			totalCost,
			invoiceItems: [...invoiceItems],
		};

		//Save invoice as draft
		try {
			//send a POST request to serverless function
			let res = await fetch("http://localhost:3000/api/invoice/saveAsDraft", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(invoicePayload),
			});

			if (!res.ok) {
				console.log(res);
			}

			let data = await res.json();
			setInvoices(data);
		} catch (error) {
			console.log(error);
		}

		setInvoiceForm({
			authorID: user.id,
			id: uuid4(),
			number: createInvoiceNumber(),
			created: date.toLocaleDateString(),
			billedFrom: {
				streetAddress: "",
				city: "NY",
				postCode: "",
				country: "",
			},
			billedTo: {
				clientsName: "",
				clientsEmail: "",
				streetAddress: "",
				city: "",
				postCode: "",
				country: "",
			},
			invoiceDueDate: "",
			paymentTerms: "",
			invoiceMessage: "",
			state: "",
		});
		setInvoiceItems([]);
		toggleInvoiceForm();
	}

	async function updateInvoice() {
		let state = "Draft";

		let invoicePayload = {
			...invoiceForm,
			state,
			totalCost,
			invoiceItems: [...invoiceItems],
		};

		try {
			let res = await fetch(`http://localhost:3000/api/invoice/updateInvoice?u=${invoice.authorID}&id=${invoice.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(invoicePayload),
			});

			if (!res.ok) {
				console.log(res);
				let data = await res.json();
				console.log(data);
				return;
			}

			if (res.ok) {
				let data = await res.json();
				setInvoice(data);
				setInvoiceItems([]);
				toggleInvoiceForm();
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		let totalPrice = 0;
		for (let i = 0; i < invoiceItems.length; i++) {
			let itemTotal = parseInt(invoiceItems[i].total);

			totalPrice += itemTotal;
		}

		setTotalCost(totalPrice);

		return;
	}, [invoiceItems]);

	return (
		<>
			<Paper
				elevation={0}
				component="form"
				onSubmit={saveAndSend}
				sx={{
					py: 5,
					px: 2.5,
					width: {
						phone: "100vw",
						phonexl: "90vw",
					},
					maxWidth: { phonexl: "430px" },
				}}
			>
				<Box
					component="nav"
					sx={{
						mb: 5,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						alignItems: "baseline",
					}}
				>
					<Typography
						variant="h2"
						sx={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						{!invoice ? (
							"New Invoice"
						) : (
							<>
								<span>Edit invoice</span>
								<span>#{invoice.number}</span>
							</>
						)}
					</Typography>

					<Box
						component="svg"
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						sx={{
							width: "28px",
							height: "28px",
							cursor: "pointer",
						}}
						onClick={() => toggleInvoiceForm()}
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</Box>
				</Box>

				<Typography
					variant="body1"
					sx={{
						mb: 2,
						fontWeight: 700,
						color: "grey.500",
					}}
				>
					Title
				</Typography>
				<FormControl
					required
					fullWidth
					sx={{
						backgroundColor: "grey.200",
						borderRadius: "5px",
						mb: 5
					}}
				>
					<InputLabel htmlFor="">Title</InputLabel>
					<Input
						disableUnderline
						sx={{
							pl: 2,
							pr: 1,
							pr: 1,
							pb: 1,
						}}
						value={invoiceForm.title}
						onChange={(e) => {
							setInvoiceForm((prev) => ({
								...prev,
								title: e.target.value
							}));
						}}
					/>
				</FormControl>
				
				<Typography
					variant="body1"
					sx={{
						mb: 2,
						fontWeight: 700,
						color: "grey.500",
					}}
				>
					Bill From
				</Typography>
				<FormControl
					required
					fullWidth
					sx={{
						backgroundColor: "grey.200",
						borderRadius: "5px",
					}}
				>
					<InputLabel htmlFor="">Street Address</InputLabel>
					<Input
						disableUnderline
						sx={{
							pl: 2,
							pr: 1,
							pr: 1,
							pb: 1,
						}}
						value={invoiceForm.billedFrom.streetAddress}
						onChange={(e) => {
							setInvoiceForm((prev) => ({
								...prev,
								billedFrom: {
									...prev.billedFrom,
									streetAddress: e.target.value,
								},
							}));
						}}
					/>
				</FormControl>
				<Grid
					container
					component="section"
					sx={{
						my: 3,
						mb: 5,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Grid item phone={5.5}>
						<FormControl
							required
							sx={{
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>City</InputLabel>
							<Input
								disableUnderline
								sx={{
									pl: 2,
									pr: 1,
									pb: 1,
								}}
								value={invoiceForm.billedFrom.city}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										billedFrom: {
											...prev.billedFrom,
											city: e.target.value,
										},
									}));
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item phone={5.5}>
						<FormControl
							required
							sx={{
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>Post Code</InputLabel>
							<Input
								disableUnderline
								sx={{
									pl: 2,
									pr: 1,
									pb: 1,
								}}
								value={invoiceForm.billedFrom.postCode}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										billedFrom: {
											...prev.billedFrom,
											postCode: e.target.value,
										},
									}));
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item phone={12}>
						<FormControl
							required
							fullWidth
							sx={{
								mt: 3,
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>Country</InputLabel>
							<Input
								disableUnderline
								sx={{
									pl: 2,
									pr: 1,
									pb: 1,
								}}
								value={invoiceForm.billedFrom.country}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										billedFrom: {
											...prev.billedFrom,
											country: e.target.value,
										},
									}));
								}}
							/>
						</FormControl>
					</Grid>
				</Grid>

				<Typography
					variant="body1"
					sx={{
						mb: 2,
						fontWeight: 700,
						color: "grey.500",
					}}
				>
					Bill To
				</Typography>

				<FormControl
					required
					fullWidth
					sx={{
						mb: 2,
						backgroundColor: "grey.200",
						borderRadius: "5px",
					}}
				>
					<InputLabel htmlFor="clients-name">Clients&apos;s Name</InputLabel>
					<Input
						id="clients-name"
						disableUnderline
						sx={{
							pl: 2,
							pr: 1,
							pr: 1,
							pb: 1,
						}}
						value={invoiceForm.billedTo.clientsName}
						onChange={(e) => {
							setInvoiceForm((prev) => ({
								...prev,
								billedTo: {
									...prev.billedTo,
									clientsName: e.target.value,
								},
							}));
						}}
					/>
				</FormControl>

				<FormControl
					required
					fullWidth
					sx={{
						mb: 2,
						backgroundColor: "grey.200",
						borderRadius: "5px",
					}}
				>
					<InputLabel htmlFor="clients-email">Clients&apos;s Email</InputLabel>
					<Input
						id="clients-email"
						disableUnderline
						type="email"
						sx={{
							pl: 2,
							pr: 1,
							pr: 1,
							pb: 1,
						}}
						value={invoiceForm.billedTo.clientsEmail}
						onChange={(e) => {
							setInvoiceForm((prev) => ({
								...prev,
								billedTo: {
									...prev.billedTo,
									clientsEmail: e.target.value,
								},
							}));
						}}
					/>
				</FormControl>

				<FormControl
					required
					fullWidth
					sx={{
						mb: 1,
						backgroundColor: "grey.200",
						borderRadius: "5px",
					}}
				>
					<InputLabel htmlFor="clients-address">Street Address</InputLabel>
					<Input
						id="clients-address"
						disableUnderline
						sx={{
							pl: 2,
							pr: 1,
							pr: 1,
							pb: 1,
						}}
						value={invoiceForm.billedTo.streetAddress}
						onChange={(e) => {
							setInvoiceForm((prev) => ({
								...prev,
								billedTo: {
									...prev.billedTo,
									streetAddress: e.target.value,
								},
							}));
						}}
					/>
				</FormControl>

				<Grid
					container
					component="section"
					sx={{
						my: 3,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Grid item phone={5.8}>
						<FormControl
							required
							sx={{
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>City</InputLabel>
							<Input
								disableUnderline
								sx={{
									pl: 2,
									pr: 1,
									pb: 1,
								}}
								value={invoiceForm.billedTo.city}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										billedTo: {
											...prev.billedTo,
											city: e.target.value,
										},
									}));
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item phone={5.8}>
						<FormControl
							required
							sx={{
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>Post Code</InputLabel>
							<Input
								disableUnderline
								sx={{
									pl: 2,
									pr: 1,
									pb: 1,
								}}
								value={invoiceForm.billedTo.postCode}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										billedTo: {
											...prev.billedTo,
											postCode: e.target.value,
										},
									}));
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item phone={12}>
						<FormControl
							required
							fullWidth
							sx={{
								mt: 3,
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>Country</InputLabel>
							<Input
								disableUnderline
								sx={{
									pl: 2,
									pr: 1,
									pb: 1,
								}}
								value={invoiceForm.billedTo.country}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										billedTo: {
											...prev.billedTo,
											country: e.target.value,
										},
									}));
								}}
							/>
						</FormControl>
					</Grid>
				</Grid>

				<Grid
					container
					component="section"
					sx={{
						my: 1,
						mb: 5,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Grid item phone={5.8}>
						<FormControl
							required
							fullWidth
							sx={{
								backgroundColor: "grey.200",
								height: "100%",
								borderRadius: "5px",
								py: 1,
							}}
						>
							<Input
								type="date"
								disableUnderline
								sx={{
									px: 1,
									py: "auto",
								}}
								value={invoiceForm.invoiceDueDate}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										invoiceDueDate: e.target.value,
									}));
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item phone={5.8}>
						<FormControl
							required
							fullWidth
							sx={{
								backgroundColor: "grey.200",
								borderRadius: "5px",
							}}
						>
							<InputLabel>Payment Terms</InputLabel>
							<Select
								variant="standard"
								disableUnderline
								value={invoiceForm.paymentTerms}
								sx={{
									px: 1,
								}}
								onChange={(e) => {
									setInvoiceForm((prev) => ({
										...prev,
										paymentTerms: e.target.value,
									}));
								}}
							>
								<MenuItem value="10">Net 10</MenuItem>
								<MenuItem value="20">Net 20</MenuItem>
								<MenuItem value="30">Net 30</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				<Typography
					variant="body1"
					sx={{
						mb: 2,
						fontWeight: 700,
						color: "grey.500",
					}}
				>
					Project Description
				</Typography>

				<TextField
					label="Invoice message"
					variant="filled"
					sx={{
						mb: 5,
						borderRadius: "5px",
					}}
					fullWidth
					multiline
					rows={3}
					required
					value={invoiceForm.invoiceMessage}
					onChange={(e) => {
						setInvoiceForm((prev) => ({
							...prev,
							invoiceMessage: e.target.value,
						}));
					}}
				/>

				<Box
					component="section"
					sx={{
						mb: 3,
					}}
				>
					<Typography
						variant="body1"
						sx={{
							mb: 3,
							color: "grey.400",
						}}
					>
						Item List
					</Typography>
					<Grid container>
						<Grid
							item
							phone={12}
							container
							sx={{
								mb: 1,
							}}
						>
							<Grid item phone={3}>
								<Typography variant="body2">Item Name</Typography>
							</Grid>

							<Grid item phone={3}>
								<Typography variant="body2">Qty.</Typography>
							</Grid>

							<Grid item phone={3}>
								<Typography variant="body2">Price</Typography>
							</Grid>

							<Grid item phone={3}>
								<Typography variant="body2">Total</Typography>
							</Grid>
						</Grid>

						{invoiceItems.length === 0 ? (
							<>
								<Typography variant="body2" sx={{ mt: 3, mx: "auto", color: "grey.400" }}>
									Add Item
								</Typography>
							</>
						) : (
							<>
								{invoiceItems.map((item, position) => {
									return (
										<Grid
											key={item.id}
											item
											phone={12}
											sx={{
												mb: 2,
												display: "flex",
											}}
											container
										>
											<Grid
												item
												phone={3}
												sx={{
													pr: 1,
												}}
											>
												<FormControl
													required
													sx={{
														borderRadius: "5px",
														backgroundColor: "whitesmoke",
													}}
												>
													<Input
														disableUnderline
														sx={{
															px: 1,
															py: 0.5,
															color: "grey.800",
															fontSize: { phone: ".8rem" },
														}}
														value={item.itemName}
														onChange={(e) => {
															setInvoiceItems((prev) => {
																let newObj = prev[position];
																let otherObjs = prev.filter((obj) => obj.id !== newObj.id);
																newObj.itemName = e.target.value;
																return [...otherObjs, newObj];
															});
														}}
													/>
												</FormControl>
											</Grid>

											<Grid
												item
												phone={2}
												sx={{
													pr: 1,
												}}
											>
												<FormControl
													required
													sx={{
														borderRadius: "5px",
														backgroundColor: "whitesmoke",
													}}
												>
													<Input
														type="number"
														disableUnderline
														inputProps={{
															min: 0,
														}}
														sx={{
															px: 1,
															py: 0.5,
															color: "grey.800",
															fontSize: { phone: ".8rem" },
														}}
														value={item.quantity}
														onChange={(e) => {
															setInvoiceItems((prev) => {
																if (isNaN(parseInt(e.target.value)) && e.target.value !== "") {
																	console.log(e.target.value);
																	return [...prev];
																}

																let total;
																let quantity = e.target.value;
																let value = e.target.value || 1;

																let newObj = prev[position];
																let otherObjs = prev.filter((obj) => obj.id !== newObj.id);
																newObj.quantity = parseInt(quantity);

																total = newObj.price * value;

																newObj.total = total.toFixed(2);

																return [...otherObjs, newObj];
															});
														}}
													/>
												</FormControl>
											</Grid>

											<Grid
												item
												phone={3}
												sx={{
													pr: 1,
												}}
											>
												<FormControl
													required
													sx={{
														borderRadius: "5px",
														backgroundColor: "whitesmoke",
													}}
												>
													<Input
														disableUnderline
														type="number"
														inputProps={{
															min: 0.0,
															max: 10000.0,
															step: "any",
														}}
														sx={{
															px: 1,
															py: 0.5,
															color: "grey.800",
															fontSize: { phone: ".8rem" },
														}}
														value={item.price}
														onChange={(e) => {
															setInvoiceItems((prev) => {
																if (isNaN(parseInt(e.target.value)) && e.target.value !== "") {
																	console.log(e.target.value);
																	return [...prev];
																}

																let total;
																let price;
																let value;
																let newObj = prev[position];
																let otherObjs = prev.filter((obj) => obj.id !== newObj.id);

																price = e.target.value;
																value = e.target.value || 0;
																newObj.price = parseInt(price).toFixed(3);

																total = price * newObj.quantity;
																newObj.total = total.toFixed(3);
																//console.log(total)

																return [...otherObjs, newObj];
															});
														}}
													/>
												</FormControl>
											</Grid>

											<Grid item phone={3}>
												<FormControl
													required
													sx={{
														borderRadius: "5px",
														backgroundColor: "whitesmoke",
													}}
												>
													<Input
														disableUnderline
														sx={{
															px: 1,
															py: 0.5,
															color: "grey.800",
															fontSize: { phone: ".8rem" },
														}}
														value={item.total}
													/>
												</FormControl>
											</Grid>

											<Grid
												item
												phone={1}
												sx={{
													py: 1,
													display: "flex",
													justifyContent: "right",
													alignItems: "center",
												}}
											>
												<Box
													component="svg"
													onClick={() => deleteInvoiceItem(item.id)}
													sx={{
														width: { phone: "1rem" },
														transition: "all .3s ease-in-out",
														cursor: "pointer",
														"&:hover": {
															color: "red",
														},
													}}
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</Box>
											</Grid>
										</Grid>
									);
								})}
							</>
						)}
					</Grid>
				</Box>

				<Box
					className="add-item"
					sx={{
						py: 1,
						mb: 5,
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "whitesmoke",
						borderRadius: "5px",
						cursor: "pointer",
					}}
					onClick={() => {
						setInvoiceItems((prev) => [
							...prev,
							{
								id: Math.ceil(Math.random() * 10000),
								itemName: "",
								quantity: 0,
								price: "00.00",
								total: "00.00",
								error: false,
							},
						]);
					}}
				>
					<Typography
						variant="body1"
						sx={{
							mx: 1,
						}}
					>
						Add Item{" "}
					</Typography>
					<Box
						component="svg"
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						sx={{
							width: "30px",
							height: "30px",
						}}
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</Box>
				</Box>

				<Grid
					container
					component="section"
					className="actionButtons"
					sx={{
						mb: 2,
						px: 1,
						py: 3,
						display: "flex",
						justifyContent: "space-between",
						backgroundColor: "whitesmoke",
						borderRadius: "5px",
					}}
				>
					<Box
						component="button"
						disabled={disable}
						type="reset"
						onClick={discardInvoice}
						sx={{
							cursor: "pointer",
							border: "none",
							
							mx: {
								phone: 0.5,
							},
							py: {
								phone: 0.9,
							},
							px: {
								phone: 2,
								phonexl: 1.5,
							},
							fontWeight: 600,
							fontSize: ".7rem",
							borderRadius: "5px",
							color: "grey.600",
							backgroundColor: "grey.400",
						}}
					>
						Discard
					</Box>

					{invoice ? (
						<>
							<Box
								component="button"
								type="button"
								disabled={disable}
								onClick={updateInvoice}
								sx={{
									cursor: "pointer",
									border: "none",
									
									mx: {
										phone: 0.5,
									},
									px: {
										phone: 2,
										phonexl: 1.5,
									},
									fontWeight: 600,
									fontSize: ".6rem",
									borderRadius: "5px",
									color: "white",
									backgroundColor: "rgb(240,85,84)",
								}}
							>
								Save Changes
							</Box>
						</>
					) : (
						<>
							<Box
								component="button"
								disabled={disable}
								type="button"
								onClick={saveAsDraft}
								sx={{
									cursor: "pointer",
									border: "none",
									
									mx: {
										phone: 0.5,
									},
									px: {
										phone: 2,
										phonexl: 1.5,
									},
									fontWeight: 600,
									fontSize: ".7rem",
									borderRadius: "5px",
									color: "white",
									backgroundColor: "rgb(240,85,84)",
								}}
							>
								Save as Draft
							</Box>
						</>
					)}

					<Box
						component="button"
						disabled={disable}
						type="submit"
						sx={{
							cursor: "pointer",
							border: "none",
							mx: {
								phone: 0.5,
							},
							py: {
								phone: 0.9,
							},
							px: {
								phone: 2,
								phonexl: 1.5,
							},
							fontWeight: 600,
							fontSize: ".7rem",
							borderRadius: "5px",
							color: "white",
							backgroundColor: "rgb(121,92,246)",
						}}
					>
						Save and Send
					</Box>
				</Grid>
			</Paper>
		</>
	);
};

export default CreateInvoiceForm;

// CreateInvoiceForm.propTypes = {
// 	toggleInvoiceForm:  propTypes.func.isRequired,
// 	invoice: propTypes.obj,
// 	setInvoices: propTypes.func
// }

CreateInvoiceForm.defaultProps = {
	invoice: false,
};
