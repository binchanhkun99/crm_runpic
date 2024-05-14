import request, { setAuth } from "../utils/request";


const API_URL_LOGIN = "login/";
const API_URL_REG = "register";

class AuthService {
  async login(user) {
    try {
      const response = await request.post(API_URL_LOGIN, {
        username: user.username,
        password: user.password
      });
  
      const data = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuth();
        return response.data;
    
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
  

  async register(user) {
    try {
      const response = await request.post(API_URL_REG, {
        email: user.email,
        password: user.password,
        username: user.username
      });
      const data = response.data
      localStorage.setItem("user", JSON.stringify(data));

    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
