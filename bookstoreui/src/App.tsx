import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainNavigation from './components/MainNavigation';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { theme } from './utils/theme';
import { ThemeProvider } from '@mui/material';
import { AuthWrapper } from './context/auth';
import { CartWrapper } from './context/cart';

const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<React.Suspense fallback={<></>}>
				<BrowserRouter>
					<AuthWrapper>
						<CartWrapper>
							<div className='wrapper'>
								<Header />
								<main>
									<MainNavigation />
								</main>
								<Footer />
							</div>
						</CartWrapper>
					</AuthWrapper>
					<ToastContainer />
				</BrowserRouter>
			</React.Suspense>
		</ThemeProvider>
	);
};

export default App;
