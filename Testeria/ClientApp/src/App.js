import React, { lazy, Suspense, useEffect, useState } from 'react';
import Index from './jsx/index';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, withRouter, Redirect, useHistory } from 'react-router-dom';
import { checkAutoLogin } from './services/AuthService';

import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";



const SignUp = lazy(() => import('./jsx/pages/Registration'));
const ForgotPassword = lazy(() => import('./jsx/pages/ForgotPassword'));

const Login = lazy(() => {
    return new Promise(resolve => {
		setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
	});
});

function App () {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        checkAutoLogin(dispatch, history);
    }, [dispatch, history]);

    const isAuthenticated = useSelector(state => state.auth.auth.id)

    let routes = (  
        <Switch>
            <Route path='/page-login' component={Login} />
            <Route path='/page-register' component={SignUp} />
            <Route path='/page-forgot-password' component={ForgotPassword} />
            <Redirect path='*' to='page-login'/>
        </Switch>
    );

    if (isAuthenticated) {
		return (
			<>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>  
                   }
                >
                    <Index />
                </Suspense>
            </>
        );
	
	}else{
		return (
			<div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                  }
                >
                    {routes}
                </Suspense>
			</div>
		);
	}
};

export default withRouter(App); 
