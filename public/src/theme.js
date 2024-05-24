export class Theme {
  static colors = {
    background: "midnightblue",
    text: "white",
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

  static tint = {
    default: 0xffffff,
    hover: 0xcccccc,
  };

  static duration = {
    click: 100,
  };

  get colors() {
    return Theme.colors;
  }

  get tint() {
    return Theme.tint;
  }

  get duration() {
    return Theme.duration;
  }
}
