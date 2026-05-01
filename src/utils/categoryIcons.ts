import { 
  LuUtensils, 
  LuCar, 
  LuShoppingBag, 
  LuWallet, 
  LuHeartPulse, 
  LuReceipt, 
  LuMoveHorizontal 
} from "react-icons/lu";

export const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("drink")) return LuUtensils;
  if (cat.includes("transport")) return LuCar;
  if (cat.includes("shopping")) return LuShoppingBag;
  if (cat.includes("salary") || cat.includes("income")) return LuWallet;
  if (cat.includes("health")) return LuHeartPulse;
  if (cat.includes("bill") || cat.includes("utility")) return LuReceipt;
  return LuMoveHorizontal;
};
