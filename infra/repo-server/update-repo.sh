#!/usr/bin/env bash
# a) Purpose: Script to add new packages to the repository database.
# c) Install/Test: Run `./update-repo.sh /path/to/new-package.pkg.tar.zst`
# d) Open decisions: Assumes the repo name is 'ulo-core'.

REPO_DIR="repo-data/x86_64"
REPO_DB="$REPO_DIR/ulo-core.db.tar.zst"

if [ -z "$1" ]; then
    echo "Usage: $0 <package.pkg.tar.zst>"
    exit 1
fi

PACKAGE_PATH="$1"
PACKAGE_NAME=$(basename "$PACKAGE_PATH")

echo "Adding $PACKAGE_NAME to Ulo Repo..."

# Ensure directory exists
mkdir -p "$REPO_DIR"

# Copy the package to the repo directory
cp "$PACKAGE_PATH" "$REPO_DIR/"

# Update the database
cd "$REPO_DIR" || exit 1
repo-add "$REPO_DB" "$PACKAGE_NAME"

echo "Repository updated successfully!"
