import { createSlice } from "@reduxjs/toolkit";
import { userRequest } from "../requestMethods";


const add=(prod,obj)=>{
  for(var i=0;i<prod.length;i++)
  {
    if(prod[i].productId==obj.productId)
    {  
      prod[i].quantity++;
      return;
    }
  }
};
  const rem=(prod,obj)=>{
    for(var i=0;i<prod.length;i++)
    {
      if(prod[i].productId==obj.productId)
      {  
        prod[i].quantity--;
        return;
      }
    }

};


const remove=(prod,obj)=>{
  for(var i=0;i<prod.length;i++)
  {
    if(prod[i].productId==obj.productId)
    {  
      prod.splice(i,1);
      return;
    }
  }

};

  
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },

    removeProduct:(state,action)=>{
      state.quantity-=1;
      remove(state.products,action.payload);
      state.total -= action.payload.price;
    },

    editProductAdd:(state,action)=>{
      add(state.products,action.payload);
      state.total += action.payload.price;
    },

    editProductRemove:(state,action)=>{
      rem(state.products,action.payload);
      state.total -= action.payload.price;
  
    },
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
    setPreviousProducts: (state, action) => {
      state.products = action.payload;
      state.quantity = action.payload.length;
      state.total = action.payload.reduce((acc, product) => acc + product.price * product.quantity, 0);
    },
  },
});

export const { addProduct, clearCart, setPreviousProducts,editProductAdd,editProductRemove,removeProduct} = cartSlice.actions;

export const fetchPreviousProducts = (userId) => async (dispatch) => {
  try {
    const res = await userRequest.get(`/carts/find/${userId}`);
    dispatch(setPreviousProducts(res.data.products));
  } catch (error) {
    console.error("Error fetching previous products:", error);
  }
};

export default cartSlice.reducer;
