module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
    ],
    "rules": {
	"react/jsx-filename-extension": "off",
	"import/prefer-default-export": "off",
    },
    "globals": { "fetch": false }
};
