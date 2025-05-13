import type { Book } from '../types/book';

// 获取购物车内容
export const getCart = async (): Promise<Book[]> => {
  try {
    // 获取购物车数据
    const cartResponse = await fetch('http://localhost:5000/cart');
    if (!cartResponse.ok) {
      const errorText = await cartResponse.text();
      console.error('获取购物车失败:', cartResponse.status, errorText);
      throw new Error(`获取购物车失败: ${cartResponse.status} ${errorText}`);
    }
    const cartItems = await cartResponse.json();
    console.log('购物车数据:', cartItems);

    // 直接使用购物车返回的数据，添加默认数量
    const result = cartItems.map((item: Book) => ({
      ...item,
      quantity: 1 // 添加默认数量
    }));

    console.log('处理后的购物车数据:', result);
    return result;
  } catch (error) {
    console.error('getCart 错误:', error);
    throw error;
  }
};

// 获取单本书籍信息
const getBookById = async (bookId: number): Promise<Book> => {
  try {
    const response = await fetch(`http://localhost:5000/books/${bookId}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('获取书籍信息失败:', response.status, errorText);
      throw new Error(`获取书籍信息失败: ${response.status} ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error('getBookById 错误:', error);
    throw error;
  }
};

// 添加书籍到购物车
export const addToCart = async (bookId: number): Promise<Book[]> => {
  try {
    console.log('开始添加商品到购物车:', bookId);
    
    // 先获取完整的书籍信息
    const book = await getBookById(bookId);
    console.log('获取到的书籍信息:', book);

    // 将完整的书籍信息添加到购物车
    const response = await fetch('http://localhost:5000/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(book) // 直接发送完整的书籍信息
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('添加到购物车失败:', response.status, errorText);
      throw new Error(`添加到购物车失败: ${response.status} ${errorText}`);
    }

    // 获取更新后的购物车数据
    const result = await getCart();
    console.log('添加后的购物车数据:', result);
    return result;
  } catch (error) {
    console.error('addToCart 错误:', error);
    throw error;
  }
};

// 删除购物车内容
export const removeFromCart = async (cartItemId: string): Promise<Book[]> => {
  try {
    console.log('从购物车删除商品:', cartItemId);
    const response = await fetch(`http://localhost:5000/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('删除购物车失败:', response.status, errorText);
      throw new Error(`删除购物车失败: ${response.status} ${errorText}`);
    }

    const result = await getCart();
    console.log('删除后的购物车数据:', result);
    return result;
  } catch (error) {
    console.error('removeFromCart 错误:', error);
    throw error;
  }
}; 