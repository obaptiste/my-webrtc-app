"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { VideoProvider } from "./contexts/VideoContext";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VideoProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ThemeProvider>
    </VideoProvider>
  );
}
