import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CartItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { data: cartItems, isLoading, error } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        console.log('正在获取购物车数据...');
        const res = await fetch('http://localhost:5000/cart');
        console.log('购物车响应状态:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('获取购物车失败:', errorText);
          throw new Error(`获取购物车失败: ${errorText}`);
        }
        
        const data = await res.json();
        console.log('购物车数据:', data);
        return data;
      } catch (error) {
        console.error('获取购物车出错:', error);
        throw error;
      }
    }
  });

  const removeFromCart = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await fetch(`http://localhost:5000/cart/${bookId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('删除失败');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setOpenSnackbar(true);
    },
  });

  const total = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          获取购物车失败，请重试
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        购物车
      </Typography>

      {cartItems?.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            购物车是空的
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            去购物
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {cartItems?.map((item) => (
              <Card key={item.id} sx={{ display: 'flex', position: 'relative' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140, height: 200, objectFit: 'cover' }}
                  image={`https://picsum.photos/seed/${item.bookId}/800/1000`}
                  alt={item.title}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      作者：{item.author}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ￥{item.price.toFixed(2)} × {item.quantity}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton 
                      color="error" 
                      onClick={() => removeFromCart.mutate(item.bookId)}
                      disabled={removeFromCart.isPending}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                总计：￥{total.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/checkout')}
              >
                去结算
              </Button>
            </Box>
          </Paper>
        </>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          已从购物车中删除
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
