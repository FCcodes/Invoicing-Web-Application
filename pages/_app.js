import "../styles/globals.css";

//Application State
import AppContext from "../lib/masterState";

//Application Theme
import { ThemeProvider } from "@mui/material/styles";
import theme from "../lib/theme";

//Application Layout
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<ThemeProvider theme={theme}>
				<AppContext>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</AppContext>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
