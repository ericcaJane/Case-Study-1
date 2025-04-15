import { useNavigate } from "react-router-dom";

const useNavigation = () => {
  const navigate = useNavigate();

  return {
    goToAdminDashboard: () => navigate("/admindashboard"),
    goToViewerDashboard: () => navigate("/viewerdashboard"),
    goToLogin: () => navigate("/login"),
    goToSignup: () => navigate("/signup"),
  };
};

export default useNavigation;
