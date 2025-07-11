import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        pomegranate: Palette['primary'];
        warmOrange: Palette['primary'];
        grassGreen: Palette['primary']; 
    }

    interface PaletteOptions {
        pomegranate?: PaletteOptions['primary'];
        warmOrange?: PaletteOptions['primary']; 
        grassGreen?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        pomegranate: true;
        warmOrange: true;
        grassGreen: true;
    }
}

const theme = createTheme({
    palette: {
        pomegranate: {
            main: '#C0392B',
            light: '#E74C3C',
            dark: '#922B21',
            contrastText: '#FFF',
        },

        warmOrange: {
            main: '#FFA726',
            light: '#FFB74D',
            dark: '#F57C00',
            contrastText: '#212121',
        },

        grassGreen: {
            main: '#388E3C', 
            light: '#66BB6A', 
            dark: '#1B5E20',  
            contrastText: '#FFFFFF', 
        },
    },
    typography: {
        fontFamily: [
            'NunitoSans',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontSize: '2.5rem', fontWeight: 500 },
        h2: { fontSize: '2rem', fontWeight: 500 },
        h3: { fontSize: '1.75rem', fontWeight: 500 },
        h4: { fontSize: '1.5rem', fontWeight: 500 },
        h5: { fontSize: '1.25rem', fontWeight: 500 },
        h6: { fontSize: '1rem', fontWeight: 500 },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    components: {

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, 
                },
            },
        },
    },
});

export default theme;
