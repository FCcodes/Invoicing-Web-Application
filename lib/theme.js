import { createTheme } from "@mui/material/styles"
import { letterSpacing } from "@mui/system"

let theme = createTheme({
    breakpoints: {
        values: {
            phone: 0,
            phonexl: 400,
            tablet: 500,
            tabletxl: 600,
            laptop: 900,
            desktop: 1200
        }
    }
})

theme.typography.h1 = {
    fontSize: "1.5rem",
    letterSpacing: ".1rem",
    cursor: "pointer"
}

theme.typography.h2 = {
    fontSize: "1.5rem",
    letterSpacing: ".1rem",
    cursor: "pointer"
}

theme.typography.h3 = {
    fontSize: "1.2rem",    
}

theme.typography.h4 = {
    fontSize: ".9rem",
    letterSpacing: ".2rem",
    cursor: "pointer"
}

theme.typography.body2 = {
    fontSize: ".7rem",    
    fontWeight: 700
}

theme.typography.body1 = {    
    fontSize: ".8rem",
    fontWeight: 700
}

theme.typography.subtitle1 = {
    fontSize: ".85rem",    
}

theme.typography.subtitle2 = {
    fontSize: ".7rem",        
}

export default theme