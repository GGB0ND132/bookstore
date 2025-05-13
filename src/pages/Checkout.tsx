import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { getCart, removeFromCart } from "../services/api";
import { useState } from "react";
import type { Book } from "../types/book";

interface FormData {
  name: string;
  phone: string;
  address: string;
}

const Checkout = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: ''
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { data: cartItems = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['cart'],
    queryFn: getCart
  });

  const removeMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setSnackbarMessage('已从购物车中删除');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.error('删除失败:', error);
      setSnackbarMessage('删除失败，请重试');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // 验证表单
    if (!formData.name || !formData.phone || !formData.address) {
      alert('请填写完整的收货信息');
      return;
    }
    // TODO: 实现支付功能
    alert('支付功能开发中...');
  };

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          加载购物车数据失败，请刷新页面重试
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        结算
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              收货信息
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  name="name"
                  label="收货人姓名"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  name="phone"
                  label="联系电话"
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <TextField
                fullWidth
                name="address"
                label="收货地址"
                variant="outlined"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              订单信息
            </Typography>
            {cartItems.map((item: Book) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {item.title || '未知商品'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  作者：{item.author || '未知作者'}
                </Typography>
                <Typography variant="body2" color="primary">
                  ￥{(item.price || 0).toFixed(2)} × {item.quantity || 1}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    // 使用购物车项的 id 而不是书籍的 id
                    const cartItemId = cartItems.find(i => i.id === item.id)?.id;
                    if (cartItemId) {
                      removeMutation.mutate(cartItemId.toString());
                    }
                  }}
                  sx={{ mt: 1 }}
                >
                  删除
                </Button>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              订单总计
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>商品总额</Typography>
              <Typography>￥{total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>运费</Typography>
              <Typography>￥0.00</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">应付总额</Typography>
              <Typography variant="h6" color="primary">￥{total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
            >
              立即支付
            </Button>
          </Paper>
        </Box>
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
    </Container>
  );
};

export default Checkout;
