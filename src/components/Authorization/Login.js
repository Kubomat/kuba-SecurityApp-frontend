import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../context/ContextApi";

const Login = () => {
  const { setToken } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (token, decodedToken) => {
    localStorage.setItem("JWT_TOKEN", token);

    setToken(token);

    navigate("/notes");
  };

  const onLoginHandler = async (data) => {
    try {
      const response = await api.post("/auth/public/signin", data);

      if (response.status === 200 && response.data.jwtToken) {
        const decodedToken = jwtDecode(response.data.jwtToken);
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);

        toast.success("Login Successful");

        reset();
      } else {
        toast.error("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      if (error) {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4"
      >
        <h1 className="font-montserrat text-center font-bold text-2xl">
          Login Here
        </h1>
        <p className="text-slate-600 text-center">
          Please Enter your username and password{" "}
        </p>

        <div className="flex flex-col gap-2">
          <InputField
            label="UserName"
            required
            id="username"
            type="text"
            message="*UserName is required"
            placeholder="type your username"
            register={register}
            errors={errors}
          />
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="type your password"
            register={register}
            errors={errors}
          />
        </div>
        <Buttons className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3">
          LogIn
        </Buttons>

        <p className="text-center text-sm text-slate-700 mt-6">
          Don't have an account? 
          <Link
            className="font-semibold underline hover:text-black"
            to="/signup"
          >
            SignUp
          </Link>
        </p>
      </form> 
    </div>
  );
};

export default Login; 