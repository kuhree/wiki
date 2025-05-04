---
draft: 
aliases: 
date: 2025-04-26
updated: 2025-05-02
tags:
  - post
  - tools/restic
up: 
jump: 
down:
---

## Goal

Create a backup solution using restic that's reliable, secure, and automated.

- A desktop-turned-server (debian) with ~10TB of storage
- An offsite raspberry pi (dietpi) with a USB external HDD (3.5TB)
- An account with Backblaze B2 for s3-compatible storage

- `Server -> Pi` - Offsite backup for things I could lose without crying
- `Server -> B2` - Cloud backups for things I absolutely cannot lose

All credentials and things necessary to restore/recover/move this setup will be stored in Bitwarden.

## Context

On the server I have two directories I care about with the following structure:

> [!note]
> - (^) = Wanted -> Pi
> - (*) = Critical -> Pi and B2

1. `/zpool1/`
	- `archive/` ^
	- `library/`
		- `books/` ^
		- `books-comics/`
		- `games/`
		- `immich/` *
		- `isos/`
		- `manual/`
		- `movies/`
		- `music/` ^
		- `recordings/` *
		- `software/`
		- `tv/`
2. `/srv/docker/` *
	- `<service-name>/`
		- `data/`
		- `config/`
		- `…`

## Solution

1. Install restic.
2. Configure restic to access the PI and B2.
	- Use a password file for security
	- Access the Pi over SSH (Tailscale) and restic's SFTP backend.
	- Access B2 using restic's s3-compatible backend.
3. Create repo(s) on the Pi and in B2.
	- One for `library`
	- One for `archive`
	- One for `docker`
4. Create script(s) to automate the process of backing up and reporting.
	- Requirements
		- Configurable variables
		- Error-handling
		- Log file
	- Structure
		- A configuration file with paths and settings
		- A primary backup script that sources this config
		- A separate cleanup script
	- Restic
		- Use`--exclude` and/or `--files-from` to save space
		- Use `check` and `prune` to verify/clean up snapshots
	- Notifications to NTFY (using email or NTFY API)
5. Automate the script(s) to run on it's own

## References

