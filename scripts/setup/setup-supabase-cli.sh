#!/bin/bash
set -e

echo "=== Supabase CLI Setup ==="

# Check if Homebrew is available (macOS)
if command -v brew &> /dev/null; then
  echo "Installing Supabase CLI via Homebrew..."
  brew install supabase/tap/supabase
elif command -v npm &> /dev/null; then
  echo "Installing Supabase CLI via npm..."
  npm install -g supabase
else
  echo "Error: Please install Homebrew or npm first"
  exit 1
fi

# Verify installation
if command -v supabase &> /dev/null; then
  echo "✓ Supabase CLI installed: $(supabase --version)"
else
  echo "✗ Installation failed"
  exit 1
fi

echo ""
echo "=== Next Steps ==="
echo "1. Run: supabase login"
echo "2. Run: supabase link --project-ref YOUR_PROJECT_ID"
echo "   (Find project ID in Supabase Dashboard > Project Settings > General)"
echo ""
