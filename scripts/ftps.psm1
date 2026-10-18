#Requires -Version 7.0

function Get-FtpsDestination {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string] $FtpHost,

        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string] $RemotePath
    )

    if ([Uri]::CheckHostName($FtpHost) -notin @([UriHostNameType]::Dns, [UriHostNameType]::IPv4)) {
        throw 'FtpHost must be a hostname or IPv4 address, without a scheme, port, or path.'
    }

    $remoteSegments = $RemotePath.Trim().Trim('/').Split('/')
    if ($RemotePath -match '[\\\r\n]' -or $remoteSegments -contains '' -or
        $remoteSegments -contains '.' -or $remoteSegments -contains '..') {
        throw 'RemotePath must be a nonempty FTP directory path without backslashes or dot segments.'
    }
    $encodedRemotePath = ($remoteSegments | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/'
    return "ftp://$FtpHost/$encodedRemotePath/"
}

function Get-CompletedImageHashes {
    param([AllowEmptyString()][string] $Json)

    if ([string]::IsNullOrWhiteSpace($Json)) {
        Write-Warning 'Image state is empty; uploading all images to rebuild it.'
        return
    }
    try {
        $state = ConvertFrom-Json -InputObject $Json -AsHashtable -ErrorAction Stop
    }
    catch [System.ArgumentException] {
        Write-Warning 'Image state is invalid JSON; uploading all images to rebuild it.'
        return
    }
    if ($state -isnot [Collections.IDictionary] -or
        $state['version'] -isnot [long] -or $state['version'] -ne 1 -or
        $state['complete'] -isnot [bool] -or
        $state['images'] -isnot [Collections.IDictionary]) {
        Write-Warning 'Image state has an unsupported format; uploading all images to rebuild it.'
        return
    }
    foreach ($entry in $state['images'].GetEnumerator()) {
        if ($entry.Key -isnot [string] -or [string]::IsNullOrEmpty($entry.Key) -or
            $entry.Value -isnot [string] -or $entry.Value -notmatch '^[0-9a-fA-F]{64}$') {
            Write-Warning 'Image state contains invalid hashes; uploading all images to rebuild it.'
            return
        }
    }
    if (-not $state['complete']) {
        Write-Warning 'Previous image upload was incomplete; uploading all images to rebuild state.'
        return
    }
    return ,$state['images']
}

