## helpwave eslint config
This is our recommended set for linting. It is created for **eslint version 9** using the `eslint.config.js` config format.

### Configs Format
**recommended**: This is our default config for react (jsx or tsx) projects.

**nextExtension**: This config extends the recommendations with additional configs for Next.js.
```
{
  recommended: [
    { 
      plugins: { [key: string]: plugin },
      rules: { string: string }
    }       
  ]
  nextExtension: [
    { 
      plugins: { [key: string]: plugin },
      rules: { string: string }
    }       
  ]
}
```

### Usage
**Simple**
```javascript
// eslint.config.js file
import configs from '@helpwave/eslint-config'

export default configs.recommended // or configs.nextExtension
```

**Extendable**
```javascript
// eslint.config.js file
import configs from '@helpwave/eslint-config'

export default [
  // Your other configs here
  ...configs.recommended, // or configs.nextExtension
  {
    // Your plugins or rule overwrites
    plugins: {
      
    },
    rules: {
      
    }
  }
] 
```
