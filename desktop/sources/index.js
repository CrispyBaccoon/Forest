"use strict";

const { shell, remote } = require("electron");
const Left = require("./left");
const Splash = require("./scripts/splash");
const Oak = require("./scripts/oak");
const { app } = remote;
const EOL = "\n";

const left = new Left();

left.install(document.getElementById("main"));
left.start();

// On Windows: open the file specified in the first argument
// (allows Open With and file associations on Windows)
if (process.platform === "win32" && remote.process.argv.length > 1) {
  left.project.add(remote.process.argv[1]);
}

// Themes
left.oak.start();
const Themes = left.oak.themeNames;
const lightThemes = left.oak.lightThemeNames;
const darkThemes = left.oak.darkThemeNames;

// Menu

const LoadMenu = () => {
  left.controller.add(
    "default",
    "*",
    "About",
    () => {
      shell.openExternal("https://github.com/CrispyBaccoon/Forest");
    },
    "CmdOrCtrl+,"
  );
  left.controller.add(
    "default",
    "*",
    "Splash",
    () => {
      left.project.pages.push(new Splash());
      left.go.to_page(left.project.pages.length);
    },
    ""
  );
  left.controller.add(
    "default",
    "*",
    "Fullscreen",
    () => {
      app.toggleFullscreen();
    },
    "CmdOrCtrl+Enter"
  );
  left.controller.add(
    "default",
    "*",
    "Toggle Menu Bar",
    () => {
      app.toggleMenubar();
    },
    "Alt+Shift+Enter"
  );
  left.controller.add(
    "default",
    "*",
    "Hide",
    () => {
      app.toggleVisible();
    },
    "CmdOrCtrl+H"
  );
  left.controller.addRole("default", "*", "reload");
  left.controller.addRole("default", "*", "forcereload");
  left.controller.addRole("default", "*", "toggledevtools");
  left.controller.add(
    "default",
    "*",
    "Reset",
    () => {
      left.reset();
    },
    "CmdOrCtrl+Backspace"
  );
  left.controller.add(
    "default",
    "*",
    "Quit",
    () => {
      left.project.quit();
    },
    "CmdOrCtrl+Q"
  );

  left.controller.add(
    "default",
    "File",
    "New",
    () => {
      left.project.new();
    },
    "CmdOrCtrl+N"
  );
  left.controller.add(
    "default",
    "File",
    "Open",
    () => {
      left.project.open();
    },
    "CmdOrCtrl+O"
  );
  left.controller.add(
    "default",
    "File",
    "Save",
    () => {
      left.project.save();
    },
    "CmdOrCtrl+S"
  );
  left.controller.add(
    "default",
    "File",
    "Save As",
    () => {
      left.project.save_as();
    },
    "CmdOrCtrl+Shift+S"
  );
  left.controller.add(
    "default",
    "File",
    "Discard Changes",
    () => {
      left.project.discard();
    },
    "CmdOrCtrl+D"
  );
  left.controller.add(
    "default",
    "File",
    "Close File",
    () => {
      left.project.close();
    },
    "CmdOrCtrl+W"
  );
  left.controller.add(
    "default",
    "File",
    "Force Close",
    () => {
      left.project.force_close();
    },
    "CmdOrCtrl+Shift+W"
  );

  left.controller.addRole("default", "Edit", "undo");
  left.controller.addRole("default", "Edit", "redo");
  left.controller.addRole("default", "Edit", "cut");
  left.controller.addRole("default", "Edit", "copy");
  left.controller.addRole("default", "Edit", "paste");
  left.controller.addRole("default", "Edit", "delete");
  left.controller.addRole("default", "Edit", "selectall");
  left.controller.add(
    "default",
    "Edit",
    "Add Linebreak",
    () => {
      left.go.to_next(EOL, false);
      left.inject(EOL);
    },
    "CmdOrCtrl+Shift+Enter"
  );
  left.controller.add(
    "default",
    "Edit",
    "Toggle Autoindent",
    () => {
      left.toggle_autoindent();
    },
    "CmdOrCtrl+Shift+T"
  );

  left.controller.add(
    "default",
    "Select",
    "Select Autocomplete",
    () => {
      left.select_autocomplete();
    },
    "Tab"
  );
  left.controller.add(
    "default",
    "Select",
    "Select Synonym",
    () => {
      left.select_synonym();
    },
    "Shift+Tab"
  );
  left.controller.add(
    "default",
    "Select",
    "Find",
    () => {
      left.operator.start("find: ");
    },
    "CmdOrCtrl+F"
  );
  left.controller.add(
    "default",
    "Select",
    "Replace",
    () => {
      left.operator.start("replace: a -> b");
    },
    "CmdOrCtrl+Shift+F"
  );
  left.controller.add(
    "default",
    "Select",
    "Goto",
    () => {
      left.operator.start("goto: ");
    },
    "CmdOrCtrl+G"
  );
  left.controller.add(
    "default",
    "Select",
    "Open Url",
    () => {
      left.open_url();
    },
    "CmdOrCtrl+B"
  );

  left.controller.add(
    "default",
    "Navigation",
    "Next File",
    () => {
      left.navi.next_page();
    },
    "CmdOrCtrl+'"
  );
  left.controller.add(
    "default",
    "Navigation",
    "Prev File",
    () => {
      left.navi.prev_page();
    },
    "CmdOrCtrl+;"
  );
  left.controller.add(
    "default",
    "Navigation",
    "Next Marker",
    () => {
      left.navi.next_marker();
    },
    "CmdOrCtrl+."
  );
  left.controller.add(
    "default",
    "Navigation",
    "Prev Marker",
    () => {
      left.navi.prev_marker();
    },
    "CmdOrCtrl+,"
  );

  left.controller.add(
    "default",
    "View",
    "Toggle Navigation",
    () => {
      left.navi.toggle();
    },
    "CmdOrCtrl+\\"
  );
  left.controller.add(
    "default",
    "View",
    "Previous Font",
    () => {
      left.font.previousFont();
    },
    "CmdOrCtrl+Shift+,"
  );
  left.controller.add(
    "default",
    "View",
    "Next Font",
    () => {
      left.font.nextFont();
    },
    "CmdOrCtrl+Shift+."
  );
  left.controller.add(
    "default",
    "View",
    "Decrease Font Size",
    () => {
      left.font.decreaseFontSize();
    },
    "CmdOrCtrl+-"
  );
  left.controller.add(
    "default",
    "View",
    "Increase Font Size",
    () => {
      left.font.increaseFontSize();
    },
    "CmdOrCtrl+="
  );
  left.controller.add(
    "default",
    "View",
    "Reset Font Size",
    () => {
      left.font.resetFontSize();
    },
    "CmdOrCtrl+0"
  );

  left.controller.add(
    "default",
    "Mode",
    "Reader",
    () => {
      left.reader.start();
    },
    "CmdOrCtrl+K"
  );
  left.controller.add(
    "default",
    "Mode",
    "Insert",
    () => {
      left.insert.start();
    },
    "CmdOrCtrl+I"
  );

  /* // Theme
      left.controller.add("default","Theme","Open Theme",() => { left.theme.open() },"CmdOrCtrl+Shift+O")
      left.controller.add("default","Theme","Reset Theme",() => { left.theme.reset() },"CmdOrCtrl+Shift+Backspace")
      left.controller.addSpacer('default', 'Theme', 'Download')
      left.controller.add("default","Theme","Download Themes..",() => { require('electron').shell.openExternal('https://github.com/hundredrabbits/Themes') })
      */

  left.controller.add(
    "reader",
    "*",
    "About",
    () => {
      require("electron").shell.openExternal(
        "https://github.com/hundredrabbits/Left"
      );
    },
    "CmdOrCtrl+,"
  );
  left.controller.add(
    "reader",
    "*",
    "Fullscreen",
    () => {
      app.toggleFullscreen();
    },
    "CmdOrCtrl+Enter"
  );
  left.controller.add(
    "reader",
    "*",
    "Hide",
    () => {
      app.toggleVisible();
    },
    "CmdOrCtrl+H"
  );
  left.controller.add(
    "reader",
    "*",
    "Reset",
    () => {
      left.theme.reset();
    },
    "CmdOrCtrl+Backspace"
  );
  left.controller.add(
    "reader",
    "*",
    "Quit",
    () => {
      left.project.quit();
    },
    "CmdOrCtrl+Q"
  );
  left.controller.add(
    "reader",
    "Reader",
    "Stop",
    () => {
      left.reader.stop();
    },
    "Esc"
  );

  left.controller.add(
    "operator",
    "*",
    "About",
    () => {
      require("electron").shell.openExternal(
        "https://github.com/hundredrabbits/Left"
      );
    },
    "CmdOrCtrl+,"
  );
  left.controller.add(
    "operator",
    "*",
    "Fullscreen",
    () => {
      app.toggleFullscreen();
    },
    "CmdOrCtrl+Enter"
  );
  left.controller.add(
    "operator",
    "*",
    "Hide",
    () => {
      app.toggleVisible();
    },
    "CmdOrCtrl+H"
  );
  left.controller.add(
    "operator",
    "*",
    "Reset",
    () => {
      left.theme.reset();
    },
    "CmdOrCtrl+Backspace"
  );
  left.controller.add(
    "operator",
    "*",
    "Quit",
    () => {
      left.project.quit();
    },
    "CmdOrCtrl+Q"
  );

  left.controller.add(
    "insert",
    "*",
    "About",
    () => {
      require("electron").shell.openExternal(
        "https://github.com/hundredrabbits/Left"
      );
    },
    "CmdOrCtrl+,"
  );
  left.controller.add(
    "insert",
    "*",
    "Fullscreen",
    () => {
      app.toggleFullscreen();
    },
    "CmdOrCtrl+Enter"
  );
  left.controller.add(
    "insert",
    "*",
    "Hide",
    () => {
      app.toggleVisible();
    },
    "CmdOrCtrl+H"
  );
  left.controller.add(
    "insert",
    "*",
    "Reset",
    () => {
      left.theme.reset();
    },
    "CmdOrCtrl+Backspace"
  );
  left.controller.add(
    "insert",
    "*",
    "Quit",
    () => {
      left.project.quit();
    },
    "CmdOrCtrl+Q"
  );

  left.controller.add(
    "insert",
    "Insert",
    "Date",
    () => {
      left.insert.date();
    },
    "CmdOrCtrl+D"
  );
  left.controller.add(
    "insert",
    "Insert",
    "Time",
    () => {
      left.insert.time();
    },
    "CmdOrCtrl+T"
  );
  left.controller.add(
    "insert",
    "Insert",
    "Path",
    () => {
      left.insert.path();
    },
    "CmdOrCtrl+P"
  );
  left.controller.add(
    "insert",
    "Insert",
    "Header",
    () => {
      left.insert.header();
    },
    "CmdOrCtrl+H"
  );
  left.controller.add(
    "insert",
    "Insert",
    "SubHeader",
    () => {
      left.insert.subheader();
    },
    "CmdOrCtrl+Shift+H"
  );
  left.controller.add(
    "insert",
    "Insert",
    "Comment",
    () => {
      left.insert.comment();
    },
    "CmdOrCtrl+/"
  );
  left.controller.add(
    "insert",
    "Insert",
    "Line",
    () => {
      left.insert.line();
    },
    "CmdOrCtrl+L"
  );
  left.controller.add(
    "insert",
    "Insert",
    "List",
    () => {
      left.insert.list();
    },
    "CmdOrCtrl+-"
  );
  left.controller.add(
    "insert",
    "Mode",
    "Stop",
    () => {
      left.insert.stop();
    },
    "Esc"
  );

  left.controller.addRole("operator", "Edit", "undo");
  left.controller.addRole("operator", "Edit", "redo");
  left.controller.addRole("operator", "Edit", "cut");
  left.controller.addRole("operator", "Edit", "copy");
  left.controller.addRole("operator", "Edit", "paste");
  left.controller.addRole("operator", "Edit", "delete");
  left.controller.addRole("operator", "Edit", "selectall");

  left.controller.add(
    "operator",
    "Find",
    "Find",
    () => {
      left.operator.start("find: ");
    },
    "CmdOrCtrl+F"
  );
  left.controller.add(
    "operator",
    "Find",
    "Find Next",
    () => {
      left.operator.find_next();
    },
    "CmdOrCtrl+N"
  );
  left.controller.add(
    "operator",
    "Operator",
    "Stop",
    () => {
      left.operator.stop();
    },
    "Esc"
  );

  left.controller.addSpacer("default", "Themes", "DarkThemes");
  darkThemes.map((theme) => {
    left.controller.add(
      "default",
      "Themes",
      theme,
      () => {
        console.log(`[Theme]: ${theme}`);
        var themeData = left.oak.returnThemeByName(theme);
        left.theme.load(themeData);
      },
      ""
    );
  });
  left.controller.addSpacer("default", "Themes", "LightThemes");
  lightThemes.map((theme) => {
    left.controller.add(
      "default",
      "Themes",
      theme,
      () => {
        console.log(`[Theme]: ${theme}`);
        var themeData = left.oak.returnThemeByName(theme);
        left.theme.load(themeData);
      },
      ""
    );
  });
  left.controller.addSpacer("default", "Themes", "ThemeOptions");
  left.controller.add(
    "default",
    "Themes",
    "Open Theme",
    () => {
      left.theme.open();
    },
    "CmdOrCtrl+Shift+O"
  );
  left.controller.add(
    "default",
    "Themes",
    "Reset Theme",
    () => {
      left.theme.reset();
    },
    "CmdOrCtrl+Shift+Backspace"
  );
  left.controller.addSpacer("default", "Themes", "Download");
  left.controller.add("default", "Themes", "Download Themes..", () => {
    require("electron").shell.openExternal(
      "https://github.com/hundredrabbits/Themes"
    );
  });

  left.controller.addSpacer("default", "Fonts", "Fonts");
  left.font.fonts.map((font, index) => {
    left.controller.add(
      "default",
      "Fonts",
      font,
      () => {
        left.font.fontIndex = index;
        left.font.updateVariables();
      },
      ""
    );
  });

  left.controller.commit();
  left.branch.setMenu(left.controller.docs());
  left.branch.start();
  left.leaf.setMenu(left.controller.docs());
  left.leaf.start();
};
LoadMenu();

