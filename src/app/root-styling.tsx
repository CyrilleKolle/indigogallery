"use client";

import StyledComponentsRegistry from "@/lib/registry";
import localFont from "next/font/local";
import { createGlobalStyle } from "styled-components";

const bytebounce = localFont({
  src: "../../public/bytebounce/ByteBounce.ttf",
  display: "swap",
});

const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${bytebounce.style.fontFamily}, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    background-color: #000;
    overflow: hidden;
  }
`;

export function BodyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
