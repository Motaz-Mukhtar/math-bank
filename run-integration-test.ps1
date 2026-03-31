# PowerShell script to run the integration test
Set-Location $PSScriptRoot
& node ./node_modules/vitest/vitest.mjs run src/components/admin/AdminPanelCRUD.integration.test.tsx
