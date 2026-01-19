# GitHub Installation Guide

## 🎯 GitHub Se Package Install Karna (NPM ki zarurat nahi)

### ✅ **Setup Steps (One Time)**

#### 1️⃣ **Build Folder Ko Git Mein Include Karo**

Normally `build/` folder gitignore rehta hai, but GitHub installation ke liye zaruri hai.

**Option A: Build folder commit karo (Recommended)**

```bash
# .gitignore se build/ remove karo (agar hai toh)
# Ya fir .gitignore mein comment karo:
# build/  → # build/

# Build karo
npm run build

# Git add karo
git add build/
git commit -m "Add build files for GitHub installation"
```

**Option B: GitHub Actions use karo (Advanced)**

- Automatic build on push
- CI/CD setup required

---

### 2️⃣ **GitHub Repository Setup**

```bash
# Git initialize karo (agar nahi kiya hai)
git init

# Remote add karo
git remote add origin https://github.com/SikendarKumarJavascript/react-native-voice-text-live.git

# Files add karo
git add .

# Commit karo
git commit -m "Initial commit: Complete package with STT and TTS"

# Push karo
git push -u origin main
```

**Important Files to Commit:**

- ✅ `build/` folder (compiled code)
- ✅ `android/` folder (native Android code)
- ✅ `ios/` folder (native iOS code)
- ✅ `src/` folder (source code)
- ✅ `package.json`
- ✅ `README.md`
- ✅ All documentation files

---

## 📦 Users Install Kaise Karenge

### **Method 1: Direct GitHub URL** (Recommended)

```bash
# Latest main branch se install
npm install github:SikendarKumarJavascript/react-native-voice-text-live

# Ya yarn se
yarn add github:SikendarKumarJavascript/react-native-voice-text-live
```

### **Method 2: Git URL**

```bash
npm install git+https://github.com/SikendarKumarJavascript/react-native-voice-text-live.git

# Ya SSH se
npm install git+ssh://git@github.com:SikendarKumarJavascript/react-native-voice-text-live.git
```

### **Method 3: Specific Version/Tag**

```bash
# Specific tag se install
npm install github:SikendarKumarJavascript/react-native-voice-text-live#v0.1.0

# Specific branch se install
npm install github:SikendarKumarJavascript/react-native-voice-text-live#dev

# Specific commit se install
npm install github:SikendarKumarJavascript/react-native-voice-text-live#abc1234
```

---

## 🏷️ **Versioning with Git Tags**

### Create Release Tags

```bash
# Version 0.1.0 release
git tag -a v0.1.0 -m "Release v0.1.0: Initial release with STT and TTS"
git push origin v0.1.0

# Version 0.2.0 release
git tag -a v0.2.0 -m "Release v0.2.0: Bug fixes and improvements"
git push origin v0.2.0

# List all tags
git tag
```

### Delete Tag (if needed)

```bash
# Local tag delete
git tag -d v0.1.0

# Remote tag delete
git push origin --delete v0.1.0
```

---

## 📝 **README.md Update Karo**

Installation section mein GitHub link add karo:

```markdown
## Installation

### From GitHub (Recommended)

Install directly from GitHub repository:

\`\`\`bash
npm install github:SikendarKumarJavascript/react-native-voice-text-live

# or

yarn add github:SikendarKumarJavascript/react-native-voice-text-live
\`\`\`

### Specific Version

\`\`\`bash
npm install github:SikendarKumarJavascript/react-native-voice-text-live#v0.1.0
\`\`\`

### From NPM (Coming Soon)

\`\`\`bash
npm install react-native-voice-text-live
\`\`\`
```

---

## 🔄 **Update Process (New Version Release)**

### When You Want to Release a New Version:

```bash
# 1. Code changes karo aur test karo

# 2. package.json mein version update karo
# "version": "0.1.0" → "version": "0.2.0"

# 3. CHANGELOG.md update karo

# 4. Build karo
npm run build

# 5. Commit karo
git add .
git commit -m "Release v0.2.0: Added new features"

# 6. Tag create karo
git tag -a v0.2.0 -m "Release v0.2.0"

# 7. Push karo (code + tags)
git push origin main
git push origin v0.2.0

# Done! Users can now install v0.2.0
```

### Users Update Kaise Karenge:

