import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function FloatingAddButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const hiddenRoutes = ["/meals", "/onboarding", "/admin"];
  if (hiddenRoutes.some(r => pathname.startsWith(r))) return null;

  return (
    <motion.button
      onClick={() => navigate('/meals?quick=1')}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  );
}
