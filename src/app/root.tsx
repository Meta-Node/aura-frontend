import ThemeResolver from '@/components/ui/theme-resolver';
import { PropsWithChildren } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import Providers, { AppProviders } from './providers';
import { Route } from '../../.react-router/types/src/app/+types/root';

import GlobalSearchModal from '@/components/GlobalSearchModal';
import { useSelector } from '@/store/hooks';
import { selectIsSearchModalOpen, toggleSearchModal } from '@/BrightID/actions';
import { useDispatch } from 'react-redux';
import DebugToolbar from '@/components/ux/debug-toolbar';

import './i18n';
import './tailwind.css';
import '../assets/fonts/fonts.css';
import 'swiper/css';
import ErrorBoundryUi from '@/components/error-boundry';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap',
  },
];

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="#0c0a09" name="theme-color" />
        <meta content="Aura" name="description" />
        <link href="/logo192.png" rel="apple-touch-icon" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="icon" href="/favicon.ico" />
        <title>Aura</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          {children}

          <ThemeResolver />
        </Providers>

        <ScrollRestoration />

        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const isSearchModalOpen = useSelector(selectIsSearchModalOpen);
  const dispatch = useDispatch();

  return (
    <AppProviders>
      {isSearchModalOpen && (
        <GlobalSearchModal onClose={() => dispatch(toggleSearchModal())} />
      )}
      <Outlet />

      <DebugToolbar />
    </AppProviders>
  );
}

export function ErrorBoundary({ error }: /*Route.ErrorBoundaryProps*/ any) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ErrorBoundryUi
      stack={stack}
      errorTitle={error}
      isDevelopment={!import.meta.env.DEV}
    />
  );
}
