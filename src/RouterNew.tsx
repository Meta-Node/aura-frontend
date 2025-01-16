import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
  RouteConfigEntry,
} from '@react-router/dev/routes';

const routes = [
  index('pages/Login/index.tsx'),
  route('home', './pages/Home/index.tsx'),
  route('splash/*', './pages/Splash/index.tsx'),
] satisfies RouteConfig;

export default routes;
