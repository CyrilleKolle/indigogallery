import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://unpkg.com/lottie-web@5.10.2/build/player/lottie.min.js"></script>
      </Head>
      <body>
        <div id="splash">
          <p>🚀 Blast off in 3…2…1…</p>
          <div
            id="lottie-rocket"
            style={{ width: "300px", height: "300px", marginTop: "1rem" }}
          ></div>
        </div>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', () => {
                lottie.loadAnimation({
                  container: document.getElementById('lottie-rocket'),
                  renderer: 'svg',
                  loop: false,
                  autoplay: true,
                  path: '/spaceship.json'
                }).addEventListener('complete', () => {
                  document.getElementById('splash').style.display = 'none';
                });
              });
            `,
          }}
        />
      </body>
    </Html>
  );
}
