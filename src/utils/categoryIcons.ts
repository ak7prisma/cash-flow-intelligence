import { 
  LuUtensils, 
  LuCar, 
  LuShoppingBag, 
  LuWallet, 
  LuHeartPulse, 
  LuReceipt, 
  LuTicket,
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
  if (cat.includes("entertainment") || cat.includes("movie") || cat.includes("game")) return LuTicket;
  return LuMoveHorizontal;
};
