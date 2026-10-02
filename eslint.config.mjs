import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

// Ported from tslint.json when TSLint was retired (#2227). Formatting is prettier's job, so
// eslint-config-prettier switches off every stylistic rule. The library uses `any`, `{}`,
// `Function` and `self = this` on purpose in its type machinery and hot paths, so the
// typescript-eslint recommended rules that would flag those are off here rather than
// littering src with disable comments.
export default tseslint.config(
    {
        ignores: ["dist/**", "lib/**", "node_modules/**", "website/**", "docs/**", "coverage/**", "api/**"]
    },
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ["**/*.ts"],
        rules: {
            // equivalents of the old tslint.json rules
            "no-debugger": "error",
            "no-eval": "error",
            "no-var": "error",
            eqeqeq: ["error", "always", { null: "ignore" }],
            "no-fallthrough": "error",
            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": "error",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": "error",
            "@typescript-eslint/naming-convention": ["error", { selector: "class", format: ["PascalCase"] }],

            // recommended rules the codebase deliberately does not follow
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-wrapper-object-types": "off",
            "@typescript-eslint/no-this-alias": "off",
            "prefer-rest-params": "off",
            "prefer-spread": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { args: "none", caughtErrors: "none", ignoreRestSiblings: true, varsIgnorePattern: "^_" }
            ]
        }
    }
)
