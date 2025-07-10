import {createTheme} from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        pomegranate: Palette['primary'];
    }

    interface PaletteOptions {
        pomegranate?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        pomegranate: true;
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
    },
    typography: {
        fontFamily: [
            'lavash',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {fontSize: '2.5rem', fontWeight: 500},
        h2: {fontSize: '2rem', fontWeight: 500},
        h3: {fontSize: '1.75rem', fontWeight: 500},
        h4: {fontSize: '1.5rem', fontWeight: 500},
        h5: {fontSize: '1.25rem', fontWeight: 500},
        h6: {fontSize: '1rem', fontWeight: 500},
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
});

export default theme;
