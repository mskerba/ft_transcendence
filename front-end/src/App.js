import "./App.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function App() {
 return (
   <div className="App">
         <h1>Welcome</h1>
         <GoogleOAuthProvider      clientId="38742815095-iqj8uekmraecr0lfbfs4eknjgunhn2b2.apps.googleusercontent.com
"
         >
           <GoogleLogin
             onSuccess={async (credentialResponse) => {
             console.log(credentialResponse);
                        }}
             onError={() => {
               console.log("Login Failed");
             }}
           />
         </GoogleOAuthProvider>
   </div>
 );
}

export default App;