import { evaluate } from "mathjs";

import logger from "./../logger.js";

export const option = "-m, --math [expression]";
export const optionDef = `Math mode
\n
• Handles numeric seprators
  12,000 + 4,000     =>    12,400
  12_000 + 4_000     =>    12_400

• Handles unit converstion expressions
  12.7 cm to inch      =>    5 inch

• Complex expressions
  "sin(45 deg) ^ 2"    =>    0.5
  "9 / 3 + 2i"         =>    3 + 2i
  "det([-1, 2; 3, 1])" =>     -7
`;

export const logic = async (args) => {
  let mathResult;

  try {
    let mathString = args.join(" ");
    const hasCommas = mathString.replaceAll(",", "").length < mathString.length;
    const hasUnderscores =
      mathString.replaceAll("_", "").length < mathString.length;
    mathString = mathString.replaceAll(",", "").replaceAll("_", "");
    mathResult = evaluate(mathString);

    if (hasUnderscores) {
      mathResult = mathResult.toLocaleString().replace(/,/g, "_");
    } else if (hasCommas) {
      mathResult = mathResult.toLocaleString();
    }

    logger.branded(`${mathResult}`);
  } catch {
    logger.error("Unable evaluate the provided equation");
  }
};
