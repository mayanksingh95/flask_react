import React, { useEffect, useState } from "react";
import "./App.css";
import { Movies } from "./components/Movies";
import { MovieForm } from "./components/MovieForm";
import { Container } from "semantic-ui-react";
import { About } from "./components/About";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Secret } from "./components/Secret";
import { Header } from "./components/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useAuth, authFetch } from "./components/Auth"


function App() {
  const [movies, setMovies] = useState([]);
  const [alert, setalert] = useState({
    show: false,
    value: "",
    color: ""
  });

  let [logged] = useAuth();


  useEffect(() => {
    authFetch("/movies").then(response => {

      response.json().then(data => {
        setMovies(data.movies);
      })
    });
  }, []);




  const PrivateRoute = ({ component: Component, ...rest }) => {
    const [logged] = useAuth();

    console.log(logged)
    return <Route {...rest} render={(props) => (
      logged
        ? <Component {...props} />
        :
        <Redirect to='/login' />
    )} />

  }
  const onDelete = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id))
    setalert({ show: true, value: 'Data Deleted!', color: "ui red message" })
  }

  const showalert = () => {
    setalert({ show: true, value: 'Data Added!', color: "ui green message" })
  }


  return (
    <>
      <Router>

        <Header islogin={logged} />
        <Switch>
          <Route exact path="/" render={() => {
            return (
              <Container style={{ marginTop: 40 }}>
                {alert.show ? (
                  <div className={alert.color}> { alert.value}</div>
                ) : null
                }
                {logged ? (
                  <>
                    <MovieForm
                      onNewMovie={movie =>
                        setMovies(currentMovies => [movie, ...currentMovies])
                      }
                      Alert={showalert}
                    />
                    <Movies setalert={setalert} movies={movies} setMovies={setMovies} onDeleteMovie={onDelete} />
                  </>
                ) : <h2>You are not logged in!</h2>}
              </Container >
            )
          }}>
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/secret" component={Secret} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
