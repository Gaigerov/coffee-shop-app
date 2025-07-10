import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import {ProductCard} from '../../components/ProductCard/ProductCard';
import {useFetchProducts} from '../../hooks/useFetchProducts';
import Typography from '@mui/material/Typography';
import type {Product} from '../../types/types';

export const ProductsList = ({onAddToCart}: {onAddToCart: (product: Product) => void}) => {
    const {products, loading, error} = useFetchProducts();

    if (error) {
        return (
            <Container sx={{py: 4, textAlign: 'center'}}>
                <Typography color="error">Ошибка: {error}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{py: 4}}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 4,
                }}
            >
                {loading ? (
                    Array.from({length: 6}).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            height={350}
                        />
                    ))
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={(p) => {
                                onAddToCart(p);
                            }}
                        />
                    ))
                ) : (
                    <Typography variant="body1" sx={{gridColumn: '1 / -1', textAlign: 'center'}}>
                        Товары не найдены
                    </Typography>
                )}
            </Box>
        </Container>
    );
};