import { useState, useContext } from "react";
import {
	Box,
	Grid,
	Typography,
	Avatar,
	AppBar,
	Toolbar,
	Divider,
} from "@mui/material";

import { MasterState } from "../lib/masterState"

import Link from "next/link"

const Layout = ({ children }) => {
	const [theme, setTheme] = useState("light");
	const [themeIcon, setThemeIcon] = useState([
		<path
			key="0"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
		/>,
		<path
			key="1"
			fillRule="evenodd"
			d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
			clipRule="evenodd"
		/>,
	]);

    const appState = useContext(MasterState)    	

	return (
		<>
			<AppBar
				position="static"
				sx={{ boxShadow: "none", backgroundColor: "black" }}
			>
				<Toolbar
					component="nav"
					disableGutters
					sx={{ py: 1, px: 2, display: "flex", alignItems: "center" }}
				>
					<Typography
						variant="h4"
						sx={{
							flexGrow: 1,
						}}
					>
						<Link href="/">
                            <a>Invoice</a>
                        </Link>
					</Typography>					

					<Box
                        component="svg"
                        sx={{ width: "25px", height: "25px", cursor: "pointer" }}
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
							clipRule="evenodd"
						/>
					</Box>

					<Divider
						orientation="vertical"
						
						flexItem
						sx={{ mx: 1.2, width: "1px", backgroundColor: "grey.500" }}
					/>

					<Avatar
						src=""
						alt=""
						sx={{ width: "25px", height: "25px", cursor: "pointer" }}
					/>
				</Toolbar>
			</AppBar>

			{children}
		</>
	);
};

export default Layout;
