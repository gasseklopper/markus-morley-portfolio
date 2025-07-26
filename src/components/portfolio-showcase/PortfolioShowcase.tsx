import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./PortfolioShowcase.css?inline";

export const PortfolioShowcase = component$(() => {
  useStylesScoped$(styles);
  return (
    <div class="portfolio-showcase">
      <nav class="nav-bar">
        <ul>
          <li>HOME</li>
          <li>WORK</li>
          <li>ABOUT +</li>
        </ul>
      </nav>
      <div class="main-block">
        <div class="title-left">
          <h2>SENIOR PRODUCT ENGINEER</h2>
        </div>
        <div class="title-right">
          <h3>CASE STUDIES</h3>
        </div>
      </div>
      <div class="bottom-blocks">
        <div class="card project">
          <h4>RECENT PROJECT</h4>
          <div class="prototype">
            <span class="play-icon">▶</span>
            <div class="label">Art Prototype</div>
          </div>
        </div>
        <div class="card project">
          <h4>RECENT PROJECT</h4>
          <div class="prototype">
            <span class="play-icon">▶</span>
            <div class="label">Interactive Prototype</div>
          </div>
        </div>
        <div class="card code">
          <h4>CODE</h4>
          <pre>
            <code>{`function greet() {\n  console.log('Hello Qwik');\n}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
});

export default PortfolioShowcase;