```bash
# Latest version update
npm install github:SikendarKumarJavascript/react-native-voice-text-live@latest

# Specific version update
npm install github:SikendarKumarJavascript/react-native-voice-text-live#v0.2.0

# package.json mein manual update
# "react-native-voice-text-live": "github:SikendarKumarJavascript/react-native-voice-text-live#v0.2.0"
```

---

## 📂 **`.gitignore` Configuration**

**Important**: Build folder commit karna hai, so .gitignore update karo:

```gitignore
# Node modules
node_modules/
npm-debug.log
yarn-error.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Build (Comment this out for GitHub installation)
# build/

# Example app specific
example/node_modules/
example/.expo/
example/android/build/
example/android/.gradle/
example/ios/Pods/

# Misc
*.log
.env
```

---

## 🎯 **Complete Workflow Example**

### Initial Setup:

```bash
# 1. Navigate to your project
cd /Volumes/Drive/Usages/sikendar/expo-custom-speech

# 2. Build
npm run build

# 3. Git setup
git init
git add .
git commit -m "Initial commit"

# 4. Add GitHub remote
git remote add origin https://github.com/SikendarKumarJavascript/react-native-voice-text-live.git

# 5. Push
git push -u origin main

# 6. Create release tag
git tag -a v0.1.0 -m "Release v0.1.0: Initial release"
git push origin v0.1.0
```

### For Updates:

```bash
# 1. Make changes
# ... code changes ...

# 2. Update version in package.json
# 3. Update CHANGELOG.md
# 4. Build
npm run build

# 5. Commit and push
git add .
git commit -m "Release v0.2.0: New features"
git push origin main

# 6. Create new tag
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

---

## 📖 **User Documentation**

Create a section in README for users:

```markdown
## Installation from GitHub

This package can be installed directly from GitHub:

\`\`\`bash

# Install latest version

npm install github:SikendarKumarJavascript/react-native-voice-text-live

# Install specific version

npm install github:SikendarKumarJavascript/react-native-voice-text-live#v0.1.0
\`\`\`

### Available Versions

- \`v0.1.0\` - Initial release (STT + TTS)
- \`main\` - Latest development version

For specific version, check [Releases](https://github.com/SikendarKumarJavascript/react-native-voice-text-live/releases)
```

---

## ✅ **Checklist Before Push**

- [ ] ✅ `npm run build` successful
- [ ] ✅ `build/` folder committed
- [ ] ✅ `android/` and `ios/` folders committed
- [ ] ✅ `package.json` version updated
- [ ] ✅ `CHANGELOG.md` updated
- [ ] ✅ `README.md` has GitHub installation instructions
- [ ] ✅ `.gitignore` configured properly
- [ ] ✅ All native code files included
- [ ] ✅ Documentation files committed

---

## 🚀 **Quick Commands**

### First Time Setup:

```bash
npm run build
git add build/ android/ ios/ src/ package.json README.md
git commit -m "Complete package ready"
git push origin main
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
```

### Update Release:

```bash
npm run build
git add .
git commit -m "v0.2.0"
git tag -a v0.2.0 -m "v0.2.0"
git push origin main --tags
```

### Test Installation:

```bash
# Separate project mein test karo
cd ~/test-project
npm install github:SikendarKumarJavascript/react-native-voice-text-live
```

---

## 🔍 **Troubleshooting**

### Issue: "Cannot find module"

**Solution**: Build folder commit kiya hai? Check karo:

```bash
git ls-files build/
```

### Issue: "Permission denied"

**Solution**: SSH key setup karo ya HTTPS use karo

### Issue: Old version install ho raha hai

**Solution**: Cache clear karo:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 💡 **Pro Tips**

1. **Releases Page Use Karo**: GitHub Releases create karo visual changelog ke liye
2. **Semantic Versioning**: Hamesha SemVer follow karo
3. **Build Before Commit**: Kabhi bhi outdated build commit mat karo
4. **Test Locally**: Publish se pehle local test karo
5. **GitHub Actions**: Automatic build/test setup karo (optional)

---

## 🎓 **GitHub vs NPM**

| Feature          | GitHub   | NPM       |
| ---------------- | -------- | --------- |
| Setup Time       | Fast ✅  | Slower    |
| Version Control  | Git Tags | Semantic  |
| Discovery        | Limited  | Better    |
| Private Packages | Free ✅  | Paid      |
| Download Speed   | Good     | Better    |
| Auto Updates     | Manual   | Automatic |

**Recommendation**: Start with GitHub, later publish to NPM for better discoverability! 🚀
