import {ProductsList} from '../features/products/ProductsList';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const Menu = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: 'white',
            pb: 8
        }}>
            <Container>
                <Typography
                    variant="h3"
                    component="h1"
                    color="deepBlack"
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        fontWeight: 700,
                    }}
                >
                    Меню кофейни
                </Typography>
                <ProductsList />
            </Container>
        </Box>
    );
};

export default Menu;
