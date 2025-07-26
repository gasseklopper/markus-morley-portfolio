import { component$ } from "@builder.io/qwik";

export interface PortfolioPageProps {
  title: string;
  description: string;
}

export const PortfolioPage = component$<PortfolioPageProps>(
  ({ title, description }) => {
    return (
      <>
        <h1>{title}</h1>
        <p>{description}</p>
      </>
    );
  },
);

export default PortfolioPage;
