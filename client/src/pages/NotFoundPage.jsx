import { Link } from "react-router-dom";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <Page className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-20 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-apple-blue">404</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-[-0.06em] text-apple-black dark:text-white">
          This page slipped out of frame.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-apple-gray">
          The route does not exist, but the product surface is still intact.
        </p>
        <div className="mt-8">
          <Link className="premium-link" to="/">Return home</Link>
        </div>
      </div>
    </Page>
  );
}
