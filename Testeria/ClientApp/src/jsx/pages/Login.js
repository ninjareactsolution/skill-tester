import React,{ useState } from "react";
import { connect, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import {
    loadingToggleAction,
    loginAction,
} from '../../store/actions/AuthActions';
import loginbg from "../../images/login-bg-4.jpg";

function Login (props) {
  const [email, setEmail] = useState('me@gmail.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('elder');

    const dispatch = useDispatch();

    function onLogin(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) {
			return ;
		}
		dispatch(loadingToggleAction(true));	
        dispatch(loginAction(email, password, props.history));
    }

  return (
		<div className="login-main-page" style={{backgroundImage:"url("+ loginbg +")"}}>
            <div className="login-wrapper">
                <div className="login-aside-left" >
                    <Link to="/dashboard" className="login-logo">
						<svg className="rect-primary-rect" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="52" height="52" rx="26" fill="#ffffff"/>
							<path d="M37.7769 20.4874C36.6635 19.0898 34.9115 18.287 32.4182 18.0315C32.2161 18.0118 32.003 18 31.784 18C29.5731 18 27.3707 18.9907 26 20.5645C24.6283 18.9907 22.4267 18 20.217 18C19.9981 18 19.7862 18.0119 19.5801 18.0315C17.0906 18.287 15.339 19.0903 14.2249 20.487C13.1201 21.8716 12.76 23.7488 13.1553 26.0659C13.303 26.9258 13.7116 27.8337 14.2985 28.7638H17.9805L18.3684 22.8702C18.399 22.4053 18.7709 22.0265 19.2547 21.9674C19.7386 21.9084 20.1981 22.1856 20.3502 22.6283L23.2777 31.151L24.9026 24.9925C25.016 24.5625 25.4199 24.2604 25.8841 24.2583C25.8857 24.2583 25.8874 24.2583 25.889 24.2583C26.3512 24.2583 26.7556 24.5561 26.8729 24.9835L27.9093 28.7587L28.8491 27.2965C29.0078 27.0493 29.2739 26.8827 29.5747 26.8425C29.8755 26.8022 30.1792 26.8923 30.4032 27.0883L31.4776 28.0284H33.3884C33.9502 28.0284 34.4057 28.4634 34.4057 29.0001C34.4057 29.5367 33.9502 29.9717 33.3884 29.9717H31.0821C30.8278 29.9717 30.5826 29.8806 30.3949 29.7164L29.9381 29.3166L28.397 31.715C28.1839 32.0467 27.784 32.2249 27.3811 32.1679C26.978 32.1109 26.6495 31.8297 26.5461 31.4532L25.9088 29.1318L24.3924 34.8784C24.2817 35.2979 23.8942 35.5968 23.4416 35.612C23.4296 35.6124 23.4176 35.6126 23.4057 35.6126C22.9676 35.6126 22.5768 35.344 22.4393 34.9439L20.0668 28.0369L19.951 29.7964C19.9172 30.3083 19.4727 30.7071 18.9357 30.7071H15.7377C17.5022 32.8137 19.8716 34.9424 21.9519 36.8118L22.0357 36.887C23.0554 37.8048 23.9364 38.5964 24.51 39.1863C24.5876 39.269 25.2867 40 26.0521 40C26.8222 40 27.5062 39.2581 27.568 39.187C28.1781 38.5554 29.1674 37.6602 30.1448 36.7775C33.7656 33.4966 38.272 29.4136 38.8433 26.0647C39.2402 23.7492 38.8825 21.8728 37.7769 20.4874Z" fill="#6EC51E"/>
						</svg>
						<svg className="brand-title" width="108" height="44" viewBox="0 0 108 44" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.904 21V1.12H14.4V5.152H5.496V9.436H12.832V13.16H5.496V21H0.904ZM16.4814 21V6.3H20.9614V21H16.4814ZM16.4814 4.62V0.559999H20.9614V4.62H16.4814ZM33.5483 20.216C32.9323 20.4773 32.2229 20.72 31.4203 20.944C30.6363 21.168 29.8429 21.28 29.0403 21.28C28.4803 21.28 27.9483 21.2053 27.4443 21.056C26.9589 20.9253 26.5296 20.7107 26.1563 20.412C25.7829 20.0947 25.4843 19.684 25.2603 19.18C25.0549 18.676 24.9523 18.0693 24.9523 17.36V9.688H23.0763V6.3H24.9523V1.624H29.4323V6.3H32.4283V9.688H29.4323V15.82C29.4323 16.3053 29.5536 16.66 29.7963 16.884C30.0389 17.0893 30.3469 17.192 30.7203 17.192C31.0563 17.192 31.4016 17.136 31.7563 17.024C32.1109 16.912 32.4189 16.7907 32.6803 16.66L33.5483 20.216ZM41.9384 21.28C40.6878 21.28 39.5678 21.0747 38.5784 20.664C37.6078 20.2533 36.7864 19.7027 36.1144 19.012C35.4424 18.3027 34.9291 17.4907 34.5744 16.576C34.2384 15.6427 34.0704 14.672 34.0704 13.664C34.0704 12.656 34.2384 11.6947 34.5744 10.78C34.9291 9.84667 35.4424 9.03467 36.1144 8.344C36.7864 7.63467 37.6078 7.07467 38.5784 6.664C39.5678 6.23467 40.6878 6.02 41.9384 6.02C43.1891 6.02 44.2998 6.23467 45.2704 6.664C46.2411 7.07467 47.0624 7.63467 47.7344 8.344C48.4064 9.03467 48.9198 9.84667 49.2744 10.78C49.6291 11.6947 49.8064 12.656 49.8064 13.664C49.8064 14.672 49.6291 15.6427 49.2744 16.576C48.9384 17.4907 48.4344 18.3027 47.7624 19.012C47.0904 19.7027 46.2598 20.2533 45.2704 20.664C44.2998 21.0747 43.1891 21.28 41.9384 21.28ZM38.6624 13.664C38.6624 14.8213 38.9704 15.7547 39.5864 16.464C40.2024 17.1547 40.9864 17.5 41.9384 17.5C42.4051 17.5 42.8344 17.4067 43.2264 17.22C43.6184 17.0333 43.9544 16.772 44.2344 16.436C44.5331 16.1 44.7664 15.6987 44.9344 15.232C45.1024 14.7467 45.1864 14.224 45.1864 13.664C45.1864 12.5067 44.8784 11.5827 44.2624 10.892C43.6464 10.1827 42.8718 9.828 41.9384 9.828C41.4718 9.828 41.0331 9.92133 40.6224 10.108C40.2304 10.2947 39.8851 10.556 39.5864 10.892C39.3064 11.228 39.0824 11.6387 38.9144 12.124C38.7464 12.5907 38.6624 13.104 38.6624 13.664Z" fill="#ffffff"/>
						</svg>
                      </Link>
                    <div className="login-description">
                        <h2 className="main-title mb-2">Welcome To Fito</h2>
                        <p className="">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,</p>
                        <ul className="social-icons mt-4">
                            <li><Link to={"#"}><i className="fa fa-facebook"></i></Link></li>
                            <li><Link to={"#"}><i className="fa fa-twitter"></i></Link></li>
                            <li><Link to={"#"}><i className="fa fa-linkedin"></i></Link></li>
                        </ul>
                        <div className="mt-3 bottom-privacy">
                            <p>Copyright © Designed & Developed by <a href="https://dexignzone.com/" rel="noreferrer" target="_blank">DexignZone</a> 2021</p>
                        </div>
                    </div>
                </div>
                <div className="login-aside-right">
                    <div className="row m-0 justify-content-center h-100 align-items-center">
                      <div className="p-5">
                        <div className="authincation-content">
                          <div className="row no-gutters">
                            <div className="col-xl-12">
                              <div className="auth-form-1">
                                <div className="mb-4">
                                    <h3 className="dz-title mb-1">Sign in</h3>
                                    <p className="">Sign in by entering information below</p>
                                </div>
                                {props.errorMessage && (
                                    <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                                        {props.errorMessage}
                                    </div>
                                )}
                                {props.successMessage && (
                                    <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                                        {props.successMessage}
                                    </div>
                                )}
                                <form onSubmit={onLogin}>
                                    <div className="form-group">
                                        <label className="mb-2 ">
                                          <strong>Email</strong>
                                        </label>
                                        <input type="email" className="form-control"
											value={email}
                                           onChange={(e) => setEmail(e.target.value)}
										   placeholder="Type Your Email Address"
                                        />
                                      {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="mb-2 "><strong>Password</strong></label>
                                        <input
                                          type="password"
                                          className="form-control"
                                          value={password}
										  placeholder="Type Your Password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                    </div>
                                  <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                    <div className="form-group">
                                      <div className="custom-control custom-checkbox ml-1 ">
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="basic_checkbox_1"
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="basic_checkbox_1"
                                        >
                                          Remember my preference
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <button
                                      type="submit"
                                      className="btn btn-primary btn-block"
                                      onClick={onLogin}
                                    >
                                      Sign In
                                    </button>
                                  </div>
                                </form>
                                <div className="new-account mt-2">
                                  <p className="">
                                    Don't have an account?{" "}
                                    <Link className="text-primary" to="./page-register">
                                      Sign up
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
	);
};

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Login);
