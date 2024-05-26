export class Theme {
  static colors = {
    background: "midnightblue",
    text: "white",
    black: "black",
    surface: {
      background: "darkslateblue",
      text: "white",
      highlight: "slateblue",
    },
    accent: {
      background: "gold",
      text: "black",
      highlight: "yellow",
    },
    success: {
      background: "darkgreen",
      text: "white",
      highlight: "forestgreen",
    },
    error: {
      background: "firebrick",
      text: "white",
      highlight: "red",
    },
  };

  static allColors = Object.values(Theme.colors)
    .filter((value) => typeof value === "object")
    .flatMap((value) => Object.values(value));

  static fonts = {
    title: "JetBrains Mono, sans-serif",
    body: "JetBrains Mono, sans-serif",
  };

  static tint = {
    default: 0xffffff,
    hover: 0xcccccc,
  };

  static duration = {
    click: 100,
  };

  static randomColor() {
    return Theme.allColors[Math.floor(Math.random() * Theme.allColors.length)];
  }

  get colors() {
    return Theme.colors;
  }

  get randomColor() {
    return Theme.randomColor();
  }

  get fonts() {
    return Theme.fonts;
  }

  get tint() {
    return Theme.tint;
  }

  get duration() {
    return Theme.duration;
  }
}