const win =
  remote.getCurrentWindow(); /* Note this is different to the html global `window` variable */

const handleWindowControls = () => {
  // Make minimise/maximise/restore/close buttons work when they are clicked
  document
    .getElementById("minimize-window")
    .addEventListener("click", (event) => {
      win.minimize();
    });

  document
    .getElementById("maximize-window")
    .addEventListener("click", (event) => {
      win.maximize();
    });

  document
    .getElementById("restore-window")
    .addEventListener("click", (event) => {
      win.unmaximize();
    });

  document.getElementById("close-window").addEventListener("click", (event) => {
    win.close();
  });

  document
    .getElementById("window-controls")
    .addEventListener("mouseout", (event) => {
      var windowIcons = document.getElementsByClassName("windowIcon");
      for (var i = 0; i < windowIcons.length; i++) {
        windowIcons[i].style.fill = "var(--b_med)";
      }
    });

  var windowIcons = document.getElementsByClassName("windowIcon");
  for (var i = 0; i < windowIcons.length; i++) {
    windowIcons[i].style.fill = "var(--b_med)";
  }

  document
    .getElementById("window-controls")
    .addEventListener("mouseover", (event) => {
      closeIcon.style.fill = "var(--b_inv)";
      minimizeIcon.style.fill = "var(--f_low)";
      maximizeIcon.style.fill = "var(--f_high)";
    });

  // Toggle maximise/restore buttons when maximisation/restoring occurs
  toggleMaxRestoreButtons();
  win.on("maximize", toggleMaxRestoreButtons);
  win.on("unmaximize", toggleMaxRestoreButtons);

  function toggleMaxRestoreButtons() {
    if (win.isMaximized()) {
      document.body.classList.add("maximized");
    } else {
      document.body.classList.remove("maximized");
    }
  }
};
// When document has loaded, initialise
document.onreadystatechange = (event) => {
  if (document.readyState == "complete") {
    $(".disable-drag").on("touchstart mousedown click", (e) => {
      e.stopPropagation();
    });
    handleWindowControls();
  }
};

window.onbeforeunload = (event) => {
  /* If window is reloaded, remove win event listeners
          (DOM element listeners get auto garbage collected but not
          Electron win listeners as the win is not dereferenced unless closed) */
  win.removeAllListeners();
};
