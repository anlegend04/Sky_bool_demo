// Language Testing Script for Browser Console
// Copy and paste this into browser console to test language functionality

console.log("🧪 Starting Language Switch Test...");

// Test localStorage persistence
function testLocalStorage() {
  console.log("📦 Testing localStorage...");

  // Check current value
  const current = localStorage.getItem("td_consulting_language");
  console.log("Current localStorage value:", current);

  // Test setting values
  localStorage.setItem("td_consulting_language", "vi");
  console.log(
    "Set to Vietnamese:",
    localStorage.getItem("td_consulting_language"),
  );

  localStorage.setItem("td_consulting_language", "en");
  console.log(
    "Set to English:",
    localStorage.getItem("td_consulting_language"),
  );

  // Restore original
  if (current) {
    localStorage.setItem("td_consulting_language", current);
  }
}

// Test translation function
function testTranslations() {
  console.log("🔤 Testing translations...");

  // Try to access React component state (if available)
  const reactRootFiber =
    document.querySelector("#root")._reactInternalFiber ||
    document.querySelector("#root")._reactInternals;

  if (reactRootFiber) {
    console.log("React fiber found, checking for language context...");
  } else {
    console.log("React fiber not found, using direct DOM testing...");
  }

  // Check document language attribute
  console.log("Document language attribute:", document.documentElement.lang);
}

// Test language switch via UI simulation
function testLanguageSwitch() {
  console.log("🔄 Testing language switch via UI...");

  // Find language switcher button
  const languageButton =
    document.querySelector('[data-testid="language-switcher"]') ||
    document.querySelector('button[aria-label*="Language"]') ||
    Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent.includes("🇺🇸") || btn.textContent.includes("🇻🇳"),
    );

  if (languageButton) {
    console.log("Language switcher found:", languageButton);

    // Simulate click
    languageButton.click();

    setTimeout(() => {
      // Look for dropdown menu
      const dropdown =
        document.querySelector('[role="menu"]') ||
        document.querySelector(".dropdown-menu") ||
        document.querySelector('[data-testid="language-dropdown"]');

      if (dropdown) {
        console.log("Language dropdown found:", dropdown);

        // Find Vietnamese option
        const viOption = Array.from(dropdown.querySelectorAll("*")).find(
          (el) =>
            el.textContent.includes("🇻🇳") ||
            el.textContent.includes("Tiếng Việt"),
        );

        if (viOption) {
          console.log("Vietnamese option found, clicking...", viOption);
          viOption.click();

          setTimeout(() => {
            console.log(
              "New document language:",
              document.documentElement.lang,
            );
            console.log(
              "New localStorage value:",
              localStorage.getItem("td_consulting_language"),
            );
          }, 500);
        }
      }
    }, 100);
  } else {
    console.log("Language switcher not found");
  }
}

// Run all tests
function runAllTests() {
  testLocalStorage();
  setTimeout(testTranslations, 100);
  setTimeout(testLanguageSwitch, 200);
}

// Export functions for manual testing
window.languageTest = {
  localStorage: testLocalStorage,
  translations: testTranslations,
  switchTest: testLanguageSwitch,
  runAll: runAllTests,
};

console.log("🎯 Language test functions available:");
console.log("- languageTest.localStorage()");
console.log("- languageTest.translations()");
console.log("- languageTest.switchTest()");
console.log("- languageTest.runAll()");

// Auto-run all tests
runAllTests();
