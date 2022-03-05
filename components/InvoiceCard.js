import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";
//import { createRipple } from "../util/createRipple"

function CardLayoutPhone({ statusTheme, invoice }) {
	return (
		<>
			<Grid container id="phoneLayout" sx={{ display: { tablet: "none" } }}>
				<Grid item phone={6} sx={{ display: "flex", flexDirection: "column" }}>
					<Typography
						variant="body1"
						sx={{
							mb: 2,
							alignSelf: "self-start",
							fontWeight: 700,
							fontSize: { phone: ".8rem", letterSpacing: "1px" },
						}}
					>
						<Box component="span" sx={{ color: "grey.400", fontFamily: "sans-serif" }}>
							#
						</Box>{" "}
						{invoice.number}
					</Typography>
					<Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "grey.500" }}>
						Due {invoice.invoiceDate || "Not Specified"}
					</Typography>
					<Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: "1px" }}>
						$ {invoice.totalCost || "Not Specified"}
					</Typography>
				</Grid>

				<Grid item phone={6} sx={{ display: "flex", flexDirection: "column" }}>
					<Typography variant="body1" align="center" sx={{ mb: 2, color: "grey.500" }}>
						{invoice.billedTo.clientsName || "Not Specified"}
					</Typography>
					<Box
						sx={{
							px: 1,
							py: 1,
							mx: "auto",
							width: { phone: "80%" },
							maxWidth: { phone: "90px" },
							display: "flex",
							alignItems: "center",
							justifyContent: "space-evenly",
							backgroundColor: statusTheme.backgroundColor,
							border: `1px solid ${statusTheme.borderColor}`,
							borderRadius: "5px",
						}}
					>
						<Box
							sx={{
								backgroundColor: "black",
								width: "10px",
								height: "10px",
								borderRadius: "50px",
								backgroundColor: statusTheme.color,							
							}}
						></Box>
						<Typography variant="body2" sx={{ color: statusTheme.color }}>
							{invoice.state || "Not Specified"}
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</>
	);
}
function CardLayoutTablet({ statusTheme, invoice }) {
	return (
		<>
			<Grid
				container
				id="tabletLayout"
				sx={{
					display: {
						phone: "none",
						tablet: "flex",
						alignItems: "center",
					},
				}}
			>
				<Typography variant="body1"></Typography>
				<Typography variant="subtitle2"></Typography>
				<Typography variant="subtitle1"></Typography>
				<Typography variant="body1"></Typography>
				<Box
					sx={{
						px: 2,
						py: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Box
						sx={{
							backgroundColor: "black",
							width: "10px",
							height: "10px",
							borderRadius: "50%",
						}}
					></Box>
					<Typography variant="body2"></Typography>
				</Box>
			</Grid>
		</>
	);
}

const InvoiceCard = ({ invoice }) => {
	let invoiceCard = useRef(null);

	let theme = ["rgb(50,213,158)", "rgb(252,142,4)"];
	const [statusTheme, setStatusTheme] = useState({
		color: "rgb(0, 0, 0, 0.8)",
		backgroundColor: "rgb(0, 0, 0, 0.15)",
		borderColor: "rgb(0, 0, 0, 0.1)",
	});

	useEffect(() => {
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
		return;
	}, [invoice.state]);

	const router = useRouter();

	function handelClick(e) {
		router.push(`/invoice/${invoice.id}`);
		return;
	}

	return (
		<>
			<Paper
				elevation={0}
				ref={invoiceCard}
				className="ripple-effect"
				sx={{
					py: { phone: 2, phonexl: 3, tablet: 2 },
					px: {phone: 2, phonexl: 3},
					my: 2,
					mx: "auto",
					mb: 1,
					cursor: "pointer",
					width: "100%",
					borderRadius: "10px",
					'&:hover':{
						boxShadow: "8px 10px 5px rgb(0, 0, 0, .1)"
					},					
				}}
				onClick={handelClick}
			>
				<CardLayoutPhone statusTheme={statusTheme} invoice={invoice} />
				<CardLayoutTablet statusTheme={statusTheme} invoice={invoice} />
			</Paper>
		</>
	);
};

export default InvoiceCard;
