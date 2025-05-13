import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  Container,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { addToCart } from "../services/api";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // 获取书籍详情
  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/books/${id}`);
      if (!response.ok) {
        throw new Error('获取书籍详情失败');
      }
      return response.json();
    },
    enabled: !!id
  });

  // 添加到购物车
  const addToCartMutation = useMutation({
    mutationFn: (bookId: number) => addToCart(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setOpenSnackbar(true);
    }
  });

  const handleAddToCart = () => {
    if (book) {
      addToCartMutation.mutate(book.id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ mt: 4 }}>
          未找到书籍
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        返回
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 4 }}>
          <Box>
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={book.coverImage}
                alt={book.title}
                sx={{
                  objectFit: 'cover',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              />
            </Card>
          </Box>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              作者：{book.author}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 2, mb: 4 }}>
              ￥{book.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {book.description || '暂无简介'}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                sx={{ minWidth: 200 }}
              >
                {addToCartMutation.isPending ? '添加中...' : '加入购物车'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={addToCartMutation.isError ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {addToCartMutation.isError ? '加入购物车失败，请重试' : '已成功加入购物车！'}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BookDetail;