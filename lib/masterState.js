import { createContext, useState } from "react";
import { Box } from "@mui/material";

export const MasterState = createContext();

const AppContext = ({ children }) => {

    const [ user, setUser ] = useState({
        name: "",
		id: "12345678910",
		isLoggedIn: true,				
    })

    
	return (
		<>
			<MasterState.Provider value={{user}}>
				{children}
			</MasterState.Provider>
		</>
	);
};

export default AppContext;
