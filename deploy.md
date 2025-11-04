# How to Deploy This React App to GitHub Pages

This guide explains how to deploy the LinkSprout React application itself to a GitHub Pages site. This is for developers working on the project, not for end-users deploying their generated static pages.

## Prerequisites

-   [Node.js and npm](https://nodejs.org/) installed on your machine.
-   [Git](https://git-scm.com/) installed.
-   A GitHub account.
-   A local clone of this repository.
-   A remote repository created on GitHub for this project.

---

### Step 1: Install `gh-pages`

The `gh-pages` package is a dev dependency that simplifies deploying the build output to a special `gh-pages` branch on GitHub, which can then be served as a live site.

In your project's root directory, run the following command in your terminal:
```bash
npm install gh-pages --save-dev
```

---

### Step 2: Configure `package.json`

You'll need to add a few properties to your `package.json` file to ensure the deployment works correctly.

1.  **Add a `homepage` property:**
    At the top level of `package.json`, add a `homepage` field. This tells the build process the root URL where the app will be hosted, which is crucial for resolving asset paths correctly on GitHub Pages.

    The format is: `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`

    For example, if your GitHub username is `janedoe` and your repository is named `linksprout`, it would look like this:
    ```json
    "homepage": "https://janedoe.github.io/linksprout/",
    ```

2.  **Add `deploy` scripts:**
    In the `scripts` section of your `package.json`, add two new scripts: `predeploy` and `deploy`.

    -   `predeploy`: This script automatically runs before `deploy`. It should contain the command to build your application for production.
    -   `deploy`: This script will run `gh-pages` to push your build folder to the `gh-pages` branch.

    Assuming your build command is `npm run build` and the output directory is `dist`, your `scripts` section should look like this:

    ```json
    "scripts": {
      "start": "...",
      "build": "...",
      "test": "...",
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    },
    ```
    > **Note:** If your build tool outputs to a different directory (e.g., `build` instead of `dist`), change the `-d dist` part accordingly (e.g., `gh-pages -d build`).

---

### Step 3: Configure Your GitHub Repository

1.  Navigate to your repository on GitHub.
2.  Click the **Settings** tab.
3.  In the left sidebar, click on **Pages**.
4.  Under "Build and deployment", set the **Source** to **"Deploy from a branch"**.
5.  Under "Branch", select the **`gh-pages`** branch and the **`/(root)`** folder, then click **Save**.

    > **Note:** The `gh-pages` branch might not exist yet. It will be created automatically the first time you deploy. If it's not available, you can proceed to the next step and come back here later to confirm the settings are correct.

---

### Step 4: Deploy the Application

Now you're ready to deploy. Simply run the following command from your project's root directory:

```bash
npm run deploy
```

This command will:
1.  First, run the `predeploy` script (`npm run build`), creating a production-ready, static build of your React app in the `dist` folder.
2.  Then, run the `deploy` script, which takes the contents of the `dist` folder and pushes it to the `gh-pages` branch of your remote repository.

---

### Step 5: Your Site is Live! 🎉

GitHub will now detect the changes on the `gh-pages` branch and deploy your site. This process usually takes a minute or two.

You can check the status of the deployment in the **Actions** tab of your repository.

Once it's complete, your LinkSprout application will be live at the URL you specified in the `homepage` property in `package.json`.
