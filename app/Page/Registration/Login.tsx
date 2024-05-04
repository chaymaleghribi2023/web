"use client"
import React, { SyntheticEvent, useState } from "react";
import Registration from "./Registration";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CompteProfile from "../Profile/compte/CompteProfile";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Login = ({ setShowRegistration, showRegistration }: any) => {
  const router=useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const handleSignUpClick = () => {
    setShowRegistration(true);
  };
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [password, setPassword] = useState("");

  const listOfUser = async () => {
    const response = await fetch("http://localhost:8000/backend/user");
    const data: any = await response.json();
    return data;
  };
  const goto =()=>{
    router.push("/Page/Profile/ForgotPassword")
  }

  const Submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    let users = await listOfUser();
    console.log({ users });

    const user = users.find((el: any) => el.email === email && el.password === password);
    if (user !== undefined) {
      toast.error(`Vérifiez vos données!`, {
        autoClose: 2000,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      let response = await fetch("http://localhost:8000/backend/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data = await response.json();
      if(data.data!==undefined){
        localStorage.setItem("userId",data.data.user_id)
      }
      if (data.statusCode === 200) {
        setShowProfile(true);
        if(data.data.role === 'admin') {
          localStorage.setItem('admin','true');
        } else {
          localStorage.setItem('admin','false');
        }
      } else {
        toast.error(`Utilisateur non trouvé`, {
          autoClose: 2000,
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      console.log({ data });
    }
  };

  return (
    <div>
      <ToastContainer limit={1} /> 

      {!showProfile ? (
        <form className="form_main" action="">
          {!showRegistration ? (
            <>
              <p className="heading">Login</p>
              <div className="inputContainer">
                <input
                  placeholder="nom@mail.com"
                  id="email"
                  className="inputField"
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="inputContainer">
                <input
                  placeholder="Mot de passe"
                  id="password"
                  className="inputField"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button onClick={Submit} type="submit" id="button">connexion</button>
              <a onClick={goto}>Mot de passe oublié !</a> {/* Utilisez simplement un lien <a> avec un attribut href */}
              <div className="signupContainer">
                <button id="button" onClick={handleSignUpClick}>
                  Inscription
                </button>
                <Link  href="http://localhost:8000/backend/user/auth/google/callback" >
  <FontAwesomeIcon icon={faGoogle} className="w-6 h-6" />  {/* Taille de l'icône */}
  <span>Sign in with Google</span>
</Link>
              </div>
            </>
          ) : (
            <>
              <Registration />
            </>
          )}
        </form>
      ) : (
        <CompteProfile setShowProfile={setShowProfile} />
      )}
    </div>
  );
};

export default Login;
