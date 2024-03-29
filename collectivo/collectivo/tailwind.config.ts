import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        black: "#0F1A2B",
        white: "#ffffff",

        meteorite: {
          "50": "#ededff",
          "100": "#dedeff",
          "200": "#c6c4ff",
          "300": "#a6a0ff",
          "400": "#8e7aff",
          "500": "#7d5afa",
          "600": "#723cef",
          "700": "#632fd3",
          "800": "#5129aa",
          "900": "#3b2476",
          "950": "#28184e",
        },

        blue: {
          "50": "#f1f5fd",
          "100": "#dee7fb",
          "200": "#c5d7f8",
          "300": "#9dbdf3",
          "400": "#6e9aec",
          "500": "#5e84e7",
          "600": "#385ad8",
          "700": "#2f47c6",
          "800": "#2c3ba1",
          "900": "#283680",
          "950": "#1d234e",
        },

        orange: {
          "50": "#fdf8ef",
          "100": "#faeeda",
          "200": "#f3dab5",
          "300": "#ecc085",
          "400": "#e39c54",
          "500": "#dc8233",
          "600": "#d36d29",
          "700": "#ab5323",
          "800": "#894323",
          "900": "#6f391f",
          "950": "#3b1b0f",
        },

        green: {
          "50": "#f2fbf9",
          "100": "#d2f5ee",
          "200": "#a4ebdd",
          "300": "#6fd9c9",
          "400": "#42bfb1",
          "500": "#2cb3a5",
          "600": "#1e837b",
          "700": "#1c6963",
          "800": "#1b5451",
          "900": "#1a4744",
          "950": "#092a29",
        },

        red: {
          "50": "#fdf3f3",
          "100": "#fbe5e5",
          "200": "#f8d0d0",
          "300": "#f2afaf",
          "400": "#e98080",
          "500": "#d94c4c",
          "600": "#c73b3b",
          "700": "#a72e2e",
          "800": "#8b2929",
          "900": "#742828",
          "950": "#3e1111",
        },

        pink: {
          "50": "#fcf6fd",
          "100": "#f9ebfc",
          "200": "#f4dbf8",
          "300": "#ebb7f0",
          "400": "#df8ce6",
          "500": "#cd5fd6",
          "600": "#b340b9",
          "700": "#963299",
          "800": "#7c2a7e",
          "900": "#682768",
          "950": "#430f43",
        },

        gray: {
          "50": "#f6f7f8",
          "100": "#ebecee",
          "200": "#dcdee1",
          "300": "#c4c8cc",
          "400": "#a1a6ac",
          "500": "#92979f",
          "600": "#81868f",
          "700": "#747881",
          "800": "#62646b",
          "900": "#505258",
          "950": "#333438",
        },
      },
      boxShadow: {
        sidebar: "0px 0px 48px 0px rgba(220, 226, 239, 0.50)",
      },
      fontSize: {
        lg: ["1.125rem", { lineHeight: "22px" }],
        xl: ["1.25rem", { lineHeight: "24px" }],
        "2xl": ["1.5rem", { lineHeight: "30px" }],
        "3xl": ["1.625rem", { lineHeight: "32px" }],
        "4xl": ["1.875rem", { lineHeight: "36px" }],
      },
    },
  },
};
