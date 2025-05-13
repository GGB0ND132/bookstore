import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { Book } from "../types/book";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  CardActions,
  Box,
  Skeleton,
  Snackbar,
  Alert
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState } from "react";
import { addToCart } from "../services/api";

const Home = () => {
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/books');
      return res.json();
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: (bookId: number) => addToCart(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setSnackbarMessage('已成功加入购物车！');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    },
    onError: () => {
      setSnackbarMessage('加入购物车失败，请重试');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  });

  const handleAddToCart = (bookId: number) => {
    addToCartMutation.mutate(bookId);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Box key={item}>
            <Card>
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {books?.map((book: Book) => (
          <Box key={book.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`https://picsum.photos/seed/${book.id}/400/200`}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" noWrap>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  作者：{book.author}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ￥{book.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  component={Link} 
                  to={`/book/${book.id}`}
                  size="small" 
                  color="primary"
                >
                  查看详情
                </Button>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(book.id)}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? '添加中...' : '加入购物车'}
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;