- [Restic Documentation](https://restic.readthedocs.io/en/stable/)
	- [Restic SFTP Setup](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#sftp)
	- [Restic B2 Setup](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#backblaze-b2)
		- [Restic S3-Compatible Setup](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#s3-compatible-storage)
		- [S3-Compatible App Keys](https://www.backblaze.com/docs/cloud-storage-s3-compatible-app-keys)

---

## Log

### Installation

#### Install Restic on the server

```bash
sudo apt update # Update package lists
sudo apt install restic # Install restic

###

restic version # Confirm installation
> restic 0.14.0 compiled with go1.19.8 on linux/amd64
```

### Configuration

#### Configure server/restic to access the Pi and B2

```bash
# On the server, create directory for configuring restic
sudo mkdir -p /opt/restic/{.secrets,scripts,systemd}
sudo chown -R $UID:$GID /opt/restic
sudo chmod -R 600 /opt/restic/.secrets
sudo chmod -R 700 /opt/restic/{scripts,systemd}

# Create password file
bash -c 'echo "YourSuperSecretPasswrod" > /opt/restic/.secrets/password'
```

#### Configure SSH access to the Pi

```bash
# Generate a specific SSH key for restic use
# Use defaults, no password, 
# Save the file in `/opt/restic/config/ssh`
ssh-keygen -t ed25519 -C "restic@srv01"

# Copy the key to the Pi
ssh-copy-id <user>@<pi-tailscale-ip>

# Confirm SSH connection
ssh <user>@<pi-tailscale-ip>
```

#### Configure B2 S3-compatible storage

Create [S3-Compatible App Keys](https://www.backblaze.com/docs/cloud-storage-s3-compatible-app-keys) using [Cloud Storage Application Keys](https://www.backblaze.com/docs/cloud-storage-application-keys)

```bash
# Store B2 credentials

# For restic's Amazon S3 backend with B2 S3-compatible API (recommended)
bash -c 'echo "<b2-app-key>" > /opt/restic/.secrets/s3-access-key-id'
bash -c 'echo "<b2-key-id>" > /opt/restic/.secrets/s3-secret-access-key'
chmod 600 /opt/restic/.secrets/s3*
```

### Initialize Repos

```bash
# Initialize a repo on the Pi
restic -r sftp:<user>@<pi-tailscale-ip>:/path/to/backups/<repo-name> --password-file /opt/restic/config/password init

# Verify creation
restic -r sftp:<user>@<pi-tailscale-ip>:/path/to/backups/<repo-name> --password-file /opt/restic/config/password snapshots


# Initialize a repo on B2
source /opt/restic/config/b2-env-s3
export RESTIC_PASSWORD_FILE=/opt/restic/config/password # another way to set the password file
restic -r s3:s3.<region>.backblazeb2.com/<bucket>/<repo> init
```

### Scripting

I've gone a bit overboard with the script, but here are the important parts:

There are two (2) main operation that we want to have happen:

1. Back up important folders
2. Clean and maintain the backups

#### Backing up important folders

```bash
# initialize repository if it doesn't exist
repo_init() {
  local repo="$1"
  log "Initializing repository: $repo"

  if restic -r "$repo" snapshots &>/dev/null; then
    log "Repository exists!"
    return 0
  fi

  restic \
    -r "$repo" \
    --password-file "$RESTIC_PASSWORD_FILE" \
    init

  return $?
}

# unlock repository
repo_unlock() {
  local repo="$1"
  log "Unlocking repository: $repo"

  restic \
    -r "$repo" \
    --password-file "$RESTIC_PASSWORD_FILE" \
    unlock

  return $?
}


# perform backup to a specific repository
repo_backup() {
  local repo="$1"
  local path="$2"

  log "Running backup: $repo $path"

  # check if path exists
  if [[ ! -d "$path" && ! -f "$path" ]]; then
    log "Path $path does not exist or is not accessible"
    return 1
  fi

  # run the backup
  restic \
    -r "$repo" \
    --cleanup-cache \
    backup "$path" \
    --one-file-system \
    --compression max

  return $?
}
```

Where we might use these functions like this:

```bash
local repo="s3:https://s3.us-east-005.backblazeb2.com/<repo>"

repo_init "$repo" || handle_error "Initialization failed for $path in $repo"
repo_unlock "$repo" || handle_error "Unlock failed for $path in $repo"
repo_backup "$repo" "$path" || handle_error "Backup failed for $path in $repo"
```

#### Clean and maintain the backups

```bash
# check repository integrity
repo_check() {
  local repo="$1"
  log "Checking repository integrity: $repo"

  restic \
    -r "$repo" \
    check

  return $?
}

# prune old backups according to retention policy
repo_prune() {
  local repo="$1"
  log "Pruning repository: $repo"

  restic \
    -r "$repo" \
    forget \
    --keep-daily "$RETENTION_KEEP_DAILY" \
    --keep-weekly "$RETENTION_KEEP_WEEKLY" \
    --keep-monthly "$RETENTION_KEEP_MONTHLY" \
    --keep-yearly "$RETENTION_KEEP_YEARLY" \
    --prune

  return $?
}
```

Where we might use them like this:

```bash
local repo="s3:https://s3.us-east-005.backblazeb2.com/<repo>"

repo_init "$repo" || handle_error "Initialization failed for $path in $repo"
repo_unlock "$repo" || handle_error "Unlock failed for $path in $repo"
repo_check "$repo" || handle_error "Repository check failed for $repo"
repo_prune "$repo" || handle_error "Repository prune failed for $repo"
```

### Automating the script

#### Systemd Service

```systemd
[Unit]
Description=Restic Backup Service
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/opt/restic
ExecStart=/opt/restic/scripts/backup.sh
User=root
Group=root
Nice=19
IOSchedulingClass=idle
IOSchedulingPriority=7
CPUSchedulingPolicy=idle
EnvironmentFile=-/etc/default/restic
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=21600
Restart=on-failure
RestartSec=15min

# Security sandboxing
ProtectSystem=full
PrivateTmp=true
ProtectHome=read-only
ProtectControlGroups=true
ProtectKernelTunables=true
ProtectKernelModules=true
PrivateDevices=true
RestrictRealtime=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

#### Systemd Timer

```systemd
[Unit]
Description=Run restic backup daily

[Timer]
# Run at 1 AM every day
OnCalendar=*-*-* 01:00:00
AccuracySec=1m
Persistent=true
RandomizedDelaySec=1800

[Install]
WantedBy=timers.target
```
