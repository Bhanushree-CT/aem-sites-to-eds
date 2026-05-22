# Fix GitHub Push 403 Permission Denied

## Problem

The error `remote: permission to bhanushree-ct/aem-sites-to-eds.git denied` with a 403 status indicates that the personal access token (PAT) being used either:

1. **Has expired** — GitHub PATs have expiration dates
2. **Lacks required scopes** — The token needs `repo` scope for push access
3. **Is cached/stale** — Git credential manager is using an old token
4. **Wrong account** — The token belongs to a different GitHub account than the repo owner

## Diagnosis Steps

- [ ] Verify which credential is being used by Git
- [ ] Check if the token has `repo` scope on GitHub
- [ ] Check if the token has expired
- [ ] Clear cached credentials if stale
- [ ] Re-authenticate with a valid token

## Fix Instructions

### Option A: Generate a new Personal Access Token (recommended)

1. Go to **GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens** (or classic tokens)
2. Generate a new token with:
   - **Repository access:** `bhanushree-ct/aem-sites-to-eds`
   - **Permissions:** Contents (Read and Write), Metadata (Read)
   - Or for classic tokens: check the `repo` scope
3. Copy the new token

### Option B: Clear cached credentials and re-push

Run these commands in your terminal:

```bash
# Clear any cached credentials for github.com
git credential reject <<EOF
protocol=https
host=github.com
EOF

# Push again — Git will prompt for username and token
git push origin main
```

When prompted:
- **Username:** `bhanushree-ct`
- **Password:** paste your new PAT (not your GitHub password)

### Option C: Set token directly in the remote URL (quick fix)

```bash
git remote set-url origin https://bhanushree-ct:<YOUR_PAT>@github.com/bhanushree-ct/aem-sites-to-eds.git
git push origin main
```

> ⚠️ This stores the token in `.git/config` — use only for quick testing, not long-term.

### Option D: Switch to SSH (avoids token expiry issues)

```bash
# Set remote to SSH
git remote set-url origin git@github.com:bhanushree-ct/aem-sites-to-eds.git

# Ensure your SSH key is added to GitHub (Settings → SSH keys)
git push origin main
```

## Checklist

- [ ] Verify current token hasn't expired (GitHub → Settings → Developer Settings → Tokens)
- [ ] Ensure token has `repo` scope or Contents write permission
- [ ] Clear stale cached credentials
- [ ] Re-authenticate with valid token
- [ ] Retry `git push origin main`
- [ ] Confirm push succeeds

## Most Likely Cause

Since you're using HTTPS with a token and getting a 403, the most common cause is an **expired token** or a **fine-grained token missing the Contents (write) permission**. Generating a fresh token with the correct scopes (Option A) and clearing the credential cache (Option B) will resolve this in most cases.
