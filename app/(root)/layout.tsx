import "@/styles/globals.css";

/** Root layout for the bare "/" URL only. All real pages live under app/[lang]. */
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
