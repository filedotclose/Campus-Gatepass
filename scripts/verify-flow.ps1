
$baseUrl = "http://localhost:3000"

function Test-GatePassFlow {
    try {
        Write-Host "--- Starting Gate Pass Flow Test ---" -ForegroundColor Cyan

        # 1. Student Login
        Write-Host "[1/9] Student Login..." -NoNewline
        $studentLogin = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method Post -Body (@{email="student@test.com"; password="password123"} | ConvertTo-Json) -ContentType "application/json" -SessionVariable studentSession
        Write-Host " OK" -ForegroundColor Green

        # 2. Request Pass
        Write-Host "[2/9] Student requesting pass..." -NoNewline
        try {
            $passRequest = Invoke-RestMethod -Uri "$baseUrl/api/pass/request" -Method Post -Body (@{reason="Study session at library"} | ConvertTo-Json) -ContentType "application/json" -WebSession $studentSession
            $passId = $passRequest._id
            Write-Host " OK (PassID: $passId)" -ForegroundColor Green
        } catch {
            Write-Host " FAILED" -ForegroundColor Red
            $errContent = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errContent)
            $respBody = $reader.ReadToEnd()
            Write-Host "Server Response: $respBody" -ForegroundColor Yellow
            
            if ($respBody -like "*Active pass already exists*") {
                Write-Host "Found existing pass, attempting to continue with existing pass..." -ForegroundColor Gray
                $passes = Invoke-RestMethod -Uri "$baseUrl/api/pass" -Method Get -WebSession $studentSession
                $activePass = $passes | Where-Object { $_.status -ne "RETURNED" } | Select-Object -First 1
                $passId = $activePass._id
                Write-Host "Using existing PassID: $passId" -ForegroundColor Green
            } else {
                throw $_
            }
        }

        # 3. Warden Login
        Write-Host "[3/8] Warden Login..." -NoNewline
        $wardenLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body (@{email="warden@test.com"; password="password123"} | ConvertTo-Json) -ContentType "application/json" -SessionVariable wardenSession
        Write-Host " OK" -ForegroundColor Green

        # 4. Approve Pass
        Write-Host "[4/8] Warden approving pass..." -NoNewline
        $approve = Invoke-RestMethod -Uri "$baseUrl/api/pass/approve" -Method Post -Body (@{passId=$passId} | ConvertTo-Json) -ContentType "application/json" -WebSession $wardenSession
        Write-Host " OK (Status: $($approve.status))" -ForegroundColor Green

        # 5. Hostel Exit
        Write-Host "[5/8] Warden marking Hostel Exit..." -NoNewline
        $exit = Invoke-RestMethod -Uri "$baseUrl/api/pass/hostel-exit" -Method Post -Body (@{passId=$passId} | ConvertTo-Json) -ContentType "application/json" -WebSession $wardenSession
        Write-Host " OK" -ForegroundColor Green

        # 6. Librarian Login
        Write-Host "[6/8] Librarian Login..." -NoNewline
        $libLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body (@{email="librarian@test.com"; password="password123"} | ConvertTo-Json) -ContentType "application/json" -SessionVariable libSession
        Write-Host " OK" -ForegroundColor Green

        # 7. Library Entry
        Write-Host "[7/8] Librarian marking Library Entry..." -NoNewline
        $entry = Invoke-RestMethod -Uri "$baseUrl/api/pass/library-entry" -Method Post -Body (@{passId=$passId} | ConvertTo-Json) -ContentType "application/json" -WebSession $libSession
        Write-Host " OK (Status: $($entry.status))" -ForegroundColor Green

        # 8. Library Exit
        Write-Host "[8/8] Librarian marking Library Exit..." -NoNewline
        $libExit = Invoke-RestMethod -Uri "$baseUrl/api/pass/library-exit" -Method Post -Body (@{passId=$passId} | ConvertTo-Json) -ContentType "application/json" -WebSession $libSession
        Write-Host " OK" -ForegroundColor Green

        # 9. Hostel Re-entry
        Write-Host "[9/9] Warden marking Hostel Re-entry..." -NoNewline
        $reentry = Invoke-RestMethod -Uri "$baseUrl/api/pass/hostel-entry" -Method Post -Body (@{passId=$passId} | ConvertTo-Json) -ContentType "application/json" -WebSession $wardenSession
        Write-Host " OK (Status: $($reentry.status))" -ForegroundColor Green

        Write-Host "`n--- ALL TESTS PASSED! ---" -ForegroundColor BrightGreen
    } catch {
        Write-Host "`n--- TEST FAILED! ---" -ForegroundColor Red
        Write-Error $_
        exit 1
    }
}

Test-GatePassFlow
