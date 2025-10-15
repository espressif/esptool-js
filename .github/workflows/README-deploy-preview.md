# GitHub Pages Preview Deployments

This workflow (`deploy-preview.yml`) automatically builds and deploys preview versions of the examples application to GitHub Pages for every branch push and pull request.

## How it works

### Triggering Events
- **Pull Requests**: Triggers on `opened`, `synchronize`, and `reopened` events
- **Branch Pushes**: Triggers on pushes to any branch except `main` (which has its own deployment workflow)

### Deployment Paths

The workflow deploys to the `gh-pages` branch using the following path structure:

- **Pull Requests**: `pr/<pr-number>-<short-sha>/`
  - Example: `pr/42-abc1234/`
  
- **Branches**: `branch/<safe-branch-name>-<short-sha>/`
  - Example: `branch/feature_new-ui-a7b8c9d/`

### Base URL Configuration

The workflow automatically:
1. Fetches the GitHub Pages URL using the `gh` CLI
2. Falls back to `https://<owner>.github.io/<repo>` if Pages isn't configured
3. Builds the examples app with the correct base href using Parcel's `--public-url` option
4. All asset paths are absolute URLs pointing to the correct subdirectory

### Features

- ✅ **Automatic PR Comments**: Posts a comment on PRs with the preview URL
- ✅ **Branch Sanitization**: Safely handles branch names with special characters
- ✅ **Incremental Deployments**: Each commit creates a new deployment with a unique SHA
- ✅ **Job Summaries**: Provides deployment URL in GitHub Actions summary
- ✅ **gh-pages Auto-Init**: Creates the gh-pages branch if it doesn't exist

## Usage

### For Pull Requests
1. Open a pull request
2. Wait for the workflow to complete
3. Click the preview URL in the automated comment
4. Each new commit will update the deployment (with a new SHA in the path)

### For Branch Pushes
1. Push commits to any branch (except `main`)
2. Check the workflow run for the deployment URL in the summary
3. Access your preview at: `https://<owner>.github.io/<repo>/branch/<branch-name>-<sha>/`

## Permissions Required

The workflow needs the following permissions:
- `contents: write` - To push to the gh-pages branch
- `pull-requests: write` - To comment on pull requests
- `pages: read` - To fetch the GitHub Pages URL

## Build Process

1. Install root dependencies and build the library
2. Install example app dependencies
3. Clean previous builds
4. Generate API documentation
5. Build example app with Parcel using custom `--public-url`
6. Deploy to gh-pages branch in the appropriate subdirectory

## Customization

### Changing the Deployment Path Format

Edit the "Determine deployment path" step in `.github/workflows/deploy-preview.yml`:

```yaml
- name: Determine deployment path
  id: deployment-path
  run: |
    # Modify DEPLOY_DIR and BASE_HREF variables here
```

### Changing Build Configuration

The build uses Parcel with the following options:
- `--no-optimize`: Faster builds, easier debugging
- `--public-url`: Dynamic base URL for assets

To modify, edit the "Build example with base href" step.

## Troubleshooting

### Preview URL returns 404
- Ensure GitHub Pages is enabled for the repository
- Check that the gh-pages branch exists
- Verify the deployment path in the workflow logs

### Assets not loading
- Check the browser console for failed requests
- Verify the base href is correct in the deployed HTML
- Ensure all asset paths are absolute URLs

### Workflow fails to push
- Check repository permissions
- Verify the `GITHUB_TOKEN` has write access to contents
