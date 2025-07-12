import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import {ProductCard} from '../../components/ProductCard/ProductCard';
import {useFetchProducts} from '../../hooks/useFetchProducts';
import Typography from '@mui/material/Typography';

export const ProductsList = () => {
    const {products, loading, error} = useFetchProducts();

    if (error) {
        return (
            <Container sx={{
                py: 4,
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <Typography variant="h5" color="error" sx={{mb: 2}}>
                    Ошибка загрузки товаров
                </Typography>
                <Typography variant="body1">
                    {error}
                </Typography>
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
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 4,
                }}
            >
                {loading ? (
                    Array.from({length: 8}).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            height={350}
                            sx={{
                                borderRadius: '12px',
                                transform: 'none'
                            }}
                        />
                    ))
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))
                ) : (
                    <Box sx={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        py: 10
                    }}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            Товары не найдены
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Попробуйте изменить критерии поиска
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};
