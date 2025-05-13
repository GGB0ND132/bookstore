import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider
} from "@mui/material";
import { useState } from "react";
import { getCart, removeFromCart } from "../services/api";
import type { Book } from "../types/book";

const Cart = () => {
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // 获取购物车数据
  const { data: cartItems = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['cart'],
    queryFn: getCart
  });

  // 从购物车移除商品
  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.error('删除失败:', error);
      setSnackbarMessage('删除失败，请重试');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  });

  // 安全地计算总价
  const total = cartItems.reduce((sum, item: Book) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
    return sum + (price * quantity);
  }, 0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          加载购物车数据失败，请刷新页面重试
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        购物车
      </Typography>
      <Paper sx={{ p: 3 }}>
        {cartItems.length === 0 ? (
          <Typography color="text.secondary">购物车为空</Typography>
        ) : (
          cartItems.map((item: Book) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{item.title || '未知商品'}</Typography>
              <Typography variant="body2" color="text.secondary">
                作者：{item.author || '未知作者'}
              </Typography>
              <Typography variant="body2" color="primary">
                ￥{(item.price || 0).toFixed(2)}
                {item.quantity ? ` × ${item.quantity}` : ' × 1'}
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={() => {
                  // 使用购物车项的 id 而不是书籍的 id
                  const cartItemId = cartItems.find(i => i.id === item.id)?.id;
                  if (cartItemId) {
                    removeFromCartMutation.mutate(cartItemId.toString());
                  }
                }}
                sx={{ mt: 1 }}
              >
                删除
              </Button>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Typography variant="h6">总计</Typography>
          <Typography variant="h6" color="primary">￥{total.toFixed(2)}</Typography>
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
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
