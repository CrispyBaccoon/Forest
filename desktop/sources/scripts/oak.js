"use strict";

function Oak() {
  this.themeNames = [];
  this.darkThemeNames = [];
  this.lightThemeNames = [];

  this.activeTheme = "";

  this.collectThemeNames = () => {
    console.log("Oak", "Getting Themes..");
    const fs = require("fs");
    const paths = fs.readdirSync(`${__dirname}/../media/themes/`);
    var themes = [];
    paths.map((path) => {
      console.log(`[Theme Found] ${path}`);
      themes.push(path.replace(".svg", ""));
    });
    this.themeNames = themes;
  };

  this.start = () => {
    this.collectThemeNames();
    this.sortThemeNames();
  };

  this.loadTheme = (theme) => {
    console.log(`[Theme]: ${theme}`);
    var themeData = this.returnThemeByName(theme);
    if (left.theme.load(themeData)) {
      this.activeTheme = theme;
    } else {
      return;
    }
  };

  this.sortThemeNames = () => {
    var lightThemes = [];
    var darkThemes = [];
    this.themeNames.map((themeName) => {
      var themeData = parse(this.returnThemeByName(themeName));
      if (hexToHSL(themeData.background)[2] > 50) {
        lightThemes.push(themeName);
      } else {
        darkThemes.push(themeName);
      }
    });
    this.darkThemeNames = darkThemes;
    this.lightThemeNames = lightThemes;
  };

  this.returnThemeByName = (name) => {
    const fs = require("fs");
    const themePath = `${__dirname}/../media/themes/${name}.svg`;
    const themeExists = fs.existsSync(themePath);
    if (themeExists) {
      const theme = fs.readFileSync(themePath, "utf-8");
      return theme;
    }
  };

  // Helpers

  function parse(any) {
    if (any && any.background) {
      return any;
    } else if (any && any.data) {
      return any.data;
    } else if (any && isJson(any)) {
      return JSON.parse(any);
    } else if (any && isHtml(any)) {
      return extract(any);
    }
    return null;
  }

  function extract(text) {
    const svg = new DOMParser().parseFromString(text, "text/xml");
    try {
      return {
        background: svg.getElementById("background").getAttribute("fill"),
        f_high: svg.getElementById("f_high").getAttribute("fill"),
        f_med: svg.getElementById("f_med").getAttribute("fill"),
        f_low: svg.getElementById("f_low").getAttribute("fill"),
        f_inv: svg.getElementById("f_inv").getAttribute("fill"),
        b_high: svg.getElementById("b_high").getAttribute("fill"),
        b_med: svg.getElementById("b_med").getAttribute("fill"),
        b_low: svg.getElementById("b_low").getAttribute("fill"),
        b_inv: svg.getElementById("b_inv").getAttribute("fill"),
      };
    } catch (err) {
      console.warn("Theme", "Incomplete SVG Theme", err);
    }
  }

  function isJson(text) {
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }

  function isHtml(text) {
    try {
      new DOMParser().parseFromString(text, "text/xml");
      return true;
    } catch (error) {
      return false;
    }
  }

  function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
  }
}

module.exports = Oak;
