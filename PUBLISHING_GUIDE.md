# Version Management & Publishing Guide

## 📌 Version Number Kaise Kaam Karta Hai

Semantic Versioning (SemVer) use karte hain: `MAJOR.MINOR.PATCH`

```
0.1.0
│ │ │
│ │ └─ PATCH: Bug fixes (0.1.0 → 0.1.1)
│ └─── MINOR: New features (0.1.0 → 0.2.0)
└───── MAJOR: Breaking changes (0.1.0 → 1.0.0)
```

## 🚀 Publishing Steps (NPM par package publish karne ke liye)

### 1️⃣ **Pehli Baar Publish Karna (First Time)**

```bash
# Step 1: NPM account login karo
npm login
# Username, password, aur email enter karo

# Step 2: Package build karo
npm run build

# Step 3: Check karo ki sab theek hai
npm pack --dry-run

# Step 4: Publish karo
npm publish --access public

# Success! 🎉
# Package live: https://www.npmjs.com/package/react-native-voice-text-live
```

### 2️⃣ **Update/New Version Publish Karna**

#### Method 1: NPM Commands (Recommended)

```bash
# Bug fix ke liye (0.1.0 → 0.1.1)
npm version patch

# New feature ke liye (0.1.0 → 0.2.0)
npm version minor

# Breaking changes ke liye (0.1.0 → 1.0.0)
npm version major

# Automatically:
# - package.json mein version update hoga
# - Git tag create hoga (agar git repo hai)
# - Commit hoga

# Fir publish karo
npm run build
npm publish
```

#### Method 2: Manual (Direct package.json edit)

```bash
# 1. package.json file open karo
# 2. "version" field change karo:
#    "version": "0.1.0"  →  "version": "0.2.0"

# 3. CHANGELOG.md update karo (neeche example hai)

# 4. Build aur publish
npm run build
npm publish
```

## 📝 CHANGELOG.md Update Karna

Har version ke liye CHANGELOG.md update karo:

```markdown
## [0.2.0] - 2026-01-20

### Added

- New awesome feature
- Another cool thing

### Fixed

- Bug fix description
- Performance improvement

### Changed

- Updated API behavior

## [0.1.0] - 2026-01-19

...previous version...
```

## 🔄 Complete Workflow (Step-by-step)

### Bug Fix Release (Patch)

```bash
# 1. Bug fix code likho
# 2. Test karo
# 3. Version bump
npm version patch -m "Fix: Description of bug fix"

# 4. CHANGELOG update
# Add bug fix details under new version

# 5. Build and publish
npm run build
npm publish

# 6. Git push (agar git use kar rahe ho)
git push
git push --tags
```

### New Feature Release (Minor)

```bash
# 1. Feature code likho
# 2. Documentation update karo
# 3. Test karo
# 4. Version bump
npm version minor -m "Feat: Description of new feature"

# 5. CHANGELOG update
# Add feature details under new version

# 6. Build and publish
npm run build
npm publish

# 7. Git push
git push
git push --tags
```

### Breaking Change Release (Major)

```bash
# 1. Breaking changes implement karo
# 2. Migration guide likho
# 3. Version bump
npm version major -m "Breaking: Description of changes"

# 4. CHANGELOG update with migration guide
# 5. Build and publish
npm run build
npm publish

# 6. Git push
git push
git push --tags
```

## 🎯 Quick Commands Reference

```bash
# Check current version
npm version

# See what will be published
npm pack --dry-run

# Publish specific tag
npm publish --tag beta

# Unpublish (24 hours ke andar)
npm unpublish react-native-voice-text-live@0.1.0

# View package info
npm view react-native-voice-text-live

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

## 🔒 Pre-publish Checklist

Before `npm publish`, ensure:

- [ ] ✅ `npm run build` successful
- [ ] ✅ `package.json` version updated
- [ ] ✅ `CHANGELOG.md` updated
- [ ] ✅ `README.md` has correct version references
- [ ] ✅ Tests pass (agar automated tests hain)
- [ ] ✅ Example app works
- [ ] ✅ Git committed (agar git use kar rahe ho)
- [ ] ✅ NPM login done (`npm whoami` se check karo)

## 🌟 Beta/Alpha Versions

Testing ke liye beta version:

```bash
# Beta version create karo
npm version 0.2.0-beta.1

# Beta tag se publish
npm publish --tag beta

# Users install kar sakte hain:
npm install react-native-voice-text-live@beta
```

## 📊 Version History Dekhna

```bash
# All published versions
npm view react-native-voice-text-live versions

# Latest version
npm view react-native-voice-text-live version

# Complete package info
npm view react-native-voice-text-live
```

## 🛠️ Useful Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major",
    "release": "npm run build && npm publish",
    "release:beta": "npm run build && npm publish --tag beta"
  }
}
```

Usage:

```bash
npm run version:patch
npm run release
```

## 🔐 Security

**.npmignore** file banao (optional):

```
# Don't publish these
example/
.github/
*.log
.DS_Store
src/
tsconfig.json
```

Only built files publish hongi (`build/` folder).

## 🎓 Pro Tips

1. **Automatic Version Bump**: Git hooks use karo
2. **Changelog Generator**: `standard-version` package use karo
3. **Pre-publish Tests**: `prepublishOnly` script use karo
4. **Version Tags**: Git tags automatically create hote hain
5. **Rollback**: Agar galti ho, newer version publish karo (old unpublish mat karo)

## 📱 Users Ko Update Kaise Milega

Users apne project mein update karenge:

```bash
# Latest version install
npm install react-native-voice-text-live@latest
# or
yarn upgrade react-native-voice-text-live

# Specific version install
npm install react-native-voice-text-live@0.2.0
```

## ⚠️ Important Notes

1. **24-hour Rule**: NPM package 24 hours ke baad unpublish nahi kar sakte
2. **Version Skip**: Kabhi bhi version backwards nahi ja sakta (0.2.0 → 0.1.0 ❌)
3. **Breaking Changes**: Major version change mein migration guide zaroor do
4. **Testing**: Production mein publish karne se pehle thoroughly test karo

---

## 🚀 Your First Publish

```bash
# 1. Login
npm login

# 2. Build
npm run build

# 3. Publish
npm publish --access public

# Done! 🎉
```

Package live hone ke baad users install kar sakte hain:

```bash
npm install react-native-voice-text-live
```
