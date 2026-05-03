import { 
  LuUtensils, 
  LuCar, 
  LuShoppingBag, 
  LuWallet, 
  LuHeartPulse, 
  LuReceipt, 
  LuTicket,
  LuMoveHorizontal, 
  LuCoins,
  LuDollarSign,
  LuGraduationCap
} from "react-icons/lu";

export const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("drink")) return LuUtensils;
  else if (cat.includes("transport")) return LuCar;
  else if (cat.includes("shopping")) return LuShoppingBag;
  else if (cat.includes("salary") || cat.includes("income")) return LuWallet;
  else if (cat.includes("health")) return LuHeartPulse;
  else if (cat.includes("education")) return LuGraduationCap;
  else if (cat.includes("bill") || cat.includes("utility")) return LuReceipt;
  else if (cat.includes("entertainment") || cat.includes("movie") || cat.includes("game")) return LuTicket;
  else if (cat.includes("bonus")) return LuCoins;
  else if (cat.includes("investment")) return LuDollarSign;
  else return LuMoveHorizontal;
};
