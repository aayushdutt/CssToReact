function cssToReactStyle(css) {
  // Create a new object to hold the React styles
  const reactStyles = {};

  // Split the CSS styles into individual declarations
  const declarations = css.split(";");

  // Loop through the declarations
  declarations.forEach((declaration) => {
    // Split the declaration into the property and value
    const [property, value] = declaration.split(":");

    // If there is no property or value, skip this declaration
    if (!property || !value) return;

    // Remove any whitespace from the property and value
    const trimmedProperty = property.trim();
    const trimmedValue = value.trim();

    const camelProperty = trimmedProperty.replace(/-([a-z])/g, (match, p1) =>
      p1.toUpperCase()
    );

    // Add the property and value to the React styles object
    reactStyles[camelProperty] = trimmedValue;
  });

  return reactStyles;
}

function reactStyleToCss(reactStyles) {
  // Create a new array to hold the CSS declarations
  const declarations = [];

  // Loop through the React styles
  for (const property in reactStyles) {
    // Get the value of the property
    const value = reactStyles[property];
    // Append 'px' if the type of value is number
    const pxValue = typeof value === "number" ? `${value}px` : value;

    // Convert the property from camel case to kebab case
    const kebabProperty = property
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();

    // Add the property and value to the declarations array
    declarations.push(`${kebabProperty}: ${pxValue}`);
  }

  // Join the declarations into a single string of CSS
  return declarations.join(";\n") + ";";
}

const cssTextarea = document.getElementById("css-textarea");
const reactStylesTextarea = document.getElementById("react-styles-textarea");

cssTextarea.addEventListener("input", () => {
  // Get the value of the CSS textarea
  const css = cssTextarea.value;
  if (!css) return reactStylesTextarea.value = "";
  // Convert the CSS to React styles
  const reactStyles = cssToReactStyle(css);

  // Remove the double quotes around object properties
  const processedString = JSON.stringify(reactStyles, null, 2).replace(
    /"([a-zA-Z0-9]+)":/g,
    "$1:"
  );
  // Update the value of the React styles textarea
  reactStylesTextarea.value = processedString;
});

reactStylesTextarea.addEventListener("input", () => {
  // Get the value of the React styles textarea
  const reactStyles = reactStylesTextarea.value;
  const preprocessedString = reactStyles
    .replace(/([a-zA-Z0-9]+):/g, '"$1":')
    .replace(/,\s*}$/, "}")
    .replace(/^([^\{\}]+)/, "{$1}")
    .replace(/'([^']*)'/g, '"$1"');

  // Convert the string to an object
  const styles = JSON.parse(preprocessedString);

  // Convert the React styles to CSS
  const css = reactStyleToCss(styles);

  // Update the value of the CSS textarea
  cssTextarea.value = css;
});