function Send-FtpsDirectory {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string] $SourcePath,

        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string] $FtpHost,

        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string] $RemotePath,

        [PSCredential] $Credential,

        [string] $PublishLast,

        [switch] $SkipUnchangedImages,

        [ValidateNotNullOrEmpty()]
        [string] $EnvFilePath = (Join-Path (Split-Path -Parent $PSScriptRoot) '.env')
    )

    $ErrorActionPreference = 'Stop'
    $PSNativeCommandUseErrorActionPreference = $false
    $OutputEncoding = [Text.UTF8Encoding]::new($false)
    $destination = Get-FtpsDestination -FtpHost $FtpHost -RemotePath $RemotePath

    if (-not (Test-Path -LiteralPath $SourcePath -PathType Container)) {
        throw "Upload source directory not found: $SourcePath."
    }
    $source = Get-Item -LiteralPath $SourcePath
    $buildItems = @($source) + @(Get-ChildItem -LiteralPath $SourcePath -Recurse -Force)
    if (@($buildItems | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }).Count) {
        throw 'The build contains symbolic links or junctions. Refusing to upload files outside the build.'
    }
    $imageStateName = '.kk67-image-state.json'
    if (Test-Path -LiteralPath (Join-Path $source.FullName $imageStateName)) {
        throw "$imageStateName is reserved for deployment state and must not appear in the build."
    }

    $lastPath = $null
    if (-not [string]::IsNullOrEmpty($PublishLast)) {
        if ($PublishLast -in @('.', '..') -or $PublishLast -match '[\\/\r\n]') {
            throw 'PublishLast must be a filename in the upload source directory.'
        }
        $lastPath = Join-Path $source.FullName $PublishLast
        if (-not (Test-Path -LiteralPath $lastPath -PathType Leaf)) {
            throw "PublishLast file not found: $lastPath."
        }
    }

    # Publish the entry point only after its dependencies have uploaded successfully.
    $files = @($buildItems | Where-Object { -not $_.PSIsContainer } |
        Sort-Object @{ Expression = { $_.FullName -eq $lastPath } }, FullName)
    if ($files.Count -eq 0) {
        throw 'The upload source contains no files. Nothing was uploaded.'
    }

    Write-Host "Source: $($source.FullName)"
    if (-not $PSCmdlet.ShouldProcess($destination,
        "Upload up to $($files.Count) files using explicit FTPS (overwrite matching files; never delete)")) {
        return
    }

    if ($null -eq $Credential -and $PSBoundParameters.ContainsKey('EnvFilePath') -and
        -not (Test-Path -LiteralPath $EnvFilePath -PathType Leaf)) {
        throw "Credentials file not found: $EnvFilePath. Nothing was uploaded."
    }
    $curl = Get-Command curl -CommandType Application -ErrorAction Stop |
        Select-Object -First 1
    if ($null -eq $Credential -and (Test-Path -LiteralPath $EnvFilePath -PathType Leaf)) {
        $node = Get-Command node -ErrorAction Stop
        $readEnv = @'
const { readFileSync } = require('node:fs');
const { parseEnv } = require('node:util');
if (typeof parseEnv !== 'function') {
    console.error('Reading saved FTP credentials requires Node.js 20.12 or newer.');
    process.exit(1);
}
const values = parseEnv(readFileSync(process.argv[1], 'utf8'));
process.stdout.write(JSON.stringify({
    username: values.FTP_USERNAME ?? '',
    password: values.FTP_PASSWORD ?? ''
}));
'@
        $savedCredentialJson = & $node --input-type=commonjs -e $readEnv $EnvFilePath
        if ($LASTEXITCODE -ne 0) {
            throw 'Could not read FTP credentials from the credentials file. Nothing was uploaded.'
        }
        $savedCredential = ConvertFrom-Json -InputObject $savedCredentialJson
        $hasUsername = -not [string]::IsNullOrEmpty($savedCredential.username)
        $hasPassword = -not [string]::IsNullOrEmpty($savedCredential.password)
        if ($hasUsername -ne $hasPassword) {
            throw 'Set both FTP_USERNAME and FTP_PASSWORD in the credentials file, or leave both empty to use the credential prompt.'
        }
        if ($hasUsername) {
            $securePassword = ConvertTo-SecureString $savedCredential.password -AsPlainText -Force
            $Credential = [PSCredential]::new($savedCredential.username, $securePassword)
        }
    }
    if ($null -eq $Credential) {
        $Credential = Get-Credential -Message "FTP credentials for $FtpHost"
    }
    if ($null -eq $Credential -or [string]::IsNullOrWhiteSpace($Credential.UserName) -or
        $Credential.UserName -match '[:\r\n]') {
        throw 'An FTP credential with a nonempty username without colons or newlines is required.'
    }

    # Feed credentials through stdin, not process arguments or a temporary file.
    $userPassword = '{0}:{1}' -f $Credential.UserName, $Credential.GetNetworkCredential().Password
    $escapedCredential = $userPassword.Replace('\', '\\').Replace('"', '\"')
    $escapedCredential = $escapedCredential.Replace("`r", '\r').Replace("`n", '\n')
    $escapedCredential = $escapedCredential.Replace("`t", '\t').Replace("`v", '\v')
    $curlConfig = 'user = "' + $escapedCredential + '"'
    $curlOptions = @(
        '--disable', '--config', '-', '--silent', '--show-error',
        '--ssl-reqd', '--proto', '=ftp', '--globoff',
        '--connect-timeout', '15', '--max-time', '1800'
    )

    function Invoke-Ftp {
        param(
            [string] $Operation,
            [string[]] $CurlArguments
        )

        $curlConfig | & $curl @curlOptions @CurlArguments | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "$Operation failed (curl exit code $LASTEXITCODE). Deployment stopped; uploaded files are not rolled back."
        }
    }

    # Check the existing destination before allowing creation of asset subdirectories.
    Invoke-Ftp -Operation 'FTP login or destination check' -CurlArguments @(
        '--list-only', '--url', $destination
    )

    $imageExtensions = @(
        '.apng', '.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg',
        '.svg', '.tif', '.tiff', '.webp', '.png'
    )
    $imagePaths = [Collections.Generic.Dictionary[string, string]]::new([StringComparer]::Ordinal)
    $imageHashes = [Collections.Generic.Dictionary[string, string]]::new([StringComparer]::Ordinal)
    $unchangedImages = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    $imageStateUrl = "$destination$imageStateName"
    $imageStatePath = $null

    function Write-ImageState {
        param([bool] $Complete)

        $state = [ordered]@{
            version = 1
            complete = $Complete
            images = $imageHashes
        } | ConvertTo-Json -Depth 3 -Compress
        [IO.File]::WriteAllText($imageStatePath, $state, [Text.UTF8Encoding]::new($false))
        $operation = if ($Complete) { 'Image-state commit' } else { 'Image-state invalidation' }
        Invoke-Ftp -Operation $operation -CurlArguments @(
            '--upload-file', $imageStatePath, '--url', $imageStateUrl
        )
    }

    try {
        foreach ($file in $files) {
            if ($file.Extension.ToLowerInvariant() -in $imageExtensions) {
                $relativePath = [IO.Path]::GetRelativePath($source.FullName, $file.FullName).
                    Replace([IO.Path]::DirectorySeparatorChar, [char] '/')
                $imagePaths[$file.FullName] = $relativePath
                $imageHashes[$relativePath] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).
                    Hash.ToLowerInvariant()
            }
        }
        if ($imageHashes.Count -gt 0) {
            $imageStatePath = [IO.Path]::GetTempFileName()
            if ($SkipUnchangedImages) {
                $downloadOutput = @(
                    $curlConfig | & $curl @curlOptions --output $imageStatePath --url $imageStateUrl 2>&1
                )
                if ($LASTEXITCODE -eq 0) {
                    $savedImages = Get-CompletedImageHashes -Json (
                        [IO.File]::ReadAllText($imageStatePath, [Text.Encoding]::UTF8)
                    )
                    if ($null -ne $savedImages) {
                        foreach ($entry in $imagePaths.GetEnumerator()) {
                            if ($savedImages.Contains($entry.Value) -and
                                $savedImages[$entry.Value] -eq $imageHashes[$entry.Value]) {
                                $unchangedImages.Add($entry.Key) | Out-Null
                                Write-Host "Skipping unchanged image $($entry.Value)"
                            }
                        }
                    }
                }
                elseif ($LASTEXITCODE -eq 78) {
                    Write-Host 'Image state not found; uploading all images to initialize it.'
                }
                else {
                    throw "Image-state download failed (curl exit code $LASTEXITCODE): $($downloadOutput -join ' '). Nothing was uploaded."
                }
            }
        }
        $filesToUpload = @($files | Where-Object { -not $unchangedImages.Contains($_.FullName) })
        $needsImageState = $imagePaths.Count -gt $unchangedImages.Count
        if ($needsImageState) {
            # A partial image write must never leave a trusted baseline for the next run.
            Write-ImageState -Complete $false
        }
        foreach ($file in $filesToUpload) {
            if ($needsImageState -and $file.FullName -eq $lastPath -and
                -not $imagePaths.ContainsKey($file.FullName)) {
                Write-ImageState -Complete $true
                $needsImageState = $false
            }
            $relativePath = [IO.Path]::GetRelativePath($source.FullName, $file.FullName)
            $encodedPath = ($relativePath.Split([IO.Path]::DirectorySeparatorChar) |
                ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/'
            Write-Host "Uploading $relativePath"
            Invoke-Ftp -Operation "Upload of $relativePath" -CurlArguments @(
                '--ftp-create-dirs', '--upload-file', $file.FullName,
                '--url', "$destination$encodedPath"
            )
        }
        if ($needsImageState) {
            Write-ImageState -Complete $true
        }
        Write-Host "Upload complete: $($filesToUpload.Count) files; $($unchangedImages.Count) unchanged images skipped. No remote files were deleted."
    }
    finally {
        if ($null -ne $imageStatePath) {
            [IO.File]::Delete($imageStatePath)
        }
    }
}

Export-ModuleMember -Function Get-FtpsDestination, Send-FtpsDirectory
