import { env } from '../config/env';

export default function App() {
  return <h1>{env.appName}</h1>;
}
